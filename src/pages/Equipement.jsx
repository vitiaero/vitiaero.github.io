import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import BgVideo from '../components/BgVideo.jsx';
import HoverVideo from '../components/HoverVideo.jsx';
import Kicker from '../components/Kicker.jsx';
import Icon from '../components/Icons.jsx';
import CountUp from '../components/CountUp.jsx';
import WordRise from '../components/WordRise.jsx';
import BtnArrow from '../components/BtnArrow.jsx';
import { useParallax } from '../components/useParallax.js';
import { equipVideos } from '../content.js';
import { asset } from '../config.js';
import { useI18n } from '../i18n/index.jsx';

// Page Equipement : le DJI Agras T50, d'apres la maquette "Refonte site Lavaux
// et T50" (grille de cartes). Donnees publiees par DJI, reformulees dans
// src/i18n. Visuels : DJI, et le plan du drone qui se deplie fourni par le
// proprietaire.
const still = (name) => asset(`/images/equip/${name}.jpg`);

// Sous-menu colle en haut de l'ecran : la section visible est mise en evidence
// par une pastille claire qui glisse d'un lien a l'autre.
const SECTION_TAB = { t50: 't50', drone: 'drone', pulverisation: 'pulverisation', preparation: 'pulverisation', cartographie: 'cartographie' };

