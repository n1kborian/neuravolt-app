import { BranchenPageTemplate } from "@/components/shared/BranchenPage";

export const metadata = {
  title: "DGUV V3 Prüfung Einzelhandel – NeuraVolt Stuttgart",
  description: "DGUV V3 Betriebsmittelprüfung für Einzelhandelsgeschäfte in Stuttgart. Kassensysteme, Kühlanlagen und Lagergeräte prüfen. Ab 4,90 €/Gerät.",
};

export default function EinzelhandelPruefungPage() {
  return (
    <BranchenPageTemplate
      iconName="ShoppingBag"
      badge="Branche · Einzelhandel"
      title="DGUV-Prüfung für"
      highlight="Einzelhandel & Retail."
      subtitle="Von der Kasse über die Kühlung bis zum Lager — Einzelhandelsgeschäfte haben zahlreiche prüfpflichtige Betriebsmittel."
      intro="Im Einzelhandel sind elektrische Betriebsmittel in vielen Bereichen im Einsatz: Kassensysteme, Beleuchtungsanlagen, Kühlanlagen, Lagergeräte und Kassenzonen-Equipment. NeuraVolt prüft Ihre Betriebsmittel außerhalb der Öffnungszeiten, sodass kein Umsatz verloren geht — und erstellt ein vollständiges digitales Prüfprotokoll."
      geraete={["Kassensysteme & EC-Terminals", "Kühl- & Tiefkühlanlagen", "Beleuchtungsanlagen", "Lagergeräte & Handhubwagen", "Sicherheitstechnik & Alarmanlagen", "Back-Office-IT & Drucker"]}
      besonderheiten={[
        "Prüfung außerhalb der Öffnungszeiten — kein Umsatzverlust",
        "Separate Protokolle für Verkaufsraum, Lager und Büro",
        "Kassensysteme und Zahlungsterminals inklusive",
        "Prüfung von Kühlanlagen mit Feuchtraumzertifizierung",
        "Skalierbar für Einzelgeschäfte bis Filialnetze",
        "Digitale Protokolle für jede Filiale einzeln abrufbar",
      ]}
    />
  );
}
