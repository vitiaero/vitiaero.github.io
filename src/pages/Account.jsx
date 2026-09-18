import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import { useI18n } from '../i18n/index.jsx';
import MapDraw from '../components/MapDraw.jsx';
import PrintHeader from '../components/PrintHeader.jsx';
import Icon from '../components/Icons.jsx';
import { formatCHF } from '../../shared/pricing.js';

function statusClass(status) {
  return `badge badge-${String(status).replace(/\s+/g, '')}`;
}
function formatDate(value, locale) {
  try { return new Date(value).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return value; }
}
function formatHa(ha, locale) {
  return Number(ha || 0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function areaHa(m2) {
  return (m2 || 0) / 10000;
}
function yearOf(date) {
  return String(date || '').slice(0, 4);
}
function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function Account() {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const a = t.account;
  const [requests, setRequests] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [r, i] = await Promise.all([
          api.get('/api/estimations/mine'),
          api.get('/api/interventions/mine'),
        ]);
        if (!active) return;
        setRequests(r);
        setInterventions(i);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // Parcelles connues : celles tracees dans les demandes d'estimation.
  const parcels = useMemo(
    () => requests.flatMap((r) => (r.parcels || []).map((p, index) => ({
      ...p,
      index,
      commune: r.commune,
      requestId: r.id,
    }))),
    [requests]
  );
  const followedArea = useMemo(() => parcels.reduce((sum, p) => sum + areaHa(p.area_m2), 0), [parcels]);

  const done = useMemo(() => interventions.filter((i) => i.status === 'Realisee'), [interventions]);
  const upcoming = useMemo(
    () => interventions
      .filter((i) => i.status === 'Planifiee' && i.date >= isoToday())
      .sort((x, y) => x.date.localeCompare(y.date)),
    [interventions]
  );
  const treatedThisYear = useMemo(() => {
    const year = String(new Date().getFullYear());
    return done.filter((i) => yearOf(i.date) === year).reduce((sum, i) => sum + Number(i.area_ha || 0), 0);
  }, [done]);

  const shown = useMemo(() => {
    if (filter === 'done') return done;
    if (filter === 'planned') return interventions.filter((i) => i.status === 'Planifiee');
    return interventions;
  }, [filter, interventions, done]);

  // Historique groupe par annee, de la plus recente a la plus ancienne.
  const years = useMemo(() => {
    const map = new Map();
    for (const item of shown) {
      const year = yearOf(item.date);
      if (!map.has(year)) map.set(year, []);
      map.get(year).push(item);
    }
    return [...map.entries()].sort((x, y) => y[0].localeCompare(x[0]));
  }, [shown]);

  if (loading) {
    return <div className="page page-head"><div className="loading-block"><div className="spinner" /> {a.loading}</div></div>;
  }

  // Quatrieme tuile : la prochaine date si une intervention est planifiee,
  // sinon la derniere realisee. Un compte tout neuf affiche l'attente.
  const lastDone = done[0];
  const nextTile = upcoming.length > 0
    ? { value: formatDate(upcoming[0].date, locale), label: a.tiles.next, note: upcoming[0].parcel_label || upcoming[0].commune || '' }
    : lastDone
      ? { value: formatDate(lastDone.date, locale), label: a.tiles.last, note: lastDone.parcel_label || lastDone.commune || '' }
      : { value: a.tiles.none, label: a.tiles.next, note: a.tiles.noNext };

  const tiles = [
    { icon: 'map', value: String(parcels.length), label: a.tiles.parcels },
    { icon: 'target', value: `${formatHa(followedArea, locale)} ha`, label: a.tiles.area },
    { icon: 'check', value: String(done.length), label: a.tiles.done, note: a.tiles.thisYear(formatHa(treatedThisYear, locale)) },
    { icon: 'calendar', ...nextTile },
  ];

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head no-print">
            <span className="eyebrow">{a.eyebrow}</span>
            <h1 className="h1">{a.hello(user.name)}</h1>
            <p className="lead mt-2">{a.lead}</p>
          </div>

          {failed && <div className="alert alert-error no-print">{a.failed}</div>}

          <div className="printable">
            <PrintHeader title={a.printTitle} />

            {/* Resume */}
            <div className="acc-tiles">
              {tiles.map((tile) => (
                <div key={tile.icon} className="acc-tile">
                  <Icon name={tile.icon} size={20} />
                  <div className="num">{tile.value}</div>
                  <div className="lbl">{tile.label}</div>
                  {tile.note ? <div className="note">{tile.note}</div> : null}
                </div>
              ))}
            </div>

            {/* Historique des interventions */}
            <div className="card acc-block">
              <div className="flex items-center justify-between wrap gap-1">
                <h2 className="h3">{a.history.title}</h2>
                {interventions.length > 0 && (
                  <div className="acc-filter no-print" role="group" aria-label={a.history.filterAria}>
                    {[['all', a.history.all], ['done', a.history.doneOnly], ['planned', a.history.plannedOnly]].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={filter === key ? 'active' : ''}
                        aria-pressed={filter === key}
                        onClick={() => setFilter(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {interventions.length === 0 ? (
                <p className="muted mt-3">{a.history.empty}</p>
              ) : shown.length === 0 ? (
                <p className="muted mt-3">{a.history.emptyFilter}</p>
              ) : (
                years.map(([year, items]) => {
                  const doneItems = items.filter((i) => i.status === 'Realisee');
                  const treated = doneItems.reduce((sum, i) => sum + Number(i.area_ha || 0), 0);
                  return (
                    <div key={year} className="acc-year">
                      <div className="acc-year-head">
                        <h3>{year}</h3>
                        <span className="muted">{a.history.yearSummary(items.length, doneItems.length, formatHa(treated, locale))}</span>
                      </div>
                      <ol className="timeline">
                        {items.map((item) => (
                          <li key={item.id} className={`tl-item tl-${item.status.toLowerCase()}`}>
                            <div className="tl-date">
                              <span className="d">{formatDate(item.date, locale)}</span>
                              <span className={statusClass(item.status)}>{t.interventionStatuses[item.status] || item.status}</span>
                            </div>
                            <div className="tl-body">
                              <h4>{item.parcel_label || item.commune || a.history.intervention}</h4>
                              <dl className="tl-facts">
                                {item.commune && <div><dt>{a.fields.commune}</dt><dd>{item.commune}</dd></div>}
                                {item.area_ha ? <div><dt>{a.fields.area}</dt><dd>{formatHa(item.area_ha, locale)} ha</dd></div> : null}
                                {item.passes ? <div><dt>{a.fields.passes}</dt><dd>{item.passes}</dd></div> : null}
                                {item.treatment && <div><dt>{a.fields.treatment}</dt><dd>{item.treatment}</dd></div>}
                                {item.product && <div><dt>{a.fields.product}</dt><dd>{item.product}</dd></div>}
                                {item.conditions && <div><dt>{a.fields.conditions}</dt><dd>{item.conditions}</dd></div>}
                                {item.duration_min ? <div><dt>{a.fields.duration}</dt><dd>{a.fields.minutes(item.duration_min)}</dd></div> : null}
                                {item.estimation_id ? <div><dt>{a.fields.request}</dt><dd>#{item.estimation_id}</dd></div> : null}
                              </dl>
                              {item.notes && <p className="tl-notes">{item.notes}</p>}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })
              )}
            </div>

            {/* Demandes d'estimation */}
            <div className="card acc-block">
              <div className="flex items-center justify-between wrap gap-1">
                <h2 className="h3">{a.requests.title}</h2>
                <Link to="/estimation" className="btn btn-primary btn-sm no-print">{a.requests.new}</Link>
              </div>

              {requests.length === 0 ? (
                <p className="muted mt-3">{a.requests.empty}</p>
              ) : (
                <div className="table-wrap mt-3">
                  <table className="data">
                    <thead>
                      <tr>
                        <th>{a.requests.number}</th>
                        <th>{a.fields.date}</th>
                        <th>{a.fields.commune}</th>
                        <th>{a.fields.area}</th>
                        <th>{a.requests.estimate}</th>
                        <th>{a.requests.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{formatDate(r.created_at, locale)}</td>
                          <td>{r.commune || '-'}</td>
                          <td>{formatHa(areaHa(r.area_m2), locale)} ha</td>
                          <td>
                            {r.estimate
                              ? (r.estimate.totalMin === r.estimate.totalMax
                                ? formatCHF(r.estimate.totalMin)
                                : t.estimation.range(formatCHF(r.estimate.totalMin), formatCHF(r.estimate.totalMax)))
                              : '-'}
                          </td>
                          <td><span className={statusClass(r.status)}>{t.statuses[r.status] || r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {requests.length > 0 && <p className="hint mt-2">{a.requests.note}</p>}
            </div>

            <p className="print-only print-foot">{a.printFooter}</p>
          </div>

          {/* Parcelles : carte et liste (hors impression) */}
          {parcels.length > 0 && (
            <div className="card acc-block no-print">
              <h2 className="h3">{a.parcels.title}</h2>
              <p className="muted mt-1">{a.parcels.lead}</p>
              <div className="acc-map mt-3">
                <MapDraw value={parcels} readOnly />
              </div>
              <div className="table-wrap mt-3">
                <table className="data">
                  <thead>
                    <tr>
                      <th>{a.parcels.parcel}</th>
                      <th>{a.fields.commune}</th>
                      <th>{a.fields.area}</th>
                      <th>{a.parcels.fromRequest}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcels.map((p) => (
                      <tr key={`${p.requestId}-${p.index}`}>
                        <td>{t.map.parcel(p.index + 1)}</td>
                        <td>{p.commune || '-'}</td>
                        <td>{formatHa(areaHa(p.area_m2), locale)} ha</td>
                        <td>#{p.requestId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Informations du compte */}
          <div className="card acc-block no-print">
            <h2 className="h3">{a.info.title}</h2>
            <dl className="tl-facts mt-2">
              <div><dt>{a.info.name}</dt><dd>{user.name}</dd></div>
              <div><dt>{a.info.email}</dt><dd>{user.email}</dd></div>
              <div><dt>{a.info.since}</dt><dd>{formatDate(user.created_at, locale)}</dd></div>
            </dl>
            <div className="print-action">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>
                {a.print}
              </button>
              <Link to="/contact" className="btn btn-outline btn-sm">{a.info.contact}</Link>
              <p className="hint">{t.printDoc.hint}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
