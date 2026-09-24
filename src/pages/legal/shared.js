// Elements communs aux pages legales, dans toutes les langues.
export { company } from '../../content.js';

export const linkStyle = { color: 'var(--accent)', fontWeight: 600 };

// Lien vers un site externe (source, licence, autorite).
export const extLink = { target: '_blank', rel: 'noopener noreferrer', style: linkStyle };

// Un champ facultatif (telephone, IDE) n'est affiche que s'il est renseigne.
export const filled = (v) => !!v && !String(v).trim().startsWith('[');

// Sources citees dans les pages legales, communes aux trois langues.
export const LINKS = {
  lavauxPhoto: 'https://commons.wikimedia.org/wiki/File:Lavaux_vignobles_en_terrasses_au_bord_du_L%C3%A9man_(2015).jpg',
  ccBySa: 'https://creativecommons.org/licenses/by-sa/4.0/',
  osmCopyright: 'https://www.openstreetmap.org/copyright',
  pfpdt: 'https://www.edoeb.admin.ch',
};

// Cles du stockage technique local (voir la page cookies de chaque langue).
export const STORAGE_KEYS = ['vitiaero_token', 'vitiaero_privacy_ack', 'vitiaero_lang', 'vitiaero_map_tip'];

export function clearSiteStorage() {
  for (const key of STORAGE_KEYS) {
    try { localStorage.removeItem(key); } catch { /* stockage indisponible */ }
  }
}
