import Link from "next/link";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

/**
 * PricingHero: conversion-focused top of the pricing page.
 *
 * Headline leads with the outcome (passing), not the product.
 * Subheadline describes the system and builds confidence.
 * Two CTAs: primary scrolls to plans, secondary lets them explore.
 */
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
      className="relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12 sm:py-20"
      style={{
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--theme-primary) 8%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--theme-primary) 3%, var(--semantic-surface)) 100%)",
        borderBottom: "1px solid var(--semantic-border-soft)",
      }}
    >
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
          Used by nursing students preparing for NCLEX and REx-PN
        </p>

        <h1 className="nn-marketing-h1 text-balance">
          Pass Your Exam With a Smarter Study System
        </h1>

        <p className="nn-marketing-body mt-4 text-pretty text-muted-foreground">
          NurseNest tells you exactly what to study, tracks your weaknesses,
          and helps you know when you're ready, so you can pass with confidence.
        </p>

        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Designed to help you pass on your first attempt.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="#pricing-plans-heading" className={MARKETING_PRIMARY_CTA_CLASS}>
            {ctaLabel}
          </Link>
          <Link href={studySystemHref} className={MARKETING_SECONDARY_CTA_CLASS}>
            See How It Works
          </Link>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {trialSubtext}
        </p>
      </div>
    </section>
  );
}
