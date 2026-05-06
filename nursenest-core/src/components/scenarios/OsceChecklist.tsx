"use client";

import { useState } from "react";

export type OsceChecklistItem = { id: string; label: string };

export function OsceChecklist({
  title = "Checklist",
  items,
}: {
  title?: string;
  items: OsceChecklistItem[];
}) {
  const [done, setDone] = useState<Set<string>>(() => new Set());

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-3)]">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((row) => {
          const checked = done.has(row.id);
          return (
            <li key={row.id}>
              <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--semantic-text-primary)]">
                <input
                  type="checkbox"
                  checked={checked}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--semantic-border-soft)]"
                  onChange={() => {
                    setDone((prev) => {
                      const next = new Set(prev);
                      if (next.has(row.id)) next.delete(row.id);
                      else next.add(row.id);
                      return next;
                    });
                  }}
                />
                <span>{row.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
