// Envoi des e-mails : boite d'envoi en base (table outbox), traitee toutes les
// 30 secondes avec reprise en cas d'echec. Une demande est toujours enregistree,
// meme si l'envoi echoue ; l'equipe voit les echecs dans l'administration.
//
// Transport (variable MAIL_TRANSPORT) :
//   smtp     : serveur SMTP (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS)
//   memory   : messages gardes en memoire (tests automatises)
//   disabled : aucun envoi, les e-mails restent en attente (defaut sans SMTP_HOST)
import nodemailer from 'nodemailer';
import { all, run, get } from './db.js';
import { log } from './log.js';

export const MAX_ATTEMPTS = 6;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createMailer(env = process.env) {
  const mode = env.MAIL_TRANSPORT || (env.SMTP_HOST ? 'smtp' : 'disabled');
  const from = env.MAIL_FROM || '';

  if (mode === 'memory') {
    const sent = [];
    return { mode, from: from || 'test@localhost', sent, send: async (msg) => { sent.push(msg); return { messageId: `memory-${sent.length}` }; } };
  }
  if (mode === 'smtp') {
    if (!EMAIL_RE.test(from.replace(/^.*<([^>]+)>$/, '$1'))) throw new Error('MAIL_FROM doit contenir une adresse e-mail valide.');
    const secure = (env.SMTP_SECURE ?? 'true') !== 'false';
    const transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || (secure ? 465 : 587)),
      secure,
      requireTLS: !secure, // en 587, STARTTLS obligatoire : jamais d'envoi en clair
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
    return { mode, from, send: (msg) => transport.sendMail({ from, ...msg }), verify: () => transport.verify() };
  }
  return { mode: 'disabled', from, send: async () => { throw new Error('envoi desactive'); } };
}

// Met un e-mail en file d'attente. replyTo : adresse de reponse (l'equipe pour
// les accuses de reception).
export function enqueue({ recordType = null, recordId = null, to, subject, text, now = new Date() }) {
  if (!EMAIL_RE.test(String(to || ''))) return null;
  return run(
    `INSERT INTO outbox (record_type, record_id, recipient, subject, text, status, attempts, next_attempt_at, created_at)
     VALUES (?,?,?,?,?, 'pending', 0, ?, ?)`,
    [recordType, recordId, to, subject, text, now.toISOString(), now.toISOString()]
  );
}

// Delai avant la tentative suivante : 1, 5, 15, 60 minutes, puis 6 heures.
const BACKOFF_MIN = [1, 5, 15, 60, 360, 360];

// Message d'erreur sans donnee personnelle (un serveur SMTP peut citer l'adresse).
function safeError(err) {
  const code = err?.responseCode ? `SMTP ${err.responseCode}` : err?.code || 'ERREUR';
  return String(code).slice(0, 40);
}

export async function processOutbox(mailer, { now = new Date(), replyTo = null, limit = 20 } = {}) {
  if (!mailer || mailer.mode === 'disabled') return { sent: 0, failed: 0, skipped: true };
  const rows = all(
    "SELECT * FROM outbox WHERE status = 'pending' AND next_attempt_at <= ? ORDER BY id LIMIT ?",
    [now.toISOString(), limit]
  );
  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await mailer.send({ to: row.recipient, subject: row.subject, text: row.text, ...(replyTo ? { replyTo } : {}) });
      run('DELETE FROM outbox WHERE id = ?', [row.id]); // envoye : plus aucune copie gardee
      sent += 1;
    } catch (err) {
      const attempts = row.attempts + 1;
      const next = new Date(now.getTime() + BACKOFF_MIN[Math.min(attempts - 1, BACKOFF_MIN.length - 1)] * 60000);
      run(
        'UPDATE outbox SET attempts = ?, status = ?, last_error = ?, next_attempt_at = ? WHERE id = ?',
        [attempts, attempts >= MAX_ATTEMPTS ? 'failed' : 'pending', safeError(err), next.toISOString(), row.id]
      );
      failed += 1;
      log.warn('mail.failed', { attempts, error: safeError(err) });
    }
  }
  return { sent, failed, skipped: false };
}

export function outboxStats() {
  const row = get(`SELECT
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed
    FROM outbox`);
  return { pending: row?.pending || 0, failed: row?.failed || 0 };
}

// Relance les e-mails en echec (bouton de l'administration).
export function retryFailed(now = new Date()) {
  run("UPDATE outbox SET status = 'pending', attempts = 0, next_attempt_at = ? WHERE status = 'failed'", [now.toISOString()]);
}
