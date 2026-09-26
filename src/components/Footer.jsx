import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { asset } from '../config.js';
import { company } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Grand mot "VitiAero" en bas de page : chaque lettre monte a son tour quand
// le pied de page arrive a l'ecran (decoratif, masque aux lecteurs d'ecran).
function Wordmark() {
  const letters = [...'Viti'].map((c) => ({ c, viti: true })).concat([...'Aero'].map((c) => ({ c, viti: false })));
  return (
    <Reveal className="footer-mark" aria-hidden="true">
      {letters.map((l, i) => (
        <span key={i} className={`fm-l${l.viti ? ' viti' : ''}`} style={{ '--i': i }}>{l.c}</span>
      ))}
    </Reveal>
  );
}

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const hasPhone = !!company.phone && !String(company.phone).trim().startsWith('[');
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={asset('/images/logo-vitiaero.png')} alt="VitiAero" width="120" height="40" loading="lazy" />
            <p>{t.footer.tagline}</p>
          </div>
          <div>
            <h2 className="footer-h">{t.footer.navigation}</h2>
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
            <h2 className="footer-h">{t.footer.yourAccount}</h2>
            <ul>
              <li><Link to="/connexion">{t.nav.login}</Link></li>
              <li><Link to="/inscription">{t.common.createAccount}</Link></li>
              <li><Link to="/espace-client">{t.nav.account}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">{t.footer.contact}</h2>
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

        <Wordmark />

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
