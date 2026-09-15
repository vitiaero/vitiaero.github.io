// Couche base de donnees : SQLite via sql.js (WASM, aucune compilation native).
// La base est chargee depuis un fichier si present, sinon creee puis remplie
// avec un jeu de donnees de demonstration. Chaque ecriture est persistee sur disque.
import initSqlJs from 'sql.js';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { area as turfArea } from '@turf/turf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'app.sqlite');

let SQL = null;
let db = null;

// --- Securite des mots de passe : hachage PBKDF2-SHA256 (module crypto natif de Node) ---
// 600 000 iterations (recommandation OWASP pour PBKDF2-SHA256), sel unique.
// Format stocke : "pbkdf2$iterations$sel$empreinte". L'ancien format "sel:empreinte"
// (120 000 iterations) reste lisible et il est remplace a la connexion suivante.
const PBKDF2_ITERATIONS = 600000;

function pbkdf2(password, salt, iterations) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(String(password), salt, iterations, 32, 'sha256', (err, key) => (err ? reject(err) : resolve(key)));
  });
}

function formatHash(salt, hashHex) {
  return ['pbkdf2', PBKDF2_ITERATIONS, salt, hashHex].join('$');
}

function parseStored(stored) {
  if (typeof stored !== 'string') return null;
  const parts = stored.split('$');
  if (parts.length === 4 && parts[0] === 'pbkdf2') {
    return { iterations: Number(parts[1]), salt: parts[2], hash: parts[3], legacy: false };
  }
  const legacy = stored.split(':');
  if (legacy.length === 2) return { iterations: 120000, salt: legacy[0], hash: legacy[1], legacy: true };
  return null;
}

// Version synchrone : uniquement pour les comptes crees au demarrage.
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return formatHash(salt, crypto.pbkdf2Sync(String(password), salt, PBKDF2_ITERATIONS, 32, 'sha256').toString('hex'));
}

// Version asynchrone : ne bloque pas le serveur pendant le calcul.
export async function hashPasswordAsync(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return formatHash(salt, (await pbkdf2(password, salt, PBKDF2_ITERATIONS)).toString('hex'));
}

// Renvoie { ok, needsRehash }. Comparaison a temps constant.
export async function verifyPassword(password, stored) {
  const p = parseStored(stored);
  if (!p || !Number.isInteger(p.iterations) || p.iterations < 1) return { ok: false, needsRehash: false };
  const test = await pbkdf2(password, p.salt, p.iterations);
  const expected = Buffer.from(p.hash, 'hex');
  const ok = expected.length === test.length && crypto.timingSafeEqual(expected, test);
  return { ok, needsRehash: ok && (p.legacy || p.iterations < PBKDF2_ITERATIONS) };
}

// Empreinte comparee quand le compte n'existe pas : la reponse prend le meme
// temps, on ne peut donc pas deviner quelles adresses ont un compte.
export const DUMMY_PASSWORD_HASH = hashPassword(crypto.randomBytes(16).toString('hex'));

// --- Jetons de session ---
// Seule l'empreinte SHA-256 du jeton est stockee : une copie de la base ne
// permet pas de se connecter a la place d'un utilisateur.
export function tokenDigest(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

// --- Persistance sur disque ---
export function persist() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

// --- Petits utilitaires de requete ---
export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export function get(sql, params = []) {
  const rows = all(sql, params);
  return rows[0] || null;
}

export function run(sql, params = []) {
  db.run(sql, params);
  const row = get('SELECT last_insert_rowid() AS id');
  persist();
  return row ? row.id : null;
}

function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      points INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS estimations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      commune TEXT,
      address TEXT,
      treatment TEXT,
      period TEXT,
      message TEXT,
      parcels TEXT NOT NULL,
      area_m2 REAL NOT NULL DEFAULT 0,
      promo_code TEXT,
      status TEXT NOT NULL DEFAULT 'Nouvelle',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      discount INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS points_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      delta INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Nouveau',
      created_at TEXT NOT NULL
    );
  `);
}

// Colonnes ajoutees apres coup (tarifs en ligne) : ajoutees aux bases existantes
// sans perdre les donnees.
function migrate() {
  const cols = all('PRAGMA table_info(estimations)').map((c) => c.name);
  const add = (name, type) => { if (!cols.includes(name)) db.run(`ALTER TABLE estimations ADD COLUMN ${name} ${type}`); };
  add('passes', 'INTEGER');
  add('options', 'TEXT'); // JSON { urgent, difficult, dispersed }
  add('distance_km', 'REAL');
  add('distance_method', 'TEXT'); // 'route' ou 'direct'
  add('estimate', 'TEXT'); // JSON du calcul (shared/pricing.js)

  // Table messages : le formulaire de devis ajoute quelques champs au contact.
  const mcols = all('PRAGMA table_info(messages)').map((c) => c.name);
  const addMsg = (name, type) => { if (!mcols.includes(name)) db.run(`ALTER TABLE messages ADD COLUMN ${name} ${type}`); };
  addMsg('kind', "TEXT NOT NULL DEFAULT 'contact'"); // 'contact' ou 'devis'
  addMsg('company', 'TEXT');
  addMsg('commune', 'TEXT');
  addMsg('area_ha', 'REAL');
  addMsg('passes', 'INTEGER');
  addMsg('files', 'TEXT'); // JSON [{ id, name, type, size }]

  // Sessions d'avant le stockage par empreinte (jetons en clair) : supprimees.
  // Les personnes concernees se reconnectent simplement.
  db.run('DELETE FROM sessions WHERE length(token) <> 64');
}

// Aire d'un polygone (points = [[lat,lng], ...]) en m2, via Turf.
export function polygonArea(points) {
  const ring = points.map(([lat, lng]) => [lng, lat]);
  ring.push(ring[0]);
  return turfArea({ type: 'Polygon', coordinates: [ring] });
}

// Mot de passe d'un compte de demonstration.
// En local, on garde les mots de passe simples du projet. En ligne, ils
// viennent des variables d'environnement de l'hebergeur ; si elles ne sont pas
// definies, un mot de passe aleatoire est genere et affiche une seule fois dans
// les journaux, pour qu'aucun compte connu de tous ne se retrouve sur internet.
const inProduction = process.env.NODE_ENV === 'production';

function demoPassword(envName, localValue) {
  const fromEnv = process.env[envName];
  if (fromEnv && fromEnv.length >= 8) return fromEnv;
  if (!inProduction) return localValue;
  const generated = crypto.randomBytes(12).toString('base64url');
  console.log(`[VitiAero] ${envName} n'est pas defini. Mot de passe genere : ${generated}`);
  console.log(`[VitiAero] Notez-le, ou definissez ${envName} chez l'hebergeur pour le fixer.`);
  return generated;
}

