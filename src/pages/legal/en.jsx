import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, filled, linkStyle, extLink, LINKS, clearSiteStorage } from './shared.js';

// Pages légales en anglais, traduites de la version française, qui fait foi.
// Sources vérifiées : docs/CONFORMITE.md.
const UPDATED = '24 September 2026';
const ADDRESS_LINE = `${company.address}, ${company.npa} ${company.city}, canton of ${company.canton}, Switzerland`;

function Dated() {
  return (
    <p className="muted">
      Last updated: {UPDATED}. This translation is provided for information. In case of
      doubt, the French version applies.
    </p>
  );
}

function Contact() {
  return (
    <>
      {company.name}<br />
      {ADDRESS_LINE}<br />
      Email: <a href={`mailto:${company.email}`} style={linkStyle}>{company.email}</a>
      {filled(company.phone) && <><br />Phone: {company.phone}</>}
    </>
  );
}

function Confidentialite() {
  return (
    <>
      <h1 className="h1">Privacy policy</h1>
      <Dated />
      <p>
        This policy explains which personal data is processed on the vitiaero.ch website,
        why, who it is shared with and what your rights are. It follows the Swiss Federal Act
        on Data Protection (FADP).
      </p>

      <h2 className="h3">1. Controller</h2>
      <p><Contact /></p>

      <h2 className="h3">2. The situation today</h2>
      <p>
        VitiAero is preparing to launch. For now, the website forms (estimate, quote,
        contact, customer account) send no data: the estimate is calculated only in your
        browser. If you email us, we receive your address and the content of your message.
      </p>

      <h2 className="h3">3. During your visit</h2>
      <ul>
        <li>
          <strong>Hosting.</strong> The website is hosted by GitHub Pages ({company.host}).
          GitHub logs the IP address of every visitor for security purposes.
        </li>
        <li>
          <strong>Map on the estimate page.</strong> The "Satellite", "Map" and "Land register"
          backgrounds and the municipality search come from swisstopo, the Federal Office of
          Topography: it receives your IP address and the place you search for. The "Street"
          background comes from OpenStreetMap. It only loads if you choose it; OpenStreetMap
          then receives your IP address.
        </li>
        <li>
          <strong>Local storage.</strong> A few technical settings are kept in your browser.
          Details are on the{' '}
          <Link to="/cookies" style={linkStyle}>cookie settings</Link> page.
        </li>
      </ul>
      <p>The website uses no advertising trackers and no audience measurement.</p>

      <h2 className="h3">4. Once online sending is active</h2>
      <p>The forms will then send the data you enter:</p>
      <ul>
        <li>identity: first name and surname;</li>
        <li>contact details: email, phone, municipality, address or place name;</li>
        <li>plots: the outline and area drawn on the map;</li>
        <li>request: type of treatment, period, message, attachments, any promo code;</li>
        <li>customer account: email and password, kept only in an unreadable form (hashed);</li>
        <li>history: treatments carried out or planned on your plots;</li>
        <li>security: IP address, kept for a few minutes to limit abusive attempts.</li>
      </ul>
      <p>
        This policy will be completed before activation, with the providers chosen (server
        hosting, distance calculation).
      </p>

      <h2 className="h3">5. Purposes</h2>
      <p>
        Answering your questions and requests, preparing an estimate or a quote, managing
        your account and the history of treatments, and keeping the website secure. Your data
        is never sold, nor used for advertising or profiling.
      </p>

      <h2 className="h3">6. Disclosure abroad</h2>
      <ul>
        <li>
          <strong>United States</strong>: GitHub, Inc., for hosting. GitHub is certified under
          the Swiss-U.S. Data Privacy Framework. For certified companies, the Federal Council
          recognises an adequate level of protection (annex 1 of the Data Protection
          Ordinance, DPO).
        </li>
        <li>
          <strong>United Kingdom and the Netherlands</strong>: OpenStreetMap, only if you choose
          the "Street" background. Both countries are on the list of adequate countries (annex
          1 DPO). The tiles also pass through a worldwide network of cache servers whose
          countries OpenStreetMap does not publish. To avoid any transfer to OpenStreetMap, use
          the "Satellite", "Map" or "Land register" backgrounds.
        </li>
      </ul>

      <h2 className="h3">7. Retention</h2>
      <ul>
        <li>Host logs: according to GitHub's privacy statement.</li>
        <li>
          Emails and requests: while your request is handled, then at most 24 months after the
          last exchange if no contract is concluded.
        </li>
        <li>
          Accounting records, if there is a contract: 10 years, as required by the Code of
          Obligations (art. 958f CO).
        </li>
        <li>Local storage: until you delete it.</li>
      </ul>

      <h2 className="h3">8. Security</h2>
      <p>
        The website is served over an encrypted connection (HTTPS) and loads no third-party
        scripts. A content security policy limits the resources the browser accepts.
      </p>

      <h2 className="h3">9. Your rights</h2>
      <p>Under the FADP, you can in particular:</p>
      <ul>
        <li>find out whether data about you is processed and receive a copy (art. 25);</li>
        <li>in some cases, receive the data you provided to us in a common electronic format (art. 28);</li>
        <li>have inaccurate data corrected (art. 32);</li>
        <li>ask for a processing to stop, for a disclosure to third parties to be prohibited, or for your data to be deleted (art. 32).</li>
      </ul>
      <p>
        Write to <a href={`mailto:${company.email}`} style={linkStyle}>{company.email}</a>. You
        can also contact the Federal Data Protection and Information Commissioner (FDPIC):{' '}
        <a href={LINKS.pfpdt} {...extLink}>www.edoeb.admin.ch</a>.
      </p>

      <h2 className="h3">10. Changes</h2>
      <p>This policy may change. The date of the last update is shown at the top of the page.</p>
    </>
  );
}

