import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamPracticeClient } from "@/components/student/exam-practice-client";
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
  const { t } = await getLearnerMarketingBundle();
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
          />
        </div>
        <section className="nn-card mt-6 p-4 text-sm text-muted">
          <p className="font-semibold text-foreground">{t("learner.exams.page.afterSubscribe.title")}</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>{t("learner.exams.page.afterSubscribe.li1")}</li>
            <li>{t("learner.exams.page.afterSubscribe.li2")}</li>
            <li>{t("learner.exams.page.afterSubscribe.li3")}</li>
          </ul>
        </section>
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
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={examCrumbs} />
      </div>
      <h1 className="text-3xl font-bold">{t("learner.exams.page.title")}</h1>
      <p className="mt-2 text-muted">{t("learner.exams.page.subscriberIntro")}</p>
      {pct !== null ? (
        <p className="mt-3 text-sm font-medium text-foreground">
          {t("learner.exams.page.latestAttempt", { score: last?.score ?? 0, total: last?.total ?? 0, pct })}{" "}
          {pct >= 75 ? t("learner.exams.page.latestStrong") : t("learner.exams.page.latestWeak")}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">{t("learner.exams.page.noAttempts")}</p>
      )}
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">{t("learner.exams.page.reportCardTitle")}</p>
        <p className="mt-1">{t("learner.exams.page.reportCardBody")}</p>
      </aside>

      {defaultExam ? (
        <ExamPracticeClient examId={defaultExam.id} examTitle={defaultExam.title} />
      ) : (
        <aside className="nn-card mt-4 border-amber-200/80 bg-amber-50/50 p-4 text-sm text-foreground">
          <p className="font-semibold">{t("learner.exams.page.defaultExamTitle")}</p>
          <p className="mt-1 text-muted">{t("learner.exams.page.defaultExamBody")}</p>
          <Link href="/app/questions" className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-2">
            {t("learner.exams.page.openQuestionBankArrow")}
          </Link>
        </aside>
      )}

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">Mixed clinical practice (20 questions)</h2>
        <p className="text-sm text-muted">
          Shuffled US NCLEX-style items across RN and PN tiers (20 items). Tag{" "}
          <span className="font-mono text-xs">{MIXED_PRACTICE_2026_RN_PN_TAG}</span>. Apply the materialized batch after migrate:{" "}
          <code className="rounded bg-muted px-1 text-xs">npx tsx scripts/apply-materialized-rn-pn-batch.ts</code>.
        </p>
        <ExamPracticeClient
          examId={MIXED_PRACTICE_2026_EXAM_ID}
          examTitle="Mixed clinical (RN/PN batch)"
          questionTag={MIXED_PRACTICE_2026_RN_PN_TAG}
          sessionNamespace="mixed2026"
        />
      </section>

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">RN mixed practice (20 questions)</h2>
        <p className="text-sm text-muted">
          Shuffled draw from items tagged with the RN preset batch. RN-tier subscribers only. Tag{" "}
          <span className="font-mono text-xs">{EXAM_PRESET_RN_MIXED_2026_TAG}</span>.
        </p>
        <ExamPracticeClient
          examId={EXAM_RN_MIXED_PRACTICE_2026_ID}
          examTitle="RN mixed practice"
          questionTag={EXAM_PRESET_RN_MIXED_2026_TAG}
          sessionNamespace="rnMixed2026"
        />
      </section>

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">PN mixed practice (20 questions)</h2>
        <p className="text-sm text-muted">
          Shuffled draw from items tagged with the PN preset batch (PN ladder tiers). Tag{" "}
          <span className="font-mono text-xs">{EXAM_PRESET_PN_MIXED_2026_TAG}</span>.
        </p>
        <ExamPracticeClient
          examId={EXAM_PN_MIXED_PRACTICE_2026_ID}
          examTitle="PN mixed practice"
          questionTag={EXAM_PRESET_PN_MIXED_2026_TAG}
          sessionNamespace="pnMixed2026"
        />
      </section>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Full NCLEX practice ({FULL_EXAM_2026_QUESTION_TARGET} questions)</h2>
          <p className="mt-1 text-sm text-muted">
            Mixed-topic draws with balanced difficulty bands, then a final shuffle. RN full exams emphasize prioritization,
            unstable clients, and delegation; PN full exams emphasize stable clients, tasks, and scope. RN/NP subscribers can
            still open PN full practice via the tier ladder.
          </p>
        </div>

        {canUseRnFullExams(entitlement) ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">NCLEX-RN full</h3>
            <p className="text-sm text-muted">
              Tag <span className="font-mono text-xs">{EXAM_PRESET_US_RN_FULL_2026_TAG}</span>.
            </p>
            <ExamPracticeClient
              examId={EXAM_US_RN_FULL_2026_ID}
              examTitle="NCLEX-RN full practice"
              questionTag={EXAM_PRESET_US_RN_FULL_2026_TAG}
              sessionNamespace="usRnFull2026"
            />
          </div>
        ) : null}

        {canUsePnFullExams(entitlement) ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">NCLEX-PN full</h3>
            <p className="text-sm text-muted">
              Tag <span className="font-mono text-xs">{EXAM_PRESET_US_PN_FULL_2026_TAG}</span>.
            </p>
            <ExamPracticeClient
              examId={EXAM_US_PN_FULL_2026_ID}
              examTitle="NCLEX-PN full practice"
              questionTag={EXAM_PRESET_US_PN_FULL_2026_TAG}
              sessionNamespace="usPnFull2026"
            />
          </div>
        ) : null}
      </section>

      {totalAttempts > 0 ? (
        <p className="mt-4 text-sm text-muted">
          History: showing {historyFrom}–{historyTo} of {totalAttempts} attempt{totalAttempts === 1 ? "" : "s"}
          {totalPages > 1 ? ` (page ${historyPage} of ${totalPages})` : ""}.
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {attemptsPage.map((attempt) => (
          <article className="nn-card p-4" key={attempt.id}>
            <p className="font-semibold">
              Score: {attempt.score}/{attempt.total}
            </p>
            <p className="text-sm text-muted">{attempt.createdAt.toISOString()}</p>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="mt-6 flex flex-wrap items-center gap-3 text-sm" aria-label="Attempt history pages">
          {historyPage > 1 ? (
            <Link
              href={`/app/exams?historyPage=${historyPage - 1}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              ← Newer attempts
            </Link>
          ) : null}
          {historyPage < totalPages ? (
            <Link
              href={`/app/exams?historyPage=${historyPage + 1}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              Older attempts →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
