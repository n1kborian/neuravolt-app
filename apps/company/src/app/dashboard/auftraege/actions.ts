"use server";

import { getSupabaseServerClient } from "@neuravolt/auth/server";
import { getCurrentUser } from "@neuravolt/auth/server";
import { revalidatePath } from "next/cache";

export type Order = {
  id: string;
  created_at: string;
  customer_company: string;
  customer_contact: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  city: string;
  postal_code: string | null;
  address: string | null;
  branche: string | null;
  device_count: number;
  device_count_new: number | null;
  device_count_existing: number | null;
  last_inspection_date: string | null;
  device_category_counts: Record<string, number>;
  device_category_counts_previous: Record<string, number>;
  is_first_inspection: boolean;
  desired_date: string | null;
  desired_timeframe: string | null;
  notes: string | null;
  price_per_device_cents: number;
  travel_fee_cents: number;
  setup_fee_cents: number;
  total_net_cents: number;
  status: string;
  booked_by: string | null;
  booked_at: string | null;
  protocol_path: string | null;
  protocol_uploaded_at: string | null;
  inspection_request_id: string | null;
};

export type OrderFilters = {
  status?: string;
  city?: string;
  minDevices?: number;
  maxDevices?: number;
  dateFrom?: string;
  dateTo?: string;
};

export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const supabase = await getSupabaseServerClient();

  let query = supabase
    .from("orders")
    .select("*")
    .order("desired_date", { ascending: true, nullsFirst: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  if (filters.minDevices) {
    query = query.gte("device_count", filters.minDevices);
  }

  if (filters.maxDevices) {
    query = query.lte("device_count", filters.maxDevices);
  }

  if (filters.dateFrom) {
    query = query.gte("desired_date", filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte("desired_date", filters.dateTo);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[orders] fetch failed", error);
    return [];
  }

  return (data ?? []) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[orders] fetch by id failed", error);
    return null;
  }

  return data as Order | null;
}

export async function bookOrder(orderId: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Nicht angemeldet." };

  if (!["company", "admin", "partner"].includes(user.profile.role)) {
    return { ok: false, error: "Keine Berechtigung." };
  }

  const supabase = await getSupabaseServerClient();

  // Optimistic lock: only update if still open
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "booked",
      booked_by: user.id,
      booked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "open")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[orders] book failed", error);
    return { ok: false, error: "Buchung fehlgeschlagen." };
  }

  if (!data) {
    return { ok: false, error: "Dieser Auftrag wurde bereits vergeben." };
  }

  revalidatePath("/dashboard/auftraege");
  return { ok: true };
}
