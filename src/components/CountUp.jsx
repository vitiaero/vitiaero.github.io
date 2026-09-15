import { useEffect, useRef, useState } from 'react';

// Compteur anime au defilement (ex. "30 L", "100%", "48 h").
// La valeur finale est affichee par defaut : si le JS echoue OU si la page
// n'est pas visible, le bon chiffre reste affiche. L'animation (0 -> valeur)
// ne se declenche que lorsque l'element est reellement visible a l'ecran.
export default function CountUp({ value, duration = 1300 }) {
  const ref = useRef(null);
  const m = String(value).match(/^(\D*)(\d+)(.*)$/);
  const [display, setDisplay] = useState(value); // valeur finale par defaut

  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return;

    const prefix = m[1];
    const target = parseInt(m[2], 10);
    const suffix = m[3];
    let started = false;
    let inView = false;
    let io;

    const animate = () => {
      started = true;
      const start = performance.now();
      setDisplay(prefix + '0' + suffix);
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(prefix + Math.round(target * eased) + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const maybeStart = () => {
      if (started || document.hidden || !inView) return; // n'anime que si visible
      animate();
      io && io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
    const onVis = () => maybeStart();

    io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { inView = true; maybeStart(); } }),
      { threshold: 0.4 }
    );
    io.observe(el);
    document.addEventListener('visibilitychange', onVis);

    return () => { io && io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span ref={ref}>{display}</span>;
}
