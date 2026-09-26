import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import BgVideo from '../components/BgVideo.jsx';
import Picture from '../components/Picture.jsx';
import { images, videos } from '../content.js';
import { useI18n } from '../i18n/index.jsx';

// Page Equipement : le DJI Agras T55, presente comme une page produit.
// Chaque caracteristique vient des pages officielles de DJI (sources et dates
// dans docs/REFONTE-T55.md). Photos et videos : DJI (ag.dji.com/t55), credit
// sur la page ; registre dans docs/REGISTRE-MEDIAS.md.

// Scene : image fixe (toujours) et video par-dessus sur ordinateur. La video
// part de la meme image, qui reste visible pendant le chargement.
function Stage({ img, alt, ratio, video, sizes, eager = false, className = '' }) {
  return (
    <div className={`eq-stage ${className}`} style={{ aspectRatio: ratio }}>
      <Picture img={img} alt={alt} sizes={sizes} eager={eager} />
      {video && <BgVideo className="eq-video" variants={video} loop={false} />}
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

// Photos des cartes Epandage et Levage, dans l'ordre des textes.
const CARD_IMAGES = [images.epandage, images.levage];

export default function Equipement() {
  const { t } = useI18n();
  const e = t.equipment;

  return (
    <div className="page equip-page">
      {/* En-tete : le drone au bord de la vigne */}
      <section className="eq-hero">
        <div className="container">
          <div className="eq-hero-head">
            <span className="eyebrow">{e.eyebrow}</span>
            <h1 className="display">{e.title}</h1>
            <p className="lead">{e.lead}</p>
          </div>
          <Reveal>
            <Stage img={images.transport} alt={e.heroAlt} ratio="16 / 9" video={videos.equipement} sizes="(max-width: 1140px) 100vw, 1100px" eager className="eq-stage-hero" />
          </Reveal>
          <Figures items={e.figures} className="eq-figures" />
        </div>
      </section>

      <SubNav items={e.subnav} label={e.subnavLabel} title={e.title} />

      {/* Pulverisation */}
      <section id="pulverisation" className="eq-dark">
        <div className="container">
          <Reveal className="eq-head">
            <span className="eyebrow">{e.spray.eyebrow}</span>
            <h2 className="h2">{e.spray.title}</h2>
            <p className="lead">{e.spray.text}</p>
          </Reveal>
          <Reveal>
            <Stage img={images.pulvChamp} alt={e.spray.alt} ratio="2 / 1" video={videos.pulverisation} sizes="(max-width: 1240px) 100vw, 1200px" />
          </Reveal>
          <Figures items={e.spray.figures} className="eq-figures" />
        </div>
      </section>

      {/* Securite */}
      <section id="securite" className="section">
        <div className="container">
          <div className="eq-split">
            <Reveal>
              <Stage img={images.radar} alt={e.safety.alt} ratio="6 / 5" video={videos.radar} sizes="(max-width: 960px) 100vw, 55vw" />
            </Reveal>
            <Reveal delay={100}>
              <span className="eyebrow">{e.safety.eyebrow}</span>
              <h2 className="h2">{e.safety.title}</h2>
              <p className="lead">{e.safety.text}</p>
            </Reveal>
          </div>
          <div className="eq-points">
            {e.safety.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="eq-point">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="eq-note">{e.safety.note}</p>
        </div>
      </section>

      {/* Batterie et recharge */}
      <section id="batterie" className="section bg-soft">
        <div className="container">
          <Reveal className="eq-head">
            <span className="eyebrow">{e.battery.eyebrow}</span>
            <h2 className="h2">{e.battery.title}</h2>
            <p className="lead">{e.battery.text}</p>
          </Reveal>
          <Reveal>
            <Stage img={images.batterie} alt={e.battery.alt} ratio="2 / 1" video={videos.batterie} sizes="(max-width: 1240px) 100vw, 1200px" />
          </Reveal>
          <Figures items={e.battery.figures} className="eq-stats" />
        </div>
      </section>

      {/* Epandage et levage : ce que le drone sait faire d'autre */}
      <section id="polyvalence" className="section">
        <div className="container">
          <Reveal className="eq-head">
            <span className="eyebrow">{e.versatility.eyebrow}</span>
            <h2 className="h2">{e.versatility.title}</h2>
            <p className="lead">{e.versatility.text}</p>
          </Reveal>
          <div className="eq-cards">
            {e.versatility.cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <article className="eq-card">
                  <Stage img={CARD_IMAGES[i]} alt={c.alt} ratio="4 / 3" sizes="(max-width: 960px) 100vw, 50vw" />
                  <div className="eq-card-body">
                    <div className="v">{c.v}</div>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation du vol */}
      <section id="preparation" className="section bg-soft">
        <div className="container">
          <div className="eq-split text-first">
            <Reveal>
              <span className="eyebrow">{e.map.eyebrow}</span>
              <h2 className="h2">{e.map.title}</h2>
              <p className="lead">{e.map.text}</p>
            </Reveal>
            <Reveal delay={100}>
              <Stage img={images.radiocommande} alt={e.map.alt} ratio="16 / 9" sizes="(max-width: 960px) 100vw, 55vw" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fiche technique : donnees publiees par DJI */}
      <section id="fiche" className="section">
        <div className="container">
          <Reveal className="eq-head">
            <h2 className="h2">{e.specsTitle}</h2>
            <p className="lead">{e.specsLead}</p>
          </Reveal>
          <div className="table-wrap eq-spec">
            <table className="data">
              <caption className="sr-only">{e.specsTitle}</caption>
              <tbody>
                {e.specs.map((s) => (
                  <tr key={s.k}>
                    <th scope="row">{s.k}</th>
                    <td>{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Questions sur le drone */}
      <section className="section bg-soft">
        <div className="container">
          <Reveal className="eq-head">
            <h2 className="h2">{e.faqTitle}</h2>
          </Reveal>
          <dl className="eq-qa">
            {e.faq.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="cta-band">
            <span className="eyebrow">{e.ctaEyebrow}</span>
            <h2 className="h1">{e.ctaTitle}</h2>
            <p className="lead mt-2" style={{ maxWidth: '48ch', margin: '1rem auto 0' }}>{e.ctaLead}</p>
            <div className="eq-cta-actions">
              <Link to="/devis" className="btn btn-primary">{e.ctaQuote}</Link>
              <Link to="/contact" className="btn btn-outline">{e.ctaContact}</Link>
            </div>
          </Reveal>
          {/* Sources des chiffres, nature des visuels, marques */}
          <p className="eq-sources">{e.note} {e.credit} {e.trademark}</p>
        </div>
      </section>
    </div>
  );
}
