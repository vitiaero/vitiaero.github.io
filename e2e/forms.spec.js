// Formulaires ouverts (serveur de developpement, API sur une base temporaire,
// e-mails gardes en memoire) : parcours complets dans le navigateur.
import { test, expect } from '@playwright/test';
import { axeViolations } from './a11y.js';

// PNG de 1 x 1 pixel.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('vitiaero_lang_hint', '1'); localStorage.setItem('vitiaero_map_tip', '1'); } catch { /* ignore */ }
  });
});

async function drawParcel(page) {
  await page.getByRole('button', { name: 'Tracer une parcelle' }).click();
  await page.locator('.map-canvas').focus();
  await page.keyboard.press('Enter');
  for (let i = 0; i < 4; i += 1) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  for (let i = 0; i < 4; i += 1) await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Terminer (3)' }).click();
  await expect(page.locator('.parcel-list li')).toHaveCount(1);
}

test('estimation complete : coordonnees, confirmation de lecture, envoi et confirmation', async ({ page }) => {
  await page.goto('/estimation');
  await expect(page.locator('.wizard-step')).toHaveCount(4);
  await drawParcel(page);
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.locator('input[name="passes"][value="2"]').check();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.locator('.step-heading')).toHaveText(/Étape 3 sur 4 : Vos coordonnées/);

  // Champs obligatoires : resume des erreurs, focus, liens vers les champs.
  await page.getByRole('button', { name: 'Voir mon estimation' }).click();
  const summary = page.locator('.error-summary');
  await expect(summary).toBeFocused();
  await expect(summary).toContainText('Indiquez votre nom.');
  await expect(page.locator('#est-name')).toHaveAttribute('aria-invalid', 'true');
  expect(await axeViolations(page, { exclude: ['.leaflet-container'] })).toEqual([]);

  await page.locator('#est-name').fill('Client Navigateur');
  await page.locator('#est-email').fill('navigateur@example.ch');
  await page.locator('#est-commune').fill('Epesses');
  await page.getByRole('button', { name: 'Voir mon estimation' }).click();
  await expect(page.locator('.step-heading')).toHaveText(/Étape 4 sur 4/);
  await expect(page.locator('.no-order')).toContainText('Ce n\'est pas une commande.');
  const send = page.getByRole('button', { name: 'Envoyer ma demande (sans engagement)' });

  // Sans confirmation de lecture : rien n'est envoye.
  let posted = 0;
  page.on('request', (r) => { if (r.method() === 'POST' && r.url().endsWith('/api/estimations')) posted += 1; });
  await send.click();
  await expect(page.locator('.error-summary')).toContainText('politique de confidentialité');
  expect(posted).toBe(0);

  const consent = page.locator('#est-consent');
  await expect(page.locator('label.consent')).toContainText(/version du \d{2}\.\d{2}\.\d{4}/);
  await consent.check();
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith('/api/estimations') && r.request().method() === 'POST'),
    send.click(),
  ]);
  const body = JSON.parse(response.request().postData());
  expect(body.consent.privacy).toMatch(/^\d{4}-\d{2}-\d{2}/);
  expect(body.lang).toBe('fr');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/\/confirmation$/);
  await expect(page.locator('h1')).toHaveText('Votre demande d\'estimation a bien été reçue.');
  await expect(page.locator('.no-order')).toContainText('ni une offre ferme ni une commande');
  await expect(page.locator('.recap')).toContainText('#');
});

test('contact : validation, confirmation de lecture puis envoi', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Envoyer le message' }).click();
  await expect(page.locator('.error-summary')).toBeFocused();
  // L'aide du champ reste annoncee avec le message d'erreur.
  await expect(page.locator('#ct-message')).toHaveAttribute('aria-describedby', 'ct-message-error ct-message-hint');
  await page.locator('#ct-name').fill('Personne Navigateur');
  await page.locator('#ct-email').fill('contact.navigateur@example.ch');
  await page.locator('#ct-message').fill('Bonjour, une question sur le service.');
  await page.locator('#ct-consent').check();
  await page.getByRole('button', { name: 'Envoyer le message' }).click();
  await expect(page.locator('[role="status"]').filter({ hasText: 'Message envoyé.' })).toBeVisible();
});

test('demande de devis avec photo', async ({ page }) => {
  await page.goto('/devis');
  await page.locator('#dv-name').fill('Domaine Navigateur');
  await page.locator('#dv-email').fill('devis.navigateur@example.ch');
  await page.locator('#dv-commune').fill('Chexbres');
  await page.locator('#dv-area').fill('1,2');
  await page.locator('input[type="file"]').setInputFiles({ name: 'parcelle.png', mimeType: 'image/png', buffer: PNG });
  await expect(page.locator('.file-list li')).toContainText('parcelle.png');
  await expect(page.locator('.no-order')).toBeVisible();
  await page.locator('#dv-consent').check();
  await page.getByRole('button', { name: 'Envoyer ma demande de devis' }).click();
  await expect(page.locator('[role="status"]').filter({ hasText: 'Demande envoyée.' })).toBeVisible();
});

test('compte client : inscription, suivi, export des donnees et suppression', async ({ page }) => {
  await page.goto('/inscription');
  await page.locator('#reg-name').fill('Compte Navigateur');
  await page.locator('#reg-email').fill('compte.navigateur@example.ch');
  await page.locator('#reg-password').fill('motdepasse-navigateur');
  await page.locator('#reg-confirm').fill('motdepasse-navigateur');
  await expect(page.locator('label.consent')).toContainText('les conditions d\'utilisation');
  await page.locator('#reg-consent').check();
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page).toHaveURL(/\/espace-client$/);
  await expect(page.locator('h1')).toContainText('Compte Navigateur');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Télécharger mes données (JSON)' }).click(),
  ]);
  const data = JSON.parse(await (await download.createReadStream()).toArray().then((c) => Buffer.concat(c).toString('utf8')));
  expect(data.account.email).toBe('compte.navigateur@example.ch');
  expect(data.consents.map((c) => c.document).sort()).toEqual(['privacy', 'terms']);

  expect(await axeViolations(page, { exclude: ['.leaflet-container'] })).toEqual([]);

  await page.getByRole('button', { name: 'Supprimer mon compte' }).click();
  await page.locator('#acc-delete-password').fill('motdepasse-navigateur');
  await page.getByRole('button', { name: 'Supprimer définitivement' }).click();
  await expect(page).not.toHaveURL(/\/espace-client$/);
  const me = await page.request.post('/api/auth/login', { data: { email: 'compte.navigateur@example.ch', password: 'motdepasse-navigateur' } });
  expect(me.status()).toBe(401);
});
