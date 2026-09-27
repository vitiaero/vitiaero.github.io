// Libelles des valeurs codees de shared/business.js, dans les trois langues.
// Les donnees sont saisies une seule fois (codes) et affichees dans la langue
// du lecteur : aucune traduction libre par le proprietaire n'est necessaire.

export const LEGAL_FORMS = {
  'raison-individuelle': { fr: 'Raison individuelle', de: 'Einzelunternehmen', en: 'Sole proprietorship' },
  sarl: { fr: 'Société à responsabilité limitée (Sàrl)', de: 'Gesellschaft mit beschränkter Haftung (GmbH)', en: 'Limited liability company (Sàrl/GmbH)' },
  sa: { fr: 'Société anonyme (SA)', de: 'Aktiengesellschaft (AG)', en: 'Company limited by shares (SA/AG)' },
  snc: { fr: 'Société en nom collectif', de: 'Kollektivgesellschaft', en: 'General partnership' },
  cooperative: { fr: 'Société coopérative', de: 'Genossenschaft', en: 'Cooperative' },
};

export const CANTONS = {
  ZH: { fr: 'Zurich', de: 'Zürich', en: 'Zurich' },
  BE: { fr: 'Berne', de: 'Bern', en: 'Bern' },
  LU: { fr: 'Lucerne', de: 'Luzern', en: 'Lucerne' },
  UR: { fr: 'Uri', de: 'Uri', en: 'Uri' },
  SZ: { fr: 'Schwytz', de: 'Schwyz', en: 'Schwyz' },
  OW: { fr: 'Obwald', de: 'Obwalden', en: 'Obwalden' },
  NW: { fr: 'Nidwald', de: 'Nidwalden', en: 'Nidwalden' },
  GL: { fr: 'Glaris', de: 'Glarus', en: 'Glarus' },
  ZG: { fr: 'Zoug', de: 'Zug', en: 'Zug' },
  FR: { fr: 'Fribourg', de: 'Freiburg', en: 'Fribourg' },
  SO: { fr: 'Soleure', de: 'Solothurn', en: 'Solothurn' },
  BS: { fr: 'Bâle-Ville', de: 'Basel-Stadt', en: 'Basel-Stadt' },
  BL: { fr: 'Bâle-Campagne', de: 'Basel-Landschaft', en: 'Basel-Landschaft' },
  SH: { fr: 'Schaffhouse', de: 'Schaffhausen', en: 'Schaffhausen' },
  AR: { fr: 'Appenzell Rhodes-Extérieures', de: 'Appenzell Ausserrhoden', en: 'Appenzell Ausserrhoden' },
  AI: { fr: 'Appenzell Rhodes-Intérieures', de: 'Appenzell Innerrhoden', en: 'Appenzell Innerrhoden' },
  SG: { fr: 'Saint-Gall', de: 'St. Gallen', en: 'St. Gallen' },
  GR: { fr: 'Grisons', de: 'Graubünden', en: 'Graubünden' },
  AG: { fr: 'Argovie', de: 'Aargau', en: 'Aargau' },
  TG: { fr: 'Thurgovie', de: 'Thurgau', en: 'Thurgau' },
  TI: { fr: 'Tessin', de: 'Tessin', en: 'Ticino' },
  VD: { fr: 'Vaud', de: 'Waadt', en: 'Vaud' },
  VS: { fr: 'Valais', de: 'Wallis', en: 'Valais' },
  NE: { fr: 'Neuchâtel', de: 'Neuenburg', en: 'Neuchâtel' },
  GE: { fr: 'Genève', de: 'Genf', en: 'Geneva' },
  JU: { fr: 'Jura', de: 'Jura', en: 'Jura' },
};

export const PAYMENT_METHOD_LABELS = {
  'bank-transfer': { fr: 'virement bancaire', de: 'Banküberweisung', en: 'bank transfer' },
  'qr-bill': { fr: 'QR-facture', de: 'QR-Rechnung', en: 'QR-bill' },
  twint: { fr: 'TWINT', de: 'TWINT', en: 'TWINT' },
  cash: { fr: 'espèces', de: 'Barzahlung', en: 'cash' },
  card: { fr: 'carte de paiement', de: 'Zahlungskarte', en: 'payment card' },
};

export const INVOICING_LABELS = {
  'after-each-job': { fr: 'après chaque intervention', de: 'nach jedem Einsatz', en: 'after each job' },
  'end-of-season': { fr: 'en fin de saison', de: 'am Ende der Saison', en: 'at the end of the season' },
};

