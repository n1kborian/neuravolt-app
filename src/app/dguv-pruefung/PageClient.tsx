"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { CheckCircle2, Shield, FileText, Clock, Calendar, Zap, ArrowRight, AlertTriangle, TrendingDown } from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "4,90 €",  label: "ab / Gerät" },
  { value: "24h",     label: "Antwortzeit" },
  { value: "100 %",   label: "DGUV-konform" },
  { value: "−20 %",   label: "günstiger" },
];

const leistungen = [
  { icon: Calendar,     title: "Terminplanung",            desc: "Wir koordinieren den Prüftermin passend zu Ihrem Betriebsablauf — ohne Betriebsunterbrechung." },
  { icon: Shield,       title: "Prüfung durch Fachkräfte", desc: "Zertifizierte Partnerfachkräfte aus unserem Netzwerk prüfen Ihre Betriebsmittel gemäß DGUV Vorschrift 3." },
  { icon: FileText,     title: "Digitale Dokumentation",   desc: "Prüfprotokoll sofort digital verfügbar, Prüfplaketten angebracht, rechtssicher archiviert." },
  { icon: Clock,        title: "Fristenmanagement",        desc: "Automatische Erinnerungen vor dem nächsten Prüftermin — nie wieder abgelaufene Fristen." },
  { icon: Zap,          title: "KI-Auftragsbündelung",     desc: "Unsere KI bündelt Aufträge regional im Partnernetzwerk — so arbeiten Partner effizienter und Sie zahlen bis zu 20 % weniger als bei klassischen Anbietern." },
  { icon: CheckCircle2, title: "Rundum-Schutz",            desc: "Vollständige Compliance ohne eigenen Aufwand — wir übernehmen alles." },
];

const risks = [
  { icon: AlertTriangle, title: "Bußgelder",           desc: "Fehlende Prüfungen werden von Berufsgenossenschaften mit Bußgeldern geahndet." },
  { icon: TrendingDown,  title: "Versicherungsverlust", desc: "Im Schadensfall kann der Versicherungsschutz vollständig entfallen." },
  { icon: Shield,        title: "Persönliche Haftung",  desc: "Geschäftsführer und Betreiber haften bei fahrlässiger Nichtprüfung persönlich." },
];

export default function PageClient() {
  const heroRef     = useRef<HTMLDivElement>(null);
  const infoRef     = useRef<HTMLDivElement>(null);
  const leistungRef = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const heroIn     = useInView(heroRef,     { once: true, amount: 0.15 });
  const infoIn     = useInView(infoRef,     { once: true, amount: 0.2  });
  const leistungIn = useInView(leistungRef, { once: true, amount: 0.1  });
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
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">DGUV V3 Prüfung</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  Rechtssichere DGUV-Prüfung — komplett als Service.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  NeuraVolt ist die digitale Plattform für rechtssichere DGUV V3 Prüfungen: zertifizierte Partnerfachkräfte, KI-optimierte Terminplanung, digitale Dokumentation und automatisches Fristenmanagement — bis zu 20 % günstiger.
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
                className="grid grid-cols-2 gap-3"
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
                  Die <strong className="text-foreground">DGUV Vorschrift 3</strong> (früher BGV A3) schreibt vor, dass elektrische Anlagen und Betriebsmittel in Unternehmen regelmäßig von einer Elektrofachkraft geprüft werden müssen.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Betroffen sind <strong className="text-foreground">alle Unternehmen</strong> mit elektrischen Betriebsmitteln — von der Arztpraxis über das Büro bis zur Werkstatt.
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
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Leistungen ────────────────────────────────────────────────────── */}
        <section ref={leistungRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={leistungIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Leistungen</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Was NeuraVolt übernimmt
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Unser Rundum-Service deckt den gesamten DGUV V3 Prozess ab — von der ersten Anfrage bis zur nächsten Fälligkeitserinnerung.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leistungen.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={leistungIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
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
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Bereit für rechtssichere Prüfungen?</h3>
                <p className="text-background/70 text-sm">Kostenlose Anfrage — Antwort innerhalb von 24 Stunden.</p>
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
