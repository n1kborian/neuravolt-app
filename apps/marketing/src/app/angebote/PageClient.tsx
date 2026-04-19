"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { PriceCalculator } from "@/components/forms/PriceCalculator";
import { Check, Zap, Shield, FileText, TrendingDown } from "lucide-react";
import { PRICING, formatEuro } from "@/lib/pricing";

const features = [
  { icon: Shield, title: "Rechtssicher nach DGUV V3", desc: "Zertifizierte Elektrofachkräfte, konform zu VDE 0701/0702." },
  { icon: FileText, title: "Digitale Protokolle", desc: "Revisionssicher, sofort abrufbar, BG-konform." },
  { icon: Zap, title: "Fristen automatisch", desc: "Keine Frist mehr verpassen — wir erinnern rechtzeitig." },
  { icon: TrendingDown, title: "Bis zu 20 % Kostenersparnis", desc: "Durch KI-gestützte Auftragsbündelung in der Region." },
];

const priceBreakdown = [
  {
    label: "Pro Gerät",
    value: `ab ${formatEuro(PRICING.perDeviceTiers[0].pricePerDevice)}`,
    sub: "Mengenrabatt ab 50 / 100 / 250 Geräten",
  },
  {
    label: "Anfahrtspauschale",
    value: formatEuro(PRICING.travelFee),
    sub: "Einmalig pro Einsatz",
  },
  {
    label: "Einrichtungspreis",
    value: formatEuro(PRICING.setupFeeFirstInspection),
    sub: "Einmalig bei Erstprüfung — entfällt bei Folgeprüfungen",
  },
];

export default function PageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  const heroIn = useInView(heroRef, { once: true, amount: 0.15 });
  const calcIn = useInView(calcRef, { once: true, amount: 0.05 });
  const breakdownIn = useInView(breakdownRef, { once: true, amount: 0.2 });
  const trustIn = useInView(trustRef, { once: true, amount: 0.15 });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={heroIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Preise &amp; Angebot</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Transparente Preise.<br />In unter 1 Minute Ihr Angebot.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Nur ein Preismodell: pro Gerät, ohne Abo, ohne Vertragsbindung. Hinzu kommen eine einmalige Anfahrtspauschale und — nur bei der Erstprüfung — ein einmaliger Einrichtungspreis. Keine versteckten Kosten.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Beantworten Sie unten sechs kurze Fragen und erhalten Sie Ihr individuelles Angebot direkt per E-Mail.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Price breakdown cards ─────────────────────────────────────────── */}
        <section ref={breakdownRef} className="w-full pb-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4">
              {priceBreakdown.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={breakdownIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6"
                >
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">{item.label}</p>
                  <p className="text-3xl font-bold text-foreground mb-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed text-justify hyphens-auto">{item.sub}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Alle Preise netto zzgl. gesetzl. MwSt. Mindestauftragswert {formatEuro(PRICING.minOrderValue)}.
            </p>
          </div>
        </section>

        {/* ── Calculator ────────────────────────────────────────────────────── */}
        <section ref={calcRef} className="w-full pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={calcIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <PriceCalculator />
            </motion.div>
          </div>
        </section>

        {/* ── Trust features ────────────────────────────────────────────────── */}
        <section ref={trustRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={trustIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Was drin ist</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Jedes Angebot beinhaltet
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={trustIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background shadow-sm mb-3">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <p className="font-bold text-foreground text-sm mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed text-justify hyphens-auto">{desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
              <h3 className="font-bold text-foreground text-lg mb-4">Enthaltene Leistungen</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  "Vollständige DGUV V3 Prüfung jedes Betriebsmittels",
                  "Sicht- und Messprüfung nach VDE 0701-0702",
                  "Digitales Prüfprotokoll mit Seriennummer pro Gerät",
                  "Prüfplakette mit nächstem Prüfdatum",
                  "Empfehlung zur Aussonderung bei Mängeln",
                  "Automatisches Fristenmanagement (optional, kostenlos)",
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground mt-0.5">
                      <Check className="h-3 w-3 text-background" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
