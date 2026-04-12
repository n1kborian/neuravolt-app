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
    { href: "/fuer-unternehmen", label: "Für Unternehmen" },
    { href: "/standorte", label: "Standorte" },
    { href: "/ratgeber", label: "Ratgeber" },
    { href: "/partner", label: "Partner werden" },
    { href: "/hiring", label: "Karriere" },
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
              NeuraVolt GmbH<br />Stuttgart, Deutschland
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
            © {new Date().getFullYear()} NeuraVolt GmbH · Alle Rechte vorbehalten
          </p>
          <div className="flex items-center gap-6">

            <LegalModal label="Datenschutz" title="Datenschutzerklärung">
              <div className="space-y-1">
                <p><strong>1. Verantwortlicher</strong></p>
                <p>NeuraVolt GmbH, Stuttgart, Deutschland. Kontakt: datenschutz@neuravolt.de</p>
              </div>
              <div className="space-y-1">
                <p><strong>2. Erhebung und Verarbeitung personenbezogener Daten</strong></p>
                <p>Wir erheben personenbezogene Daten ausschließlich im Rahmen der Anbahnung und Durchführung von Prüfaufträgen sowie zur Kommunikation mit unseren Kunden. Eine Weitergabe an Dritte erfolgt nur, soweit dies zur Vertragserfüllung erforderlich ist oder Sie ausdrücklich eingewilligt haben.</p>
              </div>
              <div className="space-y-1">
                <p><strong>3. Speicherung & DSGVO</strong></p>
                <p>Alle Daten werden ausschließlich auf Servern in Deutschland gespeichert und gemäß der Datenschutz-Grundverordnung (DSGVO) verarbeitet. Prüfprotokolle und Kundendaten werden nach gesetzlichen Aufbewahrungsfristen gelöscht.</p>
              </div>
              <div className="space-y-1">
                <p><strong>4. Ihre Rechte</strong></p>
                <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit. Widerruf erteilter Einwilligungen ist jederzeit möglich. Beschwerden können bei der zuständigen Datenschutzbehörde eingereicht werden.</p>
              </div>
              <div className="space-y-1">
                <p><strong>5. Cookies & Analyse</strong></p>
                <p>Diese Website verwendet ausschließlich technisch notwendige Cookies. Es werden keine Tracking- oder Analyse-Cookies ohne Ihre Einwilligung gesetzt.</p>
              </div>
            </LegalModal>

            <LegalModal label="Impressum" title="Impressum">
              <div className="space-y-1">
                <p><strong>Angaben gemäß § 5 TMG</strong></p>
                <p>NeuraVolt GmbH<br />Musterstraße 1<br />70173 Stuttgart<br />Deutschland</p>
              </div>
              <div className="space-y-1">
                <p><strong>Kontakt</strong></p>
                <p>Telefon: +49 (0) 711 000 000<br />E-Mail: info@neuravolt.de</p>
              </div>
              <div className="space-y-1">
                <p><strong>Handelsregister</strong></p>
                <p>Registergericht: Amtsgericht Stuttgart<br />Registernummer: HRB 000000</p>
              </div>
              <div className="space-y-1">
                <p><strong>Umsatzsteuer-ID</strong></p>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE000000000</p>
              </div>
              <div className="space-y-1">
                <p><strong>Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)</strong></p>
                <p>Geschäftsführer NeuraVolt GmbH, Musterstraße 1, 70173 Stuttgart</p>
              </div>
              <div className="space-y-1">
                <p><strong>Haftungshinweis</strong></p>
                <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
              </div>
            </LegalModal>

            <LegalModal label="AGB" title="Allgemeine Geschäftsbedingungen">
              <div className="space-y-1">
                <p><strong>§ 1 Geltungsbereich</strong></p>
                <p>Diese AGB gelten für alle Verträge zwischen der NeuraVolt GmbH und ihren Kunden über die Erbringung von DGUV V3 Prüfleistungen und damit verbundenen Dienstleistungen.</p>
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
