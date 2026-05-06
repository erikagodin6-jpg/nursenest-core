import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { getCanonicalAlliedPathway, ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-pathway";
import { loadAlliedPathwayHubOverview } from "@/lib/marketing/allied-pathway-hub-overview";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const pathway = getCanonicalAlliedPathway();
      if (!pathway) return {};
      return {
        title: "Allied Health | NurseNest",
        description: "Global Allied Health pathway with occupation-based study routes, paid/free study entry points, and unit switching.",
        alternates: { canonical: absoluteUrl(ALLIED_GLOBAL_HUB_PATH) },
        openGraph: {
          title: "Allied Health | NurseNest",
          description: "Global Allied Health pathway with occupation-based study routes, paid/free study entry points, and unit switching.",
          url: absoluteUrl(ALLIED_GLOBAL_HUB_PATH),
          type: "website",
        },
      };
    },
    { pathname: ALLIED_GLOBAL_HUB_PATH, routeGroup: "marketing.default.allied.global_hub" },
  );
}

export default async function GlobalAlliedHealthHubPage() {
  const pathway = getCanonicalAlliedPathway();
  if (!pathway) notFound();

  const overview = await loadAlliedPathwayHubOverview(pathway, {
    pathname: ALLIED_GLOBAL_HUB_PATH,
    locale: "en",
    examCode: "allied-health",
    roleTrack: "allied",
  });

  if (process.env.NODE_ENV !== "production" || process.env.VITEST === "true") {
    safeServerLog("exam_pathway_hub", "allied_hub_route_diagnostic", {
      pathname: ALLIED_GLOBAL_HUB_PATH,
      country: "global",
      role_track: "allied",
      pathway_id: pathway.id,
      exam_slug: "allied-health",
      loader_result: JSON.stringify({
        lessonCount: overview.lessonCount,
        questionSnapshotStatus: overview.questionSnapshot.status,
        flashcardDeckCount: overview.flashcardDeckCount,
        moduleCardCount: overview.moduleCards.length,
      }),
    });
  }

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Allied Health", href: ALLIED_GLOBAL_HUB_PATH },
  ];
  const schemaItems = crumbs.map((item) => ({ name: item.name, item: absoluteUrl(item.href) }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <WebPageJsonLd
        title="Allied Health | NurseNest"
        description="Global Allied Health pathway with occupation-based study routes, paid/free study entry points, and unit switching."
        path={ALLIED_GLOBAL_HUB_PATH}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <AlliedHealthPathwayHub pathway={pathway} hubPath={ALLIED_GLOBAL_HUB_PATH} overview={overview} />
    </div>
  );
}
