/**
 * PremiumExamPlanUpgradeCard
 *
 * Shown at the bottom of the Exam Plan page for free / limited-access users.
 * Calm, premium, aligned with dashboard tone — not a fear-based upsell.
 *
 * Body copy explains value (deeper planning, smart review, analytics, forecasting)
 * without manipulative language.
 */

import Link from "next/link";

export function PremiumExamPlanUpgradeCard() {
  return (
    <section
      aria-label="Upgrade to full exam plan"
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 6%, var(--bg-page))",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
      }}
    >
      <div className="max-w-2xl space-y-4">
        {/* Label */}
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Premium access
        </p>

        {/* Headline */}
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Unlock your full exam plan
        </h2>

        {/* Body */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
          Get deeper adaptive planning, full smart review, confidence analytics, readiness
          forecasting, advanced exam practice, and percentile benchmarking — everything you
          need to prepare with confidence.
        </p>

        {/* Feature list */}
        <ul className="space-y-1.5">
          {[
            "Daily adaptive study plan, updated as you improve",
            "Full smart review queue with priority scheduling",
            "Readiness score + pass readiness forecast",
            "Weak area targeting across all topics",
            "Confidence analytics and overconfident-error tracking",
            "Percentile benchmarking when enough data is available",
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
                  color: "var(--semantic-success)",
                }}
              >
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/pricing"
            className="inline-flex rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{
              background: "var(--semantic-brand)",
              color: "var(--semantic-surface)",
            }}
          >
            View plans
          </Link>
          <Link
            href="/app/questions"
            className="inline-flex rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              border: "1px solid var(--semantic-border-soft)",
              background: "color-mix(in srgb, var(--semantic-surface) 60%, transparent)",
              color: "var(--semantic-text-muted)",
            }}
          >
            Continue with free study
          </Link>
        </div>
      </div>
    </section>
  );
}
