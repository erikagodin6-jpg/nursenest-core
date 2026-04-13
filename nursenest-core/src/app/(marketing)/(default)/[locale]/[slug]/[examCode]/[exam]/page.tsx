import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { getPathwayTopicProgrammaticRow } from "@/lib/seo/pathway-topic-programmatic-registry";
import { buildPathwayTopicProgrammaticBreadcrumbResolution } from "@/lib/seo/pathway-topic-programmatic-breadcrumbs";
import { buildPathwayTopicProgrammaticMetadata } from "@/lib/seo/pathway-topic-programmatic-metadata";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamicParams = true;
/** Must be a numeric literal for Next static route config (keep aligned with `PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS`). */
export const revalidate = 86400;

export function generateStaticParams(): { locale: string; slug: string; examCode: string; exam: string }[] {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string; exam: string }> };

function marketingRegionForPathway(countrySlug: string): MarketingRegionToggle {
  return countrySlug === "us" ? "US" : "CA";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, exam } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/${exam}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};
      const row = getPathwayTopicProgrammaticRow(pathway.id, exam);
      if (!row) return {};
      const enPath = buildExamPathwayPath(pathway, exam);
      return buildPathwayTopicProgrammaticMetadata(row.page, enPath);
    },
    { pathname, routeGroup: "marketing.exam_hub.pathway_topic_programmatic" },
  );
}

export default async function PathwayTopicProgrammaticPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, exam } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/${exam}`;
  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();
  const row = getPathwayTopicProgrammaticRow(pathway.id, exam);
  if (!row) notFound();

  const uiLocale = await getMarketingLocaleForDefaultRoute();
  const marketingRegion = marketingRegionForPathway(pathway.countrySlug);
  const jsonLdResourcePath = buildExamPathwayPath(pathway, exam);
  const breadcrumbResolution = buildPathwayTopicProgrammaticBreadcrumbResolution(pathway, exam, row.page);

  return (
    <ProgrammaticSeoPage
      page={row.page}
      locale={uiLocale}
      related={[]}
      cross={[]}
      marketingRegion={marketingRegion}
      localizedUrl={uiLocale !== DEFAULT_MARKETING_LOCALE}
      breadcrumbResolution={breadcrumbResolution}
      jsonLdResourcePath={jsonLdResourcePath}
      pathwayForProductLinks={pathway}
    />
  );
}
