// Controle d'accessibilite automatique (axe-core, WCAG 2.1 A et AA).
// Seules les violations graves ou critiques font echouer le test ; les autres
// sont affichees pour correction.
import AxeBuilder from '@axe-core/playwright';

export async function axeViolations(page, { exclude = [] } = {}) {
  // Etat final des pages : les animations d'apparition sont coupees (sinon un
  // texte a mi-transparence fausse la mesure des contrastes).
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  for (const sel of exclude) builder = builder.exclude(sel);
  const { violations } = await builder.analyze();
  const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  for (const v of violations) {
    if (!serious.includes(v)) console.log(`[axe] ${v.impact} ${v.id} (${v.nodes.length}) : ${v.help}`);
  }
  return serious.map((v) => `${v.id} : ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join(' | ')}`);
}
