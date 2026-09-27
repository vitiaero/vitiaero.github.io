// Cookies et stockage local (art. 45c LTC) : inventaire reel du stockage,
// possibilite de le refuser et de l'effacer.
import { tr, p, notice, table, action, link, section } from './core.js';
import { STORAGE } from '../storage.js';

export default function cookies(b, lang) {
  return {
    id: 'cookies',
    title: tr(lang, { fr: 'Cookies et stockage local', de: 'Cookies und lokale Speicherung', en: 'Cookies and local storage' }),
    sections: [
      section('summary', null, [
        notice(tr(lang, {
          fr: 'Ce site n\'utilise aucun cookie, aucun traceur publicitaire et aucun outil de mesure d\'audience. Seul un stockage technique, utile au fonctionnement, est gardé dans votre navigateur.',
          de: 'Diese Website verwendet keine Cookies, keine Werbe-Tracker und keine Reichweitenmessung. Nur eine technische Speicherung, die für den Betrieb nötig ist, bleibt in Ihrem Browser.',
          en: 'This website uses no cookies, no advertising trackers and no audience measurement. Only technical storage needed for the site to work is kept in your browser.',
        })),
      ]),

      section('stored', tr(lang, { fr: 'Ce qui est gardé sur votre appareil', de: 'Was auf Ihrem Gerät gespeichert wird', en: 'What is kept on your device' }), [
        table(
          [
            tr(lang, { fr: 'Nom', de: 'Name', en: 'Name' }),
            tr(lang, { fr: 'Type', de: 'Art', en: 'Type' }),
            tr(lang, { fr: 'Finalité', de: 'Zweck', en: 'Purpose' }),
            tr(lang, { fr: 'Durée', de: 'Dauer', en: 'Duration' }),
          ],
          STORAGE.map((s) => [
            s.key,
            tr(lang, { fr: 'Stockage local', de: 'Lokaler Speicher', en: 'Local storage' }),
            tr(lang, s.purpose),
            tr(lang, s.duration),
          ]),
        ),
      ]),

      section('refuse', tr(lang, { fr: 'Refuser ce stockage', de: 'Diese Speicherung ablehnen', en: 'Refusing this storage' }), [
        p(tr(lang, {
          fr: 'Vous pouvez le refuser en bloquant les données de ce site dans les réglages de votre navigateur (rubrique cookies ou données de sites). Le site reste consultable ; seules la connexion à l\'espace client et la mémorisation de vos choix ne fonctionnent plus.',
          de: 'Sie können sie ablehnen, indem Sie die Daten dieser Website in den Einstellungen Ihres Browsers sperren (Bereich Cookies oder Website-Daten). Die Website bleibt nutzbar; nur die Anmeldung im Kundenbereich und das Speichern Ihrer Einstellungen funktionieren dann nicht mehr.',
          en: 'You can refuse it by blocking this website\'s data in your browser settings (cookies or site data section). The website remains usable; only logging in to the customer area and remembering your choices no longer work.',
        })),
      ]),

      section('third', tr(lang, { fr: 'Hébergement et carte', de: 'Hosting und Karte', en: 'Hosting and map' }), [
        p(tr(lang, {
          fr: 'L\'hébergeur du site reçoit votre adresse IP à chaque visite. Sur la page d\'estimation, la carte reçoit ses fonds de swisstopo et, si vous choisissez le fond « Plan », d\'OpenStreetMap : ces services reçoivent votre adresse IP, sans déposer de cookie publicitaire. Voir la ',
          de: 'Der Hoster der Website erhält bei jedem Besuch Ihre IP-Adresse. Auf der Seite der Schätzung erhält die Karte ihre Hintergründe von swisstopo und, wenn Sie den Hintergrund «Plan» wählen, von OpenStreetMap: Diese Dienste erhalten Ihre IP-Adresse, ohne Werbe-Cookies zu setzen. Siehe ',
          en: 'The website host receives your IP address on each visit. On the estimate page, the map loads its backgrounds from swisstopo and, if you choose the "Street" background, from OpenStreetMap: these services receive your IP address without setting advertising cookies. See the ',
        }), link('/confidentialite', tr(lang, { fr: 'politique de confidentialité', de: 'Datenschutzerklärung', en: 'privacy policy' })), '.'),
      ]),

      section('erase', tr(lang, { fr: 'Effacer les données gardées', de: 'Gespeicherte Daten löschen', en: 'Deleting stored data' }), [
        p(tr(lang, {
          fr: 'Vous pouvez à tout moment effacer ce stockage depuis votre navigateur, ou avec le bouton ci-dessous. Vous serez alors déconnecté.',
          de: 'Sie können diese Speicherung jederzeit in Ihrem Browser löschen oder mit der Schaltfläche unten. Sie werden dann abgemeldet.',
          en: 'You can delete this storage at any time from your browser, or with the button below. You will then be logged out.',
        })),
        action(
          'clearStorage',
          tr(lang, { fr: 'Effacer les données de ce site', de: 'Daten dieser Website löschen', en: 'Delete this website\'s data' }),
          tr(lang, { fr: 'Données locales effacées.', de: 'Lokale Daten gelöscht.', en: 'Local data deleted.' }),
        ),
      ]),

      section('basis', tr(lang, { fr: 'Base légale', de: 'Rechtsgrundlage', en: 'Legal basis' }), [
        p(tr(lang, {
          fr: 'Cette information est donnée selon l\'art. 45c de la loi sur les télécommunications (LTC).',
          de: 'Diese Information erfolgt gemäss Art. 45c des Fernmeldegesetzes (FMG).',
          en: 'This information is given under art. 45c of the Telecommunications Act (TCA).',
        })),
      ]),
    ],
  };
}
