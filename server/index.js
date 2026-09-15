// API Express du service VitiAero.
// Aucune compilation native : base SQLite geree par sql.js (voir db.js).
import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  initDb, all, get, run, persist, hashPasswordAsync, verifyPassword, polygonArea, tokenDigest, DUMMY_PASSWORD_HASH,
} from './db.js';
import { BASE, computeEstimate, clampPasses, haversineKm, parcelsCenter } from '../shared/pricing.js';
import { apiOriginFrom, buildCsp } from '../shared/security.js';

const app = express();
// Port : --port=XXXX en priorite. "npm run dev" le fixe a 3001 pour rester aligne
// sur le proxy de Vite, meme si l'environnement definit deja PORT (par exemple
// l'outil qui lance le site en local). Sinon PORT (hebergeur), sinon 3001.
const argPort = process.argv.find((a) => a.startsWith('--port='))?.split('=')[1];
const PORT = argPort || process.env.PORT || 3001;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // duree de vie d'une session : 7 jours

app.disable('x-powered-by');
// Adresse IP reelle du visiteur, utilisee par la limitation de debit.
// Derriere le proxy d'un hebergeur (Render, Koyeb...) : 1 relais de confiance.
// En local, seul le proxy de Vite (meme machine) est cru. Sans proxy devant le
// serveur, mettre TRUST_PROXY=false : sinon l'en-tete X-Forwarded-For, que
// n'importe qui peut ecrire, permettrait de contourner la limitation.
const TRUST_PROXY = process.env.TRUST_PROXY ?? (process.env.NODE_ENV === 'production' ? '1' : 'loopback');
app.set('trust proxy', TRUST_PROXY === 'false' ? false : /^\d+$/.test(TRUST_PROXY) ? Number(TRUST_PROXY) : TRUST_PROXY);

// --- CORS : quand le site est heberge ailleurs que l'API (GitHub Pages) ---
// Liste blanche stricte d'origines (ALLOWED_ORIGINS, separees par des virgules).
// Jamais "*". Aucun cookie n'est utilise : l'authentification passe par un jeton
// dans l'en-tete Authorization, donc pas d'Access-Control-Allow-Credentials.
// Rappel : CORS protege les visiteurs dans leur navigateur, pas le serveur.
// Un script ou un robot peut toujours appeler l'API directement : la validation
// et la limitation de debit cote serveur restent indispensables.
const ALLOWED_ORIGINS = new Set(
  String(process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean).map(apiOriginFrom)
);
app.use('/api', (req, res, next) => {
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '600');
      return res.status(204).end();
    }
  }
  next();
});

// --- En-tetes de securite HTTP, sur toutes les reponses ---
const SITE_CSP = buildCsp({ header: true });
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=(), usb=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // ignore hors HTTPS
  // L'API ne renvoie que des donnees : aucune ressource ne doit s'y executer.
  // Le site compile (serveur unique) recoit la CSP complete.
  res.setHeader('Content-Security-Policy', req.path.startsWith('/api') ? "default-src 'none'; frame-ancestors 'none'" : SITE_CSP);
  next();
});

// --- Anti-force brute : limitation du nombre de tentatives par IP (en memoire) ---
// Chaque limiteur a son nom : le compteur ne depend pas de l'ecriture de
// l'adresse (/api/auth/login, /API/AUTH/LOGIN/ et /api/auth/login/ comptent ensemble).
const rateBuckets = new Map();
function rateLimit({ name, windowMs, max }) {
  return (req, res, next) => {
    const now = Date.now();
    const key = (req.ip || req.socket?.remoteAddress || 'ip') + '|' + name;
    let b = rateBuckets.get(key);
    if (!b || now > b.reset) { b = { count: 0, reset: now + windowMs }; rateBuckets.set(key, b); }
    b.count += 1;
    if (b.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
      return res.status(429).json({ error: 'Trop de tentatives. Merci de reessayer dans quelques minutes.' });
    }
    next();
  };
}
setInterval(() => { // purge des compteurs expires
  const now = Date.now();
  for (const [k, v] of rateBuckets) if (now > v.reset) rateBuckets.delete(k);
}, 10 * 60 * 1000).unref?.();
// Garde-fou general : au plus 600 appels a l'API par IP toutes les 15 minutes.
// Place avant la lecture du corps : un envoi massif est refuse sans etre lu.
app.use('/api', rateLimit({ name: 'api', windowMs: 15 * 60 * 1000, max: 600 }));

