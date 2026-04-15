"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

const branchen = [
  "Büro & Verwaltung",
  "Gastronomie",
  "Arztpraxis / Praxis",
  "Hotel",
  "Werkstatt",
  "Einzelhandel",
  "Sonstiges",
];

const deviceRanges = ["1–10 Geräte", "11–50 Geräte", "51–200 Geräte", "200+ Geräte"];

export function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [branche, setBranche] = useState("");
  const [deviceCountRange, setDeviceCountRange] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Bitte schließen Sie die Sicherheitsprüfung ab.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company: company || undefined,
          branche: branche || undefined,
          deviceCountRange: deviceCountRange || undefined,
          message: message || undefined,
          consentPrivacy: consent,
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setSubmitted(true);
    } catch {
      setError("Anfrage konnte nicht versendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@neuravolt.de.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-[#0a0a0a]">Anfrage erfolgreich gesendet!</h3>
        <p className="text-gray-500 max-w-sm">
          Wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot. Eine Bestätigung haben wir an {email} gesendet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
            Vorname <span className="text-foreground">*</span>
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Max"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
            Nachname <span className="text-foreground">*</span>
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Mustermann"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
          E-Mail-Adresse <span className="text-foreground">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="max@mustermann.de"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Unternehmen</label>
        <input
          type="text"
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Musterfirma GmbH"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Branche</label>
        <select
          value={branche}
          onChange={e => setBranche(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm bg-white"
        >
          <option value="">Bitte wählen...</option>
          {branchen.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Anzahl zu prüfender Geräte</label>
        <select
          value={deviceCountRange}
          onChange={e => setDeviceCountRange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm bg-white"
        >
          <option value="">Bitte wählen...</option>
          {deviceRanges.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Nachricht</label>
        <textarea
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Teilen Sie uns weitere Details zu Ihrem Unternehmen mit..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm resize-none"
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 accent-foreground"
        />
        <span className="text-xs text-gray-500 leading-relaxed">
          Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage gemäß der{" "}
          <Link href="/#datenschutz" className="underline">Datenschutzerklärung</Link> zu. Ich kann meine Einwilligung jederzeit widerrufen.
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
        className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-white font-semibold rounded-full hover:bg-foreground/90 active:scale-[0.99] transition-all shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>
            Anfrage senden
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Kostenlos &amp; unverbindlich · DSGVO-konform · Wir melden uns in 24 h
      </p>
    </form>
  );
}
