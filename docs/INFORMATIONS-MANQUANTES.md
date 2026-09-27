# Informations à fournir par le propriétaire

État au 27 septembre 2026. Cette liste a été établie **avant toute modification du
code**, à partir du dépôt tel qu'il était (commit `128f36a`). Rien n'y est inventé :
chaque ligne dit ce qui manque, pourquoi, et ce que le site fait tant que l'information
n'est pas fournie.

Ce document n'est pas un avis juridique. Les bases légales citées viennent de la
vérification du 24 septembre 2026 (`docs/CONFORMITE.md`) ; elles doivent être
revérifiées par un juriste suisse et, pour les drones et les produits
phytosanitaires, par les autorités compétentes (OFAC, Agroscope, service cantonal).

## Comment lire ce document

| Niveau | Effet sur le site |
|---|---|
| **Bloquant** | Tant que l'information manque, le site reste en pré-lancement : bandeau explicite, formulaires désactivés, indexation bloquée. |
| **Recommandé** | N'empêche pas le lancement, mais réduit un risque ou améliore la confiance. |
| **À confirmer** | La valeur existe déjà dans le dépôt (fournie par le propriétaire). Elle doit être confirmée par écrit dans la checklist de lancement. |

Règles de saisie, dans `shared/business.js` :

- `null` veut dire « pas encore fourni ». C'est la valeur par défaut, et elle bloque.
- `false` veut dire « sans objet », déclaré par le propriétaire (par exemple : pas de
  numéro TVA parce que l'entreprise n'est pas assujettie).
- Aucune valeur d'exemple, aucun texte entre crochets.
- **Ne jamais déposer dans le dépôt** une copie de permis, d'attestation, de contrat
  ou de police d'assurance : le dépôt est public. On n'y inscrit que la référence,
  la date et l'autorité ; le document reste dans vos dossiers.

---

## A. Identité de l'entreprise

