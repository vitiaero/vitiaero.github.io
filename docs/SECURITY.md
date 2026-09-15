# Sécurité et protection des données, VitiAero

Audit du 14 septembre 2026, avant publication sur GitHub Pages. Ce document dit ce
qui est en place, ce qui a été corrigé, et surtout **ce qui reste à faire**. Il ne
garantit pas une sécurité totale : aucun site ne peut l'être. Les textes légaux
sont des modèles, à faire valider par une personne compétente.

Signaler une faille : écrire à l'adresse de contact du site, sans publier le détail
dans une issue GitHub publique.

---

## 1. Architecture : ce que GitHub Pages peut et ne peut pas faire

GitHub Pages sert uniquement des **fichiers statiques** (HTML, CSS, JavaScript,
images). Il n'exécute aucun code serveur, n'a pas de base de données et ne permet
pas de choisir les en-têtes HTTP.

Or plusieurs fonctions du site ont besoin d'un serveur :

| Fonction | GitHub Pages seul | Pourquoi |
|---|---|---|
| Vitrine, pages légales, FAQ, équipement | Oui | Fichiers statiques |
| Carte, dessin et import de parcelles, recherche de lieu | Oui | Tout se passe dans le navigateur (swisstopo, OpenStreetMap) |
| Calcul du prix affiché | Oui | `shared/pricing.js` tourne dans le navigateur |
| Distance par la route (frais de déplacement) | **Non** | Appel au service d'itinéraire par le serveur |
| Envoi d'une estimation, d'un message, d'une demande de devis | **Non** | Il faut valider, enregistrer et limiter les abus côté serveur |
| Pièces jointes | **Non** | Stockage privé, contrôle du contenu |
| Comptes, connexion, fidélité, administration | **Non** | Mots de passe, sessions, base de données |

**Architecture retenue**, qui garde toutes les fonctions :

```
Visiteur
   │ HTTPS
   ▼
Site statique ── GitHub Pages (HTML, CSS, JS publics, aucun secret)
   │ HTTPS + CORS (origine du site uniquement)
   ▼
API Node/Express ── hébergeur séparé (server/)
   │
   ▼
Base de données + pièces jointes (jamais publiques)
```

- Le site est compilé par GitHub Actions avec `VITE_API_URL` (adresse de l'API,
  publique par nature).
- L'API n'accepte les appels du navigateur que depuis l'origine déclarée dans
  `ALLOWED_ORIGINS`.
- Tant qu'aucune API n'est en ligne, la vitrine fonctionne, mais les formulaires,
  la connexion et l'administration affichent une erreur. Voir `DEPLOIEMENT.md`.

---

## 2. Résultat de l'audit

### Critique
Aucun problème critique trouvé : pas de secret dans le code, pas d'historique Git
(aucun commit encore), pas de XSS exploitable, pas d'accès administrateur sans
authentification.

### Élevé (corrigés)
| Problème | Risque | Correction | Fichiers |
|---|---|---|---|
| Limitation de débit contournable en changeant l'écriture de l'adresse (`/API/AUTH/LOGIN`, barre finale) | Force brute illimitée sur les mots de passe | Compteur par nom de limiteur, plus par chemin | `server/index.js` |
| Pièces jointes acceptées sur le seul type annoncé par le navigateur | Dépôt de HTML ou de script déguisé en image | Vérification de la signature binaire, base64 strict, contrôle de tous les fichiers avant écriture | `server/index.js` |
| Routes asynchrones sans capture d'erreur | Une erreur inattendue arrête le serveur (déni de service) | Enveloppe `safe()` vers le gestionnaire d'erreurs | `server/index.js` |
| Dépendances vulnérables : `react-router` (redirection ouverte), `qs` via Express (déni de service), `esbuild` via Vite (serveur de développement lisible par un site tiers) | Selon la faille | `react-router-dom` 7.18, `express` 4.22.3, `vite` 7.3. `npm audit` : 0 vulnérabilité | `package.json`, `package-lock.json` |
| Aucune CSP sur le site | Toute injection de script aurait pu s'exécuter et voler le jeton de session | CSP stricte, sans `unsafe-inline` ni `unsafe-eval` | `shared/security.js`, `vite.config.js`, `server/index.js` |

