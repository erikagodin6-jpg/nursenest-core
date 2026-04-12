import Link from "next/link";
import { ExamSessionErrorBoundary } from "@/components/exam/exam-session-error-boundary";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamPracticeClient } from "@/components/student/exam-practice-client";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { resolveDefaultExamForUser } from "@/lib/exams/resolve-default-exam";
import {
  EXAM_PN_MIXED_PRACTICE_2026_ID,
  EXAM_PRESET_PN_MIXED_2026_TAG,
  EXAM_PRESET_RN_MIXED_2026_TAG,
  EXAM_PRESET_US_PN_FULL_2026_TAG,
  EXAM_PRESET_US_RN_FULL_2026_TAG,
  EXAM_RN_MIXED_PRACTICE_2026_ID,
  EXAM_US_PN_FULL_2026_ID,
  EXAM_US_RN_FULL_2026_ID,
  FULL_EXAM_2026_QUESTION_TARGET,
  MIXED_PRACTICE_2026_EXAM_ID,
  MIXED_PRACTICE_2026_QUESTION_TARGET,
  MIXED_PRACTICE_2026_RN_PN_TAG,
} from "@/lib/exams/practice-exam-presets";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

const HISTORY_PAGE_SIZE = 15;
const MAX_HISTORY_PAGE_INDEX = 400;

function canUseRnFullExams(e: AccessScope): boolean {
  if (e.reason === "admin_override") return true;
  return e.tier === "RN" || e.tier === "NP";
}

function canUsePnFullExams(e: AccessScope): boolean {
  if (e.reason === "admin_override") return true;
  return e.tier === "RPN" || e.tier === "LVN_LPN" || e.tier === "RN" || e.tier === "NP";
}

