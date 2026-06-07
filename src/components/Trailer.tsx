import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, Play, Trophy, Ghost, Flame, Pizza, Rocket,
  Crown, Ban, Zap, UserX, GraduationCap, MessageCircle, Lightbulb,
  Send, Sparkles, Square, Grid3x3,
} from "lucide-react";
import { useSettings } from "../lib/useSettings";

type Slide = {
  id: string;
  from: string;
  to: string;
  title: string;
  subtitle: string;
  durationMs: number;
  visual: ReactNode;
};

// --- Slide visuals -------------------------------------------------------

// Visuals are intentionally static (no per-element entrance animation) so they
// are always fully visible the instant a slide appears — the slide as a whole
// still crossfades. Keeps the showcase bulletproof across browsers.

const tile = (Icon: typeof Trophy, bg: string, label: string) => (
  <div
    key={label}
    className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-1 text-white shadow-lg"
    style={{ background: bg }}
  >
    <Icon size={30} strokeWidth={1.7} />
    <span className="text-[10px] font-semibold opacity-90">{label}</span>
  </div>
);

const GameTiles = (
  <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
    {tile(Trophy, "#7c3aed", "Hollow Knight")}
    {tile(Ghost, "#db2777", "Slope")}
    {tile(Flame, "#f97316", "Subway")}
    {tile(Pizza, "#0ea5e9", "Mario Kart")}
    {tile(Rocket, "#16a34a", "Rocket")}
    {tile(Crown, "#eab308", "BitLife")}
  </div>
);

const chip = (Icon: typeof Zap, text: string) => (
  <div
    key={text}
    className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-5 py-3 text-white font-semibold text-lg"
  >
    <Icon size={20} /> {text}
  </div>
);

const FreeChips = (
  <div className="flex flex-col items-center gap-3">
    {chip(UserX, "No login")}
    {chip(Ban, "No ads")}
    {chip(Zap, "Instant play")}
  </div>
);

const THEME_SWATCHES = [
  ["#6d28d9", "#db2777"], ["#0ea5e9", "#2563eb"], ["#16a34a", "#0d9488"],
  ["#f97316", "#db2777"], ["#facc15", "#a855f7"], ["#dc2626", "#f59e0b"],
  ["#ec4899", "#8b5cf6"], ["#10b981", "#06b6d4"], ["#1e1b4b", "#0f172a"],
  ["#92400e", "#1c1917"], ["#9d174d", "#4c1d95"], ["#06b6d4", "#3b82f6"],
];

const ThemeSwatches = (
  <div className="grid grid-cols-4 gap-2.5 w-full max-w-xs">
    {THEME_SWATCHES.map(([a, b], i) => (
      <div
        key={i}
        className="rounded-xl aspect-square shadow-md"
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      />
    ))}
  </div>
);

const customCard = (Icon: typeof Square, label: string) => (
  <div
    key={label}
    className="rounded-2xl bg-white/15 backdrop-blur px-5 py-4 flex items-center gap-3 text-white font-semibold"
  >
    <Icon size={22} /> {label}
  </div>
);

const CustomizeCards = (
  <div className="grid grid-cols-2 gap-3 w-full max-w-md">
    {customCard(Square, "Corners")}
    {customCard(Grid3x3, "Patterns")}
    {customCard(Zap, "Motion")}
    {customCard(Sparkles, "Mascot")}
  </div>
);

const tabCard = (Icon: typeof GraduationCap, label: string) => (
  <div
    key={label}
    className="rounded-2xl bg-white/15 backdrop-blur px-8 py-6 flex flex-col items-center gap-2 text-white"
  >
    <Icon size={40} strokeWidth={1.6} />
    <span className="font-display text-xl tracking-wide">{label}</span>
  </div>
);

const TabCards = (
  <div className="flex gap-4">
    {tabCard(GraduationCap, "Grades")}
    {tabCard(MessageCircle, "Messages")}
  </div>
);

const SuggestVisual = (
  <div className="w-full max-w-sm">
    <div className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur p-2">
      <Lightbulb size={20} className="ml-2 text-white/80" />
      <span className="flex-1 text-white/90 font-medium">Geometry Dash</span>
      <span className="inline-flex items-center gap-1 rounded-xl bg-white text-black px-4 py-2 text-sm font-bold">
        <Send size={14} /> Add
      </span>
    </div>
  </div>
);

const CountdownVisual = (
  <div className="flex flex-col items-center gap-4">
    <GraduationCap size={40} className="text-white/90" />
    <div className="flex gap-2">
      {[["11", "DAYS"], ["04", "HRS"], ["23", "MIN"], ["59", "SEC"]].map(([n, l]) => (
        <div key={l} className="bg-black/30 rounded-xl px-4 py-3 text-center">
          <div className="font-display text-3xl tabular-nums text-white leading-none">{n}</div>
          <div className="text-[9px] tracking-widest text-white/60 mt-1">{l}</div>
        </div>
      ))}
    </div>
  </div>
);

