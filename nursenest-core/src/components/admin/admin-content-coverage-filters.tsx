"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";

const COUNTRIES = [
  { value: "ALL", label: "All countries" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
] as const;

const TIERS = [
  { value: "ALL", label: "All tiers" },
  { value: "RPN", label: "RPN" },
  { value: "LVN_LPN", label: "LVN / LPN" },
  { value: "RN", label: "RN" },
  { value: "NP", label: "NP" },
  { value: "ALLIED", label: "Allied" },
] as const;

const EXAM_OPTIONS = (() => {
  const keys = new Set<string>();
  for (const p of EXAM_PATHWAYS) for (const k of p.contentExamKeys) keys.add(k);
  const sorted = [...keys].sort((a, b) => a.localeCompare(b));
  return [{ value: "ALL", label: "All exams (keys)" }, ...sorted.map((k) => ({ value: k, label: k }))];
})();

export function AdminContentCoverageFilters({
  country,
  tier,
  exam,
  bodySystem,
}: {
  country: string;
  tier: string;
  exam: string;
  bodySystem: string;
}) {
  const router = useRouter();

  const defaults = useMemo(
    () => ({ country: country || "ALL", tier: tier || "ALL", exam: exam || "ALL", bodySystem: bodySystem || "" }),
    [country, tier, exam, bodySystem],
  );

  const onChange = useCallback(
    (next: Partial<{ country: string; tier: string; exam: string; bodySystem: string }>) => {
      const params = new URLSearchParams();
      const c = next.country ?? defaults.country;
      const t = next.tier ?? defaults.tier;
      const e = next.exam ?? defaults.exam;
      const bs = next.bodySystem !== undefined ? next.bodySystem : defaults.bodySystem;
      if (c && c !== "ALL") params.set("country", c);
      if (t && t !== "ALL") params.set("tier", t);
      if (e && e !== "ALL") params.set("exam", e);
      if (bs.trim()) params.set("bodySystem", bs.trim());
      const q = params.toString();
      router.push(q ? `/admin/content-coverage?${q}` : "/admin/content-coverage");
    },
    [defaults, router],
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
        Country
        <select
          className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-foreground"
          value={defaults.country}
          onChange={(ev) => onChange({ country: ev.target.value })}
        >
          {COUNTRIES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
        Tier
        <select
          className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-foreground"
          value={defaults.tier}
          onChange={(ev) => onChange({ tier: ev.target.value })}
        >
          {TIERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
        Exam (content key)
        <select
          className="min-w-[10rem] rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-foreground"
          value={EXAM_OPTIONS.some((o) => o.value === defaults.exam) ? defaults.exam : "ALL"}
          onChange={(ev) => onChange({ exam: ev.target.value })}
        >
          {EXAM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-muted-foreground">
        Body system
        <input
          type="text"
          className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-foreground"
          placeholder="e.g. Cardiovascular"
          value={defaults.bodySystem}
          onChange={(ev) => onChange({ bodySystem: ev.target.value })}
        />
      </label>
      <button
        type="button"
        className="mt-5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted/50"
        onClick={() => router.push("/admin/content-coverage")}
      >
        Reset filters
      </button>
    </div>
  );
}
