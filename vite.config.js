import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { apiOriginFrom, buildCsp, SPA_ROUTES } from './shared/security.js';

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

// Compilation uniquement : ajoute la CSP et la politique de referent dans
// index.html, puis cree une page par route pour l'hebergement statique.
function staticHosting(apiOrigin) {
  let outDir = path.resolve('dist');
  return {
    name: 'vitiaero-static-hosting',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: buildCsp({ apiOrigin }) }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
      ];
    },
    closeBundle() {
      const dist = outDir;
      const index = path.join(dist, 'index.html');
      if (!fs.existsSync(index)) return;
      const html = fs.readFileSync(index);
      // /le-service -> le-service.html (servi en 200 par GitHub Pages).
      for (const route of SPA_ROUTES) fs.writeFileSync(path.join(dist, `${route}.html`), html);
      // Toute autre adresse : l'application affiche sa propre page introuvable.
      fs.writeFileSync(path.join(dist, '404.html'), html);
      // Pas de traitement Jekyll : les fichiers sont publies tels quels.
      fs.writeFileSync(path.join(dist, '.nojekyll'), '');
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
      open: true,
      headers: securityHeaders,
      // Ne pas surveiller les gros fichiers video/capture pouvant se trouver a la
      // racine (ex. une capture d'ecran en cours, verrouillee) : ils feraient
      // planter l'observateur de fichiers. Ils restent servis normalement.
      watch: {
        ignored: ['**/_hors-projet/**', '**/*.mov', '**/*.avi', '**/*.mkv', '**/videoplayback*'],
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
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
