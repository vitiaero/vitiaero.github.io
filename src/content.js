// Donnees communes a toutes les langues : coordonnees, videos, images.
import { asset } from './config.js';

// Coordonnees de l'editeur, source unique pour les pages legales et le pied de
// page. Obligatoires (art. 3 al. 1 let. s LCD, art. 19 nLPD) : nom, adresse
// postale, e-mail. Les valeurs entre crochets restent a completer par le
// proprietaire ; ne rien inventer. Un champ facultatif vide n'est pas affiche.
export const company = {
  name: 'VitiAero (Adrien Delhay)',
  address: '[ADRESSE]',
  npa: '[NPA]',
  city: '[VILLE]',
  canton: 'Vaud',
  email: 'contact@vitiaero.ch',
  phone: '', // facultatif
  ide: '', // numero IDE (CHE-...) si l'entreprise en a un ; facultatif
  responsable: 'Adrien Delhay',
  // Hebergeur du site (GitHub Pages), adresse de sa declaration de confidentialite.
  host: 'GitHub, Inc., 88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA',
};

// Phase de lancement : tant que l'activite n'a pas demarre, un bandeau discret
// l'indique en haut de chaque page et les textes evitent le present d'habitude.
// Passer a false le jour ou le service est reellement operationnel.
export const preLaunch = true;

// Les textes (chiffres cles, avantages, etapes, FAQ, equipement...) sont dans
// src/i18n/fr.js, de.js et en.js, une version par langue.

// Videos d'ambiance, de la meilleure a la plus legere. Le composant BgVideo
// retient la premiere que l'ecran et l'appareil peuvent lire de facon fluide.
// type : codec exact, pour que le navigateur sache s'il sait le decoder.
// bitrate : debit moyen reel du fichier (bits par seconde).
// Registre complet des medias : docs/REGISTRE-MEDIAS.md.
const clip = (name, framerate, av1Bitrate, avcBitrate) => [
  { src: asset(`/videos/${name}.av1.mp4`), type: 'video/mp4; codecs="av01.0.08M.08"', width: 1920, height: 1080, framerate, bitrate: av1Bitrate },
  { src: asset(`/videos/${name}.mp4`), type: 'video/mp4; codecs="avc1.640028"', width: 1920, height: 1080, framerate, bitrate: avcBitrate },
];
export const videos = {
  // Accueil : vol FPV au-dessus des vignes d'Epesses (Lavaux), filme par le
  // proprietaire ; extrait ralenti, en boucle.
  hero: clip('lavaux-epesses', 30, 4860000, 7690000),
  // Equipement : illustration generee (Higgsfield, Kling 3.0) d'apres des vues du T55.
  equipement: clip('t55-equipement', 24, 1720000, 5660000),
};

// Images : AVIF et WebP en deux largeurs, JPEG de repli dans la petite
// largeur. Dimensions intrinseques = petite largeur.
const picture = (dir) => (name, small, big, width, height) => ({
  avif: `${asset(`${dir}${name}-${small}.avif`)} ${small}w, ${asset(`${dir}${name}-${big}.avif`)} ${big}w`,
  webp: `${asset(`${dir}${name}-${small}.webp`)} ${small}w, ${asset(`${dir}${name}-${big}.webp`)} ${big}w`,
  src: asset(`${dir}${name}-${small}.jpg`),
  width,
  height,
});
// Photos reelles du Lavaux (proprietaire).
const real = picture('/images/lavaux/');
// Illustrations generees du DJI Agras T55 (references : rendus du produit).
const t55 = picture('/images/t55/');

export const images = {
  // Photo CC BY-SA 4.0, credit dans les mentions legales.
  lavaux: asset('/images/lavaux.jpg'),
  epesses: real('epesses', 1280, 2400, 1280, 720),
  coteau: t55('accueil-coteau', 800, 1600, 800, 598),
  bordVigne: t55('bord-vigne', 1280, 2400, 1280, 724),
  radar: t55('radar-avant', 800, 1600, 800, 452),
  pompe: t55('pompe', 600, 1200, 600, 600),
  buse: t55('buse', 600, 1200, 600, 600),
  reservoir: t55('reservoir', 600, 1200, 600, 600),
  batterie: t55('batterie', 800, 1600, 800, 532),
  vueDuCiel: t55('vue-du-ciel', 800, 1600, 800, 452),
};
