"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@neuravolt/auth/client";

type Portal = "customer" | "company";

const PORTAL_CONFIG: Record<
  Portal,
  {
    title: string;
    subtitle: string;
    allowedRoles: string[];
    targetUrlEnv: string;
    switchLabel: string;
    placeholder: string;
  }
> = {
  customer: {
    title: "Kundenportal",
    subtitle: "Melden Sie sich mit Ihrem Kundenkonto an.",
    allowedRoles: ["customer", "admin"],
    targetUrlEnv: "NEXT_PUBLIC_CUSTOMER_URL",
    switchLabel: "Zum Unternehmenslogin",
    placeholder: "ihre@email.de",
  },
  company: {
    title: "Unternehmensportal",
    subtitle: "Login für Prüfdienstleister und Partner.",
    allowedRoles: ["company", "admin"],
    targetUrlEnv: "NEXT_PUBLIC_COMPANY_URL",
    switchLabel: "Zum Kundenlogin",
    placeholder: "firma@example.de",
  },
};

const TARGET_URLS: Record<Portal, string | undefined> = {
  customer: process.env.NEXT_PUBLIC_CUSTOMER_URL,
  company: process.env.NEXT_PUBLIC_COMPANY_URL,
};

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [portal, setPortal] = useState<Portal>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const config = PORTAL_CONFIG[portal];

  function togglePortal() {
    setPortal((p) => (p === "customer" ? "company" : "customer"));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user || !data.session) {
      setError("E-Mail oder Passwort ungültig.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile || !config.allowedRoles.includes(profile.role as string)) {
      await supabase.auth.signOut();
      setError(
        portal === "customer"
          ? "Dieses Konto ist nicht für das Kundenportal freigeschaltet."
          : "Dieses Konto ist nicht für das Unternehmensportal freigeschaltet."
      );
      setLoading(false);
      return;
    }

    const target = TARGET_URLS[portal];
    if (!target) {
      setError("Ziel-Portal nicht konfiguriert.");
      setLoading(false);
      return;
    }

    // Cross-Origin-Handoff via URL-Fragment (wird nicht an den Server gesendet).
    const hash = new URLSearchParams({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }).toString();

    window.location.assign(`${target}/auth/handoff#${hash}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white border border-border shadow-2xl p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold text-foreground">
                {config.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">
                {config.subtitle}
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={togglePortal}
                title={config.switchLabel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                {portal === "customer" ? "Unternehmen" : "Kunde"}
              </button>
              <Dialog.Close asChild>
                <button
                  aria-label="Schließen"
                  className="ml-1 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={config.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition text-sm"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {forgotSent && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                Ein Link zum Zurücksetzen wurde an <strong>{email}</strong> gesendet. Bitte prüfen Sie Ihren Posteingang und Spam-Ordner.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Wird angemeldet …" : "Anmelden"}
            </button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError("Bitte geben Sie zuerst Ihre E-Mail-Adresse ein.");
                    return;
                  }
                  setError(null);
                  setLoading(true);
                  const supabase = getSupabaseBrowserClient();
                  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  });
                  setLoading(false);
                  if (resetError) {
                    setError("Link konnte nicht gesendet werden. Bitte versuchen Sie es erneut.");
                  } else {
                    setError(null);
                    setForgotSent(true);
                  }
                }}
                className="hover:text-foreground underline transition"
              >
                Passwort vergessen?
              </button>
              <Dialog.Close asChild>
                <Link href="/register" className="hover:text-foreground underline transition">
                  Konto erstellen
                </Link>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
