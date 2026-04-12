"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import Link from "next/link";
import { Building2, UtensilsCrossed, Stethoscope, Hotel, Wrench, ShoppingBag, ArrowRight } from "lucide-react";

const branchen = [
  { icon: Building2,      label: "Büro & Verwaltung", href: "/branchen/buero",       desc: "PCs, Monitore, Drucker, Kaffeemaschinen und Mehrfachsteckdosen — der typische Büroalltag steckt voller prüfpflichtiger Geräte.",                     geraete: ["PCs & Laptops", "Drucker & Scanner", "Kaffeemaschinen", "Verlängerungskabel"] },
  { icon: UtensilsCrossed,label: "Gastronomie",        href: "/branchen/gastronomie", desc: "Gewerbliche Küchen haben besonders hohe Prüfanforderungen — Hitze, Feuchtigkeit und intensive Nutzung erhöhen das Risiko.",                           geraete: ["Herde & Öfen", "Spülmaschinen", "Kaffeevollautomaten", "Kühlgeräte"] },
  { icon: Stethoscope,    label: "Arztpraxis",         href: "/branchen/arztpraxis",  desc: "Medizinische Geräte unterliegen besonderen Prüfpflichten. NeuraVolt prüft die IT und allgemeine Betriebsmittel.",                                     geraete: ["Praxis-PCs & Tablets", "Empfangsgeräte", "Sterilisatoren", "Beleuchtung"] },
  { icon: Hotel,          label: "Hotel",              href: "/branchen/hotel",       desc: "Hotelzimmer, Küche, Spa und Veranstaltungsräume — eine Vielzahl von Bereichen mit vielen prüfpflichtigen Geräten.",                                    geraete: ["Zimmerfernseher", "Küchen-Equipment", "Konferenztechnik", "Poolanlagen"] },
  { icon: Wrench,         label: "Werkstatt",          href: "/branchen/werkstatt",   desc: "Elektrowerkzeuge und Maschinen sind in Werkstätten besonders beansprucht — kürzere Prüfintervalle sind vorgeschrieben.",                               geraete: ["Elektrowerkzeuge", "Schweißgeräte", "Bohrmaschinen", "Kompressoren"] },
  { icon: ShoppingBag,    label: "Einzelhandel",       href: "/branchen/einzelhandel",desc: "Von der Kasse über die Beleuchtung bis zum Lager — Einzelhandelsgeschäfte haben zahlreiche prüfpflichtige Betriebsmittel.",                            geraete: ["Kassensysteme", "Beleuchtungsanlagen", "Kühlanlagen", "Lagergeräte"] },
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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Branchen</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                DGUV-Prüfung für Ihre Branche.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Jede Branche hat eigene Anforderungen und Prüfintervalle. NeuraVolt kennt die Besonderheiten Ihrer Branche und prüft branchengerecht — vollständig und rechtssicher.
              </p>
            </motion.div>
          </div>
        </section>

        <section ref={cardsRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchen.map(({ icon: Icon, label, href, desc, geraete }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardsIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link href={href}
                    className="group flex flex-col gap-4 p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl h-full">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="font-bold text-foreground text-lg">{label}</h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {geraete.map(g => (
                        <span key={g} className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">{g}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-brand text-sm font-semibold mt-auto pt-2">
                      Mehr erfahren
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
