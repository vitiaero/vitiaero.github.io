// Registre des medias publies (dossier public/).
// Chaque fichier servi par le site doit figurer ici, avec son auteur, sa
// licence et la preuve du droit d'usage commercial. La compilation echoue si un
// fichier de public/ n'est pas declare (scripts/check-media.mjs), et la page
// publique /credits est construite a partir de cette liste.
//
// rights :
//   'original' : cree par le proprietaire ou pour le projet ;
//   'licensed' : licence ecrite ou licence libre permettant l'usage commercial ;
//   'pending'  : droit non confirme. Autorise en pre-lancement seulement si le
//                fichier appartient au proprietaire ; bloque le lancement.
// declarationRequired : une declaration ecrite du proprietaire est attendue
// (date dans declarationSignedOn), sans quoi le lancement reste bloque.

export const MEDIA = [
  {
    id: 'fpv-epesses',
    files: [
      'videos/vignoble-1080.av1.mp4',
      'videos/vignoble-1080.mp4',
      'videos/vignoble-720.mp4',
      'images/vignoble-poster-1920.webp',
      'images/vignoble-poster-960.webp',
      'images/vignoble-poster-portrait.webp',
      'images/vignoble-terrasses.webp',
      'images/vignoble-epesses.webp',
      'images/og-vitiaero.jpg',
    ],
    title: {
      fr: 'Vol en immersion au-dessus du vignoble d’Epesses (Lavaux)',
      de: 'Immersiver Drohnenflug über den Rebbergen von Epesses (Lavaux)',
      en: 'Immersive drone flight over the Epesses vineyards (Lavaux)',
    },
    author: 'Adrien Delhay',
    rights: 'original',
    changes: {
      fr: 'Vidéo réencodée pour le web ; images fixes et image de partage extraites de la vidéo.',
      de: 'Video für das Web neu kodiert; Standbilder und Vorschaubild aus dem Video entnommen.',
      en: 'Video re-encoded for the web; stills and share image taken from the video.',
    },
    evidence: 'Déclaration du propriétaire, docs/CREDITS-IMAGES.txt (24.9.2026).',
    declarationRequired: true,
    declarationSignedOn: null, // F1
  },
  {
    id: 'lavaux-kohler',
    files: ['images/lavaux-1600.webp'],
    title: {
      fr: 'Lavaux, vignobles en terrasses au bord du Léman (2015)',
      de: 'Lavaux, Rebterrassen am Genfersee (2015)',
      en: 'Lavaux, terraced vineyards on the shore of Lake Geneva (2015)',
    },
    author: 'Joachim Kohler (JoachimKohler-HB)',
    source: 'https://commons.wikimedia.org/wiki/File:Lavaux_vignobles_en_terrasses_au_bord_du_L%C3%A9man_(2015).jpg',
    license: { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
    rights: 'licensed',
    changes: {
      fr: 'Recadrée, redimensionnée et convertie au format WebP. Cette version est diffusée sous la même licence.',
      de: 'Zugeschnitten, verkleinert und ins WebP-Format umgewandelt. Diese Fassung steht unter derselben Lizenz.',
      en: 'Cropped, resized and converted to WebP. This version is distributed under the same licence.',
    },
    evidence: 'Licence indiquée sur la page Wikimedia Commons, vérifiée le 24.9.2026.',
  },
  {
    id: 'logo',
    files: ['images/logo-vitiaero.webp', 'images/logo-vitiaero-full.webp'],
    title: { fr: 'Logo VitiAero', de: 'Logo VitiAero', en: 'VitiAero logo' },
    author: null, // F2 : origine a confirmer
    rights: 'pending',
    changes: {
      fr: 'Redimensionné pour le web.',
      de: 'Für das Web verkleinert.',
      en: 'Resized for the web.',
    },
    evidence: 'Logo du projet ; origine (création propre, graphiste ou outil) à documenter.',
  },
  {
    id: 'icons',
    files: ['favicon.svg', 'apple-touch-icon.png'],
    title: { fr: 'Icône du site', de: 'Website-Symbol', en: 'Site icon' },
    author: 'VitiAero',
    rights: 'original',
    evidence: 'Dessin vectoriel créé dans le projet.',
  },
  {
    id: 'inter',
    files: ['fonts/inter-latin-3.19.woff2', 'fonts/Inter-OFL.txt'],
    title: { fr: 'Police Inter 3.19', de: 'Schrift Inter 3.19', en: 'Inter 3.19 typeface' },
    author: 'The Inter Project Authors',
    source: 'https://github.com/rsms/inter',
    license: { name: 'SIL Open Font License 1.1', url: 'fonts/Inter-OFL.txt' },
    rights: 'licensed',
    changes: {
      fr: 'Réduite aux caractères latins et aux graisses 400 à 900.',
      de: 'Auf lateinische Zeichen und die Schriftstärken 400 bis 900 reduziert.',
      en: 'Reduced to Latin characters and weights 400 to 900.',
    },
    evidence: 'Licence et copyright contenus dans le fichier de police.',
  },
];

// Fichiers de public/ qui ne sont pas des medias (textes techniques,
// facultatifs : CNAME seulement pour un domaine propre sur GitHub Pages).
export const NON_MEDIA_FILES = ['CNAME'];

// Medias qui empechent encore le lancement : droit non confirme, ou
// declaration du proprietaire attendue.
export function mediaBlockers(media = MEDIA) {
  const out = [];
  for (const m of media) {
    if (m.rights === 'pending') out.push({ id: `media:${m.id}`, reason: 'rights' });
    else if (m.declarationRequired && !m.declarationSignedOn) out.push({ id: `media:${m.id}`, reason: 'declaration' });
  }
  return out;
}

export function mediaForFile(path, media = MEDIA) {
  const clean = String(path).replace(/^\/+/, '');
  return media.find((m) => m.files.includes(clean)) || null;
}