function Mentions() {
  return (
    <>
      <h1 className="h1">Legal notice</h1>
      <Dated />

      <h2 className="h3">Website publisher</h2>
      <p>
        <Contact />
        {filled(company.ide) && <><br />Business identification number (UID): {company.ide}</>}
        <br />Responsible for the content: {company.responsable}
      </p>

      <h2 className="h3">Hosting</h2>
      <p>GitHub Pages: {company.host}.</p>

      <h2 className="h3">Copyright and credits</h2>
      <p>
        The texts and layout of the website belong to their author. Other content belongs to
        its right holders:
      </p>
      <ul>
        <li>
          Lavaux terraces: photo by Joachim Kohler (JoachimKohler-HB),{' '}
          <a href={LINKS.lavauxPhoto} {...extLink}>Wikimedia Commons</a>, licence{' '}
          <a href={LINKS.ccBySa} {...extLink}>CC BY-SA 4.0</a>. Image cropped and resized.
        </li>
        <li>Video of the Epesses vineyard: {company.responsable}.</li>
        <li>Photos and videos of the DJI Agras T55 drone (home page and Equipment page): © DJI, <a href="https://ag.dji.com/t55" {...extLink}>ag.dji.com/t55</a>. Images resized and converted, videos shortened or looped, without sound.</li>
        <li>
          Map backgrounds: ©swisstopo; ©{' '}
          <a href={LINKS.osmCopyright} {...extLink}>OpenStreetMap contributors</a>; © Cadastral
          Surveying Switzerland / FL (land register map).
        </li>
      </ul>

      $1
        DJI and AGRAS are trademarks of SZ DJI Technology Co., Ltd. This website is independent
        and is neither published nor necessarily endorsed by DJI. The names are used only to
        identify the planned drone.
      $2

      <h2 className="h3">Liability</h2>
      <p>
        The information on the website is given for guidance. The online estimate is not a
        firm quote: the detailed quote is prepared afterwards. The drone specifications are
        those published by DJI; they vary with the terrain and the weather.
      </p>

      <h2 className="h3">Applicable law</h2>
      <p>This website is governed by Swiss law.</p>
    </>
  );
}

function Cgv() {
  return (
    <>
      <h1 className="h1">General terms and conditions</h1>
      <Dated />
      <div className="alert alert-info">
        These terms will apply to the services from the launch of the service. The points in
        square brackets will be completed by then.
      </div>

      <h2 className="h3">1. Purpose and scope</h2>
      <p>
        These terms govern the vineyard spraying services by drone offered by{' '}
        {company.name}. They apply once a quote is accepted.
      </p>

      <h2 className="h3">2. Estimate and quote</h2>
      <p>
        The online estimate is free, indicative and without obligation. It is not a firm
        quote. A detailed quote is prepared afterwards, based on the plots, the treatment and
        the constraints of the site.
      </p>

      <h2 className="h3">3. Acceptance and prices</h2>
      <p>
        The service starts after written acceptance of the quote. Prices are given in Swiss
        francs, including any VAT. If the company is liable for VAT, spraying vines falls
        under the reduced rate, according to the Swiss Federal Tax Administration. [Payment
        terms to be completed: deposit, deadline, accepted means of payment.]
      </p>

      <h2 className="h3">4. Working conditions</h2>
      <p>
        The customer guarantees safe access to the plots and provides the useful information
        (boundaries, obstacles, neighbours, beehives, sensitive areas). The job depends on the
        weather: in case of wind, rain or conditions unfavourable to safety, the date can be
        postponed free of charge.
      </p>

      <h2 className="h3">5. Cancellation and postponement</h2>
      <p>
        [Cancellation terms to be completed: notice period, possible fees.] A postponement due
        to the weather or a technical impossibility does not lead to cancellation fees.
      </p>

      <h2 className="h3">6. Regulations and products</h2>
      <p>
        Each job requires in particular a prior authorisation from the Federal Office of Civil
        Aviation (FOCA), a drone model approved by Agroscope, a sprayer inspected by an
        approved body and at least one person holding a permit to use plant protection
        products. Products are used according to their authorisation and their conditions of
        use in Switzerland.
      </p>

      <h2 className="h3">7. Liability and insurance</h2>
      <p>
        We are liable in case of fault within the limits allowed by Swiss law. Liability is
        excluded for damage resulting from inaccurate information from the customer or from
        unsafe access. [To be completed: third-party liability insurance cover, limits,
        excesses.]
      </p>

      <h2 className="h3">8. Force majeure</h2>
      <p>
        Neither party is liable for a failure caused by force majeure (exceptional weather,
        official restriction, etc.).
      </p>

      <h2 className="h3">9. Personal data</h2>
      <p>
        The processing of your data is described in our{' '}
        <Link to="/confidentialite" style={linkStyle}>privacy policy</Link>.
      </p>

      <h2 className="h3">10. Applicable law and place of jurisdiction</h2>
      <p>
        These terms are governed by Swiss law. Place of jurisdiction: canton of{' '}
        {company.canton}, subject to mandatory places of jurisdiction, in particular those of
        consumers (art. 32 and 35 of the Civil Procedure Code).
      </p>
    </>
  );
}

