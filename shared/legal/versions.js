// Historique des versions des documents juridiques (fichier genere par
// npm run legal:version, a ne pas modifier a la main). La derniere entree de
// chaque liste est la version en vigueur ; les precedentes restent acceptees
// par le serveur pour les demandes envoyees depuis une page plus ancienne, et
// la version exacte est enregistree avec chaque demande.
export const HISTORY = {
  mentions: [
    { version: '2026-09-27', hash: 'f8a9e6222c4b' },
    { version: '2026-09-27.2', hash: 'fd3db80a25b3' },
  ],
  privacy: [
    { version: '2026-09-27', hash: 'dc00ebcd1586' },
    { version: '2026-09-27.2', hash: 'f9a16262c565' },
    { version: '2026-10-07', hash: '6d67a5039b95' },
  ],
  cookies: [
    { version: '2026-09-27', hash: '9774ac970897' },
  ],
  cgv: [
    { version: '2026-09-27', hash: '8c6ad19ac281' },
    { version: '2026-09-27.2', hash: '977be1aa55eb' },
  ],
  terms: [
    { version: '2026-09-27', hash: '4c055035c50e' },
    { version: '2026-09-27.2', hash: '590260be794c' },
    { version: '2026-10-07', hash: '312d8ed37c94' },
  ],
  credits: [
    { version: '2026-09-27', hash: 'cfd9eac5653c' },
  ],
};
