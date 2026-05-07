export const DASHBOARD_THEME_TOKENS = {
  surface: "--nn-surface",
  surfaceMuted: "--nn-surface-muted",
  surfaceElevated: "--nn-surface-elevated",
  border: "--nn-border",
  borderStrong: "--nn-border-strong",
  textPrimary: "--nn-text-primary",
  textMuted: "--nn-text-muted",
  accentPrimary: "--nn-accent-primary",
  accentSoft: "--nn-accent-soft",
  accentRing: "--nn-accent-ring",
  success: "--nn-success",
  warning: "--nn-warning",
  danger: "--nn-danger",
  info: "--nn-info",
  mastery: "--nn-mastery",
  study: "--nn-study",
  reinforce: "--nn-reinforce",
} as const;

export type DashboardThemeTokenKey = keyof typeof DASHBOARD_THEME_TOKENS;
