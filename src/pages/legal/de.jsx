import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, linkStyle, clearSiteStorage } from './shared.js';

// Pages légales en allemand (orthographe suisse). Traduction des modèles
// français : la version française fait foi, mention à faire valider.
const UPDATED = 'September 2026';
const CANTON = company.canton === 'Vaud' ? 'Waadt' : company.canton;
const ADDRESS_LINE = `${company.address}, ${company.npa} ${company.city}, Kanton ${CANTON}, Schweiz`;

function Disclaimer() {
  return (
    <div className="alert alert-info">
      Mustervorlage, erstellt im Rahmen eines Studienprojekts (CPNV, PAE). Die Angaben in
      eckigen Klammern sind zu ergänzen, und der Text muss vor jeder echten Verwendung von
      einer Fachperson geprüft werden.
      <br />
      Diese Übersetzung dient der Information. Im Zweifel gilt die französische Fassung.
      [VON EINER FACHPERSON ZU BESTÄTIGEN]
    </div>
  );
}

function Confidentialite() {
  return (
    <>
      <h1 className="h1">Datenschutzerklärung</h1>
      <p className="muted">Letzte Aktualisierung: {UPDATED}</p>
      <Disclaimer />
      <p>
        {company.name} legt Wert auf den Schutz Ihrer Daten. Diese Erklärung zeigt, welche
        Daten wir bearbeiten, warum wir das tun und welche Rechte Sie haben, gemäss dem
        Schweizer Bundesgesetz über den Datenschutz (DSG).
      </p>

      <h2 className="h3">1. Verantwortliche Stelle</h2>
      <p>
        {company.name}, {ADDRESS_LINE}.<br />
        Verantwortlich: {company.responsable}. Kontakt: {company.email}
        {company.phone ? `, ${company.phone}` : ''}.
      </p>

      <h2 className="h3">2. Welche Daten wir bearbeiten</h2>
      <ul>
        <li>Identität: Vor- und Nachname.</li>
        <li>Kontaktdaten: E-Mail-Adresse, Telefon, Gemeinde, Adresse oder Flurname.</li>
        <li>Parzellen: der Umriss und die Fläche, die Sie auf der Karte einzeichnen.</li>
        <li>Ihre Anfrage: Art der Behandlung, Zeitraum, Nachricht, allfälliger Aktionscode.</li>
        <li>Konto: E-Mail-Adresse und Passwort (nur in gehashter Form gespeichert).</li>
        <li>Treueprogramm: Anzahl Punkte und Verlauf Ihrer Anfragen.</li>
        <li>
          Technische Daten: Bei Ihrem Besuch werden Ihre IP-Adresse und technische Angaben
          (Art des Browsers) vorübergehend bearbeitet, um die Sicherheit des Dienstes zu
          gewährleisten (zum Beispiel die Begrenzung von Anmeldeversuchen).
        </li>
      </ul>

      <h2 className="h3">3. Zwecke</h2>
      <p>
        Ihre Anfrage für eine Schätzung bearbeiten und eine Offerte erstellen, Ihr Konto und
        das Treueprogramm verwalten, mit Ihnen darüber kommunizieren, die Sicherheit des
        Dienstes gewährleisten und unsere gesetzlichen Pflichten erfüllen. Ihre Daten werden
        nicht für Werbung verwendet und es findet kein Profiling statt.
      </p>

      <h2 className="h3">4. Rechtsgrundlage</h2>
      <p>
        Die Bearbeitung beruht auf Ihrer Einwilligung und auf vorvertraglichen Massnahmen,
        die auf Ihre Anfrage hin erfolgen, sowie auf unserem berechtigten Interesse, die
        Sicherheit des Dienstes zu gewährleisten.
      </p>

      <h2 className="h3">5. Cookies und lokale Speicherung</h2>
      <p>
        Die Website verwendet keine Werbe-Cookies und keine Analyse-Tracker. Sie speichert
        in Ihrem Browser nur technische Daten, die für Ihre Anmeldung und die Anzeige nötig
        sind (zum Beispiel die gewählte Sprache). Die Einzelheiten finden Sie auf unserer
        Seite{' '}
        <Link to="/cookies" style={linkStyle}>Cookie-Verwaltung</Link>.
      </p>

      <h2 className="h3">6. Externe Dienste</h2>
      <p>
        Um die Karte anzuzeigen und eine Gemeinde zu suchen, lädt die Website Kartenhintergründe
        und einen Suchdienst von swisstopo (Schweizerische Eidgenossenschaft) und von
        OpenStreetMap. Wenn die Karte angezeigt wird, wird Ihre IP-Adresse an diese Anbieter
        übermittelt. Sie können sie nach ihren eigenen Regeln für technische Zwecke und zur
        Sicherheit verwenden. Diese Dienste werden nur für die Karte auf der Seite der
        Schätzung genutzt.
      </p>
      <p>
        Um die Anfahrtskosten zu berechnen, fragt unser Server den öffentlichen Routendienst
        OSRM (router.project-osrm.org) nach der Strassendistanz zwischen unserem Ausgangspunkt
        und Ihren Parzellen. Übermittelt wird nur die Position der Mitte Ihrer Parzellen:
        weder Ihr Name noch Ihre Kontaktdaten noch Ihre IP-Adresse. [ZU PRÜFEN: Betreiber und
        Hosting-Land dieses Dienstes.]
      </p>

      <h2 className="h3">7. Aufbewahrungsdauer</h2>
      <p>
        Anfragen ohne Folge werden [24 Monate] aufbewahrt. Kontodaten werden aufbewahrt,
        solange das Konto aktiv ist, und danach gelöscht oder anonymisiert. Unterlagen zu
        einer allfälligen Rechnungsstellung werden gemäss den gesetzlichen Fristen aufbewahrt
        ([10 Jahre]). Die technischen Sicherheitszähler (Begrenzung pro IP-Adresse) werden
        nach wenigen Minuten gelöscht.
      </p>

      <h2 className="h3">8. Weitergabe an Dritte und Übermittlung ins Ausland</h2>
      <p>
        Wir verkaufen Ihre Daten nicht. Sie können technischen Dienstleistern anvertraut
        werden (zum Beispiel für das Hosting: {company.host}), die zur Vertraulichkeit
        verpflichtet sind. Die Kartenhintergründe von OpenStreetMap können einen Zugriff aus
        der Europäischen Union mit sich bringen. Ohne geeignete Garantien findet keine
        Übermittlung in ein Land ohne angemessenes Schutzniveau statt. [ZU ERGÄNZEN: Liste
        der Dienstleister und Länder.]
      </p>

      <h2 className="h3">9. Sicherheit</h2>
      <p>
        Wir treffen technische und organisatorische Massnahmen: verschlüsselte Verbindung
        (HTTPS), gehashte Passwörter, eingeschränkter Zugang zum Verwaltungsbereich,
        Begrenzung der Anmeldeversuche und Sicherheits-Header.
      </p>

      <h2 className="h3">10. Ihre Rechte</h2>
      <p>
        Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen, einer
        Bearbeitung widersprechen, deren Einschränkung oder Herausgabe verlangen und Ihre
        Einwilligung jederzeit widerrufen. Schreiben Sie an {company.email}. Sie können sich
        auch an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) wenden.
      </p>

      <h2 className="h3">11. Änderungen</h2>
      <p>Diese Erklärung kann sich ändern. Das Datum der letzten Aktualisierung steht oben auf der Seite.</p>
    </>
  );
}

