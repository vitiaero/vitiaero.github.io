import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';
import { STORAGE_KEYS, readStorage, writeStorage } from '../../shared/storage.js';

// Bandeau d'information sur la vie privee. Le site n'utilise aucun traceur :
// on informe (art. 45c LTC) et on garde la trace de la lecture du bandeau.
export default function PrivacyBanner() {
  const [ack, setAck] = useState(true); // masque le temps de lire le stockage
  const { t } = useI18n();

  useEffect(() => {
    setAck(readStorage(STORAGE_KEYS.privacyAck) === '1');
  }, []);

  function accept() {
    writeStorage(STORAGE_KEYS.privacyAck, '1');
    setAck(true);
  }

  if (ack) return null;

  return (
    <div className="privacy-banner" role="region" aria-label={t.privacyBanner.aria}>
      <p>
        {t.privacyBanner.text}{' '}
        <Link to="/cookies">{t.privacyBanner.more}</Link>.
      </p>
      <button type="button" className="btn btn-primary btn-sm" onClick={accept}>{t.privacyBanner.ok}</button>
    </div>
  );
}
