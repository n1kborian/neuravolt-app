"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Anfrage stellen",
    description:
      "Kostenlose Anfrage über das Kontaktformular — wir melden uns innerhalb von 24 Stunden.",
  },
  {
    number: "02",
    title: "Termin vereinbaren",
    description:
      "Unsere KI analysiert Ihr Prüfvolumen und bündelt Aufträge regional — so erhalten Sie einen passenden Termin und profitieren automatisch vom Cluster-Preisvorteil.",
  },
  {
    number: "03",
    title: "Prüfung durchführen",
    description:
      "Eine zertifizierte Partnerfachkraft aus unserem Netzwerk kommt zu Ihnen und prüft alle Betriebsmittel vor Ort.",
  },
  {
    number: "04",
    title: "Protokoll erhalten",
    description:
      "Digitales Prüfprotokoll sofort verfügbar. Prüfplaketten angebracht. Fristen automatisch vermerkt.",
  },
];

interface ProcessCardProps {
  step: ProcessStep;
  index: number;
  isInView: boolean;
}

function ProcessCard({ step, index, isInView }: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="relative"
    >
      <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-foreground hover:shadow-xl">
        {/* Number + Title inline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
          className="mb-4 flex items-baseline gap-3"
        >
          <span className="text-6xl font-bold text-foreground/10 transition-colors duration-300 group-hover:text-brand leading-none">
            {step.number}
          </span>
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {step.title}
          </h3>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.35 }}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {step.description}
        </motion.p>

      </div>
    </motion.div>
  );
}

export function WieFunktioniertEs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
              So funktioniert es
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Ihr Rundum-Service in 4 Schritten
          </h2>
          <p className="text-muted-foreground text-lg">
            Von der Anfrage bis zum Prüfprotokoll — als digitale Plattform mit zertifizierten Partnerfachkräften übernimmt NeuraVolt den gesamten Prozess für Sie.
          </p>
        </motion.div>

        {/* Cards grid with animated connector line */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <ProcessCard
              key={step.number}
              step={step}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
