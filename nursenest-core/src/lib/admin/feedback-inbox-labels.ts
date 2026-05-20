import type { UserFeedbackCategory, UserFeedbackSeverity, UserFeedbackStatus } from "@prisma/client";

export function labelCategory(c: UserFeedbackCategory): string {
  return c.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
}

export function labelStatus(s: UserFeedbackStatus): string {
  return s.replace(/_/g, " ");
}

/** Tailwind-friendly surface classes for status chips (theme-aware neutrals + semantic accents). */
export function statusChipClass(s: UserFeedbackStatus): string {
  switch (s) {
    case "NEW":
      return "border-sky-500/35 bg-sky-500/10 text-sky-900 dark:text-sky-100";
    case "UNDER_REVIEW":
      return "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100";
    case "FIXED":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100";
    case "DISMISSED":
      return "border-border bg-muted/60 text-muted-foreground";
    default:
      return "border-border bg-muted/40 text-foreground";
  }
}

export function severityChipClass(sev: UserFeedbackSeverity): string {
  switch (sev) {
    case "CRITICAL":
      return "border-rose-500/45 bg-rose-500/10 text-rose-950 dark:text-rose-100";
    case "HIGH":
      return "border-orange-500/40 bg-orange-500/10 text-orange-950 dark:text-orange-100";
    case "MEDIUM":
      return "border-cyan-500/35 bg-cyan-500/10 text-cyan-950 dark:text-cyan-100";
    case "LOW":
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
}
