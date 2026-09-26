import { Link } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import Picture from '../components/Picture.jsx';
import CountUp from '../components/CountUp.jsx';
import BgVideo from '../components/BgVideo.jsx';
import FaqSchema from '../components/FaqSchema.jsx';
import { asset } from '../config.js';
import { images, videos } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  return (
    <section className="hero">
      <div className="hero-media">
        <Picture img={images.colline} alt={h.alt} eager />
        <BgVideo className="hero-video" variants={videos.hero} />
      </div>
      <div className="container hero-inner">
        <span className="eyebrow" style={{ color: '#cfe0b8' }}>{h.eyebrow}</span>
        <h1 className="display">{h.title}</h1>
        <p className="lead">{h.lead}</p>
        <div className="hero-actions">
          <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
          <a href="#comment" className="btn btn-light">{h.how}</a>
        </div>
        <p className="hero-note">{h.note}</p>
      </div>
      <a href="#comment" className="scroll-cue" aria-label={h.scrollAria}>
        <span>{h.discover}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </a>
    </section>
  );
}

function Stats() {
  const { t } = useI18n();
  return (
    <section className="section-sm">
      <div className="container">
        <Reveal className="stats">
          {t.home.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="num"><CountUp value={s.num} /></div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function WhyDrone() {
  const { t } = useI18n();
  const w = t.home.why;
  return (
    <section className="section">
      <div className="container">
        <div className="split">
          <Reveal>
            <span className="eyebrow">{w.eyebrow}</span>
            <h2 className="h2">{w.title}</h2>
            <p className="lead mt-2">{w.lead}</p>
            <p className="mt-2 muted">{w.text}</p>
            <div className="mt-3">
              <Link to="/estimation" className="btn btn-dark">{w.cta}</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="split-media">
              <Picture img={images.pulvColline} alt={w.alt} sizes="(max-width: 960px) 100vw, 50vw" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  const { t } = useI18n();
  const a = t.home.advantages;
  return (
    <section className="section bg-soft">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">{a.eyebrow}</span>
            <h2 className="h2">{a.title}</h2>
          </Reveal>
        </div>
        <div className="grid grid-3 grid-cards">
          {a.items.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="card">
                <div className="icon"><Icon name={item.icon} size={24} /></div>
                <h3 className="h3">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const h = t.home.how;
  return (
    <section className="section" id="comment">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">{h.eyebrow}</span>
            <h2 className="h2">{h.title}</h2>
          </Reveal>
        </div>
        <div className="steps grid-cards">
          {h.steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="step">
                <div>
                  {/* Barre remplie a 1/4, 2/4... : on voit ou l'on en est */}
                  <div className="step-bar" style={{ '--progress': (i + 1) / h.steps.length }} aria-hidden="true" />
                  <span className="no">{s.no}</span>
                </div>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/estimation" className="btn btn-primary">{h.cta}</Link>
        </div>
      </div>
    </section>
  );
}

function DroneSection() {
  const { t } = useI18n();
  const d = t.home.drone;
  return (
    <section className="section bg-ink">
      <div className="container">
        <div className="split reverse">
          <Reveal>
            <figure className="drone-float">
              <Picture img={images.studio} alt={d.alt} sizes="(max-width: 960px) 90vw, 580px" className="on-dark" />
              <figcaption className="drone-caption">{d.caption}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow" style={{ color: '#cfe0b8' }}>{d.eyebrow}</span>
            <h2 className="h2">{d.title}</h2>
            <p className="lead mt-2" style={{ color: 'rgba(255,255,255,0.85)' }}>{d.lead}</p>
            <ul className="spec-list">
              {d.specs.map((s, i) => (
                <li key={i}>
                  <span className="k" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.k}</span>
                  <span className="v" style={{ color: '#fff' }}>{s.v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Link to="/equipement" className="btn btn-light">{d.more}</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CinematicBand() {
  const { t } = useI18n();
  const c = t.home.cine;
  return (
    <section className="cine-band">
      <div className="cine-media">
        <img src={asset('/images/vignoble-poster.jpg')} alt="" loading="lazy" decoding="async" />
        <BgVideo className="cine-video" variants={videos.vignoble} />
      </div>
      <div className="container cine-inner">
        <Reveal>
          <span className="eyebrow" style={{ color: '#cfe0b8' }}>{c.eyebrow}</span>
          <h2 className="h2">{c.title}</h2>
          <p className="lead mt-2">{c.lead}</p>
        </Reveal>
      </div>
    </section>
  );
}

function LavauxBanner() {
  const { t } = useI18n();
  const l = t.home.lavaux;
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="banner">
            <div className="banner-media">
              <img
                src={images.lavaux}
                alt={l.alt}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="banner-inner">
              <span className="eyebrow" style={{ color: '#cfe0b8' }}>{l.eyebrow}</span>
              <h2 className="h2">{l.title}</h2>
              <p>{l.text}</p>
              <div className="mt-3">
                <Link to="/estimation" className="btn btn-light">{t.common.requestEstimate}</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        {item.q}
        <span className="chev" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <div className="faq-a">
        <div className="faq-a-inner">
          {item.a}
          {item.link && (
            <Link className="faq-link" to={item.link.to}>{item.link.label}</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const { t } = useI18n();
  const f = t.home.faq;
  // Categories fermees au depart : le visiteur n'ouvre que ce qui l'interesse.
  // Plusieurs categories peuvent etre ouvertes ensemble (rien ne saute sous ses
  // yeux) ; une seule reponse a la fois, reperee par "categorie.question".
  const [openCats, setOpenCats] = useState(() => new Set());
  const [open, setOpen] = useState('');

  function toggleCat(g) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  }

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">{f.eyebrow}</span>
            <h2 className="h2">{f.title}</h2>
          </Reveal>
        </div>
        <Reveal className="faq-cats">
          {f.groups.map((group, g) => {
            const expanded = openCats.has(g);
            const panelId = `faq-cat-${g}`;
            return (
              <div className={`faq-cat${expanded ? ' open' : ''}`} key={group.title}>
                <h3 className="faq-cat-heading">
                  <button
                    type="button"
                    className="faq-cat-toggle"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggleCat(g)}
                  >
                    <span className="faq-cat-icon" aria-hidden="true"><Icon name={group.icon} size={20} /></span>
                    <span className="faq-cat-title">{group.title}</span>
                    <span className="faq-cat-count">{f.count(group.items.length)}</span>
                    <span className="faq-cat-chev" aria-hidden="true"><Icon name="chevron" size={18} stroke={2.2} /></span>
                  </button>
                </h3>
                <div className="faq-cat-panel" id={panelId}>
                  <div className="faq">
                    {group.items.map((item, i) => {
                      const key = `${g}.${i}`;
                      return (
                        <FaqItem
                          key={key}
                          item={item}
                          open={open === key}
                          onToggle={() => setOpen(open === key ? '' : key)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
        <Reveal className="faq-more">
          <span className="faq-more-icon" aria-hidden="true"><Icon name="mail" size={22} /></span>
          <div className="faq-more-text">
            <p className="faq-more-title">{f.moreTitle}</p>
            <p className="faq-more-sub">{f.moreText}</p>
          </div>
          <Link to="/contact" className="btn btn-primary btn-sm">{f.moreCta}</Link>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useI18n();
  const c = t.home.cta;
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="h1">{c.title}</h2>
          <p className="lead mt-2" style={{ maxWidth: '48ch', margin: '1rem auto 0' }}>{c.lead}</p>
          <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <FaqSchema />
      <Hero />
      <Stats />
      <WhyDrone />
      <Advantages />
      <HowItWorks />
      <DroneSection />
      <CinematicBand />
      <LavauxBanner />
      <Faq />
      <FinalCta />
    </div>
  );
}
