"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import Link from "next/link";
import {
  Building2,
  UtensilsCrossed,
  Stethoscope,
  Hotel,
  Wrench,
  ShoppingBag,
  ArrowRight,
  Clock,
  ShieldCheck,
  FileText,
  Sparkles,
  CalendarCheck,
  PhoneCall,
} from "lucide-react";

const branchen = [
  {
    icon: Building2,
    label: "Büro & Verwaltung",
    href: "/branchen/buero",
    intervall: "24 Monate",
    desc: "PCs, Monitore, Drucker, Kaffeemaschinen und Mehrfachsteckdosen — der typische Büroalltag steckt voller prüfpflichtiger Geräte.",
    geraete: ["PCs & Laptops", "Drucker & Scanner", "Kaffeemaschinen", "Verlängerungskabel"],
  },
  {
    icon: UtensilsCrossed,
    label: "Gastronomie",
    href: "/branchen/gastronomie",
    intervall: "12 Monate",
    desc: "Gewerbliche Küchen haben besonders hohe Prüfanforderungen — Hitze, Feuchtigkeit und intensive Nutzung erhöhen das Risiko.",
    geraete: ["Herde & Öfen", "Spülmaschinen", "Kaffeevollautomaten", "Kühlgeräte"],
  },
  {
    icon: Stethoscope,
    label: "Arztpraxis",
    href: "/branchen/arztpraxis",
    intervall: "24 Monate",
    desc: "Medizinische Geräte unterliegen besonderen Prüfpflichten. NeuraVolt prüft die IT und allgemeine Betriebsmittel.",
    geraete: ["Praxis-PCs & Tablets", "Empfangsgeräte", "Sterilisatoren", "Beleuchtung"],
  },
  {
    icon: Hotel,
    label: "Hotel",
    href: "/branchen/hotel",
    intervall: "12–24 Monate",
    desc: "Hotelzimmer, Küche, Spa und Veranstaltungsräume — eine Vielzahl von Bereichen mit vielen prüfpflichtigen Geräten.",
    geraete: ["Zimmerfernseher", "Küchen-Equipment", "Konferenztechnik", "Poolanlagen"],
  },
  {
    icon: Wrench,
    label: "Werkstatt",
    href: "/branchen/werkstatt",
    intervall: "12 Monate",
    desc: "Elektrowerkzeuge und Maschinen sind in Werkstätten besonders beansprucht — kürzere Prüfintervalle sind vorgeschrieben.",
    geraete: ["Elektrowerkzeuge", "Schweißgeräte", "Bohrmaschinen", "Kompressoren"],
  },
  {
    icon: ShoppingBag,
    label: "Einzelhandel",
    href: "/branchen/einzelhandel",
    intervall: "24 Monate",
    desc: "Von der Kasse über die Beleuchtung bis zum Lager — Einzelhandelsgeschäfte haben zahlreiche prüfpflichtige Betriebsmittel.",
    geraete: ["Kassensysteme", "Beleuchtungsanlagen", "Kühlanlagen", "Lagergeräte"],
  },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Rechtssicher nach DGUV V3", sub: "Zertifizierte Elektrofachkräfte — konform zu VDE 0701/0702." },
  { icon: Clock, label: "Fristenmanagement inklusive", sub: "Automatische Erinnerungen vor jedem Prüfzyklus." },
  { icon: FileText, label: "Digitale Protokolle", sub: "Revisionssicher, sofort abrufbar, BG-konform." },
  { icon: Sparkles, label: "Ab 4,90 € pro Gerät", sub: "Bis zu 20 % unter Marktpreis durch Auftragsbündelung." },
];

const process = [
  {
    icon: PhoneCall,
    step: "01",
    title: "Anfrage stellen",
    body: "Sie nennen uns Branche, Standort und ungefähre Gerätezahl — per Formular, Telefon oder E-Mail. Innerhalb von 24 Stunden erhalten Sie ein transparentes Festpreisangebot.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Termin & Vorbereitung",
    body: "Wir stimmen einen Termin ab, der zu Ihrem Betrieb passt — außerhalb der Öffnungszeiten, in der Nebensaison oder parallel zum laufenden Betrieb. Keine Vorbereitung Ihrerseits nötig.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Prüfung vor Ort",
    body: "Eine zertifizierte Elektrofachkraft prüft alle Betriebsmittel nach DGUV V3 / VDE 0701-0702, kennzeichnet sie mit Prüfplaketten und dokumentiert jedes Gerät digital.",
  },
  {
    icon: FileText,
    step: "04",
    title: "Protokoll & Fristen",
    body: "Sie erhalten das digitale Prüfprotokoll zum Download. Die nächste Prüfung planen wir automatisch — Sie werden rechtzeitig erinnert und müssen nichts im Blick behalten.",
  },
];

