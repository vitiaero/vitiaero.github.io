# Prompt de reprise — Projet VitiAero

Copie tout ce bloc dans une nouvelle discussion Claude Code pour continuer le projet.

---

Je reprends un projet existant nommé **VitiAero**. Voici le contexte. Lis le
code avant de modifier, garde le style et les conventions, et ne casse rien.

## Contexte
- Service commercial suisse d'**épandage viticole par drone** dans le canton de
  Vaud, en **pré-lancement**. Drone prévu : **DJI Agras T50** (réservoir 40 L).
- Le vigneron calcule une **estimation indicative en ligne, sans engagement** ;
  l'équipe renvoie ensuite un **devis écrit**. Une estimation n'est jamais une
  commande, et la commande en ligne n'est pas activée.
- Règle absolue : **aucune donnée inventée** (entreprise, adresse, IDE, TVA,
  hébergeur, assurance, autorisation, prix, droit d'auteur, client, avis).

## Porte de lancement (IMPORTANT)
- `shared/business.js` : identité, prestataires, durées de conservation,
  conditions commerciales, assurance, justificatifs. `null` = pas encore fourni
  (bloque), `false` = sans objet (déclaré). Jamais de valeur d'exemple.
- `shared/media.js` : registre de chaque fichier de `public/` (auteur, droit,
  licence, preuve). La compilation échoue pour un fichier non déclaré.
- `shared/launch.js` : 43 contrôles (réf. A à G de
  `docs/INFORMATIONS-MANQUANTES.md`). Tant qu'un contrôle échoue : bandeau,
  formulaires fermés (navigateur via `src/launch.js`, serveur en production :
  503), indexation bloquée (`robots.txt`, `noindex`, `X-Robots-Tag`, pas de
  plan du site). `npm run launch:status` affiche ce qui manque.
- En production, les formulaires exigent aussi un envoi d'e-mails configuré.

## Textes juridiques
- `shared/legal/` : mentions, confidentialité, cookies, CGV, conditions
  d'utilisation, crédits. Chaque texte est écrit une fois en FR/DE/EN
  (`tr(lang, { fr, de, en })`), construit à partir de `shared/business.js`.
- Versions datées et empreintes dans `shared/legal/versions.js` :
  `npm run legal:version` après chaque changement ; la compilation refuse sinon.
- Les formulaires envoient la version lue ; le serveur enregistre document,
  version, date et finalité (table `consents`).

## Lancement local
- `npm run dev` : API Express sur `:3001` + Vite sur `:5173` (proxy `/api`).
  Formulaires ouverts en développement pour les essais.
- Base SQLite : `server/data/app.sqlite` (ou `DATA_DIR`). Comptes de
  démonstration en local seulement : `admin@vitiaero.ch` / `admin1234`,
  `client@vitiaero.ch` / `client1234`, codes `VIGNE10`, `ANCIEN`.
- Tests : `npm test` (Node), `npm run test:e2e` (Playwright : pré-lancement,
  mobile, formulaires, axe).

## Stack
- Front : React 18 + Vite 7 en **JavaScript** (pas TypeScript), React Router 7,
  CSS maison (`src/styles.css`, pas de Tailwind). Carte : Leaflet + `@turf/area`.
- Back : Node + Express, SQLite via sql.js (WASM), nodemailer (SMTP).
- Police Inter auto-hébergée (`public/fonts/inter-latin-3.19.woff2`, OFL).

## Structure
- `src/pages/` : Home, Service, Estimation, Devis, Confirmation, About, Contact,
  Login, Register, Account, Admin, Legal, NotFound.
- `src/components/` : Header, Footer, MapDraw, LaunchNotice, LangSuggest,
  Notices (formulaire fermé, « pas une commande »), ConsentCheckbox,
  Illustrations (schémas SVG originaux), PrivacyBanner, PrintHeader, MobileCta...
- Langues : `src/i18n/` (`fr.js` = référence ; `de.js` orthographe suisse,
  « Offerte », « Durchgang » ; `en.js` anglais britannique). Allemand et
  anglais chargés à la demande. Français par défaut ; proposition discrète si
  le navigateur est en allemand ou en anglais.
- `server/app.js` (API), `server/index.js` (démarrage et tâches), `server/db.js`,
  `server/mail.js` + `mail-templates.js`, `server/privacy.js` (conservation,
  export, effacement), `server/backup.js` + `backup-cli.js`, `server/routing.js`.
- `shared/pricing.js` (grille tarifaire, base de départ Chardonne),
  `shared/security.js` (CSP, routes), `shared/site.js` (robots, plan du site,
  en-têtes de page, security.txt), `shared/storage.js` (stockage local).
- `scripts/` : versions juridiques, contrôle des médias, licences tierces,
  état du lancement, surveillance de production.
- Documentation : `docs/` (voir `README.md`).

## Conventions / ton (IMPORTANT)
- Français de Suisse romande, phrases courtes, aucun jargon. **Aucun emoji.
  Aucun tiret cadratin.** Accents corrects.
- Parcelles de la carte en **ORANGE (#e8781f)**, jamais en vert.
- Aucune autorisation présentée comme obtenue sans justificatif complet dans
  `shared/business.js`. Le drone est « prévu ».
- Jamais de secret ni de copie de document officiel dans le dépôt (public).

## Ce que je voudrais faire ensuite
[Écris ici ta prochaine demande.]
