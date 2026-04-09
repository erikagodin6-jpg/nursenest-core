import Link from "next/link";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

export type PracticeTestIncorrectReviewItem = {
  id: string;
  stemPreview: string;
  topic: string | null;
};

/**
 * Server-rendered results summary for bookmarkable `/app/practice-tests/[id]/results`.
 * Full teaching review and notes remain on the main run page.
 */
export function PracticeTestResultsStatic({
  testId,
  title,
  results,
  config,
  completedAtLabel,
  incorrectReviewItems = [],
}: {
  testId: string;
  title: string | null;
  results: PracticeTestResultsJson;
  config: PracticeTestConfigJson | null;
  completedAtLabel: string;
  incorrectReviewItems?: PracticeTestIncorrectReviewItem[];
}) {
  const cat = config?.selectionMode === "cat";
  const incorrect = Math.max(0, results.scoreTotal - results.scoreCorrect);

  return (
    <div className="space-y-6">
      <div className="nn-card p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Results</p>
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">
          {title?.trim() || (cat ? "Adaptive (CAT) practice" : "Practice test")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Completed {completedAtLabel}</p>
        <p className="mt-4 text-3xl font-bold tabular-nums text-primary">
          {results.scoreCorrect}/{results.scoreTotal}{" "}
          <span className="text-lg font-semibold text-muted-foreground">({results.accuracyPct}%)</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Correct:</span> {results.scoreCorrect}
          <span className="mx-2 text-border">·</span>
          <span className="font-medium text-foreground">Incorrect:</span> {incorrect}
        </p>
        {results.readinessLabel != null ? (
          <p className="mt-3 text-lg font-semibold text-foreground">Readiness: {results.readinessLabel}</p>
        ) : null}
        {results.catReport ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Classification:{" "}
            <span className="font-semibold capitalize text-foreground">{results.catReport.decision}</span>
            {results.catReport.stoppedReason !== "completed" ? (
              <>
                {" "}
                · Stopped:{" "}
                <span className="text-foreground">{results.catReport.stoppedReason.replace(/_/g, " ")}</span>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      {Object.keys(results.byTopic).length > 0 ? (
        <div className="nn-card p-6">
          <h3 className="font-semibold text-foreground">By topic</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(results.byTopic).map(([topic, { correct, total }]) => (
              <li key={topic} className="flex justify-between gap-2 border-b border-border/50 py-1">
                <span>{topic}</span>
                <span className="tabular-nums text-muted-foreground">
                  {correct}/{total} ({total > 0 ? Math.round((correct / total) * 100) : 0}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {results.weakAreas.length > 0 ? (
        <div className="nn-card border-amber-200/60 bg-amber-50/40 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
          <h3 className="font-semibold text-foreground">Weak areas</h3>
          <p className="mt-1 text-sm text-muted-foreground">Topics to review from this run.</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {results.weakAreas.map((w) => (
              <li key={w}>
                <Link className="text-primary underline" href={`/app/questions?topic=${encodeURIComponent(w)}`}>
                  {w}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {incorrectReviewItems.length > 0 ? (
        <div className="nn-card p-6">
          <h3 className="font-semibold text-foreground">Missed items</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Short previews from your session. Open the test page for full rationales and teaching review.
          </p>
          <ul className="mt-3 space-y-3 text-sm">
            {incorrectReviewItems.map((item) => (
              <li key={item.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <p className="text-foreground">{item.stemPreview}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.topic ? (
                    <>
                      Topic:{" "}
                      <Link
                        className="font-medium text-primary underline"
                        href={`/app/questions?topic=${encodeURIComponent(item.topic)}`}
                      >
                        {item.topic}
                      </Link>
                    </>
                  ) : (
                    "Topic not tagged"
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : results.incorrectQuestionIds && results.incorrectQuestionIds.length > 0 ? (
        <div className="nn-card p-6">
          <h3 className="font-semibold text-foreground">Missed items</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {results.incorrectQuestionIds.length} question(s) marked incorrect. Open the test page for full review.
          </p>
          <Link
            href={`/app/practice-tests/${testId}`}
            className="mt-3 inline-flex text-sm font-semibold text-primary underline"
          >
            Open full review on test page
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/app/practice-tests/${testId}`}
          className="inline-flex rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground"
        >
          Open full review on test page
        </Link>
        <Link
          href="/app/practice-tests"
          className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Practice tests home
        </Link>
      </div>
    </div>
  );
}
