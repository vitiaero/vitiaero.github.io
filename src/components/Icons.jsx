// Jeu d'icones sobres (trait fin), coherentes avec le style epure.
const paths = {
  slope: <><path d="M3 18h18" /><path d="M4 18 14 6l6 12" /><circle cx="14" cy="6" r="1.4" /></>,
  leaf: <><path d="M4 20c8 2 14-4 15-15C9 6 3 11 4 20z" /><path d="M4 20C8 15 12 12 16 10" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" fill="currentColor" /></>,
  droplet: <><path d="M12 3c-4 5-6 8-6 11a6 6 0 0 0 12 0c0-3-2-6-6-11z" /></>,
  map: <><path d="M9 4 3.5 6.2v13.3L9 17l6 2.5 5.5-2.2V4L15 6.5 9 4z" /><path d="M9 4v13M15 6.5v13" /></>,
  pin: <><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  check: <><path d="M20 6 9 17l-5-5" /></>,
  send: <><path d="M4 12l16-8-6 16-3-6-7-2z" /></>,
  drone: <><rect x="9" y="9" width="6" height="6" rx="1.5" /><path d="M9 12H4M20 12h-5M4 8v8M20 8v8" /><path d="M12 9V4M12 20v-5" /></>,
  route: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H14a4 4 0 0 1 0 8H10a4 4 0 0 0 0 8" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4V5z" /></>,
  phone: <><path d="M7 3.5 9.5 8 7.8 9.9a12 12 0 0 0 6.3 6.3L16 14.5l4.5 2.5v3a1.5 1.5 0 0 1-1.7 1.5C10.6 20.4 3.6 13.4 2.5 5.2A1.5 1.5 0 0 1 4 3.5h3z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3z" /><path d="M9.5 12l1.8 1.8 3.4-3.6" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  tag: <><path d="M4 4h7l9 9-7 7-9-9V4z" /><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" /></>,
  chevron: <><path d="M8 5l8 7-8 7" /></>,
};

export default function Icon({ name, size = 24, stroke = 1.8, ...rest }) {
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
