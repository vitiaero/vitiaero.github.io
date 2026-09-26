import { useEffect, useState } from 'react';

// Heure de Suisse (Europe/Zurich), mise a jour chaque seconde. Decorative :
// masquee aux lecteurs d'ecran, qui l'annonceraient sans fin.
const format = () => new Date().toLocaleTimeString('fr-CH', {
  timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

export default function SwissClock({ label }) {
  const [now, setNow] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setNow(format()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="clock" title={label} aria-hidden="true">{now}</span>;
}