// Corps JSON : 1 Mo partout, sauf la demande de devis qui peut porter des
// photos de parcelle encodees en base64 (3 fichiers de 4 Mo au maximum).
const jsonSmall = express.json({ limit: '1mb' });
const jsonLarge = express.json({ limit: '20mb' });
app.use((req, res, next) => (req.path === '/api/quote' ? jsonLarge(req, res, next) : jsonSmall(req, res, next)));
// Anti-force brute : 20 tentatives par IP toutes les 15 minutes, par formulaire.
const loginLimiter = rateLimit({ name: 'login', windowMs: 15 * 60 * 1000, max: 20 });
const registerLimiter = rateLimit({ name: 'register', windowMs: 15 * 60 * 1000, max: 20 });
// Anti-spam sur l'envoi public de demandes : au plus 15 par heure et par IP.
const estimationLimiter = rateLimit({ name: 'estimation', windowMs: 60 * 60 * 1000, max: 15 });
// Calcul de distance (service d'itineraire externe) : au plus 60 par heure et par IP.
const distanceLimiter = rateLimit({ name: 'distance', windowMs: 60 * 60 * 1000, max: 60 });
// Formulaires de contact et de devis : au plus 10 envois par heure et par IP.
const contactLimiter = rateLimit({ name: 'contact', windowMs: 60 * 60 * 1000, max: 10 });
// Verification des codes promo : empeche de les deviner par essais successifs.
const promoLimiter = rateLimit({ name: 'promo', windowMs: 15 * 60 * 1000, max: 20 });

// Texte facultatif : null si vide, sinon chaine nettoyee. Refuse les objets et
// les textes trop longs (renvoie undefined).
function optionalText(value, max) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const text = String(value).trim();
  return text.length > max ? undefined : (text || null);
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Route asynchrone : une erreur inattendue part vers le gestionnaire d'erreurs
// (reponse 500 generique) au lieu d'arreter le serveur.
const safe = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
// Texte obligatoire : chaine nettoyee, ou chaine vide si la valeur n'est pas un texte.
const str = (value) => (typeof value === 'string' ? value.trim() : '');

// Paliers de fidelite (partages avec le client via /api/config)
const TIERS = [
  { name: 'Bronze', min: 0 },
  { name: 'Argent', min: 200 },
  { name: 'Or', min: 500 },
];
const WELCOME_BONUS = 100;
const ESTIMATION_POINTS = 50;

function tierForPoints(points) {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.min) current = t;
  return current.name;
}

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    points: u.points,
    tier: tierForPoints(u.points),
    created_at: u.created_at,
  };
}

