"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "motion/react";
import { TrendingDown } from "lucide-react";

/* ─── Map constants ──────────────────────────────────────────────────────── */
const GERMANY_CENTER: [number, number] = [51.2, 10.4];
const GERMANY_ZOOM   = 6;
const CLUSTER_LAT    = 48.7759;
const CLUSTER_LNG    = 9.1850;
const STUTTGART_ZOOM = 13;

// Stuttgart orders — used for PositionTracker + overlay; lx/ly offset labels on Germany view
const ORDERS = [
  { id: 1, lat: 48.7758, lng: 9.1829, price: "150 €", lx: -68, ly: -28 },
  { id: 2, lat: 48.7900, lng: 9.2080, price: "250 €", lx:   4, ly: -58 },
  { id: 3, lat: 48.7620, lng: 9.1640, price: "500 €", lx:  68, ly: -28 },
];

// Frankfurt orders — shown on Germany map only, never used in overlay
const FRA_MAP_ORDERS = [
  { id: 4, lat: 50.1109, lng: 8.6821, price: "200 €", lx: -68, ly: -28 },
  { id: 5, lat: 50.1300, lng: 8.7050, price: "350 €", lx:   4, ly: -58 },
  { id: 6, lat: 50.0960, lng: 8.6520, price: "450 €", lx:  68, ly: -28 },
];

//                  0     1    2    3    4    5    6    7     8     9    10    11    12    13    14
// ×1.2 slower pacing; phase 7 = "Zwei Cluster erkannt" (new), rest shifted +1
const PHASE_MS = [1800, 720, 720, 720, 600, 600, 600, 1800, 3000, 720, 1140, 2880, 1800, 1320, 5040];
const STATUS   = [
  "Deutschland — Aufträge werden koordiniert",      // 0
  "Neuer Auftrag in Stuttgart · 150 €",             // 1
  "Weiterer Auftrag in Stuttgart · 250 €",          // 2
  "Dritter Auftrag in Stuttgart · 500 €",           // 3
  "Neuer Auftrag in Frankfurt · 200 €",             // 4
  "Weiterer Auftrag in Frankfurt · 350 €",          // 5
  "Dritter Auftrag in Frankfurt · 450 €",           // 6
  "Zwei Cluster erkannt · Stuttgart · Frankfurt",   // 7  ← NEW
  "Zoom auf Auftragsgebiet Stuttgart …",            // 8
  "Auftragsgebiet Stuttgart erkannt",               // 9
  "Aufträge werden verbunden …",                    // 10
  "Aufträge werden zum Cluster gezogen …",          // 11
  "Cluster gebildet · 3 Aufträge · 900 €",         // 12
  "Preis wird optimiert …",                         // 13
  "Durch lokale Auftrags-Bündelung 22 % günstiger",         // 14
];

/* ─── Dashboard constants ────────────────────────────────────────────────── */
const STR_COLOR  = "oklch(0.546 0.245 263)";
const FRA_COLOR  = "#7c3aed";
// 5 week columns: KW14=0, KW15=1, KW16=2, KW17=3, KW18=4
const WEEK_LABELS = ["KW 14", "KW 15", "KW 16", "KW 17", "KW 18"];
const COL_PCT     = 100 / WEEK_LABELS.length;  // 20 per column

const STR_CARDS = [
  { price: "150 €", kw: "KW 15" },
  { price: "250 €", kw: "KW 15–17" },
  { price: "500 €", kw: "KW 14–18" },
];
const FRA_CARDS = [
  { price: "200 €", kw: "KW 14–17" },
  { price: "350 €", kw: "KW 15–16" },
  { price: "450 €", kw: "KW 15–18" },
];

