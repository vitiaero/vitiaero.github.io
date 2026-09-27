// Elements tires de shared/business.js et repris par plusieurs documents :
// bloc d'identite, prestataires, avis de pre-lancement.
import { tr, strong, mail, lines, notice, countryName } from './core.js';
import { isText, isServiceComplete, UID_RE, VAT_RE } from '../launch.js';
import { LEGAL_FORMS, CANTONS } from './labels.js';

export const cantonLabel = (code, lang) => CANTONS[code]?.[lang] || code;

// Identite complete : tout ce que les mentions legales doivent afficher.
export function identityComplete(b) {
  const id = b.identity || {};
  const a = id.address || {};
  return isText(id.legalName)
    && Object.hasOwn(LEGAL_FORMS, id.legalForm || '')
    && isText(a.street) && /^\d{4}$/.test(a.postalCode || '') && isText(a.locality)
    && (id.commercialRegister === false || Object.hasOwn(CANTONS, id.commercialRegister?.canton || ''))
    && (id.uid === false || UID_RE.test(id.uid || ''))
    && (id.vat === false || VAT_RE.test(id.vat?.number || ''));
}

// Nom sous lequel le prestataire est designe : raison sociale si elle est
// fournie, sinon le nom commercial.
export const providerName = (b) => (isText(b.identity?.legalName) ? b.identity.legalName : b.identity?.brand || 'VitiAero');

export function addressLine(b, lang) {
  const a = b.identity?.address || {};
  if (!(isText(a.street) && isText(a.postalCode) && isText(a.locality))) return null;
  return `${a.street}, ${a.postalCode} ${a.locality}, ${countryName(a.country || 'CH', lang)}`;
}

// Bloc d'identite : uniquement les informations reellement fournies.
export function identityLines(b, lang) {
  const id = b.identity || {};
  const rows = [strong(providerName(b))];
  if (Object.hasOwn(LEGAL_FORMS, id.legalForm || '')) {
    rows.push(tr(lang, { fr: 'Forme juridique : ', de: 'Rechtsform: ', en: 'Legal form: ' }) + LEGAL_FORMS[id.legalForm][lang]);
  }
  const address = addressLine(b, lang);
  if (address) rows.push(address);
  if (isText(id.email)) rows.push([tr(lang, { fr: 'E-mail : ', de: 'E-Mail: ', en: 'Email: ' }), mail(id.email)]);
  if (isText(id.phone)) rows.push(tr(lang, { fr: 'Téléphone : ', de: 'Telefon: ', en: 'Phone: ' }) + id.phone);
  if (id.commercialRegister === false) {
    rows.push(tr(lang, { fr: 'Non inscrite au registre du commerce', de: 'Nicht im Handelsregister eingetragen', en: 'Not entered in the commercial register' }));
  } else if (Object.hasOwn(CANTONS, id.commercialRegister?.canton || '')) {
    const c = id.commercialRegister.canton;
    rows.push(tr(lang, {
      fr: `Inscrite au registre du commerce : ${cantonLabel(c, 'fr')}`,
      de: `Eingetragen im Handelsregister des Kantons ${cantonLabel(c, 'de')}`,
      en: `Entered in the commercial register of the canton of ${cantonLabel(c, 'en')}`,
    }));
  }
  if (UID_RE.test(id.uid || '')) rows.push(tr(lang, { fr: 'Numéro IDE : ', de: 'UID: ', en: 'Business identification number (UID): ' }) + id.uid);
  if (id.vat === false) {
    rows.push(tr(lang, { fr: 'Non assujettie à la TVA', de: 'Nicht mehrwertsteuerpflichtig', en: 'Not registered for VAT' }));
  } else if (VAT_RE.test(id.vat?.number || '')) {
    rows.push(tr(lang, { fr: 'Numéro TVA : ', de: 'MWST-Nummer: ', en: 'VAT number: ' }) + id.vat.number);
  }
  return lines(...rows);
}

export function prelaunchIdentityNotice(lang) {
  return notice(tr(lang, {
    fr: 'Pré-lancement : les informations complètes sur l\'entreprise (raison sociale, forme juridique, adresse postale, numéros d\'identification) seront publiées ici avant l\'ouverture du service.',
    de: 'Vor dem Start: Die vollständigen Angaben zum Unternehmen (Firma, Rechtsform, Postadresse, Identifikationsnummern) werden hier vor der Eröffnung des Dienstes veröffentlicht.',
    en: 'Pre-launch: full details of the business (business name, legal form, postal address, identification numbers) will be published here before the service opens.',
  }));
}

// Prestataires configures, dans un ordre stable, avec leur role.
export const SERVICE_ROLES = ['siteHosting', 'apiHosting', 'backups', 'mailbox', 'emailSending', 'routing', 'monitoring'];

export const SERVICE_ROLE_LABELS = {
  siteHosting: { fr: 'Hébergement du site', de: 'Hosting der Website', en: 'Website hosting' },
  apiHosting: {
    fr: 'Hébergement du serveur, de la base de données et des pièces jointes',
    de: 'Hosting des Servers, der Datenbank und der Anhänge',
    en: 'Hosting of the server, the database and the attachments',
  },
  backups: { fr: 'Stockage des sauvegardes chiffrées', de: 'Speicherung der verschlüsselten Sicherungen', en: 'Storage of the encrypted backups' },
  mailbox: { fr: 'Boîte de réception des e-mails', de: 'E-Mail-Postfach', en: 'Email inbox' },
  emailSending: { fr: 'Envoi des e-mails de confirmation', de: 'Versand der Bestätigungs-E-Mails', en: 'Sending of confirmation emails' },
  routing: { fr: 'Calcul des distances routières', de: 'Berechnung der Strassendistanzen', en: 'Road distance calculation' },
  monitoring: { fr: 'Surveillance de la disponibilité', de: 'Überwachung der Verfügbarkeit', en: 'Availability monitoring' },
};

// Liste des prestataires completement decrits (hors auto-hebergement).
export function configuredServices(b) {
  const sv = b.services || {};
  return SERVICE_ROLES
    .map((role) => ({ role, s: sv[role] }))
    .filter(({ s }) => isServiceComplete(s));
}

// Roles dont le prestataire n'est pas encore connu (null).
export function missingServices(b) {
  const sv = b.services || {};
  return ['apiHosting', 'backups', 'mailbox', 'emailSending', 'routing'].filter((role) => sv[role] === null || sv[role] === undefined);
}
