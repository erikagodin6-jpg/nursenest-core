// SAFE HOMEPAGE — no hard crashes, ever

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;

  let pathway = null;
  try {
    pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  } catch (err) {
    console.error("[PATHWAY RESOLVE ERROR]", err);
  }

  if (!pathway) {
    return (
      <div className="p-10 text-center text-red-500">
        Invalid pathway (check route config)
      </div>
    );
  }

  return withCrawlSurfacePageRender("marketing.exam_hub", pathname, async () => {
    let content = null;
    try {
      content = buildNursingTierHubContent(pathway);
    } catch (err) {
      console.error("[CONTENT BUILD ERROR]", err);
    }

    let breadcrumbs;
    try {
      breadcrumbs = pathwayOverviewBreadcrumbs(pathway, { hubBasePath: pathname });
    } catch (err) {
      console.error("[BREADCRUMB ERROR]", err);
      breadcrumbs = { crumbs: [], schemaItems: [] };
    }

    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <WebPageJsonLd
          title={pathway.seoTitle || "Exam Hub"}
          description={pathway.seoDescription || ""}
          path={pathname}
        />

        <BreadcrumbBar crumbs={breadcrumbs.crumbs} schemaItems={breadcrumbs.schemaItems} />

        {content ? (
          <NursingTierHubPage
            pathway={pathway}
            hubPath={pathname}
            content={content}
            hubResume={null}
            viewerSignedIn={false}
            viewerHasPathwayLessonAccess={false}
          />
        ) : (
          <div className="text-center py-12 text-orange-500">
            Content failed to load — check logs
          </div>
        )}

        <section className="mt-8 border-t pt-6">
          <h2 className="font-semibold mb-2">Blog</h2>
          <Link href="/blog" className="text-blue-600 underline">
            View all blog posts
          </Link>
          <MarketingBlogLatestLinks take={3} />
        </section>
      </div>
    );
  });
}