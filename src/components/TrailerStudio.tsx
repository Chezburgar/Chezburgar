import { useState } from "react";
import {
  Play, Plus, Trash2, ArrowUp, ArrowDown, Copy, Download, Save,
  RotateCcw, Check, Clapperboard,
} from "lucide-react";
import { getTheme } from "../lib/themes";
import { useSettings } from "../lib/useSettings";
import Trailer from "./Trailer";
import {
  DEFAULT_TRAILER, GRADIENT_PRESETS, clearDraft, loadDraft, newSlide,
  rearmTrailer, saveDraft, trailerToJson, type TrailerConfig, type TrailerSlide,
} from "../lib/trailer";

const QUICK_EMOJI = ["🍔", "🎮", "🎨", "🚀", "🔥", "⚡", "🏆", "👾", "🎉", "🌟", "🪵", "💀"];

export default function TrailerStudio() {
  const { theme } = useSettings();
  const t = getTheme(theme);

  // Editor starts from a saved local draft if present, otherwise the default.
  const [cfg, setCfg] = useState<TrailerConfig>(() => loadDraft() ?? DEFAULT_TRAILER);
  const [previewing, setPreviewing] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const ping = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2000);
  };

  const update = (patch: Partial<TrailerConfig>) => setCfg((c) => ({ ...c, ...patch }));

  const updateSlide = (i: number, patch: Partial<TrailerSlide>) =>
    setCfg((c) => ({
      ...c,
      slides: c.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));

  const move = (i: number, dir: -1 | 1) =>
    setCfg((c) => {
      const j = i + dir;
      if (j < 0 || j >= c.slides.length) return c;
      const slides = [...c.slides];
      [slides[i], slides[j]] = [slides[j], slides[i]];
      return { ...c, slides };
    });

  const addSlide = () => setCfg((c) => ({ ...c, slides: [...c.slides, newSlide()] }));
  const removeSlide = (i: number) =>
    setCfg((c) => ({ ...c, slides: c.slides.filter((_, idx) => idx !== i) }));

  const handleSaveDraft = () => {
    saveDraft(cfg);
    ping("Draft saved on this browser");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trailerToJson(cfg));
      ping("trailer.json copied to clipboard");
    } catch {
      ping("Copy failed — use Download instead");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([trailerToJson(cfg)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trailer.json";
    a.click();
    URL.revokeObjectURL(url);
    ping("Downloaded trailer.json");
  };

  const handleReset = () => {
    if (!confirm("Reset the editor to the built-in default trailer?")) return;
    setCfg(DEFAULT_TRAILER);
    clearDraft();
  };

  const handleRearm = () => {
    rearmTrailer();
    ping("Re-armed — reload to see it auto-play");
  };

  return (
    <section className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clapperboard size={18} /> Trailer Studio
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-white/70 mr-1">
            <span>Version</span>
            <input
              type="number"
              min={1}
              value={cfg.version}
              onChange={(e) => update({ version: Math.max(1, Number(e.target.value) || 1) })}
              className="w-16 px-2 py-1 rounded-md bg-white/10 border border-white/15 focus:outline-none"
              title="Increase this to re-show the intro to people who already saw it"
            />
          </label>
          <button
            onClick={() => update({ enabled: !cfg.enabled })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              cfg.enabled ? "bg-green-500/30 text-green-100" : "bg-white/10 text-white/60"
            }`}
          >
            {cfg.enabled ? "Enabled" : "Disabled"}
          </button>
          <button
            onClick={() => setPreviewing(true)}
            disabled={cfg.slides.length === 0}
            className={`inline-flex items-center gap-2 ${t.accent} hover:brightness-110 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all`}
          >
            <Play size={14} /> Preview
          </button>
        </div>
      </div>

      <p className="text-xs text-white/50 mb-5 leading-relaxed">
        Build the intro that first-time visitors see. <strong className="text-white/70">Preview</strong> plays it,
        <strong className="text-white/70"> Save draft</strong> keeps it on this browser, and
        <strong className="text-white/70"> Copy / Download</strong> gives you the <code className="text-white/70">trailer.json</code> file.
        To publish it to everyone, replace <code className="text-white/70">public/trailer.json</code> in the repo and push
        (bump the version first so returning visitors see it again).
      </p>

      {/* Slides */}
      <div className="space-y-4">
        {cfg.slides.map((s, i) => (
          <div key={s.id} className="rounded-xl bg-black/20 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-white/40">SLIDE {i + 1}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30" title="Move up">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === cfg.slides.length - 1} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30" title="Move down">
                  <ArrowDown size={14} />
                </button>
                <button onClick={() => removeSlide(i)} className="p-1.5 rounded-md bg-red-500/30 hover:bg-red-500/50 text-red-100" title="Delete slide">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-[auto_1fr] gap-4">
              {/* Live mini preview */}
              <div
                className="rounded-lg w-full sm:w-40 h-32 flex flex-col items-center justify-center text-center p-3 shadow-inner"
                style={{ backgroundImage: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
              >
                <div className="text-4xl leading-none">{s.emoji}</div>
                <div className="text-white font-display text-sm mt-1 leading-tight line-clamp-2">{s.title}</div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-20">
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Emoji</label>
                    <input
                      value={s.emoji}
                      onChange={(e) => updateSlide(i, { emoji: e.target.value })}
                      className="w-full px-2 py-2 text-center text-xl rounded-lg bg-white/10 border border-white/15 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Title</label>
                    <input
                      value={s.title}
                      onChange={(e) => updateSlide(i, { title: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 ${t.ring}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {QUICK_EMOJI.map((em) => (
                    <button
                      key={em}
                      onClick={() => updateSlide(i, { emoji: em })}
                      className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/15 text-base leading-none"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Subtitle</label>
                  <input
                    value={s.subtitle}
                    onChange={(e) => updateSlide(i, { subtitle: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 ${t.ring}`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/50">Color</span>
                  {GRADIENT_PRESETS.map((p) => {
                    const active = p.from === s.from && p.to === s.to;
                    return (
                      <button
                        key={p.name}
                        onClick={() => updateSlide(i, { from: p.from, to: p.to })}
                        title={p.name}
                        className={`h-7 w-7 rounded-md transition-transform ${active ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"}`}
                        style={{ backgroundImage: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                      />
                    );
                  })}
                  <input type="color" value={s.from} onChange={(e) => updateSlide(i, { from: e.target.value })} className="h-7 w-7 rounded-md bg-transparent border border-white/15 cursor-pointer" title="Custom start color" />
                  <input type="color" value={s.to} onChange={(e) => updateSlide(i, { to: e.target.value })} className="h-7 w-7 rounded-md bg-transparent border border-white/15 cursor-pointer" title="Custom end color" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-white/50">Duration</span>
                  <input
                    type="range"
                    min={1200}
                    max={8000}
                    step={200}
                    value={s.durationMs}
                    onChange={(e) => updateSlide(i, { durationMs: Number(e.target.value) })}
                    className="flex-1 accent-white"
                  />
                  <span className="text-xs text-white/60 tabular-nums w-10 text-right">{(s.durationMs / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSlide}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white py-3 text-sm font-semibold transition-colors"
      >
        <Plus size={16} /> Add slide
      </button>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button onClick={handleSaveDraft} className={`inline-flex items-center gap-2 ${t.accent} hover:brightness-110 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all`}>
          <Save size={15} /> Save draft
        </button>
        <button onClick={handleCopy} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Copy size={15} /> Copy JSON
        </button>
        <button onClick={handleDownload} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Download size={15} /> Download trailer.json
        </button>
        <button onClick={handleRearm} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <RotateCcw size={15} /> Re-arm intro
        </button>
        <button onClick={handleReset} className="inline-flex items-center gap-2 text-white/50 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors">
          Reset
        </button>
      </div>

      {flash && (
        <div className="mt-3 inline-flex items-center gap-2 text-sm text-green-200 bg-green-500/15 border border-green-500/25 rounded-lg px-3 py-2">
          <Check size={15} /> {flash}
        </div>
      )}

      {/* Full preview overlay */}
      {previewing && <Trailer config={cfg} onClose={() => setPreviewing(false)} />}
    </section>
  );
}
