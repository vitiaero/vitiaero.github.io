// Fichiers et balises du site construits a partir des donnees reelles
// (shared/business.js) et de la porte de lancement (shared/launch.js) :
// en-tete HTML de chaque page, robots.txt, sitemap.xml, security.txt et
// donnees structurees. Utilise a la compilation (vite.config.js) et par le
// serveur Node, qui repond selon l'etat de lancement du moment.
import { isText, UID_RE, VAT_RE } from './launch.js';
import { PUBLIC_ROUTES, PRIVATE_ROUTES, isPrivateRoute } from './security.js';

export const siteUrl = (b) => String(b.site.url).replace(/\/+$/, '');

export const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Consigne d'indexation d'une page : rien n'est indexe avant le lancement, ni
// les espaces prives, ni les adresses inconnues.
export function robotsMeta(pathname, { ready, known = true }) {
  return ready && known && !isPrivateRoute(pathname) ? 'index, follow' : 'noindex, nofollow';
}

export function robotsTxt(b, { ready }) {
  if (!ready) {
    return [
      '# VitiAero est en pre-lancement : aucune page ne doit etre indexee.',
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n');
  }
  return [
    'User-agent: *',
    'Allow: /',
    ...PRIVATE_ROUTES.map((r) => `Disallow: ${r}`),
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl(b)}/sitemap.xml`,
    '',
  ].join('\n');
}

// Plan du site : seulement une fois le service lance.
export function sitemapXml(b, { ready }) {
  if (!ready) return null;
  const base = siteUrl(b);
  const urls = PUBLIC_ROUTES.map((r) => `  <url><loc>${escapeHtml(base + (r === '/' ? '/' : r))}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// security.txt (RFC 9116) : ou signaler une faille. Expire au bout de 180 jours ;
// chaque compilation (au moins hebdomadaire, voir deploy-pages.yml) le renouvelle.
export function securityTxt(b, { now = new Date() } = {}) {
  const mail = b.identity.email;
  if (!isText(mail)) return null;
  const expires = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
  expires.setUTCHours(0, 0, 0, 0);
  return [
    `Contact: mailto:${mail}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: fr, de, en',
    `Canonical: ${siteUrl(b)}/.well-known/security.txt`,
    '',
  ].join('\n');
}

// Donnees structurees de l'entreprise : uniquement des informations reelles et
// seulement une fois le service lance (sinon, rien).
export function organizationJsonLd(b, { ready }) {
  if (!ready) return null;
  const id = b.identity;
  const base = siteUrl(b);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: id.brand,
    url: `${base}/`,
    logo: `${base}/images/logo-vitiaero-full.webp`,
    areaServed: { '@type': 'AdministrativeArea', name: 'Canton de Vaud' },
  };
  if (isText(id.legalName)) data.legalName = id.legalName;
  if (isText(id.email)) data.email = id.email;
  if (isText(id.phone)) data.telephone = id.phone;
  const a = id.address || {};
  if (isText(a.street) && isText(a.postalCode) && isText(a.locality)) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.locality,
      ...(isText(a.canton) ? { addressRegion: a.canton } : {}),
      addressCountry: a.country || 'CH',
    };
  }
  if (isText(id.uid) && UID_RE.test(id.uid)) data.taxID = id.uid;
  if (id.vat && isText(id.vat.number) && VAT_RE.test(id.vat.number)) data.vatID = id.vat.number;
  return data;
}

// Balise <script> sure : "<" est echappe pour ne jamais fermer la balise.
export function jsonLdScript(data) {
  if (!data) return '';
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

// Remplace les balises d'en-tete de index.html par celles d'une page.
const HEAD_TAGS = [
  ['title', /<title>[\s\S]*?<\/title>/, (m) => `<title>${escapeHtml(m.title)}</title>`],
  ['description', /<meta name="description" content="[^"]*"\s*\/?>/, (m) => `<meta name="description" content="${escapeHtml(m.desc)}" />`],
  ['robots', /<meta name="robots" content="[^"]*"\s*\/?>/, (m) => `<meta name="robots" content="${escapeHtml(m.robots)}" />`],
  ['canonical', /<link rel="canonical" href="[^"]*"\s*\/?>/, (m) => `<link rel="canonical" href="${escapeHtml(m.url)}" />`],
  ['og:title', /<meta property="og:title" content="[^"]*"\s*\/?>/, (m) => `<meta property="og:title" content="${escapeHtml(m.title)}" />`],
  ['og:description', /<meta property="og:description" content="[^"]*"\s*\/?>/, (m) => `<meta property="og:description" content="${escapeHtml(m.desc)}" />`],
  ['og:url', /<meta property="og:url" content="[^"]*"\s*\/?>/, (m) => `<meta property="og:url" content="${escapeHtml(m.url)}" />`],
  ['og:image', /<meta property="og:image" content="[^"]*"\s*\/?>/, (m) => `<meta property="og:image" content="${escapeHtml(m.image)}" />`],
];

export function applyHead(html, meta) {
  let out = html;
  for (const [name, re, make] of HEAD_TAGS) {
    if (!re.test(out)) throw new Error(`Balise ${name} introuvable dans index.html`);
    out = out.replace(re, () => make(meta));
  }
  if (meta.jsonLd) out = out.replace('</head>', () => `  ${meta.jsonLd}\n  </head>`);
  return out;
}

// En-tete d'une page du site (francais, langue par defaut).
export function pageMeta(b, pathname, pages, { ready, fallbackTitle }) {
  const known = Object.hasOwn(pages, pathname);
  const m = known ? pages[pathname] : { title: fallbackTitle, desc: pages['/'].desc };
  const base = siteUrl(b);
  return {
    title: m.title,
    desc: m.desc,
    url: base + (pathname === '/' ? '/' : pathname),
    image: `${base}/images/og-vitiaero.jpg`,
    robots: robotsMeta(pathname, { ready, known }),
  };
}
