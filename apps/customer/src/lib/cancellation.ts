// Stornogebühr-Staffel für DGUV-Prüftermine.
// ≥ 4 Wochen:      kostenfrei
// 2–<4 Wochen:     25 %
// 1–<2 Wochen:     50 %
// < 1 Woche:       100 %

export type CancellableStatus = "new" | "contacted" | "quoted" | "scheduled";

export interface CancellationAssessment {
  canCancel: boolean;
  /** Tage bis zum Termin, null wenn kein Datum fixiert. */
  daysUntil: number | null;
  feePercent: 0 | 25 | 50 | 100;
  feeCents: number;
  /** Freitext-Begründung für die Gebühr. */
  explainer: string;
}

export function assessCancellation({
  status,
  appointmentDateIso,
  totalNetCents,
}: {
  status: string;
  appointmentDateIso: string | null;
  totalNetCents: number;
}): CancellationAssessment {
  // Abgeschlossene / bereits stornierte Termine können nicht gestornt werden.
  if (status === "completed") {
    return {
      canCancel: false,
      daysUntil: null,
      feePercent: 0,
      feeCents: 0,
      explainer: "Prüfung bereits abgeschlossen.",
    };
  }
  if (status === "cancelled") {
    return {
      canCancel: false,
      daysUntil: null,
      feePercent: 0,
      feeCents: 0,
      explainer: "Bereits storniert.",
    };
  }

  // Noch kein Partner hat den Auftrag gebucht — keine Kosten.
  if (status === "new" || status === "contacted" || status === "quoted") {
    return {
      canCancel: true,
      daysUntil: null,
      feePercent: 0,
      feeCents: 0,
      explainer: "Noch kein Partner gebucht — Stornierung kostenfrei.",
    };
  }

  // status === "scheduled"
  if (!appointmentDateIso) {
    return {
      canCancel: true,
      daysUntil: null,
      feePercent: 0,
      feeCents: 0,
      explainer: "Kein fester Termin fixiert — Stornierung aktuell kostenfrei.",
    };
  }

  const now = new Date();
  const target = new Date(appointmentDateIso);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      canCancel: false,
      daysUntil: 0,
      feePercent: 100,
      feeCents: totalNetCents,
      explainer: "Termin liegt in der Vergangenheit — nicht mehr stornierbar.",
    };
  }

  let feePercent: 0 | 25 | 50 | 100;
  let explainer: string;
  if (diffDays >= 28) {
    feePercent = 0;
    explainer = "Mehr als 4 Wochen bis zum Termin — kostenfreie Stornierung.";
  } else if (diffDays >= 14) {
    feePercent = 25;
    explainer = "2 bis 4 Wochen vor Termin — 25 % Stornogebühr fällig.";
  } else if (diffDays >= 7) {
    feePercent = 50;
    explainer = "1 bis 2 Wochen vor Termin — 50 % Stornogebühr fällig.";
  } else {
    feePercent = 100;
    explainer = "Weniger als 1 Woche vor Termin — 100 % Stornogebühr fällig.";
  }

  return {
    canCancel: true,
    daysUntil: diffDays,
    feePercent,
    feeCents: Math.round((feePercent / 100) * totalNetCents),
    explainer,
  };
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
    .format(cents / 100);
}
