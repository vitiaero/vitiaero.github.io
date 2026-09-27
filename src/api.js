// Petit client pour appeler l'API. Ajoute le jeton d'authentification
// et transforme les erreurs en messages lisibles, dans la langue du site.
import { translateServerError, staticNotice } from './i18n/index.jsx';
import { API_ORIGIN, STATIC_ONLY } from './config.js';
import { STORAGE_KEYS, readStorage, writeStorage } from '../shared/storage.js';

// Adresse complete d'une route de l'API ("/api/..."). Seules les routes internes
// sont acceptees : aucune adresse externe ne peut recevoir le jeton.
export function apiUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/api/')) throw new Error('Route API invalide');
  return API_ORIGIN + path;
}

export const getToken = () => readStorage(STORAGE_KEYS.token);
export const setToken = (token) => writeStorage(STORAGE_KEYS.token, token || null);

async function request(method, url, body) {
  // Site publie sans serveur : on n'appelle rien et on explique la situation.
  if (STATIC_ONLY) {
    const err = new Error(staticNotice());
    err.status = 0;
    throw err;
  }

  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(apiUrl(url), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'omit', // authentification par jeton uniquement, aucun cookie
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const err = new Error(translateServerError(data && data.error));
    err.status = res.status;
    throw err;
  }
  return data;
}

// Telechargement authentifie (export de donnees, pieces jointes) : le fichier
// est recupere avec le jeton puis enregistre depuis la memoire du navigateur.
export async function download(url, filename) {
  const res = await fetch(apiUrl(url), { headers: { Authorization: `Bearer ${getToken()}` }, credentials: 'omit' });
  if (!res.ok) {
    let message = null;
    try { message = (await res.json()).error; } catch { /* reponse vide */ }
    throw new Error(translateServerError(message));
  }
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 60000);
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  patch: (url, body) => request('PATCH', url, body),
  del: (url, body) => request('DELETE', url, body),
};
