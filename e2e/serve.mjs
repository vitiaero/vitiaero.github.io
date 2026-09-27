// Demarre le serveur pour les tests navigateur, sur une base neuve :
// le dossier DATA_DIR (temporaire) est vide avant chaque lancement.
import fs from 'node:fs';

if (!process.env.DATA_DIR || !process.env.DATA_DIR.includes('vitiaero-e2e')) {
  throw new Error('DATA_DIR doit etre un dossier temporaire de test (vitiaero-e2e).');
}
fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true });
await import('../server/index.js');
