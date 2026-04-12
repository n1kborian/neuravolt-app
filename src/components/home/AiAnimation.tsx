"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Mail, Check } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Order {
  id: number;
  firma: string;
  geraete: number;
  stadt: string;
  kwStart: number;
  kwEnd: number;
  dueKw: number;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const KW_START = 14;
const KW_END   = 22;
const KW_COUNT = KW_END - KW_START + 1; // 9 columns
const KW_LABELS = Array.from({ length: KW_COUNT }, (_, i) => `KW${KW_START + i}`);

const CITY_COLORS: Record<string, string> = {
  München:   "#3b82f6",
  Stuttgart: "#10b981",
  Frankfurt: "#8b5cf6",
  Hamburg:   "#f59e0b",
  Berlin:    "#ec4899",
  Köln:      "#06b6d4",
  Dresden:   "#f97316",
};

/* ─── 50 orders ──────────────────────────────────────────────────────────── */
const ALL_ORDERS: Order[] = [
  // München — 5 with specific overlap scenario
  { id:  1, firma: "Bauer GmbH",         geraete: 12, stadt: "München",   kwStart: 14, kwEnd: 15, dueKw: 15 },
  { id:  2, firma: "Müller & Co.",        geraete: 28, stadt: "München",   kwStart: 14, kwEnd: 18, dueKw: 18 },
  { id:  3, firma: "Tech Solutions AG",   geraete: 45, stadt: "München",   kwStart: 16, kwEnd: 17, dueKw: 17 },
  { id:  4, firma: "Gastro Zentrum",      geraete:  8, stadt: "München",   kwStart: 15, kwEnd: 20, dueKw: 20 },
  { id:  5, firma: "Werkzeug Profi",      geraete: 33, stadt: "München",   kwStart: 17, kwEnd: 20, dueKw: 20 },
  // Stuttgart
  { id:  6, firma: "Auto Huber",          geraete: 22, stadt: "Stuttgart", kwStart: 15, kwEnd: 17, dueKw: 17 },
  { id:  7, firma: "Büro Zentrum",        geraete: 41, stadt: "Stuttgart", kwStart: 15, kwEnd: 18, dueKw: 18 },
  { id:  8, firma: "Druck & Co.",         geraete: 19, stadt: "Stuttgart", kwStart: 16, kwEnd: 18, dueKw: 18 },
  { id:  9, firma: "Elektro Schwarz",     geraete:  7, stadt: "Stuttgart", kwStart: 16, kwEnd: 19, dueKw: 19 },
  { id: 10, firma: "Flex GmbH",           geraete: 55, stadt: "Stuttgart", kwStart: 17, kwEnd: 20, dueKw: 20 },
  // Frankfurt
  { id: 11, firma: "Finance Hub AG",      geraete: 62, stadt: "Frankfurt", kwStart: 14, kwEnd: 16, dueKw: 16 },
  { id: 12, firma: "Bank Tower GmbH",     geraete: 38, stadt: "Frankfurt", kwStart: 14, kwEnd: 17, dueKw: 17 },
  { id: 13, firma: "Messe Service",       geraete: 27, stadt: "Frankfurt", kwStart: 15, kwEnd: 17, dueKw: 17 },
  { id: 14, firma: "Airport Logistics",   geraete: 44, stadt: "Frankfurt", kwStart: 16, kwEnd: 18, dueKw: 18 },
  { id: 15, firma: "Römer Catering",      geraete: 15, stadt: "Frankfurt", kwStart: 17, kwEnd: 19, dueKw: 19 },
  // Hamburg
  { id: 16, firma: "Hafen GmbH",          geraete: 71, stadt: "Hamburg",   kwStart: 14, kwEnd: 16, dueKw: 16 },
  { id: 17, firma: "Nord Elektro",        geraete: 23, stadt: "Hamburg",   kwStart: 15, kwEnd: 17, dueKw: 17 },
  { id: 18, firma: "Speicher AG",         geraete: 36, stadt: "Hamburg",   kwStart: 15, kwEnd: 18, dueKw: 18 },
  { id: 19, firma: "Alster Büro",         geraete: 14, stadt: "Hamburg",   kwStart: 16, kwEnd: 18, dueKw: 18 },
  { id: 20, firma: "Elbmarkt GmbH",       geraete: 29, stadt: "Hamburg",   kwStart: 17, kwEnd: 20, dueKw: 20 },
  // Berlin
  { id: 21, firma: "Startup Hub",         geraete: 58, stadt: "Berlin",    kwStart: 14, kwEnd: 17, dueKw: 17 },
  { id: 22, firma: "Mitte GmbH",          geraete: 32, stadt: "Berlin",    kwStart: 15, kwEnd: 17, dueKw: 17 },
  { id: 23, firma: "Prenzl Tech",         geraete: 11, stadt: "Berlin",    kwStart: 16, kwEnd: 19, dueKw: 19 },
  { id: 24, firma: "Kreuzberg Labs",      geraete: 47, stadt: "Berlin",    kwStart: 16, kwEnd: 20, dueKw: 20 },
  { id: 25, firma: "Brandenburger AG",    geraete: 25, stadt: "Berlin",    kwStart: 17, kwEnd: 21, dueKw: 21 },
  // Köln
  { id: 26, firma: "Dom Service GmbH",    geraete: 39, stadt: "Köln",      kwStart: 14, kwEnd: 16, dueKw: 16 },
  { id: 27, firma: "Rhein Elektro",       geraete: 18, stadt: "Köln",      kwStart: 15, kwEnd: 17, dueKw: 17 },
  { id: 28, firma: "Kölner Bürohaus",     geraete: 52, stadt: "Köln",      kwStart: 15, kwEnd: 18, dueKw: 18 },
  { id: 29, firma: "Deutz AG",            geraete: 21, stadt: "Köln",      kwStart: 16, kwEnd: 18, dueKw: 18 },
  { id: 30, firma: "Ehrenfeld Studio",    geraete:  9, stadt: "Köln",      kwStart: 17, kwEnd: 19, dueKw: 19 },
  // Dresden
  { id: 31, firma: "Semper GmbH",         geraete: 16, stadt: "Dresden",   kwStart: 15, kwEnd: 17, dueKw: 17 },
  { id: 32, firma: "Zwinger Tech",        geraete: 43, stadt: "Dresden",   kwStart: 16, kwEnd: 18, dueKw: 18 },
  { id: 33, firma: "Elbe Service",        geraete: 27, stadt: "Dresden",   kwStart: 16, kwEnd: 19, dueKw: 19 },
  { id: 34, firma: "Neustadt Büro",       geraete: 34, stadt: "Dresden",   kwStart: 17, kwEnd: 20, dueKw: 20 },
  // Mixed filler orders
  { id: 35, firma: "Alpha Logistics",     geraete: 61, stadt: "München",   kwStart: 18, kwEnd: 20, dueKw: 20 },
  { id: 36, firma: "Beta Systems",        geraete: 14, stadt: "Stuttgart", kwStart: 14, kwEnd: 16, dueKw: 16 },
  { id: 37, firma: "Gamma IT",            geraete: 38, stadt: "Frankfurt", kwStart: 18, kwEnd: 20, dueKw: 20 },
  { id: 38, firma: "Delta GmbH",          geraete: 22, stadt: "Hamburg",   kwStart: 14, kwEnd: 15, dueKw: 15 },
  { id: 39, firma: "Epsilon AG",          geraete: 47, stadt: "Berlin",    kwStart: 18, kwEnd: 21, dueKw: 21 },
  { id: 40, firma: "Zeta Solutions",      geraete: 31, stadt: "Köln",      kwStart: 14, kwEnd: 16, dueKw: 16 },
  { id: 41, firma: "Eta Consulting",      geraete: 19, stadt: "München",   kwStart: 19, kwEnd: 21, dueKw: 21 },
  { id: 42, firma: "Theta Services",      geraete: 55, stadt: "Stuttgart", kwStart: 19, kwEnd: 21, dueKw: 21 },
  { id: 43, firma: "Iota GmbH",           geraete: 12, stadt: "Frankfurt", kwStart: 19, kwEnd: 21, dueKw: 21 },
  { id: 44, firma: "Kappa Technik",       geraete: 41, stadt: "Hamburg",   kwStart: 18, kwEnd: 20, dueKw: 20 },
  { id: 45, firma: "Lambda Büro",         geraete: 26, stadt: "Berlin",    kwStart: 14, kwEnd: 16, dueKw: 16 },
  { id: 46, firma: "Mu Werkstatt",        geraete: 67, stadt: "Köln",      kwStart: 18, kwEnd: 21, dueKw: 21 },
  { id: 47, firma: "Nu Gastro",           geraete:  8, stadt: "Dresden",   kwStart: 14, kwEnd: 15, dueKw: 15 },
  { id: 48, firma: "Xi Elektro",          geraete: 34, stadt: "München",   kwStart: 20, kwEnd: 21, dueKw: 21 },
  { id: 49, firma: "Omikron AG",          geraete: 23, stadt: "Stuttgart", kwStart: 20, kwEnd: 22, dueKw: 22 },
  { id: 50, firma: "Pi Systeme GmbH",     geraete: 49, stadt: "Frankfurt", kwStart: 20, kwEnd: 22, dueKw: 22 },
];

