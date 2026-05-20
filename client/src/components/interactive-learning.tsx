import { useState, useCallback, useRef, useMemo } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Sparkles,
  GripVertical,
  Target,
  HelpCircle,
} from "lucide-react";

function cn(...classes: any[]) {
  const { t } = useI18n();
  return classes.filter(Boolean).join(" ");
}

export type LabelPoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  hint?: string;
};

export function AnatomyLabeling({
  title,
  description,
  svgContent,
  backgroundImage,
  labels,
  width = 500,
  height = 400,
}: {
  title: string;
  description?: string;
  svgContent?: React.ReactNode;
  backgroundImage?: string;
  labels: LabelPoint[];
  width?: number;
  height?: number;
}) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const allRevealed = revealed.size === labels.length || showAll;

  const togglePoint = (id: string) => {
    if (showAll) return;
    setActivePoint(id);
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setRevealed(new Set());
    setActivePoint(null);
    setShowAll(false);
  };

  return (
    <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="anatomy-labeling">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-white/60 px-3 py-1 rounded-full">
              {revealed.size}/{labels.length} identified
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="relative mx-auto" style={{ maxWidth: width }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {backgroundImage && (
              <image href={backgroundImage} x="0" y="0" width={width} height={height} preserveAspectRatio="xMidYMid meet" />
            )}
            {svgContent}
            {labels.map((point) => {
              const isRevealed = revealed.has(point.id) || showAll;
              const isActive = activePoint === point.id;
              return (
                <g key={point.id} className="cursor-pointer" onClick={() => togglePoint(point.id)}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 14 : 10}
                    className={cn(
                      "transition-all duration-300",
                      isRevealed
                        ? "fill-primary/80 stroke-primary"
                        : "fill-white stroke-primary/40 hover:stroke-primary hover:fill-primary/10"
                    )}
                    strokeWidth={2}
                  />
                  {!isRevealed && (
                    <text
                      x={point.x}
                      y={point.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-primary/60 text-[10px] font-bold pointer-events-none select-none"
                    >
                      ?
                    </text>
                  )}
                  {isRevealed && (
                    <text
                      x={point.x}
                      y={point.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-[8px] font-bold pointer-events-none select-none"
                    >
                      ✓
                    </text>
                  )}
                  {isRevealed && (() => {
                    const showBelow = point.y < 50;
                    const lineY1 = showBelow ? point.y + 12 : point.y - 12;
                    const lineY2 = showBelow ? point.y + 24 : point.y - 24;
                    const rectY = showBelow ? point.y + 22 : point.y - 42;
                    const textY = showBelow ? point.y + 35 : point.y - 29;
                    const labelW = point.label.length * 7 + 16;
                    let rectX = point.x - labelW / 2;
                    if (rectX < 2) rectX = 2;
                    if (rectX + labelW > width - 2) rectX = width - 2 - labelW;
                    const textX = rectX + labelW / 2;
                    return (
                      <g>
                        <line
                          x1={point.x}
                          y1={lineY1}
                          x2={point.x}
                          y2={lineY2}
                          stroke="currentColor"
                          className="text-primary/40"
                          strokeWidth={1}
                        />
                        <rect
                          x={rectX}
                          y={rectY}
                          width={labelW}
                          height={20}
                          rx={6}
                          className="fill-white stroke-primary/20"
                          strokeWidth={1}
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          className="fill-gray-800 text-[10px] font-medium pointer-events-none select-none"
                        >
                          {point.label}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => setShowAll(!showAll)}
            data-testid="button-show-all-labels"
          >
            {showAll ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showAll ? "Hide Labels" : "Reveal All"}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={reset} data-testid="button-reset-labels">
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
        {allRevealed && (
          <div className="mt-4 p-3 bg-primary/5 rounded-xl text-center">
            <Sparkles className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm text-gray-700 font-medium">{t("components.interactiveLearning.allStructuresIdentified")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type MatchPair = {
  id: string;
  term: string;
  definition: string;
};

export function MatchingExercise({
  title,
  description,
  pairs,
}: {
  title: string;
  description?: string;
  pairs: MatchPair[];
}) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<Map<string, string>>(new Map());
  const [incorrect, setIncorrect] = useState<string | null>(null);
  const [shuffledDefs, setShuffledDefs] = useState(() =>
    fisherYatesShuffle([...pairs])
  );

  const handleTermClick = (termId: string) => {
    if (matched.has(termId)) return;
    setSelectedTerm(termId);
    setIncorrect(null);
  };

  const handleDefClick = (defId: string) => {
    if (!selectedTerm) return;
    if (Array.from(matched.values()).includes(defId)) return;

    if (selectedTerm === defId) {
      setMatched((prev) => new Map(prev).set(selectedTerm, defId));
      setSelectedTerm(null);
      setIncorrect(null);
    } else {
      setIncorrect(defId);
      setTimeout(() => setIncorrect(null), 800);
    }
  };

  const reset = () => {
    setMatched(new Map());
    setSelectedTerm(null);
    setIncorrect(null);
    setShuffledDefs(fisherYatesShuffle([...pairs]));
  };

  const allMatched = matched.size === pairs.length;

  return (
    <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="matching-exercise">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <span className="text-xs text-gray-400 bg-white/60 px-3 py-1 rounded-full">
            {matched.size}/{pairs.length} matched
          </span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t("components.interactiveLearning.terms")}</p>
            {pairs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleTermClick(pair.id)}
                disabled={matched.has(pair.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                  matched.has(pair.id)
                    ? "bg-primary/10 border-primary/30 text-primary line-through opacity-60"
                    : selectedTerm === pair.id
                    ? "bg-primary/15 border-primary shadow-sm text-primary"
                    : "bg-white border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-gray-800"
                )}
                data-testid={`match-term-${pair.id}`}
              >
                {pair.term}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t("components.interactiveLearning.definitions")}</p>
            {shuffledDefs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleDefClick(pair.id)}
                disabled={Array.from(matched.values()).includes(pair.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 border",
                  Array.from(matched.values()).includes(pair.id)
                    ? "bg-primary/10 border-primary/30 text-primary opacity-60"
                    : incorrect === pair.id
                    ? "bg-red-50 border-red-300 text-red-700 animate-shake"
                    : "bg-white border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-gray-600"
                )}
                data-testid={`match-def-${pair.id}`}
              >
                {pair.definition}
              </button>
            ))}
          </div>
        </div>
        {allMatched && (
          <div className="mt-4 p-4 bg-primary/5 rounded-xl text-center">
            <CheckCircle2 className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-sm text-gray-700 font-medium">{t("components.interactiveLearning.allPairsMatchedCorrectly")}</p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={reset} data-testid="button-reset-matching">
            <RotateCcw className="w-3 h-3 mr-1" /> Shuffle & Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  hint?: string;
};

export function SelfCheckQuiz({
  title,
  questions,
}: {
  title: string;
  questions: QuizQuestion[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowRationale(true);
    if (index === current.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
      setShowHint(false);
    } else {
      setCompleted(true);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setScore(0);
    setCompleted(false);
    setShowHint(false);
  };

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="quiz-complete">
        <CardContent className="p-8 text-center">
          <div className={cn(
            "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
            percentage >= 80 ? "bg-emerald-50" : percentage >= 60 ? "bg-amber-50" : "bg-red-50"
          )}>
            <span className={cn(
              "text-2xl font-bold",
              percentage >= 80 ? "text-emerald-600" : percentage >= 60 ? "text-amber-600" : "text-red-600"
            )}>
              {percentage}%
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}: Complete</h3>
          <p className="text-gray-600 mb-1">
            {score}/{questions.length} correct
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {percentage >= 80 ? "Excellent understanding!" : percentage >= 60 ? "Good foundation: review the topics you missed." : "Keep studying: revisit the concepts and try again."}
          </p>
          <Button onClick={reset} className="rounded-full" data-testid="button-retry-quiz">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="self-check-quiz">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs text-gray-400 bg-white/60 px-3 py-1 rounded-full">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/60 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <CardContent className="p-6">
        <p className="text-gray-800 font-medium mb-4 leading-relaxed">{current.question}</p>
        <div className="space-y-2">
          {current.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 border flex items-center gap-3",
                selectedAnswer === null
                  ? "bg-white border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-gray-700"
                  : i === current.correctIndex
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : selectedAnswer === i
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-gray-50 border-gray-100 text-gray-400"
              )}
              data-testid={`quiz-option-${i}`}
            >
              <span className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                selectedAnswer === null
                  ? "bg-gray-50 text-gray-500 border-gray-200"
                  : i === current.correctIndex
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : selectedAnswer === i
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-gray-50 text-gray-300 border-gray-100"
              )}>
                {String.fromCharCode(65 + i)}
              </span>
              {option}
              {selectedAnswer !== null && i === current.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
              )}
              {selectedAnswer === i && i !== current.correctIndex && (
                <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>

        {current.hint && !showRationale && selectedAnswer === null && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-3 text-xs text-primary/60 hover:text-primary flex items-center gap-1"
            data-testid="button-show-hint"
          >
            <Lightbulb className="w-3 h-3" />
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
        )}
        {showHint && !showRationale && (
          <div className="mt-2 p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700">{current.hint}</p>
          </div>
        )}

        {showRationale && (
          <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary mb-1">{t("components.interactiveLearning.clinicalRationale")}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{current.rationale}</p>
              </div>
            </div>
          </div>
        )}

        {showRationale && (
          <div className="flex justify-end mt-4">
            <Button onClick={next} size="sm" className="rounded-full" data-testid="button-next-question">
              {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type SequenceStep = {
  id: string;
  text: string;
  order: number;
};

export function StepSequencing({
  title,
  description,
  steps,
}: {
  title: string;
  description?: string;
  steps: SequenceStep[];
}) {
  const [userOrder, setUserOrder] = useState<SequenceStep[]>(() =>
    fisherYatesShuffle([...steps])
  );
  const [checked, setChecked] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const isCorrect = userOrder.every((step, i) => step.order === i + 1);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (checked) return;
    const newOrder = [...userOrder];
    const [item] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, item);
    setUserOrder(newOrder);
  };

  const moveUp = (index: number) => {
    if (index === 0 || checked) return;
    moveItem(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index === userOrder.length - 1 || checked) return;
    moveItem(index, index + 1);
  };

  const reset = () => {
    setUserOrder(fisherYatesShuffle([...steps]));
    setChecked(false);
  };

  return (
    <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="step-sequencing">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <CardContent className="p-6">
        <p className="text-sm text-gray-500 mb-4">{t("components.interactiveLearning.arrangeTheStepsInThe")}</p>
        <div className="space-y-2">
          {userOrder.map((step, i) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200",
                checked && step.order === i + 1
                  ? "bg-emerald-50 border-emerald-200"
                  : checked && step.order !== i + 1
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200 hover:border-primary/30"
              )}
              data-testid={`sequence-step-${step.id}`}
            >
              <span className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                checked && step.order === i + 1
                  ? "bg-emerald-100 text-emerald-700"
                  : checked && step.order !== i + 1
                  ? "bg-red-100 text-red-700"
                  : "bg-primary/10 text-primary"
              )}>
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 flex-1">{step.text}</span>
              {!checked && (
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-0.5 text-gray-400 hover:text-primary disabled:opacity-30"
                    data-testid={`button-move-up-${step.id}`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === userOrder.length - 1}
                    className="p-0.5 text-gray-400 hover:text-primary disabled:opacity-30"
                    data-testid={`button-move-down-${step.id}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              {checked && step.order === i + 1 && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {checked && step.order !== i + 1 && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          {!checked ? (
            <Button onClick={() => setChecked(true)} className="rounded-full" data-testid="button-check-sequence">
              <Target className="w-4 h-4 mr-2" /> Check Order
            </Button>
          ) : (
            <Button onClick={reset} variant="outline" className="rounded-full" data-testid="button-reset-sequence">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          )}
        </div>
        {checked && isCorrect && (
          <div className="mt-4 p-3 bg-primary/5 rounded-xl text-center">
            <Sparkles className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm text-gray-700 font-medium">{t("components.interactiveLearning.correctSequence")}</p>
          </div>
        )}
        {checked && !isCorrect && (
          <div className="mt-4 p-3 bg-amber-50/60 rounded-xl text-center border border-amber-100">
            <p className="text-sm text-amber-700">{t("components.interactiveLearning.notQuiteRightReviewThe")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type RevealCard = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  icon?: React.ReactNode;
};

export function ProgressiveReveal({
  title,
  cards,
}: {
  title: string;
  cards: RevealCard[];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div data-testid="progressive-reveal">
      {title && (
        <h3 className="font-semibold text-gray-900 text-lg mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border border-primary/10 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
          >
            <button
              onClick={() => toggle(card.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left group"
              data-testid={`reveal-card-${card.id}`}
            >
              <div className="flex items-center gap-3">
                {card.icon && (
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    {card.icon}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 text-sm">{card.title}</p>
                  {!expanded.has(card.id) && (
                    <p className="text-xs text-gray-500 mt-0.5">{card.summary}</p>
                  )}
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform duration-300",
                  expanded.has(card.id) && "rotate-180"
                )}
              />
            </button>
            {expanded.has(card.id) && (
              <div className="px-5 pb-4 pt-0 border-t border-primary/5">
                <p className="text-sm text-gray-600 leading-relaxed">{card.detail}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpotAbnormality({
  title,
  scenario,
  findings,
  normalFindings,
}: {
  title: string;
  scenario: string;
  findings: { id: string; text: string; isAbnormal: boolean; explanation: string }[];
  normalFindings?: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    if (checked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const abnormalCount = findings.filter((f) => f.isAbnormal).length;
  const correctSelections = findings.filter(
    (f) => f.isAbnormal && selected.has(f.id)
  ).length;
  const incorrectSelections = findings.filter(
    (f) => !f.isAbnormal && selected.has(f.id)
  ).length;

  const reset = () => {
    setSelected(new Set());
    setChecked(false);
  };

  return (
    <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="spot-abnormality">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{t("components.interactiveLearning.selectAllFindingsThatAre")}</p>
      </div>
      <CardContent className="p-6">
        <div className="p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{scenario}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {findings.map((finding) => (
            <button
              key={finding.id}
              onClick={() => toggle(finding.id)}
              className={cn(
                "text-left px-4 py-3 rounded-xl text-sm border transition-all duration-200",
                checked && finding.isAbnormal && selected.has(finding.id)
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : checked && finding.isAbnormal && !selected.has(finding.id)
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : checked && !finding.isAbnormal && selected.has(finding.id)
                  ? "bg-red-50 border-red-300 text-red-700"
                  : checked && !finding.isAbnormal
                  ? "bg-gray-50 border-gray-100 text-gray-400"
                  : selected.has(finding.id)
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-white border-gray-200 hover:border-primary/30 text-gray-700"
              )}
              data-testid={`finding-${finding.id}`}
            >
              <span className="flex items-center gap-2">
                {checked && finding.isAbnormal && selected.has(finding.id) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                {checked && finding.isAbnormal && !selected.has(finding.id) && <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                {checked && !finding.isAbnormal && selected.has(finding.id) && <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                {finding.text}
              </span>
            </button>
          ))}
        </div>

        {checked && (
          <div className="mt-4 space-y-2">
            {findings.filter(f => f.isAbnormal).map(f => (
              <div key={f.id} className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xs font-semibold text-primary">{f.text}</p>
                <p className="text-xs text-gray-600 mt-1">{f.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-4">
          {!checked ? (
            <Button onClick={() => setChecked(true)} className="rounded-full" data-testid="button-check-findings">
              <Target className="w-4 h-4 mr-2" /> Check Answers
            </Button>
          ) : (
            <Button onClick={reset} variant="outline" className="rounded-full" data-testid="button-reset-findings">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MicroLesson({
  title,
  subtitle,
  icon,
  color = "primary",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-primary/10 shadow-md overflow-hidden bg-white" data-testid="micro-lesson">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center text-primary shadow-sm">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

export function CognitiveCard({
  title,
  content,
  type = "concept",
  icon,
}: {
  title: string;
  content: string;
  type?: "concept" | "warning" | "tip" | "remember";
  icon?: React.ReactNode;
}) {
  const styles = {
    concept: "bg-primary/5 border-primary/15 text-primary",
    warning: "bg-red-50 border-red-200 text-red-600",
    tip: "bg-amber-50 border-amber-200 text-amber-600",
    remember: "bg-emerald-50 border-emerald-200 text-emerald-600",
  };

  const defaultIcons = {
    concept: <Lightbulb className="w-4 h-4" />,
    warning: <XCircle className="w-4 h-4" />,
    tip: <Sparkles className="w-4 h-4" />,
    remember: <CheckCircle2 className="w-4 h-4" />,
  };

  const hasHtml = /<[a-z][\s\S]*>/i.test(content);

  return (
    <div className={cn("p-4 rounded-xl border", styles[type])} data-testid={`cognitive-card-${type}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icon || defaultIcons[type]}</div>
        <div>
          <p className="text-sm font-semibold mb-1">{title}</p>
          {hasHtml ? (
            <div className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap [&_p]:mb-2 [&_p:last-child]:mb-0 [&_div]:mb-1" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function HoverReveal({
  term,
  definition,
  inline = true,
}: {
  term: string;
  definition: string;
  inline?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <span
      className={cn(
        "relative cursor-help",
        inline ? "inline" : "inline-block"
      )}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
      data-testid={`hover-reveal-${term.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span className="border-b border-dashed border-primary/40 text-primary font-medium">
        {term}
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-[240px] text-center whitespace-normal leading-relaxed">
          {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
        </span>
      )}
    </span>
  );
}
