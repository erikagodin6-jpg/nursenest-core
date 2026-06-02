import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { ExamPrepCourseProgramJsonLd, WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import {
  isInternalAdmissionsPrepPathwayId,
  marketingRobotsForExamPathway,
  isPhaseOneHiddenAdmissionsScaffoldPathwayId,
  shouldOmitRegionalHreflangForInternalAdmissionsPrep,
} from "@/lib/exam-pathways/admissions-prep-internal-pathways";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
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
export const revalidate = 3600; // 🧊 ISR: exam pathway hub pages

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

  const hubResume = null;
  const viewerSignedIn = false;
  const viewerHasPathwayLessonAccess = false;

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
    let AlliedHealthPathwayHubComponent: typeof import("@/components/marketing/allied-health-pathway-hub").AlliedHealthPathwayHub | null = null;
    let NursingTierHubPageComponent: typeof import("@/components/marketing/nursing-tier-hub-page").NursingTierHubPage | null = null;
    let InternationalRnHubSectionsComponent: typeof import("@/components/marketing/international-rn-hub-sections").InternationalRnHubSections | null = null;

    try {
      if (isAlliedHub) {
        AlliedHealthPathwayHubComponent = (await import("@/components/marketing/allied-health-pathway-hub")).AlliedHealthPathwayHub;
      } else if (content) {
        NursingTierHubPageComponent = (await import("@/components/marketing/nursing-tier-hub-page")).NursingTierHubPage;
      }
      if (intlSections) {
        InternationalRnHubSectionsComponent = (await import("@/components/marketing/international-rn-hub-sections")).InternationalRnHubSections;
      }
    } catch (importErr) {
      console.error("[ExamHub] dynamic import failed for pathway", pathway.id, importErr);
      content = null;
    }

    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd
          title={npPracticeSeo?.title ?? pathway.seoTitle}
          description={npPracticeSeo?.description ?? pathway.seoDescription}
          path={npPracticeSeo ? pathname : buildExamPathwayPath(pathway)}
        />
        <ExamPrepCourseProgramJsonLd
          path={pathname}
          name={pathway.displayName}
          description={pathway.seoDescription}
          teaches={[pathway.shortName, pathway.displayName]}
          occupationalCredential={pathway.shortName}
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
          <div className="py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{pathway.displayName}</h1>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Exam prep content for this pathway is being prepared. Check back soon, or explore other pathways.
            </p>
            <Link href="/lessons" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all no-underline">
              Browse all lessons
            </Link>
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
