// Intitule de section numerote, comme "01 — Pourquoi le drone".
// tone : 'dark' (texte gris sur fond clair), 'lime' (fond sombre), 'light' (sur photo).
export default function Kicker({ no, children, tone = 'dark', as: Tag = 'p' }) {
  return (
    <Tag className={`kicker kicker-${tone}`}>
      {no && <span className="kicker-no">{no}</span>}
      {no && <span className="kicker-sep" aria-hidden="true" />}
      <span>{children}</span>
    </Tag>
  );
}
