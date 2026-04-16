import { getCurrentUser } from "@neuravolt/auth/server";
import { getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, Receipt, Clock, CheckCircle2, Calendar, Building2 } from "lucide-react";

export const metadata = { title: "Abrechnung – NeuraVolt" };

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

function formatMonth(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(iso));
}

type OrderRow = {
  id: string;
  customer_company: string;
  city: string;
  device_count: number;
  total_net_cents: number;
  status: string;
  booked_at: string | null;
  completed_at: string | null;
};

export default async function AbrechnungPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_company, city, device_count, total_net_cents, status, booked_at, completed_at")
    .eq("booked_by", user.id)
    .in("status", ["booked", "in_progress", "completed"])
    .order("booked_at", { ascending: false });

  const allOrders = (orders ?? []) as OrderRow[];

  const completed = allOrders.filter(o => o.status === "completed");
  const pending = allOrders.filter(o => o.status === "booked" || o.status === "in_progress");

  const totalCompleted = completed.reduce((sum, o) => sum + o.total_net_cents, 0);
  const totalPending = pending.reduce((sum, o) => sum + o.total_net_cents, 0);
  const totalAll = allOrders.reduce((sum, o) => sum + o.total_net_cents, 0);

  // Group completed by month
  const byMonth = new Map<string, { month: string; orders: OrderRow[]; total: number }>();
  for (const o of completed) {
    const date = o.completed_at ?? o.booked_at ?? "";
    const key = date.slice(0, 7); // YYYY-MM
    if (!byMonth.has(key)) {
      byMonth.set(key, { month: date, orders: [], total: 0 });
    }
    const group = byMonth.get(key)!;
    group.orders.push(o);
    group.total += o.total_net_cents;
  }

  const months = [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, v]) => v);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Abrechnung</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Umsatzübersicht und Auftragshistorie.
        </p>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <p className="text-xs text-muted-foreground">Abgerechnet (netto)</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatEuro(totalCompleted)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{completed.length} abgeschlossene Aufträge</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-muted-foreground">Ausstehend (netto)</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatEuro(totalPending)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{pending.length} offene Buchungen</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-foreground" />
            <p className="text-xs text-muted-foreground">Gesamt (netto)</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatEuro(totalAll)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{allOrders.length} Aufträge insgesamt</p>
        </div>
      </div>

      {/* Pending orders */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Ausstehende Aufträge
          </h2>
          <div className="rounded-2xl border border-border bg-background/80 overflow-hidden shadow-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-5 py-3 font-semibold text-foreground">Kunde</th>
                  <th className="px-5 py-3 font-semibold text-foreground">Stadt</th>
                  <th className="px-5 py-3 font-semibold text-foreground">Geräte</th>
                  <th className="px-5 py-3 font-semibold text-foreground">Gebucht am</th>
                  <th className="px-5 py-3 font-semibold text-foreground text-right">Netto</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {pending.map(o => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">{o.customer_company}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.city}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.device_count}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(o.booked_at)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">{formatEuro(o.total_net_cents)}</td>
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/auftraege/${o.id}`} className="text-xs text-muted-foreground hover:text-foreground transition">
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Completed by month */}
      <section>
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Abgeschlossene Aufträge
        </h2>

        {months.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/80 px-6 py-12 text-center text-sm text-muted-foreground shadow-lg">
            Noch keine abgeschlossenen Aufträge.
          </div>
        ) : (
          <div className="space-y-4">
            {months.map(({ month, orders: monthOrders, total }) => (
              <div key={month} className="rounded-2xl border border-border bg-background/80 overflow-hidden shadow-lg">
                <div className="px-5 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{formatMonth(month)}</span>
                  <span className="text-sm font-bold text-foreground">{formatEuro(total)}</span>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {monthOrders.map(o => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-3 font-medium text-foreground">{o.customer_company}</td>
                        <td className="px-5 py-3 text-muted-foreground">{o.city}</td>
                        <td className="px-5 py-3 text-muted-foreground">{o.device_count} Geräte</td>
                        <td className="px-5 py-3 text-muted-foreground">{formatDate(o.completed_at)}</td>
                        <td className="px-5 py-3 text-right font-semibold text-foreground">{formatEuro(o.total_net_cents)}</td>
                        <td className="px-5 py-3">
                          <Link href={`/dashboard/auftraege/${o.id}`} className="text-xs text-muted-foreground hover:text-foreground transition">
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
