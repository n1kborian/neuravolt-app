"use client";

import Link from "next/link";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const footerLinks = {
  Service: [
    { href: "/dguv-pruefung", label: "DGUV-Prüfung" },
    { href: "/dguv-v3", label: "Was ist DGUV V3?" },
    { href: "/dguv-check", label: "DGUV-Check" },
    { href: "/angebote", label: "Preise" },
  ],
  Branchen: [
    { href: "/branchen/buero", label: "Büro & Verwaltung" },
    { href: "/branchen/gastronomie", label: "Gastronomie" },
    { href: "/branchen/arztpraxis", label: "Arztpraxis" },
    { href: "/branchen/hotel", label: "Hotel" },
    { href: "/branchen/werkstatt", label: "Werkstatt" },
    { href: "/branchen/einzelhandel", label: "Einzelhandel" },
  ],
  Unternehmen: [
    { href: "/standorte", label: "Standorte" },
    { href: "/ratgeber", label: "Ratgeber" },
    { href: "/partner", label: "Partner werden" },
    { href: "/contact", label: "Kontakt" },
  ],
};

function LegalModal({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-gray-400 hover:text-foreground transition-colors cursor-pointer">
          {label}
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(680px,85vh)] sm:max-w-xl [&>button:last-child]:top-4 [&>button:last-child]:right-4">
        <div className="overflow-y-auto">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="px-6 pt-6 pb-2 text-xl border-b border-border mb-0">
              {title}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="px-6 py-5 text-sm text-muted-foreground leading-relaxed space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
                {children}
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <DialogClose asChild>
            <button className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90">
              Verstanden
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold tracking-widest text-foreground">
                NEURA<span className="font-normal text-[#0a0a0a]">VOLT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              DGUV V3 Betriebsmittelprüfung digital & rechtssicher. Stuttgart & Region.
            </p>
            <p className="text-xs text-gray-300">
              NeuraVolt<br />Stuttgart, Deutschland
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-[#0a0a0a] text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-gray-400 hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} NeuraVolt · Alle Rechte vorbehalten
          </p>
          <div className="flex items-center gap-6">

            <LegalModal label="Datenschutz" title="Datenschutzerklärung">
              <div className="space-y-1">
                <p><strong>1. Datenschutz auf einen Blick – Allgemeine Hinweise</strong></p>
                <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Datenerfassung auf dieser Website</strong></p>
                <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z.&nbsp;B. über ein Kontaktformular). Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst (v.&nbsp;a. technische Daten wie Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>
                <p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerruf erteilter Einwilligungen und Beschwerde bei der zuständigen Aufsichtsbehörde.</p>
              </div>
              <div className="space-y-1">
                <p><strong>2. Hosting – Vercel</strong></p>
                <p>Wir hosten die Inhalte unserer Website bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (nachfolgend „Vercel"). Wenn Sie unsere Website besuchen, erfasst Vercel verschiedene Logfiles inklusive Ihrer IP-Adressen. Details entnehmen Sie der Datenschutzerklärung von Vercel: https://vercel.com/legal/privacy-policy.</p>
                <p>Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Mit Vercel besteht ein Vertrag über Auftragsverarbeitung (Data Processing Addendum).</p>
                <p><strong>Datenübertragung in die USA:</strong> Vercel verarbeitet Daten auch in den USA. Vercel ist unter dem EU-US Data Privacy Framework (DPF) zertifiziert und verpflichtet sich damit, europäische Datenschutzstandards einzuhalten. Details: https://www.dataprivacyframework.gov/.</p>
              </div>
              <div className="space-y-1">
                <p><strong>E-Mail-Hosting – IONOS</strong></p>
                <p>Unser E-Mail-Postfach (info@neuravolt.de) wird bei der IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, gehostet. Im Rahmen der E-Mail-Kommunikation verarbeitet IONOS die übermittelten Inhalte sowie technische Metadaten (z.&nbsp;B. Absender, Empfänger, Zeitstempel, IP-Adressen). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an zuverlässiger Kommunikation) bzw. Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogener Korrespondenz. Mit IONOS besteht ein Vertrag über Auftragsverarbeitung (AVV). Details: https://www.ionos.de/terms-gtc/terms-privacy.</p>
              </div>
              <div className="space-y-1">
                <p><strong>3. Allgemeine Hinweise und Pflichtinformationen – Datenschutz</strong></p>
                <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Wir weisen darauf hin, dass die Datenübertragung im Internet (z.&nbsp;B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Hinweis zur verantwortlichen Stelle</strong></p>
                <p>Niklas Hammerschmidt<br />Schwalbenweg 6<br />70825 Korntal-Münchingen<br />Telefon: +49 176 72405224<br />E-Mail: info@neuravolt.de</p>
                <p>Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Speicherdauer</strong></p>
                <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung haben (z.&nbsp;B. steuer- oder handelsrechtliche Aufbewahrungsfristen).</p>
              </div>
              <div className="space-y-1">
                <p><strong>Rechtsgrundlagen der Datenverarbeitung</strong></p>
                <p>Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO. Sind Daten zur Vertragserfüllung oder vorvertraglichen Maßnahmen erforderlich, erfolgt die Verarbeitung nach Art. 6 Abs. 1 lit. b DSGVO, bei rechtlichen Verpflichtungen nach Art. 6 Abs. 1 lit. c DSGVO und im Rahmen berechtigter Interessen nach Art. 6 Abs. 1 lit. f DSGVO. Die Einwilligung ist jederzeit widerrufbar.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Ihre Rechte</strong></p>
                <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft, Empfänger und den Zweck der Datenverarbeitung sowie ggf. ein Recht auf Berichtigung, Löschung oder Einschränkung der Verarbeitung. Darüber hinaus haben Sie das Recht auf Datenübertragbarkeit sowie ein Beschwerderecht bei der zuständigen Aufsichtsbehörde. Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden.</p>
                <p>Erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO). Gegen die Verwendung Ihrer Daten zum Zwecke der Direktwerbung können Sie jederzeit Widerspruch einlegen.</p>
              </div>
              <div className="space-y-1">
                <p><strong>SSL- bzw. TLS-Verschlüsselung</strong></p>
                <p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und am Schloss-Symbol in Ihrer Browserzeile.</p>
              </div>
              <div className="space-y-1">
                <p><strong>4. Datenerfassung auf dieser Website – Cookies</strong></p>
                <p>Unsere Internetseiten verwenden sog. „Cookies". Cookies werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Technisch notwendige Cookies werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert. Sofern eine Einwilligung abgefragt wurde, erfolgt die Speicherung ausschließlich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit widerrufbar. Sie können Ihren Browser so einstellen, dass Cookies abgelehnt oder automatisch gelöscht werden.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Cookiebot</strong></p>
                <p>Diese Website nutzt Cookiebot zur Verwaltung der Cookie-Einwilligungen. Anbieter ist Cybot A/S, Havnegade 39, 1058 Kopenhagen, Dänemark. Cookiebot speichert notwendige Cookies, um Ihre Cookie-Präferenzen zu erfassen und zu dokumentieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO. Mit Cookiebot besteht ein Vertrag über Auftragsverarbeitung (AVV). Weitere Informationen: https://www.cookiebot.com/de/privacy-policy/.</p>
              </div>
              <div className="space-y-1">
                <p><strong>5. Analyse-Tools und Werbung – IONOS WebAnalytics</strong></p>
                <p>Diese Website nutzt IONOS WebAnalytics der 1&amp;1 IONOS SE, Elgendorfer Straße 57, 56410 Montabaur. Erfasst werden u.&nbsp;a. Referrer, angeforderte Webseite, Browsertyp, Betriebssystem, Gerätetyp, Uhrzeit des Zugriffs sowie die IP-Adresse in anonymisierter Form. Die Datenerfassung erfolgt vollständig anonymisiert; Cookies werden nicht gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO bzw. – sofern abgefragt – Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Mit IONOS besteht ein AVV. Details: https://www.ionos.de/terms-gtc/datenschutzerklaerung/.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Google Tag Manager</strong></p>
                <p>Diese Website verwendet den Google Tag Manager der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Der Google Tag Manager dient der Verwaltung eingebundener Tools und erstellt selbst keine Nutzerprofile. Er erfasst jedoch Ihre IP-Adresse, die auch in die USA übertragen werden kann. Der Google Tag Manager wird erst nach Ihrer ausdrücklichen Einwilligung über unser Cookie-Consent-Banner geladen (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG). Google ist unter dem EU-US Data Privacy Framework zertifiziert (https://www.dataprivacyframework.gov/participant/5780).</p>
              </div>
              <div className="space-y-1">
                <p><strong>Google Analytics</strong></p>
                <p>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited. Google Analytics verwendet Cookies, die eine Analyse der Benutzung der Website ermöglichen. Die erzeugten Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Wir haben die IP-Anonymisierung aktiviert. Bei Google gespeicherte Daten auf Nutzer- und Ereignisebene werden nach 14 Monaten anonymisiert bzw. gelöscht. Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG; die Einwilligung ist jederzeit widerrufbar. Mit Google besteht ein Vertrag zur Auftragsverarbeitung. Details: https://support.google.com/analytics/answer/6004245?hl=de.</p>
              </div>
              <div className="space-y-1">
                <p><strong>6. Plugins und Tools – Google Fonts (lokales Hosting)</strong></p>
                <p>Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten sog. Google Fonts. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern von Google findet dabei nicht statt. Weitere Informationen: https://developers.google.com/fonts/faq und https://policies.google.com/privacy?hl=de.</p>
              </div>
              <div className="space-y-1">
                <p><strong>7. Formulare und Lead-Erfassung</strong></p>
                <p>Wenn Sie auf dieser Website ein Formular absenden — konkret den <strong>Preisrechner</strong> (Angebotsanfrage), den <strong>kostenlosen Fristencheck</strong>, das <strong>Kontaktformular</strong> oder die <strong>Newsletter-Anmeldung</strong> — verarbeiten und speichern wir die von Ihnen eingegebenen Daten zur Bearbeitung Ihrer Anfrage bzw. zum Versand der angeforderten Informationen. Erfasste Felder sind je nach Formular z.&nbsp;B. Name, E-Mail, Unternehmen, Branche, Standort, Gerätezahl, gewünschter Prüfzeitraum und optionale Anmerkungen.</p>
                <p><strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen bzw. Vertragsanbahnung) sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), die Sie über die jeweilige Zustimmungs-Checkbox erteilen. Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</p>
                <p><strong>Speicherort:</strong> Die Daten werden in einer Datenbank bei Supabase Inc. (970 Toa Payoh North, #07-04, Singapore 318992) gespeichert, welche Postgres-Datenbanken in der EU (Region Frankfurt, Deutschland) betreibt. Mit Supabase besteht ein Vertrag über Auftragsverarbeitung (DPA). Details: https://supabase.com/privacy. Der Zugriff auf die gespeicherten Daten ist intern auf berechtigte Personen beschränkt und durch Zugriffskontrollen abgesichert.</p>
                <p><strong>Pseudonymisierte IP-Adresse:</strong> Zum Schutz vor Missbrauch (Spam, Bot-Submissions) speichern wir neben den Formulardaten einen pseudonymisierten Hash Ihrer IP-Adresse (SHA-256 mit serverseitigem Pepper, auf 32 Zeichen gekürzt). Die ursprüngliche IP wird nicht persistent gespeichert. Eine Rückführung auf Sie ist dadurch praktisch ausgeschlossen.</p>
                <p><strong>Bot-Schutz (Cloudflare Turnstile):</strong> Vor dem Absenden wird zur Unterscheidung zwischen Mensch und Bot eine serverseitige Challenge bei Cloudflare (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA) ausgeführt. Dabei werden technische Merkmale Ihres Browsers an Cloudflare übermittelt. Cloudflare ist unter dem EU-US Data Privacy Framework zertifiziert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Schutz vor automatisierten Angriffen). Details: https://www.cloudflare.com/privacypolicy/.</p>
                <p><strong>E-Mail-Versand (Resend):</strong> Die Bestätigungs- und Angebots-E-Mails werden über den Dienst Resend (Resend, Inc., Delaware, USA) versendet. Dabei werden Absender-, Empfänger- und Inhaltsdaten der E-Mail an Resend übermittelt. Resend ist unter dem EU-US Data Privacy Framework zertifiziert und verarbeitet die Daten im Rahmen eines Auftragsverarbeitungsvertrags. Details: https://resend.com/legal/privacy-policy.</p>
                <p><strong>Newsletter – Double-Opt-In:</strong> Die Anmeldung zum Ratgeber-Newsletter erfolgt nach dem Double-Opt-In-Verfahren. Nach Eingabe Ihrer E-Mail-Adresse erhalten Sie eine Bestätigungs-E-Mail mit einem Link, über den Sie die Anmeldung final bestätigen müssen. Erst danach werden Ihnen Newsletter zugesandt. Bis zur Bestätigung wird Ihre Anmeldung als „pending" vorgehalten; der Bestätigungslink verfällt automatisch nach 72 Stunden. Sie können sich jederzeit aus dem Newsletter austragen, indem Sie uns eine kurze Nachricht an info@neuravolt.de senden.</p>
                <p><strong>Speicherdauer:</strong> Formulardaten werden so lange gespeichert, wie es zur Bearbeitung Ihrer Anfrage bzw. zur Erfüllung des ursprünglichen Zwecks erforderlich ist. Soweit gesetzliche Aufbewahrungspflichten bestehen (insbesondere handels- und steuerrechtliche Fristen nach §§ 147 AO, 257 HGB), werden die betroffenen Daten entsprechend archiviert und erst nach Ablauf dieser Fristen gelöscht. Newsletter-Anmeldungen werden bis zu Ihrem Widerruf gespeichert; nicht bestätigte Anmeldungen (Double-Opt-In nicht abgeschlossen) werden in angemessenen Abständen gelöscht, sobald der Zweck für die Speicherung entfallen ist.</p>
                <p>Quelle (Basistext): https://www.e-recht24.de</p>
              </div>
            </LegalModal>

            <LegalModal label="Impressum" title="Impressum">
              <div className="space-y-1">
                <p><strong>Angaben gemäß § 5 TMG</strong></p>
                <p>NeuraVolt<br />Schwalbenweg 6<br />70825 Korntal-Münchingen<br />Deutschland</p>
              </div>
              <div className="space-y-1">
                <p><strong>Kontakt</strong></p>
                <p>Telefon: +49 176 72405224<br />E-Mail: info@neuravolt.de</p>
              </div>
              <div className="space-y-1">
                <p><strong>Vertretung</strong></p>
                <p>Inhaber: Niklas Hammerschmidt</p>
              </div>
              <div className="space-y-1">
                <p><strong>Haftung für Inhalte</strong></p>
                <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte nach allgemeinen Gesetzen verantwortlich. Nach §§ 8–10 TMG sind wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben unberührt. Eine Haftung ist erst ab Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entfernen wir solche Inhalte umgehend.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Haftung für Links</strong></p>
                <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben und daher keine Gewähr übernehmen. Für Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Links umgehend.</p>
              </div>
              <div className="space-y-1">
                <p><strong>Urheberrecht</strong></p>
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen deutschem Urheberrecht. Verwertung außerhalb der Grenzen des Urheberrechts bedarf der schriftlichen Zustimmung des Autors/Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Inhalte Dritter sind gekennzeichnet. Bei Hinweisen auf Rechtsverletzungen informieren Sie uns – wir entfernen Inhalte umgehend.</p>
              </div>
            </LegalModal>

            <LegalModal label="AGB" title="Allgemeine Geschäftsbedingungen">
              <div className="space-y-1">
                <p><strong>§ 1 Geltungsbereich</strong></p>
                <p>Diese AGB gelten für alle Verträge zwischen der NeuraVolt und ihren Kunden über die Erbringung von DGUV V3 Prüfleistungen und damit verbundenen Dienstleistungen.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 2 Vertragsschluss</strong></p>
                <p>Ein Vertrag kommt mit der schriftlichen oder elektronischen Auftragsbestätigung durch NeuraVolt zustande. Angebote sind freibleibend und unverbindlich.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 3 Leistungsumfang</strong></p>
                <p>NeuraVolt erbringt DGUV V3 Betriebsmittelprüfungen durch zertifizierte Elektrofachkräfte, erstellt digitale Prüfprotokolle und übernimmt auf Wunsch das Fristenmanagement. Der genaue Leistungsumfang ergibt sich aus dem jeweiligen Angebot.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 4 Preise und Zahlung</strong></p>
                <p>Die Abrechnung erfolgt auf Basis der geprüften Betriebsmittel gemäß vereinbartem Preis. Rechnungen sind innerhalb von 14 Tagen ohne Abzug zahlbar. Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 5 Mitwirkungspflichten des Kunden</strong></p>
                <p>Der Kunde stellt sicher, dass alle zu prüfenden Betriebsmittel zum vereinbarten Termin zugänglich sind und keine sicherheitsrelevanten Hindernisse bestehen.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 6 Haftung</strong></p>
                <p>NeuraVolt haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung für leichte Fahrlässigkeit ist auf den vorhersehbaren Schaden begrenzt. Die Haftung für Folgeschäden ist ausgeschlossen.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 7 Datenschutz</strong></p>
                <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den Bestimmungen der DSGVO.</p>
              </div>
              <div className="space-y-1">
                <p><strong>§ 8 Gerichtsstand</strong></p>
                <p>Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis ist Stuttgart, sofern der Kunde Kaufmann ist.</p>
              </div>
            </LegalModal>

          </div>
        </div>
      </div>
    </footer>
  );
}
