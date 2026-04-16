"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Calendar,
  Cpu,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Filter,
  X,
  List,
  Map,
} from "lucide-react";
import { bookOrder, type Order, type OrderFilters } from "./actions";

const OrdersMap = dynamic(
  () => import("@/components/OrdersMap").then(m => m.OrdersMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-2xl border border-border bg-muted/20 animate-pulse" style={{ height: 500 }} />
    ),
  },
);

const STATUS_TABS = [
  { key: "open", label: "Offen" },
  { key: "booked", label: "Meine Buchungen" },
  { key: "all", label: "Alle" },
] as const;

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string | null): string {
  if (!iso) return "Flexibel";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

export function OrderList({
  orders,
  currentFilters,
}: {
  orders: Order[];
  currentFilters: OrderFilters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");

  const [city, setCity] = useState(currentFilters.city ?? "");
  const [minDevices, setMinDevices] = useState(currentFilters.minDevices?.toString() ?? "");
  const [maxDevices, setMaxDevices] = useState(currentFilters.maxDevices?.toString() ?? "");
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(currentFilters.dateTo ?? "");

  const activeStatus = currentFilters.status ?? "open";
  const hasFilters = city || minDevices || maxDevices || dateFrom || dateTo;

  function applyFilters() {
    const params = new URLSearchParams();
    if (activeStatus !== "open") params.set("status", activeStatus);
    if (city.trim()) params.set("city", city.trim());
    if (minDevices) params.set("minDevices", minDevices);
    if (maxDevices) params.set("maxDevices", maxDevices);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    router.push(`/dashboard/auftraege?${params.toString()}`);
  }

  function clearFilters() {
    setCity("");
    setMinDevices("");
    setMaxDevices("");
    setDateFrom("");
    setDateTo("");
    router.push(`/dashboard/auftraege?status=${activeStatus}`);
  }

  function switchTab(status: string) {
    const params = new URLSearchParams();
    if (status !== "open") params.set("status", status);
    router.push(`/dashboard/auftraege?${params.toString()}`);
  }

  return (
    <>
      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeStatus === key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-full border border-border overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Liste
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                view === "map" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              Karte
            </button>
          </div>

          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
              filtersOpen || hasFilters
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
            {hasFilters && <span className="ml-1 bg-background text-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">!</span>}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="mb-6 rounded-2xl border border-border bg-background/80 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <MapPin className="h-3 w-3 inline mr-1" />
                Stadt
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="z. B. Stuttgart"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <Cpu className="h-3 w-3 inline mr-1" />
                Geräte (min – max)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minDevices}
                  onChange={e => setMinDevices(e.target.value)}
                  placeholder="min"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
                />
                <input
                  type="number"
                  value={maxDevices}
                  onChange={e => setMaxDevices(e.target.value)}
                  placeholder="max"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <Calendar className="h-3 w-3 inline mr-1" />
                Termin von
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <Calendar className="h-3 w-3 inline mr-1" />
                Termin bis
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={applyFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition"
            >
              <Search className="h-3.5 w-3.5" />
              Filter anwenden
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-3.5 w-3.5" />
                Zurücksetzen
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">
        {orders.length} {orders.length === 1 ? "Auftrag" : "Aufträge"} gefunden
      </p>

      {/* Map view */}
      {view === "map" && (
        <div className="mb-6">
          <OrdersMap orders={orders} />
          <p className="text-xs text-muted-foreground mt-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mr-1 align-middle" /> Offen
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ml-3 mr-1 align-middle" /> Gebucht
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-3 mr-1 align-middle" /> In Bearbeitung
          </p>
        </div>
      )}

      {/* Order cards */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background/80 px-6 py-16 text-center text-sm text-muted-foreground">
          Keine Aufträge für die ausgewählten Filter gefunden.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();
  const [bookingResult, setBookingResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const router = useRouter();

  const isOpen = order.status === "open";
  const isBooked = order.status === "booked";

  function handleBook() {
    startTransition(async () => {
      const result = await bookOrder(order.id);
      setBookingResult(result);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className={`rounded-2xl border bg-background/80 p-6 transition-all ${
      isOpen ? "border-border hover:border-foreground/30 hover:shadow-md" : "border-border/50"
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Info */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Kunde</p>
            <p className="text-sm font-semibold text-foreground">{order.customer_company}</p>
            {order.branche && (
              <span className="inline-block mt-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                {order.branche}
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Standort</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              {order.postal_code && `${order.postal_code} `}{order.city}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Geräte</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Cpu className="h-3 w-3 text-muted-foreground" />
              {order.device_count} Geräte
            </p>
            <p className="text-[10px] text-muted-foreground">
              {order.is_first_inspection ? "Erstprüfung" : "Folgeprüfung"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Wunschtermin</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {formatDate(order.desired_date)}
            </p>
            {order.desired_timeframe && (
              <p className="text-[10px] text-muted-foreground">{order.desired_timeframe}</p>
            )}
          </div>
        </div>

        {/* Price + action */}
        <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-2 shrink-0">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Auftragswert netto</p>
            <p className="text-lg font-bold text-foreground">{formatEuro(order.total_net_cents)}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatEuro(order.price_per_device_cents)} / Gerät
            </p>
          </div>

          {isOpen && (
            <button
              onClick={handleBook}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isPending ? "Wird gebucht …" : "Verbindlich buchen"}
              {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          )}

          {isBooked && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Gebucht
            </span>
          )}

          {!isOpen && !isBooked && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium">
              {order.status === "completed" ? "Abgeschlossen" :
               order.status === "in_progress" ? "In Bearbeitung" :
               order.status === "cancelled" ? "Storniert" : order.status}
            </span>
          )}
        </div>
      </div>

      {/* Booking result feedback */}
      {bookingResult && !bookingResult.ok && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{bookingResult.error}</span>
        </div>
      )}

      {bookingResult?.ok && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Auftrag erfolgreich gebucht. Sie erhalten eine Bestätigung per E-Mail.</span>
        </div>
      )}

      {/* Detail link */}
      <div className="mt-3 pt-3 border-t border-border">
        <Link
          href={`/dashboard/auftraege/${order.id}`}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1"
        >
          Details anzeigen
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
