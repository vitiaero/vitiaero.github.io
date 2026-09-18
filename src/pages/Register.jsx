import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useFormValidation, FieldError, FormErrorSummary, required, emailRule } from '../forms.jsx';
import { useI18n } from '../i18n/index.jsx';

// Champs verifies a la sortie du champ et a l'envoi.
const RULES = {
  name: required((x) => x.nameRequired),
  email: emailRule,
  password: (value, values, texts) => (String(value || '').length >= 8 ? null : texts.passwordShort),
  confirm: (value, values, texts) => (value === values.password ? null : texts.passwordMismatch),
  consent: (value, values, texts) => (values.consent ? null : texts.consentRequired),
};

export default function Register() {
  const { register } = useAuth();
  const { t } = useI18n();
  const r = t.register;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const { errors, validateAll, fieldProps, summaryRef, reset: resetErrors } = useFormValidation(RULES);
  const values = { ...form, consent };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!validateAll(values)) return;
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
            <FormErrorSummary
              errors={errors}
              summaryRef={summaryRef}
              fields={[
                { name: 'name', id: 'reg-name', label: r.name },
                { name: 'email', id: 'reg-email', label: r.email },
                { name: 'password', id: 'reg-password', label: r.password },
                { name: 'confirm', id: 'reg-confirm', label: r.confirm },
                { name: 'consent', id: 'reg-consent', label: t.validation.consentLabel },
              ]}
            />

            <form onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="reg-name">{r.name}</label>
                <input id="reg-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} {...fieldProps('name', 'reg-name', values)} />
                <FieldError id="reg-name" message={errors.name} />
              </div>
              <div className="field">
                <label htmlFor="reg-email">{r.email}</label>
                <input id="reg-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} {...fieldProps('email', 'reg-email', values)} />
                <FieldError id="reg-email" message={errors.email} />
              </div>
              <div className="field">
                <label htmlFor="reg-password">{r.password}</label>
                <input id="reg-password" maxLength={200} className="input" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} {...fieldProps('password', 'reg-password', values)} />
                <FieldError id="reg-password" message={errors.password} />
                <div className="hint">{r.passwordHint}</div>
              </div>
              <div className="field">
                <label htmlFor="reg-confirm">{r.confirm}</label>
                <input id="reg-confirm" maxLength={200} className="input" type="password" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} {...fieldProps('confirm', 'reg-confirm', values)} />
                <FieldError id="reg-confirm" message={errors.confirm} />
              </div>
              <label className="consent mb-2">
                <input
                  id="reg-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) resetErrors(); }}
                  aria-invalid={errors.consent ? 'true' : undefined}
                  aria-describedby={errors.consent ? 'reg-consent-error' : undefined}
                />
                <span>{r.consentBefore}<Link to="/confidentialite" target="_blank" rel="noreferrer">{r.consentLink}</Link>{r.consentAfter}</span>
              </label>
              <FieldError id="reg-consent" message={errors.consent} />
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
