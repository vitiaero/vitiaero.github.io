import { useEffect, useRef, useState } from 'react';
import Icon from './Icons.jsx';
import { useI18n } from '../i18n/index.jsx';

// Video d'ambiance (muette, en boucle) qui choisit la meilleure version lisible
// par l'appareil, dans l'ordre de la liste : 4K AV1, puis 4K H.264, puis 1080p.
// La 4K n'est proposee que si l'ecran en tire parti et si l'appareil la decode
// de facon materielle (sinon la lecture saccaderait). Sur mobile et en
// mouvement reduit, rien n'est telecharge : l'image placee dessous reste.
//
// toggle : bouton pause / lecture (une video qui bouge plus de cinq secondes
//   doit pouvoir etre arretee, WCAG 2.2.2). Sur mobile ou en mouvement reduit,
//   ce bouton permet quand meme de lancer la video, chargee seulement au clic.
//   Si l'appareil refuse la lecture automatique (economie d'energie, reglage
//   du navigateur), le bouton repasse sur « lecture » pour la lancer a la main.
// onDemand : meme lecture au clic, pour une video sans bouton pause.
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
export default function BgVideo({ variants, poster, className, loop = true, toggle = false, onDemand = false }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const index = useRef(-1);
  // 'off' : aucune video ; 'auto' : lecture a l'ecran ; 'demand' : au clic.
  const [mode, setMode] = useState('off');
  const [paused, setPaused] = useState(false);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const onEnded = () => { if (!loop) setPaused(true); };
    video.addEventListener('ended', onEnded);

    if (window.matchMedia(NO_VIDEO).matches) {
      if (onDemand || toggle) {
        pausedByUser.current = true;
        setPaused(true);
        setMode('demand');
      }
      return () => video.removeEventListener('ended', onEnded);
    }
    setMode('auto');
    let cancelled = false;
    let requested = false;
    let ready = false;
    let visible = false;

    const play = () => {
      if (pausedByUser.current) return;
      video.muted = true;
      video.play?.().then(() => setPaused(false)).catch((err) => {
        // Lecture automatique refusee : le bouton propose de la lancer.
        if (err?.name === 'NotAllowedError') setPaused(true);
      });
    };

    // Si une version est absente ou illisible, on passe a la suivante, plus
    // legere. Apres la derniere, on masque la video : l'image dessous reste.
    const onError = () => {
      if (index.current < 0) return;
      index.current += 1;
      if (index.current >= variants.length) { video.style.display = 'none'; setMode('off'); return; }
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
        if (visible) play();
      });
    }, { rootMargin: '200px 0px' });
    io.observe(video);

    return () => {
      cancelled = true;
      io.disconnect();
      video.removeEventListener('error', onError);
      video.removeEventListener('ended', onEnded);
    };
  }, [variants, loop, onDemand, toggle]);

  const onToggle = () => {
    const video = ref.current;
    if (!video) return;
    if (paused) {
      pausedByUser.current = false;
      // Lecture a la demande : la version la plus legere, chargee maintenant.
      if (!video.getAttribute('src')) {
        index.current = variants.length - 1;
        video.src = variants[index.current].src;
      }
      video.muted = true;
      video.play?.().catch(() => {});
      setPaused(false);
    } else {
      pausedByUser.current = true;
      video.pause?.();
      setPaused(true);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={`${className || ''}${mode === 'demand' && paused ? ' is-idle' : ''}`}
        muted
        loop={loop}
        playsInline
        preload="none"
        poster={poster}
        aria-hidden="true"
      />
      {toggle && mode !== 'off' && (
        <button
          type="button"
          className={`video-toggle${paused ? ' is-paused' : ''}`}
          onClick={onToggle}
          aria-label={paused ? t.common.playVideo : t.common.pauseVideo}
        >
          <Icon name={paused ? 'play' : 'pause'} size={14} stroke={2.4} />
        </button>
      )}
    </>
  );
}
