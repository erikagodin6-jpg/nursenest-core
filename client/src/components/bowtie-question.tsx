import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BowtieQuestion } from "@/data/exam-questions/types";
import { useI18n } from "@/lib/i18n";

interface BowtieQuestionCardProps {
  question: BowtieQuestion;
  onNext: () => void;
  onPrev: () => void;
  questionNumber: number;
  totalQuestions: number;
  onScore?: (correct: boolean) => void;
}

// ─── Option button used in each column ───────────────────────────────────────

function BowtieOption({
  label,
  isSelected,
  isCorrect,
  isWrong,
  revealed,
  onClick,
  testId,
  accentColor,
}: {
  label: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  revealed: boolean;
  onClick: () => void;
  testId: string;
  accentColor: { border: string; bg: string; check: string; ring: string };
}) {
  let containerCls: string;

  if (revealed) {
    if (isCorrect && isSelected) containerCls = "border-emerald-400 bg-emerald-50/80 shadow-sm";
    else if (isCorrect && !isSelected) containerCls = "border-emerald-300 bg-emerald-50/40";
    else if (isWrong) containerCls = "border-red-300 bg-red-50/60";
    else containerCls = "border-slate-100 opacity-40";
  } else if (isSelected) {
    containerCls = cn("shadow-sm ring-1", accentColor.border, accentColor.bg, accentColor.ring);
  } else {
    containerCls = "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80";
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-xl border-2 text-[13px] transition-all duration-200 flex items-center gap-2.5",
        containerCls,
        revealed ? "cursor-default" : "cursor-pointer"
      )}
      data-testid={testId}
    >
      <span className={cn(
        "shrink-0 w-4 h-4 rounded border flex items-center justify-center",
        revealed && isCorrect ? "border-emerald-500 bg-emerald-100" :
        revealed && isWrong ? "border-red-400 bg-red-100" :
        isSelected ? cn("border-current bg-current/10", accentColor.check) : "border-slate-300 bg-white"
      )}>
        {revealed && isCorrect && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
        {revealed && isWrong && <XCircle className="w-2.5 h-2.5 text-red-500" />}
        {!revealed && isSelected && <div className={cn("w-1.5 h-1.5 rounded-full", accentColor.check)} />}
      </span>
      <span className={cn(
        "flex-1 leading-snug",
        revealed && isCorrect ? "text-emerald-900 font-semibold" :
        revealed && isWrong ? "text-red-800" :
        isSelected ? "text-slate-800 font-medium" : "text-slate-700"
      )}>
        {label}
      </span>
    </button>
  );
}

// ─── Visual connector dot ─────────────────────────────────────────────────────

