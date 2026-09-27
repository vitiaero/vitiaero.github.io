// Distance par la route entre la base de depart et les parcelles, pour les
// frais de deplacement.
//
// Production : un serveur OSRM auto-heberge, avec les donnees OpenStreetMap de
// la Suisse (installation dans docs/EXPLOITATION.md). Adresse dans ROUTING_URL,
// par exemple http://127.0.0.1:5000. Sans ROUTING_URL, aucun service externe
// n'est appele : la distance est calculee a vol d'oiseau, et l'estimation
// indique que les frais de deplacement seront confirmes dans le devis.
//
// Le serveur public de demonstration OSRM (router.project-osrm.org) est refuse :
// il est reserve a un usage raisonnable et non commercial.
import { BASE, haversineKm } from '../shared/pricing.js';
import { log } from './log.js';

const FORBIDDEN_HOSTS = ['router.project-osrm.org'];

export function createRouter(env = process.env) {
  let base = null;
  if (env.ROUTING_URL) {
    const url = new URL(env.ROUTING_URL);
    if (FORBIDDEN_HOSTS.includes(url.hostname)) {
      throw new Error('ROUTING_URL : le serveur de demonstration OSRM est reserve a un usage non commercial. Utiliser un serveur auto-heberge.');
    }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('ROUTING_URL invalide.');
    base = url.href.replace(/\/$/, '');
  }
  const timeoutMs = Number(env.ROUTING_TIMEOUT_MS || 5000);
  const cache = new Map();

  async function distance(pt) {
    const direct = { km: Math.round(haversineKm(BASE, pt) * 10) / 10, method: 'direct' };
    if (!base) return direct;
    const key = `${pt.lat.toFixed(3)},${pt.lng.toFixed(3)}`;
    if (cache.has(key)) return cache.get(key);
    try {
      const url = `${base}/route/v1/driving/${BASE.lng},${BASE.lat};${pt.lng},${pt.lat}?overview=false`;
      const r = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      const data = await r.json();
      const meters = data?.routes?.[0]?.distance;
      if (!r.ok || data.code !== 'Ok' || !Number.isFinite(meters)) throw new Error('itineraire indisponible');
      const result = { km: Math.round(meters / 100) / 10, method: 'route' };
      cache.set(key, result);
      if (cache.size > 2000) cache.delete(cache.keys().next().value);
      return result;
    } catch (err) {
      log.warn('routing.fallback', { reason: String(err?.name || 'erreur') });
      return direct; // repli a vol d'oiseau, signale comme tel
    }
  }

  return { mode: base ? 'osrm' : 'direct', distance };
}
