import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { resolveVideoSrc, type TrailerConfig } from "../lib/trailer";

type Props = {
  config: TrailerConfig;
  onClose: () => void;
};

/**
 * Fullscreen MP4 intro player. Presentational only — the parent decides when to
 * mount it and what to do on close (mark seen, etc).
 *
 * The overlay stays hidden until the video can actually play, so a missing or
 * broken file never causes a flash; in that case we just close immediately.
 */
export default function Trailer({ config, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const src = resolveVideoSrc(config.videoUrl);

  // No source at all → nothing to play.
  useEffect(() => {
    if (!src) onClose();
  }, [src, onClose]);

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        controls
        onCanPlay={() => setReady(true)}
        onEnded={onClose}
        onError={onClose}
        className={`max-h-full max-w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {ready && (
        <>
          {/* Unmute / mute */}
          <button
            onClick={toggleMute}
            className="absolute top-6 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/50 hover:bg-black/70 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur transition-colors"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {muted ? "Unmute" : "Mute"}
          </button>

          {/* Skip / close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur transition-colors"
          >
            Skip <X size={14} />
          </button>
        </>
      )}
    </div>
  );
}