// kwStart / kwEnd are column indices (0=KW14, 1=KW15, …, 4=KW18)
const STR_KANBAN = [
  { price: "150 €", kwStart: 1, kwEnd: 1 },   // KW15
  { price: "250 €", kwStart: 1, kwEnd: 3 },   // KW15–17
  { price: "500 €", kwStart: 0, kwEnd: 4 },   // KW14–18
];
const FRA_KANBAN = [
  { price: "200 €", kwStart: 0, kwEnd: 3 },   // KW14–17
  { price: "350 €", kwStart: 1, kwEnd: 2 },   // KW15–16
  { price: "450 €", kwStart: 1, kwEnd: 4 },   // KW15–18
];

//                      0    1    2    3    4    5    6     7     8     9    10
const DASH_PHASE_MS = [650, 420, 390, 390, 420, 390, 390, 1200, 1700, 2600, 700];

/* ─── Panel width (longest STATUS entry at font-mono ~8.5 px/ch) ─────────── */
const PANEL_WIDTH = Math.ceil(
  Math.max(...STATUS.map(s => s.length)) * 8.5 + 76,
);

/* ─── DivIcon — labels fan around their cluster via lx/ly offset ─────────── */
function makePinIcon(price: string, lx = 0, ly = -42) {
  return L.divIcon({
    html: `
      <div style="position:relative;width:0;height:0">
        <div style="
          position:absolute;
          left:${lx}px; top:${ly}px;
          transform:translate(-50%,-100%);
          background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;
          font-size:11px;font-weight:700;padding:5px 10px;border-radius:8px;
          white-space:nowrap;box-shadow:0 3px 14px rgba(0,0,0,0.22);
        ">${price}</div>
        <div style="
          position:absolute;width:9px;height:9px;
          background:#0a0a0a;border:2px solid #fff;border-radius:50%;
          transform:translate(-50%,-50%);
          box-shadow:0 1px 5px rgba(0,0,0,.3);
        "></div>
      </div>`,
    iconSize:   [0, 0],
    iconAnchor: [0, 0],
    className:  "nv-pin",
  });
}

/* ─── MapController ───────────────────────────────────────────────────────── */
function MapController({ phase }: { phase: number }) {
  const map  = useMap();
  const prev = useRef(-1);
  useEffect(() => {
    if (phase === 0 && prev.current !== 0)
      map.setView(GERMANY_CENTER, GERMANY_ZOOM, { animate: false });
    if (phase === 8)   // phase 8 = zoom (shifted from 7 due to new "Zwei Cluster" phase)
      map.flyTo([CLUSTER_LAT, CLUSTER_LNG], STUTTGART_ZOOM, { duration: 2.3, easeLinearity: 0.4 });
    prev.current = phase;
  }, [phase, map]);
  return null;
}

/* ─── PositionTracker ─────────────────────────────────────────────────────── */
type Px = { x: number; y: number };
function PositionTracker({ onUpdate }: { onUpdate: (pins: Px[], cluster: Px) => void }) {
  const map = useMap();
  const cb  = useCallback(() => {
    const pins = ORDERS.map(o => {
      const p = map.latLngToContainerPoint([o.lat, o.lng]);
      return { x: p.x, y: p.y };
    });
    const cp = map.latLngToContainerPoint([CLUSTER_LAT, CLUSTER_LNG]);
    onUpdate(pins, { x: cp.x, y: cp.y });
  }, [map, onUpdate]);
  useEffect(() => {
    map.on("move", cb); map.on("moveend", cb); cb();
    return () => { map.off("move", cb); map.off("moveend", cb); };
  }, [map, cb]);
  return null;
}

/* ─── OverlayPin ──────────────────────────────────────────────────────────── */
function OverlayPin({ from, price, merging, delay }: {
  from: Px; price: string; merging: boolean; delay: number;
}) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ left: from.x, top: from.y }}
      initial={{ opacity: 0, scale: 0.4, y: -10 }}
      animate={merging
        ? { opacity: 0.22, scale: 0.85, y: 0, x: 0 }
        : { opacity: 1,    scale: 1,    y: 0, x: 0 }}
      transition={merging
        ? { duration: 0.4, delay }
        : { duration: 0.35, delay, type: "spring", stiffness: 220, damping: 18 }}>
      <div className="-translate-x-1/2 -translate-y-full flex flex-col items-center">
        <div className="bg-foreground text-background text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">{price}</div>
        <div className="w-px h-2.5 bg-foreground/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-foreground border-2 border-white shadow" />
      </div>
    </motion.div>
  );
}

