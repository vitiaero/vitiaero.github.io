import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icons.jsx';
import { api } from '../api.js';
import { useI18n } from '../i18n/index.jsx';
import { PRICE_PER_HA } from '../../shared/pricing.js';

// Demande de devis personnalise, pour les vignerons qui preferent decrire leur
// parcelle plutot que de la tracer. Les fichiers joints sont lus dans le
// navigateur, encodes en base64, puis envoyes avec le formulaire.
const MAX_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

const readAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('lecture impossible'));
  reader.readAsDataURL(file);
});

const formatSize = (bytes) => `${Math.round(bytes / 1024)} Ko`;

export default function Devis() {
  const { t } = useI18n();
  const q = t.quote;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', commune: '',
    area_ha: '', passes: '', message: '', website: '',
  });
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));

  function addFiles(ev) {
    const picked = Array.from(ev.target.files || []);
    ev.target.value = '';
    setFileError('');
    const next = [...files];
    for (const file of picked) {
      if (next.length >= MAX_FILES) { setFileError(q.fileCount); break; }
      if (!TYPES.includes(file.type)) { setFileError(q.fileType); continue; }
      if (file.size > MAX_FILE_BYTES) { setFileError(q.fileTooBig); continue; }
      next.push(file);
    }
    setFiles(next);
  }

  const removeFile = (i) => setFiles(files.filter((_, k) => k !== i));

  async function submit(ev) {
    ev.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.commune.trim()) {
      setError(q.errRequired);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(q.errEmail);
      return;
    }
    if (!consent) {
      setError(q.errConsent);
      return;
    }
    setSending(true);
    try {
      const payload = {
        ...form,
        files: await Promise.all(files.map(async (f) => ({
          name: f.name, type: f.type, size: f.size, data: await readAsDataUrl(f),
        }))),
      };
      await api.post('/api/quote', payload);
      setSent(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setForm({ name: '', company: '', email: '', phone: '', commune: '', area_ha: '', passes: '', message: '', website: '' });
    setFiles([]);
    setConsent(false);
    setSent(false);
  }

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{q.eyebrow}</span>
            <h1 className="h1">{q.title}</h1>
            <p className="lead mt-2">{q.lead}</p>
          </div>

          <div className="contact-layout">
            <div className="contact-form">
              <h2 className="h3 mb-2">{q.formTitle}</h2>

              {sent ? (
                <div className="alert alert-info">
                  <strong>{q.okTitle}</strong> {q.okText}
                  <div className="mt-3">
                    <button type="button" className="btn btn-outline btn-sm" onClick={reset}>{q.again}</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  {error && <div className="alert alert-error">{error}</div>}

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="dv-name">{q.name}</label>
                      <input id="dv-name" maxLength={120} className="input" autoComplete="name" value={form.name} onChange={update('name')} />
                    </div>
                    <div className="field">
                      <label htmlFor="dv-company">{q.company}</label>
                      <input id="dv-company" maxLength={160} className="input" autoComplete="organization" value={form.company} onChange={update('company')} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="dv-email">{q.email}</label>
                      <input id="dv-email" maxLength={190} className="input" type="email" autoComplete="email" value={form.email} onChange={update('email')} />
                    </div>
                    <div className="field">
                      <label htmlFor="dv-phone">{q.phone}</label>
                      <input id="dv-phone" maxLength={40} className="input" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="dv-commune">{q.commune}</label>
                      <input id="dv-commune" maxLength={120} className="input" autoComplete="address-level2" value={form.commune} onChange={update('commune')} placeholder="Chexbres" />
                    </div>
                    <div className="field">
                      <label htmlFor="dv-area">{q.area}</label>
                      <input id="dv-area" maxLength={10} className="input" inputMode="decimal" value={form.area_ha} onChange={update('area_ha')} placeholder="1,2" />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="dv-passes">{q.passes}</label>
                    <select id="dv-passes" className="select" value={form.passes} onChange={update('passes')}>
                      <option value="">{q.passesAny}</option>
                      {PRICE_PER_HA.map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="dv-message">{q.message}</label>
                    <textarea id="dv-message" maxLength={4000} className="textarea" value={form.message} onChange={update('message')} placeholder={q.messagePh} />
                  </div>

                  {/* Pieces jointes : photo, capture de carte ou plan */}
                  <div className="field">
                    <span className="label-like">{q.filesLabel}</span>
                    <p className="hint" style={{ marginTop: 0 }}>{q.filesHint}</p>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                      {q.filesAdd}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      className="sr-only"
                      multiple
                      aria-label={q.filesLabel}
                      accept={TYPES.join(',')}
                      onChange={addFiles}
                    />
                    {fileError && <p className="import-msg">{fileError}</p>}
                    {files.length > 0 && (
                      <ul className="file-list">
                        {files.map((f, i) => (
                          <li key={`${f.name}-${i}`}>
                            <span className="file-icon" aria-hidden="true"><Icon name="tag" size={16} /></span>
                            <span className="file-name">{f.name}</span>
                            <span className="file-size">{formatSize(f.size)}</span>
                            <button type="button" onClick={() => removeFile(i)}>{q.filesRemove}</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Champ piege anti-robot */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                    <label>{t.contact.honeypot}</label>
                    <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                  </div>

                  <label className="consent mt-2">
                    <input type="checkbox" checked={consent} onChange={(ev) => setConsent(ev.target.checked)} />
                    <span>
                      {t.contact.consentBefore}
                      <Link to="/confidentialite" target="_blank" rel="noreferrer">{t.contact.consentLink}</Link>
                      {t.contact.consentAfter}
                    </span>
                  </label>

                  <button className="btn btn-primary mt-3" type="submit" disabled={sending}>
                    {sending ? q.sending : q.send}
                  </button>
                </form>
              )}
            </div>

            <aside className="contact-aside">
              <h2 className="h3">{q.mapTitle}</h2>
              <p>{q.mapText}</p>
              <Link to="/estimation" className="btn btn-primary">{q.mapCta}</Link>
            </aside>
          </div>

          <Reveal>
            <ul className="service-notes">
              {t.service.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
