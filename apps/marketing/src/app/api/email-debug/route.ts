/**
 * Diagnostic endpoint for email sending.
 * Calls Resend directly with the current env config and returns the raw response.
 *
 * Usage: GET /api/email-debug?to=you@example.com
 *
 * Returns a JSON blob with:
 *   - env: which env vars are present/missing (without leaking secret values)
 *   - attempt: the actual Resend API response or error
 *
 * IMPORTANT: this route is public. Delete it after debugging, or gate with a
 * shared secret if you keep it around.
 */
import { NextResponse } from "next/server";
import { getResend, EMAIL_CONFIG, fromField } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const to = url.searchParams.get("to");

  const envReport = {
    RESEND_API_KEY: mask(process.env.RESEND_API_KEY),
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME ?? "(unset → default)",
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS ?? "(unset → default)",
    EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO ?? "(unset → default)",
    LEADS_EMAIL_TO: process.env.LEADS_EMAIL_TO ?? "(unset → default)",
    effectiveFromField: (() => {
      try {
        return fromField();
      } catch (e) {
        return `ERROR: ${(e as Error).message}`;
      }
    })(),
  };

  if (!to) {
    return NextResponse.json({
      ok: false,
      hint: "Add ?to=your@email.com to trigger a test send",
      env: envReport,
    });
  }

  let resend;
  try {
    resend = getResend();
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        stage: "client_init",
        error: (e as Error).message,
        env: envReport,
      },
      { status: 500 },
    );
  }

  try {
    const result = await resend.emails.send({
      from: fromField(),
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: "NeuraVolt Email Debug",
      html: `<p>This is a diagnostic email sent from <code>/api/email-debug</code>.</p>
             <p>Timestamp: ${new Date().toISOString()}</p>
             <p>From: ${escapeHtml(fromField())}</p>
             <p>Reply-To: ${escapeHtml(EMAIL_CONFIG.replyTo)}</p>`,
    });

    return NextResponse.json({
      ok: true,
      stage: "sent",
      resendResponse: result,
      env: envReport,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: "send",
        error: serializeError(err),
        env: envReport,
      },
      { status: 500 },
    );
  }
}

function mask(value: string | undefined): string {
  if (!value) return "(unset)";
  if (value.length <= 8) return "***";
  return `${value.slice(0, 6)}…${value.slice(-4)} (len=${value.length})`;
}

function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack?.split("\n").slice(0, 5).join("\n"),
      ...(err as unknown as Record<string, unknown>),
    };
  }
  try {
    return { raw: JSON.parse(JSON.stringify(err)) };
  } catch {
    return { raw: String(err) };
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
