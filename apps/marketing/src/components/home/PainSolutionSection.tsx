"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { AlertCircle, ArrowDown, CheckCircle2 } from "lucide-react";

const cases = [
  {
    target: "Gastro & Einzelhandel",
    pain: "Ich weiß, dass ich prüfen lassen muss — aber drei Angebote einzuholen, Preise zu vergleichen und auf Termine zu warten kostet Zeit, die ich im Tagesgeschäft nicht habe.",
    solution:
      "Festpreis online in zwei Minuten. Termin direkt gebucht. Keine Angebote vergleichen, keine Anrufschleifen — Sie erhalten direkt ein Angebot, buchen, fertig.",
  },
  {
    target: "Büro & Verwaltung",
    pain: "Eine Elektrofachkraft zu finden ist schwer, und der Pflichttermin fällt mir meistens erst auf, wenn die Frist schon knapp wird. Im Schadensfall bin ich persönlich haftbar.",
    solution:
      "Wir erinnern Sie automatisch, bevor Fristen ablaufen, und verknüpfen Sie mit einer geprüften Elektrofachkraft aus unserem Netzwerk — inklusive digitaler, rechtssicherer Dokumentation.",
  },
  {
    target: "Prüfpartner",
    pain: "Leerlaufzeiten zwischen Aufträgen, Angebote schreiben, Kunden hinterhertelefonieren — Akquise frisst Zeit, die eigentlich für die Prüfung gedacht ist.",
    solution:
      "Passende Aufträge aus Ihrer Region erscheinen direkt im Partner-Dashboard. Annehmen per Klick, Zahlung 7 Tage nach Prüfung, Dokumentation und Abrechnung laufen digital.",
  },
];

export function PainSolutionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
              Diese Probleme lösen wir
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Bekannte Herausforderungen, klare Antworten
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            DGUV V3 ist Pflicht — aber der Weg dahin ist für viele Betriebe mühsam. Hier sehen Sie drei typische Situationen und wie NeuraVolt sie auflöst.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cases.map((c, i) => (
            <motion.article
              key={c.target}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden"
            >
              {/* Zielgruppe */}
              <div className="px-6 md:px-7 pt-5 pb-0">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground border border-border rounded-full px-2.5 py-1">
                  {c.target}
                </span>
              </div>

              {/* Pain */}
              <div className="px-6 md:px-7 pt-5 pb-6">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">
                    Das Problem
                  </p>
                </div>
                <p className="text-[15px] md:text-base text-foreground/80 leading-relaxed">
                  „{c.pain}"
                </p>
              </div>

              {/* Divider mit Pfeil */}
              <div className="flex items-center gap-3 px-6 md:px-7">
                <div className="flex-1 h-px bg-border" />
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                  <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Lösung */}
              <div className="px-6 md:px-7 pt-6 pb-7 flex-1">
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">
                    So löst NeuraVolt es
                  </p>
                </div>
                <p className="text-[15px] md:text-base text-foreground leading-relaxed">
                  {c.solution}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
