import Link from "next/link";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

/**
 * PricingHero — top of the pricing page (spec §3).
 *
 * Title, one-line subtitle, two CTAs.
 * Surface: theme-aware emphasis gradient — uses CSS custom properties.
 * No paragraphs. No filler copy.
 */
export function PricingHero({ studySystemHref }: { studySystemHref: string }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12 sm:py-20"
      style={{
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--theme-primary) 8%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--theme-primary) 3%, var(--semantic-surface)) 100%)",
        borderBottom: "1px solid var(--semantic-border-soft)",
      }}
    >
      {/* Decorative radial glow — purely presentational */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--theme-primary) 14%, transparent), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-2xl">
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            background: "color-mix(in srgb, var(--theme-primary) 10%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--theme-primary) 22%, var(--semantic-border-soft))",
            color: "var(--semantic-text-muted)",
          }}
        >
          NurseNest Premium
        </p>

        <h1 className="nn-marketing-h1 text-balance">
          Get Fully Exam-Ready with NurseNest
        </h1>

        <p className="nn-marketing-body mt-4 text-pretty text-muted-foreground">
          Adaptive study plans, smart review, and exam-level testing built for real results.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="#pricing-plans-heading" className={MARKETING_PRIMARY_CTA_CLASS}>
            Start your plan
          </Link>
          <Link href={studySystemHref} className={MARKETING_SECONDARY_CTA_CLASS}>
            View study system
          </Link>
        </div>
      </div>
    </section>
  );
}
