# Refonte DJI Agras T55

Refonte du 26 septembre 2026 : le site présente désormais le DJI Agras T55.
Aucun texte, chiffre ni visuel de l'ancien modèle n'est publié.

Documents liés : `docs/REGISTRE-MEDIAS.md` (livrable 4) et
`docs/CONFORMITE.md` (livrable 5, rapport priorisé).

## 1. Décisions

1. Textes et chiffres réécrits d'après les pages officielles du T55 (section 3),
   dans les trois langues.
2. Visuels, série 1 : illustrations Higgsfield décrites d'après la fiche
   technique. Jugées « pas du tout comparables au vrai drone » (elles montraient
   huit hélices coaxiales au lieu de quatre).
3. Visuels DJI : photos et vidéos officielles du T55, utilisées puis retirées le
   même jour pour éviter tout problème de droits.
4. Visuels, série 2 (en place) : illustrations générées à partir de 14 rendus du
   T55 fournis par le propriétaire, page Équipement remise dans la structure de
   l'ancienne page (drone et radar, pulvérisation et ses trois pièces, batterie,
   préparation). Retours du propriétaire à traiter quand des crédits seront
   disponibles : vidéo d'accueil façon vidéo de référence (drone un peu plus
   loin), vidéo d'en-tête et images Sécurité, Pulvérisation (jets seulement à
   l'arrière), Réservoir et Batterie à refaire, radiocommande pour la
   préparation du vol. Détail et coûts : `docs/REGISTRE-MEDIAS.md`.

## 2. Inventaire avant et après

| Élément | Avant (commit 128f36a) | Après |
|---|---|---|
| Modèle | DJI Agras T50 | DJI Agras T55 |
| Réservoir | 40 L | 50 L |
| Débit | 16 L/min (2 gicleurs), 24 L/min (4) | 40 L/min (2 buses), 50 L/min (4 buses de brumisation en option) |
| Épandage, levage | absents | 80 L, 55 kg, 400 kg/min (engrais composé) ; levage 40 kg, câble 10 m |
| Transmission | « jusqu'à 2 km » | retirée |
| Recharge | D12000iE, 9 à 12 min, 9 000 W | 8 à 9 min de 30 à 95 % (DB1050), D8000iE ou C7000 |
| Sécurité | radars avant et arrière | radars avant (360°), arrière, dessus, dessous ; 60 m ; 2,5 m |
| SEO, README, marques | T50 | T55 ; mention d'indépendance de DJI |
| Vidéo d'accueil | `hero-2160/1080` (film DJI du T50) | aucune pour l'instant (image fixe), à régénérer |
| Images d'accueil | `hero-poster.jpg`, `drone-cutout.png`, `t50-rows.jpg` | `t55/accueil-lavaux`, `t55/drone-vignes`, `t55/accueil-coteau` (générées) |
| Page Équipement | `images/equip/*`, `videos/equip/*` (T50) | `t55/bord-vigne`, `radar-avant`, `pulverisation-vigne`, `pompe`, `buse`, `reservoir`, `batterie`, `vue-du-ciel` + vidéo `t55-equipement` (générées) |
| Image de partage | `hero-poster.jpg` | `partage-vitiaero.jpg` (illustration générée) |
| Scripts | `scripts/download-images.js`, script npm `images` | supprimés |

Autres corrections : police WOFF2 de 77 Ko (au lieu de 785 Ko), logos réduits,
pages avec carte chargées à part (code principal de 633 à 424 Ko), bouton pause
des vidéos (WCAG 2.2.2), crédits des cartes réellement visibles, contraste du
menu, ordre des titres, étiquette de recherche, `role="alert"` des messages de
formulaire.

## 3. Caractéristiques publiées (sources lues le 26.9.2026)

Page produit : https://ag.dji.com/t55 — fiche technique : https://ag.dji.com/t55/specs

