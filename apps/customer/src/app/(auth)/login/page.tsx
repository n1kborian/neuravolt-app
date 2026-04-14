import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg text-foreground">NeuraVolt</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Willkommen zurück</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Melden Sie sich mit Ihrer E-Mail und Ihrem Passwort an
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8">
          <LoginForm searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
