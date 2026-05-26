import { useState } from "react";
import { ExternalLink, RefreshCw, Maximize2 } from "lucide-react";
import { getTheme } from "../lib/themes";
import { useSettings } from "../lib/useSettings";

const GRADES_URL = "https://chezburgar.github.io/Grade-melon-3/login";

export default function Grades() {
  const { theme } = useSettings();
  const t = getTheme(theme);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);
  const openExternal = () => window.open(GRADES_URL, "_blank", "noopener,noreferrer");
  const openFullscreen = () => {
    const el = document.getElementById("grades-frame") as HTMLIFrameElement | null;
    el?.requestFullscreen?.();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 pb-10">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-tight">Grades</h1>
          <p className="text-xs text-white/50 mt-0.5">Live from {GRADES_URL.replace(/^https?:\/\//, "")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reload}
            title="Reload"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openFullscreen}
            title="Fullscreen"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={openExternal}
            title="Open in new tab"
            className={`inline-flex items-center gap-2 ${t.accent} hover:brightness-110 text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all`}
          >
            <ExternalLink size={14} /> Open
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white border border-white/10 shadow-2xl">
        <iframe
          id="grades-frame"
          key={reloadKey}
          src={GRADES_URL}
          title="Grades"
          className="w-full block"
          style={{ height: "calc(100vh - 220px)", minHeight: 600 }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
