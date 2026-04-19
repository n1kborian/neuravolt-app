"use server";

import { getSupabaseServerClient, getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DEVICE_TYPES, type ActionState } from "./constants";

function toInt(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
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

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/anfrage");
  return { ok: true, id: data.id };
}
