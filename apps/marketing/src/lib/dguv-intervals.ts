// DGUV-Prüfintervalle (Richtwerte laut DGUV-Information 203-071 / TRBS 1201).
// Ausgangspunkt für die Fristen-Rechnung auf /dguv-check — der User
// erhält eine konservative Einschätzung, die bei jeder Prüfung einzeln
// durch die Gefährdungsbeurteilung der EFK nachjustiert werden kann.

export type DeviceCategory =
  | "ortsveraenderlich"
  | "verlaengerung"
  | "handwerkzeug_maschinen"
  | "ortsfeste_anlagen";

export type Environment = "buero" | "werkstatt";

export const DEVICE_CATEGORIES: Array<{
  value: DeviceCategory;
  label: string;
  hint: string;
  shortInterval: boolean;
}> = [
  {
    value: "ortsveraenderlich",
    label: "Ortsveränderliche Betriebsmittel",
    hint: "PCs, Drucker, Küchengeräte, Ladegeräte",
    shortInterval: false,
  },
  {
    value: "verlaengerung",
    label: "Verlängerungen & Steckdosenleisten",
    hint: "Kürzere Prüfintervalle (3–12 Monate, je nach Einsatz)",
    shortInterval: true,
  },
  {
    value: "handwerkzeug_maschinen",
    label: "Handwerkzeug & Maschinen",
    hint: "Bohrmaschinen, Sägen, Werkstattmaschinen",
    shortInterval: true,
  },
  {
    value: "ortsfeste_anlagen",
    label: "Ortsfeste Anlagen",
    hint: "Unterverteilungen, Schaltschränke, FI-Schutzschalter",
    shortInterval: false,
  },
];

export const ENVIRONMENTS: Array<{
  value: Environment;
  label: string;
  hint: string;
}> = [
  {
    value: "buero",
    label: "Büro / Praxis / Einzelhandel",
    hint: "Leichte Beanspruchung, trockene Umgebung",
  },
  {
    value: "werkstatt",
    label: "Werkstatt / Gastro / Gewerbe",
    hint: "Regelmäßige Beanspruchung, Feuchtigkeit, höhere Nutzung",
  },
];

/**
 * Empfohlenes Intervall in Monaten pro Kategorie und Einsatzumgebung.
 * Werte nach DGUV-Information 203-071, Tabelle 3 und 4 (Büro- bzw.
 * Werkstatt-/Gewerbe-Richtwerte). Baustellen und Sonderumgebungen
 * erfordern eine eigene Gefährdungsbeurteilung — dort sind Fristen
 * von 1–3 Monaten üblich.
 */
export const INTERVAL_MONTHS: Record<DeviceCategory, Record<Environment, number>> = {
  ortsveraenderlich:      { buero: 24, werkstatt: 12 },
  verlaengerung:          { buero: 12, werkstatt: 6 },
  handwerkzeug_maschinen: { buero: 24, werkstatt: 12 },
  ortsfeste_anlagen:      { buero: 48, werkstatt: 48 },
};

export interface CategoryInterval {
  category: DeviceCategory;
  label: string;
  months: number;
}

export function getCategoryIntervals(
  categories: DeviceCategory[],
  env: Environment
): CategoryInterval[] {
  return categories.map(cat => ({
    category: cat,
    label: DEVICE_CATEGORIES.find(c => c.value === cat)?.label ?? cat,
    months: INTERVAL_MONTHS[cat][env],
  }));
}

/**
 * Das kürzeste Intervall bestimmt das Datum der nächsten fälligen Prüfung
 * — alle anderen wurden ja gleichzeitig geprüft und wären später fällig.
 */
export function shortestIntervalMonths(
  categories: DeviceCategory[],
  env: Environment
): number | null {
  if (categories.length === 0) return null;
  return Math.min(...categories.map(c => INTERVAL_MONTHS[c][env]));
}

export function addMonths(iso: string, months: number): Date {
  const d = new Date(iso);
  const target = new Date(d);
  target.setMonth(target.getMonth() + months);
  return target;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export interface FristenResult {
  nextDue: Date;
  daysUntil: number;
  intervalMonths: number;
  categoryIntervals: CategoryInterval[];
  overdue: boolean;
}

export function calculateFristen(input: {
  lastInspectionIso: string;
  categories: DeviceCategory[];
  environment: Environment;
  now?: Date;
}): FristenResult | null {
  const interval = shortestIntervalMonths(input.categories, input.environment);
  if (interval === null) return null;
  const nextDue = addMonths(input.lastInspectionIso, interval);
  const now = input.now ?? new Date();
  const daysUntil = daysBetween(now, nextDue);
  return {
    nextDue,
    daysUntil,
    intervalMonths: interval,
    categoryIntervals: getCategoryIntervals(input.categories, input.environment),
    overdue: daysUntil < 0,
  };
}

export function formatGermanDate(d: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}
