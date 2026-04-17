import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { examPathwayRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
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
    const hreflang = examPathwayRegionalHreflang(pathway);
    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        robots: { index: true, follow: true },
        alternates: { canonical: requestUrl, languages: hreflang },
        openGraph: { title: seo.title, description: seo.description, url: requestUrl, type: "website" },
      };
    }
    const corePath = buildExamPathwayPath(pathway);
    const coreUrl = absoluteUrl(corePath);
    return {
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      robots: { index: true, follow: true },
      alternates: { canonical: coreUrl, languages: hreflang },
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
  return withCrawlSurfacePageRender("marketing.exam_hub", pathname, async () => {
    const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
    if (!pathway) notFound();

    const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode) ?? null;
    const content = buildNursingTierHubContent(pathway);
    const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, { hubBasePath: pathname });

    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd
          title={npPracticeSeo?.title ?? pathway.seoTitle}
          description={npPracticeSeo?.description ?? pathway.seoDescription}
          path={npPracticeSeo ? pathname : buildExamPathwayPath(pathway)}
        />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <NursingTierHubPage
          pathway={pathway}
          hubPath={pathname}
          content={content}
          heroTitle={npPracticeSeo?.heroTitle}
          npSeoAliasSegment={npPracticeSeo ? examCode : undefined}
        />
        <section className="mt-6">
          <div className="nn-card border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-4 sm:p-5">
            <h2 className="nn-marketing-h4">Recommended blog reading</h2>
            <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">
              Explore exam-focused blog posts to reinforce lessons and question practice.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href={buildExamPathwayPath(pathway, "blog")} className="font-semibold text-primary hover:underline">
                Open {pathway.shortName} blog hub
              </Link>
              <Link href="/blog" className="font-medium text-primary hover:underline">
                All blog posts
              </Link>
            </div>
            <MarketingBlogLatestLinks take={3} className="mt-4 border-t border-[var(--border-subtle)] pt-4" heading="New on the blog" />
          </div>
        </section>
      </div>
    );
  });
}
