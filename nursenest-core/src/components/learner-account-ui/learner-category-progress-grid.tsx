import type { ReactNode } from "react";

export type LearnerCategoryProgressItem = {
  id: string;
  label: string;
  /** Count of topic / attempt signals mapped into this canonical category (relative bars only). */
  count: number;
};

const FILL_ROTATE = [
  "nn-progress-fill-semantic-success",
  "nn-progress-fill-semantic-info",
  "nn-progress-fill-semantic-warning",
  "nn-progress-fill-semantic-readiness",
] as const;

export function LearnerCategoryProgressGrid({
  items,
  emptyHint,
}: {
  items: LearnerCategoryProgressItem[];
  emptyHint?: ReactNode;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const any = items.some((i) => i.count > 0);

  if (!any) {
    return (
      <div
        className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground"
        data-nn-learner-category-progress-empty
      >
        {emptyHint ?? "No pathway activity bucketed into these categories yet."}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-nn-learner-category-progress-grid>
      {items.map((row, idx) => {
        const w = Math.round((row.count / max) * 100);
        const fill = FILL_ROTATE[idx % FILL_ROTATE.length]!;
        return (
          <div
            key={row.id}
            className="rounded-xl border border-border bg-card p-3 text-left shadow-sm"
            data-nn-learner-category-progress-item={row.id}
          >
            <p className="text-xs font-semibold text-foreground">{row.label}</p>
            <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">{row.count} mapped topics</p>
            <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2" aria-hidden>
              <div className={`h-full rounded-full ${fill}`} style={{ width: `${w}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
