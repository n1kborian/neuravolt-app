"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, BellRing, AlertCircle } from "lucide-react";
import { TurnstileWidget } from "./TurnstileWidget";

const BRANCHEN = [
  "Büro & Verwaltung",
  "Gastronomie",
  "Arztpraxis / Praxis",
  "Hotel",
  "Werkstatt",
  "Einzelhandel",
  "Sonstiges",
];

export function FristencheckForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [branche, setBranche] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Turnstile-Widget lädt erst, wenn Nutzer wirklich mit dem Formular interagiert.
  // Spart das 17-KiB-Cloudflare-Script auf der Home-Page.
  const [turnstileReady, setTurnstileReady] = useState(false);
  const engage = () => setTurnstileReady(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Bitte schließen Sie die Sicherheitsprüfung ab.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/fristencheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: company || undefined,
          branche: branche || undefined,
          consentPrivacy: consent,
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setDone(true);
    } catch {
      setError("Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-lg p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-3 mx-auto">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Fristencheck aktiviert.</h3>
        <p className="text-sm text-muted-foreground">
          Wir melden uns rechtzeitig vor der nächsten Prüfung. Eine Bestätigung wurde an <strong>{email}</strong> gesendet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-lg p-6 md:p-8 space-y-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
          <BellRing className="h-4 w-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Kostenlos</p>
          <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">Automatischer Fristencheck</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Wir erinnern Sie rechtzeitig, bevor Ihre nächste DGUV V3 Prüfung fällig wird. Unverbindlich und jederzeit kündbar.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">E-Mail *</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={engage}
          placeholder="max@musterfirma.de"
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Unternehmen (optional)</label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Musterfirma GmbH"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="fristencheck-branche" className="block text-xs font-semibold text-foreground mb-1.5">Branche (optional)</label>
          <select
            id="fristencheck-branche"
            aria-label="Branche"
            value={branche}
            onChange={e => setBranche(e.target.value)}
            onFocus={engage}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
          >
            <option value="">Bitte wählen …</option>
            {BRANCHEN.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-border accent-foreground"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          Ich stimme zu, dass NeuraVolt mich zur DGUV V3 Fristerinnerung per E-Mail kontaktiert (<Link href="/#datenschutz" className="underline">Datenschutz</Link>).
        </span>
      </label>

      {turnstileReady && <TurnstileWidget onToken={setTurnstileToken} />}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="group w-full inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 disabled:opacity-60 transition"
      >
        {loading ? "Wird aktiviert …" : "Kostenlosen Fristencheck aktivieren"}
        {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </button>
    </form>
  );
}
