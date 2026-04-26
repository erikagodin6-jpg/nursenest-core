import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
    examCode: string;
  }>;
};

/**
 * Safe title resolver — avoids accessing non-existent fields
 */
function getPathwayTitle(pathway: any): string {
  return (
    pathway?.seoTitle ??
    pathway?.displayName ??
    pathway?.name ??
    "Exam Hub | NurseNest"
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;

  try {
    const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });

    if (!pathway) {
      return {
        title: "Exam Hub | NurseNest",
        description: "NurseNest exam preparation hub.",
      };
    }

    return {
      title: getPathwayTitle(pathway),
      description: pathway.seoDescription ?? "NurseNest exam preparation hub.",
    };
  } catch {
    return {
      title: "Exam Hub | NurseNest",
      description: "NurseNest exam preparation hub.",
    };
  }
}

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;

  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname }).catch((err) => {
    console.error("[exam-hub] pathway resolve failed", {
      pathname,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  });

  if (!pathway) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Exam hub unavailable</h1>
        <p className="mt-3 text-slate-600">
          This exam hub could not be loaded. Please return to the main exam page.
        </p>
        <Link href="/exams" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-white">
          View exams
        </Link>
      </main>
    );
  }

  return withCrawlSurfacePageRender("marketing.exam_hub", pathname, async () => {
    const content = (() => {
      try {
        return buildNursingTierHubContent(pathway);
      } catch (err) {
        console.error("[exam-hub] content build failed", {
          pathname,
          error: err instanceof Error ? err.message : String(err),
        });
        return null;
      }
    })();

    const breadcrumbs = (() => {
      try {
        return pathwayOverviewBreadcrumbs(pathway, { hubBasePath: pathname });
      } catch (err) {
        console.error("[exam-hub] breadcrumb build failed", {
          pathname,
          error: err instanceof Error ? err.message : String(err),
        });
        return { crumbs: [], schemaItems: [] };
      }
    })();

    const title = getPathwayTitle(pathway);

    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <WebPageJsonLd
          title={title}
          description={pathway.seoDescription ?? ""}
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
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="mt-2">
              This hub is available, but the marketing content failed to load. Use the links below to continue.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`${pathname}/lessons`} className="rounded-xl bg-slate-950 px-4 py-2 text-white">
                View lessons
              </Link>
              <Link href="/lessons" className="rounded-xl border border-slate-300 px-4 py-2 text-slate-900">
                All lessons
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8 border-t pt-6">
          <h2 className="mb-2 text-lg font-semibold">Blog</h2>
          <Link href="/blog" className="text-blue-600 underline">
            View all blog posts
          </Link>
          <MarketingBlogLatestLinks take={3} />
        </section>
      </main>
    );
  });
}