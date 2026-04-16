"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { Clock, TrendingDown, Shield, HeadphonesIcon, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Clock,           title: "Zeit sparen",               desc: "Kein Koordinationsaufwand, keine Fristenverfolgung, keine Protokollpflege. Wir übernehmen alles." },
  { icon: TrendingDown,    title: "Kosten reduzieren",         desc: "Bis zu 20 % unter Marktpreis — durch KI-gestützte Auftragsbündelung und unser Netzwerk zertifizierter Partner. Ab 4,90 € pro Gerät." },
  { icon: Shield,          title: "Haftungsrisiko eliminieren", desc: "100% compliant, rechtssicher dokumentiert, versicherungskonform. Sie sind auf der sicheren Seite." },
  { icon: BarChart3,       title: "Volle Transparenz",         desc: "Digitales Dashboard mit allen Prüfdaten, Fristen und Protokollen — jederzeit abrufbar." },
  { icon: HeadphonesIcon,  title: "Fester Ansprechpartner",    desc: "Im Wartungspaket erhalten Sie einen persönlichen Ansprechpartner bei NeuraVolt." },
  { icon: CheckCircle2,    title: "Skalierbar",                desc: "Von 10 bis 10.000 Geräten — NeuraVolt wächst mit Ihrem Unternehmen." },
];

const processSteps = [
  { step: "01", title: "Anfrage stellen",     desc: "Kostenlos, unverbindlich, in 2 Minuten." },
  { step: "02", title: "Angebot erhalten",    desc: "Innerhalb von 24 Stunden mit konkretem Preis." },
  { step: "03", title: "Termin koordinieren", desc: "Wir passen uns Ihrem Betriebsablauf an." },
  { step: "04", title: "Prüfung & Protokoll", desc: "Fertig. Digital dokumentiert, rechtssicher archiviert." },
];

export default function PageClient() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const benefitRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const quoteRef   = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  const heroIn    = useInView(heroRef,    { once: true, amount: 0.15 });
  const benefitIn = useInView(benefitRef, { once: true, amount: 0.1  });
  const processIn = useInView(processRef, { once: true, amount: 0.15 });
  const quoteIn   = useInView(quoteRef,   { once: true, amount: 0.3  });
  const ctaIn     = useInView(ctaRef,     { once: true, amount: 0.3  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-foreground" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Für Entscheider</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  DGUV-Compliance ohne eigenen Aufwand.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  Für Geschäftsführer und Betriebsleiter, die sich auf ihr Kerngeschäft konzentrieren wollen — NeuraVolt übernimmt den kompletten DGUV V3 Prozess.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm">
                    Kostenlose Beratung
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/angebote"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
                    Preise ansehen
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="space-y-3"
              >
                {processSteps.map(({ step, title, desc }, i) => (
                  <motion.div key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={heroIn ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-4 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                    <span className="text-2xl font-bold text-foreground/20 font-mono shrink-0 w-10 text-center transition-colors duration-300 group-hover:text-brand">{step}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Benefits ──────────────────────────────────────────────────────── */}
        <section ref={benefitRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={benefitIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Vorteile</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Warum Unternehmen NeuraVolt wählen
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Betriebe in Stuttgart und der Region setzen auf NeuraVolt, um DGUV V3 Compliance vollständig auszulagern.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={benefitIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quote ─────────────────────────────────────────────────────────── */}
        <section ref={quoteRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={quoteIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-10 md:p-16 text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-3 justify-center mb-6">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Das NeuraVolt-Versprechen</span>
                <div className="h-[2px] w-8 bg-foreground" />
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed mb-6">
                &ldquo;Kein Koordinationsaufwand, keine Papierprotokolle, keine Fristenverfolgung. NeuraVolt bündelt Aufträge über unser Partnernetzwerk - digital und automatisiert - und gibt den Effizienzvorteil direkt an Sie weiter — automatisch, ab dem ersten Prüfauftrag.&rdquo;
              </p>
              <p className="text-muted-foreground text-sm">Das NeuraVolt-Versprechen an jeden Kunden</p>
            </motion.div>
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
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Bereit für DGUV-Compliance ohne Aufwand?</h3>
                <p className="text-background/70 text-sm">Kostenlose Beratung — Antwort innerhalb von 24 Stunden.</p>
              </div>
              <Link href="/contact"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm">
                Beratung anfragen
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
