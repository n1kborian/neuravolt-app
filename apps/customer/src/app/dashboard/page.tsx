import { getCurrentUser, getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarPlus, Calendar, MapPin } from "lucide-react";

export const metadata = { title: "Übersicht" };

const KPIS = [
  { label: "Meine Geräte", value: "—" },
  { label: "Letzte Prüfung", value: "—" },
  { label: "Nächste Prüfung", value: "—" },
];

const STATUS_LABEL: Record<string, { label: string; tone: "neutral" | "success" | "done" | "bad" }> = {
  new:        { label: "Eingegangen",       tone: "neutral" },
  contacted:  { label: "In Bearbeitung",    tone: "neutral" },
  quoted:     { label: "Angebot versendet", tone: "neutral" },
  scheduled:  { label: "Beauftragt",        tone: "success" },
  completed:  { label: "Abgeschlossen",     tone: "done" },
  cancelled:  { label: "Storniert",         tone: "bad" },
};

const TONE_CLASS: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-brand/10 text-foreground border border-brand",
  done:    "bg-muted text-muted-foreground",
  bad:     "bg-red-50 text-red-900 border border-red-200",
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(iso));
}

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();
  const { data: rows } = await supabase
    .from("inspection_requests")
    .select(`
      id, status, created_at, is_first_inspection,
      device_count_new, device_count_existing,
      desired_timeframe, address_city,
      orders!inspection_request_id ( desired_date )
    `)
    .in("status", ["new", "contacted", "quoted", "scheduled"])
    .order("created_at", { ascending: false })
    .limit(3);

  type Row = {
    id: string;
    status: string;
    created_at: string;
    is_first_inspection: boolean;
    device_count_new: number;
    device_count_existing: number | null;
    desired_timeframe: string | null;
    address_city: string | null;
    orders: Array<{ desired_date: string | null }> | null;
  };
  const upcoming = (rows ?? []) as unknown as Row[];

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

      {/* Meine Termine */}
      <section className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg mb-6 md:mb-8">
        <div className="px-5 md:px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">Meine Termine</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Offene und anstehende Prüftermine.
            </p>
          </div>
          <Link
            href="/dashboard/termine"
            className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
          >
            Verwalten
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            Noch keine Termine geplant.{" "}
            <Link href="/dashboard/anfrage" className="underline hover:text-foreground transition">
              Jetzt Termin vereinbaren
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map(r => {
              const total = r.device_count_new + (r.device_count_existing ?? 0);
              const statusInfo = STATUS_LABEL[r.status] ?? { label: r.status, tone: "neutral" as const };
              const dateLabel = r.orders?.[0]?.desired_date
                ? formatDate(r.orders[0].desired_date)
                : r.desired_timeframe ?? "Zeitraum offen";
              return (
                <li key={r.id}>
                  <Link
                    href="/dashboard/termine"
                    className="flex items-center gap-4 px-5 md:px-6 py-3.5 hover:bg-muted/30 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">
                          {r.is_first_inspection ? "Erstprüfung" : "Folgeprüfung"} · {total} Gerät{total === 1 ? "" : "e"}
                        </p>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${TONE_CLASS[statusInfo.tone]}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {dateLabel}
                        </span>
                        {r.address_city && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {r.address_city}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-background/80 p-6 md:p-8 text-center text-muted-foreground text-sm">
        Sobald die erste Prüfung abgeschlossen ist, erscheinen hier Ihre Protokolle und der nächste Pflichttermin.
      </section>
    </div>
  );
}