### Moyen (corrigés)
| Problème | Correction | Fichiers |
|---|---|---|
| Codes promo de démonstration (publics dans le dépôt) créés aussi en production | Données de démonstration uniquement en local, ou si `DEMO_DATA=1` | `server/db.js` |
| Boutons « comptes de démonstration » visibles en ligne (adresse admin exposée, boutons inutiles car les mots de passe diffèrent) | Affichés seulement en développement | `src/pages/Login.jsx` |
| Jetons de session stockés en clair en base | Seule l'empreinte SHA-256 est stockée ; anciennes sessions supprimées | `server/db.js`, `server/index.js` |
| PBKDF2 à 120 000 itérations, calcul bloquant | 600 000 itérations, calcul asynchrone, mise à niveau automatique à la connexion | `server/db.js`, `server/index.js` |
| Réponse plus rapide quand le compte n'existe pas (on devine les adresses inscrites) | Le mot de passe est toujours vérifié | `server/index.js` |
| Validation de code promo sans limite | 20 essais par IP toutes les 15 minutes | `server/index.js` |
| Champs de l'estimation (téléphone, adresse, message...) sans contrôle de type ni de longueur | Texte simple et longueur maximale côté serveur ; `maxLength` côté navigateur | `server/index.js`, formulaires `src/pages/*.jsx` |
| Remise d'un code promo sans borne (prix négatif possible) | Entier de 0 à 100, format du code contrôlé | `server/index.js` |
| Corps de 20 Mo lus avant la limitation de débit | Garde-fou général placé avant la lecture du corps | `server/index.js` |
| `trust proxy` fixe : sans proxy, l'IP peut être falsifiée | Réglable par `TRUST_PROXY`, `loopback` en local | `server/index.js` |
| Notes internes (« droits DJI non confirmés ») publiées dans `public/images/CREDITS.txt` | Déplacées dans `docs/CREDITS-IMAGES.txt`, hors du site | `docs/`, `scripts/download-images.js` |
| Nom d'utilisateur Windows dans la documentation | Chemins locaux retirés | `docs/REPRISE.md` |

### Faible (corrigés ou acceptés)
- Retour après connexion : seuls les chemins internes sont acceptés (`Login.jsx`).
- Adresse e-mail d'un client encodée dans le lien `mailto:` de l'administration.
- Pièces jointes : seules les images s'ouvrent dans un onglet ; les PDF se
  téléchargent (la CSP `object-src 'none'` peut bloquer le lecteur PDF).
