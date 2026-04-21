"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { SEO_LOCATIONS, SEO_LOCATION_SLUGS } from "@/lib/seo/locations";

const contact = [
  { icon: Mail,  label: "info@neuravolt.de" },
  { icon: Phone, label: "Auf Anfrage" },
  { icon: Clock, label: "Mo–Fr 8:00–18:00 Uhr" },
];

export default function PageClient() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  const heroIn    = useInView(heroRef,    { once: true, amount: 0.15 });
  const contentIn = useInView(contentRef, { once: true, amount: 0.15 });
  const ctaIn     = useInView(ctaRef,     { once: true, amount: 0.3  });

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Standorte</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Stuttgart & Metropolregion.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed text-justify hyphens-auto">
                NeuraVolt ist aktuell in Stuttgart und der gesamten Metropolregion aktiv und führt DGUV V3 Prüfungen vor Ort durch. Weitere Regionen folgen.
              </p>
            </motion.div>
          </div>
        </section>

        <section ref={contentRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={contentIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand bg-brand/10 shadow-sm">
                    <MapPin className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Hauptstandort</p>
                    <p className="text-sm text-muted-foreground">Stuttgart, Baden-Württemberg</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {contact.map(({ icon: Icon, label }) => (
                    <div key={label} className="group flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={contentIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-[2px] w-8 bg-foreground" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Servicegebiete</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {SEO_LOCATION_SLUGS.map((slug, i) => {
                    const loc = SEO_LOCATIONS[slug];
                    const available = loc.availability === "available";
                    return (
                      <motion.div key={slug}
                        initial={{ opacity: 0, x: -8 }}
                        animate={contentIn ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
                      >
                        <Link
                          href={`/standorte/${slug}`}
                          className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${available ? "bg-brand" : "bg-muted-foreground"}`} />
                            <span className="truncate">{loc.name}</span>
                          </span>
                          {!available && (
                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-muted-foreground group-hover:text-background/70">
                              bald
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground">Ihr Standort nicht dabei? <Link href="/contact" className="underline hover:text-foreground transition">Fragen Sie uns an</Link> — wir erweitern kontinuierlich.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={ctaRef} className="w-full pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-foreground bg-foreground p-8 md:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-background/60 mb-2">Jetzt anfragen</p>
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">Prüfung in Ihrer Region?</h3>
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
