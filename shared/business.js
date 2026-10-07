// Donnees reelles de l'entreprise, fournies par le proprietaire.
// Source unique pour les pages legales, les e-mails, l'en-tete des PDF, les
// donnees structurees du site et la porte de lancement (shared/launch.js).
//
// Regles de saisie (detail dans docs/INFORMATIONS-MANQUANTES.md) :
//   null  = pas encore fourni. C'est la valeur par defaut ; elle bloque le
//           lancement quand l'information est obligatoire.
//   false = sans objet, declare par le proprietaire (ex. pas de numero TVA
//           parce que l'entreprise n'est pas assujettie).
// Jamais de valeur d'exemple ni de texte entre crochets.
//
// Ce fichier est PUBLIC (il est compile dans le site). N'y inscrire aucun
// secret, et ne jamais y copier un document : pour un permis, une autorisation
// ou une police d'assurance, seules la reference, l'autorite et les dates y
// figurent ; le document reste dans les dossiers du proprietaire.
//
// Dates au format AAAA-MM-JJ.
//
// ENTREPRISE FICTIVE. VitiAero est une entreprise imaginee pour un PAE au
// CPNV (fictional: true). Les valeurs ci-dessous marquees « fictif » sont
// inventees pour le projet : raison sociale, adresse, numeros, prestataires
// nommes « Exemple ... », durees, conditions et assurance. En mode fictif :
//   - chaque page l'annonce (bandeau, pied de page, pages legales) ;
//   - le site n'est jamais indexe et la porte de lancement reste fermee ;
//   - les formulaires s'affichent pour la demonstration, mais le site publie
//     n'enregistre rien (seul le serveur local de developpement les traite).
// Aucun numero de telephone n'est invente : il pourrait appartenir a quelqu'un.

