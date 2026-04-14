"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { ArrowRight, Scale, AlertTriangle, Calendar, UserCheck, FileCheck } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    icon: UserCheck,
    value: "item-1",
    q: "Wer ist prüfpflichtig?",
    a: "Alle Unternehmen, die elektrische Betriebsmittel einsetzen. Das betrifft nahezu jeden Arbeitgeber in Deutschland — vom Einzelbüro bis zum Produktionsbetrieb. Ausnahmen gibt es kaum: Sobald Sie elektrische Geräte im betrieblichen Umfeld nutzen, greift die Prüfpflicht.",
  },
  {
    icon: Calendar,
    value: "item-2",
    q: "Wie oft muss geprüft werden?",
    a: "Die Intervalle hängen von der Geräteart und dem Einsatzbereich ab. Ortsveränderliche Betriebsmittel in Büros: alle 2 Jahre. In handwerklichen Betrieben und Werkstätten: jährlich. Verlängerungskabel und Steckdosenleisten: alle 6–12 Monate. NeuraVolt übernimmt das Fristenmanagement vollständig.",
  },
  {
    icon: AlertTriangle,
    value: "item-3",
    q: "Was passiert bei Verstößen?",
    a: "Bei Nichtprüfung drohen Bußgelder durch die Berufsgenossenschaft. Im Schadensfall — z.B. einem Brandschaden durch ein defektes Gerät — kann der Versicherungsschutz vollständig entfallen und persönliche Haftung entstehen. Geschäftsführer haften im schlimmsten Fall mit ihrem Privatvermögen.",
  },
  {
    icon: UserCheck,
    value: "item-4",
    q: "Wer darf prüfen?",
    a: "Nur eine ausgebildete Elektrofachkraft (EFK) darf DGUV V3 Prüfungen rechtsgültig durchführen. NeuraVolt setzt ausschließlich zertifizierte Partnerfachkräfte aus unserem Netzwerk ein — alle Prüfungen sind rechtssicher und gerichtsfest dokumentiert.",
  },
  {
    icon: FileCheck,
    value: "item-5",
    q: "Was muss dokumentiert werden?",
    a: "Alle Prüfungen müssen schriftlich oder digital dokumentiert werden: geprüfte Geräte, Prüfergebnis, Prüfdatum, nächster Prüftermin und Unterschrift der Elektrofachkraft. NeuraVolt stellt digitale Protokolle sofort nach der Prüfung per E-Mail bereit.",
  },
];

const legalBasis = [
  { title: "DGUV Vorschrift 3", desc: "Berufsgenossenschaftliche Vorschrift für elektrische Sicherheit am Arbeitsplatz." },
  { title: "BetrSichV",         desc: "Betriebssicherheitsverordnung als gesetzliche Grundlage der Prüfpflicht." },
  { title: "ArbSchG",           desc: "Arbeitsschutzgesetz verpflichtet Arbeitgeber zur Gefährdungsbeurteilung." },
  { title: "BGV A3",            desc: "Vorgängerregelung, heute vollständig durch DGUV V3 abgelöst." },
];

export default function PageClient() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);
  const faqRef   = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);

  const heroIn  = useInView(heroRef,  { once: true, amount: 0.15 });
  const legalIn = useInView(legalRef, { once: true, amount: 0.15 });
  const faqIn   = useInView(faqRef,   { once: true, amount: 0.1  });
  const ctaIn   = useInView(ctaRef,   { once: true, amount: 0.3  });

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Ratgeber</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                DGUV Vorschrift 3: Alles was Sie wissen müssen
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ein kompakter Überblick über Ihre gesetzlichen Pflichten, Prüfintervalle, Haftungsrisiken — und wie Sie rechtssicher compliant bleiben.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Rechtliche Grundlagen ─────────────────────────────────────────── */}
        <section ref={legalRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={legalIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-foreground" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Rechtliche Grundlage</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                  Was steckt hinter der Prüfpflicht?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Die <strong className="text-foreground">DGUV Vorschrift 3</strong> basiert auf mehreren Rechtsgrundlagen: der Betriebssicherheitsverordnung (BetrSichV), dem Arbeitsschutzgesetz und den berufsgenossenschaftlichen Regelwerken.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Arbeitgeber sind verpflichtet, regelmäßige Prüfungen durch qualifizierte Elektrofachkräfte durchzuführen und die Ergebnisse rechtssicher zu dokumentieren.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={legalIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="grid grid-cols-2 gap-3"
              >
                {legalBasis.map(({ title, desc }, i) => (
                  <motion.div key={title}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={legalIn ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    className="group rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-5 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                        <Scale className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FAQ Accordion ─────────────────────────────────────────────────── */}
        <section ref={faqRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Häufige Fragen zur DGUV V3
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Die wichtigsten Antworten zur Prüfpflicht, Prüfintervallen und Haftung.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl"
            >
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map(({ icon: Icon, value, q, a }) => (
                  <AccordionItem key={value} value={value}
                    className="group border border-border rounded-2xl overflow-hidden bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 data-[state=open]:border-brand data-[state=open]:shadow-xl">
                    <AccordionTrigger className="flex items-center justify-between w-full px-6 py-5 bg-transparent text-left data-[state=open]:bg-foreground/[0.03] transition-colors hover:no-underline">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-all duration-300 group-data-[state=open]:border-brand group-data-[state=open]:bg-brand group-data-[state=open]:text-brand-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold text-foreground">{q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="relative px-6 text-sm text-muted-foreground border-t border-border leading-relaxed before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-brand before:opacity-0 group-data-[state=open]:before:opacity-100 transition-all duration-300">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Bereit für DGUV-konforme Prüfungen?</h3>
                <p className="text-background/70 text-sm">NeuraVolt übernimmt alles — kostenlose Anfrage in 2 Minuten.</p>
              </div>
              <Link href="/contact"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm">
                Jetzt anfragen
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
