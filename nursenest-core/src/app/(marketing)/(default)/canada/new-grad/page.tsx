import type { Metadata } from "next";
import { NewGradMarketingLanding } from "@/components/marketing/new-grad-marketing-landing";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { absoluteUrl } from "@/lib/seo/site-origin";

const PATH = CANADA_NEW_GRAD_MARKETING_HUB_PATH;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessageShards(
    DEFAULT_MARKETING_LOCALE,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const title =
    messages["newGrad.marketing.landing.seoTitleCanada"] ?? "New graduate nurses | Canada | NurseNest";
  const description =
    messages["newGrad.marketing.landing.seoDescriptionCanada"] ??
    "Canadian new graduate nursing hub: clinical work-area readiness and transition-to-practice study entry — without routing you into the generic RN marketing home by default.";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(PATH) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(PATH),
      type: "website",
    },
  };
}

export default async function CanadaNewGradPage() {
  const messages = await loadMarketingMessageShards(
    DEFAULT_MARKETING_LOCALE,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const jsonTitle =
    messages["newGrad.marketing.landing.seoTitleCanada"] ?? "New graduate nurses | Canada | NurseNest";
  const jsonDesc =
    messages["newGrad.marketing.landing.seoDescriptionCanada"] ??
    "Canadian New Grad transition hub with clinical work-area cards and pathway-aligned study entry.";
  const study = publicNewGradStudyDestinations("CA", CANONICAL_PATHWAY_HUB.caRn);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Canada", href: "/canada" },
    { name: "New Grad", href: PATH },
  ];
  const schemaItems = crumbs.map((c) => ({ name: c.name, item: absoluteUrl(c.href) }));

  return (
    <div className="nn-marketing-surface mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <WebPageJsonLd title={jsonTitle} description={jsonDesc} path={PATH} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <NewGradMarketingLanding shell="canada" study={study} />
    </div>
  );
}
