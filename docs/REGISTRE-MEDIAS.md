# Registre des médias du site VitiAero

Mis à jour le 26 septembre 2026. Ce registre trace l'origine, les droits et
l'usage de chaque photo et vidéo du drone.

## 1. Médias utilisés : visuels officiels DJI du T55

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

## 2. Autres médias (inchangés)

| Fichier | Auteur et licence | Usage |
|---|---|---|
| `public/images/lavaux.jpg` | Joachim Kohler, Wikimedia Commons, CC BY-SA 4.0, recadrée | Accueil et À propos |
| `public/videos/vignoble-fpv-*.mp4`, `public/images/vignoble-poster.jpg` | Adrien Delhay (vignoble d'Epesses) | Accueil, bande « En images » |
| `public/images/logo-vitiaero-120.*`, `logo-vitiaero-full-420.*` | Logo du projet ; réductions des fichiers de `sources/logos/` | En-tête, À propos |

Les deux fichiers de logo d'origine contiennent des métadonnées C2PA
(provenance d'un outil de création). Les versions publiées, réduites, ne les
reprennent pas. L'origine du logo est à confirmer par le propriétaire.

## 3. Historique : illustrations générées avec Higgsfield (non utilisées)

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

