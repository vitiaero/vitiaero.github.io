import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';
import { buildDocument, versionDate } from '../../shared/legal/index.js';
import { clearSiteStorage } from '../../shared/storage.js';
import { asset } from '../config.js';

// Pages juridiques construites depuis shared/legal : un texte par clause avec
// ses trois langues cote a cote, rempli avec les donnees reelles de
// shared/business.js. Ce rendu n'ajoute aucun contenu.

function Segment({ s }) {
  if (typeof s === 'string') return s;
  if (s.strong) return <strong>{s.strong}</strong>;
  if (s.mail) return <a href={`mailto:${s.mail}`}>{s.mail}</a>;
  if (s.link) {
    if (s.link.startsWith('file:')) return <a href={asset(s.link.slice(5))}>{s.text}</a>;
    if (s.link.startsWith('/')) return <Link to={s.link}>{s.text}</Link>;
    return <a href={s.link} target="_blank" rel="noopener noreferrer">{s.text}</a>;
  }
  return null;
}

const Content = ({ content }) => content.map((s, i) => <Segment key={i} s={s} />);

function ActionBlock({ block }) {
  const [done, setDone] = useState(false);
  if (block.action !== 'clearStorage') return null;
  return (
    <div className="legal-action">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => { clearSiteStorage(); setDone(true); }}>
        {block.label}
      </button>
      {done && <p className="hint mt-2" role="status">{block.done}</p>}
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'p': return <p><Content content={block.content} /></p>;
    case 'notice': return <div className="alert alert-info"><Content content={block.content} /></div>;
    case 'ul': return <ul>{block.items.map((item, i) => <li key={i}><Content content={item} /></li>)}</ul>;
    case 'lines': return <p className="legal-lines">{block.rows.map((r, i) => <span key={i}><Content content={r} /></span>)}</p>;
    case 'table':
      return (
        <div className="table-wrap mt-2">
          <table className="data">
            <thead><tr>{block.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{block.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Content content={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case 'action': return <ActionBlock block={block} />;
    default: return null;
  }
}

export default function Legal({ doc }) {
  const { lang, t, locale } = useI18n();
  const document = useMemo(() => buildDocument(doc, lang), [doc, lang]);
  const date = new Date(`${versionDate(document.version)}T00:00:00Z`)
    .toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <article className="legal" lang={locale}>
            <h1 className="h1">{document.title}</h1>
            <p className="muted legal-meta">{t.legal.updated(date)} · {t.legal.version(document.version)}</p>
            {document.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.title ? `legal-${s.id}` : undefined}>
                {s.title && <h2 className="h3" id={`legal-${s.id}`}>{s.title}</h2>}
                {s.blocks.map((b, i) => <Block key={i} block={b} />)}
              </section>
            ))}
            <div className="divider" />
            <Link to="/" className="btn btn-outline btn-sm">{t.common.backHome}</Link>
          </article>
        </div>
      </section>
    </div>
  );
}
