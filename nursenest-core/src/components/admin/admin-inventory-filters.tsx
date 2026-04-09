"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

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

export function AdminInventoryFilters({
  country,
  tier,
}: {
  country: string;
  tier: string;
}) {
  const router = useRouter();

  const onChange = useCallback(
    (next: { country?: string; tier?: string }) => {
      const params = new URLSearchParams();
      const c = next.country ?? country;
      const t = next.tier ?? tier;
      if (c && c !== "ALL") params.set("country", c);
      if (t && t !== "ALL") params.set("tier", t);
      const q = params.toString();
      router.push(q ? `/admin/inventory?${q}` : "/admin/inventory");
    },
    [country, tier, router],
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
        Country
        <select
          className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-foreground"
          value={country || "ALL"}
          onChange={(e) => onChange({ country: e.target.value })}
        >
          {COUNTRIES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
        Profession / tier
        <select
          className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-foreground"
          value={tier || "ALL"}
          onChange={(e) => onChange({ tier: e.target.value })}
        >
          {TIERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
