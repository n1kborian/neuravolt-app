"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import DGUVCheckWidget from "@/components/widgets/DGUVCheckWidget";

export default function PageClient() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const heroIn   = useInView(heroRef,   { once: true, amount: 0.15 });
  const widgetIn = useInView(widgetRef, { once: true, amount: 0.1  });

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Quick-Check</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Bin ich prüfpflichtig?
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Beantworten Sie 5 kurze Fragen — wir schätzen Ihre DGUV V3 Situation ein und zeigen Ihnen den nächsten Schritt.
              </p>
            </motion.div>
          </div>
        </section>

        <section ref={widgetRef} className="w-full pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={widgetIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <DGUVCheckWidget />
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
