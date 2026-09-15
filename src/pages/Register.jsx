import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Register() {
  const { register } = useAuth();
  const { t } = useI18n();
  const r = t.register;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError(r.errLength);
      return;
    }
    if (form.password !== form.confirm) {
      setError(r.errMatch);
      return;
    }
    if (!consent) {
      setError(r.errConsent);
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/espace-client', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="auth-card">
            <h1 className="h2 text-center">{r.title}</h1>
            <p className="muted text-center mt-1 mb-3">{r.lead}</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="reg-name">{r.name}</label>
                <input id="reg-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} required />
              </div>
              <div className="field">
                <label htmlFor="reg-email">{r.email}</label>
                <input id="reg-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} required />
              </div>
              <div className="field">
                <label htmlFor="reg-password">{r.password}</label>
                <input id="reg-password" maxLength={200} className="input" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} required />
                <div className="hint">{r.passwordHint}</div>
              </div>
              <div className="field">
                <label htmlFor="reg-confirm">{r.confirm}</label>
                <input id="reg-confirm" maxLength={200} className="input" type="password" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} required />
              </div>
              <label className="consent mb-2">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{r.consentBefore}<Link to="/confidentialite" target="_blank" rel="noreferrer">{r.consentLink}</Link>{r.consentAfter}</span>
              </label>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? r.loading : r.submit}
              </button>
            </form>

            <p className="text-center mt-3 muted" style={{ fontSize: '0.92rem' }}>
              {r.already} <Link to="/connexion" style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.login}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
