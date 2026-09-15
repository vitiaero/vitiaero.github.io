import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { area as turfArea } from '@turf/turf';
import { useI18n } from '../i18n/index.jsx';

// Couleur des parcelles : ORANGE, bien visible sur le vert des vignes. Jamais vert.
const ORANGE = '#e8781f';
const ORANGE_DARK = '#c85a12';

// Fonds de carte swisstopo (WMTS, projection Web Mercator) + plan OpenStreetMap.
// Les libelles affiches sont traduits (t.map.layers), les cles restent fixes.
const BASE_LAYERS = {
  satellite: {
    url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg',
    attribution: '&copy; swisstopo',
  },
  carte: {
    url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg',
    attribution: '&copy; swisstopo',
  },
  plan: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
  },
  // Plan cadastral officiel (limites et numeros de parcelles), fourni par swisstopo.
  cadastre: {
    url: 'https://wmts.geo.admin.ch/1.0.0/ch.kantone.cadastralwebmap-farbe/default/current/3857/{z}/{x}/{y}.png',
    attribution: '&copy; swisstopo, cadastre',
  },
};

// Memorise que le mini tutoriel a ete vu (stockage technique, liste sur la page cookies).
const TIP_KEY = 'vitiaero_map_tip';

// --- Import de parcelles deja dessinees ailleurs (GeoJSON ou KML) ---
// Le fichier est lu dans le navigateur, rien n'est envoye avant la demande.
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_PARCELS = 50;
const MAX_POINTS = 500;

// Meme zone que le serveur : la Suisse et ses abords.
function inServiceArea(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat > 45.7 && lat < 47.9 && lng > 5.8 && lng < 10.6;
}

// Un anneau GeoJSON ([[lng, lat], ...]) devient une liste de points Leaflet.
function ringToPoints(ring) {
  if (!Array.isArray(ring)) return null;
  const pts = [];
  for (const c of ring) {
    if (!Array.isArray(c) || c.length < 2) return null;
    const lng = Number(c[0]);
    const lat = Number(c[1]);
    if (!inServiceArea(lat, lng)) return null;
    pts.push([lat, lng]);
  }
  // Le dernier point repete le premier dans un anneau ferme : on le retire.
  if (pts.length > 3) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    if (a[0] === b[0] && a[1] === b[1]) pts.pop();
  }
  return pts.length >= 3 ? pts.slice(0, MAX_POINTS) : null;
}

// Parcourt un objet GeoJSON et en sort les contours de polygones.
function ringsFromGeoJSON(node, out = []) {
  if (!node || typeof node !== 'object' || out.length >= MAX_PARCELS) return out;
  if (Array.isArray(node)) {
    node.forEach((n) => ringsFromGeoJSON(n, out));
    return out;
  }
  if (node.type === 'FeatureCollection') return ringsFromGeoJSON(node.features, out);
  if (node.type === 'Feature') return ringsFromGeoJSON(node.geometry, out);
  if (node.type === 'GeometryCollection') return ringsFromGeoJSON(node.geometries, out);
  if (node.type === 'Polygon') {
    out.push(node.coordinates?.[0]); // contour exterieur uniquement
    return out;
  }
  if (node.type === 'MultiPolygon') {
    (node.coordinates || []).forEach((poly) => { if (out.length < MAX_PARCELS) out.push(poly?.[0]); });
    return out;
  }
  return out;
}

// KML : chaque <Polygon> garde son <outerBoundaryIs>, en "lng,lat,alt lng,lat,alt".
function ringsFromKML(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) return null;
  const rings = [];
  doc.querySelectorAll('Polygon').forEach((poly) => {
    if (rings.length >= MAX_PARCELS) return;
    const node = poly.querySelector('outerBoundaryIs coordinates') || poly.querySelector('coordinates');
    if (!node) return;
    const ring = (node.textContent || '').trim().split(/\s+/).map((triple) => {
      const [lng, lat] = triple.split(',');
      return [Number(lng), Number(lat)];
    });
    rings.push(ring);
  });
  return rings;
}

function formatArea(m2, locale) {
  const rounded = Math.round(m2);
  const ha = m2 / 10000;
  return {
    m2: rounded.toLocaleString(locale),
    ha: ha.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
  };
}

// Aire d'un polygone (points = [[lat,lng], ...]) via Turf, en m2.
function polygonArea(points) {
  if (!points || points.length < 3) return 0;
  const ring = points.map(([lat, lng]) => [lng, lat]);
  ring.push(ring[0]); // ferme l'anneau
  try {
    return turfArea({ type: 'Polygon', coordinates: [ring] });
  } catch {
    return 0;
  }
}

