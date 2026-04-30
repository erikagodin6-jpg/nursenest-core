import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { formatTitleCase } from "@/lib/format/text-case";

/**
 * Category / body-system picker tile — semantic tokens for readable contrast in light + dark.
 */
export function LearnerCategoryCard({
  id,
  label,
  count,
  selected,
  onToggle,
  icon: Icon,
  accentVar,
}: {
  id: string;
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
  icon: LucideIcon;
  accentVar: string;
}) {
  const systemStyle = { "--nn-system-accent": `var(${accentVar})` } as CSSProperties;

  return (
    <button
      type="button"
      onClick={onToggle}
      data-selected={selected}
      data-nn-e2e-body-system-card={id}
      style={systemStyle}
      className="nn-lesson-system-card text-left transition hover:shadow-[var(--semantic-shadow-soft)] data-[selected=false]:opacity-[0.88] rounded-2xl border border-border bg-card p-3.5 text-foreground sm:p-4 data-[selected=true]:ring-2 data-[selected=true]:ring-[color-mix(in_srgb,var(--nn-system-accent)_40%,transparent)]"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 text-[var(--nn-system-accent)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{formatTitleCase(label)}</div>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {count} {count === 1 ? "item" : "items"} in pool
          </p>
        </div>
      </div>
    </button>
  );
}
