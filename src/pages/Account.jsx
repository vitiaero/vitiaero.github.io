import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import { useI18n } from '../i18n/index.jsx';

function tierBadgeClass(tier) {
  return `badge badge-${tier.toLowerCase()}`;
}
function statusClass(status) {
  return `badge badge-${status.replace(/\s+/g, '')}`;
}
function formatDate(iso, locale) {
  try { return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return iso; }
}
function formatArea(m2, locale) {
  return (m2 / 10000).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
}

export default function Account() {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const a = t.account;
  const tierName = (name) => t.tiers[name] || name;
  const [loyalty, setLoyalty] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [l, r] = await Promise.all([api.get('/api/loyalty'), api.get('/api/estimations/mine')]);
        if (!active) return;
        setLoyalty(l);
        setRequests(r);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="page page-head"><div className="loading-block"><div className="spinner" /> {a.loading}</div></div>;
  }

  const tier = loyalty?.tier || 'Bronze';
  const points = loyalty?.points || 0;
  const tiers = loyalty?.tiers || [];
  // Progression vers le palier suivant
  const currentMin = tiers.filter((tr) => tr.min <= points).reduce((m, tr) => Math.max(m, tr.min), 0);
  const next = tiers.find((tr) => tr.min > points);
  const nextMin = next ? next.min : currentMin;
  const progress = next ? Math.min(100, Math.round(((points - currentMin) / (nextMin - currentMin)) * 100)) : 100;

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{a.eyebrow}</span>
            <h1 className="h1">{a.hello(user.name)}</h1>
          </div>

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            {/* Fidelite */}
            <div className="card">
              <div className="flex items-center justify-between">
                <h2 className="h3">{a.loyalty}</h2>
                <span className={tierBadgeClass(tier)}>{a.tier(tierName(tier))}</span>
              </div>
              <div className="points-big mt-2">{points} <span style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600 }}>{a.points}</span></div>

              {next ? (
                <>
                  <div className="progress"><span style={{ width: `${progress}%` }} /></div>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>
                    {a.toNext(loyalty.pointsToNext, tierName(loyalty.nextTier))}
                  </p>
                </>
              ) : (
                <p className="muted" style={{ fontSize: '0.9rem' }}>{a.top}</p>
              )}

              <div className="tier-track">
                {tiers.map((tr) => (
                  <div key={tr.name} className={`tier-card${tr.name === tier ? ' current' : ''}`}>
                    <div className="name">{tierName(tr.name)}</div>
                    <div className="req">{a.from(tr.min)}</div>
                  </div>
                ))}
              </div>

              <h3 className="h3 mt-3" style={{ fontSize: '1rem' }}>{a.history}</h3>
              <div className="table-wrap mt-2">
                <table className="data">
                  <thead>
                    <tr><th>{a.date}</th><th>{a.reason}</th><th style={{ textAlign: 'right' }}>{a.points}</th></tr>
                  </thead>
                  <tbody>
                    {loyalty.history.length === 0 && (
                      <tr><td colSpan={3} className="muted">{a.noHistory}</td></tr>
                    )}
                    {loyalty.history.map((h, i) => (
                      <tr key={i}>
                        <td>{formatDate(h.created_at, locale)}</td>
                        <td>{t.reasons[h.reason] || h.reason}</td>
                        <td style={{ textAlign: 'right', color: 'var(--accent-dark)', fontWeight: 600 }}>+{h.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demandes */}
            <div className="card">
              <div className="flex items-center justify-between">
                <h2 className="h3">{a.requests}</h2>
                <Link to="/estimation" className="btn btn-primary btn-sm">{a.newRequest}</Link>
              </div>

              {requests.length === 0 ? (
                <p className="muted mt-3">{a.noRequests}</p>
              ) : (
                <div className="table-wrap mt-3">
                  <table className="data">
                    <thead>
                      <tr><th>{a.number}</th><th>{a.date}</th><th>{a.area}</th><th>{a.status}</th></tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{formatDate(r.created_at, locale)}</td>
                          <td>{formatArea(r.area_m2, locale)} ha</td>
                          <td><span className={statusClass(r.status)}>{t.statuses[r.status] || r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
