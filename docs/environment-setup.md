# Environment Setup

## Architektur-Prinzip

Alle drei Apps (`marketing`, `company`, `customer`) greifen innerhalb derselben Umgebung auf **dieselbe Supabase-Instanz** zu. Es gibt genau ein Supabase-Projekt pro Umgebung:

| Umgebung    | Marketing              | Company                      | Customer                  | Supabase          |
| ----------- | ---------------------- | ---------------------------- | ------------------------- | ----------------- |
| Development | localhost:3000         | localhost:3001               | localhost:3002            | neuravolt-dev     |
| Staging     | staging.neuravolt.de   | staging-company.neuravolt.de | staging-app.neuravolt.de  | neuravolt-staging |
| Production  | neuravolt.de           | company.neuravolt.de         | app.neuravolt.de          | neuravolt-prod    |

Die Datentrennung zwischen den Apps erfolgt **innerhalb** der Datenbank über:
- **Row Level Security (RLS)** — ein Kunde sieht nur seine eigenen Datensätze
- **Rollen** — `customer`, `company`, `admin`
- **Tabellenstruktur** — `users`, `companies`, `inspections`, `reports`, `leads`, ...

Beispiel RLS-Policy:
```sql
CREATE POLICY "customer_sees_own_reports"
ON reports FOR SELECT
USING (customer_id = auth.uid());
```

---

## Warum eine gemeinsame Datenbank?

Leads, Kunden, Prüfungen, Dokumente und Berichte sind in allen drei Apps dieselben fachlichen Objekte. Separate Supabase-Projekte pro App würden Datensynchronisation erfordern und die Komplexität massiv erhöhen. Eine Trennung pro App wäre nur sinnvoll, wenn die Apps eigenständige Produkte verschiedener Unternehmen wären.

---

## Dateistruktur

```
.env.local              ← eine einzige Datei für Development (gitignored)
.env.example            ← Vorlage, committed, keine echten Keys

apps/
  marketing/
    .env.local          → ../../.env.local  (Symlink)
    .env.example        → Verweis auf Root-Vorlage
  company/
    .env.local          → ../../.env.local  (Symlink)
    .env.example
  customer/
    .env.local          → ../../.env.local  (Symlink)
    .env.example
```

Alle drei App-Symlinks zeigen auf dieselbe Root-`.env.local`. Es gibt keine doppelten Dateien.

Für Staging und Production werden die Variablen direkt in Vercel konfiguriert — keine `.env.preview` oder `.env.production` Dateien im Repo.

---

## Variablen-Struktur

```env
# ── Supabase (alle Apps, gleiche Instanz pro Umgebung) ────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://neuravolt-dev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # NUR serverseitig!

# ── App-URLs ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_MARKETING_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_URL=http://localhost:3001
NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3002

NEXT_PUBLIC_ENV=development
```

---

## Sicherheitsregel: Service Role Key

Der `SUPABASE_SERVICE_ROLE_KEY` umgeht alle RLS-Regeln. Er darf **niemals** mit `NEXT_PUBLIC_` versehen werden.

```env
# Falsch — gibt jedem Browser vollen DB-Zugriff:
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Richtig — nur serverseitig verfügbar:
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Der Anon Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) ist durch RLS geschützt und sicher im Frontend.

---

## Supabase-Clients

Dieses Monorepo verwendet `packages/auth` für alle Supabase-Clients.

### Browser / Client Components
```ts
import { getSupabaseBrowserClient } from "@neuravolt/auth";
const supabase = getSupabaseBrowserClient();
```

### Server Components, Route Handlers, Server Actions
```ts
import { getSupabaseServerClient } from "@neuravolt/auth";
const supabase = await getSupabaseServerClient();
```

### Admin (Service Role) — nur in Server Actions / API Routes
```ts
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // niemals im Frontend!
);
```

---

## Lokale Einrichtung (neue Entwickler)

```bash
# 1. Repository klonen
git clone https://github.com/n1kborian/neuravolt.git && cd neuravolt

# 2. Dependencies installieren
pnpm install

# 3. Root-.env.local anlegen
cp .env.example .env.local
# Dann echte Dev-Keys aus dem Supabase Dashboard eintragen:
# Project Settings → API

# 4. Alle Apps starten (Symlinks sind bereits im Repo)
pnpm dev
```

- Marketing: http://localhost:3000
- Company:   http://localhost:3001
- Customer:  http://localhost:3002

---

## Vercel-Konfiguration

Für jedes Vercel-Projekt (**marketing**, **company**, **customer**) separat unter **Settings → Environment Variables**:

| Variable                        | Preview (Staging)              | Production                  |
| ------------------------------- | ------------------------------ | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | neuravolt-staging.supabase.co  | neuravolt-prod.supabase.co  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Staging Anon Key               | Prod Anon Key               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Staging Service Key            | Prod Service Key            |
| `NEXT_PUBLIC_MARKETING_URL`     | https://staging.neuravolt.de   | https://neuravolt.de        |
| `NEXT_PUBLIC_COMPANY_URL`       | https://staging-company...     | https://company.neuravolt.de|
| `NEXT_PUBLIC_CUSTOMER_URL`      | https://staging-app...         | https://app.neuravolt.de    |
| `NEXT_PUBLIC_ENV`               | `preview`                      | `production`                |

> Die Supabase-URLs sind für alle drei Vercel-Projekte pro Umgebung identisch — nur die App-URLs unterscheiden sich.

---

## Empfohlene Supabase-Projekte

Aktuell reichen zwei Projekte:

| Projekt           | Verwendet für                              |
| ----------------- | ------------------------------------------ |
| `neuravolt-dev`   | Lokale Entwicklung aller Entwickler        |
| `neuravolt-prod`  | Live-Betrieb                               |

Staging ergänzen sobald:
- mehrere Entwickler parallel auf Preview-Deployments testen
- Datenbankmigrationen vor Prod verifiziert werden müssen
- echte Kundendaten in Prod vorhanden sind
