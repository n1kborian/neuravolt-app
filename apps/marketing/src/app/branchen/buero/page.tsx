import { BranchenPageTemplate } from "@/components/shared/BranchenPage";

export const metadata = {
  title: "DGUV V3 Prüfung Büro & Verwaltung – NeuraVolt Stuttgart",
  description: "DGUV V3 Betriebsmittelprüfung für Büros und Verwaltungen in Stuttgart. PCs, Drucker, Kaffeemaschinen rechtssicher prüfen lassen. Ab 4,90 €/Gerät.",
};

export default function BueroPruefungPage() {
  return (
    <BranchenPageTemplate
      iconName="Building2"
      badge="Branche · Büro & Verwaltung"
      title="DGUV-Prüfung für"
      highlight="Büros & Verwaltungen."
      subtitle="Der typische Büroalltag steckt voller prüfpflichtiger Geräte. NeuraVolt prüft rechtssicher und digital — ohne Betriebsunterbrechung."
      intro="In Büros und Verwaltungsgebäuden befinden sich zahlreiche elektrische Betriebsmittel: PCs, Monitore, Drucker, Kaffeemaschinen, Mehrfachsteckdosen und Verlängerungskabel. Gemäß DGUV Vorschrift 3 müssen diese regelmäßig von einer Elektrofachkraft geprüft werden — üblicherweise alle 2 Jahre. NeuraVolt übernimmt die komplette Organisation und Durchführung."
      geraete={["PCs, Laptops & Monitore", "Drucker & Scanner", "Kaffeemaschinen & Wasserspender", "Verlängerungskabel & Steckdosenleisten", "Telefonanlage & Headsets", "Projektor & Beamer"]}
      besonderheiten={[
        "Prüfung aller ortsveränderlichen Betriebsmittel gemäß DGUV V3",
        "Terminkoordination außerhalb der Kernarbeitszeiten möglich",
        "Digitales Prüfprotokoll für jeden Arbeitsplatz separat",
        "Prüfplaketten mit nächstem Prüfdatum an jedem Gerät",
        "Automatisches Fristenmanagement für den nächsten Prüfzyklus",
        "Prüfung in laufendem Bürobetrieb — keine Betriebsunterbrechung",
      ]}
      image="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800"
      imageAlt="Modernes Büro mit PCs und Monitoren – DGUV V3 Prüfung"
    />
  );
}
