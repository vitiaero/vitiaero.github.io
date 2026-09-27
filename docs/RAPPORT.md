# Rapport de migration du 27 septembre 2026

Objectif : rendre VitiAero publiable comme véritable service commercial suisse,
sans inventer aucune donnée légale, autorisation, assurance, prix, entreprise,
hébergeur ou droit d'auteur.

Ce rapport n'est pas un avis juridique. Les points signalés doivent être
validés par un juriste suisse et par les autorités compétentes (OFAC,
Agroscope, canton, AFC).

## 1. Résultat

Le site est prêt techniquement et **verrouillé en pré-lancement** : tant que
les informations bloquantes ne sont pas fournies, il affiche un bandeau
explicite, n'envoie aucune donnée depuis ses formulaires (fermés dans le
navigateur et refusés par le serveur) et n'est pas indexé. Il s'ouvrira de
lui-même quand tout sera renseigné, validé et signé : aucun réglage manuel
n'est à faire le jour du lancement.

État au 27.9.2026 : **36 informations bloquantes sur 43 contrôles**
(`npm run launch:status`).

## 2. Livrables

| Livrable | Où |
|---|---|
| Liste des informations manquantes, établie avant toute modification (commit `c4fc7be`) | `docs/INFORMATIONS-MANQUANTES.md` |
| Plan de migration priorisé P0 / P1 / P2, avec l'état de chaque point | `docs/PLAN-MIGRATION.md` |
| Modifications du code, testées | commits `8c88daa` et suivant, branche `claude/charming-tesla-6ivg08` |
| Checklist légale de lancement à faire valider et signer | `docs/CHECKLIST-LANCEMENT.md` |
| Services tiers et transferts de données | `docs/SERVICES-TIERS.md` |
| Exploitation : e-mails, distances, sauvegardes, conservation, surveillance | `docs/EXPLOITATION.md` |
| Conformité règle par règle et sources officielles | `docs/CONFORMITE.md` |
| Ce rapport | `docs/RAPPORT.md` |

## 3. Contrôles effectués

| Contrôle | Commande | Résultat |
|---|---|---|
| Tests automatiques (porte de lancement, textes juridiques, traductions, médias, API, formulaires, conservation, e-mails, sauvegardes, distances) | `npm test` | **69 réussis, 0 échec** |
| Compilation | `npm run build` | Réussie. Pré-lancement détecté (36 informations bloquantes) ; médias et versions des textes contrôlés |
| Audit des dépendances | `npm audit` | **0 vulnérabilité** |
| Tests dans le navigateur (Chromium) | `npm run test:e2e` | **30 réussis, 0 échec** : 15 pré-lancement, 11 mobile, 4 formulaires |
| Accessibilité automatique (axe, WCAG 2.1 A et AA) | inclus dans `test:e2e` | Aucune violation, quelle que soit sa gravité, sur 7 pages (bureau) et 3 pages (mobile), ni sur un formulaire ouvert avec erreurs affichées et l'espace client |
| Contrôle mobile | inclus dans `test:e2e` | Aucun débordement horizontal sur 15 pages : à 360, 412 et 768 px en français, à 360 px en allemand et en anglais ; menu (focus, Échap), barre d'action, cibles tactiles, tracé au doigt |
| Formulaires dans le navigateur | inclus dans `test:e2e` | Estimation complète, contact, devis avec photo, inscription, export JSON et suppression du compte |
| Intégration continue GitHub | workflow « Tests » | Réussi sur le commit `8c88daa` (tests, compilation, audit, navigateur) |
| Serveur de production local | `npm run check:production` | Pages, `robots.txt`, `security.txt`, santé de l'API : en ordre |

Défauts trouvés et corrigés pendant ces vérifications : contraste du lien de
navigation actif (4,4:1 au lieu de 4,5:1), aide d'un champ effacée par la
validation, mise en page du choix du nombre de passages, boutons et titres
allemands qui débordaient à 360 px, outil de sauvegarde qui ouvrait la base en
écriture pendant que le serveur tourne.

Mesures :

| | Avant | Après |
|---|---|---|
| Médias publiés (`public/`) | 289,9 Mo | 30,2 Mo |
| Vidéo la plus lourde | 88,9 Mo (4K) | 14,3 Mo (1080p H.264), 8,9 Mo en AV1 |
| JavaScript principal | 374,8 Ko (124,0 Ko compressé) avant le chargement à la demande des langues | 294,4 Ko (97,7 Ko compressé) |

## 4. Ce qui a changé

### Porte de lancement et données réelles
- `shared/business.js` : données de l'entreprise (`null` = non fourni, bloque).
- `shared/launch.js` : 43 contrôles ; `src/launch.js` (navigateur),
  `server/app.js` (503 en production), `vite.config.js` (indexation).
- `scripts/launch-status.mjs` : `npm run launch:status`.

### Textes juridiques FR / DE / EN
- `shared/legal/` : mentions, confidentialité, cookies, CGV, conditions
  d'utilisation, crédits ; versions et empreintes (`versions.js`,
  `scripts/legal-version.mjs`). Anciennes pages `src/pages/legal/` supprimées.
- Preuve de lecture enregistrée par le serveur (table `consents`).

