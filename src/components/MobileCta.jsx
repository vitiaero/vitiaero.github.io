import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/Icons.jsx';
import { company } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Barre fixe en bas de l'ecran, sur telephone uniquement (CSS).
// Elle disparait sur les pages qui portent deja l'action, et le bouton
// d'appel n'apparait que si un numero a ete renseigne dans src/content.js.
const HIDDEN_ON = ['/devis', '/estimation', '/contact', '/confirmation', '/admin', '/espace-client'];
const filled = (v) => !!v && !String(v).trim().startsWith('[');

export default function MobileCta() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const phone = filled(company.phone);
  return (
    <div className={`mobile-cta${phone ? '' : ' single'}`}>
      <Link to="/devis" className="btn btn-primary">{t.quote.button}</Link>
      {phone && (
        <a href={`tel:${String(company.phone).replace(/[^\d+]/g, '')}`} className="btn btn-outline">
          <Icon name="phone" size={18} />
          {t.common.call}
        </a>
      )}
    </div>
  );
}
