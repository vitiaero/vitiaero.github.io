import { business } from '../launch.js';
import { providerName, addressLine } from '../../shared/legal/facts.js';
import { isText } from '../../shared/launch.js';
import { useI18n } from '../i18n/index.jsx';

// En-tete visible uniquement a l'impression (et donc dans le PDF enregistre
// depuis le navigateur). Seules les coordonnees reellement fournies
// (shared/business.js) sont imprimees.
export default function PrintHeader({ number, title }) {
  const { t, lang, locale } = useI18n();
  const p = t.printDoc;
  const date = new Date().toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const address = addressLine(business, lang);
  const email = business.identity.email;

  return (
    <div className="print-only print-head">
      <div>
        <div className="print-brand">VitiAero</div>
        <div className="print-company">
          {providerName(business)}
          {address && <><br />{address}</>}
          {isText(email) && <><br />{email}</>}
        </div>
      </div>
      <div className="print-meta">
        <div className="print-title">{title || p.title}</div>
        <div>{p.dateLine(date)}</div>
        {number ? <div>{p.numberLine(number)}</div> : null}
      </div>
    </div>
  );
}
