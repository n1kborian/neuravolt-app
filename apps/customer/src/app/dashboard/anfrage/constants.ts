export const DEVICE_TYPES = [
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
    hint: "Bohrmaschinen, Sägen, Werkstattmaschinen — 3–12 Monate in Werkstätten",
    shortInterval: true,
  },
  {
    value: "ortsfeste_anlagen",
    label: "Ortsfeste Anlagen",
    hint: "Unterverteilungen, Schaltschränke, FI-Schutzschalter",
    shortInterval: false,
  },
] as const;

export const SHORT_INTERVAL_VALUES = DEVICE_TYPES
  .filter(t => t.shortInterval)
  .map(t => t.value) as readonly string[];

export const TIMEFRAMES = [
  "So bald wie möglich",
  "Innerhalb des nächsten Monats",
  "Innerhalb der nächsten 3 Monate",
  "Innerhalb der nächsten 6 Monate",
  "Flexibel",
] as const;

export type ActionState =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
  | null;
