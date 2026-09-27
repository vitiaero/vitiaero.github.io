// Empreinte du contenu des documents juridiques (Node uniquement : build,
// tests, serveur). Si le texte ou une donnee qu'il reprend change, l'empreinte
// change et une nouvelle version datee doit etre ajoutee a versions.js
// (commande : npm run legal:version).
import crypto from 'node:crypto';
import { DOCUMENTS, documentData } from './index.js';
import { HISTORY } from './versions.js';

export function documentHash(id, opts) {
  return crypto.createHash('sha256').update(JSON.stringify(documentData(id, opts))).digest('hex').slice(0, 12);
}

// Documents dont la derniere version enregistree ne correspond plus au contenu.
export function outdatedVersions(opts) {
  const out = [];
  for (const id of Object.keys(DOCUMENTS)) {
    const list = HISTORY[id] || [];
    const last = list[list.length - 1];
    const hash = documentHash(id, opts);
    if (!last || last.hash !== hash) out.push({ id, hash, recorded: last ? last.hash : null });
  }
  return out;
}
