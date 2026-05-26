"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";
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
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import {
  buildCatExamSimulationCreatePayload,
  isHardBlockingReadinessCode,
  normalizePathwaySelection,
  resolveCatStartUiState,
} from "@/components/student/pathway-cat-start-payload";
import { emitRuntimeEvent } from "@/lib/runtime/client-runtime-event";
import { safeRouterReplace } from "@/lib/runtime/client-navigation";

function sectionShell(children: ReactNode, className = "") {
  return <section className={`lv-shell nn-premium-cat-section ${className}`.trim()}>{children}</section>;
}

function pathwayRuntimeTelemetry(pathway: PracticeTestPathwayClientShell | undefined) {
  if (!pathway) return {};
  return {
    nursingTier: pathway.roleTrack,
    examType: pathway.examCode,
    examFamily: String(pathway.examFamily ?? ""),
    runtimeMode: "cat",
    bootstrapSurface: "pathway_cat_start",
  };
}

const CAT_START_ROOT_CLASS =
  "nn-cat-premium-convergence mx-auto max-w-6xl space-y-7 px-3 text-[var(--semantic-text-primary)] sm:px-4 lg:px-0";

const CAT_START_CONVERGENCE_ATTRS = {
  "data-nn-cat-premium-convergence": "",
  "data-nn-premium-full-platform-convergence": "",
  "data-nn-premium-platform-family": "exam-study",
} as const;

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
  /** Per pathway: lesson links, empty list when truly none, or `null` when preview load failed (never fake-empty on error). */
  fallbackLessonsByPathway?: Record<string, Array<{ slug: string; title: string }> | null>;
}) {
  const router = useRouter();
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
  const createInFlightRef = useRef(false);

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
    () => (readinessConfig && pathwayMeta ? publicCopyForReadinessConfig(readinessConfig, pathwayMeta) : null),
    [readinessConfig, pathwayMeta],
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
  const rawFallbackLessons = normalizedPathwayId ? fallbackLessonsByPathway?.[normalizedPathwayId] : undefined;
  const fallbackLessons = Array.isArray(rawFallbackLessons) ? rawFallbackLessons : [];
  const fallbackLessonsLoadFailed = Boolean(normalizedPathwayId && rawFallbackLessons === null);
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
      return { blocked: true, title: "Pathway does not match your subscription" };
    }
    if (readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid) {
      return { blocked: true, title: "Not enough CAT-ready questions yet" };
    }
    return { blocked: false, title: "We could not verify CAT readiness right now" };
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
      const ctl = new AbortController();
      const tid = window.setTimeout(() => ctl.abort(), 25_000);
      try {
        const res = await fetch(`/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(normalizedPathwayId)}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: ctl.signal,
        });
        if (!res.ok) {
          if (!cancelled) {
            setReadiness({
              ok: false,
              code: `readiness_http_${res.status}`,
              message:
                res.status === 429
                  ? "Too many readiness checks in a short window. Wait a few seconds and use Retry below."
                  : res.status === 503
                    ? "Readiness check is temporarily unavailable. Try again shortly."
                    : `Readiness check failed (HTTP ${res.status}). Try again or open the practice tests hub.`,
            });
          }
          return;
        }
        let data: CatPracticeReadinessResult;
        try {
          data = (await res.json()) as CatPracticeReadinessResult;
        } catch {
          if (!cancelled) {
            setReadiness({ ok: false, code: "readiness_bad_json", message: "Received an invalid readiness response. Refresh the page and try again." });
          }
          return;
        }
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
      } catch (e) {
        if (!cancelled) {
          const aborted = e instanceof DOMException && e.name === "AbortError";
          setReadiness({
            ok: false,
            code: aborted ? "readiness_timeout" : "readiness_fetch_failed",
            message: aborted
              ? "Timed out while verifying the CAT pool (25s). Check your connection and try again, or open the practice tests hub."
              : "Could not verify adaptive pool readiness. Check your connection and try again.",
          });
        }
      } finally {
        window.clearTimeout(tid);
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
      if (domValue.length > 0) setPathwayId(domValue);
    }, 300);
    return () => window.clearInterval(intervalId);
  }, [needsPathwayChoice, normalizedPathwayId]);

  const start = useCallback(async () => {
    if (!normalizedPathwayId || !pathwayMeta) return;
    if (createInFlightRef.current) return;
    createInFlightRef.current = true;
    setCreating(true);
    setError(null);
    setErrorCode(null);
    const startAt = performance.now();
    try {
      const payload = buildCatExamSimulationCreatePayload(pathwayMeta);
      emitRuntimeEvent("cat_start_clicked", {
        pathwayId: normalizedPathwayId,
        ...pathwayRuntimeTelemetry(pathwayMeta),
      });
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
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 28_000);
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "x-nn-study-launch-surface": "practice_exams" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).finally(() => window.clearTimeout(timeoutId));
      let data: { id?: string; error?: string; code?: string };
      try {
        data = (await res.json()) as { id?: string; error?: string; code?: string };
      } catch {
        data = { error: "Received an invalid response while starting the CAT session.", code: "create_bad_json" };
      }
      emitRuntimeEvent("cat_session_create_result", {
        pathwayId: normalizedPathwayId,
        ...pathwayRuntimeTelemetry(pathwayMeta),
        status: res.status,
        ok: res.ok,
        errorCode: data.code ?? "",
        elapsedMs: Math.round(performance.now() - startAt),
      });
      if (!res.ok) {
        if (isDev) console.error("[CAT start] rejected", { status: res.status, code: data.code ?? null, error: data.error ?? "Could not start session." });
        setErrorCode(typeof data.code === "string" ? data.code : null);
        throw new Error(data.error ?? "Could not start session.");
      }
      if (!data.id) {
        if (isDev) console.error("[CAT start] missing session id", { status: res.status });
        throw new Error("Session was created without an id. Please try again.");
      }
      const target = `/app/practice-tests/${encodeURIComponent(data.id)}`;
      emitRuntimeEvent("cat_start_navigation_attempt", {
        pathwayId: normalizedPathwayId,
        sessionId: data.id,
        ...pathwayRuntimeTelemetry(pathwayMeta),
        target,
      });
      safeRouterReplace(router, target, {
        fallbackDelayMs: 1200,
        context: {
          feature: "cat_start",
          pathwayId: normalizedPathwayId,
          sessionId: data.id,
        },
      });
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === "AbortError";
      const message = aborted
        ? "Starting your CAT session timed out. Check your connection and try again."
        : e instanceof Error ? e.message : "Could not start session.";
      emitRuntimeEvent("cat_session_create_result", {
        pathwayId: normalizedPathwayId,
        ...pathwayRuntimeTelemetry(pathwayMeta),
        ok: false,
        errorCode: aborted ? "create_timeout" : errorCode ?? "create_failed",
        elapsedMs: Math.round(performance.now() - startAt),
      });
      setError(`Unable to start exam: ${message}`);
    } finally {
      setCreating(false);
      createInFlightRef.current = false;
    }
  }, [normalizedPathwayId, pathwayId, pathwayMeta, isDev, router]);

  const stats = heroChips.length > 0 ? heroChips : [
    { id: "mode", label: "Mode", value: catShort ?? "CAT / LOFT" },
    { id: "pool", label: "Pool status", value: readiness?.ok ? `${readiness.availableQuestions} live` : "Readiness checked" },
    { id: "scope", label: "Scope", value: pathwayOptionLabel ?? "Pathway aligned" },
    { id: "feedback", label: "Reports", value: "Progress saved" },
  ];
  const visibleConditionRows = examConditionRows.slice(0, 4);
  const previewModeLabel = catShort?.toLowerCase().includes("loft") ? "LOFT readiness" : "CAT readiness";

  if (pathwayOptions.length === 0) {
    return (
      <div
        className="lv-shell nn-premium-cat-section nn-cat-premium-convergence p-6 text-sm text-[var(--semantic-text-secondary)]"
        {...CAT_START_CONVERGENCE_ATTRS}
        data-nn-premium-platform-module="cat"
      >
        <p>No exam pathways match your subscription region and tier.</p>
        <Link href="/app/practice-tests" className="mt-3 inline-block text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2">
          Back to Practice Tests
        </Link>
      </div>
    );
  }

  return (
    <div className={CAT_START_ROOT_CLASS} {...CAT_START_CONVERGENCE_ATTRS} data-nn-premium-platform-module="cat">
      <nav aria-label="Pathway context" className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            Practice Tests
            {pathwayOptionLabel ? (
              <>
                <span aria-hidden className="mx-1.5 text-[var(--semantic-border-soft)]">/</span>
                <span className="text-[var(--semantic-text-secondary)]">{pathwayOptionLabel}</span>
              </>
            ) : null}
          </p>
          <Link
            href="/app/practice-tests"
            className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            ← Return to Practice Tests
          </Link>
        </div>
        <div className="hidden text-[var(--semantic-brand)] sm:block" aria-hidden>
          <HeaderBrandLockup />
        </div>
      </nav>

      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[0_24px_80px_color-mix(in_srgb,var(--semantic-brand)_10%,transparent)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(104deg,color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))_0%,color-mix(in_srgb,var(--semantic-brand)_9%,var(--semantic-surface))_42%,transparent_42.2%,transparent_100%)]" aria-hidden />
        <div className="pointer-events-none absolute -left-12 top-10 text-[var(--semantic-brand)] opacity-[0.055]" aria-hidden>
          <HeaderBrandLockup />
        </div>
        <div className="relative grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-14">
          <div className="flex min-h-[24rem] flex-col justify-center">
            <p className="inline-flex w-fit rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
              {catLine ?? "Adaptive exam prep"}
            </p>
            <h1 className="mt-5 max-w-2xl text-[2.35rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-[var(--theme-heading-text)] sm:text-[3rem] lg:text-[3.55rem]">
              Adaptive questions that make the real exam <span className="text-[var(--semantic-brand)]">feel familiar.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
              {publicCopy?.subtitle ??
                "Start a timed, pathway-scoped CAT or LOFT simulation with exam-style pacing, locked rationales, and saved progress after every attempt."}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                data-nn-qa-cat-start-session
                disabled={creating || uiState.startDisabled || isHardBlockingReadinessCode(readinessCode)}
                className="nn-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => void start()}
              >
                {creating ? "Starting…" : readinessLoading ? "Checking pool…" : "Start"}
              </button>
              <Link
                href="/app/practice-tests"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_84%,transparent)] px-6 text-sm font-bold text-[var(--theme-heading-text)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
              >
                View past progress
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
              Starts the timed exam shell after readiness verification. Rationales stay off until completion so the interface behaves like an exam, not a tutor mode.
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[27rem] rounded-[1.4rem] border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,white)] p-5 shadow-[0_22px_70px_color-mix(in_srgb,var(--semantic-brand)_13%,transparent)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--semantic-brand)]">
                  {previewModeLabel}
                </p>
                <div className="flex gap-1" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className={`h-2 w-2 rounded-full ${i < 3 ? "bg-[var(--semantic-brand)]" : "bg-[var(--semantic-border-soft)]"}`} />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm font-semibold leading-relaxed text-[var(--theme-heading-text)]">
                A nurse is caring for a postpartum client who reports nipple soreness while breastfeeding. Which instruction should the nurse give first?
              </p>
              <div className="mt-4 space-y-2.5">
                {[
                  ["A", "Apply lanolin cream after each feeding", false],
                  ["B", "Assess latch position and technique with the next feeding", true],
                  ["C", "Alternate breast and formula feeding to rest nipples", false],
                  ["D", "Apply warm compresses before each feeding", false],
                ].map(([letter, answer, selected]) => (
                  <div
                    key={letter as string}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-xs font-medium ${
                      selected
                        ? "border-[color-mix(in_srgb,var(--semantic-success)_58%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                    }`}
                  >
                    <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${selected ? "bg-[var(--semantic-success)] text-white" : "bg-[color-mix(in_srgb,var(--semantic-panel-muted)_78%,var(--semantic-surface))] text-[var(--semantic-text-muted)]"}`}>
                      {letter as string}
                    </span>
                    <span>{answer as string}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-l-4 border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--semantic-surface))] px-3 py-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                <strong className="text-[var(--theme-heading-text)]">Rationale:</strong> latch assessment comes before topical treatment because it addresses the likely cause of nipple trauma.
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--semantic-border-soft)] pt-3 text-[11px] text-[var(--semantic-text-muted)]">
                <span>Q 11 · Difficulty calibrating</span>
                <span className="font-semibold text-[var(--semantic-brand)]">Next →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid overflow-hidden rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((chip) => (
          <div key={chip.id} className="border-b border-[var(--semantic-border-soft)] px-5 py-5 text-center last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0">
            <p className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{chip.value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{chip.label}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-lg" aria-hidden>↔</div>
          <h2 className="text-base font-bold text-[var(--theme-heading-text)]">Real adaptive logic</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">Correct answers increase challenge; missed items recalibrate. The session keeps you at your growth edge.</p>
        </article>
        <article className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-lg" aria-hidden>▣</div>
          <h2 className="text-base font-bold text-[var(--theme-heading-text)]">Exam-safe flow</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">Timed delivery, locked rationales, and completion reports preserve exam conditions while keeping your progress.</p>
        </article>
        <article className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-lg" aria-hidden>▥</div>
          <h2 className="text-base font-bold text-[var(--theme-heading-text)]">Domain tracking</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">Review readiness by exam domain after each CAT or LOFT attempt from your saved practice-test history.</p>
        </article>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nn-cat-pathway-select" className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Exam pathway</label>
              <select
                id="nn-cat-pathway-select"
                ref={pathwaySelectRef}
                data-nn-qa-cat-pathway-select
                className="block w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-heading-text)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
                value={pathwayId}
                onChange={(e) => setPathwayId(normalizePathwaySelection(e.target.value))}
                onInput={(e) => setPathwayId(normalizePathwaySelection((e.target as HTMLSelectElement).value))}
              >
                {pathwayOptions.length > 1 ? <option value="">Select the exam track for this session…</option> : null}
                {pathwayOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              {needsPathwayChoice ? <p className="text-sm text-[var(--semantic-text-secondary)]">Choose the pathway before starting so items, blueprint weighting, and limits match the correct exam scope.</p> : null}
              {readinessLoading ? <p className="text-sm text-[var(--semantic-text-secondary)]">Verifying adaptive pool{catShort ? ` for ${catShort}` : ""}…</p> : null}
            </div>

            {readiness?.ok ? (
              sectionShell(
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Live item pool</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)]">Ready to launch</h2>
                    <p className="font-mono text-4xl font-bold tabular-nums text-[var(--theme-heading-text)]">{readiness.availableQuestions}</p>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-muted)]">Launch requires at least {readiness.requiredQuestions} complete, validated items in this pool. Counts update as the bank grows.</p>
                </div>,
              )
            ) : null}
          </div>

          {readinessConfig && publicCopy && visibleConditionRows.length > 0 ? (
            sectionShell(
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">Exam conditions</h2>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">Values follow your selected pathway configuration and preserve the current app navigation and theme tokens.</p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {visibleConditionRows.map((row) => (
                    <div key={row.id} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_28%,var(--semantic-surface))] p-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{row.label}</dt>
                      <dd className="mt-1 text-sm font-semibold leading-snug text-[var(--theme-heading-text)]">{row.value}</dd>
                      {row.meta ? <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{row.meta}</p> : null}
                    </div>
                  ))}
                </dl>
              </div>,
            )
          ) : null}
        </div>

        {uiState.showReadinessMessage && readiness && !readiness.ok ? (
          <aside className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] p-4 text-sm shadow-sm" role="status">
            <p className="font-semibold text-[var(--theme-heading-text)]">{readinessGate.title}</p>
            <p className="mt-1 text-[var(--semantic-text-secondary)]">{readiness.message}</p>
            {fallbackLessonsLoadFailed ? <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">Recommended lessons could not be loaded for this pathway. Open your pathway lesson library from the hub.</p> : null}
            {fallbackLessons.length > 0 ? (
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Study next</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {fallbackLessons.slice(0, 5).map((lesson) => (
                    <li key={lesson.slug}>
                      <Link className="font-medium text-[var(--semantic-brand)] underline underline-offset-2" href={`${lessonsHubHref}/${encodeURIComponent(lesson.slug)}`}>{cleanLessonTitleForDisplay(lesson.title)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid && pathwayMeta ? <Link className="font-medium text-[var(--semantic-brand)] underline" href={buildExamPathwayPath(pathwayMeta, "questions")}>Open Pathway Question Bank</Link> : null}
              {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled ? <Link className="font-medium text-[var(--semantic-brand)] underline" href="/app/account/billing">Review subscription &amp; billing</Link> : null}
              {readiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found && pathwayMeta ? <Link className="font-medium text-[var(--semantic-brand)] underline" href={buildExamPathwayPath(pathwayMeta)}>Pathway hub</Link> : null}
              <Link className="font-medium text-[var(--semantic-brand)] underline" href="/app/practice-tests">Practice Tests Hub</Link>
            </div>
          </aside>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] p-4 text-sm">
            <p className="font-semibold text-[var(--semantic-danger)]">Unable to start session</p>
            <p className="mt-1 text-[var(--semantic-text-primary)]">{error}</p>
            {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous ? <CatAmbiguityPathwayPicker catEligibleOptions={pathwayOptions} surface="start_page" className="mt-3" /> : null}
            {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_weak_areas_empty ? <p className="mt-2 text-[var(--semantic-text-secondary)]">Tip: switch <strong>Pool basis</strong> to <strong>Balanced pool</strong>, use the question bank, then try weak areas again.</p> : null}
            {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_missed_items_empty ? <p className="mt-2 text-[var(--semantic-text-secondary)]">Tip: finish a graded practice session with at least one incorrect answer, or switch <strong>Pool basis</strong> to <strong>Balanced pool</strong>, then try missed-pool mode again.</p> : null}
          </div>
        ) : null}
      </div>

      {publicCopy && readinessConfig ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {sectionShell(
            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">How this {catShort ?? "exam"} works</h2>
              <p className="mt-2 text-sm font-medium text-[var(--semantic-text-secondary)]">{catHowItWorksIntro(publicCopy)}</p>
              <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-[var(--theme-body-text)] marker:font-semibold">
                {catHowItWorksBulletItems(publicCopy, readinessConfig).map((item) => <li key={item} className="pl-1">{item}</li>)}
              </ol>
            </div>,
          )}
          {sectionShell(
            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">After each session</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {afterSessionPoints.map((pt) => (
                  <li key={pt} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden /><span>{pt}</span></li>
                ))}
              </ul>
            </div>,
          )}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] bg-[var(--theme-heading-text)] px-5 py-9 text-center text-[var(--semantic-surface)] sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Different by design. Effective by evidence.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm opacity-75">Start a new exam, then return here to compare saved CAT/LOFT attempts, progress trends, and completed reports from the Practice Tests hub.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            data-nn-qa-cat-start-session-bottom
            disabled={creating || uiState.startDisabled || isHardBlockingReadinessCode(readinessCode)}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-surface)] px-6 text-sm font-bold text-[var(--theme-heading-text)] shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void start()}
          >
            {creating ? "Starting…" : readinessLoading ? "Checking pool…" : "Begin adaptive practice →"}
          </button>
          <Link href="/app/practice-tests" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-surface)_35%,transparent)] px-6 text-sm font-bold text-[var(--semantic-surface)] hover:bg-[color-mix(in_srgb,var(--semantic-surface)_10%,transparent)]">
            View past CAT/LOFT progress
          </Link>
        </div>
      </section>

      <section className="rounded-[1.25rem] border border-dashed border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_30%,var(--semantic-surface))] px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">More study tools</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={lessonsHubHref} className="inline-flex min-h-11 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]">Lessons</Link>
          <Link href={pathwayQuestionsHref ?? "/app/questions"} className="inline-flex min-h-11 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]">{pathwayQuestionsHref ? "Pathway Question Bank" : "Question Bank"}</Link>
          <Link href="/app/practice-tests" className="inline-flex min-h-11 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]">All practice exams</Link>
          <Link href={normalizedPathwayId ? pathwayHubAppQuestionsHref(normalizedPathwayId) : "/app/account/study-preferences"} className="inline-flex min-h-11 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]">App Question Bank</Link>
          {!readinessLoading && readiness && !readiness.ok && (readiness.code === "readiness_fetch_failed" || readiness.code === "readiness_timeout" || readiness.code === "readiness_bad_json" || (typeof readiness.code === "string" && readiness.code.startsWith("readiness_http_"))) ? (
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
              onClick={() => {
                setReadiness(null);
                setReadinessRefreshToken((t) => t + 1);
              }}
            >
              Retry readiness check
            </button>
          ) : null}
        </div>
      </section>

      <footer className="border-t border-[var(--semantic-border-soft)] pt-4 text-center text-[11px] text-[var(--semantic-text-muted)]">
        NurseNest adaptive engine · pathway-isolated content · timed exam simulation mode
      </footer>
    </div>
  );
}
