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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-background to-muted/30">
      <DashboardNav companyName={displayName} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
