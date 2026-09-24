# Conformité légale du site VitiAero

Vérification du 24 septembre 2026. Chaque règle a été lue dans le texte officiel,
dans la version en vigueur indiquée en fin de document. Ce rapport n'est pas un
avis juridique : il ne garantit pas une conformité totale. Une relecture par un
juriste reste conseillée avant le lancement commercial.

## En bref

| Élément | État | Détail |
|---|---|---|
| Politique de confidentialité (nLPD) | Conforme sur le fond, adresse manquante | Réécrite dans les trois langues, section 2.2 |
| Identité de l'éditeur | **Incomplet** | Nom inscrit ; adresse postale manquante |
| Formulaires | Conforme | Aucun envoi aujourd'hui, information prévue pour l'activation |
| Cookies | Conforme | Stockage réel listé, refus expliqué (art. 45c LTC) |
| Google Analytics et autres services | Conforme | Aucun traceur ; chaque transfert à l'étranger est nommé |
| Mentions légales | **Incomplet** | Même adresse manquante |
| Prix et prestations | Corrigé | TVA, promesses nuancées, caractéristiques vérifiées |
| Conditions générales | À compléter avant tout contrat | Paiement, annulation, assurance |
| HTTPS | Certificat valide | Le site est hors ligne, voir 1.1 |
| Images et droits | **Risque ouvert** | Visuels DJI sans accord écrit |

## 1. Ce qui bloque encore

### 1.1 Le site est hors ligne

Le 24 septembre 2026, `vitiaero.ch` et `vitiaero.github.io` répondent
« Site not found ». Le dépôt `vitiaero/vitiaero.github.io` n'est plus visible
publiquement : seul le dépôt de profil `vitiaero/vitiaero` l'est encore. Il a
probablement été passé en privé. Avec un compte GitHub gratuit, un dépôt privé
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

Les conditions du site DJI interdisent de reproduire leur contenu « à des fins
commerciales » sans « consentement écrit préalable ». Sont concernés : la vidéo
d'accueil, tous les visuels de la page Équipement, et trois fichiers dont
l'origine n'est pas confirmée (`hero-poster.jpg`, `drone-cutout.png`,
`t50-rows.jpg`). Décision du propriétaire : les garder et demander l'accord.
Tant qu'il n'est pas obtenu, le risque (loi sur le droit d'auteur) reste ouvert.
Un modèle de demande figure en annexe.

## 2. Ce qui a été corrigé

### 2.1 Identité et mentions légales

- Éditeur et responsable : Adrien Delhay, sous le nom VitiAero.
- Hébergeur ajouté : GitHub, Inc., adresse de sa déclaration de confidentialité.
- Champs facultatifs vides masqués au lieu d'afficher des crochets.
- « La marque VitiAero » remplacé par « les textes et la mise en page », pour ne
  pas laisser entendre une marque enregistrée (le registre des marques n'a pas
  été consulté).
- Mention des marques DJI et Agras, et absence de lien avec DJI.
- Avertissements « document modèle, projet d'étude » retirés des pages légales,
  qui décrivent désormais la situation réelle.

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
- Ajout de ce que GitHub enregistre : l'adresse IP de chaque visiteur, « pour des
  raisons de sécurité » (documentation GitHub Pages).
- Nouvelle section « La situation aujourd'hui » : les formulaires n'envoient
  rien tant que le serveur n'est pas en ligne.
- Droits reformulés selon la nLPD (art. 25, 28, 32) au lieu d'une liste inspirée
  du droit européen (« limitation »).
- Conservation : 10 ans pour la comptabilité (art. 958f CO) ; 24 mois au plus
  pour les demandes sans suite, **choix du propriétaire, modifiable**.
- Sanction prévue par la loi : jusqu'à 250 000 francs d'amende en cas
  d'omission intentionnelle du devoir d'informer (art. 60 nLPD).

### 2.3 Cookies et stockage local (art. 45c LTC)

La loi exige d'informer du stockage, de sa finalité et de la **possibilité de le
refuser**. Ajouts : phrase de refus dans le bandeau, section « Refuser ce
stockage » sur la page cookies, lien du bandeau vers cette page. Les quatre clés
listées correspondent exactement au code, et la durée de 7 jours à celle des
sessions du serveur. Aucun traceur, aucune police ni aucun script externe :
vérifié dans le code.

### 2.4 Prix

- L'OIP s'applique à toute publicité pour des consommateurs (art. 2 al. 1
  let. d) et exige alors le « prix à payer effectivement » (art. 13). Un
  particulier propriétaire d'une vigne est un consommateur (art. 2 al. 2).
  « Hors TVA » devient « TVA éventuelle comprise ».
- Le taux de 8,1 % annoncé était faux pour cette activité : l'AFC range
  « sulfater des arbres fruitiers, des vignes ou des légumes » au taux réduit
  (art. 25 al. 2 let. d LTVA, 2,6 % en 2026).

### 2.5 Publicité exacte (art. 3 al. 1 let. b LCD)

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

### 2.6 Crédits des cartes

La carte masquait tous ses crédits (`attributionControl: false`). Or :

- swisstopo : « ©swisstopo » doit figurer « sur toutes les représentations
  graphiques » (conditions OGD, 1.3.2021) ;
- OpenStreetMap : « © OpenStreetMap contributors » visible sur la carte, sans
  cacher l'attribution (politique d'usage des tuiles) ;
