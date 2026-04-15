import { formatEuro, type QuoteBreakdown } from "./pricing";

const brand = "#0a0a0a";
const textMuted = "#6b7280";
const border = "#e5e7eb";
const accent = "#06b6d4";

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
  .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid ${border}; }
  .row:last-child { border-bottom:none; font-weight:700; color:${brand}; }
  .label { color:${textMuted}; font-size:14px; }
  .value { color:${brand}; font-size:14px; text-align:right; }
  .footer { padding:24px 32px; border-top:1px solid ${border}; color:${textMuted}; font-size:12px; text-align:center; }
  table { width:100%; border-collapse:collapse; }
  td { padding:8px 0; font-size:14px; vertical-align:top; }
  td.label { color:${textMuted}; width:50%; }
  td.value { color:${brand}; text-align:right; font-weight:500; }
  tr.total td { border-top:2px solid ${brand}; padding-top:12px; font-weight:700; font-size:16px; }
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

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Quote confirmation to customer ───────────────────────────────────────────
export function renderQuoteCustomerEmail(input: {
  firstName: string;
  lastName: string;
  company?: string;
  branche?: string;
  deviceCount: number;
  isFirstInspection: boolean;
  desiredTimeframe?: string;
  city?: string;
  postalCode?: string;
  quote: QuoteBreakdown;
}): { subject: string; html: string } {
  const q = input.quote;
  const subject = `Ihr NeuraVolt-Angebot: DGUV V3 Prüfung für ${input.deviceCount} Geräte`;

  const inner = `
    <h1>Vielen Dank für Ihre Anfrage, ${escapeHtml(input.firstName)}.</h1>
    <p>Hier ist Ihre unverbindliche Preisübersicht basierend auf den Angaben im Preisrechner. Eine persönliche Bestätigung mit Termin­vorschlag folgt in Kürze per Telefon oder E-Mail.</p>

    <div class="box">
      <h2 style="margin-top:0;">Ihre Angaben</h2>
      <table>
        ${input.company ? `<tr><td class="label">Unternehmen</td><td class="value">${escapeHtml(input.company)}</td></tr>` : ""}
        ${input.branche ? `<tr><td class="label">Branche</td><td class="value">${escapeHtml(input.branche)}</td></tr>` : ""}
        <tr><td class="label">Anzahl Geräte</td><td class="value">${input.deviceCount}</td></tr>
        <tr><td class="label">Prüfungsart</td><td class="value">${input.isFirstInspection ? "Erstprüfung" : "Folgeprüfung"}</td></tr>
        ${input.desiredTimeframe ? `<tr><td class="label">Gewünschter Zeitraum</td><td class="value">${escapeHtml(input.desiredTimeframe)}</td></tr>` : ""}
        ${input.city || input.postalCode ? `<tr><td class="label">Standort</td><td class="value">${escapeHtml([input.postalCode, input.city].filter(Boolean).join(" "))}</td></tr>` : ""}
      </table>
    </div>

    <div class="box">
      <h2 style="margin-top:0;">Preiskalkulation</h2>
      <table>
        <tr><td class="label">${input.deviceCount} × ${formatEuro(q.pricePerDevice)} pro Gerät</td><td class="value">${formatEuro(q.devicesSubtotal)}</td></tr>
        <tr><td class="label">Anfahrtspauschale</td><td class="value">${formatEuro(q.travelFee)}</td></tr>
        ${q.setupFee > 0 ? `<tr><td class="label">Einrichtungspreis Erstprüfung</td><td class="value">${formatEuro(q.setupFee)}</td></tr>` : ""}
        ${q.minimumAdjustment > 0 ? `<tr><td class="label">Mindestauftragswert-Anpassung</td><td class="value">${formatEuro(q.minimumAdjustment)}</td></tr>` : ""}
        <tr><td class="label">Zwischensumme (netto)</td><td class="value">${formatEuro(q.netTotal)}</td></tr>
        <tr><td class="label">MwSt. 19 %</td><td class="value">${formatEuro(q.vat)}</td></tr>
        <tr class="total"><td class="label">Gesamt (brutto)</td><td class="value">${formatEuro(q.grossTotal)}</td></tr>
      </table>
    </div>

    <p><strong>Was passiert als Nächstes?</strong> Wir melden uns innerhalb von 24 Stunden mit einem konkreten Terminvorschlag und letzten Details. Bei Rückfragen können Sie direkt auf diese E-Mail antworten.</p>

    <p style="font-size:12px;color:${textMuted};margin-top:24px;">Dieses Angebot ist unverbindlich und 30 Tage gültig. Alle Preise verstehen sich zzgl. der gesetzlichen MwSt., sofern nicht anders angegeben.</p>
  `;

  return { subject, html: shell(inner, `Ihr unverbindliches Angebot: ${formatEuro(q.grossTotal)} brutto`) };
}

