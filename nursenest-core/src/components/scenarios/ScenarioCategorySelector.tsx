"use client";

import type { PathwayBodySystemGroup } from "@/lib/learner-study-hub/body-system-data";

export function ScenarioCategorySelector({
  groups,
  value,
  onChange,
  label = "Clinical area",
}: {
  groups: PathwayBodySystemGroup[];
  value: string | null;
  onChange: (next: string | null) => void;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="nn-scenario-category" className="text-sm font-medium text-[var(--semantic-text-primary)]">
        {label}
      </label>
      <select
        id="nn-scenario-category"
        className="w-full max-w-md rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--semantic-text-primary)]"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v.length ? v : null);
        }}
      >
        <option value="">All areas (canonical buckets)</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.label}
          </option>
        ))}
      </select>
    </div>
  );
}
