// Intitule au-dessus d'un titre : un point vert puis un texte court en
// capitales, le meme sur toutes les pages (voir .kicker dans base.css).
// tone : 'dark' (fond clair), 'lime' (fond sombre), 'light' (sur une photo).
export default function Kicker({ children, tone = 'dark', as: Tag = 'p' }) {
  return <Tag className={`kicker kicker-${tone}`}>{children}</Tag>;
}
