// Cycle de vie des donnees : conservation limitee, e-mails en file d'attente,
// sauvegardes chiffrees (creation, controle, alteration detectee, restauration).
import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { all, get, run, exportDb, getUploadDir } from '../server/db.js';
import { runRetention } from '../server/privacy.js';
import { enqueue, processOutbox, outboxStats, retryFailed, MAX_ATTEMPTS } from '../server/mail.js';
import {
  createBackup, verifyBackup, restoreBackup, pruneBackups, listBackups, parseBackupKey, generateBackupKey,
} from '../server/backup.js';
import { business } from '../shared/business.js';
import { openDb, tempDir } from './helpers.js';

let db;
before(async () => { db = await openDb(); });
after(() => db.close());

const NOW = new Date('2026-09-27T12:00:00Z');
const monthsAgo = (m) => { const d = new Date(NOW); d.setUTCMonth(d.getUTCMonth() - m); return d.toISOString(); };

function addEstimation(status, date) {
  const id = run(
    `INSERT INTO estimations (name, email, parcels, area_m2, status, created_at, updated_at, lang)
     VALUES (?,?,?,?,?,?,?,?)`,
    ['Retention Test', 'retention@example.ch', '[]', 1000, status, date, date, 'fr']
  );
  run('INSERT INTO consents (record_type, record_id, purpose, document, version, accepted_at) VALUES (?,?,?,?,?,?)',
    ['estimation', id, 'estimation', 'privacy', '2026-09-27', date]);
  return id;
}

describe('conservation limitee', () => {
  test('demandes sans suite et dossiers de contrat : durees de shared/business.js', () => {
    const oldOpen = addEstimation('Nouvelle', monthsAgo(25));
    const recentOpen = addEstimation('En etude', monthsAgo(3));
    const contract = addEstimation('Acceptee', monthsAgo(36));
    const veryOldContract = addEstimation('Acceptee', monthsAgo(12 * 11));
    fs.mkdirSync(getUploadDir(), { recursive: true });
    const fileId = `${'a'.repeat(32)}.png`;
    fs.writeFileSync(path.join(getUploadDir(), fileId), 'x');
    const msg = run(
      'INSERT INTO messages (name, email, message, status, created_at, updated_at, kind, files) VALUES (?,?,?,?,?,?,?,?)',
      ['Retention Test', 'retention@example.ch', 'ancien', 'Traité', monthsAgo(30), monthsAgo(30), 'devis', JSON.stringify([{ id: fileId, name: 'p.png' }])]
    );

    const { summary, skipped } = runRetention(business.retention, NOW);
    const ids = all('SELECT id FROM estimations').map((r) => r.id);
    assert.ok(!ids.includes(oldOpen), 'demande sans suite de plus de 24 mois supprimee');
    assert.ok(ids.includes(recentOpen));
    assert.ok(ids.includes(contract), 'dossier lie a un contrat conserve');
    assert.ok(!ids.includes(veryOldContract), 'dossier de plus de 10 ans supprime');
    assert.equal(get('SELECT id FROM messages WHERE id = ?', [msg]), null);
    assert.equal(fs.existsSync(path.join(getUploadDir(), fileId)), false, 'piece jointe supprimee du disque');
    assert.equal(get('SELECT COUNT(*) AS n FROM consents WHERE record_type = ? AND record_id = ?', ['estimation', oldOpen]).n, 0);
    assert.ok(summary.estimations >= 2);
    // Durees non fournies : jamais remplacees par une valeur inventee.
    for (const k of ['attachmentsMonths', 'inactiveAccountsMonths']) assert.ok(skipped.includes(k), k);
  });

  test('comptes inactifs et pieces jointes : purges des que la duree est fournie', () => {
    const userId = run('INSERT INTO users (name, email, password, role, created_at, last_login_at) VALUES (?,?,?,?,?,?)',
      ['Inactif', 'inactif@example.ch', 'x', 'client', monthsAgo(50), monthsAgo(40)]);
    const { skipped } = runRetention({ ...business.retention, inactiveAccountsMonths: 36, attachmentsMonths: 12 }, NOW);
    assert.equal(get('SELECT id FROM users WHERE id = ?', [userId]), null);
    assert.ok(!skipped.includes('inactiveAccountsMonths'));
    assert.ok(get("SELECT id FROM users WHERE role = 'admin'"), 'le compte de l\'equipe n\'est jamais purge');
  });
});

describe('e-mails : file d\'attente et nouvelles tentatives', () => {
  test('echec du serveur d\'envoi : nouvel essai differe, puis abandon signale', async () => {
    run('DELETE FROM outbox');
    let calls = 0;
    const failing = { mode: 'smtp', send: async () => { calls += 1; const e = new Error('refus'); e.responseCode = 421; throw e; } };
    enqueue({ to: 'file@example.ch', subject: 'Sujet', text: 'Texte', now: NOW });
    let t = NOW.getTime();
    for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
      t += 7 * 60 * 60 * 1000; // au-dela du plus long delai d'attente
      await processOutbox(failing, { now: new Date(t) });
    }
    assert.equal(calls, MAX_ATTEMPTS);
    assert.deepEqual(outboxStats(), { pending: 0, failed: 1 });
    const row = get('SELECT * FROM outbox');
    assert.equal(row.last_error, 'SMTP 421'); // aucun detail personnel dans l'erreur
    retryFailed(new Date(t));
    const ok = { mode: 'memory', sent: [], send: async (m) => { ok.sent.push(m); } };
    await processOutbox(ok, { now: new Date(t + 1000), replyTo: 'contact@vitiaero.ch' });
    assert.equal(ok.sent.length, 1);
    assert.equal(ok.sent[0].replyTo, 'contact@vitiaero.ch');
    assert.deepEqual(outboxStats(), { pending: 0, failed: 0 });
  });

  test('envoi desactive : les messages restent en attente, rien n\'est perdu', async () => {
    enqueue({ to: 'attente@example.ch', subject: 'S', text: 'T', now: NOW });
    const r = await processOutbox({ mode: 'disabled' }, { now: NOW });
    assert.equal(r.skipped, true);
    assert.equal(outboxStats().pending, 1);
    run('DELETE FROM outbox');
  });

  test('adresse invalide : rien n\'est mis en file', () => {
    assert.equal(enqueue({ to: 'pas-une-adresse', subject: 'S', text: 'T' }), null);
  });
});

