// SEO-Seeding: lokale Landing-Pages Stuttgart/Umgebung.
// Jede Stadt bekommt kurze, einzigartige lokale Anker (gegen Duplicate Content).

export type LocationAvailability = "available" | "coming-soon";

export interface SeoLocation {
  slug: string;           // URL-Segment — immer lowercase, keine Umlaute
  name: string;           // Anzeigename
  plzRange: string;       // PLZ-Bereich für Meta & Schema
  landmarks: string[];    // 3–4 lokale Anker: Gewerbegebiete, Stadtteile, bekannte Namen
  intro: string;          // 2 Sätze einzigartig pro Stadt, werden in H1/Intro einmontiert
  availability: LocationAvailability;
}

export const SEO_LOCATIONS: Record<string, SeoLocation> = {
  stuttgart: {
    slug: "stuttgart",
    name: "Stuttgart",
    plzRange: "70173 – 70629",
    landmarks: ["Königstraße & Innenstadt", "Vaihingen / Synergiepark", "Bad Cannstatt", "Feuerbach & Zuffenhausen"],
    intro:
      "Als Landeshauptstadt Baden-Württembergs ist Stuttgart mit tausenden Gewerbebetrieben das wirtschaftliche Zentrum der Region. Von der Königstraße über die Büro-Cluster in Vaihingen bis zu den Werkstätten in Feuerbach prüfen wir Betriebsmittel bei kleinen und mittelständischen Unternehmen aller Branchen.",
    availability: "available",
  },

  ludwigsburg: {
    slug: "ludwigsburg",
    name: "Ludwigsburg",
    plzRange: "71634 – 71642",
    landmarks: ["Altstadt & Residenzviertel", "Industriegebiet Tammerfeld", "Weststadt", "Oststadt & Hoheneck"],
    intro:
      "Ludwigsburg ist mit rund 95.000 Einwohnern und einem starken Mix aus Handwerk, Verwaltung und Industrie einer der wichtigsten Wirtschaftsstandorte nördlich von Stuttgart. NeuraVolt ist hier ab dem ersten Tag aktiv — unser operatives Team sitzt direkt im Landkreis.",
    availability: "available",
  },

  esslingen: {
    slug: "esslingen",
    name: "Esslingen am Neckar",
    plzRange: "73728 – 73734",
    landmarks: ["Altstadt & Marktplatz", "Mettingen (Festo-Campus)", "Weil / Pliensauvorstadt", "Berkheim & Industriegebiete"],
    intro:
      "Esslingen am Neckar verbindet lebendige Altstadtlagen mit starkem Zuliefer- und Maschinenbausektor. Ob Praxis in der Innenstadt oder Werkstatt in Mettingen — prüfpflichtige Betriebsmittel sind hier in nahezu jedem Unternehmen zu finden.",
    availability: "coming-soon",
  },

  sindelfingen: {
    slug: "sindelfingen",
    name: "Sindelfingen",
    plzRange: "71063 – 71069",
    landmarks: ["Mercedes-Werk", "Sindelfinger City Center", "Gewerbegebiet Goldberg", "Maichingen"],
    intro:
      "Rund um das Mercedes-Benz-Werk haben sich in Sindelfingen hunderte Zulieferer, Bürodienstleister und Werkstätten angesiedelt. Der dichte Mix aus Industrie und kleinteiligem Gewerbe macht regelmäßige DGUV-V3-Prüfungen hier zur Pflichtaufgabe.",
    availability: "coming-soon",
  },

  leonberg: {
    slug: "leonberg",
    name: "Leonberg",
    plzRange: "71229",
    landmarks: ["Zentrum & Marktplatz", "Stadtteil Eltingen", "Ramtel", "Gewerbegebiet am Autobahnkreuz"],
    intro:
      "Leonberg liegt verkehrsgünstig am Autobahnkreuz Leonberg und beherbergt zahlreiche mittelständische Betriebe, Werkstätten und Büros. Für KMU rund um den Standort ist eine rechtssichere Betriebsmittelprüfung nach DGUV V3 eine jährlich wiederkehrende Pflichtaufgabe.",
    availability: "coming-soon",
  },

  ditzingen: {
    slug: "ditzingen",
    name: "Ditzingen",
    plzRange: "71254",
    landmarks: ["Kernstadt", "Stadtteil Hirschlanden", "Heimerdingen", "Schöckinger Straße (Gewerbe)"],
    intro:
      "Ditzingen ist Firmensitz von Trumpf und Heimat eines breiten Branchen­mixes aus Maschinenbau, Handwerk und Mittelstand. Die hohe Dichte technischer Betriebe bedeutet: viele Geräte, klare Prüfpflicht, enge Fristen.",
    availability: "coming-soon",
  },
};

export const SEO_LOCATION_SLUGS = Object.keys(SEO_LOCATIONS);

export function getLocation(slug: string): SeoLocation | null {
  return SEO_LOCATIONS[slug] ?? null;
}
