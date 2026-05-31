import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { buildAlliedGlobalHubPath, isAlliedHealthPathway } from "@/lib/allied/allied-global-pathway";
import { NpQuestionsHubBoardLinks } from "@/components/exam-pathways/np-questions-hub-board-links";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PathwayQuestionHubRelatedLessons } from "@/components/pathway-lessons/pathway-question-hub-related-lessons";
import { humanizeTopicSlug } from "@/components/lessons/pathway-lesson-link-practice";
import {
  marketingExamHubBasePath,
  marketingPathwayLessonsIndexPath,
  mergeMarketingPathQuery,
  withAlliedProfessionMarketingQuery,
} from "@/lib/lessons/lesson-routes";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { isAlliedMarketingCorePathwayId, ALLIED_PROFESSION_QUERY_PARAM } from "@/lib/lessons/canonical-lessons-hubs";
import { resolveTopicSlugForPathwayTopicLabel } from "@/lib/lessons/lesson-question-cross-links";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  getRelatedPathwayLessons,
  RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL,
  RELATED_LESSONS_FOR_TOPIC_CAP,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayQuestionsMarketingHubMetaTitle } from "@/lib/lessons/pathway-questions-hub-seo";
import { pathwayQuestionsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { PublicStudyLandingLayout } from "@/components/marketing/public-study-landing-layout";
import { PublicQuestionsStudyLauncher } from "@/components/questions/public-questions-study-launcher";
import { loadPathwayPracticeBodySystemHubAggregates } from "@/lib/questions/pathway-practice-body-system-aggregates";
import {
  marketingLinearPracticeBankUsable,
} from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import { resolveQuestionBankLauncherDecision } from "@/lib/questions/question-bank-empty-state-decision";
import { AUTH_CALLBACK_PARAM } from "@/lib/auth/auth-flow-governance";

// 🧊 ISR: revalidate: 86400 already set below
export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams?: Promise<{ topic?: string; topicSlug?: string; alliedProfession?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const questionsPath = `${pathname}/questions`;
  const sp = searchParams ? await searchParams : {};
  const topicFilter = sp.topic?.trim() ?? "";
  const topicSlugParam = sp.topicSlug?.trim().toLowerCase() ?? "";
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname: questionsPath });
      if (!pathway) return {};
      const canonicalPath = buildExamPathwayPath(pathway, "questions");
      const canonical = absoluteUrl(canonicalPath);
      const narrowedLabel = topicFilter || (topicSlugParam ? humanizeTopicSlug(topicSlugParam) : "");
      const title = narrowedLabel
        ? `${narrowedLabel} · Practice questions · ${pathway.displayName} | NurseNest`
        : pathwayQuestionsMarketingHubMetaTitle(pathway);
      const description = narrowedLabel
        ? `Board-style items for ${pathway.shortName} focused on ${narrowedLabel}. Sign in to run sets that stay inside this exam's scope.`
        : `Clinical vignettes and rationales scoped to ${pathway.shortName} (${pathway.countrySlug === "canada" ? "Canada" : "US"}). Sign in to practice with your plan.`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
        ...(narrowedLabel ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: questionsPath, locale, routeGroup: "marketing.exam_hub.questions" },
  );
}

