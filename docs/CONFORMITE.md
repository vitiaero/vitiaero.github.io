# Conformité légale du site VitiAero

Vérification des textes officiels le 24 septembre 2026, mise en œuvre dans le
code le 27 septembre 2026. Ce document n'est pas un avis juridique et ne
garantit pas une conformité totale : chaque point marqué « juriste » ou
« autorité » doit être validé avant le lancement (`CHECKLIST-LANCEMENT.md`).

## En bref (27.9.2026)

| Élément | État | Détail |
|---|---|---|
| Lancement | **Pré-lancement** | 36 informations bloquantes (`npm run launch:status`) |
| Identité de l'éditeur (art. 3 al. 1 let. s LCD, art. 19 LPD) | **À fournir** | Seules les données fournies sont affichées ; rien n'est inventé |
| Politique de confidentialité | Complète pour ce qui existe, à relire | Générée depuis `shared/business.js` ; prestataires de l'API à déclarer |
| Formulaires | Fermés en pré-lancement | Navigateur **et** serveur ; preuve de lecture enregistrée à l'ouverture |
| Cookies et stockage local (art. 45c LTC) | Information et refus expliqués | Cinq clés techniques, listées sur la page Cookies, aucun traceur |
| Transferts à l'étranger | Documentés | `SERVICES-TIERS.md` |
| Prix et TVA | Mention provisoire | Le régime de TVA s'affichera une fois A5 fourni |
| Conditions générales | Clauses publiées seulement quand fournies | Paiement, annulation, assurance, réclamations |
| « Pas une commande » | Partout | Boutons, formulaires, récapitulatifs, confirmation, e-mails |
| Autorisations et assurance | Aucune affichée | Affichées seulement complètes, vérifiées et non échues |
| Médias | Droits établis ou en attente de déclaration | Visuels DJI retirés ; F1 et F2 bloquent le lancement |
| Carte | Crédits visibles | swisstopo, OpenStreetMap, plan cadastral |
| Indexation | Bloquée en pré-lancement | `robots.txt`, `noindex`, `X-Robots-Tag`, pas de plan du site |
| Hébergement GitHub Pages | Décision à prendre (B3) | Règles d'usage commercial de GitHub Pages |

## 1. Mise en œuvre des dix règles

1. **Aucune donnée fictive, aucun texte à compléter, aucune mention de projet
   d'étude.** Les coordonnées viennent de `shared/business.js`, où `null`
   signifie « pas encore fourni ». Un test (`test/content.test.js`) échoue si un
   crochet, « projet d'étude » ou « données fictives » apparaît dans le code
   publié. Les données de démonstration sont refusées par le serveur en
   production.
2. **Pré-lancement tant qu'un élément bloquant manque.** La porte de lancement
   (`shared/launch.js`) contrôle 43 points (références A à G). Tant qu'un point
   échoue : bandeau explicite, formulaires fermés (le serveur répond 503 en
   production), indexation bloquée.
3. **Médias.** Tous les visuels DJI et les fichiers d'origine non confirmée sont
   retirés. Restent : la vidéo et les images d'Epesses filmées par le
   propriétaire (déclaration écrite F1 attendue), la photo du Lavaux sous
   licence CC BY-SA 4.0 avec crédit visible, des schémas vectoriels créés pour
   le site, la police Inter (SIL OFL 1.1) et le logo (droits F2 à établir). Tout
   fichier publié doit figurer dans `shared/media.js`, sinon la compilation
   échoue. La page `/credits` liste auteurs, licences, fonds de carte et
   logiciels (`licences-tiers.txt`, généré à la compilation).
4. **Textes juridiques.** Mentions légales, confidentialité, cookies, CGV,
   conditions d'utilisation et crédits sont écrits une fois, en français, en
   allemand et en anglais, dans la même structure (`shared/legal/`). Un test
   vérifie que les trois langues ont exactement les mêmes sections. Chaque
   document a une version datée et une empreinte : un texte modifié sans
   nouvelle version bloque la compilation.
