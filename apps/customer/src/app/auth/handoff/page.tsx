"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@neuravolt/auth/client";

export default function HandoffPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError("Login-Daten fehlen.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: setErr }) => {
        if (setErr) {
          setError("Sitzung konnte nicht übernommen werden.");
          return;
        }
        // Hash aus der URL entfernen, dann ins Dashboard.
        window.history.replaceState(null, "", "/auth/handoff");
        router.replace("/dashboard");
        router.refresh();
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <a href="/login" className="text-sm font-semibold underline">
              Zum Login
            </a>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Sitzung wird übernommen …</p>
        )}
      </div>
    </div>
  );
}
