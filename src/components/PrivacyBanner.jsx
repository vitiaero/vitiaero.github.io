import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';

// Bandeau d'information sur la vie privee. Le site n'utilise pas de traceur :
// on informe simplement et on garde le choix de l'utilisateur (nLPD : transparence).
const KEY = 'vitiaero_privacy_ack';

export default function PrivacyBanner() {
  const [ack, setAck] = useState(true); // masque par defaut le temps de lire le stockage
  const { t } = useI18n();

  useEffect(() => {
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch { /* stockage indisponible */ }
    setAck(stored === '1');
  }, []);

  function accept() {
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    setAck(true);
  }

  if (ack) return null;

  return (
    <div className="privacy-banner" role="region" aria-label={t.privacyBanner.aria}>
      <p>
        {t.privacyBanner.text}{' '}
        <Link to="/confidentialite">{t.privacyBanner.more}</Link>.
      </p>
      <button className="btn btn-primary btn-sm" onClick={accept}>{t.privacyBanner.ok}</button>
    </div>
  );
}