export const CUSTOMER_LABELS = {
  professionals: {
    fr: 'aux exploitants et entreprises agricoles et viticoles (clientèle professionnelle)',
    de: 'an landwirtschaftliche Betriebe und Weinbaubetriebe (Geschäftskundschaft)',
    en: 'to farms and wine-growing businesses (business customers)',
  },
  'professionals-and-consumers': {
    fr: 'aux professionnels comme aux particuliers propriétaires de vignes',
    de: 'an Geschäftskundschaft wie an Privatpersonen mit eigenen Reben',
    en: 'to business customers as well as private owners of vines',
  },
};

// Garanties d'un transfert a l'etranger (art. 16 nLPD, annexe 1 OPDo).
export const SAFEGUARD_TEXT = {
  adequate: (country) => ({
    fr: `${country.fr} figure dans la liste des États qui offrent un niveau de protection adéquat (annexe 1 de l'ordonnance sur la protection des données, OPDo).`,
    de: `${country.de} ist in der Liste der Staaten mit angemessenem Datenschutz aufgeführt (Anhang 1 der Datenschutzverordnung, DSV).`,
    en: `${country.en} is on the list of countries that provide an adequate level of protection (annex 1 of the Data Protection Ordinance, DPO).`,
  }),
  dpf: () => ({
    fr: 'L\'entreprise est certifiée au cadre de protection des données Suisse-États-Unis (Swiss-U.S. Data Privacy Framework). Pour les entreprises certifiées, le Conseil fédéral reconnaît un niveau de protection adéquat (annexe 1 OPDo).',
    de: 'Das Unternehmen ist unter dem Swiss-U.S. Data Privacy Framework zertifiziert. Für zertifizierte Unternehmen anerkennt der Bundesrat einen angemessenen Datenschutz (Anhang 1 DSV).',
    en: 'The company is certified under the Swiss-U.S. Data Privacy Framework. For certified companies, the Federal Council recognises an adequate level of protection (annex 1 DPO).',
  }),
  scc: () => ({
    fr: 'Le transfert est encadré par des clauses contractuelles types reconnues par le Préposé fédéral à la protection des données et à la transparence (PFPDT).',
    de: 'Die Übermittlung ist durch Standardvertragsklauseln abgesichert, die vom Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) anerkannt sind.',
    en: 'The transfer is covered by standard contractual clauses recognised by the Federal Data Protection and Information Commissioner (FDPIC).',
  }),
};

export const CREDENTIAL_LABELS = {
  'foca-spray-authorisation': {
    fr: 'Autorisation de l\'Office fédéral de l\'aviation civile (OFAC) pour la pulvérisation par drone',
    de: 'Bewilligung des Bundesamts für Zivilluftfahrt (BAZL) für das Sprühen mit Drohnen',
    en: 'Authorisation of the Federal Office of Civil Aviation (FOCA) for spraying by drone',
  },
  'cantonal-spray-requirements': {
    fr: 'Exigences applicables dans les cantons de Vaud, du Valais et de Genève (outil SafetySpray, radiotéléphonie)',
    de: 'Anforderungen in den Kantonen Waadt, Wallis und Genf (Werkzeug SafetySpray, Sprechfunk)',
    en: 'Requirements applying in the cantons of Vaud, Valais and Geneva (SafetySpray tool, radiotelephony)',
  },
  'agroscope-model-approval': {
    fr: 'Homologation du modèle de drone par Agroscope',
    de: 'Zulassung des Drohnenmodells durch Agroscope',
    en: 'Approval of the drone model by Agroscope',
  },
  'sprayer-inspection': {
    fr: 'Contrôle du pulvérisateur par un organisme agréé',
    de: 'Prüfung des Sprühgeräts durch eine anerkannte Stelle',
    en: 'Inspection of the sprayer by an approved body',
  },
  'pph-permit': {
    fr: 'Permis pour l\'utilisation professionnelle de produits phytosanitaires',
    de: 'Fachbewilligung für die berufliche Verwendung von Pflanzenschutzmitteln',
    en: 'Permit for the professional use of plant protection products',
  },
  'pilot-competence': {
    fr: 'Compétences de télépilote exigées pour cette exploitation',
    de: 'Für diesen Betrieb verlangte Fernpilotenkompetenzen',
    en: 'Remote pilot competence required for this operation',
  },
  'uas-operator-registration': {
    fr: 'Enregistrement de l\'exploitant de drones auprès de l\'OFAC',
    de: 'Registrierung des Drohnenbetreibers beim BAZL',
    en: 'Registration of the drone operator with FOCA',
  },
};

export const INSURANCE_COVER_LABELS = {
  'drone-operation': { fr: 'exploitation du drone', de: 'Betrieb der Drohne', en: 'operation of the drone' },
  'spray-drift': { fr: 'dérive de produit', de: 'Abdrift von Mitteln', en: 'spray drift' },
  'third-party-crops': { fr: 'dommages aux cultures de tiers', de: 'Schäden an Kulturen Dritter', en: 'damage to third-party crops' },
};
