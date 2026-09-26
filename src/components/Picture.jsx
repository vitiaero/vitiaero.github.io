// Image responsive : AVIF, sinon WebP, sinon JPEG ou PNG. Les dimensions
// intrinseques reservent la place avant le chargement (pas de saut de mise en
// page). Les images sont definies dans src/content.js (objet `images`).
export default function Picture({ img, alt, sizes = '100vw', eager = false, className, style }) {
  return (
    <picture>
      {img.avif && <source type="image/avif" srcSet={img.avif} sizes={sizes} />}
      {img.webp && <source type="image/webp" srcSet={img.webp} sizes={sizes} />}
      <img
        src={img.src}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding="async"
        className={className}
        style={style}
      />
    </picture>
  );
}
