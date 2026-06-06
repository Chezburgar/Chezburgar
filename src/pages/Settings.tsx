import { Check, Sparkles, Grid3x3, CircleDot, Minus, Zap, EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { BUTTON_SIZES, THEMES, type ButtonSize } from "../lib/themes";
import { cornerClass, useSettings, type Corners, type Pattern } from "../lib/useSettings";

const CORNER_OPTIONS: { value: Corners; name: string; preview: string }[] = [
  { value: "sharp", name: "Sharp", preview: "rounded-md" },
  { value: "rounded", name: "Rounded", preview: "rounded-2xl" },
  { value: "soft", name: "Soft", preview: "rounded-3xl" },
];

const PATTERN_OPTIONS: { value: Pattern; name: string; icon: typeof Minus }[] = [
  { value: "solid", name: "Solid", icon: Minus },
  { value: "grid", name: "Grid", icon: Grid3x3 },
  { value: "dots", name: "Dots", icon: CircleDot },
];

export default function Settings() {
  const {
    theme, size, corners, pattern, reduceMotion, showMascot, tripleTUnlocked,
    setTheme, setSize, setCorners, setPattern, setReduceMotion, setShowMascot,
  } = useSettings();
  const tileCorner = cornerClass(corners);
  // Secret themes only appear in the picker once the user has unlocked them.
  const visibleThemes = THEMES.filter((th) => !th.secret || tripleTUnlocked);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <header className="mb-10 text-center">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">Settings</h1>
        <p className="mt-3 text-white/60">Pick a theme and customize the look — everything saves automatically.</p>
      </header>

      {/* Themes */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold">Theme</h2>
          <span className="text-xs text-white/50">{visibleThemes.length} options</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {visibleThemes.map((t) => {
            const selected = t.value === theme;
            return (
              <motion.button
                key={t.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTheme(t.value)}
                className={`relative overflow-hidden ${tileCorner} aspect-[5/4] text-left transition-shadow ${
                  selected ? "ring-4 ring-white shadow-2xl" : "ring-1 ring-white/15 hover:ring-white/40"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient}`} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative h-full flex flex-col justify-between p-3">
                  <div className={`self-start h-7 w-7 rounded-md ${t.accent} shadow-md`} />
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
                {selected && (
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white text-black grid place-items-center shadow-lg">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Button size */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Button size</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUTTON_SIZES.map((s) => {
            const selected = s.value === size;
            return (
              <button
                key={s.value}
                onClick={() => setSize(s.value as ButtonSize)}
                className={`p-5 ${tileCorner} border transition-colors ${
                  selected
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/15 text-white hover:bg-white/10"
                }`}
              >
                <div className="font-semibold">{s.name}</div>
                <div className={`text-xs mt-1 ${selected ? "text-black/60" : "text-white/50"}`}>
                  Icon {s.iconSize}px
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tile corners */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Tile corners</h2>
        <div className="grid grid-cols-3 gap-3">
          {CORNER_OPTIONS.map((opt) => {
            const selected = opt.value === corners;
            return (
              <button
                key={opt.value}
                onClick={() => setCorners(opt.value)}
                className={`p-5 ${tileCorner} border transition-colors flex flex-col items-center gap-3 ${
                  selected
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/15 text-white hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-12 h-12 ${opt.preview} ${
                    selected ? "bg-black/80" : "bg-white/30"
                  }`}
                />
                <div className="font-semibold">{opt.name}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Background pattern */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Background pattern</h2>
        <div className="grid grid-cols-3 gap-3">
          {PATTERN_OPTIONS.map((opt) => {
            const selected = opt.value === pattern;
            const I = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setPattern(opt.value)}
                className={`p-5 ${tileCorner} border transition-colors flex flex-col items-center gap-3 ${
                  selected
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/15 text-white hover:bg-white/10"
                }`}
              >
                <I size={32} strokeWidth={1.6} />
                <div className="font-semibold">{opt.name}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Toggles */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Vibes</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <ToggleRow
            icon={Zap}
            label="Reduce motion"
            description="Disable animations and floating effects."
            value={reduceMotion}
            onChange={setReduceMotion}
            corner={tileCorner}
          />
          <ToggleRow
            icon={showMascot ? Eye : EyeOff}
            label="Show burger mascot"
            description="Toggle the floating 🍔 on the homepage."
            value={showMascot}
            onChange={setShowMascot}
            corner={tileCorner}
          />
        </div>
      </section>

      <section className={`${tileCorner} bg-white/5 border border-white/10 p-6`}>
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={18} /> About Chezburgar
        </h2>
        <p className="text-white/60 text-sm leading-relaxed">
          Chezburgar is a hand-curated games hub. Games open in a new tab and run client-side —
          we don't track plays, store accounts, or run ads. Suggestions are stored anonymously via
          Supabase and reviewed before they land on the grid.
        </p>
      </section>
    </div>
  );
}

function ToggleRow({
  icon: Icon, label, description, value, onChange, corner,
}: {
  icon: typeof Zap;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  corner: string;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-4 p-5 ${corner} bg-white/5 border border-white/15 hover:bg-white/10 transition-colors text-left`}
    >
      <Icon size={22} className="text-white/70 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-white/50 mt-0.5">{description}</div>
      </div>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
          value ? "bg-white" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-transform ${
            value ? "translate-x-5 bg-black" : "translate-x-0.5 bg-white"
          }`}
        />
      </div>
    </button>
  );
}
