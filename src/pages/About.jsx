import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Img from '../components/Img.jsx';
import Icon from '../components/Icons.jsx';
import { images } from '../content.js';
import { asset } from '../config.js';
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
              <img src={asset('/images/logo-vitiaero-full.png')} alt="VitiAero" className="about-logo" />
              <span className="eyebrow">{a.eyebrow}</span>
              <h1 className="h1">{a.title}</h1>
              <p className="lead mt-2">{a.lead}</p>
              <p className="mt-2 muted">{a.p1}</p>
              <p className="mt-2 muted">{a.p2}</p>
              <div className="status-box">
                <h2>{a.statusTitle}</h2>
                <p>{a.statusText}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="split-media">
                <Img src={images.lavaux} alt={a.alt} style={{ width: '100%', height: '100%' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="section-head center">
            <Reveal><h2 className="h2">{a.valuesTitle}</h2></Reveal>
          </div>
          <div className="grid grid-3">
            {a.values.map((v, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card">
                  <div className="icon"><Icon name={v.icon} /></div>
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
