// Controle mobile : aucune page ne deborde en largeur, menu utilisable au
// doigt et au clavier, barre d'action fixe sans masquer le contenu.
import { test, expect } from '@playwright/test';
import { axeViolations } from './a11y.js';

const PAGES = ['/', '/le-service', '/estimation', '/devis', '/equipement', '/a-propos', '/contact',
  '/connexion', '/inscription', '/mentions-legales', '/confidentialite', '/cookies', '/conditions-generales', '/conditions', '/credits'];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('vitiaero_lang_hint', '1'); } catch { /* ignore */ }
  });
});

for (const [width, lang] of [[360, 'fr'], [412, 'fr'], [768, 'fr'], [360, 'de'], [360, 'en']]) {
  test(`largeur ${width} px (${lang}) : aucun debordement horizontal`, async ({ page }) => {
    await page.addInitScript((l) => {
      try { localStorage.setItem('vitiaero_lang', l); } catch { /* ignore */ }
    }, lang);
    await page.setViewportSize({ width, height: 800 });
    const overflow = [];
    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState('networkidle').catch(() => {});
      const { scroll, inner, culprits } = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll('body *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return r.width > 0 && r.right > vw + 1 && style.position !== 'fixed' && !el.closest('.sr-only, .honeypot, .leaflet-container, .table-wrap, .eq-subnav-links');
          })
          .slice(0, 3)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
        return { scroll: document.documentElement.scrollWidth, inner: vw, culprits: wide };
      });
      if (scroll > inner || culprits.length) overflow.push(`${path} : ${scroll} > ${inner} ${culprits.join(', ')}`);
    }
    expect(overflow).toEqual([]);
  });
}

test('menu mobile : ouverture, focus, Echap, et liens retires quand il est ferme', async ({ page }) => {
  await page.goto('/');
  const burger = page.getByRole('button', { name: 'Menu' });
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeHidden();
  // Menu ferme : ses liens ne recoivent pas le focus clavier.
  await expect(menu.locator('a').first()).not.toBeVisible();
  await burger.click();
  await expect(menu).toBeVisible();
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.locator('a').first()).toBeFocused();
  await expect(page.locator('.mobile-cta')).toBeHidden(); // la barre du bas ne recouvre pas le menu
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(burger).toBeFocused();
  await burger.click();
  await menu.getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(menu).toBeHidden(); // se ferme au changement de page
});

test('barre d\'action mobile et cibles tactiles d\'au moins 44 px', async ({ page }) => {
  await page.goto('/');
  const bar = page.locator('.mobile-cta');
  await expect(bar).toBeVisible();
  for (const btn of await bar.locator('.btn').all()) {
    const box = await btn.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const burger = await page.getByRole('button', { name: 'Menu' }).boundingBox();
  expect(burger.height).toBeGreaterThanOrEqual(42);
  // Le pied de page reste lisible au-dessus de la barre fixe.
  await page.locator('.footer').scrollIntoViewIfNeeded();
  const pad = await page.locator('.footer').evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
  expect(pad).toBeGreaterThanOrEqual(80);
});

test('estimation au doigt : trace par touchers sur la carte', async ({ page }) => {
  await page.goto('/estimation');
  await page.getByRole('button', { name: 'Tracer une parcelle' }).first().tap();
  const map = page.locator('.map-canvas');
  await map.scrollIntoViewIfNeeded();
  const box = await map.boundingBox();
  const points = [[0.3, 0.3], [0.7, 0.3], [0.6, 0.7]];
  for (const [x, y] of points) {
    await page.touchscreen.tap(box.x + box.width * x, box.y + box.height * y);
    await page.waitForTimeout(350); // deux touchers rapprochés valent un double-toucher
  }
  await expect(page.getByRole('button', { name: 'Terminer (3)' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuer' }).tap();
  await expect(page.locator('.step-heading')).toHaveText(/Étape 2 sur 3/);
});

for (const path of ['/', '/estimation', '/contact']) {
  test(`accessibilite mobile ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle').catch(() => {});
    expect(await axeViolations(page)).toEqual([]);
  });
}
