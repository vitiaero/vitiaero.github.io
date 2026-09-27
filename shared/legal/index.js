// Registre des documents juridiques et construction dans une langue.
import { business as defaultBusiness } from '../business.js';
import { MEDIA } from '../media.js';
import { LANGS } from './core.js';
import { currentVersion, knownVersions, versionDate } from './current.js';
import mentions from './mentions.js';
import privacy from './privacy.js';
import cookies from './cookies.js';
import cgv from './cgv.js';
import terms from './terms.js';
import credits from './credits.js';

export const DOCUMENTS = { mentions, privacy, cookies, cgv, terms, credits };

// Adresse de chaque document sur le site.
export const DOC_ROUTES = {
  mentions: '/mentions-legales',
  privacy: '/confidentialite',
  cookies: '/cookies',
  cgv: '/conditions-generales',
  terms: '/conditions',
  credits: '/credits',
};

export { currentVersion, knownVersions, versionDate };

// Contenu seul, sans numero de version : sert au hachage.
export function buildContent(id, lang, { business = defaultBusiness, media = MEDIA } = {}) {
  const make = DOCUMENTS[id];
  if (!make) throw new Error(`Document inconnu : ${id}`);
  const doc = make(business, lang, { media });
  let n = 0;
  const sections = doc.sections
    .filter((s) => s && s.blocks.length > 0)
    .map((s) => {
      if (!doc.numbered || !s.title) return s;
      n += 1;
      return { ...s, title: `${n}. ${s.title}` };
    });
  return { id: doc.id, title: doc.title, sections };
}

export function buildDocument(id, lang, opts = {}) {
  return { ...buildContent(id, lang, opts), version: currentVersion(id) };
}

// Les trois langues d'un document, pour le hachage et les controles.
export function documentData(id, opts = {}) {
  return Object.fromEntries(LANGS.map((lang) => [lang, buildContent(id, lang, opts)]));
}
