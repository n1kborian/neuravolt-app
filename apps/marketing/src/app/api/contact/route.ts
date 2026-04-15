import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";
import { renderContactTeamEmail, renderContactCustomerEmail } from "@/lib/email-templates";
import { getClientIp, hashIp } from "@/lib/ip";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const schema = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(200).optional(),
  branche: z.string().max(120).optional(),
  deviceCountRange: z.string().max(40).optional(),
  message: z.string().max(4000).optional(),
  consentPrivacy: z.literal(true),
  turnstileToken: z.string().min(1).max(2048),
});

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

  const clientIp = getClientIp(request.headers);
  const turnstileOk = await verifyTurnstileToken(data.turnstileToken, clientIp);
  if (!turnstileOk) {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const ipHash = hashIp(clientIp);
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { error: dbError } = await supabase.from("contact_requests").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    company: data.company ?? null,
    branche: data.branche ?? null,
    device_count_range: data.deviceCountRange ?? null,
    message: data.message ?? null,
    consent_privacy: data.consentPrivacy,
    user_agent: userAgent,
    ip_hash: ipHash,
  });

  if (dbError) {
    console.error("[contact] db insert failed", dbError);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  try {
    const resend = getResend();
    const teamMail = renderContactTeamEmail(data);
    const customerMail = renderContactCustomerEmail({ firstName: data.firstName });
    await Promise.all([
      resend.emails.send({
        from: fromField(),
        to: EMAIL_CONFIG.leadsTo,
        replyTo: data.email,
        subject: teamMail.subject,
        html: teamMail.html,
      }),
      resend.emails.send({
        from: fromField(),
        to: data.email,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: customerMail.subject,
        html: customerMail.html,
      }),
    ]);
  } catch (err) {
    console.error("[contact] email send failed", err);
  }

  return NextResponse.json({ ok: true });
}
