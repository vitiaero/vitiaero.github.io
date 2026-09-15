# Mettre VitiAero en ligne

Deux façons de publier le site. Le détail de la sécurité est dans `SECURITY.md`.

| | A. GitHub Pages + API séparée | B. Un seul service Node |
|---|---|---|
| Site vitrine | GitHub Pages (gratuit, rapide, toujours éveillé) | Hébergeur Node |
| Formulaires, comptes, administration | API sur un hébergeur Node | Même service |
| En-têtes de sécurité complets | Non (limites de GitHub Pages) | Oui |
| Configuration | Deux services, une variable de chaque côté | Un seul service |

GitHub Pages ne fait tourner **aucun serveur**. Sans l'API, la vitrine, la carte
et le calcul du prix fonctionnent, mais l'envoi d'une demande, la connexion et
l'administration affichent une erreur.

---

## A. GitHub Pages + API séparée

### 1. Envoyer le projet sur GitHub

Le dossier est déjà un dépôt Git (branche `main`). Avec GitHub Desktop :

1. **File > Add local repository**, choisir le dossier du projet.
2. Écrire un résumé (par exemple « Première version du site »), **Commit to main**.
3. **Publish repository**. GitHub Pages gratuit exige un dépôt **public** :
   décocher **Keep this code private**. Tout le code devient lisible par tous, ce
   qui est prévu : il ne contient aucun secret.

Le `.gitignore` exclut `node_modules`, `dist`, `_hors-projet`, la base, les pièces
jointes et les fichiers `.env`. Environ 310 Mo à envoyer, aucun fichier au-dessus
de la limite de 100 Mo.

### 2. Mettre l'API en ligne

Chez un hébergeur Node (Render, Koyeb, Fly.io...), créer un service web relié au
même dépôt :

- installation : `npm ci`
- démarrage : `npm start`
- variables :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `ADMIN_PASSWORD` | mot de passe long et unique |
| `ALLOWED_ORIGINS` | adresse du site, sans barre finale : `https://NOM.github.io` ou `https://www.vitiaero.ch` |
| `ADMIN_EMAIL` | facultatif |
| `DEMO_DATA` | `1` seulement pour une démonstration (client et codes promo fictifs) |
| `CLIENT_PASSWORD` | seulement avec `DEMO_DATA=1` |

Noter l'adresse de l'API fournie par l'hébergeur (par exemple
`https://vitiaero-api.onrender.com`).

### 3. Activer GitHub Pages

1. Dépôt > **Settings > Pages** > Source : **GitHub Actions**.
2. **Settings > Secrets and variables > Actions > onglet Variables** >
   **New repository variable** : nom `VITE_API_URL`, valeur l'adresse de l'API.
   C'est une variable, pas un secret : elle finit dans le JavaScript public.
3. **Actions** > « Publier sur GitHub Pages » > **Run workflow** (ou envoyer un
   commit sur `main`).

Le site est publié à `https://NOM.github.io/NOM-DU-DEPOT/`. Le chemin de base est
détecté automatiquement.

### 4. Domaine personnel (facultatif)

1. Vérifier le domaine dans les réglages du compte GitHub (Settings > Pages >
   Add a domain), pour qu'aucun tiers ne puisse l'utiliser.
2. Dépôt > Settings > Pages > Custom domain : `www.vitiaero.ch`, puis les
   enregistrements DNS indiqués par GitHub, chez le registraire du domaine.
3. Cocher **Enforce HTTPS** dès que le certificat est prêt.
4. Mettre la nouvelle adresse dans `ALLOWED_ORIGINS` côté API, puis relancer le
   workflow.

### 5. Réglages de sécurité GitHub

La liste à cocher est dans `SECURITY.md`, section 9 : double authentification,
alertes Dependabot, secret scanning, push protection, protection de `main`,
permissions des Actions en lecture seule.

---

## B. Un seul service Node

Express sert la vitrine compilée et l'API sur la même adresse : pas de CORS.

1. Envoyer le projet sur GitHub (étape A.1 ; le dépôt peut rester privé).
2. Service web chez l'hébergeur :
   - installation et compilation : `npm ci && npm run build`
   - démarrage : `npm start`
3. Variables : celles du tableau A.2, **sans** `ALLOWED_ORIGINS`.

Le serveur envoie alors tous les en-têtes de sécurité, CSP complète comprise.

---

## Les limites du gratuit, à connaître

- **Mise en veille de l'API.** Après un moment sans visite, le service s'arrête.
  La visite suivante attend quelques dizaines de secondes.
- **Disque effacé.** Chez la plupart des hébergeurs gratuits, `server/data/`
  repart à zéro à chaque redéploiement : la base est recréée (compte
  administrateur seul) et les pièces jointes sont perdues. Acceptable pour une
  démonstration. Pour de vraies demandes, il faut une base externe (Turso, Neon ou
  équivalent) : seul `server/db.js` est à adapter.
- **GitHub Pages** : 1 Go par site et environ 100 Go de trafic par mois.

## Avant d'ouvrir au public

- [ ] Remplir les coordonnées dans `src/content.js` (`[RAISON_SOCIALE]`,
      `[ADRESSE]`, `[TELEPHONE]`, `[IDE]`, `[RESPONSABLE]`, `[HEBERGEUR]`).
- [ ] Faire relire les pages légales : ce sont des modèles (voir `SECURITY.md`, section 7).
- [ ] Remplacer le service d'itinéraire OSRM public, serveur de démonstration non
      prévu pour la production (`ROUTE_URL` dans `server/index.js`).
- [ ] Décider de la durée de conservation des pièces jointes (nLPD).
- [ ] Mettre en place l'envoi de courriels : aujourd'hui les demandes se lisent
      uniquement dans l'administration.

## Le jour du lancement

1. `src/content.js` : passer `preLaunch` à `false`.
2. `public/robots.txt` : activer les règles d'indexation commentées.
3. Remplacer `https://www.vitiaero.ch` par l'adresse réelle dans
   `public/sitemap.xml`, `index.html` et `BASE_URL` dans `src/App.jsx`.

## Vérifier en local

```bash
npm run serve
```

Compile puis démarre le serveur sur `http://localhost:3001`, comme en production
(scénario B).
