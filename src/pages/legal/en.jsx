import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, linkStyle, clearSiteStorage } from './shared.js';

// Pages légales en anglais. Traduction des modèles français : la version
// française fait foi, mention à faire valider.
const UPDATED = 'September 2026';
const ADDRESS_LINE = `${company.address}, ${company.npa} ${company.city}, canton of ${company.canton}, Switzerland`;

function Disclaimer() {
  return (
    <div className="alert alert-info">
      Template document created as part of a student project (CPNV, PAE). The details in
      square brackets must be completed, and the text must be checked by a qualified person
      before any real use.
      <br />
      This translation is provided for information. In case of doubt, the French version
      applies. [TO BE CONFIRMED BY A QUALIFIED PERSON]
    </div>
  );
}

function Confidentialite() {
  return (
    <>
      <h1 className="h1">Privacy policy</h1>
      <p className="muted">Last updated: {UPDATED}</p>
      <Disclaimer />
      <p>
        {company.name} cares about protecting your data. This policy explains which data we
        process, why, and what your rights are, in line with the Swiss Federal Act on Data
        Protection (FADP).
      </p>

      <h2 className="h3">1. Controller</h2>
      <p>
        {company.name}, {ADDRESS_LINE}.<br />
        Person in charge: {company.responsable}. Contact: {company.email}
        {company.phone ? `, ${company.phone}` : ''}.
      </p>

      <h2 className="h3">2. Data we process</h2>
      <ul>
        <li>Identity: first and last name.</li>
        <li>Contact details: email address, phone, municipality, address or place name.</li>
        <li>Plots: the outline and area you draw on the map.</li>
        <li>Your request: type of treatment, period, message, any promo code.</li>
        <li>Account: email address and password (stored only in hashed form).</li>
        <li>Record: treatments carried out or planned on your plots (date, area, treatment, notes).</li>
        <li>
          Technical data: during your visit, your IP address and technical information
          (type of browser) are processed temporarily to keep the service secure (for
          example, to limit login attempts).
        </li>
      </ul>

      <h2 className="h3">3. Purposes</h2>
      <p>
        Handling your estimate request and preparing a quote, managing your account and the
        record of the treatments on your plots, contacting you about them, keeping the service secure and meeting
        our legal obligations. Your data is not used for advertising and is not used for any
        profiling.
      </p>

      <h2 className="h3">4. Legal basis</h2>
      <p>
        Processing is based on your consent and on pre-contractual steps taken at your
        request, as well as on our legitimate interest in keeping the service secure.
      </p>

      <h2 className="h3">5. Cookies and local storage</h2>
      <p>
        The website uses no advertising cookies and no analytics trackers. It only keeps, in
        your browser, technical storage needed for your login and for display (for example,
        the language you chose). Details are on our{' '}
        <Link to="/cookies" style={linkStyle}>cookie settings</Link> page.
      </p>

      <h2 className="h3">6. External services</h2>
      <p>
        To show the map and search for a municipality, the website loads base maps and a
        search service provided by swisstopo (Swiss Confederation) and by OpenStreetMap. When
        the map is shown, your IP address is sent to these providers, which may use it for
        technical and security purposes under their own rules. These services are only used
        for the map on the estimate page.
      </p>
      <p>
        To calculate travel costs, our server asks the public routing service OSRM
        (router.project-osrm.org) for the road distance between our starting point and your
        plots. Only the position of the centre of your plots is sent: not your name, not your
        contact details and not your IP address. [TO BE CHECKED: operator and hosting country
        of this service.]
      </p>

      <h2 className="h3">7. Retention period</h2>
      <p>
        Requests with no follow-up are kept for [24 months]. Account data is kept while the
        account is active, then deleted or anonymised. Documents related to any invoicing are
        kept for the legal periods ([10 years]). Technical security counters (limits per IP
        address) are deleted after a few minutes.
      </p>

      <h2 className="h3">8. Disclosure to third parties and transfers abroad</h2>
      <p>
        We do not sell your data. It may be entrusted to technical service providers (for
        example, hosting: {company.host}), who are bound by confidentiality. OpenStreetMap
        base maps may involve access from the European Union. No data is transferred to a
        country without an adequate level of protection unless appropriate safeguards are in
        place. [TO BE COMPLETED: list of providers and countries.]
      </p>

      <h2 className="h3">9. Security</h2>
      <p>
        We take technical and organisational measures: encrypted connection (HTTPS), hashed
        passwords, restricted access to the administration area, limits on login attempts
        and security headers.
      </p>

      <h2 className="h3">10. Your rights</h2>
      <p>
        You can ask to access, correct or delete your data, object to processing, ask for it
        to be restricted or handed over to you, and withdraw your consent at any time. Write
        to {company.email}. You can also contact the Federal Data Protection and Information
        Commissioner (FDPIC).
      </p>

      <h2 className="h3">11. Changes</h2>
      <p>This policy may change. The date of the last update is shown at the top of the page.</p>
    </>
  );
}

