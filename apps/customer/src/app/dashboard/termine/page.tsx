import { getCurrentUser, getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TerminRow, type TerminRowData } from "./TerminRow";

export const metadata = { title: "Termine verwalten" };

interface RequestWithOrder {
  id: string;
  status: string;
  created_at: string;
  is_first_inspection: boolean;
  device_count_new: number;
  device_count_existing: number | null;
  desired_timeframe: string | null;
  address_street: string | null;
  address_postal_code: string | null;
  address_city: string | null;
  cancelled_at: string | null;
  cancellation_fee_cents: number | null;
  orders: Array<{
    desired_date: string | null;
    booked_at: string | null;
    total_net_cents: number;
  }> | null;
}

function toRow(r: RequestWithOrder): TerminRowData {
  const order = r.orders?.[0];
  return {
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
    isFirstInspection: r.is_first_inspection,
    deviceCountNew: r.device_count_new,
    deviceCountExisting: r.device_count_existing,
    desiredTimeframe: r.desired_timeframe,
    addressStreet: r.address_street,
    addressPostalCode: r.address_postal_code,
    addressCity: r.address_city,
    cancelledAt: r.cancelled_at,
    cancellationFeeCents: r.cancellation_fee_cents,
    orderDesiredDate: order?.desired_date ?? null,
    orderBookedAt: order?.booked_at ?? null,
    orderTotalNetCents: order?.total_net_cents ?? 0,
  };
}

export default async function TermineVerwaltenPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();
  const { data: rows } = await supabase
    .from("inspection_requests")
    .select(`
      id, status, created_at, is_first_inspection,
      device_count_new, device_count_existing, desired_timeframe,
      address_street, address_postal_code, address_city,
      cancelled_at, cancellation_fee_cents,
      orders!inspection_request_id ( desired_date, booked_at, total_net_cents )
    `)
    .order("created_at", { ascending: false });

  const allRequests = ((rows ?? []) as unknown as RequestWithOrder[]).map(toRow);

  const active = allRequests.filter(r => r.status !== "cancelled" && r.status !== "completed");
  const archived = allRequests.filter(r => r.status === "cancelled" || r.status === "completed");

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Termine verwalten</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl">
          Übersicht aller Prüfanfragen und -termine. Sie können laufende Termine hier stornieren.
        </p>
      </header>

      {/* Storno-Richtlinie */}
      <section className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-5 md:p-6 mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Stornierungsrichtlinie
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { range: "ab 4 Wochen vorher",    fee: "kostenfrei" },
            { range: "2 – 4 Wochen vorher",   fee: "25 % Gebühr" },
            { range: "1 – 2 Wochen vorher",   fee: "50 % Gebühr" },
            { range: "< 1 Woche vorher",      fee: "100 % Gebühr" },
          ].map(s => (
            <div key={s.range} className="rounded-xl border border-border bg-background p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{s.range}</p>
              <p className="text-sm font-bold text-foreground">{s.fee}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Die Gebühr bezieht sich auf den Festpreis des Auftrags. Anfragen ohne festen Termin können jederzeit kostenfrei storniert werden.
        </p>
      </section>

      {/* Aktive Termine */}
      <section className="space-y-4 mb-8">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Aktiv · {active.length}
        </h2>
        {active.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/80 p-8 text-center text-sm text-muted-foreground">
            Keine aktiven Termine.{" "}
            <Link href="/dashboard/anfrage" className="underline hover:text-foreground transition">
              Neuen Termin vereinbaren
            </Link>
          </div>
        ) : (
          active.map(r => <TerminRow key={r.id} data={r} />)
        )}
      </section>

      {/* Archiv */}
      {archived.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground">
            Archiv · {archived.length}
          </h2>
          {archived.map(r => <TerminRow key={r.id} data={r} />)}
        </section>
      )}

      <div className="mt-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Zurück zur Übersicht
        </Link>
      </div>
    </div>
  );
}
