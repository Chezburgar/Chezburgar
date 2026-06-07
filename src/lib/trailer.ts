// Intro slideshow shown to first-time visitors. The slides are curated in
// Trailer.tsx; this module just holds the version/enable flags and the
// "have they seen it" gating helpers.

// Bump this whenever you change the slides — anyone who saw an older version
// will be shown the intro again on their next visit.
export const TRAILER_VERSION = 2;
export const TRAILER_ENABLED = true;

const SEEN_KEY = "trailerSeenVersion";

export function getSeenVersion(): number {
  return Number(localStorage.getItem(SEEN_KEY) || 0);
}

export function markTrailerSeen() {
  localStorage.setItem(SEEN_KEY, String(TRAILER_VERSION));
}

/** Clear the "seen" flag so the intro auto-plays again on this browser. */
export function rearmTrailer() {
  localStorage.removeItem(SEEN_KEY);
}
