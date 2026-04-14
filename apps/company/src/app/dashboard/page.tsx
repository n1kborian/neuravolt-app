import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Übersicht" };

const KPIS = [
  { label: "Offene Aufträge", value: "—" },
  { label: "Abgeschlossen", value: "—" },
  { label: "Nächste Prüfung", value: "—" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Willkommen, {user.profile.company_name ?? user.profile.full_name ?? "Unternehmen"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Hier verwalten Sie Ihre DGUV-V3-Prüfaufträge.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {KPIS.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg"
          >
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-background/80 p-8 text-center text-muted-foreground text-sm">
        Sobald Aufträge eingehen, erscheinen sie hier mit Status und Fälligkeit.
      </section>
    </div>
  );
}
