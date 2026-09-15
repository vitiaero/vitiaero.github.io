// Tarifs VitiAero et calcul de l'estimation en ligne.
// Fichier partage : le site l'utilise pour afficher le prix en direct, et le
// serveur le reutilise pour recalculer le montant enregistre (le prix envoye
// par le navigateur n'est jamais repris tel quel).
// Grille fournie par le proprietaire (septembre 2026). Montants en CHF.

// Point de depart des deplacements : centre de la commune de Chardonne (VD),
// coordonnees swisstopo. [A REMPLACER par l'adresse exacte du depot VitiAero.]
export const BASE = { label: 'Chardonne', lat: 46.472015, lng: 6.806277 };

// Prix par passage et par hectare, selon le nombre de passages par an (1 a 10).
export const PRICE_PER_HA = [650, 630, 610, 590, 570, 550, 540, 530, 520, 510];
export const MAX_PASSES = PRICE_PER_HA.length;
export const REFERENCE_PRICE = PRICE_PER_HA[0];

// Frais par deplacement selon la distance (km, borne haute incluse).
export const TRAVEL_BANDS = [
  { from: 0, to: 10, fee: 30 },
  { from: 10, to: 20, fee: 50 },
  { from: 20, to: 35, fee: 80 },
  { from: 35, to: 50, fee: 120 },
  { from: 50, to: 70, fee: 160 },
  { from: 70, to: 100, fee: 220 },
];
export const TRAVEL_QUOTE_KM = 100; // au-dela : sur devis

// Reduction sur les deplacements selon le nombre de passages par an.
export const TRAVEL_REDUCTIONS = [
  { from: 1, to: 1, rate: 0 },
  { from: 2, to: 3, rate: 0.1 },
  { from: 4, to: 5, rate: 0.2 },
  { from: 6, to: MAX_PASSES, rate: 0.3 },
];

// Autres situations.
export const MIN_PER_PASS = 300; // petite intervention : minimum par passage
export const URGENT_RATE = 0.2; // intervention urgente
export const DIFFICULT_RATE = [0.1, 0.25]; // parcelle tres difficile
export const DISPERSED_RATE = [0.1, 0.3]; // parcelles tres dispersees
export const WAITING_PER_HOUR = 100; // temps d'attente important

const round = (n) => Math.round(n);

export function clampPasses(passes) {
  const n = Math.round(Number(passes) || 1);
  return Math.min(MAX_PASSES, Math.max(1, n));
}

export function travelReduction(passes) {
  const p = clampPasses(passes);
  return TRAVEL_REDUCTIONS.find((r) => p >= r.from && p <= r.to).rate;
}

// Frais pour un deplacement ; null au-dela de 100 km (sur devis).
export function travelFee(km) {
  const band = TRAVEL_BANDS.find((b) => km <= b.to);
  return band ? band.fee : null;
}

// Montant en francs suisses, avec l'apostrophe des milliers (1'830 CHF).
export function formatCHF(amount) {
  return `${new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(round(amount))} CHF`;
}

// Distance a vol d'oiseau entre deux points { lat, lng }, en km.
export function haversineKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Centre de l'ensemble des parcelles (moyenne des points), ou null.
export function parcelsCenter(parcels) {
  let lat = 0;
  let lng = 0;
  let n = 0;
  for (const p of parcels || []) {
    for (const pt of p.points || []) {
      lat += Number(pt[0]);
      lng += Number(pt[1]);
      n += 1;
    }
  }
  return n ? { lat: lat / n, lng: lng / n } : null;
}

// Estimation annuelle.
// areaM2 : surface totale ; passes : passages par an (1 a 10) ;
// distanceKm : distance par la route depuis BASE (null = inconnue) ;
// urgent / difficult / dispersed : situations particulieres cochees ;
// promoPercent : reduction du code promo, appliquee au traitement.
// Les majorations et le code promo portent sur le montant du traitement.
export function computeEstimate({ areaM2, passes, distanceKm = null, urgent = false, difficult = false, dispersed = false, promoPercent = 0 }) {
  const p = clampPasses(passes);
  const ha = Math.max(0, Number(areaM2) || 0) / 10000;
  const unit = PRICE_PER_HA[p - 1];

  // Traitement, avec le minimum par intervention
  const rawPerPass = ha * unit;
  const perPass = Math.max(rawPerPass, MIN_PER_PASS);
  const treatment = round(perPass * p);
  const minimumApplied = rawPerPass < MIN_PER_PASS;

  // Economie par rapport au tarif d'un seul passage (650 CHF/ha)
  const reference = round(Math.max(ha * REFERENCE_PRICE, MIN_PER_PASS) * p);
  const savings = Math.max(0, reference - treatment);

  // Deplacements
  let travel = { status: 'unknown' };
  if (distanceKm != null && Number.isFinite(Number(distanceKm))) {
    const km = Math.round(Number(distanceKm) * 10) / 10;
    const fee = travelFee(km);
    if (fee == null) {
      travel = { status: 'quote', km };
    } else {
      const reduction = travelReduction(p);
      const gross = fee * p;
      travel = { status: 'ok', km, fee, reduction, gross, discount: round(gross * reduction), total: round(gross * (1 - reduction)) };
    }
  }
  const travelTotal = travel.status === 'ok' ? travel.total : 0;

  // Situations particulieres
  const urgentAmount = urgent ? round(treatment * URGENT_RATE) : 0;
  const difficultRange = difficult ? DIFFICULT_RATE.map((r) => round(treatment * r)) : [0, 0];
  const dispersedRange = dispersed ? DISPERSED_RATE.map((r) => round(treatment * r)) : [0, 0];
  const promoRate = Math.min(100, Math.max(0, Number(promoPercent) || 0)) / 100;
  const promo = round(treatment * promoRate);

  const base = treatment + travelTotal + urgentAmount - promo;
  const totalMin = base + difficultRange[0] + dispersedRange[0];
  const totalMax = base + difficultRange[1] + dispersedRange[1];

  return {
    ha,
    passes: p,
    unit,
    perPass: round(perPass),
    minimumApplied,
    treatment,
    savings,
    travel,
    urgentAmount,
    difficultRange: difficult ? difficultRange : null,
    dispersedRange: dispersed ? dispersedRange : null,
    promoPercent: Math.round(promoRate * 100),
    promo,
    totalMin,
    totalMax,
    // Vrai quand tout est chiffre (deplacement connu et dans la zone)
    complete: travel.status === 'ok',
  };
}
