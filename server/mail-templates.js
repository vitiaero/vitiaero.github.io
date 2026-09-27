// Modeles des e-mails envoyes par le serveur, dans la langue du visiteur.
// Texte brut uniquement : aucun pixel, aucun lien traque, aucune image.
// Chaque accuse de reception rappelle que la demande n'est pas une commande.
import { tr, fmtCHF } from '../shared/legal/core.js';
import { providerName, addressLine } from '../shared/legal/facts.js';
import { isText } from '../shared/launch.js';

const LANGS = ['fr', 'de', 'en'];
export const safeLang = (lang) => (LANGS.includes(lang) ? lang : 'fr');

const siteUrl = (b) => (b.site?.url || 'https://vitiaero.ch').replace(/\/$/, '');

function signature(b, lang) {
  const rows = [providerName(b)];
  const address = addressLine(b, lang);
  if (address) rows.push(address);
  if (isText(b.identity?.email)) rows.push(b.identity.email);
  rows.push('');
  rows.push(tr(lang, {
    fr: `Protection des données : ${siteUrl(b)}/confidentialite`,
    de: `Datenschutz: ${siteUrl(b)}/confidentialite`,
    en: `Data protection: ${siteUrl(b)}/confidentialite`,
  }));
  return rows.join('\n');
}

const notAnOrder = (lang) => tr(lang, {
  fr: 'Important : cette demande n\'est pas une commande. Elle ne vous engage à rien et n\'engage pas non plus VitiAero. Après étude, nous vous proposerons un devis écrit ; un contrat n\'est conclu que si vous l\'acceptez par écrit.',
  de: 'Wichtig: Diese Anfrage ist keine Bestellung. Sie verpflichtet weder Sie noch VitiAero. Nach der Prüfung schlagen wir Ihnen eine schriftliche Offerte vor; ein Vertrag kommt nur zustande, wenn Sie diese schriftlich annehmen.',
  en: 'Important: this request is not an order. It commits neither you nor VitiAero. After review, we will send you a written quote; a contract is concluded only if you accept it in writing.',
});

function responseTime(b, lang) {
  const h = b.commercial?.responseTimeHours;
  if (!(h > 0)) return null;
  return tr(lang, {
    fr: `Nous vous répondons en général sous ${h} heures.`,
    de: `Wir antworten in der Regel innert ${h} Stunden.`,
    en: `We usually reply within ${h} hours.`,
  });
}

const hello = (name, lang) => tr(lang, { fr: `Bonjour ${name},`, de: `Guten Tag ${name}`, en: `Hello ${name},` });
const replyHint = (lang) => tr(lang, {
  fr: 'Pour toute question, répondez simplement à cet e-mail.',
  de: 'Bei Fragen antworten Sie einfach auf diese E-Mail.',
  en: 'If you have any questions, simply reply to this email.',
});

