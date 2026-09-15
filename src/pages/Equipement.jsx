import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import BgVideo from '../components/BgVideo.jsx';
import { equipVideos } from '../content.js';
import { asset } from '../config.js';
import { useI18n } from '../i18n/index.jsx';

// Page Equipement : le DJI Agras T50 en trois parties (le drone, pulverisation
// et preparation, GPS et cartographie), puis la fiche technique.
// Visuels : DJI, et le plan du drone qui se deplie fourni par le proprietaire.

// Scene : image fixe (mobile et avant la lecture), video par-dessus sur ordinateur.
function Stage({ name, alt, ratio, loop = true, eager = false, className = '' }) {
  const poster = asset(`/images/equip/${name}.jpg`);
  return (
    <div className={`eq-stage ${className}`} style={{ aspectRatio: ratio }}>
      <img src={poster} alt={alt} loading={eager ? 'eager' : 'lazy'} />
      {equipVideos[name] && (
        <BgVideo className="eq-video" variants={equipVideos[name]} poster={poster} loop={loop} />
      )}
    </div>
  );
}

// Sous-menu colle sous l'en-tete : la section visible est mise en evidence.
function SubNav({ items, label, title }) {
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="eq-subnav" aria-label={label}>
      <div className="container eq-subnav-inner">
        <span className="eq-subnav-title">{title}</span>
        <div className="eq-subnav-links">
          {items.map((i) => (
            <a key={i.id} href={`#${i.id}`} className={active === i.id ? 'active' : ''} aria-current={active === i.id ? 'true' : undefined}>
              {i.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Liste de chiffres : valeur en grand, libelle dessous.
function Figures({ items, className }) {
  return (
    <dl className={className}>
      {items.map((f) => (
        <div key={f.k}>
          <dt>{f.k}</dt>
          <dd>{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Equipement() {
  const { t } = useI18n();
  const e = t.equipment;

  return (
    <div className="page equip-page">
      {/* En-tete : le drone se deplie */}
      <section className="eq-hero">
        <div className="container">
          <div className="eq-hero-head">
            <span className="eyebrow">{e.eyebrow}</span>
            <h1 className="display">{e.title}</h1>
            <p className="lead">{e.lead}</p>
          </div>
          <Reveal>
            <Stage name="t50-deplie" alt={e.heroAlt} ratio="16 / 9" loop={false} eager className="eq-stage-hero" />
          </Reveal>
          <Figures items={e.figures} className="eq-figures" />
        </div>
      </section>

      <SubNav items={e.subnav} label={e.subnavLabel} title={e.title} />

      {/* Le drone */}
      <section id="drone" className="section">
        <div className="container">
          <div className="eq-split">
            <Reveal>
              <Stage name="t50-radar" alt={e.drone.alt} ratio="16 / 9" />
            </Reveal>
            <Reveal delay={100}>
              <span className="eyebrow">{e.drone.eyebrow}</span>
              <h2 className="h2">{e.drone.title}</h2>
              <p className="lead">{e.drone.text}</p>
            </Reveal>
          </div>
          <div className="eq-points">
            {e.drone.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="eq-point">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Systeme de pulverisation */}
      <section id="pulverisation" className="eq-dark">
        <div className="container">
          <Reveal className="eq-head">
            <span className="eyebrow">{e.spray.eyebrow}</span>
            <h2 className="h2">{e.spray.title}</h2>
            <p className="lead">{e.spray.text}</p>
          </Reveal>
          <Reveal>
            <Stage name="spray" alt={e.spray.alt} ratio="16 / 9" />
          </Reveal>
          <div className="eq-parts">
            {e.spray.parts.map((p, i) => (
              <Reveal key={p.key} delay={i * 80}>
                <figure className="eq-part">
                  <Stage name={p.key} alt={p.alt} ratio="1 / 1" />
                  <figcaption>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation entre deux vols */}
      <section className="section bg-soft">
        <div className="container">
          <div className="eq-split text-first">
            <Reveal>
              <span className="eyebrow">{e.prep.eyebrow}</span>
              <h2 className="h2">{e.prep.title}</h2>
              <p className="lead">{e.prep.text}</p>
              <Figures items={e.prep.figures} className="eq-stats" />
            </Reveal>
            <Reveal delay={100}>
              <Stage name="generateur" alt={e.prep.alt} ratio="3 / 2" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* GPS et cartographie */}
      <section id="cartographie" className="section">
        <div className="container">
          <div className="eq-split">
            <Reveal>
              <Stage name="parcelles" alt={e.map.alt} ratio="968 / 588" />
            </Reveal>
            <Reveal delay={100}>
              <span className="eyebrow">{e.map.eyebrow}</span>
              <h2 className="h2">{e.map.title}</h2>
              <p className="lead">{e.map.text}</p>
            </Reveal>
          </div>
          <div className="eq-cards">
            {e.map.cards.map((c, i) => (
              <Reveal key={c.key} delay={i * 80}>
                <article className="eq-card">
                  {c.key === 'camera' ? (
                    <Stage name="camera" alt={c.alt} ratio="16 / 10" />
                  ) : (
                    <div className="eq-stage" style={{ aspectRatio: '16 / 10' }}>
                      <img src={asset(`/images/equip/${c.key}.webp`)} alt={c.alt} loading="lazy" />
                    </div>
                  )}
                  <div className="eq-card-body">
                    <div className="v">{c.v}</div>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="eq-note">{e.map.note}</p>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <Reveal className="cta-band">
            <span className="eyebrow">{e.ctaEyebrow}</span>
            <h2 className="h1">{e.ctaTitle}</h2>
            <p className="lead mt-2" style={{ maxWidth: '48ch', margin: '1rem auto 0' }}>{e.ctaLead}</p>
            <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
          </Reveal>
          {/* Sources des chiffres et credit des visuels */}
          <p className="eq-sources">{e.note} {e.credit}</p>
        </div>
      </section>
    </div>
  );
}
