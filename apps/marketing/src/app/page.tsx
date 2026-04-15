import NavBar from "@/components/NavBar";
import HeroSection from "@/components/ui/ruixen-ui-hero";
import { WieFunktioniertEs } from "@/components/home/WieFunktioniertEs";
import { FuerWenSection } from "@/components/home/FuerWenSection";
import { ClusterSection } from "@/components/home/ClusterSection";
import { AiSection } from "@/components/home/AiSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FristencheckSection } from "@/components/home/FristencheckSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/essentials/Footer";

export const metadata = {
  title: "NeuraVolt – DGUV V3 Prüfung Stuttgart & Region",
  description:
    "NeuraVolt ist die digitale Plattform für DGUV V3 Betriebsmittelprüfungen in Stuttgart. Zertifizierte Partnerfachkräfte, KI-optimierte Auftragsbündelung, automatisches Fristenmanagement — bis zu 20 % günstiger. Ab 4,90 €/Gerät.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main>
        <HeroSection />
        <WieFunktioniertEs />
        <FuerWenSection />
        <ClusterSection />
        <AiSection />
        <FristencheckSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