export default function PageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const heroIn = useInView(heroRef, { once: true, amount: 0.15 });
  const trustIn = useInView(trustRef, { once: true, amount: 0.15 });
  const cardsIn = useInView(cardsRef, { once: true, amount: 0.1 });
  const tableIn = useInView(tableRef, { once: true, amount: 0.15 });
  const processIn = useInView(processRef, { once: true, amount: 0.15 });
  const ctaIn = useInView(ctaRef, { once: true, amount: 0.2 });

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
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Branchen</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                DGUV V3 Prüfung —<br />passgenau für Ihre Branche.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Jede Branche bringt eigene Prüfintervalle, typische Gerätekategorien und betriebliche Rahmenbedingungen mit sich. NeuraVolt kennt die Anforderungen aus Büro, Gastronomie, Medizin, Hotellerie, Handwerk und Retail — und prüft Ihre Betriebsmittel branchengerecht, rechtssicher und ohne Aufwand für Sie.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Als digitale Plattform für die DGUV V3 Betriebsmittelprüfung in Stuttgart und der gesamten Metropolregion übernehmen wir Planung, Prüfung durch zertifizierte Elektrofachkräfte, digitale Protokollierung und das Fristenmanagement — ab 4,90 € pro Gerät.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm"
                >
                  Kostenlose Anfrage stellen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dguv-check"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  Prüfpflicht in 60 Sek. checken
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Trust Bar ─────────────────────────────────────────────────────── */}
        <section ref={trustRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trustPoints.map(({ icon: Icon, label, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={trustIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-5 shadow-lg"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background shadow-sm mb-3">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Branch Cards ──────────────────────────────────────────────────── */}
        <section ref={cardsRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={cardsIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Branchenübersicht</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Wählen Sie Ihre Branche
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Detaillierte Informationen zu typischen Geräten, Prüfintervallen und Besonderheiten — direkt für Ihren Betrieb.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchen.map(({ icon: Icon, label, href, desc, geraete, intervall }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardsIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link
                    href={href}
                    className="group flex flex-col gap-4 p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl h-full"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground text-lg">{label}</h3>
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-muted/60 rounded-full px-2.5 py-1 shrink-0">
                        {intervall}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed text-justify hyphens-auto">{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {geraete.map(g => (
                        <span key={g} className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
                          {g}
                        </span>
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

        {/* ── Prüfintervall-Tabelle ─────────────────────────────────────────── */}
        <section ref={tableRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={tableIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Prüfintervalle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Wie oft muss nach DGUV V3 geprüft werden?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Die DGUV Information 203-071 empfiehlt branchenabhängige Richtwerte. Die konkrete Frist ergibt sich zusätzlich aus der Gefährdungsbeurteilung im Betrieb.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={tableIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="overflow-hidden rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      <th className="px-6 py-4 font-bold text-foreground">Branche</th>
                      <th className="px-6 py-4 font-bold text-foreground">Typisches Intervall</th>
                      <th className="px-6 py-4 font-bold text-foreground hidden md:table-cell">Besondere Anforderungen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { branche: "Büro & Verwaltung", intervall: "24 Monate", req: "Geringe Beanspruchung, längere Intervalle möglich." },
                      { branche: "Gastronomie", intervall: "12 Monate", req: "Hitze, Feuchte, Dauerbetrieb — jährlich empfohlen." },
                      { branche: "Arztpraxis", intervall: "24 Monate", req: "DGUV V3 + getrennt MPBetreibV für Medizingeräte." },
                      { branche: "Hotel", intervall: "12–24 Monate", req: "Zimmer meist 24 Monate, Küche & Spa 12 Monate." },
                      { branche: "Werkstatt & Handwerk", intervall: "12 Monate", req: "Staub, Vibration, intensiver Gebrauch." },
                      { branche: "Einzelhandel", intervall: "24 Monate", req: "Kühlanlagen und Kassenzonen gesondert bewerten." },
                      { branche: "Baustelle", intervall: "3 Monate", req: "Höchstes Gefährdungspotenzial — strenge Fristen." },
                    ].map(row => (
                      <tr key={row.branche} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 font-semibold text-foreground">{row.branche}</td>
                        <td className="px-6 py-4 text-muted-foreground">{row.intervall}</td>
                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{row.req}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <p className="text-xs text-muted-foreground mt-4 max-w-3xl">
              Hinweis: Die Intervalle sind Orientierungswerte nach DGUV Information 203-071 / TRBS 1201. Die tatsächlich zulässige Prüffrist ergibt sich aus Ihrer Gefährdungsbeurteilung. NeuraVolt unterstützt Sie bei der Festlegung.
            </p>
          </div>
        </section>

        {/* ── Process / Lead Funnel ─────────────────────────────────────────── */}
        <section ref={processRef} className="w-full pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Ablauf</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                In 4 Schritten rechtssicher
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Von der ersten Anfrage bis zur automatischen Fristerinnerung — so einfach ist die DGUV V3 Prüfung mit NeuraVolt.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {process.map(({ icon: Icon, step, title, body }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={processIn ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl"
                >
                  <span className="absolute top-4 right-4 text-4xl font-bold text-foreground/5 group-hover:text-brand/20 transition-colors">
                    {step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm mb-4 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">{body}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm"
              >
                Jetzt unverbindlich anfragen
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-muted-foreground">Antwort innerhalb von 24 Stunden · kein Vertrag nötig</span>
            </motion.div>
          </div>
        </section>

{/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section ref={ctaRef} className="w-full pb-16 md:pb-20">
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
                  Bereit für Ihre branchengerechte Prüfung?
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
