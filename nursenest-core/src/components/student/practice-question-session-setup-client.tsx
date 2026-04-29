"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  buildPracticeAdaptiveCreatePayload,
  type PracticeAdaptiveSelectionBasis,
} from "@/components/student/pathway-cat-start-payload";
import { appPathwayCatFullSetupHref } from "@/lib/exam-pathways/pathway-cat-flow";

// ---------------------------------------------------------------------------
// Body system definitions — label displayed in UI, topic used in API filter
// ---------------------------------------------------------------------------

const BODY_SYSTEMS = [
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

// Special filters that override body system selection and change selection basis
const SPECIAL_FILTERS = [
  {
    id: "weak_areas" as const,
    label: "Weak Areas",
    hint: "Focus on topics where your accuracy is lowest.",
    basis: "weak" as PracticeAdaptiveSelectionBasis,
  },
  {
    id: "previously_incorrect" as const,
    label: "Previously Incorrect",
    hint: "Retry questions you have answered incorrectly.",
    basis: "missed" as PracticeAdaptiveSelectionBasis,
  },
];

type SpecialFilterId = "weak_areas" | "previously_incorrect";

const QUESTION_COUNTS = [10, 20, 30, 50] as const;
const DEFAULT_QUESTION_COUNT = 30;

// ---------------------------------------------------------------------------

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

  // Multi-select body systems; empty = All Systems
  const [selectedSystems, setSelectedSystems] = useState<Set<BodySystemId>>(new Set());
  // Mutually exclusive special filter (overrides body system selection + changes selection basis)
  const [specialFilter, setSpecialFilter] = useState<SpecialFilterId | null>(null);
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

  function toggleSystem(id: BodySystemId) {
    setSpecialFilter(null); // body system selected → clear special filter
    setSelectedSystems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectSpecialFilter(id: SpecialFilterId) {
    setSelectedSystems(new Set()); // special filter selected → clear body systems
    setSpecialFilter((prev) => (prev === id ? null : id)); // toggle
  }

  function selectAllSystems() {
    setSelectedSystems(new Set());
    setSpecialFilter(null);
  }

  const topicNames: string[] = useMemo(() => {
    if (specialFilter) return []; // special filters use the full question pool (different basis)
    if (selectedSystems.size === 0) return []; // all systems = no filter
    return BODY_SYSTEMS.filter((s) => selectedSystems.has(s.id)).map((s) => s.topic);
  }, [selectedSystems, specialFilter]);

  const catSelectionBasis: PracticeAdaptiveSelectionBasis = useMemo(() => {
    const sf = SPECIAL_FILTERS.find((f) => f.id === specialFilter);
    return sf ? sf.basis : "random";
  }, [specialFilter]);

  const isAllSystems = selectedSystems.size === 0 && specialFilter === null;

  const startAdaptivePractice = useCallback(async () => {
    if (!effectivePathwayId || starting) return;
    setStartError(null);
    setStarting(true);
    try {
      const payload = buildPracticeAdaptiveCreatePayload({
        pathwayId: effectivePathwayId,
        topicNames,
        catSelectionBasis,
        questionCount,
      });
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-nn-study-launch-surface": "practice_questions_hub",
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setStartError(
          typeof data.error === "string" && data.error.trim()
            ? data.error
            : "Could not start your practice session. Please try again.",
        );
        return;
      }
      router.push(`/app/practice-tests/${data.id}`);
    } catch {
      setStartError("Could not start your practice session. Please check your connection and try again.");
    } finally {
      setStarting(false);
    }
  }, [effectivePathwayId, topicNames, catSelectionBasis, questionCount, starting, router]);

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
          Practice Questions
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Build exam readiness with adaptive practice and immediate rationales.
        </p>
      </header>

      {/* ── Exam track picker (only when user has multiple pathways) ─────── */}
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

      {/* ── Focus area selector ──────────────────────────────────────────── */}
      <section className="space-y-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_50%,var(--semantic-surface))] p-5 sm:p-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Select Focus Areas
          </p>
          <p className="text-xs text-[var(--semantic-text-muted)]">
            Multi-select body systems, or choose a special mode below. Nothing selected = all questions.
          </p>
        </div>

        {/* Body system buttons ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
          role="group"
          aria-label="Body system filters"
        >
          {BODY_SYSTEMS.map((sys) => {
            const on = selectedSystems.has(sys.id);
            return (
              <button
                key={sys.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSystem(sys.id)}
                className={`min-h-10 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                  on
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-sm"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                }`}
              >
                {sys.label}
              </button>
            );
          })}
        </div>

        {/* Special filters + All Systems ───────────────────────────────── */}
        <div
          className="mt-2 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-4"
          role="group"
          aria-label="Special filters"
        >
          {/* All Systems — acts as reset */}
          <button
            type="button"
            aria-pressed={isAllSystems}
            onClick={selectAllSystems}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition ${
              isAllSystems
                ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
            }`}
          >
            All Systems
          </button>

          {SPECIAL_FILTERS.map((sf) => {
            const on = specialFilter === sf.id;
            return (
              <button
                key={sf.id}
                type="button"
                aria-pressed={on}
                title={sf.hint}
                onClick={() => selectSpecialFilter(sf.id)}
                className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition ${
                  on
                    ? "border-[color-mix(in_srgb,var(--semantic-warning)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                }`}
              >
                {sf.label}
              </button>
            );
          })}
        </div>

        {/* Summary of active filter state ──────────────────────────────── */}
        {!isAllSystems ? (
          <p className="text-xs text-[var(--semantic-text-muted)]">
            {specialFilter
              ? SPECIAL_FILTERS.find((f) => f.id === specialFilter)?.hint
              : `Filtering to: ${Array.from(selectedSystems)
                  .map((id) => BODY_SYSTEMS.find((s) => s.id === id)?.label ?? id)
                  .join(", ")}`}
          </p>
        ) : null}
      </section>

      {/* ── Question count ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Question count
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Number of questions">
          {QUESTION_COUNTS.map((n) => {
            const on = questionCount === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => setQuestionCount(n)}
                className={`min-h-11 min-w-[4.5rem] rounded-full border px-5 text-sm font-semibold ${
                  on
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Primary CTA ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={!effectivePathwayId || starting}
          onClick={() => void startAdaptivePractice()}
          className="nn-btn-primary inline-flex min-h-12 w-full items-center justify-center rounded-full px-8 text-base font-semibold shadow-md disabled:opacity-50 sm:w-auto sm:min-w-[16rem]"
        >
          {starting ? "Starting…" : "Start Adaptive Practice"}
        </button>
        {startError ? (
          <p className="text-sm text-[var(--semantic-danger)]" role="alert">
            {startError}
          </p>
        ) : null}
        <p className="text-xs text-[var(--semantic-text-muted)]">
          Rationale shown after each question · Adaptive difficulty · Not timed
        </p>
      </div>

      {/* ── Secondary options ────────────────────────────────────────────── */}
      <section className="space-y-3 border-t border-[var(--semantic-border-soft)] pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Other practice options</p>
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
      <span className="font-semibold text-[var(--semantic-text-primary)]">{title}</span>
      <span className="mt-1 text-xs text-[var(--semantic-text-muted)]">{body}</span>
    </Link>
  );
}
