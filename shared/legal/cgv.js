// Conditions generales de prestation. Une clause qui depend d'une donnee
// commerciale non fournie (paiement, annulation, reclamations...) n'est pas
// affichee ; un avis indique alors que les conditions ne sont pas en vigueur.
// Clauses a faire valider par un juriste suisse (docs/CHECKLIST-LANCEMENT.md).
import { tr, p, notice, link, section, fmtCHF } from './core.js';
import { providerName, identityComplete } from './facts.js';
import { PAYMENT_METHOD_LABELS, INVOICING_LABELS, CUSTOMER_LABELS, INSURANCE_COVER_LABELS } from './labels.js';
import { PAYMENT_METHODS, INVOICING, PRODUCT_SUPPLY, CUSTOMERS, VAT_RE, isText } from '../launch.js';

const isPos = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;
const joinList = (items, lang) => {
  if (items.length <= 1) return items.join('');
  const last = items[items.length - 1];
  const and = tr(lang, { fr: ' et ', de: ' und ', en: ' and ' });
  return items.slice(0, -1).join(', ') + and + last;
};

function paymentReady(pay) {
  return pay && typeof pay.dueDays === 'number' && pay.dueDays >= 0
    && (pay.deposit === false || (pay.deposit && typeof pay.deposit.percent === 'number'))
    && Array.isArray(pay.methods) && pay.methods.length > 0 && pay.methods.every((m) => PAYMENT_METHODS.includes(m))
    && INVOICING.includes(pay.invoicing);
}

function cancellationReady(c) {
  return c && typeof c.noticeHours === 'number' && c.noticeHours >= 0
    && (c.fee === false || (c.fee && (typeof c.fee.percent === 'number' || isPos(c.fee.chf))));
}

// Les CGV ne sont en vigueur que si tous leurs elements sont fournis.
export function cgvComplete(b) {
  const cm = b.commercial || {};
  const vat = b.identity?.vat;
  return identityComplete(b)
    && CUSTOMERS.includes(b.customers)
    && isPos(cm.quoteValidityDays)
    && paymentReady(cm.payment)
    && cancellationReady(cm.cancellation)
    && typeof cm.weatherPostponementFree === 'boolean'
    && PRODUCT_SUPPLY.includes(cm.products)
    && isPos(cm.complaintsDays)
    && (vat === false || VAT_RE.test(vat?.number || ''));
}

