import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MapDraw from '../components/MapDraw.jsx';
import PrintHeader from '../components/PrintHeader.jsx';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import { useFormValidation, FieldError, FormErrorSummary, required, emailRule } from '../forms.jsx';
import { useI18n } from '../i18n/index.jsx';
import {
  BASE, PRICE_PER_HA, REFERENCE_PRICE, TRAVEL_BANDS, TRAVEL_REDUCTIONS, MIN_PER_PASS,
  computeEstimate, formatCHF, parcelsCenter,
} from '../../shared/pricing.js';

// Champs obligatoires de la derniere etape : verifies a la sortie du champ et
// a l'envoi. Les parcelles, elles, sont deja exigees pour passer l'etape 1.
const EST_RULES = {
  name: required((x) => x.nameRequired),
  email: emailRule,
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

// Montant, ou fourchette quand une situation particuliere est cochee.
function Total({ est, e }) {
  return est.totalMin === est.totalMax
    ? formatCHF(est.totalMin)
    : e.range(formatCHF(est.totalMin), formatCHF(est.totalMax));
}

// Kilometres au format de la langue (7,1 en francais, 7.1 en allemand et en anglais).
const formatKm = (km, locale) => Number(km).toLocaleString(locale, { maximumFractionDigits: 1 });

function distanceText(route, e, locale) {
  if (route.status === 'loading') return e.distanceLoading;
  if (route.status !== 'ok') return e.distanceUnknown;
  const km = formatKm(route.km, locale);
  return route.method === 'route' ? e.distanceRoute(km, route.from) : e.distanceDirect(km, route.from);
}

// Choix du nombre de passages (1 a 10), avec le prix par hectare de chacun.
function PassesPicker({ value, onChange, e }) {
  return (
    <div className="passes" role="radiogroup" aria-label={e.passesLabel}>
      {PRICE_PER_HA.map((price, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            className={`pass${value === n ? ' active' : ''}`}
            onClick={() => onChange(n)}
          >
            <span className="pass-n">{n}</span>
            <span className="pass-price">{formatCHF(price)}{e.perHa}</span>
          </button>
        );
      })}
    </div>
  );
}

