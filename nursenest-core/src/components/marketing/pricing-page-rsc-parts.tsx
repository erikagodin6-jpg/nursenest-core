import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { buildPricingFaqJsonLdItems } from "@/lib/marketing/pricing-faq-jsonld";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { localizeBreadcrumbResolutionForLocale } from "@/lib/seo/breadcrumb-i18n";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

function logPricingRscFailure(surface: string, error: unknown) {
  safeServerLog("billing", "marketing_pricing_rsc_fallback", {
    surface,
    name: error instanceof Error ? error.name : typeof error,
    detail: error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500),
  });
}

function PricingServerFallback() {
  const plans = [
    {
      name: "RN",
      description: "NCLEX-RN preparation with adaptive practice and readiness tracking.",
      href: "/signup?tier=RN",
    },
    {
      name: "RPN / PN",
      description: "Practical nursing exam prep for Canadian and U.S. pathways.",
      href: "/signup?tier=RPN",
    },
    {
      name: "NP",
      description: "Nurse practitioner readiness for clinical reasoning and licensing prep.",
      href: "/signup?tier=NP",
    },
  ];

  return (
    <section className="nn-pricing-premium-root px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="nn-marketing-caption font-semibold uppercase tracking-[0.12em] text-[var(--theme-primary)]">
            Pricing
          </p>
          <h1 className="nn-marketing-h1 mt-3">Choose the NurseNest plan that fits your exam path</h1>
          <p className="nn-marketing-body mt-4 text-[var(--theme-muted-text)]">
            Select a pathway to continue. Checkout and account setup remain available while we refresh the
            full pricing table.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <a
              key={plan.name}
              href={plan.href}
              className="block rounded-[8px] border border-[var(--theme-separator)] bg-[var(--theme-card-bg)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="nn-marketing-h3">{plan.name}</h2>
              <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">{plan.description}</p>
              <span className="nn-marketing-body-sm mt-6 inline-flex font-semibold text-[var(--theme-primary)]">
                Continue
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Default `/pricing`: plans stream without waiting on FAQ / shard loads in the parent page. */
export async function PricingMarketingPlansRscDefault({
  initialSearchParamsString,
}: {
  initialSearchParamsString: string;
}) {
  try {
    const locale = await getMarketingLocaleForDefaultRoute();
    return (
      <MarketingPricingPage locale={locale} initialSearchParamsString={initialSearchParamsString} />
    );
  } catch (error) {
    logPricingRscFailure("default", error);
    return <PricingServerFallback />;
  }
}

/** `/{locale}/pricing`: locale is already resolved from `params` in the parent page. */
export async function PricingMarketingPlansRscLocalized({
  locale,
  initialSearchParamsString,
}: {
  locale: string;
  initialSearchParamsString: string;
}) {
  try {
    return (
      <MarketingPricingPage locale={locale} initialSearchParamsString={initialSearchParamsString} />
    );
  } catch (error) {
    logPricingRscFailure("localized", error);
    return <PricingServerFallback />;
  }
}

/** SEO + FAQ JSON-LD + breadcrumbs for default-locale `/pricing` (deferred behind plans). */
export async function PricingDeferredSeoDefault() {
  try {
    const locale = await getMarketingLocaleForDefaultRoute();
    const m =
      (await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS)) ?? {};
    const mLocale =
      locale === DEFAULT_MARKETING_LOCALE ? m : await loadMarketingLayoutShardsOverlay(locale);
    const { schemaItems } = marketingPricingBreadcrumbs();
    const pricingFaqJsonLd = buildPricingFaqJsonLdItems(mLocale);
    return (
      <>
        <BreadcrumbJsonLd items={schemaItems} />
        <FaqJsonLd items={pricingFaqJsonLd} />
      </>
    );
  } catch (error) {
    logPricingRscFailure("default_seo", error);
    return null;
  }
}

/** SEO + FAQ JSON-LD + breadcrumbs for `/{locale}/pricing` (deferred behind plans). */
export async function PricingDeferredSeoLocalized({ locale }: { locale: string }) {
  try {
    const raw = marketingPricingBreadcrumbs();
    const messages = await loadMarketingLayoutShardsOverlay(locale);
    const { crumbs, schemaItems } = localizeBreadcrumbResolutionForLocale(raw, messages, locale);
    const pricingFaqJsonLd = buildPricingFaqJsonLdItems(messages);
    return (
      <>
        <BreadcrumbJsonLd items={schemaItems} />
        <FaqJsonLd items={pricingFaqJsonLd} />
        <div className="mx-auto max-w-6xl px-4 pb-1 pt-1 sm:px-6 sm:pb-2 sm:pt-2 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      </>
    );
  } catch (error) {
    logPricingRscFailure("localized_seo", error);
    return null;
  }
}
