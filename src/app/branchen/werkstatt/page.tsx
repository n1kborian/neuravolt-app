import { BranchenPageTemplate } from "@/components/shared/BranchenPage";

export const metadata = {
  title: "DGUV V3 Prüfung Werkstatt – NeuraVolt Stuttgart",
  description: "DGUV V3 Betriebsmittelprüfung für Werkstätten in Stuttgart. Elektrowerkzeuge und Maschinen jährlich prüfen lassen. Ab 4,90 €/Gerät.",
};

export default function WerkstattPruefungPage() {
  return (
    <BranchenPageTemplate
      iconName="Wrench"
      badge="Branche · Werkstatt"
      title="DGUV-Prüfung für"
      highlight="Werkstätten & Handwerk."
      subtitle="Elektrowerkzeuge in Werkstätten unterliegen kürzeren Prüfintervallen — oft jährlich. NeuraVolt prüft schnell und rechtssicher."
      intro="In handwerklichen und industriellen Werkstätten sind elektrische Betriebsmittel täglich starker Beanspruchung ausgesetzt. Staub, Vibrationen und intensiver Einsatz erhöhen die Ausfallgefahr erheblich. Die DGUV Vorschrift 3 schreibt daher in Werkstätten deutlich kürzere Prüfintervalle vor — in der Regel 1 Jahr. NeuraVolt prüft schnell und effizient, damit Ihre Produktion weiterläuft."
      geraete={["Elektrowerkzeuge (Bohrer, Sägen, Schleifer)", "Schweißgeräte & Plasmaschneider", "Kompressoren & Druckluftwerkzeug", "Hebebühnen & Hydraulikgeräte", "Messgeräte & Prüfstände", "Verlängerungskabel & CEE-Stecker"]}
      besonderheiten={[
        "Jährliche Prüfintervalle für Handwerksbetriebe eingeplant",
        "Prüfung auch unter laufendem Betrieb möglich",
        "Besonderes Augenmerk auf stark beanspruchte Werkzeuge",
        "Sofortige Aussonderungsempfehlung bei defekten Geräten",
        "Protokolle für jedes einzelne Werkzeug mit Seriennummer",
        "Schnelle Prüfung für kurze Betriebsunterbrechung",
      ]}
    />
  );
}
