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
| Un texte du site (titres, paragraphes, boutons, FAQ) | `src/i18n/fr.js`, puis `de.js` et `en.js` (mêmes clés) |
| Les coordonnées de l'entreprise, les prestataires, les durées de conservation, les conditions commerciales, l'assurance, les autorisations | `shared/business.js` |
| Les mentions légales, la confidentialité, les cookies, les CGV, les conditions d'utilisation, les crédits | `shared/legal/*.js` (texte), puis `npm run legal:version` |
| Les tarifs, les frais de déplacement, la base de départ | `shared/pricing.js` |
| Une image ou une vidéo | `public/`, **et** sa déclaration dans `shared/media.js` |
| Les couleurs et la mise en page | `src/styles.css` |
| Un service externe autorisé (carte, recherche) | `shared/security.js` |

Le bandeau de pré-lancement, `robots.txt`, le plan du site et l'ouverture des
formulaires ne se modifient pas à la main : ils suivent la porte de lancement
(`npm run launch:status`).

### Exemples courants

**Corriger une phrase.** La chercher dans `src/i18n/fr.js` (Ctrl+F), la
modifier entre les guillemets, puis faire de même dans `de.js` et `en.js`. Un
test vérifie que les trois fichiers ont exactement les mêmes clés.

**Renseigner une information de l'entreprise.** Dans `shared/business.js`,
remplacer `null` par la valeur réelle (par exemple l'adresse postale). `null`
veut dire « pas encore fourni » et bloque le lancement ; `false` veut dire
« sans objet » (par exemple : pas de numéro TVA). Ne jamais écrire de valeur
d'exemple. Si le texte d'un document juridique change, lancer
`npm run legal:version`, relire, puis publier.

**Ajouter un justificatif** (autorisation, contrôle, permis). Dans
`shared/business.js`, liste `credentials` : type, référence, autorité, date de
délivrance, échéance (ou `false`), date de vérification. Le site ne l'affiche
que complet et non échu. Ne jamais déposer le document lui-même dans le dépôt.

**Ajouter le téléphone.** `identity.phone` dans `shared/business.js` : le
numéro apparaît dans la page Contact, le pied de page et le bouton « Appeler »
sur mobile.

**Changer un tarif.** `PRICE_PER_HA` dans `shared/pricing.js` : le calcul du
site et celui du serveur utilisent tous deux ce fichier.

**Remplacer une image.** Déposer le fichier dans `public/images/`, le déclarer
dans `shared/media.js` (auteur, droit d'usage, licence, preuve), puis
l'utiliser dans `src/content.js`. Sans déclaration, la compilation refuse de
publier. Formats conseillés : WebP pour les photos, moins de 300 Ko.

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
- **Images et vidéos** : dans le code, toujours `asset('/images/nom.webp')`
  (fichier `src/config.js`), jamais `"/images/nom.webp"` en dur, sinon l'image
  ne s'affiche pas sur GitHub Pages. Chaque fichier de `public/` doit être
  déclaré dans `shared/media.js`.
- **Nouveau service externe** (vidéo, statistiques, police...) : il sera bloqué
  par la politique de sécurité tant qu'il n'est pas ajouté dans
  `shared/security.js`, et doit être déclaré dans `shared/business.js`
  (`services`) pour figurer dans la politique de confidentialité
  (`docs/SERVICES-TIERS.md`).
- Ne jamais annoncer une autorisation, un client, un chiffre ou un avis qui
  n'existe pas encore. Ne jamais présenter une estimation comme une commande.
- Avant d'envoyer : `npm test` puis `npm run build`.

## Avec Claude Code

Ouvrir ce dossier dans Claude Code et décrire le changement en français
(« Renseigne l'adresse postale », « Change le tarif du deuxième passage »). Le fichier `docs/REPRISE.md` lui donne tout le contexte du
projet. Relire ce qui a changé dans GitHub Desktop avant de faire le commit.
