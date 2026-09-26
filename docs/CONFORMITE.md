# Conformité légale du site VitiAero

Vérification du 24 septembre 2026, mise à jour le 26 septembre 2026 après la
refonte autour du DJI Agras T55. Chaque règle citée a été lue dans le texte
officiel, dans la version indiquée en fin de document.

Ce rapport n'est pas un avis juridique. Il ne permet pas de dire que le site est
« totalement légal » : il liste ce qui a été vérifié, ce qui manque et ce qu'un
juriste doit confirmer.

## Rapport priorisé

Statuts : **Bloquant avant publication**, **À faire vérifier par un juriste
local**, **À compléter**, **Conforme** (conforme aux points vérifiés, sans
garantie).

| Priorité | Point | Statut | Constat et action |
|---|---|---|---|
| 1 | Site en ligne | **Bloquant avant publication** | Le 26.9.2026, vitiaero.ch et vitiaero.github.io répondent « Site not found » et le dépôt `vitiaero/vitiaero.github.io` n'est pas visible publiquement (404). Avec un compte gratuit, GitHub Pages exige un dépôt public (section 1.1). |
| 2 | Identité de l'éditeur (mentions légales, confidentialité, contact) | **Bloquant avant publication** | Adresse postale absente : « [ADRESSE], [NPA] [VILLE] » s'affiche sur /mentions-legales, /confidentialite et /contact. Exigée par l'art. 3 al. 1 let. s LCD et l'art. 19 al. 2 let. a nLPD. À renseigner dans `src/content.js`. |
| 3 | Photos et vidéos DJI du T55 | **Bloquant avant publication** | Utilisées à la demande du propriétaire, créditées « © DJI ». Les conditions de DJI interdisent l'usage commercial sans consentement écrit préalable. Obtenir l'accord écrit (modèle en annexe) ou retirer les visuels (section 1.3). |
| 4 | Marques DJI et AGRAS, nom du modèle | **À faire vérifier par un juriste local** | Usage limité à la désignation du drone prévu, mention d'indépendance sur la page Équipement et dans les mentions légales, aucun logo ajouté. À confirmer : usage descriptif admissible, et absence de confusion avec un revendeur ou un partenaire. |
| 5 | Personnes visibles dans les visuels DJI | **À faire vérifier par un juriste local** | Un opérateur est reconnaissable (en-tête de la page Équipement, image et vidéo) ; des mains apparaissent sur la photo de la radiocommande. Faire confirmer dans l'accord de DJI que les droits à l'image couvrent cet usage. Aucune propriété privée identifiable n'a été repérée dans les visuels retenus. |
| 6 | Drone et produits phytosanitaires | **À compléter** | Homologation du T55 par Agroscope non vérifiable en ligne ; autorisation préalable de l'OFAC, permis OPer-A, contrôle du drone, SafetySpray et radiotéléphonie dans le canton de Vaud (section 3.2). Le site dit « drone prévu » et la FAQ l'explique. À obtenir avant la première intervention. |
| 7 | Conditions générales | **À compléter** | Paiement, annulation, assurance responsabilité civile à ajouter avant tout contrat. |
| 8 | Hébergement et formulaires futurs | **À compléter** | Les conditions de GitHub limitent l'usage commercial de Pages ; choisir un hébergeur adapté avant d'activer les envois et les comptes clients (section 3.3). |
| 9 | Référencement | **À compléter** | Indexation volontairement bloquée (`robots.txt` : `Disallow: /`) pendant la phase de lancement. À ouvrir le jour du lancement, avec `preLaunch = false`. |
| 10 | HTTPS | **À compléter** | Certificat valide avant la mise hors ligne. À revérifier (HTTPS imposé) à la republication. |
| 11 | Politique de confidentialité (nLPD) | **Conforme** (hors adresse, point 2) | Responsable, finalités, destinataires, pays étrangers et garanties, conservation, droits (section 2.2). |
| 12 | Sous-traitants et services tiers | **Conforme** | GitHub (hébergement, certifié Swiss-U.S. DPF), swisstopo (fonds de carte, recherche), OpenStreetMap (seulement si choisi). Higgsfield : utilisé une fois pour des essais d'illustration, retirés du site ; il ne reçoit aucune donnée des visiteurs et n'intervient pas dans le site. |
| 13 | Cookies et stockage local (art. 45c LTC) | **Conforme** | Aucun traceur. Stockage technique listé, possibilité de refus expliquée (section 2.3). |
| 14 | Formulaires | **Conforme** | Mode statique : rien n'est envoyé ; le message l'explique après l'envoi. Case de consentement obligatoire liée à la politique. Validation accessible (résumé des erreurs, focus, `aria-invalid`, annonce `role="alert"`). |
| 15 | Licences et traçabilité des médias | **Conforme** pour la traçabilité, **bloquant** pour la licence DJI (point 3) | Registre complet : `docs/REGISTRE-MEDIAS.md` (source, date, fichier, transformation, texte alternatif). Photo du Lavaux CC BY-SA 4.0 correctement créditée. Crédits des cartes visibles (section 2.6). |
| 16 | Prix et TVA (OIP, LTVA) | **Conforme** | « TVA éventuelle comprise », taux réduit de 2,6 % (section 2.4). |
| 17 | Publicité exacte (art. 3 al. 1 let. b LCD) | **Conforme** | Données du T55 vérifiées sur les pages de DJI le 26.9.2026, sans « dernier modèle » ni chiffre non publié (section 2.5). |
| 18 | Accessibilité | **Conforme** aux contrôles automatisés | Voir `docs/REFONTE-T55.md`, section 7. Un test manuel au lecteur d'écran reste à faire. Aucune obligation légale d'accessibilité n'a été vérifiée pour un site privé ; l'objectif WCAG 2.2 AA vient du cahier des charges. |