// --- Authentification par jeton (stocke en base) ---
// Jeton lu dans l'en-tete Authorization. Format strict : 48 caracteres hexadecimaux.
function tokenFromRequest(req) {
  const header = String(req.headers.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return /^[a-f0-9]{48}$/.test(token) ? token : null;
}

function userFromToken(req) {
  const token = tokenFromRequest(req);
  if (!token) return null;
  const digest = tokenDigest(token);
  const session = get('SELECT * FROM sessions WHERE token = ?', [digest]);
  if (!session) return null;
  // Session expiree : on la supprime et on refuse
  if (Date.now() - new Date(session.created_at).getTime() > SESSION_TTL_MS) {
    run('DELETE FROM sessions WHERE token = ?', [digest]);
    return null;
  }
  return get('SELECT * FROM users WHERE id = ?', [session.user_id]);
}

// Ouvre une session : le jeton est rendu au navigateur, seule son empreinte est
// gardee en base. Les sessions expirees sont purgees au passage.
function openSession(userId) {
  const now = new Date();
  run('DELETE FROM sessions WHERE created_at < ?', [new Date(now.getTime() - SESSION_TTL_MS).toISOString()]);
  const token = newToken();
  run('INSERT INTO sessions (token, user_id, created_at) VALUES (?,?,?)', [tokenDigest(token), userId, now.toISOString()]);
  return token;
}

function requireAuth(req, res, next) {
  const user = userFromToken(req);
  if (!user) return res.status(401).json({ error: 'Connexion requise.' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = userFromToken(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Acces reserve a l\'equipe.' });
  }
  req.user = user;
  next();
}

function newToken() {
  return crypto.randomBytes(24).toString('hex');
}

// =========================================================================
//  Configuration publique
// =========================================================================
app.get('/api/config', (req, res) => {
  res.json({ tiers: TIERS, welcomeBonus: WELCOME_BONUS, estimationPoints: ESTIMATION_POINTS });
});

// =========================================================================
//  Comptes clients
// =========================================================================
app.post('/api/auth/register', registerLimiter, async (req, res, next) => {
  try {
    const b = req.body || {};
    const name = typeof b.name === 'string' ? b.name.trim() : '';
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
    const password = typeof b.password === 'string' ? b.password : '';
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Merci de remplir tous les champs.' });
    }
    if (name.length > 120 || email.length > 190 || password.length > 200) {
      return res.status(400).json({ error: 'Un des champs est trop long.' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caracteres.' });
    }
    const existing = get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(409).json({ error: 'Un compte existe deja avec cette adresse.' });

    const hash = await hashPasswordAsync(password);
    const now = new Date().toISOString();
    const id = run(
      'INSERT INTO users (name, email, password, role, points, created_at) VALUES (?,?,?,?,?,?)',
      [name, email, hash, 'client', WELCOME_BONUS, now]
    );
    run('INSERT INTO points_history (user_id, delta, reason, created_at) VALUES (?,?,?,?)', [
      id, WELCOME_BONUS, 'Bonus de bienvenue', now,
    ]);

    const token = openSession(id);
    const user = get('SELECT * FROM users WHERE id = ?', [id]);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const b = req.body || {};
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 190) : '';
    const password = typeof b.password === 'string' ? b.password.slice(0, 200) : '';
    const user = email ? get('SELECT * FROM users WHERE email = ?', [email]) : null;
    // Le mot de passe est toujours verifie, meme sans compte : meme temps de reponse.
    const check = await verifyPassword(password, user ? user.password : DUMMY_PASSWORD_HASH);
    if (!user || !check.ok) {
      return res.status(401).json({ error: 'Adresse ou mot de passe incorrect.' });
    }
    if (check.needsRehash) {
      run('UPDATE users SET password = ? WHERE id = ?', [await hashPasswordAsync(password), user.id]);
    }
    res.json({ token: openSession(user.id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  run('DELETE FROM sessions WHERE token = ?', [tokenDigest(tokenFromRequest(req))]);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// =========================================================================
//  Fidelite
// =========================================================================
app.get('/api/loyalty', requireAuth, (req, res) => {
  const history = all(
    'SELECT delta, reason, created_at FROM points_history WHERE user_id = ? ORDER BY id DESC',
    [req.user.id]
  );
  const points = req.user.points;
  const tier = tierForPoints(points);
  // Points requis pour le palier suivant (le cas echeant)
  const next = TIERS.find((t) => t.min > points);
  res.json({
    points,
    tier,
    tiers: TIERS,
    nextTier: next ? next.name : null,
    pointsToNext: next ? next.min - points : 0,
    history,
  });
});

// =========================================================================
//  Codes promotionnels : validation cote client
// =========================================================================
app.post('/api/promo/validate', promoLimiter, (req, res) => {
  const raw = req.body?.code;
  const code = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
  if (!code) return res.status(400).json({ valid: false, error: 'Veuillez saisir un code.' });
  if (code.length > 40) return res.json({ valid: false, error: 'Ce code n\'est pas valable.' });
  const promo = get('SELECT * FROM promo_codes WHERE UPPER(code) = ?', [code]);
  if (!promo || !promo.active) {
    return res.json({ valid: false, error: 'Ce code n\'est pas valable.' });
  }
  res.json({ valid: true, code: promo.code, discount: promo.discount, description: promo.description });
});

// =========================================================================
//  Messages du formulaire de contact
// =========================================================================
// Aucun courriel n'est envoye pour l'instant : les messages sont enregistres
// et l'equipe les lit dans l'administration (onglet Messages).
app.post('/api/contact', contactLimiter, (req, res) => {
  const b = req.body || {};
  // Champ piege (honeypot) : rempli par les robots, jamais par un humain.
  if (b.website) return res.json({ ok: true });

  const name = str(b.name);
  const email = str(b.email);
  const phone = str(b.phone);
  const message = str(b.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Le nom, l\'adresse e-mail et le message sont obligatoires.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
  }
  if (name.length > 120 || email.length > 190 || phone.length > 40 || message.length > 4000) {
    return res.status(400).json({ error: 'Un des champs est trop long.' });
  }

  const id = run(
    'INSERT INTO messages (name, email, phone, message, status, created_at) VALUES (?,?,?,?,?,?)',
    [name, email, phone || null, message, 'Nouveau', new Date().toISOString()]
  );
  res.json({ ok: true, id });
});

// =========================================================================
//  Demande de devis personnalise (avec pieces jointes)
// =========================================================================
// Les fichiers arrivent encodes en base64 dans le corps JSON. Ils sont
// enregistres sous un nom aleatoire, hors de la racine servie au public, et
// seule l'equipe peut les telecharger (route /api/admin/messages/.../files).
const UPLOAD_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'uploads');
const MAX_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'application/pdf': 'pdf',
};

// Le type annonce par le navigateur ne prouve rien : on verifie aussi la
// signature binaire du fichier (ses premiers octets).
const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'];
function contentMatchesType(buffer, type) {
  const ascii = (start, end) => buffer.subarray(start, end).toString('latin1');
  switch (type) {
    case 'image/jpeg': return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png': return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case 'image/webp': return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
    case 'image/heic': return ascii(4, 8) === 'ftyp' && HEIC_BRANDS.includes(ascii(8, 12));
    case 'application/pdf': return ascii(0, 5) === '%PDF-';
    default: return false;
  }
}

// Verifie et enregistre les pieces jointes. Retourne la liste a stocker en base.
// Tous les fichiers sont controles avant d'ecrire quoi que ce soit sur le disque.
function saveFiles(input) {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input)) throw new Error('Format de fichier non accepte.');
  if (input.length === 0) return [];
  if (input.length > MAX_FILES) throw new Error('Trop de fichiers joints.');

  const checked = input.map((f) => {
    const ext = FILE_TYPES[f?.type];
    if (!ext || typeof f.data !== 'string') throw new Error('Format de fichier non accepte.');
    const base64 = f.data.slice(f.data.indexOf(',') + 1);
    if (base64.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 + 4) throw new Error('Un fichier joint est trop volumineux.');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new Error('Format de fichier non accepte.');
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length === 0 || buffer.length > MAX_FILE_BYTES) {
      throw new Error('Un fichier joint est trop volumineux.');
    }
    if (!contentMatchesType(buffer, f.type)) throw new Error('Format de fichier non accepte.');
    return { f, ext, buffer };
  });

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  return checked.map(({ f, ext, buffer }) => {
    const id = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(path.join(UPLOAD_DIR, `${id}.${ext}`), buffer, { flag: 'wx' });
    return {
      id: `${id}.${ext}`,
      // Nom d'origine nettoye : il n'est jamais utilise comme chemin sur le disque.
      name: String(f.name || 'fichier').replace(/[^\w.\- ]/g, '').slice(0, 120) || 'fichier',
      type: f.type,
      size: buffer.length,
    };
  });
}

app.post('/api/quote', contactLimiter, (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // champ piege

  const name = str(b.name);
  const email = str(b.email);
  const commune = str(b.commune);
  if (!name || !email || !commune) {
    return res.status(400).json({ error: 'Le nom, l\'adresse e-mail et la commune sont obligatoires.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
  }
  const message = str(b.message);
  const company = str(b.company);
  const phone = str(b.phone);
  if (name.length > 120 || email.length > 190 || commune.length > 120
      || company.length > 160 || phone.length > 40 || message.length > 4000) {
    return res.status(400).json({ error: 'Un des champs est trop long.' });
  }

  const area = Number(String(b.area_ha || '').replace(',', '.'));
  const areaHa = Number.isFinite(area) && area > 0 && area < 1000 ? area : null;
  const passes = clampPasses(b.passes);

  let files;
  try {
    files = saveFiles(b.files);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const id = run(
    `INSERT INTO messages (name, email, phone, message, status, created_at, kind, company, commune, area_ha, passes, files)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      name, email, phone || null, message || '', 'Nouveau', new Date().toISOString(),
      'devis', company || null, commune, areaHa, b.passes ? passes : null,
      files.length ? JSON.stringify(files) : null,
    ]
  );
  res.json({ ok: true, id });
});

// =========================================================================
//  Distance par la route depuis le depot (frais de deplacement)
// =========================================================================
// Le serveur interroge lui-meme le service d'itineraire public OSRM : seule la
// position du centre des parcelles lui est transmise, jamais l'adresse IP du
// visiteur. En cas d'echec, repli sur la distance a vol d'oiseau.
const ROUTE_URL = 'https://router.project-osrm.org/route/v1/driving';
const routeCache = new Map();

// Zone acceptee : la Suisse et ses abords (evite les appels abusifs).
function inServiceArea(pt) {
  return pt && pt.lat > 45.7 && pt.lat < 47.9 && pt.lng > 5.8 && pt.lng < 10.6;
}

async function roadDistance(pt) {
  const key = `${pt.lat.toFixed(3)},${pt.lng.toFixed(3)}`;
  if (routeCache.has(key)) return routeCache.get(key);
  let result;
  try {
    const url = `${ROUTE_URL}/${BASE.lng},${BASE.lat};${pt.lng},${pt.lat}?overview=false`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'VitiAero (projet d\'etude CPNV)' } });
    const data = await r.json();
    const meters = data?.routes?.[0]?.distance;
    if (!r.ok || data.code !== 'Ok' || !Number.isFinite(meters)) throw new Error('itineraire indisponible');
    result = { km: Math.round(meters / 100) / 10, method: 'route' };
    routeCache.set(key, result);
    if (routeCache.size > 2000) routeCache.delete(routeCache.keys().next().value);
  } catch {
    result = { km: Math.round(haversineKm(BASE, pt) * 10) / 10, method: 'direct' };
  }
  return result;
}

app.post('/api/route-distance', distanceLimiter, safe(async (req, res) => {
  const pt = { lat: Number(req.body?.lat), lng: Number(req.body?.lng) };
  if (!inServiceArea(pt)) return res.status(400).json({ error: 'Position hors de la zone de service.' });
  res.json({ ...(await roadDistance(pt)), from: BASE.label });
}));

// Parcelles recues : on garde uniquement des polygones valides et on recalcule
// leur surface cote serveur (la surface envoyee par le navigateur est ignoree).
function cleanParcels(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 50).map((p) => {
    const points = Array.isArray(p?.points) ? p.points.slice(0, 500) : [];
    const ok = points.length >= 3 && points.every((pt) => Array.isArray(pt) && inServiceArea({ lat: Number(pt[0]), lng: Number(pt[1]) }));
    if (!ok) return null;
    const clean = points.map((pt) => [Number(pt[0]), Number(pt[1])]);
    return { points: clean, area_m2: polygonArea(clean) };
  }).filter(Boolean);
}

// =========================================================================
//  Demandes d'estimation
// =========================================================================
app.post('/api/estimations', estimationLimiter, safe(async (req, res) => {
  const b = req.body || {};
  // Champ piege (honeypot) : invisible pour un humain, souvent rempli par les
  // robots. S'il est rempli, on ignore la demande en simulant un succes.
  if (b.website) {
    return res.json({ id: 0, area_m2: 0, pointsEarned: 0 });
  }
  const name = str(b.name);
  const email = str(b.email);
  if (!name || !email) {
    return res.status(400).json({ error: 'Le nom et l\'adresse e-mail sont obligatoires.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
  }
  // Champs facultatifs : texte simple, longueur limitee (undefined = refuse).
  const extra = {
    phone: optionalText(b.phone, 40),
    commune: optionalText(b.commune, 120),
    address: optionalText(b.address, 200),
    treatment: optionalText(b.treatment, 120),
    period: optionalText(b.period, 120),
    message: optionalText(b.message, 4000),
  };
  if (name.length > 120 || email.length > 190 || Object.values(extra).includes(undefined)) {
    return res.status(400).json({ error: 'Un des champs est trop long.' });
  }
  const parcels = cleanParcels(b.parcels);
  if (parcels.length === 0) {
    return res.status(400).json({ error: 'Merci de tracer au moins une parcelle sur la carte.' });
  }
  const area = parcels.reduce((sum, p) => sum + p.area_m2, 0);
  const now = new Date().toISOString();

  // Rattache la demande au compte si l'utilisateur est connecte
  const user = userFromToken(req);

  // Verifie le code promo eventuel
  let promoCode = null;
  let promoPercent = 0;
  if (typeof b.promo_code === 'string' && b.promo_code.trim() && b.promo_code.length <= 40) {
    const promo = get('SELECT * FROM promo_codes WHERE UPPER(code) = ? AND active = 1', [
      b.promo_code.trim().toUpperCase(),
    ]);
    if (promo) { promoCode = promo.code; promoPercent = Number(promo.discount) || 0; }
  }

  // Estimation recalculee ici avec la grille partagee (shared/pricing.js)
  const passes = clampPasses(b.passes);
  const options = { urgent: !!b.urgent, difficult: !!b.difficult, dispersed: !!b.dispersed };
  const distance = await roadDistance(parcelsCenter(parcels));
  const estimate = computeEstimate({ areaM2: area, passes, distanceKm: distance.km, promoPercent, ...options });

  const id = run(
    `INSERT INTO estimations
      (user_id, name, email, phone, commune, address, treatment, period, message, parcels, area_m2, promo_code, status, created_at,
       passes, options, distance_km, distance_method, estimate)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      user ? user.id : null,
      name,
      email,
      extra.phone,
      extra.commune,
      extra.address,
      extra.treatment,
      extra.period,
      extra.message,
      JSON.stringify(parcels),
      area,
      promoCode,
      'Nouvelle',
      now,
      passes,
      JSON.stringify(options),
      distance.km,
      distance.method,
      JSON.stringify(estimate),
    ]
  );

  // Attribue des points de fidelite aux clients connectes
  if (user) {
    run('UPDATE users SET points = points + ? WHERE id = ?', [ESTIMATION_POINTS, user.id]);
    run('INSERT INTO points_history (user_id, delta, reason, created_at) VALUES (?,?,?,?)', [
      user.id, ESTIMATION_POINTS, 'Demande d\'estimation', now,
    ]);
  }

  res.json({ id, area_m2: area, pointsEarned: user ? ESTIMATION_POINTS : 0, estimate, distance });
}));

// Demande telle que renvoyee au navigateur (champs JSON decodes).
function withJson(r) {
  const parse = (v, fallback) => { try { return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
  return { ...r, parcels: parse(r.parcels, []), options: parse(r.options, null), estimate: parse(r.estimate, null) };
}

app.get('/api/estimations/mine', requireAuth, (req, res) => {
  const rows = all('SELECT * FROM estimations WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows.map(withJson));
});

// =========================================================================
//  Espace administrateur
// =========================================================================
app.get('/api/admin/estimations', requireAdmin, (req, res) => {
  const rows = all('SELECT * FROM estimations ORDER BY id DESC');
  res.json(rows.map(withJson));
});

app.get('/api/admin/estimations/:id', requireAdmin, (req, res) => {
  const row = get('SELECT * FROM estimations WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Demande introuvable.' });
  res.json(withJson(row));
});

app.patch('/api/admin/estimations/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const allowed = ['Nouvelle', 'En etude', 'Devis envoye', 'Acceptee', 'Refusee'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Statut inconnu.' });
  run('UPDATE estimations SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ ok: true });
});

// Export GeoJSON d'une demande (parcelles)
app.get('/api/admin/estimations/:id/geojson', requireAdmin, (req, res) => {
  const row = get('SELECT * FROM estimations WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Demande introuvable.' });
  const parcels = JSON.parse(row.parcels || '[]');
  const features = parcels.map((p, i) => ({
    type: 'Feature',
    properties: { parcelle: i + 1, surface_m2: Math.round(p.area_m2 || 0) },
    geometry: {
      type: 'Polygon',
      // GeoJSON attend [longitude, latitude] et un anneau ferme
      coordinates: [
        [...p.points.map((pt) => [pt[1], pt[0]]), p.points.length ? [p.points[0][1], p.points[0][0]] : undefined].filter(Boolean),
      ],
    },
  }));
  const geojson = { type: 'FeatureCollection', features };
  res.setHeader('Content-Type', 'application/geo+json');
  res.setHeader('Content-Disposition', `attachment; filename="estimation-${row.id}.geojson"`);
  res.send(JSON.stringify(geojson, null, 2));
});

app.get('/api/admin/clients', requireAdmin, (req, res) => {
  const rows = all(
    "SELECT id, name, email, role, points, created_at FROM users WHERE role = 'client' ORDER BY id DESC"
  );
  const withTier = rows.map((r) => ({ ...r, tier: tierForPoints(r.points) }));
  res.json(withTier);
});

// -- Messages recus par le formulaire de contact --
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const rows = all('SELECT * FROM messages ORDER BY id DESC');
  res.json(rows.map((r) => {
    let files = [];
    try { files = r.files ? JSON.parse(r.files) : []; } catch { files = []; }
    return { ...r, files };
  }));
});

