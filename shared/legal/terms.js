// Conditions d'utilisation du site (distinctes des CGV, qui regissent les
// prestations).
import { tr, p, link, section } from './core.js';
import { providerName, fictionalNotice } from './facts.js';
import { isText } from '../launch.js';

export default function terms(b, lang) {
  const who = providerName(b);
  const locality = b.identity?.address?.locality;
  let host = 'vitiaero.ch';
  try { host = new URL(b.site?.url).host; } catch { /* adresse par defaut */ }

  return {
    id: 'terms',
    numbered: true,
    title: tr(lang, { fr: 'Conditions d\'utilisation', de: 'Nutzungsbedingungen', en: 'Terms of use' }),
    sections: [
      section('fiction', null, [fictionalNotice(b, lang, 'terms')]),
      section('object', tr(lang, { fr: 'Objet', de: 'Gegenstand', en: 'Purpose' }), [
        p(tr(lang, {
          fr: `Le site ${host} présente le service de ${who}. Il permet de calculer une estimation indicative, de demander un devis et de suivre ses demandes dans un espace client.`,
          de: `Die Website ${host} stellt den Dienst von ${who} vor. Sie ermöglicht es, eine unverbindliche Schätzung zu berechnen, eine Offerte anzufragen und die eigenen Anfragen in einem Kundenbereich zu verfolgen.`,
          en: `The ${host} website presents the service of ${who}. It lets you calculate an indicative estimate, request a quote and follow your requests in a customer area.`,
        })),
      ]),

      section('estimate', tr(lang, { fr: 'Estimation', de: 'Schätzung', en: 'Estimate' }), [
        p(tr(lang, {
          fr: 'L\'estimation en ligne est gratuite et indicative. Elle ne constitue ni une offre ferme ni une commande. Envoyer une demande ne vous engage à rien ; seul un devis écrit, que vous acceptez par écrit, engage les parties.',
          de: 'Die Online-Schätzung ist kostenlos und unverbindlich. Sie ist weder ein verbindliches Angebot noch eine Bestellung. Das Senden einer Anfrage verpflichtet Sie zu nichts; nur eine schriftliche Offerte, die Sie schriftlich annehmen, verpflichtet die Parteien.',
          en: 'The online estimate is free and indicative. It is neither a firm offer nor an order. Sending a request does not commit you to anything; only a written quote that you accept in writing binds the parties.',
        })),
      ]),

      section('account', tr(lang, { fr: 'Compte client', de: 'Kundenkonto', en: 'Customer account' }), [
        p(tr(lang, {
          fr: 'Vous vous engagez à fournir des informations exactes et à garder votre mot de passe confidentiel. Vous répondez de l\'activité réalisée depuis votre compte. Vous pouvez télécharger vos données et supprimer votre compte à tout moment depuis votre espace client.',
          de: 'Sie verpflichten sich, korrekte Angaben zu machen und Ihr Passwort vertraulich zu behandeln. Sie sind für die Aktivitäten in Ihrem Konto verantwortlich. Sie können Ihre Daten jederzeit im Kundenbereich herunterladen und Ihr Konto löschen.',
          en: 'You agree to provide accurate information and to keep your password confidential. You are responsible for the activity carried out from your account. You can download your data and delete your account at any time from your customer area.',
        })),
      ]),

      section('tracking', tr(lang, { fr: 'Suivi des interventions', de: 'Übersicht der Einsätze', en: 'Record of jobs' }), [
        p(tr(lang, {
          fr: `L'espace client affiche les interventions enregistrées par ${who}, à titre de suivi. En cas de différence avec le devis ou la facture, ce sont ces documents qui font foi.`,
          de: `Der Kundenbereich zeigt die von ${who} erfassten Einsätze zur Übersicht an. Bei Abweichungen von Offerte oder Rechnung sind diese Dokumente massgebend.`,
          en: `The customer area shows the jobs recorded by ${who}, for information. If they differ from the quote or the invoice, those documents prevail.`,
        })),
      ]),

      section('use', tr(lang, { fr: 'Utilisation correcte', de: 'Korrekte Nutzung', en: 'Proper use' }), [
        p(tr(lang, {
          fr: `Il est interdit d'envoyer des demandes en masse ou de façon automatisée, de contourner les mesures de sécurité du site ou d'y transmettre des contenus illicites. ${who} peut bloquer une utilisation abusive.`,
          de: `Es ist untersagt, Anfragen massenhaft oder automatisiert zu senden, die Sicherheitsmassnahmen der Website zu umgehen oder rechtswidrige Inhalte zu übermitteln. ${who} kann eine missbräuchliche Nutzung sperren.`,
          en: `It is forbidden to send requests in bulk or in an automated way, to bypass the website's security measures or to send unlawful content through it. ${who} may block abusive use.`,
        })),
      ]),

      section('availability', tr(lang, { fr: 'Disponibilité', de: 'Verfügbarkeit', en: 'Availability' }), [
        p(tr(lang, {
          fr: 'Le site est fourni sans garantie de disponibilité continue. Il peut être interrompu, notamment pour maintenance.',
          de: 'Die Website wird ohne Gewähr einer ununterbrochenen Verfügbarkeit bereitgestellt. Sie kann unterbrochen werden, namentlich für Wartungsarbeiten.',
          en: 'The website is provided without any guarantee of continuous availability. It may be interrupted, notably for maintenance.',
        })),
      ]),

      section('ip', tr(lang, { fr: 'Propriété intellectuelle', de: 'Geistiges Eigentum', en: 'Intellectual property' }), [
        p(tr(lang, {
          fr: 'Les droits sur les contenus du site sont décrits dans les ',
          de: 'Die Rechte an den Inhalten der Website sind im ',
          en: 'The rights to the website content are described in the ',
        }), link('/mentions-legales', tr(lang, { fr: 'mentions légales', de: 'Impressum', en: 'legal notice' })),
        tr(lang, { fr: ' et sur la page ', de: ' und auf der Seite ', en: ' and on the ' }),
        link('/credits', tr(lang, { fr: 'Crédits', de: 'Credits', en: 'Credits page' })),
        tr(lang, { fr: '.', de: ' beschrieben.', en: '.' })),
      ]),

      section('data', tr(lang, { fr: 'Données personnelles', de: 'Personendaten', en: 'Personal data' }), [
        p(tr(lang, {
          fr: 'Le traitement des données est décrit dans la ',
          de: 'Die Datenbearbeitung ist in der ',
          en: 'Data processing is described in the ',
        }), link('/confidentialite', tr(lang, { fr: 'politique de confidentialité', de: 'Datenschutzerklärung', en: 'privacy policy' })),
        tr(lang, { fr: '.', de: ' beschrieben.', en: '.' })),
      ]),

      section('law', tr(lang, { fr: 'Droit applicable', de: 'Anwendbares Recht', en: 'Governing law' }), [
        p(tr(lang, {
          fr: `Les présentes conditions sont soumises au droit suisse. Le for est au siège de ${who}${isText(locality) ? `, à ${locality}` : ''}, sous réserve des fors impératifs prévus par la loi, notamment en faveur des consommateurs.`,
          de: `Diese Bedingungen unterstehen dem Schweizer Recht. Gerichtsstand ist der Sitz von ${who}${isText(locality) ? ` in ${locality}` : ''}, unter Vorbehalt der zwingenden gesetzlichen Gerichtsstände, namentlich zugunsten von Konsumentinnen und Konsumenten.`,
          en: `These terms are governed by Swiss law. The place of jurisdiction is the registered office of ${who}${isText(locality) ? `, in ${locality}` : ''}, subject to the mandatory places of jurisdiction provided by law, notably for consumers.`,
        })),
      ]),
    ],
  };
}
