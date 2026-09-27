// Demarrage du serveur VitiAero : base, API, taches planifiees.
//   - envoi des e-mails en attente, toutes les 30 secondes ;
//   - purge des donnees arrivees a echeance, au demarrage puis chaque jour ;
//   - sauvegarde chiffree et verifiee, chaque jour (si BACKUP_DIR est defini).
// Variables d'environnement : docs/EXPLOITATION.md.
import { initDb, closeDb, exportDb, getUploadDir, setState } from './db.js';
import { createApp } from './app.js';
import { createMailer, processOutbox } from './mail.js';
import { createRouter } from './routing.js';
import { runRetention } from './privacy.js';
import { createBackup, verifyBackup, pruneBackups, parseBackupKey } from './backup.js';
import { business } from '../shared/business.js';
import { launchStatus } from '../shared/launch.js';
import { log } from './log.js';

const env = process.env;
// Port : --port=XXXX en priorite ("npm run dev" le fixe a 3001, aligne sur le
// proxy de Vite), sinon PORT (hebergeur), sinon 3001.
const argPort = process.argv.find((a) => a.startsWith('--port='))?.split('=')[1];
const PORT = Number(argPort || env.PORT || 3001);
const inProduction = env.NODE_ENV === 'production';
const DAY = 24 * 60 * 60 * 1000;

function backupConfig() {
  if (!env.BACKUP_DIR) return null;
  return { dir: env.BACKUP_DIR, key: parseBackupKey(env.BACKUP_KEY) };
}

async function main() {
  await initDb();
  const mailer = createMailer(env);
  const router = createRouter(env);
  const backup = backupConfig();
  const app = createApp({ mailer, router, business, env, backup });

  // Avertissements utiles des le demarrage (sans donnee personnelle).
  const status = launchStatus(business);
  log.info('startup', {
    environment: inProduction ? 'production' : env.NODE_ENV || 'development',
    launchReady: status.ready,
    blockers: status.blockers.length,
    mail: mailer.mode,
    routing: router.mode,
    backups: backup ? 'active' : 'inactive',
  });
  if (inProduction && env.ALLOW_PRELAUNCH_SUBMISSIONS === '1') {
    log.warn('prelaunch.submissions.open', { hint: 'ALLOW_PRELAUNCH_SUBMISSIONS=1 : reserve a un serveur de test, jamais au site public.' });
  }
  if (inProduction && mailer.mode === 'disabled') log.warn('mail.disabled', { hint: 'Definir SMTP_HOST et MAIL_FROM pour envoyer les accuses de reception.' });
  if (inProduction && !backup) log.warn('backup.disabled', { hint: 'Definir BACKUP_DIR et BACKUP_KEY.' });

  // Envoi des e-mails en attente.
  const replyTo = business.identity?.email || null;
  let sending = false;
  const outboxTimer = setInterval(async () => {
    if (sending) return;
    sending = true;
    try { await processOutbox(mailer, { replyTo }); } catch (err) { log.error('mail.loop', { error: String(err.message).slice(0, 120) }); }
    sending = false;
  }, 30 * 1000);

  // Purge quotidienne des donnees arrivees a echeance.
  const retention = () => {
    try {
      const result = runRetention(business.retention);
      setState('retention.lastRun', new Date().toISOString());
      setState('retention.lastSummary', JSON.stringify(result));
    } catch (err) {
      log.error('retention.failed', { error: String(err.message).slice(0, 120) });
    }
  };
  retention();
  const retentionTimer = setInterval(retention, DAY);

  // Sauvegarde quotidienne, relue apres ecriture.
  const doBackup = () => {
    if (!backup) return;
    try {
      const out = createBackup({ backupDir: backup.dir, key: backup.key, dbBuffer: exportDb(), uploadDir: getUploadDir() });
      const check = verifyBackup({ dir: out.dir, key: backup.key });
      if (!check.ok) throw new Error(check.error);
      pruneBackups({ backupDir: backup.dir, keepDays: business.retention?.backupsDays });
      setState('backup.lastRun', new Date().toISOString());
      setState('backup.lastError', '');
      log.info('backup.done', { files: out.files });
    } catch (err) {
      setState('backup.lastError', String(err.message).slice(0, 200));
      log.error('backup.failed', { error: String(err.message).slice(0, 200) });
    }
  };
  doBackup();
  const backupTimer = setInterval(doBackup, DAY);

  const server = app.listen(PORT, () => log.info('listening', { port: PORT }));

  // Arret propre : on termine les requetes en cours et on ecrit la base.
  const stop = (signal) => {
    log.info('shutdown', { signal });
    clearInterval(outboxTimer);
    clearInterval(retentionTimer);
    clearInterval(backupTimer);
    server.close(() => {
      closeDb();
      process.exit(0);
    });
    setTimeout(() => { closeDb(); process.exit(0); }, 5000).unref();
  };
  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
}

main().catch((err) => {
  log.error('startup.failed', { error: String(err?.message || err).slice(0, 300) });
  process.exit(1);
});
