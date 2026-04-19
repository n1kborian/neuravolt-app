import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Profil – NeuraVolt" };

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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
        }}
        email={user.email ?? ""}
      />
    </div>
  );
}
