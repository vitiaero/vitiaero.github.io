import { useEffect, useRef } from 'react';

// Phrase qui "s'allume" au defilement : les mots passent du gris au noir a
// mesure que la phrase remonte dans l'ecran. Le texte est entierement lisible
// sans JavaScript et en mouvement reduit (tous les mots allumes).
export default function ScrollWords({ text, as: Tag = 'p', className = '' }) {
  const ref = useRef(null);
  const words = String(text).split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Debut : le haut de la phrase atteint 85 % de l'ecran.
      // Fin : son bas atteint 45 % de l'ecran.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const progress = (start - r.top) / (start - end + r.height);
      const lit = Math.max(0, Math.min(1, progress)) * (words.length + 1);
      el.style.setProperty('--lit', lit.toFixed(2));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    el.classList.add('sw-armed');
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [words.length]);

  return (
    <Tag ref={ref} className={`sw ${className}`}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="sw-w" style={{ '--i': i }}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
