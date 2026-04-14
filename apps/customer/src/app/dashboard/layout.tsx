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
    <div className="min-h-screen flex">
      <CustomerNav name={user.profile.full_name ?? user.email ?? "Kunde"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
