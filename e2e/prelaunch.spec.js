// Site compile tel qu'il est publie : entreprise fictive (PAE au CPNV), donc
// porte de lancement fermee (aucune indexation, rien n'est enregistre), mais
// pages completes et formulaires visibles pour la demonstration.
import { test, expect } from '@playwright/test';
import { axeViolations } from './a11y.js';

const PAGES = ['/', '/le-service', '/estimation', '/devis', '/equipement', '/a-propos', '/contact',
  '/mentions-legales', '/confidentialite', '/cookies', '/conditions-generales', '/conditions', '/credits'];

// Pas de bandeau de proposition de langue ni d'aide de premiere visite
// pendant les controles automatiques.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('vitiaero_lang_hint', '1'); } catch { /* ignore */ }
  });
});

test('chaque page : bandeau « entreprise fictive », aucune indexation, aucun media du fabricant', async ({ page }) => {
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  const broken = [];
  page.on('response', (r) => {
    if (r.url().startsWith('http://127.0.0.1') && r.status() >= 400) broken.push(`${r.status()} ${r.url()}`);
  });
  for (const path of PAGES) {
    const res = await page.goto(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()['x-robots-tag'], path).toBe('noindex, nofollow');
    await expect(page.locator('.launch-notice')).toContainText('Entreprise fictive.');
    await expect(page.locator('.footer-fiction')).toContainText('PAE au CPNV');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.locator('h1').first()).toBeVisible();
  }
  expect(requests.filter((u) => /dji\.com|images\/equip|videos\/equip|t50|drone-cutout/i.test(u))).toEqual([]);
  expect(broken).toEqual([]);
});

test('fichiers publics : robots.txt bloque tout, pas de plan du site, security.txt et licences', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toMatch(/User-agent: \*\nDisallow: \/\n/);
  expect((await request.get('/sitemap.xml')).status()).toBe(404);
  const security = await request.get('/.well-known/security.txt');
  expect(security.status()).toBe(200);
  expect(await security.text()).toMatch(/^Contact: mailto:/m);
  const licences = await request.get('/licences-tiers.txt');
  const text = await licences.text();
  for (const pkg of ['react-dom', 'react-router', 'leaflet']) expect(text).toContain(pkg);
  const missing = await request.get('/page-inexistante');
  expect(missing.status()).toBe(404);
});

test('formulaires de demonstration : visibles, mais rien n\'est enregistre', async ({ page }) => {
  for (const path of ['/devis', '/inscription']) {
    await page.goto(path);
    await expect(page.locator('form input[type="email"]')).toHaveCount(1);
  }
  await page.goto('/contact');
  await page.locator('#ct-name').fill('Visiteur Test');
  await page.locator('#ct-email').fill('visiteur@example.ch');
  await page.locator('#ct-message').fill('Bonjour');
  await page.locator('#ct-consent').check();
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith('/api/contact')),
    page.getByRole('button', { name: 'Envoyer le message' }).click(),
  ]);
  expect(response.status()).toBe(503);
  await expect(page.locator('.alert-error')).toContainText('entreprise fictive (PAE au CPNV)');
});

test('estimation au clavier : trace, prix indicatif, mention "pas une commande", envoi refuse', async ({ page }) => {
  await page.goto('/estimation');
  await expect(page.locator('.wizard-step')).toHaveCount(4);
  await page.getByRole('button', { name: 'Tracer une parcelle' }).first().click();
  const map = page.locator('.map-canvas');
  await map.focus();
  await page.keyboard.press('Enter');
  for (let i = 0; i < 3; i += 1) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  for (let i = 0; i < 3; i += 1) await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('.map-panel [role="status"].sr-only')).toHaveText('Point 3 ajouté.');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.locator('.step-heading')).toHaveText(/Étape 2 sur 4/);
  await expect(page.locator('.step-heading')).toBeFocused();
  await page.locator('input[name="passes"][value="3"]').check();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.locator('#est-name').fill('Visiteur Test');
  await page.locator('#est-email').fill('visiteur@example.ch');
  await page.getByRole('button', { name: 'Voir mon estimation' }).click();
  await expect(page.locator('.step-heading')).toHaveText(/Étape 4 sur 4/);
  await expect(page.locator('.no-order')).toContainText('Ce n\'est pas une commande.');
  await expect(page.locator('.est-bill-total strong')).toContainText('CHF');
  await page.locator('#est-consent').check();
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith('/api/estimations')),
    page.getByRole('button', { name: 'Envoyer ma demande (sans engagement)' }).click(),
  ]);
  expect(response.status()).toBe(503);
  await expect(page.locator('.alert-error')).toContainText('entreprise fictive');
  await expect(page).toHaveURL(/\/estimation$/);
});

test('carte : credits des fonds de carte visibles', async ({ page }) => {
  await page.goto('/estimation');
  const attribution = page.locator('.leaflet-control-attribution');
  await expect(attribution).toBeVisible();
  await expect(attribution).toContainText('swisstopo');
  await page.getByRole('button', { name: 'Plan', exact: true }).click();
  await expect(attribution).toContainText('OpenStreetMap');
});

test('pages juridiques : entreprise fictive annoncee en tete, versions datees', async ({ page }) => {
  await page.goto('/mentions-legales');
  const text = await page.locator('article.legal').innerText();
  // Premier encadre de la page : l'avertissement, avant les coordonnees.
  await expect(page.locator('article.legal .alert').first()).toContainText('Entreprise fictive : VitiAero a été imaginée dans le cadre d\'un PAE au CPNV');
  expect(text).toContain('contact@vitiaero.ch');
  expect(text).toContain('CHE-000.000.000');
  await expect(page.locator('.legal-meta')).toContainText('version 2026-');
  await page.goto('/credits');
  await expect(page.locator('article.legal')).toContainText('Joachim Kohler');
  await expect(page.locator('article.legal')).toContainText('OpenStreetMap');
});

test('langues : allemand et anglais charges a la demande, choix memorise', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-actions .lang-trigger').click();
  await page.getByRole('button', { name: /Deutsch/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de-CH');
  await expect(page.locator('.launch-notice')).toContainText('Fiktives Unternehmen.');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de-CH');
  await expect(page.locator('.hero .btn-primary').first()).toHaveText('Unverbindlich schätzen');
  await page.locator('.nav-actions .lang-trigger').click();
  await page.getByRole('button', { name: /English/ }).click();
  await expect(page.locator('.launch-notice')).toContainText('Fictional company.');
});

test('proposition de langue pour un navigateur en allemand', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'de-CH' });
  const page = await context.newPage();
  await page.goto('/');
  const suggest = page.locator('.lang-suggest');
  await expect(suggest).toContainText('Diese Website ist auch auf Deutsch verfügbar.');
  await suggest.getByRole('button', { name: 'Auf Deutsch anzeigen' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de-CH');
  await expect(suggest).toHaveCount(0);
  await context.close();
});

for (const path of ['/', '/le-service', '/estimation', '/equipement', '/contact', '/confidentialite', '/credits']) {
  test(`accessibilite ${path} : aucune violation grave (axe, WCAG 2.1 AA)`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle').catch(() => {});
    expect(await axeViolations(page)).toEqual([]);
  });
}
