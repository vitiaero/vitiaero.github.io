# Refonte « Lavaux et T50 » (27 septembre 2026)

Nouvelle apparence du site, d'après la maquette fournie par le propriétaire
(`Refonte site Lavaux et T50.zip` : pages Accueil et Équipement). Le contenu et
le fonctionnement restent ceux de la version du 24 septembre (commit `2a6e752`,
drone DJI Agras T50). Branche Git : `refonte-lavaux-t50`.

## Ce qui a été repris de la maquette

- Fond pierre claire `#f1f1ee`, encre `#141513`, un seul accent vert citron
  `#d6f04a` (toujours avec du texte foncé dessus), vert lisible `#4f6b12` pour
  les liens.
- Police Manrope (titres et texte), JetBrains Mono pour les petits repères
  (numéros des étapes, nombre de questions, fiches techniques).
- Cartes arrondies (22 à 28 px), boutons en pastille avec flèche ronde, menu en
  pastille sombre.
- Accueil : carte vidéo d'en-tête, chiffres clés, « Pourquoi le drone »,
  avantages en photos et cartes, les 4 étapes de la demande, carte du T50 (grand
  « T50 » en fond), bandeau Lavaux, film du vignoble, FAQ par catégories, appel
  final.
- Équipement : en-tête vidéo, sous-menu collé, grille « Le drone »,
  pulvérisation (vidéos des pièces au survol), préparation, GPS & cartographie
  (bascule entre les deux itinéraires), appel final.
- Les autres pages (Le service, Estimation, Devis, Contact, À propos, compte,
  administration, pages légales) prennent les mêmes couleurs, polices et
  arrondis. Le service reçoit un en-tête photo comme l'accueil.

## Ce qui a été corrigé par rapport à la maquette

| Maquette | Site | Raison |
|---|---|---|
| « Lutry, VD » au-dessus de l'en-tête | « Canton de Vaud » | Aucune adresse à Lutry n'est confirmée ; ne rien inventer. |
| Liens vers des ancres de l'accueil (`#service`, `#estimation`...) | Vraies pages du site | Le site a une page par sujet. |
| Textes raccourcis (FAQ à 7 questions, avantages) | Textes vérifiés du site (12 questions) | Les textes du site sont relus et traduits. |
| Section « En images » : deux emplacements vides | Un seul plan de 8 s du vol FPV d'Epesses (propriétaire) | `public/videos/film-lavaux.mp4`, 1920 x 1080, en boucle. |
| Note « À confirmer avant publication » visible | Retirée (fr, de, en) | Remarque interne, pas un texte pour les visiteurs. |
| Polices chargées depuis Google Fonts | Polices hébergées sur le site | Aucune adresse IP de visiteur envoyée à Google (nLPD). |
| Vidéos sans bouton d'arrêt | Bouton pause / lecture sur chaque vidéo en boucle | Accessibilité (WCAG 2.2.2). |
| Attribution de la carte masquée (ancien site) | Visible, en petit | Exigée par les conditions de swisstopo. |
| Textes en français seulement | Français, allemand, anglais | Le site est trilingue. |

## Ajustements après relecture (27 septembre 2026)

Demandés par le propriétaire après la première version, pour un site plus
épuré et plus lisible :

- **Retiré** : l'heure affichée dans l'en-tête de l'accueil ; la carte « Drone
  retenu : DJI Agras T50, réservoir de 40 litres » de l'en-tête ; le grand mot
  « VitiAero » en bas de toutes les pages ; les numéros « 01 — » des intitulés ;
  les étiquettes décoratives de l'en-tête de l'accueil et de la page Équipement.
- **Photos** : la 2e photo de « Pourquoi utiliser un drone ? » montrait un autre
  modèle ; elle est remplacée par le T50 en vol. Le site n'affiche plus que le
  DJI Agras T50. Les photos placées à côté des 4 étapes, sans rapport avec
  elles, sont retirées : les étapes forment une liste simple.
- **Le vignoble vu du ciel** : un seul plan au lieu de deux.
- **Menu du téléphone** (trois traits) : il s'ouvrait dans une bande de 56 px.
  Cause : le flou de l'en-tête (`backdrop-filter`) servait de cadre au menu. Le
  flou est désormais porté par un calque (`.header::before`), et le menu occupe
  tout l'écran.
- **Lisibilité** : un seul style d'intitulé (point vert et petites capitales,
  composant `Kicker`) sur tout le site ; titres de section alignés à gauche ;
  textes des cartes à 15-16 px ; en français, espace insécable automatique
  avant `?` `!` `:` `;` (un « ? » ne tombe plus seul en début de ligne).
- **Contact** : le téléphone et l'adresse indiquent « Bientôt disponible » tant
  qu'ils ne sont pas renseignés dans `src/content.js` (au lieu de
  « [TÉLÉPHONE] »).
- **Barre du bas sur téléphone** : elle mène à l'estimation, comme le bouton de
  l'en-tête.
- **Aperçu** : `npm run apercu` lance le site seul (sans l'API) sur
  `http://localhost:5180`, sans ouvrir de navigateur. C'est l'entrée
  « VitiAero - nouvelle version (Lavaux T50) » du panneau d'aperçu de
  l'application Claude.

Pour retrouver un élément retiré, il reste dans l'historique Git :
`git checkout 7552204 -- <fichier>` (par exemple
`src/components/SwissClock.jsx`).

## Animations

Toutes se coupent si l'appareil demande moins de mouvement
(`prefers-reduced-motion`) ; le contenu reste alors affiché d'emblée.

- En-tête de l'accueil : la carte vidéo apparaît, les mots du titre montent un
  à un ; les chiffres clés comptent jusqu'à leur valeur.
- Menu : une pastille claire glisse jusqu'à la page ouverte (même chose dans le
  sous-menu de la page Équipement, qui suit la section lue).
- Défilement : blocs qui apparaissent, photos qui se dévoilent en rideau,
  numéros des étapes qui passent au vert citron, parallaxe légère (grand
  « T50 », drone, photo du Lavaux, appel final).
- Survol : flèche des boutons qui glisse, zoom doux des photos, pastilles qui
  tournent, vidéos des pièces du drone qui se lancent.
- Itinéraires GPS (page Équipement) : fondu entre les deux images.
- Changement de page : fondu court.

Aucune animation ne tourne en boucle sans fin, hormis les vidéos, qui ont
toutes un bouton pause.

## Contrôles effectués

- 34 contrôles automatiques (16 pages, téléphone 390 px et ordinateur 1440 px,
  plus le mouvement réduit) : aucune erreur de console, aucun débordement
  horizontal, aucune image cassée, un seul titre h1 par page, aucun bloc resté
  invisible.
- Menu du téléphone ouvert : il occupe tout l'écran sous l'en-tête (714 px sur
  un écran de 844 px), les 6 liens sont visibles.
- Version hors ligne (`npm run demo`) contrôlée en `file://`.
- En-tête complet vérifié en allemand à 1280 px.
- Les visuels du drone restent ceux de DJI (crédit « Images : DJI »), comme sur
  la version du 24 septembre : les droits restent à faire valider.
