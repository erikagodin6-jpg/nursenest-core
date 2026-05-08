import type { Metadata } from "next";
import { NewGradMarketingLanding } from "@/components/marketing/new-grad-marketing-landing";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { US_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";

const PATH = US_NEW_GRAD_MARKETING_HUB_PATH;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["newGrad.marketing.landing.seoTitle"] ?? "New Grad nursing | Clinical work areas | NurseNest";
  const description =
    messages["newGrad.marketing.landing.seoDescription"] ??
    "Transition-to-practice hub for first-year nurses: unit readiness, shift priorities, and study modes on the New Grad pathway — not the NCLEX-RN marketing default.";
  const ogDescription =
    messages["newGrad.marketing.landing.seoOgDescription"] ??
    "Choose a clinical work area for unit-specific readiness, then jump into New Grad lessons, flashcards, and practice questions.";

  return safeGenerateMetadata(
    async () => ({
      title,
      description,
      alternates: { canonical: absoluteUrl(PATH) },
      openGraph: {
        title,
        description: ogDescription,
        url: absoluteUrl(PATH),
        type: "website",
      },
    }),
    { pathname: PATH, routeGroup: "marketing.default.us.new_grad" },
  );
}

export default async function UsNewGradMarketingPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const jsonTitle =
    messages["newGrad.marketing.landing.seoTitle"] ?? "New Grad nursing | Clinical work areas | NurseNest";
  const jsonDesc =
    messages["newGrad.marketing.landing.seoDescription"] ??
    "US New Grad transition hub with clinical work-area cards and pathway-scoped study entry.";
  const study = publicNewGradStudyDestinations("US", CANONICAL_PATHWAY_HUB.usRn);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "United States", href: "/us" },
    { name: "New Grad", href: PATH },
  ];
  const schemaItems = crumbs.map((c) => ({ name: c.name, item: absoluteUrl(c.href) }));

  return (
    <div className="nn-marketing-surface mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <WebPageJsonLd title={jsonTitle} description={jsonDesc} path={PATH} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <NewGradMarketingLanding shell="us" study={study} />
    </div>
  );
}
