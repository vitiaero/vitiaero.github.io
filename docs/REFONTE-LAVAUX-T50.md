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
  (heure, numéros).
- Cartes arrondies (22 à 28 px), boutons en pastille avec flèche ronde, menu en
  pastille sombre, sections numérotées « 01 — ... », grand mot « VitiAero » en
  bas de page.
- Accueil : carte vidéo d'en-tête, chiffres clés, « Pourquoi le drone »,
  avantages en photos et cartes, étapes interactives, carte du T50, bandeau
  Lavaux, films du vignoble, FAQ par catégories, appel final.
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
| Section « En images » : deux emplacements vides | Deux extraits de 8 s du vol FPV d'Epesses (propriétaire) | `public/videos/film-lavaux-*.mp4`, 1280 x 720, en boucle. |
| Note « À confirmer avant publication » visible | Retirée (fr, de, en) | Remarque interne, pas un texte pour les visiteurs. |
| Polices chargées depuis Google Fonts | Polices hébergées sur le site | Aucune adresse IP de visiteur envoyée à Google (nLPD). |
| Vidéos sans bouton d'arrêt | Bouton pause / lecture sur chaque vidéo en boucle | Accessibilité (WCAG 2.2.2). |
| Étapes en opacité réduite | Étapes inactives en gris lisible | Contraste suffisant (WCAG 1.4.3). |
| Attribution de la carte masquée (ancien site) | Visible, en petit | Exigée par les conditions de swisstopo. |
| Textes en français seulement | Français, allemand, anglais | Le site est trilingue. |

## Animations

Toutes se coupent si l'appareil demande moins de mouvement
(`prefers-reduced-motion`) ; le contenu reste alors affiché d'emblée.

- En-tête de l'accueil : la carte apparaît, les mots du titre montent un à un,
  la ligne « Estimation gratuite — Devis détaillé » se trace, le « 40 L » compte.
- Menu : une pastille claire glisse jusqu'à la page ouverte (même chose dans le
  sous-menu de la page Équipement, qui suit la section lue).
- Défilement : blocs qui apparaissent, photos qui se dévoilent en rideau, phrase
  « Pourquoi le drone » qui s'allume mot à mot, parallaxe légère (grand « T50 »,
  drone, photo du Lavaux, appel final), lettres du grand « VitiAero » du bas.
- Survol : flèche des boutons qui glisse, zoom doux des photos, pastilles qui
  tournent, vidéos des pièces du drone qui se lancent.
- Étapes et itinéraires GPS : fondu entre les images, barre de progression.
- Changement de page : fondu court.

Aucune animation ne tourne en boucle sans fin, hormis les vidéos, qui ont
toutes un bouton pause.

## Contrôles effectués

- 34 contrôles automatiques (16 pages, téléphone 390 px et ordinateur 1440 px,
  plus le mouvement réduit) : aucune erreur de console, aucun débordement
  horizontal, aucune image cassée, un seul titre h1 par page, aucun bloc resté
  invisible.
- En-tête complet vérifié en allemand à 1280 px.
- Les visuels du drone restent ceux de DJI (crédit « Images et vidéos : DJI »),
  comme sur la version du 24 septembre : les droits restent à faire valider.
