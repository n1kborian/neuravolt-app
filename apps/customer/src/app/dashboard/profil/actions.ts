"use server";

import { getSupabaseServerClient, getCurrentUser } from "@neuravolt/auth/server";
import { revalidatePath } from "next/cache";

export type ProfileData = {
  fullName: string;
  companyName: string;
  phone: string;
  billingCompany: string;
  billingStreet: string;
  billingPostalCode: string;
  billingCity: string;
};

export async function updateProfile(data: ProfileData): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Nicht angemeldet." };

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName.trim() || null,
      company_name: data.companyName.trim() || null,
      phone: data.phone.trim() || null,
      billing_company: data.billingCompany.trim() || null,
      billing_street: data.billingStreet.trim() || null,
      billing_postal_code: data.billingPostalCode.trim() || null,
      billing_city: data.billingCity.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[profil] profile update failed", error);
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  revalidatePath("/dashboard/profil");
  revalidatePath("/dashboard");
  return { ok: true };
}
