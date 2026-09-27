import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import { NoOrderNotice } from '../components/Notices.jsx';
import { FICTIONAL, business } from '../launch.js';
import { validCredentials } from '../../shared/launch.js';
import { CREDENTIAL_LABELS } from '../../shared/legal/labels.js';
import { useI18n } from '../i18n/index.jsx';

// Page "Le service" : deroulement d'une intervention, conditions examinees,
// cadre suisse et rapport remis au client. Aucune donnee fictive : le rapport
// est presente comme un modele vide, et un justificatif (autorisation,
// controle, permis) n'apparait que s'il est saisi, complet et non echu.

const fmtDate = (iso, locale) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

function Steps({ s }) {
  return (
    <section className="section" id="etapes">
      <div className="container">
        <div className="section-head center">
          <Reveal><h2 className="h2">{s.stepsTitle}</h2></Reveal>
        </div>
        <ol className="flow">
          {s.steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 80}>
                <article className="flow-step">
                  <div className="flow-head">
                    <span className="flow-no" aria-hidden="true">{i + 1}</span>
                    <span className="flow-icon" aria-hidden="true"><Icon name={step.icon} size={22} /></span>
                  </div>
                  <h3 className="h3">{step.title}</h3>
                  <p>{step.text}</p>
                  {step.note && <p className="flow-note">{step.note}</p>}
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
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
            <p className="lead mt-2 section-lead">{c.lead}</p>
          </Reveal>
        </div>
        <div className="grid grid-3 grid-cards">
          {c.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <div className="card">
                <div className="icon" aria-hidden="true"><Icon name={card.icon} size={24} /></div>
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

// Justificatifs verifies : saisis dans shared/business.js, complets, non echus.
function Credentials({ r }) {
  const { t, lang, locale } = useI18n();
  const list = validCredentials(business);
  // Entreprise fictive : aucun justificatif n'est invente ; on explique ce
  // qu'une entreprise reelle devrait obtenir.
  if (FICTIONAL) {
    return (
      <div className="status-box">
        <h3>{t.fictional.credentialsTitle}</h3>
        <p>{t.fictional.credentialsText}</p>
      </div>
    );
  }
  return (
    <div className="status-box">
      <h3>{r.credentialsTitle}</h3>
      {list.length === 0 ? (
        <p>{r.credentialsNone}</p>
      ) : (
        <ul className="credential-list">
          {list.map((c) => (
            <li key={`${c.type}-${c.reference}`}>
              <strong>{CREDENTIAL_LABELS[c.type]?.[lang] || c.type}</strong>
              <span>{r.credentialRef(c.reference, c.authority)}</span>
              <span>
                {c.validUntil === false ? r.noExpiry : r.validUntil(fmtDate(c.validUntil, locale))}
                {' · '}
                {r.verifiedOn(fmtDate(c.verifiedOn, locale))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
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
              <Credentials r={r} />
              <a href="#engagements" className="btn btn-primary btn-sm mt-3">{r.cta}</a>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="h3 rule-list-title">{r.itemsTitle}</h3>
              <ul className="rule-list">
                {r.items.map((item) => (
                  <li key={item}>
                    <span className="rule-check" aria-hidden="true"><Icon name="check" size={14} /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="hint mt-2">{r.source}</p>
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
          <div className="grid grid-4 grid-cards">
            {commitments.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
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
    </>
  );
}

// Modele de rapport : les libelles seulement, sans aucune valeur inventee.
function Report({ r }) {
  return (
    <section className="section" id="rapport">
      <div className="container">
        <div className="eq-split">
          <Reveal>
            <div className="report-doc" aria-describedby="report-template">
              <div className="report-head">
                <span className="report-brand">VitiAero</span>
                <span className="report-kind">{r.docTitle}</span>
              </div>
              <dl className="report-grid">
                {r.fields.map((k) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className="report-blank"><span className="sr-only">{r.blankAria}</span></dd>
                  </div>
                ))}
              </dl>
              <dl className="report-remarks">
                <dt>{r.remarksKey}</dt>
                <dd className="report-blank report-blank-tall"><span className="sr-only">{r.blankAria}</span></dd>
              </dl>
            </div>
            <p className="report-sample" id="report-template">{r.template}</p>
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
            <p className="lead mt-2 cta-lead">{q.lead}</p>
            <Link to="/devis" className="btn btn-primary">{q.button}</Link>
            <NoOrderNotice className="mt-3" />
          </Reveal>
          <ul className="service-notes">
            {s.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
