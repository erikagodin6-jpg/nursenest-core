/**
 * RN theme tokens aligned with `nursenest-core/src/app/semantic-status-tokens.css` :root first-paint defaults.
 * Mobile does not load CSS variables; keep values in sync when marketing changes brand defaults.
 */
export const NurseNestColors = {
  semanticBgBase: "#fffcfd",
  semanticBgSoft: "#f4f2f8",
  semanticSurface: "#fffcfd",
  semanticSurfaceElevated: "#ffffff",
  semanticBorderSoft: "#bae6fd",
  semanticTextPrimary: "#0f172a",
  semanticTextSecondary: "#475569",
  semanticTextMuted: "#7b8fa3",
  semanticBrand: "#1da2d8",
  semanticBrandSoft: "#e8f7fc",
  semanticSuccess: "#16a34a",
  semanticWarning: "#d97706",
  semanticDanger: "#e11d48",
  semanticInfo: "#76b6c4",
  /** High-contrast label on `semanticBrand` fills (primary buttons). */
  semanticOnBrand: "#ffffff",
} as const;

export const NurseNestDarkColors = {
  semanticBgBase: "#0f172a",
  semanticBgSoft: "#111827",
  semanticSurface: "#111827",
  semanticSurfaceElevated: "#1e293b",
  semanticBorderSoft: "#334155",
  semanticTextPrimary: "#f8fafc",
  semanticTextSecondary: "#cbd5e1",
  semanticTextMuted: "#94a3b8",
  semanticBrand: "#38bdf8",
  semanticBrandSoft: "#0c4a6e",
  semanticSuccess: "#4ade80",
  semanticWarning: "#fbbf24",
  semanticDanger: "#fb7185",
  semanticInfo: "#7dd3fc",
  semanticOnBrand: "#ffffff",
} as const;

export type NurseNestPalette = typeof NurseNestColors;
