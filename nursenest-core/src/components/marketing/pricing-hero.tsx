import Link from "next/link";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

export function PricingHero({
  studySystemHref,
  ctaLabel = "Start Free Trial",
  trialSubtext = "No charge today. Cancel anytime before your trial ends.",
}: {
  studySystemHref: string;
  ctaLabel?: string;
  trialSubtext?: string;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-12 sm:py-24"
      style={{
        background: `
          linear-gradient(
            168deg,
            color-mix(in srgb, var(--semantic-panel-cool) 60%, var(--semantic-surface)) 0%,
            color-mix(in srgb, var(--theme-primary) 6%, var(--semantic-surface)) 40%,
            color-mix(in srgb, var(--semantic-panel-warm) 30%, var(--semantic-surface)) 100%
          )`,
        borderBottom: "1px solid var(--semantic-border-soft)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 30% 0%, color-mix(in srgb, var(--semantic-info) 10%, transparent), transparent),
            radial-gradient(ellipse 40% 40% at 80% 100%, color-mix(in srgb, var(--theme-primary) 8%, transparent), transparent)
          `,
        }}
      />

      <div className="relative mx-auto max-w-2xl">
        <p
          className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
          style={{
            background: "color-mix(in srgb, var(--theme-primary) 10%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--theme-primary) 22%, var(--semantic-border-soft))",
            color: "var(--semantic-text-muted)",
          }}
        >
          Trusted by Nursing and Allied Health Students
        </p>

        <h1 className="nn-marketing-h1 text-balance">
          Pass Your Exam With a Smarter Study System
        </h1>

        <p className="nn-marketing-body mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
          Know what to study, track your progress, and build confidence with
          a structured plan designed for your exam
        </p>

        <p
          className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
          style={{
            background: "color-mix(in srgb, var(--semantic-success) 8%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--semantic-success) 20%, var(--semantic-border-soft))",
            color: "var(--semantic-text-secondary)",
          }}
        >
          All Prices Are Shown in Canadian Dollars
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="#pricing-plans-heading" className={MARKETING_PRIMARY_CTA_CLASS}>
            {ctaLabel}
          </Link>
          <Link href="#pricing-plans-heading" className={MARKETING_SECONDARY_CTA_CLASS}>
            View Plans
          </Link>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {trialSubtext}
        </p>
      </div>
    </section>
  );
}
