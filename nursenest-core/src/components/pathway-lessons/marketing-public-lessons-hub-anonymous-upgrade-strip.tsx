import Link from "next/link";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

type Props = {
  marketingUiLocale: string;
  /** Post-login return path (absolute path on this site). */
  signupCallbackPath: string;
};

/**
 * Single mid-page upgrade nudge for anonymous visitors on public lesson hubs.
 * Keeps copy calm and avoids duplicating header/footer CTAs.
 */
export function MarketingPublicLessonsHubAnonymousUpgradeStrip({
  marketingUiLocale,
  signupCallbackPath,
}: Props) {
  const signupHref = `${withMarketingLocale(marketingUiLocale, HUB.signup)}?callbackUrl=${encodeURIComponent(signupCallbackPath)}`;
  const pricingHref = withMarketingLocale(marketingUiLocale, HUB.pricing);

  return (
    <aside
      data-nn-qa-public-hub-upgrade-strip
      className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_16%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
    >
      <h2 className="nn-marketing-h3 text-balance text-[var(--theme-heading-text)]">Study with full access</h2>
      <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--theme-muted-text)]">
        Create a free NurseNest account to save progress, unlock premium lessons where your plan allows, and pick up
        exactly where you left off on any device.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={signupHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-success)] px-5 py-2 text-sm font-semibold text-[var(--text-on-dark)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-success)_35%,transparent)]"
        >
          Create a free account
        </Link>
        <Link
          href={pricingHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
        >
          View plans
        </Link>
      </div>
    </aside>
  );
}
