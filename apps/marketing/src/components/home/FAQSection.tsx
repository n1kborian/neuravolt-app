"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Banknote, Building2, FileText, AlertTriangle, TrendingDown, Plug, XCircle } from "lucide-react";
import { ElementType } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  icon: ElementType;
  value: string;
  q: string;
  a: string;
};

const faqs: FAQItem[] = [
  {
    icon: ShieldCheck,
    value: "item-1",
    q: "Was ist die DGUV Vorschrift 3?",
    a: "Die DGUV Vorschrift 3 (früher BGV A3) schreibt vor, dass elektrische Anlagen und Betriebsmittel in Unternehmen regelmäßig von einer Elektrofachkraft geprüft werden müssen. Ziel ist die Vermeidung von Unfällen durch elektrische Gefährdung.",
  },
  {
    icon: Clock,
    value: "item-2",
    q: "Wie oft müssen Betriebsmittel geprüft werden?",
    a: "Das hängt von der Nutzungsart ab. Ortsveränderliche Betriebsmittel müssen in der Regel alle 1–2 Jahre geprüft werden. In Werkstätten und Küchen gelten kürzere Intervalle. NeuraVolt übernimmt das Fristenmanagement vollständig für Sie.",
  },
  {
    icon: Banknote,
    value: "item-3",
    q: "Was kostet eine DGUV V3 Prüfung bei NeuraVolt?",
    a: "Unsere Einmalprüfung beginnt ab 4,90 € pro Gerät (zzgl. MwSt.). Für regelmäßige Prüfungen bieten wir Wartungspakete ab 3,90 € pro Gerät/Monat an. Ein konkretes Angebot erhalten Sie nach Ihrer Anfrage innerhalb von 24 Stunden.",
  },
  {
    icon: TrendingDown,
    value: "item-7",
    q: "Warum ist NeuraVolt günstiger als andere Anbieter?",
    a: "NeuraVolt ist eine digitale Plattform, die über ein Netzwerk zertifizierter Elektrofachkraft-Partner arbeitet. Unsere KI bündelt Aufträge regional und zeitlich — die Partner können effizienter arbeiten, und wir geben diese Einsparungen direkt an Sie weiter. Das Ergebnis: Preise bis zu 20 % unter dem Marktüblichen, bei gleichem Qualitäts- und Rechtssicherheitsstandard.",
  },
  {
    icon: Building2,
    value: "item-4",
    q: "Muss ich dafür meinen Betrieb schließen?",
    a: "Nein. Unsere Partnerfachkräfte kommen zu Ihnen und führen die Prüfung während des laufenden Betriebs durch. Wir koordinieren den Termin so, dass Ihre Geschäftstätigkeit minimal beeinträchtigt wird.",
  },
  {
    icon: FileText,
    value: "item-5",
    q: "Was passiert nach der Prüfung?",
    a: "Sie erhalten sofort ein digitales Prüfprotokoll per E-Mail. Alle Geräte werden mit Prüfplaketten versehen. Die nächsten Fälligkeitsdaten werden automatisch vermerkt und Sie rechtzeitig erinnert.",
  },
  {
    icon: AlertTriangle,
    value: "item-6",
    q: "Was passiert, wenn ich die Prüfung nicht durchführe?",
    a: "Fehlende DGUV V3 Prüfungen können bei einem Arbeitsunfall zum Verlust des Versicherungsschutzes führen. Zudem drohen Bußgelder durch die Berufsgenossenschaft sowie haftungsrechtliche Konsequenzen für Geschäftsführer und Betreiber. Eine regelmäßige Prüfung schützt Sie und Ihre Mitarbeitenden.",
  },
  {
    icon: Plug,
    value: "item-8",
    q: "Welche Geräte fallen unter die Prüfpflicht?",
    a: "Alle elektrischen Betriebsmittel, die in Ihrem Betrieb verwendet werden — ortsveränderlich (PCs, Werkzeuge, Kaffeemaschinen, Verlängerungskabel) ebenso wie ortsfeste Anlagen (Küchenzeilen, fest installierte Maschinen). Unsere Prüfer erfassen jedes Gerät einzeln mit Seriennummer und Standort für ein revisionssicheres Protokoll.",
  },
  {
    icon: XCircle,
    value: "item-9",
    q: "Was passiert, wenn ein Gerät die Prüfung nicht besteht?",
    a: 'Das Gerät wird sofort als „nicht bestanden" gekennzeichnet und darf nicht weiter betrieben werden. Sie erhalten eine klare Empfehlung — Reparatur, Austausch oder Aussonderung — direkt im digitalen Prüfprotokoll, damit Sie unverzüglich reagieren können.',
  },
];

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-12">

        {/* Header — same style as FuerWenSection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Häufige Fragen
          </h2>
          <p className="text-muted-foreground text-lg">
            Haben Sie weitere Fragen? Wir antworten innerhalb von 24 Stunden.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — image feature card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:sticky lg:top-28 self-start"
          >
            <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"
                  fill
                  alt="Elektrofachkraft bei DGUV V3 Prüfung"
                  className="object-cover object-center"
                  unoptimized
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-foreground mb-1">Noch Fragen offen?</p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Unser Team meldet sich innerhalb von 24 Stunden mit einem persönlichen Angebot.
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  Jetzt anfragen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map(({ icon: Icon, value, q, a }) => (
                <AccordionItem
                  key={value}
                  value={value}
                  className="group border border-border rounded-2xl overflow-hidden bg-background/80 backdrop-blur-sm shadow-lg transition-all duration-300 data-[state=open]:border-brand data-[state=open]:shadow-xl"
                >
                  <AccordionTrigger className="flex items-center justify-between w-full px-6 py-5 bg-transparent text-left data-[state=open]:bg-foreground/[0.03] transition-colors hover:no-underline">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-all duration-300 group-data-[state=open]:border-brand group-data-[state=open]:bg-brand group-data-[state=open]:text-brand-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-base font-semibold text-foreground">{q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="relative px-6 text-sm text-muted-foreground border-t border-border leading-relaxed before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-brand before:opacity-0 group-data-[state=open]:before:opacity-100 transition-all duration-300">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
