// API Express du service VitiAero. createApp() construit l'application sans
// demarrer de serveur : server/index.js l'utilise en production, les tests
// automatises directement. Base SQLite geree par sql.js (voir db.js).
import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  all, get, run, batch, hashPasswordAsync, verifyPassword, polygonArea, tokenDigest, DUMMY_PASSWORD_HASH,
  getUploadDir, exportDb, getState, setState,
} from './db.js';
import { BASE, computeEstimate, clampPasses, parcelsCenter } from '../shared/pricing.js';
import { apiOriginFrom, buildCsp, isPrivateRoute } from '../shared/security.js';
import { robotsTxt, sitemapXml } from '../shared/site.js';
import { business as defaultBusiness } from '../shared/business.js';
import { launchStatus } from '../shared/launch.js';
import { knownVersions, currentVersion } from '../shared/legal/current.js';
import { enqueue, outboxStats, retryFailed } from './mail.js';
import { estimationAck, quoteAck, contactAck, accountDeleted, teamNotification, safeLang } from './mail-templates.js';
import { exportUser, exportEmail, lookupEmail, eraseUser, eraseEmail, logPrivacy, runRetention } from './privacy.js';
import { createBackup, verifyBackup, pruneBackups, listBackups } from './backup.js';
import { createRouter } from './routing.js';
import { log, requestLogger } from './log.js';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // duree de vie d'une session : 7 jours
const DIST_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEGAL_DOCS = ['mentions', 'privacy', 'cookies', 'cgv', 'terms', 'credits'];

// Texte facultatif : null si vide, sinon chaine nettoyee. Refuse les objets et
// les textes trop longs (renvoie undefined).
function optionalText(value, max) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const text = String(value).trim();
  return text.length > max ? undefined : (text || null);
}
// Route asynchrone : une erreur inattendue part vers le gestionnaire d'erreurs.
const safe = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
// Texte obligatoire : chaine nettoyee, ou chaine vide si la valeur n'est pas un texte.
const str = (value) => (typeof value === 'string' ? value.trim() : '');
const langOf = (body) => safeLang(body?.lang);

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, role: u.role, created_at: u.created_at };
}

