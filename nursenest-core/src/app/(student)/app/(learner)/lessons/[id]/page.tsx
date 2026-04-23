import { randomUUID } from "node:crypto";
import Link from "next/link";
import { ExamFamily, LearnerNoteScope, type TierCode } from "@prisma/client";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { PremiumLessonShell } from "@/components/student/premium-lesson-shell";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { logBlockedAccess, logEntitlementMismatch } from "@/lib/entitlements/entitlement-logging";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { resolveAppSubscriberPathwayLessonForDetail } from "@/lib/lessons/app-subscriber-lesson-detail-resolve";
import { visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-access";
import { filterLearnerPresentablePathwaySections } from "@/lib/lessons/lesson-section-presentability";
import {
  canAccessLegacyContentMapLesson,
  getLegacyContentMapLessonById,
  legacyContentMapLessonTitle,
} from "@/lib/lessons/legacy-content-map-lessons";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { localizeBreadcrumbCrumbs } from "@/lib/seo/breadcrumb-i18n";
import { learnerPathwayLessonBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { LegacyMonolithLessonBody } from "@/components/lessons/legacy-monolith-lesson-body";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { classifyContentItemLesson, classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LessonContinueStudyNextBlock } from "@/components/student/lesson-continue-study-next-block";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { loadLessonContinueStudyNext } from "@/lib/learner/lesson-context-study-next";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { getLearnerExamFraming } from "@/lib/learner/learner-exam-framing";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import { LessonTopicPracticeSection } from "@/components/lessons/lesson-topic-practice-section";
import { loadLessonTopicLinkedQuizItems } from "@/lib/lessons/load-lesson-topic-linked-quiz-items";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { buildAppQuestionBankTopicDrillHref } from "@/components/lessons/pathway-lesson-link-practice";
import { PathwayLessonNextStepsCards } from "@/components/lessons/pathway-lesson-next-steps-cards";
import { pathwayHubAppFlashcardsHref, pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import {
  pathwayLessonPremiumSectionBodyText,
  pathwayLessonSectionSurfaceHeading,
} from "@/lib/lessons/pathway-lesson-section-surface";
import { CoachLessonHelper } from "@/components/study/coach-lesson-helper";
import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { lessonTopicMatchesTopPriority } from "@/lib/coach/study-coach-lesson-priority";
import { buildPathwayLessonCoachExcerpt } from "@/lib/coach/build-pathway-lesson-coach-excerpt";
import { loadPathwayLessonProgressForSlug } from "@/lib/lessons/pathway-lesson-progress";
import { LessonAssessmentFlow } from "@/components/lessons/lesson-assessment-flow";
import { LessonSectionNoteInline } from "@/components/lessons/lesson-section-note-inline";
import { LessonSectionCard, lessonSectionSurface } from "@/components/lessons/lesson-section-card";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { LessonPageHeader } from "@/components/lessons/lesson-page-header";
import { LessonSectionNav } from "@/components/lessons/lesson-section-nav";
import { LessonNavButtons } from "@/components/lessons/lesson-nav-buttons";
import { AppLessonUnavailable } from "@/components/student/app-lesson-unavailable";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import {
  buildLessonStudyLoopBankPackFromPreloadedExplicitItems,
  explicitLessonStudyLoopCombinedSanitizedIds,
  LESSON_STUDY_LOOP_MIN_QUESTIONS,
  loadLessonStudyLoopBankPack,
  shouldUseExplicitLessonStudyLoopPack,
} from "@/lib/lessons/load-lesson-study-loop-bank-pack";
import { loadLessonBankQuizItemsByExamIdsWithDiagnostics } from "@/lib/lessons/lesson-explicit-exam-question-items";
import { PathwayLessonStudyLoopOrchestrator } from "@/components/lessons/pathway-lesson-study-loop-orchestrator";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { shouldRenderPathwayLessonSection } from "@/lib/lessons/lesson-section-page-layout";
import { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";
import { PathwayLessonCommonTrapsStrip, PathwayLessonMemoryAnchorStrip } from "@/components/lessons/pathway-lesson-study-strips";
import { lessonHasExamTakeaways } from "@/lib/lessons/exam-takeaways-items";
import {
  resolvePathwayLessonBankAssessments,
  type ExplicitLessonBankQuizCombinedLoad,
} from "@/lib/lessons/lesson-bank-assessment-selection";
import { PathwayLessonInteractiveModules } from "@/components/lessons/pathway-lesson-interactive-modules";
import { getLessonInteractiveModules } from "@/lib/lessons/lesson-interactive-modules";
import { loadPathwayLessonAdjacent, mapPathwayLessonAdjacentToAppHrefs } from "@/lib/lessons/pathway-lesson-adjacent";

function LessonBody({
  content,
  t,
}: {
  content: unknown;
  t: (key: string) => string;
}) {
  const unsupported = (
    <aside
      className="rounded-xl border px-4 py-3 text-sm leading-relaxed"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 28%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 45%, transparent)",
        color: "var(--semantic-text-secondary)",
      }}
    >
      {t("learner.lessons.detail.contentBlockUnsupported")}
    </aside>
  );

  if (Array.isArray(content)) {
    return (
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--theme-body-text)]">
        {content.map((block, i) => {
          if (typeof block === "string") {
            return (
              <p key={i} className="whitespace-pre-wrap">
                {block}
              </p>
            );
          }
          if (block && typeof block === "object") {
            const o = block as Record<string, unknown>;
            const pickString = (...keys: string[]) => {
              for (const k of keys) {
                const v = o[k];
                if (typeof v === "string" && v.trim()) return v;
              }
              return null;
            };
            const textBlock = pickString("text", "body", "markdown", "md", "html", "content");
            if (textBlock) {
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {textBlock}
                </p>
              );
            }
            if (Array.isArray(o.items) && o.items.every((x) => typeof x === "string")) {
              return (
                <ul key={i} className="list-disc space-y-1 pl-5">
                  {(o.items as string[]).map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              );
            }
            return <div key={i}>{unsupported}</div>;
          }
          return <div key={i}>{unsupported}</div>;
        })}
      </div>
    );
  }
  if (typeof content === "string") {
    return <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{content}</div>;
  }
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const o = content as Record<string, unknown>;
    const one = typeof o.text === "string" ? o.text : typeof o.body === "string" ? o.body : null;
    if (one?.trim()) {
      return <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{one}</div>;
    }
    return <div className="mt-6">{unsupported}</div>;
  }
  if (content == null) {
    return (
      <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
        {t("learner.lessons.detail.contentLessonSparse")}
      </p>
    );
  }
  return <div className="mt-6">{unsupported}</div>;
}

