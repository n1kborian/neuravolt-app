import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";
import { renderNewsletterWelcomeEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

function redirect(url: string, status: "success" | "expired" | "invalid"): NextResponse {
  const target = new URL("/ratgeber", url);
  target.searchParams.set("newsletter", status);
  return NextResponse.redirect(target.toString());
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const origin = process.env.NEXT_PUBLIC_MARKETING_URL ?? url.origin;

  if (!token) return redirect(origin, "invalid");

  const supabase = getSupabaseAdmin();
  const { data: row, error } = await supabase
    .from("newsletter_signups")
    .select("id, email, status, confirm_token_expires_at")
    .eq("confirm_token", token)
    .maybeSingle();

  if (error || !row) return redirect(origin, "invalid");

  if (row.status === "confirmed") return redirect(origin, "success");

  const expiresAt = new Date(row.confirm_token_expires_at);
  if (expiresAt.getTime() < Date.now()) return redirect(origin, "expired");

  const { error: updateError } = await supabase
    .from("newsletter_signups")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", row.id);

  if (updateError) {
    console.error("[newsletter/confirm] update failed", updateError);
    return redirect(origin, "invalid");
  }

  try {
    const resend = getResend();
    const mail = renderNewsletterWelcomeEmail();
    await resend.emails.send({
      from: fromField(),
      to: row.email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: mail.subject,
      html: mail.html,
    });
  } catch (err) {
    console.error("[newsletter/confirm] welcome mail failed", err);
  }

  return redirect(origin, "success");
}
