import Icon from './Icons.jsx';

// Pastille ronde avec une fleche, a droite du libelle des boutons principaux.
// La fleche glisse au survol (voir .btn-ic dans src/styles/base.css).
export default function BtnArrow({ size = 16 }) {
  return (
    <span className="btn-ic" aria-hidden="true">
      <Icon name="arrow" size={size} stroke={2} />
    </span>
  );
}
