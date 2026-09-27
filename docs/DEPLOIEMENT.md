# Mettre VitiAero en ligne

Deux façons de publier le site. Les réglages du serveur, les e-mails, les
sauvegardes et la surveillance sont détaillés dans `EXPLOITATION.md` ; la
sécurité dans `SECURITY.md`.

| | A. GitHub Pages + API séparée | B. Un seul service Node |
|---|---|---|
| Site | GitHub Pages | Hébergeur Node |
| Formulaires, comptes, administration | API sur un hébergeur Node | Même service |
| En-têtes de sécurité complets | Non (limites de GitHub Pages) | Oui |
| `robots.txt` et indexation | Figés à la compilation (recompilée chaque lundi) | Suivent l'état de lancement en direct |
| Usage commercial | À décider (B3) : les règles de GitHub Pages excluent un usage principalement commercial | Selon l'hébergeur |

Dans les deux cas, **rien n'est à modifier à la main le jour du lancement** :
le bandeau, les formulaires, `robots.txt`, le plan du site, les balises
`noindex` et les données structurées suivent la porte de lancement
(`shared/launch.js`). Il suffit de fournir les informations manquantes, de
compiler et de publier.

---

## A. GitHub Pages + API séparée

### 1. Le dépôt

GitHub Pages gratuit exige un dépôt **public** : tout le code est lisible. Il
ne contient aucun secret, et ne doit jamais contenir de copie de permis,
d'attestation, de police d'assurance ou de contrat.

### 2. L'API

Chez un hébergeur Node, un service web relié au dépôt :

- installation : `npm ci`
- démarrage : `npm start`
- un **disque persistant** monté sur `DATA_DIR` (sinon la base repart à zéro à
  chaque redéploiement)
- variables : tableau complet dans `EXPLOITATION.md`, section 3. Au minimum
  `NODE_ENV=production`, `DATA_DIR`, `ADMIN_PASSWORD`, `ALLOWED_ORIGINS`
  (adresse du site, par exemple `https://vitiaero.ch`), puis SMTP et
  sauvegardes avant l'ouverture des formulaires.

Déclarer l'hébergeur dans `shared/business.js` (`services.apiHosting`), avec
son pays : il apparaît alors dans la politique de confidentialité.

### 3. GitHub Pages

1. Dépôt > **Settings > Pages** > Source : **GitHub Actions**.
2. **Settings > Secrets and variables > Actions > Variables** : `VITE_API_URL`
   = adresse de l'API. C'est une variable publique, pas un secret.
3. Chaque envoi sur `main` lance le workflow « Publier sur GitHub Pages » :
   audit des dépendances, tests, compilation, publication. Un test en échec
   bloque la publication. Le workflow tourne aussi chaque lundi, pour renouveler
   `security.txt` et appliquer les échéances des justificatifs.

Sans `VITE_API_URL`, le site est publié seul : les formulaires restent fermés
et renvoient vers l'adresse e-mail.

### 4. Le domaine vitiaero.ch

`public/CNAME` contient `vitiaero.ch` et part avec chaque publication.

1. Chez le registraire, les enregistrements vers GitHub :

   | Type | Nom | Valeur |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |

2. Un enregistrement **CNAME** pour `www` vers `NOM.github.io`.
3. Settings > Pages > Custom domain : `vitiaero.ch`, puis **Enforce HTTPS**
   une fois le certificat prêt.
4. Vérifier le domaine dans les réglages du compte GitHub (Settings > Pages >
   Add a domain).

---

## B. Un seul service Node

Express sert le site compilé et l'API à la même adresse : pas de CORS, tous
les en-têtes de sécurité, et `robots.txt` / `sitemap.xml` calculés à chaque
requête selon l'état de lancement.

1. Service web chez l'hébergeur :
   - installation et compilation : `npm ci && npm run build`
   - démarrage : `npm start`
2. Variables : celles de `EXPLOITATION.md`, **sans** `ALLOWED_ORIGINS`.
3. Faire pointer le domaine vers l'hébergeur selon ses instructions, et
   retirer `public/CNAME` si GitHub Pages n'est plus utilisé.

---

## Vérifier avant de publier

```bash
npm test               # tests automatiques
npm run build          # compilation (refuse un média non déclaré ou un texte non versionné)
npm run test:e2e       # tests dans le navigateur
npm run launch:status  # ce qui manque encore avant le lancement
npm run serve          # comme en production, sur http://localhost:3001
```

## Le jour du lancement

1. `npm run launch:status` n'affiche plus aucune information bloquante.
2. La checklist `CHECKLIST-LANCEMENT.md` est signée et sa date inscrite dans
   `shared/business.js` (`launchChecklistSignedOn`).
3. `npm run legal:version`, relecture des textes, commit, envoi sur `main`.
4. Après publication : `SITE_URL=https://vitiaero.ch API_URL=... npm run check:production`.
