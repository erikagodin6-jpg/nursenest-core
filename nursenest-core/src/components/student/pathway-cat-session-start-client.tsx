"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PracticeTestPathwayClientShell, PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import { catPathwayRegionalExamLine, catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { pathwayCatLandingTitle } from "@/lib/exam-pathways/pathway-cat-marketing-copy";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { ExamPreExamCustomizeModal } from "@/components/exam/exam-study-theme-modal";
import { CatAmbiguityPathwayPicker } from "@/components/student/cat-ambiguity-pathway-picker";
import {
  isHardBlockingReadinessCode,
  normalizePathwaySelection,
  resolveCatStartUiState,
  resolveReadinessStartQuestionCount,
} from "@/components/student/pathway-cat-start-payload";

export function PathwayCatSessionStartClient({
  initialPathwayId,
  pathwayOptions,
  pathwayShellById,
  fallbackLessonsByPathway,
}: {
  initialPathwayId: string | null;
  pathwayOptions: PracticeTestPathwayOption[];
  /** Server-resolved pathway rows for labels + links (avoids importing the exam catalog in this client bundle). */
  pathwayShellById: Record<string, PracticeTestPathwayClientShell>;
  fallbackLessonsByPathway?: Record<string, Array<{ slug: string; title: string }>>;
}) {
  const isDev = process.env.NODE_ENV !== "production";
  const [pathwayId, setPathwayId] = useState(() => {
    if (initialPathwayId && pathwayOptions.some((p) => p.id === initialPathwayId)) return initialPathwayId;
    if (pathwayOptions.length === 1) return pathwayOptions[0]!.id;
    return "";
  });
  const pathwaySelectRef = useRef<HTMLSelectElement | null>(null);
  const normalizedPathwayId = normalizePathwaySelection(pathwayId);
  const pathwayChoiceRequired = pathwayOptions.length > 1;
  const needsPathwayChoice = pathwayChoiceRequired && normalizedPathwayId.length === 0;
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(false);
  const [readiness, setReadiness] = useState<CatPracticeReadinessResult | null>(null);
  const [readinessRefreshToken, setReadinessRefreshToken] = useState(0);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const pathwayMeta = useMemo(
    () => (normalizedPathwayId ? pathwayShellById[normalizedPathwayId] : undefined),
    [normalizedPathwayId, pathwayShellById],
  );
  const catShort = pathwayMeta ? catPathwayShortCatLabel(pathwayMeta) : null;
  const catLine = pathwayMeta ? catPathwayRegionalExamLine(pathwayMeta) : null;
  const readinessConfig = useMemo(
    () => (pathwayMeta ? readinessConfigForPathway(pathwayMeta) : null),
    [pathwayMeta],
  );
  const publicCopy = useMemo(
    () => (readinessConfig ? publicCopyForReadinessConfig(readinessConfig) : null),
    [readinessConfig],
  );
  const examTitle = publicCopy?.title ?? (pathwayMeta ? catShort : "Exam pathway");
  const fallbackLessons = normalizedPathwayId ? (fallbackLessonsByPathway?.[normalizedPathwayId] ?? []) : [];
  const lessonsHubHref = pathwayMeta ? buildExamPathwayPath(pathwayMeta, "lessons") : "/app/lessons";
  const uiState = resolveCatStartUiState({
    pathwayId: normalizedPathwayId,
    pathwayChoiceRequired,
    readinessLoading,
    readiness,
  });
  const readinessCode = uiState.readinessCode;
  const readinessGate = useMemo(() => {
    if (!readiness || readiness.ok) return { blocked: false, title: "" };
    if (readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled) {
      return {
        blocked: true,
        title: "Pathway does not match your subscription",
      };
    }
    if (readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid) {
      return {
        blocked: true,
        title: "Not enough CAT-ready questions yet",
      };
    }
    return {
      blocked: false,
      title: "We could not verify CAT readiness right now",
    };
  }, [readiness]);

  useEffect(() => {
    if (!normalizedPathwayId) {
      setReadiness(null);
      return;
    }
    let cancelled = false;
    setReadinessLoading(true);
    setReadiness(null);
    void (async () => {
      try {
        const res = await fetch(`/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(normalizedPathwayId)}`, {
          method: "GET",
          credentials: "same-origin",
        });
        const data = (await res.json()) as CatPracticeReadinessResult;
        if (!cancelled) {
          setReadiness(data);
          if (isDev) {
            console.info("[CAT start] readiness", {
              pathwayId,
              normalizedPathwayId,
              ok: Boolean(data.ok),
              code: data.ok ? null : data.code,
              message: data.ok ? null : data.message,
            });
          }
        }
      } catch {
        if (!cancelled) {
          setReadiness({
            ok: false,
            code: "readiness_fetch_failed",
            message: "Could not verify adaptive pool readiness. Check your connection and try again.",
          });
        }
      } finally {
        if (!cancelled) setReadinessLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [normalizedPathwayId, pathwayId, isDev, readinessRefreshToken]);

  useEffect(() => {
    if (!needsPathwayChoice || normalizedPathwayId.length > 0) return;
    const intervalId = window.setInterval(() => {
      const domValue = normalizePathwaySelection(pathwaySelectRef.current?.value);
      if (domValue.length > 0) {
        setPathwayId(domValue);
      }
    }, 300);
    return () => window.clearInterval(intervalId);
  }, [needsPathwayChoice, normalizedPathwayId]);

  const start = useCallback(async () => {
    if (!normalizedPathwayId) return;
    setCreating(true);
    setError(null);
    setErrorCode(null);
    try {
      const catPresentationMode = "exam_simulation";
      const questionCount = resolveReadinessStartQuestionCount({
        configuredMaxQuestions: readinessConfig?.maxQuestions ?? 150,
        catPresentationMode,
        examFamily: pathwayMeta?.examFamily,
      });
      const timedMode = true;
      const timeLimitSec = (readinessConfig?.timeLimitMinutes ?? 300) * 60;
      const payload = {
        title: publicCopy?.title ?? `${pathwayMeta?.shortName ?? "Pathway"} Readiness Exam`,
        questionCount,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        selectionMode: "cat" as const,
        catSelectionBasis: "random" as const,
        catPresentationMode,
        catExamFeedbackMode: "test" as const,
        pathwayId: normalizedPathwayId,
        timedMode,
        timeLimitSec,
      };
      if (isDev) {
        console.info("[CAT start] attempt", {
          pathwayId,
          normalizedPathwayId,
          questionCount,
          catPresentationMode,
          examFamily: pathwayMeta?.examFamily ?? null,
          timeLimitSec,
        });
      }
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        if (isDev) {
          console.error("[CAT start] rejected", {
            status: res.status,
            code: data.code ?? null,
            error: data.error ?? "Could not start session.",
          });
        }
        setErrorCode(typeof data.code === "string" ? data.code : null);
        throw new Error(data.error ?? "Could not start session.");
      }
      if (!data.id) {
        if (isDev) {
          console.error("[CAT start] missing session id", { status: res.status });
        }
        throw new Error("Session was created without an id. Please try again.");
      }
      window.location.href = `/app/practice-tests/${data.id}`;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not start session.";
      setError(`Unable to start exam: ${message}`);
    } finally {
      setCreating(false);
    }
  }, [normalizedPathwayId, pathwayId, pathwayMeta?.examFamily, pathwayMeta?.shortName, readinessConfig, publicCopy?.title, isDev]);

  if (pathwayOptions.length === 0) {
    return (
      <div className="nn-card p-6 text-sm text-muted-foreground">
        <p>No exam pathways match your subscription region and tier.</p>
        <Link href="/app/practice-tests" className="mt-3 inline-block font-semibold text-primary underline">
          Back to practice tests
        </Link>
      </div>
    );
  }

  return (
    <div className="nn-card space-y-6 p-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{catLine ?? "CAT practice"}</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">{examTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {publicCopy ? (
            <>
              {publicCopy.subtitle}
            </>
          ) : catLine ? (
            <>
              <span className="font-medium text-foreground">{catLine}</span>, one-question exam flow with adaptive scoring,
              timed delivery, and exam-style constraints.
            </>
          ) : (
            <>
              One-question exam flow with adaptive scoring, timed delivery, and exam-style constraints.
            </>
          )}
        </p>
        {readinessConfig ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {readinessConfig.questionRange} · {readinessConfig.timeLimitMinutes} minute limit ·{" "}
            {readinessConfig.allowBackNavigation ? "Back navigation enabled" : "No backtracking"}
          </p>
        ) : null}
        {publicCopy?.betaLabel ? (
          <p className="mt-2 text-xs font-medium text-muted-foreground">Adaptive Practice ({publicCopy.betaLabel})</p>
        ) : null}
      </div>

      <label className="block text-sm">
        <span className="text-muted-foreground">Pathway</span>
        <select
          ref={pathwaySelectRef}
          data-nn-qa-cat-pathway-select
          className="mt-1 w-full max-w-xl rounded-lg border border-border px-3 py-2 text-sm"
          value={pathwayId}
          onChange={(e) => setPathwayId(normalizePathwaySelection(e.target.value))}
          onInput={(e) => {
            const target = e.target as HTMLSelectElement;
            setPathwayId(normalizePathwaySelection(target.value));
          }}
        >
          {pathwayOptions.length > 1 ? (
            <option value="">Choose which exam pathway you want to practice…</option>
          ) : null}
          {pathwayOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      {needsPathwayChoice ? (
        <p className="text-xs text-[var(--semantic-text-secondary)]">
          We need your pathway before starting CAT so the adaptive pool matches the right exam.
        </p>
      ) : null}

      {readinessLoading ? (
        <p className="text-sm text-muted-foreground">
          Checking adaptive question pool{catShort ? ` for ${catShort}` : ""}…
        </p>
      ) : null}
      {uiState.showReadinessMessage && readiness && !readiness.ok ? (
        <aside className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-warning-soft)] p-4 text-sm text-[var(--semantic-text-primary)] shadow-sm">
          <p className="font-semibold">
            {readinessGate.title}
          </p>
          <p className="mt-1 text-muted-foreground">{readiness.message}</p>
          {fallbackLessons.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Complete lessons you can study now
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {fallbackLessons.slice(0, 5).map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      className="font-medium text-primary underline"
                      href={`${lessonsHubHref}/${encodeURIComponent(lesson.slug)}`}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid && pathwayMeta ? (
              <li>
                <Link className="font-medium text-primary underline" href={buildExamPathwayPath(pathwayMeta, "questions")}>
                  Open pathway question bank
                </Link>{" "}
                (practice items may still be available)
              </li>
            ) : null}
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled ? (
              <li>
                <Link className="font-medium text-primary underline" href="/app/account/billing">
                  Review subscription &amp; billing
                </Link>
              </li>
            ) : null}
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found && pathwayMeta ? (
              <li>
                <Link className="font-medium text-primary underline" href={buildExamPathwayPath(pathwayMeta)}>
                  Pathway hub
                </Link>{" "}
                for lessons, waitlist, or alternate tracks
              </li>
            ) : null}
            <li>
              <Link className="font-medium text-primary underline" href="/app/practice-tests">
                Practice exams
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href={lessonsHubHref}>
                Explore available content
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-primary underline"
                href={
                  normalizedPathwayId ? pathwayHubAppQuestionsHref(normalizedPathwayId) : "/app/account/study-preferences"
                }
              >
                App question bank
              </Link>
            </li>
          </ul>
        </aside>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-semibold text-destructive">Unable to start exam</p>
          <p className="mt-1 text-foreground">{error}</p>
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous ? (
            <CatAmbiguityPathwayPicker catEligibleOptions={pathwayOptions} surface="start_page" className="mt-3" />
          ) : null}
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_weak_areas_empty ? (
            <p className="mt-2 text-muted-foreground">
              Tip: switch <strong>Pool basis</strong> to <strong>Balanced pool</strong>, use the question bank, then try weak
              areas again.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          data-nn-qa-cat-start-session
          disabled={
            creating ||
            uiState.startDisabled ||
            isHardBlockingReadinessCode(readinessCode) ||
            false
          }
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          onClick={() => setCustomizeOpen(true)}
        >
          {creating ? "Starting…" : readinessLoading ? "Checking…" : "Start Readiness Exam"}
        </button>
        {!readinessLoading && readinessCode === "readiness_fetch_failed" ? (
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-card"
            onClick={() => {
              setReadiness(null);
              setReadinessRefreshToken((t) => t + 1);
            }}
          >
            Retry readiness check
          </button>
        ) : null}
        <Link
          href="/app/practice-tests"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Full practice test builder
        </Link>
      </div>

      <ExamPreExamCustomizeModal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        onBegin={() => {
          setCustomizeOpen(false);
          void start();
        }}
        starting={creating}
      />
    </div>
  );
}