5. **L'estimation n'est pas une commande.** Écrit sur chaque bouton d'envoi et
   appel à l'action, dans les formulaires, les récapitulatifs, la page de
   confirmation, le PDF et chaque accusé de réception. La commande en ligne
   n'est pas activée ; la porte de lancement refuse de l'activer tant que le
   parcours contractuel n'existe pas (`PLAN-MIGRATION.md`).
6. **Preuve, conservation, effacement, export, sauvegardes.** Pour chaque
   demande : document, version, date et finalité enregistrés. Purge quotidienne
   selon les durées fournies, export et suppression par le titulaire du compte,
   recherche, export et effacement par l'équipe, sauvegardes chiffrées vérifiées
   (`EXPLOITATION.md`).
7. **Carte et services tiers.** Crédits swisstopo, OpenStreetMap et plan
   cadastral toujours visibles sur la carte. Chaque service tiers et chaque
   transfert à l'étranger est décrit dans `SERVICES-TIERS.md` et dans la
   politique de confidentialité.
8. **Calcul des distances.** Le serveur public OSRM n'est plus utilisé (le
   serveur refuse de démarrer s'il est configuré). Distance à vol d'oiseau
   signalée comme approximative, ou OSRM auto-hébergé (`EXPLOITATION.md` §5).
9. **Justificatifs.** Autorisations, contrôles, permis et assurance ne sont
   affichés que s'ils sont saisis avec référence, autorité, dates et
   vérification, et tant qu'ils ne sont pas échus.
10. **Qualité.** Accessibilité (clavier sur la carte, contrastes, focus,
    annonces), performance (langues chargées à la demande, médias réencodés),
    référencement (en-têtes par page, indexation après lancement seulement),
    sécurité (CSP, en-têtes, security.txt) et surveillance horaire.

## 2. Ce qui bloque encore

La liste détaillée est dans `INFORMATIONS-MANQUANTES.md` ; la vérification à
signer dans `CHECKLIST-LANCEMENT.md`. Points qui demandent une validation
externe :

- **Juriste** : relecture de tous les textes publiés, des formulaires et des
  e-mails ; limitation de responsabilité (art. 100 CO) ; règles applicables si
  la clientèle comprend des particuliers (OIP, art. 8 LCD, art. 32 et 35 CPC) ;
  hébergement sur GitHub Pages pour une activité commerciale ; registre des
  activités de traitement.
- **OFAC, Agroscope, canton, organisme agréé** : autorisation de pulvérisation
  par drone, exigences cantonales (SafetySpray, radiotéléphonie), homologation
  du modèle, contrôle du pulvérisateur, compétences et enregistrement.
- **AFC et fiduciaire** : assujettissement à la TVA et taux applicable ;
  conservation des dossiers liés à un contrat.
- **swisstopo** : enregistrement éventuel pour le plan cadastral.

## 3. Ce que le site n'affirme pas

- Aucune autorisation, homologation, assurance ni formation n'est présentée
  comme obtenue.
- Aucun client, avis, nombre d'hectares ou d'années d'expérience.
- Le drone est « prévu », jamais « utilisé » ; ses caractéristiques viennent
  des publications du fabricant, citées comme telles, et les schémas sont
  signalés comme des illustrations.
- Le délai de réponse (48 h) et le rayon d'intervention (100 km) sont des
  choix du propriétaire, présentés comme habituels ou maximaux, à confirmer
  (D15).

## 4. Corrections du 24 septembre 2026, toujours valables

### 4.1 Prix

- L'OIP s'applique à toute publicité pour des consommateurs (art. 2 al. 1
  let. d) et exige alors le « prix à payer effectivement » (art. 13). Un
  particulier propriétaire d'une vigne est un consommateur (art. 2 al. 2).
  « Hors TVA » était donc à proscrire. Depuis le 27.9.2026, l'estimation
  indique « Montants en francs suisses. Le régime de TVA sera indiqué avant
  l'ouverture du service » ; une fois A5 fourni, elle affiche automatiquement
  « TVA de X % comprise » ou « L'entreprise n'est pas assujettie à la TVA ».
