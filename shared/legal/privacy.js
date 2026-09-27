// Politique de confidentialite (LPD, RS 235.1). Construite a partir des
// prestataires et des durees reellement renseignes dans shared/business.js.
// Ce qui n'est pas encore fourni est annonce comme tel, jamais invente.
import { tr, p, ul, notice, link, mail, strong, section, countryName } from './core.js';
import {
  identityLines, identityComplete, prelaunchIdentityNotice, configuredServices, missingServices,
  SERVICE_ROLE_LABELS,
} from './facts.js';
import { SAFEGUARD_TEXT } from './labels.js';
import { isText, isServiceComplete } from '../launch.js';

const PFPDT = 'https://www.edoeb.admin.ch';

function siteHost(b) {
  try { return new URL(b.site?.url).host; } catch { return 'vitiaero.ch'; }
}

// Pays hors de Suisse : { pays, prestataires, garantie }.
function foreignTransfers(b, lang) {
  const items = [];
  for (const { role, s } of configuredServices(b)) {
    if (s.country === 'CH') continue;
    const country = { fr: countryName(s.country, 'fr'), de: countryName(s.country, 'de'), en: countryName(s.country, 'en') };
    const guarantee = SAFEGUARD_TEXT[s.safeguard](country);
    const sep = lang === 'fr' ? ' : ' : ': ';
    items.push([strong(countryName(s.country, lang)), `${sep}${s.name}, ${SERVICE_ROLE_LABELS[role][lang].toLowerCase()}. `, tr(lang, guarantee)]);
  }
  return items;
}

