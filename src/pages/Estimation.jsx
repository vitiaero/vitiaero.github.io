import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MapDraw from '../components/MapDraw.jsx';
import PrintHeader from '../components/PrintHeader.jsx';
import ConsentCheckbox, { consentPayload } from '../components/ConsentCheckbox.jsx';
import { FormsClosed, NoOrderNotice } from '../components/Notices.jsx';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import { useFormValidation, FormErrorSummary, FieldError, required, emailRule } from '../forms.jsx';
import { FORMS_OPEN, business } from '../launch.js';
import { VAT_RE } from '../../shared/launch.js';
import { useI18n } from '../i18n/index.jsx';
import {
  BASE, PRICE_PER_HA, REFERENCE_PRICE, TRAVEL_BANDS, TRAVEL_REDUCTIONS, MIN_PER_PASS, TRAVEL_QUOTE_KM, WAITING_PER_HOUR,
  computeEstimate, formatCHF, parcelsCenter,
} from '../../shared/pricing.js';

// Champs obligatoires des coordonnees, verifies a la sortie du champ et a l'envoi.
const CONTACT_RULES = {
  name: required((x) => x.nameRequired),
  email: emailRule,
};
const CONSENT_RULES = {
  consent: (value, values, texts) => (values.consent ? null : texts.consentRequired),
};

// Valeurs enregistrees (en francais, lues par l'equipe dans l'administration).
// Les libelles affiches viennent de t.estimation.treatments / periods, meme ordre.
const TREATMENTS = [
  'Protection de la vigne (traitement foliaire)',
  'Traitement contre le mildiou / l\'oïdium',
  'Autre (à préciser)',
];
const PERIODS = ['Dès que possible', 'Au printemps', 'En été', 'À définir ensemble'];
const OPTIONS = ['urgent', 'difficult', 'dispersed'];

function formatArea(m2, locale) {
  return {
    m2: Math.round(m2).toLocaleString(locale),
    ha: (m2 / 10000).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  };
}

function Total({ est, e }) {
  return est.totalMin === est.totalMax ? formatCHF(est.totalMin) : e.range(formatCHF(est.totalMin), formatCHF(est.totalMax));
}

const formatKm = (km, locale) => Number(km).toLocaleString(locale, { maximumFractionDigits: 1 });

function distanceText(route, e, locale) {
  if (route.status === 'loading') return e.distanceLoading;
  if (route.status !== 'ok') return e.distanceUnknown;
  const km = formatKm(route.km, locale);
  return route.method === 'route' ? e.distanceRoute(km, route.from) : e.distanceDirect(km, route.from);
}

// Mention de TVA tiree de la configuration : jamais de taux suppose.
function vatNote(e) {
  const vat = business.identity.vat;
  if (vat === false) return e.vatNone;
  if (vat && VAT_RE.test(vat.number || '') && vat.ratePercent > 0) return e.vatIncluded(vat.ratePercent);
  return e.vatPending;
}

