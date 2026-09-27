// Outils communs aux documents juridiques (mentions, confidentialite, cookies,
// CGV, conditions d'utilisation, credits).
//
// Chaque texte est ecrit une seule fois, avec ses trois langues cote a cote :
//   tr(lang, { fr: '...', de: '...', en: '...' })
// Une langue manquante leve une erreur : les tests construisent chaque document
// dans les trois langues, une traduction oubliee fait donc echouer la
// verification. Les documents sont des donnees (blocs et segments), rendues en
// React dans le navigateur et hachees cote serveur pour dater leurs versions.

export const LANGS = ['fr', 'de', 'en'];
export const LOCALES = { fr: 'fr-CH', de: 'de-CH', en: 'en-GB' };

export function tr(lang, texts) {
  for (const l of LANGS) {
    if (texts[l] === undefined || texts[l] === null || texts[l] === '') {
      throw new Error(`Traduction manquante (${l}) : ${JSON.stringify(texts.fr ?? texts).slice(0, 80)}`);
    }
  }
  if (!LANGS.includes(lang)) throw new Error(`Langue inconnue : ${lang}`);
  return texts[lang];
}

// --- Blocs -----------------------------------------------------------------
// Un contenu est une suite de segments : texte, lien, e-mail, mise en valeur.
const seg = (parts) => parts.flat().filter((x) => x !== null && x !== undefined && x !== false && x !== '');

export const p = (...parts) => ({ type: 'p', content: seg(parts) });
export const ul = (items) => ({ type: 'ul', items: items.filter(Boolean).map((i) => seg([i])) });
export const notice = (...parts) => ({ type: 'notice', content: seg(parts) });
export const table = (head, rows) => ({ type: 'table', head, rows: rows.map((r) => r.map((c) => seg([c]))) });
export const action = (name, label, done) => ({ type: 'action', action: name, label, done });
export const link = (href, text) => ({ link: href, text: text || href });
export const strong = (text) => ({ strong: text });
export const mail = (address) => ({ mail: address });
export const lines = (...rows) => ({ type: 'lines', rows: rows.filter(Boolean).map((r) => seg([r])) });

export const section = (id, title, blocks) => ({ id, title, blocks: blocks.flat().filter(Boolean) });

// --- Mise en forme ---------------------------------------------------------
export function fmtDate(iso, lang) {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(LOCALES[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export function fmtShortDate(iso, lang) {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(LOCALES[lang], { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(d);
}

// Nom d'un pays dans la langue du lecteur (code ISO a deux lettres).
export function countryName(code, lang) {
  try {
    return new Intl.DisplayNames([LOCALES[lang]], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
}

// Montant en francs, separateur suisse des milliers (5'000'000 CHF).
export function fmtCHF(amount) {
  return `${new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(Math.round(amount))} CHF`;
}

export const plural = (n, one, many) => (n === 1 ? one : many);

// --- Texte brut (hachage, e-mails, controles) -------------------------------
export function segmentsToText(content) {
  return (content || []).map((s) => {
    if (typeof s === 'string') return s;
    if (s.link) return s.text;
    if (s.mail) return s.mail;
    if (s.strong) return s.strong;
    return '';
  }).join('');
}

export function documentToText(doc) {
  const out = [doc.title];
  for (const s of doc.sections) {
    if (s.title) out.push(s.title);
    for (const b of s.blocks) {
      if (b.type === 'p' || b.type === 'notice') out.push(segmentsToText(b.content));
      else if (b.type === 'ul') b.items.forEach((i) => out.push(`- ${segmentsToText(i)}`));
      else if (b.type === 'lines') b.rows.forEach((r) => out.push(segmentsToText(r)));
      else if (b.type === 'table') {
        out.push(b.head.join(' | '));
        b.rows.forEach((r) => out.push(r.map(segmentsToText).join(' | ')));
      } else if (b.type === 'action') out.push(b.label);
    }
  }
  return out.join('\n');
}
