"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingDown } from "lucide-react";

const PINS = [
  { id: 1, price: "150 €", x: 18, y: 30 },
  { id: 2, price: "250 €", x: 70, y: 22 },
  { id: 3, price: "500 €", x: 52, y: 68 },
];
const CX = 43; // cluster center x %
const CY = 42; // cluster center y %

// Duration each phase is shown (ms)
const PHASE_MS = [900, 650, 650, 650, 1600, 3000];

const STATUS = [
  "Einzelaufträge in Stuttgart & Region",
  "Einzelaufträge in Stuttgart & Region",
  "Einzelaufträge in Stuttgart & Region",
  "Einzelaufträge in Stuttgart & Region",
  "Lokale Aufträge werden zusammengelegt …",
  "Durch Clusterung 22 % Kosten gespart",
];

export function ClusterAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setPhase(p => (p + 1) % PHASE_MS.length),
      PHASE_MS[phase]
    );
    return () => clearTimeout(t);
  }, [phase]);

  const show = [phase >= 1, phase >= 2, phase >= 3];
  const clustering = phase >= 4;
  const discounted = phase >= 5;

  return (
    <div
      className="relative w-full rounded-2xl border border-border bg-background overflow-hidden select-none"
      style={{ aspectRatio: "16/9" }}
    >
      {/* Dot-grid map background */}
      <div
        className="absolute inset-0 text-foreground/[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle city-block lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[15, 30, 50, 65, 80].map(v => (
          <g key={v}>
            <line x1={v} y1={0} x2={v} y2={100} stroke="currentColor" strokeWidth="0.3" />
            <line x1={0} y1={v} x2={100} y2={v} stroke="currentColor" strokeWidth="0.3" />
          </g>
        ))}
      </svg>

      {/* SVG connection lines — drawn when clustering */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {PINS.map(pin => (
          <motion.line
            key={pin.id}
            x1={pin.x} y1={pin.y}
            x2={CX} y2={CY}
            stroke="oklch(0.546 0.245 263)"
            strokeWidth="0.5"
            strokeDasharray="2 1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={clustering
              ? { pathLength: 1, opacity: 0.65 }
              : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* Map pins */}
      {PINS.map((pin, i) => (
        <AnimatePresence key={pin.id}>
          {show[i] && (
            <motion.div
              key={`pin-${pin.id}`}
              className="absolute pointer-events-none"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              initial={{ opacity: 0, scale: 0.3, y: -20 }}
              animate={
                clustering
                  ? { opacity: 0, scale: 0.1, y: 0 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {/* Pin label + stem + dot */}
              <div className="-translate-x-1/2 -translate-y-full flex flex-col items-center">
                <div className="bg-foreground text-background text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap leading-snug">
                  {pin.price}
                </div>
                <div className="w-px h-3 bg-foreground/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground border-2 border-background shadow-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* Cluster bubble */}
      <AnimatePresence>
        {clustering && (
          <motion.div
            className="absolute pointer-events-none"
            style={{ left: `${CX}%`, top: `${CY}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5">
              {/* Pulsing ring */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full border border-brand/50"
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-brand/30"
                  animate={{ scale: [1, 2.4], opacity: [0.3, 0] }}
                  transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
                />

                {/* Main bubble */}
                <div className="w-24 h-24 rounded-full bg-brand/10 border-2 border-brand flex flex-col items-center justify-center shadow-xl">
                  <span className="text-[9px] text-brand font-bold tracking-widest uppercase mb-0.5">
                    3 Aufträge
                  </span>

                  <AnimatePresence mode="wait">
                    {discounted ? (
                      <motion.div
                        key="discounted"
                        className="flex flex-col items-center leading-none"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-[11px] line-through text-muted-foreground">900 €</span>
                        <span className="text-xl font-bold text-brand">700 €</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="total"
                        className="text-xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        900 €
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Savings badge */}
              <AnimatePresence>
                {discounted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-1.5 bg-brand text-brand-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                  >
                    <TrendingDown className="h-3 w-3" />
                    − 200 € gespart
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-2.5 flex items-center justify-between border-t border-border bg-background/80 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.p
            key={STATUS[phase]}
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {STATUS[phase]}
          </motion.p>
        </AnimatePresence>

        {/* Phase indicator dots */}
        <div className="flex gap-1 items-center">
          {PHASE_MS.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full"
              animate={{
                width: i === phase ? 14 : 5,
                backgroundColor:
                  i === phase
                    ? "oklch(0.546 0.245 263)"
                    : "oklch(0.90 0 0)",
              }}
              transition={{ duration: 0.25 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
