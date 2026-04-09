import type { ReadinessBand } from "@/lib/learner/readiness-score";
import type { TopicStrength } from "@/lib/learner/weak-topics-from-sessions";

/** Pill styles aligned with `semantic-status-tokens.css` — use for readiness band labels (dashboard, hero). */
export function readinessBandChipClass(band: ReadinessBand): string {
  switch (band) {
    case "insufficient_data":
      return "inline-flex items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]";
    case "not_ready":
      return "nn-badge-semantic-danger";
    case "improving":
      return "nn-badge-semantic-warning";
    case "near_ready":
      return "nn-badge-semantic-info";
    case "ready":
      return "nn-badge-semantic-success";
    default:
      return "inline-flex items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]";
  }
}

/** Topic ledger strength — matches dashboard mastery semantics (multi-hue, not monochrome). */
export function topicStrengthChipClass(strength: TopicStrength): string {
  switch (strength) {
    case "strong":
      return "nn-badge-semantic-success";
    case "weak":
      return "nn-badge-semantic-danger";
    default:
      return "nn-badge-semantic-info";
  }
}
