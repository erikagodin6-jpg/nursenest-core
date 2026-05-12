"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { CNPLE_SAMPLE_CASES } from "@/content/cases/cnple-sample-cases";
import { CnpleLongitudinalCaseShell } from "@/components/cases/cnple-longitudinal-case-shell";
import { CnpleCaseCompletion } from "@/components/cases/cnple-case-completion";
import type { CaseStepPayload, CaseStepAdvanceResult } from "@/lib/cases/longitudinal-case-types";

type PageProps = { params: Promise<{ caseId: string }> };

export default function CnpleCaseSessionPage({ params }: PageProps) {
  const { caseId } = use(params);
  const router = useRouter();

  const patientCase = CNPLE_SAMPLE_CASES.find((c) => c.id === decodeURIComponent(caseId));

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firstStep, setFirstStep] = useState<CaseStepPayload | null>(null);
  const [mode, setMode] = useState<"PRACTICE" | "SIMULATION">("PRACTICE");
  const [completed, setCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<CaseStepAdvanceResult | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(
    async (selectedMode: "PRACTICE" | "SIMULATION") => {
      if (!patientCase) return;
      setStarting(true);
      setError(null);
      try {
        const res = await fetch("/api/cases/cnple/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId: patientCase.id, mode: selectedMode }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const payload = (await res.json()) as CaseStepPayload;
        setMode(selectedMode);
        setSessionId(payload.sessionId);
        setFirstStep(payload);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to start session.");
      } finally {
        setStarting(false);
      }
    },
    [patientCase],
  );

  const handleAdvance = useCallback(
    async (chosenOptionId: string, dwellMs: number): Promise<CaseStepAdvanceResult> => {
      if (!sessionId) throw new Error("No active session");
      const res = await fetch(`/api/cases/cnple/${sessionId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosenOptionId, dwellMs }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return (await res.json()) as CaseStepAdvanceResult;
    },
    [sessionId],
  );

  const handleComplete = useCallback((result: CaseStepAdvanceResult) => {
    setFinalResult(result);
    setCompleted(true);
  }, []);

  const handleReview = useCallback(() => {
    if (sessionId) router.push(`/app/cases/cnple/${caseId}/review?sessionId=${sessionId}`);
  }, [sessionId, caseId, router]);

  if (!patientCase) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-[15px]" style={{ color: "var(--semantic-text-muted)" }}>
          Case not found.
        </p>
      </div>
    );
  }

  // Pre-start: mode selection
  if (!firstStep) {
    const { steps: _steps, ...caseMeta } = patientCase;
    return (
      <div className="mx-auto max-w-xl space-y-6 py-12">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
            CNPLE-style case
          </p>
          <h1 className="mt-1 text-[22px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            {caseMeta.title}
          </h1>
          <p className="mt-1.5 text-[14px]" style={{ color: "var(--semantic-text-secondary)" }}>
            {caseMeta.chiefComplaint}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
            <span>{caseMeta.stepCount} steps</span>
            <span>·</span>
            <span>~{caseMeta.estimatedMinutes} min</span>
            <span>·</span>
            <span>Difficulty {caseMeta.difficulty}/5</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ModeCard
            mode="PRACTICE"
            title="Practice Mode"
            description="Rationale and correct answer revealed after each step. Best for learning and review."
            onSelect={handleStart}
            loading={starting && mode === "PRACTICE"}
          />
          <ModeCard
            mode="SIMULATION"
            title="Simulation Mode"
            description="No rationale until case completion. Exam-like linear format. CNPLE uses LOFT, not CAT."
            onSelect={handleStart}
            loading={starting && mode === "SIMULATION"}
          />
        </div>

        {error && (
          <p className="rounded-xl border px-4 py-3 text-[13px]" style={{ borderColor: "var(--semantic-danger)", color: "var(--semantic-danger)", background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // Completion screen
  if (completed && finalResult) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <CnpleCaseCompletion
          result={finalResult}
          caseTitle={patientCase.title}
          sessionId={sessionId ?? ""}
          onReview={handleReview}
        />
      </div>
    );
  }

  // Active session
  const { steps: _steps, ...caseMeta } = patientCase;
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <CnpleLongitudinalCaseShell
        patientCase={caseMeta}
        initialStep={firstStep}
        onAdvance={handleAdvance}
        onComplete={handleComplete}
      />
    </div>
  );
}

// ── Mode selection card ────────────────────────────────────────────────────────

function ModeCard({
  mode,
  title,
  description,
  onSelect,
  loading,
}: {
  mode: "PRACTICE" | "SIMULATION";
  title: string;
  description: string;
  onSelect: (m: "PRACTICE" | "SIMULATION") => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      disabled={loading}
      className="flex flex-col items-start rounded-2xl border px-5 py-4 text-left transition-[border-color,box-shadow] hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] hover:shadow-[var(--semantic-shadow-soft)] disabled:opacity-60"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 8%, var(--semantic-surface))",
      }}
    >
      <p className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        {loading ? "Starting…" : title}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
        {description}
      </p>
    </button>
  );
}
