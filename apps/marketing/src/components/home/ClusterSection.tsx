"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import { MapPin, CalendarDays, Route, Layers, TrendingDown, Zap } from "lucide-react";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ClusterMap = dynamic(
  () => import("@/components/ui/ClusterMap").then(m => m.ClusterMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-2xl border border-border bg-muted/20 animate-pulse"
        style={{ aspectRatio: "16/9" }}
      />
    ),
  },
);

const steps = [
  {
    icon: Zap,
    value: "step-1",
    title: "Auftragseingang",
    body: "Neue Prüfaufträge gehen digital ein — aus Stuttgart, Ludwigsburg, Esslingen und der gesamten Metropolregion. Jeder Auftrag enthält Standort, Gerätezahl und den gewünschten Prüfzeitraum.",
  },
  {
    icon: CalendarDays,
    value: "step-2",
    title: "Zeitliche Überschneidung erkennen",
    body: "Das System analysiert automatisch, welche Aufträge in dieselbe Kalenderwoche fallen. Liegen mehrere Aufträge im selben Zeitfenster, wird eine Überschneidung markiert und als Cluster-Kandidat eingestuft.",
  },
  {
    icon: MapPin,
    value: "step-3",
    title: "Lokale Nähe prüfen",
    body: "Aufträge im selben Stadtgebiet werden geografisch zusammengefasst. Der Algorithmus berechnet, welche Standorte so nah beieinander liegen, dass eine gemeinsame Anfahrt wirtschaftlich sinnvoll ist.",
  },
  {
    icon: Layers,
    value: "step-4",
    title: "Cluster bilden",
    body: "Räumlich und zeitlich passende Aufträge werden zu einem Cluster zusammengelegt. Pro Stadt entsteht so ein gebündelter Einsatz — ein Techniker, ein Termin, mehrere Kunden.",
  },
  {
    icon: Route,
    value: "step-5",
    title: "Routen-Optimierung",
    body: "Innerhalb des Clusters wird die effizienteste Reihenfolge der Standorte berechnet. Weniger Fahrtstrecke bedeutet weniger Zeit, weniger Kraftstoff und weniger Planungsaufwand.",
  },
  {
    icon: TrendingDown,
    value: "step-6",
    title: "Ersparnis weitergeben",
    body: "Die eingesparten Anfahrts- und Planungskosten geben wir direkt an Sie weiter. Durch Clusterung sind Kostenersparnisse von bis zu 20 % möglich — ohne Abstriche bei Qualität oder Rechtssicherheit.",
  },
];

export function ClusterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Wie wir sparen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Auftrags-Clusterung reduziert Ihre Kosten
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Durch zeitliche und lokale Zusammenlegung nahegelegener Aufträge senken wir Anfahrts- und Planungskosten — und geben die Ersparnis direkt an Sie weiter.
          </p>
        </motion.div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_8fr] gap-10 items-start">

          {/* Left — step accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {steps.map(({ icon: Icon, value, title, body }) => (
                <AccordionItem
                  key={value}
                  value={value}
                  className="group border border-border rounded-2xl overflow-hidden bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 data-[state=open]:border-brand data-[state=open]:shadow-xl"
                >
                  <AccordionTrigger className="flex items-center justify-between w-full px-6 py-5 bg-transparent text-left data-[state=open]:bg-foreground/[0.03] transition-colors hover:no-underline">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-all duration-300 group-data-[state=open]:border-brand group-data-[state=open]:bg-brand group-data-[state=open]:text-brand-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-base font-semibold text-foreground">{title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="relative px-6 text-sm text-muted-foreground border-t border-border leading-relaxed before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-brand before:opacity-0 group-data-[state=open]:before:opacity-100 transition-all duration-300">
                    {body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Right — animation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-28"
          >
            <FullscreenToggle>
              <ClusterMap />
            </FullscreenToggle>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
