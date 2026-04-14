import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Einstellungen" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const fields = [
    { label: "Firma", value: user.profile.company_name ?? "—" },
    { label: "Ansprechpartner", value: user.profile.full_name ?? "—" },
    { label: "E-Mail", value: user.email ?? "—" },
    { label: "Telefon", value: user.profile.phone ?? "—" },
  ];

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Stammdaten Ihres Unternehmensaccounts.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-background/80 divide-y divide-border">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
