import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";
import { renderFristencheckEmail } from "@/lib/email-templates";
import { getClientIp, hashIp } from "@/lib/ip";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(200),
  company: z.string().max(200).optional(),
  branche: z.string().max(120).optional(),
  consentPrivacy: z.literal(true),
  turnstileToken: z.string().min(1).max(2048),
  // Fristen-Rechner (optional): wenn gesetzt, wird Erinnerung aktiviert.
  deviceTypes: z.array(z.enum([
    "ortsveraenderlich",
    "verlaengerung",
    "handwerkzeug_maschinen",
    "ortsfeste_anlagen",
  ])).optional(),
  environment: z.enum(["buero", "werkstatt"]).optional(),
  lastInspectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reminderActive: z.boolean().optional(),
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

  const { error: dbError } = await supabase
    .from("fristencheck_signups")
    .upsert(
      {
        email: data.email.toLowerCase(),
        company: data.company ?? null,
        branche: data.branche ?? null,
        consent_privacy: data.consentPrivacy,
        user_agent: userAgent,
        ip_hash: ipHash,
        device_types: data.deviceTypes ?? [],
        environment: data.environment ?? null,
        last_inspection_date: data.lastInspectionDate ?? null,
        next_due_date: data.nextDueDate ?? null,
        reminder_active: data.reminderActive ?? false,
      },
      { onConflict: "email" }
    );

  if (dbError) {
    console.error("[fristencheck] db insert failed", dbError);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  try {
    const resend = getResend();
    const mail = renderFristencheckEmail({ email: data.email });
    await Promise.all([
      resend.emails.send({
        from: fromField(),
        to: EMAIL_CONFIG.leadsTo,
        replyTo: data.email,
        subject: `Neuer Fristencheck-Lead: ${data.email}`,
        html: `<p>Neuer Fristencheck-Lead:</p><p>${data.email}${data.company ? ` · ${data.company}` : ""}${data.branche ? ` · ${data.branche}` : ""}</p>`,
      }),
      resend.emails.send({
        from: fromField(),
        to: data.email,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: mail.subject,
        html: mail.html,
      }),
    ]);
  } catch (err) {
    console.error("[fristencheck] email send failed", err);
  }

  return NextResponse.json({ ok: true });
}
