import { useEffect, useMemo, useState } from "react";
import { Search, ExternalLink, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { DEFAULT_GAMES, ICON_OPTIONS, type IconName } from "../lib/games";
import { getButtonSize, getTheme } from "../lib/themes";
import { cornerClass, useSettings } from "../lib/useSettings";
import { listCustomGames, type CustomGame } from "../lib/supabase";
import Burger from "../components/Burger";

export default function Home() {
  const { theme, size, corners, reduceMotion, showMascot } = useSettings();
  const t = getTheme(theme);
  const sz = getButtonSize(size);
  const tileCorner = cornerClass(corners);
  const isTriplet = theme === "triple-t";

  const [query, setQuery] = useState("");
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);

  useEffect(() => {
    listCustomGames().then(setCustomGames);
    const refresh = () => listCustomGames().then(setCustomGames);
    window.addEventListener("gamesUpdated", refresh);
    return () => window.removeEventListener("gamesUpdated", refresh);
  }, []);

  const allGames = useMemo(() => {
    // Merge default + custom games first, then assign colours by walking the
    // active theme palette across the whole list. The custom game's stored
    // `color` is intentionally ignored here so swapping themes restyles every
    // tile uniformly (it's still used in Admin where the original choice
    // matters for the preview).
    const merged = [
      ...DEFAULT_GAMES.map((g, i) => ({
        key: `d-${i}`,
        name: g.name,
        url: g.url,
        Icon: g.icon,
      })),
      ...customGames.map((g) => ({
        key: `c-${g.id}`,
        name: g.name,
        url: g.url,
        Icon: ICON_OPTIONS[(g.icon as IconName) ?? "Gamepad2"] ?? Gamepad2,
      })),
    ];
    return merged.map((g, i) => ({ ...g, color: t.palette[i % t.palette.length] }));
  }, [customGames, t.palette]);

  const filtered = useMemo(
    () => allGames.filter((g) => g.name.toLowerCase().includes(query.toLowerCase())),
    [allGames, query]
  );

  // Skip framer-motion props entirely when user prefers reduced motion.
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className={`pt-14 pb-12 grid gap-10 items-center ${showMascot ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
        <div>
          <motion.h1
            {...motionProps}
            transition={{ duration: 0.5 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight"
          >
            Welcome to <span className="block">{isTriplet ? "Tungburger." : "Chezburgar."}</span>
          </motion.h1>
          <motion.p
            {...motionProps}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-white/70 text-lg max-w-md"
          >
            Curated unblocked games. Click a tile and play — no login, no ads, no waiting.
          </motion.p>

          <motion.form
            {...motionProps}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={(e) => e.preventDefault()}
            className="mt-7 max-w-md relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className={`w-full pl-12 pr-4 py-4 ${tileCorner} bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent`}
            />
          </motion.form>

          <motion.p
            {...motionProps}
            transition={{ delay: 0.35 }}
            className="mt-5 text-sm text-white/50"
          >
            {filtered.length} of {allGames.length} {allGames.length === 1 ? "game" : "games"}
            {query && ` matching “${query}”`}
          </motion.p>
        </div>

        {showMascot && (
          <motion.div
            {...(reduceMotion ? {} : { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } })}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="absolute inset-8 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className={reduceMotion ? "" : "animate-float"}>
              {isTriplet ? (
                <div
                  className="text-[18rem] leading-none select-none drop-shadow-2xl"
                  role="img"
                  aria-label="Tung Tung Sahur"
                >
                  🪵
                </div>
              ) : (
                <Burger className="w-full max-w-[340px]" />
              )}
            </div>
          </motion.div>
        )}
      </section>

      {/* Game grid */}
      <section className="pb-14">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Gamepad2 size={48} className="mx-auto text-white/30 mb-3" />
            <p className="text-lg">No games match “{query}”.</p>
            <p className="text-sm text-white/50 mt-1">Try a different search — or suggest it on the Suggest page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((g, i) => (
              <motion.a
                key={g.key}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 16 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.3, delay: Math.min(i * 0.02, 0.4) },
                      whileHover: { scale: 1.04 },
                      whileTap: { scale: 0.97 },
                    })}
                className={`group relative ${g.color} ${tileCorner} ${sz.padding} transition-shadow shadow-lg hover:shadow-2xl text-white aspect-square flex flex-col items-center justify-center gap-3`}
              >
                <ExternalLink size={14} className="absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors" />
                <g.Icon size={sz.iconSize} strokeWidth={1.6} className="drop-shadow-md" />
                <span className="text-sm sm:text-base font-semibold text-center leading-tight">{g.name}</span>
              </motion.a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