- plan cadastral : « © Mensuration Officielle Suisse / FL » dans la langue du
  lecteur, « interdit de supprimer, de dissimuler ou de recouvrir » (licence
  CadastralWebMap, 9.5.2012).

Les trois crédits s'affichent désormais en bas à droite de la carte, et sont
repris dans les mentions légales.

### 2.7 Droits d'auteur

- Photo du Lavaux (CC BY-SA 4.0) : le crédit donne maintenant le nom de l'auteur
  (Joachim Kohler), les liens vers la source et la licence, et signale la
  modification (l'original fait 5 400 × 3 600 pixels, la version du site
  3 200 × 2 354 : recadrée et redimensionnée), comme la licence l'exige.
- Retirés du site, car affichés nulle part mais téléchargeables :
  `agras-t30.jpg`, `hero-drone.jpg`, `t50-flight.jpg`, `t50-eclate.jpg`,
  `t50-eclate.webp`, `vignes-pente.jpg`, et les trois fichiers de la carte
  caméra. Ils restent dans l'historique Git.

### 2.8 Réglementation des drones

Liste de la page Le service précisée d'après la page SPRAY de l'OFAC (mise à jour
du 16.4.2026) : autorisation préalable de l'OFAC, à demander au moins deux mois à
l'avance ; modèle homologué par Agroscope ; contrôle de chaque drone par un
organisme agréé avant la mise en service puis tous les trois ans ; au moins une
personne titulaire du permis OPer-A (RS 814.812.34).

### 2.9 Conditions générales

- For : réserve ajoutée pour les consommateurs, qui ne peuvent pas y renoncer
  d'avance (art. 32 et 35 CPC).
- TVA : même correction qu'en 2.4.
- Réglementation : exigences vérifiées au lieu de la mention « à vérifier ».

## 3. Ce qui reste à faire

### 3.1 Par vous, avant de republier

1. Rendre le site accessible à nouveau (1.1).
2. Renseigner l'adresse postale (1.2).
3. Demander l'accord écrit de DJI ou de votre revendeur (1.3, annexe).

### 3.2 Avant le lancement commercial

- **Homologation du T50** : aucune liste Agroscope n'est publiée en ligne. Faire
  confirmer par Agroscope que le DJI Agras T50 est homologué avant de le
  présenter comme l'appareil utilisé.
- **Canton de Vaud** : depuis le 15 avril 2026, l'OFAC impose en plus, dans les
  cantons du Valais, de Vaud et de Genève, l'outil cartographique en ligne
  SafetySpray et la radiotéléphonie. Les distances de sécurité ont aussi été
  revues début 2026.
- **Conditions générales** : modalités de paiement, conditions d'annulation,
  assurance responsabilité civile.
- **Plan cadastral** : la page actuelle de cadastre.ch dit l'accès gratuit, sans
  parler d'enregistrement ; la licence de 2012, toujours publiée, parle d'un
  usage gratuit « une fois l'enregistrement effectué ». À faire confirmer par
  swisstopo (Direction fédérale des mensurations cadastrales).
- **Registre du commerce, IDE, TVA** : à vérifier selon votre structure et votre
  chiffre d'affaires, auprès du registre du commerce vaudois et de l'AFC.
- **Bandeau de lancement** : passer `preLaunch` à `false` seulement quand les
  autorisations sont obtenues.

### 3.3 Avant d'activer les formulaires en ligne

- **Hébergement** : les conditions de GitHub interdisent d'utiliser Pages pour
  faire tourner une activité commerciale en ligne ou un site « principalement »
  destiné à faciliter des transactions commerciales, et déconseillent d'y faire
  passer des mots de passe. Un site vitrine sans paiement est une zone grise ;
  pour un service commercial avec comptes clients, un hébergeur prévu pour cet
  usage est plus sûr. Un hébergeur suisse simplifierait aussi la section
  « Communication à l'étranger ».
- **Calcul des distances** : le serveur de démonstration OSRM est réservé à un
  usage « raisonnable, non commercial » (FOSSGIS e.V., Allemagne). À remplacer.
- **Politique de confidentialité** : compléter la section 4 avec les prestataires
  retenus.

### 3.4 Remarque

Vos commits Git affichent votre adresse Gmail. GitHub propose une adresse
masquée : Settings > Emails > Keep my email addresses private.

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
- DJI Agras T50, fiche technique, page, FAQ : https://ag.dji.com/t50/specs, https://ag.dji.com/t50, https://ag.dji.com/t50/faq
- DJI, actualités T50 : https://ag.dji.com/newsroom/agras-t50-top-features et https://ag.dji.com/newsroom/agras-t50-intelligent-battery-design
- OpenStreetMap, politique des tuiles : https://operations.osmfoundation.org/policies/tiles/
- OpenStreetMap Foundation, confidentialité : https://osmfoundation.org/wiki/Privacy_Policy
- OSRM, serveur de démonstration : https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
- Wikimedia Commons, photo du Lavaux : https://commons.wikimedia.org/wiki/File:Lavaux_vignobles_en_terrasses_au_bord_du_L%C3%A9man_(2015).jpg

## Annexe : demande d'autorisation à DJI

À envoyer à votre revendeur DJI Agriculture en Suisse, ou à DJI. Gardez la
réponse écrite.

> Objet : autorisation d'utiliser des visuels du DJI Agras T50 sur un site web
>
> Bonjour,
>
> Je prépare le lancement de VitiAero, un service de traitement des vignes par
> drone dans le canton de Vaud, avec le DJI Agras T50. Je souhaite utiliser sur
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
