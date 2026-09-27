// Couche base de donnees : SQLite via sql.js (WASM, aucune compilation native).
// La base est chargee depuis un fichier si present, sinon creee. Chaque
// ecriture est persistee sur disque de facon atomique : fichier temporaire,
// synchronisation, puis renommage. Un arret brutal pendant l'ecriture ne peut
// donc pas corrompre la base (au pire, la derniere ecriture est perdue).
import initSqlJs from 'sql.js';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { area as turfArea } from '@turf/area';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DATA_DIR = path.join(__dirname, 'data');

let SQL = null;
let db = null;
let dataDir = DEFAULT_DATA_DIR;
let dbFile = path.join(DEFAULT_DATA_DIR, 'app.sqlite');
let batchDepth = 0;

export const getDataDir = () => dataDir;
export const getUploadDir = () => path.join(dataDir, 'uploads');

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
export function exportDb() {
  return Buffer.from(db.export());
}

export function persist() {
  if (!db || batchDepth > 0) return;
  const tmp = `${dbFile}.tmp`;
  const fd = fs.openSync(tmp, 'w');
  try {
    fs.writeSync(fd, exportDb());
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmp, dbFile);
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

// Plusieurs ecritures en une seule transaction, persistee une seule fois.
// En cas d'erreur, rien n'est garde.
export function batch(fn) {
  if (batchDepth > 0) return fn();
  batchDepth += 1;
  db.run('BEGIN');
  try {
    const out = fn();
    db.run('COMMIT');
    batchDepth -= 1;
    persist();
    return out;
  } catch (err) {
    try { db.run('ROLLBACK'); } catch { /* deja annulee */ }
    batchDepth -= 1;
    throw err;
  }
}

function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
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

    -- Interventions realisees sur les parcelles d'un client. Saisies par
    -- l'equipe dans l'administration : rien n'est genere automatiquement.
    -- Le nom et l'e-mail du client y sont recopies : un dossier lie a un
    -- contrat reste identifiable meme apres la suppression du compte.
    CREATE TABLE IF NOT EXISTS interventions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      estimation_id INTEGER,
      date TEXT NOT NULL,
      commune TEXT,
      parcel_label TEXT,
      area_ha REAL,
      passes INTEGER,
      treatment TEXT,
      product TEXT,
      conditions TEXT,
      duration_min INTEGER,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'Planifiee',
      created_at TEXT NOT NULL,
      client_name TEXT,
      client_email TEXT
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

    -- Preuve de prise de connaissance d'un document juridique : quel
    -- document, quelle version, quand, pour quelle finalite, rattachee a
    -- quel enregistrement. Supprimee avec cet enregistrement.
    CREATE TABLE IF NOT EXISTS consents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_type TEXT NOT NULL,
      record_id INTEGER NOT NULL,
      user_id INTEGER,
      purpose TEXT NOT NULL,
      document TEXT NOT NULL,
      version TEXT NOT NULL,
      accepted_at TEXT NOT NULL
    );

    -- E-mails a envoyer. Une ligne est supprimee des que l'e-mail est parti ;
    -- en cas d'echec repete, elle reste visible pour l'equipe.
    CREATE TABLE IF NOT EXISTS outbox (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_type TEXT,
      record_id INTEGER,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      next_attempt_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- Journal des demandes traitees au titre de la LPD (acces, effacement) :
    -- type, date et nombre d'elements concernes, sans aucune donnee personnelle.
    CREATE TABLE IF NOT EXISTS privacy_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      origin TEXT NOT NULL,
      summary TEXT,
      created_at TEXT NOT NULL
    );

    -- Etat technique (derniere purge, derniere sauvegarde...).
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

