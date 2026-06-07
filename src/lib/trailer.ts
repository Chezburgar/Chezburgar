// Intro "trailer" shown to first-time visitors — a single MP4 video. The
// published config lives in /public/trailer.json so it can be changed without
// touching code; the Admin "Trailer" panel edits it. A baked default here is
// used as a fallback if the JSON can't be fetched.

export type TrailerConfig = {
  /** Bump this when you swap the video — visitors who already saw the old one
   *  will be shown the new trailer again. */
  version: number;
  enabled: boolean;
  /** Absolute URL (https://…) or a path relative to the site, e.g. "trailer.mp4"
   *  for a file dropped in /public. */
  videoUrl: string;
};

export const DEFAULT_TRAILER: TrailerConfig = {
  version: 1,
  enabled: true,
  videoUrl: "trailer.mp4",
};

const DRAFT_KEY = "trailerDraft";
const SEEN_KEY = "trailerSeenVersion";

/** Resolve a stored videoUrl into a usable src (handles base path + absolutes). */
export function resolveVideoSrc(url: string): string {
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, "")}`;
}

function normalize(raw: unknown): TrailerConfig {
  const cfg = raw as Partial<TrailerConfig> | null;
  if (!cfg || typeof cfg !== "object") return DEFAULT_TRAILER;
  return {
    version: typeof cfg.version === "number" ? cfg.version : 1,
    enabled: cfg.enabled !== false,
    videoUrl: typeof cfg.videoUrl === "string" ? cfg.videoUrl : "",
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

export function trailerToJson(cfg: TrailerConfig): string {
  return JSON.stringify(cfg, null, 2);
}
