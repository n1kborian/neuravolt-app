import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { AuthUser } from "./types";

/**
 * Server-seitiger Supabase-Client für Server Components,
 * Route Handlers und Server Actions.
 * In Next.js 15+ ist cookies() asynchron — immer await verwenden.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // In Server Components nicht möglich — Middleware übernimmt den Refresh.
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods }
  );
}

/**
 * Gibt den aktuell eingeloggten User inkl. Profil zurück.
 * Gibt null zurück wenn nicht eingeloggt.
 * Verwendet getUser() (nicht getSession()) zur sicheren Server-Validierung.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email,
    profile,
  };
}
