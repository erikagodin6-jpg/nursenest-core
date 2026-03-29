/**
 * Canonical NurseNest brand default. All surfaces use this unless the user selects another theme.
 * Must stay aligned with `data-theme="lavender"` in theme CSS.
 */
export const NURSENEST_DEFAULT_THEME = "lavender" as const;

export type ThemeGroup = "light" | "dark";

export type ThemeOption = {
  id: string;
  label: string;
  color: string;
  group: ThemeGroup;
};

/** Mirrors legacy `client/src/components/navigation.tsx` theme list for visual parity. */
export const THEME_OPTIONS: ThemeOption[] = [
  { id: "lavender", label: "Lavender", color: "#9d82dd", group: "light" },
  { id: "mint", label: "Mint", color: "#5ed3ae", group: "light" },
  { id: "blush", label: "Blush", color: "#f4909f", group: "light" },
  { id: "slate", label: "Slate", color: "#64748b", group: "light" },
  { id: "midnight", label: "Midnight", color: "#1e293b", group: "light" },
  { id: "ocean", label: "Ocean", color: "#0ea5e9", group: "light" },
  { id: "forest", label: "Forest", color: "#10b981", group: "light" },
  { id: "clinical-light", label: "Clinical", color: "#3b82f6", group: "light" },
  { id: "pastel-blush", label: "Pastel Blush", color: "#ec8899", group: "light" },
  { id: "pastel-lavender", label: "Pastel Lavender", color: "#a78bda", group: "light" },
  { id: "pastel-mint", label: "Pastel Mint", color: "#4fd1a5", group: "light" },
  { id: "pastel-lilac", label: "Pastel Lilac", color: "#b48ed2", group: "light" },
  { id: "lavender-dream", label: "Lavender Dream", color: "#8e7cc3", group: "light" },
  { id: "soft-sage", label: "Soft Sage", color: "#7da87d", group: "light" },
  { id: "neutral-sand", label: "Sand", color: "#a08060", group: "light" },
  { id: "neutral-slate", label: "Cool Slate", color: "#708090", group: "light" },
  { id: "rose-gold", label: "Rose Gold", color: "#b76e79", group: "light" },
  { id: "coral", label: "Coral", color: "#ff6b6b", group: "light" },
  { id: "indigo", label: "Indigo", color: "#6366f1", group: "light" },
  { id: "teal", label: "Teal", color: "#14b8a6", group: "light" },
  { id: "berry", label: "Berry", color: "#a855f7", group: "light" },
  { id: "dark-mode", label: "Dark Mode", color: "#818cf8", group: "dark" },
  { id: "dark-clinical", label: "Dark Clinical", color: "#06b6d4", group: "dark" },
  { id: "dark-academia", label: "Dark Academia", color: "#8b7355", group: "dark" },
];

export const THEME_STORAGE_KEY = "nursenest-theme";
