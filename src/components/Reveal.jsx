import { useEffect, useRef } from 'react';

// Animation d'apparition au defilement, SUBTILE et non bloquante.
// Le contenu est visible par defaut ; on ne l'"arme" (masque puis anime)
// que si le JS fonctionne ET que l'observateur est disponible.
// En cas de doute, le contenu reste visible : jamais de texte invisible.
// Les variantes (fondu, zoom, rideau...) sont des classes CSS : voir
// src/styles/base.css, section "Apparitions".
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return undefined; // reste visible

    el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.classList.add('reveal-armed');

    // Filet de securite : si l'observateur ne repond jamais (navigateur
    // defaillant), le contenu s'affiche quand meme apres 1,6 s. Des qu'il a
    // repondu une fois, l'apparition suit le defilement.
    let answered = false;
    const safety = setTimeout(() => { if (!answered) el.classList.add('reveal-in'); }, 1600);

    const observer = new IntersectionObserver(
      (entries) => {
        answered = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
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
