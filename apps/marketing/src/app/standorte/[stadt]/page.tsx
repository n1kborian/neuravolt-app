import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  Wrench,
} from "lucide-react";
import {
  SEO_LOCATIONS,
  SEO_LOCATION_SLUGS,
  getLocation,
} from "@/lib/seo/locations";
import { SEO_BRANCHEN, SEO_BRANCHE_SLUGS } from "@/lib/seo/branchen-seo";

const ICON_MAP = {
  Building2,
  UtensilsCrossed,
  Stethoscope,
  Wrench,
} as const;

interface Params { stadt: string }

export function generateStaticParams(): Params[] {
  return SEO_LOCATION_SLUGS.map(stadt => ({ stadt }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { stadt } = await params;
  const loc = getLocation(stadt);
  if (!loc) return {};
  const suffix = loc.availability === "available" ? "" : " (ab Q3 verfügbar)";
  return {
    title: `DGUV V3 Prüfung ${loc.name}${suffix} | NeuraVolt`,
    description:
      `DGUV V3 Betriebsmittelprüfung in ${loc.name} (${loc.plzRange}). Für Büro, Gastronomie, Arztpraxis und Werkstatt — zertifizierte Elektrofachkräfte und digitale Protokolle.`,
    alternates: {
      canonical: `https://neuravolt.de/standorte/${loc.slug}`,
    },
  };
}

export default async function StadtOverviewPage(
  { params }: { params: Promise<Params> }
) {
  const { stadt } = await params;
  const loc = getLocation(stadt);
  if (!loc) notFound();

  const isAvailable = loc.availability === "available";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20">

        {/* Hero */}
        <section className="w-full py-12 md:py-20">
          <div className="container mx-auto px-4">
            {!isAvailable && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <span className="font-semibold">{loc.name} ist vorgemerkt.</span>{" "}
                  Aktuell prüfen wir in Stuttgart und Ludwigsburg — weitere Städte folgen. Sie können sich jetzt auf die Warteliste setzen.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 bg-foreground" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Standort</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  DGUV V3 Prüfung in {loc.name}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  {loc.intro}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90 shadow-sm">
                    {isAvailable ? "Kostenlose Anfrage stellen" : "Auf die Warteliste"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/dguv-check"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
                    DGUV-Check starten
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                    <MapPin className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Versorgungsgebiet</p>
                    <p className="text-base font-bold text-foreground">{loc.name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">PLZ-Bereich {loc.plzRange}</p>
                <ul className="space-y-2">
                  {loc.landmarks.map(l => (
                    <li key={l} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Branches */}
        <section className="w-full py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Branchen in {loc.name}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Prüfservice für alle Branchen
              </h2>
              <p className="text-muted-foreground text-lg">
                Unabhängig von Größe und Gerätezahl — wir prüfen rechtssicher, digital dokumentiert, mit transparentem Festpreis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SEO_BRANCHE_SLUGS.map(bSlug => {
                const br = SEO_BRANCHEN[bSlug];
                const Icon = ICON_MAP[br.iconName as keyof typeof ICON_MAP] ?? Building2;
                return (
                  <Link
                    key={bSlug}
                    href={`/standorte/${loc.slug}/${bSlug}`}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all hover:border-brand hover:shadow-xl"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground mb-1">{br.name}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {br.intro}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-2 transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Back-link */}
        <section className="w-full pb-16">
          <div className="container mx-auto px-4">
            <Link
              href="/standorte"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Alle Standorte ansehen
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