function Mentions() {
  return (
    <>
      <h1 className="h1">Impressum</h1>
      <p className="muted">Letzte Aktualisierung: {UPDATED}</p>
      <Disclaimer />

      <h2 className="h3">Herausgeber der Website</h2>
      <p>
        {company.name}<br />
        {ADDRESS_LINE}<br />
        E-Mail: {company.email}<br />
        Telefon: {company.phone}<br />
        Unternehmens-Identifikationsnummer (UID): {company.ide}<br />
        Verantwortlich für den Inhalt: {company.responsable}
      </p>

      <h2 className="h3">Hosting</h2>
      <p>Die Website wird gehostet von {company.host}.</p>

      <h2 className="h3">Geistiges Eigentum</h2>
      <p>
        Die Marke VitiAero, die Texte und das Layout sind geschützt. Einige Bilder stammen
        von Wikimedia Commons unter einer Creative-Commons-Lizenz und sind unten aufgeführt.
        Ihre Weiterverwendung unterliegt den Bedingungen der jeweiligen Lizenz.
      </p>
      <ul>
        <li>Terrassen des Lavaux: JoachimKohler-HB, Wikimedia Commons, Lizenz CC BY-SA 4.0.</li>
        <li>Reben auf Terrassen: P. Vensaus, Wikimedia Commons, Lizenz CC BY-SA 4.0.</li>
        <li>Sprühdrohne im Flug: Blervis, Wikimedia Commons, Lizenz CC0.</li>
        <li>Drohne DJI Agras: ZLEA, Wikimedia Commons, Lizenz CC BY-SA 4.0.</li>
        <li>
          Bilder und Videos der Drohne auf der Seite Ausrüstung sowie Video der Startseite:
          DJI (ag.dji.com). [NUTZUNGSRECHTE VOR DER VERÖFFENTLICHUNG ZU PRÜFEN].
        </li>
        <li>
          Weitere Bilder (freigestellte Drohne, Titelbild): [NUTZUNGSRECHTE VOR DER
          VERÖFFENTLICHUNG ZU PRÜFEN].
        </li>
      </ul>

      <h2 className="h3">Haftung</h2>
      <p>
        Die Angaben dienen der Information. Die online erhaltene Schätzung ist keine
        verbindliche Offerte: Eine detaillierte Offerte erstellt danach unser Team. Wir
        bemühen uns um korrekte Angaben, können diese aber nicht garantieren.
      </p>

      <h2 className="h3">Anwendbares Recht</h2>
      <p>Diese Website untersteht dem Schweizer Recht. Gerichtsstand: Kanton {CANTON}.</p>
    </>
  );
}

