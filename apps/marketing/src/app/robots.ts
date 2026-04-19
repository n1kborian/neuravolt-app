import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/register",
          "/sentry-example-page",
        ],
      },
    ],
    sitemap: "https://neuravolt.de/sitemap.xml",
    host: "https://neuravolt.de",
  };
}
