import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { getPathwayTopicProgrammaticRow } from "@/lib/seo/pathway-topic-programmatic-registry";
import { PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS } from "@/lib/seo/programmatic-registry";
import { buildPathwayTopicProgrammaticBreadcrumbResolution } from "@/lib/seo/pathway-topic-programmatic-breadcrumbs";
import { buildPathwayTopicProgrammaticMetadata } from "@/lib/seo/pathway-topic-programmatic-metadata";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamicParams = true;
export const revalidate = PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS;

export function generateStaticParams(): { locale: string; slug: string; examCode: string; seoSlug: string }[] {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string; seoSlug: string }> };

function marketingRegionForPathway(countrySlug: string): MarketingRegionToggle {
  return countrySlug === "us" ? "US" : "CA";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, seoSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/${seoSlug}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};
      const row = getPathwayTopicProgrammaticRow(pathway.id, seoSlug);
      if (!row) return {};
      const enPath = buildExamPathwayPath(pathway, seoSlug);
      return buildPathwayTopicProgrammaticMetadata(row.page, enPath);
    },
    { pathname, routeGroup: "marketing.exam_hub.pathway_topic_programmatic" },
  );
}

export default async function PathwayTopicProgrammaticPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, seoSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/${seoSlug}`;
  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();
  const row = getPathwayTopicProgrammaticRow(pathway.id, seoSlug);
  if (!row) notFound();

  const uiLocale = await getMarketingLocaleForDefaultRoute();
  const marketingRegion = marketingRegionForPathway(pathway.countrySlug);
  const jsonLdResourcePath = buildExamPathwayPath(pathway, seoSlug);
  const breadcrumbResolution = buildPathwayTopicProgrammaticBreadcrumbResolution(pathway, seoSlug, row.page);

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
