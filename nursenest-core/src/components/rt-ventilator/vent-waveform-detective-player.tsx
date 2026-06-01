"use client";

/**
 * VentWaveformDetectivePlayer — Phase 3A waveform identification game.
 *
 * Three-stage flow per case:
 *   1. IDENTIFY — show abnormal waveform, ask "what's wrong?"
 *   2. EXPLAIN  — ask physiology question
 *   3. INTERVENE — ask best treatment, then reveal corrected waveform
 *
 * Consequence of inaction panel shown after each correct answer.
 */

import { useState, useMemo } from "react";
import { VentScalarDisplay } from "@/components/rt-ventilator/vent-scalar-display";
import { VentPvFvLoopDisplay } from "@/components/rt-ventilator/vent-pv-fv-loop-display";
import { generateVentWaveform } from "@/lib/rt-ventilator/vent-waveform-generator";
import {
  WAVEFORM_DETECTIVE_CASES,
  DETECTIVE_DIFFICULTY_COUNTS,
  type DetectiveCase,
} from "@/lib/rt-ventilator/vent-waveform-detective-cases";
import type { AdvancedSimChoice } from "@/lib/rt-ventilator/vent-advanced-simulation-engine";

type DetectiveStage = "identify" | "explain" | "intervene" | "corrected";

type CaseResult = { id: string; stagesCorrect: number; totalStages: number };

// ─── Difficulty badge ──────────────────────────────────────────────────────────

const DIFF_COLOR = {
  basic: "text-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_12%,transparent)]",
  intermediate: "text-[var(--semantic-warning)] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)]",
  advanced: "text-[var(--semantic-error)] bg-[color-mix(in_srgb,var(--semantic-error)_12%,transparent)]",
};

// ─── Waveform panel (live generated) ──────────────────────────────────────────

function DetectiveWaveformPanel({
  detective,
  corrected = false,
}: {
  detective: DetectiveCase;
  corrected?: boolean;
}) {
  const config = corrected ? detective.correctedConfig : detective.abnormalConfig;
  const result = useMemo(
    () => generateVentWaveform(config, { breathCount: 4, sampleRate: 80 }),
    [config],
  );
  return (
    <div className="space-y-3">
      <VentScalarDisplay
        result={result}
        peep={config.peep}
        label={corrected ? "After intervention — corrected waveform" : "Abnormal waveform — identify the problem"}
        showDerivedValues
        showAnnotations
      />
      <VentPvFvLoopDisplay result={result} showPv={detective.showPvLoop} showFv={detective.showFvLoop} />
    </div>
  );
}

// ─── Choice button ─────────────────────────────────────────────────────────────

