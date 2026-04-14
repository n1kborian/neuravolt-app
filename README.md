# NeuraVolt

Turborepo-Monorepo mit drei Next.js-Apps und gemeinsamen Paketen.

## Apps

| App | URL (lokal) | Beschreibung |
| --- | ----------- | ------------ |
| `apps/marketing` | http://localhost:3000 | Öffentliche Website |
| `apps/company` | http://localhost:3001 | Unternehmens-Dashboard |
| `apps/customer` | http://localhost:3002 | Kunden-App |

## Packages

| Paket | Beschreibung |
| ----- | ------------ |
| `packages/auth` | Supabase Auth-Clients und Middleware |
| `packages/ui` | Gemeinsame UI-Komponenten |
| `packages/database` | Supabase-Typen und DB-Utilities |
| `packages/config` | Geteilte TypeScript- und ESLint-Konfiguration |

## Schnellstart

```bash
pnpm install

# .env.local für jede App anlegen (echte Keys eintragen)
cp apps/marketing/.env.example apps/marketing/.env.local
cp apps/company/.env.example   apps/company/.env.local
cp apps/customer/.env.example  apps/customer/.env.local

pnpm dev
```

## Environment Setup

Alle Details zur Umgebungskonfiguration (Dev / Preview / Production, Supabase-Projekte, Vercel-Setup, Sicherheitsregeln) befinden sich in:

**[docs/environment-setup.md](./docs/environment-setup.md)**

## Nützliche Befehle

```bash
pnpm dev              # Alle Apps parallel starten
pnpm build            # Alle Apps bauen
pnpm turbo build --filter=marketing  # Nur eine App bauen
pnpm turbo typecheck  # TypeScript-Check über alle Pakete
```
