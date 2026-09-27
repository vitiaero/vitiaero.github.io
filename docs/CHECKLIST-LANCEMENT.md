# Checklist légale de lancement

À remplir, faire valider puis signer **avant** d'ouvrir le service au public
(formulaires, indexation, première intervention). Chaque ligne renvoie à une
référence de `INFORMATIONS-MANQUANTES.md`.

Ce document n'est pas un avis juridique. Il organise les vérifications ; il ne
les remplace pas. Les points marqués **J** doivent être validés par un juriste
suisse, **A** par l'autorité compétente, **F** par la fiduciaire. **P** :
propriétaire. **T** : vérification technique.

Les preuves (extraits, attestations, polices, contrats, déclarations signées)
se gardent **hors du dépôt**, qui est public. Dans le dépôt, on n'inscrit que
la référence, l'autorité et les dates (`shared/business.js`).

Contrôle automatique à tout moment : `npm run launch:status`.

---

## 1. Identité de l'entreprise

| ✔ | Réf. | Vérification | Qui | Preuve / référence | Date |
|---|---|---|---|---|---|
| ☐ | A1, A2 | Raison sociale exacte et forme juridique saisies (`identity.legalName`, `identity.legalForm`) | P, J | Extrait du registre du commerce ou déclaration | |
| ☐ | A3 | Obligation d'inscription au registre du commerce vérifiée (art. 931 CO), canton saisi ou `false` | A, J | Registre du commerce du canton de Vaud | |
| ☐ | A4 | Numéro IDE saisi, ou `false` si aucun | A | Registre IDE (OFS) | |
| ☐ | A5 | Assujettissement à la TVA et taux applicable confirmés ; numéro et taux saisis, ou `false` | F, A | AFC. Voir `CONFORMITE.md` : l'AFC range la pulvérisation des vignes au taux réduit | |
| ☐ | A6 | Adresse postale complète saisie | P | | |
| ☐ | A7 | `contact@vitiaero.ch` existe, est relevée, et répond | P | Message de test reçu | |
| ☐ | A9 | Personne responsable du contenu confirmée | P | | |
| ☐ | A10 | Titulaire du domaine `vitiaero.ch` = l'entreprise ; adresse finale du site confirmée (`site.domainHolderConfirmed`) | P | Données du registraire | |
| ☐ | A11 | Recherche d'antériorité « VitiAero » (Swissreg), recommandé | P, J | | |

## 2. Protection des données (LPD)

| ✔ | Réf. | Vérification | Qui | Preuve / référence | Date |
|---|---|---|---|---|---|
| ☐ | B1 | Responsable du traitement = l'entreprise de A1, adresse pour les demandes des personnes | J | | |
| ☐ | B3 | Hébergement du site décidé (GitHub Pages ou autre) au regard des règles d'usage de GitHub Pages pour une activité commerciale ; `services.siteHosting.confirmedOn` saisi | P, J | | |
| ☐ | B4, B5, B6 | Hébergeur de l'API, stockage des sauvegardes, boîte e-mail et service d'envoi choisis et saisis (`services`) | P | | |
| ☐ | B4–B6 | Contrat de sous-traitance signé avec chaque prestataire (art. 9 LPD) | P, J | Contrats (hors dépôt) | |
| ☐ | B4–B6 | Pays de traitement et garantie de chaque transfert à l'étranger (art. 16 et 17 LPD, annexe 1 OPDo) | J | `SERVICES-TIERS.md` | |
| ☐ | B3 | Statut « Active » de GitHub, Inc. revérifié sur la liste officielle du Data Privacy Framework (`services.siteHosting.verifiedOn`) | P | dataprivacyframework.gov | |
| ☐ | B7 | Calcul des distances choisi : vol d'oiseau (`false`) ou OSRM auto-hébergé | P | `EXPLOITATION.md`, section 5 | |
| ☐ | B10 | Registre des activités de traitement : obligatoire ou non (art. 12 LPD, art. 24 OPDo) | J | | |
| ☐ | B11 | Procédure d'annonce d'une violation au PFPDT (art. 24 LPD) et personne chargée | P, J | `EXPLOITATION.md`, section 11 | |
| ☐ | G1 | Politique de confidentialité : devoir d'informer (art. 19 à 21 LPD), finalités, destinataires, pays, durées, droits | J | | |
| ☐ | G1 | Page cookies et stockage local : information et possibilité de refus (art. 45c LTC) | J | | |
| ☐ | C7 | Preuve de lecture enregistrée (document, version, date, finalité) : contenu et durée validés | J | | |

