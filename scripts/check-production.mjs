// Surveillance de production : verifie le site publie (et l'API si son adresse
// est connue) et sort en erreur au moindre probleme. Lance chaque heure par
// .github/workflows/surveillance.yml : un echec declenche la notification
// GitHub habituelle (e-mail au proprietaire du depot).
// Usage : SITE_URL=https://vitiaero.ch API_URL=https://api.vitiaero.ch npm run check:production
// Aucune donnee personnelle n'est lue ni envoyee.
import tls from 'node:tls';
import { business } from '../shared/business.js';
import { launchStatus } from '../shared/launch.js';
import { currentVersion } from '../shared/legal/current.js';

const SITE = (process.env.SITE_URL || business.site.url).replace(/\/+$/, '');
const API = (process.env.API_URL || '').replace(/\/+$/, '');
const TIMEOUT = Number(process.env.MONITOR_TIMEOUT_MS || 15000);
const CERT_MIN_DAYS = 14;
const SECURITY_TXT_MIN_DAYS = 30;
const PAGES = ['/', '/le-service', '/estimation', '/contact', '/confidentialite', '/mentions-legales', '/credits'];

const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);
const note = (msg) => notes.push(msg);

async function get(url) {
  const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT), headers: { 'User-Agent': 'VitiAero-surveillance' } });
  return { status: r.status, headers: r.headers, text: await r.text() };
}

async function checkPages() {
  for (const page of PAGES) {
    try {
      const r = await get(SITE + page);
      if (r.status !== 200) { fail(`${page} : statut ${r.status}`); continue; }
      if (!r.text.includes('id="root"')) fail(`${page} : page de l'application introuvable`);
      if (!/http-equiv="Content-Security-Policy"/.test(r.text)) fail(`${page} : politique de securite (CSP) absente`);
    } catch (err) {
      fail(`${page} : injoignable (${err.name})`);
    }
  }
}

// L'indexation doit suivre la porte de lancement : aucune page indexable tant
// que le service n'est pas ouvert.
async function checkIndexing(ready) {
  try {
    const robots = await get(`${SITE}/robots.txt`);
    if (robots.status !== 200) return fail(`robots.txt : statut ${robots.status}`);
    const blocksAll = /^Disallow: \/$/m.test(robots.text);
    if (!ready && !blocksAll) fail('robots.txt autorise l\'indexation alors que le service est en pre-lancement');
    if (ready && blocksAll) fail('robots.txt bloque l\'indexation alors que le service est lance (recompiler et publier)');
    const home = await get(`${SITE}/`);
    const noindex = /<meta name="robots" content="noindex/.test(home.text);
    if (!ready && !noindex) fail('page d\'accueil indexable en pre-lancement');
    if (ready && noindex) note('page d\'accueil encore en noindex : publier la derniere compilation');
  } catch (err) {
    fail(`robots.txt : injoignable (${err.name})`);
  }
}

async function checkSecurityTxt() {
  try {
    const r = await get(`${SITE}/.well-known/security.txt`);
    if (r.status !== 200) return fail(`security.txt : statut ${r.status}`);
    const m = r.text.match(/^Expires: (.+)$/m);
    const days = m ? (Date.parse(m[1]) - Date.now()) / 86400000 : -1;
    if (!(days > 0)) fail('security.txt : date d\'expiration depassee ou absente');
    else if (days < SECURITY_TXT_MIN_DAYS) fail(`security.txt : expire dans ${Math.floor(days)} jour(s), recompiler le site`);
  } catch (err) {
    fail(`security.txt : injoignable (${err.name})`);
  }
}

function certificateDays(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: hostname, port: 443, servername: hostname, timeout: TIMEOUT }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert?.valid_to) return reject(new Error('certificat illisible'));
      return resolve((Date.parse(cert.valid_to) - Date.now()) / 86400000);
    });
    socket.on('error', reject);
    socket.on('timeout', () => { socket.destroy(); reject(new Error('delai depasse')); });
  });
}

async function checkCertificates() {
  // Seules les adresses en https ont un certificat (essais locaux en http).
  const urls = [SITE, ...(API ? [API] : [])].map((u) => new URL(u)).filter((u) => u.protocol === 'https:');
  const hosts = new Set(urls.map((u) => u.hostname));
  for (const host of hosts) {
    try {
      const days = await certificateDays(host);
      if (days < CERT_MIN_DAYS) fail(`certificat HTTPS de ${host} : expire dans ${Math.floor(days)} jour(s)`);
    } catch (err) {
      fail(`certificat HTTPS de ${host} : ${err.message}`);
    }
  }
}

async function checkApi(ready) {
  if (!API) { note('API non surveillee (API_URL non definie)'); return; }
  try {
    const r = await get(`${API}/api/health`);
    if (r.status !== 200) return fail(`API : statut ${r.status}`);
    const h = JSON.parse(r.text);
    if (h.status !== 'ok') fail('API : base de donnees en erreur');
    if (h.launchReady !== ready) fail('API : etat de lancement different de celui du depot (deployer la derniere version)');
    if (ready && !h.acceptingSubmissions) fail('API : formulaires fermes alors que le service est lance (verifier SMTP_HOST et MAIL_FROM)');
    if (!ready && h.acceptingSubmissions) fail('API : formulaires ouverts en pre-lancement (retirer ALLOW_PRELAUNCH_SUBMISSIONS en production)');
    for (const [doc, version] of Object.entries(h.policies || {})) {
      if (version !== currentVersion(doc)) fail(`API : version de "${doc}" differente du site (${version} / ${currentVersion(doc)})`);
    }
    if (r.headers.get('cache-control') !== 'no-store') fail('API : en-tete Cache-Control manquant');
  } catch (err) {
    fail(`API : injoignable (${err.name})`);
  }
}

const ready = launchStatus(business).ready;
await checkPages();
await checkIndexing(ready);
await checkSecurityTxt();
await checkCertificates();
await checkApi(ready);

console.log(`Surveillance de ${SITE}${API ? ` et ${API}` : ''} (${ready ? 'service lance' : 'pre-lancement'})`);
for (const n of notes) console.log(`  info : ${n}`);
if (failures.length) {
  for (const f of failures) console.error(`  ECHEC : ${f}`);
  process.exit(1);
}
console.log('  Tout est en ordre.');
