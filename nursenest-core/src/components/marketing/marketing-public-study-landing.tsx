import Link from "next/link";
import type { ReactNode } from "react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

export type MarketingPublicStudyCta = {
  href: string;
  label: string;
};

type MarketingPublicStudyLandingProps = {
  h1: string;
  intro: string;
  primaryCta: MarketingPublicStudyCta;
  secondaryCta?: MarketingPublicStudyCta;
  signupCta?: MarketingPublicStudyCta;
  children?: ReactNode;
};

/**
 * Public marketing landing (no login) for ads: exam + product + audience above the fold.
 */
export function MarketingPublicStudyLanding({
  h1,
  intro,
  primaryCta,
  secondaryCta,
  signupCta,
  children,
}: MarketingPublicStudyLandingProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page pb-16">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] p-5 sm:p-6">
        <div className="nn-stack-hero-heading">
          <h1 className="text-3xl font-extrabold text-[var(--theme-heading-text)] text-balance">{h1}</h1>
          <p className="text-[var(--theme-muted-text)] text-pretty sm:text-base">{intro}</p>
        </div>
        <div className="nn-hero-cta-row mt-[var(--nn-rhythm-text-to-cta)] flex-wrap">
          <Link href={primaryCta.href} className={MARKETING_PRIMARY_CTA_CLASS}>
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className={MARKETING_SECONDARY_CTA_CLASS}>
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
        {signupCta ? (
          <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
            <Link href={signupCta.href} className="font-semibold text-primary hover:underline">
              {signupCta.label}
            </Link>
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
