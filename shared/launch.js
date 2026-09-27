// Porte de lancement : le site ne passe en exploitation commerciale que si
// chaque information obligatoire est reellement fournie dans shared/business.js
// et shared/media.js. Tant qu'un controle echoue :
//   - un bandeau explicite indique le pre-lancement ;
//   - les formulaires sont desactives dans le navigateur ET refuses par le serveur ;
//   - l'indexation est bloquee (robots.txt, balise noindex, en-tete X-Robots-Tag).
// Les references (A1, B4, E1...) renvoient a docs/INFORMATIONS-MANQUANTES.md.
// Ce module ne donne aucun avis juridique : il verifie seulement que les
// informations existent, sont completes et ne sont pas echues.
import { business as defaultBusiness } from './business.js';
import { MEDIA, mediaBlockers } from './media.js';
import { LEGAL_FORMS, CANTONS } from './legal/labels.js';

// Justificatifs exiges avant toute prestation (etat des exigences verifie le
// 24.9.2026, docs/CONFORMITE.md ; a revalider aupres des autorites).
export const REQUIRED_CREDENTIALS = [
  { type: 'foca-spray-authorisation', ref: 'E1', label: 'Autorisation de l\'OFAC pour la pulvérisation par drone' },
  { type: 'cantonal-spray-requirements', ref: 'E2', label: 'Exigences Vaud, Valais, Genève (SafetySpray, radiotéléphonie)' },
  { type: 'agroscope-model-approval', ref: 'E3', label: 'Homologation du modèle de drone par Agroscope' },
  { type: 'sprayer-inspection', ref: 'E4', label: 'Contrôle du pulvérisateur par un organisme agréé' },
  { type: 'pph-permit', ref: 'E5', label: 'Permis d\'utilisation professionnelle de produits phytosanitaires' },
  { type: 'pilot-competence', ref: 'E6', label: 'Compétences de télépilote exigées' },
  { type: 'uas-operator-registration', ref: 'E7', label: 'Enregistrement de l\'exploitant de drones (OFAC)' },
];

export const PAYMENT_METHODS = ['bank-transfer', 'qr-bill', 'twint', 'cash', 'card'];
export const INVOICING = ['after-each-job', 'end-of-season'];
export const PRODUCT_SUPPLY = ['customer', 'provider', 'by-quote'];
export const CUSTOMERS = ['professionals', 'professionals-and-consumers'];
export const SAFEGUARDS = ['adequate', 'dpf', 'scc'];
export const LEGAL_DOCUMENTS = ['mentions', 'privacy', 'cookies', 'cgv', 'terms', 'forms', 'emails'];
export const WARN_DAYS = 30; // alerte avant l'echeance d'un justificatif

const DAY = 24 * 60 * 60 * 1000;

// Texte reellement renseigne : ni vide, ni valeur a completer entre crochets.
export const isText = (v) => typeof v === 'string' && v.trim() !== '' && !/[[\]]/.test(v);
export const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
const isPositive = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;
const isPercent = (v) => typeof v === 'number' && v >= 0 && v <= 100;
const isEmail = (v) => isText(v) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const UID_RE = /^CHE-\d{3}\.\d{3}\.\d{3}$/;
export const VAT_RE = /^CHE-\d{3}\.\d{3}\.\d{3} (TVA|MWST|IVA|VAT)$/;

// Jour calendaire (UTC) d'une date, pour comparer des echeances sans heure.
const dayOf = (date) => Math.floor(date.getTime() / DAY);
const daysUntil = (iso, today) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY) - dayOf(today);

// Prestataire decrit completement. Hors de Suisse, la garantie doit etre dite.
export function isServiceComplete(s) {
  if (!s || typeof s !== 'object') return false;
  if (!isText(s.name) || !isText(s.country) || !/^[A-Z]{2}$/.test(s.country)) return false;
  if (s.country !== 'CH' && !SAFEGUARDS.includes(s.safeguard)) return false;
  return true;
}

// Etat d'un justificatif : 'valid', 'expired' ou 'incomplete'.
export function credentialState(c, today = new Date()) {
  if (!c || !isText(c.type) || !isText(c.reference) || !isText(c.authority)) return 'incomplete';
  if (!isDate(c.issuedOn) || !isDate(c.verifiedOn)) return 'incomplete';
  if (c.validUntil === false) return 'valid';
  if (!isDate(c.validUntil)) return 'incomplete';
  return daysUntil(c.validUntil, today) >= 0 ? 'valid' : 'expired';
}

export function insuranceState(ins, today = new Date()) {
  if (!ins || !isText(ins.insurer) || !isText(ins.policyNumber) || !isPositive(ins.sumInsuredCHF)) return 'incomplete';
  if (!isDate(ins.validUntil) || !isDate(ins.verifiedOn)) return 'incomplete';
  return daysUntil(ins.validUntil, today) >= 0 ? 'valid' : 'expired';
}

