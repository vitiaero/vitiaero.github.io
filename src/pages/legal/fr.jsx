import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, filled, linkStyle, extLink, LINKS, clearSiteStorage } from './shared.js';

// Pages légales en français. Chaque règle citée a été vérifiée sur le texte
// officiel en septembre 2026 (sources dans docs/CONFORMITE.md). Une relecture
// par un juriste reste recommandée. Les champs entre crochets viennent de
// src/content.js et restent visibles tant qu'ils ne sont pas renseignés.
const UPDATED = '24 septembre 2026';

const ADDRESS_LINE = `${company.address}, ${company.npa} ${company.city}, canton de ${company.canton}, Suisse`;

function Contact() {
  return (
    <>
      {company.name}<br />
      {ADDRESS_LINE}<br />
      E-mail : <a href={`mailto:${company.email}`} style={linkStyle}>{company.email}</a>
      {filled(company.phone) && <><br />Téléphone : {company.phone}</>}
    </>
  );
}

function Confidentialite() {
  return (
    <>
      <h1 className="h1">Politique de confidentialité</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <p>
        Cette politique explique quelles données personnelles sont traitées sur le site
        vitiaero.ch, pourquoi, avec qui elles sont partagées et quels sont vos droits. Elle
        suit la loi fédérale sur la protection des données (nLPD).
      </p>

      <h2 className="h3">1. Responsable du traitement</h2>
      <p><Contact /></p>

      <h2 className="h3">2. La situation aujourd'hui</h2>
      <p>
        VitiAero prépare son lancement. Pour l'instant, les formulaires du site (estimation,
        devis, contact, compte client) n'envoient aucune donnée : le calcul d'estimation se
        fait uniquement dans votre navigateur. Si vous nous écrivez par e-mail, nous recevons
        votre adresse et le contenu de votre message.
      </p>

      <h2 className="h3">3. Lors de votre visite</h2>
      <ul>
        <li>
          <strong>Hébergement.</strong> Le site est hébergé par GitHub Pages ({company.host}).
          GitHub enregistre l'adresse IP de chaque visiteur pour des raisons de sécurité.
        </li>
        <li>
          <strong>Carte de la page d'estimation.</strong> Les fonds « Satellite », « Carte » et
          « Cadastre » et la recherche de commune viennent de swisstopo, l'Office fédéral de
          topographie : il reçoit votre adresse IP et le lieu recherché. Le fond « Plan » vient
          d'OpenStreetMap. Il n'est chargé que si vous le choisissez ; OpenStreetMap reçoit
          alors votre adresse IP.
        </li>
        <li>
          <strong>Stockage local.</strong> Quelques réglages techniques sont gardés dans votre
          navigateur. Le détail figure sur la page{' '}
          <Link to="/cookies" style={linkStyle}>gestion des cookies</Link>.
        </li>
      </ul>
      <p>Le site n'utilise aucun traceur publicitaire ni outil de mesure d'audience.</p>

      <h2 className="h3">4. Quand l'envoi en ligne sera actif</h2>
      <p>Les formulaires transmettront alors les données que vous y saisissez :</p>
      <ul>
        <li>identité : nom et prénom ;</li>
        <li>coordonnées : e-mail, téléphone, commune, adresse ou lieu-dit ;</li>
        <li>parcelles : le tracé et la surface dessinés sur la carte ;</li>
        <li>demande : type de traitement, période, message, pièces jointes, code promo éventuel ;</li>
        <li>compte client : e-mail et mot de passe, gardé uniquement sous une forme illisible (hachée) ;</li>
        <li>suivi : interventions réalisées ou prévues sur vos parcelles ;</li>
        <li>sécurité : adresse IP, gardée quelques minutes pour limiter les tentatives abusives.</li>
      </ul>
      <p>
        Cette politique sera complétée avant l'activation, avec les prestataires retenus
        (hébergement du serveur, calcul des distances).
      </p>

      <h2 className="h3">5. Finalités</h2>
      <p>
        Répondre à vos questions et demandes, établir une estimation ou un devis, gérer votre
        compte et le suivi des interventions, et assurer la sécurité du site. Vos données ne
        sont ni vendues, ni utilisées pour de la publicité ou du profilage.
      </p>

      <h2 className="h3">6. Communication à l'étranger</h2>
      <ul>
        <li>
          <strong>États-Unis</strong> : GitHub, Inc., pour l'hébergement. GitHub est certifié au
          cadre de protection des données Suisse-États-Unis (Swiss-U.S. Data Privacy
          Framework). Pour les entreprises certifiées, le Conseil fédéral reconnaît un niveau de
          protection adéquat (annexe 1 de l'ordonnance sur la protection des données, OPDo).
        </li>
        <li>
          <strong>Royaume-Uni et Pays-Bas</strong> : OpenStreetMap, seulement si vous choisissez
          le fond « Plan ». Ces deux pays figurent dans la liste des pays adéquats (annexe 1
          OPDo). Les tuiles passent aussi par un réseau mondial de serveurs de cache, dont
          OpenStreetMap ne publie pas la liste des pays. Pour éviter tout envoi vers
          OpenStreetMap, utilisez les fonds « Satellite », « Carte » ou « Cadastre ».
        </li>
      </ul>

      <h2 className="h3">7. Durée de conservation</h2>
      <ul>
        <li>Journaux de l'hébergeur : selon la déclaration de confidentialité de GitHub.</li>
        <li>
          E-mails et demandes : le temps de traiter votre demande, puis au plus 24 mois après
          le dernier échange si aucun contrat n'est conclu.
        </li>
        <li>
          Documents comptables, en cas de contrat : 10 ans, comme l'exige le Code des
          obligations (art. 958f CO).
        </li>
        <li>Stockage local : jusqu'à ce que vous l'effaciez.</li>
      </ul>

      <h2 className="h3">8. Sécurité</h2>
      <p>
        Le site est servi en connexion chiffrée (HTTPS) et ne charge aucun script tiers. Une
        politique de sécurité du contenu limite les ressources que le navigateur accepte.
      </p>

      <h2 className="h3">9. Vos droits</h2>
      <p>Selon la nLPD, vous pouvez notamment :</p>
      <ul>
        <li>savoir si des données vous concernant sont traitées et en obtenir une copie (art. 25) ;</li>
        <li>dans certains cas, recevoir les données que vous nous avez fournies dans un format électronique courant (art. 28) ;</li>
        <li>faire corriger des données inexactes (art. 32) ;</li>
        <li>demander l'arrêt d'un traitement, l'interdiction d'une communication à des tiers ou l'effacement de vos données (art. 32).</li>
      </ul>
      <p>
        Écrivez à <a href={`mailto:${company.email}`} style={linkStyle}>{company.email}</a>.
        Vous pouvez aussi vous adresser au Préposé fédéral à la protection des données et à la
        transparence (PFPDT) : <a href={LINKS.pfpdt} {...extLink}>www.edoeb.admin.ch</a>.
      </p>

      <h2 className="h3">10. Modifications</h2>
      <p>Cette politique peut évoluer. La date de mise à jour figure en haut de page.</p>
    </>
  );
}

