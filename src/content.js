// Donnees communes a toutes les langues : coordonnees, videos, images.
import { asset } from './config.js';

// Coordonnees de l'entreprise, source unique pour les pages legales et le pied
// de page. Entreprise fictive (projet d'etude) : on ne publie que le
// necessaire. Une valeur vide n'est affichee nulle part ; le code du site est
// public, n'y inscrire que ce qui peut etre publie.
export const company = {
  name: 'VitiAero',
  address: 'Rue Jacques Chardonne 2',
  npa: '1803',
  city: 'Chardonne',
  canton: 'Vaud',
  email: 'contact@vitiaero.ch',
  phone: '',
  ide: '',
  responsable: '',
  host: 'GitHub, Inc. (GitHub Pages), San Francisco, USA',
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
// Version hors ligne (npm run demo) : les fichiers 4K ne sont pas copies, on
// s'en tient donc a la 1080p.
const OFFLINE = import.meta.env.VITE_OFFLINE === '1';
const withoutUhd = (list) => (OFFLINE ? list.filter((v) => v.width <= 1920) : list);
export const videos = {
  // DJI Agras T55 en pulverisation sur un coteau (video DJI, 6 s en boucle).
  hero: [
    { src: asset('/videos/hero-t55.av1.mp4'), type: 'video/mp4; codecs="av01.0.08M.08"', width: 1920, height: 960, framerate: 25, bitrate: 3600000 },
    { src: asset('/videos/hero-t55.mp4'), type: 'video/mp4; codecs="avc1.640028"', width: 1920, height: 960, framerate: 25, bitrate: 6700000 },
  ],
  vignoble: withoutUhd([
    { src: asset('/videos/vignoble-fpv-2160.av1.mp4'), type: 'video/mp4; codecs="av01.0.13M.08"', width: 3840, height: 2160, framerate: 60, bitrate: 22900000 },
    { src: asset('/videos/vignoble-fpv-2160.mp4'), type: 'video/mp4; codecs="avc1.640034"', width: 3840, height: 2160, framerate: 60, bitrate: 23300000 },
    { src: asset('/videos/vignoble-fpv-1080.mp4'), type: 'video/mp4; codecs="avc1.640032"', width: 1920, height: 1080, framerate: 60, bitrate: 16400000 },
  ]),
};

// Visuels de la page Equipement (DJI Agras T55, et l'enregistrement d'ecran
// de l'application DJI fourni par le proprietaire). Chaque video existe en AV1
// puis en H.264, meme definition ; l'image fixe du meme nom est dans
// /images/equip. Les pieces sans video (pompe, gicleurs) n'ont qu'une photo.
const equip = (name, width, height, av1, avc, bitrate) => [
  { src: asset(`/videos/equip/${name}.av1.mp4`), type: `video/mp4; codecs="${av1}"`, width, height, framerate: 25, bitrate: Math.round(bitrate / 2) },
  { src: asset(`/videos/equip/${name}.mp4`), type: `video/mp4; codecs="${avc}"`, width, height, framerate: 25, bitrate },
];
export const equipVideos = {
  't55-vol': equip('t55-vol', 1920, 960, 'av01.0.08M.08', 'avc1.640028', 7200000),
  spray: equip('spray', 1386, 924, 'av01.0.08M.08', 'avc1.640028', 3200000),
  parcelles: equip('parcelles', 968, 460, 'av01.0.04M.08', 'avc1.64001f', 700000),
};

// Extrait du vol FPV au-dessus des terrasses d'Epesses (Lavaux), filme par le
// proprietaire : section « Le vignoble vu du ciel » de l'accueil. Le vol
// complet (plongeon depuis la tour compris), vitesse reelle, 60 images/s comme
// la source, 31 s en boucle (fondu entre la fin et le debut). 4K pour les
// grands ecrans, sinon 1080p.
export const film = withoutUhd([
  { src: asset('/videos/film-lavaux-2160.av1.mp4'), type: 'video/mp4; codecs="av01.0.13M.08"', width: 3840, height: 2160, framerate: 60, bitrate: 15100000 },
  { src: asset('/videos/film-lavaux-1080.av1.mp4'), type: 'video/mp4; codecs="av01.0.09M.08"', width: 1920, height: 1080, framerate: 60, bitrate: 7700000 },
  { src: asset('/videos/film-lavaux-1080.mp4'), type: 'video/mp4; codecs="avc1.64002a"', width: 1920, height: 1080, framerate: 60, bitrate: 9700000 },
]);

// Chemins des images. Si une image manque, un repli sobre s'affiche (voir CSS).
// Uniquement le DJI Agras T55 : les photos d'autres modeles ont ete retirees.
export const images = {
  lavaux: asset('/images/lavaux.jpg'),
};
