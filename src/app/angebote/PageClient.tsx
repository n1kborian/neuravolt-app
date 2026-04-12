"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    title: "Einzelprüfung",
    description: "Perfekt für einmalige Prüfungen ohne Vertragsbindung.",
    price: "4,90 €",
    priceUnit: "pro Gerät",
    priceNote: "Einmalig, kein Vertrag",
    features: [
      { text: "Vollständige Sicherheitsprüfung", included: true },
      { text: "Detaillierter Prüfbericht", included: true },
      { text: "Prüfplakette und Dokumentation", included: true },
      { text: "Keine versteckten Kosten", included: true },
      { text: "Regelmäßige Wartungserinnerungen", included: false },
      { text: "Prioritäts-Support", included: false },
    ],
    cta: "Jetzt prüfen lassen",
    recommended: false,
  },
  {
    title: "Wartungspaket",
    description: "Optimal für regelmäßige Wartung mit vollem Service.",
    price: "3,90 €",
    priceUnit: "pro Gerät/Monat",
    priceNote: "Monatlich kündbar",
    features: [
      { text: "Vollständige Sicherheitsprüfung", included: true },
      { text: "Detaillierter Prüfbericht", included: true },
      { text: "Prüfplakette und Dokumentation", included: true },
      { text: "Keine versteckten Kosten", included: true },
      { text: "Regelmäßige Wartungserinnerungen", included: true },
      { text: "Prioritäts-Support", included: true },
    ],
    cta: "Wartungspaket wählen",
    recommended: true,
  },
];

export default function PageClient() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);

  const heroIn  = useInView(heroRef,  { once: true, amount: 0.15 });
  const plansIn = useInView(plansRef, { once: true, amount: 0.1  });
  const ctaIn   = useInView(ctaRef,   { once: true, amount: 0.3  });

  const router = useRouter();

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Preise</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Transparente Preise für DGUV-Compliance.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Als digitale Plattform mit zertifizierten Partnerfachkräften können wir Preise bis zu 20 % unter dem Marktüblichen anbieten. Einmalprüfung ab 4,90 € pro Gerät — ohne versteckte Kosten, ohne Vertragsfallen.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Pricing cards ─────────────────────────────────────────────────── */}
        <section ref={plansRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {plans.map(({ title, description, price, priceUnit, priceNote, features, cta, recommended }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={plansIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-2xl border bg-background/80 backdrop-blur-sm shadow-lg p-8 transition-all duration-300 hover:shadow-xl ${
                    recommended ? "border-brand shadow-xl" : "border-border hover:border-foreground"
                  }`}
                >
                  {recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full border border-brand bg-brand px-4 py-1 text-xs font-semibold text-brand-foreground">
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
                    <p className="text-sm text-muted-foreground mt-1">{priceNote}</p>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {features.map(({ text, included }, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${included ? "bg-brand" : "bg-muted"}`}>
                          <Check className={`w-3 h-3 ${included ? "text-brand-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <span className={`text-sm ${included ? "text-foreground" : "text-muted-foreground"}`}>{text}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => router.push("/contact")}
                    className={`group/btn w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                      recommended
                        ? "border border-foreground bg-foreground text-background hover:bg-foreground/90"
                        : "border border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA ────────────────────────────────────────────────────── */}
        <section ref={ctaRef} className="w-full pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-foreground bg-foreground p-8 md:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-background/60 mb-2">Jetzt starten</p>
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Fragen zu unseren Preisen?</h3>
                <p className="text-background/70 text-sm">Kostenlose Beratung — individuelles Angebot in 24 Stunden.</p>
              </div>
              <button
                onClick={() => router.push("/contact")}
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm"
              >
                Angebot anfragen
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
