import { useEffect } from 'react';

// Decalage vertical lie au defilement (parallaxe). L'element recoit la variable
// CSS --py (en px), que la feuille de style combine a sa propre transformation.
// speed : fraction de l'ecart entre le centre du bloc et le centre de l'ecran.
// Rien ne bouge en mouvement reduit, ni tant que le bloc est hors de l'ecran.
export function useParallax(ref, speed = 0.12) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const host = el.parentElement || el;
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      // Ecart borne a la zone ou le bloc est visible : hors de l'ecran, il
      // garde la position de son entree ou de sa sortie.
      const limit = (window.innerHeight + r.height) / 2;
      const offset = Math.max(-limit, Math.min(limit, r.top + r.height / 2 - window.innerHeight / 2));
      el.style.setProperty('--py', `${(-offset * speed).toFixed(1)}px`);
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    }, { rootMargin: '120px 0px' });
    io.observe(host);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, speed]);
}
