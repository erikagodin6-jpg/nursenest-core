import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function LearnerStudyModeCard({
  title,
  description,
  selected,
  onSelect,
  icon: Icon,
  badge,
  disabled,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  icon?: LucideIcon;
  badge?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-active={selected}
      onClick={onSelect}
      className={[
        "flex min-h-[5.5rem] flex-col rounded-2xl border p-4 text-left transition",
        "border-border bg-card text-foreground shadow-sm",
        "hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-muted/40",
        "data-[active=true]:border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))]",
        "data-[active=true]:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,hsl(var(--card)))]",
        "data-[active=true]:ring-1 data-[active=true]:ring-[color-mix(in_srgb,var(--semantic-brand)_22%,transparent)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-study-mode-card
    >
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-[var(--semantic-brand)]">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold leading-snug">{title}</span>
            {badge ? <span className="text-[10px] font-semibold uppercase text-muted-foreground">{badge}</span> : null}
          </div>
          {description ? <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
        </div>
      </div>
    </button>
  );
}
