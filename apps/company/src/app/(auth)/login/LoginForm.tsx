"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@neuravolt/auth/client";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("E-Mail oder Passwort ungültig.");
      setLoading(false);
      return;
    }

    // Rolle prüfen — nur company und admin dürfen hier rein
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile || !["company", "admin"].includes(profile.role)) {
      await supabase.auth.signOut();
      setError("Dieses Konto ist nicht für das Unternehmensportal freigeschaltet.");
      setLoading(false);
      return;
    }

    const params = await searchParams;
    const redirectTo = params.redirectTo ?? "/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition text-sm"
          placeholder="firma@example.de"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Wird angemeldet …" : "Anmelden"}
      </button>
    </form>
  );
}
