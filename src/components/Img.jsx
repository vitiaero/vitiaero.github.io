import { useState } from 'react';

// Image avec repli sobre : si le fichier est absent, on affiche un degrade
// vegetal discret plutot qu'une icone d'image cassee.
export default function Img({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={className}
        style={{
          background: 'linear-gradient(150deg, #3a4a2c, #1c2413)',
          display: 'grid',
          placeItems: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.85rem',
          ...style,
        }}
        aria-label={alt}
        role="img"
      >
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