// Justificatifs affichables publiquement : complets et non echus.
export function validCredentials(b = defaultBusiness, today = new Date()) {
  return (b.credentials || []).filter((c) => credentialState(c, today) === 'valid');
}

function paymentOk(p) {
  if (!p || typeof p !== 'object') return false;
  if (typeof p.dueDays !== 'number' || p.dueDays < 0) return false;
  if (!(p.deposit === false || (p.deposit && isPercent(p.deposit.percent)))) return false;
  if (!Array.isArray(p.methods) || p.methods.length === 0 || !p.methods.every((m) => PAYMENT_METHODS.includes(m))) return false;
  return INVOICING.includes(p.invoicing);
}

function cancellationOk(c) {
  if (!c || typeof c !== 'object' || typeof c.noticeHours !== 'number' || c.noticeHours < 0) return false;
  return c.fee === false || (c.fee && (isPercent(c.fee.percent) || isPositive(c.fee.chf)));
}

// Liste complete des controles. Chaque controle : { id, ref, group, ok, label }.
export function launchChecks(b = defaultBusiness, { today = new Date(), media = MEDIA } = {}) {
  const id = b.identity || {};
  const addr = id.address || {};
  const sv = b.services || {};
  const rt = b.retention || {};
  const cm = b.commercial || {};
  const checks = [];
  const add = (group, ref, key, label, ok) => checks.push({ id: key, ref, group, ok: !!ok, label });

  // A. Identite
  add('identity', 'A1', 'identity.legalName', 'Raison sociale exacte', isText(id.legalName));
  add('identity', 'A2', 'identity.legalForm', 'Forme juridique', Object.hasOwn(LEGAL_FORMS, id.legalForm || ''));
  add('identity', 'A3', 'identity.commercialRegister', 'Inscription au registre du commerce (oui : canton ; non : false)',
    id.commercialRegister === false || Object.hasOwn(CANTONS, id.commercialRegister?.canton || ''));
  add('identity', 'A4', 'identity.uid', 'Numéro IDE ou déclaration « aucun »',
    id.uid === false || (typeof id.uid === 'string' && UID_RE.test(id.uid)));
  add('identity', 'A4', 'identity.uidConsistency', 'Entreprise inscrite ou assujettie à la TVA : numéro IDE requis',
    !((id.commercialRegister && id.commercialRegister !== false) || (id.vat && id.vat !== false)) || typeof id.uid === 'string');
  add('identity', 'A5', 'identity.vat', 'TVA : numéro et taux confirmés, ou « non assujetti »',
    id.vat === false || (id.vat && VAT_RE.test(id.vat.number || '') && isPositive(id.vat.ratePercent)));
  add('identity', 'A6', 'identity.address', 'Adresse postale complète',
    isText(addr.street) && typeof addr.postalCode === 'string' && /^\d{4}$/.test(addr.postalCode) && isText(addr.locality) && Object.hasOwn(CANTONS, addr.canton || ''));
  add('identity', 'A7', 'identity.email', 'Adresse e-mail de contact', isEmail(id.email));
  add('identity', 'A9', 'identity.contentResponsible', 'Personne responsable du contenu', isText(id.contentResponsible));
  add('identity', 'A10', 'site.domain', 'Adresse du site et titulaire du domaine vérifié',
    /^https:\/\/[a-z0-9.-]+$/.test(b.site?.url || '') && isDate(b.site?.domainHolderConfirmed));
  add('identity', 'D1', 'customers', 'Clientèle visée (professionnels, ou aussi particuliers)', CUSTOMERS.includes(b.customers));

  // B. Prestataires et donnees
  add('privacy', 'B3', 'services.siteHosting', 'Hébergeur du site public confirmé',
    isServiceComplete(sv.siteHosting) && isDate(sv.siteHosting?.confirmedOn));
  add('privacy', 'B4', 'services.apiHosting', 'Hébergeur de l\'API, de la base et des pièces jointes', isServiceComplete(sv.apiHosting));
  add('privacy', 'B5', 'services.backups', 'Stockage des sauvegardes (chiffrées)', isServiceComplete(sv.backups) && sv.backups?.encrypted === true);
  add('privacy', 'B6', 'services.mailbox', 'Fournisseur de la boîte de réception', isServiceComplete(sv.mailbox));
  add('privacy', 'B6', 'services.emailSending', 'Service d\'envoi des e-mails (SMTP)', isServiceComplete(sv.emailSending));
  add('privacy', 'B7', 'services.routing', 'Calcul des distances : vol d\'oiseau, OSRM auto-hébergé ou prestataire',
    sv.routing === false || sv.routing?.selfHosted === true || isServiceComplete(sv.routing));

  // C. Durees de conservation
  add('retention', 'C1', 'retention.requestsWithoutFollowUpMonths', 'Conservation des demandes sans suite', isPositive(rt.requestsWithoutFollowUpMonths));
  add('retention', 'C2', 'retention.contractRecordsYears', 'Conservation des dossiers liés à un contrat', isPositive(rt.contractRecordsYears));
  add('retention', 'C3', 'retention.attachmentsMonths', 'Conservation des pièces jointes', isPositive(rt.attachmentsMonths));
  add('retention', 'C4', 'retention.inactiveAccountsMonths', 'Conservation des comptes inactifs', isPositive(rt.inactiveAccountsMonths));
  add('retention', 'C5', 'retention.backupsDays', 'Conservation des sauvegardes', isPositive(rt.backupsDays));
  add('retention', 'C6', 'retention.serverLogsDays', 'Conservation des journaux du serveur', isPositive(rt.serverLogsDays));

  // D. Conditions commerciales
  add('commercial', 'D2', 'commercial.quoteValidityDays', 'Validité des devis', isPositive(cm.quoteValidityDays));
  add('commercial', 'D3', 'commercial.payment', 'Modalités de paiement', paymentOk(cm.payment));
  add('commercial', 'D5', 'commercial.cancellation', 'Conditions d\'annulation', cancellationOk(cm.cancellation));
  add('commercial', 'D6', 'commercial.weatherPostponementFree', 'Report pour météo : avec ou sans frais', typeof cm.weatherPostponementFree === 'boolean');
  add('commercial', 'D8', 'commercial.products', 'Fourniture des produits phytosanitaires', PRODUCT_SUPPLY.includes(cm.products));
  add('commercial', 'D9', 'commercial.complaintsDays', 'Délai de réclamation', isPositive(cm.complaintsDays));
  add('commercial', 'D15', 'commercial.responseTimeHours', 'Délai de réponse annoncé', isPositive(cm.responseTimeHours));
  add('commercial', 'D17', 'commercial.onlineOrdering', 'Commande en ligne désactivée (parcours contractuel non implémenté)', cm.onlineOrdering === false);
  add('commercial', 'D11', 'insurance', 'Assurance responsabilité civile complète et en cours de validité', insuranceState(b.insurance, today) === 'valid');

  // E. Justificatifs
  for (const req of REQUIRED_CREDENTIALS) {
    const ok = (b.credentials || []).some((c) => c.type === req.type && credentialState(c, today) === 'valid');
    add('credentials', req.ref, `credentials.${req.type}`, req.label, ok);
  }

  // F. Medias
  const pendingMedia = new Set(mediaBlockers(media).map((m) => m.id));
  for (const m of media) {
    if (!pendingMedia.has(`media:${m.id}`)) continue;
    const ref = m.id === 'logo' ? 'F2' : m.id === 'fpv-epesses' ? 'F1' : 'F';
    add('media', ref, `media.${m.id}`, `Droits confirmés par écrit : ${m.title.fr}`, false);
  }

  // G. Validation
  const review = b.legalReview;
  add('review', 'G1', 'legalReview', 'Relecture juridique des textes (juriste suisse)',
    review && isText(review.reviewer) && isDate(review.date)
      && LEGAL_DOCUMENTS.every((d) => Array.isArray(review.documents) && review.documents.includes(d)));
  add('review', 'G3', 'launchChecklistSignedOn', 'Checklist de lancement signée', isDate(b.launchChecklistSignedOn));

  return checks;
}

// Justificatifs et assurance proches de l'echeance (alerte, pas blocage).
export function launchWarnings(b = defaultBusiness, today = new Date()) {
  const out = [];
  for (const c of b.credentials || []) {
    if (credentialState(c, today) === 'valid' && isDate(c.validUntil)) {
      const days = daysUntil(c.validUntil, today);
      if (days <= WARN_DAYS) out.push({ id: `credentials.${c.type}`, days, label: `Échéance proche : ${c.type}` });
    }
  }
  if (insuranceState(b.insurance, today) === 'valid') {
    const days = daysUntil(b.insurance.validUntil, today);
    if (days <= WARN_DAYS) out.push({ id: 'insurance', days, label: 'Échéance proche : assurance RC' });
  }
  return out;
}

export function launchStatus(b = defaultBusiness, opts = {}) {
  const checks = launchChecks(b, opts);
  const blockers = checks.filter((c) => !c.ok);
  return {
    ready: blockers.length === 0,
    checks,
    blockers,
    warnings: launchWarnings(b, opts.today || new Date()),
  };
}