// Grille complete des tarifs, repliee par defaut.
function RatesTable({ e }) {
  const r = e.rates;
  return (
    <details className="rates">
      <summary>{e.ratesToggle}</summary>
      <div className="rates-body">
        <div className="table-wrap">
          <table className="data">
            <caption>{r.treatmentTitle}</caption>
            <thead><tr><th>{r.passes}</th><th>{r.price}</th><th>{r.year}</th><th>{r.savings}</th></tr></thead>
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
              <thead><tr><th>{r.distance(BASE.label)}</th><th>{r.fee}</th></tr></thead>
              <tbody>
                {TRAVEL_BANDS.map((b) => (
                  <tr key={b.to}><td>{b.from} - {b.to} km</td><td>{formatCHF(b.fee)}</td></tr>
                ))}
                <tr><td>{r.over}</td><td>{r.quote}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="table-wrap">
            <table className="data">
              <caption>{r.reductionTitle}</caption>
              <tbody>
                {TRAVEL_REDUCTIONS.map((x) => (
                  <tr key={x.from}><td>{r.reductionPasses(x.from, x.to)}</td><td>{x.rate ? `-${Math.round(x.rate * 100)} %` : '0 %'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-wrap">
            <table className="data">
              <caption>{r.otherTitle}</caption>
              <tbody>
                {r.other.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
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
    <aside className="est-summary" aria-live="polite">
      <p className="est-summary-title">{e.summaryTitle}</p>
      <dl className="est-summary-rows">
        <div><dt>{e.summaryArea}</dt><dd>{fmt.ha} ha</dd></div>
        <div><dt>{e.summaryPasses}</dt><dd>{e.passUnit(est.passes)}</dd></div>
        <div><dt>{e.summaryDistance}</dt><dd>{distanceText(route, e, locale)}</dd></div>
      </dl>
      <div className="est-summary-total">
        <span>{e.totalYear}</span>
        <strong><Total est={est} e={e} /></strong>
        {est.ha > 0 && <small>{e.perHaYear(formatCHF(est.totalMin / est.ha))}</small>}
      </div>
      {!est.complete && <p className="est-summary-note">{e.travelPending}</p>}
    </aside>
  );
}

// Detail du prix (etape 4).
function Breakdown({ est, promo, e, locale }) {
  const l = e.lines;
  const ha = est.ha.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const tr = est.travel;
  const range = (r) => e.range(`+${formatCHF(r[0])}`, formatCHF(r[1]));
  return (
    <div className="est-bill">
      {/* Rappel des trois chiffres qui determinent le prix */}
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
          {tr.status === 'quote' && <span className="d">{l.travelQuote(formatKm(tr.km, locale))}</span>}
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

      {est.urgentAmount > 0 && (
        <div className="est-bill-line"><span className="k">{l.urgent}</span><span className="v">+{formatCHF(est.urgentAmount)}</span></div>
      )}
      {est.difficultRange && (
        <div className="est-bill-line"><span className="k">{l.difficult}</span><span className="v">{range(est.difficultRange)}</span></div>
      )}
      {est.dispersedRange && (
        <div className="est-bill-line"><span className="k">{l.dispersed}</span><span className="v">{range(est.dispersedRange)}</span></div>
      )}
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
  const { t, locale } = useI18n();
  const e = t.estimation;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [parcels, setParcels] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', commune: '', address: '',
    treatment: TREATMENTS[0], period: PERIODS[0], message: '',
    passes: 1, urgent: false, difficult: false, dispersed: false,
    website: '', // champ piege anti-robot, laisse vide par les humains
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const { errors, validateAll, fieldProps, summaryRef, reset: resetErrors } = useFormValidation(EST_RULES);

  // Code promo
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null); // { code, discount, description }
  const [promoMsg, setPromoMsg] = useState('');

  // Distance par la route depuis le depot (calculee par le serveur)
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

  // Pre-remplit les coordonnees si l'utilisateur est connecte
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  const totalArea = parcels.reduce((s, p) => s + (p.area_m2 || 0), 0);
  const fmt = formatArea(totalArea, locale);
  const treatmentLabel = (v) => e.treatments[TREATMENTS.indexOf(v)] || v;
  const periodLabel = (v) => e.periods[PERIODS.indexOf(v)] || v;

  const est = computeEstimate({
    areaM2: totalArea,
    passes: form.passes,
    distanceKm: route.status === 'ok' ? route.km : null,
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
    if (step === 1 && parcels.length === 0) { setError(e.errParcel); return; }
    if (step === 3) {
      if (!form.name.trim() || !form.email.trim()) { setError(e.errRequired); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError(e.errEmail); return; }
    }
    go(Math.min(4, step + 1));
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
    if (!consent) { setError(e.errConsent); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, parcels, promo_code: promo ? promo.code : null };
      const res = await api.post('/api/estimations', payload);
      navigate('/confirmation', {
        state: { id: res.id, area_m2: res.area_m2, connected: !!user, estimate: res.estimate },
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{e.eyebrow}</span>
            <h1 className="h1">{e.title}</h1>
            <p className="lead mt-2">{e.lead}</p>
          </div>

          {/* Indicateur d'etapes */}
          <div className="wizard-steps">
            {e.steps.map((label, i) => {
              const n = i + 1;
              const cls = n === step ? 'active' : n < step ? 'done' : '';
              return (
                <div className={`wizard-step ${cls}`} key={n}>
                  <span className="n">{n < step ? '✓' : n}</span>
                  <span className="label">{label}</span>
                </div>
              );
            })}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Etape 1 : carte */}
          {step === 1 && (
            <div>
              <MapDraw value={parcels} onChange={setParcels} />
              <div className="wizard-nav">
                <span />
                <button className="btn btn-primary" onClick={next}>{e.next}</button>
              </div>
            </div>
          )}

          {/* Etapes 2 et 3 : formulaire + resume du prix en direct */}
          {(step === 2 || step === 3) && (
            <div className="est-layout">
              <div>
                {step === 2 && (
                  <>
                    <h2 className="h3 mb-2">{e.needTitle}</h2>
                    <div className="field">
                      <span className="label-like">{e.passesLabel}</span>
                      <p className="hint" style={{ marginTop: 0 }}>{e.passesHint}</p>
                      <PassesPicker value={form.passes} onChange={(n) => setForm((f) => ({ ...f, passes: n }))} e={e} />
                    </div>
                    <RatesTable e={e} />
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

                {step === 3 && (
                  <>
                    <h2 className="h3 mb-2">{e.contactTitle}</h2>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="est-name">{e.name}</label>
                        <input id="est-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} placeholder="Marie Dupont" {...fieldProps('name', 'est-name', { ...form, consent })} />
                        <FieldError id="est-name" message={errors.name} />
                      </div>
                      <div className="field">
                        <label htmlFor="est-email">{e.email}</label>
                        <input id="est-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} placeholder="marie@exemple.ch" {...fieldProps('email', 'est-email', { ...form, consent })} />
                        <FieldError id="est-email" message={errors.email} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="est-phone">{e.phone}</label>
                        <input id="est-phone" maxLength={40} className="input" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} placeholder="079 000 00 00" />
                      </div>
                      <div className="field">
                        <label htmlFor="est-commune">{e.commune}</label>
                        <input id="est-commune" maxLength={120} className="input" value={form.commune} onChange={update('commune')} placeholder="Lutry" />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="est-address">{e.address}</label>
                      <input id="est-address" maxLength={200} className="input" value={form.address} onChange={update('address')} placeholder="Chemin des Vignes 3" />
                    </div>
                    <div className="field">
                      <label htmlFor="est-message">{e.message}</label>
                      <textarea id="est-message" maxLength={4000} className="textarea" value={form.message} onChange={update('message')} placeholder={e.messagePh} />
                    </div>

                    {/* Champ piege anti-robot : masque visuellement et pour les lecteurs d'ecran */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                      <label>{e.honeypot}</label>
                      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                    </div>

                    {/* Code promo */}
                    <div className="field">
                      <label htmlFor="est-promo">{e.promo}</label>
                      <div className="map-search">
                        <input id="est-promo" maxLength={40} className="input" value={promoInput} onChange={(ev) => setPromoInput(ev.target.value)} placeholder={e.promoPh} />
                        <button type="button" className="btn btn-outline btn-sm" onClick={validatePromo}>{e.validate}</button>
                      </div>
                      {promoMsg && (
                        <div className="hint" style={{ color: promo ? 'var(--accent-dark)' : 'var(--danger)' }}>{promoMsg}</div>
                      )}
                    </div>
                  </>
                )}

                <div className="wizard-nav">
                  <button className="btn btn-ghost" onClick={() => go(step - 1)}>{e.back}</button>
                  <button className="btn btn-primary" onClick={next}>{step === 3 ? e.seePrice : e.next}</button>
                </div>
              </div>

              <Summary est={est} area={totalArea} route={route} e={e} locale={locale} />
            </div>
          )}

          {/* Etape 4 : estimation detaillee + envoi */}
          {step === 4 && (
            <div className="est-result printable">
              <PrintHeader />
              <div className="est-hero">
                <span className="eyebrow">{e.summaryTitle}</span>
                <h2 className="h2">{e.resultTitle}</h2>
                <p className="lead">{e.resultLead}</p>
                <div className="est-hero-total">
                  <span>{e.totalYear}</span>
                  <strong><Total est={est} e={e} /></strong>
                  <small>
                    {fmt.ha} ha · {e.passUnit(est.passes)} · {distanceText(route, e, locale)}
                  </small>
                </div>
                {est.savings > 0 && <p className="est-savings">{e.savings(formatCHF(est.savings), est.passes)}</p>}
              </div>

              <Breakdown est={est} promo={promo} e={e} locale={locale} />

              <ul className="est-notes">
                {e.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>

              {/* Le navigateur enregistre la page en PDF depuis sa fenetre d'impression */}
              <div className="print-action no-print">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>
                  {t.printDoc.action}
                </button>
                <Link to="/devis" className="btn btn-outline btn-sm">{e.quoteCta}</Link>
                <span className="hint">{t.printDoc.hint}</span>
              </div>

              <h3 className="h3 mt-4 mb-2">{e.recapTitle}</h3>
              <div className="recap">
                <div className="line"><span className="k">{e.recap.parcels}</span><span className="v">{parcels.length}</span></div>
                <div className="line"><span className="k">{e.recap.area}</span><span className="v">{fmt.ha} ha ({fmt.m2} m2)</span></div>
                <div className="line"><span className="k">{e.recap.name}</span><span className="v">{form.name}</span></div>
                <div className="line"><span className="k">{e.recap.email}</span><span className="v">{form.email}</span></div>
                {form.phone && <div className="line"><span className="k">{e.recap.phone}</span><span className="v">{form.phone}</span></div>}
                {form.commune && <div className="line"><span className="k">{e.recap.commune}</span><span className="v">{form.commune}</span></div>}
                <div className="line"><span className="k">{e.recap.treatment}</span><span className="v">{treatmentLabel(form.treatment)}</span></div>
                <div className="line"><span className="k">{e.recap.period}</span><span className="v">{periodLabel(form.period)}</span></div>
                {promo && <div className="line"><span className="k">{e.recap.promo}</span><span className="v">{promo.code} (-{promo.discount}%)</span></div>}
                {form.message && <div className="line"><span className="k">{e.recap.message}</span><span className="v" style={{ maxWidth: '60%' }}>{form.message}</span></div>}
              </div>

              <p className="print-only print-foot">{t.printDoc.footer}</p>

              <div className="alert alert-info mt-3 no-print">{user ? e.infoUser : e.infoGuest}</div>

              <label className="consent mt-3 no-print">
                <input
                  id="est-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(ev) => { setConsent(ev.target.checked); if (ev.target.checked) resetErrors(); }}
                  aria-invalid={errors.consent ? 'true' : undefined}
                  aria-describedby={errors.consent ? 'est-consent-error' : undefined}
                />
                <span>{e.consentBefore}<Link to="/confidentialite" target="_blank" rel="noreferrer">{e.consentLink}</Link>{e.consentAfter}</span>
              </label>
              <FieldError id="est-consent" message={errors.consent} />
              <FormErrorSummary
                errors={errors}
                summaryRef={summaryRef}
                fields={[
                  { name: 'name', id: 'est-name', label: e.name },
                  { name: 'email', id: 'est-email', label: e.email },
                  { name: 'consent', id: 'est-consent', label: t.validation.consentLabel },
                ]}
              />

              <div className="wizard-nav no-print">
                <button className="btn btn-ghost" onClick={() => go(3)} disabled={submitting}>{e.back}</button>
                <button className="btn btn-primary" onClick={submit} disabled={submitting}>
                  {submitting ? e.sending : e.send}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
