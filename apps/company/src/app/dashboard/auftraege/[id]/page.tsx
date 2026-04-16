import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "../actions";
import { BookButton } from "./BookButton";
import { ProtocolUpload } from "./ProtocolUpload";
import {
  MapPin,
  Calendar,
  Cpu,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
} from "lucide-react";

export const metadata = { title: "Auftragsdetails – NeuraVolt" };

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string | null): string {
  if (!iso) return "Flexibel";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));
}

const statusLabels: Record<string, { label: string; className: string }> = {
  open: { label: "Offen", className: "bg-blue-50 text-blue-700 border-blue-200" },
  booked: { label: "Gebucht", className: "bg-green-50 text-green-700 border-green-200" },
  in_progress: { label: "In Bearbeitung", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Abgeschlossen", className: "bg-gray-50 text-gray-600 border-gray-200" },
  cancelled: { label: "Storniert", className: "bg-red-50 text-red-700 border-red-200" },
};

export default async function AuftragDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const status = statusLabels[order.status] ?? { label: order.status, className: "bg-muted text-muted-foreground border-border" };

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/dashboard/auftraege"
        className="text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zu allen Aufträgen
      </Link>

      <header className="mt-4 mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{order.customer_company}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Auftrag erstellt am {formatDate(order.created_at)}
          </p>
        </div>
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${status.className}`}>
          {status.label}
        </span>
      </header>

      <div className="space-y-6">
        {/* Customer info */}
        <div className="rounded-2xl border border-border bg-background/80 p-6">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Kundendaten
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground font-medium">{order.customer_company}</span>
            </div>
            {order.customer_contact && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{order.customer_contact}</span>
              </div>
            )}
            {order.customer_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <a href={`mailto:${order.customer_email}`} className="text-foreground hover:underline">
                  {order.customer_email}
                </a>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{order.customer_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Job details */}
        <div className="rounded-2xl border border-border bg-background/80 p-6">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Auftragsdetails
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Standort</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {order.postal_code && `${order.postal_code} `}{order.city}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Geräteanzahl</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                <Cpu className="h-3 w-3 text-muted-foreground" />
                {order.device_count} Geräte
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Prüfungsart</p>
              <p className="text-sm font-semibold text-foreground">
                {order.is_first_inspection ? "Erstprüfung" : "Folgeprüfung"}
              </p>
            </div>
            {order.branche && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Branche</p>
                <p className="text-sm font-semibold text-foreground">{order.branche}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wunschtermin</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                {formatDate(order.desired_date)}
              </p>
              {order.desired_timeframe && (
                <p className="text-xs text-muted-foreground mt-0.5">{order.desired_timeframe}</p>
              )}
            </div>
            {order.notes && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-muted-foreground mb-1">Anmerkungen</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-border bg-background/80 p-6">
          <h2 className="text-sm font-bold text-foreground mb-4">Preiskalkulation</h2>
          <div className="space-y-2 text-sm max-w-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{order.device_count} × {formatEuro(order.price_per_device_cents)}</span>
              <span className="text-foreground font-medium">{formatEuro(order.device_count * order.price_per_device_cents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anfahrtspauschale</span>
              <span className="text-foreground font-medium">{formatEuro(order.travel_fee_cents)}</span>
            </div>
            {order.setup_fee_cents > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Einrichtungspreis</span>
                <span className="text-foreground font-medium">{formatEuro(order.setup_fee_cents)}</span>
              </div>
            )}
            <div className="h-px bg-foreground my-2" />
            <div className="flex justify-between">
              <span className="text-foreground font-bold">Gesamt (netto)</span>
              <span className="text-foreground font-bold text-lg">{formatEuro(order.total_net_cents)}</span>
            </div>
          </div>
        </div>

        {/* Protocol upload (visible for booked/in_progress orders) */}
        {(order.status === "booked" || order.status === "in_progress" || order.status === "completed") && (
          <ProtocolUpload
            orderId={order.id}
            existingPath={order.protocol_path}
            uploadedAt={order.protocol_uploaded_at}
          />
        )}

        {/* Book CTA */}
        {order.status === "open" && (
          <div className="rounded-2xl border border-foreground bg-foreground p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-background font-bold text-lg">Auftrag verbindlich buchen?</p>
              <p className="text-background/70 text-sm">
                Nach der Buchung erhalten Sie und der Kunde eine Bestätigung. Stornierungen sind über den Support möglich.
              </p>
            </div>
            <BookButton orderId={order.id} />
          </div>
        )}

        {order.booked_at && (
          <p className="text-xs text-muted-foreground text-center">
            Gebucht am {formatDate(order.booked_at)}
          </p>
        )}
      </div>
    </div>
  );
}
