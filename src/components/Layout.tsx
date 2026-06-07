import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { getTheme } from "../lib/themes";
import { patternBgStyle, useSettings } from "../lib/useSettings";
import Trailer from "./Trailer";
import {
  TRAILER_ENABLED, TRAILER_VERSION, getSeenVersion, markTrailerSeen,
} from "../lib/trailer";

const ADMIN_CODE = "081711";
const TRIPLE_T_CODE = "tung";
const TRIPLE_T_THEME = "triple-t";

// Footer "Watch intro again" dispatches this so the published trailer replays.
export const PLAY_TRAILER_EVENT = "chez:play-trailer";

export default function Layout() {
  const {
    theme, pattern, adminUnlocked, tripleTUnlocked,
    setAdminUnlocked, setTripleTUnlocked, setTheme,
  } = useSettings();
  const t = getTheme(theme);
  const location = useLocation();
  const numericBuffer = useRef("");
  const letterBuffer = useRef("");
  const [toast, setToast] = useState<string | null>(null);

  // --- Intro slideshow -------------------------------------------------
  const [showTrailer, setShowTrailer] = useState(false);

  // Auto-show the intro to first-time visitors (or anyone who hasn't seen the
  // current version yet).
  useEffect(() => {
    if (TRAILER_ENABLED && getSeenVersion() !== TRAILER_VERSION) {
      setShowTrailer(true);
    }
  }, []);

  // Footer "Watch intro" → replay without changing the seen flag.
  useEffect(() => {
    const replay = () => setShowTrailer(true);
    window.addEventListener(PLAY_TRAILER_EVENT, replay);
    return () => window.removeEventListener(PLAY_TRAILER_EVENT, replay);
  }, []);

  const closeTrailer = () => {
    markTrailerSeen();
    setShowTrailer(false);
  };

  const isTriplet = theme === TRIPLE_T_THEME;
  const brandText = isTriplet ? "TUNGBURGER" : "CHEZBURGAR";
  const brandEmoji = isTriplet ? "🪵" : "🍔";

  // Update the browser tab title whenever the theme changes — Tungburger mode
  // gets its own title so it's obvious the easter egg is active.
  useEffect(() => {
    document.title = isTriplet
      ? "TUNGBURGER — Brainrot edition"
      : "CHEZBURGAR — Play Everything.";
  }, [isTriplet]);

  // Keypress sniffer for both unlock codes. Numeric digits feed the admin
  // unlock; lowercase letters feed the Triple T unlock. Typing in form fields
  // is ignored so users filling out Suggest/Admin inputs don't trigger it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      // Admin: digit sequence
      if (/^[0-9]$/.test(e.key)) {
        numericBuffer.current = (numericBuffer.current + e.key).slice(-ADMIN_CODE.length);
        if (numericBuffer.current === ADMIN_CODE) {
          setAdminUnlocked(true);
          numericBuffer.current = "";
          setToast("🔐 Admin unlocked");
          setTimeout(() => setToast(null), 2400);
        }
      } else {
        numericBuffer.current = "";
      }

      // Triple T: letter sequence (case-insensitive)
      if (/^[a-zA-Z]$/.test(e.key)) {
        letterBuffer.current = (letterBuffer.current + e.key.toLowerCase()).slice(-TRIPLE_T_CODE.length);
        if (letterBuffer.current === TRIPLE_T_CODE && !tripleTUnlocked) {
          setTripleTUnlocked(true);
          setTheme(TRIPLE_T_THEME);
          letterBuffer.current = "";
          setToast("🪵 Triple T unlocked");
          setTimeout(() => setToast(null), 2400);
        }
      } else {
        letterBuffer.current = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setAdminUnlocked, setTripleTUnlocked, setTheme, tripleTUnlocked]);

  const baseLink = "px-3 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors";
  const activeLink = `${t.accent} text-white shadow-lg`;
  const idleLink = "text-white/70 hover:text-white hover:bg-white/10";

  const navLink = (to: string, label: string, icon?: string) => (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `${baseLink} inline-flex items-center gap-1.5 ${isActive ? activeLink : idleLink}`
      }
    >
      {icon && <span aria-hidden>{icon}</span>}
      {label}
    </NavLink>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.gradient} text-white relative`}>
      {/* Pattern overlay — sits above the gradient but below content */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={patternBgStyle(pattern)}
      />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/5">
          <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <span className="text-2xl group-hover:rotate-12 transition-transform">{brandEmoji}</span>
              <span className="font-display tracking-widest text-lg sm:text-xl">
                {brandText}
              </span>
            </Link>
            <ul className="flex items-center gap-1 overflow-x-auto">
              <li>{navLink("/", "Games")}</li>
              <li>{navLink("/grades", "Grades")}</li>
              <li>{navLink("/messages", "Messages")}</li>
              <li>{navLink("/suggest", "Suggest")}</li>
              <li>{navLink("/settings", "Settings")}</li>
              {adminUnlocked && <li>{navLink("/admin", "Admin", "🔐")}</li>}
            </ul>
          </nav>
        </header>

        <main key={location.pathname} className="animate-[fadeIn_0.3s_ease-out]">
          <Outlet />
        </main>

        <footer className="border-t border-white/5 mt-16 py-8">
          <div className="mx-auto max-w-6xl px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/40">
            <span>© {new Date().getFullYear()} {brandText.charAt(0) + brandText.slice(1).toLowerCase()} · a games hub with a {isTriplet ? "wooden mascot" : "burger mascot"}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new Event(PLAY_TRAILER_EVENT))}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                ▶ Watch intro
              </button>
              <span className="font-mono tracking-widest">v4.0</span>
            </div>
          </div>
        </footer>
      </div>

      {/* First-visit intro slideshow */}
      {showTrailer && <Trailer onClose={closeTrailer} />}

      {/* Floating unlock toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-full bg-black/85 backdrop-blur-md text-white font-semibold text-sm shadow-2xl border border-white/10 animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}
