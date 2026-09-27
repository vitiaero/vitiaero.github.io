import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import { DroneTopView, SprayDiagram, RoutePlan, ChargingCycle } from '../components/Illustrations.jsx';
import { useI18n } from '../i18n/index.jsx';

// Page Equipement : le drone prevu (DJI Agras T50) en trois parties.
// Les chiffres viennent des publications du fabricant (sources en bas de page) ;
// les visuels sont des schemas crees pour VitiAero, pas des images de DJI.

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
      <section className="eq-hero">
        <div className="container">
          <div className="eq-hero-head">
            <span className="eyebrow">{e.eyebrow}</span>
            <h1 className="display">{e.title}</h1>
            <p className="lead">{e.lead}</p>
          </div>
          <Reveal>
            <figure className="eq-illustration eq-illustration-hero">
              <DroneTopView title={e.illustrations.drone} unfold />
            </figure>
          </Reveal>
          <Figures items={e.figures} className="eq-figures" />
        </div>
      </section>

      <SubNav items={e.subnav} label={e.subnavLabel} title={e.title} />

      <section id="drone" className="section">
        <div className="container">
          <Reveal className="eq-head">
            <span className="eyebrow">{e.drone.eyebrow}</span>
            <h2 className="h2">{e.drone.title}</h2>
            <p className="lead">{e.drone.text}</p>
          </Reveal>
          <div className="eq-points">
            {e.drone.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="eq-point">
                  <span className="eq-point-icon" aria-hidden="true"><Icon name={p.icon} size={22} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pulverisation" className="eq-dark">
        <div className="container">
          <Reveal className="eq-head">
            <span className="eyebrow">{e.spray.eyebrow}</span>
            <h2 className="h2">{e.spray.title}</h2>
            <p className="lead">{e.spray.text}</p>
          </Reveal>
          <Reveal>
            <figure className="eq-illustration eq-illustration-dark">
              <SprayDiagram title={e.illustrations.spray} />
            </figure>
          </Reveal>
          <div className="eq-parts">
            {e.spray.parts.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="eq-part">
                  <span className="eq-point-icon" aria-hidden="true"><Icon name={p.icon} size={22} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
              <figure className="eq-illustration">
                <ChargingCycle title={e.illustrations.charging} />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="cartographie" className="section">
        <div className="container">
          <div className="eq-split">
            <Reveal>
              <figure className="eq-illustration">
                <RoutePlan title={e.illustrations.route} />
              </figure>
            </Reveal>
            <Reveal delay={100}>
              <span className="eyebrow">{e.map.eyebrow}</span>
              <h2 className="h2">{e.map.title}</h2>
              <p className="lead">{e.map.text}</p>
            </Reveal>
          </div>
          <div className="eq-cards">
            {e.map.cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <article className="eq-card">
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
            <p className="lead mt-2 cta-lead">{e.ctaLead}</p>
            <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
          </Reveal>
          {/* Sources des chiffres et nature des visuels */}
          <p className="eq-sources">{e.note} {e.illustrationNote}</p>
        </div>
      </section>
    </div>
  );
}