function Mentions() {
  return (
    <>
      <h1 className="h1">Legal notice</h1>
      <p className="muted">Last updated: {UPDATED}</p>
      <Disclaimer />

      <h2 className="h3">Website publisher</h2>
      <p>
        {company.name}<br />
        {ADDRESS_LINE}<br />
        Email: {company.email}<br />
        Phone: {company.phone}<br />
        Business identification number (UID): {company.ide}<br />
        Responsible for content: {company.responsable}
      </p>

      <h2 className="h3">Hosting</h2>
      <p>The website is hosted by {company.host}.</p>

      <h2 className="h3">Intellectual property</h2>
      <p>
        The VitiAero brand, the texts and the layout are protected. Some images come from
        Wikimedia Commons under a Creative Commons licence and are credited below. Their
        reuse remains subject to the terms of each licence.
      </p>
      <ul>
        <li>Lavaux terraces: JoachimKohler-HB, Wikimedia Commons, licence CC BY-SA 4.0.</li>
        <li>Terraced vineyards: P. Vensaus, Wikimedia Commons, licence CC BY-SA 4.0.</li>
        <li>Spraying drone in flight: Blervis, Wikimedia Commons, licence CC0.</li>
        <li>DJI Agras drone: ZLEA, Wikimedia Commons, licence CC BY-SA 4.0.</li>
        <li>
          Drone photos and videos on the Equipment page, and the home page video: DJI
          (ag.dji.com). [USAGE RIGHTS TO BE CHECKED before publication].
        </li>
        <li>
          Other visuals (cut-out drone, cover image): [USAGE RIGHTS TO BE CHECKED before
          publication].
        </li>
      </ul>

      <h2 className="h3">Liability</h2>
      <p>
        The information is provided for guidance only. The online estimate is not a firm
        quote: our team then prepares a detailed quote. We do our best to keep the
        information accurate but cannot guarantee it.
      </p>

      <h2 className="h3">Applicable law</h2>
      <p>This website is governed by Swiss law. Place of jurisdiction: canton of {company.canton}.</p>
    </>
  );
}

function Cgv() {
  return (
    <>
      <h1 className="h1">General terms and conditions</h1>
      <p className="muted">Last updated: {UPDATED}</p>
      <div className="alert alert-info">
        Template structure not checked by a lawyer. Prices, deadlines, warranties and
        liability clauses must be completed and reviewed by a qualified person before any
        real use.
        <br />
        This translation is provided for information. In case of doubt, the French version
        applies. [TO BE CONFIRMED BY A QUALIFIED PERSON]
      </div>

      <h2 className="h3">1. Purpose and scope</h2>
      <p>
        These terms govern the vineyard spraying services by drone offered by {company.name}.
        They apply once a quote has been accepted.
      </p>

      <h2 className="h3">2. Estimate and quote</h2>
      <p>
        The online estimate is free, for guidance only and with no obligation. It is not a
        firm quote. Our team then prepares a detailed quote, based on the plots, the
        treatment and the conditions on site.
      </p>

      <h2 className="h3">3. Acceptance and prices</h2>
      <p>
        The service starts once the quote has been accepted in writing. Prices are in Swiss
        francs, excluding VAT. Swiss VAT, at the standard rate of 8.1%, is added if the
        company is liable for it. [Payment terms to be completed: deposit, deadline,
        accepted payment methods.]
      </p>

      <h2 className="h3">4. Conditions for the work</h2>
      <p>
        The customer guarantees safe access to the plots and provides the useful information
        (boundaries, obstacles, neighbours, beehives, sensitive areas). The work depends on
        the weather: in case of wind, rain or conditions that put safety at risk, the date may
        be moved at no cost.
      </p>

      <h2 className="h3">5. Cancellation and postponement</h2>
      <p>
        [Cancellation terms to be completed: notice period, any fees.] A postponement due to
        the weather or to a technical impossibility does not lead to cancellation fees.
      </p>

      <h2 className="h3">6. Regulations and products</h2>
      <p>
        The work is carried out in line with the applicable Swiss regulations (aviation,
        products used, federal and cantonal requirements). The choice and use of products
        follow their approval and their conditions of use. [TO BE CHECKED BEFORE PUBLICATION:
        permits required for drone application and for the products concerned.]
      </p>

      <h2 className="h3">7. Liability and insurance</h2>
      <p>
        We are liable in case of fault within the limits allowed by Swiss law. Liability is
        excluded for damage caused by inaccurate information from the customer or by unsafe
        access. [TO BE COMPLETED: third-party liability insurance cover, limits, excess.]
      </p>

      <h2 className="h3">8. Force majeure</h2>
      <p>
        Neither party is liable for a failure caused by force majeure (exceptional weather,
        official restrictions, etc.).
      </p>

      <h2 className="h3">9. Personal data</h2>
      <p>
        How we process your data is described in our{' '}
        <Link to="/confidentialite" style={linkStyle}>privacy policy</Link>.
      </p>

      <h2 className="h3">10. Applicable law and jurisdiction</h2>
      <p>These terms are governed by Swiss law. Place of jurisdiction: canton of {company.canton}.</p>
    </>
  );
}