function Mentions() {
  return (
    <>
      <h1 className="h1">Mentions légales</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>

      <h2 className="h3">Éditeur du site</h2>
      <p>
        <Contact />
        {filled(company.ide) && <><br />Numéro IDE : {company.ide}</>}
        <br />Responsable du contenu : {company.responsable}
      </p>

      <h2 className="h3">Hébergement</h2>
      <p>GitHub Pages : {company.host}.</p>

      <h2 className="h3">Droits d'auteur et crédits</h2>
      <p>
        Les textes et la mise en page du site appartiennent à leur auteur. Les autres contenus
        appartiennent à leurs titulaires :
      </p>
      <ul>
        <li>
          Terrasses du Lavaux : photo de Joachim Kohler (JoachimKohler-HB),{' '}
          <a href={LINKS.lavauxPhoto} {...extLink}>Wikimedia Commons</a>, licence{' '}
          <a href={LINKS.ccBySa} {...extLink}>CC BY-SA 4.0</a>. Image recadrée et redimensionnée.
        </li>
        <li>Vidéo du vignoble d'Epesses : {company.responsable}.</li>
        <li>Illustrations du drone DJI Agras T55 (accueil et page Équipement) : images et vidéos générées par intelligence artificielle avec Higgsfield pour VitiAero, d'après des vues du produit. Ce ne sont pas des photographies.</li>
        <li>
          Fonds de carte : ©swisstopo ; ©{' '}
          <a href={LINKS.osmCopyright} {...extLink}>OpenStreetMap contributors</a> ; © Mensuration
          Officielle Suisse / FL (plan cadastral).
        </li>
      </ul>

      $1
        DJI et AGRAS sont des marques de SZ DJI Technology Co., Ltd. Ce site est indépendant et
        n'est ni édité ni nécessairement approuvé par DJI. Ces noms servent uniquement à
        désigner le drone prévu.
      $2

      <h2 className="h3">Responsabilité</h2>
      <p>
        Les informations du site sont données à titre indicatif. L'estimation en ligne n'est
        pas un devis ferme : le devis détaillé est établi ensuite. Les caractéristiques du
        drone sont celles publiées par DJI ; elles varient selon le terrain et la météo.
      </p>

      <h2 className="h3">Droit applicable</h2>
      <p>Le présent site est soumis au droit suisse.</p>
    </>
  );
}

