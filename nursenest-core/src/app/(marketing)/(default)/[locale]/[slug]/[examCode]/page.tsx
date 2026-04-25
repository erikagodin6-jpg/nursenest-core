// 🔥 ONLY CHANGE: wrap content builder in try/catch

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { loadPathwayHubResumePayload, type PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
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
  const pathwayPre = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });

  return safeGenerateMetadata(async () => {
    const pathway = pathwayPre;
    if (!pathway) return {};

    const seo = getNpPracticeTestLandingCopy(locale, slug, examCode);
    const requestUrl = absoluteUrl(`/${locale}/${slug}/${examCode}`);
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

    const coreUrl = absoluteUrl(buildExamPathwayPath(pathway));
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

  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  let hubResume: PathwayHubResumePayload | null = null;
  let viewerSignedIn = false;
  let viewerHasPathwayLessonAccess = false;

  try {
    const session = await getOptionalPublicSession({ pathname, surface: "marketing.exam_hub" });
    const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
    viewerSignedIn = Boolean(userId);

    if (userId && isDatabaseUrlConfigured()) {
      const entitlement = await resolveEntitlementForPage(userId);
      if (entitlement !== "error" && entitlement.hasAccess) {
        let learnerPath: string | null = null;

        try {
          const u = await prisma.user.findUnique({
            where: { id: userId },
            select: { learnerPath: true },
          });
          learnerPath = u?.learnerPath ?? null;
        } catch {}

        viewerHasPathwayLessonAccess = canViewFullPathwayLesson(entitlement, pathway, learnerPath);

        if (viewerHasPathwayLessonAccess) {
          const resume = await loadPathwayHubResumePayload(
            userId,
            entitlement,
            learnerPath,
            pathway,
            buildExamPathwayPath(pathway, "lessons"),
          );

          if (resume.lastTouched || resume.nextRecommended) {
            hubResume = resume;
          }
        }
      }
    }
  } catch {
    // safe fallback
  }

  return withCrawlSurfacePageRender("marketing.exam_hub", pathname, async () => {
    const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode) ?? null;

    // 🔥 CRITICAL FIX
    let content;
    try {
      content = buildNursingTierHubContent(pathway);
    } catch (err) {
      console.error("[HOMEPAGE CONTENT ERROR]", err);
      content = null;
    }

    const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, {
      hubBasePath: pathname,
    });

    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd
          title={npPracticeSeo?.title ?? pathway.seoTitle}
          description={npPracticeSeo?.description ?? pathway.seoDescription}
          path={npPracticeSeo ? pathname : buildExamPathwayPath(pathway)}
        />

        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />

        {content ? (
          <NursingTierHubPage
            pathway={pathway}
            hubPath={pathname}
            content={content}
            hubResume={hubResume}
            viewerSignedIn={viewerSignedIn}
            viewerHasPathwayLessonAccess={viewerHasPathwayLessonAccess}
          />
        ) : (
          <div className="text-center py-10 text-red-500">
            Homepage content failed to load (check logs)
          </div>
        )}

        <section className="mt-8 border-t pt-6">
          <Link href="/blog">All blog posts</Link>
        </section>
      </div>
    );
  });
}
