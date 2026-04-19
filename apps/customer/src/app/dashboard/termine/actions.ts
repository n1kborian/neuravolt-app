"use server";

import { getCurrentUser, getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { assessCancellation } from "@/lib/cancellation";

export type CancelState =
  | { ok: true; feeCents: number; feePercent: number }
  | { ok: false; error: string }
  | null;

export async function cancelTermin(
  _prev: CancelState,
  formData: FormData
): Promise<CancelState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requestId = String(formData.get("requestId") ?? "").trim();
  if (!requestId) return { ok: false, error: "Ungültige Anfrage-ID." };

  const supabase = await getSupabaseServerClient();

  // Anfrage mit verknüpftem Auftrag holen.
  const { data: request, error: reqErr } = await supabase
    .from("inspection_requests")
    .select("id, status, user_id")
    .eq("id", requestId)
    .single();

  if (reqErr || !request) {
    return { ok: false, error: "Anfrage nicht gefunden." };
  }
  if (request.user_id !== user.id) {
    return { ok: false, error: "Keine Berechtigung." };
  }
  if (request.status === "cancelled" || request.status === "completed") {
    return { ok: false, error: "Anfrage kann nicht mehr storniert werden." };
  }

  // Linked order holen für Termin-Datum + Gesamtpreis.
  const { data: order } = await supabase
    .from("orders")
    .select("id, desired_date, booked_at, total_net_cents, status")
    .eq("inspection_request_id", requestId)
    .maybeSingle();

  const appointmentDateIso: string | null =
    (order?.desired_date as string | null) ??
    (order?.booked_at as string | null) ??
    null;
  const totalNetCents: number = order?.total_net_cents ?? 0;

  const assessment = assessCancellation({
    status: request.status as string,
    appointmentDateIso,
    totalNetCents,
  });

  if (!assessment.canCancel) {
    return { ok: false, error: assessment.explainer };
  }

  const { error: updateErr } = await supabase
    .from("inspection_requests")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancellation_fee_cents: assessment.feeCents,
    })
    .eq("id", requestId);

  if (updateErr) {
    console.error("[cancelTermin] update failed", updateErr);
    return { ok: false, error: "Stornierung fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/anfrage");
  revalidatePath("/dashboard/termine");

  return { ok: true, feeCents: assessment.feeCents, feePercent: assessment.feePercent };
}
