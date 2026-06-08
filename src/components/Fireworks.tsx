import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// Other components dispatch this window event to launch the celebration.
export const FIREWORKS_EVENT = "chez:fireworks";

const COLORS = [
  "#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#5ac8fa",
  "#007aff", "#af52de", "#ff2d55", "#ff6b1a", "#ffffff",
];

type Particle = { x: number; y: number; vx: number; vy: number; color: string; alpha: number; decay: number; size: number };
type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };

export default function Fireworks({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const launch = () => {
      rockets.push({
        x: rand(w * 0.15, w * 0.85),
        y: h,
        vy: rand(-13, -10),
        targetY: rand(h * 0.08, h * 0.45),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const n = Math.floor(rand(46, 78));
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + rand(-0.12, 0.12);
        const spd = rand(1.5, 6);
        particles.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color: Math.random() < 0.18 ? "#ffffff" : color,
          alpha: 1,
          decay: rand(0.008, 0.02),
          size: rand(1.5, 3),
        });
      }
    };

    let raf = 0;
    let last = performance.now();
    let launchTimer = 0;

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 16.67, 2);
      last = t;

      // Fade previous frame for glowing trails.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(6, 5, 12, 0.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      launchTimer -= dt;
      if (launchTimer <= 0) {
        launch();
        if (Math.random() < 0.35) launch();
        launchTimer = rand(16, 40);
      }

      rockets = rockets.filter((r) => {
        r.y += r.vy * dt;
        r.vy += 0.12 * dt;
        if (r.vy >= 0 || r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          return false;
        }
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      particles = particles.filter((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.055 * dt;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) return false;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };

    for (let i = 0; i < 3; i++) window.setTimeout(launch, i * 220);
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const auto = window.setTimeout(onClose, 20000); // safety auto-dismiss

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(auto);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-sm cursor-pointer">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-6">
        <div className="text-6xl sm:text-8xl animate-bounce">🎉</div>
        <h2 className="mt-4 font-display text-5xl sm:text-7xl tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]">
          SCHOOL'S OUT!
        </h2>
        <p className="mt-3 text-white/85 text-lg sm:text-xl">Have an amazing summer. 🍔</p>
        <p className="mt-6 text-white/50 text-xs uppercase tracking-widest">Click anywhere to close</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur transition-colors"
      >
        Close <X size={14} />
      </button>
    </div>
  );
}
