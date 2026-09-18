# VitiAero

Site vitrine et application d'estimation pour un service de traitement de vigne
par drone (DJI Agras T50), dans le canton de Vaud. Projet d'étude CPNV (PAE).

## Démarrer

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`, l'API tourne sur le port 3001.

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm run build` | Compile le site dans `dist/` |
| `npm run serve` | Compile puis démarre comme en production |
| `npm start` | Démarre le serveur seul (utilisé par l'hébergeur) |

## Organisation du dossier

| Dossier | Contenu |
|---|---|
| `src/` | Site React : pages, composants, textes FR / DE / EN (`src/i18n/`) |
| `server/` | API Express et base SQLite |
| `shared/` | Grille tarifaire et calcul du prix, communs au site et au serveur |
| `public/` | Images, vidéos, polices, `robots.txt`, plan du site |
| `scripts/` | Utilitaires ponctuels |
| `docs/` | Documentation du projet |
| `.github/` | Publication automatique sur GitHub Pages, mises à jour Dependabot |
| `_hors-projet/` | Sources, archives et outils, jamais publiés (voir son `LISEZ-MOI.md`) |

## Documentation

- [docs/REPRISE.md](docs/REPRISE.md) : contexte complet, conventions et état du projet
- [docs/MODIFIER.md](docs/MODIFIER.md) : où changer un texte, un tarif, une image, et comment publier
- [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md) : mise en ligne gratuite, étape par étape
- [docs/DESIGN.md](docs/DESIGN.md) : points de design à améliorer, avec leur effet et le temps que demande chaque correction
- [docs/SECURITY.md](docs/SECURITY.md) : audit de sécurité, limites de GitHub Pages et réglages à faire