// ── Quote notification to NeuraVolt team ────────────────────────────────────
export function renderQuoteTeamEmail(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  branche?: string;
  deviceCount: number;
  isFirstInspection: boolean;
  desiredTimeframe?: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  quote: QuoteBreakdown;
}): { subject: string; html: string } {
  const subject = `Neue Preisanfrage: ${input.company ?? input.firstName + " " + input.lastName} · ${input.deviceCount} Geräte · ${formatEuro(input.quote.grossTotal)}`;
  const inner = `
    <h1>Neue Preisanfrage</h1>
    <div class="box">
      <table>
        <tr><td class="label">Name</td><td class="value">${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}</td></tr>
        ${input.company ? `<tr><td class="label">Unternehmen</td><td class="value">${escapeHtml(input.company)}</td></tr>` : ""}
        <tr><td class="label">E-Mail</td><td class="value"><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></td></tr>
        ${input.phone ? `<tr><td class="label">Telefon</td><td class="value">${escapeHtml(input.phone)}</td></tr>` : ""}
        ${input.branche ? `<tr><td class="label">Branche</td><td class="value">${escapeHtml(input.branche)}</td></tr>` : ""}
        <tr><td class="label">Geräte</td><td class="value">${input.deviceCount}</td></tr>
        <tr><td class="label">Prüfungsart</td><td class="value">${input.isFirstInspection ? "Erstprüfung" : "Folgeprüfung"}</td></tr>
        ${input.desiredTimeframe ? `<tr><td class="label">Zeitraum</td><td class="value">${escapeHtml(input.desiredTimeframe)}</td></tr>` : ""}
        ${input.postalCode || input.city ? `<tr><td class="label">Standort</td><td class="value">${escapeHtml([input.postalCode, input.city].filter(Boolean).join(" "))}</td></tr>` : ""}
        ${input.notes ? `<tr><td class="label">Notiz</td><td class="value">${escapeHtml(input.notes)}</td></tr>` : ""}
      </table>
    </div>
    <div class="box">
      <table>
        <tr><td class="label">Netto</td><td class="value">${formatEuro(input.quote.netTotal)}</td></tr>
        <tr><td class="label">MwSt.</td><td class="value">${formatEuro(input.quote.vat)}</td></tr>
        <tr class="total"><td class="label">Brutto</td><td class="value">${formatEuro(input.quote.grossTotal)}</td></tr>
      </table>
    </div>
  `;
  return { subject, html: shell(inner, subject) };
}

// ── Newsletter double opt-in confirmation ────────────────────────────────────
export function renderNewsletterConfirmEmail(input: {
  email: string;
  confirmUrl: string;
}): { subject: string; html: string } {
  const subject = "Bestätigen Sie Ihre Newsletter-Anmeldung bei NeuraVolt";
  const inner = `
    <h1>Bestätigen Sie Ihre E-Mail</h1>
    <p>Sie haben sich zum NeuraVolt Ratgeber-Newsletter angemeldet. Bitte bestätigen Sie Ihre E-Mail-Adresse, um die Anmeldung abzuschließen.</p>
    <p style="text-align:center;"><a href="${escapeHtml(input.confirmUrl)}" class="btn">Anmeldung bestätigen</a></p>
    <p style="font-size:12px;color:${textMuted};">Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br><a href="${escapeHtml(input.confirmUrl)}">${escapeHtml(input.confirmUrl)}</a></p>
    <p style="font-size:12px;color:${textMuted};margin-top:24px;">Sie haben sich nicht angemeldet? Dann ignorieren Sie diese E-Mail einfach — es werden keine weiteren Nachrichten versendet.</p>
  `;
  return { subject, html: shell(inner, "Bitte bestätigen Sie Ihre Newsletter-Anmeldung.") };
}

