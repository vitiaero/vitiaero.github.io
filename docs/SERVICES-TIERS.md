# Services tiers et transferts de données

Inventaire de tout ce qui, hors de VitiAero, reçoit des données quand le site
ou le serveur fonctionne. Source unique pour la politique de confidentialité :
les prestataires se déclarent dans `shared/business.js` (`services`), et le
texte publié les reprend automatiquement, avec leur pays et la garantie en cas
de transfert à l'étranger. Un prestataire hors de Suisse sans garantie
indiquée bloque le lancement.

État au 27 septembre 2026. À faire valider par un juriste (liste des pays
adéquats de l'annexe 1 OPDo, contrats de sous-traitance selon l'art. 9 LPD).

## 1. Appelés par le navigateur du visiteur

La politique de sécurité du contenu (`shared/security.js`) n'autorise que ces
domaines : tout autre appel est bloqué par le navigateur.

| Service | Domaine | Quand | Données reçues | Pays | Garantie |
|---|---|---|---|---|---|
| Hébergement du site : GitHub Pages (GitHub, Inc.) | `vitiaero.ch` | Chaque visite | Adresse IP, enregistrée par GitHub « pour des raisons de sécurité » (documentation GitHub Pages) | États-Unis | Certification Swiss-US Data Privacy Framework (statut « Active » vérifié le 24.9.2026, **à revérifier au lancement**) |
| Fonds de carte swisstopo | `wmts.geo.admin.ch` | Page Estimation, fonds Satellite, Carte, Cadastre | Adresse IP, zone de carte affichée | Suisse | Aucune (Suisse) |
| Recherche de lieu swisstopo | `api3.geo.admin.ch` | Recherche d'une commune sur la carte | Adresse IP, texte recherché | Suisse | Aucune (Suisse) |
| Fond « Plan » OpenStreetMap | `tile.openstreetmap.org` | Seulement si le visiteur choisit ce fond | Adresse IP, zone de carte affichée | Royaume-Uni (OpenStreetMap Foundation), réseau de cache mondial | Royaume-Uni : pays adéquat (annexe 1 OPDo). Les pays du réseau de cache ne sont pas publiés : c'est écrit tel quel dans la politique, avec le moyen de l'éviter |

Aucun autre service : pas de mesure d'audience, pas de publicité, pas de
bouton de réseau social, pas de police ni de script chargé depuis un autre
domaine. La police Inter, les images et les vidéos sont servies par le site
lui-même. La photo du Lavaux vient de Wikimedia Commons mais est hébergée par
le site : Wikimedia ne reçoit rien.

## 2. Appelés par le serveur VitiAero

| Service | Rôle | Données | Statut |
|---|---|---|---|
| Hébergeur de l'API, de la base et des pièces jointes | Faire tourner `server/` | Toutes les données des formulaires | **À choisir** (B4). Un hébergeur suisse évite tout transfert |
| Stockage des sauvegardes | Copies chiffrées (AES-256-GCM, clé détenue par VitiAero seulement) | Base et pièces jointes, chiffrées | **À choisir** (B5) |
| Fournisseur d'envoi d'e-mails (SMTP) | Accusés de réception, notifications | Adresse, nom et contenu de l'accusé de réception | **À choisir** (B6) |
| Fournisseur de la boîte `contact@vitiaero.ch` | Réponses aux visiteurs | Messages échangés | **À confirmer** (B6) |
| Calcul des distances | Frais de déplacement | Centre des parcelles | Aucun tiers : vol d'oiseau aujourd'hui, ou OSRM auto-hébergé (voir `EXPLOITATION.md`, section 5). Le serveur public OSRM est refusé |

## 3. Outils de développement et d'exploitation

| Service | Rôle | Données personnelles |
|---|---|---|
| GitHub (dépôt, Actions, Dependabot) | Code, tests, compilation, publication, surveillance horaire | Aucune donnée de visiteur. Le code est public : jamais de secret, de permis ou de contrat dans le dépôt |
| Registre npm | Téléchargement des dépendances à la compilation | Aucune |
| Registraire du domaine `vitiaero.ch` | Nom de domaine | Données du titulaire du domaine. **Titulaire à confirmer** (A10) |

## 4. Transferts à l'étranger

| Destination | Service | Base | Action |
|---|---|---|---|
| États-Unis | GitHub Pages | Certification DPF de GitHub, Inc. (liste officielle) | Revérifier le statut avant le lancement, puis chaque année ; mettre à jour `services.siteHosting.verifiedOn` |
| Royaume-Uni | OpenStreetMap (fond « Plan » uniquement) | Pays adéquat, annexe 1 OPDo | Rien à faire tant que l'annexe ne change pas |
| Inconnue (réseau de cache d'OpenStreetMap) | Fond « Plan » | Information transparente, fond facultatif | Le visiteur peut utiliser les fonds swisstopo |
| Selon le choix | Hébergeur de l'API, sauvegardes, e-mails | À indiquer (`safeguard` : `adequate`, `dpf` ou `scc`) | Préférer un prestataire en Suisse ; sinon, garantie écrite |

## 5. Ajouter ou changer un prestataire

1. Le déclarer dans `shared/business.js` (`services`) : nom, adresse, pays
   (code à deux lettres), garantie si le pays n'est pas la Suisse.
2. Si le navigateur doit l'appeler : ajouter son domaine dans
   `shared/security.js`, sinon il est bloqué.
3. `npm run legal:version`, relire la politique de confidentialité dans les
   trois langues, compléter ce document, puis publier.
4. Conclure le contrat de sous-traitance prévu par l'art. 9 LPD et le garder
   hors du dépôt.
