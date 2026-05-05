import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
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
import {
  fallbackAlliedPathwayHubOverview,
  loadAlliedPathwayHubOverview,
  type AlliedPathwayHubOverview,
} from "@/lib/marketing/allied-pathway-hub-overview";
import { examPathwayRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { InternationalRnHubSections } from "@/components/marketing/international-rn-hub-sections";
import { intlRnRegulatorDisclaimerText, resolveIntlRnHubSectionCopy } from "@/lib/marketing/intl-rn-pathway-hub-copy";
import { isIntlRnFoundationPathwayId } from "@/lib/navigation/country-exam-launch-readiness";

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
  const isAlliedHub = pathway.roleTrack === "allied" && pathway.examCode === "allied-health";
  /** Canada main allied URL is an occupation directory only (no inventory strip, labs, ECG category grid, or study-mode tiles). */
  const alliedCanadaOccupationDirectoryHub = isAlliedHub && pathname === "/canada/allied/allied-health";

  let alliedOverview: AlliedPathwayHubOverview | null = null;
  if (isAlliedHub && !alliedCanadaOccupationDirectoryHub) {
    try {
      alliedOverview = await loadAlliedPathwayHubOverview(pathway, {
        pathname,
        locale,
        examCode,
        roleTrack: slug,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      safeServerLog("exam_pathway_hub", "allied_hub_overview_failed", {
        pathname,
        pathway_id: pathway.id,
        error_message: message.slice(0, 500),
      });
      alliedOverview = fallbackAlliedPathwayHubOverview();
    }
  }

  const logAlliedHubDiag =
    isAlliedHub &&
    (process.env.NODE_ENV !== "production" || process.env.VITEST === "true" || process.env.NODE_ENV === "test");
  if (logAlliedHubDiag) {
    safeServerLog("exam_pathway_hub", "allied_hub_route_diagnostic", {
      pathname,
      country: locale,
      role_track: slug,
      pathway_id: pathway.id,
      exam_slug: examCode,
      loader_result: alliedCanadaOccupationDirectoryHub
        ? "occupation_directory_hub_skipped_inventory"
        : JSON.stringify({
            lessonCount: alliedOverview?.lessonCount ?? 0,
            questionSnapshotStatus: alliedOverview?.questionSnapshot.status ?? "none",
            flashcardDeckCount: alliedOverview?.flashcardDeckCount ?? null,
            moduleCardCount: alliedOverview?.moduleCards.length ?? 0,
          }),
    });
  }

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

    let content;
    try {
      content = isAlliedHub ? null : buildNursingTierHubContent(pathway);
    } catch (err) {
      console.error("[HOMEPAGE CONTENT ERROR]", err);
      content = null;
    }

    const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, {
      hubBasePath: pathname,
    });

    const marketingMessages = isIntlRnFoundationPathwayId(pathway.id)
      ? await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, ["marketing"])
      : {};
    const intlSections = isIntlRnFoundationPathwayId(pathway.id)
      ? resolveIntlRnHubSectionCopy(pathway, marketingMessages)
      : null;
    const intlDisclaimer = isIntlRnFoundationPathwayId(pathway.id)
      ? intlRnRegulatorDisclaimerText(marketingMessages)
      : "";

    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd
          title={npPracticeSeo?.title ?? pathway.seoTitle}
          description={npPracticeSeo?.description ?? pathway.seoDescription}
          path={npPracticeSeo ? pathname : buildExamPathwayPath(pathway)}
        />

        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />

        {isAlliedHub ? (
          <AlliedHealthPathwayHub
            pathway={pathway}
            hubPath={pathname}
            overview={alliedOverview}
            occupationDirectoryHub={alliedCanadaOccupationDirectoryHub}
          />
        ) : content ? (
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

        {intlSections ? (
          <InternationalRnHubSections pathway={pathway} copy={intlSections} disclaimer={intlDisclaimer} />
        ) : null}

        <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
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
