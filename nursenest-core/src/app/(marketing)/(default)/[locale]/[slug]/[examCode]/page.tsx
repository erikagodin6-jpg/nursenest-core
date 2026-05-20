import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import {
  isInternalAdmissionsPrepPathwayId,
  marketingRobotsForExamPathway,
  isPhaseOneHiddenAdmissionsScaffoldPathwayId,
  shouldOmitRegionalHreflangForInternalAdmissionsPrep,
} from "@/lib/exam-pathways/admissions-prep-internal-pathways";
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
import { resolveMarketingHubEcgModulePublic } from "@/lib/ecg-module/ecg-marketing-hub-surface.server";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { intlRnRegulatorDisclaimerText, resolveIntlRnHubSectionCopy } from "@/lib/marketing/intl-rn-pathway-hub-copy";
import { isIntlRnFoundationPathwayId } from "@/lib/navigation/country-exam-launch-readiness";
import {
  parseMeasurementPreference,
  readMeasurementPreferenceFromCookieStore,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  if (locale === "allied" && slug === "allied-health" && examCode === "cat") {
    const { generateMetadata: generateAlliedCatMetadata } = await import(
      "@/app/(marketing)/(default)/allied/allied-health/cat/page"
    );
    return generateAlliedCatMetadata();
  }

  const pathname = `/${locale}/${slug}/${examCode}`;
  const pathwayPre = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });

  return safeGenerateMetadata(async () => {
    const pathway = pathwayPre;
    if (!pathway) return {};

    const seo = getNpPracticeTestLandingCopy(locale, slug, examCode);
    const requestUrl = absoluteUrl(`/${locale}/${slug}/${examCode}`);
    const hreflang = examPathwayRegionalHreflang(pathway);

    const robots = marketingRobotsForExamPathway(pathway);
    const omitHreflang = shouldOmitRegionalHreflangForInternalAdmissionsPrep(pathway);

    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        robots,
        alternates: omitHreflang ? { canonical: requestUrl } : { canonical: requestUrl, languages: hreflang },
        openGraph: { title: seo.title, description: seo.description, url: requestUrl, type: "website" },
      };
    }

    const coreUrl = absoluteUrl(buildExamPathwayPath(pathway));
    return {
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      robots,
      alternates: omitHreflang ? { canonical: coreUrl } : { canonical: coreUrl, languages: hreflang },
      openGraph: {
        title: pathway.seoTitle,
        description: pathway.seoDescription,
        url: coreUrl,
        type: "website",
      },
    };
  }, {
    pathname,
    locale,
    routeGroup: "marketing.exam_hub",
    fallbackMetadata: pathwayPre
      ? {
          title: pathwayPre.seoTitle,
          description: pathwayPre.seoDescription,
        }
      : undefined,
  });
}

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  if (locale === "allied" && slug === "allied-health" && examCode === "cat") {
    const { default: GlobalAlliedCatPage } = await import(
      "@/app/(marketing)/(default)/allied/allied-health/cat/page"
    );
    return <GlobalAlliedCatPage />;
  }

  const pathname = `/${locale}/${slug}/${examCode}`;

  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();
  if (isInternalAdmissionsPrepPathwayId(pathway.id) && isPhaseOneHiddenAdmissionsScaffoldPathwayId(pathway.id)) {
    const { InternalAdmissionsPrepHubScaffold } = await import(
      "@/components/marketing/internal-admissions-prep-hub-scaffold"
    );
    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <InternalAdmissionsPrepHubScaffold pathway={pathway} hubPath={pathname} />
      </div>
    );
  }
  const isAlliedHub = pathway.roleTrack === "allied" && pathway.examCode === "allied-health";

  let alliedInitialMeasurement: MeasurementPreference | null = null;
  let alliedMeasurementSync = false;
  if (isAlliedHub) {
    try {
      const fromCookie = readMeasurementPreferenceFromCookieStore(await cookies());
      if (fromCookie) alliedInitialMeasurement = fromCookie;
    } catch {
      // ignore
    }
  }

  let alliedOverview: AlliedPathwayHubOverview | null = null;
  if (isAlliedHub) {
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
    isAlliedHub && (process.env.VITEST === "true" || process.env.NODE_ENV !== "production");
  if (logAlliedHubDiag) {
    safeServerLog("exam_pathway_hub", "allied_hub_route_diagnostic", {
      pathname,
      country: locale,
      role_track: slug,
      pathway_id: pathway.id,
      exam_slug: examCode,
      loader_result: JSON.stringify({
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

    if (isAlliedHub && userId && isDatabaseUrlConfigured()) {
      alliedMeasurementSync = true;
      try {
        const row = await prisma.user.findUnique({
          where: { id: userId },
          select: { measurementPreference: true },
        });
        const fromDb = parseMeasurementPreference(row?.measurementPreference ?? null);
        if (fromDb) alliedInitialMeasurement = fromDb;
      } catch {
        // ignore
      }
    }

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
    const ecgModulePublicForHub = await resolveMarketingHubEcgModulePublic();
    const clinicalScenariosPublicForHub = isClinicalScenariosPubliclyEnabled();
    const oscePublicForHub = isOsceScenariosPubliclyEnabled();
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
    const AlliedHealthPathwayHubComponent = isAlliedHub
      ? (await import("@/components/marketing/allied-health-pathway-hub")).AlliedHealthPathwayHub
      : null;
    const NursingTierHubPageComponent =
      !isAlliedHub && content
        ? (await import("@/components/marketing/nursing-tier-hub-page")).NursingTierHubPage
        : null;
    const InternationalRnHubSectionsComponent = intlSections
      ? (await import("@/components/marketing/international-rn-hub-sections")).InternationalRnHubSections
      : null;

    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd
          title={npPracticeSeo?.title ?? pathway.seoTitle}
          description={npPracticeSeo?.description ?? pathway.seoDescription}
          path={npPracticeSeo ? pathname : buildExamPathwayPath(pathway)}
        />

        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />

        {isAlliedHub && AlliedHealthPathwayHubComponent ? (
          <AlliedHealthPathwayHubComponent
            pathway={pathway}
            hubPath={pathname}
            overview={alliedOverview}
            initialMeasurementPreference={alliedInitialMeasurement}
            syncMeasurementPreferenceToProfile={alliedMeasurementSync}
            viewerSignedIn={viewerSignedIn}
            ecgModulePublic={ecgModulePublicForHub}
          />
        ) : content && NursingTierHubPageComponent ? (
          <NursingTierHubPageComponent
            pathway={pathway}
            hubPath={pathname}
            content={content}
            hubResume={hubResume}
            viewerSignedIn={viewerSignedIn}
            viewerHasPathwayLessonAccess={viewerHasPathwayLessonAccess}
            npSeoAliasSegment={npPracticeSeo ? examCode : undefined}
            emphasizeCatPracticeTests={Boolean(npPracticeSeo)}
            ecgModulePublic={ecgModulePublicForHub}
            clinicalScenariosPublic={clinicalScenariosPublicForHub}
            oscePublic={oscePublicForHub}
          />
        ) : (
          <div className="text-center py-10 text-red-500">
            Homepage content failed to load (check logs)
          </div>
        )}

        {intlSections && InternationalRnHubSectionsComponent ? (
          <InternationalRnHubSectionsComponent
            pathway={pathway}
            copy={intlSections}
            disclaimer={intlDisclaimer}
          />
        ) : null}

        <footer className="mt-10 border-t border-[var(--border-subtle)] pt-5 text-center">
          <p className="nn-marketing-body-sm text-[color-mix(in_srgb,var(--theme-body-text)_78%,transparent)]">
            <Link href={buildExamPathwayPath(pathway, "blog")} className="font-medium text-primary/90 hover:underline">
              {pathway.shortName} articles
            </Link>
            <span className="mx-2 text-[var(--border-subtle)]" aria-hidden>
              ·
            </span>
            <Link href="/blog" className="font-medium text-primary/90 hover:underline">
              All posts
            </Link>
          </p>
        </footer>
      </div>
    );
  });
}
