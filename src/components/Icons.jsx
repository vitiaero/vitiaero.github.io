// Jeu d'icones VitiAero : une seule famille, dessinee sur la meme grille
// (24 x 24, trait arrondi), avec un aplat translucide sur la forme principale.
// Elles racontent le service : la parcelle, le plan de vol, le traitement par
// drone et le rapport, puis le terrain, la securite et le contact.
const F = { fill: 'currentColor', opacity: 0.22, stroke: 'none' }; // aplat
const S = { fill: 'currentColor', stroke: 'none' }; // plein

const paths = {
  // Le service, de la parcelle au rapport
  parcel: <><path d="M3.5 9 10 4.5l6 2.5-1.6 6.2-8.4 1.6z" {...F} /><path d="M3.5 9 10 4.5l6 2.5-1.6 6.2-8.4 1.6z" /><circle cx="3.5" cy="9" r="1.3" {...S} /><circle cx="10" cy="4.5" r="1.3" {...S} /><circle cx="16" cy="7" r="1.3" {...S} /><circle cx="6" cy="14.8" r="1.3" {...S} /><circle cx="16.5" cy="16.5" r="3.3" /><path d="m18.9 18.9 2.4 2.4" /></>,
  plan: <><path d="M4.5 18.5 9 8l5 8.5 5.5-10.5" /><circle cx="4.5" cy="18.5" r="2" {...S} /><circle cx="9" cy="8" r="1.5" {...S} /><circle cx="14" cy="16.5" r="1.5" {...S} /><path d="M19.5 6V2.5l3 1.5-3 1.5z" {...F} /><path d="M19.5 6V2.5l3 1.5-3 1.5" /></>,
  spray: <><path d="M3 5.5h6M15 5.5h6M6 5.5v2.5M18 5.5v2.5M4.5 8h15" /><rect x="8.5" y="6.5" width="7" height="5" rx="2" {...F} /><rect x="8.5" y="6.5" width="7" height="5" rx="2" /><path d="M10 11.5 9.2 13.3M14 11.5l.8 1.8" /><path d="M8 15.5c-.8 1-1.3 1.8-1.3 2.4a1.3 1.3 0 0 0 2.6 0c0-.6-.5-1.4-1.3-2.4z" {...S} /><path d="M12 17c-.8 1-1.3 1.8-1.3 2.4a1.3 1.3 0 0 0 2.6 0c0-.6-.5-1.4-1.3-2.4z" {...S} /><path d="M16 15.5c-.8 1-1.3 1.8-1.3 2.4a1.3 1.3 0 0 0 2.6 0c0-.6-.5-1.4-1.3-2.4z" {...S} /></>,
  report: <><path d="M6.5 3h8L19 7.5V20a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" {...F} /><path d="M6.5 3h8L19 7.5V20a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14.5 3v4.5H19" /><path d="M8.5 10.5h5M8.5 13.5h7" /><path d="m8.8 17.3 1.8 1.7 3.6-3.8" /></>,
  drone: <><circle cx="6" cy="6" r="3.3" {...F} /><circle cx="18" cy="6" r="3.3" {...F} /><circle cx="6" cy="18" r="3.3" {...F} /><circle cx="18" cy="18" r="3.3" {...F} /><circle cx="6" cy="6" r="3.3" /><circle cx="18" cy="6" r="3.3" /><circle cx="6" cy="18" r="3.3" /><circle cx="18" cy="18" r="3.3" /><path d="M8.4 8.4 9.8 9.8M15.6 8.4l-1.4 1.4M8.4 15.6l1.4-1.4M15.6 15.6l-1.4-1.4" /><rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.8" {...S} /></>,
  // Le terrain et les conditions
  slope: <><path d="M2 20 8.5 9.5l3.2 4.8L15.5 7 22 20z" {...F} /><path d="M2 20 8.5 9.5l3.2 4.8L15.5 7 22 20z" /><path d="m13.4 10.8 1.3 1 1.3-1.2 1.4 1" /></>,
  relief: <><path d="M3 19.5c3.5 0 4.5-5 8.5-5s5 3.5 9.5 1.5v4.5H3z" {...F} /><path d="M3 19.5c3.5 0 4.5-5 8.5-5s5 3.5 9.5 1.5" /><path d="M3 12.5c3.5 0 4.5-5 8.5-5s5 3.5 9.5 1.5" opacity=".55" /><circle cx="11.5" cy="7.5" r="2" {...S} /><path d="M7.5 4.8h3M12.5 4.8h3" /></>,
  obstacle: <><path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.6 13.2a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3z" {...F} /><path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.6 13.2a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3z" /><path d="M12 9.2v4.6" /><circle cx="12" cy="16.8" r="1.1" {...S} /></>,
  weather: <><path d="M7.5 14h9a3.3 3.3 0 0 0 .5-6.6 5 5 0 0 0-9.6 1.1A2.8 2.8 0 0 0 7.5 14z" {...F} /><path d="M7.5 14h9a3.3 3.3 0 0 0 .5-6.6 5 5 0 0 0-9.6 1.1A2.8 2.8 0 0 0 7.5 14z" /><path d="M4 17.5h9.5a1.8 1.8 0 1 1-1.7 2.4M4 20.5h4.5" /></>,
  pin: <><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11z" {...F} /><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  rules: <><rect x="5" y="4.5" width="14" height="16.5" rx="2" {...F} /><rect x="5" y="4.5" width="14" height="16.5" rx="2" /><rect x="9" y="2.8" width="6" height="3.4" rx="1.2" {...S} /><path d="m8 11 1.3 1.3 2.4-2.5M8 16l1.3 1.3 2.4-2.5M14 11h2.3M14 16h2.3" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3z" {...F} /><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3z" /><path d="m9.2 12 1.9 1.9 3.8-3.9" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.3" {...F} /><circle cx="12" cy="12" r="4.3" /><circle cx="12" cy="12" r="1.4" {...S} /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" /></>,
  complement: <><circle cx="9" cy="12" r="6" {...F} /><circle cx="15" cy="12" r="6" {...F} /><circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" /></>,
  // Contact et outils
  map: <><path d="M9 4 3.5 6.2v13.3L9 17l6 2.5 5.5-2.2V4L15 6.5 9 4z" {...F} /><path d="M9 4 3.5 6.2v13.3L9 17l6 2.5 5.5-2.2V4L15 6.5 9 4z" /><path d="M9 4v13M15 6.5v13" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" {...F} /><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  phone: <><path d="M7 3.5 9.5 8 7.8 9.9a12 12 0 0 0 6.3 6.3L16 14.5l4.5 2.5v3a1.5 1.5 0 0 1-1.7 1.5C10.6 20.4 3.6 13.4 2.5 5.2A1.5 1.5 0 0 1 4 3.5h3z" {...F} /><path d="M7 3.5 9.5 8 7.8 9.9a12 12 0 0 0 6.3 6.3L16 14.5l4.5 2.5v3a1.5 1.5 0 0 1-1.7 1.5C10.6 20.4 3.6 13.4 2.5 5.2A1.5 1.5 0 0 1 4 3.5h3z" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" {...F} /><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9.5h16M8 3v4M16 3v4" /><rect x="13.5" y="13" width="3" height="3" rx=".8" {...S} /></>,
  tag: <><path d="M4 4h7l9 9-7 7-9-9V4z" {...F} /><path d="M4 4h7l9 9-7 7-9-9V4z" /><circle cx="8.5" cy="8.5" r="1.5" {...S} /></>,
  signal: <><path d="M5 19a10 10 0 0 1 0-14" /><path d="M19 5a10 10 0 0 1 0 14" /><path d="M8.5 15.5a5 5 0 0 1 0-7" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><circle cx="12" cy="12" r="1.8" {...S} /></>,
  // Interface
  leaf: <><path d="M4 20c8 2 14-4 15-15C9 6 3 11 4 20z" /><path d="M4 20C8 15 12 12 16 10" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  droplet: <><path d="M12 3c-4 5-6 8-6 11a6 6 0 0 0 12 0c0-3-2-6-6-11z" /></>,
  check: <><path d="M20 6 9 17l-5-5" /></>,
  send: <><path d="M4 12l16-8-6 16-3-6-7-2z" /></>,
  route: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H14a4 4 0 0 1 0 8H10a4 4 0 0 0 0 8" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4V5z" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  chevron: <><path d="M8 5l8 7-8 7" /></>,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  arrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  play: <><path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" /></>,
  pause: <><path d="M8.5 5.5v13M15.5 5.5v13" /></>,
};

export default function Icon({ name, size = 24, stroke = 1.7, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name] || null}
    </svg>
  );
}