function DetectiveChoiceButton({
  choice,
  revealed,
  selected,
  onSelect,
}: {
  choice: AdvancedSimChoice;
  revealed: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  let cls = "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-alt)]";
  if (revealed) {
    if (choice.correct) cls = "border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
    else if (selected) cls = "border-[var(--semantic-error)] bg-[color-mix(in_srgb,var(--semantic-error)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)] opacity-80";
    else cls = "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-muted)] opacity-50";
  } else if (selected) {
    cls = "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
  }
  return (
    <button
      onClick={revealed ? undefined : onSelect}
      disabled={revealed}
      className={`flex w-full items-start gap-2 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition disabled:cursor-default ${cls}`}
    >
      {revealed && (
        <span className={`mt-0.5 shrink-0 font-bold ${choice.correct ? "text-[var(--semantic-success)]" : selected ? "text-[var(--semantic-error)]" : "text-[var(--semantic-text-muted)]"}`}>
          {choice.correct ? "✓" : selected ? "✗" : "·"}
        </span>
      )}
      <span>{choice.text}</span>
    </button>
  );
}

// ─── Case picker ───────────────────────────────────────────────────────────────

function CasePicker({ onSelect }: { onSelect: (c: DetectiveCase) => void }) {
  const [filter, setFilter] = useState<"all" | "basic" | "intermediate" | "advanced">("all");

  const shown = filter === "all"
    ? WAVEFORM_DETECTIVE_CASES
    : WAVEFORM_DETECTIVE_CASES.filter((c) => c.difficulty === filter);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Waveform Detective</h3>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Identify the waveform abnormality, explain the physiology, and choose the correct intervention.
          Live-generated waveforms — no static images.
        </p>
      </div>

      {/* Difficulty counts */}
      <div className="flex flex-wrap gap-2">
        {(["all", "basic", "intermediate", "advanced"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              filter === d
                ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)] text-white"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            }`}
          >
            {d === "all"
              ? `All (${WAVEFORM_DETECTIVE_CASES.length})`
              : `${d.charAt(0).toUpperCase() + d.slice(1)} (${DETECTIVE_DIFFICULTY_COUNTS[d]})`}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-left shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--semantic-brand)] hover:shadow-md motion-reduce:transform-none"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-brand)]">
                {c.title}
              </p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${DIFF_COLOR[c.difficulty]}`}>
                {c.difficulty}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.findingTraces.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--semantic-surface-alt)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--semantic-text-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-snug text-[var(--semantic-text-muted)] line-clamp-2">
              {c.keyLearning.slice(0, 80)}…
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Active detective case ─────────────────────────────────────────────────────

function ActiveCase({ detective, onBack, onComplete }: {
  detective: DetectiveCase;
  onBack: () => void;
  onComplete: (correct: number) => void;
}) {
  const [stage, setStage] = useState<DetectiveStage>("identify");
  const [answers, setAnswers] = useState<Record<DetectiveStage, string | null>>({
    identify: null, explain: null, intervene: null, corrected: null,
  });
  const [revealed, setRevealed] = useState<Record<DetectiveStage, boolean>>({
    identify: false, explain: false, intervene: false, corrected: false,
  });

  const stageConfig: Record<Exclude<DetectiveStage, "corrected">, {
    question: string;
    choices: AdvancedSimChoice[];
    label: string;
  }> = {
    identify: { question: detective.identifyQuestion, choices: detective.identifyChoices, label: "Identify" },
    explain: { question: detective.physiologyQuestion, choices: detective.physiologyChoices, label: "Physiology" },
    intervene: { question: detective.interventionQuestion, choices: detective.interventionChoices, label: "Intervene" },
  };

  function handleAnswer(s: Exclude<DetectiveStage, "corrected">, id: string) {
    setAnswers((a) => ({ ...a, [s]: id }));
    setRevealed((r) => ({ ...r, [s]: true }));
  }

  function handleNext() {
    if (stage === "identify") setStage("explain");
    else if (stage === "explain") setStage("intervene");
    else if (stage === "intervene") setStage("corrected");
    else {
      const correctCount = (["identify", "explain", "intervene"] as const).filter((s) => {
        const chosen = answers[s];
        const choices = stageConfig[s].choices;
        return choices.find((c) => c.id === chosen)?.correct ?? false;
      }).length;
      onComplete(correctCount);
    }
  }

  const currentConfig = stage !== "corrected" ? stageConfig[stage] : null;
  const selectedAnswer = stage !== "corrected" ? answers[stage] : null;
  const isRevealed = stage !== "corrected" ? revealed[stage] : false;
  const selectedChoice = currentConfig?.choices.find((c) => c.id === selectedAnswer);

  const stageLabels: DetectiveStage[] = ["identify", "explain", "intervene", "corrected"];
  const stageIdx = stageLabels.indexOf(stage);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--semantic-brand)] hover:underline">
          ← Cases
        </button>
        <div className="flex flex-1 gap-1">
          {stageLabels.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < stageIdx ? "bg-[var(--semantic-success)]"
                : i === stageIdx ? "bg-[var(--semantic-brand)]"
                : "bg-[var(--semantic-border-soft)]"
              }`}
            />
          ))}
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${DIFF_COLOR[detective.difficulty]}`}>
          {detective.difficulty}
        </span>
      </div>

      <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">{detective.title}</h3>

      {/* Waveform */}
      <DetectiveWaveformPanel detective={detective} corrected={stage === "corrected"} />

      {/* Teaching points (shown on identify stage) */}
      {stage === "identify" && (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_25%,transparent)] bg-[color-mix(in_srgb,var(--semantic-info)_06%,transparent)] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">Key traces to examine</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {detective.findingTraces.map((t) => (
              <span key={t} className="rounded-full bg-[var(--semantic-surface)] border border-[var(--semantic-border-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-text-primary)]">
                {t.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question */}
      {currentConfig && (
        <div className="space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{currentConfig.question}</p>
          <div className="space-y-2">
            {currentConfig.choices.map((c) => (
              <DetectiveChoiceButton
                key={c.id}
                choice={c}
                revealed={isRevealed}
                selected={selectedAnswer === c.id}
                onSelect={() => handleAnswer(stage as Exclude<DetectiveStage, "corrected">, c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Corrected waveform explanation */}
      {stage === "corrected" && (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_06%,transparent)] p-4">
          <p className="text-sm font-bold text-[var(--semantic-success)]">✓ Corrected Waveform</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            The waveform above shows the pattern AFTER the correct intervention. Notice how the abnormality is resolved.
          </p>
          <div className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,transparent)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">Key Learning</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{detective.keyLearning}</p>
          </div>
        </div>
      )}

      {/* Feedback after answering */}
      {isRevealed && selectedChoice && stage !== "corrected" && (
        <div className={`rounded-xl border p-4 ${selectedChoice.correct
          ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_06%,transparent)]"
          : "border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_06%,transparent)]"}`}
        >
          <p className={`text-sm font-bold ${selectedChoice.correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-error)]"}`}>
            {selectedChoice.correct ? "✓ Correct" : "✗ Incorrect"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{selectedChoice.feedback}</p>
        </div>
      )}

      {/* Consequence of inaction (shown after intervention stage) */}
      {stage === "corrected" && (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-error)_25%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_05%,transparent)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-error)]">
            ⚠ What happens if you do nothing?
          </p>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{detective.consequenceOfInaction.description}</p>
          <div className="mt-3 space-y-2">
            {detective.consequenceOfInaction.timeline.map((event, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="shrink-0 font-semibold text-[var(--semantic-error)]">{event.timeframe}</span>
                <span className="text-[var(--semantic-text-secondary)]">{event.event}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold leading-relaxed text-[var(--semantic-error)]">
            ⚡ {detective.consequenceOfInaction.clinicalPearl}
          </p>
        </div>
      )}

      {/* Navigation */}
      {(isRevealed || stage === "corrected") && (
        <button
          onClick={handleNext}
          className="w-full rounded-full bg-[var(--semantic-brand)] py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          {stage === "corrected" ? "Complete Case" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function VentWaveformDetectivePlayer() {
  const [selected, setSelected] = useState<DetectiveCase | null>(null);
  const [completed, setCompleted] = useState<CaseResult[]>([]);

  function handleComplete(correct: number) {
    if (selected) {
      setCompleted((prev) => [...prev, { id: selected.id, stagesCorrect: correct, totalStages: 3 }]);
    }
    setSelected(null);
  }

  return (
    <div data-nn-vent-detective="">
      {selected ? (
        <ActiveCase
          detective={selected}
          onBack={() => setSelected(null)}
          onComplete={handleComplete}
        />
      ) : (
        <>
          {completed.length > 0 && (
            <div className="mb-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2.5">
              <p className="text-xs font-semibold text-[var(--semantic-text-secondary)]">
                {completed.length} case{completed.length !== 1 ? "s" : ""} completed
                {" · "}{completed.reduce((s, c) => s + c.stagesCorrect, 0)}/{completed.reduce((s, c) => s + c.totalStages, 0)} correct
              </p>
            </div>
          )}
          <CasePicker onSelect={setSelected} />
        </>
      )}
    </div>
  );
}
