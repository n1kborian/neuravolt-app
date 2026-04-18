"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import {
  CheckCircle2, Shield, Clock, Zap, ArrowRight,
  AlertTriangle, TrendingDown, HeadphonesIcon, BarChart3,
  Laptop, Cable, Wrench, Gauge,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "4,90 €",  label: "ab / Gerät" },
  { value: "24h",     label: "Antwortzeit" },
  { value: "100 %",   label: "DGUV-konform" },
  { value: "−20 %",   label: "Kostenersparnis" },
];

const risks = [
  { icon: AlertTriangle, title: "Bußgelder",           desc: "Fehlende Prüfungen werden von Berufsgenossenschaften mit Bußgeldern geahndet." },
  { icon: TrendingDown,  title: "Versicherungsverlust", desc: "Im Schadensfall kann der Versicherungsschutz vollständig entfallen." },
  { icon: Shield,        title: "Persönliche Haftung",  desc: "Geschäftsführer und Betreiber haften bei fahrlässiger Nichtprüfung persönlich." },
];

const geraete = [
  {
    icon: Laptop,
    title: "Ortsveränderliche Betriebsmittel",
    desc: "PCs, Monitore, Drucker, Kaffeemaschinen, Wasserkocher, Ladegeräte, Küchengeräte — alles, was per Stecker am Netz hängt.",
  },
  {
    icon: Cable,
    title: "Verlängerungen & Steckdosenleisten",
    desc: "Verlängerungskabel, Steckdosenleisten, Kabeltrommeln und Adapter mit häufig verkürztem Prüfintervall von 6–12 Monaten.",
  },
  {
    icon: Wrench,
    title: "Handwerkzeug & Maschinen",
    desc: "Bohrmaschinen, Winkelschleifer, Sägen, Werkstattmaschinen sowie ortsfeste Maschinen nach DIN VDE 0113.",
  },
  {
    icon: Gauge,
    title: "Ortsfeste Anlagen",
    desc: "Fest angeschlossene Geräte, Unterverteilungen, Schaltschränke, FI-/RCD-Schutzschalter und Endstromkreise nach DIN VDE 0105-100.",
  },
];

const messungen = [
  "Sichtprüfung auf äußere Mängel & Kennzeichnung",
  "Schutzleiterwiderstand (RPE)",
  "Isolationswiderstand (RISO)",
  "Schutzleiter- & Ersatzableitstrom",
  "Berührungsstrom an berührbaren Teilen",
  "Funktions- & Auslöseprüfung (RCD/FI)",
];

const process = [
  { step: "01", title: "Anfrage in 2 Minuten",        desc: "Gerätezahl und Standort — kostenlos & unverbindlich online übermitteln." },
  { step: "02", title: "Festpreis-Angebot in 24 h",   desc: "KI-gestützt aus unserem Partnernetzwerk — mit transparentem Stückpreis." },
  { step: "03", title: "Termin automatisch geplant",  desc: "Wir koordinieren Zugang, Zeitfenster und Ansprechpartner ohne Betriebsunterbrechung." },
  { step: "04", title: "Digitales Protokoll",         desc: "Protokoll, Plaketten und Fristen sofort in Ihrem Dashboard — rechtssicher archiviert." },
];

const benefits = [
  { icon: Zap,             title: "Digital & automatisiert",   desc: "Online-Formulare statt Anrufen, KI-Auftragsvergabe statt Koordination, digitale Protokolle statt Papierberge." },
  { icon: TrendingDown,    title: "Bis zu 20 % günstiger",     desc: "Durch KI-gestützte Auftragsbündelung im Partnernetzwerk — ab 4,90 € pro Gerät." },
  { icon: Shield,          title: "Rechtssicher & haftungsfrei", desc: "100 % DGUV V3 konform, versicherungskonform dokumentiert — Geschäftsführer-Haftung eliminiert." },
  { icon: BarChart3,       title: "Volles Dashboard",          desc: "Alle Prüfdaten, Fristen und Protokolle jederzeit online abrufbar — auch für Audits & Versicherer." },
  { icon: Clock,           title: "Keine Fristen mehr im Kopf", desc: "Automatische Erinnerungen und Neuplanung — NeuraVolt meldet sich, bevor Ihre Fristen ablaufen." },
  { icon: HeadphonesIcon,  title: "Fester Ansprechpartner",    desc: "Im Wartungspaket ein persönlicher Betreuer, der Anliegen direkt abwickelt." },
];

