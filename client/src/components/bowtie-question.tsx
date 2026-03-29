import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronRight, ArrowRight } from "lucide-react";
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

export function BowtieQuestionCard({ question, onNext, onPrev, questionNumber, totalQuestions, onScore }: BowtieQuestionCardProps) {
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

  const canSubmit = centerAnswer !== null && leftSelected.size === question.leftSelectCount && rightSelected.size === question.rightSelectCount;

  const handleSubmit = () => {
    setRevealed(true);
    if (onScore) {
      const centerCorrect = centerAnswer === question.centerCorrect;
      const leftCorrect = question.leftCorrect.every(i => leftSelected.has(i)) && leftSelected.size === question.leftCorrect.length;
      const rightCorrect = question.rightCorrect.every(i => rightSelected.has(i)) && rightSelected.size === question.rightCorrect.length;
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

  return (
    <Card className="border border-gray-200 shadow-sm bg-white" data-testid="card-bowtie-question">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-0 uppercase text-xs" data-testid="badge-bowtie-type">
              Bowtie
            </Badge>
            <Badge className="uppercase bg-gray-100 text-gray-700 hover:bg-gray-100 border-0" data-testid="badge-bowtie-tier">
              {question.tier === "rpn" ? "RPN/LVN" : "RN"}
            </Badge>
            <Badge variant="outline" className="border-gray-200 text-gray-600" data-testid="badge-bowtie-system">
              {question.bodySystem}
            </Badge>
          </div>
          <span className="text-sm text-gray-400" data-testid="text-bowtie-progress">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-base leading-relaxed text-gray-900" data-testid="text-bowtie-scenario">
          {question.scenario}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-1.5" data-testid="text-bowtie-left-title">
              Supporting Findings
              <span className="text-xs font-normal text-gray-500">(Select {question.leftSelectCount})</span>
            </h4>
            <div className="space-y-1.5">
              {question.leftFindings.map((finding, idx) => {
                const isSelected = leftSelected.has(idx);
                const isCorrectAnswer = question.leftCorrect.includes(idx);
                let cls = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50";
                if (revealed) {
                  if (isCorrectAnswer && isSelected) cls = "border-green-500 bg-green-50";
                  else if (isCorrectAnswer && !isSelected) cls = "border-green-300 bg-green-50/50";
                  else if (!isCorrectAnswer && isSelected) cls = "border-red-400 bg-red-50";
                  else cls = "border-gray-200 opacity-50";
                } else if (isSelected) {
                  cls = "border-blue-500 bg-blue-50";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => toggleLeft(idx)}
                    disabled={revealed}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${cls} ${revealed ? "cursor-default" : "cursor-pointer"}`}
                    data-testid={`button-bowtie-left-${idx}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                        revealed && isCorrectAnswer ? "border-green-500 bg-green-100" :
                        revealed && isSelected && !isCorrectAnswer ? "border-red-400 bg-red-100" :
                        isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300"
                      }`}>
                        {revealed && isCorrectAnswer ? <CheckCircle2 className="w-3 h-3 text-green-600" /> :
                         revealed && isSelected && !isCorrectAnswer ? <XCircle className="w-3 h-3 text-red-500" /> :
                         isSelected ? <CheckCircle2 className="w-3 h-3 text-blue-600" /> : null}
                      </span>
                      <span className="text-gray-800">{finding}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <h4 className="text-sm font-bold text-purple-800" data-testid="text-bowtie-center-title">
              Clinical Condition
            </h4>
            <div className="flex items-center gap-1 mb-1">
              <ArrowRight className="w-4 h-4 text-gray-300 hidden lg:block" />
              <div className="w-full space-y-1.5">
                {question.centerOptions.map((opt, idx) => {
                  const isSelected = centerAnswer === idx;
                  const isCorrectAnswer = idx === question.centerCorrect;
                  let cls = "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50";
                  if (revealed) {
                    if (isCorrectAnswer) cls = "border-green-500 bg-green-50";
                    else if (isSelected && !isCorrectAnswer) cls = "border-red-400 bg-red-50";
                    else cls = "border-gray-200 opacity-50";
                  } else if (isSelected) {
                    cls = "border-purple-500 bg-purple-50";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => !revealed && setCenterAnswer(idx)}
                      disabled={revealed}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${cls} ${revealed ? "cursor-default" : "cursor-pointer"}`}
                      data-testid={`button-bowtie-center-${idx}`}
                    >
                      <div className="flex items-center gap-2">
                        {revealed && isCorrectAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                        {revealed && isSelected && !isCorrectAnswer && <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                        {!revealed && isSelected && <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />}
                        <span className="text-gray-800">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 hidden lg:block" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5" data-testid="text-bowtie-right-title">
              Nursing Actions
              <span className="text-xs font-normal text-gray-500">(Select {question.rightSelectCount})</span>
            </h4>
            <div className="space-y-1.5">
              {question.rightActions.map((action, idx) => {
                const isSelected = rightSelected.has(idx);
                const isCorrectAnswer = question.rightCorrect.includes(idx);
                let cls = "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50";
                if (revealed) {
                  if (isCorrectAnswer && isSelected) cls = "border-green-500 bg-green-50";
                  else if (isCorrectAnswer && !isSelected) cls = "border-green-300 bg-green-50/50";
                  else if (!isCorrectAnswer && isSelected) cls = "border-red-400 bg-red-50";
                  else cls = "border-gray-200 opacity-50";
                } else if (isSelected) {
                  cls = "border-emerald-500 bg-emerald-50";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => toggleRight(idx)}
                    disabled={revealed}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${cls} ${revealed ? "cursor-default" : "cursor-pointer"}`}
                    data-testid={`button-bowtie-right-${idx}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                        revealed && isCorrectAnswer ? "border-green-500 bg-green-100" :
                        revealed && isSelected && !isCorrectAnswer ? "border-red-400 bg-red-100" :
                        isSelected ? "border-emerald-500 bg-emerald-100" : "border-gray-300"
                      }`}>
                        {revealed && isCorrectAnswer ? <CheckCircle2 className="w-3 h-3 text-green-600" /> :
                         revealed && isSelected && !isCorrectAnswer ? <XCircle className="w-3 h-3 text-red-500" /> :
                         isSelected ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : null}
                      </span>
                      <span className="text-gray-800">{action}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!revealed ? (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-5 text-base bg-gray-900 hover:bg-gray-800 text-white"
            data-testid="button-bowtie-submit"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${centerIsCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
                <p className={`font-bold text-sm mb-1 ${centerIsCorrect ? "text-green-800" : "text-amber-800"}`} data-testid="text-bowtie-condition-result">
                  Condition: {centerIsCorrect ? "Correct" : "Incorrect"}
                </p>
                <p className="text-xs leading-relaxed text-gray-700" data-testid="text-bowtie-condition-rationale">{question.rationale.condition}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-bold text-sm mb-1 text-blue-800" data-testid="text-bowtie-findings-label">{t("components.bowtieQuestion.supportingFindingsRationale")}</p>
                <p className="text-xs leading-relaxed text-gray-700" data-testid="text-bowtie-findings-rationale">{question.rationale.findings}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="font-bold text-sm mb-1 text-emerald-800" data-testid="text-bowtie-actions-label">{t("components.bowtieQuestion.nursingActionsRationale")}</p>
                <p className="text-xs leading-relaxed text-gray-700" data-testid="text-bowtie-actions-rationale">{question.rationale.actions}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrev} className="flex-1 border-gray-200 hover:bg-gray-50" data-testid="button-bowtie-prev">
                Previous
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white" data-testid="button-bowtie-next">
                Next Question <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
