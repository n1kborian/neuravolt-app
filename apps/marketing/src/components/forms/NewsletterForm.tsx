"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { TurnstileWidget } from "./TurnstileWidget";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Bitte schließen Sie die Sicherheitsprüfung ab.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "ratgeber", consentPrivacy: consent, turnstileToken }),
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
      <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-lg p-8 text-center max-w-xl mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-3 mx-auto">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Fast geschafft.</h3>
        <p className="text-sm text-muted-foreground">
          Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet. Bitte klicken Sie auf den Link in der Mail, um Ihre Anmeldung abzuschließen (Double-Opt-In).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-lg p-6 md:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
          <Mail className="h-4 w-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Ratgeber-Newsletter</p>
          <h3 className="text-lg font-bold text-foreground leading-tight">Wissen, das sich rechnet.</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Praxisnahe Tipps zu DGUV V3, Fristen, Haftung und Kostenoptimierung — direkt in Ihr Postfach. Kostenlos, monatlich, jederzeit kündbar.
      </p>

      <div className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="max@musterfirma.de"
          className="w-full px-4 py-3 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
        />

        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border accent-foreground"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            Ich stimme zu, den NeuraVolt Ratgeber-Newsletter per E-Mail zu erhalten. Die Anmeldung wird per Double-Opt-In bestätigt (<Link href="/#datenschutz" className="underline">Datenschutz</Link>). Abmeldung jederzeit möglich.
          </span>
        </label>

        <TurnstileWidget onToken={setTurnstileToken} />

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
          {loading ? "Wird angemeldet …" : "Newsletter abonnieren"}
          {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  );
}
