import { preLaunch } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Bandeau discret en haut du site : l'activite n'a pas encore demarre.
// Il disparait des que `preLaunch` passe a false dans src/content.js.
export default function LaunchNotice() {
  const { t } = useI18n();
  if (!preLaunch) return null;
  return (
    <div className="launch-notice" role="note" aria-label={t.launchNotice.aria}>
      <div className="container">
        <span className="launch-dot" aria-hidden="true" />
        {t.launchNotice.text}
      </div>
    </div>
  );
}
