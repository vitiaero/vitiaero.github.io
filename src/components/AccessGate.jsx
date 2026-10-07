import { useState } from 'react';
import { asset } from '../config.js';

// Code d'acces du site publie avant le lancement (« prive entre guillemets »).
// Le code n'est pas dans le depot : la compilation le lit dans le secret GitHub
// ACCESS_CODE et n'ecrit ici que son empreinte PBKDF2 (voir vite.config.js).
// La verification se fait dans le navigateur : elle cache le site aux visiteurs
// et aux moteurs de recherche, mais ne protege ni les fichiers appeles par leur
// adresse (images, videos), ni contre quelqu'un qui lit le code du site.
// Sans configuration (developpement, apercu, version hors ligne) : aucun code.
const GATE = (() => {
  try { return JSON.parse(import.meta.env.VITE_ACCESS_GATE || 'null'); } catch { return null; }
})();
const KEY = 'vitiaero_acces';

function storedHash() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

// Meme calcul que vite.config.js : majuscules acceptees, espaces ignores.
async function derive(code) {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(code.trim().toLowerCase()), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(GATE.salt), iterations: GATE.iterations },
    base,
    256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function AccessGate({ children }) {
  const [open, setOpen] = useState(() => !GATE || storedHash() === GATE.hash);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!window.crypto?.subtle) {
      setError('Ce navigateur ne permet pas de vérifier le code (connexion non sécurisée).');
      return;
    }
    setBusy(true);
    setError('');
    const hash = await derive(code).catch(() => '');
    setBusy(false);
    if (hash && hash === GATE.hash) {
      // Retenu sur cet appareil : le code n'est plus demande aux visites suivantes.
      try { localStorage.setItem(KEY, hash); } catch { /* stockage indisponible : code redemande */ }
      setOpen(true);
    } else {
      setError('Code incorrect.');
    }
  }

  if (open) return children;

  return (
    <main className="access-gate">
      <div className="auth-card">
        <img src={asset('/images/logo-vitiaero.png')} alt="VitiAero" className="access-gate-logo" width="120" height="40" />
        <h1 className="h2 text-center">Accès réservé</h1>
        <p className="muted text-center mt-1 mb-3">Le site est en préparation. Saisissez le code d'accès qui vous a été transmis.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="access-code">Code d'accès</label>
            <input
              id="access-code"
              className="input"
              type="password"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={100}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Vérification...' : 'Entrer'}
          </button>
        </form>
      </div>
    </main>
  );
}
