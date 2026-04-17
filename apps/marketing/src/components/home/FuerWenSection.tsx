"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { PlusIcon, Building2, UtensilsCrossed, Stethoscope, Hotel, Wrench, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const branchen = [
  { icon: Building2,       label: "Büro & Verwaltung", href: "/branchen/buero",        desc: "PCs, Drucker, Kaffeemaschinen" },
  { icon: UtensilsCrossed, label: "Gastronomie",        href: "/branchen/gastronomie",  desc: "Küchen- & Servicegeräte" },
  { icon: Stethoscope,     label: "Arztpraxis",         href: "/branchen/arztpraxis",   desc: "Medizinische Geräte & EDV" },
  { icon: Hotel,           label: "Hotel",              href: "/branchen/hotel",         desc: "Zimmer, Küche, Veranstaltung" },
  { icon: Wrench,          label: "Werkstatt",          href: "/branchen/werkstatt",     desc: "Elektrowerkzeuge & Maschinen" },
  { icon: ShoppingBag,     label: "Einzelhandel",       href: "/branchen/einzelhandel", desc: "Kassen, Beleuchtung, Lager" },
];

// 3-column, 2-row grid layout config
// Backgrounds alternate, plus icons mark intersections
const cellConfig = [
  // Row 1
  { bg: "bg-muted/60",   borders: "border-r border-b", plusBR: true,  plusBL: false },
  { bg: "bg-background", borders: "border-r border-b", plusBR: true,  plusBL: true  },
  { bg: "bg-muted/60",   borders: "border-b",          plusBR: false, plusBL: true  },
  // Row 2
  { bg: "bg-background", borders: "border-r",          plusBR: false, plusBL: false },
  { bg: "bg-muted/60",   borders: "border-r",          plusBR: false, plusBL: false },
  { bg: "bg-background", borders: "",                  plusBR: false, plusBL: false },
];

export function FuerWenSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-foreground" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Für wen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Für jede Branche die richtige Lösung
          </h2>
          <p className="text-muted-foreground text-lg">
            Jedes Unternehmen mit elektrischen Betriebsmitteln ist prüfpflichtig —
            egal ob Büro, Gastro oder Werkstatt.
          </p>
        </motion.div>

        {/* Logo-cloud grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-3"
        >

          {branchen.map((b, i) => {
            const cfg = cellConfig[i];
            const Icon = b.icon;
            return (
              <Link
                key={b.label}
                href={b.href}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-3 px-4 py-10 md:p-12 transition-colors duration-300 border-border hover:bg-foreground/[0.03]",
                  cfg.borders,
                  cfg.bg,
                )}
              >
                <div className="flex items-center gap-3 w-full justify-center">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground text-xl leading-tight">{b.label}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-center">{b.desc}</p>

                {/* Plus icons at intersections */}
                {cfg.plusBR && (
                  <PlusIcon className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-border" strokeWidth={1} />
                )}
                {cfg.plusBL && (
                  <PlusIcon className="-left-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-border" strokeWidth={1} />
                )}
              </Link>
            );
          })}

        </motion.div>

      </div>
    </section>
  );
}
