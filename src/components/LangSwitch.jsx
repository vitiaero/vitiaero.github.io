import { useEffect, useRef, useState } from 'react';
import { LANGS, useI18n } from '../i18n/index.jsx';

const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </svg>
);
const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

// Selecteur de langue.
// - variant "menu" (en-tete) : bouton compact globe + code, qui ouvre une liste.
// - variant "inline" (menu mobile) : trois grands boutons, faciles a toucher.
// Chaque langue est ecrite dans sa propre langue, avec l'attribut lang.
export default function LangSwitch({ variant = 'menu', onChange }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGS.find((l) => l.code === lang);

  const choose = (code) => {
    setLang(code);
    setOpen(false);
    onChange?.();
  };

  // Fermeture au clic exterieur et avec la touche Echap.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        rootRef.current?.querySelector('.lang-trigger')?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (variant === 'inline') {
    return (
      <div className="lang-inline" role="group" aria-label={t.lang.label}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            aria-pressed={lang === l.code}
            onClick={() => choose(l.code)}
          >
            {l.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`lang-menu-root${open ? ' open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t.lang.label} : ${current.name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe />
        <span className="code">{current.label}</span>
        <svg className="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {/* Masque par CSS (visibility) quand ferme : hors de la tabulation. */}
      <div className="lang-menu" role="group" aria-label={t.lang.label}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            className="lang-option"
            aria-pressed={lang === l.code}
            onClick={() => choose(l.code)}
          >
            <span className="name">{l.name}</span>
            <span className="meta">{lang === l.code ? <Check /> : l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
