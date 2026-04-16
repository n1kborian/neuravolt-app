"use server";

import { getSupabaseServerClient, getCurrentUser } from "@neuravolt/auth/server";
import { revalidatePath } from "next/cache";

export type ProfileData = {
  fullName: string;
  companyName: string;
  phone: string;
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[settings] profile update failed", error);
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
