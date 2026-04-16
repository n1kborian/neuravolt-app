Führe ein gründliches Code-Review der angegebenen Datei(en) oder des letzten Diffs durch.

Prüfe auf diese Kriterien (in dieser Reihenfolge):

**Korrektheit**
- Logik-Fehler, Edge Cases, Race Conditions
- TypeScript-Typen vollständig und korrekt
- Zod-Validierung mit allen Feldern und sinnvollen Limits

**Sicherheit**
- RLS-Policies, Auth-Checks, Input-Sanitization
- Keine Secrets im Client-Bundle
- Turnstile auf allen öffentlichen POST-Endpoints

**Performance**
- Server vs. Client Components korrekt gewählt
- Keine unnötigen Re-Renders
- Supabase-Queries parallelisiert wo möglich

**Wartbarkeit**
- Code ist selbstdokumentierend (klare Namen, keine Magic Numbers)
- Keine toten Imports, unbenutzten Variablen
- Konsistente Patterns mit dem Rest der Codebase

**UX/Accessibility**
- Fehler-States für alle fehlschlagenden Operationen
- Loading-States für async Operationen
- Semantisches HTML, aria-labels, Focus-Management

Für jedes Finding: Datei:Zeile, Schweregrad, konkreter Fix. Am Ende eine Gesamtbewertung (Ship it / Ship with fixes / Needs rework).

$ARGUMENTS