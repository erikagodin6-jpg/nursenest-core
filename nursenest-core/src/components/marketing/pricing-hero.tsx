import Link from "next/link";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

export function PricingHero({
  studySystemHref,
  ctaLabel = "Start your 3-day free trial",
  trialSubtext = "No charge today. Cancel anytime before your trial ends.",
  trialFinePrint = "Billing begins automatically after 3 days unless cancelled.",
  pricesShownLine = "All prices are shown in Canadian dollars.",
}: {
  studySystemHref: string;
  ctaLabel?: string;
  trialSubtext?: string;
  trialFinePrint?: string;
  /** Region-aware checkout currency hint (marketing pricing only). */
  pricesShownLine?: string;
}) {
  return (
    <section
      data-testid="pricing-marketing-hero"
      className="nn-gradient-safe relative overflow-hidden rounded-3xl px-6 pt-14 pb-16 text-center sm:px-14 sm:pt-16 sm:pb-20"
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
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--semantic-success) 22%, var(--semantic-border-soft))",
            color: "var(--semantic-text-secondary)",
          }}
        >
          {pricesShownLine}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
        <p className="mt-1 text-[11px] text-muted-foreground">
          {trialFinePrint}
        </p>
      </div>
    </section>
  );
}