function ConnectorDot({ color }: { color: string }) {
  return (
    <div className={cn("w-3 h-3 rounded-full border-2 bg-white shrink-0", color)} />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BowtieQuestionCard({
  question,
  onNext,
  onPrev,
  questionNumber,
  totalQuestions,
  onScore,
}: BowtieQuestionCardProps) {
  const { t } = useI18n();
  const [centerAnswer, setCenterAnswer] = useState<number | null>(null);
  const [leftSelected, setLeftSelected] = useState<Set<number>>(new Set());
  const [rightSelected, setRightSelected] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const toggleLeft = (idx: number) => {
    if (revealed) return;
    const next = new Set(leftSelected);
    if (next.has(idx)) next.delete(idx);
    else if (next.size < question.leftSelectCount) next.add(idx);
    setLeftSelected(next);
  };

  const toggleRight = (idx: number) => {
    if (revealed) return;
    const next = new Set(rightSelected);
    if (next.has(idx)) next.delete(idx);
    else if (next.size < question.rightSelectCount) next.add(idx);
    setRightSelected(next);
  };

  const canSubmit =
    centerAnswer !== null &&
    leftSelected.size === question.leftSelectCount &&
    rightSelected.size === question.rightSelectCount;

  const handleSubmit = () => {
    setRevealed(true);
    if (onScore) {
      const centerCorrect = centerAnswer === question.centerCorrect;
      const leftCorrect =
        question.leftCorrect.every((i) => leftSelected.has(i)) &&
        leftSelected.size === question.leftCorrect.length;
      const rightCorrect =
        question.rightCorrect.every((i) => rightSelected.has(i)) &&
        rightSelected.size === question.rightCorrect.length;
      onScore(centerCorrect && leftCorrect && rightCorrect);
    }
  };

  const handleNext = () => {
    setCenterAnswer(null);
    setLeftSelected(new Set());
    setRightSelected(new Set());
    setRevealed(false);
    onNext();
  };

  const handlePrev = () => {
    setCenterAnswer(null);
    setLeftSelected(new Set());
    setRightSelected(new Set());
    setRevealed(false);
    onPrev();
  };

  const centerIsCorrect = centerAnswer === question.centerCorrect;

  // Column accent colors
  const leftAccent = {
    border: "border-teal-400",
    bg: "bg-teal-50/70",
    check: "text-teal-600",
    ring: "ring-teal-200/60",
  };
  const centerAccent = {
    border: "border-violet-400",
    bg: "bg-violet-50/70",
    check: "text-violet-600",
    ring: "ring-violet-200/60",
  };
  const rightAccent = {
    border: "border-emerald-400",
    bg: "bg-emerald-50/70",
    check: "text-emerald-600",
    ring: "ring-emerald-200/60",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden" data-testid="card-bowtie-question">

      {/* Header */}
      <div className="px-6 md:px-8 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-50 text-xs font-bold uppercase tracking-wide" data-testid="badge-bowtie-type">
              Bowtie / NGN
            </Badge>
            <Badge className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-50 text-xs uppercase" data-testid="badge-bowtie-tier">
              {question.tier === "rpn" ? "RPN/LVN" : "RN"}
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-500 text-xs" data-testid="badge-bowtie-system">
              {question.bodySystem}
            </Badge>
          </div>
          <span className="text-sm text-slate-400 font-semibold shrink-0 ml-2" data-testid="text-bowtie-progress">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <p className="text-[17px] font-semibold leading-[1.6] text-slate-900" data-testid="text-bowtie-scenario">
          {question.scenario}
        </p>
      </div>

      {/* Bowtie diagram + columns */}
      <div className="p-6 md:p-8">

        {/* Instruction row */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-10 rounded-full bg-teal-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider" data-testid="text-bowtie-left-title">
                Supporting Findings
              </p>
              <p className="text-[11px] text-slate-400">Select {question.leftSelectCount}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1 h-10 rounded-full bg-violet-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-violet-700 uppercase tracking-wider text-center" data-testid="text-bowtie-center-title">
                Clinical Condition
              </p>
              <p className="text-[11px] text-slate-400 text-center">Select 1</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-10 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider" data-testid="text-bowtie-right-title">
                Nursing Actions
              </p>
              <p className="text-[11px] text-slate-400">Select {question.rightSelectCount}</p>
            </div>
          </div>
        </div>

        {/* Three-column layout with visual flow indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 lg:gap-0 items-start">

          {/* Left column: Supporting Findings */}
          <div className="space-y-2 lg:pr-4">
            {question.leftFindings.map((finding, idx) => (
              <BowtieOption
                key={idx}
                label={finding}
                isSelected={leftSelected.has(idx)}
                isCorrect={revealed && question.leftCorrect.includes(idx)}
                isWrong={revealed && leftSelected.has(idx) && !question.leftCorrect.includes(idx)}
                revealed={revealed}
                onClick={() => toggleLeft(idx)}
                testId={`button-bowtie-left-${idx}`}
                accentColor={leftAccent}
              />
            ))}
          </div>

          {/* Connector: left → center */}
          <div className="hidden lg:flex flex-col items-center justify-center self-center px-2 gap-1">
            <ConnectorDot color="border-teal-400" />
            <div className="w-0.5 h-8 bg-gradient-to-b from-teal-300 to-violet-300" />
            <ArrowRight className="w-4 h-4 text-violet-400" />
          </div>

          {/* Center column: Clinical Condition */}
          <div className="space-y-2 lg:px-4">
            <div className="rounded-2xl border-2 border-violet-200/80 bg-violet-50/40 p-3 mb-3">
              <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wider text-center mb-1">
                Select the condition
              </p>
            </div>
            {question.centerOptions.map((opt, idx) => {
              const isSelected = centerAnswer === idx;
              const isCorrect = revealed && idx === question.centerCorrect;
              const isWrong = revealed && isSelected && idx !== question.centerCorrect;
              return (
                <BowtieOption
                  key={idx}
                  label={opt}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  isWrong={isWrong}
                  revealed={revealed}
                  onClick={() => !revealed && setCenterAnswer(idx)}
                  testId={`button-bowtie-center-${idx}`}
                  accentColor={centerAccent}
                />
              );
            })}
          </div>

          {/* Connector: center → right */}
          <div className="hidden lg:flex flex-col items-center justify-center self-center px-2 gap-1">
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <div className="w-0.5 h-8 bg-gradient-to-b from-violet-300 to-emerald-300" />
            <ConnectorDot color="border-emerald-400" />
          </div>

          {/* Right column: Nursing Actions */}
          <div className="space-y-2 lg:pl-4">
            {question.rightActions.map((action, idx) => (
              <BowtieOption
                key={idx}
                label={action}
                isSelected={rightSelected.has(idx)}
                isCorrect={revealed && question.rightCorrect.includes(idx)}
                isWrong={revealed && rightSelected.has(idx) && !question.rightCorrect.includes(idx)}
                revealed={revealed}
                onClick={() => toggleRight(idx)}
                testId={`button-bowtie-right-${idx}`}
                accentColor={rightAccent}
              />
            ))}
          </div>
        </div>

        {/* Submit / results */}
        <div className="mt-6">
          {!revealed ? (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-5 text-base rounded-2xl bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-40"
              data-testid="button-bowtie-submit"
            >
              {canSubmit ? "Submit Answer" : `Select all required answers to continue`}
            </Button>
          ) : (
            <div className="space-y-3 mt-2">
              {/* Rationale cards */}
              <div className={cn(
                "p-4 rounded-2xl border-2",
                centerIsCorrect ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"
              )}>
                <p className={cn(
                  "font-bold text-sm mb-1.5",
                  centerIsCorrect ? "text-emerald-800" : "text-amber-800"
                )} data-testid="text-bowtie-condition-result">
                  {centerIsCorrect ? "✓ Condition Correct" : "✗ Condition Incorrect"}
                </p>
                <p className="text-[13px] leading-relaxed text-slate-700" data-testid="text-bowtie-condition-rationale">
                  {question.rationale.condition}
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-teal-200 bg-teal-50/60">
                <p className="font-bold text-sm mb-1.5 text-teal-800" data-testid="text-bowtie-findings-label">
                  {t("components.bowtieQuestion.supportingFindingsRationale")}
                </p>
                <p className="text-[13px] leading-relaxed text-slate-700" data-testid="text-bowtie-findings-rationale">
                  {question.rationale.findings}
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60">
                <p className="font-bold text-sm mb-1.5 text-emerald-800" data-testid="text-bowtie-actions-label">
                  {t("components.bowtieQuestion.nursingActionsRationale")}
                </p>
                <p className="text-[13px] leading-relaxed text-slate-700" data-testid="text-bowtie-actions-rationale">
                  {question.rationale.actions}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex gap-2.5 pt-1">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600"
                  data-testid="button-bowtie-prev"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white"
                  data-testid="button-bowtie-next"
                >
                  Next Question <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
