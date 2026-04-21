import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { rnNclexExamHubOverviewRedirectTarget } from "@/lib/exam-pathways/rn-nclex-public-hub-policy";
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
  const pathwayPre = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  const rnHubRedirect = rnNclexExamHubOverviewRedirectTarget(pathwayPre);
  if (rnHubRedirect) permanentRedirect(rnHubRedirect);
  return safeGenerateMetadata(async () => {
    const pathway = pathwayPre;
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
  const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  const rnHubRedirect = rnNclexExamHubOverviewRedirectTarget(pathway);
  if (rnHubRedirect) permanentRedirect(rnHubRedirect);
  if (!pathway) notFound();

  let hubResume: PathwayHubResumePayload | null = null;
  try {
    const session = await getOptionalPublicSession({ pathname, surface: "marketing.exam_hub" });
    const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
    if (userId && isDatabaseUrlConfigured()) {
      const entitlement = await resolveEntitlementForPage(userId);
      if (entitlement !== "error" && entitlement.hasAccess) {
        let learnerPath: string | null = null;
        try {
          const u = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
          learnerPath = u?.learnerPath ?? null;
        } catch {
          learnerPath = null;
        }
        if (canViewFullPathwayLesson(entitlement, pathway, learnerPath)) {
          const lessonsBasePath = buildExamPathwayPath(pathway, "lessons");
          const resume = await loadPathwayHubResumePayload(
            userId,
            entitlement,
            learnerPath,
            pathway,
            lessonsBasePath,
          );
          if (resume.lastTouched != null || resume.nextRecommended != null) {
            hubResume = resume;
          }
        }
      }
    }
  } catch {
    hubResume = null;
  }

  return withCrawlSurfacePageRender("marketing.exam_hub", pathname, async () => {
    const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode) ?? null;
    const content = buildNursingTierHubContent(pathway);
    const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, { hubBasePath: pathname });

    return (
      <div
        className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
        data-nn-nursing-tier-hub="surface"
      >
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
          npSeoAliasSegment={npPracticeSeo ? examCode : undefined}
          hubResume={hubResume}
        />
        <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
          <div className="nn-card border border-[color-mix(in_srgb,var(--semantic-info)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_4.5%,var(--theme-card-bg))] p-4 sm:p-5">
            <h2 className="nn-marketing-h4 text-[var(--theme-muted-text)]">Optional reading</h2>
            <p className="nn-marketing-body-sm mt-1 text-[var(--theme-muted-text)]">
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
