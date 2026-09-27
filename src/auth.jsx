// Contexte d'authentification : conserve l'utilisateur connecte et expose
// les actions connexion / inscription / deconnexion.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from './api.js';
import { consentPayload } from './components/ConsentCheckbox.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au chargement, tente de recuperer l'utilisateur si un jeton existe
  useEffect(() => {
    let active = true;
    async function load() {
      if (!getToken()) { setLoading(false); return; }
      try {
        const { user: u } = await api.get('/api/auth/me');
        if (active) setUser(u);
      } catch {
        setToken(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await api.post('/api/auth/login', { email, password });
    setToken(token);
    setUser(u);
    return u;
  }, []);

  // Inscription : versions de la politique et des conditions d'utilisation lues.
  const register = useCallback(async (name, email, password, lang) => {
    const { token, user: u } = await api.post('/api/auth/register', {
      name, email, password, lang, consent: consentPayload(['privacy', 'terms']),
    });
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout'); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }, []);

  // Compte supprime par son titulaire : la session n'existe plus cote serveur.
  const forget = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forget, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit etre utilise dans AuthProvider');
  return ctx;
}
