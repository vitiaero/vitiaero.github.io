import { Link } from 'react-router-dom';
import { company } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const hasPhone = !!company.phone && !String(company.phone).trim().startsWith('[');
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">Viti<span style={{ color: 'var(--accent-bright)' }}>Aero</span></div>
            <p style={{ color: '#a8a69d', maxWidth: '32ch' }}>{t.footer.tagline}</p>
          </div>
          <div>
            <h4>{t.footer.navigation}</h4>
            <ul>
              <li><Link to="/">{t.nav.home}</Link></li>
              <li><Link to="/le-service">{t.nav.service}</Link></li>
              <li><Link to="/estimation">{t.nav.estimation}</Link></li>
              <li><Link to="/devis">{t.quote.button}</Link></li>
              <li><Link to="/equipement">{t.nav.equipment}</Link></li>
              <li><Link to="/a-propos">{t.nav.about}</Link></li>
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.yourAccount}</h4>
            <ul>
              <li><Link to="/connexion">{t.nav.login}</Link></li>
              <li><Link to="/inscription">{t.common.createAccount}</Link></li>
              <li><Link to="/espace-client">{t.nav.account}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.contact}</h4>
            <ul>
              <li>{t.footer.region}</li>
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              {/* Affiche seulement une fois renseigne : aucun numero invente ici. */}
              {hasPhone && (
                <li><a href={`tel:${String(company.phone).replace(/[^\d+]/g, '')}`}>{company.phone}</a></li>
              )}
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {year} VitiAero - {t.footer.project}</span>
          <span className="footer-legal">
            <Link to="/confidentialite">{t.footer.privacy}</Link>
            <Link to="/cookies">{t.footer.cookies}</Link>
            <Link to="/mentions-legales">{t.footer.legal}</Link>
            <Link to="/conditions-generales">{t.footer.terms}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
