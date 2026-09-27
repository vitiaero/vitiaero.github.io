// Illustrations schematiques originales, creees pour VitiAero (aucune image de
// fabricant). Vectorielles, legeres, et adaptees au theme par les couleurs CSS
// (currentColor et variables). Elles montrent un drone agricole de facon
// generale ; les chiffres affiches a cote viennent de la fiche du fabricant.

function Svg({ title, viewBox, className = '', children }) {
  return (
    <svg className={`ill ${className}`} viewBox={viewBox} role="img" aria-label={title} focusable="false">
      <title>{title}</title>
      {children}
    </svg>
  );
}

// Rotor coaxial vu de dessus : disque des helices, deux paires de pales, moyeu.
function Rotor({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="54" className="ill-disc" />
      <circle r="54" className="ill-disc-line" />
      <g className="ill-blade">
        <path d="M-48 -6 L48 6" />
        <path d="M-6 48 L6 -48" />
      </g>
      <circle r="11" className="ill-hub" />
      <circle r="5" className="ill-hub-core" />
    </g>
  );
}

// Drone vu de dessus : quatre bras, huit helices en rotors coaxiaux, reservoir
// au centre. unfold : les bras se deplient a l'affichage (sauf mouvement reduit).
export function DroneTopView({ title, unfold = false }) {
  const arms = [
    { angle: -135, x: 78, y: 78 },
    { angle: -45, x: 322, y: 78 },
    { angle: 135, x: 78, y: 322 },
    { angle: 45, x: 322, y: 322 },
  ];
  return (
    <Svg title={title} viewBox="0 0 400 400" className={unfold ? 'ill-unfold' : ''}>
      {arms.map((a, i) => (
        <g key={i} className={`ill-arm-group ill-arm-${i}`} style={{ '--fold': `${a.angle > 0 ? -1 : 1}` }}>
          <line x1="200" y1="200" x2={a.x} y2={a.y} className="ill-arm" />
          <Rotor x={a.x} y={a.y} />
        </g>
      ))}
      <rect x="148" y="140" width="104" height="120" rx="26" className="ill-body" />
      <circle cx="200" cy="200" r="34" className="ill-tank" />
      <text x="200" y="207" textAnchor="middle" className="ill-label">40 L</text>
      <rect x="182" y="128" width="36" height="12" rx="4" className="ill-sensor" />
      <rect x="182" y="260" width="36" height="12" rx="4" className="ill-sensor" />
    </Svg>
  );
}

// Vue de profil : le drone au-dessus d'un rang de vigne, deux gicleurs
// centrifuges et leur nuage de gouttelettes.
export function SprayDiagram({ title }) {
  const drops = [];
  for (let i = 0; i < 26; i += 1) {
    const side = i % 2 ? 1 : -1;
    const spread = (i % 7) * 11;
    drops.push({ x: 300 + side * (40 + spread), y: 160 + (i % 5) * 22 + (i % 3) * 6, r: 2 + (i % 3) });
  }
  return (
    <Svg title={title} viewBox="0 0 600 360">
      <path d="M0 330 L600 290 L600 360 L0 360 Z" className="ill-ground" />
      {[140, 230, 320, 410, 500].map((x) => (
        <g key={x}>
          <line x1={x} y1={330 - (x / 600) * 40} x2={x} y2={250 - (x / 600) * 40} className="ill-post" />
          <ellipse cx={x} cy={262 - (x / 600) * 40} rx="38" ry="24" className="ill-leaf" />
        </g>
      ))}
      <g className="ill-spray">
        <path d="M262 118 L200 250 L262 250 Z" className="ill-fan" />
        <path d="M338 118 L338 250 L400 250 Z" className="ill-fan" />
        {drops.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} className="ill-drop" />)}
      </g>
      <line x1="150" y1="90" x2="450" y2="90" className="ill-arm" />
      <ellipse cx="150" cy="78" rx="70" ry="8" className="ill-disc" />
      <ellipse cx="450" cy="78" rx="70" ry="8" className="ill-disc" />
      <rect x="250" y="62" width="100" height="56" rx="16" className="ill-body" />
      <circle cx="262" cy="118" r="9" className="ill-nozzle" />
      <circle cx="338" cy="118" r="9" className="ill-nozzle" />
    </Svg>
  );
}

// Plan de vol : parcelle (orange, comme sur la carte d'estimation), passages
// reguliers, point de depart et zone evitee autour d'un obstacle.
export function RoutePlan({ title }) {
  const lanes = [];
  for (let i = 0; i < 9; i += 1) {
    const y = 96 + i * 26;
    lanes.push(i % 2 === 0 ? `M118 ${y} L${478 - i * 6} ${y}` : `M${478 - i * 6} ${y} L118 ${y}`);
  }
  const path = lanes.map((l, i) => (i === 0 ? l : l.replace('M', 'L'))).join(' ');
  return (
    <Svg title={title} viewBox="0 0 600 400">
      <path d="M96 70 L512 58 L470 330 L110 344 Z" className="ill-parcel" />
      <path d={path} className="ill-route" />
      <circle cx="404" cy="200" r="28" className="ill-obstacle-zone" />
      <circle cx="404" cy="200" r="10" className="ill-obstacle" />
      <circle cx="118" cy="96" r="9" className="ill-start" />
      <text x="118" y="80" textAnchor="middle" className="ill-label ill-label-small">A</text>
    </Svg>
  );
}

// Recharge sur place : generateur, une batterie en charge pendant que l'autre vole.
export function ChargingCycle({ title }) {
  return (
    <Svg title={title} viewBox="0 0 600 320">
      <rect x="40" y="120" width="170" height="130" rx="18" className="ill-box" />
      <rect x="62" y="146" width="126" height="22" rx="6" className="ill-panel" />
      <circle cx="80" cy="212" r="12" className="ill-hub" />
      <circle cx="170" cy="212" r="12" className="ill-hub" />
      <path d="M210 185 C 260 185, 260 185, 300 185" className="ill-cable" />
      <rect x="300" y="150" width="90" height="70" rx="12" className="ill-battery" />
      <rect x="330" y="140" width="30" height="10" rx="3" className="ill-battery" />
      <path d="M335 170 L350 170 L342 186 L358 186 L338 210 L344 192 L330 192 Z" className="ill-bolt" />
      <path d="M440 110 C 520 60, 560 150, 500 190" className="ill-arrow" markerEnd="url(#ill-head)" />
      <path d="M500 230 C 470 280, 400 280, 380 236" className="ill-arrow" markerEnd="url(#ill-head)" />
      <g transform="translate(470 70) scale(0.35)">
        <line x1="-150" y1="0" x2="150" y2="0" className="ill-arm" />
        <ellipse cx="-150" cy="-14" rx="70" ry="10" className="ill-disc" />
        <ellipse cx="150" cy="-14" rx="70" ry="10" className="ill-disc" />
        <rect x="-50" y="-26" width="100" height="56" rx="16" className="ill-body" />
      </g>
      <defs>
        <marker id="ill-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="ill-arrow-head" />
        </marker>
      </defs>
    </Svg>
  );
}
