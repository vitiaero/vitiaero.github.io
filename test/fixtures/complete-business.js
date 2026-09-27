// Donnees de TEST uniquement : elles servent a verifier que la porte de
// lancement s'ouvre quand tout est renseigne. Toutes les valeurs sont
// volontairement fictives et ne sont jamais utilisees par le site.
import { business } from '../../shared/business.js';
import { MEDIA } from '../../shared/media.js';

const clone = (v) => JSON.parse(JSON.stringify(v));

// Entreprise reelle, sans aucune information fournie : l'etat de depart d'un
// vrai lancement (pre-lancement complet).
export function prelaunchBusiness() {
  const b = clone(business);
  delete b.fictional;
  b.identity = {
    ...b.identity,
    legalName: null, legalForm: null, commercialRegister: null, uid: null, vat: null, phone: null,
    address: { ...b.identity.address, street: null, postalCode: null, locality: null },
  };
  b.customers = null;
  b.services = { ...b.services, apiHosting: null, backups: null, mailbox: null, emailSending: null, routing: null, monitoring: null };
  b.retention = { ...b.retention, attachmentsMonths: null, inactiveAccountsMonths: null, backupsDays: null, serverLogsDays: null };
  b.commercial = {
    ...b.commercial,
    quoteValidityDays: null, payment: null, cancellation: null, weatherPostponementFree: null,
    products: null, complaintsDays: null, governingLanguage: null,
  };
  b.insurance = null;
  b.credentials = [];
  return b;
}

// Entreprise reelle dont tout est renseigne (sans le mode fictif).
export function completeBusiness(today = '2026-09-27') {
  const b = clone(business);
  delete b.fictional;
  const year = Number(today.slice(0, 4));
  const inTwoYears = `${year + 2}${today.slice(4)}`;
  b.identity = {
    ...b.identity,
    legalName: 'Entreprise Test Exemple Sàrl',
    legalForm: 'sarl',
    commercialRegister: { canton: 'VD' },
    uid: 'CHE-000.000.001',
    vat: { number: 'CHE-000.000.001 TVA', ratePercent: 8.1 },
    address: { street: 'Chemin de Test 1', postalCode: '1000', locality: 'Lausanne', canton: 'VD', country: 'CH' },
    email: 'test@example.ch',
    phone: '+41 00 000 00 00',
    contentResponsible: 'Personne Test',
  };
  b.site = { url: 'https://example.ch', domainHolderConfirmed: today };
  b.customers = 'professionals';
  b.services = {
    siteHosting: { ...b.services.siteHosting, confirmedOn: today },
    apiHosting: { name: 'Hebergeur Test SA', address: 'Rue Test 2, 1000 Lausanne', country: 'CH' },
    backups: { name: 'Stockage Test SA', country: 'CH', encrypted: true },
    mailbox: { name: 'Messagerie Test SA', country: 'CH' },
    emailSending: { name: 'Envoi Test SA', country: 'CH' },
    routing: false,
    monitoring: null,
  };
  b.retention = {
    requestsWithoutFollowUpMonths: 24,
    contractRecordsYears: 10,
    attachmentsMonths: 12,
    inactiveAccountsMonths: 36,
    backupsDays: 30,
    serverLogsDays: 14,
  };
  b.commercial = {
    ...b.commercial,
    quoteValidityDays: 30,
    payment: { dueDays: 30, deposit: false, methods: ['bank-transfer', 'qr-bill'], invoicing: 'after-each-job' },
    cancellation: { noticeHours: 48, fee: { percent: 20 } },
    weatherPostponementFree: true,
    products: 'customer',
    complaintsDays: 10,
    governingLanguage: 'fr',
    onlineOrdering: false,
    responseTimeHours: 48,
  };
  b.insurance = {
    insurer: 'Assurance Test SA', policyNumber: 'TEST-1', sumInsuredCHF: 5000000,
    validUntil: inTwoYears, verifiedOn: today, covers: ['drone-operation', 'spray-drift'],
  };
  const types = [
    'foca-spray-authorisation', 'cantonal-spray-requirements', 'agroscope-model-approval', 'sprayer-inspection',
    'pph-permit', 'pilot-competence', 'uas-operator-registration',
  ];
  b.credentials = types.map((type, i) => ({
    type, reference: `TEST-${i + 1}`, authority: 'Autorite Test', issuedOn: today, validUntil: inTwoYears, verifiedOn: today,
  }));
  b.legalReview = { reviewer: 'Juriste Test', date: today, documents: ['mentions', 'privacy', 'cookies', 'cgv', 'terms', 'forms', 'emails'] };
  b.launchChecklistSignedOn = today;
  return b;
}

// Registre des medias avec tous les droits confirmes (test uniquement).
export function confirmedMedia(today = '2026-09-27') {
  return clone(MEDIA).map((m) => ({
    ...m,
    rights: m.rights === 'pending' ? 'original' : m.rights,
    author: m.author || 'Auteur Test',
    declarationSignedOn: m.declarationRequired ? today : m.declarationSignedOn,
  }));
}
