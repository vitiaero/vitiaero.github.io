// Tests fonctionnels des formulaires et de l'API, sur une base temporaire.
// Aucun e-mail n'est envoye : le transport "memory" garde les messages.
import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { all, get, getUploadDir } from '../server/db.js';
import { processOutbox } from '../server/mail.js';
import { currentVersion } from '../shared/legal/current.js';
import { PARCEL, PNG_1PX, consentFor, loginAdmin, openDb, startApp } from './helpers.js';

let db;
let s;
before(async () => {
  db = await openDb();
  s = await startApp();
});
after(async () => {
  await s.close();
  db.close();
});

async function flushMail() {
  const before = s.mailer.sent.length;
  await processOutbox(s.mailer, { now: new Date(Date.now() + 1000) });
  return s.mailer.sent.slice(before);
}

describe('etat du service et en-tetes', () => {
  test('sante : base, lancement et versions des documents', async () => {
    const r = await s.api('GET', '/api/health');
    assert.equal(r.status, 200);
    assert.equal(r.data.status, 'ok');
    assert.equal(r.data.launchReady, false);
    assert.equal(r.data.policies.privacy, currentVersion('privacy'));
    assert.equal(r.headers.get('cache-control'), 'no-store');
    assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.match(r.headers.get('content-security-policy'), /default-src 'none'/);
  });

  test('pages du site en pre-lancement : non indexables', async () => {
    const robots = await fetch(`${s.base}/robots.txt`);
    assert.equal(robots.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.match(await robots.text(), /Disallow: \//);
    const sitemap = await fetch(`${s.base}/sitemap.xml`);
    assert.equal(sitemap.status, 404);
  });
});

describe('pre-lancement en production : formulaires refuses par le serveur', () => {
  let prod;
  before(async () => { prod = await startApp({ env: { NODE_ENV: 'production' } }); });
  after(async () => { await prod.close(); });

  const forms = [
    ['/api/estimations', { name: 'A', email: 'a@example.ch', parcels: [{ points: PARCEL }], consent: consentFor() }],
    ['/api/contact', { name: 'A', email: 'a@example.ch', message: 'Bonjour', consent: consentFor() }],
    ['/api/quote', { name: 'A', email: 'a@example.ch', commune: 'Lutry', consent: consentFor() }],
    ['/api/auth/register', { name: 'A', email: 'a@example.ch', password: 'motdepasse1', consent: consentFor(['privacy', 'terms']) }],
    ['/api/promo/validate', { code: 'TEST' }],
  ];
  for (const [url, body] of forms) {
    test(`${url} : 503, rien n'est enregistre`, async () => {
      const count = all('SELECT id FROM messages').length + all('SELECT id FROM estimations').length;
      const r = await prod.api('POST', url, body);
      assert.equal(r.status, 503);
      assert.equal(r.data.error, 'Service pas encore ouvert.');
      assert.equal(all('SELECT id FROM messages').length + all('SELECT id FROM estimations').length, count);
    });
  }

  test('la connexion de l\'equipe reste possible (administration)', async () => {
    const token = await loginAdmin(prod.api);
    const r = await prod.api('GET', '/api/admin/system', undefined, token);
    assert.equal(r.status, 200);
    assert.equal(r.data.launch.ready, false);
    assert.ok(r.data.launch.blockers.length > 10);
    assert.equal(r.data.acceptingSubmissions, false);
  });
});

describe('demande d\'estimation', () => {
  const body = (extra = {}) => ({
    name: 'Client Test', email: 'client.test@example.ch', commune: 'Lutry', passes: 3,
    parcels: [{ points: PARCEL }], lang: 'de', consent: consentFor(), ...extra,
  });

  test('sans confirmation de lecture : refusee', async () => {
    const r = await s.api('POST', '/api/estimations', body({ consent: undefined }));
    assert.equal(r.status, 400);
    assert.equal(r.data.error, 'Merci de confirmer avoir lu la politique de confidentialite.');
  });

  test('version de politique inconnue : la page doit etre rechargee', async () => {
    const r = await s.api('POST', '/api/estimations', body({ consent: { privacy: '2000-01-01' } }));
    assert.equal(r.status, 409);
  });

  test('sans parcelle valide : refusee', async () => {
    const r = await s.api('POST', '/api/estimations', body({ parcels: [{ points: [[0, 0], [1, 1], [2, 2]] }] }));
    assert.equal(r.status, 400);
  });

  test('envoyee : estimation recalculee, preuve de lecture enregistree, e-mails "pas une commande"', async () => {
    const r = await s.api('POST', '/api/estimations', body({ passes: 3, estimate: { totalMin: 1 } }));
    assert.equal(r.status, 200);
    assert.ok(r.data.id > 0);
    assert.ok(r.data.estimate.totalMin > 100, 'le prix envoye par le navigateur est ignore');
    assert.equal(r.data.estimate.travel.approximate, true); // distance a vol d'oiseau

    const row = get('SELECT * FROM estimations WHERE id = ?', [r.data.id]);
    assert.equal(row.lang, 'de');
    assert.equal(row.status, 'Nouvelle');
    const proof = all('SELECT * FROM consents WHERE record_type = ? AND record_id = ?', ['estimation', r.data.id]);
    assert.equal(proof.length, 1);
    assert.equal(proof[0].document, 'privacy');
    assert.equal(proof[0].version, currentVersion('privacy'));
    assert.equal(proof[0].purpose, 'estimation');
    assert.match(proof[0].accepted_at, /^\d{4}-\d{2}-\d{2}T/);

    const mails = await flushMail();
    const ack = mails.find((m) => m.to === 'client.test@example.ch');
    assert.ok(ack, 'accuse de reception envoye au client');
    assert.match(ack.text, /keine Bestellung/); // dans la langue du visiteur
    assert.match(ack.subject, new RegExp(`${r.data.id}`));
    const team = mails.find((m) => m.to === 'contact@vitiaero.ch');
    assert.ok(team, 'notification a l\'equipe');
    assert.doesNotMatch(team.text, /client\.test@example\.ch/); // donnees minimales
    assert.equal(all('SELECT id FROM outbox').length, 0, 'aucune copie gardee apres envoi');
  });

  test('champ piege rempli : reponse neutre, rien n\'est enregistre', async () => {
    const before = all('SELECT id FROM estimations').length;
    const r = await s.api('POST', '/api/estimations', body({ website: 'http://spam.example' }));
    assert.equal(r.status, 200);
    assert.equal(all('SELECT id FROM estimations').length, before);
  });
});

describe('contact et demande de devis', () => {
  test('message de contact : enregistre avec sa preuve de lecture, accuse de reception', async () => {
    const r = await s.api('POST', '/api/contact', {
      name: 'Personne Test', email: 'contact.test@example.ch', message: 'Question', lang: 'en', consent: consentFor(),
    });
    assert.equal(r.status, 200);
    const proof = get('SELECT * FROM consents WHERE record_type = ? AND record_id = ?', ['message', r.data.id]);
    assert.equal(proof.purpose, 'contact');
    const mails = await flushMail();
    const ack = mails.find((m) => m.to === 'contact.test@example.ch');
    assert.match(ack.text, /Hello Personne Test/);
  });

  test('devis avec photo : fichier verifie, stocke hors du site, preuve de lecture', async () => {
    const r = await s.api('POST', '/api/quote', {
      name: 'Domaine Test', email: 'devis.test@example.ch', commune: 'Epesses', area_ha: '1,5', passes: 2, lang: 'fr',
      consent: consentFor(), files: [{ name: 'parcelle.png', type: 'image/png', data: `data:image/png;base64,${PNG_1PX}` }],
    });
    assert.equal(r.status, 200);
    const row = get('SELECT * FROM messages WHERE id = ?', [r.data.id]);
    assert.equal(row.kind, 'devis');
    assert.equal(row.area_ha, 1.5);
    const files = JSON.parse(row.files);
    assert.equal(files.length, 1);
    assert.ok(fs.existsSync(path.join(getUploadDir(), files[0].id)));
    const mails = await flushMail();
    assert.match(mails.find((m) => m.to === 'devis.test@example.ch').text, /pas une commande/);
  });

  test('fichier deguise (type annonce faux) : refuse, rien n\'est ecrit', async () => {
    const before = fs.existsSync(getUploadDir()) ? fs.readdirSync(getUploadDir()).length : 0;
    const r = await s.api('POST', '/api/quote', {
      name: 'Domaine Test', email: 'devis.test@example.ch', commune: 'Epesses', consent: consentFor(),
      files: [{ name: 'photo.jpg', type: 'image/jpeg', data: PNG_1PX }],
    });
    assert.equal(r.status, 400);
    assert.equal(r.data.error, 'Format de fichier non accepte.');
    assert.equal(fs.readdirSync(getUploadDir()).length, before);
  });
});

describe('compte client : inscription, export, suppression', () => {
  let token;
  test('inscription : lecture de la politique et des conditions d\'utilisation enregistree', async () => {
    const missing = await s.api('POST', '/api/auth/register', {
      name: 'Compte Test', email: 'compte.test@example.ch', password: 'motdepasse1', consent: consentFor(['privacy']),
    });
    assert.equal(missing.status, 400);
    const r = await s.api('POST', '/api/auth/register', {
      name: 'Compte Test', email: 'compte.test@example.ch', password: 'motdepasse1', lang: 'fr', consent: consentFor(['privacy', 'terms']),
    });
    assert.equal(r.status, 200);
    token = r.data.token;
    const proofs = all('SELECT document, purpose FROM consents WHERE record_type = ? AND record_id = ? ORDER BY document', ['user', r.data.user.id]);
    assert.deepEqual(proofs.map((p) => p.document), ['privacy', 'terms']);
    assert.ok(proofs.every((p) => p.purpose === 'compte'));
  });

  test('demande envoyee connectee : rattachee au compte', async () => {
    const r = await s.api('POST', '/api/estimations', {
      name: 'Compte Test', email: 'compte.test@example.ch', parcels: [{ points: PARCEL }], consent: consentFor(),
    }, token);
    assert.equal(r.status, 200);
    assert.equal(r.data.connected, true);
  });

  test('export des donnees du compte (JSON)', async () => {
    const r = await s.api('GET', '/api/account/export', undefined, token);
    assert.equal(r.status, 200);
    assert.match(r.headers.get('content-disposition'), /attachment/);
    assert.equal(r.data.account.email, 'compte.test@example.ch');
    assert.equal(r.data.estimations.length, 1);
    assert.ok(r.data.consents.length >= 3);
    assert.equal(r.data.account.password, undefined);
  });

  test('suppression : mot de passe exige, puis tout est efface et un e-mail le confirme', async () => {
    const wrong = await s.api('DELETE', '/api/account', { password: 'faux-mot-de-passe' }, token);
    assert.equal(wrong.status, 401);
    const r = await s.api('DELETE', '/api/account', { password: 'motdepasse1' }, token);
    assert.equal(r.status, 200);
    assert.equal(get('SELECT id FROM users WHERE email = ?', ['compte.test@example.ch']), null);
    assert.equal(all('SELECT id FROM estimations WHERE email = ?', ['compte.test@example.ch']).length, 0);
    const me = await s.api('GET', '/api/auth/me', undefined, token);
    assert.equal(me.status, 401);
    const mails = await flushMail();
    assert.ok(mails.some((m) => m.to === 'compte.test@example.ch'));
    const log = all('SELECT * FROM privacy_log');
    assert.ok(log.some((l) => l.action === 'erase'));
    assert.ok(log.every((l) => !l.summary.includes('@')), 'le journal ne contient aucune adresse');
  });
});

describe('demandes LPD traitees par l\'equipe', () => {
  test('recherche, export puis effacement par adresse e-mail', async () => {
    const token = await loginAdmin(s.api);
    const found = await s.api('GET', '/api/admin/privacy/lookup?email=devis.test@example.ch', undefined, token);
    assert.equal(found.status, 200);
    assert.equal(found.data.messages, 1);
    assert.equal(found.data.attachments, 1);
    const data = await s.api('GET', '/api/admin/privacy/export?email=devis.test@example.ch', undefined, token);
    assert.equal(data.data.messages[0].attachments[0].name, 'parcelle.png');
    const fileId = JSON.parse(get('SELECT files FROM messages WHERE email = ?', ['devis.test@example.ch']).files)[0].id;
    const erased = await s.api('POST', '/api/admin/privacy/erase', { email: 'devis.test@example.ch' }, token);
    assert.equal(erased.status, 200);
    assert.equal(erased.data.summary.messages, 1);
    assert.equal(fs.existsSync(path.join(getUploadDir(), fileId)), false, 'piece jointe supprimee du disque');
    assert.equal(all('SELECT id FROM messages WHERE email = ?', ['devis.test@example.ch']).length, 0);
  });

  test('un compte de l\'equipe ne peut pas etre efface par ce biais', async () => {
    const token = await loginAdmin(s.api);
    const r = await s.api('POST', '/api/admin/privacy/erase', { email: 'admin@vitiaero.ch' }, token);
    assert.equal(r.status, 400);
  });

  test('administration interdite sans connexion d\'equipe', async () => {
    const r = await s.api('GET', '/api/admin/privacy/lookup?email=x@example.ch');
    assert.equal(r.status, 403);
  });
});
