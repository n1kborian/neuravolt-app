"use client";
import { Suspense, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const artikel = [
  { tag: "Grundlagen", title: "Was ist die DGUV Vorschrift 3?",         desc: "Alles über die rechtliche Grundlage, wer betroffen ist und was die Prüfung beinhaltet.",                                                   href: "/dguv-v3",             readTime: "5 min" },
  { tag: "Fristen",    title: "Prüfintervalle nach Gerätekategorie",     desc: "Welche Fristen gelten für ortsveränderliche und ortsfeste Betriebsmittel in verschiedenen Branchen?",                                       href: "/dguv-v3",             readTime: "4 min" },
  { tag: "Haftung",    title: "Haftungsrisiken bei Nichtprüfung",        desc: "Was passiert, wenn Sie die Prüfpflicht vernachlässigen? Bußgelder, Haftung und Versicherungsschutz.",                                      href: "/dguv-v3",             readTime: "6 min" },
  { tag: "Praxis",     title: "DGUV V3 Prüfung: Ablauf & Checkliste",   desc: "Schritt für Schritt: Was passiert bei einer Prüfung, wie bereiten Sie sich vor?",                                                           href: "/dguv-pruefung",       readTime: "7 min" },
  { tag: "Branchen",   title: "Besonderheiten in der Gastronomie",       desc: "Kürzere Intervalle, Feuchtraumanforderungen — was Gastronomen besonders beachten müssen.",                                                  href: "/branchen/gastronomie",readTime: "4 min" },
  { tag: "Kosten",     title: "Was kostet eine DGUV V3 Prüfung?",        desc: "Transparent aufgeschlüsselt: Preis pro Gerät, Anfahrtspauschale und Einrichtungspreis. Mit Preisrechner für Ihr individuelles Angebot.",    href: "/angebote",            readTime: "3 min" },
];

function NewsletterStatusBanner() {
  const params = useSearchParams();
  const status = params.get("newsletter");
  if (!status) return null;

  const map = {
    success: {
      tone: "success" as const,
      title: "Anmeldung bestätigt",
      body: "Vielen Dank. Sie erhalten ab sofort unseren Ratgeber-Newsletter.",
    },
    expired: {
      tone: "error" as const,
      title: "Bestätigungslink abgelaufen",
      body: "Der Link ist nicht mehr gültig. Bitte melden Sie sich unten erneut an.",
    },
    invalid: {
      tone: "error" as const,
      title: "Ungültiger Bestätigungslink",
      body: "Der Link konnte nicht zugeordnet werden. Bitte melden Sie sich unten erneut an.",
    },
  } as const;

  const conf = map[status as keyof typeof map];
  if (!conf) return null;

  const isSuccess = conf.tone === "success";

  return (
    <div className={`rounded-2xl border p-5 flex items-start gap-3 mb-8 ${
      isSuccess
        ? "border-green-200 bg-green-50 text-green-900"
        : "border-red-200 bg-red-50 text-red-900"
    }`}>
      {isSuccess ? <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-green-600" /> : <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />}
      <div>
        <p className="font-bold text-sm">{conf.title}</p>
        <p className="text-sm opacity-80">{conf.body}</p>
      </div>
    </div>
  );
}

export default function PageClient() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const newsRef  = useRef<HTMLDivElement>(null);

  const heroIn  = useInView(heroRef,  { once: true, amount: 0.15 });
  const cardsIn = useInView(cardsRef, { once: true, amount: 0.1  });
  const newsIn  = useInView(newsRef,  { once: true, amount: 0.2  });

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
              <Suspense fallback={null}><NewsletterStatusBanner /></Suspense>
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
                    className="group flex flex-col gap-4 p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-brand hover:shadow-xl h-full">
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

        {/* ── Newsletter ────────────────────────────────────────────────────── */}
        <section ref={newsRef} className="w-full pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={newsIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-4 justify-center">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Bleiben Sie informiert</span>
                <div className="h-[2px] w-8 bg-foreground" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Jeden Monat neue Praxis-Tipps
              </h2>
              <p className="text-muted-foreground text-lg">
                Kurz, konkret, direkt aus der Praxis — ohne Werbe­ballast. Kostenlos, jederzeit abbestellbar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={newsIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <NewsletterForm />
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
