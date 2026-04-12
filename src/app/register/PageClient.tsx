"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { CheckCircle2, Zap } from "lucide-react";

const vorteile = [
  "Alle Prüfprotokolle auf einem Blick",
  "Automatische Fristenerinnerungen",
  "Direkter Kontakt zu Ihrem Prüfteam",
  "Digitale Prüfplaketten-Verwaltung",
];

export default function PageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const heroIn = useInView(heroRef, { once: true, amount: 0.15 });
  const formIn = useInView(formRef, { once: true, amount: 0.15 });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">

          <section ref={heroRef} className="py-16 md:py-24 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={heroIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand bg-brand/10 shadow-lg mx-auto mb-6">
                <Zap className="h-7 w-7 text-brand" />
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Kundenportal</span>
                <div className="h-[2px] w-8 bg-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Coming soon.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Unser digitales Kundenportal befindet sich in der Entwicklung. Tragen Sie sich in die Warteliste ein — Sie werden als Erstes benachrichtigt.
              </p>
            </motion.div>
          </section>

          <section ref={formRef} className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={formIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Was Sie erwartet</span>
              </div>
              <ul className="space-y-3 mb-8">
                {vorteile.map((v) => (
                  <li key={v} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                    <span className="text-sm text-muted-foreground">{v}</span>
                  </li>
                ))}
              </ul>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">E-Mail-Adresse</label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="ihre@email.de"
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition text-sm"
                  />
                  <button className="shrink-0 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition text-sm">
                    Eintragen
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Kein Spam. Jederzeit abmeldbar.</p>
              </div>
            </motion.div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
