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
const PainSolutionSection = dynamic(() => import("@/components/home/PainSolutionSection").then(m => m.PainSolutionSection));

export const metadata = {
  title: "NeuraVolt – DGUV V3 Prüfung Stuttgart & Region",
  description:
    "Das Prüfernetzwerk für DGUV V3 Betriebsmittelprüfungen in Stuttgart und der Region. Zertifizierte Elektrofachkräfte, digitale Protokolle, automatisches Fristenmanagement. Festpreis ab 4,90 €/Gerät — in Minuten gebucht, in Tagen geprüft.",
  alternates: {
    canonical: "https://neuravolt.de/",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://neuravolt.de/#organization",
      name: "NeuraVolt",
      url: "https://neuravolt.de",
      email: "info@neuravolt.de",
      logo: "https://neuravolt.de/icon.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Schwalbenweg 6",
        addressLocality: "Korntal-Münchingen",
        postalCode: "70825",
        addressCountry: "DE",
      },
      areaServed: [
        { "@type": "City", name: "Stuttgart" },
        { "@type": "City", name: "Ludwigsburg" },
        { "@type": "City", name: "Esslingen am Neckar" },
        { "@type": "City", name: "Sindelfingen" },
        { "@type": "City", name: "Leonberg" },
        { "@type": "City", name: "Ditzingen" },
      ],
    },
    {
      "@type": "Service",
      "@id": "https://neuravolt.de/#service",
      name: "DGUV V3 Betriebsmittelprüfung",
      serviceType: "Elektroprüfung nach DGUV Vorschrift 3",
      description:
        "Rechtssichere DGUV V3 Prüfung elektrischer Betriebsmittel durch zertifizierte Partnerfachkräfte — digital dokumentiert, mit automatischem Fristenmanagement.",
      provider: { "@id": "https://neuravolt.de/#organization" },
      areaServed: "Stuttgart & Metropolregion",
      offers: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "4.90",
          priceCurrency: "EUR",
          unitText: "Gerät",
        },
      },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <NavBar />
      <main>
        <HeroSection />
        <WieFunktioniertEs />
        <FuerWenSection />
        <ClusterSection />
        <AiSection />
        <FristencheckSection />
        <FAQSection />
        <PainSolutionSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
