import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { TrailerConfig } from "../lib/trailer";
import { useSettings } from "../lib/useSettings";

type Props = {
  config: TrailerConfig;
  onClose: () => void;
};

/**
 * Fullscreen "stories"-style intro player. Presentational only — the parent
 * decides when to mount it and what to do on close (mark seen, etc).
 */
export default function Trailer({ config, onClose }: Props) {
  const { reduceMotion } = useSettings();
  const slides = config.slides;
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  const slide = slides[index];

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= slides.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
  }, [slides.length, onClose]);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Auto-advance: (re)arm a timeout whenever the active slide changes.
  useEffect(() => {
    if (!slide) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(goNext, slide.durationMs);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, slide, goNext]);

  // Keyboard controls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  if (!slide) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black" />

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.45 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ backgroundImage: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
        >
          <motion.div
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className={`text-[7rem] sm:text-[10rem] leading-none mb-4 ${reduceMotion ? "" : "animate-float"}`}
          >
            {slide.emoji}
          </motion.div>
          <motion.h2
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-display text-4xl sm:text-6xl tracking-tight text-white max-w-3xl drop-shadow-lg"
          >
            {slide.title}
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-lg sm:text-2xl text-white/85 max-w-xl"
          >
            {slide.subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Progress segments */}
      <div className="absolute top-4 inset-x-4 flex gap-1.5 z-10">
        {slides.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full bg-white"
              style={
                i < index
                  ? { width: "100%" }
                  : i === index
                  ? {
                      width: "100%",
                      animation: `trailerFill ${slide.durationMs}ms linear forwards`,
                    }
                  : { width: "0%" }
              }
            />
          </div>
        ))}
      </div>

      {/* Tap zones for prev/next (don't cover the buttons) */}
      <button
        aria-label="Previous"
        onClick={goPrev}
        className="absolute left-0 top-12 bottom-20 w-1/3 z-10 cursor-default"
      />
      <button
        aria-label="Next"
        onClick={goNext}
        className="absolute right-0 top-12 bottom-20 w-1/3 z-10 cursor-default"
      />

      {/* Skip / close */}
      <button
        onClick={onClose}
        className="absolute top-8 right-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur transition-colors"
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
          {index >= slides.length - 1 ? (
            <>
              <Play size={16} /> Start playing
            </>
          ) : (
            <>
              Next <ChevronRight size={16} />
            </>
          )}
        </button>
        <div className="h-11 w-11" aria-hidden />
      </div>
    </div>
  );
}
