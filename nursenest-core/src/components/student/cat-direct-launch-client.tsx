"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { appPathwayCatFullSetupHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { runCatDirectLaunchSessionOnce } from "@/lib/practice-tests/cat-direct-launch-session";

/**
 * Minimal bridge: verify pool readiness, POST session, redirect into the exam runner.
 * No duplicate setup page — used from marketing CTAs and pathway-scoped app links.
 */
export function CatDirectLaunchClient({
  pathwayId,
  pathwayShell,
}: {
  pathwayId: string;
  pathwayShell: PracticeTestPathwayClientShell;
}) {
  const isDev = process.env.NODE_ENV !== "production";
  const [phase, setPhase] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const setupHref = useMemo(() => appPathwayCatFullSetupHref(pathwayId), [pathwayId]);

  const shellStable = useMemo(
    (): PracticeTestPathwayClientShell => ({
      id: pathwayShell.id,
      countrySlug: pathwayShell.countrySlug,
      roleTrack: pathwayShell.roleTrack,
      examCode: pathwayShell.examCode,
      shortName: pathwayShell.shortName,
      examFamily: pathwayShell.examFamily,
    }),
    [
      pathwayShell.id,
      pathwayShell.countrySlug,
      pathwayShell.roleTrack,
      pathwayShell.examCode,
      pathwayShell.shortName,
      pathwayShell.examFamily,
    ],
  );

  useEffect(() => {
    let cancelled = false;
    void runCatDirectLaunchSessionOnce(pathwayId, shellStable).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        window.location.replace(`/app/practice-tests/${result.practiceTestId}`);
        return;
      }
      const learnerMessage =
        result.phase === "readiness"
          ? "We could not verify the practice pool for this track yet. You can open the full setup page to review conditions and try again."
          : "We could not start the timed session. Please try again, or use full setup below.";
      setErrorCode(result.code);
      setMessage(result.message?.trim() ? result.message : learnerMessage);
      setPhase("error");
      if (isDev) console.error("[CAT direct launch] failed", { pathwayId, result });
    });
    return () => {
      cancelled = true;
    };
  }, [pathwayId, shellStable, isDev]);

  if (phase === "error") {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm shadow-[var(--semantic-shadow-soft)]">
        <h1 className="text-lg font-bold text-[var(--theme-heading-text)]">Exam could not start</h1>
        <p className="mt-2 text-[var(--semantic-text-secondary)]">{message}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={buildExamPathwayPath(pathwayShell, "questions")}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--theme-heading-text)]"
          >
            Question bank
          </Link>
          <Link
            href={setupHref}
            className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
          >
            Full setup &amp; conditions
          </Link>
          <Link
            href="/app/practice-tests"
            className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--semantic-text-muted)] underline"
          >
            Practice tests hub
          </Link>
        </div>
        {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled ? (
          <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
            <Link href="/app/account/billing" className="font-semibold text-[var(--semantic-brand)] underline">
              Billing &amp; plan
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 text-center shadow-[var(--semantic-shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">Exam session</p>
      <h1 className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">Preparing your exam</h1>
      <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
        Verifying your pathway pool and starting the timed session…
      </p>
      <div
        className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-2 border-[var(--semantic-border-soft)] border-t-[var(--semantic-brand)]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
