import { company } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// En-tete visible uniquement a l'impression (et donc dans le PDF enregistre
// depuis le navigateur). Les coordonnees viennent de `company` : tant qu'une
// valeur est entre crochets, elle s'affiche telle quelle.
export default function PrintHeader({ number, title }) {
  const { t, locale } = useI18n();
  const p = t.printDoc;
  const date = new Date().toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="print-only print-head">
      <div>
        <div className="print-brand">VitiAero</div>
        <div className="print-company">
          {company.name}<br />
          {company.address}, {company.npa} {company.city}<br />
          {company.email}
        </div>
      </div>
      <div className="print-meta">
        <div className="print-title">{title || p.title}</div>
        <div>{p.date} : {date}</div>
        {number ? <div>{p.number} : #{number}</div> : null}
      </div>
    </div>
  );
}
