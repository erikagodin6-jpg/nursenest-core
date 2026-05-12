/**
 * ECGQuestionLayout — premium ECG/EKG question renderer.
 *
 * Lives in nursenest-core/src so the node:test suite (and react-dom/server)
 * share the same React copy, avoiding the dual-React hook crash.
 *
 * The client dispatcher (client/src/components/advanced-question-renderers.tsx)
 * imports this via a relative path.  All shadcn/ui primitives referenced here
 * (button, badge, cn, lucide-react) exist in both apps with compatible APIs.
 *
 * The question shape is defined as ECGQuestionData (inline) so this file is
 * importable without crossing the @/ alias boundary.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  FlaskConical,
  Heart,
  Lock,
  Pill,
  TrendingUp,
  XCircle,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";

// ─── URL safety guard ─────────────────────────────────────────────────────────
// Only HTTPS URLs are allowed for the ECG strip image.  Any other scheme
// (http, javascript, data, blob, empty, malformed) falls back to the text
// description panel, preventing mixed-content warnings and XSS vectors.

function isSafeImageUrl(url: string | undefined): boolean {
  if (!url || url.trim() === "") return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

// ─── Portable question shape ──────────────────────────────────────────────────
// Defined inline so this component can be imported from any context without
// requiring @/data/exam-questions/types, which only exists in client/src.

export interface ECGQuestionData {
  id: string;
  stem: string;
  imageDescription: string;
  imageType: string;
  clinicalFindings: string[];
  options: string[];
  correctAnswer: number;
  rationale: string;
  bodySystem: string;
  tier: string;
  difficulty?: number;
  tags?: string[];
  // Optional ECG-specific rhythm workspace fields
  imageUrl?: string;
  rhythmRate?: string;
  rhythmRegularity?: string;
  pWaves?: string;
  prInterval?: string;
  qrsWidth?: string;
  clinicalSignificance?: string;
  nursingAction?: string;
  // Optional exhibit panel (labs, vitals, meds)
  vitals?: Record<string, string>;
  labs?: Record<string, string>;
  medications?: string[];
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ECGQuestionLayoutProps {
  question: ECGQuestionData;
  onAnswer?: (result: {
    correct: boolean;
    pointsEarned: number;
    maxPoints: number;
    selected: number | null;
  }) => void;
  /** readOnly=true: display-only, no new answers accepted */
  readOnly?: boolean;
  /**
   * isLearningMode=true (practice): show rationale after submit.
   * isLearningMode=false (CAT/exam): suppress rationale.
   */
  isLearningMode?: boolean;
  /** locked=true: learner's tier cannot access ECG; show paywall gate */
  locked?: boolean;
  /** Pre-select an answer without requiring a click — used in tests */
  defaultSelectedAnswer?: number;
  /** Pre-set submitted state — used in tests */
  defaultSubmitted?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RhythmCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 p-3 bg-slate-800/60 rounded-xl min-w-0">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-slate-100 leading-tight">{value}</span>
    </div>
  );
}

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
  testId,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  testId?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200/70 overflow-hidden" data-testid={testId}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left"
        aria-expanded={open}
        type="button"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-4 pb-4 pt-3 bg-white">{children}</div>}
    </div>
  );
}

function ECGPaywallGate({ question }: { question: ECGQuestionData }) {
  return (
    <div
      className="rounded-2xl border-2 border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-purple-50/40 to-indigo-50/30 p-8 text-center"
      data-testid="section-ecg-paywall"
      aria-label="ECG question locked — upgrade required"
    >
      <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-7 h-7 text-violet-600" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">ECG Module — RN &amp; NP Only</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-1 max-w-sm mx-auto">
        ECG interpretation questions are available to RN and NP subscribers.
      </p>
      <p className="text-xs text-slate-400 mb-6">
        Topic:{" "}
        <span className="font-medium text-slate-600">{question.bodySystem}</span>
      </p>
      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold shadow-sm">
        <Crown className="w-4 h-4" aria-hidden="true" />
        Upgrade to RN or NP Plan
      </div>
    </div>
  );
}

// ─── ECGQuestionLayout ────────────────────────────────────────────────────────

