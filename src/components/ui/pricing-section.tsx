"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  priceUnit: string;
  priceDescription: string;
  features: PricingFeature[];
  ctaText: string;
  recommended?: boolean;
  onCtaClick?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  priceUnit,
  priceDescription,
  features,
  ctaText,
  recommended = false,
  onCtaClick = () => {},
}) => {
  return (
    <div
      className={`group relative flex flex-col h-full rounded-2xl border bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl p-8 ${
        recommended
          ? "border-foreground shadow-xl"
          : "border-border hover:border-foreground"
      }`}
    >
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full border border-foreground bg-foreground px-4 py-1 text-xs font-semibold text-background">
            Empfohlen
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground">ab</span>
          <span className="text-4xl font-bold text-foreground">{price}</span>
          <span className="text-lg text-muted-foreground">{priceUnit}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{priceDescription}</p>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                feature.included ? "bg-foreground" : "bg-muted"
              }`}
            >
              <Check
                className={`w-3 h-3 ${
                  feature.included ? "text-background" : "text-muted-foreground"
                }`}
              />
            </div>
            <span
              className={`text-sm ${
                feature.included ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onCtaClick}
        className={`group/btn w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ${
          recommended
            ? "border border-foreground bg-foreground text-background hover:bg-foreground/90"
            : "border border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        {ctaText}
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </div>
  );
};

export const PricingSection: React.FC = () => {
  const router = useRouter();

  const pricingPlans: PricingCardProps[] = [
    {
      title: "Einzelprüfung",
      description: "Perfekt für einmalige Prüfungen",
      price: "4,90€",
      priceUnit: "pro Gerät",
      priceDescription: "Einmalig, kein Vertrag",
      features: [
        { text: "Vollständige Sicherheitsprüfung", included: true },
        { text: "Detaillierter Prüfbericht", included: true },
        { text: "Prüfplakette und Dokumentation", included: true },
        { text: "Keine versteckten Kosten", included: true },
        { text: "Regelmäßige Wartungserinnerungen", included: false },
        { text: "Prioritäts-Support", included: false },
      ],
      ctaText: "Jetzt prüfen lassen",
      recommended: false,
      onCtaClick: () => router.push("/contact"),
    },
    {
      title: "Wartungspaket",
      description: "Optimal für regelmäßige Wartung",
      price: "3,90€",
      priceUnit: "pro Gerät/Monat",
      priceDescription: "Monatlich kündbar",
      features: [
        { text: "Vollständige Sicherheitsprüfung", included: true },
        { text: "Detaillierter Prüfbericht", included: true },
        { text: "Prüfplakette und Dokumentation", included: true },
        { text: "Keine versteckten Kosten", included: true },
        { text: "Regelmäßige Wartungserinnerungen", included: true },
        { text: "Prioritäts-Support", included: true },
      ],
      ctaText: "Wartungspaket wählen",
      recommended: true,
      onCtaClick: () => router.push("/contact"),
    },
  ];

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Preise</span>
            <div className="h-[2px] w-8 bg-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Wählen Sie Ihr Prüfpaket
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible Preismodelle für Ihre individuellen Anforderungen
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
