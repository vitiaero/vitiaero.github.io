import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import { images } from '../content.js';
import { FICTIONAL, LAUNCH } from '../launch.js';
import { useI18n } from '../i18n/index.jsx';

export default function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal>
              <img src={images.logoFull.src} width={images.logoFull.width} height={images.logoFull.height} alt="VitiAero" className="about-logo" />
              <span className="eyebrow">{a.eyebrow}</span>
              <h1 className="h1">{a.title}</h1>
              <p className="lead mt-2">{a.lead}</p>
              <p className="mt-2 muted">{a.p1}</p>
              {/* Etat reel du projet : entreprise fictive, ou service pas encore ouvert. */}
              {FICTIONAL ? (
                <div className="status-box">
                  <h2>{t.fictional.aboutTitle}</h2>
                  <p>{t.fictional.aboutText}</p>
                </div>
              ) : !LAUNCH.ready && (
                <div className="status-box">
                  <h2>{a.statusTitle}</h2>
                  <p>{a.statusText}</p>
                </div>
              )}
            </Reveal>
            <Reveal delay={120}>
              <figure className="split-media">
                <img src={images.epesses.src} width={images.epesses.width} height={images.epesses.height} alt={a.alt} loading="lazy" decoding="async" />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="section-head center">
            <Reveal><h2 className="h2">{a.valuesTitle}</h2></Reveal>
          </div>
          <div className="grid grid-3 grid-cards">
            {a.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="card">
                  <div className="icon" aria-hidden="true"><Icon name={v.icon} /></div>
                  <h3 className="h3">{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