export function ECGQuestionLayout({
  question,
  onAnswer,
  readOnly = false,
  isLearningMode = true,
  locked = false,
  defaultSelectedAnswer,
  defaultSubmitted = false,
}: ECGQuestionLayoutProps) {
  const [selected, setSelected] = useState<number | null>(
    defaultSelectedAnswer !== undefined ? defaultSelectedAnswer : null,
  );
  const [submitted, setSubmitted] = useState(defaultSubmitted);

  const hasRhythm =
    question.rhythmRate ||
    question.rhythmRegularity ||
    question.pWaves ||
    question.prInterval ||
    question.qrsWidth ||
    question.clinicalSignificance ||
    question.nursingAction;

  const hasExhibit =
    (question.vitals && Object.keys(question.vitals).length > 0) ||
    (question.labs && Object.keys(question.labs).length > 0) ||
    (question.medications && question.medications.length > 0);

  const handleSelect = (idx: number) => {
    if (submitted || readOnly) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const isCorrect = selected === question.correctAnswer;
    onAnswer?.({ correct: isCorrect, pointsEarned: isCorrect ? 1 : 0, maxPoints: 1, selected });
  };

  const optionLabels = ["A", "B", "C", "D", "E"];

  // ── Paywall gate ─────────────────────────────────────────────────────────
  if (locked) return <ECGPaywallGate question={question} />;

  return (
    <div className="space-y-4" data-testid={`ecg-question-${question.id}`}>

      {/* ── ECG strip panel ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-lg"
        data-testid="section-ecg-strip"
        role="region"
        aria-label="ECG/EKG clinical strip and findings"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              ECG / EKG Reading
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {question.bodySystem || "Cardiology"}
            </span>
          </div>
        </div>

        {/* Strip image (HTTPS only) OR safe text description fallback */}
        {isSafeImageUrl(question.imageUrl) ? (
          <div className="bg-slate-950 overflow-x-auto">
            <img
              src={question.imageUrl}
              alt={`ECG rhythm strip: ${question.imageDescription}`}
              className="w-full max-w-full object-contain block"
              style={{ minHeight: "120px", maxHeight: "220px" }}
              data-testid="img-ecg-strip"
            />
          </div>
        ) : (
          <div
            className="px-5 py-4 font-mono text-sm leading-relaxed text-slate-300 bg-slate-950/60 overflow-x-auto"
            data-testid="text-ecg-description"
            aria-label={`ECG description: ${question.imageDescription}`}
          >
            <p className="text-emerald-300 font-semibold mb-2 text-[11px] uppercase tracking-wider">
              Strip Description
            </p>
            <p>{question.imageDescription}</p>
          </div>
        )}

        {/* Clinical findings */}
        {question.clinicalFindings.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-700/60 bg-slate-800/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Clinical Findings
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {question.clinicalFindings.map((finding, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-[13px] text-slate-300 leading-snug">{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Rhythm interpretation workspace ────────────────────────────── */}
      {hasRhythm && (
        <div
          className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-sm"
          data-testid="section-rhythm-workspace"
          role="region"
          aria-label="Rhythm interpretation workspace"
        >
          <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
              Rhythm Analysis
            </span>
          </div>

          <div className="p-4 space-y-3">
            {/* Row 1: rate / regularity / P waves / PR interval */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <RhythmCell
                label="Rate"
                value={question.rhythmRate}
                icon={<Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />}
              />
              <RhythmCell
                label="Rhythm"
                value={question.rhythmRegularity}
                icon={<Activity className="w-3 h-3 text-slate-400" aria-hidden="true" />}
              />
              <RhythmCell
                label="P Waves"
                value={question.pWaves}
                icon={<Zap className="w-3 h-3 text-slate-400" aria-hidden="true" />}
              />
              <RhythmCell
                label="PR Interval"
                value={question.prInterval}
                icon={<TrendingUp className="w-3 h-3 text-slate-400" aria-hidden="true" />}
              />
            </div>

            {/* Row 2: QRS width + clinical significance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <RhythmCell
                label="QRS Width"
                value={question.qrsWidth}
                icon={<Heart className="w-3 h-3 text-slate-400" aria-hidden="true" />}
              />
              {question.clinicalSignificance && (
                <div className="flex flex-col gap-1 p-3 bg-amber-900/30 border border-amber-700/40 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Clinical Significance
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-amber-100 leading-tight">
                    {question.clinicalSignificance}
                  </span>
                </div>
              )}
            </div>

            {/* Row 3: nursing / NP action */}
            {question.nursingAction && (
              <div
                className="flex items-start gap-3 p-3 bg-teal-900/30 border border-teal-700/40 rounded-xl"
                data-testid="section-nursing-action"
              >
                <ArrowRight className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-0.5">
                    Nursing / NP Action
                  </p>
                  <p className="text-sm text-teal-100 leading-snug">{question.nursingAction}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Exhibit panel (labs / vitals / meds) ───────────────────────── */}
      {hasExhibit && (
        <AccordionSection
          title="Clinical Context"
          icon={<FlaskConical className="w-4 h-4 text-blue-500" aria-hidden="true" />}
          defaultOpen={false}
          testId="section-ecg-exhibit"
        >
          <div className="space-y-3">
            {question.vitals && Object.keys(question.vitals).length > 0 && (
              <div data-testid="section-vitals">
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                  Vital Signs
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(question.vitals).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {question.labs && Object.keys(question.labs).length > 0 && (
              <div data-testid="section-labs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-2">
                  Lab Results
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(question.labs).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-xs bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {question.medications && question.medications.length > 0 && (
              <div data-testid="section-medications">
                <div className="flex items-center gap-1.5 mb-2">
                  <Pill className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Current Medications
                  </p>
                </div>
                <p className="text-sm text-slate-700">{question.medications.join(" · ")}</p>
              </div>
            )}
          </div>
        </AccordionSection>
      )}

      {/* ── Question stem + answer options ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-5 md:px-7 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className="text-xs font-bold px-2.5 py-1 rounded-lg border-primary/20 bg-primary/5 text-primary"
            >
              ECG
            </Badge>
            <Badge className="bg-slate-100 text-slate-600 border border-slate-200 text-xs hover:bg-slate-100">
              {question.tier?.toUpperCase()}
            </Badge>
          </div>
          <p
            className="text-[17px] font-semibold leading-[1.65] text-slate-900"
            data-testid="text-ecg-stem"
          >
            {question.stem}
          </p>
        </div>

        <div className="px-5 md:px-7 pb-5 md:pb-7 space-y-2.5">
          {question.options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrect = submitted && question.correctAnswer === idx;
            const isWrong = submitted && isSelected && question.correctAnswer !== idx;

            let containerCls: string;
            let badgeCls: string;
            let textCls: string;

            if (isCorrect) {
              containerCls = "border-emerald-300 bg-emerald-50/70 shadow-sm";
              badgeCls = "border-emerald-500 bg-emerald-500 text-white";
              textCls = "text-emerald-900 font-semibold";
            } else if (isWrong) {
              containerCls = "border-red-300 bg-red-50/60";
              badgeCls = "border-red-400 bg-red-400 text-white";
              textCls = "text-red-800";
            } else if (submitted && !isSelected) {
              containerCls = "border-slate-100 opacity-40";
              badgeCls = "border-slate-200 text-slate-400 bg-white";
              textCls = "text-slate-500";
            } else if (isSelected) {
              containerCls = "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20";
              badgeCls = "border-primary bg-primary text-white";
              textCls = "text-slate-900 font-semibold";
            } else {
              containerCls =
                "border-slate-200 hover:border-primary/40 hover:bg-primary/[0.025] hover:shadow-sm";
              badgeCls = "border-slate-300 text-slate-500 bg-white";
              textCls = "text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={submitted || readOnly}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4",
                  containerCls,
                )}
                aria-pressed={isSelected}
                data-testid={`button-option-ecg-${question.id}-${idx}`}
              >
                <span
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-200",
                    badgeCls,
                  )}
                  aria-hidden="true"
                >
                  {optionLabels[idx] ?? idx + 1}
                </span>
                <span className={cn("flex-1 text-[15px] leading-relaxed", textCls)}>
                  {option}
                </span>
                {isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />
                )}
                {isWrong && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}

          {!submitted && !readOnly && (
            <Button
              onClick={handleSubmit}
              disabled={selected === null}
              className="w-full mt-2 py-5 text-base rounded-2xl bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-40"
              data-testid={`button-submit-ecg-${question.id}`}
            >
              {selected === null ? "Select an answer to continue" : "Submit Answer"}
            </Button>
          )}
        </div>
      </div>

      {/* ── Rationale — practice mode only ─────────────────────────────── */}
      {submitted && isLearningMode && (
        <div
          className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden"
          data-testid="section-ecg-rationale"
          role="region"
          aria-label="ECG question rationale and rhythm breakdown"
        >
          <div className="px-5 md:px-6 pt-5 pb-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-violet-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-slate-800">Rationale</span>
            </div>

            {/* Correct answer call-out */}
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Correct Answer
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-900">
                {optionLabels[question.correctAnswer] ?? question.correctAnswer + 1}.{" "}
                {question.options[question.correctAnswer]}
              </p>
            </div>

            {/* Rationale text */}
            <div className="text-sm text-slate-700 leading-relaxed space-y-2">
              {question.rationale
                .split(/\n\n+/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>

            {/* Rhythm breakdown (practice deep-dive) */}
            {hasRhythm && (
              <div
                className="rounded-xl border border-violet-200/60 bg-violet-50/30 p-3 space-y-2"
                data-testid="section-rhythm-breakdown"
              >
                <p className="text-[11px] font-bold uppercase tracking-widest text-violet-700 mb-2">
                  Rhythm Breakdown
                </p>
                {[
                  { label: "Rate", value: question.rhythmRate },
                  { label: "Regularity", value: question.rhythmRegularity },
                  { label: "P Waves", value: question.pWaves },
                  { label: "PR Interval", value: question.prInterval },
                  { label: "QRS Width", value: question.qrsWidth },
                  { label: "Clinical Significance", value: question.clinicalSignificance },
                  { label: "Nursing / NP Action", value: question.nursingAction },
                ]
                  .filter((r) => r.value)
                  .map(({ label, value }) => (
                    <div key={label} className="flex gap-2 text-sm">
                      <span className="font-semibold text-violet-700 shrink-0 min-w-[140px]">
                        {label}:
                      </span>
                      <span className="text-slate-700">{value}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CAT/exam mode: rationale suppressed ────────────────────────── */}
      {submitted && !isLearningMode && (
        <div
          className="text-center py-3 text-sm text-slate-400"
          data-testid="section-ecg-rationale-suppressed"
          aria-label="Rationale available in practice mode"
        >
          Rationale available in Practice mode after exam review
        </div>
      )}
    </div>
  );
}
