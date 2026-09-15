# Prompt de reprise — Projet VitiAero

Copie tout ce bloc dans une nouvelle discussion Claude Code pour continuer le projet.

---

Je reprends un projet existant nommé **VitiAero**. Voici tout le contexte. Lis
le code avant de modifier, garde le style et les conventions, et ne casse rien.

## Contexte
- Projet d'étude (CPNV, PAE, Suisse romande). Service d'**épandage viticole par
  drone**. Drone mis en avant : **DJI Agras T50** (réservoir **40 litres**).
- Le vigneron demande **une estimation en ligne, sans engagement** ; l'équipe
  renvoie ensuite un **devis détaillé**. Public : vignerons non techniciens.
- Site **vitrine + application**, rendu premium (inspiration DJI), 100% responsive.

## Emplacement et lancement
- Dossier : la racine du dépôt (celle qui contient `package.json`).
- Lancer TOUT avec une seule commande : `npm run dev`
  (concurrently → API Express sur `:3001` + client Vite sur `:5173`, proxy `/api`).
- Base SQLite : `server/data/app.sqlite` (recréée et re-remplie si on la supprime).

## Mise en ligne
- **Deux scenarios** (voir `docs/DEPLOIEMENT.md`) : A. site sur **GitHub Pages**
  (workflow `.github/workflows/deploy-pages.yml`) + API Node sur un hebergeur
  separe ; B. **un seul service Node** (`npm start` sert `dist/` et l'API).
- Site statique : `VITE_API_URL` (adresse de l'API, publique) et `VITE_BASE_PATH`
  (chemin du depot sur GitHub Pages, fourni par le workflow). Chemins des fichiers
  de `public/` toujours via `asset()` de `src/config.js`, jamais "/images/..." en dur.
- API : `ALLOWED_ORIGINS` (CORS strict), `TRUST_PROXY`, `ADMIN_PASSWORD`,
  `DEMO_DATA=1` pour creer le client et les codes promo fictifs en ligne.
  En production sans `ADMIN_PASSWORD`, un mot de passe aleatoire est genere et
  affiche une fois dans les journaux : `admin1234` n'existe plus en ligne.
- **CSP** : source unique `shared/security.js` (meta en statique, en-tete cote
  Node). Tout nouveau service externe doit y etre ajoute.
- **`public/robots.txt` bloque l'indexation** pendant la phase de lancement.
  Les regles a reactiver sont commentees dans le fichier.
- Marche a suivre complete et limites du gratuit : voir `docs/DEPLOIEMENT.md`.

## Stack
- Front : **React 18 + Vite 7 en JavaScript (PAS TypeScript), React Router 7**, CSS
  maison dans `src/styles.css` (**pas de Tailwind**). Carte : **Leaflet + Turf**.
- Back : **Node + Express**, **SQLite via sql.js** (WASM, aucune compilation native).
- Police : **Inter auto-hébergée** (`public/fonts/Inter-Variable.ttf`).

## Structure
- `src/pages/` : Home, Service, Estimation, Devis, Confirmation, About, Contact,
  Login, Register, Account, Admin, Legal, NotFound.
- `src/components/` : Header, Footer, MapDraw, Reveal, CountUp, Icons, Img, BgVideo,
  PrivacyBanner, PrintHeader, LaunchNotice, MobileCta, FaqSchema.
- `src/content.js` (coordonnées, vidéos, images), `src/api.js`, `src/auth.jsx`.
- **Langues (FR / DE / EN)** : `src/i18n/` (`fr.js` = référence, `de.js` en
  orthographe suisse, `en.js`), moteur `src/i18n/index.jsx` (`useI18n()` →
  `t`, `lang`, `locale`). Clé absente = texte français. Sélecteur :
  `src/components/LangSwitch.jsx`. Pages légales : un fichier par langue dans
  `src/pages/legal/` (la version française fait foi, à faire valider).
  Choix mémorisé dans `vitiaero_lang` (listé sur la page cookies). Les valeurs
  enregistrées (traitement, période, statuts) restent en français côté serveur,
  traduites à l'affichage. L'administration reste en français.
- `server/index.js` (API + sécurité), `server/db.js` (schéma + seed).
- **Tarifs et estimation en ligne** : `shared/pricing.js` (grille du propriétaire,
  départ des déplacements = Chardonne, calcul du prix). Utilisé par le site
  (`src/pages/Estimation.jsx`, prix en direct) et par le serveur, qui recalcule
  le prix à l'envoi et ignore la surface envoyée par le navigateur. Distance par
  la route via `POST /api/route-distance` (service OSRM, appelé par le serveur,
  repli à vol d'oiseau). Colonnes ajoutées à `estimations` : passes, options,
  distance_km, distance_method, estimate.
- **Page Contact** (`src/pages/Contact.jsx`) : coordonnées de l'entreprise (lues
  dans `company`, les valeurs entre crochets restent affichées telles quelles) et
  formulaire court. `POST /api/contact` (10 par heure et par IP, champ piège)
  enregistre le message dans la table `messages`. **Aucun courriel n'est envoyé** :
  l'équipe lit les messages dans l'administration, onglet Messages
  (`GET /api/admin/messages`, `PATCH /api/admin/messages/:id` pour marquer traité).
- `scripts/download-images.js`, `docs/SECURITY.md`.
- Documentation dans `docs/` (REPRISE, SECURITY, DEPLOIEMENT), point d'entrée `README.md`.
- `_hors-projet/` : vidéos et images sources, police d'origine, ancienne démo hors ligne,
  prototype et skill. Ignoré par git, jamais publié. Détail dans son `LISEZ-MOI.md`.

## Phase de lancement (IMPORTANT)
- L'activité n'a pas encore démarré. `preLaunch` dans `src/content.js` affiche un
  bandeau discret en haut de chaque page (`LaunchNotice`) et la page À propos
  porte un encadré « Projet VitiAero, lancement prochain ».
  **Passer `preLaunch` à false le jour du lancement.**
- Les textes évitent le présent d'habitude (« que nous traitons au quotidien »
  est devenu « pour lesquels ce service est pensé »). Aucun nombre de clients,
  d'hectares ni d'années d'expérience n'est annoncé.
- Aucune autorisation n'est présentée comme obtenue. La page `/le-service`
  (section `#reglementation`) liste les exigences suisses et précise que les
  démarches sont en préparation.

## Fonctionnalités en place
- **Accueil** : hero avec **vidéo T50** (poster + boucle muette, masquée sur
  mobile), chiffres clés (compteurs animés), pourquoi le drone, avantages,
  « comment ça marche » (4 étapes), section DJI Agras T50, bandeau Lavaux, FAQ, CTA.
- **Estimation en 4 étapes** : carte → votre besoin (passages, situations) →
  coordonnées → estimation chiffrée puis envoi. Prix calculé en direct.
  Carte : tracé de parcelles au **polygone (points illimités)**, couleur **ORANGE**,
  calcul de surface (m² et ha), fonds **swisstopo** (Satellite/Carte/Plan),
  recherche de commune, attribution masquée. Case de **consentement** avant envoi.
  **Import de parcelles** : bouton « Importer un fichier » (GeoJSON ou KML, 5 Mo au
  maximum). Le fichier est lu dans le navigateur, jamais envoyé avant la demande ;
  seuls les contours extérieurs situés en Suisse sont retenus (50 parcelles et
  500 points au maximum), puis la carte se cadre dessus.
  **Estimation en PDF** : bouton « Télécharger en PDF » à l'étape 4 et sur la page
  de confirmation. Il ouvre la fenêtre d'impression du navigateur ; la mise en page
  vient du bloc `@media print` de `src/styles.css` (en-tête `PrintHeader`, classes
  `.printable`, `.no-print` et `.print-only`). Aucune bibliothèque ajoutée.
- **Comptes** : inscription/connexion, espace client, **fidélité** (Bronze/Argent/Or),
  historique de points, **codes promo**.
- **Admin** : liste des demandes, détail (carte en lecture seule + **export GeoJSON**),
  changement de statut, messages du formulaire de contact, clients, codes promo.
- **Page « Le service »** (`/le-service`, `src/pages/Service.jsx`) : déroulement en
  4 étapes, conditions d'intervention (relief, obstacles, météo, accès,
  réglementation), sécurité & réglementation suisse (`#reglementation`),
  engagements (`#engagements`), maquette du rapport d'intervention
  (`#rapport`, données fictives signalées comme telles).