export const business = {
  fictional: true,

  // A. Identite (art. 3 al. 1 let. s LCD, art. 19 nLPD)
  identity: {
    brand: 'VitiAero', // nom commercial affiche sur le site
    legalName: 'VitiAero Sàrl', // fictif ; raison sociale exacte (registre du commerce), ou nom et prenom du titulaire
    legalForm: 'sarl', // fictif ; code : 'raison-individuelle', 'sarl', 'sa', 'snc', 'cooperative' (libelles dans shared/legal/labels.js)
    commercialRegister: { canton: 'VD' }, // fictif ; false (non inscrit) ou { canton: 'VD' } (code du canton du registre)
    uid: 'CHE-000.000.000', // fictif, volontairement nul ; false (aucun) ou le numero IDE reel
    vat: false, // fictif : non assujettie ; sinon { number: 'CHE-... TVA', ratePercent: taux confirme par la fiduciaire }
    address: {
      street: 'Chemin du Projet 1', // fictif (rue inexistante) ; rue et numero
      postalCode: '1803', // NPA de Chardonne, base de depart des deplacements
      locality: 'Chardonne',
      canton: 'VD', // Vaud, fourni par le proprietaire (septembre 2026)
      country: 'CH',
    },
    email: 'contact@vitiaero.ch', // fourni ; boite a confirmer (A7)
    phone: null, // false = aucun numero publie
    contentResponsible: 'Adrien Delhay', // fourni (24.9.2026), a confirmer (A9)
  },

  // Adresse publique du site, sans barre finale : GitHub Pages du depot
  // vitiaero/vitiaero.github.io (branche vitiaero-publication, octobre 2026).
  site: {
    url: 'https://vitiaero.github.io',
    domainHolderConfirmed: null, // date a laquelle le titulaire du domaine a ete verifie (A10)
  },

  // Clientele visee (D1) : 'professionals' ou 'professionals-and-consumers'. Fictif.
  customers: 'professionals-and-consumers',

  // B. Prestataires qui recoivent des donnees personnelles.
  // Chaque entree : { name, address, country (code ISO), safeguard, since }
  // safeguard, pour un pays hors de Suisse : 'adequate' (Etat de l'annexe 1
  // OPDo), 'dpf' (entreprise certifiee Swiss-U.S. Data Privacy Framework),
  // 'scc' (clauses contractuelles types reconnues par le PFPDT).
  services: {
    // Hebergement du site public : GitHub Pages, en place depuis septembre 2026.
    // Certification DPF verifiee le 24.9.2026 (docs/CONFORMITE.md).
    siteHosting: {
      name: 'GitHub, Inc. (GitHub Pages)',
      address: '88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA',
      country: 'US',
      safeguard: 'dpf',
      verifiedOn: '2026-09-24',
      // Date a laquelle le proprietaire confirme garder cet hebergeur (B3).
      // Les regles de GitHub Pages limitent l'usage commercial : decision a prendre.
      confirmedOn: null,
    },
    // Prestataires fictifs (B4 a B6) : les noms « Exemple ... » sont inventes.
    apiHosting: { name: 'Exemple Hébergement SA', country: 'CH' }, // serveur, base de donnees et pieces jointes
    backups: { name: 'Exemple Sauvegarde SA', country: 'CH', encrypted: true }, // stockage des sauvegardes
    mailbox: { name: 'Exemple Messagerie SA', country: 'CH' }, // boite de reception
    emailSending: { name: 'Exemple Envoi SA', country: 'CH' }, // envoi des accuses de reception
    // Calcul des distances routieres (B7) : false = vol d'oiseau seulement ;
    // { selfHosted: true } = serveur OSRM sur l'hebergement de l'API ;
    // sinon un prestataire { name, country, safeguard }.
    routing: false,
    // Surveillance externe (B8) : false = seulement le controle planifie GitHub
    // Actions fourni avec le depot, qui ne traite aucune donnee de visiteur.
    monitoring: false,
  },

  // C. Durees de conservation reelles.
  retention: {
    requestsWithoutFollowUpMonths: 24, // choix du proprietaire du 24.9.2026, a confirmer (C1)
    contractRecordsYears: 10, // art. 958f CO, choix du 24.9.2026, a confirmer par la fiduciaire (C2)
    attachmentsMonths: 12, // C3, fictif
    inactiveAccountsMonths: 36, // C4, fictif
    backupsDays: 30, // C5, fictif
    serverLogsDays: 14, // C6, fictif (selon le contrat de l'hebergeur de l'API)
  },

  // D. Conditions commerciales. Rien n'est publie comme condition en vigueur
  // tant qu'un element obligatoire manque.
  commercial: {
    // Conditions fictives, inventees pour le projet.
    quoteValidityDays: 30, // D2
    payment: { dueDays: 30, deposit: false, methods: ['bank-transfer', 'qr-bill', 'twint'], invoicing: 'after-each-job' }, // D3
    cancellation: { noticeHours: 48, fee: { percent: 20 } }, // D5
    weatherPostponementFree: true, // D6
    products: 'customer', // D8 : 'customer' (fournis par le client), 'provider' (fournis par VitiAero), 'by-quote'
    complaintsDays: 10, // D9 : delai pour signaler un probleme apres l'intervention
    governingLanguage: 'fr', // D13
    // L'estimation en ligne n'est pas une commande. Activer une commande en
    // ligne demanderait tout le parcours contractuel (docs/PLAN-MIGRATION.md).
    onlineOrdering: false,
    responseTimeHours: 48, // D15, choix du proprietaire, a confirmer
  },

  // D11 / E8 : assurance responsabilite civile. Fictive (assureur « Exemple »).
  // { insurer, policyNumber, sumInsuredCHF, covers: ['drone-operation', 'spray-drift', 'third-party-crops'], validUntil, verifiedOn }
  insurance: {
    insurer: 'Exemple Assurances SA',
    policyNumber: 'FICTIF-0001',
    sumInsuredCHF: 5000000,
    covers: ['drone-operation', 'spray-drift', 'third-party-crops'],
    validUntil: '2027-12-31',
    verifiedOn: '2026-09-27',
  },

  // E. Justificatifs (autorisations, homologation, controles, permis).
  // Entreprise fictive : aucun justificatif n'est invente. La page Le service
  // explique qu'une entreprise reelle devrait les obtenir.
  // Chaque entree : { type, reference, authority, issuedOn, validUntil, verifiedOn }
  // validUntil : date d'echeance, ou false si le document n'en a pas.
  // Types attendus : voir REQUIRED_CREDENTIALS dans shared/launch.js.
  // Un justificatif n'est affiche que s'il est complet et non echu.
  credentials: [],

  // G1 : relecture juridique. { reviewer, date, documents: ['mentions', 'privacy', 'cookies', 'cgv', 'terms', 'forms', 'emails'] }
  legalReview: null,

  // G3 : date de signature de docs/CHECKLIST-LANCEMENT.md.
  launchChecklistSignedOn: null,
};

export default business;
