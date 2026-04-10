import Link from "next/link";
import { LearnerNoteScope, type TierCode } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
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

function LessonBody({ content }: { content: unknown }) {
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
          if (block && typeof block === "object" && "text" in block) {
            const t = (block as { text?: string }).text;
            if (typeof t === "string") {
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {t}
                </p>
              );
            }
          }
          return (
            <pre key={i} className="overflow-x-auto rounded-lg bg-[var(--theme-muted-surface)] p-3 text-xs">
              {JSON.stringify(block, null, 2)}
            </pre>
          );
        })}
      </div>
    );
  }
  if (typeof content === "string") {
    return <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{content}</div>;
  }
  return (
    <pre className="mt-6 overflow-x-auto rounded-lg bg-[var(--theme-muted-surface)] p-4 text-xs">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
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
      <main>
        <Link href="/app/lessons" className="text-sm font-medium text-primary hover:underline">
          {t("learner.lessons.detail.allLessons")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
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
        <LessonContinueStudyNextBlock bundle={legacyContinue} />
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          <Link
            href="/app/questions"
            className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
          >
            {t("learner.lessons.detail.ctaQuestionBank")}
          </Link>
          <Link
            href="/app/exams"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            {t("learner.lessons.detail.ctaTimedExam")}
          </Link>
        </div>
      </main>
    );
  }

  if (resolvedLesson.kind === "pathway_ok") {
    const record = resolvedLesson.record;
    const visible = visibleSectionsForLesson(record, true);
    const pathwayId = resolvedLesson.pathwayId;
    const pathway = getExamPathwayById(pathwayId);
    const examFraming = getLearnerExamFraming(pathwayId);
    const [relatedQuestionStems, relatedLessonsRaw] = await Promise.all([
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
        ? getRelatedPathwayLessons(pathway.id, record.topicSlug, record.slug, RELATED_PATHWAY_LESSONS_LIMIT)
        : Promise.resolve([]),
    ]);
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
    return (
      <main>
        <Link href="/app/lessons" className="text-sm font-medium text-primary hover:underline">
          {t("learner.lessons.detail.allLessons")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{record.title}</h1>
        {examFraming.region !== "unknown" ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Aligned to {examFraming.examIdentityLabel} expectations (study content; follow your regulator for authoritative scope).
          </p>
        ) : null}
        {record.seoDescription ? <p className="mt-2 text-sm text-muted">{record.seoDescription}</p> : null}
        <div className="mt-6">
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
            <article className="space-y-8">
              {visible.map((section) => (
                <section key={section.id} className="border-b border-border pb-8 last:border-0">
                  <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">
                    {section.heading?.trim() || t("learner.lessons.detail.sectionFallback")}
                  </h2>
                  <div className="mt-3">
                    <PathwayLessonBody
                      text={typeof section.body === "string" ? section.body : ""}
                      viewerTier={lessonViewerTier}
                      measurementSystem={lessonMeasurementSystem ?? undefined}
                    />
                  </div>
                </section>
              ))}
            </article>
          </PremiumLessonShell>
        </div>
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
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          <Link
            href={
              pathway
                ? buildAppQuestionBankTopicDrillHref(pathway, record.topic, record.topicSlug ?? undefined)
                : "/app/questions"
            }
            className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
          >
            {t("learner.lessons.detail.ctaQuestionBank")}
          </Link>
          <Link
            href={buildAppPracticeTestsHubHref(pathwayId)}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            {t("learner.lessons.detail.ctaPathwayPracticeTests")}
          </Link>
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
    <main>
      <Link href="/app/lessons" className="text-sm font-medium text-primary hover:underline">
        {t("learner.lessons.detail.allLessons")}
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{row.title}</h1>
      {row.summary ? <p className="mt-2 text-sm text-muted">{row.summary}</p> : null}
      <PremiumLessonShell
        userId={userId}
        userLabel={userLabel}
        flags={flags}
        scope={LearnerNoteScope.CONTENT_LESSON}
        contextId={id}
        sourceLabel={row.title}
        qualityNotice={<LessonQualityNotice tier={contentQ.tier} wordCount={contentQ.wordCount} />}
      >
        <LessonBody content={row.content as unknown} />
      </PremiumLessonShell>
      <LessonContinueStudyNextBlock bundle={contentContinue} />
      <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
        <Link
          href="/app/questions"
          className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
        >
          {t("learner.lessons.detail.ctaQuestionBank")}
        </Link>
        <Link href="/app/exams" className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
          {t("learner.lessons.detail.ctaTimedExam")}
        </Link>
      </div>
    </main>
  );
}