// Piece jointe d'une demande de devis : reservee a l'equipe.
app.get('/api/admin/messages/:id/files/:index', requireAdmin, (req, res) => {
  const row = get('SELECT files FROM messages WHERE id = ?', [req.params.id]);
  let files = [];
  try { files = row?.files ? JSON.parse(row.files) : []; } catch { files = []; }
  const file = files[Number(req.params.index)];
  // Le nom stocke est genere par le serveur : on refuse tout autre chemin.
  if (!file || !/^[a-f0-9]{32}\.[a-z]{3,4}$/.test(file.id)) {
    return res.status(404).json({ error: 'Fichier introuvable.' });
  }
  const full = path.join(UPLOAD_DIR, file.id);
  if (!fs.existsSync(full)) return res.status(404).json({ error: 'Fichier introuvable.' });
  res.setHeader('Content-Type', file.type || 'application/octet-stream');
  res.setHeader('Content-Disposition', `inline; filename="${file.id}"`);
  res.sendFile(full);
});

app.patch('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const status = String(req.body?.status || '');
  if (!['Nouveau', 'Traité'].includes(status)) {
    return res.status(400).json({ error: 'Statut inconnu.' });
  }
  const row = get('SELECT id FROM messages WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Message introuvable.' });
  run('UPDATE messages SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json(get('SELECT * FROM messages WHERE id = ?', [req.params.id]));
});