export default function privacy(b, lang) {
  const id = b.identity || {};
  const sv = b.services || {};
  const rt = b.retention || {};
  const host = siteHost(b);
  const services = configuredServices(b);
  const missing = missingServices(b);
  const siteHosting = isServiceComplete(sv.siteHosting) ? sv.siteHosting.name : null;
  const email = isText(id.email) ? id.email : null;

  const retentionItems = [
    rt.requestsWithoutFollowUpMonths > 0 && tr(lang, {
      fr: `Demandes d'estimation, demandes de devis et messages restés sans suite : ${rt.requestsWithoutFollowUpMonths} mois après le dernier échange.`,
      de: `Schätzungs- und Offertanfragen sowie Nachrichten ohne weitere Folge: ${rt.requestsWithoutFollowUpMonths} Monate nach dem letzten Austausch.`,
      en: `Estimate requests, quote requests and messages with no follow-up: ${rt.requestsWithoutFollowUpMonths} months after the last exchange.`,
    }),
    rt.contractRecordsYears > 0 && tr(lang, {
      fr: `Dossiers liés à un contrat (demande acceptée, interventions réalisées) : ${rt.contractRecordsYears} ans, durée de conservation des pièces comptables (art. 958f du Code des obligations).`,
      de: `Unterlagen zu einem Vertrag (angenommene Anfrage, durchgeführte Einsätze): ${rt.contractRecordsYears} Jahre, Aufbewahrungsdauer der Buchungsbelege (Art. 958f des Obligationenrechts).`,
      en: `Records linked to a contract (accepted request, completed jobs): ${rt.contractRecordsYears} years, the retention period for accounting records (art. 958f of the Code of Obligations).`,
    }),
    rt.attachmentsMonths > 0 && tr(lang, {
      fr: `Pièces jointes des demandes de devis : ${rt.attachmentsMonths} mois.`,
      de: `Anhänge von Offertanfragen: ${rt.attachmentsMonths} Monate.`,
      en: `Attachments to quote requests: ${rt.attachmentsMonths} months.`,
    }),
    rt.inactiveAccountsMonths > 0 && tr(lang, {
      fr: `Comptes clients : supprimés après ${rt.inactiveAccountsMonths} mois sans connexion, sauf les dossiers liés à un contrat.`,
      de: `Kundenkonten: gelöscht nach ${rt.inactiveAccountsMonths} Monaten ohne Anmeldung, ausgenommen Unterlagen zu einem Vertrag.`,
      en: `Customer accounts: deleted after ${rt.inactiveAccountsMonths} months without a login, except records linked to a contract.`,
    }),
    rt.backupsDays > 0 && tr(lang, {
      fr: `Sauvegardes chiffrées : ${rt.backupsDays} jours. Une donnée effacée peut y subsister jusqu'à la fin de ce délai.`,
      de: `Verschlüsselte Sicherungen: ${rt.backupsDays} Tage. Gelöschte Daten können bis zum Ablauf dieser Frist darin enthalten bleiben.`,
      en: `Encrypted backups: ${rt.backupsDays} days. Deleted data may remain in them until the end of this period.`,
    }),
    rt.serverLogsDays > 0 && tr(lang, {
      fr: `Journaux techniques du serveur : ${rt.serverLogsDays} jours.`,
      de: `Technische Protokolle des Servers: ${rt.serverLogsDays} Tage.`,
      en: `Technical server logs: ${rt.serverLogsDays} days.`,
    }),
    tr(lang, {
      fr: 'Preuve de la prise de connaissance de cette politique : supprimée avec la demande ou le compte auquel elle se rattache.',
      de: 'Nachweis der Kenntnisnahme dieser Erklärung: wird mit der zugehörigen Anfrage oder dem zugehörigen Konto gelöscht.',
      en: 'Proof that you read this policy: deleted together with the request or account it relates to.',
    }),
    tr(lang, {
      fr: 'Session de connexion : 7 jours au plus.',
      de: 'Anmeldesitzung: höchstens 7 Tage.',
      en: 'Login session: 7 days at most.',
    }),
    tr(lang, {
      fr: 'Compteurs contre les envois abusifs (adresse IP) : en mémoire, une heure au plus, jamais enregistrés dans la base de données.',
      de: 'Zähler gegen missbräuchliche Übermittlungen (IP-Adresse): im Arbeitsspeicher, höchstens eine Stunde, nie in der Datenbank gespeichert.',
      en: 'Counters against abusive submissions (IP address): kept in memory for one hour at most, never stored in the database.',
    }),
    siteHosting && tr(lang, {
      fr: `Journaux de l'hébergeur du site : selon les règles de ${siteHosting}.`,
      de: `Protokolle des Website-Hosters: gemäss den Regeln von ${siteHosting}.`,
      en: `Logs of the website host: according to the rules of ${siteHosting}.`,
    }),
    tr(lang, {
      fr: 'Stockage local dans votre navigateur : jusqu\'à ce que vous l\'effaciez.',
      de: 'Lokale Speicherung in Ihrem Browser: bis Sie sie löschen.',
      en: 'Local storage in your browser: until you delete it.',
    }),
  ];
  const retentionMissing = ['requestsWithoutFollowUpMonths', 'contractRecordsYears', 'attachmentsMonths', 'inactiveAccountsMonths', 'backupsDays', 'serverLogsDays']
    .some((k) => !(rt[k] > 0));

  return {
    id: 'privacy',
    numbered: true,
    title: tr(lang, { fr: 'Politique de confidentialité', de: 'Datenschutzerklärung', en: 'Privacy policy' }),
    sections: [
      section('intro', null, [
        p(tr(lang, {
          fr: `Cette politique explique quelles données personnelles sont traitées sur le site ${host} et lors des demandes qui y sont faites, dans quel but, avec qui elles sont partagées et quels sont vos droits. Elle suit la loi fédérale sur la protection des données (LPD).`,
          de: `Diese Erklärung zeigt, welche Personendaten auf der Website ${host} und bei den dort gestellten Anfragen bearbeitet werden, zu welchem Zweck, an wen sie weitergegeben werden und welche Rechte Sie haben. Sie folgt dem Bundesgesetz über den Datenschutz (DSG).`,
          en: `This policy explains which personal data are processed on the ${host} website and in the requests made through it, for what purpose, with whom they are shared and what your rights are. It follows the Swiss Federal Act on Data Protection (FADP).`,
        })),
      ]),

      section('controller', tr(lang, { fr: 'Responsable du traitement', de: 'Verantwortliche Stelle', en: 'Controller' }), [
        identityLines(b, lang),
        !identityComplete(b) && prelaunchIdentityNotice(lang),
        email && p(tr(lang, {
          fr: 'Pour toute question sur vos données : ',
          de: 'Für alle Fragen zu Ihren Daten: ',
          en: 'For any question about your data: ',
        }), mail(email), '.'),
      ]),

      section('prelaunch', tr(lang, { fr: 'Avant l\'ouverture du service', de: 'Vor der Eröffnung des Dienstes', en: 'Before the service opens' }), [
        p(tr(lang, {
          fr: 'Tant que le service n\'est pas ouvert, un bandeau l\'indique en haut de chaque page et les formulaires du site sont désactivés : aucune donnée n\'est transmise par leur intermédiaire. Si vous nous écrivez par e-mail, nous recevons votre adresse et le contenu de votre message.',
          de: 'Solange der Dienst nicht eröffnet ist, weist ein Band oben auf jeder Seite darauf hin, und die Formulare der Website sind deaktiviert: Über sie werden keine Daten übermittelt. Wenn Sie uns per E-Mail schreiben, erhalten wir Ihre Adresse und den Inhalt Ihrer Nachricht.',
          en: 'Until the service opens, a banner says so at the top of every page and the website\'s forms are disabled: no data are sent through them. If you write to us by email, we receive your address and the content of your message.',
        })),
      ]),

      section('visit', tr(lang, { fr: 'Lors de votre visite', de: 'Beim Besuch der Website', en: 'When you visit the website' }), [
        ul([
          siteHosting && [strong(tr(lang, { fr: 'Hébergement. ', de: 'Hosting. ', en: 'Hosting. ' })), tr(lang, {
            fr: `Le site est hébergé par ${siteHosting}. Comme tout serveur web, l'hébergeur reçoit l'adresse IP et les informations techniques de chaque requête, et les enregistre pour des raisons de sécurité.`,
            de: `Die Website wird von ${siteHosting} gehostet. Wie jeder Webserver erhält der Hoster die IP-Adresse und die technischen Angaben jeder Anfrage und speichert sie aus Sicherheitsgründen.`,
            en: `The website is hosted by ${siteHosting}. Like any web server, the host receives the IP address and technical details of each request and stores them for security reasons.`,
          })],
          [strong(tr(lang, { fr: 'Carte. ', de: 'Karte. ', en: 'Map. ' })), tr(lang, {
            fr: 'Les fonds « Satellite », « Carte » et « Cadastre » et la recherche de commune viennent de l\'Office fédéral de topographie swisstopo, qui reçoit votre adresse IP et le lieu recherché. Le fond « Plan » vient d\'OpenStreetMap ; il n\'est chargé que si vous le choisissez, et OpenStreetMap reçoit alors votre adresse IP.',
            de: 'Die Hintergründe «Satellit», «Karte» und «Kataster» sowie die Gemeindesuche stammen vom Bundesamt für Landestopografie swisstopo, das Ihre IP-Adresse und den gesuchten Ort erhält. Der Hintergrund «Plan» stammt von OpenStreetMap; er wird nur geladen, wenn Sie ihn wählen, und OpenStreetMap erhält dann Ihre IP-Adresse.',
            en: 'The "Satellite", "Map" and "Land register" backgrounds and the municipality search come from the Federal Office of Topography swisstopo, which receives your IP address and the place searched. The "Street" background comes from OpenStreetMap; it is loaded only if you choose it, and OpenStreetMap then receives your IP address.',
          })],
          [strong(tr(lang, { fr: 'Calcul de l\'estimation. ', de: 'Berechnung der Schätzung. ', en: 'Estimate calculation. ' })), tr(lang, {
            fr: 'Le prix se calcule dans votre navigateur. Pour les frais de déplacement, seules les coordonnées du centre des parcelles tracées sont envoyées à notre serveur, sans aucune autre information.',
            de: 'Der Preis wird in Ihrem Browser berechnet. Für die Anfahrtskosten werden nur die Koordinaten des Mittelpunkts der eingezeichneten Parzellen an unseren Server gesendet, ohne weitere Angaben.',
            en: 'The price is calculated in your browser. For travel costs, only the coordinates of the centre of the plots you drew are sent to our server, with no other information.',
          })],
          [strong(tr(lang, { fr: 'Stockage local. ', de: 'Lokale Speicherung. ', en: 'Local storage. ' })), tr(lang, {
            fr: 'Quelques réglages techniques sont gardés dans votre navigateur. Le détail figure sur la page ',
            de: 'Einige technische Einstellungen werden in Ihrem Browser gespeichert. Einzelheiten auf der Seite ',
            en: 'A few technical settings are kept in your browser. Details are on the ',
          }), link('/cookies', tr(lang, { fr: 'cookies et stockage local', de: 'Cookies und lokale Speicherung', en: 'cookies and local storage page' })), '.'],
        ]),
        p(tr(lang, {
          fr: 'Le site n\'utilise aucun cookie, aucun traceur publicitaire et aucun outil de mesure d\'audience.',
          de: 'Die Website verwendet keine Cookies, keine Werbe-Tracker und keine Reichweitenmessung.',
          en: 'The website uses no cookies, no advertising trackers and no audience measurement.',
        })),
      ]),

      section('forms', tr(lang, { fr: 'Données transmises par les formulaires', de: 'Über die Formulare übermittelte Daten', en: 'Data sent through the forms' }), [
        p(tr(lang, {
          fr: 'Une fois le service ouvert, les formulaires transmettent les données que vous y saisissez :',
          de: 'Nach der Eröffnung des Dienstes übermitteln die Formulare die Daten, die Sie eingeben:',
          en: 'Once the service is open, the forms send the data you enter:',
        })),
        ul([
          tr(lang, {
            fr: 'demande d\'estimation : nom, e-mail, téléphone, commune et adresse ou lieu-dit (facultatifs), tracé et surface des parcelles, nombre de passages, traitement et période souhaités, situations particulières, message, code promo éventuel ;',
            de: 'Anfrage für eine Schätzung: Name, E-Mail, Telefon, Gemeinde sowie Adresse oder Flurname (freiwillig), Umriss und Fläche der Parzellen, Anzahl Durchgänge, gewünschte Behandlung und Zeitraum, besondere Situationen, Nachricht, allfälliger Aktionscode;',
            en: 'estimate request: name, email, phone, municipality and address or place name (optional), outline and area of the plots, number of passes, treatment and period wanted, special situations, message, any promo code;',
          }),
          tr(lang, {
            fr: 'demande de devis : nom, entreprise (facultatif), e-mail, téléphone (facultatif), commune, surface, nombre de passages, message et pièces jointes (photos ou PDF) ;',
            de: 'Offertanfrage: Name, Betrieb (freiwillig), E-Mail, Telefon (freiwillig), Gemeinde, Fläche, Anzahl Durchgänge, Nachricht und Anhänge (Fotos oder PDF);',
            en: 'quote request: name, business (optional), email, phone (optional), municipality, area, number of passes, message and attachments (photos or PDF);',
          }),
          tr(lang, {
            fr: 'message de contact : nom, e-mail, téléphone (facultatif) et message ;',
            de: 'Kontaktnachricht: Name, E-Mail, Telefon (freiwillig) und Nachricht;',
            en: 'contact message: name, email, phone (optional) and message;',
          }),
          tr(lang, {
            fr: 'compte client : nom, e-mail, mot de passe (conservé uniquement sous la forme d\'une empreinte cryptographique), date de création et de dernière connexion, et les interventions enregistrées par notre équipe ;',
            de: 'Kundenkonto: Name, E-Mail, Passwort (nur als kryptografischer Fingerabdruck gespeichert), Datum der Eröffnung und der letzten Anmeldung sowie die von unserem Team erfassten Einsätze;',
            en: 'customer account: name, email, password (kept only as a cryptographic fingerprint), creation and last login dates, and the jobs recorded by our team;',
          }),
          tr(lang, {
            fr: 'pour chaque envoi : la version de la présente politique dont vous avez pris connaissance, la date et la finalité de l\'envoi, afin de pouvoir le prouver, ainsi que la langue du site, pour vous répondre dans cette langue.',
            de: 'bei jeder Übermittlung: die Version dieser Erklärung, die Sie zur Kenntnis genommen haben, Datum und Zweck der Übermittlung, um dies belegen zu können, sowie die Sprache der Website, um Ihnen in dieser Sprache zu antworten.',
            en: 'for each submission: the version of this policy you read, the date and the purpose of the submission, so that it can be proven, and the website language, so that we can reply in that language.',
          }),
        ]),
      ]),

      section('purposes', tr(lang, { fr: 'Finalités', de: 'Zwecke', en: 'Purposes' }), [
        p(tr(lang, {
          fr: 'Répondre à vos questions et demandes, établir une estimation ou un devis, exécuter et facturer les prestations, gérer votre compte et le suivi des interventions, vous envoyer les e-mails liés à votre demande, assurer la sécurité du site et respecter nos obligations légales, notamment comptables. Vos données ne sont ni vendues, ni utilisées pour de la publicité ou du profilage.',
          de: 'Ihre Fragen und Anfragen beantworten, eine Schätzung oder Offerte erstellen, die Leistungen erbringen und verrechnen, Ihr Konto und die Übersicht der Einsätze führen, Ihnen die E-Mails zu Ihrer Anfrage senden, die Sicherheit der Website gewährleisten und unsere gesetzlichen Pflichten einhalten, namentlich die Buchführung. Ihre Daten werden weder verkauft noch für Werbung oder Profiling verwendet.',
          en: 'Answering your questions and requests, preparing an estimate or a quote, performing and invoicing the services, managing your account and the record of jobs, sending you the emails linked to your request, keeping the website secure and meeting our legal obligations, notably in accounting. Your data are neither sold nor used for advertising or profiling.',
        })),
      ]),

      section('emails', tr(lang, { fr: 'E-mails', de: 'E-Mails', en: 'Emails' }), [
        p(tr(lang, {
          fr: 'Après l\'envoi d\'un formulaire, nous vous envoyons un e-mail de confirmation. Il ne contient aucun élément de suivi (pixel invisible ou lien traqué). Nous n\'envoyons pas de lettre d\'information.',
          de: 'Nach dem Absenden eines Formulars senden wir Ihnen eine Bestätigungs-E-Mail. Sie enthält kein Verfolgungselement (unsichtbares Pixel oder verfolgter Link). Wir versenden keinen Newsletter.',
          en: 'After you send a form, we send you a confirmation email. It contains no tracking element (invisible pixel or tracked link). We do not send newsletters.',
        })),
      ]),

      section('recipients', tr(lang, { fr: 'Prestataires et destinataires', de: 'Dienstleister und Empfänger', en: 'Service providers and recipients' }), [
        ul([
          ...services.map(({ role, s }) => [strong(SERVICE_ROLE_LABELS[role][lang]), `${lang === 'fr' ? ' : ' : ': '}${s.name}, ${countryName(s.country, lang)}`]),
          [strong(tr(lang, { fr: 'Fonds de carte et recherche de lieux', de: 'Kartenhintergründe und Ortssuche', en: 'Base maps and place search' })),
            tr(lang, {
              fr: ' : Office fédéral de topographie swisstopo (Suisse) ; OpenStreetMap Foundation (Royaume-Uni), seulement pour le fond « Plan ».',
              de: ': Bundesamt für Landestopografie swisstopo (Schweiz); OpenStreetMap Foundation (Vereinigtes Königreich), nur für den Hintergrund «Plan».',
              en: ': Federal Office of Topography swisstopo (Switzerland); OpenStreetMap Foundation (United Kingdom), only for the "Street" background.',
            })],
        ]),
        isServiceComplete(sv.apiHosting) && p(tr(lang, {
          fr: 'Les prestataires qui traitent des données pour notre compte le font sur nos instructions, dans le cadre d\'un contrat (art. 9 LPD). Nous ne communiquons vos données à une autorité que si la loi l\'exige.',
          de: 'Dienstleister, die Daten in unserem Auftrag bearbeiten, tun dies nach unseren Weisungen und auf Grundlage eines Vertrags (Art. 9 DSG). Behörden geben wir Ihre Daten nur bekannt, wenn das Gesetz es verlangt.',
          en: 'Service providers that process data on our behalf do so on our instructions, under a contract (art. 9 FADP). We disclose your data to an authority only where the law requires it.',
        })),
        missing.length > 0 && notice(tr(lang, {
          fr: 'Pré-lancement : les prestataires de l\'hébergement du serveur, des sauvegardes, des e-mails et du calcul des distances seront indiqués ici avant l\'ouverture des formulaires.',
          de: 'Vor dem Start: Die Dienstleister für das Server-Hosting, die Sicherungen, die E-Mails und die Distanzberechnung werden hier vor der Öffnung der Formulare angegeben.',
          en: 'Pre-launch: the providers for server hosting, backups, emails and distance calculation will be listed here before the forms open.',
        })),
      ]),

      section('abroad', tr(lang, { fr: 'Communication à l\'étranger', de: 'Bekanntgabe ins Ausland', en: 'Disclosure abroad' }), [
        ul([
          ...foreignTransfers(b, lang),
          [strong(tr(lang, { fr: 'Royaume-Uni et Pays-Bas', de: 'Vereinigtes Königreich und Niederlande', en: 'United Kingdom and the Netherlands' })), tr(lang, {
            fr: ' : OpenStreetMap, seulement si vous choisissez le fond « Plan ». Ces deux pays figurent dans la liste des États qui offrent un niveau de protection adéquat (annexe 1 OPDo). Les tuiles passent aussi par un réseau mondial de serveurs de cache dont OpenStreetMap ne publie pas la liste des pays. Pour éviter tout envoi vers OpenStreetMap, utilisez les fonds « Satellite », « Carte » ou « Cadastre ».',
            de: ': OpenStreetMap, nur wenn Sie den Hintergrund «Plan» wählen. Beide Länder sind in der Liste der Staaten mit angemessenem Datenschutz aufgeführt (Anhang 1 DSV). Die Kacheln laufen zudem über ein weltweites Netz von Cache-Servern, dessen Länder OpenStreetMap nicht veröffentlicht. Um jede Übermittlung an OpenStreetMap zu vermeiden, verwenden Sie die Hintergründe «Satellit», «Karte» oder «Kataster».',
            en: ': OpenStreetMap, only if you choose the "Street" background. Both countries are on the list of countries that provide an adequate level of protection (annex 1 DPO). The tiles also pass through a worldwide network of cache servers whose countries OpenStreetMap does not publish. To avoid any transfer to OpenStreetMap, use the "Satellite", "Map" or "Land register" backgrounds.',
          })],
        ]),
      ]),

      section('retention', tr(lang, { fr: 'Durée de conservation', de: 'Aufbewahrungsdauer', en: 'Retention periods' }), [
        ul(retentionItems),
        retentionMissing && notice(tr(lang, {
          fr: 'Pré-lancement : les durées qui manquent dans cette liste seront fixées et publiées avant l\'ouverture des formulaires.',
          de: 'Vor dem Start: Die in dieser Liste fehlenden Fristen werden vor der Öffnung der Formulare festgelegt und veröffentlicht.',
          en: 'Pre-launch: the periods missing from this list will be set and published before the forms open.',
        })),
        p(tr(lang, {
          fr: 'À l\'échéance, les données sont effacées automatiquement, pièces jointes comprises.',
          de: 'Nach Ablauf werden die Daten automatisch gelöscht, einschliesslich der Anhänge.',
          en: 'When the period ends, the data are deleted automatically, attachments included.',
        })),
      ]),

      section('security', tr(lang, { fr: 'Sécurité', de: 'Sicherheit', en: 'Security' }), [
        p(tr(lang, {
          fr: 'Le site est servi en connexion chiffrée (HTTPS) et ne charge aucun script de tiers. Une politique de sécurité du contenu limite les ressources acceptées par le navigateur. Les mots de passe ne sont jamais conservés en clair, les sauvegardes sont chiffrées et l\'accès aux demandes est réservé à l\'équipe.',
          de: 'Die Website wird über eine verschlüsselte Verbindung (HTTPS) ausgeliefert und lädt keine Skripte Dritter. Eine Inhaltssicherheitsrichtlinie begrenzt die Ressourcen, die der Browser akzeptiert. Passwörter werden nie im Klartext gespeichert, Sicherungen sind verschlüsselt, und der Zugang zu den Anfragen ist dem Team vorbehalten.',
          en: 'The website is served over an encrypted connection (HTTPS) and loads no third-party scripts. A content security policy limits the resources the browser accepts. Passwords are never stored in plain text, backups are encrypted and access to requests is restricted to the team.',
        })),
      ]),

      section('rights', tr(lang, { fr: 'Vos droits', de: 'Ihre Rechte', en: 'Your rights' }), [
        p(tr(lang, { fr: 'Selon la LPD, vous pouvez notamment :', de: 'Nach dem DSG können Sie insbesondere:', en: 'Under the FADP, you may in particular:' })),
        ul([
          tr(lang, {
            fr: 'savoir si des données vous concernant sont traitées et en obtenir une copie (art. 25) ;',
            de: 'erfahren, ob Daten über Sie bearbeitet werden, und eine Kopie erhalten (Art. 25);',
            en: 'find out whether data about you are processed and obtain a copy (art. 25);',
          }),
          tr(lang, {
            fr: 'recevoir, dans certains cas, les données que vous nous avez fournies dans un format électronique courant (art. 28) ;',
            de: 'in bestimmten Fällen die von Ihnen bereitgestellten Daten in einem gängigen elektronischen Format erhalten (Art. 28);',
            en: 'in certain cases, receive the data you provided in a common electronic format (art. 28);',
          }),
          tr(lang, {
            fr: 'faire corriger des données inexactes, vous opposer à un traitement ou demander l\'effacement de vos données (art. 32).',
            de: 'unrichtige Daten berichtigen lassen, einer Bearbeitung widersprechen oder die Löschung Ihrer Daten verlangen (Art. 32).',
            en: 'have inaccurate data corrected, object to processing or ask for your data to be deleted (art. 32).',
          }),
        ]),
        p(tr(lang, {
          fr: 'Si vous avez un compte, vous pouvez télécharger vos données et supprimer votre compte vous-même depuis votre espace client. Pour toute autre demande, écrivez-nous',
          de: 'Mit einem Konto können Sie Ihre Daten selbst herunterladen und Ihr Konto im Kundenbereich löschen. Für alle anderen Anliegen schreiben Sie uns',
          en: 'If you have an account, you can download your data and delete your account yourself from your customer area. For any other request, write to us',
        }), email ? [tr(lang, { fr: ' à ', de: ' an ', en: ' at ' }), mail(email)] : '', tr(lang, {
          fr: ' ; nous pouvons vous demander de justifier votre identité et répondons en principe dans les 30 jours. Vous pouvez aussi vous adresser au Préposé fédéral à la protection des données et à la transparence (PFPDT) : ',
          de: '; wir können Sie bitten, Ihre Identität nachzuweisen, und antworten grundsätzlich innert 30 Tagen. Sie können sich auch an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) wenden: ',
          en: '; we may ask you to prove your identity and normally reply within 30 days. You may also contact the Federal Data Protection and Information Commissioner (FDPIC): ',
        }), link(PFPDT, 'www.edoeb.admin.ch'), '.'),
      ]),

      section('automated', tr(lang, { fr: 'Aucune décision automatisée', de: 'Keine automatisierten Entscheidungen', en: 'No automated decisions' }), [
        p(tr(lang, {
          fr: 'Le montant affiché par l\'estimation en ligne est un calcul automatique et indicatif. Il ne constitue pas une décision individuelle automatisée : toute offre est établie et vérifiée par une personne.',
          de: 'Der Betrag der Online-Schätzung ist eine automatische, unverbindliche Berechnung. Er ist keine automatisierte Einzelentscheidung: Jede Offerte wird von einer Person erstellt und geprüft.',
          en: 'The amount shown by the online estimate is an automatic, indicative calculation. It is not an automated individual decision: every quote is prepared and checked by a person.',
        })),
      ]),

      section('changes', tr(lang, { fr: 'Modifications', de: 'Änderungen', en: 'Changes' }), [
        p(tr(lang, {
          fr: 'Cette politique peut évoluer. La version en vigueur et sa date figurent en haut de la page. Lors de chaque envoi, nous enregistrons la version dont vous avez pris connaissance.',
          de: 'Diese Erklärung kann sich ändern. Die geltende Version und ihr Datum stehen oben auf der Seite. Bei jeder Übermittlung speichern wir die Version, die Sie zur Kenntnis genommen haben.',
          en: 'This policy may change. The version in force and its date are shown at the top of the page. With each submission, we record the version you read.',
        })),
      ]),
    ],
  };
}
