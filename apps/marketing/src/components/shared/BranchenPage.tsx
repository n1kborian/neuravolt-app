"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { CheckCircle2, ArrowRight, Building2, UtensilsCrossed, Stethoscope, Hotel, Wrench, ShoppingBag } from "lucide-react";
import Link from "next/link";

const ICON_MAP = { Building2, UtensilsCrossed, Stethoscope, Hotel, Wrench, ShoppingBag } as const;
export type BrancheIconName = keyof typeof ICON_MAP;

interface BranchenPageProps {
  iconName: BrancheIconName;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  intro: string;
  geraete: string[];
  besonderheiten: string[];
  image: string;
  imageAlt?: string;
  cta?: string;
}

export function BranchenPageTemplate({
  iconName,
  badge,
  title,
  highlight,
  subtitle,
  intro,
  geraete,
  besonderheiten,
  image,
  imageAlt,
  cta = "Kostenlose Anfrage stellen",
}: BranchenPageProps) {
  const Icon = ICON_MAP[iconName];
  const heroFeatures = besonderheiten.slice(0, 4);
  const heroRef      = useRef<HTMLDivElement>(null);
  const introRef     = useRef<HTMLDivElement>(null);
  const geraeteRef   = useRef<HTMLDivElement>(null);
  const leistungRef  = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);

  const heroIn     = useInView(heroRef,     { once: true, amount: 0.15 });
  const introIn    = useInView(introRef,    { once: true, amount: 0.2  });
  const geraeteIn  = useInView(geraeteRef,  { once: true, amount: 0.15 });
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

              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-foreground" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">{badge}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  {title}<br />{highlight}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl text-justify hyphens-auto">{subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm"
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/dguv-check"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    DGUV-Check starten
                  </Link>
                </div>
              </motion.div>

              {/* Right — feature card with branch photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={heroIn ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative"
              >
                <div className="relative bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
                  <div className="aspect-video relative overflow-hidden rounded-lg border border-border mb-6">
                    <Image
                      src={image}
                      alt={imageAlt ?? `${badge} – DGUV V3 Prüfung`}
                      fill
                      className="object-cover object-center"
                      unoptimized
                    />
                  </div>

                  <ul className="space-y-4">
                    {heroFeatures.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: 20 }}
                        animate={heroIn ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                        className="flex items-start gap-4"
                      >
                        <div className="text-brand shrink-0">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className="text-base text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Intro ─────────────────────────────────────────────────────────── */}
        <section ref={introRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={introIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Hintergrund</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                DGUV V3 Prüfung in Ihrer Branche
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl text-justify hyphens-auto">{intro}</p>
            </motion.div>
          </div>
        </section>

        {/* ── Typische Geräte ───────────────────────────────────────────────── */}
        <section ref={geraeteRef} className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={geraeteIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Prüfpflichtig</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Typische Geräte in Ihrer Branche
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Jedes elektrische Betriebsmittel in Ihrem Betrieb unterliegt der Prüfpflicht — wir erfassen und prüfen vollständig.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {geraete.map((g, i) => (
                <motion.div
                  key={g}
                  initial={{ opacity: 0, y: 16 }}
                  animate={geraeteIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-background/80 backdrop-blur-sm p-4 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl"
                >
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 transition-colors group-hover:text-brand" />
                  <span className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors">{g}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Was NeuraVolt übernimmt ───────────────────────────────────────── */}
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
                Was NeuraVolt für Sie übernimmt
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Von der Terminplanung bis zum digitalen Protokoll — komplett ohne Mehraufwand für Sie.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {besonderheiten.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, y: 20 }}
                  animate={leistungIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
                  </div>
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
                <h3 className="text-xl sm:text-2xl font-bold text-background mb-1">
                  Bereit für Ihre nächste Prüfung?
                </h3>
                <p className="text-background/70 text-sm">Kostenlose Anfrage — Antwort innerhalb von 24 Stunden.</p>
              </div>
              <Link
                href="/contact"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-background/90 shadow-sm"
              >
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
