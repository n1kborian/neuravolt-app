import { BranchenPageTemplate } from "@/components/shared/BranchenPage";

export const metadata = {
  title: "DGUV V3 Prüfung Gastronomie – NeuraVolt Stuttgart",
  description: "DGUV V3 Betriebsmittelprüfung für Restaurants, Cafés und Gastronomie in Stuttgart. Küchen- und Servicegeräte rechtssicher prüfen. Ab 4,90 €/Gerät.",
};

export default function GastronomiePruefungPage() {
  return (
    <BranchenPageTemplate
      iconName="UtensilsCrossed"
      badge="Branche · Gastronomie"
      title="DGUV-Prüfung für"
      highlight="Gastronomie & Küche."
      subtitle="Gewerbliche Küchen haben besonders hohe Prüfanforderungen. Hitze, Feuchtigkeit und intensive Nutzung erfordern kürzere Prüfintervalle."
      intro="In gastronomischen Betrieben werden elektrische Geräte intensiv und unter extremen Bedingungen betrieben: Hitze, Feuchtigkeit und ständige Nutzung erhöhen das Ausfallrisiko erheblich. Die DGUV Vorschrift 3 schreibt daher in Küchen kürzere Prüfintervalle vor — oft jährlich. NeuraVolt koordiniert die Prüfung passend zu Ihren Öffnungszeiten."
      geraete={["Herde, Öfen & Friteusen", "Gewerbliche Spülmaschinen", "Kaffeevollautomaten", "Kühl- & Gefriergeräte", "Mixer, Cutter & Rührmaschinen", "Kassen- und Bestellsysteme"]}
      besonderheiten={[
        "Prüfung vor oder nach Betriebszeiten zur Minimierung der Unterbrechung",
        "Kürzere Prüfintervalle für Feuchtraumgeräte berücksichtigt",
        "Separate Protokolle für Küche, Bar und Service",
        "Prüfung aller ortsfesten und ortsveränderlichen Geräte",
        "Sofortiges Protokoll bei nicht bestandener Prüfung",
        "Empfehlungen zur Gerätesicherheit inklusive",
      ]}
    />
  );
}
