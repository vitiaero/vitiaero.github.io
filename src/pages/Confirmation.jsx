import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/Icons.jsx';
import PrintHeader from '../components/PrintHeader.jsx';
import { useI18n } from '../i18n/index.jsx';
import { formatCHF } from '../../shared/pricing.js';

function formatArea(m2, locale) {
  return {
    m2: Math.round(m2 || 0).toLocaleString(locale),
    ha: ((m2 || 0) / 10000).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
  };
}

export default function Confirmation() {
  const { state } = useLocation();
  const { t, locale } = useI18n();
  const c = t.confirmation;
  const fmt = formatArea(state?.area_m2, locale);

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="confirm-hero printable">
            <PrintHeader number={state?.id} />
            <div className="confirm-check no-print"><Icon name="check" size={40} /></div>
            <span className="eyebrow">{c.eyebrow}</span>
            <h1 className="h1">{c.title}</h1>
            <p className="lead mt-2">{c.lead}</p>

            {state?.id && (
              <div className="area-box mt-4" style={{ textAlign: 'left', maxWidth: 420, margin: '2rem auto 0' }}>
                <div className="recap">
                  <div className="line"><span className="k">{c.number}</span><span className="v">#{state.id}</span></div>
                  <div className="line"><span className="k">{c.area}</span><span className="v">{fmt.ha} ha ({fmt.m2} m2)</span></div>
                  {state.estimate && (
                    <div className="line">
                      <span className="k">{c.estimate}</span>
                      <span className="v">
                        {state.estimate.totalMin === state.estimate.totalMax
                          ? formatCHF(state.estimate.totalMin)
                          : t.estimation.range(formatCHF(state.estimate.totalMin), formatCHF(state.estimate.totalMax))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {state?.id && <p className="print-only print-foot">{t.printDoc.footer}</p>}

            <div className="hero-actions no-print" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              {state?.id && (
                <button type="button" className="btn btn-outline" onClick={() => window.print()}>
                  {t.printDoc.action}
                </button>
              )}
              <Link to="/" className="btn btn-outline">{t.common.backHome}</Link>
              {state?.connected ? (
                <Link to="/espace-client" className="btn btn-primary">{c.seeRequests}</Link>
              ) : (
                <Link to="/inscription" className="btn btn-primary">{t.common.createAccount}</Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
