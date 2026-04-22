import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { buildPricingFaqJsonLdItems } from "@/lib/marketing/pricing-faq-jsonld";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";

/** Default `/pricing`: plans stream without waiting on FAQ / shard loads in the parent page. */
export async function PricingMarketingPlansRscDefault({
  initialSearchParamsString,
}: {
  initialSearchParamsString: string;
}) {
  const locale = await getMarketingLocaleForDefaultRoute();
  return (
    <MarketingPricingPage locale={locale} initialSearchParamsString={initialSearchParamsString} />
  );
}

/** `/{locale}/pricing`: locale is already resolved from `params` in the parent page. */
export async function PricingMarketingPlansRscLocalized({
  locale,
  initialSearchParamsString,
}: {
  locale: string;
  initialSearchParamsString: string;
}) {
  return (
    <MarketingPricingPage locale={locale} initialSearchParamsString={initialSearchParamsString} />
  );
}

/** SEO + FAQ JSON-LD + breadcrumbs for default-locale `/pricing` (deferred behind plans). */
export async function PricingDeferredSeoDefault() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m =
    (await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS)) ?? {};
  const mLocale =
    locale === DEFAULT_MARKETING_LOCALE ? m : await loadMarketingLayoutShardsOverlay(locale);
  const { schemaItems } = marketingPricingBreadcrumbs();
  const pricingFaqJsonLd = buildPricingFaqJsonLdItems(mLocale);
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: "/pricing",
          title: m["pages.pricing.title"],
          description: m["pages.pricing.description"],
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pricingFaqJsonLd} />
    </>
  );
}

/** SEO + FAQ JSON-LD + breadcrumbs for `/{locale}/pricing` (deferred behind plans). */
export async function PricingDeferredSeoLocalized({ locale }: { locale: string }) {
  const raw = marketingPricingBreadcrumbs();
  const messages = await loadMarketingLayoutShardsOverlay(locale);
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, messages);
  const pricingFaqJsonLd = buildPricingFaqJsonLdItems(messages);
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/pricing",
          title: messages["pages.pricing.title"],
          description: messages["pages.pricing.description"],
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pricingFaqJsonLd} />
      <div className="mx-auto max-w-6xl px-4 pb-1 pt-1 sm:px-6 sm:pb-2 sm:pt-2 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
    </>
  );
}