// Choix du nombre de passages (1 a 10) : boutons radio natifs, utilisables
// au clavier (fleches) et annonces par les lecteurs d'ecran.
function PassesPicker({ value, onChange, e }) {
  return (
    <fieldset className="passes">
      <legend className="label-like">{e.passesLabel}</legend>
      <p className="hint" id="passes-hint">{e.passesHint}</p>
      <div className="passes-grid">
        {PRICE_PER_HA.map((price, i) => {
          const n = i + 1;
          return (
            <label key={n} className={`pass${value === n ? ' active' : ''}`}>
              <input type="radio" name="passes" value={n} checked={value === n} onChange={() => onChange(n)} aria-describedby="passes-hint" />
              <span className="pass-n">{n}</span>
              <span className="pass-price">{formatCHF(price)}{e.perHa}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Pourcentage dans les usages de la langue (10 % en francais, 10% en anglais).
const pct = (rate, locale) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(rate);

function RatesTable({ e, locale }) {
  const r = e.rates;
  return (
    <details className="rates">
      <summary>{e.ratesToggle}</summary>
      <div className="rates-body">
        <div className="table-wrap">
          <table className="data">
            <caption>{r.treatmentTitle}</caption>
            <thead><tr><th scope="col">{r.passes}</th><th scope="col">{r.price}</th><th scope="col">{r.year}</th><th scope="col">{r.savings}</th></tr></thead>
            <tbody>
              {PRICE_PER_HA.map((price, i) => {
                const n = i + 1;
                return (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{formatCHF(price)}</td>
                    <td>{formatCHF(price * n)}</td>
                    <td>{n === 1 ? '-' : formatCHF((REFERENCE_PRICE - price) * n)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="rates-cols">
          <div className="table-wrap">
            <table className="data">
              <caption>{r.travelTitle}</caption>
              <thead><tr><th scope="col">{r.distance(BASE.label)}</th><th scope="col">{r.fee}</th></tr></thead>
              <tbody>
                {TRAVEL_BANDS.map((b) => <tr key={b.to}><td>{b.from} - {b.to} km</td><td>{formatCHF(b.fee)}</td></tr>)}
                <tr><td>{r.over(TRAVEL_QUOTE_KM)}</td><td>{r.quote}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="table-wrap">
            <table className="data">
              <caption>{r.reductionTitle}</caption>
              <tbody>
                {TRAVEL_REDUCTIONS.map((x) => (
                  <tr key={x.from}><td>{r.reductionPasses(x.from, x.to)}</td><td>{x.rate ? `-${pct(x.rate, locale)}` : pct(0, locale)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-wrap">
            <table className="data">
              <caption>{r.otherTitle}</caption>
              <tbody>
                {r.other(formatCHF(MIN_PER_PASS), formatCHF(WAITING_PER_HOUR)).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </details>
  );
}

// Resume du prix, mis a jour en direct (etapes 2 et 3).
function Summary({ est, area, route, e, locale }) {
  const fmt = formatArea(area, locale);
  return (
    <aside className="est-summary" aria-label={e.summaryTitle}>
      <p className="est-summary-title">{e.summaryTitle}</p>
      <dl className="est-summary-rows">
        <div><dt>{e.summaryArea}</dt><dd>{fmt.ha} ha</dd></div>
        <div><dt>{e.summaryPasses}</dt><dd>{e.passUnit(est.passes)}</dd></div>
        <div><dt>{e.summaryDistance}</dt><dd>{distanceText(route, e, locale)}</dd></div>
      </dl>
      <div className="est-summary-total" aria-live="polite">
        <span>{e.totalYear}</span>
        <strong><Total est={est} e={e} /></strong>
        {est.ha > 0 && <small>{e.perHaYear(formatCHF(est.totalMin / est.ha))}</small>}
      </div>
      {!est.complete && <p className="est-summary-note">{est.travel.approximate ? e.travelApprox : e.travelPending}</p>}
      <p className="est-summary-note">{e.summaryNoOrder}</p>
    </aside>
  );
}

function Breakdown({ est, promo, e, locale }) {
  const l = e.lines;
  const ha = est.ha.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const tr = est.travel;
  const range = (r) => e.range(`+${formatCHF(r[0])}`, formatCHF(r[1]));
  return (
    <div className="est-bill">
      <dl className="est-bill-facts">
        <div><dt>{l.factArea}</dt><dd>{ha} ha</dd></div>
        <div><dt>{l.factPasses}</dt><dd>{est.passes}</dd></div>
        <div><dt>{l.factUnit}</dt><dd>{formatCHF(est.unit)}{e.perHa}</dd></div>
      </dl>

      <div className="est-bill-line">
        <div>
          <span className="k">{l.treatment}</span>
          <span className="d">{l.treatmentDetail(est.passes, ha, formatCHF(est.unit))}</span>
          {est.minimumApplied && <span className="d">{l.minimum(formatCHF(MIN_PER_PASS))}</span>}
        </div>
        <span className="v">{formatCHF(est.treatment)}</span>
      </div>

      <div className="est-bill-line">
        <div>
          <span className="k">{l.travel}</span>
          {tr.status === 'ok' && <span className="d">{l.travelDetail(est.passes, formatCHF(tr.fee), formatKm(tr.km, locale))}</span>}
          {tr.status === 'ok' && tr.approximate && <span className="d">{e.travelApprox}</span>}
          {tr.status === 'quote' && <span className="d">{l.travelQuote(formatKm(tr.km, locale), TRAVEL_QUOTE_KM)}</span>}
          {tr.status === 'unknown' && <span className="d">{l.travelUnknown}</span>}
        </div>
        <span className="v">{tr.status === 'ok' ? formatCHF(tr.gross) : '-'}</span>
      </div>
      {tr.status === 'ok' && tr.discount > 0 && (
        <div className="est-bill-line minus">
          <span className="k">{l.travelReduction(Math.round(tr.reduction * 100))}</span>
          <span className="v">-{formatCHF(tr.discount)}</span>
        </div>
      )}

      {est.urgentAmount > 0 && <div className="est-bill-line"><span className="k">{l.urgent}</span><span className="v">+{formatCHF(est.urgentAmount)}</span></div>}
      {est.difficultRange && <div className="est-bill-line"><span className="k">{l.difficult}</span><span className="v">{range(est.difficultRange)}</span></div>}
      {est.dispersedRange && <div className="est-bill-line"><span className="k">{l.dispersed}</span><span className="v">{range(est.dispersedRange)}</span></div>}
      {est.promo > 0 && promo && (
        <div className="est-bill-line minus">
          <span className="k">{l.promo(promo.code, est.promoPercent)}</span>
          <span className="v">-{formatCHF(est.promo)}</span>
        </div>
      )}

      <div className="est-bill-total">
        <span>{l.total}</span>
        <strong><Total est={est} e={e} /></strong>
      </div>
    </div>
  );
}

export default function Estimation() {
  const { user } = useAuth();
  const { t, lang, locale } = useI18n();
  const e = t.estimation;
  const navigate = useNavigate();

  // Pre-lancement : aucune coordonnee demandee, l'estimation se calcule et
  // s'imprime, mais rien n'est envoye.
  const steps = FORMS_OPEN ? e.steps : e.stepsPrelaunch;
  const RESULT = steps.length; // derniere etape : le detail du prix
  const CONTACT = FORMS_OPEN ? 3 : null;

  const [step, setStep] = useState(1);
  const [parcels, setParcels] = useState([]);
  const mapRef = useRef(null);
  const errorRef = useRef(null);
  const headingRef = useRef(null);
  const firstRender = useRef(true);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', commune: '', address: '',
    treatment: TREATMENTS[0], period: PERIODS[0], message: '',
    passes: 1, urgent: false, difficult: false, dispersed: false,
    website: '', // champ piege anti-robot, laisse vide par les humains
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const contactValidation = useFormValidation(CONTACT_RULES);
  const consentValidation = useFormValidation(CONSENT_RULES);

  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null); // { code, discount, description }
  const [promoMsg, setPromoMsg] = useState('');

  // Distance depuis la base de depart (calculee par le serveur)
  const [route, setRoute] = useState({ status: 'idle' });
  const center = useMemo(() => parcelsCenter(parcels), [parcels]);

  useEffect(() => {
    if (!center) { setRoute({ status: 'idle' }); return undefined; }
    let active = true;
    setRoute((r) => ({ ...r, status: 'loading' }));
    const timer = setTimeout(async () => {
      try {
        const r = await api.post('/api/route-distance', center);
        if (active) setRoute({ status: 'ok', km: r.km, method: r.method, from: r.from });
      } catch {
        if (active) setRoute({ status: 'error' });
      }
    }, 500);
    return () => { active = false; clearTimeout(timer); };
  }, [center?.lat, center?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ block: 'nearest' });
  }, [error]);

  // A chaque etape, le focus va sur son titre : le lecteur d'ecran annonce
  // la nouvelle etape et la navigation au clavier repart du debut.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
  }, [step]);

  const totalArea = parcels.reduce((s, p) => s + (p.area_m2 || 0), 0);
  const fmt = formatArea(totalArea, locale);
  const treatmentLabel = (v) => e.treatments[TREATMENTS.indexOf(v)] || v;
  const periodLabel = (v) => e.periods[PERIODS.indexOf(v)] || v;

  const est = computeEstimate({
    areaM2: totalArea,
    passes: form.passes,
    distanceKm: route.status === 'ok' ? route.km : null,
    distanceApproximate: route.status === 'ok' && route.method !== 'route',
    urgent: form.urgent,
    difficult: form.difficult,
    dispersed: form.dispersed,
    promoPercent: promo ? promo.discount : 0,
  });

  const update = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const toggle = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.checked }));

  function go(n) {
    setError('');
    setStep(n);
    window.scrollTo(0, 0);
  }

  function next() {
    if (step === 1) {
      const list = mapRef.current ? mapRef.current.commitDraft() : parcels;
      if (list === null) { setError(e.errDraft); return; }
      if (list.length === 0) { setError(e.errParcel); return; }
    }
    if (step === CONTACT && !contactValidation.validateAll(form)) return;
    go(Math.min(RESULT, step + 1));
  }

  async function validatePromo() {
    setPromoMsg('');
    const code = promoInput.trim();
    if (!code) return;
    try {
      const res = await api.post('/api/promo/validate', { code });
      if (res.valid) {
        setPromo({ code: res.code, discount: res.discount, description: res.description });
        setPromoMsg(e.promoOk(res.discount, res.description));
      } else {
        setPromo(null);
        setPromoMsg(t.serverErrors[res.error] || e.promoInvalid);
      }
    } catch {
      setPromo(null);
      setPromoMsg(e.promoError);
    }
  }

  async function submit() {
    setError('');
    if (!consentValidation.validateAll({ consent })) return;
    setSubmitting(true);
    try {
      const payload = { ...form, lang, parcels, promo_code: promo ? promo.code : null, consent: consentPayload(['privacy']) };
      const res = await api.post('/api/estimations', payload);
      navigate('/confirmation', { state: { id: res.id, area_m2: res.area_m2, connected: !!user, estimate: res.estimate } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  const stepTitle = step === 1 ? e.mapStepTitle : step === 2 ? e.needTitle : step === CONTACT ? e.contactTitle : e.resultTitle;

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{e.eyebrow}</span>
            <h1 className="h1">{e.title}</h1>
            <p className="lead mt-2">{e.lead}</p>
          </div>

          <ol className="wizard-steps" aria-label={e.stepsAria}>
            {steps.map((label, i) => {
              const n = i + 1;
              const cls = n === step ? 'active' : n < step ? 'done' : '';
              return (
                <li className={`wizard-step ${cls}`} key={label} aria-current={n === step ? 'step' : undefined}>
                  <span className="n" aria-hidden="true">{n < step ? '✓' : n}</span>
                  <span className="label">{label}</span>
                  {n < step && <span className="sr-only">{e.stepDone}</span>}
                </li>
              );
            })}
          </ol>

          <h2 className="h3 step-heading" tabIndex={-1} ref={headingRef}>{e.stepOf(step, RESULT, stepTitle)}</h2>

          {error && <div className="alert alert-error" role="alert" ref={errorRef}>{error}</div>}

          {step === 1 && (
            <div>
              <MapDraw ref={mapRef} value={parcels} onChange={setParcels} />
              <div className="wizard-nav">
                <span />
                <button type="button" className="btn btn-primary" onClick={next}>{e.next}</button>
              </div>
            </div>
          )}

          {(step === 2 || step === CONTACT) && (
            <div className="est-layout">
              <div>
                {step === 2 && (
                  <>
                    <PassesPicker value={form.passes} onChange={(n) => setForm((f) => ({ ...f, passes: n }))} e={e} />
                    <RatesTable e={e} locale={locale} />
                    <p className="rates-note">{e.ratesNote}</p>

                    <div className="form-row mt-3">
                      <div className="field">
                        <label htmlFor="est-treatment">{e.treatment}</label>
                        <select id="est-treatment" className="select" value={form.treatment} onChange={update('treatment')}>
                          {TREATMENTS.map((v) => <option key={v} value={v}>{treatmentLabel(v)}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="est-period">{e.period}</label>
                        <select id="est-period" className="select" value={form.period} onChange={update('period')}>
                          {PERIODS.map((v) => <option key={v} value={v}>{periodLabel(v)}</option>)}
                        </select>
                      </div>
                    </div>

                    <fieldset className="est-options">
                      <legend>{e.optionsLabel}</legend>
                      {OPTIONS.map((k) => (
                        <label key={k} className={`est-option${form[k] ? ' on' : ''}`}>
                          <input type="checkbox" checked={form[k]} onChange={toggle(k)} />
                          <span>
                            <strong>{e.options[k].label}</strong>
                            <small>{e.options[k].hint}</small>
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  </>
                )}

                {step === CONTACT && (
                  <>
                    <FormErrorSummary
                      errors={contactValidation.errors}
                      summaryRef={contactValidation.summaryRef}
                      fields={[
                        { name: 'name', id: 'est-name', label: e.name },
                        { name: 'email', id: 'est-email', label: e.email },
                      ]}
                    />
                    <p className="hint">{e.requiredHint}</p>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="est-name">{e.name}</label>
                        <input id="est-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} aria-required="true" {...contactValidation.fieldProps('name', 'est-name', form)} />
                        <FieldError id="est-name" message={contactValidation.errors.name} />
                      </div>
                      <div className="field">
                        <label htmlFor="est-email">{e.email}</label>
                        <input id="est-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} aria-required="true" {...contactValidation.fieldProps('email', 'est-email', form)} />
                        <FieldError id="est-email" message={contactValidation.errors.email} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="est-phone">{e.phone}</label>
                        <input id="est-phone" maxLength={40} className="input" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} />
                      </div>
                      <div className="field">
                        <label htmlFor="est-commune">{e.commune}</label>
                        <input id="est-commune" maxLength={120} className="input" autoComplete="address-level2" value={form.commune} onChange={update('commune')} />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="est-address">{e.address}</label>
                      <input id="est-address" maxLength={200} className="input" value={form.address} onChange={update('address')} />
                    </div>
                    <div className="field">
                      <label htmlFor="est-message">{e.message}</label>
                      <textarea id="est-message" maxLength={4000} className="textarea" value={form.message} onChange={update('message')} aria-describedby="est-message-hint" />
                      <p className="hint" id="est-message-hint">{e.messageHint}</p>
                    </div>

                    <div aria-hidden="true" className="honeypot">
                      <label htmlFor="est-website">{e.honeypot}</label>
                      <input id="est-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                    </div>

                    <div className="field">
                      <label htmlFor="est-promo">{e.promo}</label>
                      <div className="map-search">
                        <input id="est-promo" maxLength={40} className="input" value={promoInput} onChange={(ev) => setPromoInput(ev.target.value)} autoComplete="off" />
                        <button type="button" className="btn btn-outline btn-sm" onClick={validatePromo}>{e.validate}</button>
                      </div>
                      {promoMsg && <p className={`hint ${promo ? 'hint-ok' : 'hint-error'}`} role="status">{promoMsg}</p>}
                    </div>
                  </>
                )}

                <div className="wizard-nav">
                  <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>{e.back}</button>
                  <button type="button" className="btn btn-primary" onClick={next}>{step === RESULT - 1 ? e.seePrice : e.next}</button>
                </div>
              </div>

              <Summary est={est} area={totalArea} route={route} e={e} locale={locale} />
            </div>
          )}

          {step === RESULT && (
            <div className="est-result printable">
              <PrintHeader />
              <div className="est-hero">
                <span className="eyebrow">{e.summaryTitle}</span>
                <p className="lead">{e.resultLead}</p>
                <div className="est-hero-total">
                  <span>{e.totalYear}</span>
                  <strong><Total est={est} e={e} /></strong>
                  <small>{fmt.ha} ha · {e.passUnit(est.passes)} · {distanceText(route, e, locale)}</small>
                </div>
                {est.savings > 0 && <p className="est-savings">{e.savings(formatCHF(est.savings), est.passes)}</p>}
              </div>

              <NoOrderNotice variant="estimate" className="mt-3" />

              <Breakdown est={est} promo={promo} e={e} locale={locale} />

              <ul className="est-notes">
                {e.notes(formatCHF(WAITING_PER_HOUR)).map((n) => <li key={n}>{n}</li>)}
                <li>{vatNote(e)}</li>
              </ul>

              <div className="print-action no-print">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>{t.printDoc.action}</button>
                <Link to="/devis" className="btn btn-outline btn-sm">{e.quoteCta}</Link>
                <span className="hint">{t.printDoc.hint}</span>
              </div>

              <h3 className="h3 mt-4 mb-2">{e.recapTitle}</h3>
              <dl className="recap">
                <div className="line"><dt className="k">{e.recap.parcels}</dt><dd className="v">{parcels.length}</dd></div>
                <div className="line"><dt className="k">{e.recap.area}</dt><dd className="v">{fmt.ha} ha ({fmt.m2} m²)</dd></div>
                {FORMS_OPEN && <div className="line"><dt className="k">{e.recap.name}</dt><dd className="v">{form.name}</dd></div>}
                {FORMS_OPEN && <div className="line"><dt className="k">{e.recap.email}</dt><dd className="v">{form.email}</dd></div>}
                {form.phone && <div className="line"><dt className="k">{e.recap.phone}</dt><dd className="v">{form.phone}</dd></div>}
                {form.commune && <div className="line"><dt className="k">{e.recap.commune}</dt><dd className="v">{form.commune}</dd></div>}
                <div className="line"><dt className="k">{e.recap.treatment}</dt><dd className="v">{treatmentLabel(form.treatment)}</dd></div>
                <div className="line"><dt className="k">{e.recap.period}</dt><dd className="v">{periodLabel(form.period)}</dd></div>
                {promo && <div className="line"><dt className="k">{e.recap.promo}</dt><dd className="v">{promo.code} (-{promo.discount}%)</dd></div>}
                {form.message && <div className="line"><dt className="k">{e.recap.message}</dt><dd className="v recap-message">{form.message}</dd></div>}
              </dl>

              <p className="print-only print-foot">{t.printDoc.footer}</p>

              {!FORMS_OPEN ? (
                <div className="mt-3 no-print">
                  <FormsClosed />
                  <div className="wizard-nav">
                    <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>{e.back}</button>
                    <span />
                  </div>
                </div>
              ) : (
                <div className="no-print">
                  <div className="alert alert-info mt-3">{user ? e.infoUser : e.infoGuest}</div>
                  <FormErrorSummary
                    errors={consentValidation.errors}
                    summaryRef={consentValidation.summaryRef}
                    fields={[{ name: 'consent', id: 'est-consent', label: t.validation.consentLabel }]}
                  />
                  <ConsentCheckbox
                    id="est-consent"
                    checked={consent}
                    purpose="estimation"
                    error={consentValidation.errors.consent}
                    onChange={(v) => { setConsent(v); if (v) consentValidation.reset(); }}
                  />
                  <div className="wizard-nav">
                    <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)} disabled={submitting}>{e.back}</button>
                    <button type="button" className="btn btn-primary" onClick={submit} disabled={submitting}>
                      {submitting ? e.sending : e.send}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
