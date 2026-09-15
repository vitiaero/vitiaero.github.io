// Donnees communes a toutes les langues : coordonnees, videos, images.
import { asset } from './config.js';

// Coordonnees de l'entreprise, source unique pour les pages legales et le pied
// de page. Les valeurs entre crochets sont a completer par le proprietaire avant
// la mise en ligne ; ne rien inventer. Le canton est connu (Vaud).
export const company = {
  name: '[RAISON_SOCIALE]',
  address: '[ADRESSE]',
  npa: '[NPA]',
  city: '[VILLE]',
  canton: 'Vaud',
  email: 'contact@vitiaero.ch', // adresse retenue pour le projet ; a confirmer
  phone: '[TELEPHONE]',
  ide: '[IDE / UID, ex. CHE-123.456.789]',
  responsable: '[RESPONSABLE]',
  host: '[HEBERGEUR : nom et adresse]',
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
export const videos = {
  hero: [
    { src: asset('/videos/hero-2160.av1.mp4'), type: 'video/mp4; codecs="av01.0.12M.08"', width: 3840, height: 2160, framerate: 25, bitrate: 5900000 },
    { src: asset('/videos/hero-2160.mp4'), type: 'video/mp4; codecs="avc1.640033"', width: 3840, height: 2160, framerate: 25, bitrate: 17500000 },
    { src: asset('/videos/hero-1080.mp4'), type: 'video/mp4; codecs="avc1.640032"', width: 1920, height: 1080, framerate: 25, bitrate: 8100000 },
  ],
  vignoble: [
    { src: asset('/videos/vignoble-fpv-2160.av1.mp4'), type: 'video/mp4; codecs="av01.0.13M.08"', width: 3840, height: 2160, framerate: 60, bitrate: 22900000 },
    { src: asset('/videos/vignoble-fpv-2160.mp4'), type: 'video/mp4; codecs="avc1.640034"', width: 3840, height: 2160, framerate: 60, bitrate: 23300000 },
    { src: asset('/videos/vignoble-fpv-1080.mp4'), type: 'video/mp4; codecs="avc1.640032"', width: 1920, height: 1080, framerate: 60, bitrate: 16400000 },
  ],
};

// Visuels de la page Equipement (DJI, et le plan du drone qui se deplie fourni
// par le proprietaire). Chaque video existe en AV1 puis en H.264, meme
// definition ; l'image fixe du meme nom est dans /images/equip.
const equip = (name, width, height, av1, avc, bitrate) => [
  { src: asset(`/videos/equip/${name}.av1.mp4`), type: `video/mp4; codecs="${av1}"`, width, height, framerate: 25, bitrate: Math.round(bitrate / 2) },
  { src: asset(`/videos/equip/${name}.mp4`), type: `video/mp4; codecs="${avc}"`, width, height, framerate: 25, bitrate },
];
export const equipVideos = {
  't50-deplie': equip('t50-deplie', 1280, 720, 'av01.0.05M.08', 'avc1.64001f', 2400000),
  spray: equip('spray', 1920, 1080, 'av01.0.08M.08', 'avc1.640032', 8400000),
  pompe: equip('pompe', 1280, 1280, 'av01.0.08M.08', 'avc1.640028', 1600000),
  gicleur: equip('gicleur', 1280, 1280, 'av01.0.08M.08', 'avc1.640028', 1800000),
  electrovanne: equip('electrovanne', 1280, 1280, 'av01.0.08M.08', 'avc1.640028', 1000000),
  parcelles: equip('parcelles', 968, 588, 'av01.0.05M.08', 'avc1.64001f', 1100000),
  camera: equip('camera', 1200, 730, 'av01.0.05M.08', 'avc1.64001f', 1000000),
};

// Chemins des images. Si une image manque, un repli sobre s'affiche (voir CSS).
export const images = {
  hero: asset('/images/hero-drone.jpg'),
  drone: asset('/images/agras-t30.jpg'),
  lavaux: asset('/images/lavaux.jpg'),
  vignes: asset('/images/t50-rows.jpg'),
};
