"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { appPathwayCatFullSetupHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { runCatDirectLaunchSessionOnce } from "@/lib/practice-tests/cat-direct-launch-session";

/**
 * Inline CAT launch on the practice-tests hub — same study surface, no separate launch page chrome.
 */
export function PracticeExamCatInlineLaunch({
  open,
  onClose,
  pathwayId,
  pathwayShell,
}: {
  open: boolean;
  onClose: () => void;
  pathwayId: string;
  pathwayShell: PracticeTestPathwayClientShell;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
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
    if (!open) return;
    setPhase("loading");
    setMessage(null);
    setErrorCode(null);
    let cancelled = false;
    void runCatDirectLaunchSessionOnce(pathwayId, shellStable).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        window.location.replace(`/app/practice-tests/${result.practiceTestId}`);
        return;
      }
      const learnerMessage =
        result.phase === "readiness"
          ? result.code === "readiness_timeout" || String(result.code ?? "").includes("timeout")
            ? "The readiness check timed out. Wait a moment and try again, or open full setup below."
            : String(result.code ?? "").startsWith("readiness_http_")
              ? "The readiness service returned an error. Try again in a few seconds, or use full setup below."
              : "We could not verify the practice pool for this track yet. Open full setup to review conditions and try again."
          : result.code === "create_timeout"
            ? "Starting your session timed out. Check your connection and try again, or use full setup below."
            : "We could not start the timed session. Please try again, or use full setup below.";
      setErrorCode(result.code);
      setMessage(result.message?.trim() ? result.message : learnerMessage);
      setPhase("error");
      if (isDev) console.error("[CAT inline launch] failed", { pathwayId, result });
    });
    return () => {
      cancelled = true;
    };
  }, [open, pathwayId, shellStable, isDev]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "error") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, phase]);

  useEffect(() => {
    if (!open) return;
    const tmr = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => window.clearTimeout(tmr);
  }, [open, phase]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
      data-nn-practice-cat-inline-launch=""
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-text-primary)_28%,transparent)] backdrop-blur-[2px]"
        aria-label="Close exam launch"
        onClick={phase === "error" ? onClose : undefined}
        disabled={phase === "loading"}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-[131] w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-200 rounded-t-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] outline-none sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95"
      >
        {phase === "error" ? (
          <div className="p-6 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
              Exam session
            </p>
            <h2 id={titleId} className="mt-2 text-lg font-bold text-[var(--theme-heading-text)]">
              Exam could not start
            </h2>
            <p className="mt-2 text-[var(--semantic-text-secondary)]">{message}</p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                Back to Practice Exams
              </button>
              <Link
                href={buildExamPathwayPath(pathwayShell, "questions")}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                Question Bank
              </Link>
              <Link
                href={setupHref}
                className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
              >
                Full setup &amp; conditions
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
        ) : (
          <div className="p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
              Exam session
            </p>
            <h2 id={titleId} className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">
              Preparing your exam
            </h2>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
              Verifying your pathway pool and starting the timed session…
            </p>
            <div
              className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-2 border-[var(--semantic-border-soft)] border-t-[var(--semantic-brand)]"
              role="status"
              aria-label="Loading"
            />
            <p className="mt-4 text-xs text-[var(--semantic-text-muted)]">Stay on this page — we will open your session automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