// -- Gestion des codes promotionnels --
app.get('/api/admin/promos', requireAdmin, (req, res) => {
  res.json(all('SELECT * FROM promo_codes ORDER BY id DESC'));
});

// Remise en pourcent : nombre entier de 0 a 100 (jamais un prix negatif).
const validDiscount = (value) => Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 100;

app.post('/api/admin/promos', requireAdmin, (req, res) => {
  const { code, description, discount, active } = req.body || {};
  const clean = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!clean) return res.status(400).json({ error: 'Le code est obligatoire.' });
  const text = optionalText(description, 200);
  if (!/^[A-Z0-9_-]{2,40}$/.test(clean) || text === undefined || !validDiscount(discount ?? 0)) {
    return res.status(400).json({ error: 'Requete invalide.' });
  }
  const existing = get('SELECT id FROM promo_codes WHERE UPPER(code) = ?', [clean]);
  if (existing) return res.status(409).json({ error: 'Ce code existe deja.' });
  const id = run(
    'INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)',
    [clean, text || '', Number(discount) || 0, active ? 1 : 0, new Date().toISOString()]
  );
  res.json(get('SELECT * FROM promo_codes WHERE id = ?', [id]));
});

app.patch('/api/admin/promos/:id', requireAdmin, (req, res) => {
  const promo = get('SELECT * FROM promo_codes WHERE id = ?', [req.params.id]);
  if (!promo) return res.status(404).json({ error: 'Code introuvable.' });
  const { description, discount, active } = req.body || {};
  const text = description !== undefined ? optionalText(description, 200) : promo.description;
  if (text === undefined || (discount !== undefined && !validDiscount(discount))) {
    return res.status(400).json({ error: 'Requete invalide.' });
  }
  run('UPDATE promo_codes SET description = ?, discount = ?, active = ? WHERE id = ?', [
    text || '',
    discount !== undefined ? Number(discount) : promo.discount,
    active !== undefined ? (active ? 1 : 0) : promo.active,
    req.params.id,
  ]);
  res.json(get('SELECT * FROM promo_codes WHERE id = ?', [req.params.id]));
});

