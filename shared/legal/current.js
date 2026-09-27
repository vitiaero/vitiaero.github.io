// Versions en vigueur des documents juridiques, sans leur texte : ce module
// leger sert aux formulaires (version envoyee avec chaque demande) et au serveur.
import { HISTORY } from './versions.js';

export function currentVersion(id) {
  const list = HISTORY[id];
  if (!list || list.length === 0) throw new Error(`Aucune version enregistree pour ${id}`);
  return list[list.length - 1].version;
}

export function knownVersions(id) {
  return (HISTORY[id] || []).map((e) => e.version);
}

// Date (AAAA-MM-JJ) d'une version, qui peut porter un suffixe (.2, .3...).
export const versionDate = (version) => String(version).slice(0, 10);
