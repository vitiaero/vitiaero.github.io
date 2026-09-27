# Plan de migration vers un service commercial

État au 27 septembre 2026. Objectif : rendre le site publiable comme un
véritable service commercial suisse, sans jamais inventer de donnée légale,
d'autorisation, d'assurance, de prix, d'entreprise, d'hébergeur ou de droit
d'auteur.

- **P0** : bloquant, avant toute ouverture au public.
- **P1** : avant l'ouverture des formulaires, ou dans les premières semaines.
- **P2** : améliorations ultérieures.

État : **Fait** (dans le code, testé) ; **Propriétaire** (information ou
décision à fournir) ; **Juriste** / **Autorité** (validation externe) ;
**Plus tard** (non commencé).

## P0 : bloquant

| # | Action | État | Où |
|---|---|---|---|
| 1 | Lister les informations manquantes avant tout changement | Fait | `INFORMATIONS-MANQUANTES.md` |
| 2 | Porte de lancement unique (site, serveur, compilation) : bandeau, formulaires fermés, indexation bloquée tant qu'une information obligatoire manque | Fait | `shared/launch.js`, `src/launch.js`, `server/app.js`, `vite.config.js` |
| 3 | Aucune donnée fictive, aucun texte entre crochets, aucune mention de projet d'étude en production ; données de démonstration refusées en production | Fait (vérifié par test) | `test/content.test.js`, `server/db.js` |
| 4 | Retirer tous les médias sans droit commercial confirmé (visuels et vidéos DJI, fichiers d'origine inconnue) | Fait | `public/`, `shared/media.js` |
| 5 | Registre des médias contrôlé à la compilation ; page publique `/credits` | Fait | `scripts/check-media.mjs`, `shared/legal/credits.js` |
| 6 | Mentions légales, confidentialité, cookies, CGV, conditions d'utilisation construites uniquement à partir des données fournies, FR/DE/EN synchronisées, versionnées | Fait (textes) ; données : Propriétaire ; relecture : Juriste | `shared/legal/`, `shared/business.js` |
| 7 | « Pas une commande » sur chaque bouton, formulaire, récapitulatif, confirmation et e-mail ; commande en ligne non activée | Fait | `src/i18n/*.js`, `server/mail-templates.js` |
| 8 | Preuve de lecture : document, version, date, finalité, enregistrement concerné | Fait | table `consents` |
| 9 | Crédits OSM et swisstopo toujours visibles sur la carte | Fait | `src/components/MapDraw.jsx` |
| 10 | Serveur public OSRM remplacé : vol d'oiseau signalé comme approximatif, ou OSRM auto-hébergé ; le serveur public est refusé | Fait | `server/routing.js`, `EXPLOITATION.md` §5 |
| 11 | Arguments réglementaires, assurance et autorisations affichés seulement s'ils sont saisis, complets et non échus | Fait | `validCredentials`, page Le service |
| 12 | Fournir l'identité complète de l'entreprise (A1 à A10) | Propriétaire | `shared/business.js` |
| 13 | Choisir et déclarer l'hébergeur de l'API, les sauvegardes, l'e-mail ; décider du maintien de GitHub Pages (B3 à B7) | Propriétaire | `SERVICES-TIERS.md` |
| 14 | Durées de conservation manquantes (C3 à C6) | Propriétaire | `shared/business.js` |
| 15 | Conditions commerciales (D1 à D17) et assurance RC (D11) | Propriétaire, Juriste | `shared/business.js` |
| 16 | Autorisations OFAC, homologation Agroscope, contrôle du pulvérisateur, permis, télépilote, enregistrement (E1 à E7) | Autorité | `shared/business.js` (`credentials`) |
| 17 | Déclaration d'auteur des images d'Epesses (F1), droits du logo (F2) | Propriétaire | `shared/media.js` |
| 18 | Relecture juridique de tous les textes publiés, formulaires et e-mails (G1) ; checklist signée (G3) | Juriste, Propriétaire | `CHECKLIST-LANCEMENT.md` |

## P1 : avant l'ouverture des formulaires

| # | Action | État | Où |
|---|---|---|---|
| 19 | Conservation limitée : purge quotidienne selon les durées fournies, jamais de durée inventée | Fait | `server/privacy.js` |
| 20 | Export et suppression par le titulaire du compte ; recherche, export et effacement par l'équipe ; journal sans donnée personnelle | Fait | Espace client, administration (onglet Données) |
| 21 | Sauvegardes chiffrées quotidiennes, relues, avec rotation ; restauration outillée | Fait | `server/backup.js`, `npm run backup`, `npm run restore` |
| 22 | Premier exercice de restauration, puis chaque trimestre | Propriétaire | `EXPLOITATION.md` §6 |
| 23 | Accusés de réception et notifications par file d'attente, nouvelles tentatives, formulaires fermés en production sans envoi d'e-mails configuré | Fait | `server/mail.js` |
| 24 | Configurer le SMTP, SPF, DKIM, DMARC | Propriétaire | `EXPLOITATION.md` §4 |
| 25 | Surveillance horaire (pages, indexation, security.txt, certificats, API) ; `/api/health` ; journaux JSON sans donnée personnelle | Fait | `.github/workflows/surveillance.yml` |
| 26 | Tests automatiques à chaque envoi ; publication bloquée si un test échoue | Fait | `.github/workflows/tests.yml`, `deploy-pages.yml` |
| 27 | Accessibilité : tracé de parcelle au clavier, radios natives, focus des étapes, annonces, contrastes, menu mobile ; contrôle axe (WCAG 2.1 AA) | Fait | `e2e/` |
| 28 | Contrôle manuel avec un lecteur d'écran (NVDA, VoiceOver) | Plus tard | |
| 29 | Performance : allemand et anglais chargés à la demande, vidéo AV1 et H.264 réencodée, images WebP, police WOFF2 réduite, pages chargées à la demande | Fait | `src/i18n/index.jsx`, `public/` |
| 30 | Référencement : titre, description, adresse canonique et consigne d'indexation par page à la compilation ; plan du site et données structurées réelles seulement après le lancement ; français par défaut | Fait | `shared/site.js` |
| 31 | Sécurité : CSP stricte, en-têtes, limitation de débit, contrôle des fichiers par signature, security.txt, jetons stockés par empreinte | Fait | `shared/security.js`, `server/app.js` |
| 32 | Réglages de sécurité GitHub (double authentification, protection de `main`, secret scanning) | Propriétaire | `SECURITY.md` §9 |

## P2 : améliorations

| # | Action | État |
|---|---|---|
| 33 | Vérifier l'adresse e-mail à l'inscription (lien de confirmation) : l'export en libre-service pourrait alors inclure les demandes envoyées sans compte | Plus tard |
| 34 | Adresses par langue (`/de/`, `/en/`) avec balises `hreflang`, pour le référencement en allemand et en anglais | Plus tard |
| 35 | Hébergement du site et de l'API chez un prestataire suisse (en-têtes complets, aucun transfert) | Plus tard, décision B3 |
| 36 | Base de données gérée si le volume augmente (seul `server/db.js` est à adapter) | Plus tard |
| 37 | Rapport d'intervention généré en PDF depuis l'administration | Plus tard |
| 38 | Logo vectoriel (SVG) une fois ses droits établis | Plus tard |
| 39 | Photos réelles du matériel et des chantiers, avec accords écrits (F4) | Plus tard |
| 40 | Relecture professionnelle des traductions (G2) | Plus tard |

## Si la commande en ligne devait être activée un jour

Aujourd'hui `commercial.onlineOrdering` doit rester `false` : la porte de
lancement refuse `true`, car le parcours contractuel n'existe pas. Il faudrait
au minimum, à faire spécifier et valider par un juriste :

1. Récapitulatif complet avant l'engagement : prestation, prix total effectif
   (TVA, déplacements, produits), dates, conditions d'annulation et de report.
2. Acceptation explicite des CGV (case non cochée, version enregistrée comme
   aujourd'hui pour la confidentialité) et bouton sans ambiguïté.
3. Confirmation écrite de la commande par e-mail, avec les CGV applicables.
4. Règles de paiement (acompte éventuel, moyens, facture QR) et de
   facturation.
5. Identification du client professionnel ou consommateur, et règles propres
   aux consommateurs (prix, for).
6. Conservation des preuves du contrat (durée C2).
