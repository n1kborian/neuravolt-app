import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Übersicht" };

const KPIS = [
  { label: "Meine Geräte", value: "—" },
  { label: "Letzte Prüfung", value: "—" },
  { label: "Nächste Prüfung", value: "—" },
];

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          Hallo, {user.profile.full_name ?? "Kunde"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Hier sehen Sie Ihre Prüfprotokolle, Geräte und Termine.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {KPIS.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-5 md:p-6 shadow-lg"
          >
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-background/80 p-6 md:p-8 text-center text-muted-foreground text-sm">
        Sobald die erste Prüfung abgeschlossen ist, erscheinen hier Ihre Protokolle und der nächste Pflichttermin.
      </section>
    </div>
  );
}
