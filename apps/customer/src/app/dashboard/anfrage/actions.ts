"use server";

import { getSupabaseServerClient, getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DEVICE_TYPES, type ActionState } from "./constants";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";
import {
  renderInspectionCustomerEmail,
  renderInspectionTeamEmail,
  type InspectionRequestEmailInput,
} from "@/lib/email-templates";

function toInt(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

function projectRefFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match?.[1];
}

export async function submitInspectionRequest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isFirstInspection = formData.get("inspectionType") === "first";
  const deviceTypesRaw = formData.getAll("deviceTypes").map(String);
  const deviceTypes = deviceTypesRaw.filter(v =>
    DEVICE_TYPES.some(t => t.value === v)
  );
  const desiredTimeframe = String(formData.get("desiredTimeframe") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const deviceCountNew = toInt(formData.get("deviceCountNew"));
  const deviceCountExistingRaw = toInt(formData.get("deviceCountExisting"));
  const lastInspectionDateRaw = String(formData.get("lastInspectionDate") ?? "").trim();

  const fieldErrors: Record<string, string> = {};

  if (deviceCountNew === null || deviceCountNew < 0 || deviceCountNew > 10000) {
    fieldErrors.deviceCountNew = "Bitte eine gültige Anzahl (0–10.000) angeben.";
  }

  if (isFirstInspection) {
    if ((deviceCountNew ?? 0) < 1) {
      fieldErrors.deviceCountNew = "Bei Erstprüfung mindestens ein Gerät angeben.";
    }
  } else {
    if (deviceCountExistingRaw === null || deviceCountExistingRaw < 0 || deviceCountExistingRaw > 10000) {
      fieldErrors.deviceCountExisting = "Bitte Anzahl der bereits geprüften Geräte angeben.";
    }
    if ((deviceCountExistingRaw ?? 0) + (deviceCountNew ?? 0) < 1) {
      fieldErrors.deviceCountExisting = "Insgesamt muss mindestens ein Gerät geprüft werden.";
    }
    if (!lastInspectionDateRaw) {
      fieldErrors.lastInspectionDate = "Datum der letzten Prüfung angeben.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(lastInspectionDateRaw)) {
      fieldErrors.lastInspectionDate = "Ungültiges Datum.";
    }
  }

  if (deviceTypes.length === 0) {
    fieldErrors.deviceTypes = "Mindestens eine Gerätekategorie auswählen.";
  }

  if (!desiredTimeframe) {
    fieldErrors.desiredTimeframe = "Zeitraum wählen.";
  }

  if (notes.length > 2000) {
    fieldErrors.notes = "Anmerkungen dürfen maximal 2000 Zeichen haben.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Bitte prüfen Sie die markierten Felder.", fieldErrors };
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("inspection_requests")
    .insert({
      user_id: user.id,
      is_first_inspection: isFirstInspection,
      device_count_new: deviceCountNew!,
      device_count_existing: isFirstInspection ? null : deviceCountExistingRaw!,
      last_inspection_date: isFirstInspection ? null : lastInspectionDateRaw,
      device_types: deviceTypes,
      desired_timeframe: desiredTimeframe,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[inspection-request] insert failed", error);
    return { ok: false, error: "Die Anfrage konnte nicht gespeichert werden. Bitte erneut versuchen." };
  }

  // E-Mail-Benachrichtigung (nicht blockierend — Anfrage liegt ja schon in der DB)
  try {
    if (process.env.RESEND_API_KEY && user.email) {
      const emailInput: InspectionRequestEmailInput = {
        requestId: data.id,
        customerName: user.profile.full_name ?? user.email,
        customerEmail: user.email,
        customerCompany: user.profile.company_name ?? null,
        customerPhone: user.profile.phone ?? null,
        isFirstInspection,
        deviceCountNew: deviceCountNew!,
        deviceCountExisting: isFirstInspection ? null : deviceCountExistingRaw!,
        lastInspectionDate: isFirstInspection ? null : lastInspectionDateRaw,
        deviceTypes,
        desiredTimeframe: desiredTimeframe || null,
        notes: notes || null,
      };

      const resend = getResend();
      const teamMail = renderInspectionTeamEmail({
        ...emailInput,
        supabaseProjectRef: projectRefFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
      });
      const customerMail = renderInspectionCustomerEmail(emailInput);

      await Promise.all([
        resend.emails.send({
          from: fromField(),
          to: EMAIL_CONFIG.leadsTo,
          replyTo: user.email,
          subject: teamMail.subject,
          html: teamMail.html,
        }),
        resend.emails.send({
          from: fromField(),
          to: user.email,
          replyTo: EMAIL_CONFIG.replyTo,
          subject: customerMail.subject,
          html: customerMail.html,
        }),
      ]);
    }
  } catch (err) {
    console.error("[inspection-request] email send failed", err);
    // Nicht hart fehlschlagen — DB-Eintrag existiert, Team kann manuell nachfassen.
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/anfrage");
  return { ok: true, id: data.id };
}