- Le taux de 8,1 % annoncé était faux pour cette activité : l'AFC range
  « sulfater des arbres fruitiers, des vignes ou des légumes » au taux réduit
  (art. 25 al. 2 let. d LTVA, 2,6 % en 2026). Aucun taux n'est plus affiché
  tant que la fiduciaire ou l'AFC ne l'a pas confirmé (A5).

### 4.2 Publicité exacte (art. 3 al. 1 let. b LCD)

| Avant | Après | Raison |
|---|---|---|
| « Les demandes d'estimation sont déjà ouvertes » | « Aucune intervention n'est encore réalisée. Le calcul d'estimation en ligne fonctionne déjà. » | Les formulaires n'envoient rien |
| « 48 h : réponse à votre demande » | « Délai de réponse, en général » | Choix du propriétaire |
| « 100 km : rayon d'intervention » | « Rayon d'intervention maximal, selon la parcelle » | Choix du propriétaire |
| « Traite les parcelles en forte pente » | « Suit le relief du terrain » | DJI ne publie aucun chiffre de pente pour le traitement ; le relevé est limité à 20° |
| « Stable, précis et à l'aise dans les pentes » | Présentation d'après les données DJI | Qualités non chiffrées par DJI |
| « Le travail est plus rapide » | Retiré | Comparaison sans preuve |
| « Radars et caméras à l'avant et à l'arrière » | Deux radars avant et arrière, deux capteurs de vision binoculaire | Termes de DJI |
| « Sans réseau mobile » | « Entre le drone et la radiocommande, selon DJI » | Non affirmé par DJI |
| Générateur « D12000iEP » | « D12000iE » | Modèle cité par la fiche technique, source des chiffres |
| « Recharge complète » | « Recharge d'une batterie » | DJI ne dit pas « complète » |
| « 13 ha en 10 min » et « 13 ha en 3 min » | Retirés | Introuvables dans les sources DJI |
| Carte « Caméra à nacelle » | Retirée | Absente de la fiche technique DJI |
| « Drone utilisé » | « Drone prévu » | Pas encore en service |

**Confirmé par DJI** et conservé : réservoir de 40 L ; 16 L/min avec deux
gicleurs, 24 L/min avec quatre ; gouttelettes de 50 à 500 μm ; 8 hélices en
rotors coaxiaux ; bras repliables ; transmission jusqu'à 2 km ; suivi du relief ;
recharge en 9 à 12 min au générateur ; 9 000 W de charge ; 30 L d'essence ;
relevé de zone jusqu'à 20° de pente ; relevé de limite sur une bande de 20 m.

### 4.3 Réglementation des drones

Liste de la page Le service précisée d'après la page SPRAY de l'OFAC (mise à jour
du 16.4.2026) : autorisation préalable de l'OFAC, à demander au moins deux mois à
l'avance ; modèle homologué par Agroscope ; contrôle de chaque drone par un
organisme agréé avant la mise en service puis tous les trois ans ; au moins une
personne titulaire du permis OPer-A (RS 814.812.34).

### 4.4 Conditions générales

- For : réserve ajoutée pour les consommateurs, qui ne peuvent pas y renoncer
  d'avance (art. 32 et 35 CPC).
- TVA : même correction qu'en 4.1.
- Réglementation : exigences vérifiées au lieu de la mention « à vérifier ».

## 5. Sources consultées le 24 septembre 2026

Textes de loi (Fedlex, recueil officiel) :

