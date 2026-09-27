// Mentions legales (impressum). Seules les informations reellement fournies
// dans shared/business.js sont affichees ; les manques sont signales sans
// crochets ni valeur d'exemple.
import { tr, p, lines, link, section } from './core.js';
import { identityLines, identityComplete, prelaunchIdentityNotice, providerName, fictionalNotice } from './facts.js';
import { isText, isServiceComplete } from '../launch.js';
import { countryName } from './core.js';

export default function mentions(b, lang) {
  const id = b.identity || {};
  const sv = b.services || {};
  // L'adresse d'un hebergeur etranger contient deja son pays ; sinon on l'ajoute.
  const host = (s) => [s.name, isText(s.address) ? s.address : countryName(s.country, lang)].filter(isText).join(', ');

  return {
    id: 'mentions',
    title: tr(lang, { fr: 'Mentions légales', de: 'Impressum', en: 'Legal notice' }),
    sections: [
      section('fiction', null, [fictionalNotice(b, lang, 'mentions')]),
      section('operator', tr(lang, { fr: 'Exploitant du site', de: 'Betreiber der Website', en: 'Website operator' }), [
        identityLines(b, lang),
        !identityComplete(b) && prelaunchIdentityNotice(lang),
        isText(id.contentResponsible) && p(tr(lang, {
          fr: `Responsable du contenu : ${id.contentResponsible}`,
          de: `Verantwortlich für den Inhalt: ${id.contentResponsible}`,
          en: `Person responsible for the content: ${id.contentResponsible}`,
        })),
      ]),

      section('hosting', tr(lang, { fr: 'Hébergement', de: 'Hosting', en: 'Hosting' }), [
        isServiceComplete(sv.siteHosting) && lines(
          tr(lang, { fr: 'Site : ', de: 'Website: ', en: 'Website: ' }) + host(sv.siteHosting),
          isServiceComplete(sv.apiHosting) && tr(lang, {
            fr: 'Serveur et base de données : ', de: 'Server und Datenbank: ', en: 'Server and database: ',
          }) + host(sv.apiHosting),
        ),
      ]),

      section('ip', tr(lang, { fr: 'Propriété intellectuelle', de: 'Geistiges Eigentum', en: 'Intellectual property' }), [
        p(tr(lang, {
          fr: `Les textes, la mise en page et les illustrations propres à ce site ne peuvent pas être repris à des fins commerciales sans l'accord écrit de ${providerName(b)}. Les contenus de tiers (photos, fonds de carte, police de caractères, logiciels libres) restent la propriété de leurs titulaires et sont utilisés selon leurs licences, détaillées sur la page `,
          de: `Die eigenen Texte, das Layout und die Illustrationen dieser Website dürfen ohne schriftliche Zustimmung von ${providerName(b)} nicht zu kommerziellen Zwecken übernommen werden. Inhalte Dritter (Fotos, Kartenhintergründe, Schrift, freie Software) bleiben Eigentum ihrer Rechteinhaber und werden gemäss ihren Lizenzen verwendet; Einzelheiten auf der Seite `,
          en: `The texts, layout and illustrations specific to this website may not be reused for commercial purposes without the written consent of ${providerName(b)}. Third-party content (photos, base maps, typeface, open-source software) remains the property of its owners and is used under their licences, listed on the `,
        }), link('/credits', tr(lang, { fr: 'Crédits', de: 'Credits', en: 'Credits page' })), '.'),
      ]),

      section('trademarks', tr(lang, { fr: 'Marques', de: 'Marken', en: 'Trademarks' }), [
        p(tr(lang, {
          fr: 'DJI et Agras sont des marques de SZ DJI Technology Co., Ltd. Elles servent uniquement à désigner le modèle de drone prévu. VitiAero n\'est pas lié à DJI et n\'est pas soutenu par DJI.',
          de: 'DJI und Agras sind Marken der SZ DJI Technology Co., Ltd. Sie dienen nur zur Bezeichnung des vorgesehenen Drohnenmodells. VitiAero steht in keiner Verbindung zu DJI und wird von DJI nicht unterstützt.',
          en: 'DJI and Agras are trademarks of SZ DJI Technology Co., Ltd. They are used only to name the planned drone model. VitiAero is not affiliated with or endorsed by DJI.',
        })),
      ]),

      section('liability', tr(lang, { fr: 'Responsabilité', de: 'Haftung', en: 'Liability' }), [
        p(tr(lang, {
          fr: 'Les informations du site sont données à titre indicatif et peuvent changer. L\'estimation calculée en ligne est gratuite et indicative : elle ne constitue ni une offre ferme ni une commande. Seul un devis écrit, accepté par le client, engage les parties. Les caractéristiques du drone sont celles publiées par son fabricant ; elles varient selon le terrain et la météo.',
          de: 'Die Angaben auf der Website dienen der Information und können sich ändern. Die online berechnete Schätzung ist kostenlos und unverbindlich: Sie ist weder ein verbindliches Angebot noch eine Bestellung. Nur eine schriftliche Offerte, die von der Kundschaft angenommen wird, verpflichtet die Parteien. Die Eigenschaften der Drohne sind jene, die ihr Hersteller veröffentlicht; sie hängen von Gelände und Wetter ab.',
          en: 'The information on this website is given for guidance and may change. The estimate calculated online is free and indicative: it is neither a firm offer nor an order. Only a written quote accepted by the customer binds the parties. The drone\'s specifications are those published by its manufacturer; they vary with the terrain and the weather.',
        })),
      ]),

      section('links', tr(lang, { fr: 'Liens externes', de: 'Externe Links', en: 'External links' }), [
        p(tr(lang, {
          fr: 'Les liens vers d\'autres sites sont fournis pour information. Leur contenu relève de la responsabilité de leurs éditeurs.',
          de: 'Links zu anderen Websites dienen der Information. Für deren Inhalt sind ihre Betreiber verantwortlich.',
          en: 'Links to other websites are provided for information. Their content is the responsibility of their publishers.',
        })),
      ]),

      section('privacy', tr(lang, { fr: 'Protection des données', de: 'Datenschutz', en: 'Data protection' }), [
        p(tr(lang, {
          fr: 'Le traitement des données personnelles est décrit dans la ',
          de: 'Die Bearbeitung von Personendaten ist in der ',
          en: 'The processing of personal data is described in the ',
        }), link('/confidentialite', tr(lang, { fr: 'politique de confidentialité', de: 'Datenschutzerklärung', en: 'privacy policy' })),
        tr(lang, { fr: '.', de: ' beschrieben.', en: '.' })),
      ]),

      section('law', tr(lang, { fr: 'Droit applicable', de: 'Anwendbares Recht', en: 'Applicable law' }), [
        p(tr(lang, { fr: 'Le présent site est soumis au droit suisse.', de: 'Diese Website untersteht dem Schweizer Recht.', en: 'This website is governed by Swiss law.' })),
      ]),
    ],
  };
}