export default function MapDraw({ value = [], onChange, readOnly = false }) {
  const { t, lang, locale } = useI18n();
  const m = t.map;
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const baseLayerRef = useRef(null);
  const drawnGroupRef = useRef(null);
  const tempGroupRef = useRef(null);
  const searchGroupRef = useRef(null);

  const drawingRef = useRef(false);
  const pointsRef = useRef([]);
  const valueRef = useRef(value);
  const lastClickRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const didFitRef = useRef(false);

  const [base, setBase] = useState('satellite');
  const [drawing, setDrawing] = useState(false);
  const [pointsCount, setPointsCount] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null); // { ok: bool, text }

  // Mini tutoriel : bulle d'aide affichee a la premiere visite seulement.
  const [showTip, setShowTip] = useState(() => {
    if (readOnly) return false;
    try { return localStorage.getItem(TIP_KEY) !== '1'; } catch { return true; }
  });
  const dismissTip = () => {
    setShowTip(false);
    try { localStorage.setItem(TIP_KEY, '1'); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!showTip) return;
    const onKey = (e) => { if (e.key === 'Escape') dismissTip(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showTip]);

  valueRef.current = value;
  onChangeRef.current = onChange;

  // --- Initialisation de la carte (une seule fois) ---
  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: [46.494, 6.74], // Lavaux, par defaut
      zoom: 13,
      maxZoom: 19,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;

    baseLayerRef.current = L.tileLayer(BASE_LAYERS.satellite.url, {
      maxZoom: 19,
      attribution: BASE_LAYERS.satellite.attribution,
    }).addTo(map);

    drawnGroupRef.current = L.layerGroup().addTo(map);
    tempGroupRef.current = L.layerGroup().addTo(map);
    searchGroupRef.current = L.layerGroup().addTo(map);

    if (!readOnly) map.on('click', onMapClick);

    // La carte peut etre demontee avant que ce minuteur ne se declenche
    // (double montage de React en mode strict) : on garde une reference et on
    // verifie que la carte existe toujours avant d'appeler invalidateSize.
    const sizeTimer = setTimeout(() => { if (mapRef.current) map.invalidateSize(); }, 200);
    const onResize = () => { if (mapRef.current) map.invalidateSize(); };
    window.addEventListener('resize', onResize);

    redrawParcels();

    return () => {
      clearTimeout(sizeTimer);
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Redessine les parcelles terminees quand la valeur change ---
  useEffect(() => {
    redrawParcels();
    // Ajuste la vue sur les parcelles au premier affichage si elles existent.
    // Les limites sont calculees sur les points : un layerGroup n'a pas de
    // getBounds, contrairement a un featureGroup.
    if (!didFitRef.current && value.length > 0 && mapRef.current) {
      const points = value.flatMap((p) => p.points || []);
      if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        if (bounds.isValid()) mapRef.current.fitBounds(bounds.pad(0.3), { maxZoom: 18 });
      }
      didFitRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, lang]);

  function redrawParcels() {
    const group = drawnGroupRef.current;
    if (!group) return;
    group.clearLayers();
    (valueRef.current || []).forEach((parcel, idx) => {
      const poly = L.polygon(parcel.points, {
        color: ORANGE_DARK,
        weight: 2.5,
        fillColor: ORANGE,
        fillOpacity: 0.28,
      }).addTo(group);
      poly.bindTooltip(m.parcel(idx + 1), { sticky: true });
    });
  }

  function redrawTemp() {
    const group = tempGroupRef.current;
    if (!group) return;
    group.clearLayers();
    const pts = pointsRef.current;
    if (pts.length >= 2) {
      L.polyline(pts, { color: ORANGE, weight: 2.5, dashArray: '6 5' }).addTo(group);
    }
    if (pts.length >= 3) {
      L.polygon(pts, {
        color: ORANGE, weight: 1, fillColor: ORANGE, fillOpacity: 0.12, dashArray: '6 5',
      }).addTo(group);
    }
    pts.forEach((p, i) => {
      L.circleMarker(p, {
        radius: i === 0 ? 7 : 5,
        color: '#fff',
        weight: 2,
        fillColor: i === 0 ? ORANGE_DARK : ORANGE,
        fillOpacity: 1,
      }).addTo(group);
    });
  }

  function clearTemp() {
    tempGroupRef.current?.clearLayers();
  }

  // --- Gestion du trace ---
  function onMapClick(e) {
    if (!drawingRef.current) return;
    const map = mapRef.current;
    const pts = pointsRef.current;
    const now = Date.now();

    // Double-clic : termine le polygone (sans ajouter de doublon)
    if (now - lastClickRef.current < 300 && pts.length >= 3) {
      lastClickRef.current = 0;
      finishDrawing();
      return;
    }
    lastClickRef.current = now;

    // Clic sur le premier point : ferme le polygone
    if (pts.length >= 3) {
      const p1 = map.latLngToContainerPoint(pts[0]);
      const p2 = e.containerPoint;
      if (p1.distanceTo(p2) < 14) {
        finishDrawing();
        return;
      }
    }

    pts.push([e.latlng.lat, e.latlng.lng]);
    redrawTemp();
    setPointsCount(pts.length);
  }

  function startDrawing() {
    if (readOnly) return;
    if (showTip) dismissTip();
    drawingRef.current = true;
    pointsRef.current = [];
    lastClickRef.current = 0;
    clearTemp();
    setDrawing(true);
    setPointsCount(0);
    const map = mapRef.current;
    map.doubleClickZoom.disable();
    containerRef.current.style.cursor = 'crosshair';
  }

  function finishDrawing() {
    const pts = pointsRef.current;
    if (pts.length >= 3) {
      const parcel = { points: pts.slice(), area_m2: polygonArea(pts) };
      onChangeRef.current?.([...(valueRef.current || []), parcel]);
    }
    stopDrawing();
  }

  function stopDrawing() {
    drawingRef.current = false;
    pointsRef.current = [];
    clearTemp();
    setDrawing(false);
    setPointsCount(0);
    const map = mapRef.current;
    if (map) {
      map.doubleClickZoom.enable();
      containerRef.current.style.cursor = '';
    }
  }

  function removeLastPoint() {
    const pts = pointsRef.current;
    pts.pop();
    redrawTemp();
    setPointsCount(pts.length);
  }

  function clearAll() {
    stopDrawing();
    onChangeRef.current?.([]);
    didFitRef.current = true; // n'ajuste plus la vue apres effacement
  }

  function removeParcel(idx) {
    onChangeRef.current?.((valueRef.current || []).filter((_, i) => i !== idx));
  }

  // --- Import d'un fichier de parcelles (GeoJSON ou KML) ---
  async function importFile(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = ''; // permet de reimporter le meme fichier
    if (!file) return;
    setImportMsg(null);
    if (file.size > MAX_FILE_BYTES) {
      setImportMsg({ ok: false, text: m.importTooBig });
      return;
    }
    let rings;
    try {
      const text = await file.text();
      const isKml = /\.km[lz]$/i.test(file.name) || text.trimStart().startsWith('<');
      rings = isKml ? ringsFromKML(text) : ringsFromGeoJSON(JSON.parse(text));
    } catch {
      rings = null;
    }
    if (!rings) {
      setImportMsg({ ok: false, text: m.importError });
      return;
    }
    if (rings.length === 0) {
      setImportMsg({ ok: false, text: m.importNone });
      return;
    }

    const parcels = rings.map(ringToPoints).filter(Boolean)
      .map((points) => ({ points, area_m2: polygonArea(points) }));
    if (parcels.length === 0) {
      // Des polygones existent, mais aucun n'est situe dans la zone de service.
      setImportMsg({ ok: false, text: m.importOutside });
      return;
    }

    stopDrawing();
    if (showTip) dismissTip();
    const merged = [...(valueRef.current || []), ...parcels].slice(0, MAX_PARCELS);
    onChangeRef.current?.(merged);
    didFitRef.current = false; // ajuste la vue sur les parcelles importees
    setImportMsg({ ok: true, text: m.importOk(parcels.length) });
  }

  // --- Changement de fond de carte ---
  function switchBase(name) {
    const map = mapRef.current;
    if (!map || name === base) return;
    if (baseLayerRef.current) map.removeLayer(baseLayerRef.current);
    baseLayerRef.current = L.tileLayer(BASE_LAYERS[name].url, {
      maxZoom: 19,
      attribution: BASE_LAYERS[name].attribution,
    }).addTo(map);
    baseLayerRef.current.bringToBack();
    setBase(name);
  }

  // --- Recherche de lieu (API swisstopo) ---
  async function doSearch(e) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setResults([]);
    try {
      const url = `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=${encodeURIComponent(
        q
      )}&type=locations&limit=6&sr=4326&lang=${lang}`;
      const res = await fetch(url);
      const data = await res.json();
      const items = (data.results || []).map((r) => ({
        label: (r.attrs.label || '').replace(/<[^>]+>/g, ''),
        lat: r.attrs.lat,
        lon: r.attrs.lon,
      }));
      setResults(items);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function goTo(item) {
    const map = mapRef.current;
    map.setView([item.lat, item.lon], 16);
    searchGroupRef.current.clearLayers();
    L.circleMarker([item.lat, item.lon], {
      radius: 8, color: '#14140f', weight: 2, fillColor: '#fff', fillOpacity: 0.9,
    }).addTo(searchGroupRef.current);
    setResults([]);
    setQuery(item.label);
  }

  const total = (value || []).reduce((s, p) => s + (p.area_m2 || 0), 0);
  const fmt = formatArea(total, locale);

  // --- Rendu lecture seule (espace admin) ---
  if (readOnly) {
    return (
      <div>
        <div className="layer-switch" role="group" aria-label={m.layersAria}>
          {Object.keys(BASE_LAYERS).map((key) => (
            <button key={key} className={base === key ? 'active' : ''} onClick={() => switchBase(key)}>
              {m.layers[key]}
            </button>
          ))}
        </div>
        <div ref={containerRef} className="map-canvas readonly" />
      </div>
    );
  }

  // --- Rendu editable (demande d'estimation) ---
  return (
    <div className="map-wrap">
      <div className="map-panel">
        <h3>{m.title}</h3>
        <p className="tool-hint">{m.intro}</p>

        <form className="map-search mt-2" onSubmit={doSearch}>
          <input
            className="input"
            placeholder={m.searchPh}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-dark btn-sm" type="submit" disabled={searching}>
            {searching ? '...' : m.search}
          </button>
        </form>
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((r, i) => (
              <li key={i} onClick={() => goTo(r)}>{r.label}</li>
            ))}
          </ul>
        )}

        <div className="layer-switch mt-3" role="group" aria-label={m.layersAria}>
          {Object.keys(BASE_LAYERS).map((key) => (
            <button key={key} className={base === key ? 'active' : ''} onClick={() => switchBase(key)}>
              {m.layers[key]}
            </button>
          ))}
        </div>

        {/* Import d'un fichier de parcelles, pour eviter de tout retracer */}
        <div className="map-import mt-3">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
            {m.importBtn}
          </button>
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            aria-label={m.importAria}
            accept=".geojson,.json,.kml,application/geo+json,application/json,application/vnd.google-earth.kml+xml"
            onChange={importFile}
          />
          <p className="tool-hint">{m.importHint}</p>
          {importMsg && (
            <p className={`import-msg${importMsg.ok ? ' ok' : ''}`} role="status">{importMsg.text}</p>
          )}
        </div>

        <div className="map-tools">
          {!drawing ? (
            <button className={`btn btn-primary btn-sm${showTip ? ' pulse' : ''}`} onClick={startDrawing}>{m.draw}</button>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={finishDrawing} disabled={pointsCount < 3}>
                {m.finish(pointsCount)}
              </button>
              <button className="btn btn-outline btn-sm" onClick={removeLastPoint} disabled={pointsCount === 0}>
                {m.undo}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={stopDrawing}>{m.cancel}</button>
            </>
          )}
          {showTip && !drawing && value.length === 0 && (
            <div className="map-tip" role="dialog" aria-labelledby="map-tip-title">
              <button type="button" className="map-tip-close" aria-label={m.tipClose} onClick={dismissTip}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <p id="map-tip-title" className="map-tip-title">{m.tipTitle}</p>
              <ol>
                {m.tipSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              <div className="map-tip-actions">
                <button type="button" className="btn btn-light btn-sm" onClick={startDrawing}>{m.tipStart}</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={dismissTip}>{m.tipLater}</button>
              </div>
            </div>
          )}
          <button className="btn btn-ghost btn-sm" onClick={clearAll} disabled={value.length === 0 && !drawing}>
            {m.clear}
          </button>
        </div>

        <p className="tool-hint">
          {drawing
            ? m.hintDrawing
            : m.hintIdle}
        </p>

        <div className="area-box">
          <div className="big">{fmt.ha} ha</div>
          <div className="sub">{fmt.m2} m2 &middot; {m.count(value.length)}</div>
        </div>

        {value.length > 0 && (
          <div className="parcel-list">
            {value.map((p, i) => (
              <div className="row" key={i}>
                <span>{m.parcel(i + 1)} &middot; {formatArea(p.area_m2, locale).m2} m2</span>
                <button onClick={() => removeParcel(i)}>{m.remove}</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="map-stage">
        <div ref={containerRef} className="map-canvas" />
        {drawing && pointsCount === 0 && (
          <div className="map-chip" role="status">{m.firstPoint}</div>
        )}
      </div>
    </div>
  );
}