export default function PageClient() {
  const heroRef     = useRef<HTMLDivElement>(null);
  const infoRef     = useRef<HTMLDivElement>(null);
  const scopeRef    = useRef<HTMLDivElement>(null);
  const processRef  = useRef<HTMLDivElement>(null);
  const benefitRef  = useRef<HTMLDivElement>(null);
  const quoteRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const heroIn    = useInView(heroRef,    { once: true, amount: 0.15 });
  const infoIn    = useInView(infoRef,    { once: true, amount: 0.2  });
  const scopeIn   = useInView(scopeRef,   { once: true, amount: 0.1  });
  const processIn = useInView(processRef, { once: true, amount: 0.15 });
  const benefitIn = useInView(benefitRef, { once: true, amount: 0.1  });
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
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">DGUV V3 Prüfung für Unternehmen</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  Ihre DGUV V3 Prüfung — digitalisiert & automatisiert.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  NeuraVolt übernimmt die gesetzlich vorgeschriebene Betriebsmittelprüfung nach DGUV Vorschrift 3 für Ihr Unternehmen. Zertifizierte Partnerfachkräfte führen vor Ort durch, unsere Plattform erledigt alles drumherum: Terminplanung, Dokumentation, Fristen — einfach, schnell, rechtssicher.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm">
                    Kostenlose Anfrage
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/dguv-check"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
                    DGUV-Check starten
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {stats.map(({ value, label }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={heroIn ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                    className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg">
                    <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Was ist DGUV V3 ───────────────────────────────────────────────── */}
        <section ref={infoRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={infoIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-foreground" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Rechtliche Grundlage</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                  Was ist die DGUV Vorschrift 3?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Die <strong className="text-foreground">DGUV Vorschrift 3</strong> (früher BGV A3) verpflichtet jedes Unternehmen, elektrische Anlagen und Betriebsmittel regelmäßig von einer Elektrofachkraft prüfen zu lassen.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Betroffen sind <strong className="text-foreground">alle Betriebe</strong> mit elektrischen Geräten — vom Einzelbüro über die Arztpraxis bis zur Produktionshalle.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">Risiken bei Nichtprüfung</p>
                {risks.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div key={title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={infoIn ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-5 shadow-lg">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify hyphens-auto">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Was wir prüfen ─────────────────────────────────────────────────── */}
        <section ref={scopeRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={scopeIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Prüfumfang</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Was wir bei Ihnen prüfen
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Jede Prüfung erfolgt nach DIN VDE 0701-0702 bzw. DIN VDE 0105-100 durch eine zertifizierte Elektrofachkraft — lückenlos dokumentiert.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                {geraete.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={scopeIn ? { opacity: 1, y: 0 } : {}}
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={scopeIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg"
              >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Messungen pro Gerät</p>
                <ul className="space-y-3">
                  {messungen.map((m) => (
                    <li key={m} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground leading-relaxed mt-5 pt-5 border-t border-border">
                  Jede Messung wird digital erfasst, ausgewertet und im Protokoll gerichtsfest dokumentiert.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Ablauf ────────────────────────────────────────────────────────── */}
        <section ref={processRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10 max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Ablauf</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                In vier Schritten zur DGUV-Compliance
              </h2>
              <p className="text-muted-foreground text-lg">
                Kein Koordinationsaufwand, keine Papierprotokolle, keine Fristenverfolgung. Wir übernehmen alles — Sie machen weiter Ihr Kerngeschäft.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {process.map(({ step, title, desc }, i) => (
                <motion.div key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={processIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                  <span className="text-2xl font-bold text-foreground/20 font-mono transition-colors duration-300 group-hover:text-brand">{step}</span>
                  <p className="text-base font-bold text-foreground mt-3 mb-1.5">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Warum NeuraVolt</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Der Unterschied zu klassischen Prüfdiensten
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Statt Einzelprüfern mit Excel-Listen und Papiermappen: eine Plattform, die Prüfaufträge KI-gestützt an zertifizierte Partner im Netzwerk verteilt und den gesamten Prozess digital abbildet.
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
                &ldquo;Kein Koordinationsaufwand, keine Papierprotokolle, keine Fristenverfolgung. NeuraVolt bündelt Prüfaufträge digital im Partnernetzwerk und gibt den Effizienzvorteil direkt an Sie weiter — automatisch, ab dem ersten Auftrag.&rdquo;
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
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Bereit für die DGUV V3 Prüfung ohne Aufwand?</h3>
                <p className="text-background/70 text-sm">Kostenlose Anfrage — Festpreis-Angebot innerhalb von 24 Stunden.</p>
              </div>
              <Link href="/contact"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm">
                Anfrage stellen
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