// Colonnes ajoutees apres coup : ajoutees aux bases existantes sans perdre les
// donnees.
function migrate() {
  const addColumns = (table, columns) => {
    const cols = all(`PRAGMA table_info(${table})`).map((c) => c.name);
    for (const [name, type] of columns) {
      if (!cols.includes(name)) db.run(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
    }
  };

  addColumns('estimations', [
    ['passes', 'INTEGER'],
    ['options', 'TEXT'], // JSON { urgent, difficult, dispersed }
    ['distance_km', 'REAL'],
    ['distance_method', 'TEXT'], // 'route' ou 'direct'
    ['estimate', 'TEXT'], // JSON du calcul (shared/pricing.js)
    ['updated_at', 'TEXT'], // dernier echange, point de depart de la conservation
    ['lang', 'TEXT'], // langue du site lors de l'envoi
  ]);
  addColumns('messages', [
    ['kind', "TEXT NOT NULL DEFAULT 'contact'"], // 'contact' ou 'devis'
    ['company', 'TEXT'],
    ['commune', 'TEXT'],
    ['area_ha', 'REAL'],
    ['passes', 'INTEGER'],
    ['files', 'TEXT'], // JSON [{ id, name, type, size, created_at }]
    ['updated_at', 'TEXT'],
    ['lang', 'TEXT'],
  ]);
  addColumns('users', [
    ['last_login_at', 'TEXT'],
    ['lang', 'TEXT'],
  ]);

  // interventions.user_id devient facultatif (dossiers conserves apres la
  // suppression d'un compte) : SQLite impose de reconstruire la table.
  const userCol = all('PRAGMA table_info(interventions)').find((c) => c.name === 'user_id');
  if (userCol && userCol.notnull === 1) {
    db.run(`
      ALTER TABLE interventions RENAME TO interventions_old;
      CREATE TABLE interventions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        estimation_id INTEGER,
        date TEXT NOT NULL,
        commune TEXT,
        parcel_label TEXT,
        area_ha REAL,
        passes INTEGER,
        treatment TEXT,
        product TEXT,
        conditions TEXT,
        duration_min INTEGER,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'Planifiee',
        created_at TEXT NOT NULL,
        client_name TEXT,
        client_email TEXT
      );
      INSERT INTO interventions (id, user_id, estimation_id, date, commune, parcel_label, area_ha, passes,
        treatment, product, conditions, duration_min, notes, status, created_at)
        SELECT id, user_id, estimation_id, date, commune, parcel_label, area_ha, passes,
          treatment, product, conditions, duration_min, notes, status, created_at FROM interventions_old;
      DROP TABLE interventions_old;
    `);
  }
  addColumns('interventions', [['client_name', 'TEXT'], ['client_email', 'TEXT']]);
  db.run(`UPDATE interventions SET
      client_name = COALESCE(client_name, (SELECT name FROM users WHERE users.id = interventions.user_id)),
      client_email = COALESCE(client_email, (SELECT email FROM users WHERE users.id = interventions.user_id))
    WHERE user_id IS NOT NULL`);

  // Point de depart de la conservation pour les anciennes lignes.
  db.run('UPDATE estimations SET updated_at = created_at WHERE updated_at IS NULL');
  db.run('UPDATE messages SET updated_at = created_at WHERE updated_at IS NULL');

  // Sessions d'avant le stockage par empreinte (jetons en clair) : supprimees.
  db.run('DELETE FROM sessions WHERE length(token) <> 64');
  // Programme de fidelite retire : la table n'est plus utilisee.
  db.run('DROP TABLE IF EXISTS points_history');
}

// Aire d'un polygone (points = [[lat,lng], ...]) en m2.
export function polygonArea(points) {
  const ring = points.map(([lat, lng]) => [lng, lat]);
  ring.push(ring[0]);
  return turfArea({ type: 'Polygon', coordinates: [ring] });
}

const inProduction = () => process.env.NODE_ENV === 'production';

// Mot de passe d'un compte cree au demarrage. En local, mots de passe simples
// du projet ; en ligne, variables d'environnement de l'hebergeur, sinon un mot
// de passe aleatoire est genere et affiche une seule fois dans les journaux.
function startupPassword(envName, localValue) {
  const fromEnv = process.env[envName];
  if (fromEnv && fromEnv.length >= 12) return fromEnv;
  if (fromEnv && inProduction()) {
    console.warn(`[VitiAero] ${envName} fait moins de 12 caracteres : ignore.`);
  }
  if (!inProduction()) return localValue;
  const generated = crypto.randomBytes(15).toString('base64url');
  console.log(`[VitiAero] ${envName} n'est pas defini. Mot de passe genere : ${generated}`);
  console.log(`[VitiAero] Notez-le, ou definissez ${envName} chez l'hebergeur pour le fixer.`);
  return generated;
}

// Donnees de demonstration (client fictif, demandes et codes promo d'exemple) :
// uniquement hors production. En production, aucune donnee fictive n'est
// creee, meme si DEMO_DATA=1 est defini par erreur.
function withDemoData() {
  if (inProduction()) {
    if (process.env.DEMO_DATA === '1') console.warn('[VitiAero] DEMO_DATA ignore en production : aucune donnee fictive.');
    return false;
  }
  return process.env.DEMO_DATA !== '0';
}

function seed() {
  const now = new Date().toISOString();
  const count = get('SELECT COUNT(*) AS n FROM users');
  if (count.n > 0) return; // deja rempli

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vitiaero.ch';
  run(
    'INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)',
    ['Équipe VitiAero', adminEmail, hashPassword(startupPassword('ADMIN_PASSWORD', 'admin1234')), 'admin', now]
  );

  if (!withDemoData()) return;

  // Jeu de demonstration, uniquement en local : il sert a voir l'espace client
  // et l'administration remplis. Rien de tout cela n'existe en production.
  const clientId = run(
    'INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)',
    ['Client de démonstration', 'client@vitiaero.ch', hashPassword(startupPassword('CLIENT_PASSWORD', 'client1234')), 'client', now]
  );
  run('INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)', ['VIGNE10', 'Démonstration locale', 10, 1, now]);
  run('INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)', ['ANCIEN', 'Démonstration locale, inactif', 20, 0, now]);

  const parcels = [
    { points: [[46.4928, 6.7691], [46.4931, 6.7701], [46.4924, 6.7706], [46.4921, 6.7697]] },
  ].map((p) => ({ ...p, area_m2: polygonArea(p.points) }));
  const estimationId = run(
    `INSERT INTO estimations
      (user_id, name, email, commune, treatment, period, parcels, area_m2, status, created_at, updated_at, lang)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [clientId, 'Client de démonstration', 'client@vitiaero.ch', 'Lutry', 'Protection de la vigne (traitement foliaire)',
      'Au printemps', JSON.stringify(parcels), parcels[0].area_m2, 'En etude', now, now, 'fr']
  );
  run(
    `INSERT INTO interventions
      (user_id, estimation_id, date, commune, parcel_label, area_ha, passes, treatment, status, created_at, client_name, client_email)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [clientId, estimationId, now.slice(0, 10), 'Lutry', 'Démonstration', Math.round(parcels[0].area_m2 / 100) / 100, 1,
      'Protection de la vigne (traitement foliaire)', 'Planifiee', now, 'Client de démonstration', 'client@vitiaero.ch']
  );
}

// Ouvre (ou cree) la base. dataDir : dossier des donnees (DATA_DIR sinon).
export async function initDb({ dataDir: dir } = {}) {
  dataDir = dir || process.env.DATA_DIR || DEFAULT_DATA_DIR;
  dbFile = path.join(dataDir, 'app.sqlite');
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file),
    });
  }
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (fs.existsSync(dbFile)) {
    db = new SQL.Database(fs.readFileSync(dbFile));
    createSchema();
    migrate();
  } else {
    db = new SQL.Database();
    createSchema();
    migrate();
    seed();
  }
  persist();
  return db;
}

export function closeDb() {
  if (!db) return;
  persist();
  db.close();
  db = null;
}

export function getState(key) {
  return get('SELECT value FROM app_state WHERE key = ?', [key])?.value ?? null;
}

export function setState(key, value) {
  run('INSERT INTO app_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [key, String(value)]);
}
