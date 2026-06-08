import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, Pencil, Plus, X, LogOut, Save, PartyPopper } from "lucide-react";
import { FIREWORKS_EVENT } from "../components/Fireworks";
import {
  listCustomGames, listSuggestions, deleteSuggestion,
  saveCustomGame, deleteCustomGame,
  type CustomGame, type Suggestion,
} from "../lib/supabase";
import { ICON_OPTIONS, type IconName } from "../lib/games";
import { THEMES, getTheme } from "../lib/themes";
import { useSettings } from "../lib/useSettings";

const ICON_NAMES = Object.keys(ICON_OPTIONS) as IconName[];

const COLOR_OPTIONS = [
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
  "bg-red-500 hover:bg-red-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-green-500 hover:bg-green-600",
  "bg-teal-500 hover:bg-teal-600",
  "bg-cyan-500 hover:bg-cyan-600",
  "bg-blue-500 hover:bg-blue-600",
];

type Draft = { id?: string; name: string; url: string; icon: IconName; color: string };
const EMPTY: Draft = { name: "", url: "", icon: "Gamepad2", color: COLOR_OPTIONS[0] };

export default function Admin() {
  const { theme, adminUnlocked, setAdminUnlocked } = useSettings();
  const t = getTheme(theme);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [games, setGames] = useState<CustomGame[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const [s, g] = await Promise.all([listSuggestions(), listCustomGames()]);
    setSuggestions(s);
    setGames(g);
  };

  useEffect(() => {
    if (adminUnlocked) refresh();
  }, [adminUnlocked]);

  const sortedSuggestions = useMemo(
    () => [...suggestions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    [suggestions]
  );

  if (!adminUnlocked) return <Navigate to="/" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.url.trim()) return;
    setSaving(true);
    const ok = await saveCustomGame(draft);
    setSaving(false);
    if (ok) {
      setDraft(EMPTY);
      window.dispatchEvent(new Event("gamesUpdated"));
      refresh();
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Delete this game?")) return;
    if (await deleteCustomGame(id)) {
      window.dispatchEvent(new Event("gamesUpdated"));
      refresh();
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    if (await deleteSuggestion(id)) refresh();
  };

  const handlePromoteSuggestion = (s: Suggestion) => {
    setDraft({ name: s.gameName, url: s.gameUrl, icon: "Gamepad2", color: COLOR_OPTIONS[0] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Icon = ICON_OPTIONS[draft.icon];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight flex items-center gap-3">
            <span aria-hidden>🔐</span> Admin
          </h1>
          <p className="mt-2 text-white/60 text-sm">
            Active theme: <span className="text-white">{THEMES.find((th) => th.value === theme)?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event(FIREWORKS_EVENT))}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider ${t.accent} hover:brightness-110 text-white transition-all`}
          >
            <PartyPopper size={14} /> Preview fireworks
          </button>
          <button
            onClick={() => {
              setAdminUnlocked(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 transition-colors"
          >
            <LogOut size={14} /> Lock
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add / edit game */}
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {draft.id ? <><Pencil size={18} /> Edit game</> : <><Plus size={18} /> Add custom game</>}
            {draft.id && (
              <button
                onClick={() => setDraft(EMPTY)}
                className="ml-auto text-xs text-white/50 hover:text-white inline-flex items-center gap-1"
              >
                <X size={12} /> Cancel
              </button>
            )}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Name</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                required
                className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 ${t.ring}`}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5">URL</label>
              <input
                type="url"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                required
                className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 ${t.ring}`}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Icon</label>
              <div className="grid grid-cols-9 gap-1.5">
                {ICON_NAMES.map((n) => {
                  const I = ICON_OPTIONS[n];
                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setDraft({ ...draft, icon: n })}
                      className={`aspect-square grid place-items-center rounded-lg border transition-all ${
                        draft.icon === n
                          ? "bg-white text-black border-white"
                          : "bg-white/5 border-white/10 hover:bg-white/15"
                      }`}
                      title={n}
                    >
                      <I size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setDraft({ ...draft, color: c })}
                    className={`${c.split(" ")[0]} h-8 w-8 rounded-lg transition-all ${
                      draft.color === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-white/50 mb-2">Preview</div>
              <div className={`${draft.color} rounded-xl p-5 inline-flex flex-col items-center justify-center gap-2 text-white shadow-lg aspect-square w-32`}>
                <Icon size={36} strokeWidth={1.6} />
                <span className="text-sm font-semibold text-center">{draft.name || "Game name"}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full inline-flex items-center justify-center gap-2 ${t.accent} hover:brightness-110 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition-all`}
            >
              <Save size={16} />
              {saving ? "Saving..." : draft.id ? "Update game" : "Add game"}
            </button>
          </form>
        </section>

        {/* Suggestions */}
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Review suggestions <span className="text-white/40 text-sm font-normal">({sortedSuggestions.length})</span>
          </h2>
          {sortedSuggestions.length === 0 ? (
            <p className="text-sm text-white/40">No suggestions yet.</p>
          ) : (
            <ul className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
              {sortedSuggestions.map((s) => (
                <li
                  key={s.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{s.gameName}</div>
                      <a
                        href={s.gameUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/50 hover:text-white truncate block"
                      >
                        {s.gameUrl}
                      </a>
                      <div className="text-[10px] text-white/40 mt-1">
                        {new Date(s.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handlePromoteSuggestion(s)}
                        className="p-1.5 rounded-md bg-white/10 hover:bg-white/20"
                        title="Use in form"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSuggestion(s.id)}
                        className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/40 text-red-200"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Custom games list */}
      <section className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Custom games <span className="text-white/40 text-sm font-normal">({games.length})</span>
        </h2>
        {games.length === 0 ? (
          <p className="text-sm text-white/40">No custom games yet — add one above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {games.map((g) => {
              const I = ICON_OPTIONS[(g.icon as IconName) ?? "Gamepad2"] ?? ICON_OPTIONS.Gamepad2;
              return (
                <div key={g.id} className="relative group">
                  <div className={`${g.color || "bg-slate-600"} rounded-xl p-5 aspect-square text-white flex flex-col items-center justify-center gap-2 shadow-lg`}>
                    <I size={36} strokeWidth={1.6} />
                    <span className="text-xs font-semibold text-center truncate w-full">{g.name}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setDraft({
                          id: g.id,
                          name: g.name,
                          url: g.url,
                          icon: (g.icon as IconName) ?? "Gamepad2",
                          color: g.color,
                        })
                      }
                      className="p-2 rounded-md bg-white/20 hover:bg-white/30"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGame(g.id)}
                      className="p-2 rounded-md bg-red-500/40 hover:bg-red-500/60"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
