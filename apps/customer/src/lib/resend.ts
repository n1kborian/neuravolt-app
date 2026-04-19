import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  cached = new Resend(apiKey);
  return cached;
}

export const EMAIL_CONFIG = {
  fromName: process.env.EMAIL_FROM_NAME ?? "NeuraVolt",
  fromAddress: process.env.EMAIL_FROM_ADDRESS ?? "no-reply@neuravolt.de",
  leadsTo: process.env.LEADS_EMAIL_TO ?? "info@neuravolt.de",
  replyTo: process.env.EMAIL_REPLY_TO ?? "info@neuravolt.de",
};

export function fromField(): string {
  return `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromAddress}>`;
}
