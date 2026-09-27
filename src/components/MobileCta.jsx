import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/Icons.jsx';
import { business } from '../launch.js';
import { isText } from '../../shared/launch.js';
import { useI18n } from '../i18n/index.jsx';

// Barre fixe en bas de l'ecran, sur telephone uniquement (CSS). Elle disparait
// sur les pages qui portent deja l'action ; le bouton d'appel n'apparait que si
// un numero est renseigne dans shared/business.js.
const HIDDEN_ON = ['/devis', '/estimation', '/contact', '/confirmation', '/admin', '/espace-client'];

export default function MobileCta() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const phone = business.identity.phone;
  const hasPhone = isText(phone);
  return (
    <div className={`mobile-cta${hasPhone ? '' : ' single'}`}>
      <Link to="/devis" className="btn btn-primary">{t.quote.button}</Link>
      {hasPhone && (
        <a href={`tel:${String(phone).replace(/[^\d+]/g, '')}`} className="btn btn-outline">
          <Icon name="phone" size={18} aria-hidden="true" />
          {t.common.call}
        </a>
      )}
    </div>
  );
}