const Emoji = (e: string) => (
  <div className="text-[7rem] sm:text-[9rem] leading-none animate-float">{e}</div>
);

// --- Slides --------------------------------------------------------------

const SLIDES: Slide[] = [
  {
    id: "welcome",
    from: "#6d28d9", to: "#db2777",
    title: "Welcome to Chezburgar",
    subtitle: "Your playground for unblocked games.",
    durationMs: 3000,
    visual: Emoji("🍔"),
  },
  {
    id: "games",
    from: "#0ea5e9", to: "#2563eb",
    title: "Tons of games",
    subtitle: "Hollow Knight, Slope, Mario Kart & more — search and play in seconds.",
    durationMs: 3400,
    visual: GameTiles,
  },
  {
    id: "free",
    from: "#16a34a", to: "#0d9488",
    title: "Always free",
    subtitle: "No accounts. No ads. No waiting around.",
    durationMs: 3200,
    visual: FreeChips,
  },
  {
    id: "themes",
    from: "#9333ea", to: "#ec4899",
    title: "48+ themes",
    subtitle: "Repaint the whole site in a single tap.",
    durationMs: 3200,
    visual: ThemeSwatches,
  },
  {
    id: "customize",
    from: "#f59e0b", to: "#db2777",
    title: "Make it yours",
    subtitle: "Corners, backgrounds, motion and the mascot — all in Settings.",
    durationMs: 3200,
    visual: CustomizeCards,
  },
  {
    id: "tabs",
    from: "#2563eb", to: "#7c3aed",
    title: "Grades & Messages built in",
    subtitle: "Your school tools, embedded right here.",
    durationMs: 3200,
    visual: TabCards,
  },
  {
    id: "suggest",
    from: "#db2777", to: "#f97316",
    title: "Missing a game?",
    subtitle: "Suggest it — we add the good ones.",
    durationMs: 3000,
    visual: SuggestVisual,
  },
  {
    id: "countdown",
    from: "#0d9488", to: "#1e3a8a",
    title: "Last-day-of-school countdown",
    subtitle: "Watch it tick down right on the homepage.",
    durationMs: 3200,
    visual: CountdownVisual,
  },
  {
    id: "finale",
    from: "#7c3aed", to: "#db2777",
    title: "Let's play",
    subtitle: "Pick a game and dive in — plus a few hidden surprises 👀",
    durationMs: 3400,
    visual: Emoji("🎮"),
  },
];

// --- Player --------------------------------------------------------------

export default function Trailer({ onClose }: { onClose: () => void }) {
  const { reduceMotion } = useSettings();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  // Keep onClose in a ref so the auto-advance timer below can depend ONLY on
  // `index` — otherwise a parent re-render (which gives onClose a new identity)
  // would reset the timer every render and the slideshow would never advance.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= SLIDES.length - 1) {
        onCloseRef.current();
        return i;
      }
      return i + 1;
    });
  }, []);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Auto-advance — re-armed only when the slide index changes.
  useEffect(() => {
    const id = window.setTimeout(goNext, SLIDES[index].durationMs);
    return () => window.clearTimeout(id);
  }, [index, goNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-7"
          style={{ backgroundImage: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
        >
          <div className="min-h-[10rem] flex items-center justify-center">{slide.visual}</div>
          <div>
            <motion.h2
              initial={reduceMotion ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="font-display text-4xl sm:text-6xl tracking-tight text-white max-w-3xl drop-shadow-lg"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={reduceMotion ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="mt-3 text-lg sm:text-xl text-white/85 max-w-xl mx-auto"
            >
              {slide.subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress segments */}
      <div className="absolute top-4 inset-x-4 flex gap-1.5 z-10">
        {SLIDES.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full bg-white"
              style={
                i < index
                  ? { width: "100%" }
                  : i === index
                  ? { width: "100%", animation: `trailerFill ${slide.durationMs}ms linear forwards` }
                  : { width: "0%" }
              }
            />
          </div>
        ))}
      </div>

      {/* Tap zones */}
      <button aria-label="Previous" onClick={goPrev} className="absolute left-0 top-12 bottom-20 w-1/3 z-10 cursor-default" />
      <button aria-label="Next" onClick={goNext} className="absolute right-0 top-12 bottom-20 w-1/3 z-10 cursor-default" />

      {/* Skip */}
      <button
        onClick={onClose}
        className="absolute top-7 right-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur transition-colors"
      >
        Skip <X size={14} />
      </button>

      {/* Bottom controls */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white backdrop-blur transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goNext}
          className="inline-flex items-center gap-2 rounded-full bg-white text-black hover:bg-white/90 px-6 py-3 font-semibold transition-colors"
        >
          {index >= SLIDES.length - 1 ? (<><Play size={16} /> Start playing</>) : (<>Next <ChevronRight size={16} /></>)}
        </button>
        <div className="h-11 w-11" aria-hidden />
      </div>
    </div>
  );
}
