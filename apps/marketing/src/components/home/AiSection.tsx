"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Brain, Bell, BarChart3, Lock } from "lucide-react";
import { AiAnimation } from "@/components/home/AiAnimation";

const features = [
  { icon: Brain,    title: "KI-Prozessautomatisierung", desc: "Intelligente Terminplanung und automatische Ressourcenallokation." },
  { icon: Bell,     title: "Automatische Fristen",       desc: "Rechtzeitige Erinnerungen — nie wieder manuelle Fristenverfolgung." },
  { icon: BarChart3,title: "Digitales Dashboard",        desc: "Alle Prüfdaten und Protokolle auf einen Blick." },
  { icon: Lock,     title: "DSGVO-konform",              desc: "Datenspeicherung auf deutschen Servern nach DSGVO." },
];

export function AiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-12">

        {/* Section header — same style as FuerWenSection / FAQSection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">KI-gestützt</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            DGUV V3 Prüfung, die sich selbst optimiert.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Unsere KI verwaltet Fristen, bündelt Aufträge und gibt Ihnen den Effizienzvorteil automatisch weiter — ohne manuellen Aufwand Ihrerseits.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="space-y-4">

          {/* Top row */}
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_5fr] gap-4">

            {/* Animation widget */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-full rounded-2xl border border-border overflow-hidden shadow-lg"
              style={{ aspectRatio: "16/9" }}
            >
              <AiAnimation />
            </motion.div>

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-8 flex flex-col justify-center"
            >
              <h3 className="text-xl font-bold text-foreground mb-5">
                Alle Aufträge. Eine Plattform. Ihr Vorteil.
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bei NeuraVolt profitieren Sie davon, dass wir sämtliche Aufträge auf unserer Plattform gemeinsam analysieren. Regionale Aufträge werden dabei nicht isoliert betrachtet — unsere KI erkennt, welche Betriebe in Ihrer Nähe denselben Prüfzeitraum haben, und bündelt diese zu einem gemeinsamen Einsatz.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Durch zeitliche und lokale Zusammenlegung nahegelegener Aufträge senken wir Anfahrts- und Planungskosten spürbar — und geben die Ersparnis direkt an Sie weiter. Kein Aufwand Ihrerseits: Unsere KI meldet sich proaktiv, wenn sich Ihr Prüftermin kostengünstiger gestalten lässt.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unser Ziel: den gesamten bürokratischen Aufwand rund um die DGUV V3 Prüfung vollständig eliminieren — von automatischer Terminplanung und Fristenverwaltung bis zur direkten Weitergabe jedes Preisvorteils.
              </p>
            </motion.div>
          </div>

          {/* Feature cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                className="group rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-foreground hover:shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{f.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
