// Enregistre une nouvelle version datee de chaque document juridique dont le
// contenu a change (texte, ou donnees de shared/business.js qu'il reprend).
// Usage : npm run legal:version
// La compilation refuse de publier un document dont la version n'est pas a
// jour : c'est cette version qui est enregistree avec chaque demande envoyee.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENTS } from '../shared/legal/index.js';
import { documentHash } from '../shared/legal/hash.js';
import { HISTORY } from '../shared/legal/versions.js';

const FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'shared', 'legal', 'versions.js');
const today = new Date().toISOString().slice(0, 10);

const next = {};
let changed = 0;
for (const id of Object.keys(DOCUMENTS)) {
  const list = [...(HISTORY[id] || [])];
  const hash = documentHash(id);
  const last = list[list.length - 1];
  if (!last || last.hash !== hash) {
    const sameDay = list.filter((e) => e.version.startsWith(today)).length;
    const version = sameDay === 0 ? today : `${today}.${sameDay + 1}`;
    list.push({ version, hash });
    changed += 1;
    console.log(`${id} : nouvelle version ${version}`);
  }
  next[id] = list;
}

const body = Object.entries(next)
  .map(([id, list]) => `  ${id}: [\n${list.map((e) => `    { version: '${e.version}', hash: '${e.hash}' },`).join('\n')}\n  ],`)
  .join('\n');

fs.writeFileSync(FILE, `// Historique des versions des documents juridiques (fichier genere par
// npm run legal:version, a ne pas modifier a la main). La derniere entree de
// chaque liste est la version en vigueur ; les precedentes restent acceptees
// par le serveur pour les demandes envoyees depuis une page plus ancienne, et
// la version exacte est enregistree avec chaque demande.
export const HISTORY = {
${body}
};
`);

console.log(changed ? `${changed} document(s) mis a jour.` : 'Toutes les versions sont a jour.');
