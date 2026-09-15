# Modifier le site

Une fois le site sur GitHub et relié à un hébergeur, chaque modification suit
toujours le même cycle :

1. **Modifier** un fichier sur l'ordinateur.
2. **Vérifier** en local avec `npm run dev` (http://localhost:5173). La page se
   met à jour toute seule à chaque enregistrement.
3. **Enregistrer dans Git** (« commit ») avec une phrase qui décrit le changement.
4. **Envoyer sur GitHub** (« push »). L'hébergeur voit le changement, recompile
   et remet le site en ligne en quelques minutes.

Avec GitHub Desktop, les étapes 3 et 4 se font en deux clics : écrire un
résumé, cliquer sur **Commit to main**, puis sur **Push origin**.

En cas d'erreur, rien n'est perdu : GitHub garde l'historique de toutes les
versions, et on peut revenir en arrière à tout moment (clic droit sur un commit
dans GitHub Desktop, **Revert changes in commit**).

---

## Où se trouve quoi

| Je veux changer... | Fichier |
|---|---|
| Un texte du site (titres, paragraphes, boutons, FAQ) | `src/i18n/fr.js` |
| Le même texte en allemand ou en anglais | `src/i18n/de.js`, `src/i18n/en.js` |
| Les coordonnées de l'entreprise | `src/content.js`, bloc `company` |
| Le bandeau « lancement prochain » | `src/content.js`, `preLaunch` |
| Les tarifs, les frais de déplacement, la base de départ | `shared/pricing.js` |
| Les notes sous l'estimation (TVA, produits non compris) | `src/i18n/fr.js`, `estimation.notes` |
| Les mentions légales, la confidentialité, les CGV | `src/pages/legal/` |
| Une image | `public/images/` (garder le même nom de fichier) |
| Une vidéo | `public/videos/` (moins de 100 Mo par fichier) |
| Les couleurs et la mise en page | `src/styles.css` |
| L'indexation par les moteurs de recherche | `public/robots.txt` |

### Exemples courants

**Corriger une phrase.** Chercher la phrase dans `src/i18n/fr.js` (Ctrl+F),
la modifier entre les guillemets, enregistrer. Penser à `de.js` et `en.js` si
la phrase existe aussi dans ces langues. Si une traduction manque, le site
affiche le texte français à la place, sans rien casser.

**Ajouter le téléphone.** Dans `src/content.js`, remplacer `'[TELEPHONE]'`
par le numéro, par exemple `'021 123 45 67'`. Le numéro apparaît alors tout
seul dans la page Contact, le pied de page et le bouton « Appeler » sur mobile.
Tant qu'une valeur commence par `[`, elle reste masquée.

**Changer un tarif.** Dans `shared/pricing.js`, la liste `PRICE_PER_HA` donne
le prix par hectare selon le nombre de passages (1er, 2e, 3e...). Le
calculateur du site et le serveur utilisent tous deux ce fichier : un seul
changement suffit.

**Remplacer une image.** Déposer la nouvelle image dans `public/images/` avec
**exactement le même nom** que l'ancienne. Idéalement en JPG ou WebP, moins de
500 Ko, dans les mêmes proportions.

---

## Règles à respecter

- **Ne pas toucher à la ponctuation du code** autour des textes : les
  guillemets `'...'`, les virgules en fin de ligne, les accolades `{ }`. Une
  virgule oubliée suffit à bloquer la compilation. Si la page reste blanche en
  local, le message d'erreur s'affiche dans le terminal et indique la ligne.
- **Une apostrophe dans un texte** entouré de `'...'` doit s'écrire `\'`
  (exemple : `'l\'estimation'`), ou utiliser l'apostrophe typographique `’`.
- **Toujours vérifier en local avant d'envoyer.** Pour un contrôle identique à
  la production : `npm run serve`.
- **Aucun fichier de plus de 100 Mo** : GitHub le refuse.
- **Aucun mot de passe ni clé secrète dans le code.** Ils se mettent dans les
  variables d'environnement de l'hébergeur (voir `DEPLOIEMENT.md`). Tout ce qui
  est dans `src/`, `public/` et `index.html` est public.
- **Images et vidéos** : dans le code, toujours `asset('/images/nom.jpg')`
  (fichier `src/config.js`), jamais `"/images/nom.jpg"` en dur, sinon l'image
  ne s'affiche pas sur GitHub Pages.
- **Nouveau service externe** (vidéo YouTube, statistiques, police Google...) :
  il sera bloqué par la politique de sécurité tant qu'il n'est pas ajouté dans
  `shared/security.js`. L'ajouter aussi dans la politique de confidentialité.
- Ne jamais annoncer une autorisation, un client, un chiffre ou un avis qui
  n'existe pas encore.

## Avec Claude Code

Ouvrir ce dossier dans Claude Code et décrire le changement en français
(« Ajoute le numéro 021 123 45 67 », « Change le tarif à 620 CHF pour le
deuxième passage »). Le fichier `docs/REPRISE.md` lui donne tout le contexte du
projet. Relire ce qui a changé dans GitHub Desktop avant de faire le commit.
