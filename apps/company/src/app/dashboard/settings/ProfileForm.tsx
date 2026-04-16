"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Save } from "lucide-react";
import { updateProfile, type ProfileData } from "./actions";

interface ProfileFormProps {
  initialData: ProfileData;
  email: string;
}

export function ProfileForm({ initialData, email }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [companyName, setCompanyName] = useState(initialData.companyName);
  const [phone, setPhone] = useState(initialData.phone);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  const hasChanges =
    fullName !== initialData.fullName ||
    companyName !== initialData.companyName ||
    phone !== initialData.phone;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await updateProfile({ fullName, companyName, phone });
      setResult(res);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-border bg-background/80 divide-y divide-border">
        <Field label="E-Mail" hint="Kann aktuell nicht geändert werden.">
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground text-sm cursor-not-allowed"
          />
        </Field>

        <Field label="Ansprechpartner / Name">
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Max Mustermann"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition"
          />
        </Field>

        <Field label="Firmenname">
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Musterfirma GmbH"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition"
          />
        </Field>

        <Field label="Telefon">
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+49 711 000 000"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition"
          />
        </Field>
      </div>

      {result?.ok && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Änderungen gespeichert.
        </div>
      )}

      {result && !result.ok && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {result.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !hasChanges}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Wird gespeichert …" : "Änderungen speichern"}
      </button>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5">
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      {children}
    </div>
  );
}
