import Link from "next/link";

export const metadata = { title: "Aufträge" };

const TABS = [
  { key: "all", label: "Alle" },
  { key: "pending", label: "Offen" },
  { key: "scheduled", label: "Terminiert" },
  { key: "completed", label: "Abgeschlossen" },
];

export default async function AuftraegePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;

  return (
    <div className="p-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aufträge</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Alle Prüfaufträge nach Status filterbar.
          </p>
        </div>
        <button className="rounded-full bg-foreground text-background text-sm font-semibold px-5 py-2.5">
          Neuer Auftrag
        </button>
      </header>

      <div className="flex gap-2 mb-6">
        {TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === "all" ? "/dashboard/auftraege" : `/dashboard/auftraege?status=${key}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              status === key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-background/80 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-4">Kunde</div>
          <div className="col-span-2">Geräte</div>
          <div className="col-span-3">Termin</div>
          <div className="col-span-3">Status</div>
        </div>
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          Noch keine Aufträge vorhanden.
        </div>
      </div>
    </div>
  );
}
