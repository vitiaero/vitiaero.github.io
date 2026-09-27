// Contenu publie : traductions completes, medias declares, aucune donnee
// fictive ni mention de projet d'etude, aucun media du fabricant.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fr from '../src/i18n/fr.js';
import de from '../src/i18n/de.js';
import en from '../src/i18n/en.js';
import { checkMedia } from '../scripts/check-media.mjs';
import { MEDIA, mediaBlockers } from '../shared/media.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, filter) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(full, filter);
    return filter(full) ? [full] : [];
  });
}

// Meme structure : memes cles, memes longueurs de listes, memes parametres.
function compare(a, b, where, out) {
  if (typeof a === 'function') {
    if (typeof b !== 'function') out.push(`${where} : fonction attendue`);
    else if (a.length !== b.length) out.push(`${where} : ${a.length} parametre(s) attendu(s), ${b.length} trouve(s)`);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) { out.push(`${where} : liste attendue`); return; }
    if (a.length !== b.length) out.push(`${where} : ${a.length} element(s) attendu(s), ${b.length} trouve(s)`);
    a.forEach((v, i) => compare(v, b[i], `${where}[${i}]`, out));
    return;
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') { out.push(`${where} : objet attendu`); return; }
    for (const k of Object.keys(a)) {
      if (!(k in b)) out.push(`${where}.${k} : manquant`);
      else compare(a[k], b[k], `${where}.${k}`, out);
    }
    for (const k of Object.keys(b)) if (!(k in a)) out.push(`${where}.${k} : en trop`);
    return;
  }
  if (typeof a !== typeof b) out.push(`${where} : type different`);
}

test('allemand et anglais : memes textes que le francais, cle par cle', () => {
  for (const [name, dict] of [['de', de], ['en', en]]) {
    const out = [];
    const { serverErrors: a, ...restFr } = fr;
    const { serverErrors: b, ...rest } = dict;
    compare(restFr, rest, name, out);
    assert.deepEqual(out, [], `${name} :\n${out.join('\n')}`);
  }
});

test('chaque message du serveur est traduit en allemand et en anglais', () => {
  // Messages renvoyes aux visiteurs : ceux de l'API (server/app.js).
  const sources = fs.readFileSync(path.join(ROOT, 'server/app.js'), 'utf8');
  const messages = new Set();
  for (const m of sources.matchAll(/(?:error: |new Error\()'((?:[^'\\]|\\.)+)'/g)) {
    const text = m[1].replace(/\\'/g, '\'');
    if (/^[A-Z]/.test(text) && text.endsWith('.')) messages.add(text);
  }
  assert.ok(messages.size > 20);
  for (const msg of messages) {
    assert.ok(de.serverErrors[msg], `traduction allemande manquante : ${msg}`);
    assert.ok(en.serverErrors[msg], `traduction anglaise manquante : ${msg}`);
  }
});

test('chaque appel a l\'action et chaque formulaire rappellent que ce n\'est pas une commande', () => {
  assert.match(fr.common.requestEstimate, /sans engagement/);
  assert.match(de.common.requestEstimate, /unverbindlich/i);
  assert.match(en.common.requestEstimate, /no obligation/);
  for (const d of [fr, de, en]) {
    for (const k of ['title', 'estimate', 'request', 'short']) assert.ok(d.noOrder[k]);
    assert.match(d.estimation.send, /\(.+\)/); // boutons d'envoi : mention entre parentheses
    assert.match(d.quote.send, /\(.+\)/);
    for (const cta of [d.home.why.cta, d.home.how.cta, d.quote.button, d.quote.mapCta, d.estimation.quoteCta, d.account.requests.new]) {
      assert.match(cta, /sans engagement|unverbindlich|no obligation/i, cta);
    }
  }
  assert.match(fr.noOrder.estimate, /ni une offre ferme ni une commande/);
  assert.match(de.noOrder.estimate, /weder ein verbindliches Angebot noch eine Bestellung/);
  assert.match(en.noOrder.estimate, /neither a firm offer nor an order/);
});

test('aucune mention de projet d\'etude, de donnee fictive ou de valeur a completer', () => {
  const files = [
    ...walk(path.join(ROOT, 'src'), (f) => /\.(js|jsx|css)$/.test(f)),
    ...walk(path.join(ROOT, 'shared'), (f) => f.endsWith('.js')),
    path.join(ROOT, 'index.html'),
  ];
  const bad = [/projet d.?[ée]tude/i, /study project/i, /Studienprojekt/i, /\bCPNV\b/, /\bPAE\b/, /\[A REMPLACER/i, /lorem ipsum/i, /donn[ée]es fictives/i, /fictitious data/i];
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    for (const re of bad) assert.doesNotMatch(text, re, `${path.relative(ROOT, f)} contient ${re}`);
  }
});

test('registre des medias : chaque fichier publie est declare et present', () => {
  const r = checkMedia();
  assert.deepEqual(r.unregistered, []);
  assert.deepEqual(r.missing, []);
  assert.deepEqual(r.errors, []);
});

test('aucun media du fabricant du drone n\'est publie ni reference', () => {
  const publicFiles = walk(path.join(ROOT, 'public'), () => true).map((f) => path.relative(ROOT, f));
  for (const f of publicFiles) assert.doesNotMatch(f, /dji|t50|agras|equip\//i, f);
  for (const m of MEDIA) assert.doesNotMatch(`${m.author} ${m.source || ''}`, /dji/i);
  const code = walk(path.join(ROOT, 'src'), (f) => /\.(js|jsx)$/.test(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  assert.doesNotMatch(code, /images\/equip|videos\/equip|t50-|drone-cutout|hero-poster/);
});

test('medias en attente de droits ecrits : signales comme bloquants', () => {
  const ids = mediaBlockers().map((b) => b.id);
  assert.ok(ids.includes('media:logo'));
  assert.ok(ids.includes('media:fpv-epesses'));
});

test('photo sous licence libre : credit visible a cote de l\'image', () => {
  const home = fs.readFileSync(path.join(ROOT, 'src/pages/Home.jsx'), 'utf8');
  assert.match(home, /banner-credit/);
  for (const d of [fr, de, en]) assert.match(d.home.lavaux.credit, /Joachim Kohler.*CC BY-SA 4\.0/);
});

test('carte : credits des fonds de carte affiches, jamais masques', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/styles.css'), 'utf8');
  assert.doesNotMatch(css, /leaflet-control-attribution\s*\{[^}]*display:\s*none/);
  const map = fs.readFileSync(path.join(ROOT, 'src/components/MapDraw.jsx'), 'utf8');
  assert.match(map, /control\.attribution/);
  assert.match(map, /openstreetmap\.org\/copyright/i);
  assert.match(map, /swisstopo/i);
});

test('noms des fonds de carte identiques sur la carte et dans la politique de confidentialite', async () => {
  const { buildContent } = await import('../shared/legal/index.js');
  const { documentToText } = await import('../shared/legal/core.js');
  for (const [lang, dict] of [['fr', fr], ['de', de], ['en', en]]) {
    const text = documentToText(buildContent('privacy', lang));
    for (const key of ['satellite', 'carte', 'plan', 'cadastre']) {
      assert.ok(text.includes(dict.map.layers[key]), `${lang} : fond "${dict.map.layers[key]}" absent de la politique`);
    }
  }
});