// ── Newsletter confirmation success ──────────────────────────────────────────
export function renderNewsletterWelcomeEmail(): { subject: string; html: string } {
  const subject = "Willkommen im NeuraVolt Ratgeber-Newsletter";
  const inner = `
    <h1>Willkommen an Bord.</h1>
    <p>Vielen Dank für Ihre Bestätigung. Sie erhalten ab sofort unseren Ratgeber-Newsletter mit praxisnahen Tipps rund um die DGUV V3 Betriebsmittelprüfung — Fristen, Haftung, Kosten und branchenspezifische Besonderheiten.</p>
    <p>Sie können sich jederzeit mit einem Klick austragen. Wir geben Ihre Daten niemals an Dritte weiter.</p>
  `;
  return { subject, html: shell(inner, "Willkommen im NeuraVolt Ratgeber-Newsletter.") };
}

// ── Fristencheck freebie confirmation ────────────────────────────────────────
export function renderFristencheckEmail(_input: { email: string }): { subject: string; html: string } {
  const subject = "Ihr kostenloser NeuraVolt Fristencheck ist aktiviert";
  const inner = `
    <h1>Fristencheck aktiviert.</h1>
    <p>Vielen Dank für Ihre Anmeldung zum kostenlosen Fristencheck. Wir melden uns frühzeitig, wenn Ihre nächste DGUV V3 Prüfung ansteht — so vergessen Sie keine gesetzliche Frist mehr.</p>
    <p>Bei Fragen erreichen Sie uns jederzeit unter <a href="mailto:info@neuravolt.de">info@neuravolt.de</a>.</p>
    <p style="font-size:12px;color:${textMuted};margin-top:24px;">Die Teilnahme ist kostenlos und unverbindlich. Sie können den Dienst jederzeit beenden, indem Sie uns eine kurze Nachricht schreiben.</p>
  `;
  return { subject, html: shell(inner, "Ihr Fristencheck ist aktiviert.") };
}

// ── Contact form team notification ───────────────────────────────────────────
export function renderContactTeamEmail(input: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  branche?: string;
  deviceCountRange?: string;
  desiredTimeframe?: string;
  message?: string;
}): { subject: string; html: string } {
  const subject = `Neue Kontaktanfrage: ${input.company ?? input.firstName + " " + input.lastName}`;
  const inner = `
    <h1>Neue Kontaktanfrage</h1>
    <div class="box">
      <table>
        <tr><td class="label">Name</td><td class="value">${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}</td></tr>
        <tr><td class="label">E-Mail</td><td class="value"><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></td></tr>
        ${input.company ? `<tr><td class="label">Unternehmen</td><td class="value">${escapeHtml(input.company)}</td></tr>` : ""}
        ${input.branche ? `<tr><td class="label">Branche</td><td class="value">${escapeHtml(input.branche)}</td></tr>` : ""}
        ${input.deviceCountRange ? `<tr><td class="label">Geräte</td><td class="value">${escapeHtml(input.deviceCountRange)}</td></tr>` : ""}
        ${input.desiredTimeframe ? `<tr><td class="label">Wunsch-Zeitraum</td><td class="value">${escapeHtml(input.desiredTimeframe)}</td></tr>` : ""}
        ${input.message ? `<tr><td class="label">Nachricht</td><td class="value" style="white-space:pre-wrap;">${escapeHtml(input.message)}</td></tr>` : ""}
      </table>
    </div>
  `;
  return { subject, html: shell(inner, subject) };
}

export function renderContactCustomerEmail(input: { firstName: string }): { subject: string; html: string } {
  const subject = "Wir haben Ihre Anfrage erhalten";
  const inner = `
    <h1>Vielen Dank, ${escapeHtml(input.firstName)}.</h1>
    <p>Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden mit einem individuellen Angebot. Bei dringenden Fragen erreichen Sie uns unter <a href="mailto:info@neuravolt.de">info@neuravolt.de</a>.</p>
  `;
  return { subject, html: shell(inner, "Wir haben Ihre Anfrage erhalten.") };
}