app.delete('/api/admin/promos/:id', requireAdmin, (req, res) => {
  run('DELETE FROM promo_codes WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// =========================================================================
//  Routes inconnues et gestion des erreurs
// =========================================================================
app.use('/api', (req, res) => res.status(404).json({ error: 'Ressource introuvable.' }));

// =========================================================================
//  Site compile (production)
// =========================================================================
// En production, le meme serveur sert la vitrine et l'API : une seule adresse,
// donc pas de configuration entre les deux. En developpement, c'est Vite qui
// sert le site et qui relaie /api vers ici : ce bloc ne sert alors a rien.
const DIST_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  // Fichiers dont le nom porte une empreinte : ils ne changent jamais.
  app.use('/assets', express.static(path.join(DIST_DIR, 'assets'), {
    maxAge: '1y',
    immutable: true,
  }));
  // Le reste (images, videos, polices, robots.txt, plan du site).
  app.use(express.static(DIST_DIR, { maxAge: '1h' }));
  // Application a page unique : toute autre adresse renvoie index.html, pour
  // qu'un rechargement sur /le-service ou /devis fonctionne.
  app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
} else {
  console.warn('Dossier dist/ absent : le serveur ne repond que sur /api (mode developpement).');
}
// eslint-disable-next-line no-unused-vars
// Messages volontairement generiques : ni pile d'appels, ni detail interne.
// Le journal ne contient que le message technique, jamais le contenu envoye.
app.use((err, req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Les donnees envoyees sont trop volumineuses.' });
  }
  if (Number(err?.status) >= 400 && Number(err?.status) < 500) {
    return res.status(Number(err.status)).json({ error: 'Requete invalide.' });
  }
  console.error('Erreur serveur :', err && err.message);
  res.status(500).json({ error: 'Une erreur interne est survenue.' });
});

// =========================================================================
//  Demarrage
// =========================================================================
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API VitiAero prete sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Echec du demarrage de la base :', err);
    process.exit(1);
  });

// Sauvegarde propre a l'arret
process.on('SIGINT', () => {
  persist();
  process.exit(0);
});
