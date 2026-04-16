"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/essentials/Footer";
import { getSupabaseBrowserClient } from "@neuravolt/auth/client";
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Building2,
  User,
} from "lucide-react";

type AccountType = "customer" | "company";

function ErrorBanner() {
  const params = useSearchParams();
  const error = params.get("error");
  if (!error) return null;

  const messages: Record<string, string> = {
    auth_callback_failed: "Die E-Mail-Bestätigung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
  };

  return (
    <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{messages[error] ?? "Ein unerwarteter Fehler ist aufgetreten."}</span>
    </div>
  );
}

const ACCOUNT_TYPES: { type: AccountType; icon: typeof User; title: string; desc: string }[] = [
  {
    type: "customer",
    icon: User,
    title: "Als Kunde registrieren",
    desc: "Prüftermine verwalten, Protokolle einsehen, Fristen im Blick behalten.",
  },
  {
    type: "company",
    icon: Building2,
    title: "Als Unternehmen / Partner",
    desc: "Aufträge annehmen, Kunden verwalten, digitales Backoffice nutzen.",
  },
];

export default function PageClient() {
  const [accountType, setAccountType] = useState<AccountType>("customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password === passwordConfirm;
  const passwordLong = password.length >= 8;
  const canSubmit =
    firstName.length > 0 &&
    lastName.length > 0 &&
    email.length > 0 &&
    passwordLong &&
    passwordsMatch &&
    consent &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: `${firstName} ${lastName}`,
            company_name: companyName || undefined,
            role: accountType,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich stattdessen an.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user && !data.session) {
        setSuccess(true);
      } else if (data.session) {
        const role = accountType;
        const targetUrl =
          role === "company"
            ? process.env.NEXT_PUBLIC_COMPANY_URL
            : process.env.NEXT_PUBLIC_CUSTOMER_URL;

        if (targetUrl) {
          const hash = new URLSearchParams({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }).toString();
          window.location.assign(`${targetUrl}/auth/handoff#${hash}`);
        } else {
          setSuccess(true);
        }
      }
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
        <NavBar />
        <main className="pt-20 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto py-24 text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mb-4 mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-3">Bestätigungs-E-Mail versendet</h1>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Wir haben eine E-Mail an <strong>{email}</strong> gesendet. Bitte klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren. Erst danach können Sie sich anmelden.
                </p>
                <p className="text-sm text-muted-foreground">
                  Keine E-Mail erhalten? Prüfen Sie Ihren Spam-Ordner oder{" "}
                  <button type="button" onClick={() => setSuccess(false)} className="underline text-foreground">
                    versuchen Sie es erneut
                  </button>.
                </p>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/30">
      <NavBar />
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="py-12 md:py-16 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-foreground" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Konto erstellen</span>
                <div className="h-[2px] w-8 bg-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                Registrierung
              </h1>
              <p className="text-muted-foreground text-lg">
                Erstellen Sie Ihr kostenloses NeuraVolt-Konto — als Kunde oder als Unternehmen.
              </p>
            </motion.div>

            <Suspense fallback={null}><ErrorBanner /></Suspense>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Account type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Kontotyp</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ACCOUNT_TYPES.map(({ type, icon: Icon, title, desc }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAccountType(type)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          accountType === type
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground hover:border-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-bold">{title}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${accountType === type ? "text-background/70" : "text-muted-foreground"}`}>
                          {desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Vorname *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Max"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Nachname *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Mustermann"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition text-sm"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Unternehmen {accountType === "company" ? "*" : "(optional)"}
                  </label>
                  <input
                    type="text"
                    required={accountType === "company"}
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Musterfirma GmbH"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">E-Mail-Adresse *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="max@musterfirma.de"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition text-sm"
                  />
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Passwort *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition text-sm"
                    />
                    {password.length > 0 && !passwordLong && (
                      <p className="text-xs text-red-500 mt-1">Mindestens 8 Zeichen</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Passwort bestätigen *</label>
                    <input
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={e => setPasswordConfirm(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition text-sm"
                    />
                    {passwordConfirm.length > 0 && !passwordsMatch && (
                      <p className="text-xs text-red-500 mt-1">Passwörter stimmen nicht überein</p>
                    )}
                  </div>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-foreground"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                    <Link href="/#datenschutz" className="underline">Datenschutzerklärung</Link> zu
                    und akzeptiere die{" "}
                    <Link href="/#agb" className="underline">AGB</Link>.
                  </span>
                </label>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group w-full flex items-center justify-center gap-2 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Wird registriert …" : "Konto erstellen"}
                  {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Bereits registriert?{" "}
                  <Link href="/" className="underline text-foreground">
                    Zum Login
                  </Link>
                </p>
              </form>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
