"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  buildPracticeAdaptiveCreatePayload,
  type PracticeAdaptiveSelectionBasis,
} from "@/components/student/pathway-cat-start-payload";
import { appPathwayCatFullSetupHref } from "@/lib/exam-pathways/pathway-cat-flow";

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

const QUESTION_COUNTS = [10, 20, 30, 50] as const;
const DEFAULT_QUESTION_COUNT = 30;

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

  const [selectedSystems, setSelectedSystems] = useState<Set<BodySystemId>>(new Set());
  const [specialFocus, setSpecialFocus] = useState<SpecialFocusId | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(DEFAULT_QUESTION_COUNT);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const effectivePathwayId = pathwayId ?? defaultPathwayId;

  const catFullSetupHref = useMemo(
    () => (effectivePathwayId ? appPathwayCatFullSetupHref(effectivePathwayId) : "/app/practice-tests/start"),
    [effectivePathwayId],
  );

  const catDirectHref = useMemo(
    () =>
      effectivePathwayId
        ? `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(effectivePathwayId)}`
        : "/app/practice-tests",
    [effectivePathwayId],
  );

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
      questionCount,
      selectionStrictness: "soft",
    });
    const res = await fetch("/api/practice-tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-nn-study-launch-surface": "practice_questions_hub",
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { id?: string; error?: string; code?: string };
    if (res.ok && data.id) return data.id;
    const err = new Error(typeof data.error === "string" && data.error.trim() ? data.error : "session_create_failed");
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
      router.push(`/app/practice-tests/${sessionId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setStartError(
        msg && msg !== "session_create_failed" && msg !== "session_id_missing"
          ? msg
          : "Could not start your practice session. Please try again.",
      );
    } finally {
      setStarting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePathwayId, topicNames, catSelectionBasis, questionCount, starting, router]);

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

      {/* 1. Body systems — lessons-hub style card grid */}
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
            return (
              <button
                key={sys.id}
                type="button"
                aria-pressed={on}
                data-nn-body-system={sys.id}
                onClick={() => toggleSystem(sys.id)}
                className={on ? cardSelected("brand") : cardUnselected}
              >
                {sys.label}
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

      {/* 3. Question count */}
      <section className="space-y-3" aria-labelledby="question-count-heading">
        <p
          id="question-count-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
        >
          Question count
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Number of questions" data-testid="question-count-group">
          {QUESTION_COUNTS.map((n) => {
            const on = questionCount === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => setQuestionCount(n)}
                className={[
                  "min-h-11 min-w-[4.5rem] rounded-full border px-5 text-sm font-semibold transition",
                  on
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]",
                ].join(" ")}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Primary CTA */}
      <div className="space-y-3">
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
        <p className="text-xs text-[var(--semantic-text-muted)]">
          Rationale after each question · Adaptive difficulty · Untimed · Soft filters keep sessions full
        </p>
      </div>

      <div className="border-t border-[var(--semantic-border-soft)]" data-testid="post-cta-divider" />

      {/* 5. Secondary cards */}
      <section className="space-y-3" aria-labelledby="other-options-heading" data-testid="secondary-cards">
        <p
          id="other-options-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
        >
          Other practice options
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <SecondaryCard
            href={catDirectHref}
            title="Run Full CAT"
            body="Timed, exam-like adaptive session. No rationale mid-session."
          />
          <SecondaryCard
            href={catFullSetupHref}
            title="Custom CAT setup"
            body="Configure presentation mode, time limits, and question count."
          />
          <SecondaryCard
            href="/app/questions/bank"
            title="Question bank"
            body="Search, filter, and browse questions by topic or keyword."
          />
        </div>
      </section>
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
