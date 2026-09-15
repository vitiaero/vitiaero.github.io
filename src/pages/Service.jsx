import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import { useI18n } from '../i18n/index.jsx';

// Page "Le service" : le deroulement d'une intervention, les conditions
// examinees avant d'accepter, le cadre suisse et le rapport remis au client.
// Aucun chiffre invente : le rapport affiche est un exemple, signale comme tel.

function Steps({ s }) {
  return (
    <section className="section" id="etapes">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <h2 className="h2">{s.stepsTitle}</h2>
          </Reveal>
        </div>
        <div className="flow">
          {s.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <article className="flow-step">
                <div className="flow-head">
                  <span className="flow-no">{i + 1}</span>
                  <span className="flow-icon"><Icon name={step.icon} size={22} /></span>
                </div>
                <h3 className="h3">{step.title}</h3>
                <p>{step.text}</p>
                {step.note && <p className="flow-note">{step.note}</p>}
              </article>
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-4">
          <a href="#rapport" className="btn btn-outline">{s.stepsCta}</a>
        </div>
      </div>
    </section>
  );
}

function Conditions({ c }) {
  return (
    <section className="section bg-soft" id="conditions">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">{c.eyebrow}</span>
            <h2 className="h2">{c.title}</h2>
            <p className="lead mt-2" style={{ maxWidth: '66ch', margin: '1rem auto 0' }}>{c.lead}</p>
          </Reveal>
        </div>
        <div className="grid grid-3">
          {c.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <div className="card">
                <div className="icon"><Icon name={card.icon} size={24} /></div>
                <h3 className="h3">{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="callout mt-4">
          <span className="callout-icon" aria-hidden="true"><Icon name="shield" size={20} /></span>
          <p>{c.callout}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Rules({ r, commitments }) {
  return (
    <>
      <section className="section" id="reglementation">
        <div className="container">
          <div className="eq-split text-first">
            <Reveal>
              <span className="eyebrow">{r.eyebrow}</span>
              <h2 className="h2">{r.title}</h2>
              <p className="lead">{r.lead}</p>
              <div className="status-box">
                <h3>{r.statusTitle}</h3>
                <p>{r.status}</p>
              </div>
              <a href="#engagements" className="btn btn-primary btn-sm mt-3">{r.cta}</a>
            </Reveal>
            <Reveal delay={100}>
              <ul className="rule-list">
                {r.items.map((item) => (
                  <li key={item}>
                    <span className="rule-check" aria-hidden="true"><Icon name="check" size={14} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-soft" id="engagements">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">{commitments.eyebrow}</span>
              <h2 className="h2">{commitments.title}</h2>
            </Reveal>
          </div>
          <div className="grid grid-4">
            {commitments.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
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
    </>
  );
}

function Report({ r }) {
  return (
    <section className="section" id="rapport">
      <div className="container">
        <div className="eq-split">
          <Reveal>
            {/* Maquette : donnees fictives, signalees sous le document */}
            <div className="report-doc" aria-describedby="report-sample">
              <div className="report-head">
                <span className="report-brand">VitiAero</span>
                <span className="report-kind">{r.docTitle}</span>
              </div>
              <dl className="report-grid">
                {r.fields.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="report-remarks">
                <dt>{r.remarksKey}</dt>
                <dd>{r.remarks}</dd>
              </div>
            </div>
            <p className="report-sample" id="report-sample">{r.sample}</p>
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow">{r.eyebrow}</span>
            <h2 className="h2">{r.title}</h2>
            <p className="lead">{r.lead}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Service() {
  const { t } = useI18n();
  const s = t.service;
  const q = t.quote;

  return (
    <div className="page">
      <section className="eq-hero">
        <div className="container">
          <div className="eq-hero-head">
            <span className="eyebrow">{s.eyebrow}</span>
            <h1 className="display">{s.title}</h1>
            <p className="lead">{s.lead}</p>
          </div>
        </div>
      </section>

      <Steps s={s} />
      <Conditions c={s.conditions} />
      <Rules r={s.rules} commitments={s.commitments} />
      <Report r={s.report} />

      <section className="section bg-soft">
        <div className="container">
          <Reveal className="cta-band">
            <span className="eyebrow">{q.eyebrow}</span>
            <h2 className="h1">{q.title}</h2>
            <p className="lead mt-2" style={{ maxWidth: '52ch', margin: '1rem auto 0' }}>{q.lead}</p>
            <Link to="/devis" className="btn btn-primary">{q.button}</Link>
          </Reveal>
          <ul className="service-notes">
            {s.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
