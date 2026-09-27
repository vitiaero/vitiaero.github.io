// Affiche l'etat de la porte de lancement : ce qui manque encore avant
// l'ouverture commerciale (references de docs/INFORMATIONS-MANQUANTES.md).
// Usage : npm run launch:status
import { business } from '../shared/business.js';
import { launchStatus } from '../shared/launch.js';

const GROUPS = {
  project: 'Projet',
  identity: 'Identite de l\'entreprise',
  privacy: 'Prestataires et donnees',
  retention: 'Durees de conservation',
  commercial: 'Conditions commerciales et assurance',
  credentials: 'Autorisations et justificatifs',
  media: 'Droits sur les medias',
  review: 'Validation',
};

const status = launchStatus(business);
if (business.fictional) {
  console.log('Entreprise fictive (PAE au CPNV) : le site reste non indexe et n\'enregistre aucune demande en production.');
  console.log('Controles ci-dessous : ce qu\'une entreprise reelle devrait encore fournir.');
}
console.log(status.ready
  ? 'Porte de lancement franchie : le site peut etre ouvert (formulaires, indexation).'
  : `Pre-lancement : ${status.blockers.length} information(s) bloquante(s).`);

for (const [group, title] of Object.entries(GROUPS)) {
  const checks = status.checks.filter((c) => c.group === group);
  if (checks.length === 0) continue;
  console.log(`\n${title}`);
  for (const c of checks) console.log(`  ${c.ok ? '[ok]' : '[--]'} ${c.ref.padEnd(4)} ${c.label}`);
}
for (const w of status.warnings) console.log(`\nAttention : ${w.label} (dans ${w.days} jour(s)).`);
console.log('\nAucun avis juridique : ces controles verifient seulement que les informations sont fournies.');
process.exitCode = status.ready ? 0 : 2;
