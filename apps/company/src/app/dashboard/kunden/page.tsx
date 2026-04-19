export const metadata = { title: "Kunden" };

export default function KundenPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Kunden</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Alle Auftraggeber mit Kontaktdaten und offenen Aufträgen.
          </p>
        </div>
        <button className="self-start rounded-full bg-foreground text-background text-sm font-semibold px-5 py-2.5 shrink-0">
          Kunde anlegen
        </button>
      </header>

      <div className="rounded-2xl border border-border bg-background/80 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <div className="col-span-4">Name</div>
              <div className="col-span-4">E-Mail</div>
              <div className="col-span-2">Aufträge</div>
              <div className="col-span-2">Letzter Kontakt</div>
            </div>
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Noch keine Kunden erfasst.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