export default function cgv(b, lang) {
  const cm = b.commercial || {};
  const who = providerName(b);
  const vat = b.identity?.vat;
  const pay = cm.payment;
  const cancel = cm.cancellation;
  const ins = b.insurance;
  const locality = b.identity?.address?.locality;
  const insuranceShown = ins && isText(ins.insurer) && isPos(ins.sumInsuredCHF);

  return {
    id: 'cgv',
    numbered: true,
    title: tr(lang, { fr: 'Conditions générales', de: 'Allgemeine Geschäftsbedingungen', en: 'General terms and conditions' }),
    sections: [
      section('status', null, [
        !cgvComplete(b) && notice(tr(lang, {
          fr: 'Pré-lancement : ces conditions ne sont pas encore en vigueur. Les points encore ouverts (paiement, annulation, réclamations, assurance) seront publiés avant l\'ouverture du service. Aucun contrat ne peut être conclu d\'ici là.',
          de: 'Vor dem Start: Diese Bedingungen gelten noch nicht. Die offenen Punkte (Zahlung, Annullierung, Beanstandungen, Versicherung) werden vor der Eröffnung des Dienstes veröffentlicht. Bis dahin kann kein Vertrag geschlossen werden.',
          en: 'Pre-launch: these terms are not yet in force. The open points (payment, cancellation, complaints, insurance) will be published before the service opens. No contract can be concluded until then.',
        })),
      ]),

      section('scope', tr(lang, { fr: 'Champ d\'application', de: 'Geltungsbereich', en: 'Scope' }), [
        p(tr(lang, {
          fr: `Les présentes conditions générales régissent les prestations de traitement de la vigne par drone fournies par ${who}. Elles s'appliquent à tout contrat conclu sur la base d'un devis de ${who}.`,
          de: `Diese Allgemeinen Geschäftsbedingungen regeln die Leistungen zur Behandlung von Reben per Drohne, die ${who} erbringt. Sie gelten für jeden Vertrag, der auf Grundlage einer Offerte von ${who} geschlossen wird.`,
          en: `These general terms and conditions govern the vineyard treatment services by drone provided by ${who}. They apply to every contract concluded on the basis of a quote from ${who}.`,
        }), CUSTOMERS.includes(b.customers) ? tr(lang, {
          fr: ` Les prestations s'adressent ${CUSTOMER_LABELS[b.customers].fr}.`,
          de: ` Die Leistungen richten sich ${CUSTOMER_LABELS[b.customers].de}.`,
          en: ` The services are offered ${CUSTOMER_LABELS[b.customers].en}.`,
        }) : ''),
      ]),

      section('estimate', tr(lang, { fr: 'Estimation en ligne', de: 'Online-Schätzung', en: 'Online estimate' }), [
        p(tr(lang, {
          fr: 'L\'estimation calculée sur le site est gratuite et indicative. Elle ne constitue ni une offre ferme ni une commande, n\'engage aucune des parties et ne réserve aucune date d\'intervention.',
          de: 'Die auf der Website berechnete Schätzung ist kostenlos und unverbindlich. Sie ist weder ein verbindliches Angebot noch eine Bestellung, verpflichtet keine Partei und reserviert keinen Einsatztermin.',
          en: 'The estimate calculated on the website is free and indicative. It is neither a firm offer nor an order, binds neither party and does not reserve any date.',
        })),
      ]),

      section('contract', tr(lang, { fr: 'Devis et conclusion du contrat', de: 'Offerte und Vertragsabschluss', en: 'Quote and conclusion of the contract' }), [
        p(tr(lang, {
          fr: `Sur demande, ${who} établit un devis écrit après avoir étudié les parcelles et les conditions d'intervention.`,
          de: `Auf Anfrage erstellt ${who} nach Prüfung der Parzellen und der Einsatzbedingungen eine schriftliche Offerte.`,
          en: `On request, ${who} prepares a written quote after studying the plots and the working conditions.`,
        }), isPos(cm.quoteValidityDays) ? tr(lang, {
          fr: ` Le devis est valable ${cm.quoteValidityDays} jours.`,
          de: ` Die Offerte ist ${cm.quoteValidityDays} Tage gültig.`,
          en: ` The quote is valid for ${cm.quoteValidityDays} days.`,
        }) : '', tr(lang, {
          fr: ' Le contrat est conclu lorsque le client accepte le devis par écrit. Aucune commande ne peut être passée en ligne.',
          de: ' Der Vertrag kommt zustande, wenn die Kundschaft die Offerte schriftlich annimmt. Online kann nichts bestellt werden.',
          en: ' The contract is concluded when the customer accepts the quote in writing. No order can be placed online.',
        })),
      ]),

      section('prices', tr(lang, { fr: 'Prix', de: 'Preise', en: 'Prices' }), [
        p(tr(lang, {
          fr: 'Les prix sont indiqués en francs suisses.',
          de: 'Die Preise verstehen sich in Schweizer Franken.',
          en: 'Prices are stated in Swiss francs.',
        }), vat === false ? tr(lang, {
          fr: ` ${who} n'est pas assujettie à la TVA : les prix n'en contiennent pas.`,
          de: ` ${who} ist nicht mehrwertsteuerpflichtig: Die Preise enthalten keine MWST.`,
          en: ` ${who} is not registered for VAT: prices do not include any.`,
        }) : VAT_RE.test(vat?.number || '') && isPos(vat.ratePercent) ? tr(lang, {
          fr: ` Les prix comprennent la TVA au taux de ${vat.ratePercent} %.`,
          de: ` Die Preise enthalten die MWST zum Satz von ${vat.ratePercent} %.`,
          en: ` Prices include VAT at the rate of ${vat.ratePercent}%.`,
        }) : '', tr(lang, {
          fr: ' Les frais de déplacement, les majorations et le minimum par passage suivent la grille publiée au moment du devis. Sauf indication contraire dans le devis, les produits phytosanitaires ne sont pas compris.',
          de: ' Anfahrtskosten, Zuschläge und der Mindestbetrag pro Durchgang richten sich nach dem Tarif, der bei der Offerte veröffentlicht ist. Sofern die Offerte nichts anderes angibt, sind Pflanzenschutzmittel nicht inbegriffen.',
          en: ' Travel costs, surcharges and the minimum per pass follow the rates published at the time of the quote. Unless the quote states otherwise, plant protection products are not included.',
        })),
      ]),

      paymentReady(pay) && section('payment', tr(lang, { fr: 'Paiement', de: 'Zahlung', en: 'Payment' }), [
        p(tr(lang, {
          fr: `Les factures sont établies ${INVOICING_LABELS[pay.invoicing].fr} et sont payables dans les ${pay.dueDays} jours.`,
          de: `Die Rechnungen werden ${INVOICING_LABELS[pay.invoicing].de} gestellt und sind innert ${pay.dueDays} Tagen zahlbar.`,
          en: `Invoices are issued ${INVOICING_LABELS[pay.invoicing].en} and are payable within ${pay.dueDays} days.`,
        }), pay.deposit ? tr(lang, {
          fr: ` Un acompte de ${pay.deposit.percent} % est demandé à l'acceptation du devis.`,
          de: ` Bei Annahme der Offerte wird eine Anzahlung von ${pay.deposit.percent} % verlangt.`,
          en: ` A deposit of ${pay.deposit.percent}% is requested when the quote is accepted.`,
        }) : '', tr(lang, {
          fr: ` Moyens de paiement acceptés : ${joinList(pay.methods.map((m) => PAYMENT_METHOD_LABELS[m].fr), 'fr')}.`,
          de: ` Akzeptierte Zahlungsmittel: ${joinList(pay.methods.map((m) => PAYMENT_METHOD_LABELS[m].de), 'de')}.`,
          en: ` Accepted payment methods: ${joinList(pay.methods.map((m) => PAYMENT_METHOD_LABELS[m].en), 'en')}.`,
        })),
      ]),

      section('execution', tr(lang, { fr: 'Déroulement et obligations du client', de: 'Ablauf und Pflichten der Kundschaft', en: 'Performance and customer obligations' }), [
        p(tr(lang, {
          fr: `Le client garantit un accès sûr aux parcelles et fournit toutes les informations utiles : limites exactes, obstacles (lignes électriques, câbles, arbres, bâtiments), voisinage, ruchers, cours d'eau et zones sensibles. ${who} peut reporter ou refuser une intervention si la sécurité, la météo ou la réglementation ne la permettent pas.`,
          de: `Die Kundschaft gewährleistet einen sicheren Zugang zu den Parzellen und liefert alle nützlichen Angaben: genaue Grenzen, Hindernisse (Stromleitungen, Kabel, Bäume, Gebäude), Nachbarschaft, Bienenstände, Gewässer und sensible Zonen. ${who} kann einen Einsatz verschieben oder ablehnen, wenn Sicherheit, Wetter oder Vorschriften ihn nicht zulassen.`,
          en: `The customer guarantees safe access to the plots and provides all useful information: exact boundaries, obstacles (power lines, cables, trees, buildings), neighbours, beehives, watercourses and sensitive zones. ${who} may postpone or refuse a job if safety, the weather or the regulations do not allow it.`,
        }), cm.weatherPostponementFree === true ? tr(lang, {
          fr: ' Un report lié à la météo ou à une impossibilité technique n\'entraîne aucuns frais.',
          de: ' Eine Verschiebung wegen des Wetters oder aus technischen Gründen ist kostenlos.',
          en: ' A postponement due to the weather or a technical impossibility is free of charge.',
        }) : cm.weatherPostponementFree === false ? tr(lang, {
          fr: ' Les frais éventuels d\'un report lié à la météo sont indiqués dans le devis.',
          de: ' Allfällige Kosten einer Verschiebung wegen des Wetters sind in der Offerte angegeben.',
          en: ' Any costs of a postponement due to the weather are stated in the quote.',
        }) : ''),
      ]),

      section('products', tr(lang, { fr: 'Produits phytosanitaires', de: 'Pflanzenschutzmittel', en: 'Plant protection products' }), [
        p(cm.products === 'customer' ? tr(lang, {
          fr: 'Les produits sont fournis par le client, qui en choisit la nature et répond de leur autorisation et de leurs conditions d\'emploi. ',
          de: 'Die Mittel werden von der Kundschaft geliefert, die sie auswählt und für ihre Zulassung und Anwendungsbedingungen verantwortlich ist. ',
          en: 'The products are supplied by the customer, who chooses them and is responsible for their authorisation and conditions of use. ',
        }) : cm.products === 'provider' ? tr(lang, {
          fr: `Les produits sont fournis par ${who} et facturés selon le devis. `,
          de: `Die Mittel werden von ${who} geliefert und gemäss Offerte verrechnet. `,
          en: `The products are supplied by ${who} and invoiced according to the quote. `,
        }) : cm.products === 'by-quote' ? tr(lang, {
          fr: 'La fourniture des produits est réglée dans chaque devis. ',
          de: 'Die Lieferung der Mittel wird in jeder Offerte geregelt. ',
          en: 'The supply of products is set out in each quote. ',
        }) : '', tr(lang, {
          fr: 'Seuls des produits autorisés en Suisse sont employés, selon leurs conditions d\'emploi.',
          de: 'Es werden nur in der Schweiz zugelassene Mittel gemäss ihren Anwendungsbedingungen eingesetzt.',
          en: 'Only products authorised in Switzerland are used, according to their conditions of use.',
        })),
      ]),

      cancellationReady(cancel) && section('cancellation', tr(lang, { fr: 'Annulation', de: 'Annullierung', en: 'Cancellation' }), [
        p(cancel.fee === false ? tr(lang, {
          fr: `Le client peut annuler une intervention sans frais en prévenant au moins ${cancel.noticeHours} heures à l'avance.`,
          de: `Die Kundschaft kann einen Einsatz kostenlos annullieren, wenn sie mindestens ${cancel.noticeHours} Stunden im Voraus Bescheid gibt.`,
          en: `The customer may cancel a job free of charge by giving at least ${cancel.noticeHours} hours' notice.`,
        }) : tr(lang, {
          fr: `Le client peut annuler une intervention sans frais jusqu'à ${cancel.noticeHours} heures avant la date prévue. Passé ce délai, `,
          de: `Die Kundschaft kann einen Einsatz bis ${cancel.noticeHours} Stunden vor dem vorgesehenen Termin kostenlos annullieren. Danach `,
          en: `The customer may cancel a job free of charge up to ${cancel.noticeHours} hours before the planned date. After that, `,
        }), cancel.fee && typeof cancel.fee.percent === 'number' ? tr(lang, {
          fr: `${cancel.fee.percent} % du prix de l'intervention annulée est dû.`,
          de: `sind ${cancel.fee.percent} % des Preises des annullierten Einsatzes geschuldet.`,
          en: `${cancel.fee.percent}% of the price of the cancelled job is due.`,
        }) : cancel.fee && isPos(cancel.fee.chf) ? tr(lang, {
          fr: `un montant forfaitaire de ${fmtCHF(cancel.fee.chf)} est dû.`,
          de: `ist ein Pauschalbetrag von ${fmtCHF(cancel.fee.chf)} geschuldet.`,
          en: `a flat fee of ${fmtCHF(cancel.fee.chf)} is due.`,
        }) : ''),
      ]),

      section('regulation', tr(lang, { fr: 'Réglementation', de: 'Vorschriften', en: 'Regulations' }), [
        p(tr(lang, {
          fr: `${who} n'effectue une intervention que si les autorisations, contrôles et qualifications exigés par la réglementation suisse sont en place. Les justificatifs en cours de validité sont indiqués sur la page `,
          de: `${who} führt einen Einsatz nur durch, wenn die nach Schweizer Recht verlangten Bewilligungen, Prüfungen und Qualifikationen vorliegen. Die gültigen Nachweise stehen auf der Seite `,
          en: `${who} carries out a job only when the authorisations, inspections and qualifications required by Swiss regulations are in place. Valid supporting documents are listed on the `,
        }), link('/le-service#reglementation', tr(lang, { fr: 'Le service', de: 'Der Dienst', en: 'Service page' })), '.'),
      ]),

      section('liability', tr(lang, { fr: 'Responsabilité et assurance', de: 'Haftung und Versicherung', en: 'Liability and insurance' }), [
        p(tr(lang, {
          fr: `${who} répond des dommages qu'elle cause lors de l'exécution de la prestation, selon les dispositions légales. Elle ne répond pas des dommages qui résultent d'informations inexactes ou incomplètes fournies par le client, ni d'un accès non sécurisé.`,
          de: `${who} haftet für Schäden, die sie bei der Erbringung der Leistung verursacht, nach den gesetzlichen Bestimmungen. Sie haftet nicht für Schäden, die auf unrichtige oder unvollständige Angaben der Kundschaft oder auf einen unsicheren Zugang zurückgehen.`,
          en: `${who} is liable for damage it causes while performing the service, in accordance with the law. It is not liable for damage resulting from inaccurate or incomplete information supplied by the customer, or from unsafe access.`,
        }), insuranceShown ? tr(lang, {
          fr: ` ${who} est assurée en responsabilité civile auprès de ${ins.insurer}, pour une somme d'assurance de ${fmtCHF(ins.sumInsuredCHF)}`,
          de: ` ${who} ist bei ${ins.insurer} haftpflichtversichert, mit einer Versicherungssumme von ${fmtCHF(ins.sumInsuredCHF)}`,
          en: ` ${who} holds liability insurance with ${ins.insurer}, with a sum insured of ${fmtCHF(ins.sumInsuredCHF)}`,
        }) + (Array.isArray(ins.covers) && ins.covers.length ? tr(lang, {
          fr: ` (couverture : ${joinList(ins.covers.filter((c) => INSURANCE_COVER_LABELS[c]).map((c) => INSURANCE_COVER_LABELS[c].fr), 'fr')}).`,
          de: ` (Deckung: ${joinList(ins.covers.filter((c) => INSURANCE_COVER_LABELS[c]).map((c) => INSURANCE_COVER_LABELS[c].de), 'de')}).`,
          en: ` (cover: ${joinList(ins.covers.filter((c) => INSURANCE_COVER_LABELS[c]).map((c) => INSURANCE_COVER_LABELS[c].en), 'en')}).`,
        }) : '.') : ''),
      ]),

      isPos(cm.complaintsDays) && section('complaints', tr(lang, { fr: 'Réclamations', de: 'Beanstandungen', en: 'Complaints' }), [
        p(tr(lang, {
          fr: `Le client signale par écrit tout problème constaté après une intervention, dans les ${cm.complaintsDays} jours.`,
          de: `Die Kundschaft meldet jedes nach einem Einsatz festgestellte Problem schriftlich innert ${cm.complaintsDays} Tagen.`,
          en: `The customer reports in writing any problem noticed after a job, within ${cm.complaintsDays} days.`,
        })),
      ]),

      section('force', tr(lang, { fr: 'Force majeure', de: 'Höhere Gewalt', en: 'Force majeure' }), [
        p(tr(lang, {
          fr: 'Aucune partie ne répond d\'un manquement dû à un événement qu\'elle ne pouvait ni prévoir ni éviter, par exemple des intempéries exceptionnelles ou une restriction ordonnée par une autorité.',
          de: 'Keine Partei haftet für eine Nichterfüllung infolge eines Ereignisses, das sie weder vorhersehen noch verhindern konnte, etwa aussergewöhnliche Unwetter oder eine behördlich angeordnete Einschränkung.',
          en: 'Neither party is liable for a failure caused by an event it could neither foresee nor avoid, such as exceptional storms or a restriction ordered by an authority.',
        })),
      ]),

      section('data', tr(lang, { fr: 'Protection des données', de: 'Datenschutz', en: 'Data protection' }), [
        p(tr(lang, {
          fr: 'Le traitement des données est décrit dans la ',
          de: 'Die Datenbearbeitung ist in der ',
          en: 'Data processing is described in the ',
        }), link('/confidentialite', tr(lang, { fr: 'politique de confidentialité', de: 'Datenschutzerklärung', en: 'privacy policy' })),
        tr(lang, { fr: '.', de: ' beschrieben.', en: '.' })),
      ]),

      section('law', tr(lang, { fr: 'Droit applicable et for', de: 'Anwendbares Recht und Gerichtsstand', en: 'Governing law and jurisdiction' }), [
        p(tr(lang, {
          fr: `Les contrats sont soumis au droit suisse. Le for est au siège de ${who}${isText(locality) ? `, à ${locality}` : ''}, sous réserve des fors impératifs prévus par la loi, notamment en faveur des consommateurs (art. 32 et 35 du Code de procédure civile).`,
          de: `Die Verträge unterstehen dem Schweizer Recht. Gerichtsstand ist der Sitz von ${who}${isText(locality) ? ` in ${locality}` : ''}, unter Vorbehalt der zwingenden gesetzlichen Gerichtsstände, namentlich zugunsten von Konsumentinnen und Konsumenten (Art. 32 und 35 der Zivilprozessordnung).`,
          en: `Contracts are governed by Swiss law. The place of jurisdiction is the registered office of ${who}${isText(locality) ? `, in ${locality}` : ''}, subject to the mandatory places of jurisdiction provided by law, notably for consumers (art. 32 and 35 of the Civil Procedure Code).`,
        })),
        ['fr', 'de', 'en'].includes(cm.governingLanguage) && p(tr(lang, {
          fr: `Ces conditions existent en français, en allemand et en anglais. En cas de divergence, la version ${{ fr: 'française', de: 'allemande', en: 'anglaise' }[cm.governingLanguage]} fait foi.`,
          de: `Diese Bedingungen bestehen auf Französisch, Deutsch und Englisch. Bei Abweichungen ist die ${{ fr: 'französische', de: 'deutsche', en: 'englische' }[cm.governingLanguage]} Fassung massgebend.`,
          en: `These terms exist in French, German and English. In case of discrepancy, the ${{ fr: 'French', de: 'German', en: 'English' }[cm.governingLanguage]} version prevails.`,
        })),
      ]),
    ].filter(Boolean),
  };
}