- **Devis personnalisé** (`/devis`) : formulaire avec commune, surface annoncée,
  passages souhaités et **pièces jointes** (images ou PDF, 3 fichiers de 4 Mo au
  maximum). `POST /api/quote` les enregistre sous un nom aléatoire dans
  `server/data/uploads/` (ignoré par git) ; seul un compte équipe peut les ouvrir
  via `GET /api/admin/messages/:id/files/:index`.
- **FAQ** : 12 questions en 3 catégories (demande & devis, drone & intervention,
  sécurité & réglementation) + données structurées FAQPage (`FaqSchema`).
- **Mobile** : barre fixe « Demander un devis » (`MobileCta`), masquée sur les
  pages qui portent déjà l'action. Le bouton « Appeler » n'apparaît que si un
  numéro est renseigné dans `company`.
- **Pages légales** : confidentialité (nLPD), mentions légales, conditions (liens footer).
- **TVA** : les prix sont annoncés hors TVA, avec le taux normal suisse de 8,1 %.
  Reste à confirmer si l'entreprise est assujettie (page Estimation et CGV).

## Design system
- Thème **clair / vert / nature**. Tokens dans `:root` de `src/styles.css`
  (`--bg #f8faf2`, `--accent #4c8231`, `--forest #223016`…).
- Titres et texte en **Inter**. Logo **VitiAero** (`public/images/logo-vitiaero.png`
  horizontal, `logo-vitiaero-full.png` complet) ; le fond blanc du logo est effacé
  dans le header via `mix-blend-mode: multiply` (donc header opaque clair).
