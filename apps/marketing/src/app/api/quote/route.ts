import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";
import { calculateQuote, PRICING } from "@/lib/pricing";
import { renderQuoteCustomerEmail, renderQuoteTeamEmail } from "@/lib/email-templates";
import { getClientIp, hashIp } from "@/lib/ip";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const schema = z.object({
  branche: z.string().max(120).optional(),
  deviceCount: z.number().int().min(1).max(10_000),
  isFirstInspection: z.boolean(),
  desiredTimeframe: z.string().max(120).optional(),
  postalCode: z.string().max(10).optional(),
  city: z.string().max(120).optional(),
  company: z.string().max(200).optional(),
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  notes: z.string().max(2000).optional(),
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
    return NextResponse.json({ error: "validation_failed", issues: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const clientIp = getClientIp(request.headers);
  const turnstileOk = await verifyTurnstileToken(data.turnstileToken, clientIp);
  if (!turnstileOk) {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const quote = calculateQuote({
    deviceCount: data.deviceCount,
    isFirstInspection: data.isFirstInspection,
  });

  const supabase = getSupabaseAdmin();
  const ipHash = hashIp(clientIp);
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { error: dbError } = await supabase.from("quote_requests").insert({
    branche: data.branche ?? null,
    device_count: data.deviceCount,
    is_first_inspection: data.isFirstInspection,
    desired_timeframe: data.desiredTimeframe ?? null,
    postal_code: data.postalCode ?? null,
    city: data.city ?? null,
    company: data.company ?? null,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone ?? null,
    notes: data.notes ?? null,
    price_per_device_cents: Math.round(quote.pricePerDevice * 100),
    devices_subtotal_cents: Math.round(quote.devicesSubtotal * 100),
    travel_fee_cents: Math.round(quote.travelFee * 100),
    setup_fee_cents: Math.round(quote.setupFee * 100),
    minimum_adjustment_cents: Math.round(quote.minimumAdjustment * 100),
    net_total_cents: Math.round(quote.netTotal * 100),
    vat_cents: Math.round(quote.vat * 100),
    gross_total_cents: Math.round(quote.grossTotal * 100),
    consent_privacy: data.consentPrivacy,
    user_agent: userAgent,
    ip_hash: ipHash,
  });

  if (dbError) {
    console.error("[quote] db insert failed", dbError);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  try {
    const resend = getResend();
    const teamMail = renderQuoteTeamEmail({ ...data, quote });
    const customerMail = renderQuoteCustomerEmail({ ...data, quote });

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
    console.error("[quote] email send failed", err);
    // Nicht hart fehlschlagen — Lead liegt in der DB, wir können manuell nachfassen.
  }

  return NextResponse.json({
    ok: true,
    quote: {
      netTotal: quote.netTotal,
      grossTotal: quote.grossTotal,
      vat: quote.vat,
      devicesSubtotal: quote.devicesSubtotal,
      travelFee: quote.travelFee,
      setupFee: quote.setupFee,
      pricePerDevice: quote.pricePerDevice,
      minimumAdjustment: quote.minimumAdjustment,
    },
    minOrderValue: PRICING.minOrderValue,
  });
}
