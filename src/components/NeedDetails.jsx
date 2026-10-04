import { useRef, useState } from 'react';
import Icon from './Icons.jsx';

// Precisions de l'etape « Votre besoin », demandees par les vignerons lors des
// entretiens : obstacles, lieu de decollage et de remplissage, cepage
// resistant, fourniture des produits, photos et voisins a grouper.
// value : { obstacles: [], obstaclesOther, takeoff, resistant, supply, neighbors: [{ name, contact }] }
export const OBSTACLE_KEYS = ['murs', 'escaliers', 'ligne', 'route'];
export const MAX_NEIGHBORS = 3;
export const MAX_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

export const emptyDetails = () => ({
  obstacles: [], obstaclesOther: '', takeoff: '', resistant: false, supply: '', neighbors: [],
});

const formatSize = (bytes) => `${Math.round(bytes / 1024)} Ko`;

export default function NeedDetails({ value, onChange, files, onFilesChange, d }) {
  const fileRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const set = (patch) => onChange({ ...value, ...patch });

  const toggleObstacle = (k) => set({
    obstacles: value.obstacles.includes(k) ? value.obstacles.filter((o) => o !== k) : [...value.obstacles, k],
  });

  function addFiles(ev) {
    const picked = Array.from(ev.target.files || []);
    ev.target.value = '';
    setFileError('');
    const next = [...files];
    for (const file of picked) {
      if (next.length >= MAX_FILES) { setFileError(d.fileCount); break; }
      if (!FILE_TYPES.includes(file.type)) { setFileError(d.fileType); continue; }
      if (file.size > MAX_FILE_BYTES) { setFileError(d.fileTooBig); continue; }
      next.push(file);
    }
    onFilesChange(next);
  }

  const setNeighbor = (i, patch) => set({ neighbors: value.neighbors.map((n, k) => (k === i ? { ...n, ...patch } : n)) });

  return (
    <div className="need">
      {/* Obstacles et acces */}
      <fieldset className="need-block">
        <legend>{d.obstaclesLabel}</legend>
        <div className="need-checks">
          {OBSTACLE_KEYS.map((k, i) => (
            <label key={k} className="need-check">
              <input type="checkbox" checked={value.obstacles.includes(k)} onChange={() => toggleObstacle(k)} />
              <span>{d.obstacles[i]}</span>
            </label>
          ))}
        </div>
        <input
          className="input mt-2"
          maxLength={300}
          value={value.obstaclesOther}
          onChange={(e) => set({ obstaclesOther: e.target.value })}
          placeholder={d.obstaclesOtherPh}
          aria-label={d.obstaclesOtherPh}
        />
      </fieldset>

      <div className="field need-block">
        <label htmlFor="need-takeoff">{d.takeoffLabel}</label>
        <input
          id="need-takeoff"
          className="input"
          maxLength={300}
          value={value.takeoff}
          onChange={(e) => set({ takeoff: e.target.value })}
          placeholder={d.takeoffPh}
        />
      </div>

      {/* Vigne et produits */}
      <label className="need-check need-block">
        <input type="checkbox" checked={value.resistant} onChange={(e) => set({ resistant: e.target.checked })} />
        <span><strong>{d.resistantLabel}</strong> <small>{d.resistantHint}</small></span>
      </label>

      <fieldset className="need-block">
        <legend>{d.supplyLabel}</legend>
        <div className="need-checks">
          {['client', 'vitiaero'].map((k, i) => (
            <label key={k} className="need-check">
              <input type="radio" name="need-supply" checked={value.supply === k} onChange={() => set({ supply: k })} />
              <span>{d.supply[i]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Photos de la parcelle */}
      <div className="field need-block">
        <span className="label-like">{d.filesLabel}</span>
        <p className="hint" style={{ marginTop: 0 }}>{d.filesHint}</p>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>{d.filesAdd}</button>
        <input ref={fileRef} type="file" className="sr-only" multiple aria-label={d.filesLabel} accept={FILE_TYPES.join(',')} onChange={addFiles} />
        {fileError && <p className="import-msg">{fileError}</p>}
        {files.length > 0 && (
          <ul className="file-list">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span className="file-icon" aria-hidden="true"><Icon name="tag" size={16} /></span>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{formatSize(f.size)}</span>
                <button type="button" onClick={() => onFilesChange(files.filter((_, k) => k !== i))}>{d.filesRemove}</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Demande groupee avec des voisins */}
      <div className="need-block">
        <span className="label-like">{d.neighborsLabel}</span>
        <p className="hint" style={{ marginTop: 0 }}>{d.neighborsHint}</p>
        {value.neighbors.map((n, i) => (
          <div className="need-neighbor" key={i}>
            <input className="input" maxLength={120} value={n.name} onChange={(e) => setNeighbor(i, { name: e.target.value })} placeholder={d.neighborName} aria-label={`${d.neighborName} ${i + 1}`} />
            <input className="input" maxLength={190} value={n.contact} onChange={(e) => setNeighbor(i, { contact: e.target.value })} placeholder={d.neighborContact} aria-label={`${d.neighborContact} ${i + 1}`} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => set({ neighbors: value.neighbors.filter((_, k) => k !== i) })}>{d.filesRemove}</button>
          </div>
        ))}
        {value.neighbors.length < MAX_NEIGHBORS && (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => set({ neighbors: [...value.neighbors, { name: '', contact: '' }] })}>
            {d.neighborAdd}
          </button>
        )}
      </div>
    </div>
  );
}
