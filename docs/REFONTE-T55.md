# Refonte DJI Agras T55

Refonte du 26 septembre 2026 : le site présente désormais le DJI Agras T55.
Aucun texte, chiffre ni visuel de l'ancien modèle n'est publié.

Documents liés : `docs/REGISTRE-MEDIAS.md` (livrable 4) et
`docs/CONFORMITE.md` (livrable 5, rapport priorisé).

## 1. Décisions

1. Textes et chiffres réécrits d'après les pages officielles du T55 (section 3),
   dans les trois langues.
2. Première version des visuels : illustrations Higgsfield. Le même jour, le
   propriétaire les a jugées « pas du tout comparables au vrai drone » et a
   demandé les photos et vidéos du site de DJI. Elles sont en place, créditées
   « © DJI ». L'accord écrit de DJI reste à obtenir avant la publication.

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
| Vidéo d'accueil | `hero-2160/1080` (film DJI du T50) | `dji-accueil-colline` (T55) |
| Images d'accueil | `hero-poster.jpg`, `drone-cutout.png`, `t50-rows.jpg` | `dji/accueil-colline`, `dji/t55-studio`, `dji/pulverisation-colline` |
| Page Équipement | `images/equip/*`, `videos/equip/*` (T50) | `dji/t55-transport`, `pulverisation-champ`, `radar-avant`, `dissipateur-batterie`, `epandage`, `levage`, `radiocommande` + 4 vidéos |
| Image de partage | `hero-poster.jpg` | `partage-vitiaero.jpg` (photo DJI du T55) |
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
- [ ] Accord écrit de DJI ou retrait des visuels DJI — bloquant.
- [ ] Relecture juriste : marques, droits à l'image des personnes visibles.
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
- **Performance** (mobile, 4G lente, processeur ÷4) : LCP accueil 4,37 → 2,56 s,
  Équipement 5,15 → 2,01 s, Estimation 2,23 → 1,87 s ; CLS 0 partout (0,72 avant
  sur Estimation) ; accueil mobile 297 Ko au lieu de 3,1 Mo. Aucune vidéo sur
  mobile ni en mouvement réduit.
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
