"use client";

import { useMemo, useState, useTransition } from "react";
import type { BetaFeatureKey } from "@prisma/client";
import { BETA_FEATURE_LABELS } from "@/lib/beta/beta-feature-options";

type FeedbackState = "idle" | "sent" | "error";

export function BetaFeedbackButton({ features }: { features: BetaFeatureKey[] }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FeedbackState>("idle");
  const [pending, startTransition] = useTransition();
  const visibleFeatures = useMemo(() => (features.length ? features : ["FLASHCARDS_V2" as BetaFeatureKey]), [features]);

  function submit(formData: FormData) {
    setState("idle");
    startTransition(async () => {
      try {
        const res = await fetch("/api/beta/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feature: formData.get("feature"),
            kind: formData.get("kind"),
            rating: Number(formData.get("rating") || 0) || null,
            summary: formData.get("summary"),
            details: formData.get("details"),
            pageUrl: window.location.href,
            browser: navigator.userAgent,
          }),
        });
        if (!res.ok) throw new Error("feedback_failed");
        setState("sent");
        setOpen(false);
      } catch {
        setState("error");
      }
    });
  }

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Beta feedback</p>
          <p className="mt-1 text-sm text-muted-foreground">Report bugs, rate feature quality, or suggest improvements while testing.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[44px] rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          Send feedback
        </button>
      </div>
      {state === "sent" ? <p className="mt-3 text-sm font-semibold text-emerald-700">Feedback sent. Thank you for testing.</p> : null}
      {state === "error" ? <p className="mt-3 text-sm font-semibold text-red-700">Feedback could not be sent. Please try again.</p> : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-[var(--theme-card-bg)] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Beta feedback</h2>
                <p className="mt-1 text-sm text-muted-foreground">Tie your feedback to the specific preview you tested.</p>
              </div>
              <button type="button" className="rounded-xl border border-border px-3 py-2 text-sm font-bold" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <form action={submit} className="mt-5 grid gap-4">
              <label className="grid gap-1 text-sm font-semibold">
                Feature
                <select name="feature" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {visibleFeatures.map((feature) => (
                    <option key={feature} value={feature}>
                      {BETA_FEATURE_LABELS[feature] ?? feature}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold">
                  Type
                  <select name="kind" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <option value="BUG">Bug</option>
                    <option value="SUGGESTION">Suggestion</option>
                    <option value="QUALITY_RATING">Quality rating</option>
                    <option value="GENERAL">General</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  Rating
                  <select name="rating" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="">
                    <option value="">Not rated</option>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Strong</option>
                    <option value="3">3 - Needs polish</option>
                    <option value="2">2 - Difficult to use</option>
                    <option value="1">1 - Blocking issue</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-1 text-sm font-semibold">
                Summary
                <input name="summary" required maxLength={500} className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Details
                <textarea name="details" rows={5} className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
              <button disabled={pending} className="min-h-[44px] rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60" type="submit">
                {pending ? "Sending..." : "Submit feedback"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
