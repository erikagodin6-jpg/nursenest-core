"use client";

import type { TimeSeriesPoint } from "@/lib/admin/load-admin-command-center";

export function AdminSimpleBarChart({
  title,
  subtitle,
  points,
  accentClass,
}: {
  title: string;
  subtitle?: string;
  points: TimeSeriesPoint[];
  accentClass?: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h3>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-4 flex h-36 items-end gap-0.5 sm:gap-1" role="img" aria-label={title}>
        {points.map((p) => {
          const h = Math.round((p.value / max) * 100);
          return (
            <div key={p.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div
                className={`w-full max-w-[14px] rounded-t-sm ${accentClass ?? "bg-primary/80"}`}
                style={{ height: `${Math.max(4, h)}%` }}
                title={`${p.label}: ${p.value}`}
              />
              <span className="hidden text-[9px] text-muted-foreground sm:block">{p.label.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
