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
  Send,
  Image as ImageIcon,
  StickyNote,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Pause,
  PanelRightClose,
  PanelRightOpen,
  FileText,
  CheckSquare,
} from "lucide-react";
import { ExamCalculator } from "@/components/exam-calculator";
import { ExplanationPanel, type ExplanationData } from "@/components/explanation-panel";
import { NGNQuestionDispatcher } from "@/components/ngn-renderers/ngn-question-dispatcher";
import type { NGNQuestionType, NGNItemPayload, NGNUserResponse } from "@/lib/ngn-question-types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
  // Premium redesign additions
  isSATA?: boolean;
  coachTutorHint?: string;
  coachWhyItMatters?: string;
  relatedLesson?: { title: string; href: string };
  confidenceValue?: number;
  onConfidenceChange?: (value: number) => void;
  onPause?: () => void;
  examTitle?: string;
}

// ─── ExhibitViewer ───────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── CoachInsightPanel ───────────────────────────────────────────────────────

function CoachInsightPanel({
  tutorHint,
  whyItMatters,
  relatedLesson,
}: {
  tutorHint?: string;
  whyItMatters?: string;
  relatedLesson?: { title: string; href: string };
}) {
  if (!tutorHint && !whyItMatters && !relatedLesson) return null;

  return (
    <div className="mt-4 rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50/80 via-purple-50/40 to-indigo-50/30 overflow-hidden" data-testid="section-coach-panel">
      <div className="flex items-stretch divide-x divide-violet-200/60">
        {/* Coach avatar */}
        <div className="flex flex-col items-center justify-center px-4 py-3 bg-violet-100/60 shrink-0">
          <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Coach</span>
        </div>

        {tutorHint && (
          <div className="flex-1 px-4 py-3 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tutor Hint</span>
            </div>
            <p className="text-sm text-slate-700 leading-snug line-clamp-3">{tutorHint}</p>
          </div>
        )}

        {whyItMatters && (
          <div className="flex-1 px-4 py-3 min-w-0 hidden sm:block">
            <div className="flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Why This Matters</span>
            </div>
            <p className="text-sm text-slate-700 leading-snug line-clamp-3">{whyItMatters}</p>
          </div>
        )}

        {relatedLesson && (
          <div className="px-4 py-3 shrink-0 hidden md:block">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Related Lesson</span>
            </div>
            <p className="text-sm text-slate-800 font-medium leading-snug mb-1.5 max-w-[180px] line-clamp-2">{relatedLesson.title}</p>
            <a
              href={relatedLesson.href}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              data-testid="link-related-lesson"
            >
              Go to lesson <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ConfidenceSelector ──────────────────────────────────────────────────────

function ConfidenceSelector({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2" data-testid="section-confidence-selector">
      <span className="text-xs text-slate-500 hidden sm:block">Confidence</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`Confidence ${n}`}
            className={cn(
              "w-8 h-8 rounded-full text-sm font-semibold border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40",
              value === n
                ? "bg-primary border-primary text-white shadow-sm scale-110"
                : "bg-white border-slate-200 text-slate-500 hover:border-primary/50 hover:text-primary"
            )}
            data-testid={`button-confidence-${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="hidden sm:flex gap-3 ml-1 text-[10px] text-slate-400">
        <span>Not confident</span>
        <span>Very confident</span>
      </div>
    </div>
  );
}

// ─── ExamConsoleLayout ───────────────────────────────────────────────────────

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
  isSATA = false,
  coachTutorHint,
  coachWhyItMatters,
  relatedLesson,
  confidenceValue,
  onConfidenceChange,
  onPause,
  examTitle,
}: ExamConsoleLayoutProps) {
  const { t } = useI18n();
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

  // Derive coach data from explanationData as fallback
  const tutorHint = coachTutorHint || (explanationData?.clinicalPearl?.slice(0, 120)) || undefined;
  const whyItMatters = coachWhyItMatters || (explanationData?.examStrategy?.slice(0, 120)) || undefined;
  const hasCoachData = tutorHint || whyItMatters || relatedLesson;

  // Open right panel automatically in learning mode once explanation is revealed
  useEffect(() => {
    if (isLearningMode && showExplanation && (explanationData || explanation)) {
      setRightPanelOpen(true);
    }
  }, [isLearningMode, showExplanation, explanationData, explanation]);

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
      if (next.has(index)) next.delete(index);
      else next.add(index);
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
      ) return;

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }
      if (e.key >= "1" && e.key <= "5") {
        const index = parseInt(e.key) - 1;
        if (index < options.length) onSelectAnswer(index);
        return;
      }
      if (e.key === "n" || e.key === "N" || e.key === "ArrowRight") {
        e.preventDefault();
        if (questionNumber === totalQuestions) onComplete();
        else onNext();
        return;
      }
      if (e.key === "p" || e.key === "P" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (questionNumber > 1) onPrevious();
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
  }, [options.length, onSelectAnswer, onNext, onPrevious, onFlag, onComplete, questionNumber, totalQuestions]);

  const progressPercent = (questionNumber / totalQuestions) * 100;
  const isLastQuestion = questionNumber === totalQuestions;
  const hasExhibits = exhibits && exhibits.length > 0;
  const hasRationale = showExplanation && (explanationData || explanation);
  const showRationaleInPanel = isLearningMode && hasRationale;

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

  // ── Answer option rendering ───────────────────────────────────────────────

  const renderOption = (option: string, index: number) => {
    const isSelected = selectedAnswer === index;
    const isStruck = struckOptions.has(index);
    const isCorrectOption = showExplanation && correctAnswer === index;
    const isWrongSelected = showExplanation && isSelected && correctAnswer !== index;

    let containerCls: string;
    let badgeCls: string;
    let textCls: string;

    if (isCorrectOption) {
      containerCls = "border-emerald-300 bg-emerald-50/70 shadow-sm";
      badgeCls = isSATA
        ? "border-emerald-500 bg-emerald-500 text-white"
        : "border-emerald-500 bg-emerald-500 text-white";
      textCls = "text-emerald-900 font-semibold";
    } else if (isWrongSelected) {
      containerCls = "border-red-300 bg-red-50/60";
      badgeCls = "border-red-400 bg-red-400 text-white";
      textCls = "text-red-800";
    } else if (showExplanation && !isSelected) {
      containerCls = "border-slate-100 opacity-40";
      badgeCls = "border-slate-200 text-slate-400 bg-white";
      textCls = "text-slate-500";
    } else if (isSelected && !showExplanation) {
      containerCls = "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20";
      badgeCls = "border-primary bg-primary text-white";
      textCls = "text-slate-900 font-semibold";
    } else {
      containerCls = "border-slate-200 hover:border-primary/40 hover:bg-primary/[0.025] hover:shadow-sm";
      badgeCls = "border-slate-300 text-slate-500 bg-white";
      textCls = "text-slate-700";
    }

    return (
      <button
        key={index}
        onClick={() => onSelectAnswer(index)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleStrike(index);
        }}
        className={cn(
          "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group",
          containerCls,
          isStruck ? "line-through opacity-40" : ""
        )}
        aria-selected={isSelected}
        data-testid={`radio-option-${index}`}
      >
        {/* Letter / checkbox badge */}
        {isSATA ? (
          <span
            className={cn(
              "shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
              badgeCls
            )}
            aria-hidden="true"
          >
            {isSelected && <CheckSquare className="w-3 h-3" />}
          </span>
        ) : (
          <span
            className={cn(
              "shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-200",
              badgeCls
            )}
            aria-hidden="true"
          >
            {optionLabels[index] || index + 1}
          </span>
        )}

        <span
          className={cn(
            "flex-1 text-[15px] leading-relaxed",
            isStruck ? "text-slate-400" : textCls
          )}
        >
          {option}
        </span>

        {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
        {isWrongSelected && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
      </button>
    );
  };

  // ── Right panel content ───────────────────────────────────────────────────

  const defaultRightTab = showRationaleInPanel ? "rationale" : (hasExhibits ? "exhibit" : "notes");

  const rightPanel = (
    <div className="hidden md:flex flex-col border-l border-gray-200/80 bg-white/80 backdrop-blur-sm"
      style={{ width: "420px", minWidth: "360px", maxWidth: "480px", scrollbarGutter: "stable" }}>
      <Tabs defaultValue={defaultRightTab} className="flex flex-col h-full">
        <TabsList className="mx-4 mt-4 shrink-0 bg-slate-100/80">
          {showRationaleInPanel && (
            <TabsTrigger value="rationale" className="gap-1.5 data-[state=active]:bg-white" data-testid="tab-rationale">
              <BookOpen className="w-3.5 h-3.5" />
              Rationale
            </TabsTrigger>
          )}
          <TabsTrigger value="exhibit" className="gap-1.5 data-[state=active]:bg-white" data-testid="tab-exhibit">
            <ImageIcon className="w-3.5 h-3.5" />
            Exhibit
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5 data-[state=active]:bg-white" data-testid="tab-notes">
            <StickyNote className="w-3.5 h-3.5" />
            Notes
          </TabsTrigger>
          {!showRationaleInPanel && (
            <TabsTrigger value="references" className="gap-1.5 data-[state=active]:bg-white" data-testid="tab-references">
              <BookOpen className="w-3.5 h-3.5" />
              Refs
            </TabsTrigger>
          )}
        </TabsList>

        {showRationaleInPanel && (
          <TabsContent value="rationale" className="flex-1 m-0 overflow-y-auto">
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Rationale</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightPanelOpen(false)}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600"
                  data-testid="button-close-rationale"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {explanationData ? (
                <ExplanationPanel data={explanationData} isLearningMode={isLearningMode} />
              ) : explanation ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800">Explanation</span>
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                      {explanation.split(/\n\n+/).filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                  {(() => {
                    const img = question.image || (explanationContext ? getQuestionImage(explanationContext) : undefined);
                    return img ? (
                      <div className="border-t border-slate-100 pt-3">
                        <img src={img} alt={explanationContext?.topic || "Clinical reference"} className="rounded-xl border border-slate-200/60 max-w-full w-auto mx-auto" style={{ maxHeight: "200px" }} loading="lazy" data-testid="img-rationale" />
                      </div>
                    ) : null;
                  })()}
                </div>
              ) : null}
            </div>
          </TabsContent>
        )}

        <TabsContent value="exhibit" className="flex-1 m-0 overflow-y-auto">
          {hasExhibits ? (
            <ExhibitViewer images={exhibits!} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
              <ImageIcon className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm text-center">No exhibits for this question</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="flex-1 m-0 p-4 overflow-y-auto">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("components.examConsole.typeYourNotesHere")}
            className="w-full h-full min-h-[200px] resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-gray-50/80"
            data-testid="textarea-notes"
          />
        </TabsContent>

        {!showRationaleInPanel && (
          <TabsContent value="references" className="flex-1 m-0 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
              <BookOpen className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm text-center">References available in a future update</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-gray-900 flex flex-col">

      {/* ── Premium Exam Top Bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/96 backdrop-blur-md border-b border-slate-200/70 shadow-sm">
        <div className="flex items-center px-4 md:px-6 h-14 gap-3">

          {/* Left: mode badge */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {examTitle && (
              <span className="text-sm font-semibold text-slate-700 truncate hidden sm:block">{examTitle}</span>
            )}
            {isLearningMode && onToggleLearningMode && (
              <button
                onClick={onToggleLearningMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100/80 transition-colors"
                data-testid="button-toggle-learning-mode"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                  Learning mode
                </span>
              </button>
            )}
            {!isLearningMode && onToggleLearningMode && (
              <button
                onClick={onToggleLearningMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors"
                data-testid="button-toggle-learning-mode"
              >
                <Sparkles className="w-3 h-3 text-slate-500" />
                <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Exam mode</span>
              </button>
            )}
          </div>

          {/* Center: Timer + progress */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl" data-testid="text-timer">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-semibold tracking-wide">
                {timerSeconds !== undefined ? formatTimer(timerSeconds) : "--:--"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700" data-testid="text-progress">
                <span className="text-primary font-bold">{questionNumber}</span>
                <span className="text-slate-400 font-normal"> of </span>
                <span>{totalQuestions}</span>
              </span>
              <div className="hidden sm:block w-20">
                <Progress value={progressPercent} className="h-1.5 bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Right: Toolbar */}
          <div className="flex items-center gap-1 flex-1 justify-end">
            <Button
              variant={flagged ? "default" : "ghost"}
              size="sm"
              onClick={onFlag}
              aria-label={flagged ? "Unflag question" : "Flag question"}
              className={cn(
                "h-8 w-8 p-0 rounded-lg",
                flagged ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-slate-500 hover:text-amber-500 hover:bg-amber-50"
              )}
              data-testid="button-flag"
            >
              <Flag className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant={highlightMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setHighlightMode(!highlightMode)}
              aria-label={highlightMode ? "Disable highlight mode" : "Enable highlight mode"}
              className={cn(
                "h-8 w-8 p-0 rounded-lg",
                highlightMode ? "bg-yellow-400 hover:bg-yellow-500 text-white" : "text-slate-500 hover:text-yellow-500 hover:bg-yellow-50"
              )}
              data-testid="button-highlight"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant={showCalculator ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowCalculator(!showCalculator)}
              aria-label="Toggle calculator"
              className={cn(
                "h-8 w-8 p-0 rounded-lg",
                showCalculator ? "bg-violet-500 hover:bg-violet-600 text-white" : "text-slate-500 hover:text-violet-500 hover:bg-violet-50"
              )}
              data-testid="button-calculator"
            >
              <Calculator className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(true)}
              aria-label="Keyboard shortcuts"
              className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:bg-slate-100"
              data-testid="button-shortcuts"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              aria-label={rightPanelOpen ? "Close side panel" : "Open side panel"}
              className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:bg-slate-100 hidden md:flex"
              data-testid="button-toggle-panel"
            >
              {rightPanelOpen ? (
                <PanelRightClose className="w-3.5 h-3.5" />
              ) : (
                <PanelRightOpen className="w-3.5 h-3.5" />
              )}
            </Button>

            {onPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPause}
                className="h-8 gap-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 ml-1 hidden sm:flex"
                data-testid="button-pause"
              >
                <Pause className="w-3.5 h-3.5" />
                <span className="text-xs">Pause</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={onComplete}
              className="h-8 gap-1.5 ml-1 rounded-xl bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
              data-testid="button-end-test"
            >
              <Send className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">{t("components.examConsole.endTest")}</span>
            </Button>
          </div>
        </div>

        {/* Thin progress line */}
        <div className="h-0.5 bg-slate-100">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Question workspace */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          rightPanelOpen ? "" : "w-full"
        )}>
          <div className={cn(
            "mx-auto py-6 px-4 md:px-6 space-y-4",
            rightPanelOpen ? "max-w-full" : "max-w-3xl"
          )}>

            {/* SATA badge */}
            {isSATA && (
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80">
                  <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Select All That Apply
                  </span>
                </div>
              </div>
            )}

            {/* Question card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden" data-testid="card-question">

              {/* Question header */}
              <div className="px-6 md:px-8 pt-6 md:pt-7 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs font-bold px-2.5 py-1 rounded-lg border-primary/20 bg-primary/5 text-primary"
                    >
                      Q{questionNumber}
                    </Badge>
                    {flagged && (
                      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs">
                        <Flag className="w-2.5 h-2.5 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFlag}
                    className={cn(
                      "h-8 gap-1.5 rounded-xl text-xs px-3",
                      flagged ? "text-amber-600 hover:bg-amber-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    )}
                    data-testid="button-mark-review"
                  >
                    {flagged ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{flagged ? "Marked" : "Mark"}</span>
                  </Button>
                </div>

                <div
                  ref={stemRef}
                  className={cn(
                    "text-[17px] md:text-[18px] font-semibold leading-[1.65] text-slate-900 whitespace-pre-wrap",
                    highlightMode ? "cursor-text selection:bg-yellow-200" : ""
                  )}
                  onMouseUp={handleHighlight}
                  dangerouslySetInnerHTML={{
                    __html: renderHighlightedStem(question.question),
                  }}
                  data-testid="text-question-stem"
                />

                {highlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {highlights.map((hl, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200"
                      >
                        {hl.length > 30 ? hl.slice(0, 30) + "…" : hl}
                        <button
                          onClick={() => setHighlights((prev) => prev.filter((_, j) => j !== i))}
                          className="hover:text-yellow-900 ml-0.5"
                          data-testid={`button-remove-highlight-${i}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Answer options */}
              <div className="px-6 md:px-8 pb-6 md:pb-7 space-y-2.5">
                {options.map((option, index) => renderOption(option, index))}
                <p className="text-[11px] text-slate-400 mt-2 pl-1">
                  Right-click any option to strike through
                </p>
              </div>
            </div>

            {/* Coach strip (practice mode, after answering) */}
            {isLearningMode && showExplanation && hasCoachData && (
              <CoachInsightPanel
                tutorHint={tutorHint}
                whyItMatters={whyItMatters}
                relatedLesson={relatedLesson}
              />
            )}

            {/* Inline rationale (non-learning mode OR mobile when panel is closed) */}
            {showExplanation && !isLearningMode && (explanationData || explanation) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
                <div className="p-5 md:p-6">
                  {explanationData ? (
                    <ExplanationPanel data={explanationData} isLearningMode={false} />
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                          <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Explanation</h4>
                      </div>
                      <div className="text-[15px] text-slate-700 leading-relaxed space-y-2">
                        {explanation!.split(/\n\n+/).filter(Boolean).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </>
                  )}
                  {(() => {
                    const img = question.image || (explanationContext ? getQuestionImage(explanationContext) : undefined);
                    return img ? (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <img src={img} alt={explanationContext?.topic || "Clinical reference"} className="rounded-xl border border-slate-200/60 max-w-full w-auto mx-auto" style={{ maxHeight: "200px" }} loading="lazy" data-testid="img-rationale" />
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

            {/* Mobile: inline rationale card (learning mode) */}
            {isLearningMode && showExplanation && (explanationData || explanation) && (
              <div className="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Rationale</span>
                  </div>
                  {explanationData ? (
                    <ExplanationPanel data={explanationData} isLearningMode={isLearningMode} />
                  ) : (
                    <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                      {explanation!.split(/\n\n+/).filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NGN question renderer */}
            {ngnQuestionType && ngnPayload && ngnResponse && onNgnResponseChange && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden p-5 md:p-7" data-testid="ngn-question-renderer">
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

            {/* Mobile: Exhibits/Notes trigger */}
            <div className="md:hidden">
              <Button
                variant="outline"
                className="w-full rounded-xl border-slate-200 text-slate-600"
                onClick={() => setMobileDrawerOpen(true)}
                data-testid="button-open-mobile-panel"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exhibits / Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        {rightPanelOpen && rightPanel}
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[75vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Exhibits / Notes</h3>
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
                <TabsList className="mb-3 bg-slate-100/80">
                  <TabsTrigger value="exhibit" data-testid="tab-exhibit-mobile">Exhibit</TabsTrigger>
                  <TabsTrigger value="notes" data-testid="tab-notes-mobile">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="exhibit">
                  {hasExhibits ? (
                    <div className="h-64">
                      <ExhibitViewer images={exhibits!} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-sm">{t("components.examConsole.noExhibits")}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="notes">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("components.examConsole.typeYourNotesHere2")}
                    className="w-full h-40 resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="textarea-notes-mobile"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom navigation ────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-40 bg-white/96 backdrop-blur-md border-t border-slate-200/70 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
        <div className="px-4 md:px-6 py-3 flex items-center gap-3">

          {/* Previous */}
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionNumber <= 1}
            className="gap-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
            data-testid="button-prev-question"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">{t("components.examConsole.previous")}</span>
          </Button>

          {/* Center: question nav + confidence */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuestionNav(!showQuestionNav)}
              className="text-xs text-slate-500 gap-1 rounded-lg bg-slate-50 px-3 h-8 font-mono font-semibold shrink-0"
              data-testid="button-question-navigator"
            >
              {questionNumber}/{totalQuestions}
            </Button>

            {onConfidenceChange && showExplanation && isLearningMode && (
              <ConfidenceSelector value={confidenceValue} onChange={onConfidenceChange} />
            )}
          </div>

          {/* Next / Submit */}
          {isLastQuestion ? (
            <Button
              onClick={onComplete}
              className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0"
              data-testid="button-submit-trial"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{t("components.examConsole.submit")}</span>
            </Button>
          ) : (
            <Button
              onClick={onNext}
              className="gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm shrink-0"
              data-testid="button-next-question"
            >
              <span className="hidden sm:inline text-sm">{t("components.examConsole.next")}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Question navigator grid */}
        {showQuestionNav && (
          <div className="border-t border-slate-100 px-4 md:px-6 py-3 bg-slate-50/80">
            <div className="flex flex-wrap gap-1.5 max-w-3xl mx-auto">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const status = questionStatuses[i];
                const isCurrent = i + 1 === questionNumber;
                const isAnswered = status?.answered ?? false;
                const isFlaggedQ = status?.flagged ?? false;

                let bgClass = "bg-slate-200 text-slate-600 hover:bg-slate-300";
                if (isFlaggedQ) bgClass = "bg-amber-400 text-white hover:bg-amber-500";
                else if (isAnswered) bgClass = "bg-emerald-500 text-white hover:bg-emerald-600";
                if (isCurrent) bgClass += " ring-2 ring-primary ring-offset-1";

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
            <div className="flex items-center justify-center gap-4 mt-2.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Flagged
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-200" /> Unanswered
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm ring-2 ring-primary" /> Current
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Calculator ───────────────────────────────────────────────────── */}
      {showCalculator && <ExamCalculator onClose={() => setShowCalculator(false)} />}

      {/* ── Keyboard shortcuts dialog ─────────────────────────────────────── */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-shortcuts">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5">
            {[
              { keys: "1 – 5", action: "Select answer option" },
              { keys: "N / →", action: "Next question" },
              { keys: "P / ←", action: "Previous question" },
              { keys: "F", action: "Flag / unflag question" },
              { keys: "H", action: "Toggle highlight mode" },
              { keys: "?", action: "Show keyboard shortcuts" },
            ].map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{shortcut.action}</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded-lg">
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