## 3. Conservation des données

| ✔ | Réf. | Vérification | Qui | Preuve / référence | Date |
|---|---|---|---|---|---|
| ☐ | C1 | Demandes sans suite : 24 mois après le dernier échange (valeur saisie, à confirmer) | P, J | | |
| ☐ | C2 | Dossiers liés à un contrat : 10 ans (art. 958f CO), confirmé par la fiduciaire | F | | |
| ☐ | C3–C6 | Pièces jointes, comptes inactifs, sauvegardes, journaux du serveur : durées saisies | P, J | | |
| ☐ | C6 | Durée de conservation des journaux réglée chez l'hébergeur de l'API, égale à `retention.serverLogsDays` | T | | |
| ☐ | B5 | Exercice de restauration d'une sauvegarde réussi | T | `EXPLOITATION.md`, section 6 | |

## 4. Conditions commerciales et prix

| ✔ | Réf. | Vérification | Qui | Preuve / référence | Date |
|---|---|---|---|---|---|
| ☐ | D1 | Clientèle : professionnels seulement, ou aussi particuliers. Conséquences vérifiées (OIP, art. 8 LCD, for des consommateurs art. 32 et 35 CPC) | P, J | | |
| ☐ | D2–D9 | Validité des devis, paiement, annulation, report pour météo, fourniture des produits, réclamations : saisis | P | | |
| ☐ | D10 | Limitation de responsabilité rédigée ou écartée (art. 100 CO) | J | | |
| ☐ | D11, E8 | Assurance RC : assureur, police, somme, activités couvertes (drone, dérive, cultures voisines), validité | P | Police (hors dépôt) | |
| ☐ | D12, D13 | For et langue qui fait foi | J | | |
| ☐ | D14 | Grille tarifaire et base de départ des déplacements confirmées ; prix annoncés conformes à l'OIP si la clientèle comprend des consommateurs (prix effectivement à payer, TVA comprise) | P, F, J | `shared/pricing.js` | |
| ☐ | D15 | Délai de réponse (48 h) et rayon d'intervention (100 km) confirmés | P | | |
| ☐ | D17 | Commande en ligne : **non activée**. L'estimation et la demande de devis ne sont pas des commandes (écrit sur chaque bouton, formulaire, récapitulatif et e-mail) | P, J | | |
| ☐ | G1 | Conditions générales et conditions d'utilisation relues | J | | |

## 5. Autorisations et justificatifs

Pour chaque ligne, saisir dans `shared/business.js` (`credentials`) : type,
référence, autorité, date de délivrance, échéance (ou `false`) et date de
vérification. Le site n'affiche un justificatif que complet et non échu.

| ✔ | Réf. | Justificatif | Qui | Référence | Échéance |
|---|---|---|---|---|---|
| ☐ | E1 | Autorisation de l'OFAC pour la pulvérisation par drone | A (OFAC) | | |
| ☐ | E2 | Exigences des cantons de Vaud, du Valais et de Genève (SafetySpray, radiotéléphonie) | A (OFAC, canton) | | |
| ☐ | E3 | Homologation du modèle de drone par Agroscope, confirmée par écrit | A (Agroscope) | | |
| ☐ | E4 | Contrôle du pulvérisateur par un organisme agréé | A | | |
| ☐ | E5 | Permis d'utilisation professionnelle de produits phytosanitaires (OPer-A) | A | | |
| ☐ | E6 | Compétences de télépilote exigées pour cette exploitation | A (OFAC) | | |
| ☐ | E7 | Enregistrement de l'exploitant de drones | A (OFAC) | | |
| ☐ | E9 | Date de mise en service du drone (le site parle de « drone prévu » jusque-là) | P | | |

