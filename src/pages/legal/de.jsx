import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, filled, linkStyle, extLink, LINKS, clearSiteStorage } from './shared.js';

// Pages légales en allemand (orthographe suisse), traduites de la version
// française, qui fait foi. Sources vérifiées : docs/CONFORMITE.md.
const UPDATED = '24. September 2026';
const CANTON = company.canton === 'Vaud' ? 'Waadt' : company.canton;
const ADDRESS_LINE = `${company.address}, ${company.npa} ${company.city}, Kanton ${CANTON}, Schweiz`;

function Dated() {
  return (
    <p className="muted">
      Letzte Aktualisierung: {UPDATED}. Diese Übersetzung dient der Information. Im Zweifel
      gilt die französische Fassung.
    </p>
  );
}

function Contact() {
  return (
    <>
      {company.name}<br />
      {ADDRESS_LINE}<br />
      E-Mail: <a href={`mailto:${company.email}`} style={linkStyle}>{company.email}</a>
      {filled(company.phone) && <><br />Telefon: {company.phone}</>}
    </>
  );
}

function Confidentialite() {
  return (
    <>
      <h1 className="h1">Datenschutzerklärung</h1>
      <Dated />
      <p>
        Diese Erklärung zeigt, welche Personendaten auf der Website vitiaero.ch bearbeitet
        werden, wozu, mit wem sie geteilt werden und welche Rechte Sie haben. Sie folgt dem
        Bundesgesetz über den Datenschutz (DSG).
      </p>

      <h2 className="h3">1. Verantwortlich</h2>
      <p><Contact /></p>

      <h2 className="h3">2. Der heutige Stand</h2>
      <p>
        VitiAero bereitet den Start vor. Vorläufig senden die Formulare der Website
        (Schätzung, Offerte, Kontakt, Kundenkonto) keine Daten: Die Schätzung wird nur in
        Ihrem Browser berechnet. Wenn Sie uns eine E-Mail schreiben, erhalten wir Ihre
        Adresse und den Inhalt Ihrer Nachricht.
      </p>

      <h2 className="h3">3. Bei Ihrem Besuch</h2>
      <ul>
        <li>
          <strong>Hosting.</strong> Die Website wird von GitHub Pages gehostet ({company.host}).
          GitHub speichert aus Sicherheitsgründen die IP-Adresse jeder Besucherin und jedes
          Besuchers.
        </li>
        <li>
          <strong>Karte der Schätzungsseite.</strong> Die Hintergründe «Satellit», «Karte» und
          «Kataster» sowie die Gemeindesuche stammen von swisstopo, dem Bundesamt für
          Landestopografie: Es erhält Ihre IP-Adresse und den gesuchten Ort. Der Hintergrund
          «Plan» stammt von OpenStreetMap. Er wird nur geladen, wenn Sie ihn wählen;
          OpenStreetMap erhält dann Ihre IP-Adresse.
        </li>
        <li>
          <strong>Lokale Speicherung.</strong> Einige technische Einstellungen bleiben in Ihrem
          Browser gespeichert. Details auf der Seite{' '}
          <Link to="/cookies" style={linkStyle}>Cookie-Verwaltung</Link>.
        </li>
      </ul>
      <p>Die Website verwendet keine Werbe-Tracker und keine Reichweitenmessung.</p>

      <h2 className="h3">4. Sobald der Online-Versand aktiv ist</h2>
      <p>Die Formulare übermitteln dann die Daten, die Sie eingeben:</p>
      <ul>
        <li>Identität: Name und Vorname;</li>
        <li>Kontaktangaben: E-Mail, Telefon, Gemeinde, Adresse oder Flurname;</li>
        <li>Parzellen: der auf der Karte gezeichnete Umriss und die Fläche;</li>
        <li>Anfrage: Art der Behandlung, Zeitraum, Nachricht, Anhänge, allfälliger Promo-Code;</li>
        <li>Kundenkonto: E-Mail und Passwort, nur in unlesbarer Form (Hash) gespeichert;</li>
        <li>Verlauf: durchgeführte oder geplante Einsätze auf Ihren Parzellen;</li>
        <li>Sicherheit: IP-Adresse, einige Minuten lang gespeichert, um Missbrauchsversuche zu begrenzen.</li>
      </ul>
      <p>
        Diese Erklärung wird vor der Aktivierung ergänzt, mit den gewählten Dienstleistern
        (Hosting des Servers, Berechnung der Distanzen).
      </p>

      <h2 className="h3">5. Zwecke</h2>
      <p>
        Ihre Fragen und Anfragen beantworten, eine Schätzung oder Offerte erstellen, Ihr
        Konto und den Verlauf der Einsätze führen sowie die Sicherheit der Website
        gewährleisten. Ihre Daten werden weder verkauft noch für Werbung oder Profiling
        verwendet.
      </p>

      <h2 className="h3">6. Bekanntgabe ins Ausland</h2>
      <ul>
        <li>
          <strong>USA</strong>: GitHub, Inc., für das Hosting. GitHub ist nach dem Swiss-U.S.
          Data Privacy Framework zertifiziert. Für zertifizierte Unternehmen anerkennt der
          Bundesrat einen angemessenen Schutz (Anhang 1 der Datenschutzverordnung, DSV).
        </li>
        <li>
          <strong>Vereinigtes Königreich und Niederlande</strong>: OpenStreetMap, nur wenn Sie
          den Hintergrund «Plan» wählen. Beide Staaten stehen auf der Liste mit angemessenem
          Schutz (Anhang 1 DSV). Die Kacheln laufen zudem über ein weltweites Netz von
          Cache-Servern, dessen Länder OpenStreetMap nicht veröffentlicht. Um jede Übermittlung
          an OpenStreetMap zu vermeiden, nutzen Sie die Hintergründe «Satellit», «Karte» oder
          «Kataster».
        </li>
      </ul>

      <h2 className="h3">7. Aufbewahrungsdauer</h2>
      <ul>
        <li>Protokolle des Hosters: gemäss der Datenschutzerklärung von GitHub.</li>
        <li>
          E-Mails und Anfragen: solange die Bearbeitung Ihrer Anfrage dauert, danach höchstens
          24 Monate nach dem letzten Austausch, wenn kein Vertrag zustande kommt.
        </li>
        <li>
          Buchhaltungsunterlagen, bei einem Vertrag: 10 Jahre, wie es das Obligationenrecht
          verlangt (Art. 958f OR).
        </li>
        <li>Lokale Speicherung: bis Sie sie löschen.</li>
      </ul>

      <h2 className="h3">8. Sicherheit</h2>
      <p>
        Die Website wird verschlüsselt (HTTPS) übertragen und lädt keine Skripte von
        Dritten. Eine Inhaltssicherheitsrichtlinie begrenzt die Ressourcen, die der Browser
        annimmt.
      </p>

      <h2 className="h3">9. Ihre Rechte</h2>
      <p>Nach dem DSG können Sie insbesondere:</p>
      <ul>
        <li>erfahren, ob Daten über Sie bearbeitet werden, und eine Kopie erhalten (Art. 25);</li>
        <li>in bestimmten Fällen die von Ihnen gelieferten Daten in einem gängigen elektronischen Format erhalten (Art. 28);</li>
        <li>unrichtige Daten berichtigen lassen (Art. 32);</li>
        <li>verlangen, dass eine Bearbeitung eingestellt, eine Bekanntgabe an Dritte verboten oder Ihre Daten gelöscht werden (Art. 32).</li>
      </ul>
      <p>
        Schreiben Sie an <a href={`mailto:${company.email}`} style={linkStyle}>{company.email}</a>.
        Sie können sich auch an den Eidgenössischen Datenschutz- und
        Öffentlichkeitsbeauftragten (EDÖB) wenden:{' '}
        <a href={LINKS.pfpdt} {...extLink}>www.edoeb.admin.ch</a>.
      </p>

      <h2 className="h3">10. Änderungen</h2>
      <p>Diese Erklärung kann sich ändern. Das Datum der Aktualisierung steht oben auf der Seite.</p>
    </>
  );
}

