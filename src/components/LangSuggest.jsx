import { useEffect, useState } from 'react';
import { DICTS, LANGS, browserLang, loadLang, useI18n } from '../i18n/index.jsx';
import { STORAGE_KEYS, readStorage, writeStorage } from '../../shared/storage.js';

// Proposition de langue, ecrite dans la langue proposee : visible seulement si
// le navigateur prefere l'allemand ou l'anglais et que le visiteur n'a encore
// rien choisi ni ferme la proposition.
export default function LangSuggest() {
  const { lang, setLang, chosen } = useI18n();
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const preferred = browserLang();
    if (chosen || readStorage(STORAGE_KEYS.langHint) === '1' || !preferred || preferred === lang) {
      setTarget(null); // langue choisie entre-temps (selecteur de l'en-tete)
      return undefined;
    }
    // La proposition est ecrite dans la langue proposee : son dictionnaire est
    // charge d'abord (en cas d'echec, rien n'est affiche).
    let active = true;
    loadLang(preferred).then(() => { if (active) setTarget(preferred); }, () => {});
    return () => { active = false; };
  }, [chosen, lang]);

  if (!target) return null;
  const s = DICTS[target].langSuggest;
  const info = LANGS.find((l) => l.code === target);

  const dismiss = () => {
    writeStorage(STORAGE_KEYS.langHint, '1');
    setTarget(null);
  };

  return (
    <div className="lang-suggest" role="region" aria-label={s.aria} lang={info.locale}>
      <div className="container lang-suggest-inner">
        <p>{s.text}</p>
        <div className="lang-suggest-actions">
          <button type="button" className="btn btn-light btn-sm" onClick={() => { setLang(target); setTarget(null); }}>
            {s.switch}
          </button>
          <button type="button" className="btn btn-ghost btn-sm lang-suggest-close" onClick={dismiss}>{s.dismiss}</button>
        </div>
      </div>
    </div>
  );
}