type ExamsPageProps = { searchParams: Promise<{ historyPage?: string }> };

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const { t, locale } = await getLearnerMarketingBundle();
  const localeTag = locale.replace(/_/g, "-");
  const sp = await searchParams;
  let requestedHistoryPage = Math.max(1, Number(sp.historyPage ?? "1"));
  if (!Number.isFinite(requestedHistoryPage)) requestedHistoryPage = 1;
  requestedHistoryPage = Math.min(MAX_HISTORY_PAGE_INDEX, requestedHistoryPage);

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  const examCrumbs = appShellBreadcrumbs("exams");

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={examCrumbs} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={examCrumbs} />
        </div>
        <h1 className="text-3xl font-bold">{t("learner.exams.page.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("learner.exams.page.subtitle.locked")}</p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="exams"
            freemiumRemainingQuestions={snap?.questionRemaining ?? 0}
            freemiumRemainingLessons={snap?.lessonRemaining ?? 0}
          />
        </div>
        <FreemiumPreviewExhaustedSurface kind="exams" />
      </main>
    );
  }

  const attemptsLoad = await withDatabaseFallback(
    async () => {
      const totalAttempts = await prisma.examAttempt.count({ where: { userId } });
      const totalPages = Math.max(1, Math.ceil(totalAttempts / HISTORY_PAGE_SIZE));
      const historyPage = Math.min(requestedHistoryPage, totalPages);
      const [latestAttempt, attemptsPage] = await Promise.all([
        prisma.examAttempt.findFirst({
          where: { userId },
          select: { id: true, score: true, total: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.examAttempt.findMany({
          where: { userId },
          select: { id: true, score: true, total: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          skip: (historyPage - 1) * HISTORY_PAGE_SIZE,
          take: HISTORY_PAGE_SIZE,
        }),
      ]);
      return { latestAttempt, attemptsPage, totalAttempts, historyPage, totalPages };
    },
    null,
  );

  if (attemptsLoad === null) {
    safeServerLog("page_exams", "attempts_find_failed", {});
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={examCrumbs} />
        </div>
        <h1 className="text-3xl font-bold">{t("learner.exams.page.title")}</h1>
        <p className="nn-card mt-4 p-6 text-sm text-muted">{t("learner.exams.page.historyLoadFailed")}</p>
      </main>
    );
  }

  const { latestAttempt, attemptsPage, totalAttempts, historyPage, totalPages } = attemptsLoad;

  const last = latestAttempt;
  const pct = last && last.total > 0 ? Math.round((last.score / last.total) * 100) : null;

  const historyFrom = totalAttempts === 0 ? 0 : (historyPage - 1) * HISTORY_PAGE_SIZE + 1;
  const historyTo = totalAttempts === 0 ? 0 : Math.min(historyPage * HISTORY_PAGE_SIZE, totalAttempts);

  const defaultExam = userId ? await resolveDefaultExamForUser(userId) : null;

  return (
    <main className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail items={examCrumbs} />
      </div>
      <div className="nn-learner-page-hero">
        <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.exams.page.title")}</h1>
        <p className="mt-2 text-[var(--semantic-text-secondary)]">{t("learner.exams.page.subscriberIntro")}</p>
      </div>
      <LearnerStudyQuickLinksCard t={t} id="exams-study-quick-links" />
      {pct !== null ? (
        <p className="mt-3 text-sm font-medium text-foreground">
          {t("learner.exams.page.latestAttempt", { score: last?.score ?? 0, total: last?.total ?? 0, pct })}{" "}
          {pct >= 75 ? t("learner.exams.page.latestStrong") : t("learner.exams.page.latestWeak")}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">{t("learner.exams.page.noAttempts")}</p>
      )}
      <aside className="nn-card border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[var(--semantic-info-soft)] p-4 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
        <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.exams.page.reportCardTitle")}</p>
        <p className="mt-1">{t("learner.exams.page.reportCardBody")}</p>
      </aside>

      {defaultExam ? (
        <ExamSessionErrorBoundary surface="exam_default">
          <ExamPracticeClient userId={userId} examId={defaultExam.id} examTitle={defaultExam.title} />
        </ExamSessionErrorBoundary>
      ) : (
        <aside className="nn-card border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] p-4 text-sm text-[var(--semantic-warning-contrast)] shadow-[var(--semantic-shadow-soft)]">
          <p className="font-semibold">{t("learner.exams.page.defaultExamTitle")}</p>
          <p className="mt-1 opacity-95">{t("learner.exams.page.defaultExamBody")}</p>
          <Link href="/app/questions" className="mt-3 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2">
            {t("learner.exams.page.openQuestionBankArrow")}
          </Link>
        </aside>
      )}

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">{t("learner.exams.preset.mixedClinical.title", { count: MIXED_PRACTICE_2026_QUESTION_TARGET })}</h2>
        <p className="text-sm text-muted">{t("learner.exams.preset.mixedClinical.body")}</p>
        <ExamSessionErrorBoundary surface="exam_mixed2026">
        <ExamPracticeClient
          userId={userId}
          examId={MIXED_PRACTICE_2026_EXAM_ID}
          examTitle={t("learner.exams.examTitle.mixedClinical")}
          questionTag={MIXED_PRACTICE_2026_RN_PN_TAG}
          sessionNamespace="mixed2026"
        />
        </ExamSessionErrorBoundary>
      </section>

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">{t("learner.exams.preset.rnMixed.title", { count: MIXED_PRACTICE_2026_QUESTION_TARGET })}</h2>
        <p className="text-sm text-muted">{t("learner.exams.preset.rnMixed.body")}</p>
        <ExamSessionErrorBoundary surface="exam_rnMixed2026">
        <ExamPracticeClient
          userId={userId}
          examId={EXAM_RN_MIXED_PRACTICE_2026_ID}
          examTitle={t("learner.exams.examTitle.rnMixed")}
          questionTag={EXAM_PRESET_RN_MIXED_2026_TAG}
          sessionNamespace="rnMixed2026"
        />
        </ExamSessionErrorBoundary>
      </section>

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">{t("learner.exams.preset.pnMixed.title", { count: MIXED_PRACTICE_2026_QUESTION_TARGET })}</h2>
        <p className="text-sm text-muted">{t("learner.exams.preset.pnMixed.body")}</p>
        <ExamSessionErrorBoundary surface="exam_pnMixed2026">
        <ExamPracticeClient
          userId={userId}
          examId={EXAM_PN_MIXED_PRACTICE_2026_ID}
          examTitle={t("learner.exams.examTitle.pnMixed")}
          questionTag={EXAM_PRESET_PN_MIXED_2026_TAG}
          sessionNamespace="pnMixed2026"
        />
        </ExamSessionErrorBoundary>
      </section>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            {t("learner.exams.preset.fullSection.title", { count: FULL_EXAM_2026_QUESTION_TARGET })}
          </h2>
          <p className="mt-1 text-sm text-muted">{t("learner.exams.preset.fullSection.intro")}</p>
        </div>

        {canUseRnFullExams(entitlement) ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t("learner.exams.preset.rnFull.title")}</h3>
            <p className="text-sm text-muted">{t("learner.exams.preset.rnFull.body")}</p>
            <ExamSessionErrorBoundary surface="exam_usRnFull2026">
            <ExamPracticeClient
              userId={userId}
              examId={EXAM_US_RN_FULL_2026_ID}
              examTitle={t("learner.exams.examTitle.rnFull")}
              questionTag={EXAM_PRESET_US_RN_FULL_2026_TAG}
              sessionNamespace="usRnFull2026"
            />
            </ExamSessionErrorBoundary>
          </div>
        ) : null}

        {canUsePnFullExams(entitlement) ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t("learner.exams.preset.pnFull.title")}</h3>
            <p className="text-sm text-muted">{t("learner.exams.preset.pnFull.body")}</p>
            <ExamSessionErrorBoundary surface="exam_usPnFull2026">
            <ExamPracticeClient
              userId={userId}
              examId={EXAM_US_PN_FULL_2026_ID}
              examTitle={t("learner.exams.examTitle.pnFull")}
              questionTag={EXAM_PRESET_US_PN_FULL_2026_TAG}
              sessionNamespace="usPnFull2026"
            />
            </ExamSessionErrorBoundary>
          </div>
        ) : null}
      </section>

      {totalAttempts > 0 ? (
        <p className="mt-4 text-sm text-muted">
          {t("learner.exams.page.historyLine", {
            from: historyFrom,
            to: historyTo,
            total: totalAttempts,
            attemptWord:
              totalAttempts === 1 ? t("learner.exams.page.attemptSingular") : t("learner.exams.page.attemptPlural"),
            pageSuffix:
              totalPages > 1
                ? t("learner.exams.page.historyPageSuffix", { current: historyPage, pages: totalPages })
                : "",
          })}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {attemptsPage.map((attempt) => (
          <article className="nn-card p-4" key={attempt.id}>
            <p className="font-semibold">
              {t("examAttempt.scoreLine", { score: attempt.score, total: attempt.total })}
            </p>
            <p className="text-sm text-muted">
              {attempt.createdAt.toLocaleString(localeTag, { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="mt-6 flex flex-wrap items-center gap-3 text-sm" aria-label={t("learner.exams.page.historyNavAria")}>
          {historyPage > 1 ? (
            <Link
              href={`/app/exams?historyPage=${historyPage - 1}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {t("learner.exams.page.historyNewer")}
            </Link>
          ) : null}
          {historyPage < totalPages ? (
            <Link
              href={`/app/exams?historyPage=${historyPage + 1}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {t("learner.exams.page.historyOlder")}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
