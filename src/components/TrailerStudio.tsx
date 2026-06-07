import { useRef, useState } from "react";
import { Play, Copy, Download, Save, RotateCcw, Check, Clapperboard, FolderOpen } from "lucide-react";
import { getTheme } from "../lib/themes";
import { useSettings } from "../lib/useSettings";
import Trailer from "./Trailer";
import {
  DEFAULT_TRAILER, loadDraft, rearmTrailer, saveDraft, trailerToJson,
  type TrailerConfig,
} from "../lib/trailer";

export default function TrailerStudio() {
  const { theme } = useSettings();
  const t = getTheme(theme);

  const [cfg, setCfg] = useState<TrailerConfig>(() => loadDraft() ?? DEFAULT_TRAILER);
  // previewSrc lets the admin test a locally-picked file without saving it.
  const [previewCfg, setPreviewCfg] = useState<TrailerConfig | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ping = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };
  const update = (patch: Partial<TrailerConfig>) => setCfg((c) => ({ ...c, ...patch }));

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
  const handleRearm = () => {
    rearmTrailer();
    ping("Re-armed — reload to see it auto-play");
  };

  const previewLocalFile = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    setPreviewCfg({ ...cfg, enabled: true, videoUrl: blobUrl });
  };

  return (
    <section className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clapperboard size={18} /> Trailer
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
              title="Increase this to re-show the trailer to people who already saw it"
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
        </div>
      </div>

      <p className="text-xs text-white/50 mb-5 leading-relaxed">
        The intro is a single MP4 that first-time visitors see once. Point it at a video below,
        then <strong className="text-white/70">Preview</strong> to test it.
        To publish to everyone: save your video as <code className="text-white/70">public/trailer.mp4</code>
        {" "}(or paste a hosted URL), <strong className="text-white/70">Download trailer.json</strong> into{" "}
        <code className="text-white/70">public/</code>, bump the version, and push.
      </p>

      {/* Video URL */}
      <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Video URL</label>
      <div className="flex flex-wrap gap-2">
        <input
          value={cfg.videoUrl}
          onChange={(e) => update({ videoUrl: e.target.value })}
          placeholder="trailer.mp4  or  https://…/intro.mp4"
          className={`flex-1 min-w-[16rem] px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 ${t.ring}`}
        />
        <button
          onClick={() => update({ videoUrl: "trailer.mp4" })}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
          title="Use a file saved as public/trailer.mp4"
        >
          Use trailer.mp4
        </button>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPreviewCfg({ ...cfg, enabled: true })}
          disabled={!cfg.videoUrl}
          className={`inline-flex items-center gap-2 ${t.accent} hover:brightness-110 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all`}
        >
          <Play size={15} /> Preview
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          title="Test a video from your computer (preview only — doesn't publish it)"
        >
          <FolderOpen size={15} /> Preview a local file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) previewLocalFile(f);
            e.target.value = "";
          }}
        />
        <span className="mx-1 w-px h-6 bg-white/10" />
        <button onClick={handleSaveDraft} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
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
      </div>

      {flash && (
        <div className="mt-3 inline-flex items-center gap-2 text-sm text-green-200 bg-green-500/15 border border-green-500/25 rounded-lg px-3 py-2">
          <Check size={15} /> {flash}
        </div>
      )}

      {previewCfg && <Trailer config={previewCfg} onClose={() => setPreviewCfg(null)} />}
    </section>
  );
}
