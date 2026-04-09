"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function Inner() {
  const sp = useSearchParams();
  const { update } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sp.get("checkout") !== "success") return;
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
        /* JWT still valid; server routes use DB entitlements */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sp, update]);

  if (!open) return null;

  return (
    <div className="mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-4 py-3 text-sm text-[var(--semantic-success-contrast)] shadow-[var(--semantic-shadow-soft)]">
      <p className="font-semibold">You are in. Welcome to full access.</p>
      <p className="mt-1 text-[color-mix(in_srgb,var(--semantic-success-contrast)_92%,var(--semantic-text-primary))]">
        Billing confirmed. Jump into your question bank or start a mock exam while your session refreshes entitlements.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          className="rounded-full bg-[var(--semantic-success)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95"
          href="/app/questions"
        >
          Open question bank
        </Link>
        <Link
          className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_42%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-success-contrast)] hover:bg-[var(--semantic-panel-positive)]"
          href="/app/exams"
        >
          Practice exams
        </Link>
        <button type="button" className="text-xs underline" onClick={() => setOpen(false)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function CheckoutSuccessBanner() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
