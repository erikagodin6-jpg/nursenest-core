import Link from "next/link";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

type Variant = "hub" | "lessons" | "questions" | "cat";

export function PathwayLiveInventoryStrip({
  pathway,
  questionSnapshot,
  lessonCount,
  variant = "hub",
}: {
  pathway: ExamPathwayDefinition;
  questionSnapshot: PathwayQuestionBankSnapshot;
  /** From {@link countPathwayLessons} — catalog + DB published, pathway-specific. */
  lessonCount?: number;
  variant?: Variant;
}) {
  const region = pathway.countrySlug === "canada" ? "Canada" : "US";
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");

  if (questionSnapshot.status !== "ok") {
    return (
      <aside className="nn-card mt-6 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
        <p className="font-semibold text-[var(--theme-heading-text)]">Content inventory</p>
        <p className="mt-1 text-[var(--theme-muted-text)]">
          Live question counts are temporarily unavailable. The in-app bank and CAT still use the same pathway filters (
          {region} region, plan tier for this track
          {pathway.contentExamKeys.length ? `, exam codes: ${pathway.contentExamKeys.join(", ")}` : ""}).
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-primary">
          <Link href={lessonsHref} className="hover:underline">
            Lessons
          </Link>
          <Link href={questionsHref} className="hover:underline">
            Questions
          </Link>
          <Link href={catHref} className="hover:underline">
            CAT
          </Link>
        </div>
      </aside>
    );
  }

  const { pathwayScopedCount, adaptiveEligibleCount, examKeys } = questionSnapshot;
  const tierNote = `Counts reflect published items in the ${region} region for the subscription tier tied to this pathway (${pathway.shortName}).`;
  const examNote =
    examKeys.length > 0
      ? `Filtered to exam column values: ${examKeys.join(", ")}.`
      : "This pathway does not add an exam-column filter; the bank uses tier and region only.";

  const lessonLine =
    typeof lessonCount === "number" ? (
      <p className="mt-2 text-[var(--theme-muted-text)]">
        <span className="font-semibold text-[var(--theme-heading-text)]">{lessonCount}</span>{" "}
        {lessonCount === 1 ? "lesson" : "lessons"} in this pathway library (published database rows plus static catalog when
        used).
      </p>
    ) : null;

  const zeroQuestions =
    pathwayScopedCount === 0 ? (
      <p className="mt-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-[var(--theme-body-text)]">
        No published questions match these filters yet. Routes stay open; use{" "}
        <Link href={lessonsHref} className="font-semibold text-primary underline">
          lessons
        </Link>{" "}
        and{" "}
        <Link href={HUB.practiceExams} className="font-semibold text-primary underline">
          public practice exams
        </Link>{" "}
        while the bank fills in.
      </p>
    ) : null;

  const catLine =
    variant === "cat" ? (
      <p className="mt-2 text-[var(--theme-muted-text)]">
        CAT sessions sample from the same scoped pool (up to several thousand IDs loaded per run).{" "}
        <span className="font-semibold text-[var(--theme-heading-text)]">{adaptiveEligibleCount}</span> items are flagged
        adaptive-eligible in the database; the engine still requires a minimum pool size to start.
      </p>
    ) : pathwayScopedCount > 0 ? (
      <p className="mt-2 text-[var(--theme-muted-text)]">
        <span className="font-semibold text-[var(--theme-heading-text)]">{adaptiveEligibleCount}</span> of those are marked
        adaptive-eligible for CAT-style runs.{" "}
        <Link href={catHref} className="font-semibold text-primary hover:underline">
          Open CAT intro
        </Link>
      </p>
    ) : null;

  const showLessonFirst = variant === "hub" || variant === "lessons";

  return (
    <aside className="nn-card mt-6 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Live inventory</p>
      {showLessonFirst ? lessonLine : null}

      <p className="mt-2">
        <span className="font-semibold text-[var(--theme-heading-text)]">{pathwayScopedCount}</span> published questions
        currently match this pathway’s bank filters.
      </p>
      {variant === "questions" ? lessonLine : null}
      {catLine}
      {zeroQuestions}

      <p className="mt-3 text-xs leading-relaxed text-[var(--theme-muted-text)]">
        {tierNote} {examNote}
      </p>
      {variant === "questions" ? (
        <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
          Signed-in practice uses your actual plan and region; counts here use this pathway’s default tier as a reference.
        </p>
      ) : null}
    </aside>
  );
}