describe('sauvegardes chiffrees', () => {
  const key = parseBackupKey(generateBackupKey());
  let backupDir;
  let upload;
  before(() => {
    backupDir = tempDir('vitiaero-backup-');
    upload = tempDir('vitiaero-uploads-');
    fs.writeFileSync(path.join(upload, `${'b'.repeat(32)}.pdf`), '%PDF-1.4 test');
  });
  after(() => {
    fs.rmSync(backupDir, { recursive: true, force: true });
    fs.rmSync(upload, { recursive: true, force: true });
  });

  test('creation, controle et restauration a l\'identique', () => {
    const dbBuffer = exportDb();
    const out = createBackup({ backupDir, key, dbBuffer, uploadDir: upload, now: NOW });
    assert.equal(verifyBackup({ dir: out.dir, key }).ok, true);
    // Rien n'est lisible en clair dans la sauvegarde.
    const raw = fs.readFileSync(path.join(out.dir, 'db.sqlite.enc'));
    assert.equal(raw.includes(Buffer.from('SQLite format')), false);

    const target = path.join(tempDir('vitiaero-restore-'), 'data');
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, 'app.sqlite'), 'ancienne base');
    const res = restoreBackup({ dir: out.dir, key, dataDir: target, now: NOW });
    assert.ok(fs.readFileSync(path.join(target, 'app.sqlite')).equals(dbBuffer));
    assert.equal(fs.readFileSync(path.join(target, 'uploads', `${'b'.repeat(32)}.pdf`), 'utf8'), '%PDF-1.4 test');
    assert.equal(fs.readFileSync(path.join(res.previous, 'app.sqlite'), 'utf8'), 'ancienne base', 'anciennes donnees gardees');
  });

  test('sauvegarde alteree, fichier echange ou mauvaise cle : detecte', () => {
    const out = createBackup({ backupDir, key, dbBuffer: exportDb(), uploadDir: upload, now: new Date(NOW.getTime() + 1000) });
    assert.equal(verifyBackup({ dir: out.dir, key: parseBackupKey(generateBackupKey()) }).ok, false);
    const file = path.join(out.dir, 'db.sqlite.enc');
    const data = fs.readFileSync(file);
    data[data.length - 1] ^= 0xff;
    fs.writeFileSync(file, data);
    assert.equal(verifyBackup({ dir: out.dir, key }).ok, false);
    const target = path.join(tempDir('vitiaero-restore-'), 'data');
    assert.throws(() => restoreBackup({ dir: out.dir, key, dataDir: target }));
    assert.equal(fs.existsSync(target), false, 'aucune ecriture si la sauvegarde est invalide');
  });

  test('cle : 32 octets exiges', () => {
    assert.throws(() => parseBackupKey(''), /manquante/);
    assert.throws(() => parseBackupKey('abcd'), /32 octets/);
    assert.equal(parseBackupKey('0'.repeat(64)).length, 32);
  });

  test('anciennes sauvegardes supprimees, la plus recente toujours gardee', () => {
    const dir = tempDir('vitiaero-prune-');
    for (const days of [40, 20, 1]) {
      createBackup({ backupDir: dir, key, dbBuffer: Buffer.from('x'), now: new Date(NOW.getTime() - days * 86400000) });
    }
    assert.equal(pruneBackups({ backupDir: dir, keepDays: 30, now: NOW }), 1);
    assert.equal(listBackups(dir).length, 2);
    assert.equal(pruneBackups({ backupDir: dir, keepDays: null, now: NOW }), 0, 'duree non fournie : rien n\'est supprime');
    assert.equal(pruneBackups({ backupDir: dir, keepDays: 0.001, now: new Date(NOW.getTime() + 365 * 86400000) }), 1);
    assert.equal(listBackups(dir).length, 1);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('commande npm run backup : sauvegarde creee et verifiee sans ouvrir la base en ecriture', () => {
    const dataDir = tempDir('vitiaero-cli-');
    fs.writeFileSync(path.join(dataDir, 'app.sqlite'), exportDb());
    const before = fs.statSync(path.join(dataDir, 'app.sqlite')).mtimeMs;
    const dir = tempDir('vitiaero-cli-backup-');
    const env = { ...process.env, DATA_DIR: dataDir, BACKUP_DIR: dir, BACKUP_KEY: generateBackupKey() };
    const out = execFileSync(process.execPath, ['server/backup-cli.js'], { env, encoding: 'utf8' });
    assert.match(out, /creee et verifiee/);
    const verify = execFileSync(process.execPath, ['server/backup-cli.js', '--verify'], { env, encoding: 'utf8' });
    assert.match(verify, /Sauvegarde valide/);
    assert.equal(fs.statSync(path.join(dataDir, 'app.sqlite')).mtimeMs, before);
    fs.rmSync(dataDir, { recursive: true, force: true });
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
