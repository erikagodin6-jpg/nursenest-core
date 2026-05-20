import type { ReactNode } from "react";

/**
 * Premium section title row: soft gradient band + bottom rule (token-only).
 */
export function LearnerSectionHeader({
  kicker,
  title,
  description,
  action,
  muted = false,
}: {
  /** Optional uppercase label — uses shared `nn-ls-kicker` from learner surface primitives. */
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Softer background (secondary sections) */
  muted?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-3 rounded-t-xl px-1 pb-3 pt-1 ${muted ? "nn-section-header-learner--muted" : "nn-section-header-learner"}`}
    >
      <div className="min-w-0">
        {kicker ? <p className="nn-ls-kicker">{kicker}</p> : null}
        <h2 className={`text-lg font-semibold text-[var(--semantic-text-primary)] ${kicker ? "mt-2" : ""}`}>{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
