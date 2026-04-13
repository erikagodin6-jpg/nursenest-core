import Link from "next/link";
import { LearnerNoteScope, type TierCode } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PremiumLessonShell } from "@/components/student/premium-lesson-shell";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { logBlockedAccess, logEntitlementMismatch } from "@/lib/entitlements/entitlement-logging";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { appPathwayLessonVisibleToSubscriber } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-access";
import { filterLearnerPresentablePathwaySections } from "@/lib/lessons/lesson-section-presentability";
import {
  canAccessLegacyContentMapLesson,
  getLegacyContentMapLessonById,
  legacyContentMapLessonTitle,
} from "@/lib/lessons/legacy-content-map-lessons";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { getPathwayLesson } from "@/lib/lessons/pathway-lesson-loader";
import { LegacyMonolithLessonBody } from "@/components/lessons/legacy-monolith-lesson-body";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { classifyContentItemLesson, classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LessonContinueStudyNextBlock } from "@/components/student/lesson-continue-study-next-block";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { loadLessonContinueStudyNext } from "@/lib/learner/lesson-context-study-next";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { getLearnerExamFraming } from "@/lib/learner/learner-exam-framing";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import { PathwayLessonRelatedQuestions } from "@/components/lessons/pathway-lesson-related-questions";
import { PathwayLessonStudyLoopCta } from "@/components/lessons/pathway-lesson-study-loop-cta";
import { buildAppQuestionBankTopicDrillHref } from "@/components/lessons/pathway-lesson-link-practice";
import { buildAppPracticeTestsHubHref } from "@/lib/learner/study-loop-recommendations";
import {
  getRelatedPathwayLessons,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import {
  mergeRelatedLessonDisplayList,
  pathwayLessonHasRenderableHubSlug,
} from "@/lib/lessons/pathway-lesson-types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { CoachLessonHelper } from "@/components/study/coach-lesson-helper";
import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { lessonTopicMatchesTopPriority } from "@/lib/coach/study-coach-lesson-priority";
import { buildPathwayLessonCoachExcerpt } from "@/lib/coach/build-pathway-lesson-coach-excerpt";
import { loadPathwayLessonProgressForSlug } from "@/lib/lessons/pathway-lesson-progress";
import { LessonAssessmentFlow } from "@/components/lessons/lesson-assessment-flow";
import { LessonSectionNoteInline } from "@/components/lessons/lesson-section-note-inline";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { LessonPageHeader } from "@/components/lessons/lesson-page-header";
import { LessonSectionNav } from "@/components/lessons/lesson-section-nav";
import { LessonNavButtons } from "@/components/lessons/lesson-nav-buttons";

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
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const { t } = await getLearnerMarketingBundle();

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          {t("learner.lessons.detail.backToLessons")}
        </Link>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">{t("learner.lessons.detail.subscriberRequired")}</p>
        <SubscriptionPaywall context="lessons" />
      </main>
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
      if (!appPathwayLessonVisibleToSubscriber(entitlement, pwRow, learnerPath)) {
        return { kind: "out_of_plan" as const };
      }
      const record = await getPathwayLesson(pwRow.pathwayId, pwRow.slug, marketingLocale);
      if (!record) return { kind: "not_found" as const };
      return { kind: "pathway_ok" as const, record, pathwayId: pwRow.pathwayId };
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
    safeServerLog("page_lesson_detail", "lesson_not_found", { id });
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">{t("learner.lessons.detail.notFound")}</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          {t("learner.lessons.detail.backToLessons")}
        </Link>
      </main>
    );
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
      <main className="space-y-4">
        <p className="text-sm text-muted">{t("learner.lessons.detail.outOfPlan")}</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          {t("learner.lessons.detail.backToLessons")}
        </Link>
      </main>
    );
  }

  if (resolvedLesson.kind === "legacy_ok") {
    const title = legacyContentMapLessonTitle(resolvedLesson.lesson, id);
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
    return (
      <main className="nn-lesson-page">
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
              href="/app/questions"
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
      </main>
    );
  }

  if (resolvedLesson.kind === "pathway_ok") {
    const record = resolvedLesson.record;
    const visibleRaw = visibleSectionsForLesson(record, true);
    const visible = filterLearnerPresentablePathwaySections(visibleRaw);
    const pathwayId = resolvedLesson.pathwayId;
    const pathway = getExamPathwayById(pathwayId);
    const examFraming = getLearnerExamFraming(pathwayId);
    const [relatedQuestionStems, relatedLessonsRaw, initialProgress, pathwayStudySnap] = await Promise.all([
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
      pathway != null
        ? getRelatedPathwayLessons(
            pathway.id,
            record.topicSlug,
            record.slug,
            RELATED_PATHWAY_LESSONS_LIMIT,
            record.localeMeta?.contentLocale ?? record.localeMeta?.requestedContentLocale,
            record.bodySystem,
          )
        : Promise.resolve([]),
      userId
        ? loadPathwayLessonProgressForSlug(userId, pathwayId, record.slug).catch(() => "not_started" as const)
        : Promise.resolve("not_started" as const),
      userId
        ? buildLearnerStudySnapshot(userId, entitlement, learnerPath).catch(() => null)
        : Promise.resolve(null),
    ]);
    const studyNextHint =
      Boolean(
        pathwayStudySnap &&
          record.topicSlug &&
          lessonTopicMatchesTopPriority(record.topicSlug, pathwayStudySnap),
      );
    const pathwayCoachExcerpt = buildPathwayLessonCoachExcerpt(visible);
    const relatedLessonsDisplay = mergeRelatedLessonDisplayList(
      record.relatedLessonRefs,
      relatedLessonsRaw.filter(pathwayLessonHasRenderableHubSlug),
      RELATED_PATHWAY_LESSONS_LIMIT,
    );
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
    // Derive next lesson for navigation (prefer adaptive continue, fall back to first related)
    const nextLessonNav = (() => {
      if (pathwayContinue?.primary) {
        return { title: pathwayContinue.primary.title, href: pathwayContinue.primary.href };
      }
      const first = relatedLessonsDisplay[0];
      if (first && pathway) {
        const base = marketingPathwayLessonsIndexPath(pathway);
        return { title: first.title, href: `${base}/${first.slug}` };
      }
      return null;
    })();

    const examFramingLabel =
      examFraming.region !== "unknown" ? examFraming.examIdentityLabel : null;

    // Nav sections for quick-jump (aligned with rendered article sections)
    const navSections = visible.map((s) => ({
      id: s.id,
      heading: s.heading?.trim() ?? "",
      kind: s.kind ?? null,
    }));

    return (
      <main className="nn-lesson-page">
        {/* ── Premium lesson header ──────────────────────────────────────── */}
        <LessonPageHeader
          title={record.title}
          topic={record.topic}
          bodySystem={record.bodySystem}
          topicSlug={record.topicSlug}
          pathwayId={pathwayId}
          examFramingLabel={examFramingLabel}
          sectionCount={visible.length > 0 ? visible.length : visibleRaw.length > 0 ? 1 : 0}
          examRelevance={record.examRelevance ?? null}
          audienceTiers={record.audienceTiers ?? null}
          progress={initialProgress}
        />

        {/* ── Two-column layout: article + sticky sidebar ────────────────── */}
        <div className="nn-lesson-layout mt-8">
          {/* ── Main article column ─────────────────────────────────────── */}
          <div className="nn-lesson-main min-w-0">
            {/* Top nav: back link */}
            <LessonNavButtons
              position="top"
              backHref="/app/lessons"
              backLabel={t("learner.lessons.detail.allLessons")}
              nextLesson={null}
            />

            {/* Pre/post assessment flow wraps the lesson article */}
            <LessonAssessmentFlow
              userId={userId}
              lessonId={id}
              pathwayId={pathwayId}
              lessonSlug={record.slug}
              topic={record.topic}
              initialProgress={initialProgress}
              preTest={record.preTest}
              postTest={record.postTest}
            >
              <PremiumLessonShell
                userId={userId}
                userLabel={userLabel}
                flags={flags}
                scope={LearnerNoteScope.PATHWAY_LESSON}
                contextId={id}
                pathwayId={pathwayId}
                topic={record.topic}
                sourceLabel={record.title}
                qualityNotice={<LessonQualityNotice tier={pathwayQuality.tier} wordCount={pathwayQuality.wordCount} />}
              >
                <article className="space-y-6">
                  {visible.length > 0 ? (
                    visible.map((section) => (
                      <LessonSectionCard
                        key={section.id}
                        id={section.id}
                        heading={section.heading?.trim() || t("learner.lessons.detail.sectionFallback")}
                        kind={section.kind ?? null}
                      >
                        <PathwayLessonSectionContent
                          text={typeof section.body === "string" ? section.body : ""}
                          figures={section.figures}
                          examFocus={section.examFocus}
                          viewerTier={lessonViewerTier}
                          measurementSystem={lessonMeasurementSystem ?? undefined}
                          emptyBodyMessage={t("learner.lessons.detail.sectionEmptyBody")}
                          figuresVisualLeadMessage={t("learner.lessons.detail.sectionFiguresVisualLead")}
                        />
                        {userId ? (
                          <LessonSectionNoteInline
                            userId={userId}
                            sectionId={section.id}
                            sectionHeading={section.heading?.trim() ?? ""}
                            scope="PATHWAY_LESSON"
                            pathwayId={pathwayId}
                            topic={record.topic}
                          />
                        ) : null}
                      </LessonSectionCard>
                    ))
                  ) : visibleRaw.length > 0 ? (
                    <LessonSectionCard
                      id="lesson-reading-refine"
                      heading={t("learner.lessons.detail.lessonArticleRefiningTitle")}
                      kind={null}
                    >
                      <p className="text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
                        {t("learner.lessons.detail.lessonArticleRefiningBody")}
                      </p>
                    </LessonSectionCard>
                  ) : null}
                </article>
              </PremiumLessonShell>
            </LessonAssessmentFlow>

            {/* Bottom prev/next navigation */}
            <LessonNavButtons
              position="bottom"
              backHref="/app/lessons"
              backLabel={t("learner.lessons.detail.allLessons")}
              nextLesson={nextLessonNav}
            />

            {isStudyCoachEnabled() && (
              <CoachLessonHelper
                lessonTitle={record.title}
                lessonContent={pathwayCoachExcerpt || undefined}
                topic={record.topic}
                studyNextHint={studyNextHint}
              />
            )}
            <LessonContinueStudyNextBlock bundle={pathwayContinue} />
            {pathway ? (
              <PathwayLessonRelatedQuestions
                pathway={pathway}
                lessonTopic={record.topic}
                topicSlug={record.topicSlug}
                items={relatedQuestionStems}
                appLinksMode="direct"
              />
            ) : null}
            {pathway ? (
              <PathwayLessonStudyLoopCta
                pathway={pathway}
                lessonsBasePath={marketingPathwayLessonsIndexPath(pathway)}
                topicLabel={record.topic}
                topicSlug={record.topicSlug}
                relatedLessons={relatedLessonsDisplay}
                currentSlug={record.slug}
                catAuthState="signed_in"
              />
            ) : null}
            <div
              className="mt-10 flex flex-wrap gap-3 border-t pt-6"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <Link
                href={
                  pathway
                    ? buildAppQuestionBankTopicDrillHref(pathway, record.topic, record.topicSlug ?? undefined)
                    : "/app/questions"
                }
                className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--semantic-brand)", color: "#fff" }}
              >
                {t("learner.lessons.detail.ctaQuestionBank")}
              </Link>
              <Link
                href={buildAppPracticeTestsHubHref(pathwayId)}
                className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--semantic-text-secondary)",
                  background: "var(--bg-card)",
                }}
              >
                {t("learner.lessons.detail.ctaPathwayPracticeTests")}
              </Link>
            </div>
          </div>

          {/* ── Sticky section nav sidebar (desktop only) ─────────────── */}
          <LessonSectionNav sections={navSections} />
        </div>
      </main>
    );
  }

  const row = resolvedLesson.row;
  const contentQ = classifyContentItemLesson(row.content);
  const bs = row.bodySystem?.trim() ?? "";
  const anchorNorm = normalizeTopicKey(bs || row.title);
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

  return (
    <main className="nn-lesson-page">
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
          {row.title}
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
          sourceLabel={row.title}
          qualityNotice={<LessonQualityNotice tier={contentQ.tier} wordCount={contentQ.wordCount} />}
        >
          <LessonBody content={row.content as unknown} t={t} />
        </PremiumLessonShell>
        {isStudyCoachEnabled() && (
          <CoachLessonHelper
            lessonTitle={row.title}
            topic={row.bodySystem?.trim() || undefined}
          />
        )}
        <LessonContinueStudyNextBlock bundle={contentContinue} />
        <div className="mt-10 flex flex-wrap gap-3 border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            href="/app/questions"
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
    </main>
  );
}
