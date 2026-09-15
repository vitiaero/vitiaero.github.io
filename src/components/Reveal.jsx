import { useEffect, useRef } from 'react';

// Animation d'apparition au defilement, SUBTILE et non bloquante.
// Le contenu est visible par defaut ; on ne l'"arme" (masque puis anime)
// que si le JS fonctionne ET que l'observateur est disponible.
// En cas de doute, le contenu reste visible : jamais de texte invisible.
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return; // reste visible

    el.style.transitionDelay = `${delay}ms`;
    el.classList.add('reveal-armed');

    // Filet de securite : rend visible apres 1,6 s quoi qu'il arrive
    const safety = setTimeout(() => el.classList.add('reveal-in'), 1600);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            clearTimeout(safety);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);

    return () => { clearTimeout(safety); observer.disconnect(); };
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
