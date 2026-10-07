# VitiAero

Site et application d'un service d'épandage viticole par drone dans le canton
de Vaud : présentation du service, estimation indicative en ligne (sans
engagement, ce n'est pas une commande), demande de devis, espace client et
administration.

**VitiAero est une entreprise fictive**, créée pour un PAE au CPNV. Le site
l'annonce sur chaque page (bandeau, pied de page, pages juridiques). Les
coordonnées, conditions et prestataires sont inventés dans
`shared/business.js` (`fictional: true`) ; le site n'est pas indexé et la
version publiée (https://vitiaero.github.io, voir `docs/DEPLOIEMENT.md`)
n'enregistre aucune demande. Les formulaires fonctionnent en
local avec `npm run dev`. Les documents de `docs/` décrivent ce qu'il faudrait
pour lancer réellement un tel service.

## Démarrer

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`, l'API tourne sur le port 3001.

| Commande | Rôle |
|---|---|
| `npm run build` | Compile le site dans `dist/` (refuse un média non déclaré ou un texte juridique non versionné) |
| `npm test` | Tests automatiques (porte de lancement, textes, médias, API, formulaires, conservation, sauvegardes) |
| `npm run test:e2e` | Tests dans le navigateur (pré-lancement, mobile, formulaires, accessibilité) |
| `npm run launch:status` | Informations encore manquantes avant le lancement |
| `npm run legal:version` | Enregistre une nouvelle version datée des textes juridiques modifiés |
| `npm run check:media` | Contrôle du registre des médias |
| `npm run backup` / `npm run restore` | Sauvegarde chiffrée / restauration |
| `npm run check:production` | Contrôle du site publié |
| `npm run publish:branch` | Publie le site sur https://vitiaero.github.io (branche `vitiaero-publication`) |
| `npm run serve` | Compile puis démarre comme en production |
| `npm start` | Démarre le serveur seul (hébergeur) |

## Organisation du dossier

| Dossier | Contenu |
|---|---|
| `src/` | Site React : pages, composants, textes FR / DE / EN (`src/i18n/`) |
| `server/` | API Express, base SQLite, e-mails, conservation, sauvegardes |
| `shared/` | Données de l'entreprise (`business.js`), registre des médias, porte de lancement, textes juridiques, tarifs, sécurité |
| `public/` | Médias déclarés dans `shared/media.js`, police, icônes |
| `scripts/` | Versions juridiques, contrôles, surveillance |
| `test/`, `e2e/` | Tests Node et tests navigateur (Playwright) |
| `docs/` | Documentation |
| `.github/` | Tests, publication sur GitHub Pages, surveillance, Dependabot |

## Documentation

- [docs/INFORMATIONS-MANQUANTES.md](docs/INFORMATIONS-MANQUANTES.md) : ce que le propriétaire doit fournir
- [docs/CHECKLIST-LANCEMENT.md](docs/CHECKLIST-LANCEMENT.md) : checklist légale à faire valider et signer
- [docs/PLAN-MIGRATION.md](docs/PLAN-MIGRATION.md) : plan priorisé P0 / P1 / P2 et état
- [docs/CONFORMITE.md](docs/CONFORMITE.md) : conformité, sources officielles consultées
- [docs/SERVICES-TIERS.md](docs/SERVICES-TIERS.md) : services tiers et transferts de données
- [docs/EXPLOITATION.md](docs/EXPLOITATION.md) : production, e-mails, distances, sauvegardes, surveillance
- [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md) : mise en ligne
- [docs/SECURITY.md](docs/SECURITY.md) : sécurité
- [docs/MODIFIER.md](docs/MODIFIER.md) : où changer un texte, un tarif, une image
- [docs/RAPPORT.md](docs/RAPPORT.md) : rapport de la migration du 27 septembre 2026
- [docs/REPRISE.md](docs/REPRISE.md) : contexte pour reprendre le projet
- [docs/DESIGN.md](docs/DESIGN.md) : pistes de design

Aucun document de ce dépôt n'est un avis juridique : les points signalés
doivent être validés par un juriste suisse et par les autorités compétentes.
