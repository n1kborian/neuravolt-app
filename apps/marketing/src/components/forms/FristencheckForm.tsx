"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BellRing,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import { TurnstileWidget } from "./TurnstileWidget";
import {
  DEVICE_CATEGORIES,
  ENVIRONMENTS,
  calculateFristen,
  formatGermanDate,
  type DeviceCategory,
  type Environment,
} from "@/lib/dguv-intervals";

type Step = "categories" | "environment" | "date" | "result";

export function FristencheckForm() {
  const [step, setStep] = useState<Step>("categories");
  const [categories, setCategories] = useState<DeviceCategory[]>([]);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [inspectionType, setInspectionType] = useState<"first" | "followup" | null>(null);
  const [lastInspection, setLastInspection] = useState<string>("");

  const [reminderActive, setReminderActive] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!environment || categories.length === 0 || !inspectionType) return null;
    // Erstmalige Prüfung: direkt "jetzt fällig", Intervalle zeigen die künftige Kadenz
    const effectiveDate = inspectionType === "first"
      ? new Date().toISOString().slice(0, 10)
      : lastInspection;
    if (!effectiveDate) return null;
    return calculateFristen({
      lastInspectionIso: effectiveDate,
      categories,
      environment,
    });
  }, [environment, categories, lastInspection, inspectionType]);

  function toggleCategory(value: DeviceCategory) {
    setCategories(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  function next() {
    if (step === "categories" && categories.length > 0) setStep("environment");
    else if (step === "environment" && environment) setStep("date");
    else if (step === "date") {
      if (inspectionType === "first") setStep("result");
      else if (inspectionType === "followup" && lastInspection) setStep("result");
    }
  }

  function back() {
    if (step === "environment") setStep("categories");
    else if (step === "date") setStep("environment");
    else if (step === "result") setStep("date");
  }

  async function submitReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!result || !email || !consent || !turnstileToken) return;
    setSubmitState("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/fristencheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: company || undefined,
          consentPrivacy: true,
          turnstileToken,
          deviceTypes: categories,
          environment,
          lastInspectionDate: lastInspection,
          nextDueDate: result.nextDue.toISOString().slice(0, 10),
          reminderActive: true,
        }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setErrorMsg("Erinnerung konnte nicht aktiviert werden. Bitte erneut versuchen.");
    }
  }

  const progress =
    step === "categories" ? 25 : step === "environment" ? 50 : step === "date" ? 75 : 100;

  return (
    <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
            <BellRing className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Kostenlos</p>
            <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">Automatischer Fristencheck</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Prüfen Sie in 3 Schritten, wann Ihre nächste DGUV V3 Prüfung fällig ist — optional mit Erinnerung.
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-foreground transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* ── Step 1: Categories ───────────────────────────────────── */}
        {step === "categories" && (
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Schritt 1 / 3</p>
            <h4 className="text-base font-bold text-foreground mb-1">
              Welche Gerätekategorien haben Sie?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Mehrfachauswahl. Die Kategorie mit der kürzesten Frist bestimmt Ihren nächsten Termin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEVICE_CATEGORIES.map(({ value, label, hint }) => {
                const checked = categories.includes(value);
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      checked
                        ? "border-foreground bg-foreground/5"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(value)}
                      className="mt-0.5 h-4 w-4 rounded border-border"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground">{label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end mt-5">
              <button
                type="button"
                disabled={categories.length === 0}
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Weiter
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Environment ──────────────────────────────────── */}
        {step === "environment" && (
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Schritt 2 / 3</p>
            <h4 className="text-base font-bold text-foreground mb-1">
              In welcher Umgebung werden die Geräte eingesetzt?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Die Einsatzumgebung bestimmt die zulässigen Prüfintervalle laut DGUV-Information 203-071.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ENVIRONMENTS.map(({ value, label, hint }) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    environment === value
                      ? "border-foreground bg-foreground/5"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="environment"
                    value={value}
                    checked={environment === value}
                    onChange={() => setEnvironment(value)}
                    className="sr-only"
                  />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between mt-5">
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 rounded-full border border-border text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </button>
              <button
                type="button"
                disabled={!environment}
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Weiter
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Inspection type + date ───────────────────────── */}
        {step === "date" && (
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Schritt 3 / 3</p>
            <h4 className="text-base font-bold text-foreground mb-1">
              Handelt es sich um die erste oder eine Wiederholungsprüfung?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Bei einer Erstprüfung ist kein Datum nötig — die Prüfung ist sofort fällig.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { value: "first",    title: "Erstmalige Prüfung", desc: "Geräte wurden noch nie nach DGUV V3 geprüft." },
                { value: "followup", title: "Wiederholungsprüfung", desc: "Es gab bereits eine frühere Prüfung." },
              ].map(({ value, title, desc }) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    inspectionType === value
                      ? "border-foreground bg-foreground/5"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="inspectionType"
                    value={value}
                    checked={inspectionType === value}
                    onChange={() => setInspectionType(value as "first" | "followup")}
                    className="sr-only"
                  />
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </label>
              ))}
            </div>

            {inspectionType === "followup" && (
              <div>
                <label htmlFor="last-inspection-date" className="block text-sm font-semibold text-foreground mb-1.5">
                  Datum der letzten Prüfung
                </label>
                <input
                  id="last-inspection-date"
                  type="date"
                  value={lastInspection}
                  onChange={e => setLastInspection(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-5">
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 rounded-full border border-border text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </button>
              <button
                type="button"
                disabled={!inspectionType || (inspectionType === "followup" && !lastInspection)}
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Ergebnis anzeigen
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Result + reminder ────────────────────────────── */}
        {step === "result" && result && (
          <div>
            {/* Haupt-Ergebnis */}
            {inspectionType === "first" ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-800 mb-1">
                      Erstprüfung fällig
                    </p>
                    <p className="text-2xl font-bold text-amber-900">Jetzt prüfen lassen</p>
                    <p className="text-sm text-amber-800 mt-1">
                      Die erste DGUV V3 Prüfung sollte vor der Inbetriebnahme stattfinden — danach alle {result.intervalMonths} Monate.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl border p-5 mb-5 ${
                result.overdue
                  ? "border-red-200 bg-red-50"
                  : result.daysUntil <= 42
                  ? "border-amber-200 bg-amber-50"
                  : "border-brand bg-brand/5"
              }`}>
                <div className="flex items-start gap-3">
                  {result.overdue ? (
                    <AlertCircle className="h-5 w-5 text-red-700 shrink-0 mt-0.5" />
                  ) : (
                    <CalendarClock className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold tracking-[0.2em] uppercase mb-1 ${
                      result.overdue ? "text-red-800" : "text-muted-foreground"
                    }`}>
                      {result.overdue ? "Prüfung überfällig" : "Nächste Prüfung fällig am"}
                    </p>
                    <p className={`text-2xl font-bold ${result.overdue ? "text-red-900" : "text-foreground"}`}>
                      {formatGermanDate(result.nextDue)}
                    </p>
                    <p className={`text-sm mt-1 ${result.overdue ? "text-red-800" : "text-muted-foreground"}`}>
                      {result.overdue
                        ? `seit ${Math.abs(result.daysUntil)} Tagen überfällig`
                        : `in ${result.daysUntil} Tagen · ${result.intervalMonths} Monate Intervall`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pro-Kategorie-Breakdown */}
            <div className="rounded-xl border border-border bg-background/60 p-4 mb-5">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Intervalle pro Kategorie
              </p>
              <ul className="space-y-2">
                {result.categoryIntervals.map(({ category, label, months }) => (
                  <li key={category} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{label}</span>
                    <span className="text-muted-foreground">alle {months} Monate</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Richtwerte laut DGUV-Information 203-071 (Tabelle 3 und 4). Für Baustellen oder besonders raue Umgebungen gelten kürzere Fristen von 1–3 Monaten — hier ist eine individuelle Gefährdungsbeurteilung der Elektrofachkraft erforderlich.
              </p>
            </div>

            {/* Reminder Opt-In */}
            {submitState === "success" ? (
              <div className="rounded-xl border border-brand bg-brand/5 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Erinnerung aktiviert.</p>
                  <p className="text-xs text-muted-foreground">
                    Wir melden uns 6 Wochen vor Ihrem nächsten Prüftermin an <strong>{email}</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={submitReminder} className="rounded-xl border border-border bg-background/60 p-4 space-y-3">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={reminderActive}
                    onChange={e => { setReminderActive(e.target.checked); if (e.target.checked) setTurnstileReady(true); }}
                    className="mt-1 h-4 w-4 rounded border-border"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <BellRing className="h-4 w-4" />
                      6 Wochen vorher per E-Mail erinnern
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Kostenlos, jederzeit kündbar.
                    </span>
                  </span>
                </label>

                {reminderActive && (
                  <div className="space-y-3 pl-6">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="max@musterfirma.de"
                      onFocus={() => setTurnstileReady(true)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
                    />
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="Unternehmen (optional)"
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
                    />
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={e => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-border"
                      />
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        Ich stimme zu, dass NeuraVolt meine E-Mail für die Fristerinnerung speichert (<Link href="/#datenschutz" className="underline">Datenschutz</Link>).
                      </span>
                    </label>
                    {turnstileReady && <TurnstileWidget onToken={setTurnstileToken} />}
                    {errorMsg && (
                      <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={!email || !consent || !turnstileToken || submitState === "loading"}
                      className="w-full rounded-full bg-foreground text-background py-2.5 text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitState === "loading" ? "Wird aktiviert …" : "Erinnerung aktivieren"}
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-3 w-3" />
                Werte ändern
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition"
              >
                Prüfung jetzt anfragen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
