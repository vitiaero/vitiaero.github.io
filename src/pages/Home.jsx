import { Link } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import CountUp from '../components/CountUp.jsx';
import BgVideo from '../components/BgVideo.jsx';
import FaqSchema from '../components/FaqSchema.jsx';
import { DroneTopView } from '../components/Illustrations.jsx';
import { images, videos } from '../content.js';
import { business } from '../launch.js';
import { TRAVEL_QUOTE_KM } from '../../shared/pricing.js';
import { useI18n } from '../i18n/index.jsx';

// Image de fond du hero : recadrage portrait sur telephone (la video n'y est
// pas lue), paysage ailleurs. C'est l'element le plus grand de la page : il
// est charge en priorite.
function HeroPicture({ alt }) {
  return (
    <picture>
      <source media="(max-width: 720px)" srcSet={images.posterPortrait.src} width={images.posterPortrait.width} height={images.posterPortrait.height} />
      <img
        src={images.posterWide.src}
        srcSet={`${images.posterSmall.src} ${images.posterSmall.width}w, ${images.posterWide.src} ${images.posterWide.width}w`}
        sizes="100vw"
        width={images.posterWide.width}
        height={images.posterWide.height}
        alt={alt}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  return (
    <section className="hero">
      <div className="hero-media">
        <HeroPicture alt={h.alt} />
        <BgVideo className="hero-video" variants={videos.vignoble} poster={images.posterWide.src} />
      </div>
      <div className="container hero-inner">
        <span className="eyebrow eyebrow-light">{h.eyebrow}</span>
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </a>
    </section>
  );
}

// Chiffres cles : valeurs tirees de la configuration (rayon de la grille
// tarifaire, delai de reponse du proprietaire) et de la fiche du drone prevu.
function Stats() {
  const { t } = useI18n();
  const s = t.home.stats;
  const hours = business.commercial.responseTimeHours;
  const items = [
    { num: '40 L', label: s.tank },
    { num: `${TRAVEL_QUOTE_KM} km`, label: s.radius },
    hours > 0 && { num: `${hours} h`, label: s.response },
    { num: '0', label: s.ground },
  ].filter(Boolean);
  return (
    <section className="section-sm">
      <div className="container">
        <Reveal className="stats">
          {items.map((item) => (
            <div className="stat" key={item.label}>
              <div className="num"><CountUp value={item.num} /></div>
              <div className="label">{item.label}</div>
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
            <figure className="split-media">
              <img src={images.terraces.src} width={images.terraces.width} height={images.terraces.height} alt={w.alt} loading="lazy" decoding="async" />
            </figure>
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
          {a.items.map((item) => (
            <Reveal key={item.title}>
              <div className="card">
                <div className="icon" aria-hidden="true"><Icon name={item.icon} size={24} /></div>
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
        <ol className="steps grid-cards">
          {h.steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 80}>
                <div className="step">
                  <div>
                    <div className="step-bar" style={{ '--progress': (i + 1) / h.steps.length }} aria-hidden="true" />
                    <span className="no">{s.no}</span>
                  </div>
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="text-center mt-4">
          <Link to="/estimation" className="btn btn-primary">{h.cta}</Link>
          <p className="hint mt-2">{t.noOrder.short}</p>
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
            <figure className="drone-figure">
              <DroneTopView title={d.illustration} />
              <figcaption>{d.illustrationNote}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow eyebrow-light">{d.eyebrow}</span>
            <h2 className="h2">{d.title}</h2>
            <p className="lead mt-2 on-dark">{d.lead}</p>
            <dl className="spec-list on-dark">
              {d.specs.map((s) => (
                <div key={s.k}>
                  <dt className="k">{s.k}</dt>
                  <dd className="v">{s.v}</dd>
                </div>
              ))}
            </dl>
            <Link to="/equipement" className="btn btn-light mt-3">{d.cta}</Link>
          </Reveal>
        </div>
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
          <figure className="banner">
            <div className="banner-media">
              <img src={images.lavaux.src} width={images.lavaux.width} height={images.lavaux.height} alt={l.alt} loading="lazy" decoding="async" />
            </div>
            <div className="banner-inner">
              <span className="eyebrow eyebrow-light">{l.eyebrow}</span>
              <h2 className="h2">{l.title}</h2>
              <p>{l.text}</p>
              <div className="mt-3">
                <Link to="/estimation" className="btn btn-light">{t.common.requestEstimate}</Link>
              </div>
            </div>
            {/* Credit exige par la licence CC BY-SA 4.0, visible avec l'image. */}
            <figcaption className="banner-credit">
              {l.credit} <Link to="/credits">{t.footer.credits}</Link>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({ item, open, onToggle, id }) {
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <h4 className="faq-q-heading">
        <button type="button" className="faq-q" onClick={onToggle} aria-expanded={open} aria-controls={id}>
          {item.q}
          <span className="chev" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        </button>
      </h4>
      <div className="faq-a" id={id}>
        <div className="faq-a-inner">
          {item.a}
          {item.link && <Link className="faq-link" to={item.link.to}>{item.link.label}</Link>}
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const { t } = useI18n();
  const f = t.home.faq;
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
                  <button type="button" className="faq-cat-toggle" aria-expanded={expanded} aria-controls={panelId} onClick={() => toggleCat(g)}>
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
                        <FaqItem key={key} id={`faq-a-${g}-${i}`} item={item} open={open === key} onToggle={() => setOpen(open === key ? '' : key)} />
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
          <p className="lead mt-2 cta-lead">{c.lead}</p>
          <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
          <p className="hint mt-2">{t.noOrder.short}</p>
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
      <LavauxBanner />
      <Faq />
      <FinalCta />
    </div>
  );
}
