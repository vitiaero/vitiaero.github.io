// Elements communs aux pages legales, dans toutes les langues.
export { company } from '../../content.js';

export const linkStyle = { color: 'var(--accent)', fontWeight: 600 };

// Cles du stockage technique local (voir la page cookies de chaque langue).
export const STORAGE_KEYS = ['vitiaero_token', 'vitiaero_privacy_ack', 'vitiaero_lang', 'vitiaero_map_tip'];

export function clearSiteStorage() {
  for (const key of STORAGE_KEYS) {
    try { localStorage.removeItem(key); } catch { /* stockage indisponible */ }
  }
}
