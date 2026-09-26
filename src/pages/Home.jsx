import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import CountUp from '../components/CountUp.jsx';
import BgVideo from '../components/BgVideo.jsx';
import FaqSchema from '../components/FaqSchema.jsx';
import Kicker from '../components/Kicker.jsx';
import WordRise from '../components/WordRise.jsx';
import ScrollWords from '../components/ScrollWords.jsx';
import SwissClock from '../components/SwissClock.jsx';
import BtnArrow from '../components/BtnArrow.jsx';
import { useParallax } from '../components/useParallax.js';
import { asset } from '../config.js';
import { images, videos, films } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Page d'accueil, d'apres la maquette "Refonte site Lavaux et T50" : cartes
// arrondies, sections numerotees, accent vert citron. Les textes viennent de
// src/i18n (verifies) ; visuels du drone : DJI ; Lavaux : proprietaire et
// photo CC BY-SA (credit dans les mentions legales).
const img = (p) => asset(`/images/${p}`);
const pad = (i) => String(i + 1).padStart(2, '0');

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  return (
    <section className="hm-hero" aria-labelledby="hm-title">
      <div className="hm-hero-meta">
        <p className="hm-hero-place"><strong>{h.place}</strong><SwissClock label={h.clockLabel} /></p>
        <p className="hm-hero-tagline">{h.eyebrow}</p>
      </div>

      <div className="hm-hero-card">
        <div className="hm-hero-media">
          <img src={img('hero-poster.jpg')} alt={h.alt} fetchpriority="high" />
          <BgVideo className="hm-hero-video" variants={videos.hero} poster={img('hero-poster.jpg')} toggle />
        </div>

        <div className="hm-hero-body">
          <div className="hm-hero-top">
            <ul className="hm-chips" aria-label={h.eyebrow}>
              {h.chips.map((c, i) => <li key={c} style={{ '--i': i }}>{c}</li>)}
            </ul>
            <p className="hm-hero-flow">
              <span>{h.flow[0]}</span>
              <span className="line" aria-hidden="true" />
              <span>{h.flow[1]}</span>
            </p>
          </div>

          <div className="hm-hero-mid">
            <p className="hm-hero-tank">
              <span className="big"><CountUp value="40" duration={1600} /><span className="unit">L</span></span>
              <span className="lbl">{t.home.stats[0].label}</span>
            </p>
            <p className="hm-hero-lead">{h.lead}</p>
          </div>

          <div className="hm-hero-bottom">
            <Link to="/equipement" className="hm-hero-drone">
              <span className="hm-hero-drone-media">
                <img src={img('equip/t50-deplie.jpg')} alt="" />
              </span>
              <span className="hm-hero-drone-text">
                <span className="ic" aria-hidden="true"><Icon name="arrowUpRight" size={14} stroke={2.2} /></span>
                <span>{h.note}</span>
              </span>
            </Link>
            <div className="hm-hero-main">
              <h1 id="hm-title" className="hm-hero-title"><WordRise text={h.title} delay={250} /></h1>
              <div className="hm-hero-actions">
                <Link to="/estimation" className="btn btn-primary btn-arrow">{t.common.requestEstimate}<BtnArrow /></Link>
                <a href="#comment" className="btn btn-glass">{h.how}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useI18n();
  return (
    <dl className="hm-stats">
      {t.home.stats.map((s, i) => (
        <Reveal className="hm-stat" key={s.label} delay={i * 90}>
          <dt>{s.label}</dt>
          <dd><CountUp value={s.num} /></dd>
        </Reveal>
      ))}
    </dl>
  );
}

