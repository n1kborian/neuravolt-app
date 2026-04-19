const brand = "#0a0a0a";
const textMuted = "#6b7280";
const border = "#e5e7eb";
const accent = "#06b6d4";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(inner: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NeuraVolt</title>
<style>
  body { margin:0; padding:0; background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:${brand}; }
  a { color:${accent}; }
  .container { max-width:600px; margin:0 auto; background:#ffffff; }
  .preview { display:none; max-height:0; overflow:hidden; }
  .header { padding:32px 32px 0 32px; }
  .logo { font-size:20px; font-weight:800; letter-spacing:3px; color:${brand}; }
  .logo span { font-weight:400; }
  .content { padding:24px 32px 32px 32px; }
  h1 { font-size:24px; margin:16px 0 8px 0; color:${brand}; }
  h2 { font-size:18px; margin:24px 0 8px 0; color:${brand}; }
  p { color:${textMuted}; line-height:1.6; margin:0 0 12px 0; }
  .btn { display:inline-block; padding:14px 28px; background:${brand}; color:#ffffff !important; text-decoration:none; border-radius:9999px; font-weight:600; margin:16px 0; }
  .box { border:1px solid ${border}; border-radius:12px; padding:20px; margin:16px 0; background:#fafafa; }
  .footer { padding:24px 32px; border-top:1px solid ${border}; color:${textMuted}; font-size:12px; text-align:center; }
  table { width:100%; border-collapse:collapse; }
  td { padding:8px 0; font-size:14px; vertical-align:top; }
  td.label { color:${textMuted}; width:50%; }
  td.value { color:${brand}; text-align:right; font-weight:500; }
</style>
</head>
<body>
  <div class="preview">${escapeHtml(previewText)}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td>
      <div class="container" style="border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <div class="header"><div class="logo">NEURA<span>VOLT</span></div></div>
        <div class="content">${inner}</div>
        <div class="footer">
          NeuraVolt · Schwalbenweg 6 · 70825 Korntal-Münchingen · Deutschland<br>
          <a href="https://neuravolt.de">neuravolt.de</a> · <a href="mailto:info@neuravolt.de">info@neuravolt.de</a>
        </div>
      </div>
    </td></tr>
  </table>
</body></html>`;
}

export interface InspectionRequestEmailInput {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string | null;
  customerPhone?: string | null;
  isFirstInspection: boolean;
  deviceCountNew: number;
  deviceCountExisting: number | null;
  lastInspectionDate: string | null;
  deviceTypes: string[];
  desiredTimeframe: string | null;
  notes: string | null;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
}

function formatAddress(input: InspectionRequestEmailInput): string {
  return [input.addressStreet, `${input.addressPostalCode} ${input.addressCity}`.trim()]
    .filter(Boolean)
    .join(", ");
}

const DEVICE_TYPE_LABELS: Record<string, string> = {
  ortsveraenderlich:       "Ortsveränderliche Betriebsmittel",
  verlaengerung:           "Verlängerungen & Steckdosenleisten",
  handwerkzeug_maschinen:  "Handwerkzeug & Maschinen",
  ortsfeste_anlagen:       "Ortsfeste Anlagen",
};

function deviceTypesList(types: string[]): string {
  if (types.length === 0) return "—";
  return types.map(t => DEVICE_TYPE_LABELS[t] ?? t).join(", ");
}

function formatGermanDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

// ── Bestätigung an den Kunden ───────────────────────────────────────────────
export function renderInspectionCustomerEmail(
  input: InspectionRequestEmailInput
): { subject: string; html: string } {
  const total = input.deviceCountNew + (input.deviceCountExisting ?? 0);
  const subject = `Ihre DGUV-Prüfanfrage ist eingegangen — ${total} Gerät${total === 1 ? "" : "e"}`;
  const customerUrl = process.env.NEXT_PUBLIC_CUSTOMER_URL ?? "https://kunde.neuravolt.de";

  const inner = `
    <h1>Vielen Dank, ${escapeHtml(input.customerName)}.</h1>
    <p>Wir haben Ihre Anfrage für eine DGUV V3 Prüfung erhalten und melden uns innerhalb von 24 Stunden mit einem Festpreis-Angebot.</p>

    <div class="box">
      <h2 style="margin-top:0;">Ihre Anfrage im Überblick</h2>
      <table>
        <tr><td class="label">Prüfungsart</td><td class="value">${input.isFirstInspection ? "Erstprüfung" : "Folgeprüfung"}</td></tr>
        ${input.isFirstInspection
          ? `<tr><td class="label">Anzahl Geräte</td><td class="value">${input.deviceCountNew}</td></tr>`
          : `
            <tr><td class="label">Bereits geprüft</td><td class="value">${input.deviceCountExisting ?? 0}</td></tr>
            <tr><td class="label">Neue Geräte</td><td class="value">${input.deviceCountNew}</td></tr>
            <tr><td class="label">Letzte Prüfung</td><td class="value">${formatGermanDate(input.lastInspectionDate)}</td></tr>
          `}
        <tr><td class="label">Gerätekategorien</td><td class="value">${escapeHtml(deviceTypesList(input.deviceTypes))}</td></tr>
        ${input.desiredTimeframe ? `<tr><td class="label">Wunschzeitraum</td><td class="value">${escapeHtml(input.desiredTimeframe)}</td></tr>` : ""}
        <tr><td class="label">Adresse der Durchführung</td><td class="value">${escapeHtml(formatAddress(input))}</td></tr>
      </table>
    </div>

    <p><a class="btn" href="${customerUrl}/dashboard/anfrage">Anfrage im Kundenportal ansehen</a></p>

    <p>Bei Fragen erreichen Sie uns jederzeit unter <a href="mailto:info@neuravolt.de">info@neuravolt.de</a>.</p>
  `;

  return { subject, html: shell(inner, "Ihre DGUV-Prüfanfrage ist eingegangen.") };
}

// ── Team-Notification an info@neuravolt.de ──────────────────────────────────
export function renderInspectionTeamEmail(
  input: InspectionRequestEmailInput & { supabaseProjectRef?: string }
): { subject: string; html: string } {
  const total = input.deviceCountNew + (input.deviceCountExisting ?? 0);
  const subject = `[Anfrage] ${input.customerCompany ?? input.customerName} — ${total} Gerät${total === 1 ? "" : "e"}`;

  const rowLink = input.supabaseProjectRef
    ? `https://supabase.com/dashboard/project/${input.supabaseProjectRef}/editor/inspection_requests?filter=id%3A${input.requestId}`
    : null;

  const inner = `
    <h1>Neue DGUV-Prüfanfrage</h1>
    <p>Eingegangen von <strong>${escapeHtml(input.customerName)}</strong>${input.customerCompany ? ` (${escapeHtml(input.customerCompany)})` : ""}.</p>

    <div class="box">
      <h2 style="margin-top:0;">Kunde</h2>
      <table>
        <tr><td class="label">Name</td><td class="value">${escapeHtml(input.customerName)}</td></tr>
        ${input.customerCompany ? `<tr><td class="label">Unternehmen</td><td class="value">${escapeHtml(input.customerCompany)}</td></tr>` : ""}
        <tr><td class="label">E-Mail</td><td class="value"><a href="mailto:${escapeHtml(input.customerEmail)}">${escapeHtml(input.customerEmail)}</a></td></tr>
        ${input.customerPhone ? `<tr><td class="label">Telefon</td><td class="value">${escapeHtml(input.customerPhone)}</td></tr>` : ""}
        <tr><td class="label">Adresse der Durchführung</td><td class="value">${escapeHtml(formatAddress(input))}</td></tr>
      </table>
    </div>

    <div class="box">
      <h2 style="margin-top:0;">Prüfumfang</h2>
      <table>
        <tr><td class="label">Prüfungsart</td><td class="value">${input.isFirstInspection ? "Erstprüfung" : "Folgeprüfung"}</td></tr>
        ${input.isFirstInspection
          ? `<tr><td class="label">Anzahl Geräte</td><td class="value">${input.deviceCountNew}</td></tr>`
          : `
            <tr><td class="label">Bereits geprüft</td><td class="value">${input.deviceCountExisting ?? 0}</td></tr>
            <tr><td class="label">Neue Geräte</td><td class="value">${input.deviceCountNew}</td></tr>
            <tr><td class="label">Gesamt</td><td class="value">${total}</td></tr>
            <tr><td class="label">Letzte Prüfung</td><td class="value">${formatGermanDate(input.lastInspectionDate)}</td></tr>
          `}
        <tr><td class="label">Gerätekategorien</td><td class="value">${escapeHtml(deviceTypesList(input.deviceTypes))}</td></tr>
        ${input.desiredTimeframe ? `<tr><td class="label">Wunschzeitraum</td><td class="value">${escapeHtml(input.desiredTimeframe)}</td></tr>` : ""}
      </table>
    </div>

    ${input.notes ? `
    <div class="box">
      <h2 style="margin-top:0;">Anmerkungen</h2>
      <p style="white-space:pre-wrap;">${escapeHtml(input.notes)}</p>
    </div>` : ""}

    ${rowLink ? `<p><a class="btn" href="${rowLink}">In Supabase öffnen</a></p>` : ""}

    <p>Anfrage-ID: <code>${escapeHtml(input.requestId)}</code></p>
  `;

  return { subject, html: shell(inner, "Neue DGUV-Anfrage im Kundenportal.") };
}