function Cookies() {
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <h1 className="h1">Cookie settings</h1>
      <p className="muted">Last updated: {UPDATED}</p>
      <div className="alert alert-info">
        This website uses no advertising cookies and no analytics trackers (no Google
        Analytics, no social network pixel). No consent is therefore needed for advertising.
        Only technical storage, needed for the website to work, is used.
      </div>

      <h2 className="h3">What is stored on your device</h2>
      <div className="table-wrap mt-2">
        <table className="data">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th><th>Consent</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>vitiaero_token</td>
              <td>Local storage</td>
              <td>Keep you logged in to your customer area</td>
              <td>Until you log out, 7 days at most</td>
              <td>Not required (technical)</td>
            </tr>
            <tr>
              <td>vitiaero_privacy_ack</td>
              <td>Local storage</td>
              <td>Remember that you have read the information banner</td>
              <td>Persistent</td>
              <td>Not required (technical)</td>
            </tr>
            <tr>
              <td>vitiaero_lang</td>
              <td>Local storage</td>
              <td>Remember the language you chose for the website</td>
              <td>Persistent</td>
              <td>Not required (technical)</td>
            </tr>
            <tr>
              <td>vitiaero_map_tip</td>
              <td>Local storage</td>
              <td>Stop showing the map help once you have seen it</td>
              <td>Persistent</td>
              <td>Not required (technical)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="h3 mt-3">External map services</h2>
      <p>
        On the estimate page, the map uses base maps from swisstopo and OpenStreetMap and a
        municipality search service from swisstopo. These services set no advertising
        cookies but receive your IP address when they are shown. See the{' '}
        <Link to="/confidentialite" style={linkStyle}>privacy policy</Link>.
      </p>

      <h2 className="h3 mt-3">Delete stored data</h2>
      <p>
        You can delete this website's technical storage at any time from your browser, or
        with the button below. You will then be logged out.
      </p>
      <button className="btn btn-outline btn-sm" onClick={() => { clearSiteStorage(); setCleared(true); }}>
        Delete this website's data
      </button>
      {cleared && <p className="hint mt-2" style={{ color: 'var(--accent-dark)' }}>Local data deleted.</p>}
    </>
  );
}

function Conditions() {
  return (
    <>
      <h1 className="h1">Terms of use</h1>
      <p className="muted">Last updated: {UPDATED}</p>
      <Disclaimer />

      <h2 className="h3">1. Purpose</h2>
      <p>
        The website lets you request an estimate for vineyard spraying by drone, free of
        charge and with no obligation. The estimate is for guidance only. Our team sends the
        firm quote separately.
      </p>

      <h2 className="h3">2. Account</h2>
      <p>
        You agree to provide accurate information and to keep your login details
        confidential. You are responsible for the activity carried out from your account.
      </p>

      <h2 className="h3">3. Treatment record</h2>
      <p>
        Your customer area shows the treatments recorded by our team. This information is
        provided as a record. If it differs from the quote or the invoice, those documents
        prevail.
      </p>

      <h2 className="h3">4. Personal data</h2>
      <p>
        How we process your data is described in our{' '}
        <Link to="/confidentialite" style={linkStyle}>privacy policy</Link>.
      </p>

      <h2 className="h3">5. Liability</h2>
      <p>
        The service is provided with no guarantee of continuous availability. Our liability
        is limited to the extent allowed by Swiss law.
      </p>

      <h2 className="h3">6. Applicable law</h2>
      <p>These terms are governed by Swiss law. Place of jurisdiction: canton of {company.canton}.</p>
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
