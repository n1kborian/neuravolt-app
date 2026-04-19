import { getCurrentUser } from "@neuravolt/auth/server";
import { redirect } from "next/navigation";
import { CustomerNav } from "@/components/CustomerNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!["customer", "admin"].includes(user.profile.role)) {
    redirect("/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-background to-muted/30">
      <CustomerNav name={user.profile.full_name ?? user.email ?? "Kunde"} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
