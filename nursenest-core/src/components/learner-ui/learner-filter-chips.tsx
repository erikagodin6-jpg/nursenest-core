import Link from "next/link";
import type { ReactNode } from "react";

export type LearnerFilterChipItem = {
  id: string;
  label: ReactNode;
  href?: string;
  selected?: boolean;
  tone?: "default" | "supportive" | "danger";
};

/**
 * Pill filters for learner lists — token chips, optional links. Selection is data-driven (`selected`).
 */
export function LearnerFilterChips({
  items,
  "aria-label": ariaLabel,
}: {
  items: LearnerFilterChipItem[];
  "aria-label": string;
}) {
  return (
    <div className="nn-ls-chip-row" role="toolbar" aria-label={ariaLabel}>
      {items.map((it) => {
        const tone = it.tone && it.tone !== "default" ? it.tone : undefined;
        const cls = "nn-ls-chip";
        if (it.href) {
          return (
            <Link
              key={it.id}
              href={it.href}
              className={cls}
              data-selected={it.selected ? "true" : undefined}
              data-tone={tone}
              aria-current={it.selected ? "page" : undefined}
            >
              {it.label}
            </Link>
          );
        }
        return (
          <span key={it.id} className={cls} data-selected={it.selected ? "true" : undefined} data-tone={tone}>
            {it.label}
          </span>
        );
      })}
    </div>
  );
}
