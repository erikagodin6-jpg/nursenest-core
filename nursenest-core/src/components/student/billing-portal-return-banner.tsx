"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function Inner() {
  const sp = useSearchParams();
  const { update } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sp.get("portal") !== "return") return;
    setOpen(true);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/sync-session", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          tier?: string;
          country?: string;
          subscriptionStatus?: string;
        };
        await update({
          tier: data.tier,
          country: data.country,
          subscriptionStatus: data.subscriptionStatus,
        });
      } catch {
        /* Session still valid; entitlements use DB */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sp, update]);

  if (!open) return null;

  return (
    <div className="mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] px-4 py-3 text-sm text-[var(--semantic-info-contrast)] shadow-[var(--semantic-shadow-soft)]">
      <p className="font-semibold">Billing updated</p>
      <p className="mt-1 opacity-90">
        Any changes you made in Stripe will take effect shortly. Your subscription status has been refreshed.
      </p>
      <button
        type="button"
        className="mt-2 text-xs font-medium underline"
        onClick={() => setOpen(false)}
      >
        Dismiss
      </button>
    </div>
  );
}

export function BillingPortalReturnBanner() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
