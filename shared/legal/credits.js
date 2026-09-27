// Page publique des credits : medias (tires de shared/media.js), fonds de
// carte, police, logiciels libres et marques.
import { tr, p, ul, link, section } from './core.js';
import { MEDIA } from '../media.js';

// Formule imposee par la licence du plan cadastral, dans la langue du lecteur
// (licence CadastralWebMap, verifiee le 24.9.2026).
export const CADASTRE_CREDIT = {
  fr: '© Mensuration Officielle Suisse / FL',
  de: '© Amtliche Vermessung Schweiz / FL',
  en: '© Cadastral Surveying Switzerland / FL',
};

const LINKS = {
  swisstopoTerms: 'https://www.swisstopo.admin.ch/fr/conditions-utilisation-geodonnees-et-geoservices-gratuit',
  cadastre: 'https://www.cadastre.ch/fr/service-de-consultation-cadastralwebmap-wms',
  osmCopyright: 'https://www.openstreetmap.org/copyright',
};

function mediaItem(m, lang) {
  const quoted = { fr: `« ${m.title.fr} »`, de: `«${m.title.de}»`, en: `"${m.title.en}"` }[lang];
  const parts = [`${quoted}${lang === 'fr' ? ' : ' : ': '}${m.author}`];
  if (m.source) parts.push(', ', link(m.source, 'Wikimedia Commons'));
  if (m.license) {
    parts.push(tr(lang, { fr: ', licence ', de: ', Lizenz ', en: ', licence ' }));
    parts.push(link(m.license.url.startsWith('http') ? m.license.url : `file:${m.license.url}`, m.license.name));
  }
  parts.push('.');
  if (m.changes) parts.push(` ${m.changes[lang]}`);
  return parts;
}

export default function credits(b, lang, { media = MEDIA } = {}) {
  const photos = media.filter((m) => ['fpv-epesses', 'lavaux-kohler'].includes(m.id) && m.author);
  const font = media.find((m) => m.id === 'inter');
  const routingOsm = b.services?.routing?.selfHosted === true;

  return {
    id: 'credits',
    title: tr(lang, { fr: 'Crédits', de: 'Credits', en: 'Credits' }),
    sections: [
      section('media', tr(lang, { fr: 'Photos et vidéos', de: 'Fotos und Videos', en: 'Photos and videos' }), [
        ul(photos.map((m) => mediaItem(m, lang))),
      ]),

      section('illustrations', tr(lang, { fr: 'Illustrations', de: 'Illustrationen', en: 'Illustrations' }), [
        p(tr(lang, {
          fr: 'Les illustrations, pictogrammes et l\'icône du site ont été créés pour VitiAero. Les schémas de la page Équipement représentent un drone agricole de façon générale ; ce ne sont pas des images du fabricant.',
          de: 'Die Illustrationen, Piktogramme und das Website-Symbol wurden für VitiAero erstellt. Die Schemas auf der Seite Ausrüstung zeigen eine Landwirtschaftsdrohne allgemein; es sind keine Bilder des Herstellers.',
          en: 'The illustrations, pictograms and site icon were created for VitiAero. The diagrams on the Equipment page show an agricultural drone in general terms; they are not manufacturer images.',
        })),
      ]),

      section('maps', tr(lang, { fr: 'Fonds de carte et recherche de lieux', de: 'Kartenhintergründe und Ortssuche', en: 'Base maps and place search' }), [
        ul([
          [tr(lang, { fr: 'Satellite et Carte : ©swisstopo, selon les ', de: 'Satellit und Karte: ©swisstopo, gemäss den ', en: 'Satellite and Map: ©swisstopo, under the ' }),
            link(LINKS.swisstopoTerms, tr(lang, {
              fr: 'conditions d\'utilisation des géodonnées gratuites de swisstopo',
              de: 'Nutzungsbedingungen für kostenlose Geodaten von swisstopo',
              en: 'terms of use for swisstopo free geodata',
            })), '.'],
          [tr(lang, { fr: 'Cadastre : ', de: 'Kataster: ', en: 'Land register: ' }), CADASTRE_CREDIT[lang], tr(lang, {
            fr: ', service ', de: ', Dienst ', en: ', ',
          }), link(LINKS.cadastre, 'CadastralWebMap'), tr(lang, {
            fr: ' diffusé par geo.admin.ch.', de: ', bereitgestellt über geo.admin.ch.', en: ' service provided through geo.admin.ch.',
          })],
          [tr(lang, { fr: 'Plan : © ', de: 'Plan: © ', en: 'Street: © ' }), link(LINKS.osmCopyright, 'OpenStreetMap contributors'),
            tr(lang, { fr: ', données sous licence ODbL.', de: ', Daten unter der Lizenz ODbL.', en: ', data under the ODbL licence.' })],
          tr(lang, {
            fr: 'Recherche de lieux : service de recherche de geo.admin.ch (swisstopo).',
            de: 'Ortssuche: Suchdienst von geo.admin.ch (swisstopo).',
            en: 'Place search: geo.admin.ch search service (swisstopo).',
          }),
          routingOsm && [tr(lang, {
            fr: 'Distances routières : calculées à partir des données © ',
            de: 'Strassendistanzen: berechnet aus den Daten © ',
            en: 'Road distances: calculated from data © ',
          }), link(LINKS.osmCopyright, 'OpenStreetMap contributors'), ' (ODbL).'],
        ]),
      ]),

      font && section('font', tr(lang, { fr: 'Police de caractères', de: 'Schrift', en: 'Typeface' }), [
        p(`Inter 3.19${lang === 'fr' ? ' : ' : ': '}${font.author}, `, tr(lang, { fr: 'licence ', de: 'Lizenz ', en: 'licence ' }),
          link(`file:${font.license.url}`, font.license.name), `. ${font.changes[lang]}`),
      ]),

      section('software', tr(lang, { fr: 'Logiciels libres', de: 'Freie Software', en: 'Open-source software' }), [
        p(tr(lang, {
          fr: 'Le site utilise notamment React et React Router (licence MIT), Leaflet (licence BSD-2-Clause) et Turf (licence MIT). La liste complète des composants inclus dans le site, avec leurs licences et leurs mentions de copyright, figure dans le fichier ',
          de: 'Die Website verwendet unter anderem React und React Router (Lizenz MIT), Leaflet (Lizenz BSD-2-Clause) und Turf (Lizenz MIT). Die vollständige Liste der enthaltenen Komponenten mit ihren Lizenzen und Copyright-Vermerken steht in der Datei ',
          en: 'The website notably uses React and React Router (MIT licence), Leaflet (BSD-2-Clause licence) and Turf (MIT licence). The full list of components included in the website, with their licences and copyright notices, is in the file ',
        }), link('file:licences-tiers.txt', 'licences-tiers.txt'), '.'),
      ]),

      section('trademarks', tr(lang, { fr: 'Marques', de: 'Marken', en: 'Trademarks' }), [
        p(tr(lang, {
          fr: 'DJI et Agras sont des marques de SZ DJI Technology Co., Ltd. VitiAero n\'est pas lié à DJI. Aucune image ni aucune vidéo de DJI n\'est utilisée sur ce site.',
          de: 'DJI und Agras sind Marken der SZ DJI Technology Co., Ltd. VitiAero steht in keiner Verbindung zu DJI. Auf dieser Website werden keine Bilder oder Videos von DJI verwendet.',
          en: 'DJI and Agras are trademarks of SZ DJI Technology Co., Ltd. VitiAero is not affiliated with DJI. No DJI images or videos are used on this website.',
        })),
      ]),
    ].filter(Boolean),
  };
}