## 1. Ce qui bloque

### 1.1 Le site est hors ligne

Le 26 septembre 2026, `vitiaero.ch` et `vitiaero.github.io` répondent « Site not
found », et `https://github.com/vitiaero/vitiaero.github.io` renvoie 404. Le dépôt
a probablement été passé en privé. Avec un compte GitHub gratuit, un dépôt privé
ne peut pas être publié par GitHub Pages.

Deux solutions : repasser le dépôt en public (Settings > General > Danger Zone >
Change visibility), ou choisir un autre hébergement (voir 3.3).

### 1.2 Adresse postale de l'éditeur

Exigée par l'art. 3 al. 1 let. s LCD (« identité et adresse de contact, y
compris pour le courrier électronique ») et par l'art. 19 al. 2 let. a nLPD
(« identité et coordonnées du responsable du traitement »). À renseigner dans
`src/content.js` : `address`, `npa`, `city`. Le téléphone et le numéro IDE sont
facultatifs : s'ils restent vides, ils ne s'affichent pas.

### 1.3 Visuels DJI sans accord écrit

Le 26 septembre 2026, le propriétaire a choisi de remplacer les illustrations
générées par IA par les photos et vidéos officielles du DJI Agras T55
(ag.dji.com/t55). Les conditions du site DJI interdisent de reproduire leur
contenu « à des fins commerciales » sans « consentement écrit préalable ».

Mesures prises : crédit « © DJI » visible (accueil, page Équipement, mentions
légales), aucun logo ajouté, aucune présentation des images comme des
interventions de VitiAero, mention d'indépendance. Ces mesures ne remplacent pas
l'accord. Tant qu'il n'est pas obtenu, le risque (loi sur le droit d'auteur)
reste ouvert. Un modèle de demande figure en annexe. Sans réponse positive, il
faut retirer ces visuels avant la publication.

## 2. Ce qui a été vérifié et corrigé

### 2.1 Identité et mentions légales