/* ─── ArrowFlow ───────────────────────────────────────────────────────────── */
function ArrowFlow({ from, to, active, lineDelay, idx }: {
  from: Px; to: Px; active: boolean; lineDelay: number; idx: number;
}) {
  const dx  = to.x - from.x;
  const dy  = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx  = (from.x + to.x) / 2;
  const my  = (from.y + to.y) / 2;
  const cpx = mx + (-dy / len) * len * 0.22;
  const cpy = my + ( dx / len) * len * 0.22;
  const gradId = `ag-${idx}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
          x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
          <stop offset="0%"   stopColor="oklch(0.546 0.245 263)" stopOpacity="0" />
          <stop offset="45%"  stopColor="oklch(0.546 0.245 263)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.546 0.245 263)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${from.x} ${from.y} Q ${cpx} ${cpy} ${to.x} ${to.y}`}
        stroke={`url(#${gradId})`} strokeWidth="3.5" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active
          ? { pathLength: [0, 1, 1], opacity: [0, 1, 0] }
          : { pathLength: 0, opacity: 0 }}
        transition={active
          ? { duration: 1.8, delay: lineDelay, repeat: Infinity, ease: "easeInOut", times: [0, 0.65, 1] }
          : { duration: 0.25 }}
      />
    </g>
  );
}

