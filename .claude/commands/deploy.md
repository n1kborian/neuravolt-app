Führe eine Pre-Deployment-Checkliste für die angegebene App durch.

Schritte:
1. **TypeCheck** — `pnpm --filter={app} typecheck` ausführen, Fehler beheben
2. **Lint** — `pnpm --filter={app} lint` ausführen, Warnungen prüfen
3. **Build** — `pnpm --filter={app} build` ausführen, auf Fehler und Warnungen prüfen
4. **Git Status** — Untracked Files prüfen, .env-Dateien ausschließen, Lockfile aktuell?
5. **Env-Vars** — Alle benötigten Variablen in Vercel gesetzt? turbo.json env-Array aktuell?
6. **Migrations** — Neue SQL-Migrations vorhanden? Auf Supabase angewendet?
7. **Breaking Changes** — Sind API-Schemas rückwärtskompatibel? Neue Pflichtfelder in der DB?
8. **Security** — Keine Secrets im Diff? Turnstile/RLS intakt?

Am Ende: Zusammenfassung (Ready to deploy / Blockers found) mit konkreten nächsten Schritten.

$ARGUMENTS