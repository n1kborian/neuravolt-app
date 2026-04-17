"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Inbox,
  BarChart3,
  HeadphonesIcon,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const vorteile = [
  { icon: Inbox,         title: "Aufträge direkt ins Postfach",  desc: "Sie erhalten passende DGUV V3 Prüfaufträge aus Ihrer Region — kuratiert und vollständig vorbereitet. Kein Akquise-Aufwand, kein Kaltakquirieren." },
  { icon: CalendarCheck, title: "Flexible Auftragsplanung",      desc: "Sie entscheiden selbst, welche Aufträge Sie annehmen. Lange Vorlaufzeiten geben Ihnen die Möglichkeit, Ihr Auftragsbuch entspannt und optimal zu planen." },
  { icon: ShieldCheck,   title: "Null Management-Overhead",      desc: "Terminkoordination, Kundenkommunikation, Rechnungsstellung, Protokoll-Versand — das alles übernimmt NeuraVolt vollautomatisch. Sie prüfen. Wir erledigen den Rest." },
  { icon: Zap,           title: "Vollautomatisiertes Backoffice", desc: "Unsere KI-gestützte Plattform verwaltet Fristen, Dokumentation und Kundendaten nahezu ohne manuellen Eingriff — maximale Effizienz für Sie und Ihre Kunden." },
  { icon: BarChart3,     title: "Transparente Auftragslage",     desc: "Ihr persönliches Partner-Dashboard zeigt Ihnen jederzeit offene Aufträge, Termine und Abrechnungen auf einen Blick. Kein Papierkram, alles digital." },
  { icon: HeadphonesIcon,title: "Persönlicher Ansprechpartner",  desc: "Bei Fragen steht Ihnen ein fester Ansprechpartner bei NeuraVolt zur Seite — einer, der Ihr Unternehmen kennt und immer erreichbar ist." },
];

const schritte = [
  { step: "01", title: "Bewerbung einreichen",      desc: "Kurzes Formular ausfüllen — wir melden uns innerhalb von 48 Stunden für ein persönliches Kennenlerngespräch." },
  { step: "02", title: "Onboarding & Freischaltung", desc: "Nach einem kurzen Onboarding erhalten Sie Zugang zu Ihrem Partner-Dashboard und werden in unser Partnernetzwerk aufgenommen." },
  { step: "03", title: "Aufträge auswählen",         desc: "Sie sehen verfügbare Aufträge in Ihrer Region und wählen flexibel aus, was zu Ihrem Kalender passt — mit ausreichend Vorlaufzeit." },
  { step: "04", title: "Prüfen & kassieren",         desc: "Sie führen die Prüfung durch, laden das Protokoll hoch — wir erledigen Abrechnung, Kundenkommunikation und Dokumentation vollautomatisch." },
];

const fakten = [
  { num: "100 %", label: "Backoffice durch NeuraVolt", sub: "Terminplanung, Abrechnung, Dokumentation" },
  { num: "48 h",  label: "Vorlaufzeit garantiert",     sub: "Genug Zeit zur Auftragsplanung" },
  { num: "0",     label: "Akquise-Aufwand",            sub: "Aufträge kommen zu Ihnen" },
  { num: "1",     label: "Fester Ansprechpartner",     sub: "Der Ihr Unternehmen kennt" },
];

const fuerWen = [
  "Selbstständige Elektrofachkräfte (EFK)",
  "Kleine Elektrobetriebe & Handwerksunternehmen",
  "Elektrofirmen mit freien Kapazitäten",
  "Elektriker im Nebenerwerb",
];

export default function PageClient() {
  const heroRef     = useRef<HTMLDivElement>(null);
  const vorteileRef = useRef<HTMLDivElement>(null);
  const stepRef     = useRef<HTMLDivElement>(null);
  const fuerWenRef  = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const heroIn     = useInView(heroRef,     { once: true, amount: 0.15 });
  const vorteileIn = useInView(vorteileRef, { once: true, amount: 0.1  });
  const stepIn     = useInView(stepRef,     { once: true, amount: 0.15 });
  const fuerWenIn  = useInView(fuerWenRef,  { once: true, amount: 0.2  });
  const ctaIn      = useInView(ctaRef,      { once: true, amount: 0.3  });

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
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Partner werden</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  Mehr Aufträge. Kein Overhead. Volle Flexibilität.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  Elektrofirmen und Elektrofachkräfte kooperieren mit NeuraVolt und erhalten DGUV V3 Prüfaufträge — während wir das komplette Backoffice, die Verwaltung und die Kundenkommunikation übernehmen.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm">
                    Jetzt Partner werden
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="#so-funktioniert-es"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
                    Mehr erfahren
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {fakten.map(({ num, label, sub }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={heroIn ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                    className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-5 shadow-lg">
                    <p className="text-3xl font-bold text-foreground mb-1">{num}</p>
                    <p className="text-sm font-semibold text-foreground leading-tight mb-0.5">{label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{sub}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Vorteile ──────────────────────────────────────────────────────── */}
        <section ref={vorteileRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={vorteileIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Ihre Vorteile</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Sie prüfen. Wir übernehmen den Rest.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Als NeuraVolt-Partner konzentrieren Sie sich ausschließlich auf die Prüftätigkeit — alles drumherum läuft vollautomatisch.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vorteile.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={vorteileIn ? { opacity: 1, y: 0 } : {}}
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

        {/* ── So funktioniert es ────────────────────────────────────────────── */}
        <section id="so-funktioniert-es" ref={stepRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stepIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">So funktioniert es</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                In 4 Schritten zum Partner
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {schritte.map(({ step, title, desc }, i) => (
                <motion.div key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={stepIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex flex-col rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                  <span className="text-5xl font-bold text-foreground/10 group-hover:text-brand transition-colors duration-300 leading-none mb-4 font-mono">{step}</span>
                  <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Für wen ───────────────────────────────────────────────────────── */}
        <section ref={fuerWenRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={fuerWenIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-foreground" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Für wen</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Für wen ist die Partnerschaft?</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 text-justify hyphens-auto">
                    Unser Partnerprogramm richtet sich an alle, die DGUV V3 Prüfungen durchführen dürfen und ihr Auftragsvolumen flexibel erweitern möchten — ohne den Aufwand eines eigenen Vertriebs oder Backoffice.
                  </p>
                  <ul className="space-y-3">
                    {fuerWen.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-border bg-background/80 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-foreground mb-1">Voraussetzung</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Nachweis als zertifizierte Elektrofachkraft (EFK) oder zugelassener Elektrobetrieb gemäß DGUV Vorschrift 3.
                    </p>
                  </div>
                  <Link href="/contact"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90">
                    Bewerbung starten
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
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
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Bereit, Partner zu werden?</h3>
                <p className="text-background/70 text-sm">Kostenlose Bewerbung — Rückmeldung innerhalb von 48 Stunden.</p>
              </div>
              <Link href="/contact"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm">
                Bewerbung starten
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
