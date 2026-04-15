/**
 * Cloudflare Turnstile server-side verification.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string | undefined | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Dev fallback: if secret not set, log and pass — so local development without
  // Turnstile credentials still works. Production must set the secret.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[turnstile] TURNSTILE_SECRET_KEY missing in production");
      return false;
    }
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set, skipping verification (dev mode)");
    return true;
  }

  if (!token) return false;

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      console.error("[turnstile] verify endpoint returned", res.status);
      return false;
    }
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("[turnstile] verification failed", data["error-codes"]);
    }
    return Boolean(data.success);
  } catch (err) {
    console.error("[turnstile] fetch failed", err);
    return false;
  }
}
