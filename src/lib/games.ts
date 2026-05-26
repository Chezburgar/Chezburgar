import {
  Gamepad2, Rocket, Sword, Zap, Trophy, Flame, Skull,
  Sparkles, Crown, Wand2, Pizza, Music, Sun, Moon, Cat, Ghost,
  Plane, CarFront, type LucideIcon,
} from "lucide-react";

export type DefaultGame = {
  name: string;
  icon: LucideIcon;
  url: string;
};

// The default catalogue ships with the site; custom games come from Supabase.
export const DEFAULT_GAMES: DefaultGame[] = [
  { name: "Hollow Knight", icon: Trophy, url: "https://ubgone.github.io/Hollow-knight4school/" },
  { name: "Slope", icon: Ghost, url: "https://gamedump.github.io/slope/" },
  { name: "Subway Surfers", icon: Flame, url: "https://gitallgames.github.io/projects/subway-surfers-san-francisco/index.html" },
  { name: "Mario Kart DS", icon: Pizza, url: "https://mspoi.github.io/seraph/games/mariokartds/index.html" },
  { name: "Silksong", icon: Wand2, url: "https://chezburgar.github.io/hollow-knight-silksong/" },
  { name: "Super Smash Bros", icon: Gamepad2, url: "https://mspoi.github.io/seraph/games/supersmashbros/index.html" },
  { name: "Polytrack", icon: Zap, url: "https://polytrackmodded.github.io/" },
  { name: "Snow Rider 3D", icon: Plane, url: "https://gaming-escape.github.io/iframe?url=public/assets/games/snow-rider-3d/" },
  { name: "Crossy Road", icon: Music, url: "https://classroom8.github.io/crossy-road/" },
  { name: "BitLife", icon: Crown, url: "https://browlu27.github.io/gamessite.github.io/projects/bitlife/index.html" },
  { name: "Rocket Soccer", icon: Rocket, url: "https://stickmanclimb2.github.io/play/rocket-soccer-derby" },
  { name: "Jet Boy", icon: Rocket, url: "https://stickmanclimb2.github.io/play/jet-boy" },
  { name: "Gladihoppers", icon: Sword, url: "https://gaming-escape.github.io/public/assets/games/gladihoppers/index.html" },
  { name: "Armed Forces", icon: Skull, url: "https://gaming-escape.github.io/iframe?url=public/assets/games/armed-forces-io/" },
  { name: "Duck Life", icon: Cat, url: "https://guyotjs.github.io/flash/games/dlth.html" },
  // "Grade Melon" was removed from the grid — it now lives on its own /grades
  // route as an embedded iframe.
  { name: "KS2", icon: Sun, url: "https://gaming-escape.github.io/iframe?url=public/assets/games/ks-2-teams/" },
  { name: "YT Shorts", icon: Moon, url: "https://skipvids.com/shorts" },
];

// Icons exposed to the Admin "add a custom game" form.
export const ICON_OPTIONS = {
  Gamepad2, Rocket, Sword, Zap, Trophy, Flame, Skull, Sparkles, Crown,
  Wand2, Pizza, Music, Sun, Moon, Cat, Ghost, Plane, CarFront,
} as const;

export type IconName = keyof typeof ICON_OPTIONS;