| Caractéristique | Valeur | Source |
|---|---|---|
| Réservoir | 50 L | page produit et fiche |
| Débit | 40 L/min (2 buses) ; 50 L/min (4 buses en option) | fiche ; page produit (« Mist Sprinklers ») |
| Gouttelettes | 50 à 500 μm | fiche |
| Largeur | 4 à 11 m, selon le terrain | fiche |
| Épandage | 80 L ; 55 kg ; 400 kg/min (engrais composé) | fiche ; page produit et note |
| Levage | 40 kg ; câble 10 m | fiche |
| Hélices | 4 paires, 62 pouces, fibre de carbone | fiche |
| Dimensions | 3190 × 3570 × 934 mm dépliées ; 1120 × 896 × 934 mm repliées | fiche |
| Poids | 45 kg (DB1050) ; 48,4 kg (DB1580) | fiche |
| Précision | ± 10 cm avec RTK | fiche |
| Vent, températures | 6 m/s ; 0 à 40 °C | fiche |
| Radars | avant 360° H, arrière, dessus, dessous ; 60 m ; distance de sécurité 2,5 m | fiche |
| Suivi du relief | détection vers le bas | page produit, note 1 |
| Batteries | 20 000 mAh / 30 000 mAh | fiche |
| Recharge | 8 à 9 min de 30 à 95 % (DB1050), D8000iE ou C7000 | fiche |
| Sécurité, batterie | « upgraded safety system », « Onboard Battery Heat Sink » | page produit |

Non repris : autonomie, surface par heure, prix, vitesse, portée, nombre de
caméras de vision (« Tri-vision » ou « quad-vision » selon la page), « dernier
modèle ».

## 4. Checklist de prépublication

- [ ] Rendre le site accessible (dépôt public ou autre hébergeur) — bloquant.
- [ ] Adresse postale dans `src/content.js` — bloquant.
- [ ] Confirmer l'origine des 14 rendus de référence du T55.
- [ ] Relecture juriste : marques DJI et AGRAS, visuels générés d'après ces rendus.
- [ ] Régénérer les visuels signalés (voir section 1) quand des crédits Higgsfield sont disponibles.
- [ ] Après publication : « Enforce HTTPS », test sur iPhone, Android et lecteur d'écran.
- [ ] Recommandé : réencoder les vidéos FPV du vignoble (65 à 93 Mo).
- [ ] Au lancement : Agroscope, OFAC, OPer-A, SafetySpray ; CG complètes ; `preLaunch = false` et `robots.txt`.
- [x] Aucune trace de l'ancien modèle dans `src/`, `public/`, `index.html`.
- [x] Compilation statique sans erreur ; parité des traductions.

## 5. Résultats des tests (26.9.2026)

Site compilé en mode statique, servi en local, testé dans Chrome sans fenêtre.

- **Responsive** : 17 pages × 375, 768 et 1440 px, plus l'allemand et l'anglais :
  aucun débordement horizontal.
- **Liens** : 41 liens internes valides (seul signalement : faux positif sur la
  page 404) ; 70 fichiers référencés, aucun manquant ; 5 liens externes en 200.
- **Performance** (mobile, 4G lente, processeur ÷4, visuels de la série 2) :
  LCP accueil 4,37 → 3,10 s, Équipement 5,15 → 2,71 s, Estimation 2,23 → 1,90 s ;
  CLS 0 partout (0,72 avant sur Estimation) ; accueil mobile 378 Ko au lieu de
  3,1 Mo. Aucune vidéo sur mobile ni en mouvement réduit.
- **Accessibilité** (automatisé) : aucun défaut, sauf les cases de consentement
  de 20 px (conformes par l'exception d'espacement) et le champ anti-robot
  volontairement masqué. Bouton pause des vidéos fonctionnel. Lecteur d'écran
  réel non testé.
- **SEO** : titre, description, canonique et langue sur chaque page ; image de
  partage 1200 × 630 ; sitemap ; indexation bloquée volontairement.
- **Formulaires** (contact, devis, inscription, connexion) : erreurs signalées
  avec résumé et focus ; envoi valide : message du mode statique annoncé,
  aucune requête envoyée.
- **Console** : aucune erreur, aucun avertissement, aucune exception.
- **Carte** : le crédit suit le fond choisi (swisstopo, OpenStreetMap, cadastre).