function WhyDrone() {
  const { t } = useI18n();
  const w = t.home.why;
  return (
    <section className="hm-why">
      <div className="hm-why-side">
        <Reveal><Kicker no="01">{w.eyebrow}</Kicker></Reveal>
        <Reveal as="ul" className="hm-tags" delay={120}>
          {w.tags.map((tag, i) => <li key={tag} className={i === 0 ? 'on' : ''}>{tag}</li>)}
        </Reveal>
      </div>
      <div className="hm-why-main">
        <div className="hm-statement">
          <h2>{w.title}</h2>{' '}
          <ScrollWords text={w.lead} />
        </div>
        <div className="hm-why-cols">
          <Reveal as="p">{w.text}</Reveal>
          <Reveal delay={120}>
            <Link to="/estimation" className="link-arrow">{w.cta}<Icon name="arrow" size={16} stroke={2} /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const ADV_IMAGES = ['t50-rows.jpg', 'hero-drone.jpg', 'equip/t50-radar.jpg'];

function Advantages() {
  const { t } = useI18n();
  const a = t.home.advantages;
  const [focus, other] = [a.items[3], a.items[4]];
  return (
    <section className="hm-adv" aria-labelledby="hm-adv-title">
      <div className="hm-head">
        <Reveal as="h2" className="hm-h2" id="hm-adv-title">{a.title}</Reveal>
        <Reveal as="p" className="hm-head-note" delay={100}>{a.intro}</Reveal>
      </div>
      <div className="hm-adv-grid">
        {a.items.slice(0, 3).map((item, i) => (
          <Reveal as="article" className="hm-adv-card" key={item.title} delay={i * 110}>
            <div className="hm-media"><img src={img(ADV_IMAGES[i])} alt="" loading="lazy" /></div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
      <div className="hm-feature-grid">
        <Reveal as="article" className="hm-feature is-lime">
          <div className="hm-feature-top">
            <h3>{focus.title}</h3>
            <span className="round" aria-hidden="true"><Icon name="target" size={18} /></span>
          </div>
          <p>{focus.text}</p>
        </Reveal>
        <Reveal as="article" className="hm-feature" delay={110}>
          <div className="hm-feature-top">
            <h3>{other.title}</h3>
            <span className="round" aria-hidden="true"><Icon name="plus" size={18} stroke={2.2} /></span>
          </div>
          <p>{other.text}</p>
        </Reveal>
      </div>
    </section>
  );
}

// Illustrations des etapes (visuels DJI : carte de parcelle, pulverisation,
// itineraire). Decoratives : le titre de l'etape est juste a cote.
const STEP_IMAGES = ['equip/carte-limite.webp', 'equip/spray.jpg', 'equip/carte-zone.webp', 'equip/parcelles.jpg'];

function Steps() {
  const { t } = useI18n();
  const h = t.home.how;
  const n = h.steps.length;
  const [step, setStep] = useState(0);
  const tabs = useRef([]);
  const cur = h.steps[step];

  const onKey = (e, i) => {
    let k = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') k = (i + 1) % n;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') k = (i - 1 + n) % n;
    if (e.key === 'Home') k = 0;
    if (e.key === 'End') k = n - 1;
    if (k === null) return;
    e.preventDefault();
    setStep(k);
    tabs.current[k]?.focus();
  };

  return (
    <section className="hm-steps" id="comment" aria-labelledby="hm-steps-title">
      <div className="hm-steps-side">
        <Reveal>
          <Kicker no="02">{h.eyebrow}</Kicker>
          <h2 className="hm-h2" id="hm-steps-title">{h.title}</h2>
        </Reveal>
        <div className="hm-steps-tabs" role="tablist" aria-label={h.listLabel} aria-orientation="vertical">
          {h.steps.map((s, i) => (
            <button
              key={s.title}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`hm-step-${i}`}
              aria-selected={i === step}
              aria-controls="hm-step-panel"
              tabIndex={i === step ? 0 : -1}
              className={`hm-step-tab${i === step ? ' on' : ''}`}
              onClick={() => setStep(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="n">{pad(i)}</span>
              <span className="t">{s.title}</span>
              <span className="dot" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <div className="hm-steps-panel" role="tabpanel" id="hm-step-panel" aria-labelledby={`hm-step-${step}`}>
        <div className="hm-steps-img">
          {STEP_IMAGES.map((src, i) => (
            <img key={src} src={img(src)} alt="" loading="lazy" className={i === step ? 'on' : ''} />
          ))}
        </div>
        <div className="hm-steps-text" key={step}>
          <h3>{cur.title}</h3>
          <p>{cur.text}</p>
        </div>
        <div className="hm-steps-foot">
          <p className="hm-steps-count" aria-hidden="true">
            <span className="big" key={`n-${step}`}>{pad(step)}</span>
            <span className="of">/{pad(n - 1)}</span>
          </p>
          <span className="hm-steps-bar" aria-hidden="true"><span style={{ '--p': (step + 1) / n }} /></span>
          <div className="hm-steps-acts">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setStep((step + 1) % n)}>{h.next}</button>
            <Link to="/estimation" className="btn btn-dark btn-sm">{h.cta}<Icon name="arrow" size={15} stroke={2} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DroneSection() {
  const { t } = useI18n();
  const d = t.home.drone;
  const giant = useRef(null);
  const drone = useRef(null);
  useParallax(giant, 0.1);
  useParallax(drone, -0.06);
  return (
    <section className="hm-drone" id="drone" aria-labelledby="hm-drone-title">
      <Reveal className="hm-drone-visual">
        <span className="giant" ref={giant} aria-hidden="true">T50</span>
        <img className="hm-drone-img" ref={drone} src={img('drone-cutout.png')} alt={d.alt} loading="lazy" />
        <ul className="hm-drone-chips">{d.chips.map((c) => <li key={c}>{c}</li>)}</ul>
        <p className="hm-stat-card">
          <span className="row">
            <span className="big">40<span className="unit">L</span></span>
            <span className="ic" aria-hidden="true"><Icon name="arrowUpRight" size={13} stroke={2.2} /></span>
          </span>
          <span className="lbl">{d.tankLabel}</span>
        </p>
      </Reveal>
      <Reveal className="hm-drone-info" delay={120}>
        <div>
          <Kicker no="03" tone="lime">{d.eyebrow}</Kicker>
          <h2 className="hm-h2" id="hm-drone-title">{d.title}</h2>
          <p className="hm-drone-lead">{d.lead}</p>
        </div>
        <dl className="hm-specs">
          {d.specs.map((s) => (
            <div key={s.k}><dt>{s.k}</dt><dd>{s.v}</dd></div>
          ))}
        </dl>
        <Link to="/equipement" className="btn btn-primary btn-arrow">{d.cta}<BtnArrow /></Link>
      </Reveal>
    </section>
  );
}

function LavauxBanner() {
  const { t } = useI18n();
  const l = t.home.lavaux;
  const photo = useRef(null);
  useParallax(photo, 0.08);
  return (
    <section className="hm-lavaux" aria-labelledby="hm-lavaux-title">
      <div className="hm-lavaux-media">
        <img ref={photo} src={images.lavaux} alt={l.alt} loading="lazy" />
      </div>
      <div className="hm-lavaux-body">
        <Kicker no="04" tone="light">{l.eyebrow}</Kicker>
        <div className="hm-lavaux-row">
          <Reveal className="hm-lavaux-text">
            <h2 className="hm-h2 xl" id="hm-lavaux-title">{l.title}</h2>
            <p>{l.text}</p>
          </Reveal>
          <Reveal delay={180}>
            <Link to="/estimation" className="hm-circle">
              <span>{t.common.requestEstimate}</span>
              <Icon name="arrow" size={16} stroke={2} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const FILMS = [
  { key: 'large', variants: films.large, poster: 'film-lavaux-large.jpg' },
  { key: 'terrasses', variants: films.terrasses, poster: 'film-lavaux-terrasses.jpg' },
];

function Films() {
  const { t } = useI18n();
  const c = t.home.cine;
  return (
    <section className="hm-films" aria-labelledby="hm-films-title">
      <div className="hm-head">
        <Reveal>
          <Kicker no="05">{c.eyebrow}</Kicker>
          <h2 className="hm-h2" id="hm-films-title">{c.title}</h2>
        </Reveal>
        <Reveal as="p" className="hm-head-note" delay={100}>{c.lead}</Reveal>
      </div>
      <div className="hm-films-grid">
        {FILMS.map((f, i) => (
          <Reveal as="figure" className={`hm-film${i === 0 ? ' is-wide' : ''}`} key={f.key} delay={i * 120}>
            <img src={img(f.poster)} alt={c.films[i].alt} loading="lazy" />
            <BgVideo className="hm-film-video" variants={f.variants} poster={img(f.poster)} toggle onDemand />
            <figcaption>{c.films[i].label}</figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  const f = t.home.faq;
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState(0);
  const group = f.groups[cat];

  return (
    <section className="hm-faq" id="faq" aria-labelledby="hm-faq-title">
      <div className="hm-faq-side">
        <Reveal>
          <Kicker no="06">{f.eyebrow}</Kicker>
          <h2 className="hm-h2" id="hm-faq-title">{f.title}</h2>
        </Reveal>
        <Reveal className="hm-faq-cats" role="group" aria-label={f.categoriesLabel} delay={100}>
          {f.groups.map((g, i) => (
            <button
              key={g.title}
              type="button"
              className={`pill${i === cat ? ' on' : ''}`}
              aria-pressed={i === cat}
              onClick={() => { setCat(i); setOpen(0); }}
            >
              {g.title}<span className="count">{g.items.length}</span>
            </button>
          ))}
        </Reveal>
        <Reveal as="p" className="hm-faq-more" delay={160}>
          {f.moreTitle} {f.moreText}{' '}
          <Link to="/contact" className="link-u">{f.moreCta}</Link>
        </Reveal>
      </div>

      <div className="hm-faq-list" key={cat}>
        {group.items.map((item, i) => {
          const id = `faq-${cat}-${i}`;
          const isOpen = open === i;
          return (
            <div className={`hm-qa${isOpen ? ' open' : ''}`} key={item.q} style={{ '--i': i }}>
              <h3>
                <button type="button" id={`${id}-q`} aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{item.q}</span>
                  <span className="ic" aria-hidden="true"><Icon name="plus" size={16} stroke={2.2} /></span>
                </button>
              </h3>
              <div className="hm-qa-a" id={id} role="region" aria-labelledby={`${id}-q`}>
                <div className="hm-qa-in">
                  <p>{item.a}</p>
                  {item.link && <Link className="link-u" to={item.link.to}>{item.link.label}</Link>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useI18n();
  const c = t.home.cta;
  const photo = useRef(null);
  useParallax(photo, 0.06);
  return (
    <section className="hm-cta" aria-labelledby="hm-cta-title">
      <div className="hm-cta-media">
        <img ref={photo} src={img('hero-poster.jpg')} alt="" loading="lazy" />
      </div>
      <Reveal className="hm-cta-body">
        <Kicker tone="light">{c.eyebrow}</Kicker>
        <h2 className="hm-h2 xl" id="hm-cta-title">{c.title}</h2>
        <p>{c.lead}</p>
        <Link to="/estimation" className="btn btn-primary btn-arrow">{t.common.requestEstimate}<BtnArrow /></Link>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <div className="page home">
      <FaqSchema />
      <div className="container home-flow">
        <Hero />
        <Stats />
        <WhyDrone />
        <Advantages />
        <Steps />
        <DroneSection />
        <LavauxBanner />
        <Films />
        <Faq />
        <FinalCta />
      </div>
    </div>
  );
}
