import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
// Polices auto-hebergees (paquets fontsource, licence OFL) : aucun appel a
// Google Fonts, donc aucune adresse IP de visiteur transmise a un tiers.
import '@fontsource-variable/manrope/wght.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import './styles/base.css';
import './styles/home.css';
import './styles/equipement.css';
import './styles/app.css';
import App from './App.jsx';
import { AuthProvider } from './auth.jsx';
import { LangProvider } from './i18n/index.jsx';
import { BASE_PATH } from './config.js';

// Version hors ligne (npm run demo), ouverte depuis le disque : l'adresse de la
// page est apres le # (index.html#/equipement), ce qui garde les boutons
// Precedent / Suivant et le rechargement. Les liens vers une section de la
// page (#comment, #main...) sont alors traites ici : defilement jusqu'a la
// section, sans changer de page.
const OFFLINE = import.meta.env.VITE_OFFLINE === '1';

function handleSectionLinks() {
  document.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = e.target.closest?.('a[href^="#"]')?.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#/')) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // Le focus suit, pour le clavier et les lecteurs d'ecran (lien d'evitement).
    if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }, true);
}
if (OFFLINE) handleSectionLinks();

const Router = OFFLINE ? HashRouter : BrowserRouter;
const routerProps = OFFLINE ? {} : { basename: BASE_PATH.replace(/\/$/, '') || '/' };

// Site affiche dans le cadre d'une autre page (clickjacking : faire cliquer a
// son insu sur « Se connecter » ou un bouton de l'administration). GitHub Pages
// ne permet pas d'envoyer l'en-tete qui l'interdit (frame-ancestors), sans effet
// dans une balise meta : le site compile refuse donc de s'afficher encadre et
// propose de s'ouvrir normalement. Developpement et version hors ligne : non concernes.
const FRAMED = import.meta.env.PROD && !OFFLINE && window.top !== window.self;

createRoot(document.getElementById('root')).render(
  FRAMED ? (
    <p style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <a href={window.location.href} target="_blank" rel="noopener noreferrer">Ouvrir VitiAero</a>
    </p>
  ) : (
    <React.StrictMode>
      <Router {...routerProps}>
        <LangProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LangProvider>
      </Router>
    </React.StrictMode>
  )
);