export function createApp({
  mailer = null,
  router = createRouter(process.env),
  business = defaultBusiness,
  env = process.env,
  clock = () => new Date(),
  backup = null, // { dir, key } pour la sauvegarde lancee depuis l'administration
} = {}) {
  const app = express();
  const inProduction = env.NODE_ENV === 'production';
  const teamEmail = env.MAIL_TEAM_TO || business.identity?.email || null;

  app.disable('x-powered-by');
  // Adresse IP reelle du visiteur, utilisee par la limitation de debit.
  // Derriere le proxy d'un hebergeur : 1 relais de confiance. Sans proxy devant
  // le serveur, TRUST_PROXY=false (sinon X-Forwarded-For, que n'importe qui
  // peut ecrire, permettrait de contourner la limitation).
  const trust = env.TRUST_PROXY ?? (inProduction ? '1' : 'loopback');
  app.set('trust proxy', trust === 'false' ? false : /^\d+$/.test(trust) ? Number(trust) : trust);

  // Porte de lancement : recalculee a chaque demande (un justificatif peut
  // arriver a echeance). Hors production, les envois restent possibles pour
  // tester ; ALLOW_PRELAUNCH_SUBMISSIONS=1 les ouvre sur un serveur de test.
  // En production, un envoi n'est accepte que si l'accuse de reception annonce
  // a l'ecran peut vraiment partir (transport d'e-mails configure).
  const launch = () => launchStatus(business, { today: clock() });
  const mailReady = !!mailer && mailer.mode !== 'disabled';
  const acceptingSubmissions = () => env.ALLOW_PRELAUNCH_SUBMISSIONS === '1' || !inProduction || (launch().ready && mailReady);
  const requireOpen = (req, res, next) => (acceptingSubmissions()
    ? next()
    : res.status(503).json({ error: 'Service pas encore ouvert.' }));

  app.use(requestLogger());

  // --- CORS : quand le site est heberge ailleurs que l'API (GitHub Pages) ---
  // Liste blanche stricte (ALLOWED_ORIGINS). Jamais "*", aucun cookie.
  const allowedOrigins = new Set(
    String(env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean).map(apiOriginFrom)
  );
  app.use('/api', (req, res, next) => {
    res.setHeader('Vary', 'Origin');
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
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
  const siteCsp = buildCsp({ header: true });
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=(), usb=()');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // ignore hors HTTPS
    if (req.path.startsWith('/api')) {
      // L'API ne renvoie que des donnees : rien ne doit s'y executer ni etre
      // garde en cache (reponses personnelles).
      res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    } else {
      res.setHeader('Content-Security-Policy', siteCsp);
      // Pre-lancement : aucune page ne doit etre indexee ; jamais les espaces prives.
      if (!launch().ready || isPrivateRoute(req.path)) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }
    next();
  });

  // --- Anti-force brute : limitation du nombre de tentatives par IP (en memoire) ---
  const rateBuckets = new Map();
  function rateLimit({ name, windowMs, max }) {
    return (req, res, next) => {
      const now = Date.now();
      const key = `${req.ip || req.socket?.remoteAddress || 'ip'}|${name}`;
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
  const purge = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of rateBuckets) if (now > v.reset) rateBuckets.delete(k);
  }, 10 * 60 * 1000);
  purge.unref?.();

  // Garde-fou general : 600 appels a l'API par IP toutes les 15 minutes,
  // place avant la lecture du corps.
  app.use('/api', rateLimit({ name: 'api', windowMs: 15 * 60 * 1000, max: 600 }));

  // Corps JSON : 1 Mo partout, sauf la demande de devis (photos en base64,
  // 3 fichiers de 4 Mo au maximum).
  const jsonSmall = express.json({ limit: '1mb' });
  const jsonLarge = express.json({ limit: '20mb' });
  app.use((req, res, next) => (req.path === '/api/quote' ? jsonLarge(req, res, next) : jsonSmall(req, res, next)));

  const loginLimiter = rateLimit({ name: 'login', windowMs: 15 * 60 * 1000, max: 20 });
  const registerLimiter = rateLimit({ name: 'register', windowMs: 15 * 60 * 1000, max: 20 });
  const estimationLimiter = rateLimit({ name: 'estimation', windowMs: 60 * 60 * 1000, max: 15 });
  const distanceLimiter = rateLimit({ name: 'distance', windowMs: 60 * 60 * 1000, max: 60 });
  const contactLimiter = rateLimit({ name: 'contact', windowMs: 60 * 60 * 1000, max: 10 });
  const promoLimiter = rateLimit({ name: 'promo', windowMs: 15 * 60 * 1000, max: 20 });
  const accountLimiter = rateLimit({ name: 'account', windowMs: 60 * 60 * 1000, max: 10 });

  // --- Authentification par jeton (empreinte stockee en base) ---
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
    if (clock().getTime() - new Date(session.created_at).getTime() > SESSION_TTL_MS) {
      run('DELETE FROM sessions WHERE token = ?', [digest]);
      return null;
    }
    return get('SELECT * FROM users WHERE id = ?', [session.user_id]);
  }

  function openSession(userId) {
    const now = clock();
    run('DELETE FROM sessions WHERE created_at < ?', [new Date(now.getTime() - SESSION_TTL_MS).toISOString()]);
    const token = crypto.randomBytes(24).toString('hex');
    run('INSERT INTO sessions (token, user_id, created_at) VALUES (?,?,?)', [tokenDigest(token), userId, now.toISOString()]);
    run('UPDATE users SET last_login_at = ? WHERE id = ?', [now.toISOString(), userId]);
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
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Acces reserve a l\'equipe.' });
    req.user = user;
    next();
  }

  // --- Preuve de prise de connaissance des documents juridiques ---
  // Le navigateur envoie la version affichee ; seules les versions publiees
  // (shared/legal/versions.js) sont acceptees. Enregistre : document, version,
  // date, finalite et enregistrement concerne.
  function readConsent(body, docs) {
    const c = body?.consent;
    if (!c || typeof c !== 'object') return { error: 'missing' };
    const out = {};
    for (const d of docs) {
      if (typeof c[d] !== 'string' || !c[d]) return { error: 'missing' };
      if (!knownVersions(d).includes(c[d])) return { error: 'version' };
      out[d] = c[d];
    }
    return { versions: out };
  }
  function consentError(res, error) {
    return error === 'version'
      ? res.status(409).json({ error: 'La page a ete mise a jour : merci de la recharger.' })
      : res.status(400).json({ error: 'Merci de confirmer avoir lu la politique de confidentialite.' });
  }
  function recordConsents({ recordType, recordId, userId = null, purpose, versions }) {
    const at = clock().toISOString();
    for (const [document, version] of Object.entries(versions)) {
      run(
        'INSERT INTO consents (record_type, record_id, user_id, purpose, document, version, accepted_at) VALUES (?,?,?,?,?,?,?)',
        [recordType, recordId, userId, purpose, document, version, at]
      );
    }
  }

  // =========================================================================
  //  Etat du service
  // =========================================================================
  // Sante du service pour la surveillance : aucune donnee interne.
  app.get('/api/health', (req, res) => {
    let db = 'ok';
    try { get('SELECT 1 AS ok'); } catch { db = 'error'; }
    res.status(db === 'ok' ? 200 : 503).json({
      status: db === 'ok' ? 'ok' : 'error',
      version: env.APP_VERSION || null,
      launchReady: launch().ready,
      acceptingSubmissions: acceptingSubmissions(),
      policies: Object.fromEntries(LEGAL_DOCS.map((d) => [d, currentVersion(d)])),
    });
  });
  // Ancienne adresse, gardee pour l'hebergeur.
  app.get('/api/config', (req, res) => res.json({ ok: true, acceptingSubmissions: acceptingSubmissions() }));

  // =========================================================================
  //  Comptes clients
  // =========================================================================
  app.post('/api/auth/register', registerLimiter, requireOpen, safe(async (req, res) => {
    const b = req.body || {};
    const name = str(b.name);
    const email = str(b.email).toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    if (!name || !email || !password) return res.status(400).json({ error: 'Merci de remplir tous les champs.' });
    if (name.length > 120 || email.length > 190 || password.length > 200) return res.status(400).json({ error: 'Un des champs est trop long.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    if (password.length < 8) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caracteres.' });
    const consent = readConsent(b, ['privacy', 'terms']);
    if (consent.error) return consentError(res, consent.error);
    if (get('SELECT id FROM users WHERE email = ?', [email])) return res.status(409).json({ error: 'Un compte existe deja avec cette adresse.' });

    const hash = await hashPasswordAsync(password);
    const now = clock().toISOString();
    const id = batch(() => {
      const userId = run(
        'INSERT INTO users (name, email, password, role, created_at, lang) VALUES (?,?,?,?,?,?)',
        [name, email, hash, 'client', now, langOf(b)]
      );
      recordConsents({ recordType: 'user', recordId: userId, userId, purpose: 'compte', versions: consent.versions });
      return userId;
    });
    const token = openSession(id);
    res.json({ token, user: publicUser(get('SELECT * FROM users WHERE id = ?', [id])) });
  }));

  app.post('/api/auth/login', loginLimiter, safe(async (req, res) => {
    const b = req.body || {};
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 190) : '';
    const password = typeof b.password === 'string' ? b.password.slice(0, 200) : '';
    const user = email ? get('SELECT * FROM users WHERE email = ?', [email]) : null;
    // Le mot de passe est toujours verifie, meme sans compte : meme temps de reponse.
    const check = await verifyPassword(password, user ? user.password : DUMMY_PASSWORD_HASH);
    if (!user || !check.ok) return res.status(401).json({ error: 'Adresse ou mot de passe incorrect.' });
    if (check.needsRehash) run('UPDATE users SET password = ? WHERE id = ?', [await hashPasswordAsync(password), user.id]);
    res.json({ token: openSession(user.id), user: publicUser(user) });
  }));

  app.post('/api/auth/logout', requireAuth, (req, res) => {
    run('DELETE FROM sessions WHERE token = ?', [tokenDigest(tokenFromRequest(req))]);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

  // Donnees du compte, au format JSON (art. 25 et 28 LPD).
  app.get('/api/account/export', accountLimiter, requireAuth, (req, res) => {
    const data = exportUser(req.user.id, clock());
    logPrivacy('export', 'client', { estimations: data.estimations.length, interventions: data.interventions.length }, clock());
    res.setHeader('Content-Disposition', 'attachment; filename="vitiaero-mes-donnees.json"');
    res.json(data);
  });

  // Suppression du compte par son titulaire, mot de passe exige.
  app.delete('/api/account', accountLimiter, requireAuth, safe(async (req, res) => {
    if (req.user.role !== 'client') return res.status(400).json({ error: 'Requete invalide.' });
    const password = typeof req.body?.password === 'string' ? req.body.password.slice(0, 200) : '';
    const check = await verifyPassword(password, req.user.password);
    if (!check.ok) return res.status(401).json({ error: 'Adresse ou mot de passe incorrect.' });
    const { name, email, lang } = req.user;
    const summary = eraseUser(req.user.id, { keepContractRecords: true });
    logPrivacy('erase', 'client', summary, clock());
    const mail = accountDeleted(business, { lang, name, keptContractRecords: summary.keptContractRecords > 0 });
    enqueue({ to: email, subject: mail.subject, text: mail.text, now: clock() });
    res.json({ ok: true, keptContractRecords: summary.keptContractRecords });
  }));

  // =========================================================================
  //  Interventions : suivi des traitements realises sur les parcelles
  // =========================================================================
  const INTERVENTION_STATUSES = ['Planifiee', 'Realisee', 'Annulee'];
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  function cleanIntervention(body, { partial = false } = {}) {
    const b = body || {};
    const value = {};
    if (!partial || b.date !== undefined) {
      const date = str(b.date);
      if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) return { error: 'La date n\'est pas valide.' };
      value.date = date;
    }
    if (!partial || b.status !== undefined) {
      const status = str(b.status) || 'Planifiee';
      if (!INTERVENTION_STATUSES.includes(status)) return { error: 'Statut inconnu.' };
      value.status = status;
    }
    const texts = { commune: 120, parcel_label: 160, treatment: 160, product: 160, conditions: 200, notes: 2000 };
    for (const [field, max] of Object.entries(texts)) {
      if (partial && b[field] === undefined) continue;
      const text = optionalText(b[field], max);
      if (text === undefined) return { error: 'Un des champs est trop long.' };
      value[field] = text;
    }
    if (!partial || b.area_ha !== undefined) {
      const area = b.area_ha === '' || b.area_ha === null || b.area_ha === undefined ? null : Number(String(b.area_ha).replace(',', '.'));
      if (area !== null && (!Number.isFinite(area) || area <= 0 || area >= 1000)) return { error: 'Requete invalide.' };
      value.area_ha = area;
    }
    if (!partial || b.passes !== undefined) {
      const passes = b.passes === '' || b.passes === null || b.passes === undefined ? null : Number(b.passes);
      if (passes !== null && (!Number.isInteger(passes) || passes < 1 || passes > 20)) return { error: 'Requete invalide.' };
      value.passes = passes;
    }
    if (!partial || b.duration_min !== undefined) {
      const duration = b.duration_min === '' || b.duration_min === null || b.duration_min === undefined ? null : Number(b.duration_min);
      if (duration !== null && (!Number.isInteger(duration) || duration < 0 || duration > 5000)) return { error: 'Requete invalide.' };
      value.duration_min = duration;
    }
    return { value };
  }

  app.get('/api/interventions/mine', requireAuth, (req, res) => {
    res.json(all('SELECT * FROM interventions WHERE user_id = ? ORDER BY date DESC, id DESC', [req.user.id]));
  });

  app.get('/api/admin/interventions', requireAdmin, (req, res) => {
    res.json(all(
      `SELECT i.*, COALESCE(u.name, i.client_name) AS client_name, COALESCE(u.email, i.client_email) AS client_email
         FROM interventions i LEFT JOIN users u ON u.id = i.user_id
        ORDER BY i.date DESC, i.id DESC`
    ));
  });

  app.post('/api/admin/interventions', requireAdmin, (req, res) => {
    const userId = Number(req.body?.user_id);
    const client = Number.isInteger(userId) ? get('SELECT id, name, email FROM users WHERE id = ?', [userId]) : null;
    if (!client) return res.status(400).json({ error: 'Client introuvable.' });
    const estimationId = req.body?.estimation_id ? Number(req.body.estimation_id) : null;
    if (estimationId !== null && !get('SELECT id FROM estimations WHERE id = ? AND user_id = ?', [estimationId, userId])) {
      return res.status(400).json({ error: 'Demande introuvable.' });
    }
    const { error, value } = cleanIntervention(req.body);
    if (error) return res.status(400).json({ error });
    const id = run(
      `INSERT INTO interventions
        (user_id, estimation_id, date, commune, parcel_label, area_ha, passes, treatment, product, conditions, duration_min, notes, status, created_at, client_name, client_email)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [userId, estimationId, value.date, value.commune, value.parcel_label, value.area_ha, value.passes,
        value.treatment, value.product, value.conditions, value.duration_min, value.notes, value.status,
        clock().toISOString(), client.name, client.email]
    );
    res.json(get('SELECT * FROM interventions WHERE id = ?', [id]));
  });

  app.patch('/api/admin/interventions/:id', requireAdmin, (req, res) => {
    const row = get('SELECT * FROM interventions WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Intervention introuvable.' });
    const { error, value } = cleanIntervention(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const fields = Object.keys(value);
    if (fields.length === 0) return res.json(row);
    run(`UPDATE interventions SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`, [...fields.map((f) => value[f]), row.id]);
    res.json(get('SELECT * FROM interventions WHERE id = ?', [row.id]));
  });

  app.delete('/api/admin/interventions/:id', requireAdmin, (req, res) => {
    run('DELETE FROM interventions WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  });

  // =========================================================================
  //  Codes promotionnels
  // =========================================================================
  app.post('/api/promo/validate', promoLimiter, requireOpen, (req, res) => {
    const raw = req.body?.code;
    const code = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
    if (!code) return res.status(400).json({ valid: false, error: 'Veuillez saisir un code.' });
    if (code.length > 40) return res.json({ valid: false, error: 'Ce code n\'est pas valable.' });
    const promo = get('SELECT * FROM promo_codes WHERE UPPER(code) = ?', [code]);
    if (!promo || !promo.active) return res.json({ valid: false, error: 'Ce code n\'est pas valable.' });
    res.json({ valid: true, code: promo.code, discount: promo.discount, description: promo.description });
  });

  // =========================================================================
  //  Messages du formulaire de contact
  // =========================================================================
  app.post('/api/contact', contactLimiter, requireOpen, (req, res) => {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // champ piege : rempli par les robots seulement
    const name = str(b.name);
    const email = str(b.email);
    const phone = str(b.phone);
    const message = str(b.message);
    if (!name || !email || !message) return res.status(400).json({ error: 'Le nom, l\'adresse e-mail et le message sont obligatoires.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    if (name.length > 120 || email.length > 190 || phone.length > 40 || message.length > 4000) {
      return res.status(400).json({ error: 'Un des champs est trop long.' });
    }
    const consent = readConsent(b, ['privacy']);
    if (consent.error) return consentError(res, consent.error);
    const now = clock();
    const lang = langOf(b);
    const id = batch(() => {
      const messageId = run(
        'INSERT INTO messages (name, email, phone, message, status, created_at, updated_at, kind, lang) VALUES (?,?,?,?,?,?,?,?,?)',
        [name, email, phone || null, message, 'Nouveau', now.toISOString(), now.toISOString(), 'contact', lang]
      );
      recordConsents({ recordType: 'message', recordId: messageId, purpose: 'contact', versions: consent.versions });
      const ack = contactAck(business, { lang, id: messageId, name });
      enqueue({ recordType: 'message', recordId: messageId, to: email, ...ack, now });
      if (teamEmail) enqueue({ recordType: 'message', recordId: messageId, to: teamEmail, ...teamNotification(business, { kind: 'contact', id: messageId }), now });
      return messageId;
    });
    res.json({ ok: true, id });
  });

  // =========================================================================
  //  Demande de devis personnalise (avec pieces jointes)
  // =========================================================================
  // Fichiers recus en base64, enregistres sous un nom aleatoire hors de la
  // racine publique ; seule l'equipe peut les telecharger.
  const MAX_FILES = 3;
  const MAX_FILE_BYTES = 4 * 1024 * 1024;
  const FILE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic', 'application/pdf': 'pdf' };
  const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'];
  // Le type annonce par le navigateur ne prouve rien : on verifie la signature.
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

  // Controle tous les fichiers avant d'ecrire quoi que ce soit sur le disque.
  function checkFiles(input) {
    if (input === undefined || input === null) return [];
    if (!Array.isArray(input)) throw new Error('Format de fichier non accepte.');
    if (input.length > MAX_FILES) throw new Error('Trop de fichiers joints.');
    return input.map((f) => {
      const ext = FILE_TYPES[f?.type];
      if (!ext || typeof f.data !== 'string') throw new Error('Format de fichier non accepte.');
      const base64 = f.data.slice(f.data.indexOf(',') + 1);
      if (base64.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 + 4) throw new Error('Un fichier joint est trop volumineux.');
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new Error('Format de fichier non accepte.');
      const buffer = Buffer.from(base64, 'base64');
      if (buffer.length === 0 || buffer.length > MAX_FILE_BYTES) throw new Error('Un fichier joint est trop volumineux.');
      if (!contentMatchesType(buffer, f.type)) throw new Error('Format de fichier non accepte.');
      return { f, ext, buffer };
    });
  }

  function writeFiles(checked) {
    const dir = getUploadDir();
    if (checked.length && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return checked.map(({ f, ext, buffer }) => {
      const id = crypto.randomBytes(16).toString('hex');
      fs.writeFileSync(path.join(dir, `${id}.${ext}`), buffer, { flag: 'wx' });
      return {
        id: `${id}.${ext}`,
        name: String(f.name || 'fichier').replace(/[^\w.\- ]/g, '').slice(0, 120) || 'fichier',
        type: f.type,
        size: buffer.length,
      };
    });
  }

  app.post('/api/quote', contactLimiter, requireOpen, (req, res) => {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // champ piege
    const name = str(b.name);
    const email = str(b.email);
    const commune = str(b.commune);
    if (!name || !email || !commune) return res.status(400).json({ error: 'Le nom, l\'adresse e-mail et la commune sont obligatoires.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    const message = str(b.message);
    const company = str(b.company);
    const phone = str(b.phone);
    if (name.length > 120 || email.length > 190 || commune.length > 120 || company.length > 160 || phone.length > 40 || message.length > 4000) {
      return res.status(400).json({ error: 'Un des champs est trop long.' });
    }
    const consent = readConsent(b, ['privacy']);
    if (consent.error) return consentError(res, consent.error);
    const area = Number(String(b.area_ha || '').replace(',', '.'));
    const areaHa = Number.isFinite(area) && area > 0 && area < 1000 ? area : null;
    const passes = clampPasses(b.passes);

    let checked;
    try { checked = checkFiles(b.files); } catch (err) { return res.status(400).json({ error: err.message }); }
    const files = writeFiles(checked);
    const now = clock();
    const lang = langOf(b);
    let id;
    try {
      id = batch(() => {
      const messageId = run(
        `INSERT INTO messages (name, email, phone, message, status, created_at, updated_at, kind, company, commune, area_ha, passes, files, lang)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [name, email, phone || null, message || '', 'Nouveau', now.toISOString(), now.toISOString(), 'devis',
          company || null, commune, areaHa, b.passes ? passes : null, files.length ? JSON.stringify(files) : null, lang]
      );
      recordConsents({ recordType: 'message', recordId: messageId, purpose: 'devis', versions: consent.versions });
      enqueue({ recordType: 'message', recordId: messageId, to: email, ...quoteAck(business, { lang, id: messageId, name, commune }), now });
      if (teamEmail) {
        enqueue({ recordType: 'message', recordId: messageId, to: teamEmail, ...teamNotification(business, { kind: 'devis', id: messageId, commune, areaM2: areaHa ? areaHa * 10000 : null }), now });
      }
      return messageId;
      });
    } catch (err) {
      // Enregistrement refuse : aucun fichier ne doit rester orphelin sur le disque.
      for (const f of files) fs.rmSync(path.join(getUploadDir(), f.id), { force: true });
      throw err;
    }
    res.json({ ok: true, id });
  });

  // =========================================================================
  //  Distance depuis la base de depart (frais de deplacement)
  // =========================================================================
  function inServiceArea(pt) {
    return pt && pt.lat > 45.7 && pt.lat < 47.9 && pt.lng > 5.8 && pt.lng < 10.6;
  }

  app.post('/api/route-distance', distanceLimiter, safe(async (req, res) => {
    const pt = { lat: Number(req.body?.lat), lng: Number(req.body?.lng) };
    if (!inServiceArea(pt)) return res.status(400).json({ error: 'Position hors de la zone de service.' });
    res.json({ ...(await router.distance(pt)), from: BASE.label });
  }));

  // Parcelles recues : polygones valides seulement, surface recalculee ici.
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
  app.post('/api/estimations', estimationLimiter, requireOpen, safe(async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.json({ id: 0, area_m2: 0, connected: false }); // champ piege
    const name = str(b.name);
    const email = str(b.email);
    if (!name || !email) return res.status(400).json({ error: 'Le nom et l\'adresse e-mail sont obligatoires.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
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
    if (parcels.length === 0) return res.status(400).json({ error: 'Merci de tracer au moins une parcelle sur la carte.' });
    const consent = readConsent(b, ['privacy']);
    if (consent.error) return consentError(res, consent.error);
    const area = parcels.reduce((sum, p) => sum + p.area_m2, 0);
    const user = userFromToken(req);

    let promoCode = null;
    let promoPercent = 0;
    if (typeof b.promo_code === 'string' && b.promo_code.trim() && b.promo_code.length <= 40) {
      const promo = get('SELECT * FROM promo_codes WHERE UPPER(code) = ? AND active = 1', [b.promo_code.trim().toUpperCase()]);
      if (promo) { promoCode = promo.code; promoPercent = Number(promo.discount) || 0; }
    }

    // Estimation recalculee ici avec la grille partagee (shared/pricing.js).
    const passes = clampPasses(b.passes);
    const options = { urgent: !!b.urgent, difficult: !!b.difficult, dispersed: !!b.dispersed };
    const distance = await router.distance(parcelsCenter(parcels));
    const estimate = computeEstimate({
      areaM2: area, passes, distanceKm: distance.km, distanceApproximate: distance.method !== 'route', promoPercent, ...options,
    });
    const now = clock();
    const lang = langOf(b);

    const id = batch(() => {
      const estimationId = run(
        `INSERT INTO estimations
          (user_id, name, email, phone, commune, address, treatment, period, message, parcels, area_m2, promo_code, status, created_at,
           passes, options, distance_km, distance_method, estimate, updated_at, lang)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [user ? user.id : null, name, email, extra.phone, extra.commune, extra.address, extra.treatment, extra.period, extra.message,
          JSON.stringify(parcels), area, promoCode, 'Nouvelle', now.toISOString(), passes, JSON.stringify(options),
          distance.km, distance.method, JSON.stringify(estimate), now.toISOString(), lang]
      );
      recordConsents({ recordType: 'estimation', recordId: estimationId, userId: user ? user.id : null, purpose: 'estimation', versions: consent.versions });
      const ack = estimationAck(business, { lang, id: estimationId, name, areaM2: area, passes, estimate });
      enqueue({ recordType: 'estimation', recordId: estimationId, to: email, ...ack, now });
      if (teamEmail) {
        enqueue({ recordType: 'estimation', recordId: estimationId, to: teamEmail, ...teamNotification(business, { kind: 'estimation', id: estimationId, commune: extra.commune, areaM2: area }), now });
      }
      return estimationId;
    });

    res.json({ id, area_m2: area, connected: !!user, estimate, distance });
  }));

  function withJson(r) {
    const parse = (v, fallback) => { try { return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
    return { ...r, parcels: parse(r.parcels, []), options: parse(r.options, null), estimate: parse(r.estimate, null) };
  }

  app.get('/api/estimations/mine', requireAuth, (req, res) => {
    res.json(all('SELECT * FROM estimations WHERE user_id = ? ORDER BY id DESC', [req.user.id]).map(withJson));
  });

  // =========================================================================
  //  Espace administrateur
  // =========================================================================
  app.get('/api/admin/estimations', requireAdmin, (req, res) => {
    res.json(all('SELECT * FROM estimations ORDER BY id DESC').map(withJson));
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
    // Chaque changement de statut compte comme un echange : la conservation
    // repart de cette date.
    run('UPDATE estimations SET status = ?, updated_at = ? WHERE id = ?', [status, clock().toISOString(), req.params.id]);
    res.json({ ok: true });
  });

  app.get('/api/admin/estimations/:id/geojson', requireAdmin, (req, res) => {
    const row = get('SELECT * FROM estimations WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Demande introuvable.' });
    const parcels = JSON.parse(row.parcels || '[]');
    const features = parcels.map((p, i) => ({
      type: 'Feature',
      properties: { parcelle: i + 1, surface_m2: Math.round(p.area_m2 || 0) },
      geometry: {
        type: 'Polygon',
        coordinates: [[...p.points.map((pt) => [pt[1], pt[0]]), ...(p.points.length ? [[p.points[0][1], p.points[0][0]]] : [])]],
      },
    }));
    res.setHeader('Content-Type', 'application/geo+json');
    res.setHeader('Content-Disposition', `attachment; filename="estimation-${row.id}.geojson"`);
    res.send(JSON.stringify({ type: 'FeatureCollection', features }, null, 2));
  });

  app.get('/api/admin/clients', requireAdmin, (req, res) => {
    res.json(all(
      `SELECT u.id, u.name, u.email, u.role, u.created_at, u.last_login_at,
              (SELECT COUNT(*) FROM estimations e WHERE e.user_id = u.id) AS requests,
              (SELECT COUNT(*) FROM interventions i WHERE i.user_id = u.id AND i.status = 'Realisee') AS interventions,
              (SELECT MAX(i.date) FROM interventions i WHERE i.user_id = u.id AND i.status = 'Realisee') AS last_intervention
         FROM users u WHERE u.role = 'client' ORDER BY u.id DESC`
    ));
  });

  app.get('/api/admin/messages', requireAdmin, (req, res) => {
    res.json(all('SELECT * FROM messages ORDER BY id DESC').map((r) => {
      let files = [];
      try { files = r.files ? JSON.parse(r.files) : []; } catch { files = []; }
      return { ...r, files };
    }));
  });

  app.get('/api/admin/messages/:id/files/:index', requireAdmin, (req, res) => {
    const row = get('SELECT files FROM messages WHERE id = ?', [req.params.id]);
    let files = [];
    try { files = row?.files ? JSON.parse(row.files) : []; } catch { files = []; }
    const file = files[Number(req.params.index)];
    if (!file || !/^[a-f0-9]{32}\.[a-z]{3,4}$/.test(file.id)) return res.status(404).json({ error: 'Fichier introuvable.' });
    const full = path.join(getUploadDir(), file.id);
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Fichier introuvable.' });
    res.setHeader('Content-Type', file.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.id}"`);
    res.sendFile(full);
  });

  app.patch('/api/admin/messages/:id', requireAdmin, (req, res) => {
    const status = String(req.body?.status || '');
    if (!['Nouveau', 'Traité'].includes(status)) return res.status(400).json({ error: 'Statut inconnu.' });
    if (!get('SELECT id FROM messages WHERE id = ?', [req.params.id])) return res.status(404).json({ error: 'Message introuvable.' });
    run('UPDATE messages SET status = ?, updated_at = ? WHERE id = ?', [status, clock().toISOString(), req.params.id]);
    res.json(get('SELECT * FROM messages WHERE id = ?', [req.params.id]));
  });

  // -- Codes promotionnels --
  app.get('/api/admin/promos', requireAdmin, (req, res) => res.json(all('SELECT * FROM promo_codes ORDER BY id DESC')));
  const validDiscount = (value) => Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 100;

  app.post('/api/admin/promos', requireAdmin, (req, res) => {
    const { code, description, discount, active } = req.body || {};
    const clean = typeof code === 'string' ? code.trim().toUpperCase() : '';
    if (!clean) return res.status(400).json({ error: 'Le code est obligatoire.' });
    const text = optionalText(description, 200);
    if (!/^[A-Z0-9_-]{2,40}$/.test(clean) || text === undefined || !validDiscount(discount ?? 0)) return res.status(400).json({ error: 'Requete invalide.' });
    if (get('SELECT id FROM promo_codes WHERE UPPER(code) = ?', [clean])) return res.status(409).json({ error: 'Ce code existe deja.' });
    const id = run('INSERT INTO promo_codes (code, description, discount, active, created_at) VALUES (?,?,?,?,?)',
      [clean, text || '', Number(discount) || 0, active ? 1 : 0, clock().toISOString()]);
    res.json(get('SELECT * FROM promo_codes WHERE id = ?', [id]));
  });

  app.patch('/api/admin/promos/:id', requireAdmin, (req, res) => {
    const promo = get('SELECT * FROM promo_codes WHERE id = ?', [req.params.id]);
    if (!promo) return res.status(404).json({ error: 'Code introuvable.' });
    const { description, discount, active } = req.body || {};
    const text = description !== undefined ? optionalText(description, 200) : promo.description;
    if (text === undefined || (discount !== undefined && !validDiscount(discount))) return res.status(400).json({ error: 'Requete invalide.' });
    run('UPDATE promo_codes SET description = ?, discount = ?, active = ? WHERE id = ?', [
      text || '', discount !== undefined ? Number(discount) : promo.discount,
      active !== undefined ? (active ? 1 : 0) : promo.active, req.params.id,
    ]);
    res.json(get('SELECT * FROM promo_codes WHERE id = ?', [req.params.id]));
  });

  app.delete('/api/admin/promos/:id', requireAdmin, (req, res) => {
    run('DELETE FROM promo_codes WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  });

  // -- Demandes LPD (acces, effacement) traitees par l'equipe --
  const emailParam = (value) => {
    const email = str(value).toLowerCase();
    return EMAIL_RE.test(email) && email.length <= 190 ? email : null;
  };

  app.get('/api/admin/privacy/lookup', requireAdmin, (req, res) => {
    const email = emailParam(req.query.email);
    if (!email) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    res.json(lookupEmail(email));
  });

  app.get('/api/admin/privacy/export', requireAdmin, (req, res) => {
    const email = emailParam(req.query.email);
    if (!email) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    const data = exportEmail(email, clock());
    logPrivacy('export', 'equipe', { estimations: data.estimations.length, messages: data.messages.length }, clock());
    res.setHeader('Content-Disposition', 'attachment; filename="export-donnees.json"');
    res.json(data);
  });

  app.post('/api/admin/privacy/erase', requireAdmin, (req, res) => {
    const email = emailParam(req.body?.email);
    if (!email) return res.status(400).json({ error: 'L\'adresse e-mail n\'est pas valide.' });
    const target = get('SELECT role FROM users WHERE lower(email) = ?', [email]);
    if (target && target.role !== 'client') return res.status(400).json({ error: 'Requete invalide.' });
    const summary = eraseEmail(email, { keepContractRecords: req.body?.keepContractRecords !== false });
    logPrivacy('erase', 'equipe', summary, clock());
    res.json({ ok: true, summary });
  });

  // -- Etat du systeme et du lancement (onglet Lancement de l'administration) --
  app.get('/api/admin/system', requireAdmin, (req, res) => {
    const status = launch();
    res.json({
      launch: { ready: status.ready, blockers: status.blockers, warnings: status.warnings },
      acceptingSubmissions: acceptingSubmissions(),
      environment: inProduction ? 'production' : (env.NODE_ENV || 'development'),
      mail: { mode: mailer?.mode || 'disabled', ...outboxStats() },
      routing: router.mode,
      retention: { lastRun: getState('retention.lastRun'), last: JSON.parse(getState('retention.lastSummary') || 'null') },
      backup: {
        configured: !!backup,
        lastRun: getState('backup.lastRun'),
        lastError: getState('backup.lastError'),
        count: backup ? listBackups(backup.dir).length : 0,
      },
      privacyLog: all('SELECT action, origin, summary, created_at FROM privacy_log ORDER BY id DESC LIMIT 20'),
      policies: Object.fromEntries(LEGAL_DOCS.map((d) => [d, currentVersion(d)])),
    });
  });

  app.post('/api/admin/outbox/retry', requireAdmin, (req, res) => {
    retryFailed(clock());
    res.json({ ok: true, ...outboxStats() });
  });

  app.post('/api/admin/retention/run', requireAdmin, (req, res) => {
    const result = runRetention(business.retention, clock());
    setState('retention.lastRun', clock().toISOString());
    setState('retention.lastSummary', JSON.stringify(result));
    res.json(result);
  });

  app.post('/api/admin/backup', requireAdmin, (req, res) => {
    if (!backup) return res.status(400).json({ error: 'Sauvegardes non configurees.' });
    try {
      const out = createBackup({ backupDir: backup.dir, key: backup.key, dbBuffer: exportDb(), uploadDir: getUploadDir(), now: clock() });
      const check = verifyBackup({ dir: out.dir, key: backup.key });
      if (!check.ok) throw new Error(check.error);
      pruneBackups({ backupDir: backup.dir, keepDays: business.retention?.backupsDays, now: clock() });
      setState('backup.lastRun', clock().toISOString());
      setState('backup.lastError', '');
      res.json({ ok: true, name: out.name, files: out.files });
    } catch (err) {
      setState('backup.lastError', String(err.message).slice(0, 200));
      log.error('backup.failed', { error: String(err.message).slice(0, 200) });
      res.status(500).json({ error: 'Une erreur interne est survenue.' });
    }
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Ressource introuvable.' }));

  // =========================================================================
  //  Site compile (serveur unique)
  // =========================================================================
  // Consignes aux moteurs de recherche selon l'etat de lancement du moment
  // (et non celui de la derniere compilation).
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').setHeader('Cache-Control', 'public, max-age=3600');
    res.send(robotsTxt(business, { ready: launch().ready }));
  });
  app.get('/sitemap.xml', (req, res) => {
    const xml = sitemapXml(business, { ready: launch().ready });
    if (!xml) return res.status(404).type('text/plain').send('Not found');
    res.type('application/xml').setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  });

  if (fs.existsSync(DIST_DIR)) {
    app.use('/assets', express.static(path.join(DIST_DIR, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(DIST_DIR, { maxAge: '1h', extensions: ['html'] }));
    app.get('*', (req, res) => res.status(404).sendFile(path.join(DIST_DIR, '404.html')));
  }

  // Messages volontairement generiques : ni pile d'appels, ni detail interne.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Les donnees envoyees sont trop volumineuses.' });
    if (Number(err?.status) >= 400 && Number(err?.status) < 500) return res.status(Number(err.status)).json({ error: 'Requete invalide.' });
    log.error('server.error', { error: String(err?.message || 'erreur').slice(0, 200) });
    res.status(500).json({ error: 'Une erreur interne est survenue.' });
  });

  return app;
}
