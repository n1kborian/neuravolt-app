"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const branchen = [
  "Büro & Verwaltung",
  "Gastronomie",
  "Arztpraxis / Praxis",
  "Hotel",
  "Werkstatt",
  "Einzelhandel",
  "Sonstiges",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-[#0a0a0a]">Anfrage erfolgreich gesendet!</h3>
        <p className="text-gray-500 max-w-sm">
          Wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot.
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
          placeholder="max@mustermann.de"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
          Unternehmen
        </label>
        <input
          type="text"
          placeholder="Musterfirma GmbH"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
          Branche
        </label>
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm bg-white">
          <option value="">Bitte wählen...</option>
          {branchen.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
          Anzahl zu prüfender Geräte
        </label>
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm bg-white">
          <option value="">Bitte wählen...</option>
          <option>1–10 Geräte</option>
          <option>11–50 Geräte</option>
          <option>51–200 Geräte</option>
          <option>200+ Geräte</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
          Nachricht
        </label>
        <textarea
          rows={4}
          placeholder="Teilen Sie uns weitere Details zu Ihrem Unternehmen mit..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a0a0a] placeholder-gray-300 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
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
        Kostenlos &amp; unverbindlich · Keine Weitergabe Ihrer Daten · DSGVO-konform
      </p>
    </form>
  );
}