Base : art. 3 al. 1 let. s LCD (identité et adresse de contact, y compris
l'e-mail), art. 19 al. 2 let. a nLPD (identité et coordonnées du responsable).

| N° | Information | Pourquoi | Niveau | État au 27.9.2026 |
|---|---|---|---|---|
| A1 | Raison sociale exacte, telle qu'inscrite au registre du commerce, ou nom et prénom du titulaire si l'entreprise n'est pas inscrite | Mentions légales, CGV, e-mails, en-tête des PDF | Bloquant | Manquant. Le site affiche « VitiAero (Adrien Delhay) », qui n'est pas une raison sociale vérifiée |
| A2 | Forme juridique (raison individuelle, Sàrl, SA, autre) | Mentions légales, CGV | Bloquant | Manquant |
| A3 | Inscription au registre du commerce : oui (canton) ou non | Mentions légales. Le seuil d'inscription obligatoire (art. 931 CO) est à vérifier avec le registre vaudois | Bloquant | Manquant |
| A4 | Numéro IDE (CHE-123.456.789) ou déclaration « aucun » | Mentions légales, factures | Bloquant | Manquant |
| A5 | TVA : numéro (CHE-123.456.789 TVA) et taux appliqué, confirmés par la fiduciaire ou l'AFC, ou déclaration « non assujetti » | Les prix affichés aux consommateurs doivent être les prix effectivement à payer (art. 13 OIP). Le site affiche aujourd'hui « TVA éventuelle comprise », formule provisoire | Bloquant | Manquant |
| A6 | Adresse postale complète : rue et numéro, NPA, localité | Mentions légales, confidentialité, CGV (for) | Bloquant | Manquant. Le site affichait « [ADRESSE], [NPA] [VILLE] » |
| A7 | Adresse e-mail de contact : confirmer que `contact@vitiaero.ch` existe et est relevée | Contact légal, demandes nLPD | Bloquant | À confirmer |
| A8 | Téléphone publié, ou « aucun numéro publié » | Confort, bouton « Appeler » sur mobile | Recommandé | Manquant |
| A9 | Personne responsable du contenu : Adrien Delhay | Mentions légales | Bloquant | À confirmer |
| A10 | Nom de domaine : titulaire de `vitiaero.ch` (doit être l'entreprise), adresse finale du site (`vitiaero.ch` ou `www.vitiaero.ch`) | Adresse canonique, e-mails, preuve de contrôle du domaine | Bloquant | Domaine configuré (`CNAME`), titulaire non confirmé |
| A11 | Recherche d'antériorité sur la marque « VitiAero » (Swissreg, IGE) | Éviter un conflit de marque | Recommandé | Non faite |

## B. Protection des données, hébergement, stockage

Base : art. 9 (sous-traitance), 16 et 17 (communication à l'étranger), 19 (devoir
d'informer) nLPD ; annexe 1 OPDo (États à protection adéquate).

| N° | Information | Pourquoi | Niveau | État au 27.9.2026 |
|---|---|---|---|---|
| B1 | Responsable du traitement (en principe l'entreprise de A1) et adresse pour les demandes d'accès, de rectification et d'effacement | Politique de confidentialité | Bloquant | Dépend de A1 et A6 |
| B2 | Conseiller à la protection des données désigné, ou aucun (art. 10 nLPD, facultatif) | Politique de confidentialité | Recommandé | Manquant |
| B3 | Hébergeur du site public : garder GitHub Pages (GitHub, Inc., États-Unis) ou changer | Les règles de GitHub Pages interdisent de l'utiliser principalement pour une activité commerciale en ligne. Décision du propriétaire | Bloquant | GitHub Pages en place, décision à prendre |
| B4 | Hébergeur de l'API, de la base de données et des pièces jointes : société, pays, région du centre de données, contrat de sous-traitance signé | Politique de confidentialité, transferts à l'étranger | Bloquant | Manquant |
| B5 | Sauvegardes : prestataire et pays du stockage, fréquence, chiffrement, personne qui détient la clé, date du dernier test de restauration | Politique de confidentialité, continuité | Bloquant | Manquant |
| B6 | E-mail : fournisseur de la boîte `contact@vitiaero.ch` (réception) et service d'envoi SMTP (accusés de réception), avec leur pays | Politique de confidentialité, e-mails de réception | Bloquant | Manquant |
| B7 | Calcul des distances routières : serveur OSRM auto-hébergé (où), autre prestataire (nom, pays), ou calcul à vol d'oiseau seulement | Le serveur public de démonstration OSRM est réservé à un usage non commercial | Bloquant si un prestataire externe est retenu | Retrait du serveur public prévu par cette migration (voir `docs/EXPLOITATION.md`) |
| B8 | Surveillance de disponibilité : contrôle planifié GitHub Actions (fourni) ou service externe (nom, pays) | Politique de confidentialité si service externe | Recommandé | Manquant |
| B9 | Durée de conservation des journaux chez l'hébergeur de l'API (selon son contrat) | Politique de confidentialité | Bloquant | Manquant |
| B10 | Effectif et évaluation du risque, pour savoir si un registre des activités de traitement est obligatoire (art. 12 nLPD, art. 24 OPDo) | Documentation interne | Recommandé | Manquant |
| B11 | Personne chargée d'annoncer une violation de la sécurité des données au PFPDT (art. 24 nLPD) | Procédure interne | Recommandé | Manquant |

## C. Durées de conservation réelles

| N° | Donnée | Niveau | État au 27.9.2026 |
|---|---|---|---|
| C1 | Demandes sans suite (estimations, devis, messages) | Bloquant | À confirmer : 24 mois après le dernier échange, choix du propriétaire du 24.9.2026 |
| C2 | Dossiers liés à un contrat (demande acceptée, interventions réalisées) | Bloquant | À confirmer : 10 ans (art. 958f CO, pièces comptables), choix du 24.9.2026. La fiduciaire doit confirmer que ces enregistrements en font partie |
| C3 | Pièces jointes des demandes de devis | Bloquant | Manquant |
| C4 | Comptes clients inactifs | Bloquant | Manquant |
| C5 | Sauvegardes | Bloquant | Manquant |
| C6 | Journaux du serveur (voir B9) | Bloquant | Manquant |
| C7 | Preuves d'acceptation de la politique : règle proposée, supprimées avec la demande à laquelle elles se rattachent | Bloquant | À valider |

## D. Conditions commerciales (CGV)

| N° | Information | Niveau | État au 27.9.2026 |
|---|---|---|---|
| D1 | Clientèle : professionnels seulement, ou aussi particuliers (consommateurs). Change les règles applicables (OIP, art. 8 LCD, for des consommateurs) | Bloquant | Manquant |
| D2 | Durée de validité des devis | Bloquant | Manquant |
| D3 | Paiement : délai, acompte (oui ou non, pourcentage), moyens acceptés, moment de la facturation | Bloquant | Manquant |
| D4 | Retard de paiement : frais de rappel éventuels | Recommandé | Manquant |
| D5 | Annulation par le client : délai de préavis, frais | Bloquant | Manquant |
| D6 | Report pour météo ou impossibilité technique : sans frais ou non. Les anciennes CGV le promettaient sans frais | Bloquant | À confirmer |
| D7 | Déplacement inutile (accès impossible, client absent) : facturé ou non | Recommandé | Manquant |
| D8 | Produits phytosanitaires : qui les fournit, qui prépare la bouillie, qui choisit le produit et répond de son autorisation | Bloquant | Manquant. Le site dit seulement « non compris, sauf indication contraire dans le devis » |
| D9 | Réclamations : délai et forme pour signaler un problème | Bloquant | Manquant |
| D10 | Limitation de responsabilité éventuelle, à faire rédiger par un juriste (art. 100 CO) | Bloquant (validation) | Manquant |
| D11 | Assurance responsabilité civile : assureur, numéro de police, somme d'assurance, activités couvertes (drone, dérive de produit, dommages aux cultures voisines), validité | Bloquant | Manquant |
| D12 | For : localité du siège (dépend de A6) | Bloquant | Manquant |
| D13 | Langue qui fait foi en cas de divergence (proposition : français) | Recommandé | À confirmer |
| D14 | Grille tarifaire de `shared/pricing.js` et base de départ exacte des déplacements (aujourd'hui : centre de la commune de Chardonne) | Bloquant | À confirmer (grille fournie en septembre 2026) |
| D15 | Délai de réponse annoncé (« 48 h, en général ») et rayon d'intervention (100 km) | Bloquant | À confirmer |
| D16 | Conditions réelles de chaque code promo avant de l'activer | Recommandé | Aucun code réel |
| D17 | Commande en ligne : non prévue. L'estimation n'est pas une commande. Si elle devait être activée, le parcours contractuel complet serait à spécifier (voir `docs/PLAN-MIGRATION.md`) | Décision | Non activée |

## E. Autorisations, homologations, formations

Pour chaque ligne : titulaire, numéro ou référence, autorité, date de délivrance, date
d'échéance, périmètre. Rien n'est affiché sur le site tant que ces éléments ne sont pas
saisis, et un justificatif échu disparaît tout seul.

| N° | Justificatif | Niveau | État au 27.9.2026 |
|---|---|---|---|
| E1 | Autorisation de l'OFAC pour la pulvérisation par drone (selon l'OFAC, à demander au moins deux mois à l'avance) | Bloquant | Manquant |
| E2 | Exigences propres aux cantons de Vaud, du Valais et de Genève depuis le 15.4.2026 (outil cartographique SafetySpray, radiotéléphonie) | Bloquant | Manquant, à vérifier auprès de l'OFAC |
| E3 | Homologation du modèle de drone (DJI Agras T50) par Agroscope : confirmation écrite | Bloquant | Manquant. Aucune liste publique trouvée le 24.9.2026 |
| E4 | Contrôle du pulvérisateur par un organisme agréé : attestation, date, prochaine échéance (tous les trois ans) | Bloquant | Manquant |
| E5 | Permis pour l'utilisation professionnelle de produits phytosanitaires (OPer-A, RS 814.812.34) : titulaire, numéro | Bloquant | Manquant |
| E6 | Compétences de télépilote exigées pour cette exploitation (certificats, formation) | Bloquant | Manquant, à vérifier auprès de l'OFAC |
| E7 | Enregistrement de l'exploitant de drones auprès de l'OFAC | Bloquant | Manquant, à vérifier auprès de l'OFAC |
| E8 | Assurance responsabilité civile (voir D11) | Bloquant | Manquant |
| E9 | Date de mise en service du drone (le site dit « drone prévu ») | Recommandé | Manquant |

## F. Médias, marques et droits d'auteur

État des fichiers publiés au 27.9.2026 (commit `128f36a`) :

| Fichier | Origine | Droit commercial | Décision |
|---|---|---|---|
| `videos/hero-1080.mp4`, `hero-2160.mp4`, `hero-2160.av1.mp4` | Extrait promotionnel DJI | Non (conditions DJI : accord écrit préalable) | Retrait |
| `images/hero-poster.jpg` | Non confirmée, probablement DJI | Non confirmé | Retrait |
| `images/drone-cutout.png` | Non confirmée, probablement DJI | Non confirmé | Retrait |
| `images/t50-rows.jpg` | Non confirmée, probablement DJI | Non confirmé | Retrait |
| `images/equip/*` (10 fichiers) et `videos/equip/*` (12 fichiers) | DJI (ag.dji.com) et fichiers d'origine DJI | Non | Retrait |
| `images/lavaux.jpg` | Joachim Kohler, Wikimedia Commons | Oui, licence CC BY-SA 4.0, avec crédit et mention des modifications | Conservé, crédité |
| `videos/vignoble-fpv-*`, `images/vignoble-poster.jpg` | Adrien Delhay (déclaration du propriétaire, `docs/CREDITS-IMAGES.txt`) | Oui si la déclaration est confirmée | Conservé, déclaration à signer (F1) |
| `images/logo-vitiaero.png`, `logo-vitiaero-full.png` | « Logo du projet », auteur non documenté | À confirmer | Conservé en pré-lancement, bloque le lancement tant que F2 manque |
| `favicon.svg` | Dessin vectoriel créé dans le projet | Oui (création du projet) | Conservé |
| `fonts/Inter-Variable.ttf` | The Inter Project Authors | Oui, licence SIL Open Font License 1.1 | Conservé, licence publiée |

Informations à fournir :

| N° | Information | Niveau |
|---|---|---|
| F1 | Déclaration écrite d'auteur des images FPV d'Epesses, et confirmation qu'aucune personne n'y est reconnaissable et que le vol respectait les règles en vigueur | Bloquant |
| F2 | Origine du logo : création propre, graphiste (avec cession des droits), ou outil de génération (et ses conditions d'usage commercial) | Bloquant |
| F3 | Accord écrit de DJI si des visuels DJI doivent revenir un jour. Sans accord, ils restent retirés | Recommandé |
| F4 | Photos réelles du matériel et des chantiers, avec l'accord des personnes visibles et des propriétaires des parcelles | Recommandé |
| F5 | Usage des marques DJI et Agras : uniquement pour nommer le drone prévu, sans logo. À faire valider par le juriste | Bloquant (validation) |
| F6 | Plan cadastral : faire confirmer par swisstopo (Direction fédérale des mensurations cadastrales) si un enregistrement est nécessaire | Recommandé |

## G. Validation et signatures

| N° | Information | Niveau |
|---|---|---|
| G1 | Relecture par un juriste suisse : mentions légales, confidentialité, cookies, CGV, conditions d'utilisation, textes des formulaires et des e-mails. Nom, date, documents relus | Bloquant |
| G2 | Relecture des versions allemande et anglaise par un traducteur | Recommandé |
| G3 | Signature de la checklist de lancement (`docs/CHECKLIST-LANCEMENT.md`) | Bloquant |

## H. Réglages techniques (secrets, jamais dans le dépôt)

À définir chez l'hébergeur de l'API, pas dans le code : `ADMIN_PASSWORD`,
`BACKUP_KEY`, identifiants SMTP, `ALLOWED_ORIGINS`, et côté GitHub la variable
`VITE_API_URL`. La liste complète est dans `docs/EXPLOITATION.md`.

## Ce que fait le site tant que des informations bloquantes manquent

- Un bandeau indique en clair que le service est en pré-lancement.
- L'estimation se calcule dans le navigateur et peut être imprimée, mais aucun
  formulaire n'envoie de données : estimation, devis, contact et création de compte
  sont désactivés, dans le navigateur **et** sur le serveur.
- L'indexation est bloquée (`robots.txt`, balise `noindex`, en-tête `X-Robots-Tag`),
  aucun plan du site n'est publié.
- Les pages légales n'affichent que les informations réelles déjà fournies, sans
  crochets ni valeurs d'exemple, et signalent ce qui sera publié avant l'ouverture.
- Aucun justificatif (autorisation, assurance, homologation) n'est affiché.
- L'administration (onglet « Lancement ») liste les points bloquants restants.
