import { useEffect, useState } from "react";
import { GraduationCap, PartyPopper } from "lucide-react";
import { getTheme } from "../lib/themes";
import { cornerClass, useSettings } from "../lib/useSettings";

// Last day of school — Thursday, June 18, 2026 at 11:15 AM (user's local time).
const TARGET = new Date(2026, 5, 18, 11, 15, 0);

type Diff = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function diffTo(date: Date): Diff {
  const ms = date.getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 1000 / 60) % 60;
  const hours = Math.floor(ms / 1000 / 60 / 60) % 24;
  const days = Math.floor(ms / 1000 / 60 / 60 / 24);
  return { days, hours, minutes, seconds, done: false };
}

const TARGET_LABEL = TARGET.toLocaleString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function SchoolCountdown() {
  const { theme, corners } = useSettings();
  const t = getTheme(theme);
  const corner = cornerClass(corners);
  const [now, setNow] = useState<Diff>(() => diffTo(TARGET));

  useEffect(() => {
    const id = setInterval(() => setNow(diffTo(TARGET)), 1000);
    return () => clearInterval(id);
  }, []);

  if (now.done) {
    return (
      <div className={`${corner} ${t.accent} text-white px-5 py-4 flex items-center gap-3 shadow-lg`}>
        <PartyPopper size={22} />
        <div>
          <div className="font-display text-xl tracking-tight">SCHOOL'S OUT!</div>
          <div className="text-xs opacity-80">Hope you had a good year. Now go play something.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${corner} bg-white/10 backdrop-blur-sm border border-white/15 px-5 py-4`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`${t.accent} ${corner === "rounded-md" ? "rounded-md" : "rounded-lg"} p-2 text-white inline-flex shadow-md`}>
          <GraduationCap size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight">Last day of school</div>
          <div className="text-xs text-white/60 leading-tight">{TARGET_LABEL}</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <TimeUnit value={now.days} label="days" />
        <TimeUnit value={now.hours} label="hours" />
        <TimeUnit value={now.minutes} label="min" />
        <TimeUnit value={now.seconds} label="sec" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-black/30 rounded-lg py-2">
      <div className="font-display text-2xl sm:text-3xl tabular-nums leading-none">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{label}</div>
    </div>
  );
}