## 6. Médias et marques

| ✔ | Réf. | Vérification | Qui | Preuve / référence | Date |
|---|---|---|---|---|---|
| ☐ | F1 | Déclaration écrite d'auteur des images d'Epesses ; aucune personne reconnaissable ; vol conforme aux règles alors en vigueur (`declarationSignedOn` dans `shared/media.js`) | P | Déclaration signée (hors dépôt) | |
| ☐ | F2 | Origine et droits du logo établis (`rights` et `author` dans `shared/media.js`) | P | Cession ou conditions de l'outil | |
| ☐ | F5 | Mention des marques DJI et Agras : uniquement pour nommer le drone prévu, sans logo | J | | |
| ☐ | F6 | Plan cadastral : besoin d'un enregistrement confirmé ou écarté | A (swisstopo) | | |
| ☐ | — | Page `/credits` relue : chaque média, licence et fond de carte | P | | |

## 7. Publicité exacte et traductions

| ✔ | Réf. | Vérification | Qui | Preuve / référence | Date |
|---|---|---|---|---|---|
| ☐ | G1 | Aucune affirmation sans preuve (art. 3 al. 1 let. b LCD) : caractéristiques du drone tirées des publications du fabricant, aucun client, chiffre ou avis inventé | P, J | `CONFORMITE.md` | |
| ☐ | G1 | Textes des formulaires et des e-mails relus (`legalReview.documents` contient aussi `forms` et `emails`) | J | | |
| ☐ | G2 | Versions allemande et anglaise relues par un traducteur (recommandé) | Traducteur | | |

## 8. Technique

| ✔ | Vérification | Qui | Date |
|---|---|---|---|
| ☐ | `npm run launch:status` : aucune information bloquante | T | |
| ☐ | Workflow « Tests » vert sur la version publiée ; `npm audit` sans vulnérabilité élevée | T | |
| ☐ | `NODE_ENV=production`, `DATA_DIR` sur un disque persistant, `ADMIN_PASSWORD` de 12 caractères au moins | T | |
| ☐ | SMTP configuré, SPF, DKIM et DMARC publiés, accusé de réception de test reçu dans les trois langues | T | |
| ☐ | `BACKUP_DIR` et `BACKUP_KEY` définis, clé dans un coffre de mots de passe, copie hors site | T | |
| ☐ | `ALLOW_PRELAUNCH_SUBMISSIONS` **absent** en production | T | |
| ☐ | HTTPS forcé sur le domaine ; `security.txt` publié | T | |
| ☐ | Workflow « Surveillance » actif, notifications de GitHub reçues par le propriétaire | T | |
| ☐ | Réglages de sécurité GitHub faits (`SECURITY.md`, section 9) | T | |

---

## 9. Signatures

Une fois tout coché, inscrire la date de signature dans `shared/business.js`
(`launchChecklistSignedOn`) et la relecture juridique dans `legalReview`, puis
`npm run legal:version`, compiler et publier. Garder l'exemplaire signé hors du
dépôt.

| Rôle | Nom | Date | Visa | Remarques |
|---|---|---|---|---|
| Propriétaire, responsable du traitement | | | | |
| Juriste suisse (relecture G1) | | | | |
| Fiduciaire (TVA, conservation) | | | | |

Autorités consultées :

| Autorité | Objet | Référence de la réponse | Date |
|---|---|---|---|
| OFAC | Autorisation SPRAY, exigences cantonales, télépilote, enregistrement | | |
| Agroscope | Homologation du modèle de drone | | |
| Organisme de contrôle agréé | Contrôle du pulvérisateur | | |
| Canton de Vaud | Registre du commerce, exigences cantonales | | |
| AFC | TVA : assujettissement et taux | | |
| swisstopo | Plan cadastral | | |
