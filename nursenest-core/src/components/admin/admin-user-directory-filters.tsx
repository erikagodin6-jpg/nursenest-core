"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import type { TierCode } from "@prisma/client";

type Props = {
  initialPaid: string;
  initialPathway: string;
  initialTier: string;
  initialInactive: string;
  initialWeak: string;
};

const TIERS: TierCode[] = [
  "RN",
  "LVN_LPN",
  "NP",
  "RPN",
  "ALLIED",
  "PRE_NURSING",
  "NEW_GRAD",
];

export function AdminUserDirectoryFilters({ initialPaid, initialPathway, initialTier, initialInactive, initialWeak }: Props) {
  const router = useRouter();
  const [paid, setPaid] = useState(initialPaid);
  const [pathway, setPathway] = useState(initialPathway);
  const [tier, setTier] = useState(initialTier);
  const [inactive, setInactive] = useState(initialInactive);
  const [weak, setWeak] = useState(initialWeak);

  const pathwayOptions = useMemo(() => EXAM_PATHWAYS.map((p) => ({ id: p.id, label: p.displayName })), []);

  const apply = useCallback(() => {
    const sp = new URLSearchParams();
    if (paid && paid !== "all") sp.set("paid", paid);
    if (pathway.trim()) sp.set("pathway", pathway.trim());
    if (tier.trim()) sp.set("tier", tier.trim());
    if (inactive.trim()) sp.set("inactive", inactive.trim());
    if (weak === "1") sp.set("weak", "1");
    const q = sp.toString();
    router.push(q ? `/admin/users?${q}` : "/admin/users");
  }, [inactive, paid, pathway, router, tier, weak]);

  return (
    <div className="nn-card p-5">
      <h2 className="text-lg font-semibold">Browse learners (filtered)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Server-side filters with pagination. “Inactive” uses account <code className="rounded bg-muted px-1">updatedAt</code>{" "}
        as a lightweight proxy (not merged cross-table activity).
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Paid subscription</span>
          <select className="w-full rounded-md border border-border px-2 py-2" value={paid} onChange={(e) => setPaid(e.target.value)}>
            <option value="all">All</option>
            <option value="paid">Paid (ACTIVE / GRACE)</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Target pathway</span>
          <select
            className="w-full rounded-md border border-border px-2 py-2"
            value={pathway}
            onChange={(e) => setPathway(e.target.value)}
          >
            <option value="">Any</option>
            {pathwayOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Catalog tier code</span>
          <select className="w-full rounded-md border border-border px-2 py-2" value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="">Any</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Inactive (days, profile updatedAt)</span>
          <input
            className="w-full rounded-md border border-border px-2 py-2"
            inputMode="numeric"
            placeholder="e.g. 30"
            value={inactive}
            onChange={(e) => setInactive(e.target.value)}
          />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" checked={weak === "1"} onChange={(e) => setWeak(e.target.checked ? "1" : "")} />
          <span>Weak topic signal (topic stats)</span>
        </label>
        <div className="flex items-end">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => apply()}
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