const fmtHa = (m2, lang) => (Number(m2 || 0) / 10000).toLocaleString({ fr: 'fr-CH', de: 'de-CH', en: 'en-GB' }[lang], { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function estimateTotal(est, lang) {
  if (!est) return null;
  const total = est.totalMin === est.totalMax
    ? fmtCHF(est.totalMin)
    : tr(lang, { fr: `${fmtCHF(est.totalMin)} à ${fmtCHF(est.totalMax)}`, de: `${fmtCHF(est.totalMin)} bis ${fmtCHF(est.totalMax)}`, en: `${fmtCHF(est.totalMin)} to ${fmtCHF(est.totalMax)}` });
  return total;
}

export function estimationAck(b, { lang: l, id, name, areaM2, passes, estimate }) {
  const lang = safeLang(l);
  const total = estimateTotal(estimate, lang);
  const lines = [
    hello(name, lang),
    '',
    tr(lang, {
      fr: `Nous avons bien reçu votre demande d'estimation n° ${id}.`,
      de: `Wir haben Ihre Anfrage für eine Schätzung Nr. ${id} erhalten.`,
      en: `We have received your estimate request no. ${id}.`,
    }),
    '',
    notAnOrder(lang),
    '',
    tr(lang, { fr: 'Résumé de votre demande', de: 'Zusammenfassung Ihrer Anfrage', en: 'Summary of your request' }),
    tr(lang, { fr: `- Surface tracée : ${fmtHa(areaM2, 'fr')} ha`, de: `- Eingezeichnete Fläche: ${fmtHa(areaM2, 'de')} ha`, en: `- Area drawn: ${fmtHa(areaM2, 'en')} ha` }),
    tr(lang, { fr: `- Passages par an : ${passes}`, de: `- Durchgänge pro Jahr: ${passes}`, en: `- Passes per year: ${passes}` }),
    total && tr(lang, {
      fr: `- Estimation indicative : ${total} par an`,
      de: `- Unverbindliche Schätzung: ${total} pro Jahr`,
      en: `- Indicative estimate: ${total} per year`,
    }),
    estimate && !estimate.complete && tr(lang, {
      fr: '- Frais de déplacement : à confirmer dans le devis',
      de: '- Anfahrtskosten: werden in der Offerte bestätigt',
      en: '- Travel costs: to be confirmed in the quote',
    }),
    '',
    tr(lang, {
      fr: 'Ce montant est calculé automatiquement à partir des informations fournies. Le prix définitif figure dans le devis.',
      de: 'Dieser Betrag wird automatisch aus Ihren Angaben berechnet. Der endgültige Preis steht in der Offerte.',
      en: 'This amount is calculated automatically from the information provided. The final price is given in the quote.',
    }),
    responseTime(b, lang),
    replyHint(lang),
    '',
    signature(b, lang),
  ];
  return {
    subject: tr(lang, {
      fr: `VitiAero : demande d'estimation n° ${id} reçue (sans engagement)`,
      de: `VitiAero: Schätzungsanfrage Nr. ${id} erhalten (unverbindlich)`,
      en: `VitiAero: estimate request no. ${id} received (no obligation)`,
    }),
    text: lines.filter((x) => x !== null && x !== false && x !== undefined).join('\n'),
  };
}

export function quoteAck(b, { lang: l, id, name, commune }) {
  const lang = safeLang(l);
  const lines = [
    hello(name, lang),
    '',
    tr(lang, {
      fr: `Nous avons bien reçu votre demande de devis n° ${id} pour la commune de ${commune}.`,
      de: `Wir haben Ihre Offertanfrage Nr. ${id} für die Gemeinde ${commune} erhalten.`,
      en: `We have received your quote request no. ${id} for the municipality of ${commune}.`,
    }),
    '',
    notAnOrder(lang),
    '',
    responseTime(b, lang),
    replyHint(lang),
    '',
    signature(b, lang),
  ];
  return {
    subject: tr(lang, {
      fr: `VitiAero : demande de devis n° ${id} reçue (sans engagement)`,
      de: `VitiAero: Offertanfrage Nr. ${id} erhalten (unverbindlich)`,
      en: `VitiAero: quote request no. ${id} received (no obligation)`,
    }),
    text: lines.filter((x) => x !== null && x !== undefined).join('\n'),
  };
}

export function contactAck(b, { lang: l, id, name }) {
  const lang = safeLang(l);
  const lines = [
    hello(name, lang),
    '',
    tr(lang, {
      fr: `Nous avons bien reçu votre message (référence ${id}).`,
      de: `Wir haben Ihre Nachricht erhalten (Referenz ${id}).`,
      en: `We have received your message (reference ${id}).`,
    }),
    responseTime(b, lang),
    replyHint(lang),
    '',
    signature(b, lang),
  ];
  return {
    subject: tr(lang, {
      fr: 'VitiAero : message reçu',
      de: 'VitiAero: Nachricht erhalten',
      en: 'VitiAero: message received',
    }),
    text: lines.filter((x) => x !== null && x !== undefined).join('\n'),
  };
}

export function accountDeleted(b, { lang: l, name, keptContractRecords }) {
  const lang = safeLang(l);
  const years = b.retention?.contractRecordsYears;
  const lines = [
    hello(name, lang),
    '',
    tr(lang, {
      fr: 'Votre compte VitiAero a été supprimé, avec les demandes et les données qui y étaient liées.',
      de: 'Ihr VitiAero-Konto wurde gelöscht, zusammen mit den damit verbundenen Anfragen und Daten.',
      en: 'Your VitiAero account has been deleted, together with the requests and data linked to it.',
    }),
    keptContractRecords && years > 0 && tr(lang, {
      fr: `Les dossiers liés à un contrat sont conservés ${years} ans, comme l'exige la loi, puis effacés.`,
      de: `Unterlagen zu einem Vertrag werden, wie gesetzlich vorgeschrieben, ${years} Jahre aufbewahrt und danach gelöscht.`,
      en: `Records linked to a contract are kept for ${years} years, as required by law, and then deleted.`,
    }),
    '',
    signature(b, lang),
  ];
  return {
    subject: tr(lang, { fr: 'VitiAero : compte supprimé', de: 'VitiAero: Konto gelöscht', en: 'VitiAero: account deleted' }),
    text: lines.filter((x) => x !== null && x !== undefined && x !== false).join('\n'),
  };
}

// Notification interne a l'equipe : le minimum, le detail se lit dans
// l'administration (l'e-mail transite par le service d'envoi).
export function teamNotification(b, { kind, id, commune, areaM2 }) {
  const label = { estimation: 'demande d\'estimation', devis: 'demande de devis', contact: 'message de contact' }[kind] || kind;
  const lines = [
    `Nouvelle ${label} n° ${id}.`,
    commune ? `Commune : ${commune}` : null,
    areaM2 ? `Surface : ${fmtHa(areaM2, 'fr')} ha` : null,
    '',
    `Détail dans l'administration : ${siteUrl(b)}/admin`,
  ];
  return { subject: `VitiAero : nouvelle ${label} n° ${id}`, text: lines.filter((x) => x !== null).join('\n') };
}
