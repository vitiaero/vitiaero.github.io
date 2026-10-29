import { useI18n } from '../i18n/index.jsx';

// Slogan de la marque (charte graphique du module 4). La partie « accent »
// prend la couleur d'accentuation : vert anis sur fond sombre, vert sur fond clair.
export default function Slogan({ className = '' }) {
  const { t } = useI18n();
  const text = t.common.slogan;
  const accent = t.common.sloganAccent;
  const i = accent ? text.lastIndexOf(accent) : -1;
  return (
    <p className={`slogan ${className}`.trim()}>
      {i < 0 ? text : (
        <>
          {text.slice(0, i)}
          <span className="slogan-accent">{accent}</span>
          {text.slice(i + accent.length)}
        </>
      )}
    </p>
  );
}
