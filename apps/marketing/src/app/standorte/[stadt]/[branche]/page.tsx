import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BranchenPageTemplate } from "@/components/shared/BranchenPage";
import {
  SEO_LOCATIONS,
  SEO_LOCATION_SLUGS,
  getLocation,
} from "@/lib/seo/locations";
import {
  SEO_BRANCHEN,
  SEO_BRANCHE_SLUGS,
  getBranche,
} from "@/lib/seo/branchen-seo";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";

interface Params {
  stadt: string;
  branche: string;
}

export function generateStaticParams(): Params[] {
  return SEO_LOCATION_SLUGS.flatMap(stadt =>
    SEO_BRANCHE_SLUGS.map(branche => ({ stadt, branche }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { stadt, branche } = await params;
  const location = getLocation(stadt);
  const br = getBranche(branche);
  if (!location || !br) return {};

  const titleBase = `DGUV V3 Prüfung ${location.name} – ${br.name}`;
  const suffix = location.availability === "available" ? "" : " (ab Q3 verfügbar)";

  return {
    title: `${titleBase}${suffix} | NeuraVolt`,
    description:
      `DGUV V3 Betriebsmittelprüfung für ${br.name} in ${location.name} (${location.plzRange}). Zertifizierte Elektrofachkräfte, digitale Protokolle, automatisches Fristenmanagement. Ab 4,90 €/Gerät.`,
    alternates: {
      canonical: `https://neuravolt.de/standorte/${location.slug}/${br.slug}`,
    },
    openGraph: {
      title: `${titleBase}${suffix}`,
      description: `DGUV V3 Betriebsmittelprüfung für ${br.name} in ${location.name}.`,
      type: "website",
    },
  };
}

export default async function StadtBranchePage(
  { params }: { params: Promise<Params> }
) {
  const { stadt, branche } = await params;
  const location = getLocation(stadt);
  const br = getBranche(branche);
  if (!location || !br) notFound();

  const isAvailable = location.availability === "available";

  const badge = `${location.name} · ${br.name}`;
  const title = `DGUV V3 Prüfung in ${location.name}`;
  const highlight = `für ${br.name}.`;
  const subtitle =
    `${location.name} (${location.plzRange}) verbindet ${location.landmarks.slice(0, 2).join(" und ")}. Für ${br.name.toLowerCase()} prüft NeuraVolt Betriebsmittel rechtssicher, digital dokumentiert und mit klar kalkulierten Festpreisen.`;
  const intro = `${location.intro} ${br.intro}`;

  // Schema.org – Service + LocalBusiness + areaServed (hilft Google lokales Ranking)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `DGUV V3 Prüfung in ${location.name} für ${br.name}`,
    "serviceType": "DGUV V3 Betriebsmittelprüfung",
    "description":
      `DGUV V3 Betriebsmittelprüfung für ${br.name} in ${location.name}. Zertifizierte Elektrofachkräfte, digitale Protokolle, automatisches Fristenmanagement.`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "NeuraVolt",
      "url": "https://neuravolt.de",
      "email": "info@neuravolt.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Schwalbenweg 6",
        "addressLocality": "Korntal-Münchingen",
        "postalCode": "70825",
        "addressCountry": "DE",
      },
    },
    "areaServed": {
      "@type": "City",
      "name": location.name,
    },
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "4.90",
        "priceCurrency": "EUR",
        "unitText": "Gerät",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BranchenPageTemplate
        iconName={br.iconName}
        badge={badge}
        title={title}
        highlight={highlight}
        subtitle={subtitle}
        intro={intro}
        geraete={br.geraete}
        besonderheiten={br.besonderheiten}
        image={br.image}
        imageAlt={`DGUV V3 Prüfung ${br.name} in ${location.name}`}
        cta={isAvailable ? "Kostenlose Anfrage stellen" : "Auf die Warteliste"}
        notice={
          <AvailabilityNotice
            cityName={location.name}
            isAvailable={isAvailable}
          />
        }
        afterContent={
          <LocalContext
            cityName={location.name}
            landmarks={location.landmarks}
            plzRange={location.plzRange}
            branche={br.name}
            brancheSlug={br.slug}
          />
        }
      />
    </>
  );
}

function AvailabilityNotice({
  cityName,
  isAvailable,
}: {
  cityName: string;
  isAvailable: boolean;
}) {
  if (isAvailable) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-brand bg-brand/5 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold">NeuraVolt ist in {cityName} aktiv.</span>{" "}
          <span className="text-muted-foreground">
            Anfragen werden direkt bearbeitet — Festpreis-Angebot innerhalb von 24 Stunden.
          </span>
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-900 leading-relaxed">
        <span className="font-semibold">{cityName} folgt in Kürze.</span>{" "}
        Aktuell prüfen wir in Stuttgart und Ludwigsburg. Tragen Sie sich auf die Warteliste ein — Sie erhalten Ihr Festpreis-Angebot, sobald wir in {cityName} starten.
      </p>
    </div>
  );
}

function LocalContext({
  cityName,
  landmarks,
  plzRange,
  branche,
  brancheSlug,
}: {
  cityName: string;
  landmarks: string[];
  plzRange: string;
  branche: string;
  brancheSlug: string;
}) {
  const otherCitySlugs = SEO_LOCATION_SLUGS.filter(s => SEO_LOCATIONS[s].name !== cityName).slice(0, 5);

  return (
    <section className="w-full py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Local anchors */}
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                <MapPin className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Versorgungsgebiet</p>
                <p className="text-base font-bold text-foreground">{cityName} · PLZ {plzRange}</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {landmarks.map(l => (
                <li key={l} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Other cities linking */}
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">
              {branche} auch in
            </p>
            <div className="flex flex-wrap gap-2">
              {otherCitySlugs.map(slug => {
                const loc = SEO_LOCATIONS[slug];
                return (
                  <Link
                    key={slug}
                    href={`/standorte/${slug}/${brancheSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    {loc.name}
                    {loc.availability === "coming-soon" && (
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">· bald</span>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 pt-5 border-t border-border">
              <Link
                href={`/standorte/${SEO_LOCATION_SLUGS.find(s => SEO_LOCATIONS[s].name === cityName) ?? ""}`}
                className="text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
              >
                Alle Branchen in {cityName} ansehen →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