// Donnees de demonstration (client fictif, demandes et codes promo d'exemple) :
// en local uniquement, ou en ligne si DEMO_DATA=1. Ces codes promo figurent
// dans ce fichier public : ils ne doivent jamais accorder une vraie remise.
const withDemoData = !inProduction || process.env.DEMO_DATA === '1';

function seed() {
  const now = new Date().toISOString();
  const count = get('SELECT COUNT(*) AS n FROM users');
  if (count.n > 0) return; // deja rempli

  // Compte administrateur
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vitiaero.ch';
  run(
    'INSERT INTO users (name, email, password, role, points, created_at) VALUES (?,?,?,?,?,?)',
    ['Équipe VitiAero', adminEmail, hashPassword(demoPassword('ADMIN_PASSWORD', 'admin1234')), 'admin', 0, now]
  );

  if (!withDemoData) return;

  // Client de demonstration avec un peu d'historique
  const clientId = run(
    'INSERT INTO users (name, email, password, role, points, created_at) VALUES (?,?,?,?,?,?)',
    ['Marie Dupont', 'client@vitiaero.ch', hashPassword(demoPassword('CLIENT_PASSWORD', 'client1234')), 'client', 150, now]
  );
  run('INSERT INTO points_history (user_id, delta, reason, created_at) VALUES (?,?,?,?)', [
    clientId, 100, 'Bonus de bienvenue', now,
  ]);
  run('INSERT INTO points_history (user_id, delta, reason, created_at) VALUES (?,?,?,?)', [
    clientId, 50, 'Demande d\'estimation', now,
  ]);

  // Codes promotionnels de demonstration
  run('INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)', [
    'VIGNE10', 'Remise de bienvenue', 10, 1, now,
  ]);
  run('INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)', [
    'LAVAUX15', 'Offre printemps', 15, 1, now,
  ]);
  run('INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)', [
    'ANCIEN', 'Code expire', 20, 0, now,
  ]);

  // Demandes d'estimation de demonstration (parcelles reelles du Lavaux)
  const parcelsClient = [
    { points: [[46.4928, 6.7691], [46.4931, 6.7701], [46.4924, 6.7706], [46.4921, 6.7697]] },
    { points: [[46.4936, 6.7712], [46.4939, 6.7721], [46.4933, 6.7724], [46.4931, 6.7716]] },
  ].map((p) => ({ ...p, area_m2: polygonArea(p.points) }));
  const areaClient = parcelsClient.reduce((s, p) => s + p.area_m2, 0);
  run(
    `INSERT INTO estimations
      (user_id, name, email, phone, commune, address, treatment, period, message, parcels, area_m2, promo_code, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [clientId, 'Marie Dupont', 'client@vitiaero.ch', '079 123 45 67', 'Lutry', 'En Chatelard',
     'Protection de la vigne (traitement foliaire)', 'Au printemps',
     'Parcelles en terrasses, acces par le chemin du haut.',
     JSON.stringify(parcelsClient), areaClient, 'VIGNE10', 'En etude', now]
  );

  const parcelsGuest = [
    { points: [[46.4901, 6.7802], [46.4905, 6.7815], [46.4897, 6.7819], [46.4894, 6.7808]] },
  ].map((p) => ({ ...p, area_m2: polygonArea(p.points) }));
  const areaGuest = parcelsGuest.reduce((s, p) => s + p.area_m2, 0);
  run(
    `INSERT INTO estimations
      (user_id, name, email, phone, commune, address, treatment, period, message, parcels, area_m2, promo_code, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [null, 'Jean Rochat', 'jean.rochat@exemple.ch', '078 987 65 43', 'Epesses', null,
     'Traitement contre le mildiou / l\'oidium', 'Des que possible', null,
     JSON.stringify(parcelsGuest), areaGuest, null, 'Nouvelle', now]
  );
}

export async function initDb() {
  SQL = await initSqlJs({
    // Localise le fichier WASM dans le paquet installe
    locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file),
  });

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  if (fs.existsSync(DB_FILE)) {
    const buffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(buffer);
    createSchema();
    migrate();
    persist();
  } else {
    db = new SQL.Database();
    createSchema();
    migrate();
    seed();
    persist();
  }
  return db;
}
