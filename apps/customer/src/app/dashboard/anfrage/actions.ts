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

function parseCategoryCounts(raw: FormDataEntryValue | null): Record<string, number> {
  if (typeof raw !== "string" || raw.length === 0) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(
          ([k, v]) =>
            DEVICE_TYPES.some(t => t.value === k) &&
            typeof v === "number" &&
            Number.isFinite(v) &&
            v >= 0 &&
            v <= 10000
        )
        .map(([k, v]) => [k, Math.round(v as number)])
    );
  } catch {
    return {};
  }
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
  const desiredDeadlineRaw = String(formData.get("desiredDeadline") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const lastInspectionDateRaw = String(formData.get("lastInspectionDate") ?? "").trim();

  const addressStreet = String(formData.get("addressStreet") ?? "").trim();
  const addressPostalCode = String(formData.get("addressPostalCode") ?? "").trim();
  const addressCity = String(formData.get("addressCity") ?? "").trim();

  // Per-category counts — gesamte Anzahl pro Kategorie
  const categoryCounts = parseCategoryCounts(formData.get("categoryCounts"));
  // Bei Folgeprüfung: wie viele davon bereits durch uns geprüft
  const categoryPreviouslyInspected = parseCategoryCounts(formData.get("categoryPreviouslyInspected"));

  const fieldErrors: Record<string, string> = {};

  if (!isFirstInspection) {
    if (!lastInspectionDateRaw) {
      fieldErrors.lastInspectionDate = "Datum der letzten Prüfung angeben.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(lastInspectionDateRaw)) {
      fieldErrors.lastInspectionDate = "Ungültiges Datum.";
    }
  }

  if (deviceTypes.length === 0) {
    fieldErrors.deviceTypes = "Mindestens eine Gerätekategorie auswählen.";
  } else {
    // Pro Kategorie: Anzahl ≥ 1 zwingend; previouslyInspected ≤ Anzahl
    for (const t of deviceTypes) {
      const c = categoryCounts[t] ?? 0;
      if (c < 1) {
        fieldErrors[`categoryCount.${t}`] = "Bitte Anzahl angeben.";
      }
      if (!isFirstInspection) {
        const p = categoryPreviouslyInspected[t] ?? 0;
        if (p > c) {
          fieldErrors[`categoryPrev.${t}`] = "Darf nicht größer als die Gesamtanzahl sein.";
        }
      }
    }
  }

  // Abgeleitete Gesamtanzahlen aus den Kategorie-Counts
  const totalDevicesFromCategories = deviceTypes.reduce(
    (sum, t) => sum + (categoryCounts[t] ?? 0),
    0
  );
  const totalPreviouslyInspected = isFirstInspection
    ? 0
    : deviceTypes.reduce((sum, t) => sum + (categoryPreviouslyInspected[t] ?? 0), 0);
  const derivedDeviceCountNew = totalDevicesFromCategories - totalPreviouslyInspected;

  if (!desiredTimeframe) {
    fieldErrors.desiredTimeframe = "Zeitraum wählen.";
  }

  // Flexibel-Deadline: optional, aber wenn gesetzt muss sie in der Zukunft liegen.
  let desiredDeadline: string | null = null;
  if (desiredTimeframe === "Flexibel" && desiredDeadlineRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(desiredDeadlineRaw)) {
      fieldErrors.desiredDeadline = "Ungültiges Datum.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(desiredDeadlineRaw);
      if (deadline.getTime() <= today.getTime()) {
        fieldErrors.desiredDeadline = "Datum muss in der Zukunft liegen.";
      } else {
        desiredDeadline = desiredDeadlineRaw;
      }
    }
  }

  if (notes.length > 2000) {
    fieldErrors.notes = "Anmerkungen dürfen maximal 2000 Zeichen haben.";
  }

  if (!addressStreet || addressStreet.length < 3) {
    fieldErrors.addressStreet = "Straße und Hausnummer angeben.";
  } else if (addressStreet.length > 200) {
    fieldErrors.addressStreet = "Maximal 200 Zeichen.";
  }
  if (!addressPostalCode || !/^\d{4,5}$/.test(addressPostalCode)) {
    fieldErrors.addressPostalCode = "Gültige Postleitzahl angeben.";
  }
  if (!addressCity || addressCity.length < 2) {
    fieldErrors.addressCity = "Ort angeben.";
  } else if (addressCity.length > 120) {
    fieldErrors.addressCity = "Maximal 120 Zeichen.";
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
      device_count_new: derivedDeviceCountNew,
      device_count_existing: isFirstInspection ? null : totalPreviouslyInspected,
      last_inspection_date: isFirstInspection ? null : lastInspectionDateRaw,
      device_types: deviceTypes,
      device_category_counts: categoryCounts,
      device_category_counts_previous: isFirstInspection ? {} : categoryPreviouslyInspected,
      desired_timeframe: desiredTimeframe,
      desired_deadline: desiredDeadline,
      notes: notes || null,
      address_street: addressStreet,
      address_postal_code: addressPostalCode,
      address_city: addressCity,
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
        deviceCountNew: derivedDeviceCountNew,
        deviceCountExisting: isFirstInspection ? null : totalPreviouslyInspected,
        lastInspectionDate: isFirstInspection ? null : lastInspectionDateRaw,
        deviceTypes,
        deviceCategoryCounts: categoryCounts,
        deviceCategoryCountsPrevious: isFirstInspection ? undefined : categoryPreviouslyInspected,
        desiredTimeframe: desiredTimeframe || null,
        notes: notes || null,
        addressStreet,
        addressPostalCode,
        addressCity,
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