/* ─── TerminalLog — only ever grows, never shrinks ────────────────────────── */
function TerminalLog({ phase }: { phase: number }) {
  const showFrom = Math.max(0, phase - 2);
  const entries  = STATUS.slice(showFrom, phase + 1).map((text, i) => ({
    text, idx: showFrom + i,
  }));

  return (
    <div className="absolute top-3 left-3 pointer-events-none" style={{ zIndex: 1000 }}>
      <motion.div layout className="rounded-2xl overflow-hidden shadow-2xl" style={{
        width: PANEL_WIDTH,
        background: "rgba(10,10,10,0.78)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div className="flex items-center gap-2 px-3.5 py-2 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
          </div>
          <span className="font-mono text-[11px] font-bold tracking-widest ml-1 text-white">
            CLUSTER ENGINE
          </span>
        </div>

        <motion.div layout className="px-3.5 pt-3 pb-2.5 space-y-1.5">
          {entries.map(({ text, idx }) => {
            const isCurrent = idx === phase;
            const isPrev1   = idx === phase - 1;
            return (
              <motion.div key={idx} layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: isCurrent ? 1 : isPrev1 ? 0.42 : 0.22, y: 0 }}
                transition={{ duration: 0.28 }}
                className="flex items-start gap-2">
                <span className="font-mono text-[10px] leading-5 shrink-0" style={{
                  color: isCurrent ? "oklch(0.546 0.245 263)" : "#27c93f",
                  opacity: isCurrent ? 1 : isPrev1 ? 0.75 : 0.45,
                }}>
                  {isCurrent ? "›" : "✓"}
                </span>
                <span className="font-mono leading-5 whitespace-nowrap" style={{
                  fontSize: isCurrent ? 14 : 10,
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? "#fff" : "rgba(255,255,255,0.9)",
                }}>
                  {text}
                </span>
                {isCurrent && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
                    className="shrink-0 inline-block rounded-[1px] self-center"
                    style={{ width: 7, height: 14, background: "oklch(0.546 0.245 263)" }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div layout className="px-3.5 pb-3 flex gap-1">
          {PHASE_MS.map((_, i) => (
            <motion.div key={i} className="h-[3px] rounded-full"
              animate={{
                width: i === phase ? 16 : 4,
                backgroundColor: i === phase
                  ? "oklch(0.546 0.245 263)"
                  : i < phase ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)",
              }}
              transition={{ duration: 0.25 }} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── KanbanBoard — per-city Gantt with variable-width overlap highlight ──── */
function KanbanBoard({ color, kanban, showBars, showOverlap, overlapKwIdx, overlapKwCount, overlapLabel }: {
  color: string;
  kanban: { price: string; kwStart: number; kwEnd: number }[];
  showBars: boolean;
  showOverlap: boolean;
  overlapKwIdx: number;
  overlapKwCount: number;
  overlapLabel: string;
}) {
  const numCols = WEEK_LABELS.length;
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: showBars ? 1 : 0, y: showBars ? 0 : 8 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-background/60 p-2.5"
    >
      <div className="flex items-center mb-1">
        <div style={{ width: 46 }} />
        <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
          {WEEK_LABELS.map(w => (
            <div key={w} className="text-center text-[9px] font-mono text-muted-foreground">{w}</div>
          ))}
        </div>
      </div>
      <div className="flex items-center mb-1.5">
        <div style={{ width: 46 }} />
        <div className="flex-1 flex">
          {Array.from({ length: numCols + 1 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-border/30" style={{ height: 3 }} />
          ))}
        </div>
      </div>

      {kanban.map((o, rowIdx) => (
        <div key={rowIdx} className="flex items-center" style={{ height: 15, marginBottom: 3 }}>
          <span className="text-[9px] font-bold text-foreground shrink-0 pr-1" style={{ width: 46 }}>{o.price}</span>
          <div className="flex-1 relative" style={{ height: 10 }}>
            <div className="absolute inset-0 rounded-sm" style={{ background: "rgba(0,0,0,0.04)" }} />
            {showOverlap && (
              <motion.div className="absolute top-[-3px] bottom-[-3px] rounded-sm pointer-events-none"
                style={{
                  left: `${overlapKwIdx * COL_PCT}%`,
                  width: `${overlapKwCount * COL_PCT}%`,
                  background: color,
                  opacity: 0,
                }}
                animate={{ opacity: 0.18 }} transition={{ duration: 0.45 }}
              />
            )}
            {showBars && (
              <motion.div className="absolute top-0 bottom-0 rounded-sm"
                style={{ left: `${o.kwStart * COL_PCT}%`, background: color, opacity: 0.8 }}
                initial={{ width: 0 }}
                animate={{ width: `${(o.kwEnd - o.kwStart + 1) * COL_PCT}%` }}
                transition={{ duration: 0.55, delay: rowIdx * 0.1, ease: "easeOut" }}
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex items-start" style={{ height: 18 }}>
        <div style={{ width: 46 }} />
        <div className="flex-1 relative">
          <AnimatePresence>
            {showOverlap && (
              <motion.div
                initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute text-[9px] font-bold rounded px-1.5 py-0.5 whitespace-nowrap"
                style={{
                  left: `${overlapKwIdx * COL_PCT + overlapKwCount * COL_PCT / 2}%`,
                  transform: "translateX(-50%)",
                  color, background: color + "15",
                  border: `1px solid ${color}40`,
                }}>
                {overlapLabel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── DashboardView ───────────────────────────────────────────────────────── */
function DashboardView({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const last = DASH_PHASE_MS.length - 1;
    const t = setTimeout(
      () => phase < last ? setPhase(p => p + 1) : onComplete(),
      DASH_PHASE_MS[phase],
    );
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const strShow     = [phase >= 1, phase >= 2, phase >= 3];
  const fraShow     = [phase >= 4, phase >= 5, phase >= 6];
  const showKanban  = phase >= 7;
  const showOverlap = phase >= 8;
  const showResult  = phase >= 9;
  const fading      = phase === DASH_PHASE_MS.length - 1;
  const strTotal    = strShow.filter(Boolean).length;
  const fraTotal    = fraShow.filter(Boolean).length;

  return (
    <motion.div className="absolute inset-0 bg-background flex flex-col"
      style={{ padding: "4.5%" }}
      animate={{ opacity: fading ? 0 : 1 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }} />

      <motion.div className="relative flex items-center justify-between mb-3"
        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-[2px] w-5 bg-foreground" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Auftragseingang</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">Eingehende Prüfaufträge</h3>
        </div>
        <AnimatePresence>
          {strTotal + fraTotal > 0 && (
            <motion.div key={strTotal + fraTotal}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background text-xs font-bold text-foreground">
              <motion.span key={strTotal + fraTotal} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                {strTotal + fraTotal}
              </motion.span>
              <span className="text-muted-foreground font-normal">Aufträge · 2 Städte</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="relative flex gap-3 flex-1 min-h-0">
        {([
          {
            city: "Stuttgart", color: STR_COLOR, cards: STR_CARDS, kanban: STR_KANBAN,
            show: strShow, total: strTotal,
            overlapKwIdx: 1, overlapKwCount: 1, overlapLabel: "Überschneidung · KW 15",
          },
          {
            city: "Frankfurt",  color: FRA_COLOR, cards: FRA_CARDS, kanban: FRA_KANBAN,
            show: fraShow, total: fraTotal,
            overlapKwIdx: 1, overlapKwCount: 2, overlapLabel: "Überschneidung · KW 15–16",
          },
        ] as const).map(col => (
          <div key={col.city} className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="rounded-xl border border-border bg-background/60 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-xs font-bold text-foreground">{col.city}</span>
                </div>
                <AnimatePresence>
                  {col.total > 0 && (
                    <motion.span key={col.total}
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: col.color + "18", color: col.color }}>
                      {col.total}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-1.5">
                {col.cards.map((o, i) => (
                  <AnimatePresence key={i}>
                    {col.show[i] && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="flex items-center justify-between rounded-lg border border-border bg-background px-2.5 py-1.5">
                        <span className="text-xs font-bold text-foreground">{o.price}</span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{o.kw}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>

            <KanbanBoard
              color={col.color}
              kanban={col.kanban}
              showBars={showKanban}
              showOverlap={showOverlap}
              overlapKwIdx={col.overlapKwIdx}
              overlapKwCount={col.overlapKwCount}
              overlapLabel={col.overlapLabel}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="relative flex items-center gap-2.5 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold"
              style={{ borderColor: STR_COLOR + "50", background: STR_COLOR + "0e", color: STR_COLOR }}>
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: STR_COLOR }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              2 Cluster identifiziert
            </div>
            <span className="text-xs text-muted-foreground">Stuttgart · Frankfurt</span>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-foreground text-xs font-bold">
              <TrendingDown className="h-3 w-3" />
              Routenoptimierung wird gestartet …
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function ClusterMap() {
  const [view,         setView]         = useState<"dashboard" | "map">("dashboard");
  const [phase,        setPhase]        = useState(0);
  const [pinPixels,    setPinPixels]    = useState<Px[]>([]);
  const [clusterPixel, setClusterPixel] = useState<Px>({ x: 0, y: 0 });
  const [ready,        setReady]        = useState(false);

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    if (view !== "map") return;
    const t = setTimeout(() => {
      if (phase === PHASE_MS.length - 1) {
        setView("dashboard"); setPhase(0);
      } else {
        setPhase(p => p + 1);
      }
    }, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, view]);

  const handlePositionUpdate = useCallback((pins: Px[], cluster: Px) => {
    setPinPixels(pins); setClusterPixel(cluster);
  }, []);

  // Germany overview: STR pins phases 1–7, FRA pins phases 4–7 (both disappear at zoom phase 8)
  const showSTRPins  = phase >= 1 && phase < 8;
  const showFRAPins  = phase >= 4 && phase < 8;
  const showOverlay  = phase >= 9;   // Stuttgart close-up React overlay
  const merging      = phase >= 11;
  const showArrows   = phase === 11;
  const showCluster  = phase >= 12;
  const processing   = phase === 13;
  const discounted   = phase >= 14;

  if (!ready) return (
    <div className="w-full rounded-2xl border border-border bg-muted/20 animate-pulse" style={{ aspectRatio: "16/9" }} />
  );

  return (
    <div className="relative w-full rounded-2xl border border-border overflow-hidden shadow-lg" style={{ aspectRatio: "16/9" }}>
      <style>{`.nv-pin{background:transparent!important;border:none!important}`}</style>

      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <DashboardView key="dashboard" onComplete={() => { setView("map"); setPhase(0); }} />
        ) : (
          <motion.div key="map" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}>

            <MapContainer center={GERMANY_CENTER} zoom={GERMANY_ZOOM}
              zoomControl={false} attributionControl={false}
              scrollWheelZoom={false} doubleClickZoom={false}
              dragging={false} keyboard={false} touchZoom={false}
              style={{ width: "100%", height: "100%" }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd" maxZoom={19} />
              <MapController phase={phase} />
              <PositionTracker onUpdate={handlePositionUpdate} />

              {/* Stuttgart pins — appear one by one, fan-offset labels */}
              {showSTRPins && ORDERS.map((o, i) =>
                phase > i
                  ? <Marker key={o.id} position={[o.lat, o.lng]} icon={makePinIcon(o.price, o.lx, o.ly)} />
                  : null
              )}

              {/* Frankfurt pins — appear one by one at phases 4–6 */}
              {showFRAPins && FRA_MAP_ORDERS.map((o, i) =>
                phase > i + 3
                  ? <Marker key={o.id} position={[o.lat, o.lng]} icon={makePinIcon(o.price, o.lx, o.ly)} />
                  : null
              )}
            </MapContainer>

            {showOverlay && pinPixels.length === 3 && (
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 900 }}>
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {pinPixels.map((pp, i) => (
                    <ArrowFlow key={i} from={pp} to={clusterPixel}
                      active={showArrows} lineDelay={i * 0.3} idx={i} />
                  ))}
                </svg>

                {ORDERS.map((o, i) => (
                  <OverlayPin key={o.id} from={pinPixels[i]} price={o.price}
                    merging={merging} delay={i * 0.08} />
                ))}

                <AnimatePresence>
                  {showCluster && (
                    <motion.div className="absolute"
                      style={{ left: clusterPixel.x, top: clusterPixel.y }}
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}>
                      <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                        <div className="relative">
                          <motion.div className="absolute inset-0 rounded-full border border-brand/50"
                            animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
                          <motion.div className="absolute inset-0 rounded-full border border-brand/25"
                            animate={{ scale: [1, 2.7], opacity: [0.3, 0] }}
                            transition={{ duration: 1.8, delay: 0.55, repeat: Infinity, ease: "easeOut" }} />

                          <div className="w-28 h-28 rounded-full border-2 border-brand bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center shadow-2xl">
                            <span className="text-[9px] text-brand font-bold tracking-widest uppercase mb-0.5">3 Aufträge</span>
                            <AnimatePresence mode="wait">
                              {discounted ? (
                                <motion.div key="disc" className="flex flex-col items-center leading-none"
                                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.35 }}>
                                  <span className="text-xs line-through text-muted-foreground">900 €</span>
                                  <span className="text-2xl font-bold text-brand leading-tight">700 €</span>
                                </motion.div>
                              ) : processing ? (
                                <motion.div key="proc" className="flex flex-col items-center gap-1"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                                  <motion.div className="w-6 h-6 rounded-full border-2"
                                    style={{
                                      borderColor: "oklch(0.546 0.245 263 / 0.25)",
                                      borderTopColor: "oklch(0.546 0.245 263)",
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }} />
                                  <span className="text-[9px] text-brand font-bold leading-none">optimiert …</span>
                                </motion.div>
                              ) : (
                                <motion.span key="total" className="text-2xl font-bold text-foreground"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                  900 €
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <span className="text-[9px] text-muted-foreground mt-0.5">Stuttgart</span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {discounted && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.7, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                              className="flex items-center gap-1.5 bg-brand text-brand-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap">
                              <TrendingDown className="h-3.5 w-3.5" />
                              − 200 € gespart · 22 % günstiger
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <TerminalLog phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
