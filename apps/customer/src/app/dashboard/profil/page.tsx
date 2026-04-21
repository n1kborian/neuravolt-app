import { getCurrentUser, getSupabaseServerClient } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Profil – NeuraVolt" };

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Billing-Felder direkt aus profiles laden (nicht im AuthUser-Typ enthalten).
  const supabase = await getSupabaseServerClient();
  const { data: billing } = await supabase
    .from("profiles")
    .select("billing_company, billing_street, billing_postal_code, billing_city")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Profil</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ihre hinterlegten Stammdaten.
        </p>
      </header>

      <ProfileForm
        initialData={{
          fullName: user.profile.full_name ?? "",
          companyName: user.profile.company_name ?? "",
          phone: user.profile.phone ?? "",
          billingCompany: (billing?.billing_company as string | null) ?? "",
          billingStreet: (billing?.billing_street as string | null) ?? "",
          billingPostalCode: (billing?.billing_postal_code as string | null) ?? "",
          billingCity: (billing?.billing_city as string | null) ?? "",
        }}
        email={user.email ?? ""}
      />
    </div>
  );
}
