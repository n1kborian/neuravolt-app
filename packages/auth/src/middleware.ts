import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "./types";

export interface ProtectOptions {
  /** Rollen, die auf diese App zugreifen dürfen. */
  allowedRoles: UserRole[];
  /** Pfad zur Login-Seite der jeweiligen App. */
  loginPath: string;
  /** Pfad bei unzureichenden Rechten (default: loginPath). */
  unauthorizedPath?: string;
}

/**
 * Universeller Auth-Middleware-Helper.
 * Jede App ruft diesen mit ihrer eigenen Rollenkonfiguration auf.
 */
export async function withAuth(
  request: NextRequest,
  options: ProtectOptions
): Promise<NextResponse> {
  const response = NextResponse.next({ request });

  const cookies: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options: opts }) => {
        request.cookies.set(name, value);
        response.cookies.set(name, value, opts);
      });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  // WICHTIG: getUser() statt getSession() — validiert JWT serverseitig.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL(options.loginPath, request.url);
    // nextUrl.pathname ist korrekt für Next.js Middleware
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !options.allowedRoles.includes(profile.role as UserRole)) {
    const target = options.unauthorizedPath ?? options.loginPath;
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}
