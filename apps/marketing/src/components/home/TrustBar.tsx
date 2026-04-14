"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const stats = [
  { num: "4,90 €", label: "Pro Gerät", sub: "zzgl. MwSt. · kein Vertrag nötig" },
  { num: "24h",    label: "Rückmeldung", sub: "Angebot innerhalb eines Werktages" },
  { num: "100%",   label: "Rechtssicher", sub: "Zertifizierte Elektrofachkräfte" },
  { num: "0",      label: "Papierkram", sub: "Vollständig digitale Dokumentation" },
];

export function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="w-full py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ num, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="group flex flex-col gap-1 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-foreground hover:shadow-xl"
            >
              <p className="text-4xl md:text-5xl font-bold text-foreground leading-none tracking-tight">
                {num}
              </p>
              <p className="text-sm font-semibold text-foreground mt-3">{label}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
