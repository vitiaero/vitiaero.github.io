# Registre des médias du site VitiAero

Mis à jour le 26 septembre 2026. Ce registre trace l'origine, les droits et
l'usage de chaque photo et vidéo du drone.

## 1. Médias utilisés : illustrations générées d'après des vues du T55 (série 2)

**Décisions du propriétaire (26.9.2026)** : ne pas utiliser les photos et vidéos
de DJI (droits) ; générer des visuels « ultra-réalistes » en prenant comme
source de vérité 14 rendus du DJI Agras T55 fournis par le propriétaire ; modèle
plus coûteux accepté, sans dépasser l'abonnement.

- Outil : Higgsfield (compte du propriétaire, abonnement « plus »). Images :
  GPT Image 2.5 avec images de référence. Vidéos : Kling 3.0 pro, à partir d'une
  image générée, sans son.
- Références : 14 rendus envoyés à Higgsfield le 26.9.2026 (`t55-ref-04` à
  `t55-ref-17`). **Origine des rendus à confirmer** (vraisemblablement DJI) :
  voir la conformité, point sur les références.
- Fidélité : chaque résultat a été comparé aux rendus : quatre hélices simples à
  deux pales et pointes orange (et non huit hélices coaxiales, erreur de la
  série 1), bras avant plus hauts que les bras arrière, cylindre radar à
  l'avant, réservoir blanc à couvercle gris et languette orange à l'arrière,
  batterie à ailettes, buses centrifuges sous les moteurs. Règle ajoutée par le
  propriétaire : **les jets de pulvérisation partent seulement des deux bras
  arrière**.
- Conditions de Higgsfield (26.7.2026) : pas de revendication de propriété, pas
  de restriction d'usage commercial, l'utilisateur reste responsable des droits
  de tiers.
- Crédits de la série 2 : 57,5. Solde après la série : 0,75 crédit, insuffisant pour toute nouvelle génération (la moins chère coûte 2,75 crédits pour une image et 4,5 pour une vidéo).
- Textes alternatifs : dans `src/i18n/*.js` (clés `alt`, `heroAlt`,
  `parts[].alt`), tous préfixés « Illustration : ». Crédit sur le site :
  « Illustration générée par IA » et mentions légales.
- Formats publiés : AVIF puis WebP en deux largeurs, JPEG de repli, grain très
  léger contre les paliers de couleur. Vidéos : AV1 puis H.264, 1920 × 1080,
  24 i/s, sans son.

