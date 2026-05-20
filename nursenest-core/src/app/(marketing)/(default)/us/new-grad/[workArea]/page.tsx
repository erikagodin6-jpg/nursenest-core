import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewGradWorkAreaHub } from "@/components/marketing/new-grad-work-area-hub";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import {
  fallbackAlliedPathwayHubOverview,
  loadAlliedPathwayHubOverview,
} from "@/lib/marketing/allied-pathway-hub-overview";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getNewGradWorkAreaBySlug, listNewGradWorkAreaSlugs } from "@/lib/new-grad/new-grad-work-areas";
import { US_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import {
  publicNewGradStudyDestinations,
  US_NEW_GRAD_TRANSITION_PATHWAY_ID,
} from "@/lib/navigation/marketing-pathway-nav-destinations";
import { newGradWorkAreaHubPath } from "@/lib/navigation/new-grad-marketing-hub-paths";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamicParams = false;

export function generateStaticParams(): { workArea: string }[] {
  return listNewGradWorkAreaSlugs().map((workArea) => ({ workArea }));
}

type Props = { params: Promise<{ workArea: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workArea } = await params;
  const def = getNewGradWorkAreaBySlug(workArea);
  const path = newGradWorkAreaHubPath("us", workArea);
  return safeGenerateMetadata(
    async () => {
      if (!def) return { title: "Not found" };
      return {
        title: `${def.title} | New Grad | NurseNest`,
        description: def.tagline,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: {
          title: `${def.title} | New Grad | NurseNest`,
          description: def.tagline,
          url: absoluteUrl(path),
          type: "website",
        },
      };
    },
    { pathname: path, routeGroup: "marketing.default.us.new_grad.work_area" },
  );
}

export default async function UsNewGradWorkAreaPage({ params }: Props) {
  const { workArea } = await params;
  const def = getNewGradWorkAreaBySlug(workArea);
  if (!def) notFound();

  const pathway = getExamPathwayById(US_NEW_GRAD_TRANSITION_PATHWAY_ID);
  if (!pathway) notFound();

  const hubPath = newGradWorkAreaHubPath("us", workArea);
  const study = publicNewGradStudyDestinations("US", CANONICAL_PATHWAY_HUB.usRn);

  let overview = null;
  try {
    overview = await loadAlliedPathwayHubOverview(pathway, {
      pathname: hubPath,
      locale: "en",
      examCode: pathway.examCode,
      roleTrack: pathway.roleTrack,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    safeServerLog("exam_pathway_hub", "new_grad_work_area_overview_failed", {
      pathname: hubPath,
      pathway_id: pathway.id,
      error_message: message.slice(0, 500),
    });
    overview = fallbackAlliedPathwayHubOverview();
  }

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "United States", href: "/us" },
    { name: "New Grad", href: US_NEW_GRAD_MARKETING_HUB_PATH },
    { name: def.title, href: undefined },
  ];
  const schemaItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "United States", item: absoluteUrl("/us") },
    { name: "New Grad", item: absoluteUrl(US_NEW_GRAD_MARKETING_HUB_PATH) },
    { name: def.title, item: absoluteUrl(hubPath) },
  ];

  return (
    <div className="nn-marketing-surface mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <WebPageJsonLd title={`${def.title} | New Grad | NurseNest`} description={def.tagline} path={hubPath} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <NewGradWorkAreaHub shell="us" definition={def} pathway={pathway} overview={overview} study={study} />
    </div>
  );
}
