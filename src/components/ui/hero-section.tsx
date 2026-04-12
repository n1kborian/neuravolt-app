"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Clock, FileCheck } from "lucide-react";

const features = [
  { icon: Shield, text: "Zertifizierte Elektrofachkräfte vor Ort" },
  { icon: FileCheck, text: "Digitales Prüfprotokoll sofort abrufbar" },
  { icon: Clock, text: "Automatisches Fristenmanagement" },
];

const stats = [
  { num: "4,90 €", label: "pro Gerät", sub: "zzgl. MwSt." },
  { num: "24h", label: "Rückmeldung", sub: "Angebot garantiert" },
  { num: "100%", label: "rechtssicher", sub: "DGUV konform" },
];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section className="relative w-full min-h-screen flex overflow-hidden bg-white">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={loaded ? { opacity: 0.35, scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,128,255,0.18) 0%, transparent 70%)" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={loaded ? { opacity: 0.25, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,63,179,0.15) 0%, transparent 70%)" }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 0.08 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,128,255,0.3) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-32 lg:py-0 gap-12 lg:gap-16 min-h-screen">

        {/* Left: Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 bg-foreground/05"
          >
            <span className="flex h-2 w-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-sm font-semibold text-foreground tracking-wide">Stuttgart &amp; Region</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1
              className="font-bold text-[#0a0a0a] leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}
            >
              DGUV-<br />Prüfung<br />
              <span className="text-foreground">digital.</span>
            </h1>
          </motion.div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-500 text-lg max-w-md leading-relaxed"
          >
            Rechtssichere Betriebsmittelprüfung — komplett digital dokumentiert,
            Fristen automatisch überwacht, Protokoll sofort abrufbar.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-foreground text-white font-semibold rounded-full hover:bg-foreground/90 active:scale-95 transition-all shadow-lg shadow-black/10 text-base"
            >
              Kostenlose Anfrage
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dguv-check"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 text-[#0a0a0a] font-medium rounded-full hover:border-foreground hover:text-foreground active:scale-95 transition-all text-base"
            >
              DGUV-Check starten
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-6 pt-2"
          >
            {stats.map(({ num, label, sub }, i) => (
              <div key={num} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-10 bg-gray-200" />}
                <div>
                  <p className="text-2xl font-bold text-[#0a0a0a] leading-none">{num}</p>
                  <p className="text-xs font-semibold text-foreground mt-1">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Feature card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={loaded ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative"
        >
          <div
            className="relative rounded-3xl p-8 border border-foreground/10"
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              boxShadow: "0 24px 80px rgba(0,128,255,0.10), 0 0 0 1px rgba(0,128,255,0.06) inset",
            }}
          >
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#0a0a0a] text-sm">DGUV V3 Service</p>
                <p className="text-xs text-gray-400">Rundum-Schutz für Ihr Unternehmen</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-green-700">Aktiv</span>
              </div>
            </div>

            {/* Progress bar mock */}
            <div className="mb-6 p-4 rounded-2xl bg-[#f8faff] border border-foreground/08">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Nächste Prüfung</span>
                <span className="text-xs font-bold text-foreground">87 Tage</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-foreground"
                  initial={{ width: "0%" }}
                  animate={loaded ? { width: "76%" } : {}}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Letzte Prüfung: 15. Jan 2026</p>
            </div>

            {/* Feature list */}
            <ul className="space-y-4">
              {features.map((f, i) => (
                <motion.li
                  key={f.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={loaded ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{f.text}</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto shrink-0" />
                </motion.li>
              ))}
            </ul>

            {/* Bottom strip */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["B", "K", "M"].map((l, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center border-2 border-white text-white text-[10px] font-bold">{l}</div>
                ))}
              </div>
              <p className="text-xs text-gray-400">+120 Unternehmen vertrauen NeuraVolt</p>
            </div>
          </div>

          {/* Decorative blobs behind card */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: "rgba(0,128,255,0.3)" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "rgba(0,63,179,0.3)" }} />
        </motion.div>
      </div>
    </section>
  );
}
