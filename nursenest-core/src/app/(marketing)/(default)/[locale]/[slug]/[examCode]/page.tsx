import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  return safeGenerateMetadata(async () => {
    const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
    if (!pathway) return {};
    const seo = getNpPracticeTestLandingCopy(locale, slug, examCode);
    const requestPath = `/${locale}/${slug}/${examCode}`;
    const requestUrl = absoluteUrl(requestPath);
    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        alternates: { canonical: requestUrl },
        openGraph: { title: seo.title, description: seo.description, url: requestUrl, type: "website" },
      };
    }
    const corePath = buildExamPathwayPath(pathway);
    const coreUrl = absoluteUrl(corePath);
    return {
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      alternates: { canonical: coreUrl },
      openGraph: {
        title: pathway.seoTitle,
        description: pathway.seoDescription,
        url: coreUrl,
        type: "website",
      },
    };
  }, { pathname, locale, routeGroup: "marketing.exam_hub" });
}

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode) ?? null;
  const content = buildNursingTierHubContent(pathway);
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, { hubBasePath: pathname });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <NursingTierHubPage
        pathway={pathway}
        hubPath={pathname}
        content={content}
        heroTitle={npPracticeSeo?.heroTitle}
        heroLead={npPracticeSeo?.heroLead}
        npSeoAliasSegment={npPracticeSeo ? examCode : undefined}
      />
    </div>
  );
}
