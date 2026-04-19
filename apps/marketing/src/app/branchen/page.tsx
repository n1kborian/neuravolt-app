import PageClient from "./PageClient";

export const metadata = {
  title: "DGUV V3 Prüfung nach Branche – Intervalle, Pflichten & Preise | NeuraVolt",
  description:
    "DGUV V3 Betriebsmittelprüfung branchenspezifisch: Büro, Gastronomie, Arztpraxis, Hotel, Werkstatt & Einzelhandel. Prüfintervalle, typische Geräte und transparente Preise ab 4,90 €/Gerät — Stuttgart & Region.",
  keywords: [
    "DGUV V3 Prüfung",
    "DGUV V3 Branchen",
    "Betriebsmittelprüfung Stuttgart",
    "Elektroprüfung Büro",
    "Elektroprüfung Gastronomie",
    "Elektroprüfung Arztpraxis",
    "Elektroprüfung Hotel",
    "Elektroprüfung Werkstatt",
    "Elektroprüfung Einzelhandel",
    "Prüfintervall DGUV V3",
  ],
  alternates: { canonical: "/branchen" },
  openGraph: {
    title: "DGUV V3 Prüfung nach Branche – NeuraVolt",
    description:
      "Branchenspezifische DGUV V3 Betriebsmittelprüfung — Stuttgart & Region. Prüfintervalle, typische Geräte und transparente Preise.",
    url: "/branchen",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DGUV V3 Prüfung nach Branche",
  description:
    "Übersicht branchenspezifischer DGUV V3 Betriebsmittelprüfungen durch NeuraVolt — Stuttgart & Region.",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Büro & Verwaltung", url: "/branchen/buero" },
    { "@type": "ListItem", position: 2, name: "Gastronomie", url: "/branchen/gastronomie" },
    { "@type": "ListItem", position: 3, name: "Arztpraxis", url: "/branchen/arztpraxis" },
    { "@type": "ListItem", position: 4, name: "Hotel", url: "/branchen/hotel" },
    { "@type": "ListItem", position: 5, name: "Werkstatt", url: "/branchen/werkstatt" },
    { "@type": "ListItem", position: 6, name: "Einzelhandel", url: "/branchen/einzelhandel" },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageClient />
    </>
  );
}
