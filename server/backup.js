// Sauvegardes chiffrees de la base et des pieces jointes.
//
// Une sauvegarde est un dossier vitiaero-AAAAMMJJTHHMMSSZ contenant :
//   manifest.json          liste des fichiers et empreinte SHA-256 de chacun
//   db.sqlite.enc          instantane coherent de la base
//   uploads/<id>.enc       pieces jointes
// Chaque fichier est chiffre en AES-256-GCM avec la cle BACKUP_KEY (32 octets,
// en base64 ou en hexadecimal), un vecteur aleatoire propre et son nom comme
// donnee authentifiee : un fichier modifie, remplace ou echange est detecte.
// La cle ne doit jamais etre stockee avec les sauvegardes.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const MAGIC = Buffer.from('VAB1');
const PREFIX = 'vitiaero-';

export function parseBackupKey(raw) {
  const text = String(raw || '').trim();
  if (!text) throw new Error('BACKUP_KEY manquante.');
  const key = /^[0-9a-fA-F]{64}$/.test(text) ? Buffer.from(text, 'hex') : Buffer.from(text, 'base64');
  if (key.length !== 32) throw new Error('BACKUP_KEY doit faire 32 octets (64 caracteres hexadecimaux ou base64).');
  return key;
}

export function generateBackupKey() {
  return crypto.randomBytes(32).toString('base64');
}

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function encrypt(key, name, plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(name));
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([MAGIC, iv, cipher.getAuthTag(), body]);
}

function decrypt(key, name, data) {
  if (data.length < 32 || !data.subarray(0, 4).equals(MAGIC)) throw new Error(`Format inconnu : ${name}`);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, data.subarray(4, 16));
  decipher.setAAD(Buffer.from(name));
  decipher.setAuthTag(data.subarray(16, 32));
  return Buffer.concat([decipher.update(data.subarray(32)), decipher.final()]);
}

function writeSync(file, data) {
  const fd = fs.openSync(file, 'w');
  try { fs.writeSync(fd, data); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}

const stamp = (now) => now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

// dbBuffer : instantane de la base (exportDb()), pris hors transaction.
export function createBackup({ backupDir, key, dbBuffer, uploadDir, now = new Date() }) {
  if (!backupDir) throw new Error('BACKUP_DIR manquant.');
  fs.mkdirSync(backupDir, { recursive: true });
  const name = `${PREFIX}${stamp(now)}`;
  const final = path.join(backupDir, name);
  const partial = `${final}.partial`;
  fs.rmSync(partial, { recursive: true, force: true });
  fs.mkdirSync(path.join(partial, 'uploads'), { recursive: true });

  const manifest = { format: 1, app: 'vitiaero', created_at: now.toISOString(), db: null, uploads: [] };
  writeSync(path.join(partial, 'db.sqlite.enc'), encrypt(key, 'db.sqlite', dbBuffer));
  manifest.db = { sha256: sha256(dbBuffer), size: dbBuffer.length };

  if (uploadDir && fs.existsSync(uploadDir)) {
    for (const file of fs.readdirSync(uploadDir).sort()) {
      if (!/^[a-f0-9]{32}\.[a-z]{3,4}$/.test(file)) continue;
      const plain = fs.readFileSync(path.join(uploadDir, file));
      writeSync(path.join(partial, 'uploads', `${file}.enc`), encrypt(key, `uploads/${file}`, plain));
      manifest.uploads.push({ name: file, sha256: sha256(plain), size: plain.length });
    }
  }
  writeSync(path.join(partial, 'manifest.json'), Buffer.from(JSON.stringify(manifest, null, 2)));
  fs.renameSync(partial, final); // la sauvegarde n'apparait qu'une fois complete
  return { dir: final, name, files: manifest.uploads.length + 1, bytes: manifest.db.size + manifest.uploads.reduce((n, u) => n + u.size, 0) };
}

// Dechiffre et controle une sauvegarde, sans rien ecrire. Renvoie son contenu.
export function readBackup({ dir, key }) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  if (manifest.format !== 1 || manifest.app !== 'vitiaero') throw new Error('Manifeste inconnu.');
  const db = decrypt(key, 'db.sqlite', fs.readFileSync(path.join(dir, 'db.sqlite.enc')));
  if (sha256(db) !== manifest.db.sha256) throw new Error('Empreinte de la base incorrecte.');
  const uploads = manifest.uploads.map((u) => {
    if (!/^[a-f0-9]{32}\.[a-z]{3,4}$/.test(u.name)) throw new Error('Nom de fichier inattendu dans le manifeste.');
    const plain = decrypt(key, `uploads/${u.name}`, fs.readFileSync(path.join(dir, 'uploads', `${u.name}.enc`)));
    if (sha256(plain) !== u.sha256) throw new Error(`Empreinte incorrecte : ${u.name}`);
    return { name: u.name, data: plain };
  });
  return { manifest, db, uploads };
}

export function verifyBackup({ dir, key }) {
  try {
    const { manifest, uploads } = readBackup({ dir, key });
    return { ok: true, created_at: manifest.created_at, uploads: uploads.length };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Restaure une sauvegarde dans dataDir. Le serveur doit etre arrete. Les
// donnees actuelles sont d'abord deplacees dans un dossier date, jamais effacees.
export function restoreBackup({ dir, key, dataDir, now = new Date() }) {
  const { manifest, db, uploads } = readBackup({ dir, key }); // tout est verifie avant d'ecrire
  const staging = `${dataDir}.restore-${stamp(now)}`;
  fs.mkdirSync(path.join(staging, 'uploads'), { recursive: true });
  writeSync(path.join(staging, 'app.sqlite'), db);
  for (const u of uploads) writeSync(path.join(staging, 'uploads', u.name), u.data);
  let previous = null;
  if (fs.existsSync(dataDir)) {
    previous = `${dataDir}.before-restore-${stamp(now)}`;
    fs.renameSync(dataDir, previous);
  }
  fs.renameSync(staging, dataDir);
  return { restored: manifest.created_at, uploads: uploads.length, previous };
}

export function listBackups(backupDir) {
  if (!backupDir || !fs.existsSync(backupDir)) return [];
  return fs.readdirSync(backupDir)
    .filter((n) => n.startsWith(PREFIX) && !n.endsWith('.partial'))
    .sort();
}

// Supprime les sauvegardes plus anciennes que keepDays (la plus recente est
// toujours gardee).
export function pruneBackups({ backupDir, keepDays, now = new Date() }) {
  if (!(keepDays > 0)) return 0;
  const names = listBackups(backupDir);
  const limit = now.getTime() - keepDays * 86400000;
  let removed = 0;
  for (const name of names.slice(0, -1)) {
    const m = name.match(/^vitiaero-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
    if (!m) continue;
    const t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
    if (t < limit) {
      fs.rmSync(path.join(backupDir, name), { recursive: true, force: true });
      removed += 1;
    }
  }
  return removed;
}
