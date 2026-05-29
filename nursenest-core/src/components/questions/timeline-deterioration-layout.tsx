"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, TrendingDown, User } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────────────── */

export type TimelineVital = {
  label: string;
  value: string;
  /** "normal" | "warning" | "alert" — drives colour coding */
  status: "normal" | "warning" | "alert";
};

export type TimelinePoint = {
  id: string;
  time: string;
  label?: string;
  vitals: TimelineVital[];
  /** If true, this time point represents the deterioration onset */
  isEscalationPoint?: boolean;
  notes?: string;
};

export type TimelineQuestion = {
  id: string;
  stem: string;
  options: Array<{ id: string; label: string; timePointId?: string }>;
  correctId: string;
  rationale?: string;
};

export type TimelineDeterioration = {
  questionStem: string;
  patientVignette?: string | null;
  timePoints: TimelinePoint[];
  questions: TimelineQuestion[];
  revealed?: boolean;
  onSubmit?: (answers: Record<string, string>) => void;
  answers?: Record<string, string>;
};

/* ── Vital badge ────────────────────────────────────────────────────────────── */

function VitalBadge({ vital }: { vital: TimelineVital }) {
  return (
    <div className="nn-timeline-vital">
      <span className="nn-timeline-vital__label">{vital.label}</span>
      <span className={`nn-timeline-vital__value nn-timeline-vital__value--${vital.status}`}>
        {vital.value}
        {vital.status === "alert"   ? <AlertTriangle className="inline ml-1 h-3 w-3" aria-label="Critical value" /> : null}
        {vital.status === "warning" ? <TrendingDown   className="inline ml-1 h-3 w-3" aria-label="Trending worse" /> : null}
      </span>
    </div>
  );
}

/* ── Desktop horizontal timeline ────────────────────────────────────────────── */

