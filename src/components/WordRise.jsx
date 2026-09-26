// Titre dont les mots montent un a un a l'affichage (animation CSS .wr).
// Le texte reste un texte normal : les lecteurs d'ecran le lisent d'un bloc,
// et sans CSS ou en mouvement reduit il s'affiche tout de suite.
export default function WordRise({ text, delay = 0 }) {
  const words = String(text).split(' ');
  return words.map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="wr" style={{ '--i': i, '--wr-delay': `${delay}ms` }}>
        <span className="wr-in">{w}</span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </span>
  ));
}
