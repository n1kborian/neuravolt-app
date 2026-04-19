import type { MetadataRoute } from "next";
import { SEO_LOCATION_SLUGS } from "@/lib/seo/locations";
import { SEO_BRANCHE_SLUGS } from "@/lib/seo/branchen-seo";

const BASE = "https://neuravolt.de";

const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/",               changeFrequency: "weekly",  priority: 1.0 },
  { path: "/dguv-pruefung",  changeFrequency: "monthly", priority: 0.9 },
  { path: "/dguv-v3",        changeFrequency: "monthly", priority: 0.7 },
  { path: "/dguv-check",     changeFrequency: "monthly", priority: 0.7 },
  { path: "/angebote",       changeFrequency: "monthly", priority: 0.8 },
  { path: "/ratgeber",       changeFrequency: "weekly",  priority: 0.6 },
  { path: "/branchen",       changeFrequency: "monthly", priority: 0.8 },
  { path: "/branchen/buero",        changeFrequency: "monthly", priority: 0.7 },
  { path: "/branchen/gastronomie",  changeFrequency: "monthly", priority: 0.7 },
  { path: "/branchen/arztpraxis",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/branchen/hotel",        changeFrequency: "monthly", priority: 0.7 },
  { path: "/branchen/werkstatt",    changeFrequency: "monthly", priority: 0.7 },
  { path: "/branchen/einzelhandel", changeFrequency: "monthly", priority: 0.7 },
  { path: "/standorte",      changeFrequency: "monthly", priority: 0.8 },
  { path: "/partner",        changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact",        changeFrequency: "monthly", priority: 0.6 },
  { path: "/hiring",         changeFrequency: "monthly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(p => ({
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const cityOverviews: MetadataRoute.Sitemap = SEO_LOCATION_SLUGS.map(slug => ({
    url: `${BASE}/standorte/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const comboPages: MetadataRoute.Sitemap = SEO_LOCATION_SLUGS.flatMap(stadt =>
    SEO_BRANCHE_SLUGS.map(branche => ({
      url: `${BASE}/standorte/${stadt}/${branche}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...cityOverviews, ...comboPages];
}
