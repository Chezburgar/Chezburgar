import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { getTheme } from "../lib/themes";
import { patternBgStyle, useSettings } from "../lib/useSettings";

const ADMIN_CODE = "081711";

export default function Layout() {
  const { theme, pattern, adminUnlocked, setAdminUnlocked } = useSettings();
  const t = getTheme(theme);
  const location = useLocation();
  const buffer = useRef("");

  // Keypress sniffer for the hidden admin unlock — quiet on purpose.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore typing in form fields so the unlock isn't triggered by users
      // filling out the Suggest form or admin inputs.
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (!/^[0-9]$/.test(e.key)) {
        buffer.current = "";
        return;
      }
      buffer.current = (buffer.current + e.key).slice(-ADMIN_CODE.length);
      if (buffer.current === ADMIN_CODE) {
        setAdminUnlocked(true);
        buffer.current = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setAdminUnlocked]);

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
              <span className="text-2xl group-hover:rotate-12 transition-transform">🍔</span>
              <span className="font-display tracking-widest text-lg sm:text-xl">
                CHEZBURGAR
              </span>
            </Link>
            <ul className="flex items-center gap-1 overflow-x-auto">
              <li>{navLink("/", "Games")}</li>
              <li>{navLink("/grades", "Grades")}</li>
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
            <span>© {new Date().getFullYear()} Chezburgar · a games hub with a burger mascot</span>
            <span className="font-mono tracking-widest">v3.2</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
