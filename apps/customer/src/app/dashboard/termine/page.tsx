export const metadata = { title: "Termine" };

export default function TerminePage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Termine</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Geplante und vergangene Prüftermine.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-background/80 p-12 text-center text-sm text-muted-foreground">
        Aktuell sind keine Termine geplant.
      </div>
    </div>
  );
}
