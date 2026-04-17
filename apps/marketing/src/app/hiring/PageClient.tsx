"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { CheckCircle2, ArrowRight, Zap, MapPin, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

const stellen = [
  {
    title: "Elektrofachkraft (m/w/d)",
    type: "Vollzeit / Teilzeit",
    location: "Stuttgart & Region",
    desc: "Sie prüfen elektrische Betriebsmittel vor Ort, erstellen digitale Protokolle und repräsentieren NeuraVolt bei unseren Kunden.",
    anforderungen: [
      "Ausbildung als Elektrofachkraft oder gleichwertige Qualifikation",
      "Führerschein Klasse B",
      "Sorgfältige und strukturierte Arbeitsweise",
      "Kundenorientiertes Auftreten",
    ],
  },
  {
    title: "Werkstudent Vertrieb (m/w/d)",
    type: "Werkstudent · 15–20h/Woche",
    location: "Stuttgart (remote möglich)",
    desc: "Sie unterstützen unser Vertriebsteam bei der Lead-Generierung und Kundenbetreuung im B2B-Umfeld.",
    anforderungen: [
      "Studium im wirtschaftlichen oder technischen Bereich",
      "Kommunikationsstärke und Eigeninitiative",
      "Interesse an B2B-Vertrieb und Startup-Umfeld",
      "Sehr gute Deutschkenntnisse",
    ],
  },
];

const benefits = [
  { icon: TrendingUp, label: "Wachstumschancen", desc: "Früher Einstieg in ein wachsendes Startup" },
  { icon: Clock,      label: "Flexible Zeiten",  desc: "Eigenverantwortliche Einteilung" },
  { icon: Zap,        label: "Digital first",    desc: "Keine Zettelwirtschaft — alles digital" },
  { icon: MapPin,     label: "Region Stuttgart", desc: "Kurze Wege, lokale Wirkung" },
];

export default function PageClient() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const benefitRef = useRef<HTMLDivElement>(null);
  const jobsRef    = useRef<HTMLDivElement>(null);
  const spontanRef = useRef<HTMLDivElement>(null);

  const heroIn    = useInView(heroRef,    { once: true, amount: 0.15 });
  const benefitIn = useInView(benefitRef, { once: true, amount: 0.15 });
  const jobsIn    = useInView(jobsRef,    { once: true, amount: 0.1  });
  const spontanIn = useInView(spontanRef, { once: true, amount: 0.3  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20">

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Karriere</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Werde Teil von NeuraVolt.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Wir bauen die führende digitale Plattform für DGUV V3 Prüfungen in Deutschland. Flexible Arbeitszeiten, KI-gestützte Prozesse, echte Wirkung vor Ort — komm an Bord.
              </p>
            </motion.div>
          </div>
        </section>

        <section ref={benefitRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={benefitIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-foreground text-sm">{label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground text-justify hyphens-auto">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={jobsRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={jobsIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Offene Stellen</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Aktuelle Positionen
              </h2>
            </motion.div>

            <div className="space-y-4">
              {stellen.map(({ title, type, location, desc, anforderungen }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={jobsIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8 transition-all duration-300 hover:border-brand hover:shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground font-medium">{type}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{location}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed text-justify hyphens-auto">{desc}</p>
                    </div>
                    <Link href="/contact"
                      className="group/btn shrink-0 inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90">
                      Bewerben
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Anforderungen</p>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {anforderungen.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={spontanRef} className="w-full pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={spontanIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-foreground bg-foreground p-8 md:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-background/60 mb-2">Initiativbewerbung</p>
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Keine passende Stelle?</h3>
                <p className="text-background/70 text-sm">Schicken Sie uns eine Initiativbewerbung — wir freuen uns über motivierte Talente.</p>
              </div>
              <Link href="/contact"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm">
                Initiativbewerbung
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
