"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Inner() {
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sp.get("checkout") === "success") setOpen(true);
  }, [sp]);

  if (!open) return null;

  return (
    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
      <p className="font-semibold">You are in—welcome to full access.</p>
      <p className="mt-1 text-emerald-900/90">
        Billing confirmed. Jump into your question bank or start a mock exam while your session refreshes entitlements.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white" href="/app/questions">
          Open question bank
        </Link>
        <Link className="rounded-full border border-emerald-700/40 px-3 py-1.5 text-xs font-semibold text-emerald-900" href="/app/exams">
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