export default async function ExamPathwayQuestionsHubPage({ params, searchParams }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const sp = searchParams ? await searchParams : {};
  const topicFilter = sp.topic?.trim() ?? "";
  const topicSlugFromUrl = sp.topicSlug?.trim().toLowerCase() ?? "";
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname: `${pathname}/questions` });
  if (!pathway) notFound();
  if (isAlliedHealthPathway(pathway)) {
    const spEntries = searchParams ? await searchParams : {};
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(spEntries)) {
      if (typeof value === "string" && value.trim()) qs.set(key, value);
    }
    const dest = buildAlliedGlobalHubPath("questions");
    permanentRedirect(qs.size > 0 ? `${dest}?${qs.toString()}` : dest);
  }

  const rawAlliedProf = typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
  const alliedProfessionResolved =
    isAlliedMarketingCorePathwayId(pathway.id) && rawAlliedProf
      ? getAlliedProfessionByProfessionKey(rawAlliedProf)
      : null;
  const alliedProfessionKey = alliedProfessionResolved?.professionKey ?? "";

  const { questionSnapshot } = await loadMarketingExamHubOptionalBlocks(pathway, {
    pathname: `${pathname}/questions`,
    locale,
    country: locale,
    examCode,
    pathwayId: pathway.id,
    roleTrack: slug,
  });

  const topicFilterTrim = topicFilter.trim();
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  let relatedLessonsForTopic: Awaited<ReturnType<typeof getRelatedPathwayLessons>> = [];

  let clusterSlugForLessons: string | null = topicSlugFromUrl || null;
  if (!clusterSlugForLessons && topicFilterTrim) {
    try {
      clusterSlugForLessons = await resolveTopicSlugForPathwayTopicLabel(pathway.id, topicFilterTrim);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
        event: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        locale,
        country: locale,
        examCode,
        dependency: "resolveTopicSlugForPathwayTopicLabel",
        error_message: message.slice(0, 500),
      });
      recordRouteRenderFallback({
        fallbackType: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        pathwayId: pathway.id,
        examCode,
        country: locale,
        dependencyName: "resolveTopicSlugForPathwayTopicLabel",
      });
      clusterSlugForLessons = null;
    }
  }

  if (clusterSlugForLessons) {
    try {
      relatedLessonsForTopic = (
        await getRelatedPathwayLessons(
          pathway.id,
          clusterSlugForLessons,
          RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL,
          Math.min(RELATED_PATHWAY_LESSONS_LIMIT, RELATED_LESSONS_FOR_TOPIC_CAP),
          lessonContentLocale,
        )
      ).filter(pathwayLessonHasRenderableHubSlug);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
        event: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        locale,
        country: locale,
        examCode,
        dependency: "getRelatedPathwayLessons",
        error_message: message.slice(0, 500),
      });
      recordRouteRenderFallback({
        fallbackType: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        pathwayId: pathway.id,
        examCode,
        country: locale,
        dependencyName: "getRelatedPathwayLessons",
      });
      relatedLessonsForTopic = [];
    }
  }

  const displayTopicLabel = topicFilterTrim || (topicSlugFromUrl ? humanizeTopicSlug(topicSlugFromUrl) : "");
  const isTopicNarrowed = Boolean(topicFilterTrim || topicSlugFromUrl);

  const hubBase = marketingExamHubBasePath(pathway);
  const { crumbs, schemaItems } = pathwayQuestionsHubBreadcrumbs(pathway);
  const overviewHref = hubBase;
  const npAliasSegment = getNpPracticeTestLandingCopy(locale, slug, examCode) ? examCode : undefined;
  const boardLinkContext = pathwayMarketingHubLinkContext(pathway, npAliasSegment);
  const examName = pathwayRegionAwareExamName(pathway);
  const lessonsHref = marketingPathwayLessonsIndexPath(pathway);
  const lessonsHrefWithProfession = alliedProfessionKey
    ? mergeMarketingPathQuery(lessonsHref, { [ALLIED_PROFESSION_QUERY_PARAM]: alliedProfessionKey })
    : lessonsHref;
  const questionsHubPath = buildExamPathwayPath(pathway, "questions");
  const questionsHubPathWithProfession = alliedProfessionKey
    ? withAlliedProfessionMarketingQuery(questionsHubPath, alliedProfessionKey)
    : questionsHubPath;

  const hubAggregates = isTopicNarrowed ? [] : await loadPathwayPracticeBodySystemHubAggregates(pathway.id);
  if (process.env.NODE_ENV === "development" && !isTopicNarrowed) {
    const totalQ = hubAggregates.reduce((s, a) => s + a.questionCount, 0);
    const unc = hubAggregates.find((a) => a.id === "uncategorized")?.questionCount ?? 0;
    safeServerLog("practice_questions_hub", "hub_inventory_dev", {
      pathwayId: pathway.id,
      categoryRowCount: hubAggregates.length,
      totalQuestionCount: totalQ,
      uncategorizedCount: unc,
      normalizedCategoryUsageIds: hubAggregates
        .filter((a) => a.questionCount > 0)
        .map((a) => a.id)
        .join(","),
      fetchNote: "aggregates_hydrated",
    });
  }

  const linearPracticeUsable = marketingLinearPracticeBankUsable(questionSnapshot);
  const launcherDecision = resolveQuestionBankLauncherDecision(questionSnapshot, linearPracticeUsable);
  const visibleFilterCount = hubAggregates.filter((row) => row.id !== "uncategorized" && row.questionCount > 0).length;
  safeServerLog("practice_questions_hub", "question_bank_launcher_decision", {
    event: "question_bank_launcher_decision",
    pathway_slug: pathway.id,
    pathname: `${pathname}/questions`,
    published_count: launcherDecision.publishedQuestionCount,
    visible_count: launcherDecision.visibleQuestionCount,
    filter_count: visibleFilterCount,
    banner_rendered: launcherDecision.status === "publishing",
    reason_banner_rendered:
      launcherDecision.status === "publishing" ? launcherDecision.reason : "banner_not_rendered",
    launcher_state: launcherDecision.status,
    launcher_reason: launcherDecision.reason,
  });
  const marketingLoginHref = withMarketingLocale(lessonContentLocale, "/login");
  const focusedPracticeStartParams = new URLSearchParams();
  focusedPracticeStartParams.set("pathwayId", pathway.id);
  focusedPracticeStartParams.set("preset", "topic_drill");
  focusedPracticeStartParams.set("count", "20");
  focusedPracticeStartParams.set("shuffle", "true");
  if (displayTopicLabel) focusedPracticeStartParams.set("topicNames", displayTopicLabel);
  if (alliedProfessionKey) focusedPracticeStartParams.set("alliedProfession", alliedProfessionKey);
  const focusedPracticeLoginParams = new URLSearchParams();
  focusedPracticeLoginParams.set(AUTH_CALLBACK_PARAM, `/app/questions/start?${focusedPracticeStartParams.toString()}`);
  const appQuestionsScoped = `${marketingLoginHref}?${focusedPracticeLoginParams.toString()}`;

  return (
    <PublicStudyLandingLayout
      breadcrumbs={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.href }))}
      schemaItems={schemaItems}
    >
      <div
        data-nn-qa-marketing-pathway-questions-hub="true"
        data-premium-layout-version="2026-05-public-study-landing-v1"
      >
        {!isTopicNarrowed ? (
          <PublicQuestionsStudyLauncher
            pathwayId={pathway.id}
            examDisplayName={examName}
            aggregates={hubAggregates}
            loginBaseHref={marketingLoginHref}
            callbackParam={AUTH_CALLBACK_PARAM}
            alliedProfessionKey={alliedProfessionKey || undefined}
            launcherDecision={launcherDecision}
          />
        ) : (
          <section
            className="mx-auto max-w-5xl rounded-[1.5rem] border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.85)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8"
            aria-labelledby="questions-topic-title"
          >
            <div className="mx-auto max-w-2xl text-center">
              <p className="nn-premium-home-eyebrow justify-center">Practice Questions</p>
              <h1
                id="questions-topic-title"
                className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl"
              >
                {displayTopicLabel} Practice Questions
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base">
                Focused {examName} practice scoped to {pathway.shortName}.
              </p>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={appQuestionsScoped}
                className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-7 text-sm font-semibold nn-text-on-solid-fill shadow-[0_16px_34px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
              >
                Start Questions
              </Link>
              <Link
                href={questionsHubPathWithProfession}
                className="inline-flex h-12 min-w-[170px] items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.82)] px-6 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
              >
                Clear Filter
              </Link>
            </div>
          </section>
        )}

        {isTopicNarrowed ? (
          <div className="mx-auto mt-8 max-w-5xl space-y-4">
          <PathwayQuestionHubRelatedLessons
            topicLabel={displayTopicLabel}
            lessonsBasePath={lessonsHrefWithProfession}
            lessons={relatedLessonsForTopic}
          />
          </div>
        ) : null}

        {pathway.roleTrack === "np" ? (
          <div className="mx-auto mt-8 max-w-5xl rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-5 shadow-[var(--semantic-shadow-soft)]">
            <NpQuestionsHubBoardLinks pathwayId={pathway.id} linkContext={boardLinkContext} />
          </div>
        ) : null}

        <p className="mx-auto mt-8 max-w-5xl text-sm text-[var(--semantic-text-secondary)]">
          <Link
            href={overviewHref}
            className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
          >
            Full study toolkit, labs, and readiness modules on the {pathway.shortName} hub
          </Link>
        </p>
      </div>
    </PublicStudyLandingLayout>
  );
}
