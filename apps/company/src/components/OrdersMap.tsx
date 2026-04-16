"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { type Order } from "@/app/dashboard/auftraege/actions";

const PLZ_COORDS: Record<string, [number, number]> = {
  "70173": [48.7758, 9.1829],
  "70178": [48.7690, 9.1720],
  "70180": [48.7680, 9.1780],
  "70182": [48.7740, 9.1900],
  "70184": [48.7700, 9.1950],
  "70186": [48.7620, 9.1890],
  "70188": [48.7850, 9.2050],
  "70190": [48.7830, 9.1920],
  "70191": [48.7940, 9.1800],
  "70192": [48.7980, 9.1720],
  "70193": [48.7870, 9.1580],
  "70195": [48.8000, 9.1530],
  "70197": [48.7620, 9.1600],
  "70199": [48.7540, 9.1700],
  "70374": [48.8130, 9.2270],
  "70376": [48.8270, 9.2080],
  "70435": [48.8340, 9.1780],
  "70437": [48.8450, 9.2050],
  "70439": [48.8520, 9.1780],
  "70499": [48.8030, 9.1030],
  "70563": [48.7340, 9.1560],
  "70565": [48.7200, 9.1360],
  "70567": [48.7120, 9.1620],
  "70569": [48.7420, 9.1000],
  "70597": [48.7480, 9.2250],
  "70599": [48.7300, 9.2120],
  "70619": [48.7560, 9.2520],
  "70629": [48.7160, 9.2380],
  "70734": [48.8290, 9.3180],
  "70736": [48.8100, 9.3020],
  "70825": [48.8320, 9.1200],
  "71032": [48.6860, 9.0130],
  "71634": [48.8930, 9.1920],
  "71636": [48.8990, 9.1800],
  "73728": [48.7390, 9.3050],
  "73730": [48.7260, 9.3250],
  "73732": [48.7500, 9.3350],
  "73734": [48.7600, 9.3500],
};

const CITY_COORDS: Record<string, [number, number]> = {
  stuttgart: [48.7758, 9.1829],
  ludwigsburg: [48.8930, 9.1920],
  esslingen: [48.7390, 9.3050],
  böblingen: [48.6860, 9.0130],
  "korntal-münchingen": [48.8320, 9.1200],
  korntal: [48.8320, 9.1200],
  waiblingen: [48.8300, 9.3170],
  sindelfingen: [48.7130, 9.0030],
  leonberg: [48.8020, 9.0150],
  fellbach: [48.8100, 9.2760],
};

function resolveCoords(order: Order): [number, number] | null {
  if (order.postal_code && PLZ_COORDS[order.postal_code]) {
    return PLZ_COORDS[order.postal_code];
  }
  const cityKey = order.city.toLowerCase().trim();
  if (CITY_COORDS[cityKey]) return CITY_COORDS[cityKey];
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (cityKey.includes(key) || key.includes(cityKey)) return coords;
  }
  return null;
}

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string | null): string {
  if (!iso) return "Flexibel";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

const statusColors: Record<string, string> = {
  open: "#3b82f6",
  booked: "#22c55e",
  in_progress: "#f59e0b",
  completed: "#6b7280",
  cancelled: "#ef4444",
};

function createIcon(status: string) {
  const color = statusColors[status] ?? "#6b7280";
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  });
}

interface OrdersMapProps {
  orders: Order[];
}

export function OrdersMap({ orders }: OrdersMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full rounded-2xl border border-border bg-muted/20 animate-pulse" style={{ height: 500 }} />
    );
  }

  const pins = orders
    .map(o => ({ order: o, coords: resolveCoords(o) }))
    .filter((p): p is { order: Order; coords: [number, number] } => p.coords !== null);

  const center: [number, number] = pins.length > 0
    ? [
        pins.reduce((sum, p) => sum + p.coords[0], 0) / pins.length,
        pins.reduce((sum, p) => sum + p.coords[1], 0) / pins.length,
      ]
    : [48.7758, 9.1829];

  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-lg" style={{ height: 500 }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapContainer
        center={center}
        zoom={10}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {pins.map(({ order, coords }) => (
          <Marker key={order.id} position={coords} icon={createIcon(order.status)}>
            <Popup>
              <div style={{ minWidth: 200, fontFamily: "inherit" }}>
                <p style={{ fontWeight: 700, margin: "0 0 4px 0", fontSize: 14 }}>
                  {order.customer_company}
                </p>
                {order.branche && (
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px 0" }}>
                    {order.branche}
                  </p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Geräte:</span>
                  <span style={{ fontWeight: 600 }}>{order.device_count}</span>
                  <span style={{ color: "#6b7280" }}>Termin:</span>
                  <span style={{ fontWeight: 600 }}>{formatDate(order.desired_date)}</span>
                  <span style={{ color: "#6b7280" }}>Wert:</span>
                  <span style={{ fontWeight: 600 }}>{formatEuro(order.total_net_cents)}</span>
                </div>
                <a
                  href={`/dashboard/auftraege/${order.id}`}
                  style={{ display: "block", marginTop: 8, fontSize: 12, fontWeight: 600, color: "#0a0a0a" }}
                >
                  Details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
