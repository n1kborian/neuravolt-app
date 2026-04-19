"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, MapPin, Calendar, Cpu, X } from "lucide-react";
import { cancelTermin, type CancelState } from "./actions";
import { assessCancellation, formatEuro } from "@/lib/cancellation";

export interface TerminRowData {
  id: string;
  status: string;
  createdAt: string;
  isFirstInspection: boolean;
  deviceCountNew: number;
  deviceCountExisting: number | null;
  desiredTimeframe: string | null;
  addressStreet: string | null;
  addressPostalCode: string | null;
  addressCity: string | null;
  cancelledAt: string | null;
  cancellationFeeCents: number | null;
  orderDesiredDate: string | null;
  orderBookedAt: string | null;
  orderTotalNetCents: number;
}

const STATUS_LABEL: Record<string, { label: string; tone: "neutral" | "success" | "warn" | "done" | "bad" }> = {
  new:        { label: "Eingegangen",       tone: "neutral" },
  contacted:  { label: "In Bearbeitung",    tone: "neutral" },
  quoted:     { label: "Angebot versendet", tone: "neutral" },
  scheduled:  { label: "Beauftragt",        tone: "success" },
  completed:  { label: "Abgeschlossen",     tone: "done" },
  cancelled:  { label: "Storniert",         tone: "bad" },
};

const TONE_CLASS: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-brand/10 text-foreground border border-brand",
  warn:    "bg-amber-50 text-amber-900 border border-amber-200",
  done:    "bg-muted text-muted-foreground",
  bad:     "bg-red-50 text-red-900 border border-red-200",
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(iso));
}

export function TerminRow({ data }: { data: TerminRowData }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CancelState, FormData>(cancelTermin, null);

  const statusInfo = STATUS_LABEL[data.status] ?? { label: data.status, tone: "neutral" as const };
  const totalDevices = data.deviceCountNew + (data.deviceCountExisting ?? 0);
  const address = [data.addressStreet, [data.addressPostalCode, data.addressCity].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ") || "—";

  const assessment = assessCancellation({
    status: data.status,
    appointmentDateIso: data.orderDesiredDate ?? data.orderBookedAt,
    totalNetCents: data.orderTotalNetCents,
  });

  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";

  return (
    <article className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${TONE_CLASS[statusInfo.tone]}`}>
              {statusInfo.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Anfrage vom {formatDate(data.createdAt)}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
            {data.isFirstInspection ? "Erstprüfung" : "Folgeprüfung"} · {totalDevices} Gerät{totalDevices === 1 ? "" : "e"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="truncate">{address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                {data.orderDesiredDate
                  ? formatDate(data.orderDesiredDate)
                  : data.desiredTimeframe ?? "Zeitraum offen"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Cpu className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                {data.deviceCountNew} neu
                {data.deviceCountExisting !== null ? ` · ${data.deviceCountExisting} bestehend` : ""}
              </span>
            </div>
            {data.orderTotalNetCents > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold">Festpreis:</span>
                <span>{formatEuro(data.orderTotalNetCents)} netto</span>
              </div>
            )}
          </div>

          {isCancelled && data.cancellationFeeCents !== null && (
            <p className="mt-3 text-xs text-red-700">
              Storniert am {formatDate(data.cancelledAt)}
              {data.cancellationFeeCents > 0
                ? ` — Stornogebühr ${formatEuro(data.cancellationFeeCents)}`
                : " — kostenfrei"}.
            </p>
          )}
        </div>

        {!isCancelled && !isCompleted && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" />
            Termin stornieren
          </button>
        )}
      </div>

      {/* Confirm dialog */}
      {confirmOpen && !state?.ok && (
        <div className="mt-4 rounded-xl border border-border bg-background p-4 md:p-5">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            Termin wirklich stornieren?
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {assessment.explainer}
          </p>
          {assessment.feeCents > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 mb-3">
              <p className="text-xs text-amber-900">
                <span className="font-semibold">Gebühr: {formatEuro(assessment.feeCents)}</span>
                {" "}({assessment.feePercent} % von {formatEuro(data.orderTotalNetCents)})
              </p>
            </div>
          )}
          {state && !state.ok && (
            <p className="text-xs text-red-600 mb-3">{state.error}</p>
          )}
          <form action={formAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="requestId" value={data.id} />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition disabled:opacity-60"
            >
              {pending ? "Storniere …" : "Ja, stornieren"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              Abbrechen
            </button>
          </form>
        </div>
      )}

      {state?.ok && (
        <div className="mt-4 rounded-xl border border-brand bg-brand/5 p-4">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            Termin storniert.
          </p>
          <p className="text-xs text-muted-foreground">
            {state.feeCents > 0
              ? `Stornogebühr: ${formatEuro(state.feeCents)} (${state.feePercent} %).`
              : "Kostenfrei storniert."}
          </p>
        </div>
      )}
    </article>
  );
}
