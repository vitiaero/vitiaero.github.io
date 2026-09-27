import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './auth.jsx';
import { LangProvider, initLang } from './i18n/index.jsx';
import { BASE_PATH } from './config.js';

// La langue choisie lors d'une visite precedente est chargee avant le premier
// affichage (le francais est deja inclus).
initLang().finally(() => {
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
});
