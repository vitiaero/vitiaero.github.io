// Langue du site : francais (reference), allemand et anglais.
// Le site s'affiche en francais tant que le visiteur n'a pas choisi une autre
// langue : les robots des moteurs de recherche voient donc toujours la langue
// principale, les adresses etant communes aux trois langues. Si le navigateur
// est regle en allemand ou en anglais, une proposition discrete permet de
// changer (composant LangSuggest). Le choix est garde dans le stockage local.
// Seul le francais fait partie du chargement initial ; l'allemand et l'anglais
// sont telecharges a la demande (voir loadLang et src/main.jsx).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import fr from './fr.js';
import { business } from '../../shared/business.js';
import { STORAGE_KEYS, readStorage, writeStorage } from '../../shared/storage.js';

export const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français', locale: 'fr-CH', og: 'fr_CH' },
  { code: 'de', label: 'DE', name: 'Deutsch', locale: 'de-CH', og: 'de_CH' },
  { code: 'en', label: 'EN', name: 'English', locale: 'en-GB', og: 'en_GB' },
];

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
const LOADERS = {
  de: () => import('./de.js'),
  en: () => import('./en.js'),
};
const SUPPORTED = LANGS.map((l) => l.code);

// Dictionnaires deja charges.
export const DICTS = { fr };

// Charge une langue (une seule fois) ; en cas d'echec reseau, le site reste en
// francais.
export async function loadLang(code) {
  if (DICTS[code]) return DICTS[code];
  if (!LOADERS[code]) return null;
  const mod = await LOADERS[code]();
  DICTS[code] = withFallback(fr, mod.default);
  return DICTS[code];
}

function savedLang() {
  const saved = readStorage(STORAGE_KEYS.lang);
  return SUPPORTED.includes(saved) ? saved : null;
}

// Langue que le navigateur prefere, si elle est proposee et differente du francais.
export function browserLang() {
  if (typeof navigator === 'undefined') return null;
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  for (const p of prefs) {
    const code = String(p).slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(code)) return code === 'fr' ? null : code;
  }
  return null;
}

// Langue courante, lisible hors de React (client API, messages d'erreur).
// Elle ne change qu'une fois son dictionnaire charge.
let current = 'fr';
export const currentLang = () => current;

// Au demarrage : charge la langue choisie lors d'une visite precedente.
export async function initLang() {
  const saved = savedLang();
  if (!saved || saved === 'fr') return;
  try {
    await loadLang(saved);
    current = saved;
  } catch {
    current = 'fr';
  }
}

export function translateServerError(message) {
  if (!message) return DICTS[current].common.genericError;
  return DICTS[current].serverErrors[message] || message;
}

// Message affiche quand le site est publie sans serveur.
export function staticNotice() {
  return DICTS[current].common.staticNotice(business.identity.email, business.commercial.responseTimeHours);
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(current);

  const setLang = useCallback(async (code) => {
    if (!SUPPORTED.includes(code)) return;
    try {
      await loadLang(code);
    } catch {
      return; // hors ligne : la langue actuelle reste affichee
    }
    current = code;
    writeStorage(STORAGE_KEYS.lang, code);
    setLangState(code);
  }, []);

  const info = LANGS.find((l) => l.code === lang);

  // Langue du document : lecteurs d'ecran, traduction automatique, partage.
  useEffect(() => {
    document.documentElement.lang = info.locale;
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', info.og);
  }, [info]);

  const value = useMemo(
    () => ({ lang, setLang, t: DICTS[lang], locale: info.locale, chosen: !!savedLang() }),
    [lang, setLang, info]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n doit etre utilise dans LangProvider');
  return ctx;
}
