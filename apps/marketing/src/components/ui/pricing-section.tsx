"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Calculator } from "lucide-react";
import { PRICING } from "@/lib/pricing";

const features = [
  "Vollständige DGUV V3 Prüfung durch zertifizierte Elektrofachkräfte",
  "Digitales Prüfprotokoll, revisionssicher",
  "Prüfplaketten an jedem Gerät",
  "Automatisches Fristenmanagement",
  "Keine versteckten Kosten, transparentes Festpreisangebot",
];

export const PricingSection: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Preise</span>
            <div className="h-[2px] w-8 bg-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transparent. Ohne Abo. Pro Gerät.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ein einfaches Preismodell — ohne Vertragsbindung. Preis pro Gerät, einmalige Anfahrtspauschale und bei der Erstprüfung ein einmaliger Einrichtungspreis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Pro Gerät</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm text-muted-foreground">ab</span>
              <span className="text-4xl font-bold text-foreground">{PRICING.perDeviceTiers[0].pricePerDevice.toFixed(2).replace(".", ",")}&nbsp;€</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mengenrabatt ab 50 / 100 / 250 Geräten. Netto, zzgl. MwSt.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Anfahrtspauschale</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-foreground">{PRICING.travelFee}&nbsp;€</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Einmalig pro Einsatz, Stuttgart & Region.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Einrichtungspreis</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-foreground">{PRICING.setupFeeFirstInspection}&nbsp;€</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nur bei der Erstprüfung — entfällt bei jeder Folgeprüfung.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8 max-w-3xl mx-auto">
          <ul className="space-y-3 mb-6">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-foreground">
                  <Check className="w-3 h-3 text-background" />
                </div>
                <span className="text-sm text-foreground">{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => router.push("/angebote")}
            className="group w-full inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90"
          >
            <Calculator className="h-4 w-4" />
            Individuelles Angebot berechnen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Preisrechner: unter 1 Minute — Angebot direkt per E-Mail. Mindestauftragswert {PRICING.minOrderValue}&nbsp;€ netto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
