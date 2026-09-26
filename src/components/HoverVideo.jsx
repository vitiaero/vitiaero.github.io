import { useEffect, useRef, useState } from 'react';
import Icon from './Icons.jsx';
import { useI18n } from '../i18n/index.jsx';

// Video courte qui se lance au survol de sa carte (ou au focus clavier), et
// s'arrete quand on la quitte. Rien n'est telecharge avant la premiere
// interaction. Le bouton permet aussi de la lancer au doigt ou au clavier.
// La carte parente porte l'attribut data-hover-host.
function pickSrc(variants) {
  const probe = document.createElement('video');
  const ok = variants.find((v) => probe.canPlayType(v.type) !== '');
  return (ok || variants[variants.length - 1]).src;
}

export default function HoverVideo({ variants, poster, alt, className = '' }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const v = ref.current;
    if (!v) return;
    if (!v.getAttribute('src')) v.src = pickSrc(variants);
    v.muted = true;
    v.play?.().then(() => setPlaying(true)).catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause?.();
    setPlaying(false);
  };

  useEffect(() => {
    const v = ref.current;
    const host = v?.closest('[data-hover-host]');
    if (!host) return undefined;
    // Survol : seulement avec une souris, et si le mouvement n'est pas reduit.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover) return undefined;
    host.addEventListener('mouseenter', start);
    host.addEventListener('mouseleave', stop);
    return () => {
      host.removeEventListener('mouseenter', start);
      host.removeEventListener('mouseleave', stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`hv${playing ? ' is-playing' : ''} ${className}`}>
      <img src={poster} alt={alt} loading="lazy" />
      <video ref={ref} muted loop playsInline preload="none" aria-hidden="true" />
      <button
        type="button"
        className="hv-btn"
        onClick={() => (playing ? stop() : start())}
        aria-label={playing ? t.common.pauseVideo : t.common.playVideo}
      >
        <Icon name={playing ? 'pause' : 'play'} size={12} stroke={2.4} />
      </button>
    </div>
  );
}