### Médias
- Retirés : 42 fichiers (visuels et vidéos DJI, fichiers d'origine non
  confirmée, anciennes versions). Ajoutés : vidéo et images réencodées du
  propriétaire, photo du Lavaux en WebP, logo en WebP, police WOFF2, icône.
- `shared/media.js` (registre), `scripts/check-media.mjs`, page `/credits`,
  `licences-tiers.txt` généré (`scripts/third-party-licenses.mjs`), schémas
  originaux (`src/components/Illustrations.jsx`).

### Serveur
- `server/app.js` (API), `server/index.js` (démarrage, tâches), `server/db.js`
  (schéma, migrations, persistance atomique), `server/mail.js` et
  `mail-templates.js` (e-mails), `server/privacy.js` (conservation, export,
  effacement), `server/backup.js` et `backup-cli.js` (sauvegardes),
  `server/routing.js` (distances), `server/log.js` (journaux).

### Site
- Pages : `src/pages/*.jsx` (13 fichiers) ; composants nouveaux : `Notices`,
  `ConsentCheckbox`, `LangSuggest`, `Illustrations` ; `MapDraw` (clavier,
  crédits), `Header` (menu mobile), `Footer`.
- Textes : `src/i18n/fr.js`, `de.js`, `en.js` ; moteur `src/i18n/index.jsx`
  (langues à la demande).
- `src/styles.css`, `index.html`, `shared/site.js` (en-têtes de page,
  `robots.txt`, plan du site, `security.txt`), `shared/security.js`.

### Tests et automatisation
- `test/` (7 fichiers Node), `e2e/` (Playwright), `playwright.config.js`.
- `.github/workflows/tests.yml` (nouveau), `surveillance.yml` (nouveau),
  `deploy-pages.yml` (tests avant publication, `security.txt`, recompilation
  hebdomadaire).
- `package.json` : scripts, `@turf/area` au lieu de `@turf/turf`, `nodemailer`,
  outils de test.

### Documentation
- Nouveaux : `PLAN-MIGRATION.md`, `CHECKLIST-LANCEMENT.md`, `SERVICES-TIERS.md`,
  `EXPLOITATION.md`, `RAPPORT.md`.
- Mis à jour : `README.md`, `CONFORMITE.md`, `SECURITY.md`, `DEPLOIEMENT.md`,
  `MODIFIER.md`, `REPRISE.md`, `DESIGN.md`, `INFORMATIONS-MANQUANTES.md`,
  `CREDITS-IMAGES.txt`.

En tout, depuis la liste des informations manquantes : 164 fichiers, dont 71
ajoutés, 50 modifiés, 42 supprimés et une vidéo remplacée.

## 5. Informations encore nécessaires

Détail et références : `INFORMATIONS-MANQUANTES.md`. En résumé :

| Domaine | À fournir |
|---|---|
| Entreprise (A) | Raison sociale, forme juridique, registre du commerce, IDE, TVA (numéro et taux, ou non assujetti), adresse, titulaire du domaine, clientèle visée |
| Prestataires (B) | Décision sur GitHub Pages ; hébergeur de l'API ; stockage des sauvegardes ; boîte e-mail et service d'envoi ; choix du calcul des distances ; contrats de sous-traitance |
| Conservation (C) | Pièces jointes, comptes inactifs, sauvegardes, journaux ; confirmation des 24 mois et 10 ans |
| Commercial (D) | Validité des devis, paiement, annulation, report pour météo, produits phytosanitaires, réclamations, assurance RC |
| Autorisations (E) | OFAC (pulvérisation, exigences cantonales, télépilote, enregistrement), Agroscope (homologation), contrôle du pulvérisateur, permis OPer-A |
| Médias (F) | Déclaration d'auteur des images d'Epesses (F1), droits du logo (F2) |
| Validation (G) | Relecture juridique de tous les textes, formulaires et e-mails ; checklist signée |

À faire valider en particulier :

- **Juriste suisse** : tous les textes publiés, la limitation de
  responsabilité, les règles applicables aux consommateurs, l'usage de GitHub
  Pages pour une activité commerciale, le registre des activités de traitement.
- **Autorités** : autorisations et exigences drones et produits
  phytosanitaires, TVA, registre du commerce, plan cadastral.
- **Sources** : les textes s'appuient sur les sources officielles consultées le
  24.9.2026 (`CONFORMITE.md`). Elles n'ont pas pu être reconsultées le
  27.9.2026 depuis l'environnement de travail (accès réseau restreint) : à
  revérifier avant le lancement, notamment la page SPRAY de l'OFAC et le statut
  DPF de GitHub.

## 6. Limites connues

- Les e-mails ont été testés avec un transport en mémoire, pas avec un vrai
  serveur SMTP (aucun identifiant fourni). À tester lors de la configuration.
- OSRM auto-hébergé : documenté et testé contre un serveur simulé ; non
  installé. Le réglage actuel (vol d'oiseau, signalé comme approximatif) est
  utilisable en production.
- La restauration des sauvegardes est testée sur des données temporaires ; un
  exercice réel reste à faire sur l'hébergement choisi.
- Les contrôles d'accessibilité automatiques ne remplacent pas un test avec un
  lecteur d'écran (P2).
- Le site en ligne n'a pas été republié : la branche n'est pas fusionnée dans
  `main`. La surveillance horaire ne tournera qu'après la fusion, et échouera
  tant que la nouvelle version n'est pas publiée (par exemple `security.txt`).
