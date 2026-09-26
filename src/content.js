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
// Les videos du drone viennent de DJI (ag.dji.com/t55, 26.9.2026), sans son,
// en AV1 puis en H.264. Registre complet : docs/REGISTRE-MEDIAS.md.
const clip = (name, width, height, av1Bitrate, avcBitrate) => [
  { src: asset(`/videos/${name}.av1.mp4`), type: 'video/mp4; codecs="av01.0.08M.08"', width, height, framerate: 25, bitrate: av1Bitrate },
  { src: asset(`/videos/${name}.mp4`), type: 'video/mp4; codecs="avc1.640028"', width, height, framerate: 25, bitrate: avcBitrate },
];
export const videos = {
  hero: clip('dji-accueil-colline', 1920, 960, 3360000, 6730000),
  equipement: clip('dji-t55-transport', 1920, 1080, 2480000, 5320000),
  pulverisation: clip('dji-pulverisation-champ', 1920, 960, 4370000, 7340000),
  radar: clip('dji-radar-avant', 1146, 960, 1350000, 2280000),
  batterie: clip('dji-dissipateur-batterie', 1920, 960, 1390000, 2610000),
  // Plans FPV du vignoble d'Epesses, filmes par le proprietaire.
  vignoble: [
    { src: asset('/videos/vignoble-fpv-2160.av1.mp4'), type: 'video/mp4; codecs="av01.0.13M.08"', width: 3840, height: 2160, framerate: 60, bitrate: 22900000 },
    { src: asset('/videos/vignoble-fpv-2160.mp4'), type: 'video/mp4; codecs="avc1.640034"', width: 3840, height: 2160, framerate: 60, bitrate: 23300000 },
    { src: asset('/videos/vignoble-fpv-1080.mp4'), type: 'video/mp4; codecs="avc1.640032"', width: 1920, height: 1080, framerate: 60, bitrate: 16400000 },
  ],
};

// Photos du DJI Agras T55 (© DJI, ag.dji.com/t55) : AVIF et WebP en deux
// largeurs, JPEG de repli dans la petite largeur. Dimensions = petite largeur.
const DJI = '/images/dji/';
const photo = (name, small, big, width, height) => ({
  avif: `${asset(`${DJI}${name}-${small}.avif`)} ${small}w, ${asset(`${DJI}${name}-${big}.avif`)} ${big}w`,
  webp: `${asset(`${DJI}${name}-${small}.webp`)} ${small}w, ${asset(`${DJI}${name}-${big}.webp`)} ${big}w`,
  src: asset(`${DJI}${name}-${small}.jpg`),
  width,
  height,
});

export const images = {
  // Photo CC BY-SA 4.0, credit dans les mentions legales.
  lavaux: asset('/images/lavaux.jpg'),
  colline: photo('accueil-colline', 1280, 2400, 1280, 640),
  pulvColline: photo('pulverisation-colline', 800, 1386, 800, 534),
  studio: photo('t55-studio', 700, 1060, 700, 422),
  transport: photo('t55-transport', 1280, 2560, 1280, 720),
  pulvChamp: photo('pulverisation-champ', 1280, 2400, 1280, 640),
  radar: photo('radar-avant', 800, 1146, 800, 670),
  batterie: photo('dissipateur-batterie', 1280, 2400, 1280, 640),
  epandage: photo('epandage', 800, 1386, 800, 600),
  levage: photo('levage', 800, 1600, 800, 400),
  radiocommande: photo('radiocommande', 800, 1386, 800, 462),
};
