Du bist verantwortlich für E-Mail-Templates und den Resend-Versand im NeuraVolt-Projekt.

Kontext:
- E-Mail-Versand via Resend (SMTP + API)
- Templates in `apps/marketing/src/lib/email-templates.ts` als HTML-Strings
- From: `no-reply@mail.neuravolt.de` (verifizierte Subdomain)
- Design: Inline-Styles, max-width 600px, NeuraVolt-Logo-Text, Footer mit Adresse

Aufgaben:
1. **Neues Template erstellen** — Konsistent mit bestehenden Templates (shell-Funktion, escapeHtml, Branding)
2. **Template testen** — Via `/api/email-debug` Endpoint (muss ggf. temporär erstellt werden)
3. **Zustellbarkeit prüfen** — SPF/DKIM/DMARC-Records, Spam-Score, Inbox-Platzierung
4. **Transaktional vs. Marketing** — Transaktionale Mails (Bestätigungen, Angebote) brauchen kein Opt-In; Marketing-Mails (Newsletter) brauchen Double-Opt-In

Bestehende Templates: Quote (Kunde+Team), Contact (Kunde+Team), Fristencheck, Newsletter Confirm/Welcome.

$ARGUMENTS