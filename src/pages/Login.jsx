import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Login() {
  const { login } = useAuth();
  const { t } = useI18n();
  const l = t.login;
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Retour vers la page demandee : chemin interne uniquement (jamais une
      // adresse externe du type //exemple.com ou /\exemple.com).
      const from = location.state?.from;
      if (typeof from === 'string' && /^\/(?![/\\])/.test(from)) navigate(from, { replace: true });
      else navigate(user.role === 'admin' ? '/admin' : '/espace-client', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function fill(demoEmail, demoPass) {
    setEmail(demoEmail);
    setPassword(demoPass);
  }

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="auth-card">
            <h1 className="h2 text-center">{l.title}</h1>
            <p className="muted text-center mt-1 mb-3">{l.lead}</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="login-email">{l.email}</label>
                <input id="login-email" maxLength={190} className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="login-password">{l.password}</label>
                <input id="login-password" maxLength={200} className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? l.loading : l.submit}
              </button>
            </form>

            <p className="text-center mt-3 muted" style={{ fontSize: '0.92rem' }}>
              {l.noAccount} <Link to="/inscription" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t.common.createAccount}</Link>
            </p>

            {/* Comptes de demonstration : uniquement en developpement. En ligne, les
                mots de passe sont differents et ces boutons n'auraient aucun effet. */}
            {import.meta.env.DEV && (<>
            <div className="divider" />
            <p className="hint" style={{ marginBottom: '0.5rem' }}>{l.demo}</p>
            <div className="flex gap-1 wrap">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => fill('client@vitiaero.ch', 'client1234')}>{l.demoClient}</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => fill('admin@vitiaero.ch', 'admin1234')}>{l.demoAdmin}</button>
            </div>
            </>)}
          </div>
        </div>
      </section>
    </div>
  );
}
