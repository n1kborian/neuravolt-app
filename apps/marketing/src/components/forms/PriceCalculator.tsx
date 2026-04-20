"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calculator,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react";
import { formatEuro, PRICING } from "@/lib/pricing";
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

const TIMEFRAMES = [
  "Innerhalb des nächsten Monats",
  "Innerhalb der nächsten 3 Monate",
  "Innerhalb der nächsten 6 Monate",
  "Frei wählbarer Zeitraum",
] as const;

const CUSTOM_TIMEFRAME = "Frei wählbarer Zeitraum";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type SubmitState = "idle" | "loading" | "success" | "error";

interface WizardState {
  branche: string;
  deviceCount: number;
  isFirstInspection: boolean | null;
  desiredTimeframe: string;
  customStart: string;
  customEnd: string;
  postalCode: string;
  city: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  consentPrivacy: boolean;
}

const INITIAL: WizardState = {
  branche: "",
  deviceCount: 20,
  isFirstInspection: null,
  desiredTimeframe: "",
  customStart: "",
  customEnd: "",
  postalCode: "",
  city: "",
  company: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  consentPrivacy: false,
};

export function PriceCalculator() {
  const [step, setStep] = useState<Step>(0);
  const [state, setState] = useState<WizardState>(INITIAL);
  const [submit, setSubmit] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
    setState(prev => ({ ...prev, [key]: value }));

  const canNext = (): boolean => {
    switch (step) {
      case 0: return state.branche !== "";
      case 1: return state.deviceCount > 0;
      case 2: return state.isFirstInspection !== null;
      case 3: {
        if (state.desiredTimeframe === "") return false;
        if (state.desiredTimeframe === CUSTOM_TIMEFRAME) {
          return state.customStart !== "" && state.customEnd !== "" && state.customStart <= state.customEnd;
        }
        return true;
      }
      case 4: return state.postalCode.length >= 4 && state.city.length >= 2;
      case 5: return (
        state.firstName.length > 0 &&
        state.lastName.length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) &&
        state.consentPrivacy &&
        turnstileToken.length > 0
      );
      default: return false;
    }
  };

  const next = () => setStep(s => Math.min(6, s + 1) as Step);
  const prev = () => setStep(s => Math.max(0, s - 1) as Step);

  const handleSubmit = async () => {
    if (!canNext()) return;
    setSubmit("loading");
    setErrorMsg(null);
    try {
      const timeframeValue =
        state.desiredTimeframe === CUSTOM_TIMEFRAME
          ? `Frei wählbar: ${formatDateDe(state.customStart)} – ${formatDateDe(state.customEnd)}`
          : state.desiredTimeframe;

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branche: state.branche,
          deviceCount: state.deviceCount,
          isFirstInspection: state.isFirstInspection,
          desiredTimeframe: timeframeValue,
          postalCode: state.postalCode,
          city: state.city,
          company: state.company || undefined,
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          phone: state.phone || undefined,
          notes: state.notes || undefined,
          consentPrivacy: state.consentPrivacy,
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Fehler beim Absenden");
      }
      setSubmit("success");
      setStep(6);
    } catch (err) {
      console.error(err);
      setSubmit("error");
      setErrorMsg("Das Angebot konnte nicht versendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt unter info@neuravolt.de.");
    }
  };

  const progress = ((step + (submit === "success" ? 1 : 0)) / 6) * 100;

  return (
    <div className="rounded-3xl border border-border bg-background/90 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-muted relative">
        <motion.div
          className="absolute inset-y-0 left-0 bg-brand"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
            <Calculator className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Preisrechner</p>
            <p className="text-sm text-muted-foreground">
              {submit === "success" ? "Angebot versendet" : `Schritt ${step + 1} von 6`}
            </p>
          </div>
        </div>

        <div>
          <div className="min-h-[340px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <StepWrapper key="0">
                  <StepTitle>In welcher Branche sind Sie tätig?</StepTitle>
                  <StepHint>Das hilft uns, branchenspezifische Prüfintervalle richtig einzuordnen.</StepHint>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BRANCHEN.map(b => (
                      <OptionButton
                        key={b}
                        active={state.branche === b}
                        onClick={() => update("branche", b)}
                      >
                        {b}
                      </OptionButton>
                    ))}
                  </div>
                </StepWrapper>
              )}

              {step === 1 && (
                <StepWrapper key="1">
                  <StepTitle>Wie viele Geräte sollen geprüft werden?</StepTitle>
                  <StepHint>
                    Zählen Sie alle elektrischen Betriebsmittel (PCs, Drucker, Kaffeemaschinen, Werkzeuge, Verlängerungskabel &hellip;). Eine grobe Schätzung reicht.
                  </StepHint>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Weniger Geräte"
                      onClick={() => update("deviceCount", Math.max(1, state.deviceCount - 5))}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:border-foreground transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={state.deviceCount}
                      onChange={e => update("deviceCount", Math.max(1, parseInt(e.target.value || "1", 10)))}
                      className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-center text-lg font-bold text-foreground focus:outline-none focus:border-foreground"
                    />
                    <button
                      type="button"
                      aria-label="Mehr Geräte"
                      onClick={() => update("deviceCount", state.deviceCount + 5)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background hover:border-foreground transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[10, 25, 50, 100, 250].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => update("deviceCount", n)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground hover:border-foreground hover:text-foreground transition"
                      >
                        {n} Geräte
                      </button>
                    ))}
                  </div>
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper key="2">
                  <StepTitle>Handelt es sich um eine Erstprüfung?</StepTitle>
                  <StepHint>Bei der Erstprüfung kommt einmalig ein Einrichtungspreis von {formatEuro(PRICING.setupFeeFirstInspection)} hinzu. Bei Folgeprüfungen entfällt dieser Betrag.</StepHint>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <OptionButton
                      active={state.isFirstInspection === true}
                      onClick={() => update("isFirstInspection", true)}
                    >
                      Ja, Erstprüfung
                    </OptionButton>
                    <OptionButton
                      active={state.isFirstInspection === false}
                      onClick={() => update("isFirstInspection", false)}
                    >
                      Nein, Folgeprüfung
                    </OptionButton>
                  </div>
                </StepWrapper>
              )}

              {step === 3 && (
                <StepWrapper key="3">
                  <StepTitle>Wann soll die Prüfung stattfinden?</StepTitle>
                  <StepHint>Je flexibler und weiter im Voraus, desto besser können wir Aufträge bündeln — wodurch Sie sparen.</StepHint>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIMEFRAMES.map(t => (
                      <OptionButton
                        key={t}
                        active={state.desiredTimeframe === t}
                        onClick={() => update("desiredTimeframe", t)}
                      >
                        {t}
                      </OptionButton>
                    ))}
                  </div>
                  {state.desiredTimeframe === CUSTOM_TIMEFRAME && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">Von</label>
                        <input
                          type="date"
                          value={state.customStart}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={e => update("customStart", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">Bis</label>
                        <input
                          type="date"
                          value={state.customEnd}
                          min={state.customStart || new Date().toISOString().slice(0, 10)}
                          onChange={e => update("customEnd", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                  )}
                </StepWrapper>
              )}

              {step === 4 && (
                <StepWrapper key="4">
                  <StepTitle>Wo befindet sich Ihr Betrieb?</StepTitle>
                  <StepHint>Wir prüfen in Stuttgart und der gesamten Metropolregion. Die Anfahrtspauschale ist bereits im Preis enthalten.</StepHint>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                    <TextField
                      label="PLZ"
                      value={state.postalCode}
                      onChange={v => update("postalCode", v)}
                      placeholder="70173"
                    />
                    <TextField
                      label="Stadt"
                      value={state.city}
                      onChange={v => update("city", v)}
                      placeholder="Stuttgart"
                    />
                  </div>
                </StepWrapper>
              )}

              {step === 5 && (
                <StepWrapper key="5">
                  <StepTitle>Ihre Kontaktdaten</StepTitle>
                  <StepHint>Wir senden Ihnen Ihr unverbindliches Angebot direkt per E-Mail.</StepHint>
                  <div className="space-y-3">
                    <TextField
                      label="Unternehmen"
                      value={state.company}
                      onChange={v => update("company", v)}
                      placeholder="Musterfirma GmbH"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TextField
                        label="Vorname *"
                        value={state.firstName}
                        onChange={v => update("firstName", v)}
                        placeholder="Max"
                      />
                      <TextField
                        label="Nachname *"
                        value={state.lastName}
                        onChange={v => update("lastName", v)}
                        placeholder="Mustermann"
                      />
                    </div>
                    <TextField
                      label="E-Mail *"
                      type="email"
                      value={state.email}
                      onChange={v => update("email", v)}
                      placeholder="max@musterfirma.de"
                    />
                    <TextField
                      label="Telefon (optional)"
                      value={state.phone}
                      onChange={v => update("phone", v)}
                      placeholder="+49 711 000 000"
                    />
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Anmerkungen (optional)</label>
                      <textarea
                        rows={3}
                        value={state.notes}
                        onChange={e => update("notes", e.target.value)}
                        placeholder="Besonderheiten, Zugangsregelung, Parkplatzsituation …"
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground resize-none"
                      />
                    </div>
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={state.consentPrivacy}
                        onChange={e => update("consentPrivacy", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border accent-foreground"
                      />
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        Ich stimme der Verarbeitung meiner Angaben zur Angebotserstellung gemäß der{" "}
                        <Link href="/#datenschutz" className="underline">Datenschutzerklärung</Link> zu. Ich kann meine Einwilligung jederzeit widerrufen.
                      </span>
                    </label>
                    <TurnstileWidget onToken={setTurnstileToken} />
                  </div>
                </StepWrapper>
              )}

              {step === 6 && submit === "success" && (
                <StepWrapper key="6">
                  <div className="flex flex-col items-center text-center py-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 mb-4">
                      <CheckCircle2 className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Angebot erfolgreich versendet</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Wir haben Ihnen Ihr individuelles Angebot per E-Mail an <strong>{state.email}</strong> geschickt. Unser Team meldet sich zusätzlich innerhalb von 24 Stunden mit einem konkreten Terminvorschlag.
                    </p>
                  </div>
                </StepWrapper>
              )}
            </AnimatePresence>

            {errorMsg && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Nav buttons */}
            {step < 6 && (
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Zurück
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canNext()}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Weiter
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canNext() || submit === "loading"}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {submit === "loading" ? "Wird versendet …" : "Angebot per E-Mail erhalten"}
                    {submit !== "loading" && <ArrowRight className="h-4 w-4" />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{children}</h3>;
}

function StepHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-6">{children}</p>;
}

function OptionButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function formatDateDe(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
      />
    </div>
  );
}

