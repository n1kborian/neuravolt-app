import { BranchenPageTemplate } from "@/components/shared/BranchenPage";

export const metadata = {
  title: "DGUV V3 Prüfung Hotel – NeuraVolt Stuttgart",
  description: "DGUV V3 Betriebsmittelprüfung für Hotels in Stuttgart. Zimmer, Küche und Veranstaltungstechnik rechtssicher prüfen. Ab 4,90 €/Gerät.",
};

export default function HotelPruefungPage() {
  return (
    <BranchenPageTemplate
      iconName="Hotel"
      badge="Branche · Hotel"
      title="DGUV-Prüfung für"
      highlight="Hotels & Beherbergung."
      subtitle="Hotels haben eine Vielzahl prüfpflichtiger Bereiche: Zimmer, Küche, Spa, Konferenz. NeuraVolt koordiniert die Prüfung ohne Beeinträchtigung Ihrer Gäste."
      intro="In Hotels gibt es hunderte prüfpflichtige Betriebsmittel — von Zimmerfernsehern über Küchengeräte bis zur Veranstaltungstechnik. Die Prüfung muss strukturiert und ohne Gästeunterbrechung erfolgen. NeuraVolt entwickelt einen individuellen Prüfplan für Ihren Hotelbetrieb und koordiniert alles in Ihrer Nebensaison oder zu gästearmen Zeiten."
      geraete={["Zimmerfernseher & Klimaanlagen", "Küchen- & Restaurantgeräte", "Konferenz- & Veranstaltungstechnik", "Spa- & Wellnessgeräte", "Ladesäulen & Lounge-Equipment", "Bürotechnik & Empfangsgeräte"]}
      besonderheiten={[
        "Prüfplan passend zur Belegungssituation des Hotels",
        "Zimmerweise Prüfung ohne Gästebeeinträchtigung",
        "Separate Protokolle pro Bereich (Zimmer, Küche, Konferenz, Spa)",
        "Prüfung auch in der Nebensaison koordinierbar",
        "Skalierbar für kleine Boutique-Hotels bis zu großen Kongresshotels",
        "Vollständige digitale Dokumentation für alle Bereiche",
      ]}
      image="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"
      imageAlt="Hotelzimmer – DGUV V3 Prüfung"
    />
  );
}
