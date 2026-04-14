export const metadata = { title: "Prüfprotokolle" };

export default function ProtokollePage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Prüfprotokolle</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Alle DGUV-V3-Prüfprotokolle als Nachweis für Versicherung und Audit.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-background/80 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-3">Datum</div>
          <div className="col-span-4">Auftrag</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2 text-right">Aktion</div>
        </div>
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          Noch keine Prüfprotokolle vorhanden.
        </div>
      </div>
    </div>
  );
}
