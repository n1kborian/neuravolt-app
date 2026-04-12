"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

const artikel = [
  { tag: "Grundlagen", title: "Was ist die DGUV Vorschrift 3?",         desc: "Alles über die rechtliche Grundlage, wer betroffen ist und was die Prüfung beinhaltet.",                                                   href: "/dguv-v3",             readTime: "5 min" },
  { tag: "Fristen",    title: "Prüfintervalle nach Gerätekategorie",     desc: "Welche Fristen gelten für ortsveränderliche und ortsfeste Betriebsmittel in verschiedenen Branchen?",                                       href: "/dguv-v3",             readTime: "4 min" },
  { tag: "Haftung",    title: "Haftungsrisiken bei Nichtprüfung",        desc: "Was passiert, wenn Sie die Prüfpflicht vernachlässigen? Bußgelder, Haftung und Versicherungsschutz.",                                      href: "/dguv-v3",             readTime: "6 min" },
  { tag: "Praxis",     title: "DGUV V3 Prüfung: Ablauf & Checkliste",   desc: "Schritt für Schritt: Was passiert bei einer Prüfung, wie bereiten Sie sich vor?",                                                           href: "/dguv-pruefung",       readTime: "7 min" },
  { tag: "Branchen",   title: "Besonderheiten in der Gastronomie",       desc: "Kürzere Intervalle, Feuchtraumanforderungen — was Gastronomen besonders beachten müssen.",                                                  href: "/branchen/gastronomie",readTime: "4 min" },
  { tag: "Kosten",     title: "Was kostet eine DGUV V3 Prüfung?",        desc: "Wie KI-Bündelung die Kosten um bis zu 20 % senkt — Einzelprüfung vs. Wartungspaket und was enthalten ist.",                              href: "/angebote",            readTime: "3 min" },
];

export default function PageClient() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const heroIn  = useInView(heroRef,  { once: true, amount: 0.15 });
  const cardsIn = useInView(cardsRef, { once: true, amount: 0.1  });

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Ratgeber</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Wissen rund um DGUV V3.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Alles was Sie über Betriebsmittelprüfungen wissen müssen — Prüfpflichten, Fristen, Haftung und Praxistipps, verständlich erklärt.
              </p>
            </motion.div>
          </div>
        </section>

        <section ref={cardsRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artikel.map(({ tag, title, desc, href, readTime }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardsIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link href={href}
                    className="group flex flex-col gap-4 p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-foreground hover:shadow-xl h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">{tag}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {readTime}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-foreground text-base mb-2 leading-snug">{title}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand text-sm font-semibold mt-auto pt-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Artikel lesen
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ml-auto" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