function Cgv() {
  return (
    <>
      <h1 className="h1">Allgemeine Geschäftsbedingungen</h1>
      <p className="muted">Letzte Aktualisierung: {UPDATED}</p>
      <div className="alert alert-info">
        Mustervorlage, nicht von einer juristischen Fachperson geprüft. Preise, Fristen,
        Garantien und Haftungsklauseln sind vor jeder echten Verwendung zu ergänzen und von
        einer Fachperson zu prüfen.
        <br />
        Diese Übersetzung dient der Information. Im Zweifel gilt die französische Fassung.
        [VON EINER FACHPERSON ZU BESTÄTIGEN]
      </div>

      <h2 className="h3">1. Gegenstand und Geltungsbereich</h2>
      <p>
        Diese Bedingungen regeln die Leistungen im Pflanzenschutz im Rebbau per Drohne, die
        {' '}{company.name} anbietet. Sie gelten ab der Annahme einer Offerte.
      </p>

      <h2 className="h3">2. Schätzung und Offerte</h2>
      <p>
        Die online erhaltene Schätzung ist kostenlos, dient der Orientierung und ist
        unverbindlich. Sie ist keine verbindliche Offerte. Eine detaillierte Offerte erstellt
        danach unser Team, je nach Parzellen, Behandlung und den Gegebenheiten vor Ort.
      </p>

      <h2 className="h3">3. Annahme und Preise</h2>
      <p>
        Die Leistung beginnt nach der schriftlichen Annahme der Offerte. Die Preise verstehen
        sich in Schweizer Franken, ohne MWST. Die Schweizer MWST zum Normalsatz von 8,1 %
        kommt dazu, sofern das Unternehmen steuerpflichtig ist.
        [Zahlungsbedingungen zu ergänzen: Anzahlung, Frist, akzeptierte Zahlungsmittel.]
      </p>

      <h2 className="h3">4. Bedingungen für den Einsatz</h2>
      <p>
        Die Kundin oder der Kunde gewährleistet einen sicheren Zugang zu den Parzellen und
        liefert die nötigen Angaben (Grenzen, Hindernisse, Nachbarschaft, Bienenstöcke,
        empfindliche Zonen). Der Einsatz hängt vom Wetter ab: Bei Wind, Regen oder
        Bedingungen, die die Sicherheit gefährden, kann der Termin kostenlos verschoben werden.
      </p>

      <h2 className="h3">5. Annullierung und Verschiebung</h2>
      <p>
        [Annullierungsbedingungen zu ergänzen: Frist, allfällige Kosten.] Eine Verschiebung
        wegen des Wetters oder aus technischen Gründen führt nicht zu Annullierungskosten.
      </p>

      <h2 className="h3">6. Vorschriften und Mittel</h2>
      <p>
        Die Einsätze erfolgen unter Einhaltung der geltenden Schweizer Vorschriften
        (Luftfahrt, eingesetzte Mittel, Anforderungen von Bund und Kantonen). Wahl und
        Einsatz der Mittel entsprechen ihrer Zulassung und ihren Anwendungsbedingungen.
        [VOR DER VERÖFFENTLICHUNG ZU PRÜFEN: nötige Bewilligungen für die Ausbringung per
        Drohne und für die betroffenen Mittel.]
      </p>

      <h2 className="h3">7. Haftung und Versicherung</h2>
      <p>
        Wir haften bei Verschulden im Rahmen des Schweizer Rechts. Die Haftung ist
        ausgeschlossen für Schäden, die aus falschen Angaben der Kundschaft oder aus einem
        unsicheren Zugang entstehen. [ZU ERGÄNZEN: Deckung der Haftpflichtversicherung,
        Höchstbeträge, Selbstbehalte.]
      </p>

      <h2 className="h3">8. Höhere Gewalt</h2>
      <p>
        Keine Partei haftet für eine Nichterfüllung infolge höherer Gewalt (aussergewöhnliche
        Unwetter, behördliche Einschränkung usw.).
      </p>

      <h2 className="h3">9. Personendaten</h2>
      <p>
        Die Bearbeitung Ihrer Daten ist in unserer{' '}
        <Link to="/confidentialite" style={linkStyle}>Datenschutzerklärung</Link> beschrieben.
      </p>

      <h2 className="h3">10. Anwendbares Recht und Gerichtsstand</h2>
      <p>Diese Bedingungen unterstehen dem Schweizer Recht. Gerichtsstand: Kanton {CANTON}.</p>
    </>
  );
}

