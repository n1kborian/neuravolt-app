"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { FristencheckForm } from "@/components/forms/FristencheckForm";
import { BellRing, Clock, ShieldCheck } from "lucide-react";

const bullets = [
  { icon: Clock, title: "Nie wieder Frist verpassen", body: "Wir merken uns Ihr nächstes Prüfdatum und erinnern Sie rechtzeitig — bevor die BG klingelt." },
  { icon: ShieldCheck, title: "Haftungsrisiken vermeiden", body: "Fehlende Prüfungen können bei Unfällen den Versicherungsschutz gefährden. Wir halten Sie compliant." },
  { icon: BellRing, title: "Kostenlos und unverbindlich", body: "Kein Abo, keine versteckten Kosten. Sie können den Dienst jederzeit mit einer kurzen Mail beenden." },
];

export function FristencheckSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-foreground" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Kostenlos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Automatischer Fristencheck —<br />unser Geschenk an Sie.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
              Tragen Sie sich einmalig ein, und wir erinnern Sie vor jeder fälligen DGUV V3 Prüfung. Keine Tabellen, keine Outlook-Erinnerungen, kein Risiko, eine Frist zu übersehen.
            </p>

            <ul className="space-y-4">
              {bullets.map(({ icon: Icon, title, body }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <FristencheckForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