| Tâche | Usage | Modèle et réglages | Références | Fichier du site | Coût | Statut |
|---|---|---|---|---|---|---|
| 88e4ab1a | Accueil, en-tête (image fixe) et image de partage | GPT Image 2.5, qualité xhigh, 2k, 16:9 | 13 trois quarts ; 12 trois quarts, haut ; 17 trois quarts, avant ; 15 face ; 16 profil ; 11 moteur et buse | archivée hors du site | 4,5 | Retirée : un jet part d'un bras avant (non conforme : deux buses standard, à l'arrière). |
| 020a4ea2 | Accueil, vidéo d'en-tête (8 s) | Kling 3.0 pro, 8 s, 16:9, sans son | départ : 88e4ab1a | archivée hors du site | 14 | Retirée : jugée peu réaliste par le propriétaire (flou d'hélice pâteux vers 4,3 s). |
| d54409e8 | Accueil, « Pourquoi le drone » | GPT Image 2.5, qualité high, 2k, 4:3 | 16 profil ; 13 trois quarts ; 11 moteur et buse ; 15 face | `images/t55/accueil-coteau-*` | 2,75 | Utilisée (accueil « Pourquoi le drone » et page Équipement, pulvérisation). Conforme : deux jets sous les bras arrière. |
| e4b001b2 | Accueil, drone détouré | GPT Image 2.5, qualité high, 2k, 4:3, fond transparent | 13 trois quarts ; 12 trois quarts, haut ; 17 trois quarts, avant ; 15 face | archivée hors du site | 2,75 | Retirée : jugée bizarre sur le fond vert. |
| e91373f3 | Équipement, en-tête (image fixe) | GPT Image 2.5, qualité high, 2k, 16:9 | 13 trois quarts ; 17 trois quarts, avant ; 12 trois quarts, haut ; 15 face ; 16 profil | `images/t55/bord-vigne-*` | 2,75 | Utilisée (en-tête Équipement et section « Notre drone » de l'accueil). À remplacer quand des crédits seront disponibles (jugée peu réaliste). |
| c8a1e71b | Équipement, sécurité | GPT Image 2.5, qualité high, 2k, 16:9 | 09 radar et batterie ; 15 face ; 05 trois quarts, replié ; 13 trois quarts | `images/t55/radar-avant-*` | 2,75 | Utilisée, à refaire (jugée bizarre). |
| c0e1edcd | Équipement, pulvérisation | GPT Image 2.5, qualité high, 2k, 16:9 | 16 profil ; 13 trois quarts ; 11 moteur et buse ; 15 face | archivée hors du site | 2,75 | Retirée : un jet part d'un bras avant (non conforme). |
| 4f013ac5 | Équipement, pièce « pompes » | GPT Image 2.5, qualité high, 2k, 1:1 | 10 pompes ; 07 avant, bas ; 15 face | `images/t55/pompe-*` | 2,75 | Utilisée. |
| e842292a | Équipement, pièce « buses » | GPT Image 2.5, qualité high, 2k, 1:1 | 11 moteur et buse ; 16 profil | `images/t55/buse-*` | 2,75 | Utilisée. |
| 8f3f7047 | Équipement, pièce « réservoir » | GPT Image 2.5, qualité high, 2k, 1:1 | 08 réservoir et batterie ; 06 dessus, réservoir | `images/t55/reservoir-*` | 2,75 | Utilisée, à refaire (plus concrète). |
| 342c1bb2 | Équipement, batterie | GPT Image 2.5, qualité high, 2k, 3:2 | 09 radar et batterie ; 06 dessus, réservoir ; 08 réservoir et batterie | `images/t55/batterie-*` | 2,75 | Utilisée, à refaire (autre plan). |
| 15b4a038 | Équipement, préparation du vol | GPT Image 2.5, qualité high, 2k, 16:9 | 14 dessus, déplié ; 04 dessus, replié | `images/t55/vue-du-ciel-*` | 2,75 | Utilisée, à remplacer par la radiocommande. |
| 315bb74d | Équipement, vidéo d'en-tête (5 s, depuis 24) | Kling 3.0 pro, 5 s, 16:9, sans son | départ : e91373f3 | `videos/t55-equipement.*` | 8,75 | Utilisée, à refaire (jugée peu réaliste). |
| aed43a1a | Accueil, « Notre drone » ; départ prévu de la future vidéo d'accueil | GPT Image 2.5, qualité high, 2k, 16:9 | 13 trois quarts ; 12 trois quarts, haut ; 17 trois quarts, avant ; 15 face ; 11 moteur et buse | archivée hors du site | 2,75 | Retirée : trois jets, dont un sous un bras avant (non conforme). |

### Prompts exacts (série 2)

**88e4ab1a (Accueil, en-tête (image fixe) et image de partage)**

> The reference images show the exact design of the agricultural spraying drone to use. Reproduce this exact drone faithfully, with identical proportions and parts: four long carbon-fibre arms in an X layout, each ending in ONE large two-blade black propeller with orange tips (four propellers in total, no coaxial or stacked rotors); the two front arms mounted higher than the two rear arms; a light-grey faceted central body; a tall light-grey cylindrical radar and vision module standing upright at the front; a white 50-litre tank with a round grey lid and an orange tab at the rear; the battery with heat-sink fins between them; black tubular landing gear; small black centrifugal spray nozzles hanging under the two rear motors. Nothing added, nothing missing.
>
> Ultra-photorealistic premium advertising photograph for a website hero. Early morning in the Lavaux terraced vineyards, Switzerland: rows of green vines on dry-stone-walled terraces descending the steep hillside, Lake Geneva softly visible far below in the distance, warm golden sunrise light, light morning haze over the lake. No people, no village, no recognisable buildings or landmarks in the foreground.
>
> The drone flies slowly at low altitude, about two metres above the vine rows, seen from a three-quarter front angle slightly above it. It sprays a light, controlled, translucent fine mist from the nozzles under its rear motors, falling only onto the vine foliage below, never excessive or opaque. Propellers spinning with natural motion blur on the blade tips; the rotor wash gently moves the vine leaves.
>
> Composition: the drone sits in the right third of the frame, a calm negative space on the left (soft vineyard, lake and sky) for the website headline. Palette of deep elegant greens and warm stone, subtle reflections on the lake, realistic depth of field, extremely sharp mechanical detail on the drone, natural cinematic colour grading, full-frame camera, 35 mm lens. No text, no logos, no watermark, no lettering, no CGI look, no invented parts, no extra rotors or arms.

**020a4ea2 (Accueil, vidéo d'en-tête (8 s))**

> Ultra-photorealistic premium cinematic advertising shot. The agricultural spraying drone flies very slowly and steadily forward along the vine rows at a constant low height, spraying a light, controlled, translucent fine mist that settles only on the vine foliage below. Its four propellers spin fast with natural motion blur; the drone keeps exactly the same shape, arms, radar cylinder, tank and proportions throughout, nothing changes or morphs. The camera performs a very slow, smooth lateral tracking move from a three-quarter front angle, starting slightly wide on the Lavaux vineyard terraces and gently easing closer to the drone. The rotor wash softly moves the vine leaves. Lake Geneva, the hills and the sunrise stay still, light haze drifts slowly. Stable camera, no sudden movement, physically plausible motion, no new objects, no people, no text, no logos, no morphing.

**d54409e8 (Accueil, « Pourquoi le drone »)**

> The reference images show the exact agricultural spraying drone to reproduce, with identical design and proportions: four carbon-fibre arms, each with ONE large two-blade black propeller with orange tips (four propellers only); front arms higher than rear arms; light-grey faceted body; tall grey cylindrical radar module at the front; white tank with a grey lid and orange tab at the rear; black tubular landing gear; small black centrifugal nozzles under the rear motors. Nothing invented.
>
> Ultra-photorealistic editorial photograph. The drone flies a few metres above a very steep terraced vineyard in Lavaux, Switzerland, seen from the side at vine level, spraying a light, translucent, controlled mist from the nozzles under its rear motors onto the vine foliage. Soft early-morning backlight makes the fine droplets glow; green vine leaves sharp in the foreground, a dry-stone terrace wall below, the lake blurred far behind. Natural colours, 50 mm lens, realistic depth of field. No people, no text, no logos, no watermark, no CGI look.

**e4b001b2 (Accueil, drone détouré)**

> Reproduce exactly the agricultural spraying drone shown in the reference images, with identical design, parts and proportions: four carbon-fibre arms, each with ONE two-blade black propeller with orange tips (four propellers only), front arms higher than rear arms, light-grey faceted body, tall grey cylindrical radar module at the front, white tank with grey lid and orange tab at the rear, battery with heat-sink fins in the middle, black tubular landing gear, small black nozzles under the rear motors. Photorealistic product photograph, three-quarter front view from slightly above, arms unfolded, propellers still and sharp, isolated on a fully transparent background, no floor, no shadow, soft studio lighting, crisp real materials. No text, no logos, no invented parts.

**e91373f3 (Équipement, en-tête (image fixe))**

> Reproduce exactly the agricultural spraying drone shown in the reference images, identical design and proportions: four carbon-fibre arms, each with ONE two-blade black propeller with orange tips (four propellers only), front arms higher than rear arms, light-grey faceted body, tall grey cylindrical radar module at the front, white tank with grey lid and orange tab at the rear, black tubular landing gear, small black nozzles under the rear motors. Nothing invented.
>
> Ultra-photorealistic premium photograph. The drone stands on its landing gear on a gravel track at the edge of a terraced vineyard in Lavaux, Switzerland, at sunrise, arms unfolded and propellers still, ready for take-off. Camera at knee height, three-quarter front view, warm low sunlight, long soft shadows, vine rows and dry-stone walls rising behind, Lake Geneva softly visible in the distance. Drone in the centre-right of the frame. Premium editorial style, natural colours, 35 mm lens. No people, no vehicles, no text, no logos, no watermark.

**c8a1e71b (Équipement, sécurité)**

> Reproduce exactly the agricultural spraying drone shown in the reference images, identical design: the tall light-grey cylindrical radar and vision module standing at the front of the faceted light-grey body, with its small camera lenses; carbon-fibre arms with single two-blade black propellers with orange tips; white tank with grey lid at the rear. Nothing invented.
>
> Ultra-photorealistic close-up photograph of the front of the drone hovering in the early morning above a vineyard: the camera faces the radar cylinder at the same height, the front arms and propellers partly in frame, vine rows softly out of focus behind, fine morning mist in the air, soft diffused light, real materials. No screens, no added lights, no text, no logos, no watermark.

**c0e1edcd (Équipement, pulvérisation)**

> Reproduce exactly the agricultural spraying drone shown in the reference images, identical design and proportions: four carbon-fibre arms each with ONE two-blade black propeller with orange tips (four propellers only), front arms higher than rear arms, light-grey faceted body, tall grey radar cylinder at the front, white tank with grey lid and orange tab at the rear, black tubular landing gear, black centrifugal nozzles hanging under the rear motors. Nothing invented.
>
> Ultra-photorealistic photograph. The drone flies slowly along a vine row about three metres above the canopy on a sloping vineyard, seen from a low side angle. The nozzles under its rear motors release a fine, even, controlled mist, backlit by the rising sun so the droplets glow; the rest of the vineyard in soft focus. Golden light, natural colours, 85 mm lens compression. Physically plausible spray, no people, no text, no logos, no watermark.

**4f013ac5 (Équipement, pièce « pompes »)**

> Reproduce exactly the spray pump unit shown in the reference images: the black pump assembly with its round impeller housings and short hoses mounted under the white tank, between the black tubular landing gear legs of the agricultural drone. Identical shapes and parts, nothing invented.
>
> Ultra-photorealistic close-up photograph of this pump under the drone, the drone standing on a gravel path at the edge of a vineyard in soft morning light, shallow depth of field, vine rows blurred in the background, a few water droplets on the black plastic, real materials. No text, no logos, no labels, no watermark.

**e842292a (Équipement, pièce « buses »)**

> Reproduce exactly the motor pod and centrifugal nozzle shown in the reference image: the carbon-fibre arm with its finned electronics housing, the grey motor with the black two-blade propeller on top, and the black cylindrical centrifugal nozzle with an orange ring hanging below the motor, fed by a thin grey hose. Identical shapes, nothing invented.
>
> Ultra-photorealistic close-up photograph of this nozzle in operation while the drone hovers above a vineyard: the spinning nozzle releases a fine, even ring of mist droplets that drifts down onto the vine leaves below. Backlit morning sun makes the droplets glow, shallow depth of field, vines blurred behind. Real materials, no text, no logos, no labels, no watermark.

**8f3f7047 (Équipement, pièce « réservoir »)**

> Reproduce exactly the drone's spray tank shown in the reference images: the white, slightly translucent plastic tank with its large round grey lid and orange pull tab, the small black level sensor with its white cable next to the lid, and the black frame around it. Identical shapes, nothing invented.
>
> Ultra-photorealistic close-up photograph of this tank on the drone standing at the edge of a vineyard in the early morning, a gloved hand not visible, a few drops of water on the white plastic, soft natural light, shallow depth of field, vine rows blurred behind. Real materials, no text, no logos, no labels, no watermark.

**342c1bb2 (Équipement, batterie)**

> Reproduce exactly the battery area of the agricultural drone shown in the reference images: the dark-grey battery inserted in the middle of the body, with its large aluminium heat-sink fins, carrying handle and power button with level lights, between the tall grey radar cylinder at the front and the white tank at the rear. Identical shapes, nothing invented.
>
> Ultra-photorealistic close-up photograph from slightly above of this battery and its heat-sink fins on the drone, standing outdoors at the edge of a vineyard in warm late-morning sunlight, crisp metal texture, shallow depth of field, vines blurred behind. No text, no logos, no labels, no watermark.

**15b4a038 (Équipement, préparation du vol)**

> Reproduce exactly the agricultural drone seen from directly above in the reference images: X layout of four carbon-fibre arms, each with ONE two-blade black propeller with orange tips, the white tank with round grey lid and orange tab, the battery with fins and the grey radar cylinder. Identical design, nothing invented.
>
> Ultra-photorealistic aerial photograph taken straight down from high above a steep terraced vineyard in Lavaux, Switzerland: irregular vineyard parcels separated by dry-stone walls and narrow paths, parallel vine rows following the slope, summer morning light. The drone is small in the frame, flying over one parcel, its propellers blurred by motion, its shadow on the vines. No overlays, no lines, no text, no logos, no people, no vehicles, no watermark.

**315bb74d (Équipement, vidéo d'en-tête (5 s, depuis 24))**

> Ultra-photorealistic premium cinematic shot. Very slow, smooth dolly-in toward the agricultural drone standing still on its landing gear on the gravel track at the edge of the terraced vineyard at sunrise. The drone does not move, its four propellers stay still; it keeps exactly the same shape, arms, radar cylinder, tank and proportions throughout, nothing changes or morphs. Warm low sunlight, a few specks of dust drifting in the air, vine leaves moving very slightly in a light breeze, soft sparkle on the lake in the distance. Stable camera, no sudden movement, physically plausible, no new objects, no people, no text, no logos, no morphing.

**aed43a1a (Accueil, « Notre drone » ; départ prévu de la future vidéo d'accueil)**

> The reference images show the exact agricultural spraying drone to reproduce, with identical design and proportions: four carbon-fibre arms, each with ONE large two-blade black propeller with orange tips (four propellers only, no coaxial rotors); the two front arms mounted higher than the two rear arms; light-grey faceted central body; tall light-grey cylindrical radar module standing at the front; white 50-litre tank with a round grey lid and orange tab at the rear; black tubular landing gear; black centrifugal nozzles hanging under the rear motors. Nothing added, nothing missing.
>
> Ultra-photorealistic frame from a real agricultural drone commercial, shot with a telephoto lens from another drone. The camera is slightly above and in front of the drone, three-quarter front view. The drone flies low and steady over dense rows of vines on a steep terraced vineyard slope in Lavaux, Switzerland, at medium distance: it fills about one third of the frame width, placed centre-right, not in the extreme foreground. From the nozzles under its rear motors, two realistic spray plumes of fine droplets fall straight down onto the vine canopy, dense near the nozzles and dissipating lower, lit from behind by warm late-afternoon sun so the droplets glow. The lush deep-green vine foliage and a few dry-stone terrace walls fill the whole background as the slope rises behind the drone; no sky. Propellers spinning with natural motion blur. Real documentary look, 85 mm telephoto compression, shallow depth of field, natural colours, crisp mechanical detail on the drone. No people, no buildings, no text, no logos, no watermark, no CGI look, no invented parts.

## 2. Autres médias (inchangés)

| Fichier | Auteur et licence | Usage |
|---|---|---|
| `public/images/lavaux.jpg` | Joachim Kohler, Wikimedia Commons, CC BY-SA 4.0, recadrée | Accueil et À propos |
| `public/videos/lavaux-epesses.*`, `public/images/lavaux/epesses-*`, `public/images/partage-vitiaero.jpg` | Adrien Delhay : vol FPV au-dessus des vignes d'Epesses (Lavaux). Extrait de 19 à 25 s de `sources/videos/vignoble-fpv-2160.mp4`, ralenti de moitié, boucle par fondu d'une seconde, sans son ; images tirées de la même prise | Accueil, en-tête (vidéo et image) ; image de partage |
| `public/images/logo-vitiaero-120.*`, `logo-vitiaero-full-420.*` | Logo du projet ; réductions des fichiers de `sources/logos/` | En-tête, À propos |

Les deux fichiers de logo d'origine contiennent des métadonnées C2PA
(provenance d'un outil de création). Les versions publiées, réduites, ne les
reprennent pas. L'origine du logo est à confirmer par le propriétaire.

## 3. Historique : visuels officiels DJI du T55 (utilisés puis retirés le 26.9.2026)

Retirés du site le même jour, à la demande du propriétaire, pour ne pas avoir
de problème de droits. Les fichiers restent dans l'historique Git (commit
51ccafd).

**Décision du propriétaire (26.9.2026)** : remplacer les illustrations générées
par IA, jugées trop éloignées du vrai drone, par les photos et vidéos officielles
de DJI.

- Page source : https://ag.dji.com/t55 (page produit du DJI Agras T55).
- Récupération : 26 septembre 2026, par téléchargement direct des fichiers
  publiés sur les serveurs de DJI (www-cdn.djiits.com, videocaption.djicdn.com).
- Titulaire des droits : SZ DJI Technology Co., Ltd. Crédit affiché : « © DJI »
  (légende de l'accueil, note de l'en-tête, pied de la page Équipement, mentions
  légales en trois langues).
- **Licence : aucune à ce jour.** Les conditions du site DJI
  (https://www.dji.com/terms) interdisent l'usage commercial de leur contenu
  sans consentement écrit préalable. Point **bloquant avant publication** tant
  que l'accord écrit n'est pas obtenu (modèle de demande dans
  docs/CONFORMITE.md).
- Aucun logo DJI ajouté par VitiAero. Le seul logo visible est celui imprimé sur
  la radiocommande photographiée.
- Aucune image n'est présentée comme une intervention de VitiAero : la FAQ de la
  page Équipement précise que les visuels viennent de DJI et montrent d'autres
  cultures que la vigne.
- Fidélité : ce sont les visuels du fabricant pour ce modèle. La sélection a
  écarté tout ce que la page de DJI charge pour d'autres produits (Mavic, Osmo,
  Romo, Flip, etc.).

| Fichier(s) du site | Source DJI | Original | Usage | Texte alternatif (FR) | Transformation |
|---|---|---|---|---|---|
| `public/images/dji/accueil-colline-{1280,2400}.{avif,webp} + -1280.jpg` | https://www-cdn.djiits.com/dps/6380ca1388968139eb4ffd29b703a8d7.jpg | 2400 × 1200 | Accueil, en-tête (image principale, LCP) | Le DJI Agras T55 pulvérise une plantation à flanc de colline (photo DJI) | Redimensionnée, convertie en AVIF, WebP et JPEG. |
| `public/videos/dji-accueil-colline.{mp4,av1.mp4}` | https://www-cdn.djiits.com/reactor/assets/_next/static/videos/4f1e6521-6542-4130-b272-77a3c9b13aeb.mp4 | 2400 × 1200, 25 i/s, 6,24 s, sans son | Accueil, vidéo d'en-tête en boucle (ordinateur seulement) | Décorative (aria-hidden) ; l'image dessous porte le texte alternatif | 1920 × 960 ; fondu de 0,8 s de la fin vers le début pour une boucle continue (5,44 s) ; H.264 (6,7 Mbit/s) et AV1 (3,4 Mbit/s). |
| `public/images/dji/pulverisation-colline-{800,1386}.* + -800.jpg` | https://www-cdn.djiits.com/dps/58982e7805f3929de09db15ef32b6d6a.jpg | 1386 × 924 | Accueil, section « Pourquoi le drone » | Le DJI Agras T55 pulvérise au-dessus d'arbres sur un coteau (photo DJI) | Redimensionnée, convertie. |
| `public/images/dji/t55-studio-{700,1060}.* + -700.jpg` | https://www-cdn.djiits.com/dps/5a0ddb0f58ae92eae249307d7408a130.jpg | 1184 × 800 | Accueil, section « Notre drone » | Le DJI Agras T55 en vol, bras dépliés (photo DJI) | Recadrée sur le drone (1060 × 640), convertie. Affichée en mode de fusion « éclaircir » sur le fond sombre de la section. |
| `public/images/partage-vitiaero.jpg` | https://www-cdn.djiits.com/dps/1a72f008ce6a084d091e8ae56842a109.jpg | 3840 × 2160 | Image de partage (Open Graph, Twitter, Schema.org) | Sans objet (métadonnée) | Réduite à 1200 px de large et recadrée en 1200 × 630. |
| `public/images/dji/t55-transport-{1280,2560}.* + -1280.jpg` | https://www-cdn.djiits.com/dps/8149323fd728d257633b8cd179061043.jpg | 2560 × 1440 | Équipement, en-tête | Un opérateur porte seul le DJI Agras T55 près d'un pick-up, au bord d'un champ (photo DJI) | Redimensionnée, convertie. Une personne est reconnaissable (droit à l'image : voir la conformité). |
| `public/videos/dji-t55-transport.{mp4,av1.mp4}` | https://www-cdn.djiits.com/reactor/assets/_next/static/videos/1a44ca6c-25ec-41c2-8738-98165170adae.mp4 | 2560 × 1440, 25 i/s, 6,44 s, sans son | Équipement, vidéo d'en-tête (lue une fois) | Décorative (aria-hidden) | 1920 × 1080 ; H.264 (5,3 Mbit/s) et AV1 (2,5 Mbit/s). Une personne est reconnaissable. |
| `public/images/dji/pulverisation-champ-{1280,2400}.* + -1280.jpg` | https://www-cdn.djiits.com/dps/2cba0e2f2530041fd741224a03716453.jpg | 2400 × 1200 | Équipement, section Pulvérisation | Le DJI Agras T55 pulvérise au-dessus d'un champ (photo DJI) | Redimensionnée, convertie. |
| `public/videos/dji-pulverisation-champ.{mp4,av1.mp4}` | https://www-cdn.djiits.com/reactor/assets/_next/static/videos/5868fa95-55db-48a3-b23c-577d87605b71.mp4 | 2400 × 1200, 25 i/s, 8,52 s, sans son | Équipement, section Pulvérisation (lue une fois) | Décorative (aria-hidden) | 1920 × 960 ; H.264 (7,3 Mbit/s) et AV1 (4,4 Mbit/s). |
| `public/images/dji/radar-avant-{800,1146}.* + -800.jpg` | Première image de la vidéo ci-dessous | 1146 × 960 | Équipement, section Sécurité | Le DJI Agras T55 en vol, sur fond noir (image DJI) | Image extraite de la vidéo (t = 0), convertie. |
| `public/videos/dji-radar-avant.{mp4,av1.mp4}` | https://www-cdn.djiits.com/reactor/assets/_next/static/videos/615482a6-8ddd-482e-bc52-b0239a2a6824.mp4 | 1146 × 960, 25 i/s, 8,16 s, sans son | Équipement, section Sécurité (lue une fois) | Décorative (aria-hidden) | H.264 (2,3 Mbit/s) et AV1 (1,3 Mbit/s). |
| `public/images/dji/dissipateur-batterie-{1280,2400}.* + -1280.jpg` | https://www-cdn.djiits.com/dps/0e6dac65ee5e0bffc48fc46dde44f924.jpg | 2400 × 1200 | Équipement, section Batterie | Le DJI Agras T55 vu de dessus, hélices en rotation (image DJI) | Redimensionnée, convertie. |
| `public/videos/dji-dissipateur-batterie.{mp4,av1.mp4}` | https://www-cdn.djiits.com/reactor/assets/_next/static/videos/7df0677b-386f-4e8d-b7a6-7b9c72e6a89f.mp4 | 2400 × 1200, 25 i/s, 9 s, sans son | Équipement, section Batterie (lue une fois) | Décorative (aria-hidden) | 1920 × 960 ; H.264 (2,6 Mbit/s) et AV1 (1,4 Mbit/s). |
| `public/images/dji/epandage-{800,1386}.* + -800.jpg` | http://videocaption.djicdn.com/poster/20251111/9f7048733699128cf0bae2e4e61a6470.jpg | 1386 × 1040 | Équipement, carte Épandage | Le DJI Agras T55 épand des granulés au-dessus d'une colline (photo DJI) | Redimensionnée, convertie. |
| `public/images/dji/levage-{800,1600}.* + -800.jpg` | https://www-cdn.djiits.com/dps/575196bc1cef1123f69f40f82d2051f3.jpg | 2400 × 1200 | Équipement, carte Levage | Le DJI Agras T55 en vol avec son câble de levage (photo DJI) | Redimensionnée, convertie. |
| `public/images/dji/radiocommande-{800,1386}.* + -800.jpg` | https://www-cdn.djiits.com/dps/c5ccaa096634e69a5ab80dfbff75257f.jpg | 1386 × 800 | Équipement, section Préparation du vol | Radiocommande DJI tenue à deux mains, carte d'une parcelle à l'écran (photo DJI) | Redimensionnée, convertie. Le logo DJI de la radiocommande est visible (il fait partie du produit photographié). |

Formats publiés : AVIF puis WebP en deux largeurs, JPEG de repli dans la petite
largeur (composant `Picture`), avec largeur et hauteur déclarées. Vidéos : AV1
puis H.264, sans piste son, chargées seulement sur ordinateur, quand elles sont
visibles, jamais en mouvement réduit. Un bouton permet de les mettre en pause.

## 4. Historique : série 1 d'illustrations Higgsfield (non utilisées)

Générées le 26 septembre 2026 pour la première version de la refonte, puis
retirées du site le même jour à la demande du propriétaire. Les fichiers ne sont
plus publiés. Aucune donnée personnelle n'a été transmise à Higgsfield (seulement
les textes des prompts).

- Outil : Higgsfield, via son connecteur (compte du propriétaire, abonnement
  « plus »). Images : modèle `gpt_image_2_5`. Vidéos : Kling 3.0 (mode pro,
  5 s, sans son), à partir d'une image générée.
- Conditions de Higgsfield (mise à jour du 26.7.2026) : pas de revendication de
  propriété sur les résultats, pas de restriction d'usage commercial,
  l'utilisateur reste responsable des droits de tiers ; un filigrane invisible
  peut être ajouté.
- Crédits consommés : 25,25 pour les images, 17,50 pour les vidéos, soit 42,75.
  Solde vérifié après la refonte : 58,25 crédits. L'abonnement n'a pas été
  dépassé.
- Fidélité : les prompts décrivaient le drone d'après la fiche technique écrite
  (quatre bras, huit hélices en paires coaxiales, réservoir de 50 L, deux buses
  à 1,8 m), sans image de DJI en référence. Le propriétaire a jugé le résultat
  « pas du tout comparable au vrai drone ».

| Tâche | Usage prévu | Modèle et réglages | Coût | Statut |
|---|---|---|---|---|
| 8f630ef8 | Brouillon accueil | gpt_image_2_5, qualité low, 1k, 16:9 | 0,25 | Non retenue (essai du bloc « drone ») |
| 32ab074a | Brouillon studio | gpt_image_2_5, qualité low, 1k, 4:5 | 0,25 | Non retenue (essai) |
| a20981ee | Accueil | gpt_image_2_5, qualité high, 2k, 16:9 | 2,75 | Rejetée : trois hélices par bloc moteur en vue de profil |
| 61e20e4a | Pourquoi le drone | gpt_image_2_5, qualité high, 2k, 4:3 | 2,75 | Utilisée, puis retirée le 26.9.2026 |
| 375871d5 | Drone détouré | gpt_image_2_5, qualité high, 2k, 4:3, fond transparent | 2,75 | Utilisée, puis retirée le 26.9.2026 |
| c2020e60 | Équipement, en-tête | gpt_image_2_5, qualité high, 2k, 16:9 | 2,75 | Utilisée, puis retirée le 26.9.2026 |
| 1f3bb25f | Équipement, capteurs | gpt_image_2_5, qualité high, 2k, 16:9 | 2,75 | Utilisée, puis retirée le 26.9.2026 |
| 5273630f | Équipement, pulvérisation | gpt_image_2_5, qualité high, 2k, 16:9 | 2,75 | Utilisée, puis retirée le 26.9.2026 (décor aux cyprès de style toscan) |
| b9955d50 | Préparation (pick-up) | gpt_image_2_5, qualité high, 2k, 3:2 | 2,75 | Rejetée : fausse étiquette de marque sur le générateur |
| 73cd08a8 | Parcelles vues du ciel | gpt_image_2_5, qualité high, 2k, 16:9 | 2,75 | Utilisée, puis retirée le 26.9.2026 |
| 3378a685 | Accueil (Léman) | gpt_image_2_5, qualité high, 2k, 16:9 | 2,75 | Utilisée, puis retirée le 26.9.2026 |
| 4339ce60 | Vidéo accueil (depuis 3378a685) | kling3_0 pro, 5 s, 16:9 | 8,75 | Utilisée, puis retirée le 26.9.2026 |
| a9f6df2a | Vidéo équipement (depuis c2020e60) | kling3_0 pro, 5 s, 16:9 | 8,75 | Utilisée, puis retirée le 26.9.2026 (préréglage « IN THE DARK » refusé) |

### Prompts exacts

**8f630ef8 (Brouillon accueil)**

> Original ultra-realistic advertising photograph. A large professional agricultural spraying drone, heavy-lift multirotor about 3.2 m wide with propellers unfolded: four folding carbon-fiber arms in an X layout, each arm ending in a coaxial pair of long two-blade carbon-fiber propellers (four coaxial pairs, eight propellers in total), a compact central fuselage in light grey composite carrying a 50-litre liquid tank, two centrifugal atomizing spray nozzles about 1.8 m apart beneath the rotors, sturdy landing gear, a sensor module at the front, realistic industrial design, no logos, no text, no markings. The drone flies low above steep terraced vineyards on a lakeside hillside in Switzerland (dry-stone wall terraces, green vine rows in summer), releasing a fine, physically plausible spray mist over the vines. Low three-quarter camera angle, early morning soft light, light haze over the lake, natural colour grading, full-frame photography, 35 mm lens. The drone sits in the right third of the frame; the left half is calm negative space for web text. Crisp mechanical details, correct number of propellers, nothing deformed, no people, no text, no logos, no CGI look.

**32ab074a (Brouillon studio)**

> Original photorealistic studio product photograph. A large professional agricultural spraying drone, heavy-lift multirotor about 3.2 m wide with propellers unfolded: four folding carbon-fiber arms in an X layout, each arm ending in a coaxial pair of long two-blade carbon-fiber propellers (four coaxial pairs, eight propellers in total), a compact central fuselage in light grey composite carrying a 50-litre liquid tank, two centrifugal atomizing spray nozzles about 1.8 m apart beneath the rotors, sturdy landing gear, a sensor module at the front, realistic industrial design, no logos, no text, no markings. Three-quarter view from slightly above, standing on its landing gear on a matte graphite floor, graphite background, soft precise lighting, realistic shadows, consistent proportions, no invented parts, premium product photography.

**a20981ee (Accueil)**

> Original ultra-realistic advertising photograph. A very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; two small centrifugal spray nozzles beneath the two rear rotors, about 1.8 m apart; robust black landing gear. Realistic industrial design, correct proportions, no logos, no brand names, no text, no markings. It flies slowly and low above steep terraced vineyards on a lakeside hillside in western Switzerland (dry-stone wall terraces, green summer vine rows, a lake and distant mountains), releasing a fine, physically plausible spray mist from its two nozzles onto the vines. Low three-quarter camera angle, early morning soft side light, light haze over the lake, natural colour grading, full-frame photograph, 35 mm lens, shallow depth of field on the foreground vines. The drone sits in the right third of the frame; the left half is calm negative space (lake and sky) for web text. Crisp mechanical detail, exactly eight propellers, nothing deformed, no people, no text, no logos, no CGI look.

**61e20e4a (Pourquoi le drone)**

> Original photorealistic editorial photograph. A very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; two small centrifugal spray nozzles beneath the two rear rotors, about 1.8 m apart; robust black landing gear. Realistic industrial design, correct proportions, no logos, no brand names, no text, no markings. It flies a few metres above the vine rows of a very steep hillside vineyard, seen from the side at vine level, spraying a fine mist that settles evenly on the foliage. Soft morning light from behind making the delicate droplets visible, green vine leaves in sharp focus in the foreground, a dry-stone terrace wall below. Natural colours, documentary style, 50 mm lens. Exactly eight propellers, nothing deformed, no people, no text, no logos.

**375871d5 (Drone détouré)**

> Original photorealistic product photograph. A very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; two small centrifugal spray nozzles beneath the two rear rotors, about 1.8 m apart; robust black landing gear. Realistic industrial design, correct proportions, no logos, no brand names, no text, no markings. Shown hovering in three-quarter view from slightly below the level of the arms, arms unfolded, propellers stationary and sharp, isolated on a fully transparent background with no floor and no shadow, soft studio lighting, realistic material detail. Exactly eight propellers, nothing deformed.

**c2020e60 (Équipement, en-tête)**

> Original photorealistic photograph. A very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; two small centrifugal spray nozzles beneath the two rear rotors, about 1.8 m apart; robust black landing gear. Realistic industrial design, correct proportions, no logos, no brand names, no text, no markings. It stands on its landing gear on a gravel track at the edge of a terraced vineyard at sunrise, arms and propellers unfolded, ready for take-off. Camera at knee height, three-quarter front view, warm low sun, long soft shadows, vine rows and dry-stone walls rising behind, a glimpse of a lake in the distance. Premium editorial style, natural colours, 35 mm lens. The drone occupies the centre-right; exactly eight propellers, nothing deformed, no people, no vehicles, no text, no logos.

**1f3bb25f (Équipement, capteurs)**

> Original photorealistic close-up photograph of the front of a very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; robust black landing gear. Realistic industrial design, no logos, no brand names, no text, no markings. The drone hovers in the morning above a vineyard; the camera faces the front sensor module at the same height, showing the radar housing and camera lenses on the front of the fuselage, the front arms and propellers partly in frame, vine rows softly out of focus behind. Soft diffused light, fine morning mist in the air, realistic materials. No invented screens or lights, nothing deformed, no people, no text, no logos.

**5273630f (Équipement, pulvérisation)**

> Original photorealistic photograph. A very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; two small centrifugal spray nozzles beneath the two rear rotors, about 1.8 m apart; robust black landing gear. Realistic industrial design, correct proportions, no logos, no brand names, no text, no markings. It flies slowly along a vine row about three metres above the canopy, seen from a low side angle, its two nozzles releasing a fine, even spray mist backlit by the sun so the droplets glow; the rest of the vineyard and the hillside in soft focus. Golden-hour light, natural colours, 85 mm lens compression. Exactly eight propellers, physically plausible spray pattern, nothing deformed, no people, no text, no logos.

**b9955d50 (Préparation (pick-up))**

> Original photorealistic documentary photograph at the edge of a vineyard at dawn: the open tailgate of a dark pickup truck holding a compact portable generator and two large drone battery packs with heavy power connectors, a folded tarp and a plastic water container; vine rows and a dry-stone wall behind, soft natural light, 35 mm lens, realistic materials. No brand names, no logos, no readable text, no people, nothing deformed.

**73cd08a8 (Parcelles vues du ciel)**

> Original photorealistic aerial photograph taken straight down from above a steep terraced vineyard on a lakeside hillside: irregular vineyard parcels separated by dry-stone walls and narrow paths, parallel vine rows following the slope, a few trees and a small road; summer morning light, crisp detail, natural colours. No overlays, no lines, no text, no logos, no people, no vehicles.

**3378a685 (Accueil (Léman))**

> Original ultra-realistic advertising photograph. A very large professional agricultural spraying drone (heavy-lift multirotor, about 3.2 m across with propellers unfolded): four thick folding carbon-fiber arms in an X layout; at the end of each arm a motor pod with one long two-blade carbon-fiber propeller above and one below (four coaxial pairs, eight propellers in total); a large central fuselage in light grey composite with a white 50-litre liquid tank on top; a front sensor module with radar and cameras; two small centrifugal spray nozzles beneath the two rear rotors, about 1.8 m apart; robust black landing gear. Realistic industrial design, correct proportions, no logos, no brand names, no text, no markings. Seen from a three-quarter front angle, slightly above the drone, so that all four arms and all four separate coaxial rotor pairs are clearly visible and well apart from each other. It flies slowly and low above steep terraced vineyards on the shore of Lake Geneva in the Lavaux region of Switzerland (dry-stone wall terraces, green summer vine rows, a village of stone houses with brown tile roofs, the Alps across the lake), releasing a fine, physically plausible spray mist from its two nozzles onto the vines. Early morning soft side light, light haze over the lake, natural colour grading, full-frame photograph, 35 mm lens. The drone sits in the right third of the frame; the left half is calm negative space (lake and sky) for web text. No cypress trees. Crisp mechanical detail, exactly eight propellers, nothing deformed, no people, no text, no logos, no CGI look.

**4339ce60 (Vidéo accueil (depuis 3378a685))**

> Original photorealistic cinematic shot. The agricultural spraying drone glides slowly and steadily to the right along the vineyard terraces at a constant low height, releasing a continuous fine spray mist onto the vines. Its eight propellers spin fast and are naturally motion-blurred; the drone keeps exactly the same shape, arms and proportions throughout. The camera tracks slowly sideways with it, smooth and stable. The lake, village and mountains stay still; light haze drifts gently. Physically plausible motion, no new objects, no people, no text, no logos, no morphing.

**a9f6df2a (Vidéo équipement (depuis c2020e60))**

> Original photorealistic cinematic shot. Slow, smooth dolly-in toward the agricultural drone standing still on the gravel track at sunrise. The drone does not move and its propellers stay still; it keeps exactly the same shape, arms and proportions throughout. Warm low sunlight, a few specks of dust in the air, vine leaves moving very slightly in a light breeze. Stable camera, physically plausible, no new objects, no people, no text, no logos, no morphing.
