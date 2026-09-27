import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import ConsentCheckbox from '../components/ConsentCheckbox.jsx';
import { FormsClosed } from '../components/Notices.jsx';
import { useFormValidation, FieldError, FormErrorSummary, required, emailRule } from '../forms.jsx';
import { FORMS_OPEN } from '../launch.js';
import { useI18n } from '../i18n/index.jsx';

const RULES = {
  name: required((x) => x.nameRequired),
  email: emailRule,
  password: (value, values, texts) => (String(value || '').length >= 8 ? null : texts.passwordShort),
  confirm: (value, values, texts) => (value === values.password ? null : texts.passwordMismatch),
  consent: (value, values, texts) => (values.consent ? null : texts.consentRequired),
};

export default function Register() {
  const { register } = useAuth();
  const { t, lang } = useI18n();
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
      await register(form.name, form.email, form.password, lang);
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

            {!FORMS_OPEN ? <FormsClosed /> : (
              <>
                {error && <div className="alert alert-error" role="alert">{error}</div>}
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
                    <input id="reg-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} aria-required="true" {...fieldProps('name', 'reg-name', values)} />
                    <FieldError id="reg-name" message={errors.name} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-email">{r.email}</label>
                    <input id="reg-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} aria-required="true" {...fieldProps('email', 'reg-email', values)} />
                    <FieldError id="reg-email" message={errors.email} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-password">{r.password}</label>
                    <input id="reg-password" maxLength={200} className="input" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} aria-required="true" {...fieldProps('password', 'reg-password', values)} />
                    <div className="hint">{r.passwordHint}</div>
                    <FieldError id="reg-password" message={errors.password} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-confirm">{r.confirm}</label>
                    <input id="reg-confirm" maxLength={200} className="input" type="password" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} aria-required="true" {...fieldProps('confirm', 'reg-confirm', values)} />
                    <FieldError id="reg-confirm" message={errors.confirm} />
                  </div>
                  <ConsentCheckbox
                    id="reg-consent"
                    checked={consent}
                    docs={['privacy', 'terms']}
                    purpose="account"
                    error={errors.consent}
                    onChange={(v) => { setConsent(v); if (v) resetErrors(); }}
                  />
                  <button className="btn btn-primary btn-block mt-3" type="submit" disabled={loading}>
                    {loading ? r.loading : r.submit}
                  </button>
                </form>
              </>
            )}

            <p className="text-center mt-3 muted small-print">
              {r.already} <Link to="/connexion" className="inline-link">{r.login}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