// Conditions générales de prestation. Elles s'appliqueront aux contrats dès le
// lancement ; les points entre crochets sont des choix du propriétaire.
function Cgv() {
  return (
    <>
      <h1 className="h1">Conditions générales</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <div className="alert alert-info">
        Ces conditions s'appliqueront aux prestations dès le lancement du service. Les points
        entre crochets seront complétés d'ici là.
      </div>

      <h2 className="h3">1. Objet et champ d'application</h2>
      <p>
        Les présentes conditions régissent les prestations d'épandage viticole par drone
        proposées par {company.name}. Elles s'appliquent dès l'acceptation d'un devis.
      </p>

      <h2 className="h3">2. Estimation et devis</h2>
      <p>
        L'estimation obtenue en ligne est gratuite, indicative et sans engagement. Elle ne
        constitue pas un devis ferme. Un devis détaillé est établi ensuite, en fonction des
        parcelles, du traitement et des contraintes du site.
      </p>

      <h2 className="h3">3. Acceptation et prix</h2>
      <p>
        La prestation débute après acceptation écrite du devis. Les prix sont indiqués en
        francs suisses, TVA éventuelle comprise. Si l'entreprise est assujettie à la TVA, le
        sulfatage de la vigne relève du taux réduit, selon l'Administration fédérale des
        contributions. [Modalités de paiement à compléter : acompte, délai, moyens acceptés.]
      </p>

      <h2 className="h3">4. Conditions d'intervention</h2>
      <p>
        Le client garantit un accès sûr aux parcelles et fournit les informations utiles
        (limites, obstacles, voisinage, ruches, zones sensibles). L'intervention dépend des
        conditions météorologiques : en cas de vent, de pluie ou de conditions défavorables à
        la sécurité, la date peut être reportée sans frais.
      </p>

      <h2 className="h3">5. Annulation et report</h2>
      <p>
        [Conditions d'annulation à compléter : délai de préavis, frais éventuels.] Un report
        lié à la météo ou à une impossibilité technique ne donne pas lieu à des frais
        d'annulation.
      </p>

      <h2 className="h3">6. Réglementation et produits</h2>
      <p>
        Chaque intervention suppose notamment une autorisation préalable de l'Office fédéral
        de l'aviation civile (OFAC), un modèle de drone homologué par Agroscope, un
        pulvérisateur contrôlé par un organisme agréé et au moins une personne titulaire du
        permis d'utilisation de produits phytosanitaires. Les produits sont employés selon
        leur autorisation et leurs conditions d'emploi en Suisse.
      </p>

      <h2 className="h3">7. Responsabilité et assurance</h2>
      <p>
        Notre responsabilité est engagée en cas de faute dans les limites permises par le
        droit suisse. Elle est exclue pour les dommages résultant d'informations inexactes du
        client ou d'un accès non sécurisé. [À compléter : couverture d'assurance
        responsabilité civile, plafonds, franchises.]
      </p>

      <h2 className="h3">8. Force majeure</h2>
      <p>
        Aucune des parties n'est responsable d'un manquement dû à un évènement de force
        majeure (intempéries exceptionnelles, restriction officielle, etc.).
      </p>

      <h2 className="h3">9. Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{' '}
        <Link to="/confidentialite" style={linkStyle}>politique de confidentialité</Link>.
      </p>

      <h2 className="h3">10. Droit applicable et for</h2>
      <p>
        Les présentes conditions sont soumises au droit suisse. For : canton de{' '}
        {company.canton}, sous réserve des fors impératifs, notamment ceux des consommateurs
        (art. 32 et 35 du Code de procédure civile).
      </p>
    </>
  );
}

