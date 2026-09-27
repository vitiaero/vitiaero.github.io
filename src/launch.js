// Etat de lancement vu par le navigateur (meme regles que le serveur,
// shared/launch.js). Tant que le lancement n'est pas pret, les formulaires qui
// envoient des donnees sont fermes. En developpement (npm run dev), ils restent
// ouverts pour les essais ; le serveur applique de toute facon ses propres regles.
import { business } from '../shared/business.js';
import { launchStatus } from '../shared/launch.js';
import { STATIC_ONLY } from './config.js';

export const LAUNCH = launchStatus(business);

// Entreprise fictive (projet PAE au CPNV) : les formulaires s'affichent pour
// la demonstration. Le site publie n'enregistre rien : sans serveur, un
// message s'affiche a l'envoi ; en production, le serveur refuse la demande.
// Seul le serveur de developpement (npm run dev) les traite.
export const FICTIONAL = business.fictional === true;
export const FORMS_OPEN = FICTIONAL || ((import.meta.env.DEV || LAUNCH.ready) && !STATIC_ONLY);
export { business };