- Erreurs : réponses génériques (400, 413, 500), aucune pile d'appels envoyée.
- Métadonnées retirées sans perte de 15 images (commentaire d'encodeur, bloc EXIF
  d'un PNG). Aucune position GPS ni aucun appareil photo trouvés. Les vidéos ne
  contiennent que le nom de l'encodeur.
- Accepté : le jeton de session reste dans `localStorage`. Un cookie `HttpOnly`
  serait plus robuste face au XSS, mais entre GitHub Pages et une API sur un autre
  domaine il devient un cookie tiers, bloqué par de plus en plus de navigateurs.
  La CSP stricte et l'absence de code HTML injecté compensent ce choix.
- Accepté : le code de l'administration est public (comme tout le JavaScript).
  Il ne contient aucun secret ; toutes les vérifications de droits sont faites
  par le serveur.

### OK (vérifié)
- Aucun secret, mot de passe, clé, jeton ou fichier `.env` dans les fichiers suivis.
- Aucun `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write`.
  React échappe tout le texte ; les infobulles de la carte n'affichent que des textes
  du site ; le libellé de recherche swisstopo est nettoyé et affiché en texte.
- Import KML : `DOMParser` du navigateur, qui ne charge aucune entité externe.
- Requêtes SQL toutes paramétrées.
- Aucun cookie. Aucun traceur, aucune statistique, aucun Google Fonts, aucun CDN :
  police et bibliothèques sont servies par le site lui-même (pas de SRI nécessaire).
- Aucun contenu en HTTP : toutes les ressources externes sont en HTTPS.
- Aucun lien externe ouvert dans un nouvel onglet ; les liens internes en nouvel
  onglet ont `rel="noreferrer"` (qui implique `noopener`).
- Aucune redirection pilotée par un paramètre d'URL.
- Pas de fichier source (`.map`) publié. Favicon SVG sans script.
- `robots.txt` bloque l'indexation pendant le lancement et `sitemap.xml` ne liste
  que des pages publiques. Rappel : `robots.txt` n'est **pas** une protection, il
  est public et indique au contraire ce qu'on voudrait cacher. `/admin` est protégé
  par le serveur, pas par ce fichier.

---

## 3. Content-Security-Policy

Source unique : `shared/security.js`.

```
default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self' data: blob: https://wmts.geo.admin.ch https://tile.openstreetmap.org;
font-src 'self';
media-src 'self';
connect-src 'self' https://api3.geo.admin.ch <origine de l'API>;
object-src 'none';
frame-src 'none';
worker-src 'none';
manifest-src 'self';
base-uri 'self';
form-action 'self'
```

Domaines externes autorisés, et seulement eux :
- `wmts.geo.admin.ch` : fonds de carte swisstopo (images).
- `tile.openstreetmap.org` : plan OpenStreetMap (images).
- `api3.geo.admin.ch` : recherche de lieu swisstopo.
- l'origine de l'API, ajoutée à la compilation.

`data:` sert aux petites images intégrées par la compilation, `blob:` aux pièces
jointes ouvertes par l'équipe.

**Limites sur GitHub Pages.** La CSP est posée par une balise `<meta>` : c'est la
seule méthode possible. Elle protège contre l'injection de scripts, mais le
navigateur **ignore** dans une balise meta `frame-ancestors`, `report-uri` et
`sandbox`. La protection contre l'intégration dans un cadre n'est donc pas assurée
sur GitHub Pages seul (voir section 4). Le serveur Node, lui, envoie la CSP en
en-tête avec `frame-ancestors 'none'`.

Testé : toutes les pages parcourues avec la CSP active, aucune violation
(carte, tuiles, recherche, vidéos, police, administration, formulaires).

---

## 4. En-têtes de sécurité

| En-tête | Utilité | Sur GitHub Pages | Meilleure méthode |
|---|---|---|---|
| Content-Security-Policy | Bloque les scripts et ressources non autorisés | **Partiel** : balise meta, sans `frame-ancestors` | Déjà en place (meta). Complet via un proxy (ci-dessous) |
| Strict-Transport-Security | Force HTTPS pour les visites suivantes | **Non réglable**. Les domaines `github.io` sont préchargés HSTS par les navigateurs. Pour un domaine personnel : à vérifier après mise en ligne | Cocher « Enforce HTTPS ». HSTS sur `vitiaero.ch` : proxy ou inscription du domaine à la liste de préchargement |
| X-Content-Type-Options | Empêche de deviner le type d'un fichier | **Non réglable** (à vérifier avec `curl -I`) | Proxy |
| Referrer-Policy | Limite l'adresse transmise aux sites externes | **Oui**, par balise meta (`strict-origin-when-cross-origin`) | Déjà en place |
| Permissions-Policy | Désactive caméra, micro, géolocalisation... | **Non** : aucune balise meta équivalente | Proxy. Le site n'utilise aucune de ces fonctions |
| Cross-Origin-Opener-Policy | Isole la fenêtre des autres sites | **Non** | Proxy |
| Cross-Origin-Resource-Policy | Empêche d'autres sites de charger vos fichiers | **Non** | Proxy |
| Cross-Origin-Embedder-Policy | Isolation stricte | **Non**, et **incompatible** : les tuiles de carte externes seraient bloquées | Ne pas activer |
| X-Frame-Options / frame-ancestors | Anti-clickjacking | **Non** | Proxy. Risque faible : aucune action sensible en un clic sur les pages publiques |

**Pour obtenir tous les en-têtes** : placer le domaine derrière un proxy qui
ajoute des en-têtes (par exemple Cloudflare, offre gratuite, règles de
transformation des en-têtes de réponse), ou héberger le site statique chez un
service qui accepte un fichier d'en-têtes (Cloudflare Pages, Netlify). L'API Node
envoie déjà tous ces en-têtes (`server/index.js`).

---

## 5. CORS

- L'API ne répond aux navigateurs que pour les origines listées dans
  `ALLOWED_ORIGINS` (exemple : `https://vitiaero.github.io` ou
  `https://www.vitiaero.ch`). Jamais `*`, pas de `Allow-Credentials` (aucun cookie).
- Méthodes : GET, POST, PATCH, DELETE. En-têtes : `Content-Type`, `Authorization`.
- **CORS ne protège pas le serveur** : un script ou un robot peut appeler l'API
  sans navigateur. La validation, l'authentification et la limitation de débit côté
  serveur restent la vraie protection.
- Appels externes du navigateur : swisstopo (recherche) et tuiles de carte, en
  lecture seule, sans donnée personnelle autre que l'adresse IP.

---

## 6. Formulaires et abus

| Formulaire | Validation navigateur | Validation serveur | Limite par IP | Anti-robot |
|---|---|---|---|---|
| Estimation | Champs requis, `maxLength` | Types, longueurs, e-mail, parcelles dans la zone, prix recalculé | 15 / heure | Champ piège |
| Contact | `maxLength`, consentement | Types, longueurs, e-mail | 10 / heure | Champ piège |
| Devis + pièces jointes | Types et taille des fichiers | Idem + signature binaire, 3 fichiers, 4 Mo | 10 / heure | Champ piège |
| Inscription | `maxLength`, 8 caractères | Longueurs, e-mail, doublon | 20 / 15 min | Non |
| Connexion | `maxLength` | Temps constant | 20 / 15 min | Non |
| Code promo | `maxLength` | Longueur | 20 / 15 min | Non |
| Toute l'API | | | 600 / 15 min | |

- Aucune donnée personnelle dans les adresses (tout part dans le corps des requêtes).
- Les limites sont en mémoire : elles repartent à zéro au redémarrage et ne sont
  pas partagées entre plusieurs instances. Suffisant pour un seul serveur.
- **À envisager si du spam apparaît** : Cloudflare Turnstile sur les formulaires
  publics. La clé de site est publique ; la clé secrète reste sur le serveur,
  qui vérifie le jeton. Non ajouté : service tiers, donc à mentionner dans la
  politique de confidentialité.
- Le frontend ne peut pas limiter les abus : toute limite côté navigateur se
  contourne.

---

## 7. Données personnelles (nLPD)

Ce qui est en place : pages confidentialité, mentions légales, cookies (inventaire
du stockage local et bouton d'effacement), consentement avant envoi, minimisation
(pas de date de naissance, pas d'adresse postale obligatoire), aucun traceur,
droits rappelés avec le contact et le PFPDT.

**À valider juridiquement ou à compléter (non inventé ici) :**
1. **Hébergeur du site** : GitHub, Inc. (États-Unis). GitHub reçoit l'adresse IP
   des visiteurs (journaux techniques). Transfert vers les États-Unis : vérifier le
   cadre applicable (Swiss-U.S. Data Privacy Framework et certification de
   l'entreprise) et compléter `company.host` et la section 8 de la politique.
2. **Hébergeur de l'API et de la base** : nom, pays, région des données. Choisir
   si possible une région en Suisse ou dans l'UE.
3. **Durées de conservation** : les valeurs entre crochets ([24 mois], [10 ans])
   sont des propositions. Définir aussi la durée des pièces jointes, puis mettre en
   place l'effacement réel (aujourd'hui manuel).
4. **Service d'itinéraire OSRM** : exploitant et pays à vérifier (déjà signalé dans
   la politique). Seules des coordonnées lui sont envoyées.
5. **Registre des activités de traitement** : exigé au-delà de 250 employés ou pour
   un traitement à risque élevé ; à évaluer.
6. **Annonce des violations** au PFPDT : prévoir une procédure simple.
7. **Sous-traitants** : contrat avec l'hébergeur de l'API (conditions de traitement
   des données).

---

## 8. Dépendances et chaîne d'approvisionnement

- 7 dépendances d'exécution, 3 de développement, toutes figées dans
  `package-lock.json`. `npm audit` : 0 vulnérabilité au 14.09.2026.
- Aucune ressource chargée depuis un CDN.
- GitHub Actions : installation par `npm ci --ignore-scripts` (aucun script
  d'installation exécuté), puis `npm audit --audit-level=high` qui bloque la
  publication en cas de faille élevée.
- Dependabot : mises à jour hebdomadaires npm et Actions, avec 7 jours d'attente
  avant de proposer une nouvelle version.
- React 18 et Express 4 restent maintenus ; une migration vers React 19 et
  Express 5 n'est pas nécessaire pour la sécurité aujourd'hui.

---

## 9. Configuration GitHub à faire (dans l'interface, pas dans le code)

Dépôt :
- [ ] Compte GitHub protégé par la **double authentification** (clé d'accès ou application).
- [ ] Visibilité : **public** pour GitHub Pages gratuit. Tout le dépôt est alors
      lisible : ne jamais y déposer de secret, de base de données ni d'export client.
- [ ] Settings > Code security : activer **Dependabot alerts**, **Dependabot
      security updates**, **Secret scanning** et **Push protection**.
- [ ] Settings > Code security : **CodeQL default setup** (gratuit sur un dépôt public).
- [ ] Settings > Rules > Rulesets : protéger `main` (interdire la suppression et
      le « force push », exiger une pull request si plusieurs personnes contribuent).

GitHub Actions :
- [ ] Settings > Actions > General : « Allow GitHub Actions created by GitHub » (ou
      liste d'Actions autorisées), **Workflow permissions : Read repository contents**,
      ne pas autoriser Actions à approuver des pull requests.
- [ ] « Require approval for all external contributors » pour les forks.
- [ ] Settings > Environments > `github-pages` : limiter le déploiement à la branche `main`.

GitHub Pages :
- [ ] Settings > Pages : Source **GitHub Actions**.
- [ ] Domaine personnel : **vérifier le domaine** dans les réglages du compte
      (évite qu'un tiers s'en empare), puis cocher **Enforce HTTPS**.
- [ ] Variable `VITE_API_URL` (Settings > Secrets and variables > Actions > Variables).
      Ce n'est **pas** un secret : elle se retrouve dans le JavaScript public.

Le workflow `.github/workflows/deploy-pages.yml` utilise déjà : permissions
minimales par job, Actions officielles figées par empreinte de commit,
`persist-credentials: false`, aucun déclenchement par pull request, aucune
variable utilisateur insérée dans une commande shell.

---

## 10. Variables de l'API (hébergeur séparé)

| Variable | Rôle |
|---|---|
| `NODE_ENV=production` | Mots de passe de démonstration refusés, pas de données fictives |
| `ADMIN_PASSWORD` | Mot de passe administrateur, long et unique |
| `ADMIN_EMAIL` | Facultatif |
| `ALLOWED_ORIGINS` | Origine exacte du site, par exemple `https://www.vitiaero.ch` |
| `TRUST_PROXY` | `1` derrière le proxy de l'hébergeur (défaut en production), `false` sans proxy |
| `DEMO_DATA=1` | Seulement pour une démonstration : crée le client et les codes promo fictifs |
| `CLIENT_PASSWORD` | Mot de passe du client fictif, si `DEMO_DATA=1` |

Aucun de ces secrets ne doit apparaître dans le dépôt ni dans GitHub Pages.

---

## 11. À vérifier après la mise en ligne

- [ ] `https://` partout ; `http://` redirige vers `https://`.
- [ ] En-têtes réels : `curl -I https://adresse-du-site/` (voir section 4).
- [ ] Console du navigateur : aucune violation de CSP sur l'accueil, l'estimation
      (carte, recherche), l'équipement (vidéos) et l'administration.
- [ ] Connexion, inscription, estimation, contact, devis avec pièce jointe.
- [ ] Ouverture d'une photo et téléchargement d'un PDF dans l'administration.
- [ ] Appel de l'API depuis une autre origine refusé (pas d'en-tête CORS).
- [ ] `npm audit` et alertes Dependabot, puis chaque mois.
- [ ] Mot de passe administrateur changé si les journaux de l'hébergeur ont affiché
      un mot de passe généré.
- [ ] Sauvegardes de la base testées (restauration).

---

## Identifiants de démonstration (en local uniquement)
- Admin : `admin@vitiaero.ch` / `admin1234`
- Client : `client@vitiaero.ch` / `client1234`
- Codes promo : `VIGNE10`, `LAVAUX15`

En ligne, `admin1234` est refusé et ces données n'existent pas (sauf `DEMO_DATA=1`).
