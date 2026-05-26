import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SIZE, DEFAULT_THEME, type ButtonSize } from "./themes";

export type Corners = "sharp" | "rounded" | "soft";
export type Pattern = "solid" | "grid" | "dots";

type Settings = {
  theme: string;
  size: ButtonSize;
  adminUnlocked: boolean;
  corners: Corners;
  pattern: Pattern;
  reduceMotion: boolean;
  showMascot: boolean;
};

function readSettings(): Settings {
  if (typeof window === "undefined") {
    return {
      theme: DEFAULT_THEME, size: DEFAULT_SIZE, adminUnlocked: false,
      corners: "rounded", pattern: "solid", reduceMotion: false, showMascot: true,
    };
  }
  return {
    theme: localStorage.getItem("siteTheme") || DEFAULT_THEME,
    size: (localStorage.getItem("buttonSize") as ButtonSize) || DEFAULT_SIZE,
    adminUnlocked: localStorage.getItem("adminUnlocked") === "true",
    corners: (localStorage.getItem("tileCorners") as Corners) || "rounded",
    pattern: (localStorage.getItem("bgPattern") as Pattern) || "solid",
    reduceMotion: localStorage.getItem("reduceMotion") === "true",
    // showMascot defaults to true; only stored when user opts out
    showMascot: localStorage.getItem("showMascot") !== "false",
  };
}

const bump = () => window.dispatchEvent(new Event("settingsUpdated"));

/**
 * Single source of truth for user settings. Stores everything in localStorage
 * and broadcasts `settingsUpdated` so all mounted hooks rerender in lockstep.
 */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => readSettings());

  useEffect(() => {
    const handler = () => setSettings(readSettings());
    window.addEventListener("settingsUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("settingsUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setTheme = useCallback((value: string) => {
    localStorage.setItem("siteTheme", value);
    bump();
  }, []);

  const setSize = useCallback((value: ButtonSize) => {
    localStorage.setItem("buttonSize", value);
    bump();
  }, []);

  const setAdminUnlocked = useCallback((value: boolean) => {
    if (value) localStorage.setItem("adminUnlocked", "true");
    else localStorage.removeItem("adminUnlocked");
    bump();
  }, []);

  const setCorners = useCallback((value: Corners) => {
    localStorage.setItem("tileCorners", value);
    bump();
  }, []);

  const setPattern = useCallback((value: Pattern) => {
    localStorage.setItem("bgPattern", value);
    bump();
  }, []);

  const setReduceMotion = useCallback((value: boolean) => {
    if (value) localStorage.setItem("reduceMotion", "true");
    else localStorage.removeItem("reduceMotion");
    bump();
  }, []);

  const setShowMascot = useCallback((value: boolean) => {
    if (!value) localStorage.setItem("showMascot", "false");
    else localStorage.removeItem("showMascot");
    bump();
  }, []);

  return {
    ...settings,
    setTheme,
    setSize,
    setAdminUnlocked,
    setCorners,
    setPattern,
    setReduceMotion,
    setShowMascot,
  };
}

// Helpers consumed by visual components ---------------------------------------

export function cornerClass(corners: Corners): string {
  return corners === "sharp" ? "rounded-md" : corners === "soft" ? "rounded-3xl" : "rounded-2xl";
}

export function patternBgStyle(pattern: Pattern): React.CSSProperties {
  if (pattern === "grid") {
    return {
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    };
  }
  if (pattern === "dots") {
    return {
      backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    };
  }
  return {};
}