function TimelineDesktop({
  timePoints,
  activeId,
  onActivate,
}: {
  timePoints: TimelinePoint[];
  activeId: string;
  onActivate: (id: string) => void;
}) {
  return (
    <div className="nn-timeline-workspace max-sm:hidden">
      {/* Scrollable time axis */}
      <div className="nn-timeline-axis rounded-[0.9rem] border border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,var(--semantic-brand)_6%)] overflow-hidden">
        {timePoints.map((tp) => (
          <div
            key={tp.id}
            className={`nn-timeline-point ${activeId === tp.id ? "nn-timeline-point--active" : ""} ${tp.isEscalationPoint ? "nn-timeline-point--alert" : ""}`}
          >
            <button
              type="button"
              className="nn-timeline-point__time-header w-full text-center"
              onClick={() => onActivate(tp.id)}
              aria-pressed={activeId === tp.id}
            >
              <span className="block font-[800]">{tp.time}</span>
              {tp.label ? <span className="block text-[0.6rem] mt-0.5 opacity-70">{tp.label}</span> : null}
              {tp.isEscalationPoint ? <AlertTriangle className="inline h-3 w-3 mt-0.5" aria-label="Critical change" /> : null}
            </button>
            <div className="nn-timeline-point__data">
              {tp.vitals.map((v) => <VitalBadge key={v.label} vital={v} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Active point notes */}
      {timePoints.find((tp) => tp.id === activeId)?.notes ? (
        <div className="rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,transparent)] bg-[var(--semantic-surface)] p-3 mt-1">
          <p className="text-xs font-[800] uppercase tracking-[0.1em] text-[var(--semantic-text-muted)] mb-1">Assessment Notes</p>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {timePoints.find((tp) => tp.id === activeId)!.notes}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ── Mobile vertical timeline ───────────────────────────────────────────────── */

function TimelineMobile({ timePoints }: { timePoints: TimelinePoint[] }) {
  return (
    <div className="nn-timeline-vertical sm:hidden">
      {timePoints.map((tp) => (
        <div key={tp.id} className="nn-timeline-v-point">
          <div className={`nn-timeline-v-point__dot ${tp.isEscalationPoint ? "nn-timeline-v-point__dot--alert" : ""}`}>
            <span className="text-[0.6rem] font-[800] leading-none">{tp.time}</span>
          </div>
          <div className={`nn-timeline-v-point__content ${tp.isEscalationPoint ? "nn-timeline-v-point__content--alert" : ""}`}>
            {tp.label ? (
              <p className="text-xs font-[750] text-[var(--semantic-text-muted)] mb-1.5">{tp.label}</p>
            ) : null}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {tp.vitals.map((v) => <VitalBadge key={v.label} vital={v} />)}
            </div>
            {tp.notes ? (
              <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)] border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_55%,transparent)] pt-2">
                {tp.notes}
              </p>
            ) : null}
            {tp.isEscalationPoint ? (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-2.5 py-1 text-xs font-[700] text-[color-mix(in_srgb,var(--semantic-danger)_72%,var(--semantic-text-primary))]">
                <AlertTriangle className="h-3 w-3" aria-hidden /> Escalation needed
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Question panel ─────────────────────────────────────────────────────────── */

function TimelineQuestion({
  question,
  qNum,
  selected,
  revealed,
  onSelect,
}: {
  question: TimelineQuestion;
  qNum: number;
  selected: string | null;
  revealed: boolean;
  onSelect: (qId: string, optId: string) => void;
}) {
  return (
    <div className="rounded-[0.85rem] border border-[color-mix(in_srgb,var(--semantic-border-soft)_68%,var(--semantic-brand)_6%)] bg-[var(--semantic-surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_55%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_30%,var(--semantic-surface))]">
        <span className="text-xs font-[800] uppercase tracking-[0.1em] text-[var(--semantic-text-muted)]">
          Question {qNum}
        </span>
        <p className="mt-1 text-sm font-[650] text-[var(--semantic-text-primary)] leading-snug">
          {question.stem}
        </p>
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        {question.options.map((opt) => {
          const isPicked  = selected === opt.id;
          const isCorrect = revealed && opt.id === question.correctId;
          const isWrong   = revealed && isPicked && !isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isPicked}
              disabled={revealed}
              onClick={() => !revealed && onSelect(question.id, opt.id)}
              className={[
                "flex items-center gap-2 w-full min-h-[2.75rem] rounded-[0.6rem] border px-3 py-2 text-sm font-[600] text-left transition-colors",
                isCorrect
                  ? "border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))]"
                  : isWrong
                    ? "border-[var(--semantic-danger)] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))]"
                    : isPicked
                      ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_9%,var(--semantic-surface))]"
                      : "border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_18%,var(--semantic-surface))]",
              ].join(" ")}
            >
              <span aria-hidden className={`inline-flex h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                isCorrect ? "border-[var(--semantic-success)] bg-[var(--semantic-success)]" :
                isWrong   ? "border-[var(--semantic-danger)] bg-[var(--semantic-danger)]" :
                isPicked  ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)]" :
                "border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,var(--semantic-text-muted))]"
              }`} />
              <span className="text-[var(--semantic-text-primary)]">{opt.label}</span>
              {isCorrect ? <CheckCircle2 className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-[var(--semantic-success)]" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      {revealed && question.rationale ? (
        <div className="px-4 pb-3">
          <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)] border-t border-[var(--semantic-border-soft)] pt-2">
            {question.rationale}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export function TimelineDeteriorationLayout({
  questionStem,
  patientVignette,
  timePoints,
  questions,
  revealed = false,
  onSubmit,
  answers: controlledAnswers,
}: TimelineDeterioration) {
  const [internalAnswers, setInternalAnswers] = useState<Record<string, string>>({});
  const [activeTimeId, setActiveTimeId] = useState(timePoints[0]?.id ?? "");
  const answers = controlledAnswers ?? internalAnswers;

  const allAnswered = questions.every((q) => answers[q.id]);
  const score = revealed
    ? questions.reduce((acc, q) => acc + (answers[q.id] === q.correctId ? 1 : 0), 0)
    : null;

  return (
    <div className="nn-timeline-question flex flex-col gap-4">
      {/* Badge */}
      <div className="nn-aqt-badge">
        <div className="nn-aqt-badge__icon">
          <Clock className="h-4 w-4" aria-hidden />
        </div>
        <span className="nn-aqt-badge__label">Timeline</span>
      </div>

      {/* Stem */}
      <p className="text-lg font-bold leading-snug text-[var(--semantic-text-primary)]">{questionStem}</p>

      {/* Patient vignette */}
      {patientVignette ? (
        <div className="nn-aqt-patient-card">
          <div className="nn-aqt-patient-card__icon" aria-hidden><User className="h-3.5 w-3.5" /></div>
          <div>
            <span className="nn-aqt-patient-card__label">Patient</span>
            <p className="nn-aqt-patient-card__text">{patientVignette}</p>
          </div>
        </div>
      ) : null}

      {/* Desktop timeline */}
      <TimelineDesktop timePoints={timePoints} activeId={activeTimeId} onActivate={setActiveTimeId} />

      {/* Mobile timeline */}
      <TimelineMobile timePoints={timePoints} />

      {/* Questions */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-[800] uppercase tracking-[0.1em] text-[var(--semantic-text-muted)]">
          Clinical Judgment Questions
        </p>
        {questions.map((q, idx) => (
          <TimelineQuestion
            key={q.id}
            question={q}
            qNum={idx + 1}
            selected={answers[q.id] ?? null}
            revealed={revealed}
            onSelect={(qId, optId) => {
              if (!revealed) setInternalAnswers((prev) => ({ ...prev, [qId]: optId }));
            }}
          />
        ))}
      </div>

      {/* Score */}
      {score !== null ? (
        <div className={`nn-aqt-feedback-banner ${score === questions.length ? "nn-aqt-feedback-banner--success" : "nn-aqt-feedback-banner--partial"}`}>
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden />
          <span>
            {score === questions.length
              ? "Excellent clinical judgment — all escalation decisions correct."
              : `${score} of ${questions.length} questions correct. Review the timeline for missed cues.`}
          </span>
        </div>
      ) : null}

      {/* Submit */}
      {!revealed && allAnswered && onSubmit ? (
        <button
          type="button"
          className="inline-flex w-full min-h-[3rem] items-center justify-center gap-2 rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] text-white text-sm font-[750] shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--semantic-brand)_48%,transparent)] transition-opacity hover:opacity-95"
          onClick={() => onSubmit(answers)}
        >
          Submit Clinical Assessment
        </button>
      ) : null}
    </div>
  );
}
