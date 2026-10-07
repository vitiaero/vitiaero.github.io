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
// Ecriture dans un fichier temporaire, puis remplacement : un arret brutal
// pendant l'ecriture ne peut pas laisser une base a moitie ecrite.
export function persist() {
  if (!db) return;
  const data = Buffer.from(db.export());
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, data);
  try {
    fs.renameSync(tmp, DB_FILE);
  } catch {
    // Windows : un antivirus peut bloquer un instant le remplacement.
    fs.writeFileSync(DB_FILE, data);
    fs.rmSync(tmp, { force: true });
  }
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
    CREATE TABLE IF NOT EXISTS interventions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
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
  add('details', 'TEXT'); // JSON : obstacles, decollage, cepage resistant, produits fournis, voisins
  add('files', 'TEXT'); // JSON des photos jointes (comme messages.files)

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

  // Programme de fidelite retire (sans interet pour un service saisonnier) :
  // l'espace client montre desormais les parcelles et les interventions.
  // La colonne users.points des anciennes bases reste, inutilisee.
  db.run('DROP TABLE IF EXISTS points_history');
}

// Aire d'un polygone (points = [[lat,lng], ...]) en m2, via Turf.
export function polygonArea(points) {
  const ring = points.map(([lat, lng]) => [lng, lat]);
  ring.push(ring[0]);
  return turfArea({ type: 'Polygon', coordinates: [ring] });
}

// Mode de fonctionnement. Le serveur se considere EN LIGNE par defaut : les
// mots de passe simples du projet et les donnees de demonstration n'existent
// qu'avec l'option --dev (npm run dev, npm run serve) ou NODE_ENV=development.
// Oublier NODE_ENV chez l'hebergeur ne peut donc plus ouvrir admin1234.
export const IS_PRODUCTION = !(process.argv.includes('--dev') || process.env.NODE_ENV === 'development');
const inProduction = IS_PRODUCTION;

// Mot de passe d'un compte de depart.
// En local, on garde les mots de passe simples du projet. En ligne, ils
// viennent uniquement des variables de l'hebergeur, 12 caracteres au moins.
// Aucun mot de passe n'est jamais ecrit dans les journaux : sans variable
// valable, le compte n'est pas cree et le journal explique quoi faire.
const MIN_ONLINE_PASSWORD = 12;

function accountPassword(envName, localValue) {
  const fromEnv = process.env[envName];
  if (fromEnv && fromEnv.length >= (inProduction ? MIN_ONLINE_PASSWORD : 8)) return fromEnv;
  if (!inProduction) return localValue;
  console.error(`[VitiAero] ${envName} absent ou trop court (${MIN_ONLINE_PASSWORD} caracteres au moins) : compte non cree.`);
  return null;
}

// Compte administrateur : cree au premier demarrage, puis tenu a jour.
// Rotation du mot de passe : changer ADMIN_PASSWORD chez l'hebergeur et
// redemarrer ; l'ancien mot de passe et les sessions ouvertes ne valent plus rien.
async function syncAdmin() {
  const password = accountPassword('ADMIN_PASSWORD', 'admin1234');
  const admin = get("SELECT * FROM users WHERE role = 'admin' ORDER BY id LIMIT 1");
  if (!admin) {
    if (!password) return;
    const email = String(process.env.ADMIN_EMAIL || 'admin@vitiaero.ch').trim().toLowerCase();
    // Adresse deja prise par un compte client (inscrit avant la creation de
    // l'administrateur) : on ne transforme jamais un compte client en admin.
    if (get('SELECT id FROM users WHERE email = ?', [email])) {
      console.error('[VitiAero] ADMIN_EMAIL est deja utilise par un compte client : choisir une autre adresse.');
      return;
    }
    run(
      'INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)',
      ['Équipe VitiAero', email, await hashPasswordAsync(password), 'admin', new Date().toISOString()]
    );
    return;
  }
  if (process.env.ADMIN_PASSWORD && password && !(await verifyPassword(password, admin.password)).ok) {
    run('UPDATE users SET password = ? WHERE id = ?', [await hashPasswordAsync(password), admin.id]);
    run('DELETE FROM sessions WHERE user_id = ?', [admin.id]);
    console.log('[VitiAero] Mot de passe administrateur remplace par ADMIN_PASSWORD ; sessions fermees.');
  }
}

// Donnees de demonstration (client fictif, demandes et codes promo d'exemple) :
// en local uniquement, ou en ligne si DEMO_DATA=1. Ces codes promo figurent
// dans ce fichier public : ils ne doivent jamais accorder une vraie remise.
const withDemoData = !inProduction || process.env.DEMO_DATA === '1';

function seed() {
  const now = new Date().toISOString();
  const count = get("SELECT COUNT(*) AS n FROM users WHERE role = 'client'");
  if (count.n > 0) return; // deja rempli

  // Client de demonstration
  const clientPassword = accountPassword('CLIENT_PASSWORD', 'client1234');
  if (!clientPassword) return;
  const clientId = run(
    'INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)',
    ['Marie Dupont', 'client@vitiaero.ch', hashPassword(clientPassword), 'client', now]
  );

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
  const estimationClient = run(
    `INSERT INTO estimations
      (user_id, name, email, phone, commune, address, treatment, period, message, parcels, area_m2, promo_code, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [clientId, 'Marie Dupont', 'client@vitiaero.ch', '079 123 45 67', 'Lutry', 'En Chatelard',
     'Protection de la vigne (traitement foliaire)', 'Au printemps',
     'Parcelles en terrasses, acces par le chemin du haut.',
     JSON.stringify(parcelsClient), areaClient, 'VIGNE10', 'En etude', now]
  );

  // Interventions de demonstration, pour voir l'espace client rempli en local.
  // Elles n'existent jamais en ligne (sauf DEMO_DATA=1) : rien n'est invente
  // sur un vrai compte, l'equipe saisit chaque intervention a la main.
  const year = new Date().getFullYear();
  const demoInterventions = [
    [`${year}-05-14`, 'Lutry', 'En Chatelard, parcelle 1', 0.71, 1, 'Protection de la vigne (traitement foliaire)',
     'Produit fourni par le client', 'Vent faible, 17 degres, sol sec', 55,
     'Survol rang par rang. Bordure du chemin traitee a vitesse reduite.', 'Realisee'],
    [`${year}-06-04`, 'Lutry', 'En Chatelard, parcelles 1 et 2', 1.18, 1, 'Protection de la vigne (traitement foliaire)',
     'Produit fourni par le client', 'Vent faible, 21 degres', 80,
     'Deuxieme passage. Aucun obstacle nouveau signale.', 'Realisee'],
    [`${year}-07-02`, 'Lutry', 'En Chatelard, parcelles 1 et 2', 1.18, 1, 'Protection de la vigne (traitement foliaire)',
     null, null, null, 'Date a confirmer selon la meteo.', 'Planifiee'],
  ];
  for (const [date, commune, label, area, passes, treatment, product, conditions, duration, notes, status] of demoInterventions) {
    run(
      `INSERT INTO interventions
        (user_id, estimation_id, date, commune, parcel_label, area_ha, passes, treatment, product, conditions, duration_min, notes, status, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [clientId, estimationClient, date, commune, label, area, passes, treatment, product, conditions, duration, notes, status, now]
    );
  }

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

  const fresh = !fs.existsSync(DB_FILE);
  db = fresh ? new SQL.Database() : new SQL.Database(fs.readFileSync(DB_FILE));
  createSchema();
  migrate();
  await syncAdmin();
  if (fresh && withDemoData) seed();
  persist();
  return db;
}
