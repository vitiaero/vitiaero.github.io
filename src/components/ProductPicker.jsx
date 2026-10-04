import { useEffect, useMemo, useState } from 'react';
import { asset } from '../config.js';

// Choix des produits phytosanitaires a appliquer, parmi ceux que l'OSAV
// autorise en vigne (Index des produits phytosanitaires, psm.admin.ch).
// La liste (public/data/produits-vigne.json) est chargee a l'ouverture de
// l'etape « Votre besoin ». Recherche par nom, numero W, matiere active ou
// maladie ; tri par maladie ciblee (de la plus frequente en vigne a la moins
// frequente, puis A-Z) ou alphabetique. Six produits au maximum.
export const MAX_PRODUCTS = 6;

// Recherche sans accents ni majuscules (« oidium » trouve « oïdium »).
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

let cache = null; // la liste ne change pas pendant la visite

export default function ProductPicker({ value, onChange, p }) {
  const [data, setData] = useState(cache);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('group');

  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    fetch(asset('/data/produits-vigne.json'))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => { cache = d; if (active) setData(d); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);

  const chosen = new Set(value.map((x) => x.w));
  const full = value.length >= MAX_PRODUCTS;

  // Produits filtres, puis ranges en groupes (par maladie) ou en une liste A-Z.
  const sections = useMemo(() => {
    if (!data) return [];
    // Chaque mot doit se retrouver quelque part (« oidium soufre »).
    const words = fold(query).split(/\s+/).filter(Boolean);
    const list = words.length
      ? data.products.filter((x) => {
        const text = fold([x.n, x.w, ...x.s, ...x.p].join(' '));
        return words.every((w) => text.includes(w));
      })
      : data.products;
    if (sort === 'az') return [{ key: 'az', items: list }];
    return data.groups
      .map((g) => ({ key: g, items: list.filter((x) => x.g === g) }))
      .filter((s) => s.items.length > 0);
  }, [data, query, sort]);

  const count = sections.reduce((n, s) => n + s.items.length, 0);

  function toggle(x) {
    if (chosen.has(x.w)) onChange(value.filter((v) => v.w !== x.w));
    else if (!full) onChange([...value, { n: x.n, w: x.w }]);
  }

  return (
    <fieldset className="pp">
      <legend className="pp-legend">{p.label}</legend>
      <p className="hint pp-hint">{p.hint}</p>

      {value.length > 0 && (
        <ul className="pp-chosen" aria-label={p.chosen}>
          {value.map((x) => (
            <li key={x.w}>
              <span>{x.n}</span>
              <button type="button" onClick={() => onChange(value.filter((v) => v.w !== x.w))} aria-label={p.remove(x.n)}>×</button>
            </li>
          ))}
        </ul>
      )}

      <div className="pp-tools">
        <input
          type="search"
          className="input"
          placeholder={p.searchPh}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={p.searchPh}
        />
        <div className="pp-sort" role="group" aria-label={p.sortLabel}>
          <button type="button" className={sort === 'group' ? 'on' : ''} aria-pressed={sort === 'group'} onClick={() => setSort('group')}>{p.sortGroup}</button>
          <button type="button" className={sort === 'az' ? 'on' : ''} aria-pressed={sort === 'az'} onClick={() => setSort('az')}>{p.sortAz}</button>
        </div>
      </div>

      {failed && <p className="import-msg" role="status">{p.error}</p>}
      {!data && !failed && <p className="hint" role="status">{p.loading}</p>}

      {data && (
        <>
          <p className="pp-count" role="status">{p.count(count)}{full ? ` ${p.full(MAX_PRODUCTS)}` : ''}</p>
          <div className="pp-list">
            {count === 0 && <p className="hint">{p.empty}</p>}
            {sections.map((s) => (
              <div key={s.key} className="pp-group">
                {s.key !== 'az' && <p className="pp-group-title">{p.groups[s.key] || s.key}</p>}
                <ul>
                  {s.items.map((x) => {
                    const on = chosen.has(x.w);
                    return (
                      <li key={x.w}>
                        <label className={`pp-item${on ? ' on' : ''}${!on && full ? ' off' : ''}`}>
                          <input type="checkbox" checked={on} disabled={!on && full} onChange={() => toggle(x)} />
                          <span className="pp-name">{x.n} <small>{x.w}</small></span>
                          <span className="pp-meta">
                            {x.s.length > 0 && <>{x.s.join(', ')}</>}
                            {x.p.length > 0 && <> · {x.p.slice(0, 3).join(', ')}{x.p.length > 3 ? '…' : ''}</>}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="pp-source">
            {p.source(data.version)}{' '}
            <a href={data.url} target="_blank" rel="noopener noreferrer">psm.admin.ch</a>
          </p>
        </>
      )}
    </fieldset>
  );
}
