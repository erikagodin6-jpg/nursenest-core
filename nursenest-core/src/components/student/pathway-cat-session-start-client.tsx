"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { PracticeTestPathwayClientShell, PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import { catPathwayRegionalExamLine, catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { catHowItWorksBulletItems } from "@/lib/exam-pathways/pathway-cat-how-it-works";
import {
  catAfterSessionPoints,
  catExamConditionRows,
  catHeroSummaryChips,
  catHowItWorksIntro,
} from "@/lib/exam-pathways/pathway-cat-setup-display";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { CatAmbiguityPathwayPicker } from "@/components/student/cat-ambiguity-pathway-picker";
import {
  buildCatExamSimulationCreatePayload,
  isHardBlockingReadinessCode,
  normalizePathwaySelection,
  resolveCatStartUiState,
} from "@/components/student/pathway-cat-start-payload";

function sectionShell(children: ReactNode, className = "") {
  return <section className={`lv-shell ${className}`.trim()}>{children}</section>;
}

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

  const pathwayMeta = useMemo(
    () => (normalizedPathwayId ? pathwayShellById[normalizedPathwayId] : undefined),
    [normalizedPathwayId, pathwayShellById],
  );
  const pathwayOptionLabel = useMemo(
    () => pathwayOptions.find((p) => p.id === pathwayId)?.label ?? pathwayOptions.find((p) => p.id === normalizedPathwayId)?.label,
    [pathwayId, pathwayOptions, normalizedPathwayId],
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
  const examConditionRows = useMemo(
    () => (readinessConfig && catLine ? catExamConditionRows(readinessConfig, catLine) : []),
    [readinessConfig, catLine],
  );
  const heroChips = useMemo(
    () => (readinessConfig && publicCopy ? catHeroSummaryChips(readinessConfig, publicCopy) : []),
    [readinessConfig, publicCopy],
  );
  const afterSessionPoints = useMemo(() => catAfterSessionPoints(), []);
  const fallbackLessons = normalizedPathwayId ? (fallbackLessonsByPathway?.[normalizedPathwayId] ?? []) : [];
  const lessonsHubHref = pathwayMeta ? buildExamPathwayPath(pathwayMeta, "lessons") : "/app/lessons";
  const pathwayQuestionsHref = pathwayMeta ? buildExamPathwayPath(pathwayMeta, "questions") : null;
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
    if (!normalizedPathwayId || !pathwayMeta) return;
    setCreating(true);
    setError(null);
    setErrorCode(null);
    try {
      const payload = buildCatExamSimulationCreatePayload(pathwayMeta);
      if (isDev) {
        console.info("[CAT start] attempt", {
          pathwayId,
          normalizedPathwayId,
          questionCount: payload.questionCount,
          catPresentationMode: payload.catPresentationMode,
          examFamily: pathwayMeta.examFamily ?? null,
          timeLimitSec: payload.timeLimitSec,
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
  }, [normalizedPathwayId, pathwayId, pathwayMeta, isDev]);

  if (pathwayOptions.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--semantic-text-secondary)]">
        <p>No exam pathways match your subscription region and tier.</p>
        <Link
          href="/app/practice-tests"
          className="mt-3 inline-block text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
        >
          Back to practice tests
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7 text-[var(--semantic-text-primary)]">
      <nav aria-label="Pathway context" className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            Practice tests
            {pathwayOptionLabel ? (
              <>
                <span aria-hidden className="mx-1.5 text-[var(--semantic-border-soft)]">
                  /
                </span>
                <span className="text-[var(--semantic-text-secondary)]">{pathwayOptionLabel}</span>
              </>
            ) : null}
          </p>
          <Link
            href="/app/practice-tests"
            className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            ← Return to practice tests
          </Link>
        </div>
      </nav>

      <header className="space-y-4">
        <div className="space-y-2">
          {catLine ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">{catLine}</p>
          ) : null}
          <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight text-[var(--theme-heading-text)] sm:text-[2rem]">
            Adaptive exam simulation
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
            {publicCopy?.subtitle ??
              "One item at a time, timed, with pathway-scoped rules. Official board CAT algorithms and pass/fail decisions are not reproduced here."}
          </p>
        </div>
        {heroChips.length > 0 ? (
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {heroChips.map((chip) => (
              <div
                key={chip.id}
                className="rounded-md border border-[color-mix(in_srgb,var(--semantic-border-soft)_100%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] px-3 py-2.5"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{chip.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold leading-snug text-[var(--theme-heading-text)]">{chip.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">
          This is the closest timed, linear adaptive mode we offer for your selected track. Engine behavior is documented under
          Exam conditions — use it to calibrate pacing and topic mix, not as a regulatory outcome.
        </p>
      </header>

      <div className="space-y-2">
        <label htmlFor="nn-cat-pathway-select" className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Exam pathway
        </label>
        <select
          id="nn-cat-pathway-select"
          ref={pathwaySelectRef}
          data-nn-qa-cat-pathway-select
          className="block w-full max-w-xl rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-sm font-medium text-[var(--theme-heading-text)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          value={pathwayId}
          onChange={(e) => setPathwayId(normalizePathwaySelection(e.target.value))}
          onInput={(e) => {
            const target = e.target as HTMLSelectElement;
            setPathwayId(normalizePathwaySelection(target.value));
          }}
        >
          {pathwayOptions.length > 1 ? (
            <option value="">Select the exam track for this session…</option>
          ) : null}
          {pathwayOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      {needsPathwayChoice ? (
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Choose the pathway before starting so items, blueprint weighting, and limits match the correct exam scope.
        </p>
      ) : null}

      {readinessLoading ? (
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Verifying adaptive pool{catShort ? ` for ${catShort}` : ""}…
        </p>
      ) : null}

      {uiState.showReadinessMessage && readiness && !readiness.ok ? (
        <aside
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] p-4 text-sm shadow-sm"
          role="status"
        >
          <p className="font-semibold text-[var(--theme-heading-text)]">{readinessGate.title}</p>
          <p className="mt-1 text-[var(--semantic-text-secondary)]">{readiness.message}</p>
          {fallbackLessons.length > 0 ? (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Study next</p>
              <ul className="mt-2 space-y-1 text-sm">
                {fallbackLessons.slice(0, 5).map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      className="font-medium text-[var(--semantic-brand)] underline underline-offset-2"
                      href={`${lessonsHubHref}/${encodeURIComponent(lesson.slug)}`}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-[var(--semantic-text-secondary)]">
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid && pathwayMeta ? (
              <li>
                <Link className="font-medium text-[var(--semantic-brand)] underline" href={buildExamPathwayPath(pathwayMeta, "questions")}>
                  Open pathway question bank
                </Link>
              </li>
            ) : null}
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled ? (
              <li>
                <Link className="font-medium text-[var(--semantic-brand)] underline" href="/app/account/billing">
                  Review subscription &amp; billing
                </Link>
              </li>
            ) : null}
            {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found && pathwayMeta ? (
              <li>
                <Link className="font-medium text-[var(--semantic-brand)] underline" href={buildExamPathwayPath(pathwayMeta)}>
                  Pathway hub
                </Link>
              </li>
            ) : null}
            <li>
              <Link className="font-medium text-[var(--semantic-brand)] underline" href="/app/practice-tests">
                Practice tests hub
              </Link>
            </li>
          </ul>
        </aside>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] p-4 text-sm">
          <p className="font-semibold text-[var(--semantic-danger)]">Unable to start session</p>
          <p className="mt-1 text-[var(--semantic-text-primary)]">{error}</p>
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous ? (
            <CatAmbiguityPathwayPicker catEligibleOptions={pathwayOptions} surface="start_page" className="mt-3" />
          ) : null}
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_weak_areas_empty ? (
            <p className="mt-2 text-[var(--semantic-text-secondary)]">
              Tip: switch <strong>Pool basis</strong> to <strong>Balanced pool</strong>, use the question bank, then try weak areas
              again.
            </p>
          ) : null}
          {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_missed_items_empty ? (
            <p className="mt-2 text-[var(--semantic-text-secondary)]">
              Tip: finish a graded practice session with at least one incorrect answer, or switch <strong>Pool basis</strong> to{" "}
              <strong>Balanced pool</strong>, then try missed-pool mode again.
            </p>
          ) : null}
        </div>
      ) : null}

      {readinessConfig && publicCopy && examConditionRows.length > 0
        ? sectionShell(
            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">Exam conditions</h2>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                Values follow your selected pathway configuration. They are not a substitute for official candidate bulletins.
              </p>
              <dl className="mt-5 divide-y divide-[color-mix(in_srgb,var(--semantic-border-soft)_100%,transparent)] border-t border-[var(--semantic-border-soft)]">
                {examConditionRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-1 py-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:items-start sm:gap-6 sm:py-3.5"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{row.label}</dt>
                    <dd className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-[var(--theme-heading-text)]">{row.value}</p>
                      {row.meta ? (
                        <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{row.meta}</p>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>,
          )
        : null}

      {readiness?.ok ? (
        sectionShell(
          <div className="border-t-0 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">Live item pool</h2>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                  CAT-scoped, pathway-isolated items available for selection right now.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Available</p>
                <p className="font-mono text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{readiness.availableQuestions}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
              Launch requires at least {readiness.requiredQuestions} complete, validated items in this pool. Counts change as
              your bank grows; refresh if you have just added questions.
            </p>
          </div>,
        )
      ) : null}

      {publicCopy && readinessConfig ? (
        sectionShell(
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">How this CAT works</h2>
            <p className="mt-2 text-sm font-medium text-[var(--semantic-text-secondary)]">{catHowItWorksIntro(publicCopy)}</p>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-[var(--theme-body-text)] marker:font-semibold">
              {catHowItWorksBulletItems(publicCopy, readinessConfig).map((item) => (
                <li key={item} className="pl-1">
                  {item}
                </li>
              ))}
            </ol>
          </div>,
        )
      ) : null}

      {sectionShell(
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">What happens after the session</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {afterSessionPoints.map((pt) => (
              <li key={pt} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>,
      )}

      {sectionShell(
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">Start exam simulation</h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--semantic-text-secondary)]">
            Starts the timed exam shell immediately after verification. Rationales stay off until the session completes (exam
            feedback mode). Exam interface theme follows your last in-exam choice or the app default.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              data-nn-qa-cat-start-session
              disabled={creating || uiState.startDisabled || isHardBlockingReadinessCode(readinessCode)}
              className="inline-flex min-h-11 min-w-[200px] items-center justify-center rounded-md px-6 text-sm font-semibold text-[var(--role-cta-foreground,var(--theme-primary-foreground))] shadow-sm transition hover:opacity-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] disabled:cursor-not-allowed disabled:opacity-45"
              style={{ background: "var(--role-cta, var(--semantic-text-primary))" }}
              onClick={() => void start()}
            >
              {creating ? "Starting…" : readinessLoading ? "Checking pool…" : "Start exam simulation"}
            </button>
            <Link
              href={pathwayQuestionsHref ?? "/app/questions"}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] bg-transparent px-5 text-sm font-semibold text-[var(--theme-heading-text)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
            >
              Warm up in question bank
            </Link>
            <Link
              href={lessonsHubHref}
              className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
            >
              Review lessons first
            </Link>
            {!readinessLoading && readinessCode === "readiness_fetch_failed" ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
                onClick={() => {
                  setReadiness(null);
                  setReadinessRefreshToken((t) => t + 1);
                }}
              >
                Retry readiness check
              </button>
            ) : null}
          </div>
          <p className="mt-4 text-xs text-[var(--semantic-text-muted)]">
            <Link href="/app/practice-tests" className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              Practice tests hub
            </Link>{" "}
            — resume an in-progress linear or adaptive session, or open a prior report.
          </p>
        </div>,
      )}

      <div className="rounded-lg border border-dashed border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_30%,var(--semantic-surface))] px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">More study tools</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={lessonsHubHref}
            className="inline-flex min-h-10 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            Lessons
          </Link>
          <Link
            href={pathwayQuestionsHref ?? "/app/questions"}
            className="inline-flex min-h-10 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            {pathwayQuestionsHref ? "Pathway question bank" : "Question bank"}
          </Link>
          <Link
            href="/app/practice-tests"
            className="inline-flex min-h-10 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            All practice exams
          </Link>
          <Link
            href={normalizedPathwayId ? pathwayHubAppQuestionsHref(normalizedPathwayId) : "/app/account/study-preferences"}
            className="inline-flex min-h-10 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            App question bank
          </Link>
        </div>
      </div>

      <footer className="border-t border-[var(--semantic-border-soft)] pt-4 text-center text-[11px] text-[var(--semantic-text-muted)]">
        NurseNest adaptive engine · pathway-isolated content · timed exam simulation mode
      </footer>

    </div>
  );
}
