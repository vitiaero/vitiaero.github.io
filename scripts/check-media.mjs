// Controle du registre des medias : chaque fichier de public/ doit etre declare
// dans shared/media.js (auteur, licence, preuve du droit d'usage), et chaque
// fichier declare doit exister. Lance par la compilation et par npm run check:media.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MEDIA, NON_MEDIA_FILES, mediaBlockers } from '../shared/media.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function listFiles(dir, prefix = '') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    return e.isDirectory() ? listFiles(path.join(dir, e.name), rel) : [rel];
  });
}

export function checkMedia(publicDir = path.join(ROOT, 'public'), media = MEDIA) {
  const declared = new Set([...media.flatMap((m) => m.files), ...NON_MEDIA_FILES]);
  const present = new Set(listFiles(publicDir));
  const errors = [];
  for (const m of media) {
    if (m.rights === 'licensed' && !(m.license && m.license.name)) errors.push(`${m.id} : licence non indiquee`);
    if (!['original', 'licensed', 'pending'].includes(m.rights)) errors.push(`${m.id} : droit d'usage inconnu (${m.rights})`);
  }
  return {
    unregistered: [...present].filter((f) => !declared.has(f)).sort(),
    missing: [...declared].filter((f) => !present.has(f)).sort(),
    errors,
    blockers: mediaBlockers(media),
  };
}

// Execution directe : node scripts/check-media.mjs
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const r = checkMedia();
  for (const f of r.unregistered) console.error(`Non declare dans shared/media.js : public/${f}`);
  for (const f of r.missing) console.error(`Declare mais absent : public/${f}`);
  for (const e of r.errors) console.error(e);
  for (const b of r.blockers) console.warn(`Bloque le lancement : ${b.id} (${b.reason === 'rights' ? 'droit non confirme' : 'declaration du proprietaire attendue'})`);
  if (r.unregistered.length || r.missing.length || r.errors.length) process.exit(1);
  console.log('Registre des medias complet.');
}
