import { Link } from 'react-router-dom';
import { FICTIONAL, LAUNCH, business } from '../launch.js';
import { useI18n } from '../i18n/index.jsx';

// Bandeau explicite en haut du site tant que le service n'est pas ouvert
// (porte de lancement, shared/launch.js). Il disparait de lui-meme quand toutes
// les informations obligatoires sont fournies.
export default function LaunchNotice() {
  const { t } = useI18n();
  // Entreprise fictive : le bandeau le dit sur chaque page, a la place du
  // pre-lancement.
  if (FICTIONAL) {
    return (
      <div className="launch-notice" role="note" aria-label={t.fictional.aria}>
        <div className="container">
          <span className="launch-dot" aria-hidden="true" />
          <span>
            <strong>{t.fictional.label}</strong> {t.fictional.text}{' '}
            <Link to="/a-propos">{t.fictional.more}</Link>
          </span>
        </div>
      </div>
    );
  }
  if (LAUNCH.ready) return null;
  return (
    <div className="launch-notice" role="note" aria-label={t.launchNotice.aria}>
      <div className="container">
        <span className="launch-dot" aria-hidden="true" />
        <span>
          <strong>{t.launchNotice.label}</strong> {t.launchNotice.text}{' '}
          <Link to="/contact">{t.launchNotice.contact(business.identity.email)}</Link>
        </span>
      </div>
    </div>
  );
}
