import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={BASE_PATH.replace(/\/$/, '') || '/'}>
      <LangProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>
);
