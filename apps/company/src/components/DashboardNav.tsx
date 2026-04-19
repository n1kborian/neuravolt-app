"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@neuravolt/auth/client";
import { LayoutDashboard, FileText, Receipt, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/auftraege", label: "Aufträge", icon: FileText },
  { href: "/dashboard/abrechnung", label: "Abrechnung", icon: Receipt },
  { href: "/dashboard/settings", label: "Einstellungen", icon: Settings },
];

export function DashboardNav({ companyName }: { companyName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll while drawer is open (mobile only)
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : original;
    return () => { document.body.style.overflow = original; };
  }, [open]);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-background/90 backdrop-blur-sm"
        style={{
          boxShadow:
            "0 1px 0 oklch(0.75 0.18 195 / 0.5), 0 4px 20px oklch(0.75 0.18 195 / 0.08), 0 1px 20px rgba(0,0,0,0.04)",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Menü öffnen"
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <Link href="/dashboard" className="tracking-widest font-bold text-base text-foreground">
          NEURA<span className="font-normal">VOLT</span>
        </Link>
        <div className="w-9" aria-hidden />
      </header>

      {/* Overlay (mobile only, when open) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: drawer on mobile (fixed + translate), static on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-background/95 backdrop-blur-md
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-60 md:bg-background/80
        `}
        style={{
          boxShadow:
            "1px 0 0 oklch(0.75 0.18 195 / 0.5), 4px 0 20px oklch(0.75 0.18 195 / 0.08), 1px 0 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Brand + close button */}
        <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href="/dashboard" className="block">
              <span className="tracking-widest font-bold text-lg text-foreground">
                NEURA<span className="font-normal">VOLT</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground mt-1 truncate">{companyName}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Menü schließen"
            className="md:hidden p-1 -mr-1 rounded-lg hover:bg-muted text-muted-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Abmelden
          </button>
        </div>
      </aside>
    </>
  );
}
