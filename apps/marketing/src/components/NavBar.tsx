"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { LoginModal } from "./LoginModal";

type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const links: NavLink[] = [
  { href: "/dguv-pruefung", label: "DGUV-Prüfung" },
  { href: "/fuer-unternehmen", label: "Für Unternehmen" },
  {
    href: "/branchen",
    label: "Branchen",
    children: [
      { href: "/branchen/buero", label: "Büro & Verwaltung" },
      { href: "/branchen/gastronomie", label: "Gastronomie" },
      { href: "/branchen/arztpraxis", label: "Arztpraxis" },
      { href: "/branchen/hotel", label: "Hotel" },
      { href: "/branchen/werkstatt", label: "Werkstatt" },
      { href: "/branchen/einzelhandel", label: "Einzelhandel" },
    ],
  },
  { href: "/angebote", label: "Preise" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/partner", label: "Partner werden" },
];

const chevron = (open: boolean) => (
  <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const branchenLink = links.find(l => l.children);

  const overlay = open ? (
    <>
      <div
        className="fixed inset-0 z-[9998] md:hidden"
        style={{ background: "rgba(0,0,0,0.12)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
      />
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 md:hidden">
        <div
          ref={panelRef}
          className="w-[88%] max-w-sm rounded-2xl p-6 flex flex-col gap-1 bg-white border border-border shadow-xl"
        >
          {links.map(l =>
            l.children ? (
              <div key={l.label} className="py-0.5">
                <button
                  onClick={() => setMobileDropdownOpen(o => !o)}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-foreground hover:bg-muted transition font-medium text-sm"
                >
                  {l.label}
                  {chevron(mobileDropdownOpen)}
                </button>
                {mobileDropdownOpen && (
                  <div className="pl-4">
                    <Link href={l.href} onClick={() => { setOpen(false); setMobileDropdownOpen(false); }}
                      className="block py-2 px-4 rounded-xl text-foreground font-semibold hover:bg-muted transition text-sm">
                      Alle Branchen →
                    </Link>
                    {l.children.map(child => (
                      <Link key={child.href} href={child.href} onClick={() => { setOpen(false); setMobileDropdownOpen(false); }}
                        className="block py-2 px-4 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition text-sm">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="py-3 px-4 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-sm transition">
                {l.label}
              </Link>
            )
          )}
          <div className="pt-3 flex flex-col gap-2 border-t border-border mt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); setLoginOpen(true); }}
              className="block w-full text-center py-3 px-4 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition text-sm"
            >
              Login
            </button>
            <Link href="/dguv-check" onClick={() => setOpen(false)}
              className="block w-full text-center py-3 px-4 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition text-sm">
              DGUV-Check starten
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}
              className="block w-full text-center py-3 px-4 rounded-full bg-foreground text-background font-bold hover:bg-foreground/90 transition shadow text-sm">
              Kostenlose Anfrage
            </Link>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 py-3 px-6 md:px-10 flex items-center justify-between transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
          borderBottom: "none",
          boxShadow: "0 1px 0 oklch(0.75 0.18 195 / 0.5), 0 4px 20px oklch(0.75 0.18 195 / 0.08), 0 1px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <motion.span
            className="tracking-widest font-bold text-xl text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            NEURA<span className="font-normal">VOLT</span>
          </motion.span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 items-center text-sm">
          {links.map(l =>
            l.children ? (
              <li key={l.label} ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  onMouseEnter={() => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); setDropdownOpen(true); }}
                  onMouseLeave={() => { dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150); }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {l.label}
                  {chevron(dropdownOpen)}
                </button>
              </li>
            ) : (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  {l.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
          >
            <LogIn className="h-4 w-4" />
            Login
          </button>
          <Link
            href="/dguv-check"
            className="px-4 py-2 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
          >
            DGUV-Check
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2 rounded-full bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors text-sm shadow-sm"
          >
            Kostenlose Anfrage
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          ref={buttonRef}
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen(o => !o)}
          className="md:hidden p-2 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          {open ? (
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </nav>

      {/* Branchen dropdown */}
      {mounted && dropdownOpen && typeof document !== "undefined" &&
        createPortal(
          (() => {
            const rect = dropdownRef.current?.getBoundingClientRect();
            if (!rect) return null;
            return (
              <div
                className="fixed min-w-[220px] rounded-2xl py-2 bg-white border border-border shadow-lg"
                style={{ top: rect.bottom + 8, left: rect.left, zIndex: 9999 }}
                onMouseEnter={() => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); }}
                onMouseLeave={() => { dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150); }}
              >
                <Link href="/branchen" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-foreground font-bold hover:bg-muted transition rounded-xl mx-1 text-sm">
                  Alle Branchen →
                </Link>
                <div className="my-1 mx-3 border-t border-border" />
                {branchenLink?.children?.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition rounded-xl mx-1 text-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            );
          })(),
          document.body
        )
      }

      {mounted && typeof document !== "undefined" && createPortal(overlay, document.body)}

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