function SubNav({ items, label }) {
  const [active, setActive] = useState(items[0].id);
  const navRef = useRef(null);
  const indRef = useRef(null);

  useEffect(() => {
    const sections = Object.keys(SECTION_TAB).map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setActive(SECTION_TAB[visible[0].target.id]);
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const place = useCallback(() => {
    const nav = navRef.current;
    const link = nav?.querySelector(`a[href="#${active}"]`);
    const ind = indRef.current;
    if (!link || !ind) return;
    ind.style.setProperty('--x', `${link.offsetLeft}px`);
    ind.style.setProperty('--w', `${link.offsetWidth}px`);
    nav.classList.add('has-ind');
    // Petit ecran : le menu defile a l'horizontale ; on garde le lien actif
    // au centre (defilement horizontal seulement, la page ne bouge pas).
    if (nav.scrollWidth > nav.clientWidth) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [active]);
  useLayoutEffect(place, [place]);
  useEffect(() => {
    window.addEventListener('resize', place);
    document.fonts?.ready?.then(place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  return (
    <div className="eqx-subnav-wrap">
      <nav className="eqx-subnav" aria-label={label} ref={navRef}>
        <span className="eqx-subnav-ind" ref={indRef} aria-hidden="true" />
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} className={active === i.id ? 'active' : ''} aria-current={active === i.id ? 'true' : undefined}>
            {i.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function Hero({ e }) {
  const words = e.title.split(' ');
  const model = words.pop();
  return (
    <section id="t50" className="eqx-hero" aria-labelledby="eqx-title">
      <div className="eqx-hero-media">
        <img src={still('t50-deplie')} alt={e.heroAlt} fetchpriority="high" />
        <BgVideo className="eqx-hero-video" variants={equipVideos['t50-deplie']} poster={still('t50-deplie')} loop={false} toggle />
      </div>
      <div className="eqx-hero-body">
        <div className="eqx-hero-top">
          <Kicker tone="light">{e.eyebrow}</Kicker>
          <p className="eqx-credit">{e.creditShort}</p>
        </div>
        <div className="eqx-hero-bottom">
          <div className="eqx-hero-row">
            <h1 id="eqx-title" className="eqx-title">
              <WordRise text={words.join(' ')} delay={150} />{' '}
              <span className="wr" style={{ '--i': words.length, '--wr-delay': '150ms' }}><span className="wr-in lime">{model}</span></span>
            </h1>
            <p className="eqx-hero-lead">{e.lead}</p>
          </div>
          <dl className="eqx-figures">
            {e.figures.map((f, i) => (
              <div key={f.k} style={{ '--i': i }}>
                <dt>{f.k}</dt>
                <dd><CountUp value={f.v} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, text, tone, id }) {
  return (
    <div className="eqx-head">
      <Reveal>
        <Kicker tone={tone}>{kicker}</Kicker>
        <h2 className="hm-h2 lg" id={id}>{title}</h2>
      </Reveal>
      <Reveal as="p" className="eqx-head-text" delay={100}>{text}</Reveal>
    </div>
  );
}

function Drone({ e }) {
  const d = e.drone;
  const [radar, relief, signal, fold] = d.points;
  const giant = useRef(null);
  const drone = useRef(null);
  useParallax(giant, 0.1);
  useParallax(drone, -0.05);
  return (
    <section id="drone" className="eqx-section" aria-labelledby="eqx-drone-title">
      <SectionHead kicker={d.eyebrow} title={d.title} text={d.text} id="eqx-drone-title" />
      <div className="eqx-bento">
        <Reveal as="article" className="eqx-card eqx-visual">
          <span className="giant" ref={giant} aria-hidden="true">T50</span>
          <img ref={drone} className="eqx-visual-img" src={asset('/images/drone-cutout.png')} alt={e.title} loading="lazy" />
          <ul className="eqx-visual-chips">{d.chips.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="hm-stat-card">
            <span className="big">40<span className="unit">L</span></span>
            <span className="lbl">{d.tankLabel}</span>
          </p>
        </Reveal>
        <Reveal as="article" className="eqx-card eqx-radar" delay={100}>
          <div className="eqx-media"><img src={still('t50-radar')} alt={d.alt} loading="lazy" /></div>
          <div className="eqx-card-body">
            <h3>{radar.title}</h3>
            <p>{radar.text}</p>
          </div>
        </Reveal>
        <Reveal as="article" className="eqx-card eqx-relief">
          <div className="eqx-media"><img src={asset('/images/t50-rows.jpg')} alt="" loading="lazy" /></div>
          <div className="eqx-card-body">
            <span className="round" aria-hidden="true"><Icon name="relief" size={18} /></span>
            <div>
              <h3>{relief.title}</h3>
              <p>{relief.text}</p>
            </div>
          </div>
        </Reveal>
        <Reveal as="article" className="eqx-card is-lime eqx-signal" delay={100}>
          <div className="eqx-card-top">
            <h3>{signal.title}</h3>
            <span className="round" aria-hidden="true"><Icon name="signal" size={18} /></span>
          </div>
          <div>
            <p className="huge"><CountUp value={e.figures[3].v} /></p>
            <p>{signal.text}</p>
          </div>
        </Reveal>
        <Reveal as="article" className="eqx-card is-dark eqx-fold" delay={200}>
          <div className="eqx-card-top">
            <h3>{fold.title}</h3>
            <span className="mono-chip">{d.transport}</span>
          </div>
          <p className="big-text">{fold.text}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Spray({ e }) {
  const s = e.spray;
  return (
    <section id="pulverisation" className="eqx-spray" aria-labelledby="eqx-spray-title">
      <SectionHead tone="lime" kicker={s.eyebrow} title={s.title} text={s.text} id="eqx-spray-title" />
      <Reveal className="eqx-spray-stage">
        <img src={still('spray')} alt={s.alt} loading="lazy" />
        <BgVideo className="eqx-spray-video" variants={equipVideos.spray} poster={still('spray')} toggle />
        <ul className="eqx-spray-chips">
          {s.chips.map((c, i) => <li key={c} className={i === 1 ? 'is-lime' : ''}>{c}</li>)}
        </ul>
      </Reveal>
      <div className="eqx-parts">
        {s.parts.map((p, i) => (
          <Reveal as="article" className="eqx-part" key={p.key} delay={i * 110} data-hover-host="">
            <HoverVideo variants={equipVideos[p.key]} poster={still(p.key)} alt={p.alt} />
            <div className="eqx-part-body">
              <div className="eqx-part-head"><h3>{p.title}</h3><span className="num">{String(i + 1).padStart(2, '0')}</span></div>
              <p>{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Prep({ e }) {
  const p = e.prep;
  return (
    <section id="preparation" className="eqx-prep" aria-labelledby="eqx-prep-title">
      <Reveal className="eqx-prep-media">
        <img src={still('generateur')} alt={p.alt} loading="lazy" />
      </Reveal>
      <Reveal className="eqx-prep-card" delay={120}>
        <div>
          <Kicker>{p.eyebrow}</Kicker>
          <h2 className="hm-h2 lg" id="eqx-prep-title">{p.title}</h2>
          <p className="eqx-prep-text">{p.text}</p>
        </div>
        <dl className="eqx-rows">
          {p.figures.map((f) => (
            <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

function Gps({ e }) {
  const m = e.map;
  const routes = m.cards.slice(0, 2);
  const camera = m.cards[2];
  const [mode, setMode] = useState(0);
  const cur = routes[mode];
  return (
    <section id="cartographie" className="eqx-section" aria-labelledby="eqx-gps-title">
      <SectionHead kicker={m.eyebrow} title={m.title} text={m.text} id="eqx-gps-title" />
      <div className="eqx-gps">
        <Reveal as="article" className="eqx-card eqx-gps-main">
          <div className="eqx-gps-img">
            {routes.map((r, i) => (
              <img key={r.key} src={asset(`/images/equip/${r.key}.webp`)} alt={r.alt} loading="lazy" className={i === mode ? 'on' : ''} aria-hidden={i === mode ? undefined : 'true'} />
            ))}
            <div className="eqx-toggle" role="group" aria-label={m.toggleLabel}>
              {routes.map((r, i) => (
                <button key={r.key} type="button" aria-pressed={i === mode} className={i === mode ? 'on' : ''} onClick={() => setMode(i)}>{r.title}</button>
              ))}
            </div>
          </div>
          <div className="eqx-gps-foot" aria-live="polite">
            <p className="eqx-gps-num" key={`n-${mode}`}><span className="huge">{cur.big}</span><span className="small">{cur.small}</span></p>
            <div className="eqx-gps-text" key={`t-${mode}`}>
              <h3>{cur.title}</h3>
              <p>{cur.text}</p>
            </div>
          </div>
        </Reveal>
        <div className="eqx-gps-side">
          <Reveal as="article" className="eqx-card eqx-gps-video" delay={100}>
            <img src={still('parcelles')} alt={m.alt} loading="lazy" />
            <BgVideo className="eqx-gps-v" variants={equipVideos.parcelles} poster={still('parcelles')} toggle />
            <p className="caption">{m.videoCaption}</p>
          </Reveal>
          <Reveal as="article" className="eqx-card is-dark eqx-camera" delay={200} data-hover-host="">
            <HoverVideo variants={equipVideos.camera} poster={still('camera')} alt={camera.alt} className="eqx-camera-media" />
            <div className="eqx-camera-body">
              <span className="mono-chip">{camera.v}</span>
              <div>
                <h3>{camera.title}</h3>
                <p>{camera.text}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <p className="eqx-note">{m.note}</p>
    </section>
  );
}

export default function Equipement() {
  const { t } = useI18n();
  const e = t.equipment;

  return (
    <div className="page equip-page">
      <div className="container eqx-flow">
        <Hero e={e} />
        <SubNav items={e.subnav} label={e.subnavLabel} />
        <Drone e={e} />
        <Spray e={e} />
        <Prep e={e} />
        <Gps e={e} />
        <section className="eqx-cta-wrap" aria-labelledby="eqx-cta-title">
          <Reveal className="eqx-cta">
            <div>
              <Kicker>{e.ctaEyebrow}</Kicker>
              <h2 className="hm-h2 xl" id="eqx-cta-title">{e.ctaTitle}</h2>
              <p>{e.ctaLead}</p>
            </div>
            <Link to="/estimation" className="btn btn-dark btn-arrow">{t.common.requestEstimate}<BtnArrow /></Link>
          </Reveal>
          {/* Sources des chiffres et credit des visuels */}
          <p className="eqx-sources">{e.note} {e.credit}</p>
        </section>
      </div>
    </div>
  );
}
