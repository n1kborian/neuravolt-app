import { getOrders, type OrderFilters } from "./actions";
import { OrderList } from "./OrderList";

export const metadata = { title: "Aufträge – NeuraVolt" };

export default async function AuftraegePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const filters: OrderFilters = {
    status: params.status || "open",
    city: params.city || undefined,
    minDevices: params.minDevices ? parseInt(params.minDevices, 10) : undefined,
    maxDevices: params.maxDevices ? parseInt(params.maxDevices, 10) : undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
  };

  const orders = await getOrders(filters);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Verfügbare Aufträge</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Offene DGUV V3 Prüfaufträge in Ihrer Region. Buchen Sie verbindlich mit einem Klick.
        </p>
      </header>

      <OrderList orders={orders} currentFilters={filters} />
    </div>
  );
}
