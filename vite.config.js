import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { apiOriginFrom, buildCsp, SPA_ROUTES } from './shared/security.js';
import { business } from './shared/business.js';
import { launchStatus } from './shared/launch.js';
import { outdatedVersions } from './shared/legal/hash.js';
import {
  applyHead, jsonLdScript, organizationJsonLd, pageMeta, robotsTxt, securityTxt, sitemapXml,
} from './shared/site.js';
import fr from './src/i18n/fr.js';
import { checkMedia } from './scripts/check-media.mjs';
import { collectLicenses, licensesText } from './scripts/third-party-licenses.mjs';

// Le client tourne sur le port 5173 et redirige tous les appels /api
// vers l'API Express (port 3001). Ainsi le front et le back demarrent
// avec une seule commande "npm run dev".

// En-tetes de securite du serveur de developpement. En ligne, la CSP est posee
// par la balise meta generee ci-dessous (une CSP stricte en developpement
// casserait le rechargement a chaud de Vite, qui injecte des styles en ligne).
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=(), usb=()',
};

// Chemin de base : "/" par defaut, "/nom-du-depot/" sur GitHub Pages sans domaine.
function normalizeBase(raw) {
  const clean = String(raw || '').trim().replace(/^\/+|\/+$/g, '');
  const segments = clean ? clean.split('/') : [];
  if (segments.some((s) => !/^[A-Za-z0-9._-]+$/.test(s) || s === '.' || s === '..')) {
    throw new Error(`Chemin de base invalide : ${raw}`);
  }
  return clean ? `/${clean}/` : '/';
}

// Compilation uniquement :
// - refuse de compiler si un fichier de public/ n'est pas declare dans le
//   registre des medias, ou si un document juridique a change sans nouvelle
//   version (celle qui est enregistree avec chaque demande) ;
// - ajoute la CSP et la politique de referent dans index.html ;
// - ecrit une page HTML par route, avec son titre, sa description et sa
//   consigne d'indexation (aucune indexation avant le lancement) ;
// - produit robots.txt, sitemap.xml (apres lancement seulement), security.txt
//   et la liste des licences des logiciels tiers inclus.
function staticHosting(apiOrigin) {
  let outDir = path.resolve('dist');
  let publicDir = path.resolve('public');
  let launch = null;
  return {
    name: 'vitiaero-static-hosting',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      publicDir = config.publicDir ? path.resolve(config.publicDir) : publicDir;
    },
    buildStart() {
      const media = checkMedia(publicDir);
      const problems = [
        ...media.unregistered.map((f) => `public/${f} n'est pas declare dans shared/media.js (auteur, licence, preuve du droit d'usage).`),
        ...media.missing.map((f) => `public/${f} est declare dans shared/media.js mais absent.`),
        ...media.errors,
        ...outdatedVersions().map((d) => `Le document juridique "${d.id}" a change : lancez npm run legal:version, relisez le texte, puis recompilez.`),
      ];
      if (problems.length) this.error(`Compilation refusee :\n- ${problems.join('\n- ')}`);
      launch = launchStatus(business);
      if (business.fictional === true) this.info('Entreprise fictive (PAE au CPNV) : site non indexe, aucune demande enregistree en production.');
      else if (launch.ready) this.info('Porte de lancement franchie : site indexable, formulaires ouverts.');
      else this.warn(`Pre-lancement : ${launch.blockers.length} information(s) bloquante(s). Site non indexe, formulaires fermes (voir docs/INFORMATIONS-MANQUANTES.md).`);
    },
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: buildCsp({ apiOrigin }) }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
      ];
    },
    generateBundle(_options, bundle) {
      const ready = launch.ready;
      const ids = Object.values(bundle).flatMap((f) => (f.type === 'chunk' ? Object.keys(f.modules) : []));
      this.emitFile({ type: 'asset', fileName: 'licences-tiers.txt', source: licensesText(collectLicenses(ids)) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(business, { ready }) });
      const sitemap = sitemapXml(business, { ready });
      if (sitemap) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      const security = securityTxt(business);
      if (security) this.emitFile({ type: 'asset', fileName: '.well-known/security.txt', source: security });
    },
    writeBundle() {
      const index = path.join(outDir, 'index.html');
      if (!fs.existsSync(index)) return;
      const ready = launch.ready;
      const template = fs.readFileSync(index, 'utf8');
      const jsonLd = jsonLdScript(organizationJsonLd(business, { ready }));
      const opts = { ready, fallbackTitle: fr.meta.fallbackTitle };
      const page = (route) => applyHead(template, { ...pageMeta(business, route, fr.meta.pages, opts), jsonLd });
      fs.writeFileSync(index, page('/'));
      // /le-service -> le-service.html (servi en 200 par GitHub Pages).
      for (const route of SPA_ROUTES) fs.writeFileSync(path.join(outDir, `${route}.html`), page(`/${route}`));
      // Toute autre adresse : l'application affiche sa propre page introuvable.
      fs.writeFileSync(path.join(outDir, '404.html'), applyHead(template, pageMeta(business, '/404', fr.meta.pages, opts)));
      // Pas de traitement Jekyll : les fichiers sont publies tels quels.
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Adresse de l'API quand elle est hebergee ailleurs que le site (GitHub Pages).
  const apiOrigin = apiOriginFrom(env.VITE_API_URL);

  return {
    base: normalizeBase(env.VITE_BASE_PATH),
    plugins: [react(), staticHosting(apiOrigin)],
    define: {
      'import.meta.env.VITE_API_ORIGIN': JSON.stringify(apiOrigin),
      // Publie sans API : les formulaires affichent un message au lieu d'une erreur.
      'import.meta.env.VITE_STATIC_ONLY': JSON.stringify(env.VITE_STATIC_ONLY === '1' ? '1' : ''),
    },
    build: {
      sourcemap: false, // le code source original n'est pas publie
    },
    server: {
      port: 5173,
      open: env.VITE_OPEN !== '0', // les tests automatises n'ouvrent pas de navigateur
      headers: securityHeaders,
      // Ne pas surveiller les gros fichiers video/capture pouvant se trouver a la
      // racine (ex. une capture d'ecran en cours, verrouillee) : ils feraient
      // planter l'observateur de fichiers. Ils restent servis normalement.
      watch: {
        ignored: ['**/_hors-projet/**', '**/*.mov', '**/*.avi', '**/*.mkv', '**/videoplayback*'],
      },
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 5173,
      headers: securityHeaders,
    },
  };
});
