import type { ReactNode } from "react";

export function LearnerEmptyState({
  title,
  body,
  actions,
  tone = "muted",
  className,
}: {
  title: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  tone?: "muted" | "warning" | "danger";
  className?: string;
}) {
  const toneClass =
    tone === "warning"
      ? "border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--card))]"
      : tone === "danger"
        ? "border-destructive/30 bg-destructive/5"
        : "border-border bg-muted/20";

  return (
    <div
      className={["rounded-2xl border p-5 text-sm text-muted-foreground", toneClass, className].filter(Boolean).join(" ")}
      data-nn-learner-empty-state
    >
      <p className="font-semibold text-foreground">{title}</p>
      {body ? <div className="mt-2 leading-relaxed">{body}</div> : null}
      {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
