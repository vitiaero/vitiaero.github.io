// Cycle de vie des donnees personnelles (LPD) : conservation limitee, export,
// effacement. Les durees viennent de shared/business.js (retention) ; une duree
// non fournie (null) n'est jamais remplacee par une valeur inventee : la
// categorie n'est alors pas purgee, et le lancement reste bloque.
//
// Dossiers lies a un contrat : demande d'estimation acceptee, intervention
// realisee. Ils sont conserves pendant retention.contractRecordsYears, meme si
// le compte est supprime (ils sont alors detaches du compte).
import fs from 'node:fs';
import path from 'node:path';
import { all, get, run, batch, getUploadDir } from './db.js';
import { log } from './log.js';

export const OPEN_STATUSES = ['Nouvelle', 'En etude', 'Devis envoye', 'Refusee'];

const iso = (d) => d.toISOString();
export function monthsBefore(now, months) {
  const d = new Date(now.getTime());
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}
const daysBefore = (now, days) => new Date(now.getTime() - days * 86400000);
const positive = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

const parseFiles = (json) => { try { return json ? JSON.parse(json) : []; } catch { return []; } };

// Supprime les fichiers joints du disque. Le nom est genere par le serveur ;
// tout autre nom est ignore.
function removeFiles(files) {
  let n = 0;
  for (const f of files) {
    if (!/^[a-f0-9]{32}\.[a-z]{3,4}$/.test(f?.id || '')) continue;
    const full = path.join(getUploadDir(), f.id);
    try { fs.unlinkSync(full); n += 1; } catch { /* deja absent */ }
  }
  return n;
}

function deleteRecordTraces(recordType, ids) {
  if (ids.length === 0) return 0;
  const marks = ids.map(() => '?').join(',');
  const before = get(`SELECT COUNT(*) AS n FROM consents WHERE record_type = ? AND record_id IN (${marks})`, [recordType, ...ids]).n;
  run(`DELETE FROM consents WHERE record_type = ? AND record_id IN (${marks})`, [recordType, ...ids]);
  run(`DELETE FROM outbox WHERE record_type = ? AND record_id IN (${marks})`, [recordType, ...ids]);
  return before;
}

