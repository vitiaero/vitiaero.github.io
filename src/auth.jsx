// Contexte d'authentification : conserve l'utilisateur connecte et expose
// les actions connexion / inscription / deconnexion.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from './api.js';

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
        const { user } = await api.get('/api/auth/me');
        if (active) setUser(user);
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
    const { token, user } = await api.post('/api/auth/login', { email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { token, user } = await api.post('/api/auth/register', { name, email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout'); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }, []);

  // Rafraichit les donnees utilisateur (points, palier...) apres une action
  const refresh = useCallback(async () => {
    try {
      const { user } = await api.get('/api/auth/me');
      setUser(user);
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit etre utilise dans AuthProvider');
  return ctx;
}
