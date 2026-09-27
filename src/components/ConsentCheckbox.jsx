// Case de confirmation de lecture des documents juridiques. La version affichee
// est celle envoyee au serveur, qui l'enregistre avec la date et la finalite.
import { Link } from 'react-router-dom';
import { currentVersion, versionDate } from '../../shared/legal/current.js';
import { FieldError } from '../forms.jsx';
import { useI18n } from '../i18n/index.jsx';

const ROUTES = { privacy: '/confidentialite', terms: '/conditions' };

export function consentPayload(docs = ['privacy']) {
  return Object.fromEntries(docs.map((d) => [d, currentVersion(d)]));
}

export default function ConsentCheckbox({ id, checked, onChange, error, docs = ['privacy'], purpose }) {
  const { t, locale } = useI18n();
  const c = t.consent;
  const fmt = (doc) => new Date(`${versionDate(currentVersion(doc))}T00:00:00Z`)
    .toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

  return (
    <>
      <label className="consent">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(ev) => onChange(ev.target.checked)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span>
          {c.read}
          {docs.map((doc, i) => (
            <span key={doc}>
              {i > 0 && c.and}
              <Link to={ROUTES[doc]} target="_blank" rel="noreferrer">{c[doc]}</Link>
              {c.version(fmt(doc))}
            </span>
          ))}
          {c.purpose[purpose] || '.'}
        </span>
      </label>
      <FieldError id={id} message={error} />
    </>
  );
}
