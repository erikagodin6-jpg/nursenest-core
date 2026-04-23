"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { buildCatExamSimulationCreatePayload } from "@/components/student/pathway-cat-start-payload";

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
  const [phase, setPhase] = useState<"checking" | "starting" | "error">("checking");
  const [message, setMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const setupHref = useMemo(
    () =>
      `/app/practice-tests/start?pathwayId=${encodeURIComponent(pathwayId)}&review=1`,
    [pathwayId],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const resReady = await fetch(`/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(pathwayId)}`, {
          method: "GET",
          credentials: "same-origin",
        });
        const readiness = (await resReady.json()) as CatPracticeReadinessResult;
        if (cancelled) return;
        if (!readiness.ok) {
          setErrorCode(readiness.code);
          setMessage(readiness.message);
          setPhase("error");
          return;
        }
        setPhase("starting");
        const payload = buildCatExamSimulationCreatePayload(pathwayShell);
        const res = await fetch("/api/practice-tests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { id?: string; error?: string; code?: string };
        if (cancelled) return;
        if (!res.ok) {
          setErrorCode(typeof data.code === "string" ? data.code : null);
          throw new Error(data.error ?? "Could not start session.");
        }
        if (!data.id) throw new Error("Session was created without an id. Please try again.");
        window.location.replace(`/app/practice-tests/${data.id}`);
      } catch (e) {
        if (cancelled) return;
        const text = e instanceof Error ? e.message : "Could not start session.";
        setMessage(text);
        setPhase("error");
        if (isDev) console.error("[CAT direct launch] failed", { pathwayId, text });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathwayId, pathwayShell, isDev]);

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
        {phase === "checking" ? "Verifying item pool…" : "Starting timed session…"}
      </p>
      <div
        className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-2 border-[var(--semantic-border-soft)] border-t-[var(--semantic-brand)]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