function Mentions() {
  return (
    <>
      <h1 className="h1">Impressum</h1>
      <Dated />

      <h2 className="h3">Herausgeber der Website</h2>
      <p>
        <Contact />
        {filled(company.ide) && <><br />UID-Nummer: {company.ide}</>}
        <br />Verantwortlich für den Inhalt: {company.responsable}
      </p>

      <h2 className="h3">Hosting</h2>
      <p>GitHub Pages: {company.host}.</p>

      <h2 className="h3">Urheberrecht und Nachweise</h2>
      <p>
        Texte und Gestaltung der Website gehören ihrem Urheber. Die übrigen Inhalte gehören
        ihren Rechteinhabern:
      </p>
      <ul>
        <li>
          Terrassen des Lavaux: Foto von Joachim Kohler (JoachimKohler-HB),{' '}
          <a href={LINKS.lavauxPhoto} {...extLink}>Wikimedia Commons</a>, Lizenz{' '}
          <a href={LINKS.ccBySa} {...extLink}>CC BY-SA 4.0</a>. Bild zugeschnitten und verkleinert.
        </li>
        <li>Video des Weinbergs von Epesses: {company.responsable}.</li>
        <li>Fotos und Videos der Drohne DJI Agras T55 (Startseite und Seite Ausrüstung): © DJI, <a href="https://ag.dji.com/t55" {...extLink}>ag.dji.com/t55</a>. Bilder verkleinert und umgewandelt, Videos gekürzt oder als Schleife, ohne Ton.</li>
        <li>
          Kartenhintergründe: ©swisstopo; ©{' '}
          <a href={LINKS.osmCopyright} {...extLink}>OpenStreetMap contributors</a>; © Amtliche
          Vermessung Schweiz / FL (Katasterplan).
        </li>
      </ul>

      $1
        DJI und AGRAS sind Marken der SZ DJI Technology Co., Ltd. Diese Website ist unabhängig
        und wird von DJI weder herausgegeben noch zwingend gutgeheissen. Die Namen dienen nur
        dazu, die vorgesehene Drohne zu bezeichnen.
      $2

      <h2 className="h3">Haftung</h2>
      <p>
        Die Angaben auf der Website dienen der Information. Die Online-Schätzung ist keine
        verbindliche Offerte: Die detaillierte Offerte wird danach erstellt. Die Angaben zur
        Drohne sind jene von DJI; sie hängen vom Gelände und vom Wetter ab.
      </p>

      <h2 className="h3">Anwendbares Recht</h2>
      <p>Diese Website untersteht dem Schweizer Recht.</p>
    </>
  );
}

