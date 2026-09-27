import { Link } from 'react-router-dom';
import { business, LAUNCH } from '../launch.js';
import { useI18n } from '../i18n/index.jsx';
import { providerName } from '../../shared/legal/facts.js';
import { isText } from '../../shared/launch.js';

const telHref = (v) => `tel:${String(v).replace(/[^\d+]/g, '')}`;

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const id = business.identity;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="brand footer-brand">Viti<span>Aero</span></p>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>
          <nav aria-label={t.footer.navigation}>
            <h2 className="footer-title">{t.footer.navigation}</h2>
            <ul>
              <li><Link to="/">{t.nav.home}</Link></li>
              <li><Link to="/le-service">{t.nav.service}</Link></li>
              <li><Link to="/estimation">{t.nav.estimation}</Link></li>
              <li><Link to="/devis">{t.quote.button}</Link></li>
              <li><Link to="/equipement">{t.nav.equipment}</Link></li>
              <li><Link to="/a-propos">{t.nav.about}</Link></li>
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="footer-title">{t.footer.yourAccount}</h2>
            <ul>
              <li><Link to="/connexion">{t.nav.login}</Link></li>
              {LAUNCH.ready && <li><Link to="/inscription">{t.common.createAccount}</Link></li>}
              <li><Link to="/espace-client">{t.nav.account}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-title">{t.footer.contact}</h2>
            <ul>
              <li>{t.footer.region}</li>
              {isText(id.email) && <li><a href={`mailto:${id.email}`}>{id.email}</a></li>}
              {/* Affiche seulement une fois renseigne : aucun numero invente. */}
              {isText(id.phone) && <li><a href={telHref(id.phone)}>{id.phone}</a></li>}
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {year} {providerName(business)}</span>
          <nav className="footer-legal" aria-label={t.footer.legalAria}>
            <Link to="/mentions-legales">{t.footer.legal}</Link>
            <Link to="/confidentialite">{t.footer.privacy}</Link>
            <Link to="/cookies">{t.footer.cookies}</Link>
            <Link to="/conditions-generales">{t.footer.terms}</Link>
            <Link to="/conditions">{t.footer.termsOfUse}</Link>
            <Link to="/credits">{t.footer.credits}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