/* ─── Phase durations (ms) ───────────────────────────────────────────────── */
//  0: scroll overview   1: pause   2: color cities   3: sort   4: zoom München
//  5: highlight overlap  6: select Firma1  7: email out  8: reply  9: update bar  10: success
const PHASE_MS = [4000, 800, 1200, 1400, 900, 1600, 900, 2200, 1800, 2400, 3200];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function kwPct(kw: number) {
  return ((kw - KW_START) / KW_COUNT) * 100;
}
function kwWidth(start: number, end: number) {
  return ((end - start + 1) / KW_COUNT) * 100;
}

/* ─── GanttBar ───────────────────────────────────────────────────────────── */
function GanttBar({ order, colored, overlapKw, isOutlier, optimized }: {
  order: Order;
  colored: boolean;
  overlapKw: number | null;
  isOutlier: boolean;
  optimized: boolean;
}) {
  const color   = colored ? CITY_COLORS[order.stadt] ?? "#64748b" : "#64748b";
  const barStart = optimized && isOutlier ? overlapKw ?? order.kwStart : order.kwStart;
  const barEnd   = optimized && isOutlier ? overlapKw ?? order.kwEnd   : order.kwEnd;
  const dueKw    = optimized && isOutlier && overlapKw ? overlapKw : order.dueKw;

  return (
    <div className="relative w-full h-5">
      {/* Track */}
      <div className="absolute inset-y-[6px] inset-x-0 rounded-full bg-border/40" />

      {/* Bar */}
      <motion.div
        className="absolute inset-y-[4px] rounded-full"
        style={{ background: color, opacity: 0.75 }}
        animate={{
          left:  `${kwPct(barStart)}%`,
          width: `${kwWidth(barStart, barEnd)}%`,
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {/* Due-date diamond ♦ */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[8px] font-bold leading-none"
        style={{ color: isOutlier && !optimized ? "#ef4444" : color }}
        animate={{ left: `${kwPct(dueKw) + 100 / KW_COUNT / 2}%` }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        ◆
      </motion.div>

      {/* Overlap column highlight */}
      {overlapKw !== null && (
        <div
          className="absolute inset-y-[-2px] rounded-sm pointer-events-none"
          style={{
            left:  `${kwPct(overlapKw)}%`,
            width: `${100 / KW_COUNT}%`,
            background: optimized ? "#10b981" : "#3b82f6",
            opacity: 0.12,
          }}
        />
      )}
    </div>
  );
}

/* ─── OrderRow ───────────────────────────────────────────────────────────── */
function OrderRow({ order, colored, showOverlap, overlapKw, isOutlier, replyReceived, optimized, dimmed }: {
  order: Order;
  colored: boolean;
  showOverlap: boolean;
  overlapKw: number | null;
  isOutlier: boolean;
  replyReceived: boolean;
  optimized: boolean;
  dimmed: boolean;
}) {
  const cityColor = CITY_COLORS[order.stadt] ?? "#64748b";

  const showRedTrail   = isOutlier && showOverlap && !replyReceived;
  const showGreenTrail = isOutlier && showOverlap && replyReceived;

  return (
    <motion.div
      layout
      className="relative flex items-center gap-0 border-b border-border/30 last:border-0 overflow-hidden"
      style={{
        background: showRedTrail
          ? "rgba(239,68,68,0.06)"
          : showGreenTrail
          ? "rgba(16,185,129,0.06)"
          : "transparent",
        opacity: dimmed ? 0.35 : 1,
      }}
      transition={{ layout: { duration: 0.55, ease: "easeInOut" } }}
    >
      {/* Border trail — top edge left→right (red) */}
      {showRedTrail && (
        <motion.div
          className="absolute top-0 left-0 h-[1.5px] pointer-events-none"
          style={{
            width: "35%",
            background: "linear-gradient(90deg, transparent, #ef4444 40%, #fca5a5 60%, transparent)",
            zIndex: 10,
          }}
          animate={{ left: ["-35%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Border trail — bottom edge right→left (red) */}
      {showRedTrail && (
        <motion.div
          className="absolute bottom-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            width: "35%",
            background: "linear-gradient(90deg, transparent, #fca5a5 40%, #ef4444 60%, transparent)",
            zIndex: 10,
          }}
          animate={{ right: ["-35%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 0.8 }}
        />
      )}
      {/* Border trail — top edge left→right (green) */}
      {showGreenTrail && (
        <motion.div
          className="absolute top-0 left-0 h-[1.5px] pointer-events-none"
          style={{
            width: "35%",
            background: "linear-gradient(90deg, transparent, #10b981 40%, #6ee7b7 60%, transparent)",
            zIndex: 10,
          }}
          animate={{ left: ["-35%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Border trail — bottom edge right→left (green) */}
      {showGreenTrail && (
        <motion.div
          className="absolute bottom-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            width: "35%",
            background: "linear-gradient(90deg, transparent, #6ee7b7 40%, #10b981 60%, transparent)",
            zIndex: 10,
          }}
          animate={{ right: ["-35%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 0.8 }}
        />
      )}

      {/* Firma */}
      <div className="w-[22%] shrink-0 px-2 py-1.5 flex items-center gap-1.5">
        {showRedTrail && (
          <AlertTriangle className="h-2.5 w-2.5 text-red-500 shrink-0" />
        )}
        {showGreenTrail && (
          <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
        )}
        <span className="text-[10px] font-medium text-foreground truncate leading-none">{order.firma}</span>
      </div>

      {/* Geräte */}
      <div className="w-[10%] shrink-0 px-1 py-1.5 text-[9px] text-muted-foreground text-center">{order.geraete}</div>

      {/* Stadt */}
      <div className="w-[14%] shrink-0 px-1 py-1.5 flex items-center gap-1">
        <motion.div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          animate={{ background: colored ? cityColor : "#94a3b8" }}
          transition={{ duration: 0.4 }}
        />
        <span className="text-[9px] text-muted-foreground truncate">{order.stadt}</span>
      </div>

      {/* Gantt swimlane */}
      <div className="flex-1 px-1 py-1.5">
        <GanttBar
          order={order}
          colored={colored}
          overlapKw={showOverlap ? overlapKw : null}
          isOutlier={isOutlier}
          optimized={optimized}
        />
      </div>
    </motion.div>
  );
}

/* ─── EmailOverlay ───────────────────────────────────────────────────────── */
function EmailOverlay({ phase }: { phase: number }) {
  const showEmail = phase >= 7;
  const showReply = phase >= 8;

  return (
    <AnimatePresence>
      {showEmail && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(0.5px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="w-[88%] max-w-sm space-y-3">
            {/* Outgoing email */}
            <motion.div
              className="rounded-2xl border border-border bg-white shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-bold text-foreground tracking-wide">KI-Optimierung · Neue Nachricht</span>
                <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                  <span className="text-[8px] text-white font-bold">KI</span>
                </div>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                <div className="flex gap-2 text-[9px]">
                  <span className="text-muted-foreground w-8 shrink-0">An</span>
                  <span className="text-foreground font-medium">kontakt@bauer-gmbh.de</span>
                </div>
                <div className="flex gap-2 text-[9px]">
                  <span className="text-muted-foreground w-8 shrink-0">Betr.</span>
                  <span className="text-foreground font-medium">Optimierungsvorschlag: Prüftermin KW17</span>
                </div>
                <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground leading-relaxed space-y-1">
                  <p>Guten Tag,</p>
                  <p>
                    Ihr aktuelles Due Date liegt in <strong className="text-foreground">KW20</strong>.
                    Wir können Ihren Prüftermin auf <strong className="text-foreground">KW17</strong> vorziehen —
                    gemeinsam mit 4 weiteren Betrieben in München.
                  </p>
                  <p>Das spart Ihnen <strong className="text-brand">15 % der Prüfkosten</strong>.</p>
                  <p className="text-muted-foreground/60 text-[9px]">Mit freundlichen Grüßen · NeuraVolt KI</p>
                </div>
              </div>
            </motion.div>

            {/* Reply bubble */}
            <AnimatePresence>
              {showReply && (
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 shadow-lg">
                    <p className="text-[10px] text-white font-medium leading-snug">
                      Super, ja sehr gerne! 👍
                    </p>
                    <p className="text-[8px] text-white/60 mt-0.5">Bauer GmbH · gerade eben</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── KW header ──────────────────────────────────────────────────────────── */
function KwHeader({ overlapKw, optimized }: { overlapKw: number | null; optimized: boolean }) {
  return (
    <div className="flex items-center gap-0 border-b border-border bg-muted/40 sticky top-0 z-10">
      <div className="w-[22%] shrink-0 px-2 py-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Firma</div>
      <div className="w-[10%] shrink-0 px-1 py-1.5 text-[9px] font-bold text-muted-foreground uppercase text-center">Geräte</div>
      <div className="w-[14%] shrink-0 px-1 py-1.5 text-[9px] font-bold text-muted-foreground uppercase">Stadt</div>
      <div className="flex-1 px-1 py-1.5">
        <div className="relative flex">
          {KW_LABELS.map((label, i) => {
            const kw = KW_START + i;
            const isOverlap = overlapKw === kw;
            return (
              <div key={label} className="flex-1 text-center relative">
                <span
                  className="text-[8px] font-mono font-bold"
                  style={{
                    color: isOverlap ? (optimized ? "#10b981" : "#3b82f6") : undefined,
                  }}
                >
                  {label}
                </span>
                {isOverlap && (
                  <motion.div
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                    style={{ background: optimized ? "#10b981" : "#3b82f6" }}
                    layoutId="overlap-indicator"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main animation component ───────────────────────────────────────────── */
export function AiAnimation() {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Phase timer
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase(p => (p + 1) % PHASE_MS.length);
    }, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  // Auto-scroll in phase 0
  useEffect(() => {
    if (phase !== 0 || !scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollTop = 0;
    const duration = PHASE_MS[0] - 200;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const start = performance.now();
    let raf: number;
    function step(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      el.scrollTop = pct * maxScroll;
      if (pct < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Derived state
  const colored       = phase >= 2;
  const sorted        = phase >= 3;
  const münchen       = phase >= 4;
  const showOverlap   = phase >= 5;
  const emailOpen     = phase >= 6 && phase < 9;
  const replyReceived = phase >= 8;
  const optimized     = phase >= 9;
  const done          = phase >= 10;

  const OVERLAP_KW   = 17;
  const MÜNCHEN_IDS  = new Set([1, 2, 3, 4, 5]);
  const OUTLIER_ID   = 1; // Bauer GmbH — doesn't reach KW17

  const displayOrders = sorted
    ? [...ALL_ORDERS].sort((a, b) => a.stadt.localeCompare(b.stadt))
    : ALL_ORDERS;

  const visibleOrders = münchen
    ? displayOrders.filter(o => o.stadt === "München")
    : displayOrders;

  return (
    <div className="relative w-full h-full rounded-2xl border border-border bg-background overflow-hidden flex flex-col">

      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/30 shrink-0">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
          <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px] font-bold text-foreground font-mono">NEURA<span className="font-normal">VOLT</span> · Auftragsplanung</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-muted-foreground font-medium">Live</span>
        </div>
      </div>

      {/* Status strip — prominent step indicator, above email overlay */}
      <div className="shrink-0 border-b border-border overflow-hidden relative" style={{ background: "oklch(0.546 0.245 263)", zIndex: 30 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            className="flex items-center gap-3 px-3 py-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {/* Step badge */}
            <div className="shrink-0 flex items-center justify-center rounded-md px-1.5 py-0.5 text-[9px] font-bold font-mono tabular-nums"
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff", minWidth: 36 }}>
              {phase + 1}&thinsp;/&thinsp;{PHASE_MS.length}
            </div>

            {/* Status text */}
            <span className="text-[11px] font-semibold text-white leading-none">
              {phase === 0 && "Auftragsübersicht"}
              {phase === 1 && "Analyse gestartet …"}
              {phase === 2 && "Standorte werden markiert …"}
              {phase === 3 && "Sortierung nach Standort …"}
              {phase === 4 && "Zoom: München"}
              {phase === 5 && "Overlap erkannt · KW 17"}
              {phase === 6 && "Kritischen Auftrag auswählen …"}
              {phase === 7 && "KI-Optimierungsvorschlag wird gesendet …"}
              {phase === 8 && "Antwort erhalten ✓"}
              {phase === 9 && "Termin aktualisiert · Cluster komplett ✓"}
              {phase === 10 && "Optimierung abgeschlossen ✓"}
            </span>

            {/* Pulse dot for active phases */}
            <motion.div
              className="ml-auto shrink-0 h-1.5 w-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.7)" }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* KW header */}
      <KwHeader
        overlapKw={showOverlap ? OVERLAP_KW : null}
        optimized={optimized}
      />

      {/* Scrollable table */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence>
          {visibleOrders.map(order => {
            const isMuenchen  = MÜNCHEN_IDS.has(order.id);
            const isOutlier   = order.id === OUTLIER_ID;
            const dimmed      = münchen && !isMuenchen;
            return (
              <OrderRow
                key={order.id}
                order={order}
                colored={colored}
                showOverlap={showOverlap && isMuenchen}
                overlapKw={OVERLAP_KW}
                isOutlier={isOutlier}
                replyReceived={replyReceived}
                optimized={optimized}
                dimmed={dimmed}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Email overlay */}
      {emailOpen && <EmailOverlay phase={phase} />}

      {/* Success overlay — phase 10 */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pulsing ring */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute rounded-full border-2 border-emerald-400"
                initial={{ width: 56, height: 56, opacity: 0.8 }}
                animate={{ width: 110, height: 110, opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute rounded-full border-2 border-emerald-300"
                initial={{ width: 56, height: 56, opacity: 0.5 }}
                animate={{ width: 140, height: 140, opacity: 0 }}
                transition={{ duration: 1.4, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
              />

              {/* Checkmark circle */}
              <motion.div
                className="relative flex items-center justify-center rounded-full bg-emerald-500 shadow-2xl"
                style={{ width: 56, height: 56 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              >
                <motion.svg
                  viewBox="0 0 24 24" fill="none" stroke="white"
                  strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                  className="w-7 h-7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
                >
                  <motion.path d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
            </div>

            <motion.p
              className="mt-5 text-sm font-bold text-emerald-700"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              Cluster optimiert · 15 % gespart
            </motion.p>
            <motion.p
              className="text-[11px] text-emerald-600/80 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              5 Aufträge · München · KW 17
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