function deleteEstimations(rows) {
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return { estimations: 0, consents: 0 };
  const consents = deleteRecordTraces('estimation', ids);
  run(`DELETE FROM estimations WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
  return { estimations: ids.length, consents };
}

function deleteMessages(rows) {
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return { messages: 0, files: 0, consents: 0 };
  let files = 0;
  for (const r of rows) files += removeFiles(parseFiles(r.files));
  const consents = deleteRecordTraces('message', ids);
  run(`DELETE FROM messages WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
  return { messages: ids.length, files, consents };
}

function deleteInterventions(rows) {
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return 0;
  run(`DELETE FROM interventions WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
  return ids.length;
}

function add(total, part) {
  for (const [k, v] of Object.entries(part)) total[k] = (total[k] || 0) + v;
  return total;
}

// --- Effacement ------------------------------------------------------------

// Supprime un compte client et ses donnees. Les dossiers lies a un contrat
// sont gardes (detaches du compte) si keepContractRecords est vrai.
export function eraseUser(userId, { keepContractRecords = true } = {}) {
  const user = get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return null;
  if (user.role !== 'client') throw new Error('Seul un compte client peut etre efface.');
  return batch(() => {
    const summary = { account: 1 };
    const estimations = all('SELECT * FROM estimations WHERE user_id = ?', [userId]);
    const kept = keepContractRecords ? estimations.filter((e) => e.status === 'Acceptee') : [];
    add(summary, deleteEstimations(estimations.filter((e) => !kept.includes(e))));
    if (kept.length) run('UPDATE estimations SET user_id = NULL WHERE user_id = ?', [userId]);

    const interventions = all('SELECT * FROM interventions WHERE user_id = ?', [userId]);
    const keptIv = keepContractRecords ? interventions.filter((i) => i.status === 'Realisee') : [];
    summary.interventions = deleteInterventions(interventions.filter((i) => !keptIv.includes(i)));
    if (keptIv.length) run('UPDATE interventions SET user_id = NULL WHERE user_id = ?', [userId]);

    const accountConsents = deleteRecordTraces('user', [userId]);
    summary.consents = (summary.consents || 0) + accountConsents;
    run('DELETE FROM sessions WHERE user_id = ?', [userId]);
    run('DELETE FROM users WHERE id = ?', [userId]);
    summary.keptContractRecords = kept.length + keptIv.length;
    return summary;
  });
}

// Efface toutes les donnees liees a une adresse e-mail (demande traitee par
// l'equipe, apres verification de l'identite de la personne).
export function eraseEmail(email, { keepContractRecords = true } = {}) {
  const address = String(email || '').trim().toLowerCase();
  if (!address) return null;
  const summary = {};
  const user = get("SELECT id FROM users WHERE lower(email) = ? AND role = 'client'", [address]);
  if (user) add(summary, eraseUser(user.id, { keepContractRecords }));
  batch(() => {
    const guest = all('SELECT * FROM estimations WHERE lower(email) = ?', [address]);
    const keep = keepContractRecords ? guest.filter((e) => e.status === 'Acceptee') : [];
    add(summary, deleteEstimations(guest.filter((e) => !keep.includes(e))));
    add(summary, deleteMessages(all('SELECT * FROM messages WHERE lower(email) = ?', [address])));
    const ivs = all('SELECT * FROM interventions WHERE lower(client_email) = ?', [address]);
    const keepIv = keepContractRecords ? ivs.filter((i) => i.status === 'Realisee') : [];
    summary.interventions = (summary.interventions || 0) + deleteInterventions(ivs.filter((i) => !keepIv.includes(i)));
    summary.keptContractRecords = (summary.keptContractRecords || 0) + keep.length + keepIv.length;
  });
  return summary;
}

// --- Export ----------------------------------------------------------------

const exportEstimation = (e) => ({
  id: e.id, created_at: e.created_at, updated_at: e.updated_at, status: e.status,
  name: e.name, email: e.email, phone: e.phone, commune: e.commune, address: e.address,
  treatment: e.treatment, period: e.period, message: e.message, promo_code: e.promo_code,
  passes: e.passes, options: parseFiles(e.options), area_m2: e.area_m2,
  parcels: parseFiles(e.parcels), distance_km: e.distance_km, distance_method: e.distance_method,
  estimate: parseFiles(e.estimate), lang: e.lang,
});
const exportIntervention = (i) => ({
  id: i.id, date: i.date, status: i.status, commune: i.commune, parcel: i.parcel_label, area_ha: i.area_ha,
  passes: i.passes, treatment: i.treatment, product: i.product, conditions: i.conditions,
  duration_min: i.duration_min, notes: i.notes, request: i.estimation_id,
});
const exportConsent = (c) => ({ purpose: c.purpose, document: c.document, version: c.version, accepted_at: c.accepted_at });

// Donnees d'un compte (espace client) : uniquement ce qui est rattache au
// compte. Les envois faits sans etre connecte ne sont pas inclus : l'adresse
// e-mail d'un compte n'est pas verifiee, elle ne prouve pas l'identite.
export function exportUser(userId, now = new Date()) {
  const user = get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return null;
  const estimations = all('SELECT * FROM estimations WHERE user_id = ? ORDER BY id', [userId]);
  const consents = all(
    `SELECT * FROM consents WHERE (record_type = 'user' AND record_id = ?)
       OR (record_type = 'estimation' AND record_id IN (SELECT id FROM estimations WHERE user_id = ?)) ORDER BY id`,
    [userId, userId]
  );
  return {
    generated_at: iso(now),
    account: { name: user.name, email: user.email, created_at: user.created_at, last_login_at: user.last_login_at, lang: user.lang },
    estimations: estimations.map(exportEstimation),
    interventions: all('SELECT * FROM interventions WHERE user_id = ? ORDER BY date', [userId]).map(exportIntervention),
    consents: consents.map(exportConsent),
  };
}

// Donnees liees a une adresse e-mail (demande d'acces traitee par l'equipe).
export function exportEmail(email, now = new Date()) {
  const address = String(email || '').trim().toLowerCase();
  const user = get("SELECT id FROM users WHERE lower(email) = ?", [address]);
  const estimations = all('SELECT * FROM estimations WHERE lower(email) = ? ORDER BY id', [address]);
  const messages = all('SELECT * FROM messages WHERE lower(email) = ? ORDER BY id', [address]);
  const ids = (list) => (list.length ? list.map((x) => x.id) : [-1]);
  const consents = all(
    `SELECT * FROM consents WHERE (record_type = 'estimation' AND record_id IN (${ids(estimations).join(',')}))
       OR (record_type = 'message' AND record_id IN (${ids(messages).join(',')}))
       ${user ? `OR (record_type = 'user' AND record_id = ${Number(user.id)})` : ''} ORDER BY id`
  );
  return {
    generated_at: iso(now),
    account: user ? exportUser(user.id, now).account : null,
    estimations: estimations.map(exportEstimation),
    messages: messages.map((m) => ({
      id: m.id, kind: m.kind, created_at: m.created_at, name: m.name, email: m.email, phone: m.phone,
      company: m.company, commune: m.commune, area_ha: m.area_ha, passes: m.passes, message: m.message,
      attachments: parseFiles(m.files).map((f) => ({ name: f.name, type: f.type, size: f.size })),
    })),
    interventions: all('SELECT * FROM interventions WHERE lower(client_email) = ? ORDER BY date', [address]).map(exportIntervention),
    consents: consents.map(exportConsent),
  };
}

export function lookupEmail(email) {
  const data = exportEmail(email);
  return {
    account: data.account ? 1 : 0,
    estimations: data.estimations.length,
    messages: data.messages.length,
    attachments: data.messages.reduce((n, m) => n + m.attachments.length, 0),
    interventions: data.interventions.length,
    consents: data.consents.length,
  };
}

// Journal des demandes LPD : type, origine, nombres. Aucune donnee personnelle.
export function logPrivacy(action, origin, summary, now = new Date()) {
  const clean = Object.fromEntries(Object.entries(summary || {}).filter(([, v]) => typeof v === 'number'));
  run('INSERT INTO privacy_log (action, origin, summary, created_at) VALUES (?,?,?,?)', [action, origin, JSON.stringify(clean), iso(now)]);
}

// --- Conservation limitee ----------------------------------------------------

export function runRetention(retention = {}, now = new Date()) {
  const r = retention;
  const summary = {};
  const skipped = [];

  if (positive(r.requestsWithoutFollowUpMonths)) {
    const cutoff = iso(monthsBefore(now, r.requestsWithoutFollowUpMonths));
    add(summary, deleteEstimations(all(
      `SELECT id FROM estimations WHERE status IN (${OPEN_STATUSES.map(() => '?').join(',')}) AND COALESCE(updated_at, created_at) < ?`,
      [...OPEN_STATUSES, cutoff]
    )));
    add(summary, deleteMessages(all('SELECT id, files FROM messages WHERE COALESCE(updated_at, created_at) < ?', [cutoff])));
    summary.interventions = (summary.interventions || 0) + deleteInterventions(all(
      "SELECT id FROM interventions WHERE status IN ('Annulee', 'Planifiee') AND date < ?", [cutoff.slice(0, 10)]
    ));
  } else skipped.push('requestsWithoutFollowUpMonths');

  if (positive(r.contractRecordsYears)) {
    const cutoff = iso(monthsBefore(now, r.contractRecordsYears * 12));
    add(summary, deleteEstimations(all("SELECT id FROM estimations WHERE status = 'Acceptee' AND COALESCE(updated_at, created_at) < ?", [cutoff])));
    summary.interventions = (summary.interventions || 0) + deleteInterventions(all(
      "SELECT id FROM interventions WHERE status = 'Realisee' AND date < ?", [cutoff.slice(0, 10)]
    ));
  } else skipped.push('contractRecordsYears');

  if (positive(r.attachmentsMonths)) {
    const cutoff = iso(monthsBefore(now, r.attachmentsMonths));
    const rows = all("SELECT id, files FROM messages WHERE files IS NOT NULL AND created_at < ?", [cutoff]);
    let files = 0;
    for (const row of rows) {
      files += removeFiles(parseFiles(row.files));
      run('UPDATE messages SET files = NULL WHERE id = ?', [row.id]);
    }
    summary.files = (summary.files || 0) + files;
  } else skipped.push('attachmentsMonths');

  if (positive(r.inactiveAccountsMonths)) {
    const cutoff = iso(monthsBefore(now, r.inactiveAccountsMonths));
    const users = all("SELECT id FROM users WHERE role = 'client' AND COALESCE(last_login_at, created_at) < ?", [cutoff]);
    for (const u of users) add(summary, eraseUser(u.id, { keepContractRecords: true }) || {});
  } else skipped.push('inactiveAccountsMonths');

  // Sessions expirees, preuves et e-mails orphelins.
  run('DELETE FROM sessions WHERE created_at < ?', [iso(daysBefore(now, 7))]);
  run(`DELETE FROM consents WHERE
      (record_type = 'estimation' AND record_id NOT IN (SELECT id FROM estimations))
   OR (record_type = 'message' AND record_id NOT IN (SELECT id FROM messages))
   OR (record_type = 'user' AND record_id NOT IN (SELECT id FROM users))`);
  run(`DELETE FROM outbox WHERE
      (record_type = 'estimation' AND record_id NOT IN (SELECT id FROM estimations))
   OR (record_type = 'message' AND record_id NOT IN (SELECT id FROM messages))`);

  delete summary.keptContractRecords;
  log.info('retention.run', { ...summary, skipped: skipped.join(',') || undefined });
  return { summary, skipped };
}
