Baue eine React-Komponente nach den NeuraVolt-Standards. Nutze die 21st.dev Magic Component Builder MCP-Tools wenn sinnvoll (mcp__magic__21st_magic_component_builder für neue Komponenten, mcp__magic__21st_magic_component_inspiration für Designinspiration, mcp__magic__21st_magic_component_refiner zum Verfeinern).

Anforderungen an jede Komponente:
- TypeScript mit expliziten Props-Interface
- Server Component default, "use client" nur wenn State/Effects/Events nötig
- Tailwind v4 Klassen (Design Tokens: foreground, background, muted, border, brand)
- Responsive: mobile-first mit sm/md/lg Breakpoints
- Animationen via motion/react wenn sinnvoll (useInView für Scroll-Trigger)
- Icons: lucide-react
- Deutsche Texte in Höflichkeitsform, text-justify hyphens-auto für Beschreibungen
- Keine Kommentare, keine überflüssigen Abstraktionen

Dateipfad-Konventionen:
- Shared UI: packages/ui/src/components/
- Marketing-spezifisch: apps/marketing/src/components/
- Company-Dashboard: apps/company/src/components/
- Customer-Dashboard: apps/customer/src/components/
- Formulare: apps/*/src/components/forms/

$ARGUMENTS