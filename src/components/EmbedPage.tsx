import { useState } from "react";
import { ExternalLink, Maximize2, RefreshCw } from "lucide-react";
import { getTheme } from "../lib/themes";
import { useSettings } from "../lib/useSettings";

type Props = {
  /** Page heading shown above the iframe. */
  title: string;
  /** URL to embed. */
  url: string;
  /** Unique id used to target the iframe for fullscreen + remount-on-reload. */
  frameId: string;
};

/**
 * Generic full-bleed iframe view used by /grades and /messages.
 * Wraps the iframe with a small toolbar (reload, fullscreen, open in new tab)
 * themed with the user's active accent colour.
 */
export default function EmbedPage({ title, url, frameId }: Props) {
  const { theme } = useSettings();
  const t = getTheme(theme);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);
  const openExternal = () => window.open(url, "_blank", "noopener,noreferrer");
  const openFullscreen = () => {
    const el = document.getElementById(frameId) as HTMLIFrameElement | null;
    el?.requestFullscreen?.();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 pb-10">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-tight">{title}</h1>
          <p className="text-xs text-white/50 mt-0.5">
            Live from {url.replace(/^https?:\/\//, "")}
          </p>
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
          id={frameId}
          key={reloadKey}
          src={url}
          title={title}
          className="w-full block"
          style={{ height: "calc(100vh - 220px)", minHeight: 600 }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
