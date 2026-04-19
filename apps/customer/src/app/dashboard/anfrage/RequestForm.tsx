"use client";

import { useState } from "react";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Minus, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { submitInspectionRequest } from "./actions";
import { DEVICE_TYPES, SHORT_INTERVAL_VALUES, TIMEFRAMES, type ActionState } from "./constants";

export function RequestForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    submitInspectionRequest,
    null
  );

  const [inspectionType, setInspectionType] = useState<"first" | "followup">("first");
  const [deviceCountNew, setDeviceCountNew] = useState(20);
  const [deviceCountExisting, setDeviceCountExisting] = useState(0);
  const [deviceTypes, setDeviceTypes] = useState<string[]>([]);

  const hasShortInterval = deviceTypes.some(v => SHORT_INTERVAL_VALUES.includes(v));
  const total = deviceCountNew + (inspectionType === "followup" ? deviceCountExisting : 0);

  if (state?.ok) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand bg-brand/10 mb-4">
          <CheckCircle2 className="h-7 w-7 text-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Anfrage eingegangen</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          Vielen Dank. Wir prüfen Ihre Anfrage und melden uns innerhalb von 24 Stunden mit einem Festpreis-Angebot.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition"
          >
            Zur Übersicht
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full border border-border text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-muted transition"
          >
            Weitere Anfrage
          </button>
        </div>
      </div>
    );
  }

  const fieldErrors = state && !state.ok ? state.fieldErrors ?? {} : {};

  function toggleType(value: string) {
    setDeviceTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Inspection type */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-3">
          Was für eine Prüfung benötigen Sie?
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: "first",    title: "Erstprüfung",    desc: "Erste DGUV V3 Prüfung Ihrer Betriebsmittel." },
            { value: "followup", title: "Folgeprüfung",  desc: "Wiederholungsprüfung nach Fristablauf." },
          ].map(({ value, title, desc }) => (
            <label
              key={value}
              className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition ${
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
              <span className="text-sm font-semibold text-foreground">{title}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Device counts */}
      {inspectionType === "first" ? (
        <Counter
          label="Anzahl der zu prüfenden Geräte"
          name="deviceCountNew"
          value={deviceCountNew}
          onChange={setDeviceCountNew}
          error={fieldErrors.deviceCountNew}
        />
      ) : (
        <div className="space-y-4">
          <Counter
            label="Bereits geprüfte Geräte"
            hint="Geräte aus der letzten DGUV-Prüfung, die erneut geprüft werden müssen."
            name="deviceCountExisting"
            value={deviceCountExisting}
            onChange={setDeviceCountExisting}
            error={fieldErrors.deviceCountExisting}
          />
          <Counter
            label="Neue Geräte"
            hint="Geräte, die seit der letzten Prüfung hinzugekommen sind und erstmals geprüft werden."
            name="deviceCountNew"
            value={deviceCountNew}
            onChange={setDeviceCountNew}
            error={fieldErrors.deviceCountNew}
          />
          <div>
            <label htmlFor="lastInspectionDate" className="block text-sm font-semibold text-foreground mb-1.5">
              Datum der letzten Prüfung
            </label>
            <input
              id="lastInspectionDate"
              type="date"
              name="lastInspectionDate"
              required
              max={new Date().toISOString().slice(0, 10)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition"
            />
            {fieldErrors.lastInspectionDate && (
              <p className="text-xs text-red-600 mt-1.5">{fieldErrors.lastInspectionDate}</p>
            )}
          </div>
          {total > 0 && (
            <p className="text-xs text-muted-foreground">
              Insgesamt zu prüfen: <span className="font-semibold text-foreground">{total} Gerät{total === 1 ? "" : "e"}</span>
            </p>
          )}
        </div>
      )}

      {/* Device types */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-1">
          Welche Gerätekategorien sind enthalten?
        </legend>
        <p className="text-xs text-muted-foreground mb-3">
          Mehrfachauswahl möglich — einige Kategorien haben kürzere Prüfintervalle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEVICE_TYPES.map(({ value, label, hint }) => {
            const checked = deviceTypes.includes(value);
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
                  name="deviceTypes"
                  value={value}
                  checked={checked}
                  onChange={() => toggleType(value)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-foreground focus:ring-foreground"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>
                </span>
              </label>
            );
          })}
        </div>
        {fieldErrors.deviceTypes && (
          <p className="text-xs text-red-600 mt-2">{fieldErrors.deviceTypes}</p>
        )}
        {hasShortInterval && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <Sparkles className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              Für die gewählten Kategorien gelten je nach Einsatzumgebung verkürzte Prüfintervalle (3–12 Monate) laut DGUV-Information 203-071. Wir berücksichtigen das bei der Terminplanung.
            </p>
          </div>
        )}
      </fieldset>

      {/* Timeframe */}
      <div>
        <label htmlFor="desiredTimeframe" className="block text-sm font-semibold text-foreground mb-1.5">
          Wunschzeitraum für die Prüfung
        </label>
        <select
          id="desiredTimeframe"
          name="desiredTimeframe"
          required
          defaultValue=""
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition"
        >
          <option value="" disabled>Bitte wählen …</option>
          {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {fieldErrors.desiredTimeframe && (
          <p className="text-xs text-red-600 mt-1.5">{fieldErrors.desiredTimeframe}</p>
        )}
      </div>

      {/* Address */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-1">
          Adresse der Durchführung
        </legend>
        <p className="text-xs text-muted-foreground mb-3">
          Anschrift, an der die Prüfung stattfinden soll — die Partnerfachkraft kommt direkt dorthin.
        </p>
        <div className="space-y-3">
          <div>
            <input
              type="text"
              name="addressStreet"
              placeholder="Straße und Hausnummer"
              autoComplete="street-address"
              required
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition"
            />
            {fieldErrors.addressStreet && (
              <p className="text-xs text-red-600 mt-1.5">{fieldErrors.addressStreet}</p>
            )}
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              <input
                type="text"
                name="addressPostalCode"
                placeholder="PLZ"
                autoComplete="postal-code"
                inputMode="numeric"
                required
                maxLength={5}
                pattern="\d{4,5}"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition"
              />
              {fieldErrors.addressPostalCode && (
                <p className="text-xs text-red-600 mt-1.5">{fieldErrors.addressPostalCode}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="addressCity"
                placeholder="Ort"
                autoComplete="address-level2"
                required
                maxLength={120}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition"
              />
              {fieldErrors.addressCity && (
                <p className="text-xs text-red-600 mt-1.5">{fieldErrors.addressCity}</p>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-foreground mb-1.5">
          Anmerkungen <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={2000}
          placeholder="Besondere Hinweise zum Standort, Zugang, Ansprechpartner vor Ort …"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition resize-y"
        />
        {fieldErrors.notes && (
          <p className="text-xs text-red-600 mt-1.5">{fieldErrors.notes}</p>
        )}
      </div>

      {/* Global error */}
      {state && !state.ok && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
          <p className="text-sm text-red-900">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center w-full sm:w-auto rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Wird übermittelt …" : "Anfrage absenden"}
      </button>
    </form>
  );
}

function Counter({
  label,
  hint,
  name,
  value,
  onChange,
  min = 0,
  max = 10000,
  error,
}: {
  label: string;
  hint?: string;
  name: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      {hint && <p className="text-xs text-muted-foreground mt-0.5 mb-2">{hint}</p>}
      <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background p-1 mt-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition text-foreground"
          aria-label="Weniger"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          id={name}
          name={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={e => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);
          }}
          className="w-16 text-center bg-transparent text-foreground font-semibold text-base focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition text-foreground"
          aria-label="Mehr"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