// Page de gestion des cookies / stockage local. Le site n'utilise aucun traceur :
// on liste ce qui est réellement stocké, on indique comment le refuser (art. 45c
// LTC) et on permet de l'effacer.
function Cookies() {
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <h1 className="h1">Gestion des cookies</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <div className="alert alert-info">
        Ce site n'utilise aucun cookie publicitaire ni outil de mesure d'audience (pas de
        Google Analytics, pas de pixel de réseau social). Seul un stockage technique, utile au
        fonctionnement, est gardé dans votre navigateur.
      </div>

      <h2 className="h3">Ce qui est stocké sur votre appareil</h2>
      <div className="table-wrap mt-2">
        <table className="data">
          <thead>
            <tr><th>Nom</th><th>Type</th><th>Finalité</th><th>Durée</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>vitiaero_token</td>
              <td>Stockage local</td>
              <td>Vous garder connecté à votre espace client</td>
              <td>Jusqu'à la déconnexion, 7 jours au maximum</td>
            </tr>
            <tr>
              <td>vitiaero_privacy_ack</td>
              <td>Stockage local</td>
              <td>Mémoriser que vous avez lu le bandeau d'information</td>
              <td>Jusqu'à effacement</td>
            </tr>
            <tr>
              <td>vitiaero_lang</td>
              <td>Stockage local</td>
              <td>Mémoriser la langue choisie pour le site</td>
              <td>Jusqu'à effacement</td>
            </tr>
            <tr>
              <td>vitiaero_map_tip</td>
              <td>Stockage local</td>
              <td>Ne plus afficher l'aide de la carte une fois vue</td>
              <td>Jusqu'à effacement</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="h3 mt-3">Refuser ce stockage</h2>
      <p>
        Vous pouvez le refuser en bloquant les données de ce site dans les réglages de votre
        navigateur (rubrique cookies ou données de sites). Le site reste consultable ;
        seules la connexion à l'espace client et la mémorisation de vos choix ne
        fonctionneront plus.
      </p>

      <h2 className="h3 mt-3">Hébergement et carte</h2>
      <p>
        L'hébergeur GitHub enregistre votre adresse IP à chaque visite, pour des raisons de
        sécurité. Sur la page d'estimation, la carte reçoit ses fonds de swisstopo et, si vous
        choisissez le fond « Plan », d'OpenStreetMap : ces services reçoivent votre adresse
        IP mais ne déposent aucun cookie publicitaire. Voir la{' '}
        <Link to="/confidentialite" style={linkStyle}>politique de confidentialité</Link>.
      </p>

      <h2 className="h3 mt-3">Effacer les données stockées</h2>
      <p>
        Vous pouvez à tout moment effacer le stockage de ce site depuis votre navigateur, ou
        avec le bouton ci-dessous. Vous serez alors déconnecté.
      </p>
      <button className="btn btn-outline btn-sm" onClick={() => { clearSiteStorage(); setCleared(true); }}>
        Effacer les données de ce site
      </button>
      {cleared && <p className="hint mt-2" style={{ color: 'var(--accent-dark)' }}>Données locales effacées.</p>}
    </>
  );
}

function Conditions() {
  return (
    <>
      <h1 className="h1">Conditions d'utilisation</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>

      <h2 className="h3">1. Objet</h2>
      <p>
        Le site permet de calculer une estimation d'épandage viticole par drone, gratuitement
        et sans engagement. L'estimation est indicative ; le devis ferme est transmis
        séparément.
      </p>

      <h2 className="h3">2. Compte</h2>
      <p>
        Vous vous engagez à fournir des informations exactes et à garder vos identifiants
        confidentiels. Vous êtes responsable de l'activité réalisée depuis votre compte.
      </p>

      <h2 className="h3">3. Suivi des interventions</h2>
      <p>
        Votre espace client affiche les interventions enregistrées par VitiAero. Ces
        informations sont fournies à titre de suivi. En cas de différence avec le devis ou la
        facture, ce sont ces documents qui font foi.
      </p>

      <h2 className="h3">4. Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{' '}
        <Link to="/confidentialite" style={linkStyle}>politique de confidentialité</Link>.
      </p>

      <h2 className="h3">5. Responsabilité</h2>
      <p>
        Le service est fourni sans garantie de disponibilité continue. Notre responsabilité
        est limitée dans les cas permis par le droit suisse.
      </p>

      <h2 className="h3">6. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit suisse. For : canton de{' '}
        {company.canton}, sous réserve des fors impératifs, notamment ceux des consommateurs.
      </p>
    </>
  );
}

export default {
  confidentialite: Confidentialite,
  mentions: Mentions,
  cgv: Cgv,
  cookies: Cookies,
  conditions: Conditions,
};
