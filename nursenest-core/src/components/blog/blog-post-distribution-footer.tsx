import type { CountryCode } from "@prisma/client";
import { BlogDistributionAnalyticsLink } from "@/components/blog/blog-distribution-analytics-link";
import { defaultPracticeHubForExam, toolPathForSlug } from "@/lib/blog/blog-exam-routes";
import { blogCountryFromPrismaTarget, marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";
import { isPlausibleMarketingLessonDetailPath } from "@/lib/lessons/marketing-lesson-path-guard";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

type Props = {
  exam: string | null | undefined;
  countryTarget?: CountryCode | null;
  relatedLessonPaths: string[];
  relatedQuestionIds: string[];
  relatedTools: string[];
};

/**
 * Bottom-of-post distribution: lessons, practice (public hubs), study plan — no rationales, no full lesson bodies.
 */
export function BlogPostDistributionFooter({
  exam,
  countryTarget,
  relatedLessonPaths,
  relatedQuestionIds,
  relatedTools,
}: Props) {
  const practiceHub = defaultPracticeHubForExam(exam ?? null, countryTarget ?? null);
  const studyHubs = marketingStudyHubsForBlogExam(exam ?? "", blogCountryFromPrismaTarget(countryTarget));
  const lessons = relatedLessonPaths
    .filter(Boolean)
    .filter(isPlausibleMarketingLessonDetailPath)
    .slice(0, 5);
  const tools = relatedTools.filter(Boolean).slice(0, 5);
  const hasQuestionIds = relatedQuestionIds.length > 0;

  return (
    <aside className="mt-6 space-y-6 border-t border-[var(--theme-separator)] pt-6">
      {lessons.length > 0 ? (
        <footer className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Related lessons</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--theme-body-text)]">
            {lessons.map((path) => (
              <li key={path}>
                <BlogDistributionAnalyticsLink href={path} linkKind="related_lesson" className="font-medium text-primary hover:underline">
                  {path.replace(/^\//, "")}
                </BlogDistributionAnalyticsLink>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}

      <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
        <p className="font-semibold text-[var(--theme-heading-text)]">Practice</p>
        <p className="mt-1 text-muted-foreground">
          {hasQuestionIds
            ? "This post is tied to bank items you can practice after sign-in. Rationales and full analytics stay in the app (not on the public blog)."
            : "Drill exam-style questions in the public practice hub, then sign in to track progress and read full rationales."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <BlogDistributionAnalyticsLink
            href={practiceHub}
            linkKind="practice_hub"
            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
          >
            Practice questions (public hub)
          </BlogDistributionAnalyticsLink>
          <BlogDistributionAnalyticsLink
            href={studyHubs.practiceExamsHub}
            linkKind="practice_exams_hub"
            className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-muted/80"
          >
            CAT-style practice exams
          </BlogDistributionAnalyticsLink>
          {studyHubs.practiceProgrammatic ? (
            <BlogDistributionAnalyticsLink
              href={studyHubs.practiceProgrammatic}
              linkKind="practice_programmatic"
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-muted/80"
            >
              Focused practice test
            </BlogDistributionAnalyticsLink>
          ) : null}
          <BlogDistributionAnalyticsLink
            href={loginWithCallback("/app/questions")}
            linkKind="question_bank_login"
            className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-muted/80"
          >
            Open question bank (sign in)
          </BlogDistributionAnalyticsLink>
        </div>
      </div>

      {tools.length > 0 ? (
        <footer className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Tools</h2>
          <ul className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t}>
                <BlogDistributionAnalyticsLink
                  href={toolPathForSlug(t)}
                  linkKind="tool_slug"
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary hover:bg-muted/80"
                >
                  {t}
                </BlogDistributionAnalyticsLink>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <BlogDistributionAnalyticsLink
          href={HUB.examLessons}
          linkKind="exam_lesson_hubs"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Exam lesson hubs
        </BlogDistributionAnalyticsLink>
        <span className="text-muted-foreground">·</span>
        <BlogDistributionAnalyticsLink
          href={loginWithCallback("/app/study-plan")}
          linkKind="study_plan_login"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Study plan
        </BlogDistributionAnalyticsLink>
      </div>
    </aside>
  );
}
