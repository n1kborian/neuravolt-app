import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/ui/ruixen-ui-hero";
import { WieFunktioniertEs } from "@/components/home/WieFunktioniertEs";
import { FuerWenSection } from "@/components/home/FuerWenSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/essentials/Footer";

const ClusterSection = dynamic(() => import("@/components/home/ClusterSection").then(m => m.ClusterSection));
const AiSection = dynamic(() => import("@/components/home/AiSection").then(m => m.AiSection));
const FristencheckSection = dynamic(() => import("@/components/home/FristencheckSection").then(m => m.FristencheckSection));
const FAQSection = dynamic(() => import("@/components/home/FAQSection").then(m => m.FAQSection));

export const metadata = {
  title: "NeuraVolt – DGUV V3 Prüfung Stuttgart & Region",
  description:
    "NeuraVolt ist die digitale Plattform für DGUV V3 Betriebsmittelprüfungen in Stuttgart. Zertifizierte Partnerfachkräfte, KI-optimierte Auftragsbündelung, automatisches Fristenmanagement — bis zu 20 % Kostenersparnis. Ab 4,90 €/Gerät.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
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
