"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { ContactForm } from "@/components/shared/ContactForm";
import { CheckCircle2, Clock, Shield, Phone } from "lucide-react";

const benefits = [
  { icon: Clock,        text: "Antwort innerhalb von 24 Stunden" },
  { icon: Shield,       text: "Kostenlos & unverbindlich" },
  { icon: CheckCircle2, text: "Kein versteckter Preisaufschlag" },
  { icon: Phone,        text: "Direkter Ansprechpartner" },
];

export default function PageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const heroIn = useInView(heroRef, { once: true, amount: 0.15 });
  const formIn = useInView(formRef, { once: true, amount: 0.1  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Kontakt</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                DGUV V3 Prüfung anfragen.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kostenlos & unverbindlich — wir antworten innerhalb von 24 Stunden mit einem transparenten Angebot für Ihr Unternehmen.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Form + Info ───────────────────────────────────────────────────── */}
        <section ref={formRef} className="w-full pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-start">

              {/* Left: Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-28 space-y-4"
              >
                <ul className="space-y-3">
                  {benefits.map(({ icon: Icon, text }) => (
                    <li key={text} className="group flex items-center gap-4 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-4 shadow-lg transition-all duration-300 hover:border-foreground hover:shadow-xl">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg">
                  <p className="text-sm font-bold text-foreground mb-1">NeuraVolt GmbH</p>
                  <p className="text-sm text-muted-foreground">Stuttgart & Region</p>
                  <p className="text-sm text-muted-foreground mt-2">info@neuravolt.de</p>
                </div>
              </motion.div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-8 shadow-lg">
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
