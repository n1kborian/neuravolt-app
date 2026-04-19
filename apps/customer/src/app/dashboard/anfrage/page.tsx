import { getCurrentUser, getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Calendar } from "lucide-react";
import { RequestForm } from "./RequestForm";

export const metadata = { title: "DGUV-Anfrage stellen" };

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

const STATUS_LABEL: Record<string, string> = {
  new: "Eingegangen",
  contacted: "In Bearbeitung",
  quoted: "Angebot versendet",
  scheduled: "Termin geplant",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

export default async function AnfragePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();
  const { data: previous } = await supabase
    .from("inspection_requests")
    .select("id, created_at, is_first_inspection, device_count_new, device_count_existing, desired_timeframe, status")
    .order("created_at", { ascending: false })
    .limit(5);

  const previousRequests = (previous ?? []) as Array<{
    id: string;
    created_at: string;
    is_first_inspection: boolean;
    device_count_new: number;
    device_count_existing: number | null;
    desired_timeframe: string | null;
    status: string;
  }>;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[2px] w-8 bg-foreground" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
            DGUV V3 Prüfung
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Termin vereinbaren
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl">
          Stellen Sie Ihre Prüfanfrage — wir melden uns innerhalb von 24 Stunden mit einem Festpreis-Angebot.
        </p>
      </header>

      <div className="space-y-4 md:space-y-6">
        {/* Form card */}
        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
          <RequestForm />
        </div>

        {/* Ablauf — 3 steps horizontal on sm+, stacked on mobile */}
        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-5">
            So läuft es ab
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: CheckCircle2, step: "01", title: "Anfrage senden",     desc: "Sie füllen das Formular in ca. 2 Minuten aus." },
              { icon: Clock,        step: "02", title: "Angebot in 24 h",    desc: "Festpreis, transparent kalkuliert." },
              { icon: Calendar,     step: "03", title: "Termin koordinieren", desc: "Wir passen uns Ihrem Betriebsablauf an." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <li key={step} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-muted-foreground">{step}</p>
                  <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">{title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Previous requests */}
        {previousRequests.length > 0 && (
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6 md:p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Ihre bisherigen Anfragen
            </p>
            <ul className="divide-y divide-border">
              {previousRequests.map(r => {
                const total = r.device_count_new + (r.device_count_existing ?? 0);
                return (
                  <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {r.is_first_inspection ? "Erstprüfung" : "Folgeprüfung"} · {total} Gerät{total === 1 ? "" : "e"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(r.created_at)}
                          {r.desired_timeframe ? ` · ${r.desired_timeframe}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowRight className="h-3 w-3 rotate-180" />
          Zurück zur Übersicht
        </Link>
      </div>
    </div>
  );
}
