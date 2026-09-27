// Documents juridiques : trois langues synchronisees, aucune donnee inventee,
// version publiee a jour.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DOCUMENTS, buildContent, buildDocument } from '../shared/legal/index.js';
import { documentToText, LANGS } from '../shared/legal/core.js';
import { outdatedVersions } from '../shared/legal/hash.js';
import { currentVersion, knownVersions } from '../shared/legal/current.js';
import { completeBusiness, confirmedMedia, prelaunchBusiness } from './fixtures/complete-business.js';

const IDS = Object.keys(DOCUMENTS);
const FORBIDDEN = [/undefined/, /\bnull\b/, /NaN/, /\[object/, /\[A REMPLACER/i, /\[[^\]]*\]/, /lorem/i];

function shape(doc) {
  return doc.sections.map((s) => ({ title: !!s.title, blocks: s.blocks.map((b) => [b.type, b.items?.length ?? b.rows?.length ?? 0]) }));
}

for (const [label, opts] of [
  ['entreprise fictive (configuration actuelle)', {}],
  ['entreprise reelle sans information (test)', { business: prelaunchBusiness() }],
  ['entreprise reelle complete (test)', { business: completeBusiness(), media: confirmedMedia() }],
]) {
  test(`${label} : chaque document existe dans les trois langues, sans trou`, () => {
    for (const id of IDS) {
      const shapes = LANGS.map((lang) => shape(buildContent(id, lang, opts)));
      assert.deepEqual(shapes[1], shapes[0], `${id} : structure allemande differente du francais`);
      assert.deepEqual(shapes[2], shapes[0], `${id} : structure anglaise differente du francais`);
      for (const lang of LANGS) {
        const text = documentToText(buildContent(id, lang, opts));
        for (const re of FORBIDDEN) assert.doesNotMatch(text, re, `${id}/${lang} contient ${re}`);
      }
    }
  });
}

test('entreprise fictive : chaque document concerne l\'annonce en tete, dans les trois langues', () => {
  const words = { fr: /Entreprise fictive/, de: /Fiktives Unternehmen/, en: /Fictional company/ };
  for (const id of ['mentions', 'privacy', 'cgv', 'terms']) {
    for (const lang of LANGS) {
      const doc = buildContent(id, lang);
      const first = documentToText({ title: '', sections: [doc.sections[0]] });
      assert.match(first, words[lang], `${id}/${lang}`);
      assert.match(first, /PAE/);
      assert.match(first, /CPNV/);
    }
  }
  // Donnees visiblement fictives : numero IDE nul, noms « Exemple », aucun telephone.
  const mentions = documentToText(buildContent('mentions', 'fr'));
  assert.match(mentions, /CHE-000\.000\.000/);
  assert.doesNotMatch(mentions, /Téléphone/);
  const privacy = documentToText(buildContent('privacy', 'fr'));
  assert.match(privacy, /Exemple Hébergement SA/);
  // Sans le mode fictif, aucun avis de ce type.
  const real = documentToText(buildContent('mentions', 'fr', { business: completeBusiness(), media: confirmedMedia() }));
  assert.doesNotMatch(real, /fictive|CPNV|PAE/);
});

test('pre-lancement (entreprise reelle) : les donnees manquantes ne sont ni inventees ni affichees', () => {
  const text = documentToText(buildContent('mentions', 'fr', { business: prelaunchBusiness() }));
  assert.match(text, /pré-lancement|pas encore/i);
  assert.doesNotMatch(text, /CHE-\d{3}/); // aucun numero IDE
  assert.doesNotMatch(text, /Sàrl|\bS\.A\.|\bSA\b|GmbH/); // aucune raison sociale inventee
});

test('configuration complete : les vraies donnees apparaissent dans chaque langue', () => {
  const b = completeBusiness();
  for (const lang of LANGS) {
    const mentions = documentToText(buildContent('mentions', lang, { business: b, media: confirmedMedia() }));
    assert.match(mentions, /Entreprise Test Exemple Sàrl/);
    assert.match(mentions, /CHE-000\.000\.001/);
    const cgv = documentToText(buildContent('cgv', lang, { business: b, media: confirmedMedia() }));
    assert.match(cgv, /30/); // validite du devis et paiement
  }
});

test('les versions publiees correspondent au contenu (npm run legal:version)', () => {
  assert.deepEqual(outdatedVersions(), []);
  for (const id of IDS) {
    const v = currentVersion(id);
    assert.match(v, /^\d{4}-\d{2}-\d{2}(\.\d+)?$/);
    assert.ok(knownVersions(id).includes(v));
    assert.equal(buildDocument(id, 'fr').version, v);
  }
});

test('la politique de confidentialite cite chaque stockage local et le droit applicable', () => {
  for (const lang of LANGS) {
    const text = documentToText(buildContent('privacy', lang));
    assert.match(text, /LPD|DSG|FADP/);
    assert.match(text, /PFPDT|EDÖB|FDPIC/);
  }
  const cookies = documentToText(buildContent('cookies', 'fr'));
  for (const key of ['vitiaero_token', 'vitiaero_lang', 'vitiaero_privacy_ack']) assert.match(cookies, new RegExp(key));
});

test('credits : chaque media publie est attribue, fonds de carte compris', () => {
  const text = documentToText(buildContent('credits', 'fr'));
  assert.match(text, /Joachim Kohler/);
  assert.match(text, /CC BY-SA 4\.0/);
  assert.match(text, /OpenStreetMap/);
  assert.match(text, /swisstopo/i);
  assert.match(text, /SIL Open Font License/);
});
