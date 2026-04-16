<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Custom Agents & Skills

Spezialisierte Slash-Commands unter `.claude/commands/`. Aufruf: `/command-name [Kontext]`.

## Agenten (Rollen)

| Command | Rolle | Wann nutzen |
|---|---|---|
| `/seo` | SEO-Spezialist (DGUV V3, Stuttgart) | Seiten-Analyse, Keywords, Meta-Tags, Structured Data |
| `/uiux` | UI/UX-Designer | Layout-Review, Responsive, Conversion, Accessibility |
| `/strategie` | Strategieberater B2B-Plattformen | Feature-Priorisierung, Unit Economics, Markt-Fit |
| `/architekt` | Software Architect | Schema-Design, Monorepo-Struktur, Trade-offs |
| `/frontend` | Senior Frontend Engineer | React/Next.js/Tailwind Komponenten-Code |
| `/copywriter` | Deutscher B2B-Copywriter | Headlines, Card-Texte, CTAs, E-Mail-Copy |
| `/datenschutz` | DSGVO-Spezialist | Consent, Datenflüsse, Löschkonzepte, Sub-Processors |
| `/datenbank` | Supabase/Postgres-Spezialist | Schema, RLS, Migrations, Query-Optimierung |

## Skills (Aufgaben)

| Command | Aufgabe | Wann nutzen |
|---|---|---|
| `/component` | Komponente bauen (mit 21st.dev MCP) | Neue UI-Komponente erstellen |
| `/design` | Design-Inspiration (21st.dev MCP) | Inspiration suchen, Komponente verfeinern |
| `/review` | Code-Review | Vor Merge: Korrektheit, Security, Performance |
| `/deploy` | Pre-Deployment-Checkliste | Vor jedem Push auf Production |
| `/performance` | Performance-Analyse | Core Web Vitals, Bundle Size, Queries |
| `/security` | Security-Audit | OWASP Top 10, RLS, Auth, Secrets |
| `/email` | E-Mail-Template & Versand | Neue Templates, Zustellbarkeit, Resend |

## Beispiele

```
/seo apps/marketing/src/app/branchen/page.tsx
/uiux die Aufträge-Kartenansicht im Company-Dashboard
/strategie sollen wir ein Abo-Modell wieder einführen?
/architekt wie sollte die Kalender-Ansicht für Aufträge gebaut werden?
/frontend baue eine Sortier-Komponente für die Auftragsliste
/review git diff HEAD~1
/deploy marketing
/security apps/marketing/src/app/api/
```
