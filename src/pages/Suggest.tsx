import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, ExternalLink, Gamepad2 } from "lucide-react";
import { getTheme } from "../lib/themes";
import { useSettings } from "../lib/useSettings";
import { listSuggestions, submitSuggestion, type Suggestion } from "../lib/supabase";

export default function Suggest() {
  const { theme } = useSettings();
  const t = getTheme(theme);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    listSuggestions().then((s) => {
      setSuggestions(
        s.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      );
      setLoading(false);
    });

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    setSubmitting(true);
    const ok = await submitSuggestion(name, url);
    setSubmitting(false);
    if (ok) {
      setName("");
      setUrl("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      refresh();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">Suggest a Game</h1>
        <p className="mt-3 text-white/60">Think we're missing a banger? Drop the link below.</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 sm:p-8 space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-sm text-white/70 mb-2">
            Game name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Geometry Dash"
            required
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 ${t.ring}`}
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm text-white/70 mb-2">
            Game URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/game"
            required
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 ${t.ring}`}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full inline-flex items-center justify-center gap-2 ${t.accent} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-semibold transition-all`}
        >
          {submitting ? "Sending..." : (<><Send size={16} /> Send Suggestion</>)}
        </button>

        {sent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 mt-2 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200"
          >
            <CheckCircle2 size={18} /> Thanks — your suggestion is in.
          </motion.div>
        )}
      </motion.form>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Recent suggestions</h2>
        {loading ? (
          <p className="text-white/40 text-sm">Loading...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-white/40 text-sm">No suggestions yet. Be the first!</p>
        ) : (
          <ul className="space-y-2">
            {suggestions.slice(0, 10).map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Gamepad2 size={20} className="text-white/50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.gameName}</div>
                  <a
                    href={s.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-white truncate flex items-center gap-1"
                  >
                    {s.gameUrl} <ExternalLink size={11} />
                  </a>
                </div>
                <span className="text-xs text-white/40 flex-shrink-0">
                  {new Date(s.submittedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
