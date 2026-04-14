export const metadata = { title: "Geräte" };

export default function GeraetePage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Gerätekatalog</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Alle erfassten Geräte über alle Kunden hinweg.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-background/80 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-3">Gerät</div>
          <div className="col-span-3">Seriennr.</div>
          <div className="col-span-3">Kunde</div>
          <div className="col-span-3">Status</div>
        </div>
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          Noch keine Geräte erfasst.
        </div>
      </div>
    </div>
  );
}
