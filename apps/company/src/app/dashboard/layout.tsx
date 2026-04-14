import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!["company", "admin"].includes(user.profile.role)) {
    redirect("/login?error=unauthorized");
  }

  const displayName =
    user.profile.company_name ?? user.profile.full_name ?? user.email ?? "Unternehmen";

  return (
    <div className="min-h-screen flex">
      <DashboardNav companyName={displayName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
