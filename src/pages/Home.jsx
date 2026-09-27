import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import CountUp from '../components/CountUp.jsx';
import BgVideo from '../components/BgVideo.jsx';
import FaqSchema from '../components/FaqSchema.jsx';
import Kicker from '../components/Kicker.jsx';
import WordRise from '../components/WordRise.jsx';
import BtnArrow from '../components/BtnArrow.jsx';
import { useParallax } from '../components/useParallax.js';
import { asset } from '../config.js';
import { images, videos, film } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Page d'accueil, d'apres la maquette « Refonte site Lavaux et T50 », epuree le
// 27 septembre : un message par bloc, textes lisibles, uniquement des images du
// DJI Agras T50 et du Lavaux. Les textes viennent de src/i18n (verifies).
const img = (p) => asset(`/images/${p}`);
const pad = (i) => String(i + 1).padStart(2, '0');

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  return (
    <section className="hm-hero" aria-labelledby="hm-title">
      <div className="hm-hero-card">
        <div className="hm-hero-media">
          <img src={img('hero-poster.jpg')} alt={h.alt} fetchpriority="high" />
          <BgVideo className="hm-hero-video" variants={videos.hero} poster={img('hero-poster.jpg')} toggle />
        </div>
        <div className="hm-hero-body">
          <Kicker tone="light">{h.eyebrow}</Kicker>
          <h1 id="hm-title" className="hm-hero-title"><WordRise text={h.title} delay={200} /></h1>
          <p className="hm-hero-lead">{h.lead}</p>
          <div className="hm-hero-actions">
            <Link to="/estimation" className="btn btn-primary btn-arrow">{t.common.requestEstimate}<BtnArrow /></Link>
            <a href="#comment" className="btn btn-glass">{h.how}</a>
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
    <section className="hm-why" aria-labelledby="hm-why-title">
      <Reveal className="hm-why-side"><Kicker>{w.eyebrow}</Kicker></Reveal>
      <div className="hm-why-main">
        <Reveal className="hm-statement">
          <h2 id="hm-why-title">{w.title}</h2>{' '}
          <p>{w.lead}</p>
        </Reveal>
        <div className="hm-why-cols">
          <Reveal as="p" delay={100}>{w.text}</Reveal>
          <Reveal delay={180}>
            <Link to="/estimation" className="link-arrow">{w.cta}<Icon name="arrow" size={16} stroke={2} /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Trois photos du DJI Agras T50 : au-dessus des rangs, en vol, le radar avant.
const ADV_IMAGES = ['t50-rows.jpg', 't50-flight.jpg', 'equip/t50-radar.jpg'];

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

// Les quatre etapes de la demande, toutes visibles : une liste numerotee
// se lit d'un coup d'oeil, sans cliquer.
function Steps() {
  const { t } = useI18n();
  const h = t.home.how;
  return (
    <section className="hm-steps" id="comment" aria-labelledby="hm-steps-title">
      <Reveal className="hm-steps-head">
        <Kicker>{h.eyebrow}</Kicker>
        <h2 className="hm-h2" id="hm-steps-title">{h.title}</h2>
        <Link to="/estimation" className="btn btn-dark btn-arrow">{h.cta}<BtnArrow /></Link>
      </Reveal>
      <ol className="hm-steps-list">
        {h.steps.map((s, i) => (
          <Reveal as="li" className="hm-step" key={s.title} delay={i * 100}>
            <span className="hm-step-n" aria-hidden="true">{pad(i)}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
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
        <p className="hm-drone-credit">{d.credit}</p>
        <p className="hm-stat-card">
          <span className="big">40<span className="unit">L</span></span>
          <span className="lbl">{d.tankLabel}</span>
        </p>
      </Reveal>
      <Reveal className="hm-drone-info" delay={120}>
        <div>
          <Kicker tone="lime">{d.eyebrow}</Kicker>
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
        <Kicker tone="light">{l.eyebrow}</Kicker>
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

// Un seul plan : le vol FPV du proprietaire au-dessus des terrasses d'Epesses.
function Film() {
  const { t } = useI18n();
  const c = t.home.cine;
  return (
    <section className="hm-films" aria-labelledby="hm-films-title">
      <div className="hm-head">
        <Reveal>
          <Kicker>{c.eyebrow}</Kicker>
          <h2 className="hm-h2" id="hm-films-title">{c.title}</h2>
        </Reveal>
        <Reveal as="p" className="hm-head-note" delay={100}>{c.lead}</Reveal>
      </div>
      <Reveal as="figure" className="hm-film">
        <img src={img('film-lavaux.jpg')} alt={c.film.alt} loading="lazy" />
        <BgVideo className="hm-film-video" variants={film} poster={img('film-lavaux.jpg')} toggle onDemand />
        <figcaption>{c.film.label}</figcaption>
      </Reveal>
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
          <Kicker>{f.eyebrow}</Kicker>
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
              {g.title}
              <span className="count" aria-hidden="true">{g.items.length}</span>
              <span className="sr-only">{`, ${f.count(g.items.length)}`}</span>
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
        <Film />
        <Faq />
        <FinalCta />
      </div>
    </div>
  );
}
