import { BranchenPageTemplate } from "@/components/shared/BranchenPage";

export const metadata = {
  title: "DGUV V3 Prüfung Arztpraxis – NeuraVolt Stuttgart",
  description: "DGUV V3 Betriebsmittelprüfung für Arztpraxen in Stuttgart. IT-Infrastruktur und allgemeine Betriebsmittel rechtssicher prüfen. Ab 4,90 €/Gerät.",
};

export default function ArztpraxisPruefungPage() {
  return (
    <BranchenPageTemplate
      iconName="Stethoscope"
      badge="Branche · Arztpraxis"
      title="DGUV-Prüfung für"
      highlight="Arztpraxen & Praxen."
      subtitle="Praxen unterliegen strengen Sicherheitsvorschriften. NeuraVolt prüft Ihre IT-Infrastruktur und allgemeinen Betriebsmittel — diskret und ohne Betriebsunterbrechung."
      intro="In Arztpraxen und medizinischen Einrichtungen gibt es zwei Kategorien prüfpflichtiger Geräte: allgemeine elektrische Betriebsmittel (PCs, Drucker, Kaffeemaschinen) nach DGUV V3 sowie medizinische Geräte nach MPBetreibV. NeuraVolt übernimmt die DGUV V3 Prüfung aller nicht-medizinischen Betriebsmittel und koordiniert diskret mit Ihrem Praxisalltag."
      geraete={["Praxis-PCs & Workstations", "Empfangs- & Anamneseterminals", "Drucker & Scanner", "Kaffeemaschinen im Wartezimmer", "Beleuchtungsanlagen", "Sterilisatoren (allg. Betrieb)"]}
      besonderheiten={[
        "Prüfung vor Praxisbeginn oder in Pausenzeiten",
        "Diskrete Durchführung ohne Störung des Praxisbetriebs",
        "Separate Protokolle für Empfang, Behandlungszimmer, Labor",
        "Datenschutzkonforme Arbeitsweise im sensiblen Praxisumfeld",
        "Klare Abgrenzung zu MPBetreibV-pflichtigen Medizingeräten",
        "Digitale Protokolle für die Praxisakte",
      ]}
      image="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800"
      imageAlt="Arztpraxis mit medizinischer Ausstattung – DGUV V3 Prüfung"
    />
  );
}
