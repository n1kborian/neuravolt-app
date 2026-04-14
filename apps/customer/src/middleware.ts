import { withAuth } from "@neuravolt/auth/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return withAuth(request, {
    allowedRoles: ["customer"],
    loginPath: "/login",
    unauthorizedPath: "/login?error=unauthorized",
  });
}

export const config = {
  matcher: [
    "/((?!login|auth/callback|auth/handoff|_next/static|_next/image|favicon.ico).*)",
  ],
};
