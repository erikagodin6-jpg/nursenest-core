import type { ReactNode } from "react";

export type StatusPillIntent = "success" | "warning" | "danger" | "info";

const INTENT_CLASS: Record<StatusPillIntent, string> = {
  success: "nn-badge-semantic-success",
  warning: "nn-badge-semantic-warning",
  danger: "nn-badge-semantic-danger",
  info: "nn-badge-semantic-info",
};

/** Semantic status chip — maps to global `.nn-badge-semantic-*` (theme + lavender/mint/blush overrides). */
export function StatusPill({ intent, children }: { intent: StatusPillIntent; children: ReactNode }) {
  return <span className={INTENT_CLASS[intent]}>{children}</span>;
}
