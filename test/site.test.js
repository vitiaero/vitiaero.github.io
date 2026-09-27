// Indexation, en-tetes de page et fichiers generes selon l'etat de lancement ;
// estimation et calcul des distances.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { business } from '../shared/business.js';
import {
  applyHead, jsonLdScript, organizationJsonLd, pageMeta, robotsMeta, robotsTxt, securityTxt, sitemapXml,
} from '../shared/site.js';
import { PUBLIC_ROUTES, PRIVATE_ROUTES, SPA_ROUTES } from '../shared/security.js';
import { computeEstimate, TRAVEL_QUOTE_KM } from '../shared/pricing.js';
import { createRouter } from '../server/routing.js';
import fr from '../src/i18n/fr.js';
import { completeBusiness } from './fixtures/complete-business.js';

const template = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('pre-lancement : aucune indexation, pas de plan du site', () => {
  const txt = robotsTxt(business, { ready: false });
  assert.match(txt, /User-agent: \*\nDisallow: \/\n/);
  assert.doesNotMatch(txt, /Sitemap/);
  assert.equal(sitemapXml(business, { ready: false }), null);
  for (const route of PUBLIC_ROUTES) assert.equal(robotsMeta(route, { ready: false }), 'noindex, nofollow');
  assert.equal(organizationJsonLd(business, { ready: false }), null);
  assert.match(template, /<meta name="robots" content="noindex, nofollow" \/>/);
});

test('apres lancement : pages publiques indexables, espaces prives exclus', () => {
  const b = completeBusiness();
  const txt = robotsTxt(b, { ready: true });
  for (const r of PRIVATE_ROUTES) assert.match(txt, new RegExp(`Disallow: ${r}\\n`));
  assert.match(txt, /Sitemap: https:\/\/example\.ch\/sitemap\.xml/);
  const xml = sitemapXml(b, { ready: true });
  for (const r of PUBLIC_ROUTES) assert.ok(xml.includes(`<loc>https://example.ch${r === '/' ? '/' : r}</loc>`), r);
  for (const r of PRIVATE_ROUTES) assert.ok(!xml.includes(`example.ch${r}<`), r);
  assert.equal(robotsMeta('/le-service', { ready: true }), 'index, follow');
  assert.equal(robotsMeta('/espace-client', { ready: true }), 'noindex, nofollow');
  assert.equal(robotsMeta('/inconnue', { ready: true, known: false }), 'noindex, nofollow');
});

test('chaque route du site a son titre et sa description en francais', () => {
  for (const r of SPA_ROUTES) assert.ok(fr.meta.pages[`/${r}`], `meta.pages./${r} manquant`);
});

test('en-tete de page : balises remplacees et echappees', () => {
  const meta = pageMeta(business, '/le-service', fr.meta.pages, { ready: false, fallbackTitle: fr.meta.fallbackTitle });
  const html = applyHead(template, { ...meta, title: 'Titre "test" <b>' });
  assert.match(html, /<title>Titre &quot;test&quot; &lt;b&gt;<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/vitiaero\.ch\/le-service" \/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/vitiaero\.ch\/images\/og-vitiaero\.jpg" \/>/);
  assert.match(html, /<meta name="robots" content="noindex, nofollow" \/>/);
  assert.throws(() => applyHead('<html><head></head></html>', meta), /introuvable/);
});

test('donnees structurees : uniquement les informations fournies', () => {
  const b = completeBusiness();
  const data = organizationJsonLd(b, { ready: true });
  assert.equal(data.legalName, 'Entreprise Test Exemple Sàrl');
  assert.equal(data.taxID, 'CHE-000.000.001');
  assert.equal(data.address.postalCode, '1000');
  b.identity.phone = null;
  b.identity.address.street = null;
  const partial = organizationJsonLd(b, { ready: true });
  assert.equal(partial.telephone, undefined);
  assert.equal(partial.address, undefined);
  b.identity.legalName = '</script><script>alert(1)</script>';
  assert.doesNotMatch(jsonLdScript(organizationJsonLd(b, { ready: true })), /<\/script><script>/);
});

test('security.txt : contact et date d\'expiration', () => {
  const txt = securityTxt(business, { now: new Date('2026-09-27T10:00:00Z') });
  assert.match(txt, /^Contact: mailto:contact@vitiaero\.ch$/m);
  assert.match(txt, /^Expires: 2027-03-26T00:00:00\.000Z$/m);
});

test('estimation : distance a vol d\'oiseau signalee comme approximative', () => {
  const base = { areaM2: 10000, passes: 3, distanceKm: 20 };
  const road = computeEstimate(base);
  assert.equal(road.travel.approximate, false);
  assert.equal(road.complete, true);
  const direct = computeEstimate({ ...base, distanceApproximate: true });
  assert.equal(direct.travel.approximate, true);
  assert.equal(direct.complete, false);
  const far = computeEstimate({ ...base, distanceKm: TRAVEL_QUOTE_KM + 1 });
  assert.equal(far.travel.status, 'quote');
  assert.equal(far.complete, false);
});

test('estimation : minimum par passage et reduction selon le nombre de passages', () => {
  const small = computeEstimate({ areaM2: 1000, passes: 1, distanceKm: 10 });
  assert.equal(small.minimumApplied, true);
  const many = computeEstimate({ areaM2: 50000, passes: 10, distanceKm: 10 });
  assert.ok(many.savings > 0);
  assert.ok(many.unit < computeEstimate({ areaM2: 50000, passes: 1 }).unit);
});

test('routage : le serveur public de demonstration OSRM est refuse', () => {
  assert.throws(() => createRouter({ ROUTING_URL: 'https://router.project-osrm.org' }), /non commercial/);
  assert.throws(() => createRouter({ ROUTING_URL: 'ftp://exemple.test' }), /invalide/);
  assert.equal(createRouter({}).mode, 'direct');
  assert.equal(createRouter({ ROUTING_URL: 'http://127.0.0.1:5000' }).mode, 'osrm');
});

test('routage : sans serveur, distance a vol d\'oiseau ; serveur en panne, repli signale', async () => {
  const direct = await createRouter({}).distance({ lat: 46.52, lng: 6.63 });
  assert.equal(direct.method, 'direct');
  assert.ok(direct.km > 10 && direct.km < 30);
  // Port ferme : l'appel echoue, la distance retombe a vol d'oiseau.
  const down = await createRouter({ ROUTING_URL: 'http://127.0.0.1:9', ROUTING_TIMEOUT_MS: '500' }).distance({ lat: 46.52, lng: 6.63 });
  assert.equal(down.method, 'direct');
});

test('routage : reponse d\'un serveur OSRM auto-heberge', async () => {
  const http = await import('node:http');
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ code: 'Ok', routes: [{ distance: 23456 }] }));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    const router = createRouter({ ROUTING_URL: `http://127.0.0.1:${server.address().port}` });
    const d = await router.distance({ lat: 46.52, lng: 6.63 });
    assert.deepEqual(d, { km: 23.5, method: 'route' });
  } finally {
    server.close();
  }
});
