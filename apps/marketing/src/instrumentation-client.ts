// Sentry client-side config (minimal for performance).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1ed10046a23463d41ff15a3846122888@o4511206669811712.ingest.de.sentry.io/4511206673940560",

  // Kein replayIntegration() mehr — spart ~200 KiB JavaScript auf jeder Page.
  // Bei Bedarf via lazy load einzeln auf bestimmten Seiten aktivierbar.

  // Production: 10 % Tracing reicht für statistisch relevante Sample; Dev: volles Sampling.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Logs nur bei echten Errors.
  enableLogs: false,

  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
