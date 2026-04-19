"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { num: "4,90 €", label: "Pro Gerät",          sub: "zzgl. MwSt. · kein Vertrag nötig" },
  { num: "24h",    label: "Rückmeldung",        sub: "Angebot innerhalb eines Werktages" },
  { num: "100%",   label: "Rechtssicher",       sub: "Zertifizierte Elektrofachkräfte" },
  { num: "KI",     label: "Auftragsbündelung", sub: "Regional gebündelt — direkt im Preis" },
];

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  const features = [
    "Zugang zum NeuraVolt-Partnernetzwerk zertifizierter Elektrofachkräfte",
    "Prüfung durch zertifizierte Elektrofachkräfte — ohne Betriebsunterbrechung",
    "KI-gestützte Auftragsbündelung — Effizienzvorteil direkt im Festpreis",
    "Automatisches Fristenmanagement inklusive",
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="w-full min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-secondary/5 opacity-70" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -100 }}
          animate={isLoaded ? { opacity: 0.3, scale: 1, x: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-brand/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={isLoaded ? { opacity: 0.2, scale: 1, x: 0 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12 md:pt-32 md:pb-16 relative z-10 flex flex-col gap-12">

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10">

          {/* Left content */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/80 border border-border"
            >
              <span className="flex h-2 w-2 rounded-full bg-brand" />
              <span className="text-sm font-medium">Stuttgart & Region</span>
            </motion.div>

            {/* Heading */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              >
                Das Prüfernetzwerk
                <br />
                für <span className="text-brand">DGUV V3 Prüfungen.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="mt-6 text-lg text-muted-foreground max-w-2xl text-justify hyphens-auto"
              >
                NeuraVolt vermittelt DGUV V3 Betriebsmittelprüfungen in Stuttgart und der Region — durch ein Netzwerk zertifizierter Elektrofachkräfte, mit KI-optimierter Auftragsplanung und automatischem Fristenmanagement. Fester Preis ab 4,90 €/Gerät — in Minuten gebucht, in Tagen geprüft, digital dokumentiert.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="group rounded-full" asChild>
                <Link href="/contact">
                  Kostenlose Anfrage
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group rounded-full" asChild>
                <Link href="/dguv-check">
                  DGUV-Check starten
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right content — feature card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
              {/* Image */}
              <div className="aspect-video relative overflow-hidden rounded-lg border border-border mb-6">
                <Image
                  src="https://images.pexels.com/photos/442151/pexels-photo-442151.jpeg?auto=compress&cs=tinysrgb&w=800"
                  fill
                  alt="Elektrofachkraft bei DGUV V3 Betriebsmittelprüfung mit Messgerät"
                  className="object-cover object-center"
                  unoptimized
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Feature list */}
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                    className="flex items-start gap-4"
                  >
                    <div className="text-brand shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="text-base text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ num, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="group flex flex-col gap-1 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-4 shadow-lg transition-all duration-300 hover:border-foreground hover:shadow-xl"
            >
              <div className="flex items-baseline gap-2">
                <p className="text-4xl md:text-5xl font-bold text-foreground/10 group-hover:text-brand transition-colors duration-300 leading-none tracking-tight">
                  {num}
                </p>
                <p className="text-sm font-semibold text-foreground">{label}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
