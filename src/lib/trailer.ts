// Intro "trailer" shown to first-time visitors. The published trailer lives in
// /public/trailer.json so it can be edited without touching code; the Admin
// "Trailer Studio" provides a builder that exports that file. A baked default
// here is used as a fallback if the JSON can't be fetched.

export type TrailerSlide = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  from: string; // gradient start (hex)
  to: string; // gradient end (hex)
  durationMs: number;
};

export type TrailerConfig = {
  /** Bump this when you republish — visitors who already saw an older version
   *  will be shown the trailer again. */
  version: number;
  enabled: boolean;
  slides: TrailerSlide[];
};

export const GRADIENT_PRESETS: { name: string; from: string; to: string }[] = [
  { name: "Grape", from: "#6d28d9", to: "#db2777" },
  { name: "Sunset", from: "#f97316", to: "#db2777" },
  { name: "Ocean", from: "#0ea5e9", to: "#2563eb" },
  { name: "Forest", from: "#16a34a", to: "#0d9488" },
  { name: "Fire", from: "#dc2626", to: "#f59e0b" },
  { name: "Candy", from: "#ec4899", to: "#8b5cf6" },
  { name: "Mint", from: "#10b981", to: "#06b6d4" },
  { name: "Gold", from: "#ca8a04", to: "#f59e0b" },
  { name: "Cyber", from: "#facc15", to: "#a855f7" },
  { name: "Berry", from: "#9d174d", to: "#4c1d95" },
  { name: "Wood", from: "#92400e", to: "#1c1917" },
  { name: "Midnight", from: "#1e1b4b", to: "#0f172a" },
];

export const DEFAULT_TRAILER: TrailerConfig = {
  version: 1,
  enabled: true,
  slides: [
    {
      id: "s1",
      emoji: "🍔",
      title: "Welcome to Chezburgar",
      subtitle: "Your playground for unblocked games.",
      from: "#6d28d9",
      to: "#db2777",
      durationMs: 3200,
    },
    {
      id: "s2",
      emoji: "🎮",
      title: "Tons of games, zero logins",
      subtitle: "Click a tile and play instantly — no ads, no waiting.",
      from: "#0ea5e9",
      to: "#2563eb",
      durationMs: 3200,
    },
    {
      id: "s3",
      emoji: "🎨",
      title: "Make it yours",
      subtitle: "48+ themes and customization options in Settings.",
      from: "#ec4899",
      to: "#8b5cf6",
      durationMs: 3200,
    },
    {
      id: "s4",
      emoji: "🚀",
      title: "Let's play",
      subtitle: "Pick a game and dive in.",
      from: "#16a34a",
      to: "#0d9488",
      durationMs: 3000,
    },
  ],
};

const DRAFT_KEY = "trailerDraft";
const SEEN_KEY = "trailerSeenVersion";

function normalize(raw: unknown): TrailerConfig {
  const cfg = raw as Partial<TrailerConfig> | null;
  if (!cfg || !Array.isArray(cfg.slides)) return DEFAULT_TRAILER;
  return {
    version: typeof cfg.version === "number" ? cfg.version : 1,
    enabled: cfg.enabled !== false,
    slides: cfg.slides
      .filter((s): s is TrailerSlide => !!s && typeof s.title === "string")
      .map((s, i) => ({
        id: s.id || `s${i}`,
        emoji: s.emoji || "✨",
        title: s.title || "",
        subtitle: s.subtitle || "",
        from: s.from || "#6d28d9",
        to: s.to || "#db2777",
        durationMs: Math.max(1200, Math.min(15000, s.durationMs || 3200)),
      })),
  };
}

/** Fetch the published trailer from /public/trailer.json (base-path aware). */
export async function loadPublishedTrailer(): Promise<TrailerConfig> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}trailer.json`, { cache: "no-cache" });
    if (res.ok) return normalize(await res.json());
  } catch {
    /* fall through to baked default */
  }
  return DEFAULT_TRAILER;
}

// --- First-visit gating --------------------------------------------------

export function getSeenVersion(): number {
  return Number(localStorage.getItem(SEEN_KEY) || 0);
}

export function markTrailerSeen(version: number) {
  localStorage.setItem(SEEN_KEY, String(version));
}

/** Clear the "seen" flag so the trailer auto-plays again on this browser. */
export function rearmTrailer() {
  localStorage.removeItem(SEEN_KEY);
}

// --- Admin draft (local editor state) -----------------------------------

export function loadDraft(): TrailerConfig | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveDraft(cfg: TrailerConfig) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(cfg));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function newSlide(): TrailerSlide {
  const preset = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
  return {
    id: `s${Date.now().toString(36)}`,
    emoji: "✨",
    title: "New slide",
    subtitle: "Say something fun here.",
    from: preset.from,
    to: preset.to,
    durationMs: 3200,
  };
}

export function trailerToJson(cfg: TrailerConfig): string {
  return JSON.stringify(cfg, null, 2);
}