type Props = { params: Promise<{ id: string }> };

export default async function LessonDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getProtectedRouteSession("(student).app.(learner).lessons.[id]");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const { t, messages, fallbackMessages } = await getLearnerMarketingBundle();
  const studySettings = await loadStudySettings(userId);

  if (entitlement === "error") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          {t("learner.lessons.detail.backToLessons")}
        </Link>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">{t("learner.lessons.detail.subscriberRequired")}</p>
        <SubscriptionPaywall context="lessons" />
      </div>
    );
  }

  const flags = getServerPremiumProtectionFlags();
  const email = (session?.user as { email?: string | null })?.email ?? null;
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");

  let learnerPath: string | null = null;
  if (userId) {
    const lpRow = await withDatabaseFallback(
      () => prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } }),
      null,
    );
    learnerPath = lpRow?.learnerPath ?? null;
  }

  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-pathways-catalog");

  const marketingLocale = await getMarketingLocaleForDefaultRoute();

  const resolved = await withDatabaseFallback(async () => {
    const learnerPathRow = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } })
      : null;
    const learnerPath = learnerPathRow?.learnerPath ?? null;

    const contentLesson = await prisma.contentItem.findFirst({
      where: { id, type: "lesson" },
      select: { id: true },
    });
    if (contentLesson) {
      const row = await prisma.contentItem.findFirst({
        where: { AND: [{ id }, { type: "lesson" }, lessonAccessWhere(entitlement)] },
        select: {
          id: true,
          title: true,
          summary: true,
          content: true,
          bodySystem: true,
        },
      });
      if (!row) return { kind: "out_of_plan" as const };
      return { kind: "content_ok" as const, row };
    }

    const pwRow = await prisma.pathwayLesson.findUnique({ where: { id } });
    if (pwRow) {
      const pathwayResolution = await resolveAppSubscriberPathwayLessonForDetail({
        entitlement,
        learnerPath,
        marketingLocale,
        pwRow,
      });
      if (pathwayResolution.kind === "out_of_plan") return { kind: "out_of_plan" as const };
      if (pathwayResolution.kind === "not_found") return { kind: "not_found" as const };
      return {
        kind: "pathway_ok" as const,
        record: pathwayResolution.record,
        pathwayId: pathwayResolution.pathwayId,
      };
    }

    const legacyLesson = await getLegacyContentMapLessonById(id);
    if (!legacyLesson) return { kind: "not_found" as const };
    if (!canAccessLegacyContentMapLesson(entitlement, id, legacyLesson)) {
      return { kind: "out_of_plan" as const };
    }
    return { kind: "legacy_ok" as const, lesson: legacyLesson };
  }, null);

  let resolvedLesson = resolved;
  if (resolvedLesson === null) {
    safeServerLog("page_lesson_detail", "db_unavailable_attempting_legacy_only", { id });
    const legacyLesson = await getLegacyContentMapLessonById(id);
    if (!legacyLesson) {
      resolvedLesson = { kind: "not_found" as const };
    } else if (!canAccessLegacyContentMapLesson(entitlement, id, legacyLesson)) {
      resolvedLesson = { kind: "out_of_plan" as const };
    } else {
      resolvedLesson = { kind: "legacy_ok" as const, lesson: legacyLesson };
    }
  }

  if (resolvedLesson.kind === "not_found") {
    safeServerLog("page_lesson_detail", "app_lesson_unavailable", {
      id,
      reason: "lesson_not_found_or_incomplete_load",
    });
    return <AppLessonUnavailable t={t} />;
  }

  if (resolvedLesson.kind === "out_of_plan") {
    safeServerLog("page_lesson_detail", "lesson_out_of_entitlement", { id });
    logBlockedAccess({
      surface: "page_lesson_detail",
      reason: "lesson_out_of_plan",
      lessonIdPrefix: id.slice(0, 8),
      userTier: String(entitlement.tier ?? ""),
      userCountry: String(entitlement.country ?? ""),
    });
    const meta = await withDatabaseFallback(
      async () =>
        prisma.contentItem.findFirst({
          where: { id, type: "lesson" },
          select: { tier: true, regionScope: true, status: true },
        }),
      null,
    );
    if (meta?.status === "published") {
      logEntitlementMismatch({
        surface: "page_lesson_detail",
        reason: "published_lesson_excluded_by_entitlement",
        lessonIdPrefix: id.slice(0, 8),
        contentTier: meta.tier ?? "",
        contentRegionScope: meta.regionScope ?? "",
      });
    }
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">{t("learner.lessons.detail.outOfPlan")}</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          {t("learner.lessons.detail.backToLessons")}
        </Link>
      </div>
    );
  }

  if (resolvedLesson.kind === "legacy_ok") {
    const title = cleanLessonTitleForDisplay(legacyContentMapLessonTitle(resolvedLesson.lesson, id));
    const anchorNorm = normalizeTopicKey(title);
    let legacyContinue = null;
    if (userId) {
      try {
        legacyContinue = await loadLessonContinueStudyNext(userId, entitlement, learnerPath, {
          variant: "legacy",
          lessonId: id,
          anchorNorm,
          topicCode: null,
        });
      } catch {
        legacyContinue = null;
      }
    }
    const legacyPathway = learnerPath?.trim() && getExamPathwayById(learnerPath.trim()) ? learnerPath.trim() : null;
    const legacyQuestionBankHref = legacyPathway
      ? pathwayHubAppQuestionsHref(legacyPathway)
      : "/app/account/study-preferences";

    return (
      <div className="nn-lesson-page">
        <header className="nn-lesson-page-header">
          <Link
            href="/app/lessons"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            ← {t("learner.lessons.detail.allLessons")}
          </Link>
          <h1
            className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            {title}
          </h1>
        </header>
        <div className="mt-8">
          <PremiumLessonShell
            userId={userId}
            userLabel={userLabel}
            flags={flags}
            scope={LearnerNoteScope.CONTENT_LESSON}
            contextId={id}
            sourceLabel={title}
          >
            <LegacyMonolithLessonBody lesson={resolvedLesson.lesson} />
          </PremiumLessonShell>
          {isStudyCoachEnabled() && (
            <CoachLessonHelper lessonTitle={title} topic={title} />
          )}
          <LessonContinueStudyNextBlock bundle={legacyContinue} />
          <div className="mt-10 flex flex-wrap gap-3 border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
            <Link
              href={legacyQuestionBankHref}
              className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--semantic-brand)", color: "#fff" }}
            >
              {t("learner.lessons.detail.ctaQuestionBank")}
            </Link>
            <Link
              href="/app/exams"
              className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-subtle)", color: "var(--semantic-text-secondary)", background: "var(--bg-card)" }}
            >
              {t("learner.lessons.detail.ctaTimedExam")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resolvedLesson.kind === "pathway_ok") {
    const record = resolvedLesson.record;
    const displayTitle = cleanLessonTitleForDisplay(record.title);
    const visibleRaw = visibleSectionsForLesson(record, true);
    const visible = filterLearnerPresentablePathwaySections(
      visibleRaw.filter((s) => shouldRenderPathwayLessonSection(s.kind)),
    );
    if (visible.length === 0) {
      safeServerLog("page_lesson_detail", "app_lesson_unavailable", {
        id,
        slug: record.slug,
        reason: "pathway_lesson_no_presentable_sections",
      });
      return <AppLessonUnavailable t={t} />;
    }
    const omitHy = new Set(record.omitHighYieldSectionIds ?? []);
    const displaySections = visible.filter((s) => !omitHy.has(s.id));
    if (displaySections.length === 0) {
      safeServerLog("page_lesson_detail", "app_lesson_unavailable", {
        id,
        slug: record.slug,
        reason: "pathway_lesson_no_sections_after_hy_omit",
      });
      return <AppLessonUnavailable t={t} />;
    }
    const editorialRhythmIndexBySectionId = new Map<string, number>();
    {
      let editorialRhythmCounter = 0;
      for (const s of displaySections) {
        if (lessonSectionSurface(s.kind) === "editorial") {
          editorialRhythmIndexBySectionId.set(s.id, editorialRhythmCounter);
          editorialRhythmCounter += 1;
        }
      }
    }
    const pathwayId = resolvedLesson.pathwayId;
    const lessonStudyLoopCompositionEntropy = randomUUID();
    const pathway = getExamPathwayById(pathwayId);
    const examFraming = getLearnerExamFraming(pathwayId);
    const combinedExplicitIds = explicitLessonStudyLoopCombinedSanitizedIds(
      record.preTestQuestionIds,
      record.postTestQuestionIds,
    );
    let explicitCombinedLoad: ExplicitLessonBankQuizCombinedLoad | undefined;
    if (pathway && entitlement.hasAccess && combinedExplicitIds.length > 0) {
      const resolved = await loadLessonBankQuizItemsByExamIdsWithDiagnostics({
        entitlement,
        countryCode: pathway.countryCode,
        ids: combinedExplicitIds,
        logContext: { pathwayId, lessonSlug: record.slug, side: "study_loop_combined" },
      });
      explicitCombinedLoad = {
        items: resolved.items,
        diagnostics: resolved.diagnostics,
      };
    }

    const useExplicitStudyLoopPack = shouldUseExplicitLessonStudyLoopPack({
      hasUserId: Boolean(userId),
      hasPathway: Boolean(pathway),
      lessonStudyLoopEnabled: studySettings.lessonStudyLoopEnabled,
      enablePrePostQuizzes: studySettings.enablePrePostQuizzes,
      resolvedCombinedExplicitItemCount: explicitCombinedLoad?.items.length ?? 0,
    });

    const bankLoopPackPromise =
      useExplicitStudyLoopPack && explicitCombinedLoad
        ? Promise.resolve(
            buildLessonStudyLoopBankPackFromPreloadedExplicitItems({
              preloadedItems: explicitCombinedLoad.items,
              lessonKey: `${pathwayId}:${record.slug}`,
              compositionEntropy: lessonStudyLoopCompositionEntropy,
            }),
          )
        : userId &&
            pathway &&
            studySettings.lessonStudyLoopEnabled &&
            studySettings.enablePrePostQuizzes
          ? loadLessonStudyLoopBankPack({
              pathway,
              lessonTitle: record.title,
              lessonTopic: record.topic,
              lessonTopicSlug: record.topicSlug,
              bodySystem: record.bodySystem,
              lessonSlug: record.slug,
              lessonKey: `${pathwayId}:${record.slug}`,
              compositionEntropy: lessonStudyLoopCompositionEntropy,
            })
          : Promise.resolve({
              items: [],
              questionIds: [],
              poolCount: 0,
              targetRequested: 0,
            });

    const bankAssessmentsPromise =
      pathway != null
        ? resolvePathwayLessonBankAssessments(
            pathway,
            record,
            entitlement,
            explicitCombinedLoad ? { explicitCombinedLoad } : undefined,
          )
        : Promise.resolve({ preTest: [], postTest: [] });

    const pathwayLessonLocale =
      record.localeMeta?.contentLocale?.trim() ||
      record.localeMeta?.requestedContentLocale?.trim() ||
      marketingLocale;

    const pathwayAdjacentPromise = loadPathwayLessonAdjacent(pathwayId, record.slug, pathwayLessonLocale).catch(() => ({
      prev: null,
      next: null,
    }));

    const [relatedQuestionStems, initialProgress, pathwayStudySnap, bankLoopPack, bankAssessments, pathwayAdjacentSlugs] =
      await Promise.all([
        pathway != null
          ? loadRelatedExamQuestionStemsForPathwayLesson({
              pathway,
              lessonSlug: record.slug,
              lessonTitle: record.title,
              lessonTopic: record.topic,
              lessonTopicSlug: record.topicSlug,
              bodySystem: record.bodySystem,
            })
          : Promise.resolve([]),
        userId
          ? loadPathwayLessonProgressForSlug(userId, pathwayId, record.slug).catch(() => "not_started" as const)
          : Promise.resolve("not_started" as const),
        userId
          ? buildLearnerStudySnapshot(userId, entitlement, learnerPath).catch(() => null)
          : Promise.resolve(null),
        bankLoopPackPromise,
        bankAssessmentsPromise,
        pathwayAdjacentPromise,
      ]);
    const studyNextHint =
      Boolean(
        pathwayStudySnap &&
          record.topicSlug &&
          lessonTopicMatchesTopPriority(record.topicSlug, pathwayStudySnap),
      );
    const pathwayCoachExcerpt = buildPathwayLessonCoachExcerpt(displaySections);
    const pathwayQuality = classifyPathwayLesson(record);
    const tier = entitlement.tier as TierCode | null;
    const lessonViewerTier =
      pathway != null ? contentTierForPathwayLessonRender(pathway, tier) : (tier ?? undefined);
    const lessonMeasurementSystem = pathway != null ? getMeasurementSystemForCountry(pathway.countryCode) : null;
    let pathwayContinue = null;
    if (userId && pathwayId) {
      try {
        pathwayContinue = await loadLessonContinueStudyNext(userId, entitlement, learnerPath, {
          variant: "pathway",
          lessonId: id,
          pathwayId,
          topicSlug: record.topicSlug,
        });
      } catch {
        pathwayContinue = null;
      }
    }
    const pathwayAdjacentApp = mapPathwayLessonAdjacentToAppHrefs(pathwayAdjacentSlugs);
    const pathwayPrevApp = pathwayAdjacentApp.prev
      ? { title: pathwayAdjacentApp.prev.title, href: pathwayAdjacentApp.prev.href }
      : null;
    const pathwayNextApp = pathwayAdjacentApp.next
      ? { title: pathwayAdjacentApp.next.title, href: pathwayAdjacentApp.next.href }
      : null;

    const examFramingLabel =
      examFraming.region !== "unknown" ? examFraming.examIdentityLabel : null;

    // Nav sections for quick-jump (aligned with rendered article sections)
    const navSections = displaySections.map((s) => ({
      id: s.id,
      heading: pathwayLessonSectionSurfaceHeading(s, pathway?.countryCode, t),
      kind: s.kind ?? null,
    }));

    const studyLoopBankActive =
      Boolean(userId) &&
      pathway != null &&
      studySettings.lessonStudyLoopEnabled &&
      studySettings.enablePrePostQuizzes &&
      bankLoopPack.items.length >= LESSON_STUDY_LOOP_MIN_QUESTIONS;

    const stemPreviewByQuestionId: Record<string, string> = {};
    for (const stem of relatedQuestionStems) {
      stemPreviewByQuestionId[stem.id] = stem.stemPreview;
    }

    let topicLinkedQuizPreload: Awaited<ReturnType<typeof loadLessonTopicLinkedQuizItems>>["items"] = [];
    if (pathway && entitlement.hasAccess && relatedQuestionStems.length > 0) {
      const topicQuizRes = await loadLessonTopicLinkedQuizItems({
        entitlement,
        countryCode: pathway.countryCode,
        stemIds: relatedQuestionStems.map((s) => s.id),
        logContext: { pathwayId, lessonSlug: record.slug },
      });
      topicLinkedQuizPreload = topicQuizRes.items;
    }

    const alliedExamTakeawaysLabel =
      pathway?.examFamily === ExamFamily.ALLIED && entitlement.alliedCareer
        ? getAlliedProfessionByProfessionKey(entitlement.alliedCareer)?.h1
        : undefined;

    const pathwayInteractiveModules = pathway ? getLessonInteractiveModules(record) : [];

    const hasCatalogPre =
      Boolean(pathway) &&
      studySettings.enablePrePostQuizzes &&
      !studyLoopBankActive &&
      Boolean(bankAssessments.preTest?.length);
    const hasCatalogPost =
      Boolean(pathway) &&
      studySettings.enablePrePostQuizzes &&
      !studyLoopBankActive &&
      Boolean(bankAssessments.postTest?.length);
    const assessmentHintParts: string[] = [];
    if (hasCatalogPre) assessmentHintParts.push(`Readiness ${bankAssessments.preTest!.length}`);
    if (hasCatalogPost) assessmentHintParts.push(`Retention ${bankAssessments.postTest!.length}`);
    const assessmentHint = assessmentHintParts.length > 0 ? assessmentHintParts.join(" · ") : null;

    const purposeLine = (() => {
      const tpc = record.topic?.trim();
      const pn = pathway?.shortName?.trim() ?? "your pathway";
      if (record.examRelevance === "high_yield" && tpc) {
        return `High-yield ${tpc} — structured for ${pn} so you read once, recall often, and drill in the same exam frame.`;
      }
      if (record.examRelevance === "specialty" && tpc) {
        return `${tpc} with specialty lens for ${pn}; use the flow below to preview, learn, then prove retention.`;
      }
      if (tpc) {
        return `Build confident, exam-scoped command of ${tpc} on ${pn} — read the spine, then lock it in with checks and drills.`;
      }
      return `Study this lesson in your ${pn} context — checks and drills stay on the same exam track.`;
    })();

    const pathwayLessonMainColumn = (
      <>
        <LessonNavButtons
          position="top"
          backHref="/app/lessons"
          backLabel={t("learner.lessons.detail.allLessons")}
          prevLesson={pathwayPrevApp}
          nextLesson={pathwayNextApp}
          previousLessonLabel={t("learner.lessons.detail.previousLesson")}
          nextLessonLabel={t("learner.lessons.detail.nextLesson")}
        />

        <LessonAssessmentFlow
          userId={userId}
          lessonId={id}
          pathwayId={pathwayId}
          lessonSlug={record.slug}
          topic={record.topic}
          initialProgress={initialProgress}
          preTest={pathway ? bankAssessments.preTest : record.preTest}
          postTest={pathway ? bankAssessments.postTest : record.postTest}
          assessmentsEnabled={studySettings.enablePrePostQuizzes}
          disableCatalogAssessments={studyLoopBankActive}
        >
          <PremiumLessonShell
            userId={userId}
            userLabel={userLabel}
            flags={flags}
            scope={LearnerNoteScope.PATHWAY_LESSON}
            contextId={id}
            pathwayId={pathwayId}
            topic={record.topic}
            sourceLabel={displayTitle}
            qualityNotice={<LessonQualityNotice tier={pathwayQuality.tier} wordCount={pathwayQuality.wordCount} />}
            compactSubscriberBanner
          >
            {pathway && record.memoryAnchor ? (
              <div className="mb-5">
                <PathwayLessonMemoryAnchorStrip text={record.memoryAnchor} />
              </div>
            ) : null}
            <article className="nn-lesson-article-flow">
              {displaySections.length > 0 ? (
                displaySections.map((section) => {
                  const surfaceHeading = pathwayLessonSectionSurfaceHeading(section, pathway?.countryCode, t);
                  const sectionBody =
                    pathway != null
                      ? pathwayLessonPremiumSectionBodyText(section, pathway.id, pathway.countryCode)
                      : typeof section.body === "string"
                        ? section.body
                        : "";
                  return (
                    <LessonSectionCard
                      key={section.id}
                      id={section.id}
                      heading={surfaceHeading}
                      kind={section.kind ?? null}
                      editorialRhythmIndex={editorialRhythmIndexBySectionId.get(section.id)}
                    >
                      {section.kind === "related_next_steps" && pathway ? (
                        <PathwayLessonNextStepsCards
                          pathwayId={pathway.id}
                          analyticsSurface="app_lesson"
                          practiceHref={buildAppQuestionBankTopicDrillHref(
                            pathway,
                            record.topic,
                            record.topicSlug ?? undefined,
                          )}
                          lessonsHref={`/app/lessons?pathwayId=${encodeURIComponent(pathway.id)}`}
                          flashcardsHref={pathwayHubAppFlashcardsHref(pathway.id, record.topicSlug)}
                          practiceLabel={t("learner.studyLoop.practiceThisTopicCta")}
                          lessonsLabel={t("learner.lessons.detail.nextStepsReviewLessons")}
                          flashcardsLabel={t("learner.studyLoop.sameTopicFlashcards")}
                        />
                      ) : (
                        <PathwayLessonSectionContent
                          text={sectionBody}
                          figures={section.figures}
                          examFocus={section.examFocus}
                          lessonWikiBasePath={pathway ? marketingPathwayLessonsIndexPath(pathway) : null}
                          viewerTier={lessonViewerTier}
                          measurementSystem={lessonMeasurementSystem ?? undefined}
                          sectionKind={section.kind ?? null}
                          emptyBodyMessage={t("learner.lessons.detail.sectionEmptyBody")}
                          figuresVisualLeadMessage={t("learner.lessons.detail.sectionFiguresVisualLead")}
                        />
                      )}
                      {userId ? (
                        <LessonSectionNoteInline
                          userId={userId}
                          sectionId={section.id}
                          sectionHeading={surfaceHeading}
                          scope="PATHWAY_LESSON"
                          pathwayId={pathwayId}
                          topic={record.topic}
                        />
                      ) : null}
                    </LessonSectionCard>
                  );
                })
              ) : null}
            </article>
            {pathway && pathwayInteractiveModules.length > 0 ? (
              <div className="mt-6 max-w-5xl">
                <PathwayLessonInteractiveModules
                  modules={pathwayInteractiveModules}
                  viewerTier={contentTierForPathwayLessonRender(pathway, tier)}
                  countryCode={pathway.countryCode}
                />
              </div>
            ) : null}
            {pathway && record.studyCommonTraps && record.studyCommonTraps.length > 0 ? (
              <div className="mt-6 max-w-5xl">
                <PathwayLessonCommonTrapsStrip items={record.studyCommonTraps} />
              </div>
            ) : null}
            {pathway && lessonHasExamTakeaways(record.studyTakeaways) ? (
              <div className="mt-6 max-w-5xl">
                <ExamTakeawaysBlock
                  pathway={pathway}
                  items={record.studyTakeaways}
                  position="bottom"
                  alliedProfessionLabel={alliedExamTakeawaysLabel}
                />
              </div>
            ) : null}
          </PremiumLessonShell>
        </LessonAssessmentFlow>

        <LessonNavButtons
          position="bottom"
          backHref="/app/lessons"
          backLabel={t("learner.lessons.detail.allLessons")}
          prevLesson={pathwayPrevApp}
          nextLesson={pathwayNextApp}
          previousLessonLabel={t("learner.lessons.detail.previousLesson")}
          nextLessonLabel={t("learner.lessons.detail.nextLesson")}
        />

        {isStudyCoachEnabled() && (
          <CoachLessonHelper
            lessonTitle={displayTitle}
            lessonContent={pathwayCoachExcerpt || undefined}
            topic={record.topic}
            studyNextHint={studyNextHint}
          />
        )}
        <LessonContinueStudyNextBlock bundle={pathwayContinue} />
        {pathway ? (
          <LessonTopicPracticeSection
            pathway={pathway}
            lessonTopic={record.topic}
            topicSlug={record.topicSlug}
            lessonSlug={record.slug}
            relatedQuestionStems={relatedQuestionStems}
            bankEntitlement={entitlement}
            fullQuizAccess={entitlement.hasAccess}
            userId={userId}
            appLinksMode="direct"
            preloadedQuizItems={topicLinkedQuizPreload}
          />
        ) : null}
      </>
    );

    return (
      <div className="nn-lesson-page nn-lesson-page--learner-app">
        <div className="nn-lesson-editorial-rail">
          <LessonPageHeader
            title={displayTitle}
            topic={record.topic}
            bodySystem={record.bodySystem}
            pathwayShortName={pathway?.shortName ?? null}
            examFramingLabel={examFramingLabel}
            sectionCount={displaySections.length > 0 ? displaySections.length : 1}
            examRelevance={record.examRelevance ?? null}
            audienceTiers={record.audienceTiers ?? null}
            progress={initialProgress}
            breadcrumbSlot={
              pathway ? (
                <BreadcrumbTrail
                  items={localizeBreadcrumbCrumbs(
                    learnerPathwayLessonBreadcrumbs(pathway, displayTitle),
                    messages,
                    fallbackMessages,
                  )}
                />
              ) : null
            }
            purposeLine={purposeLine}
            assessmentHint={assessmentHint}
          />
          {pathway ? (
            <PathwayLessonActions
              pathwayId={pathway.id}
              lessonSlug={record.slug}
              topicCode={record.topicSlug}
              topicLabel={record.topic}
              userId={userId}
              canMarkComplete={entitlement.hasAccess}
              initialProgress={initialProgress}
              catAdaptiveAvailable={pathwayAllowsCatAdaptiveStart(pathway)}
              allLessonsHrefOverride={`/app/lessons?pathwayId=${encodeURIComponent(pathway.id)}`}
            />
          ) : null}
        </div>

        <div className="nn-lesson-layout">
          <div className="nn-lesson-main min-w-0">
            <div className="nn-lesson-editorial-rail">
              {studyLoopBankActive ? (
                <PathwayLessonStudyLoopOrchestrator
                  userId={userId}
                  lessonId={id}
                  pathwayId={pathwayId}
                  lessonSlug={record.slug}
                  topic={record.topic}
                  shuffleSeed={`${pathwayId}:${record.slug}`}
                  bankItems={bankLoopPack.items}
                  questionIds={bankLoopPack.questionIds}
                  poolCount={bankLoopPack.poolCount}
                  initialProgress={initialProgress}
                  defaultLoopEnabled={studySettings.lessonStudyLoopEnabled}
                  stemPreviewByQuestionId={stemPreviewByQuestionId}
                >
                  {pathwayLessonMainColumn}
                </PathwayLessonStudyLoopOrchestrator>
              ) : (
                pathwayLessonMainColumn
              )}
            </div>
          </div>

          <LessonSectionNav sections={navSections} />
        </div>
      </div>
    );
  }

  const row = resolvedLesson.row;
  const displayTitle = cleanLessonTitleForDisplay(row.title);
  const contentQ = classifyContentItemLesson(row.content);
  const bs = row.bodySystem?.trim() ?? "";
  const anchorNorm = normalizeTopicKey(bs || displayTitle);
  const topicCode = bs.length > 0 ? normalizeTopicKey(bs) : null;
  let contentContinue = null;
  if (userId) {
    try {
      contentContinue = await loadLessonContinueStudyNext(userId, entitlement, learnerPath, {
        variant: "content",
        lessonId: id,
        anchorNorm,
        topicCode,
      });
    } catch {
      contentContinue = null;
    }
  }

  const topicLabelForDrill = bs || displayTitle;
  const pathwayForContentDrill = learnerPath ? getExamPathwayById(learnerPath) : null;
  const contentPracticeHref = pathwayForContentDrill
    ? buildAppQuestionBankTopicDrillHref(pathwayForContentDrill, topicLabelForDrill, topicCode ?? undefined)
    : (() => {
        const qs = new URLSearchParams();
        qs.set("preset", "topic_drill");
        if (anchorNorm.trim()) qs.set("topic", anchorNorm);
        if (topicCode) qs.set("topicCode", topicCode);
        return `/app/questions?${qs.toString()}`;
      })();

  return (
    <div className="nn-lesson-page">
      <header className="nn-lesson-page-header">
        <Link
          href="/app/lessons"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          ← {t("learner.lessons.detail.allLessons")}
        </Link>
        <h1
          className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          {displayTitle}
        </h1>
        {row.summary ? (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
            {row.summary}
          </p>
        ) : null}
      </header>
      <div className="mt-8">
        <PremiumLessonShell
          userId={userId}
          userLabel={userLabel}
          flags={flags}
          scope={LearnerNoteScope.CONTENT_LESSON}
          contextId={id}
          sourceLabel={displayTitle}
          qualityNotice={<LessonQualityNotice tier={contentQ.tier} wordCount={contentQ.wordCount} />}
        >
          <LessonBody content={row.content as unknown} t={t} />
        </PremiumLessonShell>
        {isStudyCoachEnabled() && (
          <CoachLessonHelper
            lessonTitle={displayTitle}
            topic={row.bodySystem?.trim() || undefined}
          />
        )}
        <LessonContinueStudyNextBlock bundle={contentContinue} />
        <div className="mt-10 flex flex-wrap gap-3 border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            href={contentPracticeHref}
            className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--semantic-brand)", color: "#fff" }}
          >
            {t("learner.lessons.detail.ctaQuestionBank")}
          </Link>
          <Link
            href="/app/exams"
            className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border-subtle)", color: "var(--semantic-text-secondary)", background: "var(--bg-card)" }}
          >
            {t("learner.lessons.detail.ctaTimedExam")}
          </Link>
        </div>
      </div>
    </div>
  );
}
