// Outils communs aux tests : serveur de test sur une base temporaire, e-mails
// gardes en memoire, aucun appel reseau exterieur.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initDb, closeDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMailer } from '../server/mail.js';
import { currentVersion } from '../shared/legal/current.js';

export const PARCEL = [[46.4928, 6.7691], [46.4931, 6.7701], [46.4924, 6.7706], [46.4921, 6.7697]];
export const consentFor = (docs = ['privacy']) => Object.fromEntries(docs.map((d) => [d, currentVersion(d)]));

// Plus petit PNG valide (1 x 1 pixel), en base64.
export const PNG_1PX = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export function tempDir(prefix = 'vitiaero-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export async function openDb() {
  process.env.DEMO_DATA = '0';
  const dataDir = tempDir();
  await initDb({ dataDir });
  return { dataDir, close: () => { closeDb(); fs.rmSync(dataDir, { recursive: true, force: true }); } };
}

// Demarre une application sur un port libre. La base doit deja etre ouverte.
export async function startApp({ env = {}, business, clock, router, backup, mailer } = {}) {
  const mail = mailer || createMailer({ MAIL_TRANSPORT: 'memory' });
  const app = createApp({
    mailer: mail,
    env: { NODE_ENV: 'test', ...env },
    ...(business ? { business } : {}),
    ...(clock ? { clock } : {}),
    router: router || { mode: 'direct', distance: async () => ({ km: 12.3, method: 'direct' }) },
    backup,
  });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  async function api(method, url, body, token) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const r = await fetch(base + url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    const text = await r.text();
    let data = text;
    try { data = JSON.parse(text); } catch { /* texte brut */ }
    return { status: r.status, data, headers: r.headers };
  }
  const close = () => new Promise((resolve) => server.close(resolve));
  return { base, api, mailer: mail, close };
}

export async function loginAdmin(api) {
  const r = await api('POST', '/api/auth/login', { email: 'admin@vitiaero.ch', password: 'admin1234' });
  if (r.status !== 200) throw new Error(`Connexion admin impossible : ${r.status}`);
  return r.data.token;
}
