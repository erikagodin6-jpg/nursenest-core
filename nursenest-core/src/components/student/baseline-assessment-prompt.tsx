"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useState } from "react";

export function BaselineAssessmentPrompt({ show }: { show: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const onSkip = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/learner/baseline-assessment/skip", { method: "POST" });
      if (!res.ok) return;
      setDismissed(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [router]);

  if (!show || dismissed || pathname === "/app/baseline-assessment") {
    return null;
  }

  return (
    <section
      className="nn-card mb-6 border border-primary/20 bg-primary/[0.06] p-5 shadow-sm"
      aria-labelledby="baseline-prompt-heading"
    >
      <h2 id="baseline-prompt-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
        Find your starting point
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--theme-body-text)]">
        Take a short baseline quiz (about 10 questions). It helps personalize your study plan and weak-area signals—no pressure, and you
        can skip anytime.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/app/baseline-assessment"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          Take quick baseline (recommended)
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onSkip()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-muted/50 disabled:opacity-60"
        >
          Skip for now
        </button>
      </div>
    </section>
  );
}
