import type { Metadata } from "next";
import { NewGradMarketingLanding } from "@/components/marketing/new-grad-marketing-landing";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { absoluteUrl } from "@/lib/seo/site-origin";

const PATH = CANADA_NEW_GRAD_MARKETING_HUB_PATH;

export const metadata: Metadata = {
  title: "New graduate nurses | Canada | NurseNest",
  description:
    "Canadian new graduate nursing hub: clinical work-area readiness and transition-to-practice study entry — without routing you into the generic RN marketing home by default.",
  alternates: { canonical: absoluteUrl(PATH) },
};

export default function CanadaNewGradPage() {
  const study = publicNewGradStudyDestinations("CA", CANONICAL_PATHWAY_HUB.caRn);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Canada", href: "/canada" },
    { name: "New Grad", href: PATH },
  ];
  const schemaItems = crumbs.map((c) => ({ name: c.name, item: absoluteUrl(c.href) }));

  return (
    <div className="nn-marketing-surface mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <WebPageJsonLd
        title="New graduate nurses | Canada | NurseNest"
        description="Canadian New Grad transition hub with clinical work-area cards and pathway-aligned study entry."
        path={PATH}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <NewGradMarketingLanding shell="canada" study={study} />
    </div>
  );
}
