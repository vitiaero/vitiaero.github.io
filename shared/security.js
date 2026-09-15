// Politique de securite du contenu (Content-Security-Policy), source unique.
// - Site compile : ecrite dans une balise <meta> de index.html (GitHub Pages ne
//   permet pas d'envoyer d'en-tetes HTTP personnalises).
// - Serveur Node : envoyee en en-tete HTTP, avec en plus frame-ancestors.
// Liste blanche stricte : uniquement les domaines reellement utilises par le site.
// Si un service externe est ajoute un jour, il faut l'ajouter ici, sinon le
// navigateur le bloquera.

// Fonds de carte (Leaflet) : swisstopo (Confederation) et OpenStreetMap.
export const MAP_TILE_ORIGINS = ['https://wmts.geo.admin.ch', 'https://tile.openstreetmap.org'];
// Recherche de lieu sur la carte : service public de swisstopo.
export const SEARCH_API_ORIGIN = 'https://api3.geo.admin.ch';

// Routes de l'application, pour generer une page HTML par adresse sur GitHub
// Pages (reponse 200 au lieu de 404 quand on ouvre directement /le-service).
export const SPA_ROUTES = [
  'equipement', 'estimation', 'confirmation', 'le-service', 'devis', 'a-propos',
  'contact', 'connexion', 'inscription', 'espace-client', 'admin',
  'confidentialite', 'mentions-legales', 'conditions-generales', 'cookies', 'conditions',
];

// Verifie l'adresse de l'API fournie a la compilation et renvoie son origine.
// HTTPS obligatoire, sauf localhost pour les essais sur l'ordinateur.
export function apiOriginFrom(raw) {
  if (!raw) return '';
  let url;
  try { url = new URL(raw); } catch { throw new Error(`Adresse d'API invalide : ${raw}`); }
  const local = ['localhost', '127.0.0.1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    throw new Error("L'adresse de l'API doit commencer par https://");
  }
  if (url.username || url.password) throw new Error("L'adresse de l'API ne doit contenir aucun identifiant.");
  return url.origin;
}

export function buildCsp({ apiOrigin = '', header = false } = {}) {
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    // data: : petites images integrees par la compilation ; blob: : pieces
    // jointes ouvertes par l'equipe dans l'administration.
    'img-src': ["'self'", 'data:', 'blob:', ...MAP_TILE_ORIGINS],
    'font-src': ["'self'"],
    'media-src': ["'self'"],
    'connect-src': ["'self'", SEARCH_API_ORIGIN, ...(apiOrigin ? [apiOrigin] : [])],
    'object-src': ["'none'"],
    'frame-src': ["'none'"],
    'worker-src': ["'none'"],
    'manifest-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };
  // frame-ancestors (anti-clickjacking) n'a aucun effet dans une balise meta :
  // les navigateurs l'ignorent. Il n'est donc envoye qu'en en-tete HTTP.
  if (header) directives['frame-ancestors'] = ["'none'"];
  return Object.entries(directives).map(([name, values]) => `${name} ${values.join(' ')}`).join('; ');
}
