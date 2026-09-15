import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, linkStyle, clearSiteStorage } from './shared.js';

// Pages légales en français. Textes MODÈLES adaptés au droit suisse (nLPD, en
// vigueur depuis le 1er septembre 2023), pour un projet d'étude. Les champs
// entre crochets [ ] sont à compléter et l'ensemble est à faire relire par une
// personne compétente avant une mise en ligne réelle.
const UPDATED = 'septembre 2026';

// On n'invente rien : les crochets restent visibles tant que la valeur n'est pas
// renseignée dans content.js.
const ADDRESS_LINE = `${company.address}, ${company.npa} ${company.city}, canton de ${company.canton}, Suisse`;

function Disclaimer() {
  return (
    <div className="alert alert-info">
      Document modèle réalisé dans le cadre d'un projet d'étude (CPNV, PAE). Les
      mentions entre crochets sont à compléter et le texte doit être validé par une
      personne compétente avant toute utilisation réelle.
    </div>
  );
}

function Confidentialite() {
  return (
    <>
      <h1 className="h1">Politique de confidentialité</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <Disclaimer />
      <p>
        {company.name} attache de l'importance à la protection de vos données. La présente
        politique explique quelles données nous traitons, pourquoi et quels sont vos
        droits, conformément à la loi fédérale suisse sur la protection des données (nLPD).
      </p>

      <h2 className="h3">1. Responsable du traitement</h2>
      <p>
        {company.name}, {ADDRESS_LINE}.<br />
        Responsable : {company.responsable}. Contact : {company.email}
        {company.phone ? `, ${company.phone}` : ''}.
      </p>

      <h2 className="h3">2. Données que nous traitons</h2>
      <ul>
        <li>Identité : nom et prénom.</li>
        <li>Coordonnées : adresse e-mail, téléphone, commune, adresse ou lieu-dit.</li>
        <li>Parcelles : le tracé et la surface que vous dessinez sur la carte.</li>
        <li>Votre demande : type de traitement, période, message, code promo éventuel.</li>
        <li>Compte : adresse e-mail et mot de passe (conservé uniquement sous forme hachée).</li>
        <li>Fidélité : nombre de points et historique de vos demandes.</li>
        <li>
          Données techniques : lors de votre visite, votre adresse IP et des informations
          techniques (type de navigateur) sont traitées de façon temporaire pour assurer
          la sécurité du service (par exemple la limitation des tentatives de connexion).
        </li>
      </ul>

      <h2 className="h3">3. Finalités</h2>
      <p>
        Traiter votre demande d'estimation et établir un devis, gérer votre compte et le
        programme de fidélité, communiquer avec vous à ce sujet, assurer la sécurité du
        service et respecter nos obligations légales. Vos données ne servent pas à de la
        publicité et ne font l'objet d'aucun profilage.
      </p>

      <h2 className="h3">4. Base légale</h2>
      <p>
        Le traitement repose sur votre consentement et sur l'exécution de mesures
        précontractuelles prises à votre demande, ainsi que sur notre intérêt légitime à
        assurer la sécurité du service.
      </p>

      <h2 className="h3">5. Cookies et stockage local</h2>
      <p>
        Le site n'utilise aucun cookie publicitaire ni traceur d'analyse. Il conserve
        uniquement, dans votre navigateur, un stockage technique nécessaire à votre
        connexion et à l'affichage (par exemple la langue choisie). Le détail figure sur
        notre page{' '}
        <Link to="/cookies" style={linkStyle}>gestion des cookies</Link>.
      </p>

      <h2 className="h3">6. Services externes</h2>
      <p>
        Pour afficher la carte et rechercher une commune, le site charge des fonds de carte
        et un service de recherche fournis par swisstopo (Confédération suisse) et par
        OpenStreetMap. Lorsque la carte s'affiche, votre adresse IP est transmise à ces
        prestataires, qui peuvent l'utiliser à des fins techniques et de sécurité selon
        leurs propres règles. Ces services sont utilisés uniquement pour la fonction de
        carte de la page d'estimation.
      </p>
      <p>
        Pour calculer les frais de déplacement, notre serveur demande la distance par la
        route entre notre point de départ et vos parcelles au service d'itinéraire public
        OSRM (router.project-osrm.org). Seule la position du centre de vos parcelles lui est
        transmise : ni votre nom, ni vos coordonnées, ni votre adresse IP. [À VÉRIFIER :
        exploitant et pays d'hébergement de ce service.]
      </p>

      <h2 className="h3">7. Durée de conservation</h2>
      <p>
        Les demandes sans suite sont conservées [24 mois]. Les données de compte sont
        conservées tant que le compte est actif, puis supprimées ou anonymisées. Les
        documents liés à une facturation éventuelle sont conservés selon les délais légaux
        ([10 ans]). Les compteurs techniques de sécurité (limitation par IP) sont effacés
        après quelques minutes.
      </p>

      <h2 className="h3">8. Communication à des tiers et transferts à l'étranger</h2>
      <p>
        Nous ne vendons pas vos données. Elles peuvent être confiées à des prestataires
        techniques (par exemple l'hébergement : {company.host}), tenus à la confidentialité.
        Les fonds de carte OpenStreetMap peuvent impliquer un accès depuis l'Union
        européenne. Aucun transfert n'est effectué vers un pays sans niveau de protection
        adéquat sans garanties appropriées. [À COMPLÉTER : liste des prestataires et pays.]
      </p>

      <h2 className="h3">9. Sécurité</h2>
      <p>
        Nous prenons des mesures techniques et organisationnelles : connexion chiffrée (HTTPS),
        mots de passe hachés, accès restreint à l'espace d'administration, limitation des
        tentatives de connexion et en-têtes de sécurité.
      </p>

      <h2 className="h3">10. Vos droits</h2>
      <p>
        Vous pouvez demander l'accès, la rectification ou l'effacement de vos données, vous
        opposer à un traitement, en demander la limitation ou la remise, et retirer votre
        consentement à tout moment. Écrivez à {company.email}. Vous pouvez aussi vous
        adresser au Préposé fédéral à la protection des données et à la transparence (PFPDT).
      </p>

      <h2 className="h3">11. Modifications</h2>
      <p>Cette politique peut évoluer. La date de mise à jour figure en haut de page.</p>
    </>
  );
}

function Mentions() {
  return (
    <>
      <h1 className="h1">Mentions légales</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <Disclaimer />

      <h2 className="h3">Éditeur du site</h2>
      <p>
        {company.name}<br />
        {ADDRESS_LINE}<br />
        E-mail : {company.email}<br />
        Téléphone : {company.phone}<br />
        Numéro d'identification des entreprises (IDE/UID) : {company.ide}<br />
        Responsable du contenu : {company.responsable}
      </p>

      <h2 className="h3">Hébergement</h2>
      <p>Le site est hébergé par {company.host}.</p>

      <h2 className="h3">Propriété intellectuelle</h2>
      <p>
        La marque VitiAero, les textes et la mise en page sont protégés. Certaines images
        proviennent de Wikimedia Commons sous licence Creative Commons et sont créditées
        ci-dessous ; leur réutilisation reste soumise aux conditions de chaque licence.
      </p>
      <ul>
        <li>Terrasses du Lavaux : JoachimKohler-HB, Wikimedia Commons, licence CC BY-SA 4.0.</li>
        <li>Vignes en terrasses : P. Vensaus, Wikimedia Commons, licence CC BY-SA 4.0.</li>
        <li>Drone d'épandage en vol : Blervis, Wikimedia Commons, licence CC0.</li>
        <li>Drone DJI Agras : ZLEA, Wikimedia Commons, licence CC BY-SA 4.0.</li>
        <li>
          Photos et vidéos du drone sur la page Équipement, et vidéo d'accueil : DJI
          (ag.dji.com). [DROITS D'UTILISATION À VÉRIFIER avant publication].
        </li>
        <li>
          Autres visuels (drone détouré, affiche) : [DROITS D'UTILISATION À VÉRIFIER
          avant publication].
        </li>
      </ul>

      <h2 className="h3">Responsabilité</h2>
      <p>
        Les informations sont fournies à titre indicatif. L'estimation obtenue en ligne n'est
        pas un devis ferme : un devis détaillé est établi ensuite par notre équipe. Nous nous
        efforçons d'assurer l'exactitude des informations sans pouvoir la garantir.
      </p>

      <h2 className="h3">Droit applicable</h2>
      <p>Le présent site est soumis au droit suisse. For : canton de {company.canton}.</p>
    </>
  );
}

// Conditions générales de prestation (CGV). Structure modèle pour un service
// d'épandage viticole par drone. À faire valider juridiquement : les points
// sensibles (responsabilité, réglementation, assurance) sont signalés.
function Cgv() {
  return (
    <>
      <h1 className="h1">Conditions générales</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <div className="alert alert-info">
        Structure modèle non validée par un juriste. Les prix, délais, garanties et clauses
        de responsabilité doivent être complétés et relus par une personne compétente avant
        toute utilisation réelle.
      </div>

      <h2 className="h3">1. Objet et champ d'application</h2>
      <p>
        Les présentes conditions régissent les prestations d'épandage viticole par drone
        proposées par {company.name}. Elles s'appliquent dès l'acceptation d'un devis.
      </p>

      <h2 className="h3">2. Estimation et devis</h2>
      <p>
        L'estimation obtenue en ligne est gratuite, indicative et sans engagement. Elle ne
        constitue pas un devis ferme. Un devis détaillé est établi ensuite par notre équipe,
        en fonction des parcelles, du traitement et des contraintes du site.
      </p>

      <h2 className="h3">3. Acceptation et prix</h2>
      <p>
        La prestation débute après acceptation écrite du devis. Les prix sont indiqués en
        francs suisses, hors TVA. La TVA suisse, au taux normal de 8,1 %, s'ajoute si
        l'entreprise y est assujettie. [Modalités de paiement à compléter : acompte, délai,
        moyens acceptés.]
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
        Les interventions sont réalisées dans le respect de la réglementation suisse
        applicable (aviation, produits utilisés, exigences fédérales et cantonales). Le choix
        et l'emploi des produits respectent leur homologation et leurs conditions d'usage.
        [À VÉRIFIER AVANT PUBLICATION : autorisations requises pour l'application par drone et
        pour les produits concernés.]
      </p>

      <h2 className="h3">7. Responsabilité et assurance</h2>
      <p>
        Notre responsabilité est engagée en cas de faute dans les limites permises par le
        droit suisse. Elle est exclue pour les dommages résultant d'informations inexactes du
        client ou d'un accès non sécurisé. [À COMPLÉTER : couverture d'assurance responsabilité
        civile, plafonds, franchises.]
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
      <p>Les présentes conditions sont soumises au droit suisse. For : canton de {company.canton}.</p>
    </>
  );
}

// Page de gestion des cookies / stockage local. Le site n'utilise aucun traceur
// nécessitant un consentement : on liste ce qui est réellement stocké et on offre
// la possibilité d'effacer ces données (droit de gestion, nLPD).
function Cookies() {
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <h1 className="h1">Gestion des cookies</h1>
      <p className="muted">Dernière mise à jour : {UPDATED}</p>
      <div className="alert alert-info">
        Ce site n'utilise aucun cookie publicitaire, ni traceur d'analyse (pas de Google
        Analytics, pas de pixel de réseau social). Aucun consentement n'est donc requis pour
        de la publicité. Seul un stockage technique, nécessaire au fonctionnement, est utilisé.
      </div>

      <h2 className="h3">Ce qui est stocké sur votre appareil</h2>
      <div className="table-wrap mt-2">
        <table className="data">
          <thead>
            <tr><th>Nom</th><th>Type</th><th>Finalité</th><th>Durée</th><th>Consentement</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>vitiaero_token</td>
              <td>Stockage local</td>
              <td>Vous garder connecté à votre espace client</td>
              <td>Jusqu'à la déconnexion, 7 jours au maximum</td>
              <td>Non requis (technique)</td>
            </tr>
            <tr>
              <td>vitiaero_privacy_ack</td>
              <td>Stockage local</td>
              <td>Mémoriser que vous avez lu le bandeau d'information</td>
              <td>Persistant</td>
              <td>Non requis (technique)</td>
            </tr>
            <tr>
              <td>vitiaero_lang</td>
              <td>Stockage local</td>
              <td>Mémoriser la langue que vous avez choisie pour le site</td>
              <td>Persistant</td>
              <td>Non requis (technique)</td>
            </tr>
            <tr>
              <td>vitiaero_map_tip</td>
              <td>Stockage local</td>
              <td>Ne plus afficher l'aide de la carte une fois vue</td>
              <td>Persistant</td>
              <td>Non requis (technique)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="h3 mt-3">Services externes de carte</h2>
      <p>
        Sur la page d'estimation, la carte utilise des fonds fournis par swisstopo et
        OpenStreetMap et un service de recherche de commune de swisstopo. Ces services ne
        déposent pas de cookie publicitaire mais reçoivent votre adresse IP lorsqu'ils
        s'affichent. Voir la{' '}
        <Link to="/confidentialite" style={linkStyle}>politique de confidentialité</Link>.
      </p>

      <h2 className="h3 mt-3">Effacer les données stockées</h2>
      <p>
        Vous pouvez à tout moment effacer le stockage technique de ce site depuis votre
        navigateur, ou avec le bouton ci-dessous. Vous serez alors déconnecté.
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
      <Disclaimer />

      <h2 className="h3">1. Objet</h2>
      <p>
        Le site permet de demander une estimation d'épandage viticole par drone, gratuitement
        et sans engagement. L'estimation est indicative ; le devis ferme est transmis
        séparément par notre équipe.
      </p>

      <h2 className="h3">2. Compte</h2>
      <p>
        Vous vous engagez à fournir des informations exactes et à garder vos identifiants
        confidentiels. Vous êtes responsable de l'activité réalisée depuis votre compte.
      </p>

      <h2 className="h3">3. Programme de fidélité</h2>
      <p>
        Les points de fidélité sont attribués à titre indicatif, n'ont pas de valeur monétaire
        et ne peuvent être échangés contre de l'argent.
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
      <p>Les présentes conditions sont soumises au droit suisse. For : canton de {company.canton}.</p>
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