function Cgv() {
  return (
    <>
      <h1 className="h1">Allgemeine Geschäftsbedingungen</h1>
      <Dated />
      <div className="alert alert-info">
        Diese Bedingungen gelten ab dem Start des Dienstes für die Leistungen. Die Punkte in
        eckigen Klammern werden bis dahin ergänzt.
      </div>

      <h2 className="h3">1. Gegenstand und Geltungsbereich</h2>
      <p>
        Diese Bedingungen regeln die Leistungen im Pflanzenschutz im Rebbau per Drohne, die
        {' '}{company.name} anbietet. Sie gelten ab der Annahme einer Offerte.
      </p>

      <h2 className="h3">2. Schätzung und Offerte</h2>
      <p>
        Die online erhaltene Schätzung ist kostenlos, dient der Orientierung und ist
        unverbindlich. Sie ist keine verbindliche Offerte. Eine detaillierte Offerte wird
        danach erstellt, je nach Parzellen, Behandlung und den Gegebenheiten vor Ort.
      </p>

      <h2 className="h3">3. Annahme und Preise</h2>
      <p>
        Die Leistung beginnt nach der schriftlichen Annahme der Offerte. Die Preise verstehen
        sich in Schweizer Franken, allfällige MWST inbegriffen. Ist das Unternehmen
        mehrwertsteuerpflichtig, gilt für das Spritzen von Reben der reduzierte Satz, gemäss
        der Eidgenössischen Steuerverwaltung. [Zahlungsbedingungen zu ergänzen: Anzahlung,
        Frist, akzeptierte Zahlungsmittel.]
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
        Jeder Einsatz setzt insbesondere eine vorgängige Bewilligung des Bundesamts für
        Zivilluftfahrt (BAZL), ein von Agroscope zugelassenes Drohnenmodell, ein von einer
        anerkannten Stelle geprüftes Sprühgerät und mindestens eine Person mit Fachbewilligung
        für die Verwendung von Pflanzenschutzmitteln voraus. Die Mittel werden gemäss ihrer
        Zulassung und ihren Anwendungsbedingungen in der Schweiz eingesetzt.
      </p>

      <h2 className="h3">7. Haftung und Versicherung</h2>
      <p>
        Wir haften bei Verschulden im Rahmen des Schweizer Rechts. Die Haftung ist
        ausgeschlossen für Schäden, die aus falschen Angaben der Kundschaft oder aus einem
        unsicheren Zugang entstehen. [Zu ergänzen: Deckung der Haftpflichtversicherung,
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
      <p>
        Diese Bedingungen unterstehen dem Schweizer Recht. Gerichtsstand: Kanton {CANTON},
        vorbehalten bleiben die zwingenden Gerichtsstände, insbesondere jene der
        Konsumentinnen und Konsumenten (Art. 32 und 35 der Zivilprozessordnung).
      </p>
    </>
  );
}

function Cookies() {
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <h1 className="h1">Cookie-Verwaltung</h1>
      <Dated />
      <div className="alert alert-info">
        Diese Website verwendet keine Werbe-Cookies und keine Reichweitenmessung (kein Google
        Analytics, kein Pixel sozialer Netzwerke). Nur eine technische Speicherung, die für
        den Betrieb nützlich ist, bleibt in Ihrem Browser.
      </div>

      <h2 className="h3">Was auf Ihrem Gerät gespeichert wird</h2>
      <div className="table-wrap mt-2">
        <table className="data">
          <thead>
            <tr><th>Name</th><th>Art</th><th>Zweck</th><th>Dauer</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>vitiaero_token</td>
              <td>Lokale Speicherung</td>
              <td>Sie in Ihrem Kundenbereich angemeldet halten</td>
              <td>Bis zur Abmeldung, höchstens 7 Tage</td>
            </tr>
            <tr>
              <td>vitiaero_privacy_ack</td>
              <td>Lokale Speicherung</td>
              <td>Speichern, dass Sie den Hinweis gelesen haben</td>
              <td>Bis zur Löschung</td>
            </tr>
            <tr>
              <td>vitiaero_lang</td>
              <td>Lokale Speicherung</td>
              <td>Die gewählte Sprache der Website speichern</td>
              <td>Bis zur Löschung</td>
            </tr>
            <tr>
              <td>vitiaero_map_tip</td>
              <td>Lokale Speicherung</td>
              <td>Die Hilfe zur Karte nach dem ersten Anzeigen nicht mehr zeigen</td>
              <td>Bis zur Löschung</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="h3 mt-3">Diese Speicherung ablehnen</h2>
      <p>
        Sie können sie ablehnen, indem Sie die Daten dieser Website in den Einstellungen
        Ihres Browsers sperren (Bereich Cookies oder Websitedaten). Die Website bleibt
        nutzbar; nur die Anmeldung im Kundenbereich und das Speichern Ihrer Einstellungen
        funktionieren dann nicht mehr.
      </p>

      <h2 className="h3 mt-3">Hosting und Karte</h2>
      <p>
        Der Hoster GitHub speichert aus Sicherheitsgründen bei jedem Besuch Ihre IP-Adresse.
        Auf der Schätzungsseite erhält die Karte ihre Hintergründe von swisstopo und, wenn Sie
        den Hintergrund «Plan» wählen, von OpenStreetMap: Diese Dienste erhalten Ihre
        IP-Adresse, setzen aber keine Werbe-Cookies. Siehe{' '}
        <Link to="/confidentialite" style={linkStyle}>Datenschutzerklärung</Link>.
      </p>

      <h2 className="h3 mt-3">Gespeicherte Daten löschen</h2>
      <p>
        Sie können die Speicherung dieser Website jederzeit in Ihrem Browser löschen oder mit
        der Schaltfläche unten. Sie werden dann abgemeldet.
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
      <Dated />

      <h2 className="h3">1. Gegenstand</h2>
      <p>
        Die Website ermöglicht es, eine Schätzung für den Pflanzenschutz im Rebbau per Drohne
        zu berechnen, kostenlos und unverbindlich. Die Schätzung dient der Orientierung; die
        verbindliche Offerte wird separat zugestellt.
      </p>

      <h2 className="h3">2. Konto</h2>
      <p>
        Sie verpflichten sich, korrekte Angaben zu machen und Ihre Zugangsdaten vertraulich
        zu behandeln. Sie sind für die Aktivitäten über Ihr Konto verantwortlich.
      </p>

      <h2 className="h3">3. Verlauf der Einsätze</h2>
      <p>
        Ihr Kundenbereich zeigt die von VitiAero erfassten Einsätze. Diese Angaben dienen der
        Übersicht. Bei Abweichungen von Offerte oder Rechnung sind diese Dokumente massgebend.
      </p>

      <h2 className="h3">4. Personendaten</h2>
      <p>
        Die Bearbeitung Ihrer Daten ist in unserer{' '}
        <Link to="/confidentialite" style={linkStyle}>Datenschutzerklärung</Link> beschrieben.
      </p>

      <h2 className="h3">5. Haftung</h2>
      <p>
        Der Dienst wird ohne Gewähr für eine ständige Verfügbarkeit angeboten. Unsere Haftung
        ist beschränkt, soweit das Schweizer Recht es zulässt.
      </p>

      <h2 className="h3">6. Anwendbares Recht</h2>
      <p>
        Diese Bedingungen unterstehen dem Schweizer Recht. Gerichtsstand: Kanton {CANTON},
        vorbehalten bleiben die zwingenden Gerichtsstände, insbesondere jene der
        Konsumentinnen und Konsumenten.
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
