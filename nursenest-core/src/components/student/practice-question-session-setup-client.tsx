"use client";

import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  buildPracticeAdaptiveCreatePayload,
  type PracticeAdaptiveSelectionBasis,
} from "@/components/student/pathway-cat-start-payload";
import { appPathwayCatFullSetupHref, appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import {
  ADAPTIVE_PRACTICE_DEFAULT_LENGTH,
  ADAPTIVE_PRACTICE_FIXED_LENGTHS,
  CONTINUOUS_PRACTICE_LABEL,
  CONTINUOUS_PRACTICE_SEGMENT_LABEL,
  estimateAdaptivePracticeDuration,
  type AdaptivePracticeSessionLength,
} from "@/lib/practice-tests/adaptive-practice-session-length";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";

// ─────────────────────────────────────────────────────────────────────────────
// Body system definitions (topic strings match exam question `topic` labels)
// ─────────────────────────────────────────────────────────────────────────────

export const BODY_SYSTEMS = [
  { id: "cardiovascular", label: "Cardiovascular", topic: "Cardiovascular" },
  { id: "respiratory", label: "Respiratory", topic: "Respiratory" },
  { id: "renal", label: "Renal", topic: "Renal" },
  { id: "neurological", label: "Neurological", topic: "Neurological" },
  { id: "endocrine", label: "Endocrine", topic: "Endocrine" },
  { id: "gastrointestinal", label: "Gastrointestinal", topic: "Gastrointestinal" },
  { id: "musculoskeletal", label: "Musculoskeletal", topic: "Musculoskeletal" },
  { id: "hematologic", label: "Hematologic", topic: "Hematology" },
  { id: "immune", label: "Immune", topic: "Immune" },
  { id: "integumentary", label: "Integumentary", topic: "Integumentary" },
  { id: "reproductive", label: "Reproductive", topic: "Reproductive" },
  { id: "maternal_newborn", label: "Maternal/Newborn", topic: "Maternity" },
  { id: "pediatrics", label: "Pediatrics", topic: "Pediatrics" },
  { id: "mental_health", label: "Mental Health", topic: "Mental Health" },
  { id: "pharmacology", label: "Pharmacology", topic: "Pharmacology" },
  { id: "leadership", label: "Leadership/Priority", topic: "Leadership" },
] as const;

type BodySystemId = (typeof BODY_SYSTEMS)[number]["id"];

type SpecialFocusId = "weak" | "missed" | "starred";

const SPECIAL_FOCUS_CARDS: ReadonlyArray<{
  id: SpecialFocusId;
  label: string;
  hint: string;
  basis: PracticeAdaptiveSelectionBasis;
}> = [
  {
    id: "weak",
    label: "Weak Areas",
    hint: "Prioritizes low-accuracy topics. Combines with body systems when selected.",
    basis: "weak",
  },
  {
    id: "missed",
    label: "Previously Incorrect",
    hint: "Prioritizes recent wrong answers. Pool widens automatically if the slice is small.",
    basis: "missed",
  },
  {
    id: "starred",
    label: "Starred Questions",
    hint: "Uses questions where you saved a rationale in the question bank.",
    basis: "starred",
  },
];

/** Client-side retry when the server still rejects after soft pool expansion (belt-and-suspenders). */
const POOL_EXHAUSTED_CODES = new Set([
  "cat_pool_invalid",
  "cat_weak_areas_empty",
  "cat_missed_items_empty",
  "cat_starred_items_empty",
]);

/** Internal API error codes that must never be shown verbatim in the learner UI. */
const INTERNAL_ERROR_CODES = new Set(["INVALID_SURFACE", "session_create_failed", "session_id_missing"]);

type PracticeSessionType = "adaptive_practice" | "full_cat" | "custom_cat";

const SESSION_TYPE_OPTIONS: ReadonlyArray<{
  id: PracticeSessionType;
  label: string;
  summary: string;
  detail: string;
}> = [
  {
    id: "adaptive_practice",
    label: "Adaptive Practice",
    summary: "Short to long runs · rationale after each question · untimed",
    detail:
      "Difficulty adjusts as you answer. Pick a question count or unlimited drilling; end the session whenever you are done.",
  },
  {
    id: "full_cat",
    label: "Full CAT Exam",
    summary: "Timed · exam-style · rationales after completion",
    detail:
      "NCLEX-style adaptive length (typically 85–150 items). Stopping rules follow your pathway configuration — not the short practice caps.",
  },
  {
    id: "custom_cat",
    label: "Custom CAT Setup",
    summary: "Configure timing, feedback, and presentation before launch",
    detail:
      "Simulates adaptive testing with your chosen rules. This may not match official NCLEX stopping behavior or readiness scoring on full CAT runs.",
  },
];

const cardBase =
  "flex min-h-[4.25rem] flex-col justify-center rounded-[1.35rem] border px-4 py-3.5 text-left text-sm font-semibold transition sm:min-h-[4.5rem] sm:px-4 sm:py-4";

function cardSelected(accent: "brand" | "warning") {
  if (accent === "warning") {
    return `${cardBase} border-[color-mix(in_srgb,var(--semantic-warning)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--semantic-warning)_18%,transparent)]`;
  }
  return `${cardBase} border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]`;
}

const cardUnselected = `${cardBase} border-[color-mix(in_srgb,var(--semantic-info)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function PracticeQuestionSessionSetupClient({
  defaultPathwayId,
  pathwayOptions,
}: {
  defaultPathwayId: string | null;
  pathwayOptions: { id: string; label: string }[];
}) {
  const router = useRouter();
  const urlParams = useSearchParams();

  const [pathwayId, setPathwayId] = useState<string | null>(() => {
    const fromUrl = urlParams.get("pathwayId")?.trim();
    if (fromUrl && pathwayOptions.some((p) => p.id === fromUrl)) return fromUrl;
    return defaultPathwayId;
  });

  const alliedFromUrl = urlParams.get("alliedProfession")?.trim().toLowerCase() ?? "";

  const [selectedSystems, setSelectedSystems] = useState<Set<BodySystemId>>(new Set());
  const [specialFocus, setSpecialFocus] = useState<SpecialFocusId | null>(null);
  const [sessionType, setSessionType] = useState<PracticeSessionType>("adaptive_practice");
  const [sessionLength, setSessionLength] = useState<AdaptivePracticeSessionLength>(ADAPTIVE_PRACTICE_DEFAULT_LENGTH);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const effectivePathwayId = pathwayId ?? defaultPathwayId;

  const catFullSetupHref = useMemo(
    () => (effectivePathwayId ? appPathwayCatFullSetupHref(effectivePathwayId) : "/app/practice-tests/start"),
    [effectivePathwayId],
  );

  const catDirectHref = useMemo(() => {
    if (!effectivePathwayId) return "/app/practice-tests";
    let href = appPathwayCatSessionStartPath(effectivePathwayId);
    if (alliedFromUrl && isAlliedMarketingCorePathwayId(effectivePathwayId)) {
      href += `&alliedProfession=${encodeURIComponent(alliedFromUrl)}`;
    }
    return href;
  }, [effectivePathwayId, alliedFromUrl]);

  const isAllSystems = selectedSystems.size === 0 && specialFocus === null;
  const selectedSystemCount = selectedSystems.size;

  const topicNames: string[] = useMemo(() => {
    if (selectedSystems.size === 0) return [];
    return BODY_SYSTEMS.filter((s) => selectedSystems.has(s.id)).map((s) => s.topic);
  }, [selectedSystems]);

  const catSelectionBasis: PracticeAdaptiveSelectionBasis = useMemo(() => {
    if (!specialFocus) return "random";
    const row = SPECIAL_FOCUS_CARDS.find((c) => c.id === specialFocus);
    return row ? row.basis : "random";
  }, [specialFocus]);

  const hasActiveFilter = !isAllSystems;

  function toggleSystem(id: BodySystemId) {
    setSelectedSystems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setFocus(id: SpecialFocusId | null) {
    setSpecialFocus((prev) => (prev === id ? null : id));
  }

  function selectAllSystems() {
    setSelectedSystems(new Set());
    setSpecialFocus(null);
  }

  function clearAllFilters() {
    selectAllSystems();
  }

  async function postSession(override?: { topicNames?: string[]; catSelectionBasis?: PracticeAdaptiveSelectionBasis }): Promise<string | null> {
    const payload = buildPracticeAdaptiveCreatePayload({
      pathwayId: effectivePathwayId!,
      topicNames: override?.topicNames ?? topicNames,
      catSelectionBasis: override?.catSelectionBasis ?? catSelectionBasis,
      sessionLength,
      selectionStrictness: "soft",
    });
    const res = await fetch("/api/practice-tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-nn-study-launch-surface": "practice_exams",
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { id?: string; error?: string; code?: string };
    if (res.ok && data.id) return data.id;
    const rawError = typeof data.error === "string" && data.error.trim() ? data.error : "session_create_failed";
    const safeError = INTERNAL_ERROR_CODES.has(rawError) ? "session_create_failed" : rawError;
    const err = new Error(safeError);
    (err as Error & { code?: string }).code = typeof data.code === "string" ? data.code : undefined;
    throw err;
  }

  const startAdaptivePractice = useCallback(async () => {
    if (!effectivePathwayId || starting) return;
    setStartError(null);
    setStarting(true);

    try {
      let sessionId: string | null = null;

      try {
        sessionId = await postSession();
      } catch (firstErr) {
        const code = (firstErr as { code?: string }).code;
        const filtersWereActive = topicNames.length > 0 || catSelectionBasis !== "random";
        if (filtersWereActive && code && POOL_EXHAUSTED_CODES.has(code)) {
          sessionId = await postSession({ topicNames: [], catSelectionBasis: "random" });
        } else {
          throw firstErr;
        }
      }

      if (!sessionId) throw new Error("session_id_missing");
      trackClientEvent(PH.learnerAdaptivePracticeSetupStarted, {
        pathway_id: effectivePathwayId,
        session_length: sessionLength,
        continuous: sessionLength === "unlimited",
        topic_count: topicNames.length,
        selection_basis: catSelectionBasis,
        special_focus: specialFocus ?? undefined,
      });
      // Include pathwayId so the exam page can load the pathway surface without
      // an extra DB round-trip and the learner never sees a second pathway selector.
      const dest = effectivePathwayId
        ? `/app/practice-tests/${sessionId}?pathwayId=${encodeURIComponent(effectivePathwayId)}`
        : `/app/practice-tests/${sessionId}`;
      router.push(dest);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setStartError(
        msg && !INTERNAL_ERROR_CODES.has(msg)
          ? msg
          : "Could not start your practice session. Please try again.",
      );
    } finally {
      setStarting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePathwayId, topicNames, catSelectionBasis, sessionLength, starting, router]);

  const durationEstimate = useMemo(() => estimateAdaptivePracticeDuration(sessionLength), [sessionLength]);

  const topicFocusLabel = useMemo(() => {
    if (specialFocus === "weak") return "Weak areas prioritized";
    if (specialFocus === "missed") return "Previously incorrect";
    if (specialFocus === "starred") return "Starred questions";
    if (selectedSystemCount === 0) return "All body systems";
    if (selectedSystemCount === 1) {
      const sys = BODY_SYSTEMS.find((s) => selectedSystems.has(s.id));
      return sys?.label ?? "1 system";
    }
    return `${selectedSystemCount} body systems`;
  }, [specialFocus, selectedSystemCount, selectedSystems]);

  const sessionPreviewTitle =
    sessionLength === "unlimited" ? "Continuous review" : "Adaptive Practice";

  return (
    <div className="space-y-8" data-testid="practice-adaptive-setup">
      <header className="nn-learner-page-hero space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.7rem]">
          Practice Questions
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Build exam readiness with adaptive practice and immediate rationales.
        </p>
      </header>

      {pathwayOptions.length > 1 ? (
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Exam track</p>
          <select
            className="w-full max-w-sm rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm font-medium text-[var(--semantic-text-primary)]"
            value={pathwayId ?? ""}
            onChange={(e) => setPathwayId(e.target.value || null)}
          >
            {pathwayOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </section>
      ) : null}

      {/* Session type — separates adaptive practice from CAT flows */}
      <section
        className="space-y-4 rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--semantic-surface))] p-5 sm:p-7"
        aria-labelledby="session-type-heading"
        data-testid="session-type-section"
      >
        <div className="space-y-1">
          <p
            id="session-type-heading"
            className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
          >
            Session type
          </p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Choose how you want to practice. Adaptive Practice stays on this page; CAT modes open their own launch flow.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3" role="radiogroup" aria-label="Session type">
          {SESSION_TYPE_OPTIONS.map((opt) => {
            const on = sessionType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={on}
                data-testid={`session-type-${opt.id}`}
                onClick={() => setSessionType(opt.id)}
                className={on ? cardSelected("brand") : cardUnselected}
              >
                <span className="text-base font-semibold">{opt.label}</span>
                <span className="mt-1 block text-xs font-normal text-[var(--semantic-text-muted)]">{opt.summary}</span>
                {on ? (
                  <span className="mt-2 block text-xs font-normal leading-relaxed text-[var(--semantic-text-secondary)]">
                    {opt.detail}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {sessionType !== "adaptive_practice" ? (
        <section
          className="space-y-4 rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-7"
          data-testid="cat-mode-handoff"
        >
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {sessionType === "full_cat"
              ? "Full CAT uses pathway exam rules: timed delivery, test-mode feedback, and adaptive stopping between the configured minimum and maximum item counts."
              : "Custom CAT lets you set presentation, timers, and question caps before the session starts."}
          </p>
          {sessionType === "full_cat" ? (
            <p className="text-xs text-[var(--semantic-text-muted)]">
              Exam length (85–150 adaptive) applies to NCLEX-style simulation on your pathway.
            </p>
          ) : null}
          {sessionType === "custom_cat" ? (
            <p
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-3 py-2.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]"
              data-testid="custom-cat-warning"
            >
              This mode simulates adaptive testing but may not reflect official NCLEX stopping rules or the
              same readiness scoring as a full CAT exam on your pathway.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link
              href={sessionType === "full_cat" ? catDirectHref : catFullSetupHref}
              className="nn-btn-primary inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
              data-testid="session-type-continue-link"
            >
              {sessionType === "full_cat" ? "Continue to Full CAT" : "Open Custom CAT setup"}
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
              onClick={() => setSessionType("adaptive_practice")}
            >
              Back to Adaptive Practice
            </button>
          </div>
        </section>
      ) : null}

      {sessionType === "adaptive_practice" ? (
        <>
      {/* Body systems — lessons-hub style card grid */}
      <section
        className="space-y-4 rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 sm:p-7"
        aria-labelledby="body-systems-heading"
        data-testid="body-systems-section"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p
              id="body-systems-heading"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
            >
              Body systems
            </p>
            {selectedSystemCount > 0 ? (
              <p className="text-xs font-medium text-[var(--semantic-brand)]" data-testid="selected-count">
                {selectedSystemCount} {selectedSystemCount === 1 ? "system" : "systems"} selected · empty = all systems
              </p>
            ) : (
              <p className="text-xs text-[var(--semantic-text-muted)]">None selected = all systems (implicit)</p>
            )}
          </div>
          {selectedSystemCount > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedSystems(new Set())}
              data-testid="clear-systems-btn"
              className="text-xs font-semibold text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-primary)] hover:underline"
            >
              Clear systems
            </button>
          ) : null}
        </div>

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          role="group"
          aria-label="Body system filters"
          data-testid="body-systems-grid"
        >
          {BODY_SYSTEMS.map((sys) => {
            const on = selectedSystems.has(sys.id);
            const visual = getLessonHubSystemVisual(sys.id);
            const Icon = visual.icon;
            const systemStyle = { "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties;
            return (
              <button
                key={sys.id}
                type="button"
                aria-pressed={on}
                data-nn-body-system={sys.id}
                style={systemStyle}
                onClick={() => toggleSystem(sys.id)}
                className={[
                  on ? cardSelected("brand") : cardUnselected,
                  "flex flex-row items-center gap-3 text-left",
                ].join(" ")}
              >
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]"
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 leading-snug">{sys.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Special focus */}
      <section
        className="space-y-4 rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--semantic-surface))] p-5 sm:p-7"
        aria-labelledby="special-focus-heading"
        data-testid="special-focus-section"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            id="special-focus-heading"
            className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
          >
            Special focus
          </p>
          {hasActiveFilter ? (
            <button
              type="button"
              onClick={clearAllFilters}
              data-testid="clear-all-btn"
              className="text-xs font-semibold text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-primary)] hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          role="group"
          aria-label="Special focus modes"
          data-testid="special-focus-grid"
        >
          <button
            type="button"
            aria-pressed={isAllSystems}
            onClick={selectAllSystems}
            className={isAllSystems ? cardSelected("brand") : cardUnselected}
            data-testid="special-focus-all-systems"
          >
            All Systems
            <span className="mt-1 block text-xs font-normal text-[var(--semantic-text-muted)]">
              No topic narrow · standard adaptive mix
            </span>
          </button>

          {SPECIAL_FOCUS_CARDS.map((c) => {
            const on = specialFocus === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                title={c.hint}
                data-testid={`special-focus-${c.id}`}
                onClick={() => setFocus(c.id)}
                className={on ? cardSelected("warning") : cardUnselected}
              >
                {c.label}
                <span className="mt-1 block text-xs font-normal text-[var(--semantic-text-muted)]">{c.hint}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Question count — segmented control */}
      <section className="space-y-4" aria-labelledby="question-count-heading">
        <div className="space-y-1.5">
          <p
            id="question-count-heading"
            className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
          >
            Question count
          </p>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{durationEstimate.detail}</p>
        </div>
        <div
          className="grid grid-cols-4 gap-2 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] p-2 sm:grid-cols-8 sm:p-2.5"
          role="group"
          aria-label="Number of questions"
          data-testid="question-count-group"
        >
          {ADAPTIVE_PRACTICE_FIXED_LENGTHS.map((n) => {
            const on = sessionLength === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                data-testid={`question-count-${n}`}
                onClick={() => setSessionLength(n)}
                className={[
                  "min-h-12 rounded-2xl px-2 text-sm font-bold tabular-nums transition duration-200 motion-reduce:transition-none",
                  on
                    ? "bg-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-[0_2px_12px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] ring-2 ring-[color-mix(in_srgb,var(--semantic-brand)_50%,transparent)]"
                    : "bg-transparent text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface)] hover:text-[var(--semantic-text-primary)]",
                ].join(" ")}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={sessionLength === "unlimited"}
            data-testid="question-count-continuous"
            onClick={() => setSessionLength("unlimited")}
            className={[
              "col-span-4 min-h-12 rounded-2xl px-3 text-sm font-bold transition duration-200 motion-reduce:transition-none sm:col-span-8",
              sessionLength === "unlimited"
                ? "bg-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-[0_2px_12px_color-mix(in_srgb,var(--semantic-info)_20%,transparent)] ring-2 ring-[color-mix(in_srgb,var(--semantic-info)_48%,transparent)]"
                : "bg-transparent text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface)] hover:text-[var(--semantic-text-primary)]",
            ].join(" ")}
          >
            {CONTINUOUS_PRACTICE_SEGMENT_LABEL}
          </button>
        </div>
        {sessionLength === "unlimited" ? (
          <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">
            <span className="font-semibold text-[var(--semantic-text-secondary)]">{CONTINUOUS_PRACTICE_LABEL}</span>
            {" — "}
            adaptive difficulty stays on, progress saves as you go, and you can pause and resume from Practice Tests.
          </p>
        ) : null}
      </section>

      {/* Session settings (adaptive practice defaults) */}
      <section
        className="space-y-3 rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6"
        aria-labelledby="session-settings-heading"
        data-testid="session-settings-section"
      >
        <p
          id="session-settings-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
        >
          Session settings
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            { label: "Rationale mode", value: "After each question (study mode)" },
            { label: "Timing", value: "Untimed" },
            { label: "Tutor mode", value: "On — review rationale before advancing" },
            { label: "Pool filters", value: "Soft expansion when the slice is small" },
            { label: "Difficulty", value: "Adaptive to your responses" },
            {
              label: "Stopping",
              value:
                sessionLength === "unlimited"
                  ? "You end the session when ready"
                  : `Ends after ${sessionLength} questions`,
            },
            { label: "Estimated time", value: durationEstimate.label },
          ].map((row) => (
            <li
              key={row.label}
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_30%,var(--semantic-surface))] px-3 py-2.5"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                {row.label}
              </span>
              <span className="mt-0.5 block text-sm font-medium text-[var(--semantic-text-primary)]">{row.value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Session preview */}
      <section
        className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] p-5 shadow-sm sm:p-6"
        aria-labelledby="session-preview-heading"
        data-testid="session-preview-card"
      >
        <p
          id="session-preview-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
        >
          Ready to start
        </p>
        <p className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{sessionPreviewTitle}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--semantic-text-secondary)]">
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">
              {sessionLength === "unlimited" ? CONTINUOUS_PRACTICE_LABEL : `${sessionLength} questions`}
            </span>
            {" · "}
            Tutor mode · {topicFocusLabel}
          </li>
          <li>
            Estimated time:{" "}
            <span className="font-medium text-[var(--semantic-text-primary)]">{durationEstimate.label}</span>
            {" · "}
            Untimed · Rationale after each question
          </li>
        </ul>
      </section>

      {/* Primary CTA — sticky on mobile */}
      <div
        className="space-y-3 sm:static sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sticky bottom-0 z-10 -mx-4 border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] px-4 py-4 backdrop-blur-md sm:mx-0"
        data-testid="adaptive-practice-cta"
      >
        <button
          type="button"
          disabled={!effectivePathwayId || starting}
          onClick={() => void startAdaptivePractice()}
          data-testid="start-practice-btn"
          className="nn-btn-primary inline-flex min-h-12 w-full items-center justify-center rounded-full px-8 text-base font-semibold shadow-md disabled:opacity-50 sm:w-auto sm:min-w-[18rem]"
        >
          {starting ? "Starting…" : "Start Adaptive Practice"}
        </button>
        {startError ? (
          <p className="text-sm text-[var(--semantic-danger)]" role="alert">
            {startError}
          </p>
        ) : null}
        <p className="max-w-xl text-xs leading-relaxed text-[var(--semantic-text-muted)]">
          Every option above is valid for this mode — you will not see a surprise minimum question error on start.
          Progress saves to your account; resume in-progress sessions from Practice Tests when you return.
        </p>
      </div>

      <div className="border-t border-[var(--semantic-border-soft)]" data-testid="post-cta-divider" />

      <section className="space-y-3" aria-labelledby="other-options-heading" data-testid="secondary-cards">
        <p
          id="other-options-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
        >
          More ways to practice
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <SecondaryCard
            href="/app/questions/bank"
            title="Question bank"
            body="Search, filter, and browse questions by topic or keyword."
          />
          <SecondaryCard
            href="/app/practice-tests"
            title="Practice tests hub"
            body="Linear exams, recent attempts, and CAT history in one place."
          />
        </div>
      </section>
        </>
      ) : null}
    </div>
  );
}

function SecondaryCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-4 text-sm transition hover:bg-[var(--semantic-panel-muted)]"
    >
      <span className="font-semibold text-[var(--semantic-text-secondary)]">{title}</span>
      <span className="mt-1 text-xs text-[var(--semantic-text-muted)]">{body}</span>
    </Link>
  );
}
