import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PostTestStudyNextCard } from "@/components/student/post-test-study-next-card";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadExamAttemptDetailForSubscriber } from "@/lib/exams/load-exam-attempt-detail";
import { MARKETING_LOCALE_COOKIE, normalizePreferredMarketingLocale } from "@/lib/i18n/marketing-locale-cookie";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";

export const dynamic = "force-dynamic";

function formatDuration(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "—";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

type Props = { params: Promise<{ id: string }> };

export default async function ExamAttemptReportPage({ params }: Props) {
  const { id } = await params;
  const jar = await cookies();
  const locale = normalizePreferredMarketingLocale(jar.get(MARKETING_LOCALE_COOKIE)?.value);
  const [m, en] = await Promise.all([loadMarketingMessages(locale), loadMarketingMessages("en")]);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const session = await getProtectedRouteSession("(student).app.(learner).exams.attempts.[id]");
  const userId = (session?.user as { id?: string })?.id ?? "";
  if (!userId) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">{t("examAttempt.signInPrompt")}</p>
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return (
      <div>
        <p className="text-sm text-muted-foreground">{t("examAttempt.accessError")}</p>
      </div>
    );
  }
  if (!entitlement.hasAccess) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">{t("examAttempt.subscriberOnly")}</p>
        <Link href="/pricing" className="mt-2 inline-block text-sm font-semibold text-primary underline">
          {t("examAttempt.viewPlansCta")}
        </Link>
      </div>
    );
  }

  const data = await loadExamAttemptDetailForSubscriber(userId, entitlement, id);
  if (!data) notFound();

  const crumbs: BreadcrumbCrumb[] = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.practiceExams"), href: "/app/exams" },
    { name: t("examAttempt.reportTitle"), href: undefined },
  ];

  const r = data.review;
  const pct = r?.accuracyPct != null ? String(r.accuracyPct) : null;

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <p className="text-sm text-muted-foreground">{data.attempt.examTitle}</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{t("examAttempt.recorded")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {pct != null
            ? t("examAttempt.scoreWithPct", { score: data.attempt.score, total: data.attempt.total, pct })
            : t("examAttempt.scoreLine", { score: data.attempt.score, total: data.attempt.total })}
        </p>
        {r?.elapsedMs != null ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("examAttempt.timeLabel", { time: formatDuration(r.elapsedMs) })}
            {r.timedMode && r.timeLimitSec != null
              ? ` · ${t("examAttempt.timeLimitLabel", { time: formatDuration(r.timeLimitSec * 1000) })}`
              : null}
          </p>
        ) : null}
      </div>

      {r?.byTopic && Object.keys(r.byTopic).length > 0 ? (
        <div className="nn-card space-y-2 p-4">
          <p className="text-sm font-medium text-foreground">{t("examAttempt.byTopicHeading")}</p>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-muted-foreground">
            {Object.entries(r.byTopic).map(([topic, row]) => (
              <li key={topic}>
                <span className="text-foreground">{topic}</span>: {row.correct}/{row.total}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {(() => {
        const weak = r?.weakAreas?.filter(Boolean) ?? [];
        const struggleTopics = weak.slice(0, 3).join(", ");
        const primaryNext = data.studyNext?.primary?.title?.trim() || "";
        const topWeak = weak[0]?.trim() || "";
        if (!struggleTopics && !primaryNext && !topWeak) return null;
        return (
          <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-3">
            {struggleTopics ? (
              <p className="text-sm text-foreground/90">{t("learner.sessionInsight.struggle", { topics: struggleTopics })}</p>
            ) : null}
            {primaryNext ? (
              <p className={`text-sm text-muted-foreground ${struggleTopics ? "mt-2" : ""}`}>
                {t("learner.sessionInsight.focusNext", { label: primaryNext })}
              </p>
            ) : topWeak ? (
              <p className={`text-sm text-muted-foreground ${struggleTopics ? "mt-2" : ""}`}>
                {t("learner.sessionInsight.focusTopicDrill", { topic: topWeak })}
              </p>
            ) : null}
          </div>
        );
      })()}

      {data.studyNext ? <PostTestStudyNextCard bundle={data.studyNext} /> : null}

      <div className="flex flex-wrap gap-2">
        <Link href="/app/exams" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80">
          {t("examAttempt.backToExams")}
        </Link>
        <Link
          href="/app/questions"
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t("examAttempt.openQuestionBank")}
        </Link>
      </div>
    </div>
  );
}
