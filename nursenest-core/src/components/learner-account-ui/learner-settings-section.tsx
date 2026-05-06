import type { ReactNode } from "react";

export function LearnerSettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-settings-section
    >
      <div className="border-b border-border bg-muted/25 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
