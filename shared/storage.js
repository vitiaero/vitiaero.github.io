// Stockage local du navigateur : liste unique des cles utilisees par le site.
// La page cookies (shared/legal/cookies.js) et le bouton d'effacement en sont
// tires ; un test verifie qu'aucune autre cle n'est utilisee dans le code.
export const STORAGE_KEYS = {
  token: 'vitiaero_token',
  privacyAck: 'vitiaero_privacy_ack',
  lang: 'vitiaero_lang',
  langHint: 'vitiaero_lang_hint',
  mapTip: 'vitiaero_map_tip',
};

export const STORAGE = [
  {
    key: STORAGE_KEYS.token,
    purpose: { fr: 'Vous garder connecté à votre espace client', de: 'Sie in Ihrem Kundenbereich angemeldet halten', en: 'Keep you logged in to your customer area' },
    duration: { fr: 'Jusqu\'à la déconnexion, 7 jours au plus', de: 'Bis zur Abmeldung, höchstens 7 Tage', en: 'Until you log out, 7 days at most' },
  },
  {
    key: STORAGE_KEYS.privacyAck,
    purpose: { fr: 'Mémoriser que vous avez lu le bandeau d\'information', de: 'Speichern, dass Sie das Hinweisband gelesen haben', en: 'Remember that you have read the information banner' },
    duration: { fr: 'Jusqu\'à effacement', de: 'Bis zur Löschung', en: 'Until deleted' },
  },
  {
    key: STORAGE_KEYS.lang,
    purpose: { fr: 'Mémoriser la langue choisie pour le site', de: 'Die gewählte Sprache der Website speichern', en: 'Remember the language chosen for the website' },
    duration: { fr: 'Jusqu\'à effacement', de: 'Bis zur Löschung', en: 'Until deleted' },
  },
  {
    key: STORAGE_KEYS.langHint,
    purpose: { fr: 'Ne plus proposer une autre langue une fois la proposition fermée', de: 'Keinen Sprachwechsel mehr vorschlagen, nachdem der Hinweis geschlossen wurde', en: 'Stop suggesting another language once the suggestion is closed' },
    duration: { fr: 'Jusqu\'à effacement', de: 'Bis zur Löschung', en: 'Until deleted' },
  },
  {
    key: STORAGE_KEYS.mapTip,
    purpose: { fr: 'Ne plus afficher l\'aide de la carte une fois vue', de: 'Die Kartenhilfe nach dem ersten Mal nicht mehr anzeigen', en: 'Stop showing the map help once seen' },
    duration: { fr: 'Jusqu\'à effacement', de: 'Bis zur Löschung', en: 'Until deleted' },
  },
];

export function readStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function writeStorage(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* stockage indisponible ou refuse : le site fonctionne sans */ }
}

export function clearSiteStorage() {
  for (const { key } of STORAGE) writeStorage(key, null);
}