function Cookies() {
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <h1 className="h1">Cookie-Verwaltung</h1>
      <p className="muted">Letzte Aktualisierung: {UPDATED}</p>
      <div className="alert alert-info">
        Diese Website verwendet keine Werbe-Cookies und keine Analyse-Tracker (kein Google
        Analytics, kein Pixel sozialer Netzwerke). Für Werbung ist daher keine Einwilligung
        nötig. Es wird nur eine technische Speicherung verwendet, die für den Betrieb nötig ist.
      </div>

      <h2 className="h3">Was auf Ihrem Gerät gespeichert wird</h2>
      <div className="table-wrap mt-2">
        <table className="data">
          <thead>
            <tr><th>Name</th><th>Art</th><th>Zweck</th><th>Dauer</th><th>Einwilligung</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>vitiaero_token</td>
              <td>Lokale Speicherung</td>
              <td>Sie in Ihrem Kundenbereich angemeldet halten</td>
              <td>Bis zur Abmeldung, höchstens 7 Tage</td>
              <td>Nicht nötig (technisch)</td>
            </tr>
            <tr>
              <td>vitiaero_privacy_ack</td>
              <td>Lokale Speicherung</td>
              <td>Speichern, dass Sie den Hinweis gelesen haben</td>
              <td>Dauerhaft</td>
              <td>Nicht nötig (technisch)</td>
            </tr>
            <tr>
              <td>vitiaero_lang</td>
              <td>Lokale Speicherung</td>
              <td>Die gewählte Sprache der Website speichern</td>
              <td>Dauerhaft</td>
              <td>Nicht nötig (technisch)</td>
            </tr>
            <tr>
              <td>vitiaero_map_tip</td>
              <td>Lokale Speicherung</td>
              <td>Die Hilfe zur Karte nach dem ersten Anzeigen nicht mehr zeigen</td>
              <td>Dauerhaft</td>
              <td>Nicht nötig (technisch)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="h3 mt-3">Externe Kartendienste</h2>
      <p>
        Auf der Seite der Schätzung verwendet die Karte Hintergründe von swisstopo und
        OpenStreetMap sowie einen Suchdienst für Gemeinden von swisstopo. Diese Dienste
        setzen keine Werbe-Cookies, erhalten aber Ihre IP-Adresse, wenn sie angezeigt werden.
        Siehe die{' '}
        <Link to="/confidentialite" style={linkStyle}>Datenschutzerklärung</Link>.
      </p>

      <h2 className="h3 mt-3">Gespeicherte Daten löschen</h2>
      <p>
        Sie können die technische Speicherung dieser Website jederzeit in Ihrem Browser oder
        mit der Schaltfläche unten löschen. Sie werden dann abgemeldet.
      </p>
      <button className="btn btn-outline btn-sm" onClick={() => { clearSiteStorage(); setCleared(true); }}>
        Daten dieser Website löschen
      </button>
      {cleared && <p className="hint mt-2" style={{ color: 'var(--accent-dark)' }}>Lokale Daten gelöscht.</p>}
    </>
  );
}