- **Effet « liquid glass »** adapté au thème clair : cartes/panneaux en verre dépoli
  (`backdrop-filter: blur` + liseré `::before`), avec des **nuées vert/lac** en fond
  (`body` + `.bg-soft`/`.bg-warm`) pour donner la profondeur du verre.
- **Parcelles de la carte : ORANGE (#e8781f), jamais vert.**

## Assets
- `public/images/` : `hero-poster.jpg`, `drone-cutout.png` (T50 détouré transparent),
  `t50-rows.jpg`, `t50-flight.jpg`, `lavaux.jpg` (Dézaley), `vignes-pente.jpg`,
  logos.
- `public/videos/` : chaque vidéo existe en 3 versions, choisies par
  `src/components/BgVideo.jsx` selon l'écran et l'appareil (liste dans `videos`
  de `src/content.js`) : 4K AV1, 4K H.264, 1080p H.264. Rien n'est chargé sur mobile.
  - `hero-*` : clip T50 de 8 s, recadré pour retirer les sous-titres anglais, muet.
  - `vignoble-fpv-*` : plans FPV d'Épesses (0:29 à 0:42 puis 0:55 à 1:14), 4K 60 i/s.
- Vidéos sources dans `_hors-projet/sources-videos/` : `videoplayback (1).mp4`
  (promo DJI T50, 4K AV1) et `Epesse 1.mov` (FPV, 4K 60 i/s).
- **Page Équipement** (`src/pages/Equipement.jsx`) : DJI Agras T50, système de
  pulvérisation & préparation (générateur DJI D12000iEP), GPS & cartographie,
  avec un sous-menu collant. Visuels dans `public/videos/equip/` (AV1 + H.264) et
  `public/images/equip/` (images fixes, affichées sur mobile). Source : page
  officielle ag.dji.com/fr/t50, `vidéo du drone qui se déplie.webm` et
  `drone cartographie.webm` (fichiers fournis, origine DJI, rangés dans
  `_hors-projet/sources-videos/`). Textes courts :
  clé `equipment` de `src/i18n/*.js`, chiffres DJI uniquement. Droits des
  visuels DJI à vérifier (voir docs/CREDITS-IMAGES.txt).
- **ffmpeg** (réencodage des vidéos) : installé sur le poste du propriétaire,
  hors du dépôt (par exemple avec `winget install Gyan.FFmpeg`).

## Sécurité et conformité (voir docs/SECURITY.md)
- Audit complet du 14.09.2026 dans `docs/SECURITY.md` (corrections, limites de
  GitHub Pages, points juridiques, réglages GitHub à faire).
- En-têtes HTTP de sécurité et CSP, **anti-force brute** par limiteur nommé
  (20/15 min), **sessions de 7 jours stockées par empreinte SHA-256**, mots de
  passe **PBKDF2 600 000 itérations**, SQL paramétré, validation stricte des
  entrées, pièces jointes contrôlées par signature binaire, erreurs génériques.
- **nLPD** : pages légales (textes MODÈLES à compléter/relire), consentement,
  bandeau vie privée, minimisation. Je ne suis pas juriste.

## Identifiants de démonstration
- Admin : `admin@vitiaero.ch` / `admin1234`
- Client : `client@vitiaero.ch` / `client1234`
- Codes promo : `VIGNE10`, `LAVAUX15` (et `ANCIEN` inactif).

## Conventions / ton (IMPORTANT)
- Français de Suisse romande, phrases courtes. **Aucun jargon** (pas de RTK, IP67,
  débit…). **Aucun emoji. Aucun tiret cadratin (—).** Accents corrects partout.

## Pièges techniques connus
- `overflow-x: clip` sur `html, body` (pas `hidden`, sinon `position: sticky` casse).
- Génération vidéo Higgsfield **bloquée** sur le plan gratuit (« Requires basic plan
  or higher ») → on utilise la vraie vidéo du client, pas de génération.
- Le panneau navigateur intégré est souvent caché → pour vérifier visuellement,
  piloter **Chrome headless via CDP** (port 9222) et faire des captures, ou vérifier
  via le DOM.

## État actuel
Tout fonctionne, aucune erreur console, mobile sans débordement horizontal.

## Ce que je voudrais faire ensuite
[Écris ici ta prochaine demande.]
