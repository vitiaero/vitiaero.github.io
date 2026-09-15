// Adresses utilisees par le site.
// ATTENTION : tout ce fichier est compile dans le JavaScript envoye aux
// visiteurs. Il est donc PUBLIC. Aucun secret (mot de passe, cle, jeton) ne
// doit jamais y figurer.

// Chemin de base du site, toujours termine par "/".
// "/" sur un domaine propre (www.vitiaero.ch), "/nom-du-depot/" sur GitHub Pages
// sans domaine personnalise. Fourni par Vite (option base de vite.config.js).
export const BASE_PATH = import.meta.env.BASE_URL || '/';

// Adresse d'un fichier du dossier public/ (images, videos), chemin de base compris.
export function asset(path) {
  return BASE_PATH + String(path).replace(/^\/+/, '');
}

// Origine de l'API (ex. https://api.vitiaero.ch), verifiee a la compilation
// dans vite.config.js. Vide : l'API est servie a la meme adresse que le site
// (developpement, ou serveur Node unique).
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || '';
