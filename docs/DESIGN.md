# Points de design à améliorer, VitiAero

Relevé du 20 septembre 2026, mesuré sur le site en marche, pas jugé de mémoire.
Chaque point dit ce qui se passe, pourquoi cela compte pour un vigneron qui
visite le site, et le travail que demande la correction.

## Déjà corrigé

Pour situer l'état actuel :

- **Contraste des intitulés** au-dessus des titres : de 4,1 à 6,6 pour 1, et
  12 px au minimum. Le minimum lisible est 4,5.
- **Cibles tactiles** des liens dans le texte : de 26 à 43 px de haut.
- **Validation des formulaires** : message sous le champ à la sortie du champ,
  erreur rattachée au champ pour les lecteurs d'écran, et résumé en tête de
  formulaire qui prend le focus après un envoi refusé (`src/forms.jsx`).
- **Menu déroulant** : il recouvrait la fin de l'en-tête et coupait le logo.
- **Bordures d'accent latérales** remplacées par un fond teinté.
- **Chiffres à chasse fixe** dans les tableaux et l'espace client.

---

## 1. Réserver la place des images

**Mesuré** : 29 images n'ont ni largeur ni hauteur déclarées. 12 sur la page
Équipement, 13 sur l'estimation, 4 sur l'accueil, 1 sur Le service.

**Ce que ça fait** : le navigateur ne sait pas quelle place réserver. Le texte
s'affiche, puis saute quand l'image arrive. Sur une connexion lente, le visiteur
lit une phrase qui se déplace sous ses yeux. C'est aussi un critère de classement
chez Google.

**Correction** : ajouter `width` et `height` sur chaque balise image, avec les
dimensions réelles du fichier. Le CSS garde la main sur l'affichage.
Environ trente minutes, dans `src/pages/Equipement.jsx`, `Home.jsx`, `Service.jsx`
et le composant `src/components/Img.jsx`.

## 2. Alléger les vidéos du vignoble

**Mesuré** : 93 Mo en 4K et 62 Mo en 1080p, pour 32 secondes de plan d'ambiance.

**Ce que ça fait** : sur ordinateur en connexion moyenne, le visiteur voit une
image fixe pendant de longues secondes, ou fait travailler son forfait pour un
décor. Rien n'est chargé sur téléphone : ce point est déjà bien traité.

**Correction** : raccourcir à une douzaine de secondes et baisser le débit de la
version 1080p. Une cible de 8 à 12 Mo ne se voit pas à l'écran pour un fond.
Environ trente minutes de réencodage.

## 3. Donner une preuve sur l'accueil

**Constat** : la structure recommandée est promesse, preuve, solution, action.
La page saute la preuve, faute d'élément authentique à montrer. C'est normal
avant le lancement, mais c'est ce qui manque le plus à la crédibilité.

**Trois remplacements honnêtes, sans rien inventer** :

- une photo réelle du matériel, même simple, à la place des visuels DJI ;
- le cadre réglementaire remonté plus haut : c'est factuel et cela rassure ;
- le délai de réponse annoncé, déjà présent dans les chiffres.

Le jour de la première intervention, une photo de chantier et une phrase d'un
client valent plus que n'importe quelle mise en page.

## 4. Masquer l'adresse tant qu'elle n'existe pas

**Constat** : la page Contact affiche « [ADRESSE] » et « [NPA] [VILLE] » en
clair. Le téléphone, lui, est déjà masqué tant qu'il n'est pas renseigné.

**Correction** : appliquer au bloc adresse la règle qui existe déjà pour le
téléphone, dans `src/pages/Contact.jsx`. Dix minutes.

## 5. Le bouton Précédent du navigateur dans l'estimation

**Constat** : les quatre étapes ne figurent pas dans l'adresse. Un visiteur qui
fait « précédent » pour revenir d'une étape quitte le formulaire et perd sa
saisie.

**Correction** : refléter l'étape dans l'adresse. Environ une heure, dans
`src/pages/Estimation.jsx`.

## 6. Signaler les tableaux qui défilent

**Constat** : sur téléphone, les tableaux de tarifs et de demandes défilent
horizontalement, sans aucun indice visuel. Le visiteur ne sait pas qu'il reste
des colonnes à droite.

**Correction** : un léger dégradé sur le bord droit tant qu'il reste du contenu.
Vingt minutes, dans `src/styles.css`.

## 7. États de chargement

**Constat** : l'espace client et l'administration affichent un rond qui tourne.

**Correction** : un squelette qui reprend la forme du contenu attendu donne une
impression d'instantané et évite le saut de mise en page à l'arrivée des
données. Environ une heure.

## 8. Un saut de niveau de titre par page

**Mesuré** : chaque page enchaîne un titre de niveau 2 avec un niveau 4, sans
niveau 3. Les lecteurs d'écran annoncent la structure : un saut donne
l'impression qu'une section manque.

**Correction** : un niveau à changer par page. Quinze minutes.

## 9. Animation de la FAQ

**Constat** : l'ouverture d'une réponse anime une hauteur, ce qui fait
recalculer la mise en page à chaque image. La technique recommandée, la bascule
de hauteur de rangée d'une grille, a été testée : elle casse l'accordéon dans
Chrome 152, quelle que soit la place du rognage.

**Décision** : compromis assumé, commenté dans le code. À revoir le jour où
`interpolate-size` sera suffisamment répandu.

## 10. Image de partage

**Constat** : quand on partage un lien du site, c'est l'affiche de la vidéo qui
s'affiche, recadrée au hasard.

**Correction** : une image dédiée de 1200 x 630 px, avec le logo et une phrase
courte. Une demi-heure.

---

## Ce qui ne se décide pas depuis un écran de bureau

- **Le contraste du texte du hero par-dessus la vidéo.** Il est bon à l'œil, un
  dégradé sombre le protège, mais aucune mesure automatique ne sait lire un fond
  vidéo. À vérifier dehors, en plein soleil, cas typique d'un vigneron.
- **Les droits des visuels DJI** (voir `CREDITS-IMAGES.txt`). Des photos du
  matériel réel règlent le sujet et améliorent la crédibilité.

## Par où commencer

1. Points 1 et 4 : rapides, effet immédiat.
2. Point 2 : demande un réencodage.
3. Points 5, 6, 7 : confort d'usage, à faire quand le reste est stable.
4. Point 3 : dépend de vos photos et du lancement.
