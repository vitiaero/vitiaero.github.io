import { useEffect, useState } from 'react';
import { api, apiUrl, getToken, download } from '../api.js';
import MapDraw from '../components/MapDraw.jsx';
import { BASE, formatCHF } from '../../shared/pricing.js';

const STATUSES = ['Nouvelle', 'En etude', 'Devis envoye', 'Acceptee', 'Refusee'];
const OPTION_LABELS = [['urgent', 'urgente'], ['difficult', 'parcelle tres difficile'], ['dispersed', 'parcelles dispersees']];

// Estimation annuelle calculee par le serveur (montant ou fourchette).
function estimateText(est) {
  const total = est.totalMin === est.totalMax
    ? formatCHF(est.totalMin)
    : `${formatCHF(est.totalMin)} a ${formatCHF(est.totalMax)}`;
  return est.complete ? total : `${total} + deplacement sur devis`;
}

function statusClass(status) {
  return `badge badge-${status.replace(/\s+/g, '')}`;
}
function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return iso; }
}
function formatHa(m2) {
  return (m2 / 10000).toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
}

/* ----------------------------- Onglet Demandes ----------------------------- */
function RequestsTab() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await api.get('/api/admin/estimations');
    setRows(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    await api.patch(`/api/admin/estimations/${id}/status`, { status });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  }

  async function exportGeojson(id) {
    await download(`/api/admin/estimations/${id}/geojson`, `estimation-${id}.geojson`);
  }

  if (loading) return <div className="loading-block"><div className="spinner" /> Chargement...</div>;

  // Vue detail (carte en lecture seule + changement de statut + export)
  if (selected) {
    const r = selected;
    return (
      <div>
        <button className="btn btn-ghost btn-sm mb-3" onClick={() => setSelected(null)}>&larr; Retour a la liste</button>
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="h3">Demande #{r.id}</h2>
              <span className={statusClass(r.status)}>{r.status}</span>
            </div>
            <div className="recap">
              <div className="line"><span className="k">Date</span><span className="v">{formatDate(r.created_at)}</span></div>
              <div className="line"><span className="k">Nom</span><span className="v">{r.name}</span></div>
              <div className="line"><span className="k">E-mail</span><span className="v">{r.email}</span></div>
              {r.phone && <div className="line"><span className="k">Telephone</span><span className="v">{r.phone}</span></div>}
              {r.commune && <div className="line"><span className="k">Commune</span><span className="v">{r.commune}</span></div>}
              {r.address && <div className="line"><span className="k">Adresse</span><span className="v">{r.address}</span></div>}
              <div className="line"><span className="k">Traitement</span><span className="v">{r.treatment}</span></div>
              <div className="line"><span className="k">Periode</span><span className="v">{r.period}</span></div>
              <div className="line"><span className="k">Parcelles</span><span className="v">{r.parcels.length}</span></div>
              <div className="line"><span className="k">Surface</span><span className="v">{formatHa(r.area_m2)} ha ({Math.round(r.area_m2).toLocaleString('fr-CH')} m2)</span></div>
              {r.promo_code && <div className="line"><span className="k">Code promo</span><span className="v">{r.promo_code}</span></div>}
              {r.message && <div className="line"><span className="k">Message</span><span className="v" style={{ maxWidth: '60%' }}>{r.message}</span></div>}
              {r.estimate && (
                <>
                  <div className="line"><span className="k">Passages par an</span><span className="v">{r.passes}</span></div>
                  <div className="line">
                    <span className="k">Distance depuis {BASE.label}</span>
                    <span className="v">{r.distance_km} km {r.distance_method === 'route' ? 'par la route' : 'a vol d\'oiseau'}</span>
                  </div>
                  {r.options && OPTION_LABELS.some(([k]) => r.options[k]) && (
                    <div className="line">
                      <span className="k">Situations cochees</span>
                      <span className="v">{OPTION_LABELS.filter(([k]) => r.options[k]).map(([, label]) => label).join(', ')}</span>
                    </div>
                  )}
                  <div className="line"><span className="k">Traitement</span><span className="v">{formatCHF(r.estimate.treatment)}</span></div>
                  <div className="line">
                    <span className="k">Deplacements</span>
                    <span className="v">{r.estimate.travel.status === 'ok' ? formatCHF(r.estimate.travel.total) : 'Sur devis'}</span>
                  </div>
                  <div className="line"><span className="k">Estimation annuelle</span><span className="v">{estimateText(r.estimate)}</span></div>
                </>
              )}
            </div>

            <div className="field mt-3">
              <label htmlFor="req-status">Changer le statut</label>
              <select id="req-status" className="select" value={r.status} onChange={(e) => changeStatus(r.id, e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => exportGeojson(r.id)}>Exporter en GeoJSON</button>
          </div>

          <div>
            <h3 className="h3 mb-2" style={{ fontSize: '1rem' }}>Parcelles (lecture seule)</h3>
            <MapDraw value={r.parcels} readOnly />
          </div>
        </div>
      </div>
    );
  }

  // Liste
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="h3">Demandes d'estimation ({rows.length})</h2>
        <button className="btn btn-outline btn-sm" onClick={load}>Actualiser</button>
      </div>
      {rows.length === 0 ? (
        <p className="muted">Aucune demande pour l'instant.</p>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>N&deg;</th><th>Date</th><th>Client</th><th>Commune</th><th>Surface</th><th>Estimation</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => setSelected(r)}>
                  <td>#{r.id}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>{r.name}</td>
                  <td>{r.commune || '-'}</td>
                  <td>{formatHa(r.area_m2)} ha</td>
                  <td>{r.estimate ? estimateText(r.estimate) : '-'}</td>
                  <td><span className={statusClass(r.status)}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Onglet Clients ----------------------------- */
function ClientsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/api/admin/clients').then((d) => { setRows(d); setLoading(false); });
  }, []);
  if (loading) return <div className="loading-block"><div className="spinner" /> Chargement...</div>;
  return (
    <div>
      <h2 className="h3 mb-3">Clients ({rows.length})</h2>
      {rows.length === 0 ? (
        <p className="muted">Aucun client inscrit.</p>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>N&deg;</th><th>Nom</th><th>E-mail</th><th>Demandes</th><th>Interventions</th><th>Derniere</th><th>Inscription</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.requests}</td>
                  <td>{c.interventions}</td>
                  <td>{c.last_intervention ? formatDate(c.last_intervention) : '-'}</td>
                  <td>{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Onglet Messages ---------------------------- */
// Messages du formulaire de contact et demandes de devis. Aucun courriel n'est
// envoye : c'est ici que l'equipe les lit et les marque comme traites.
// Les pieces jointes ne sont pas servies en public : on les recupere avec le
// jeton d'authentification, puis on les ouvre depuis la memoire du navigateur.
// Types ouverts dans un onglet : images et PDF uniquement. Un fichier d'un autre
// type (HTML, SVG...) pourrait executer du code avec les droits de l'equipe.
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

async function openFile(messageId, index, name) {
  const res = await fetch(apiUrl(`/api/admin/messages/${Number(messageId)}/files/${Number(index)}`), {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'omit',
  });
  if (!res.ok) return;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  if (IMAGE_TYPES.includes(blob.type)) {
    window.open(url, '_blank', 'noopener');
  } else if (blob.type === 'application/pdf') {
    // PDF telecharge plutot qu'ouvert : la politique de securite du site
    // (object-src 'none') peut empecher le lecteur PDF de s'afficher.
    const a = document.createElement('a');
    a.href = url;
    a.download = String(name || 'piece-jointe.pdf').replace(/[^\w.\- ]/g, '') || 'piece-jointe.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function MessagesTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/api/admin/messages').then((d) => { setRows(d); setLoading(false); });
  }, []);

  async function toggle(msg) {
    const status = msg.status === 'Nouveau' ? 'Traité' : 'Nouveau';
    const updated = await api.patch(`/api/admin/messages/${msg.id}`, { status });
    setRows((list) => list.map((r) => (r.id === updated.id ? updated : r)));
  }

  if (loading) return <div className="loading-block"><div className="spinner" /> Chargement...</div>;
  const pending = rows.filter((r) => r.status === 'Nouveau').length;
  return (
    <div>
      <h2 className="h3 mb-3">Messages ({rows.length}{pending > 0 ? `, dont ${pending} a traiter` : ''})</h2>
      {rows.length === 0 ? (
        <p className="muted">Aucun message recu.</p>
      ) : (
        <div className="msg-list">
          {rows.map((msg) => (
            <article key={msg.id} className={`msg${msg.status === 'Nouveau' ? ' new' : ''}`}>
              <header>
                <div>
                  <span className={`badge badge-${msg.kind === 'devis' ? 'Enetude' : 'Nouvelle'}`}>
                    {msg.kind === 'devis' ? 'Devis' : 'Contact'}
                  </span>{' '}
                  <strong>{msg.name}</strong>
                  {msg.company && <span className="muted"> &middot; {msg.company}</span>}
                  <span className="muted"> &middot; {formatDate(msg.created_at)}</span>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => toggle(msg)}>
                  {msg.status === 'Nouveau' ? 'Marquer comme traite' : 'Rouvrir'}
                </button>
              </header>
              <p className="msg-contact">
                <a href={`mailto:${encodeURIComponent(msg.email)}`}>{msg.email}</a>
                {msg.phone && <> &middot; <a href={`tel:${String(msg.phone).replace(/[^\d+]/g, '')}`}>{msg.phone}</a></>}
              </p>
              {msg.kind === 'devis' && (
                <p className="msg-facts">
                  {msg.commune && <span>Commune : <strong>{msg.commune}</strong></span>}
                  {msg.area_ha != null && <span>Surface annoncee : <strong>{msg.area_ha} ha</strong></span>}
                  {msg.passes != null && <span>Passages : <strong>{msg.passes}</strong></span>}
                </p>
              )}
              {msg.message && <p className="msg-body">{msg.message}</p>}
              {msg.files?.length > 0 && (
                <ul className="msg-files">
                  {msg.files.map((f, i) => (
                    <li key={f.id}>
                      <button type="button" onClick={() => openFile(msg.id, i, f.name)}>
                        {f.name} ({Math.round(f.size / 1024)} Ko)
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Onglet Codes promo --------------------------- */
function PromosTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', description: '', discount: 10 });
  const [error, setError] = useState('');

  async function load() {
    const d = await api.get('/api/admin/promos');
    setRows(d);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    setError('');
    if (!form.code.trim()) { setError('Le code est obligatoire.'); return; }
    try {
      await api.post('/api/admin/promos', { ...form, active: true });
      setForm({ code: '', description: '', discount: 10 });
      load();
    } catch (err) { setError(err.message); }
  }

  async function toggle(p) {
    await api.patch(`/api/admin/promos/${p.id}`, { active: !p.active });
    load();
  }

  async function remove(id) {
    await api.del(`/api/admin/promos/${id}`);
    load();
  }

  if (loading) return <div className="loading-block"><div className="spinner" /> Chargement...</div>;

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <div>
        <h2 className="h3 mb-3">Codes promotionnels ({rows.length})</h2>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Code</th><th>Description</th><th>Remise</th><th>Etat</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td><span className="chip">{p.code}</span></td>
                  <td>{p.description || '-'}</td>
                  <td>-{p.discount}%</td>
                  <td>
                    <span className="badge" style={{ background: p.active ? 'var(--accent-soft)' : '#f0efe9', color: p.active ? 'var(--accent-dark)' : 'var(--muted)' }}>
                      {p.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggle(p)}>{p.active ? 'Desactiver' : 'Activer'}</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(p.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="h3 mb-2">Ajouter un code</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={add}>
          <div className="field">
            <label htmlFor="promo-code">Code</label>
            <input id="promo-code" className="input" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}  />
          </div>
          <div className="field">
            <label htmlFor="promo-desc">Description (conditions réelles de l'offre)</label>
            <input id="promo-desc" className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}  />
          </div>
          <div className="field">
            <label htmlFor="promo-discount">Remise (%)</label>
            <input id="promo-discount" className="input" type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))} />
          </div>
          <button className="btn btn-primary btn-block" type="submit">Ajouter le code</button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------- Onglet Interventions -------------------------- */
// Suivi des traitements realises ou planifies, visible par le client dans son
// espace. Tout est saisi ici : rien n'est cree automatiquement.
const INTERVENTION_STATUSES = ['Planifiee', 'Realisee', 'Annulee'];
const EMPTY_INTERVENTION = {
  user_id: '', estimation_id: '', date: new Date().toISOString().slice(0, 10),
  commune: '', parcel_label: '', area_ha: '', passes: 1, treatment: '', product: '',
  conditions: '', duration_min: '', notes: '', status: 'Realisee',
};

function InterventionsTab() {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_INTERVENTION);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const [list, cls, reqs] = await Promise.all([
      api.get('/api/admin/interventions'),
      api.get('/api/admin/clients'),
      api.get('/api/admin/estimations'),
    ]);
    setRows(list);
    setClients(cls);
    setRequests(reqs);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Demandes du client choisi : sert a rattacher l'intervention et a pre-remplir.
  const clientRequests = requests.filter((r) => String(r.user_id) === String(form.user_id));

  function pickRequest(e) {
    const id = e.target.value;
    const req = requests.find((r) => String(r.id) === String(id));
    setForm((f) => ({
      ...f,
      estimation_id: id,
      commune: req?.commune || f.commune,
      area_ha: req ? (req.area_m2 / 10000).toFixed(2) : f.area_ha,
      treatment: req?.treatment || f.treatment,
    }));
  }

  async function add(e) {
    e.preventDefault();
    setError('');
    if (!form.user_id) { setError('Choisissez un client.'); return; }
    setSaving(true);
    try {
      await api.post('/api/admin/interventions', form);
      setForm({ ...EMPTY_INTERVENTION });
      await load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function setStatus(row, status) {
    await api.patch(`/api/admin/interventions/${row.id}`, { status });
    load();
  }

  async function remove(id) {
    await api.del(`/api/admin/interventions/${id}`);
    load();
  }

  if (loading) return <div className="loading-block"><div className="spinner" /> Chargement...</div>;

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <div>
        <h2 className="h3 mb-3">Interventions ({rows.length})</h2>
        {rows.length === 0 ? (
          <p className="muted">Aucune intervention enregistree.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Date</th><th>Client</th><th>Parcelle</th><th>Surface</th><th>Statut</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(r.date)}</td>
                    <td>{r.client_name}</td>
                    <td>{r.parcel_label || r.commune || '-'}</td>
                    <td>{r.area_ha ? `${r.area_ha} ha` : '-'}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {r.status !== 'Realisee' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setStatus(r, 'Realisee')}>Realisee</button>
                      )}
                      {r.status !== 'Planifiee' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setStatus(r, 'Planifiee')}>Planifiee</button>
                      )}
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(r.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="h3 mb-2">Ajouter une intervention</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={add}>
          <div className="field">
            <label htmlFor="iv-client">Client</label>
            <select id="iv-client" className="input" value={form.user_id} onChange={update('user_id')}>
              <option value="">Choisir un client</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="iv-request">Demande liee (facultatif)</label>
            <select id="iv-request" className="input" value={form.estimation_id} onChange={pickRequest} disabled={!form.user_id}>
              <option value="">Aucune</option>
              {clientRequests.map((r) => (
                <option key={r.id} value={r.id}>#{r.id} - {r.commune || 'sans commune'} - {(r.area_m2 / 10000).toFixed(2)} ha</option>
              ))}
            </select>
          </div>
          <div className="grid grid-2" style={{ gap: '0.8rem' }}>
            <div className="field">
              <label htmlFor="iv-date">Date</label>
              <input id="iv-date" className="input" type="date" value={form.date} onChange={update('date')} />
            </div>
            <div className="field">
              <label htmlFor="iv-status">Statut</label>
              <select id="iv-status" className="input" value={form.status} onChange={update('status')}>
                {INTERVENTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="iv-parcel">Parcelle</label>
            <input id="iv-parcel" className="input" maxLength={160} value={form.parcel_label} onChange={update('parcel_label')}  />
          </div>
          <div className="grid grid-2" style={{ gap: '0.8rem' }}>
            <div className="field">
              <label htmlFor="iv-commune">Commune</label>
              <input id="iv-commune" className="input" maxLength={120} value={form.commune} onChange={update('commune')} />
            </div>
            <div className="field">
              <label htmlFor="iv-area">Surface (ha)</label>
              <input id="iv-area" className="input" inputMode="decimal" maxLength={10} value={form.area_ha} onChange={update('area_ha')}  />
            </div>
          </div>
          <div className="grid grid-2" style={{ gap: '0.8rem' }}>
            <div className="field">
              <label htmlFor="iv-passes">Passages</label>
              <input id="iv-passes" className="input" type="number" min="1" max="20" value={form.passes} onChange={update('passes')} />
            </div>
            <div className="field">
              <label htmlFor="iv-duration">Duree (min)</label>
              <input id="iv-duration" className="input" type="number" min="0" max="5000" value={form.duration_min} onChange={update('duration_min')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="iv-treatment">Traitement</label>
            <input id="iv-treatment" className="input" maxLength={160} value={form.treatment} onChange={update('treatment')} />
          </div>
          <div className="field">
            <label htmlFor="iv-product">Produit</label>
            <input id="iv-product" className="input" maxLength={160} value={form.product} onChange={update('product')}  />
          </div>
          <div className="field">
            <label htmlFor="iv-conditions">Conditions</label>
            <input id="iv-conditions" className="input" maxLength={200} value={form.conditions} onChange={update('conditions')}  />
          </div>
          <div className="field">
            <label htmlFor="iv-notes">Remarques (visibles par le client)</label>
            <textarea id="iv-notes" className="textarea" maxLength={2000} value={form.notes} onChange={update('notes')} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer l\'intervention'}
          </button>
          <p className="hint mt-2">Ces informations apparaissent telles quelles dans l'espace du client.</p>
        </form>
      </div>
    </div>
  );
}


/* ------------------------------ Onglet Lancement ------------------------------ */
// Etat de la porte de lancement (shared/launch.js) et des taches du serveur.
// Chaque point bloquant renvoie a docs/INFORMATIONS-MANQUANTES.md.
const GROUPS = {
  project: 'Projet',
  identity: 'Identité et clientèle',
  privacy: 'Prestataires et données',
  retention: 'Durées de conservation',
  commercial: 'Conditions commerciales et assurance',
  credentials: 'Autorisations et justificatifs',
  media: 'Droits des médias',
  review: 'Validation juridique et signature',
};

function LaunchTab() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    setData(await api.get('/api/admin/system'));
  }
  useEffect(() => { load(); }, []);

  async function act(url, done) {
    setBusy(true);
    setMessage('');
    try {
      await api.post(url);
      setMessage(done);
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <div className="loading-block" role="status"><div className="spinner" aria-hidden="true" /> Chargement...</div>;
  const { launch } = data;
  const byGroup = Object.keys(GROUPS).map((g) => [g, launch.blockers.filter((b) => b.group === g)]).filter(([, list]) => list.length);

  return (
    <div>
      <div className={`alert ${launch.ready ? 'alert-info' : 'alert-error'}`} role="status">
        {launch.ready
          ? 'Toutes les informations obligatoires sont fournies : le site est en exploitation (formulaires ouverts, indexation autorisée après la prochaine publication).'
          : `Pré-lancement : ${launch.blockers.length} point(s) bloquant(s). Formulaires fermés et indexation bloquée tant qu'ils ne sont pas réglés dans shared/business.js et shared/media.js.`}
      </div>
      {message && <p className="hint" role="status">{message}</p>}

      {launch.warnings.length > 0 && (
        <div className="alert alert-error">
          <strong>Échéances proches :</strong>
          <ul>{launch.warnings.map((w) => <li key={w.id}>{w.label} ({w.days} jour(s))</li>)}</ul>
        </div>
      )}

      {byGroup.map(([g, list]) => (
        <div key={g} className="card acc-block">
          <h2 className="h3">{GROUPS[g]}</h2>
          <ul className="blocker-list">
            {list.map((b) => <li key={b.id}><span className="chip">{b.ref}</span> {b.label}</li>)}
          </ul>
        </div>
      ))}

      <div className="grid grid-2 mt-3" style={{ alignItems: 'start' }}>
        <div className="card">
          <h2 className="h3">Serveur</h2>
          <dl className="tl-facts mt-2">
            <div><dt>Environnement</dt><dd>{data.environment}</dd></div>
            <div><dt>Envois acceptés</dt><dd>{data.acceptingSubmissions ? 'oui' : 'non (pré-lancement)'}</dd></div>
            <div><dt>Calcul des distances</dt><dd>{data.routing === 'osrm' ? 'serveur OSRM configuré' : 'à vol d\'oiseau (aucun service externe)'}</dd></div>
            <div><dt>E-mails</dt><dd>{data.mail.mode} · {data.mail.pending} en attente · {data.mail.failed} en échec</dd></div>
            <div><dt>Dernière purge</dt><dd>{data.retention.lastRun ? formatDate(data.retention.lastRun) : 'jamais'}</dd></div>
            <div><dt>Sauvegardes</dt><dd>{data.backup.configured ? `${data.backup.count} · dernière : ${data.backup.lastRun ? formatDate(data.backup.lastRun) : 'jamais'}` : 'non configurées'}</dd></div>
          </dl>
          {data.backup.lastError && <p className="field-error" role="alert">Dernière sauvegarde en échec : {data.backup.lastError}</p>}
          <div className="flex gap-1 wrap mt-3">
            <button type="button" className="btn btn-outline btn-sm" disabled={busy || !data.backup.configured} onClick={() => act('/api/admin/backup', 'Sauvegarde créée et vérifiée.')}>Sauvegarder maintenant</button>
            <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => act('/api/admin/retention/run', 'Purge effectuée.')}>Lancer la purge</button>
            <button type="button" className="btn btn-outline btn-sm" disabled={busy || data.mail.failed === 0} onClick={() => act('/api/admin/outbox/retry', 'E-mails relancés.')}>Relancer les e-mails en échec</button>
          </div>
        </div>
        <div className="card">
          <h2 className="h3">Versions des documents</h2>
          <dl className="tl-facts mt-2">
            {Object.entries(data.policies).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="hint mt-2">Chaque demande enregistre la version de la politique de confidentialité lue par la personne.</p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Onglet Donnees personnelles --------------------------- */
// Demandes d'acces et d'effacement (art. 25 et 32 LPD) faites par e-mail ou
// courrier. Verifier l'identite de la personne avant d'agir.
function PrivacyTab() {
  const [email, setEmail] = useState('');
  const [found, setFound] = useState(null);
  const [keep, setKeep] = useState(true);
  const [message, setMessage] = useState('');
  const [log, setLog] = useState([]);

  async function loadLog() {
    const d = await api.get('/api/admin/system');
    setLog(d.privacyLog);
  }
  useEffect(() => { loadLog(); }, []);

  async function lookup(e) {
    e.preventDefault();
    setMessage('');
    try { setFound(await api.get(`/api/admin/privacy/lookup?email=${encodeURIComponent(email)}`)); } catch (err) { setMessage(err.message); }
  }

  async function exportData() {
    try {
      await download(`/api/admin/privacy/export?email=${encodeURIComponent(email)}`, 'export-donnees.json');
      loadLog();
    } catch (err) { setMessage(err.message); }
  }

  async function erase() {
    if (!window.confirm(`Effacer définitivement les données liées à ${email} ?`)) return;
    try {
      const res = await api.post('/api/admin/privacy/erase', { email, keepContractRecords: keep });
      setMessage(`Effacement effectué. Dossiers liés à un contrat conservés : ${res.summary.keptContractRecords || 0}.`);
      setFound(null);
      loadLog();
    } catch (err) { setMessage(err.message); }
  }

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <div className="card">
        <h2 className="h3">Demande d'accès ou d'effacement</h2>
        <p className="hint">Vérifier l'identité de la personne avant tout export ou effacement. Répondre en principe dans les 30 jours.</p>
        <form className="map-search mt-2" onSubmit={lookup}>
          <label htmlFor="pv-email" className="sr-only">Adresse e-mail de la personne</label>
          <input id="pv-email" className="input" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-dark btn-sm">Rechercher</button>
        </form>
        {message && <p className="hint mt-2" role="status">{message}</p>}
        {found && (
          <>
            <dl className="tl-facts mt-3">
              <div><dt>Compte</dt><dd>{found.account ? 'oui' : 'non'}</dd></div>
              <div><dt>Demandes d'estimation</dt><dd>{found.estimations}</dd></div>
              <div><dt>Messages et devis</dt><dd>{found.messages}</dd></div>
              <div><dt>Pièces jointes</dt><dd>{found.attachments}</dd></div>
              <div><dt>Interventions</dt><dd>{found.interventions}</dd></div>
              <div><dt>Preuves de lecture</dt><dd>{found.consents}</dd></div>
            </dl>
            <label className="consent mt-3">
              <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />
              <span>Conserver les dossiers liés à un contrat (demande acceptée, intervention réalisée), comme l'exige la durée légale de conservation.</span>
            </label>
            <div className="flex gap-1 wrap mt-2">
              <button type="button" className="btn btn-outline btn-sm" onClick={exportData}>Exporter (JSON)</button>
              <button type="button" className="btn btn-ghost btn-sm btn-danger" onClick={erase}>Effacer</button>
            </div>
          </>
        )}
      </div>
      <div className="card">
        <h2 className="h3">Journal des demandes</h2>
        <p className="hint">Type, origine et nombre d'éléments seulement : aucune donnée personnelle n'y est gardée.</p>
        {log.length === 0 ? <p className="muted mt-2">Aucune demande traitée.</p> : (
          <div className="table-wrap mt-2">
            <table className="data">
              <thead><tr><th scope="col">Date</th><th scope="col">Action</th><th scope="col">Origine</th><th scope="col">Éléments</th></tr></thead>
              <tbody>
                {log.map((l, i) => (
                  <tr key={i}>
                    <td>{formatDate(l.created_at)}</td>
                    <td>{l.action === 'erase' ? 'Effacement' : 'Export'}</td>
                    <td>{l.origin}</td>
                    <td>{Object.entries(JSON.parse(l.summary || '{}')).map(([k, v]) => `${k} ${v}`).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */
export default function Admin() {
  const [tab, setTab] = useState('lancement');
  const TABS = [
    ['lancement', 'Lancement'],
    ['demandes', 'Demandes'],
    ['messages', 'Messages'],
    ['interventions', 'Interventions'],
    ['clients', 'Clients'],
    ['donnees', 'Données personnelles'],
    ['promos', 'Codes promo'],
  ];
  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Administration</span>
            <h1 className="h1">Tableau de bord</h1>
          </div>

          <div className="admin-tabs" role="group" aria-label="Sections de l'administration">
            {TABS.map(([key, label]) => (
              <button key={key} type="button" className={tab === key ? 'active' : ''} aria-pressed={tab === key} onClick={() => setTab(key)}>{label}</button>
            ))}
          </div>

          {tab === 'lancement' && <LaunchTab />}
          {tab === 'demandes' && <RequestsTab />}
          {tab === 'messages' && <MessagesTab />}
          {tab === 'interventions' && <InterventionsTab />}
          {tab === 'clients' && <ClientsTab />}
          {tab === 'donnees' && <PrivacyTab />}
          {tab === 'promos' && <PromosTab />}
        </div>
      </section>
    </div>
  );
}
