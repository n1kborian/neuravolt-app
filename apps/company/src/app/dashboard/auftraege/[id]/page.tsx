import Link from "next/link";

export const metadata = { title: "Auftrag" };

export default async function AuftragDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/dashboard/auftraege"
        className="text-sm text-muted-foreground hover:text-foreground transition"
      >
        ← Zurück zu allen Aufträgen
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Auftrag #{id}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Details, Geräteliste und Statusverlauf.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-background/80 p-12 text-center text-sm text-muted-foreground">
        Auftragsdetails werden geladen, sobald die Daten verfügbar sind.
      </div>
    </div>
  );
}
