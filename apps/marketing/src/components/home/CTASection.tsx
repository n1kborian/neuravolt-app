"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative overflow-hidden rounded-lg border border-foreground bg-foreground"
        >
          {/* Dot grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 h-32 w-32 rounded-br-full bg-white/05" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-full bg-white/05" />

          <div className="relative z-10 px-8 md:px-12 py-6 md:py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Left text */}
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-semibold text-white/80">Kostenlos &amp; unverbindlich</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
                >
                  Bereit für rechtssichere DGUV-Prüfungen?
                </motion.h2>
              </div>

              {/* Right buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-3 shrink-0"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white bg-white px-6 py-3.5 text-sm font-bold text-foreground shadow-sm transition-all duration-300 hover:bg-white/90"
                >
                  Kostenlose Anfrage stellen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dguv-check"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50"
                >
                  DGUV-Check starten
                </Link>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 w-full text-white/60 text-lg"
            >
              Anfrage stellen — wir antworten innerhalb von 24 Stunden mit einem transparenten Angebot.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
