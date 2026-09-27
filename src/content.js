// Medias communs a toutes les langues. Les coordonnees de l'entreprise sont
// dans shared/business.js (source unique, sans valeur inventee), les droits de
// chaque fichier dans shared/media.js.
import { asset } from './config.js';

// Video d'ambiance : images du vignoble d'Epesses filmees par le proprietaire.
// Le composant BgVideo retient la premiere version que l'appareil lit de facon
// fluide ; rien n'est charge sur telephone ni en mouvement reduit.
// type : codec exact (profil et niveau lus dans les fichiers).
// bitrate : debit moyen reel du fichier (bits par seconde).
export const videos = {
  vignoble: [
    { src: asset('/videos/vignoble-1080.av1.mp4'), type: 'video/mp4; codecs="av01.0.08M.08"', width: 1920, height: 1080, framerate: 30, bitrate: 2220000 },
    { src: asset('/videos/vignoble-1080.mp4'), type: 'video/mp4; codecs="avc1.640029"', width: 1920, height: 1080, framerate: 30, bitrate: 3580000 },
    { src: asset('/videos/vignoble-720.mp4'), type: 'video/mp4; codecs="avc1.640028"', width: 1280, height: 720, framerate: 30, bitrate: 1840000 },
  ],
};

// Images, avec leurs dimensions reelles : le navigateur reserve la place avant
// le chargement (pas de saut de mise en page).
export const images = {
  posterWide: { src: asset('/images/vignoble-poster-1920.webp'), width: 1920, height: 1080 },
  posterSmall: { src: asset('/images/vignoble-poster-960.webp'), width: 960, height: 540 },
  posterPortrait: { src: asset('/images/vignoble-poster-portrait.webp'), width: 720, height: 1280 },
  terraces: { src: asset('/images/vignoble-terrasses.webp'), width: 1200, height: 900 },
  epesses: { src: asset('/images/vignoble-epesses.webp'), width: 1200, height: 900 },
  lavaux: { src: asset('/images/lavaux-1600.webp'), width: 1600, height: 1177 },
  logo: { src: asset('/images/logo-vitiaero.webp'), width: 321, height: 120 },
  logoFull: { src: asset('/images/logo-vitiaero-full.webp'), width: 630, height: 630 },
};
