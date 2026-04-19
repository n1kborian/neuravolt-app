import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarPlus } from "lucide-react";

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

      {/* Primary CTA — DGUV-Anfrage */}
      <Link
        href="/dashboard/anfrage"
        className="group block rounded-2xl border border-foreground bg-foreground text-background p-6 md:p-8 shadow-lg mb-6 md:mb-8 hover:bg-foreground/95 transition"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-background/20 bg-background/10">
            <CalendarPlus className="h-6 w-6 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-background/60 mb-1">
              DGUV V3 Prüfung
            </p>
            <h2 className="text-lg md:text-xl font-bold text-background mb-1">
              Jetzt Termin vereinbaren
            </h2>
            <p className="text-sm text-background/70">
              Angebot innerhalb von 24 Stunden — Festpreis, digital, rechtssicher.
            </p>
          </div>
          <div className="shrink-0 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-5 py-2.5 text-sm font-semibold self-start sm:self-center">
            Anfrage starten
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

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
