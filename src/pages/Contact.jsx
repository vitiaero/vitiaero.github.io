import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons.jsx';
import { api } from '../api.js';
import { company } from '../content.js';
import { BASE } from '../../shared/pricing.js';
import { useI18n } from '../i18n/index.jsx';

// Page Contact : coordonnees de l'entreprise et formulaire court, pour les
// visiteurs qui ne veulent pas tracer de parcelle.
// Les coordonnees viennent de `company` (src/content.js). Tant qu'une valeur
// est entre crochets, elle reste affichee telle quelle : rien n'est invente,
// et aucun lien clicable n'est cree vers une adresse qui n'existe pas.
const filled = (v) => !!v && !String(v).trim().startsWith('[');

// Numero de telephone au format d'un lien tel: (sans espaces).
const telHref = (v) => 'tel:' + String(v).replace(/[^\d+]/g, '');

function InfoCard({ icon, title, children }) {
  return (
    <div className="contact-card">
      <span className="contact-icon"><Icon name={icon} size={20} /></span>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

export default function Contact() {
  const { t } = useI18n();
  const c = t.contact;

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));

  async function submit(ev) {
    ev.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(c.errRequired);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(c.errEmail);
      return;
    }
    if (!consent) {
      setError(c.errConsent);
      return;
    }
    setSending(true);
    try {
      await api.post('/api/contact', form);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setForm({ name: '', email: '', phone: '', message: '', website: '' });
    setConsent(false);
    setSent(false);
  }

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{c.eyebrow}</span>
            <h1 className="h1">{c.title}</h1>
            <p className="lead mt-2">{c.lead}</p>
          </div>

          <div className="contact-cards">
            <InfoCard icon="phone" title={c.phoneTitle}>
              {filled(company.phone)
                ? <a href={telHref(company.phone)}>{company.phone}</a>
                : <span className="muted">{company.phone}</span>}
            </InfoCard>
            <InfoCard icon="mail" title={c.emailTitle}>
              {filled(company.email)
                ? <a href={`mailto:${company.email}`}>{company.email}</a>
                : <span className="muted">{company.email}</span>}
            </InfoCard>
            <InfoCard icon="pin" title={c.addressTitle}>
              <span className={filled(company.address) ? undefined : 'muted'}>
                {company.address}<br />{company.npa} {company.city}
              </span>
            </InfoCard>
            <InfoCard icon="map" title={c.areaTitle}>
              {c.areaText(BASE.label)}
            </InfoCard>
          </div>

          <div className="contact-layout">
            <div className="contact-form">
              <h2 className="h3 mb-2">{c.formTitle}</h2>

              {sent ? (
                <div className="alert alert-info">
                  <strong>{c.okTitle}</strong> {c.okText}
                  <div className="mt-3">
                    <button type="button" className="btn btn-outline btn-sm" onClick={reset}>{c.again}</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  {error && <div className="alert alert-error">{error}</div>}

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="ct-name">{c.name}</label>
                      <input id="ct-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} />
                    </div>
                    <div className="field">
                      <label htmlFor="ct-email">{c.email}</label>
                      <input id="ct-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="ct-phone">{c.phone}</label>
                    <input id="ct-phone" maxLength={40} className="input" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} />
                  </div>

                  <div className="field">
                    <label htmlFor="ct-message">{c.message}</label>
                    <textarea id="ct-message" maxLength={4000} className="textarea" value={form.message} onChange={update('message')} placeholder={c.messagePh} />
                  </div>

                  {/* Champ piege anti-robot : masque a l'ecran et aux lecteurs d'ecran */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                    <label>{c.honeypot}</label>
                    <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                  </div>

                  <label className="consent mt-2">
                    <input type="checkbox" checked={consent} onChange={(ev) => setConsent(ev.target.checked)} />
                    <span>
                      {c.consentBefore}
                      <Link to="/confidentialite" target="_blank" rel="noreferrer">{c.consentLink}</Link>
                      {c.consentAfter}
                    </span>
                  </label>

                  <button className="btn btn-primary mt-3" type="submit" disabled={sending}>
                    {sending ? c.sending : c.send}
                  </button>
                </form>
              )}
            </div>

            <aside className="contact-aside">
              <h2 className="h3">{c.estimateTitle}</h2>
              <p>{c.estimateText}</p>
              <Link to="/estimation" className="btn btn-primary">{t.common.requestEstimate}</Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
