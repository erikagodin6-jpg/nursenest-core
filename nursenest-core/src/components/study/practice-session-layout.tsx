import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * PracticeSessionLayout — outer viewport-height container for the practice session.
 *
 * On desktop (≥1024px): takes up `calc(100dvh - 120px)`, preventing the main
 * page from scrolling. Inner columns scroll independently via overflow-y: auto.
 *
 * On mobile: normal flow; vertical scrolling allowed as per spec §11.
 */
export function PracticeSessionLayout({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">) {
  return (
    <div className={`nn-practice-session ${className ?? ""}`.trim()} {...rest}>
      {children}
    </div>
  );
}

/**
 * PracticeTopBar — compact header above the content grid (spec §3).
 *
 * Shows "Question X of Y" on the left, an optional right label, and a
 * 6px progress bar underneath.
 */
export function PracticeTopBar({
  examName,
  current,
  total,
  rightLabel,
  /** e.g. session theme control — renders right of the title row */
  trailingSlot,
  progressPct,
  saving,
  labels,
}: {
  examName?: string | null;
  current: number;
  total: number;
  rightLabel?: string | null;
  trailingSlot?: React.ReactNode;
  progressPct: number;
  saving?: boolean;
  labels?: {
    question?: string;
    of?: string;
    saving?: string;
    progressAria?: string;
  };
}) {
  const questionLabel = labels?.question ?? "Question";
  const ofLabel = labels?.of ?? "of";
  const savingLabel = labels?.saving ?? "Saving...";
  const progressAria =
    labels?.progressAria ?? `${examName ?? "Exam"} progress: question ${current} of ${total}`;
  return (
    <div className="nn-practice-top-bar">
      <div className="nn-practice-top-bar__row">
        <div className="nn-practice-top-bar__left-stack">
          {examName ? <p className="nn-practice-top-bar__exam-name">{examName}</p> : null}
          <p className="nn-practice-top-bar__left">
            {questionLabel}{" "}
            <span className="tabular-nums">{current}</span>{" "}
            {ofLabel} <span className="tabular-nums">{total}</span>
            {saving ? (
              <span className="ml-2 text-xs font-normal text-[var(--semantic-text-muted)]">
                · {savingLabel}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-2">
          {trailingSlot}
          {rightLabel ? <p className="nn-practice-top-bar__right">{rightLabel}</p> : null}
        </div>
      </div>
      <div
        className="nn-practice-top-bar__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
        aria-label={progressAria}
      >
        <div
          className="nn-practice-top-bar__progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * PracticeSessionGrid — 60/40 content grid.
 *
 * Accepts exactly two children: left (question) and right (rationale).
 * On desktop, both scroll independently within the fixed-height layout.
 */
export function PracticeSessionGrid({ children }: { children: ReactNode }) {
  return <div className="nn-practice-session-grid">{children}</div>;
}
