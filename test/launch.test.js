// Porte de lancement : le site reste en pre-lancement tant qu'une information
// obligatoire manque, et s'ouvre quand tout est reellement renseigne.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { business } from '../shared/business.js';
import { launchStatus, isText, credentialState, validCredentials, REQUIRED_CREDENTIALS } from '../shared/launch.js';
import { completeBusiness, confirmedMedia, prelaunchBusiness } from './fixtures/complete-business.js';

const TODAY = new Date('2026-09-27T12:00:00Z');

test('entreprise fictive (PAE au CPNV) : jamais lancee, pages completes', () => {
  assert.equal(business.fictional, true);
  const s = launchStatus(business, { today: TODAY });
  assert.equal(s.ready, false);
  // Seuls restent : le mode fictif lui-meme et ce qui ne s'invente pas
  // (autorisations, droits, relecture, signature, domaine, hebergeur confirme).
  assert.deepEqual(s.blockers.map((b) => b.id).sort(), [
    'credentials.agroscope-model-approval', 'credentials.cantonal-spray-requirements',
    'credentials.foca-spray-authorisation', 'credentials.pilot-competence', 'credentials.pph-permit',
    'credentials.sprayer-inspection', 'credentials.uas-operator-registration',
    'fictional', 'launchChecklistSignedOn', 'legalReview', 'media.fpv-epesses', 'media.logo',
    'services.siteHosting', 'site.domain',
  ]);
  // Aucun justificatif invente.
  assert.deepEqual(business.credentials, []);
});

test('entreprise fictive : jamais « prete », meme si tout est rempli', () => {
  const b = completeBusiness();
  b.fictional = true;
  const s = launchStatus(b, { today: TODAY, media: confirmedMedia() });
  assert.equal(s.ready, false);
  assert.deepEqual(s.blockers.map((x) => x.id), ['fictional']);
});

test('entreprise reelle sans information : pre-lancement complet', () => {
  const s = launchStatus(prelaunchBusiness(), { today: TODAY });
  assert.equal(s.ready, false);
  const refs = new Set(s.blockers.map((b) => b.ref));
  for (const ref of ['A1', 'A2', 'A6', 'B4', 'C3', 'D2', 'D11', 'E1', 'E5', 'F1', 'F2', 'G1', 'G3']) {
    assert.ok(refs.has(ref), `controle ${ref} attendu parmi les blocages`);
  }
});

test('aucune valeur a completer ne passe pour une vraie donnee', () => {
  assert.equal(isText('[A REMPLACER]'), false);
  assert.equal(isText('  '), false);
  assert.equal(isText(null), false);
  assert.equal(isText('Lausanne'), true);
});

test('tout renseigne et medias confirmes : le lancement est possible', () => {
  const s = launchStatus(completeBusiness(), { today: TODAY, media: confirmedMedia() });
  assert.deepEqual(s.blockers.map((b) => b.id), []);
  assert.equal(s.ready, true);
});

test('un media sans droit confirme bloque le lancement', () => {
  const s = launchStatus(completeBusiness(), { today: TODAY });
  assert.equal(s.ready, false);
  assert.ok(s.blockers.some((b) => b.id === 'media.logo'));
});

test('un justificatif echu referme la porte, et une echeance proche est signalee', () => {
  const b = completeBusiness();
  b.credentials[0].validUntil = '2026-09-26';
  const s = launchStatus(b, { today: TODAY, media: confirmedMedia() });
  assert.equal(s.ready, false);
  assert.ok(s.blockers.some((x) => x.id === `credentials.${REQUIRED_CREDENTIALS[0].type}`));
  assert.equal(credentialState(b.credentials[0], TODAY), 'expired');
  assert.equal(validCredentials(b, TODAY).length, REQUIRED_CREDENTIALS.length - 1);

  const soon = completeBusiness();
  soon.credentials[1].validUntil = '2026-10-10';
  const w = launchStatus(soon, { today: TODAY, media: confirmedMedia() });
  assert.equal(w.ready, true);
  assert.ok(w.warnings.some((x) => x.id === `credentials.${REQUIRED_CREDENTIALS[1].type}`));
});

test('la commande en ligne ne peut pas etre activee sans parcours contractuel', () => {
  const b = completeBusiness();
  b.commercial.onlineOrdering = true;
  const s = launchStatus(b, { today: TODAY, media: confirmedMedia() });
  assert.equal(s.ready, false);
  assert.ok(s.blockers.some((x) => x.id === 'commercial.onlineOrdering'));
});

test('numero IDE et TVA : formats suisses exiges', () => {
  const b = completeBusiness();
  b.identity.uid = 'CHE-123';
  assert.equal(launchStatus(b, { today: TODAY, media: confirmedMedia() }).ready, false);
  const c = completeBusiness();
  c.identity.vat = { number: 'CHE-000.000.001', ratePercent: 8.1 };
  assert.equal(launchStatus(c, { today: TODAY, media: confirmedMedia() }).ready, false);
  const d = completeBusiness();
  d.identity.vat = false; // non assujetti : declaration explicite acceptee
  assert.equal(launchStatus(d, { today: TODAY, media: confirmedMedia() }).ready, true);
});

test('prestataire hors de Suisse : la garantie de transfert doit etre indiquee', () => {
  const b = completeBusiness();
  b.services.apiHosting = { name: 'Hebergeur Test Inc.', country: 'US' };
  assert.equal(launchStatus(b, { today: TODAY, media: confirmedMedia() }).ready, false);
  b.services.apiHosting.safeguard = 'scc';
  assert.equal(launchStatus(b, { today: TODAY, media: confirmedMedia() }).ready, true);
});
