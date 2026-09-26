import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';

// Video d'ambiance (muette, en boucle) qui choisit la meilleure version lisible
// par l'appareil, dans l'ordre de la liste : 4K AV1, puis 4K H.264, puis 1080p.
// La 4K n'est proposee que si l'ecran en tire parti et si l'appareil la decode
// de facon materielle (sinon la lecture saccaderait). Sur mobile et en
// mouvement reduit, rien n'est telecharge : l'image placee dessous reste.
const NO_VIDEO = '(max-width: 720px), (prefers-reduced-motion: reduce)';

async function playsWell(v, needHardware) {
  const mc = navigator.mediaCapabilities;
  if (!mc?.decodingInfo) {
    return !needHardware && document.createElement('video').canPlayType(v.type) !== '';
  }
  try {
    const info = await mc.decodingInfo({
      type: 'file',
      video: { contentType: v.type, width: v.width, height: v.height, bitrate: v.bitrate, framerate: v.framerate },
    });
    return info.supported && info.smooth && (!needHardware || info.powerEfficient);
  } catch {
    return false;
  }
}

// Renvoie l'index de la premiere version adaptee (la derniere par defaut).
async function pickIndex(variants) {
  const screenPx = window.innerWidth * (window.devicePixelRatio || 1);
  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const is4k = v.width > 1920;
    if (is4k && screenPx <= 2100) continue;
    if (await playsWell(v, is4k)) return i;
  }
  return variants.length - 1;
}

// loop = false : la video se joue une fois et s'arrete sur sa derniere image
// (elle repart du debut quand elle revient a l'ecran).
//
// Un bouton permet de mettre la video en pause (WCAG 2.2.2). Il n'apparait que
// lorsque la video est chargee, donc jamais sur mobile ni en mouvement reduit.
export default function BgVideo({ variants, poster, className, loop = true }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const index = useRef(-1);
  const stopped = useRef(false); // true : mise en pause par le visiteur
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia(NO_VIDEO).matches) return;
    let cancelled = false;
    let requested = false;
    let ready = false;
    let visible = false;

    const play = () => {
      if (stopped.current) return;
      video.muted = true;
      video.play?.().catch(() => {});
    };
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    // Si une version est absente ou illisible, on passe a la suivante, plus
    // legere. Apres la derniere, on masque la video : l'image dessous reste.
    const onError = () => {
      if (index.current < 0) return;
      index.current += 1;
      if (index.current >= variants.length) { video.style.display = 'none'; setActive(false); return; }
      video.src = variants[index.current].src;
      if (visible) play();
    };
    video.addEventListener('error', onError);

    // Charge la video un peu avant qu'elle n'entre a l'ecran, et ne la joue
    // que lorsqu'elle est visible (economie de donnees et de batterie).
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { video.pause?.(); return; }
      if (ready) { play(); return; }
      if (requested) return;
      requested = true;
      pickIndex(variants).then((i) => {
        if (cancelled) return;
        index.current = i;
        video.src = variants[i].src;
        ready = true;
        setActive(true);
        if (visible) play();
      });
    }, { rootMargin: '200px 0px' });
    io.observe(video);

    return () => {
      cancelled = true;
      io.disconnect();
      video.removeEventListener('error', onError);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [variants]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      stopped.current = false;
      video.muted = true;
      video.play?.().catch(() => {});
    } else {
      stopped.current = true;
      video.pause();
    }
  };

  const label = paused ? t.common.playVideo : t.common.pauseVideo;
  return (
    <>
      <video
        ref={ref}
        className={className}
        muted
        loop={loop}
        playsInline
        preload="none"
        poster={active ? poster : undefined}
        aria-hidden="true"
      />
      {active && (
        <button type="button" className="video-toggle" onClick={toggle} aria-label={label} title={label}>
          {paused ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
          )}
        </button>
      )}
    </>
  );
}