function Conditions() {
  return (
    <>
      <h1 className="h1">Nutzungsbedingungen</h1>
      <p className="muted">Letzte Aktualisierung: {UPDATED}</p>
      <Disclaimer />

      <h2 className="h3">1. Gegenstand</h2>
      <p>
        Über die Website können Sie kostenlos und unverbindlich eine Schätzung für den
        Pflanzenschutz im Rebbau per Drohne anfragen. Die Schätzung dient der Orientierung.
        Die verbindliche Offerte schickt Ihnen unser Team separat.
      </p>

      <h2 className="h3">2. Konto</h2>
      <p>
        Sie verpflichten sich, korrekte Angaben zu machen und Ihre Zugangsdaten vertraulich
        zu behandeln. Sie sind für die Aktivitäten in Ihrem Konto verantwortlich.
      </p>

      <h2 className="h3">3. Treueprogramm</h2>
      <p>
        Die Treuepunkte werden zur Orientierung vergeben. Sie haben keinen Geldwert und
        können nicht gegen Geld eingetauscht werden.
      </p>

      <h2 className="h3">4. Personendaten</h2>
      <p>
        Die Bearbeitung Ihrer Daten ist in unserer{' '}
        <Link to="/confidentialite" style={linkStyle}>Datenschutzerklärung</Link> beschrieben.
      </p>

      <h2 className="h3">5. Haftung</h2>
      <p>
        Der Dienst wird ohne Garantie einer ständigen Verfügbarkeit angeboten. Unsere Haftung
        ist beschränkt, soweit das Schweizer Recht dies erlaubt.
      </p>

      <h2 className="h3">6. Anwendbares Recht</h2>
      <p>Diese Bedingungen unterstehen dem Schweizer Recht. Gerichtsstand: Kanton {CANTON}.</p>
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
