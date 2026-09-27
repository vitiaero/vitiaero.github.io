// Journal du serveur : une ligne JSON par evenement, lisible par l'hebergeur et
// par un outil de surveillance. Jamais de donnee personnelle : ni adresse IP,
// ni e-mail, ni contenu envoye par un visiteur.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const minLevel = () => LEVELS[process.env.LOG_LEVEL] ?? (process.env.NODE_ENV === 'test' ? LEVELS.warn : LEVELS.info);

function write(level, msg, fields = {}) {
  if (LEVELS[level] < minLevel()) return;
  const line = JSON.stringify({ t: new Date().toISOString(), level, msg, ...fields });
  if (level === 'error' || level === 'warn') console.error(line);
  else console.log(line);
}

export const log = {
  debug: (msg, fields) => write('debug', msg, fields),
  info: (msg, fields) => write('info', msg, fields),
  warn: (msg, fields) => write('warn', msg, fields),
  error: (msg, fields) => write('error', msg, fields),
};

// Journal des requetes : methode, chemin sans parametres, statut, duree.
export function requestLogger() {
  return (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      if (!req.path.startsWith('/api')) return;
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      const level = res.statusCode >= 500 ? 'error' : 'info';
      // Les identifiants numeriques du chemin sont remplaces : pas de lien
      // possible entre une ligne du journal et une demande precise.
      write(level, 'request', {
        method: req.method,
        path: req.path.replace(/\/\d+(?=\/|$)/g, '/:id'),
        status: res.statusCode,
        ms: Math.round(ms),
      });
    });
    next();
  };
}
