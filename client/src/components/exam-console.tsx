import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getQuestionImage } from "@/lib/system-images";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Highlighter,
  Calculator,
  PanelRightClose,
  PanelRightOpen,
  Send,
  FileText,
  Image as ImageIcon,
  StickyNote,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { ExamCalculator } from "@/components/exam-calculator";
import { ExplanationPanel, type ExplanationData } from "@/components/explanation-panel";
import { NGNQuestionDispatcher } from "@/components/ngn-renderers/ngn-question-dispatcher";
import type { NGNQuestionType, NGNItemPayload, NGNUserResponse } from "@/lib/ngn-question-types";

import { useI18n } from "@/lib/i18n";
export interface ExamQuestion {
  question: string;
  options: string[];
  image?: string;
}

export interface ExhibitImage {
  url: string;
  caption?: string;
  altText?: string;
  labels?: string[];
}

export interface AnswerStatus {
  answered: boolean;
  flagged: boolean;
}

export interface ExamConsoleLayoutProps {
  question: ExamQuestion;
  options: string[];
  selectedAnswer?: number;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlag: () => void;
  onComplete: () => void;
  questionNumber: number;
  totalQuestions: number;
  timerSeconds?: number;
  flagged?: boolean;
  exhibits?: ExhibitImage[];
  showExplanation?: boolean;
  explanation?: string;
  explanationContext?: { topic?: string; subtopic?: string; bodySystem?: string };
  correctAnswer?: number;
  questionStatuses?: AnswerStatus[];
  onNavigateToQuestion?: (index: number) => void;
  children?: React.ReactNode;
  explanationData?: ExplanationData;
  isLearningMode?: boolean;
  onToggleLearningMode?: () => void;
  ngnQuestionType?: NGNQuestionType;
  ngnPayload?: NGNItemPayload;
  ngnResponse?: NGNUserResponse;
  onNgnResponseChange?: (response: NGNUserResponse) => void;
}

