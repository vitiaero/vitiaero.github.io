// Petit client pour appeler l'API. Ajoute le jeton d'authentification
// et transforme les erreurs en messages lisibles, dans la langue du site.
import { translateServerError, staticNotice } from './i18n/index.jsx';
import { API_ORIGIN, STATIC_ONLY } from './config.js';

const TOKEN_KEY = 'vitiaero_token';

// Adresse complete d'une route de l'API ("/api/..."). Seules les routes internes
// sont acceptees : aucune adresse externe ne peut recevoir le jeton.
export function apiUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/api/')) throw new Error('Route API invalide');
  return API_ORIGIN + path;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(method, url, body) {
  // Site publie sans serveur : on n'appelle rien et on explique la situation,
  // au lieu de laisser le visiteur devant une erreur reseau.
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

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  patch: (url, body) => request('PATCH', url, body),
  del: (url) => request('DELETE', url),
};
