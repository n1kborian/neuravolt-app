import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";
import { renderNewsletterConfirmEmail } from "@/lib/email-templates";
import { getClientIp, hashIp } from "@/lib/ip";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(200),
  source: z.string().max(80).optional(),
  consentPrivacy: z.literal(true),
  turnstileToken: z.string().min(1).max(2048),
});

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }
  const data = parsed.data;
  const emailLower = data.email.toLowerCase();

  const clientIp = getClientIp(request.headers);
  const turnstileOk = await verifyTurnstileToken(data.turnstileToken, clientIp);
  if (!turnstileOk) {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(); // 72h
  const ipHash = hashIp(clientIp);
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  // Check existing signup — if already confirmed, treat as success (idempotent).
  const { data: existing, error: fetchError } = await supabase
    .from("newsletter_signups")
    .select("status")
    .eq("email", emailLower)
    .maybeSingle();

  if (fetchError) {
    console.error("[newsletter] fetch failed", fetchError);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  if (existing?.status === "confirmed") {
    return NextResponse.json({ ok: true, alreadyConfirmed: true });
  }

  const { error: upsertError } = await supabase
    .from("newsletter_signups")
    .upsert(
      {
        email: emailLower,
        status: "pending",
        confirm_token: token,
        confirm_token_expires_at: expiresAt,
        consent_privacy: data.consentPrivacy,
        source: data.source ?? "ratgeber",
        user_agent: userAgent,
        ip_hash: ipHash,
      },
      { onConflict: "email" }
    );

  if (upsertError) {
    console.error("[newsletter] upsert failed", upsertError);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_MARKETING_URL ?? "http://localhost:3000";
  const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

  try {
    const resend = getResend();
    const mail = renderNewsletterConfirmEmail({ email: emailLower, confirmUrl });
    await resend.emails.send({
      from: fromField(),
      to: emailLower,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: mail.subject,
      html: mail.html,
    });
  } catch (err) {
    console.error("[newsletter] confirm email failed", err);
    return NextResponse.json({ error: "email_send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
