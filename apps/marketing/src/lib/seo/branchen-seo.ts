import type { BrancheIconName } from "@/components/shared/BranchenPage";

// Für Stadt×Branche-Combos. Kürzer als die Haupt-Branchen-Pages unter /branchen/*.
// 4 Kernbranchen für die erste SEO-Welle (Hotel & Einzelhandel kommen später).

export interface SeoBranche {
  slug: string;
  name: string;
  iconName: BrancheIconName;
  image: string;
  imageAlt: string;
  intro: string;           // Kurzer Fließtext, generisch — kombiniert mit Stadt-Intro
  geraete: string[];       // Branche-typische Betriebsmittel
  besonderheiten: string[];// Was NeuraVolt für diese Branche liefert
}

export const SEO_BRANCHEN: Record<string, SeoBranche> = {
  buero: {
    slug: "buero",
    name: "Büro & Verwaltung",
    iconName: "Building2",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Moderner Büroarbeitsplatz mit PCs und Monitoren",
    intro:
      "PCs, Monitore, Drucker, Kaffeemaschinen und Verlängerungskabel — jedes Bürogerät mit Stecker unterliegt der Prüfpflicht nach DGUV Vorschrift 3. Für Büroumgebungen gelten Prüfintervalle von bis zu 24 Monaten, die wir zuverlässig im Blick behalten.",
    geraete: [
      "PCs, Laptops, Monitore, Dockingstations",
      "Drucker, Kopierer & Scanner",
      "Kaffeemaschinen & Wasserspender",
      "Verlängerungskabel & Steckdosenleisten",
      "Ladegeräte, Netzteile & USB-Hubs",
      "Serverraum-Peripherie & USV-Anlagen",
    ],
    besonderheiten: [
      "Prüfung außerhalb der Kernarbeitszeit — keine Betriebsunterbrechung",
      "Komplette Dokumentation pro Raum bzw. Kostenstelle",
      "Automatische Fristenerinnerung vor Ablauf",
      "Digitale Protokolle sofort per E-Mail",
      "Anpassbare Prüfintervalle laut Gefährdungsbeurteilung",
      "Versicherungskonforme Archivierung der Prüfberichte",
    ],
  },

  gastronomie: {
    slug: "gastronomie",
    name: "Gastronomie",
    iconName: "UtensilsCrossed",
    image: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Gewerbliche Küche mit Kochgeräten",
    intro:
      "In Küchen und Servicebereichen werden Geräte unter extremen Bedingungen betrieben: Hitze, Feuchtigkeit und Dauerlast erhöhen das Ausfallrisiko. Die DGUV V3 schreibt deshalb kürzere Intervalle — wir prüfen passend zu Ihren Öffnungszeiten.",
    geraete: [
      "Herde, Öfen & Friteusen",
      "Gewerbliche Spülmaschinen",
      "Kaffeevollautomaten",
      "Kühl- & Gefriergeräte",
      "Mixer, Cutter & Rührmaschinen",
      "Kassen- & Bestellsysteme",
    ],
    besonderheiten: [
      "Prüfung vor oder nach Betriebszeiten",
      "Kürzere Prüfintervalle für Feuchtraumgeräte",
      "Separate Protokolle für Küche, Bar und Service",
      "Prüfung aller ortsfesten und ortsveränderlichen Geräte",
      "Sofortiges Protokoll bei nicht bestandener Prüfung",
      "Empfehlungen zur Gerätesicherheit inklusive",
    ],
  },

  arztpraxis: {
    slug: "arztpraxis",
    name: "Arztpraxis & Praxis",
    iconName: "Stethoscope",
    image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Moderne Arztpraxis mit medizinischen Geräten",
    intro:
      "Medizinische Geräte unterliegen neben der DGUV V3 teilweise auch der MPBetreibV. Wir prüfen elektrische Betriebsmittel einer Praxis — ohne Störung des Patientenbetriebs und mit vollständiger Dokumentation für Aufsichtsbehörden.",
    geraete: [
      "EDV & Praxis-Software-Systeme",
      "Sterilisatoren & Autoklaven",
      "Dentale / chirurgische Handstücke",
      "Ultraschall- & EKG-Geräte",
      "Beleuchtung in Behandlungsräumen",
      "Wartezimmer-Elektronik & Empfang",
    ],
    besonderheiten: [
      "Prüfung in Randzeiten oder am Wochenende",
      "Audit-konforme Protokolle für Behörden",
      "Klar getrennte Prüflisten pro Raum",
      "Schnelle Ersatz-Empfehlung bei Defekten",
      "Fristenmanagement inklusive MPBetreibV-Bezug",
      "Diskrete Prüfung ohne Patientenkontakt",
    ],
  },

  werkstatt: {
    slug: "werkstatt",
    name: "Werkstatt & Handwerk",
    iconName: "Wrench",
    image: "https://images.pexels.com/photos/3846205/pexels-photo-3846205.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Handwerks-Werkstatt mit Elektrowerkzeugen",
    intro:
      "Werkstätten und Handwerksbetriebe haben die höchste Gerätedichte und die raueste Einsatzumgebung. Schutzleiter, Isolationswiderstand, Funktionstest — wir prüfen alles nach DIN VDE 0701-0702 mit verkürzten Intervallen, wo nötig.",
    geraete: [
      "Bohr-, Schleif- und Sägemaschinen",
      "Schweißgeräte & Lötkolben",
      "Werkbankbeleuchtung",
      "Verlängerungskabel & Kabeltrommeln",
      "Druckluft-Kompressoren (elektrisch)",
      "Werkstattmaschinen nach DIN VDE 0113",
    ],
    besonderheiten: [
      "Verkürzte Prüfintervalle von 3–12 Monaten berücksichtigt",
      "Prüfung direkt an der Werkbank",
      "Schutzleitermessung und Funktionstest inklusive",
      "Kabeltrommeln und Verlängerungen vollständig erfasst",
      "Plaketten mit nächstem Prüftermin",
      "Protokolle pro Maschine bzw. Arbeitsplatz",
    ],
  },
};

export const SEO_BRANCHE_SLUGS = Object.keys(SEO_BRANCHEN);

export function getBranche(slug: string): SeoBranche | null {
  return SEO_BRANCHEN[slug] ?? null;
}
