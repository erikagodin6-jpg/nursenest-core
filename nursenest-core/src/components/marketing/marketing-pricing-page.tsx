import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { PricingPageErrorBoundary } from "@/components/marketing/pricing-page-error-boundary";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingPricingPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const en = locale !== DEFAULT_MARKETING_LOCALE ? await loadMarketingMessages(DEFAULT_MARKETING_LOCALE) : undefined;
  const heading = resolveMarketingCopy(
    m,
    "pages.pricing.h1",
    en,
    "Know exactly what to study before your exam",
  );
  const intro = resolveMarketingCopy(
    m,
    "pages.pricing.intro",
    en,
    "Pathway-aligned practice, lessons, and timed exams in one place. Pick your exam track and choose a plan that matches your timeline.",
  );
  const heroSub = resolveMarketingCopy(
    m,
    "pages.pricing.hero.subheadMain",
    en,
    "Train with exam-style questions, UWorld-level rationale structure, weak-area targeting, flashcards, and readiness guidance that tells you exactly what to do next.",
  );
  return (
    <PricingPageErrorBoundary>
      <PricingPageClient heading={heading} intro={intro} heroSub={heroSub} />
    </PricingPageErrorBoundary>
  );
}