| Texte | Version lue | Adresse |
|---|---|---|
| LCD, RS 241 (art. 3) | 1.1.2025 | https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/fr |
| nLPD, RS 235.1 (art. 16, 19, 25, 28, 32, 60) | 7.7.2025 | https://www.fedlex.admin.ch/eli/cc/2022/491/fr |
| OPDo, RS 235.11 (annexe 1) | 1.12.2025 | https://www.fedlex.admin.ch/eli/cc/2022/568/fr |
| LTC, RS 784.10 (art. 45c) | 1.6.2026 | https://www.fedlex.admin.ch/eli/cc/1997/2187_2187_2187/fr |
| OIP, RS 942.211 (art. 1 à 4, 10, 11, 13, 14) | 1.1.2025 | https://www.fedlex.admin.ch/eli/cc/1978/2081_2081_2081/fr |
| LTVA, RS 641.20 (art. 25) | 31.3.2025 | https://www.fedlex.admin.ch/eli/cc/2009/615/fr |
| CPC, RS 272 (art. 32, 35) | 1.7.2026 | https://www.fedlex.admin.ch/eli/cc/2010/262/fr |

Autorités et organismes :

- AFC, taux de TVA (mise à jour du 22.9.2026) : https://www.estv.admin.ch/fr/taux-de-la-tva-suisse
- Portail PME, conservation de 10 ans selon l'art. 958f CO : https://www.kmu.admin.ch/fr/comptabilite-obligatoire-lobligation-de-tenir-une-comptabilite
- OFAC, pulvérisation par drone (16.4.2026) : https://www.bazl.admin.ch/fr/spray-fr et https://www.bazl.admin.ch/de/spray-de
- Liste officielle du Data Privacy Framework : https://www.dataprivacyframework.gov/list
- swisstopo, conditions OGD (1.3.2021) : https://www.swisstopo.admin.ch/fr/conditions-utilisation-geodonnees-et-geoservices-gratuit
- CadastralWebMap (13.2.2025) : https://www.cadastre.ch/fr/service-de-consultation-cadastralwebmap-wms

Prestataires et titulaires de droits :

- GitHub, déclaration de confidentialité (27.4.2026) : https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
- GitHub Pages, collecte des adresses IP : https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages
- GitHub Pages, usages interdits et limites : https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- DJI, conditions d'utilisation : https://www.dji.com/terms
- DJI Agras T50, fiche technique, page, FAQ : https://ag.dji.com/t50/specs, https://ag.dji.com/t50, https://ag.dji.com/t50/faq
- DJI, actualités T50 : https://ag.dji.com/newsroom/agras-t50-top-features et https://ag.dji.com/newsroom/agras-t50-intelligent-battery-design
- OpenStreetMap, politique des tuiles : https://operations.osmfoundation.org/policies/tiles/
- OpenStreetMap Foundation, confidentialité : https://osmfoundation.org/wiki/Privacy_Policy
- OSRM, serveur de démonstration : https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
- Wikimedia Commons, photo du Lavaux : https://commons.wikimedia.org/wiki/File:Lavaux_vignobles_en_terrasses_au_bord_du_L%C3%A9man_(2015).jpg

## Annexe : demande d'autorisation à DJI (facultatif, F3)

À envoyer à votre revendeur DJI Agriculture en Suisse, ou à DJI. Gardez la
réponse écrite.

> Objet : autorisation d'utiliser des visuels du DJI Agras T50 sur un site web
>
> Bonjour,
>
> Je prépare le lancement de VitiAero, un service de traitement des vignes par
> drone dans le canton de Vaud, avec le DJI Agras T50. Si des visuels du fabricant devaient revenir sur le site : je souhaite utiliser sur
> mon site vitiaero.ch des photos et vidéos du T50 publiées par DJI sur
> ag.dji.com : une vidéo de présentation, des vues du drone, du système de
> pulvérisation, du générateur et des écrans de cartographie.
>
> Chaque visuel serait crédité « © DJI », sans autre modification qu'un
> recadrage ou une compression pour le web, et uniquement pour présenter le
> drone utilisé.
>
> Pouvez-vous me confirmer par écrit que cet usage est autorisé, ou m'indiquer
> les visuels et conditions que je peux utiliser ?
>
> Avec mes meilleures salutations,
> Adrien Delhay, VitiAero, contact@vitiaero.ch
