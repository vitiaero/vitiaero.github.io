import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Version hors ligne du site (npm run demo) : elle s'ouvre par double-clic sur
// index.html, sans serveur ni installation. Chemins relatifs, aucune API (les
// formulaires affichent le message « envoi actif au lancement »).
// L'assemblage final, un seul index.html avec les images et les videos a cote,
// est fait par scripts/build-offline.mjs.
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_ORIGIN': JSON.stringify(''),
    'import.meta.env.VITE_STATIC_ONLY': JSON.stringify('1'),
    'import.meta.env.VITE_OFFLINE': JSON.stringify('1'),
  },
  build: {
    outDir: 'dist-hors-ligne',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    modulePreload: false,
    // Images et videos : copiees par le script, sans les fichiers 4K.
    copyPublicDir: false,
    // Tout ce que le style reference (polices, petites images de la carte) est
    // integre : ouvert depuis le disque, Chrome refuse de charger une police
    // depuis un autre fichier.
    assetsInlineLimit: 100 * 1024 * 1024,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        // Script classique en un seul morceau : Chrome refuse les scripts
        // « module » ouverts depuis le disque.
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/site.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
