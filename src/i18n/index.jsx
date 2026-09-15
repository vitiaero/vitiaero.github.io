// Langue du site : francais (reference), allemand et anglais.
// Au premier passage, on suit la langue du navigateur ; le choix fait avec le
// selecteur est ensuite memorise dans ce navigateur (stockage technique local).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import fr from './fr.js';
import de from './de.js';
import en from './en.js';

export const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français', locale: 'fr-CH', og: 'fr_CH' },
  { code: 'de', label: 'DE', name: 'Deutsch', locale: 'de-CH', og: 'de_CH' },
  { code: 'en', label: 'EN', name: 'English', locale: 'en-CH', og: 'en_GB' },
];
export const LANG_KEY = 'vitiaero_lang';

// Complete une langue avec le francais : une traduction manquante affiche le
// texte francais au lieu de casser la page. Les listes sont remplacees en bloc.
function withFallback(base, over) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = base[k];
    const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
    out[k] = isObj(b) && isObj(v) ? withFallback(b, v) : v;
  }
  return out;
}
const DICTS = { fr, de: withFallback(fr, de), en: withFallback(fr, en) };

function detect() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (DICTS[saved]) return saved;
  } catch { /* stockage indisponible */ }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  for (const p of prefs) {
    const code = String(p).slice(0, 2).toLowerCase();
    if (DICTS[code]) return code;
  }
  return 'fr';
}

// Langue courante, lisible hors de React (client API, messages d'erreur).
let current = detect();

export function translateServerError(message) {
  if (!message) return DICTS[current].common.genericError;
  return DICTS[current].serverErrors[message] || message;
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(current);

  const setLang = useCallback((code) => {
    if (!DICTS[code]) return;
    current = code;
    try { localStorage.setItem(LANG_KEY, code); } catch { /* ignore */ }
    setLangState(code);
  }, []);

  const info = LANGS.find((l) => l.code === lang);

  // Langue du document : lecteurs d'ecran, traduction automatique, partage.
  useEffect(() => {
    document.documentElement.lang = info.locale;
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', info.og);
  }, [info]);

  const value = useMemo(
    () => ({ lang, setLang, t: DICTS[lang], locale: info.locale }),
    [lang, setLang, info]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n doit etre utilise dans LangProvider');
  return ctx;
}
