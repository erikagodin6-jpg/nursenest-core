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
  const catHub = studyHubs.pathwayCatHub ?? studyHubs.practiceExamsHub;
  const flashHub = studyHubs.flashcardsHub;
  const examUpper = (exam ?? "").trim().toUpperCase();
  const practiceAnchor =
    examUpper.includes("REX") || examUpper.includes("REX-PN")
      ? "practice REx-PN questions"
      : examUpper.includes("CNPLE") || (examUpper.includes("NP") && blogCountryFromPrismaTarget(countryTarget) === "CA")
        ? "practice NP exam questions"
        : examUpper.includes("NCLEX-RN") || examUpper.includes("NCLEX RN")
          ? "practice NCLEX-RN questions"
          : "practice nursing exam questions";
  const adaptiveAnchor =
    examUpper.includes("REX") || examUpper.includes("REX-PN")
      ? "adaptive REx-PN test"
      : examUpper.includes("CNPLE") || (examUpper.includes("NP") && blogCountryFromPrismaTarget(countryTarget) === "CA")
        ? "adaptive NP prep test"
        : "adaptive NCLEX test";
  const flashAnchor =
    examUpper.includes("REX") || examUpper.includes("REX-PN")
      ? "REx-PN flashcards"
      : examUpper.includes("NCLEX-RN") || examUpper.includes("NCLEX RN")
        ? "NCLEX flashcards"
        : "nursing flashcards";
  const lessons = relatedLessonPaths
    .filter(Boolean)
    .filter(isPlausibleMarketingLessonDetailPath)
    .slice(0, 5);
  const tools = relatedTools.filter(Boolean).slice(0, 5);
  const hasQuestionIds = relatedQuestionIds.length > 0;

  return (
    <aside className="nn-premium-blog-distribution mt-6 space-y-6 border-t border-[var(--theme-separator)] pt-6">
      {lessons.length > 0 ? (
        <footer className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Related lessons</h2>
          <ul className="grid list-none gap-2 sm:grid-cols-2">
            {lessons.map((path) => (
              <li
                key={path}
                className="min-w-0 overflow-hidden rounded-xl border border-[var(--theme-card-border)] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--theme-card-bg))] px-3 py-2.5 text-sm shadow-sm"
              >
                <BlogDistributionAnalyticsLink
                  href={path}
                  linkKind="related_lesson"
                  className="font-semibold text-primary [overflow-wrap:anywhere] hover:underline"
                >
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
        <nav aria-label="Exam prep shortcuts" className="mt-3 text-sm">
          <p className="font-medium text-[var(--theme-heading-text)]">Prep shortcuts</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-[var(--theme-body-text)]">
            <li>
              <BlogDistributionAnalyticsLink href={practiceHub} linkKind="practice_hub" className="font-semibold text-primary hover:underline">
                {practiceAnchor}
              </BlogDistributionAnalyticsLink>
            </li>
            <li>
              <BlogDistributionAnalyticsLink href={catHub} linkKind="practice_exams_hub" className="font-semibold text-primary hover:underline">
                {adaptiveAnchor}
              </BlogDistributionAnalyticsLink>
            </li>
            <li>
              <BlogDistributionAnalyticsLink href={flashHub} linkKind="flashcards_hub" className="font-semibold text-primary hover:underline">
                {flashAnchor}
              </BlogDistributionAnalyticsLink>
            </li>
          </ul>
        </nav>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          <BlogDistributionAnalyticsLink
            href={practiceHub}
            linkKind="practice_hub"
            className="inline-flex max-w-full min-h-[44px] items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 [overflow-wrap:anywhere]"
          >
            Practice questions (public hub)
          </BlogDistributionAnalyticsLink>
          <BlogDistributionAnalyticsLink
            href={catHub}
            linkKind="practice_exams_hub"
            className="inline-flex max-w-full min-h-[44px] items-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-text-muted)_8%,var(--theme-card-bg))]"
          >
            CAT-style practice exams
          </BlogDistributionAnalyticsLink>
          {studyHubs.practiceProgrammatic ? (
            <BlogDistributionAnalyticsLink
              href={studyHubs.practiceProgrammatic}
              linkKind="practice_programmatic"
              className="inline-flex max-w-full min-h-[44px] items-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-text-muted)_8%,var(--theme-card-bg))]"
            >
              Focused practice test
            </BlogDistributionAnalyticsLink>
          ) : null}
          <BlogDistributionAnalyticsLink
            href={loginWithCallback("/app/questions")}
            linkKind="question_bank_login"
            className="inline-flex max-w-full min-h-[44px] items-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-text-muted)_8%,var(--theme-card-bg))]"
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
                  className="rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-medium text-primary hover:bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))]"
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