function Cookies() {
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <h1 className="h1">Cookie settings</h1>
      <Dated />
      <div className="alert alert-info">
        This website uses no advertising cookies and no audience measurement (no Google
        Analytics, no social network pixel). Only technical storage, useful for the website
        to work, is kept in your browser.
      </div>

      <h2 className="h3">What is stored on your device</h2>
      <div className="table-wrap mt-2">
        <table className="data">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>vitiaero_token</td>
              <td>Local storage</td>
              <td>Keep you logged in to your customer area</td>
              <td>Until you log out, 7 days at most</td>
            </tr>
            <tr>
              <td>vitiaero_privacy_ack</td>
              <td>Local storage</td>
              <td>Remember that you have read the information banner</td>
              <td>Until deleted</td>
            </tr>
            <tr>
              <td>vitiaero_lang</td>
              <td>Local storage</td>
              <td>Remember the language you chose for the website</td>
              <td>Until deleted</td>
            </tr>
            <tr>
              <td>vitiaero_map_tip</td>
              <td>Local storage</td>
              <td>Stop showing the map help once seen</td>
              <td>Until deleted</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="h3 mt-3">Refusing this storage</h2>
      <p>
        You can refuse it by blocking this website's data in your browser settings (cookies
        or site data section). The website remains usable; only logging in to the customer
        area and remembering your choices will stop working.
      </p>

      <h2 className="h3 mt-3">Hosting and map</h2>
      <p>
        The host GitHub logs your IP address on every visit, for security purposes. On the
        estimate page, the map gets its backgrounds from swisstopo and, if you choose the
        "Street" background, from OpenStreetMap: these services receive your IP address but set
        no advertising cookies. See the{' '}
        <Link to="/confidentialite" style={linkStyle}>privacy policy</Link>.
      </p>

      <h2 className="h3 mt-3">Deleting stored data</h2>
      <p>
        You can delete this website's storage at any time from your browser, or with the
        button below. You will then be logged out.
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
      <Dated />

      <h2 className="h3">1. Purpose</h2>
      <p>
        The website lets you calculate an estimate for vineyard spraying by drone, free of
        charge and without obligation. The estimate is indicative; the firm quote is sent
        separately.
      </p>

      <h2 className="h3">2. Account</h2>
      <p>
        You agree to provide accurate information and to keep your login details
        confidential. You are responsible for the activity carried out from your account.
      </p>

      <h2 className="h3">3. Treatment history</h2>
      <p>
        Your customer area shows the treatments recorded by VitiAero. This information is
        provided for follow-up. If it differs from the quote or the invoice, those documents
        prevail.
      </p>

      <h2 className="h3">4. Personal data</h2>
      <p>
        The processing of your data is described in our{' '}
        <Link to="/confidentialite" style={linkStyle}>privacy policy</Link>.
      </p>

      <h2 className="h3">5. Liability</h2>
      <p>
        The service is provided without any guarantee of continuous availability. Our
        liability is limited to the extent allowed by Swiss law.
      </p>

      <h2 className="h3">6. Applicable law</h2>
      <p>
        These terms are governed by Swiss law. Place of jurisdiction: canton of{' '}
        {company.canton}, subject to mandatory places of jurisdiction, in particular those of
        consumers.
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
