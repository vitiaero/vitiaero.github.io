// Sauvegarde et restauration en ligne de commande.
//   npm run backup                   cree une sauvegarde (serveur arrete ou non)
//   npm run backup -- --verify DIR   verifie une sauvegarde sans rien ecrire
//   npm run restore -- DIR           restaure (ARRETER le serveur avant)
//   npm run backup -- --new-key      affiche une nouvelle cle BACKUP_KEY
// Variables : BACKUP_DIR, BACKUP_KEY, DATA_DIR (defaut server/data).
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_DATA_DIR } from './db.js';
import {
  createBackup, verifyBackup, restoreBackup, pruneBackups, parseBackupKey, generateBackupKey, listBackups,
} from './backup.js';
import { business } from '../shared/business.js';

const args = process.argv.slice(2);
const dataDir = process.env.DATA_DIR || DEFAULT_DATA_DIR;

function fail(message) {
  console.error(`Erreur : ${message}`);
  process.exit(1);
}

async function main() {
  if (args.includes('--new-key')) {
    console.log(generateBackupKey());
    console.log('A enregistrer chez l\'hebergeur (BACKUP_KEY) et dans un coffre de mots de passe, jamais avec les sauvegardes.');
    return;
  }
  let key;
  try { key = parseBackupKey(process.env.BACKUP_KEY); } catch (err) { fail(err.message); }

  if (args[0] === '--restore') {
    const dir = args[1];
    if (!dir) fail('indiquer le dossier de la sauvegarde a restaurer.');
    const res = restoreBackup({ dir: path.resolve(dir), key, dataDir });
    console.log(`Sauvegarde du ${res.restored} restauree (${res.uploads} piece(s) jointe(s)).`);
    if (res.previous) console.log(`Anciennes donnees deplacees dans ${res.previous}.`);
    return;
  }
  if (args[0] === '--verify') {
    const dir = args[1] || path.join(process.env.BACKUP_DIR || '', listBackups(process.env.BACKUP_DIR).at(-1) || '');
    const res = verifyBackup({ dir: path.resolve(dir), key });
    if (!res.ok) fail(`sauvegarde invalide : ${res.error}`);
    console.log(`Sauvegarde valide (${res.created_at}, ${res.uploads} piece(s) jointe(s)).`);
    return;
  }

  const backupDir = process.env.BACKUP_DIR;
  if (!backupDir) fail('BACKUP_DIR manquant.');
  // Lecture seule : le serveur ecrit la base de facon atomique (fichier
  // temporaire puis renommage), le fichier lu est donc toujours complet. La
  // base n'est jamais ouverte en ecriture ici, pour ne rien ecraser si le
  // serveur tourne.
  const dbFile = path.join(dataDir, 'app.sqlite');
  if (!fs.existsSync(dbFile)) fail(`base introuvable : ${dbFile}`);
  const res = createBackup({ backupDir, key, dbBuffer: fs.readFileSync(dbFile), uploadDir: path.join(dataDir, 'uploads') });
  const check = verifyBackup({ dir: res.dir, key });
  if (!check.ok) fail(`la sauvegarde creee ne se relit pas : ${check.error}`);
  const removed = pruneBackups({ backupDir, keepDays: business.retention?.backupsDays });
  console.log(`Sauvegarde creee et verifiee : ${res.dir}${removed ? ` (${removed} ancienne(s) supprimee(s))` : ''}.`);
}

main().catch((err) => fail(err.message));
