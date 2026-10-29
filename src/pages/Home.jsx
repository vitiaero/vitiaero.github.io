import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import BgVideo from '../components/BgVideo.jsx';
import FaqSchema from '../components/FaqSchema.jsx';
import Kicker from '../components/Kicker.jsx';
import WordRise from '../components/WordRise.jsx';
import ScrollWords from '../components/ScrollWords.jsx';
import BtnArrow from '../components/BtnArrow.jsx';
import Slogan from '../components/Slogan.jsx';
import { useParallax } from '../components/useParallax.js';
import { asset } from '../config.js';
import { videos, film } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Page d'accueil, d'apres la maquette « Refonte site Lavaux et T50 », epuree le
// 27 septembre puis allegee le 28 (7 sections) : un message par bloc, textes
// courts, uniquement des images du DJI Agras T55 et du Lavaux. Les textes
// viennent de src/i18n (verifies).
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
          <Slogan className="hm-hero-slogan" />
          <p className="hm-hero-lead">{h.lead}</p>
          <div className="hm-hero-actions">
            <Link to="/estimation" className="btn btn-primary btn-arrow">{t.common.requestEstimate}<BtnArrow /></Link>
            <a href="#comment" className="btn btn-glass">{h.how}</a>
          </div>
          {/* Le formulaire court (sans carte, avec photos) voulu par les vignerons */}
          <Link to="/devis" className="hm-hero-quick">{h.quick}</Link>
        </div>
      </div>
    </section>
  );
}

// Trois photos du DJI Agras T55 (DJI) : sur un coteau, en vol, de face avec
// son radar sur le dessus.
const WHY_IMAGES = ['t55-pente.jpg', 't55-coteau.jpg', 't55-route.jpg'];

function WhyDrone() {
  const { t } = useI18n();
  const w = t.home.why;
  return (
    <section className="hm-why" aria-labelledby="hm-why-title">
      <div className="hm-why-main">
        <div className="hm-statement">
          <h2 id="hm-why-title">{w.title}</h2>{' '}
          <ScrollWords text={w.lead} />
        </div>
        <div className="hm-why-cols">
          <Reveal as="p" delay={100}>{w.text}</Reveal>
          <Reveal delay={180}>
            <Link to="/estimation" className="link-arrow">{w.cta}<Icon name="arrow" size={16} stroke={2} /></Link>
          </Reveal>
        </div>
      </div>
      <div className="hm-adv-grid">
        {t.home.advantages.items.map((item, i) => (
          <Reveal as="article" className="hm-adv-card" key={item.title} delay={i * 110}>
            <div className="hm-media"><img src={img(WHY_IMAGES[i])} alt="" loading="lazy" /></div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
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

// Le T55 « tourne » pendant le defilement : trois rendus DJI pris a la meme
// hauteur (face, trois quarts, arriere) se succedent selon la position de la
// carte a l'ecran. Rien ne bouge en mouvement reduit : vue de face.
const TURN = ['drone-tour-1.webp', 'drone-tour-2.webp', 'drone-tour-3.webp'];

function useTurn(hostRef, imgsRef) {
  useEffect(() => {
    // La carte qui contient le drone sert de repere (l'image deborde de la carte).
    const host = hostRef.current?.parentElement;
    if (!host) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      // Vue de face tant que le centre de la carte est sous les trois quarts de
      // l'ecran ; vue arriere une fois qu'il passe au-dessus du quart.
      const center = r.top + r.height / 2;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - center) / (vh * 0.5)));
      const turn = p * (TURN.length - 1);
      // Une seule vue a la fois, toujours pleinement visible : on passe a la
      // suivante d'un coup (fondu tres court en CSS), comme une image par image.
      const shown = Math.round(turn);
      imgsRef.current.forEach((im, i) => {
        if (im) im.style.opacity = i === shown ? '1' : '0';
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hostRef, imgsRef]);
}

function DroneSection() {
  const { t } = useI18n();
  const d = t.home.drone;
  const giant = useRef(null);
  const drone = useRef(null);
  const turnImgs = useRef([]);
  useParallax(giant, 0.1);
  useParallax(drone, -0.06);
  useTurn(drone, turnImgs);
  return (
    <section className="hm-drone" id="drone" aria-labelledby="hm-drone-title">
      <Reveal className="hm-drone-visual">
        <span className="giant" ref={giant} aria-hidden="true">T55</span>
        {/* Le drone tourne au defilement (vue 3/4 fixe sur la page Equipement) */}
        <div className="hm-drone-img hm-drone-turn" ref={drone} role="img" aria-label={d.alt}>
          {TURN.map((src, i) => (
            <img
              key={src}
              ref={(el) => { turnImgs.current[i] = el; }}
              src={img(src)}
              alt=""
              loading="lazy"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
        </div>
        <p className="hm-drone-credit">{d.credit}</p>
        <p className="hm-stat-card">
          <span className="big">50<span className="unit">L</span></span>
          <span className="lbl">{d.tankLabel}</span>
        </p>
      </Reveal>
      <Reveal className="hm-drone-info" delay={120}>
        <div>
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

// Un seul plan : le vol FPV du proprietaire au-dessus des terrasses d'Epesses.
function Film() {
  const { t } = useI18n();
  const c = t.home.cine;
  return (
    <section className="hm-films" aria-labelledby="hm-films-title">
      <div className="hm-head">
        <Reveal>
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
        <h2 className="hm-h2 xl" id="hm-cta-title">{c.title}</h2>
        <p>{c.lead}</p>
        <div className="hm-cta-actions">
          <Link to="/estimation" className="btn btn-primary btn-arrow">{t.common.requestEstimate}<BtnArrow /></Link>
          <Link to="/contact?sujet=test" className="btn btn-glass">{c.test}</Link>
          <Link to="/contact?sujet=demo" className="btn btn-glass">{c.demo}</Link>
        </div>
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
        <WhyDrone />
        <Steps />
        <DroneSection />
        <Film />
        <Faq />
        <FinalCta />
      </div>
    </div>
  );
}
