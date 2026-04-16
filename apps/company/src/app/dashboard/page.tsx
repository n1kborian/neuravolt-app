import { getCurrentUser } from "@neuravolt/auth/server";
import { getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Cpu, FileText } from "lucide-react";

export const metadata = { title: "Übersicht – NeuraVolt" };

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await getSupabaseServerClient();

  // Fetch KPIs in parallel
  const [openRes, bookedRes, completedRes, revenueRes, nextRes, recentRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "booked").eq("booked_by", user.id),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "completed").eq("booked_by", user.id),
    supabase.from("orders").select("total_net_cents").eq("booked_by", user.id).in("status", ["booked", "in_progress", "completed"]),
    supabase.from("orders").select("id, customer_company, city, desired_date, device_count, total_net_cents").eq("status", "open").order("desired_date", { ascending: true, nullsFirst: false }).limit(5),
    supabase.from("orders").select("id, customer_company, city, status, booked_at, total_net_cents").eq("booked_by", user.id).order("booked_at", { ascending: false, nullsFirst: false }).limit(5),
  ]);

  const openCount = openRes.count ?? 0;
  const bookedCount = bookedRes.count ?? 0;
  const completedCount = completedRes.count ?? 0;
  const totalRevenueCents = (revenueRes.data ?? []).reduce((sum, r) => sum + (r.total_net_cents ?? 0), 0);
  const upcomingOrders = (nextRes.data ?? []) as { id: string; customer_company: string; city: string; desired_date: string | null; device_count: number; total_net_cents: number }[];
  const recentBookings = (recentRes.data ?? []) as { id: string; customer_company: string; city: string; status: string; booked_at: string | null; total_net_cents: number }[];

  const kpis = [
    { label: "Offene Aufträge", value: String(openCount), sub: "In Ihrer Region verfügbar" },
    { label: "Meine Buchungen", value: String(bookedCount), sub: "Aktuell gebucht" },
    { label: "Abgeschlossen", value: String(completedCount), sub: "Erfolgreich geprüft" },
    { label: "Umsatz (netto)", value: formatEuro(totalRevenueCents), sub: "Gebuchte + abgeschlossene Aufträge" },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Willkommen, {user.profile.company_name ?? user.profile.full_name ?? "Unternehmen"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ihre Auftragsübersicht auf einen Blick.
        </p>
      </header>

      {/* KPI cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-5 shadow-lg overflow-hidden"
          >
            <p className="text-xs text-muted-foreground mb-2 truncate">{label}</p>
            <p className="text-3xl font-bold text-foreground leading-none mb-2 truncate">{value}</p>
            <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming open orders */}
        <section className="rounded-2xl border border-border bg-background/80 shadow-lg">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Nächste offene Aufträge</h2>
            <Link href="/dashboard/auftraege" className="text-xs text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1">
              Alle anzeigen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcomingOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Aktuell keine offenen Aufträge.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {upcomingOrders.map(order => (
                <li key={order.id}>
                  <Link href={`/dashboard/auftraege/${order.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{order.customer_company}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{order.city}</span>
                        <span className="inline-flex items-center gap-1"><Cpu className="h-3 w-3" />{order.device_count}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(order.desired_date)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground shrink-0">{formatEuro(order.total_net_cents)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent bookings */}
        <section className="rounded-2xl border border-border bg-background/80 shadow-lg">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Letzte Buchungen</h2>
            <Link href="/dashboard/auftraege?status=booked" className="text-xs text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1">
              Alle anzeigen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Sie haben noch keine Aufträge gebucht.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentBookings.map(order => (
                <li key={order.id}>
                  <Link href={`/dashboard/auftraege/${order.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{order.customer_company}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{order.city}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(order.booked_at)}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "booked" ? "bg-green-50 text-green-700" :
                          order.status === "in_progress" ? "bg-amber-50 text-amber-700" :
                          order.status === "completed" ? "bg-gray-100 text-gray-600" : ""
                        }`}>
                          {order.status === "booked" ? "Gebucht" : order.status === "in_progress" ? "In Bearbeitung" : order.status === "completed" ? "Abgeschlossen" : order.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground shrink-0">{formatEuro(order.total_net_cents)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
