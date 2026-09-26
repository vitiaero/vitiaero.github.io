# Plan de génération des visuels du T55 (en attente de crédits)

Préparé le 26 septembre 2026. Le solde Higgsfield est de 0,75 crédit : aucune
génération n'est possible sans dépasser l'abonnement. Ce plan est prêt à lancer
dès que des crédits sont disponibles (renouvellement ou recharge, au choix du
propriétaire).

## Règles de fidélité (à vérifier sur chaque résultat, avant publication)

1. Quatre bras en fibre de carbone, **une seule** hélice à deux pales par bras,
   pointes orange ; aucun rotor coaxial.
2. Bras avant plus hauts que les bras arrière.
3. Cylindre radar gris clair, debout à l'avant, avec ses petites caméras.
4. Réservoir blanc à l'arrière, couvercle rond gris, languette orange.
5. Batterie gris foncé à ailettes au centre.
6. **Deux buses centrifuges seulement, sous les deux moteurs arrière.** Aucune
   buse ni aucun jet sous les bras avant. Si une image montre plus de deux jets,
   ou un jet à l'avant, elle est rejetée.
7. Aucun texte, logo ni étiquette inventés ; aucune personne reconnaissable.

Contrôle : agrandir chaque image sur les moteurs et les buses, compter les
hélices et les jets, comparer avec les rendus de référence `t55-ref-*`.

## Références disponibles

- 14 rendus déjà envoyés à Higgsfield (`t55-ref-04` à `t55-ref-17`, voir
  `docs/REGISTRE-MEDIAS.md`).
- À envoyer au moment de la génération : les huit rendus transmis dans la
  conversation du 26.9 (batteries, générateur, pompes, radar, buses
  centrifuges, configuration à quatre buses de brumisation). Ils doivent
  d'abord être enregistrés dans un dossier (ils ne sont pas sur le disque).
- Images tirées des vidéos du dossier Téléchargements, comme références de
  cadrage seulement : `95b5dc17` (pulvérisation au-dessus des arbres),
  `e7c901d9` (radiocommande), `7df0677b` (batterie et dissipateur),
  `5868fa95` (pulvérisation au ras du champ).

## Bloc commun des prompts

> The reference images show the exact agricultural spraying drone to
> reproduce, with identical design and proportions: four carbon-fibre arms,
> each with ONE large two-blade black propeller with orange tips (four
> propellers only, no coaxial rotors); the two front arms mounted higher than
> the two rear arms; light-grey faceted central body; tall light-grey
> cylindrical radar module standing at the front; white 50-litre tank with a
> round grey lid and orange tab at the rear; dark-grey battery with heat-sink
> fins in the middle; black tubular landing gear. It has ONLY TWO centrifugal
> spray nozzles, hanging under the two REAR motors; the front motors have no
> nozzle and never spray. Nothing added, nothing missing. No text, no logos,
> no watermark, no people, no CGI look.

## Liste, dans l'ordre de priorité

| # | Visuel | Emplacement | Modèle | Coût |
|---|---|---|---|---|
| 1 | Image de départ, cadrée comme la vidéo 95b5dc17 : drone à distance moyenne au-dessus des rangs du Lavaux, deux jets arrière, arrière-plan de vignes | Accueil, « Notre drone » (ou en-tête) | GPT Image 2.5, très haute, 2K | 4,5 |
| 2 | Vidéo de 8 s depuis l'image 1 : travelling latéral lent, le drone avance, deux jets arrière | Même emplacement | Kling 3.0 pro, 8 s | 14 |
| 3 | Image de départ Équipement : drone au décollage au bord d'une vigne, vue basse | Équipement, en-tête | GPT Image 2.5, haute, 2K | 2,75 |
| 4 | Vidéo de 5 s depuis l'image 3 : décollage lent, poussière légère | Équipement, en-tête | Kling 3.0 pro, 5 s | 8,75 |
| 5 | Gros plan du module radar à l'avant, drone en vol au-dessus d'une vigne | Équipement, sécurité | GPT Image 2.5, haute, 2K | 2,75 |
| 6 | Vue de côté, drone au-dessus d'un rang de vigne, deux jets arrière | Équipement, pulvérisation | GPT Image 2.5, haute, 2K | 2,75 |
| 7 | Réservoir de 50 L en situation concrète : remplissage au bord de la parcelle (mains gantées, sans visage) | Équipement, pièce « réservoir » | GPT Image 2.5, haute, 2K | 2,75 |
| 8 | Batterie : autre plan, batterie posée sur le hayon ou en cours d'insertion (mains gantées) | Équipement, batterie | GPT Image 2.5, haute, 2K | 2,75 |
| 9 | Radiocommande tenue à deux mains devant les vignes, écran avec la carte d'une parcelle, sans texte lisible | Équipement, préparation du vol | GPT Image 2.5, haute, 2K | 2,75 |
| | **Total** | | | **43,75** |

Prévoir environ 11 crédits de plus pour deux ou trois reprises (une image non
conforme est régénérée, jamais publiée). Budget conseillé : 55 crédits.

## Ce qui est déjà en place sans crédit

- En-tête de l'accueil : vraie vidéo FPV des vignes d'Epesses (propriétaire).
- Images générées conformes gardées : pompes, buses, réservoir, batterie,
  radar, vue du ciel, drone posé, « Pourquoi le drone » (deux jets arrière).
- Images non conformes retirées : 88e4ab1a, c0e1edcd, aed43a1a (jet sous un
  bras avant).