function ExhibitViewer({ images }: { images: ExhibitImage[] }) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 4));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.max(0.5, Math.min(4, s + delta)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslate({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const image = images[currentIndex];
  if (!image) return null;

  const viewer = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            data-testid="button-zoom-out"
            className="h-7 w-7 p-0"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-mono text-gray-500 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            data-testid="button-zoom-in"
            className="h-7 w-7 p-0"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            data-testid="button-zoom-reset"
            className="h-7 w-7 p-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          {images.length > 1 && (
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            data-testid="button-fullscreen-toggle"
            className="h-7 w-7 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-gray-100 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={image.url}
          alt={image.altText || image.caption || "Clinical exhibit image - NurseNest nursing education"}
          title={image.altText || image.caption || "Clinical exhibit image"}
          loading="lazy"
          className="w-full h-full object-contain transition-transform"
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transformOrigin: "center center",
          }}
          draggable={false}
        />
      </div>

      {image.caption && (
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">{image.caption}</p>
        </div>
      )}

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 px-3 py-2 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => {
              setCurrentIndex((i) => i - 1);
              handleReset();
            }}
            data-testid="button-exhibit-prev"
            className="h-7 px-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                handleReset();
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-primary" : "bg-gray-300"
              }`}
              data-testid={`button-exhibit-dot-${i}`}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex === images.length - 1}
            onClick={() => {
              setCurrentIndex((i) => i + 1);
              handleReset();
            }}
            data-testid="button-exhibit-next"
            className="h-7 px-2"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="text-white hover:bg-white/20"
            data-testid="button-close-fullscreen"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1">{viewer}</div>
      </div>
    );
  }

  return viewer;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamConsoleLayout({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  onFlag,
  onComplete,
  questionNumber,
  totalQuestions,
  timerSeconds,
  flagged = false,
  exhibits,
  showExplanation = false,
  explanation,
  explanationContext,
  correctAnswer,
  questionStatuses = [],
  onNavigateToQuestion,
  children,
  explanationData,
  isLearningMode = false,
  onToggleLearningMode,
  ngnQuestionType,
  ngnPayload,
  ngnResponse,
  onNgnResponseChange,
}: ExamConsoleLayoutProps) {
  const [struckOptions, setStruckOptions] = useState<Set<number>>(new Set());
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(!!exhibits?.length);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const stemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStruckOptions(new Set());
  }, [questionNumber]);

  const handleHighlight = useCallback(() => {
    if (!highlightMode) return;
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      if (!highlights.includes(text)) {
        setHighlights((prev) => [...prev, text]);
      }
      selection.removeAllRanges();
    }
  }, [highlightMode, highlights]);

  const toggleStrike = (index: number) => {
    setStruckOptions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      if (e.key >= "1" && e.key <= "5") {
        const index = parseInt(e.key) - 1;
        if (index < options.length) {
          onSelectAnswer(index);
        }
        return;
      }

      if (e.key === "n" || e.key === "N" || e.key === "ArrowRight") {
        e.preventDefault();
        if (questionNumber === totalQuestions) {
          onComplete();
        } else {
          onNext();
        }
        return;
      }

      if (e.key === "p" || e.key === "P" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (questionNumber > 1) {
          onPrevious();
        }
        return;
      }

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        onFlag();
        return;
      }

      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setHighlightMode((prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    options.length,
    onSelectAnswer,
    onNext,
    onPrevious,
    onFlag,
    onComplete,
    questionNumber,
    totalQuestions,
  ]);

  const progressPercent = (questionNumber / totalQuestions) * 100;
  const isLastQuestion = questionNumber === totalQuestions;
  const hasExhibits = exhibits && exhibits.length > 0;

  const renderHighlightedStem = (text: string) => {
    if (highlights.length === 0) return text;
    let result = text;
    for (const hl of highlights) {
      const escaped = hl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      result = result.replace(
        new RegExp(escaped, "g"),
        `<mark class="bg-yellow-200 px-0.5 rounded">${hl}</mark>`
      );
    }
    return result;
  };

  const optionLabels = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen bg-warmwhite font-sans text-gray-900 flex flex-col">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm h-12 flex items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg" data-testid="text-timer">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">
              {timerSeconds !== undefined ? formatTimer(timerSeconds) : "--:--"}
            </span>
          </div>
          {onToggleLearningMode && (
            <Button
              variant={isLearningMode ? "default" : "ghost"}
              size="sm"
              onClick={onToggleLearningMode}
              className={`h-8 gap-1 text-xs ${isLearningMode ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-gray-500"}`}
              data-testid="button-toggle-learning-mode"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLearningMode ? "Learning" : "Exam"}</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 justify-center">
          <span
            className="text-sm font-semibold text-gray-700"
            data-testid="text-progress"
          >
            Question {questionNumber} of {totalQuestions}
          </span>
          <Progress
            value={progressPercent}
            className="w-24 h-2 hidden sm:block"
          />
        </div>

        <div className="flex items-center gap-1 flex-1 justify-end">
          <Button
            variant={flagged ? "default" : "ghost"}
            size="sm"
            onClick={onFlag}
            className={`h-8 gap-1 ${flagged ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
            data-testid="button-flag"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">
              {flagged ? "Flagged" : "Flag"}
            </span>
          </Button>

          <Button
            variant={highlightMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setHighlightMode(!highlightMode)}
            className={`h-8 gap-1 ${highlightMode ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}`}
            data-testid="button-highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant={showCalculator ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className={`h-8 gap-1 ${showCalculator ? "bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white" : ""}`}
            data-testid="button-calculator"
          >
            <Calculator className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShortcuts(true)}
            className="h-8"
            data-testid="button-shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="h-8 hidden md:flex"
            data-testid="button-toggle-panel"
          >
            {rightPanelOpen ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onComplete}
            className="h-8 gap-1 ml-1"
            data-testid="button-end-test"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">{t("components.examConsole.endTest")}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-y-auto">
        <div
          className={`flex-1 overflow-y-auto p-4 md:p-6 ${
            rightPanelOpen ? "md:w-[60%]" : "w-full"
          }`}
        >
          <div className="max-w-[820px] mx-auto space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-5 md:p-7">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant="outline"
                    className="shrink-0 font-semibold text-sm px-2.5 py-0.5 rounded-lg border-primary/20 bg-primary/5 text-primary"
                  >
                    Q{questionNumber}
                  </Badge>
                  {flagged && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 shrink-0 rounded-lg">
                      <Flag className="w-3 h-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                </div>

                <div
                  ref={stemRef}
                  className={`text-xl font-semibold leading-relaxed text-slate-900 whitespace-pre-wrap ${
                    highlightMode
                      ? "cursor-text selection:bg-yellow-200"
                      : ""
                  }`}
                  style={{ lineHeight: '1.65' }}
                  onMouseUp={handleHighlight}
                  dangerouslySetInnerHTML={{
                    __html: renderHighlightedStem(question.question),
                  }}
                  data-testid="text-question-stem"
                />

                {highlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {highlights.map((hl, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full"
                      >
                        {hl.length > 30 ? hl.slice(0, 30) + "..." : hl}
                        <button
                          onClick={() =>
                            setHighlights((prev) =>
                              prev.filter((_, j) => j !== i)
                            )
                          }
                          className="hover:text-yellow-900"
                          data-testid={`button-remove-highlight-${i}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-5 md:px-7 pb-5 md:pb-7 space-y-3">
                {options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isStruck = struckOptions.has(index);
                  const isCorrectOption =
                    showExplanation && correctAnswer === index;
                  const isWrongSelected =
                    showExplanation &&
                    isSelected &&
                    correctAnswer !== index;

                  let containerCls = "border-slate-200 hover:border-primary/50 hover:bg-primary/[0.02]";
                  let letterCls = "border-slate-300 text-slate-500 bg-white";
                  let textCls = "text-slate-700";

                  if (isCorrectOption) {
                    containerCls = "border-emerald-300 bg-emerald-50/70";
                    letterCls = "border-emerald-500 bg-emerald-500 text-white";
                    textCls = "text-emerald-900 font-medium";
                  } else if (isWrongSelected) {
                    containerCls = "border-red-300 bg-red-50/60";
                    letterCls = "border-red-400 bg-red-400 text-white";
                    textCls = "text-red-800";
                  } else if (showExplanation && !isSelected) {
                    containerCls = "border-slate-100 opacity-50";
                  } else if (isSelected && !showExplanation) {
                    containerCls = "border-primary bg-primary/5 shadow-sm";
                    letterCls = "border-primary bg-primary text-white";
                    textCls = "text-slate-900 font-medium";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => onSelectAnswer(index)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggleStrike(index);
                      }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${containerCls} ${
                        isStruck ? "line-through opacity-50" : ""
                      }`}
                      data-testid={`radio-option-${index}`}
                    >
                      <span
                        className={`shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 ${letterCls}`}
                      >
                        {optionLabels[index] || index + 1}
                      </span>
                      <span
                        className={`flex-1 text-base leading-relaxed ${
                          isStruck ? "text-slate-400" : textCls
                        }`}
                      >
                        {option}
                      </span>
                      {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                      {isWrongSelected && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
                <p className="text-xs text-slate-400 mt-1">
                  Right-click an option to strike through
                </p>
              </div>
            </div>

            {showExplanation && (explanationData || explanation) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-3 md:p-4">
                  {explanationData ? (
                    <ExplanationPanel
                      data={explanationData}
                      isLearningMode={isLearningMode}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                          <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">
                          Explanation
                        </h4>
                      </div>
                      <div className="text-[15px] text-slate-700 leading-relaxed space-y-2" style={{ lineHeight: '1.7' }}>
                        {explanation!.split(/\n\n+/).filter(Boolean).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </>
                  )}
                  {(() => {
                    const img = question.image || (explanationContext ? getQuestionImage(explanationContext) : undefined);
                    return img ? (
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <img src={img} alt={explanationContext?.topic || explanationContext?.bodySystem || "Clinical reference"} className="rounded-lg border border-slate-200/60 max-w-full w-auto mx-auto" style={{ maxHeight: '200px' }} loading="lazy" data-testid="img-rationale" />
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

            {ngnQuestionType && ngnPayload && ngnResponse && onNgnResponseChange && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden p-5 md:p-7" data-testid="ngn-question-renderer">
                <NGNQuestionDispatcher
                  questionType={ngnQuestionType}
                  payload={ngnPayload}
                  response={ngnResponse}
                  onResponseChange={onNgnResponseChange}
                  disabled={showExplanation}
                />
              </div>
            )}

            {children}

            <div className="md:hidden mt-4">
              {(hasExhibits || true) && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileDrawerOpen(true)}
                  data-testid="button-open-mobile-panel"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exhibits / Notes
                </Button>
              )}
            </div>
          </div>
        </div>

        {rightPanelOpen && (
          <div className="hidden md:flex w-[40%] border-l border-gray-200 bg-white flex-col" style={{ scrollbarGutter: "stable" }}>
            <Tabs defaultValue={hasExhibits ? "exhibit" : "notes"} className="flex flex-col h-full">
              <TabsList className="mx-3 mt-3 shrink-0">
                <TabsTrigger
                  value="exhibit"
                  className="gap-1.5"
                  data-testid="tab-exhibit"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Exhibit
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="gap-1.5"
                  data-testid="tab-notes"
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="references"
                  className="gap-1.5"
                  data-testid="tab-references"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  References
                </TabsTrigger>
              </TabsList>

              <TabsContent value="exhibit" className="flex-1 m-0 overflow-y-auto">
                {hasExhibits ? (
                  <ExhibitViewer images={exhibits!} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
                    <ImageIcon className="w-10 h-10 mb-3" />
                    <p className="text-sm text-center">
                      No exhibits for this question
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="flex-1 m-0 p-3 overflow-y-auto">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("components.examConsole.typeYourNotesHere")}
                  className="w-full h-full resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-gray-50"
                  data-testid="textarea-notes"
                />
              </TabsContent>

              <TabsContent value="references" className="flex-1 m-0 overflow-y-auto">
                <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
                  <BookOpen className="w-10 h-10 mb-3" />
                  <p className="text-sm text-center">
                    References will be available in a future update
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                Exhibits / Notes
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileDrawerOpen(false)}
                data-testid="button-close-mobile-panel"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <Tabs defaultValue={hasExhibits ? "exhibit" : "notes"}>
                <TabsList className="mb-3">
                  <TabsTrigger value="exhibit" data-testid="tab-exhibit-mobile">
                    Exhibit
                  </TabsTrigger>
                  <TabsTrigger value="notes" data-testid="tab-notes-mobile">
                    Notes
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="exhibit">
                  {hasExhibits ? (
                    <div className="h-64">
                      <ExhibitViewer images={exhibits!} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <p className="text-sm">{t("components.examConsole.noExhibits")}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="notes">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("components.examConsole.typeYourNotesHere2")}
                    className="w-full h-40 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="textarea-notes-mobile"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-between h-14">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionNumber <= 1}
            className="gap-1.5 rounded-xl border-gray-200"
            data-testid="button-prev-question"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("components.examConsole.previous")}</span>
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuestionNav(!showQuestionNav)}
              className="text-xs text-gray-500 gap-1 rounded-lg bg-gray-50 px-3"
              data-testid="button-question-navigator"
            >
              <span className="font-mono font-semibold">
                {questionNumber}/{totalQuestions}
              </span>
            </Button>
          </div>

          {isLastQuestion ? (
            <Button
              onClick={onComplete}
              className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              data-testid="button-submit-trial"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t("components.examConsole.submit")}</span>
            </Button>
          ) : (
            <Button
              onClick={onNext}
              className="gap-1.5 rounded-xl bg-primary hover:bg-primary/90 shadow-sm"
              data-testid="button-next-question"
            >
              <span className="hidden sm:inline">{t("components.examConsole.next")}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {showQuestionNav && (
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/80">
            <div className="flex flex-wrap gap-1.5 max-w-3xl mx-auto">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const status = questionStatuses[i];
                const isCurrent = i + 1 === questionNumber;
                const isAnswered = status?.answered ?? false;
                const isFlaggedQ = status?.flagged ?? false;

                let bgClass = "bg-gray-200 text-gray-600 hover:bg-gray-300";
                if (isFlaggedQ)
                  bgClass = "bg-amber-400 text-white hover:bg-amber-500";
                else if (isAnswered)
                  bgClass =
                    "bg-emerald-500 text-white hover:bg-emerald-600";
                if (isCurrent)
                  bgClass += " ring-2 ring-primary ring-offset-1";

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (onNavigateToQuestion) {
                        onNavigateToQuestion(i);
                        setShowQuestionNav(false);
                      }
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${bgClass}`}
                    data-testid={`button-nav-q-${i}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Flagged
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-gray-200" /> Unanswered
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm ring-2 ring-primary" />{" "}
                Current
              </span>
            </div>
          </div>
        )}
      </div>

      {showCalculator && (
        <ExamCalculator onClose={() => setShowCalculator(false)} />
      )}

      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-shortcuts">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { keys: "1 - 5", action: "Select answer option" },
              { keys: "N / Right Arrow", action: "Next question" },
              { keys: "P / Left Arrow", action: "Previous question" },
              { keys: "F", action: "Flag / unflag question" },
              { keys: "H", action: "Toggle highlight mode" },
              { keys: "?", action: "Show this shortcuts panel" },
            ].map((shortcut) => (
              <div
                key={shortcut.keys}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  {shortcut.action}
                </span>
                <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { ExhibitViewer };