- Éditeur et responsable : Adrien Delhay, sous le nom VitiAero.
- Hébergeur : GitHub, Inc., adresse de sa déclaration de confidentialité.
- Champs facultatifs vides masqués au lieu d'afficher des crochets.
- « Les textes et la mise en page » au lieu de « la marque VitiAero », pour ne
  pas laisser entendre une marque enregistrée (le registre n'a pas été consulté).
- Marques : « DJI et AGRAS sont des marques de SZ DJI Technology Co., Ltd. Ce
  site est indépendant et n'est ni édité ni nécessairement approuvé par DJI. »

### 2.2 Protection des données (nLPD)

- Art. 19 al. 2 : responsable, finalités et destinataires indiqués.
- Art. 19 al. 4 : chaque pays de destination est nommé, avec sa garantie :
  - **États-Unis**, GitHub : certifié au cadre Suisse-États-Unis (statut
    « Active » sur la liste officielle, vérifié le 24.9.2026), ce qui vaut
    niveau adéquat selon l'annexe 1 OPDo ;
  - **Royaume-Uni et Pays-Bas**, OpenStreetMap : pays adéquats selon l'annexe 1
    OPDo ; seulement si le visiteur choisit le fond « Plan ». OpenStreetMap sert
    ses tuiles par un réseau mondial de cache sans publier les pays : c'est
    écrit tel quel, avec le moyen de l'éviter.
- Ce que GitHub enregistre : l'adresse IP de chaque visiteur, « pour des raisons
  de sécurité » (documentation GitHub Pages).
- « La situation aujourd'hui » : les formulaires n'envoient rien tant que le
  serveur n'est pas en ligne.
- Droits selon la nLPD (art. 25, 28, 32).
- Conservation : 10 ans pour la comptabilité (art. 958f CO) ; 24 mois au plus
  pour les demandes sans suite, **choix du propriétaire, modifiable**.
- Sanction : jusqu'à 250 000 francs d'amende en cas d'omission intentionnelle du
  devoir d'informer (art. 60 nLPD).
- Les photos et vidéos DJI sont servies depuis le site lui-même : aucune requête
  vers les serveurs de DJI pendant la visite.

### 2.3 Cookies et stockage local (art. 45c LTC)

La loi exige d'informer du stockage, de sa finalité et de la **possibilité de le
refuser**. Le bandeau contient la phrase de refus, la page cookies une section
« Refuser ce stockage ». Les clés listées correspondent exactement au code.
Aucun traceur, aucun script externe. La police Inter est servie par le site.

### 2.4 Prix

- L'OIP s'applique à toute publicité pour des consommateurs (art. 2 al. 1
  let. d) et exige alors le « prix à payer effectivement » (art. 13). Un
  particulier propriétaire d'une vigne est un consommateur (art. 2 al. 2).
  « Hors TVA » devient « TVA éventuelle comprise ».
- L'AFC range « sulfater des arbres fruitiers, des vignes ou des légumes » au
  taux réduit (art. 25 al. 2 let. d LTVA, 2,6 % en 2026).

### 2.5 Publicité exacte (art. 3 al. 1 let. b LCD)

Le drone présenté est le DJI Agras T55. Chaque chiffre vient de la page produit
ou de la fiche technique de DJI, lues le 26 septembre 2026 ; la table complète,
avec les adresses, figure dans `docs/REFONTE-T55.md` (section 3).

Règles appliquées :

- aucune donnée que DJI ne publie pas (autonomie, surface par heure, prix,
  vitesse de travail, résistance à la pluie) ;
- aucun « dernier modèle », « plus récent » ou « meilleur » : la page de DJI
  liste d'ailleurs d'autres modèles Agras ;
- conditions de mesure reprises : 400 kg/min « avec de l'engrais composé »,
  détection variable selon la lumière, la pluie, le brouillard et les obstacles,
  largeur de pulvérisation « selon le terrain » ;
- DJI écrit « Tri-vision » dans la fiche et « quad-vision » dans une note de la
  page produit : le site ne donne pas de nombre ;
- « drone prévu », pas « drone utilisé » : aucune intervention n'a eu lieu ;
- VitiAero ne propose que la pulvérisation, même si le T55 sait épandre et
  lever des charges : c'est écrit sur la page ;
- « 48 h » et « 100 km » sont nuancés (« en général », « selon la parcelle »),
  choix du propriétaire.

### 2.6 Crédits des cartes

Exigences : « ©swisstopo » sur toute représentation (conditions OGD,
1.3.2021) ; « © OpenStreetMap contributors » visible, sans cacher l'attribution
(politique d'usage des tuiles) ; « © Mensuration Officielle Suisse / FL », qu'il
est « interdit de supprimer, de dissimuler ou de recouvrir » (licence
CadastralWebMap, 9.5.2012).

**Correction du 26.9.2026** : une ancienne règle CSS
(`.leaflet-control-attribution { display: none }`) masquait encore ces crédits,
alors que le rapport du 24.9 les disait affichés. La règle est retirée. Test du
26.9 dans Chrome : le bon crédit s'affiche pour chacun des quatre fonds.

### 2.7 Droits d'auteur

- Photo du Lavaux (CC BY-SA 4.0) : auteur (Joachim Kohler), liens vers la source
  et la licence, modification signalée (recadrée et redimensionnée).
- Visuels du drone : voir 1.3 et `docs/REGISTRE-MEDIAS.md`. Tous les anciens
  visuels de l'ancien modèle ont été retirés du site ; ils restent dans
  l'historique Git.

### 2.8 Réglementation des drones

Liste de la page Le service, d'après la page SPRAY de l'OFAC (mise à jour du
16.4.2026) : autorisation préalable de l'OFAC, à demander au moins deux mois à
l'avance ; modèle homologué par Agroscope ; contrôle de chaque drone par un
organisme agréé avant la mise en service puis tous les trois ans ; au moins une
personne titulaire du permis OPer-A (RS 814.812.34).

### 2.9 Conditions générales

- For : réserve pour les consommateurs, qui ne peuvent pas y renoncer d'avance
  (art. 32 et 35 CPC).
- TVA : même correction qu'en 2.4.

## 3. Ce qui reste à faire

### 3.1 Avant de republier

1. Rendre le site accessible à nouveau (1.1).
2. Renseigner l'adresse postale (1.2).
3. Obtenir l'accord écrit de DJI ou retirer les visuels DJI (1.3, annexe).
4. Faire relire les points 4 et 5 du rapport par un juriste.

### 3.2 Avant la première intervention

- **Homologation du T55** : aucune liste Agroscope n'est publiée en ligne. Faire
  confirmer par Agroscope que le DJI Agras T55 est homologué.
- **Canton de Vaud** : depuis le 15 avril 2026, l'OFAC impose en plus, dans les
  cantons du Valais, de Vaud et de Genève, l'outil cartographique en ligne
  SafetySpray et la radiotéléphonie. Les distances de sécurité ont aussi été
  revues début 2026.
- **Conditions générales** : modalités de paiement, conditions d'annulation,
  assurance responsabilité civile.
- **Plan cadastral** : la page de cadastre.ch dit l'accès gratuit, sans parler
  d'enregistrement ; la licence de 2012, toujours publiée, parle d'un usage
  gratuit « une fois l'enregistrement effectué ». À faire confirmer par swisstopo.
- **Registre du commerce, IDE, TVA** : selon la structure et le chiffre
  d'affaires, auprès du registre du commerce vaudois et de l'AFC.
- **Bandeau de lancement** : passer `preLaunch` à `false` seulement quand les
  autorisations sont obtenues, et ouvrir l'indexation dans `robots.txt`.

### 3.3 Avant d'activer les formulaires en ligne

- **Hébergement** : les conditions de GitHub interdisent d'utiliser Pages pour
  faire tourner une activité commerciale en ligne ou un site « principalement »
  destiné à faciliter des transactions commerciales, et déconseillent d'y faire
  passer des mots de passe. Pour un service avec comptes clients, un hébergeur
  prévu pour cet usage est plus sûr ; un hébergeur suisse simplifierait aussi la
  section « Communication à l'étranger ».
- **Calcul des distances** : le serveur de démonstration OSRM est réservé à un
  usage « raisonnable, non commercial » (FOSSGIS e.V., Allemagne). À remplacer.
- **Politique de confidentialité** : compléter la section 4 avec les prestataires
  retenus.

### 3.4 Remarque

Les commits Git affichent l'adresse Gmail du propriétaire. GitHub propose une
adresse masquée : Settings > Emails > Keep my email addresses private.

## 4. Sources consultées

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
- DJI Agras T55, page produit et fiche technique (26.9.2026) : https://ag.dji.com/t55 et https://ag.dji.com/t55/specs
- Higgsfield, conditions d'utilisation (26.7.2026) : https://higgsfield.ai/terms-of-use-agreement
- OpenStreetMap, politique des tuiles : https://operations.osmfoundation.org/policies/tiles/
- OpenStreetMap Foundation, confidentialité : https://osmfoundation.org/wiki/Privacy_Policy
- OSRM, serveur de démonstration : https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
- Wikimedia Commons, photo du Lavaux : https://commons.wikimedia.org/wiki/File:Lavaux_vignobles_en_terrasses_au_bord_du_L%C3%A9man_(2015).jpg

## Annexe : demande d'autorisation à DJI

À envoyer à votre revendeur DJI Agriculture en Suisse, ou à DJI. Gardez la
réponse écrite.

> Objet : autorisation d'utiliser des visuels du DJI Agras T55 sur un site web
>
> Bonjour,
>
> Je prépare le lancement de VitiAero, un service de traitement des vignes par
> drone dans le canton de Vaud, avec le DJI Agras T55. Je souhaite utiliser sur
> mon site vitiaero.ch des photos et vidéos du T55 publiées par DJI sur
> ag.dji.com/t55 : la vidéo et la photo de présentation, des vues du drone en
> pulvérisation, en épandage et en levage, le module radar, le dissipateur de
> la batterie et la radiocommande. La liste exacte des fichiers est jointe.
>
> Chaque visuel est crédité « © DJI ». Les images sont seulement réduites,
> recadrées ou converties pour le web, et les vidéos raccourcies, mises en
> boucle et privées de son. Elles servent uniquement à présenter le drone prévu,
> avec la mention que le site est indépendant de DJI.
>
> Certaines images montrent une personne reconnaissable. Pouvez-vous me
> confirmer par écrit que cet usage est autorisé, droits à l'image compris, ou
> m'indiquer les visuels et conditions que je peux utiliser ?
>
> Avec mes meilleures salutations,
> Adrien Delhay, VitiAero, contact@vitiaero.ch
