import { useEffect, useRef } from 'react';

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
export default function BgVideo({ variants, poster, className, loop = true }) {
  const ref = useRef(null);
  const index = useRef(-1);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia(NO_VIDEO).matches) return;
    let cancelled = false;
    let requested = false;
    let ready = false;
    let visible = false;

    const play = () => { video.muted = true; video.play?.().catch(() => {}); };

    // Si une version est absente ou illisible, on passe a la suivante, plus
    // legere. Apres la derniere, on masque la video : l'image dessous reste.
    const onError = () => {
      if (index.current < 0) return;
      index.current += 1;
      if (index.current >= variants.length) { video.style.display = 'none'; return; }
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
    };
  }, [variants]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop={loop}
      playsInline
      preload="none"
      poster={poster}
    />
  );
}
