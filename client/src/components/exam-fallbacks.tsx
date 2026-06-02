import { useState, useCallback, useMemo, Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import type { PooledQuestion } from "@/lib/question-pool";
import { normalizeQuestionType, isKnownType, logUnsupportedType } from "@/lib/question-type-safety";
import {
  AlertTriangle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Eye, EyeOff, Printer, RefreshCw, Shield, ShieldCheck, BookOpen,
  ArrowLeft, CheckCircle2, XCircle, Loader2, FileText
} from "lucide-react";

interface FallbackErrorBoundaryState {
  hasError: boolean;
}

export class FallbackErrorBoundary extends Component<{ children: ReactNode; onExit?: () => void }, FallbackErrorBoundaryState> {
  constructor(props: { children: ReactNode; onExit?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): FallbackErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[FallbackErrorBoundary] Fallback component crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="fallback-error-boundary">
          <Card className="max-w-md w-full shadow-lg border-amber-200">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900" data-testid="text-fallback-error-title">
                Exam Temporarily Unavailable
              </h2>
              <p className="text-sm text-gray-600">
                We're experiencing a temporary issue. Please try again later. Your progress and subscription are safe.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="gap-1"
                  data-testid="button-fallback-retry"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
                {this.props.onExit && (
                  <Button
                    variant="default"
                    onClick={this.props.onExit}
                    data-testid="button-fallback-exit"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Exams
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

function getAuthHeaders(): Record<string, string> {
  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const parsed: { username?: string; password?: string } = JSON.parse(creds);
      if (parsed.username && parsed.password) {
        return { "x-username": parsed.username, "x-password": parsed.password };
      }
    }
  } catch {
  }
  return {};
}

function sanitizeRationale(rationale: unknown): string | null {
  if (typeof rationale !== "string") return null;
  const trimmed = rationale.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length < 5) return null;
  if (/^[^a-zA-Z0-9]*$/.test(trimmed)) return null;
  return trimmed;
}

function getOptionText(opt: string | undefined | null): string {
  if (typeof opt === "string") return opt;
  return String(opt ?? "");
}

export function QuestionGuard({
  question,
  index,
  children,
}: {
  question: PooledQuestion | undefined;
  index: number;
  children: React.ReactNode;
}) {
  if (!question) {
    return (
      <QuestionUnavailableCard
        reason="missing"
        index={index}
      />
    );
  }

  if (!question.question || (typeof question.question === "string" && question.question.trim().length === 0)) {
    return (
      <QuestionUnavailableCard
        reason="missing"
        index={index}
      />
    );
  }

  if (!isKnownType(question.questionType)) {
    console.warn(`[QuestionGuard] Unknown type "${question.questionType}" for question ${question.id}, rendering as multiple-choice fallback`);
    logUnsupportedType(question.questionType || "undefined", question.id);
  }
  const safeType = normalizeQuestionType(question.questionType);
  if (question.questionType !== safeType) {
    (question as any).questionType = safeType;
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    return (
      <QuestionUnavailableCard
        reason="missing-options"
        index={index}
      />
    );
  }

  if (question.correct === undefined || question.correct === null || question.correct < 0 || question.correct >= question.options.length) {
    return (
      <QuestionUnavailableCard
        reason="invalid-answer"
        index={index}
      />
    );
  }

  return <>{children}</>;
}

export function MediaGuard({
  src,
  alt,
  children,
  questionIndex,
}: {
  src: string | undefined | null;
  alt?: string;
  children: React.ReactNode;
  questionIndex: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div data-testid={`media-fallback-${questionIndex}`}>
        {children}
        {src && failed && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-center gap-2" data-testid={`text-media-error-${questionIndex}`}>
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            Image could not be loaded. Question text is still available above.
          </div>
        )}
      </div>
    );
  }

  return (
    <div data-testid={`media-container-${questionIndex}`}>
      {children}
      <img
        src={src}
        alt={alt || "Question media"}
        className="max-w-full h-auto rounded mt-2"
        onError={() => setFailed(true)}
        data-testid={`img-question-media-${questionIndex}`}
      />
    </div>
  );
}

export function TranslationGuard({
  translatedText,
  originalText,
  questionIndex,
  children,
}: {
  translatedText: string | undefined | null;
  originalText: string;
  questionIndex: number;
  children?: React.ReactNode;
}) {
  if (!translatedText || translatedText.trim().length === 0) {
    return (
      <div data-testid={`translation-fallback-${questionIndex}`}>
        <div className="mb-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 flex items-center gap-1.5" data-testid={`text-translation-notice-${questionIndex}`}>
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          Translation unavailable. Showing original English version.
        </div>
        {children || <span>{originalText}</span>}
      </div>
    );
  }

  return <>{children || <span>{translatedText}</span>}</>;
}

export function RationaleGuard({
  rationale,
  questionIndex,
}: {
  rationale: unknown;
  questionIndex: number;
}) {
  const safe = sanitizeRationale(rationale);

  if (safe === null) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-lg p-3 space-y-1" data-testid={`rationale-${questionIndex}`}>
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Rationale</p>
      <p className="text-sm text-gray-700 leading-relaxed">{safe}</p>
    </div>
  );
}

function QuestionUnavailableCard({
  reason,
  index,
  detail,
}: {
  reason: "missing" | "unsupported-type" | "missing-options" | "invalid-answer" | "media-failed" | "translation-failed";
  index: number;
  detail?: string;
}) {
  const messages: Record<string, { title: string; desc: string }> = {
    "missing": { title: "Question Unavailable", desc: "This question could not be loaded. It has been skipped." },
    "unsupported-type": { title: "Question Type Not Supported", desc: detail || "This question type is temporarily unavailable." },
    "missing-options": { title: "Question Temporarily Unavailable", desc: "This question's answer options could not be loaded." },
    "invalid-answer": { title: "Question Temporarily Unavailable", desc: "This question has a data issue and has been skipped." },
    "media-failed": { title: "Media Could Not Load", desc: "The image or media for this question could not be displayed, but the question text is still available." },
    "translation-failed": { title: "Translation Unavailable", desc: "This question could not be translated. Showing the original English version." },
  };
  const msg = messages[reason] || messages["missing"];

  return (
    <div className="space-y-6" data-testid={`question-unavailable-${index}`}>
      <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
        <CardContent className="p-6 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-800" data-testid={`text-unavailable-title-${index}`}>
            {msg.title}
          </h3>
          <p className="text-sm text-gray-600">{msg.desc}</p>
          <p className="text-xs text-gray-400">
            Question {index + 1} — Please continue to the next question.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function SafeExamPlayer({
  questions,
  answers: initialAnswers,
  onComplete,
  onExit,
  examTitle,
}: {
  questions: PooledQuestion[];
  answers?: Record<string, number>;
  onComplete?: (answers: Record<string, number>) => void;
  onExit?: () => void;
  examTitle?: string;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers || {});
  const [submitted, setSubmitted] = useState(false);

  const validQuestions = useMemo(() =>
    questions.filter(q =>
      q && q.id && q.question && Array.isArray(q.options) && q.options.length >= 2 && q.correct !== undefined && q.correct !== null
    ),
    [questions]
  );

  const question = validQuestions[currentQ];
  const answeredCount = Object.keys(answers).length;

  const handleSelect = (qId: string, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.(answers);
  };

  if (validQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="safe-exam-empty">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-semibold">No Valid Questions</h2>
          <p className="text-gray-600 text-sm">No questions could be loaded for this exam.</p>
          {onExit && <Button onClick={onExit} variant="outline" data-testid="button-safe-exit">Back to Exams</Button>}
        </div>
      </div>
    );
  }

  if (submitted) {
    let correct = 0;
    for (const q of validQuestions) {
      if (answers[q.id] === q.correct) correct++;
    }
    const pct = Math.round((correct / validQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-white p-4" data-testid="safe-exam-results">
        <div className="max-w-2xl mx-auto space-y-6 py-8">
          <div className="text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto" />
            <h1 className="text-2xl font-bold" data-testid="text-safe-results-title">Safe Mode Results</h1>
            <p className="text-3xl font-bold text-gray-900" data-testid="text-safe-score">{correct}/{validQuestions.length} ({pct}%)</p>
          </div>
          <div className="flex gap-3 justify-center">
            {onExit && <Button onClick={onExit} variant="outline" data-testid="button-safe-back">Back to Exams</Button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="safe-exam-player">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900" data-testid="text-safe-progress">
              Safe Mode — Q {currentQ + 1} of {validQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{answeredCount} answered</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              data-testid="button-safe-submit"
            >
              Finish
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {question && (
          <div className="space-y-5">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">{question.bodySystem || "General"}</span>
              <h2 className="text-base font-semibold text-gray-900 mt-1 leading-relaxed" data-testid="text-safe-question">
                {question.question}
              </h2>
            </div>

            <div className="space-y-2">
              {question.options.map((opt, oi) => {
                const optionText = getOptionText(opt);
                const isSelected = answers[question.id] === oi;
                const letter = String.fromCharCode(65 + oi);
                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(question.id, oi)}
                    className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-colors ${
                      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`button-safe-option-${oi}`}
                  >
                    <span className="text-sm">
                      <span className="font-semibold mr-2">{letter}.</span>
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="gap-1"
            data-testid="button-safe-prev"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-xs text-gray-400">{currentQ + 1} / {validQuestions.length}</span>
          {currentQ < validQuestions.length - 1 ? (
            <Button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="gap-1"
              data-testid="button-safe-next"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="gap-1"
              data-testid="button-safe-finish"
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function StudyModeFallback({
  questions,
  onExit,
  examTitle,
}: {
  questions: PooledQuestion[];
  onExit?: () => void;
  examTitle?: string;
}) {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [revealedRationales, setRevealedRationales] = useState<Set<string>>(new Set());

  const validQuestions = useMemo(() =>
    questions.filter(q =>
      q && q.id && q.question && Array.isArray(q.options) && q.options.length >= 2
    ),
    [questions]
  );

  const toggleAnswer = (qId: string) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const toggleRationale = (qId: string) => {
    setRevealedRationales(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const revealAll = () => {
    const allIds = new Set(validQuestions.map(q => q.id));
    setRevealedAnswers(allIds);
    setRevealedRationales(allIds);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="study-mode-fallback">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-900">
              Study Mode — {validQuestions.length} Questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={revealAll} className="text-xs" data-testid="button-study-reveal-all">
              <Eye className="w-3 h-3 mr-1" /> Reveal All
            </Button>
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit} data-testid="button-study-exit">
                <ArrowLeft className="w-3 h-3 mr-1" /> Exit
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {validQuestions.map((q, idx) => {
          const answerRevealed = revealedAnswers.has(q.id);
          const rationaleRevealed = revealedRationales.has(q.id);
          const correctIdx = q.correct;
          const correctLetter = correctIdx !== undefined && correctIdx !== null ? String.fromCharCode(65 + correctIdx) : "?";
          const safeRationale = sanitizeRationale(q.rationale);

          return (
            <Card key={q.id} className="border shadow-sm" data-testid={`study-question-${idx}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{q.bodySystem || "General"}</span>
                    <span className="text-xs text-gray-300 ml-2">#{idx + 1}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-relaxed" data-testid={`text-study-question-${idx}`}>
                  {q.question}
                </h3>

                <div className="space-y-1">
                  {q.options.map((opt, oi) => {
                    const optText = getOptionText(opt);
                    const letter = String.fromCharCode(65 + oi);
                    const isCorrect = oi === correctIdx;
                    return (
                      <div
                        key={oi}
                        className={`px-3 py-2 rounded text-sm ${
                          answerRevealed && isCorrect ? "bg-emerald-50 border border-emerald-300 font-medium" : "bg-gray-50"
                        }`}
                        data-testid={`study-option-${idx}-${oi}`}
                      >
                        <span className="font-semibold mr-1.5">{letter}.</span>
                        {optText}
                        {answerRevealed && isCorrect && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAnswer(q.id)}
                    className="text-xs gap-1"
                    data-testid={`button-study-toggle-answer-${idx}`}
                  >
                    {answerRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {answerRevealed ? "Hide Answer" : "Show Answer"}
                  </Button>

                  {safeRationale && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRationale(q.id)}
                      className="text-xs gap-1"
                      data-testid={`button-study-toggle-rationale-${idx}`}
                    >
                      {rationaleRevealed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {rationaleRevealed ? "Hide Rationale" : "Show Rationale"}
                    </Button>
                  )}
                </div>

                {answerRevealed && !rationaleRevealed && (
                  <p className="text-xs text-emerald-700 font-medium" data-testid={`text-study-answer-${idx}`}>
                    Correct Answer: {correctLetter}
                  </p>
                )}

                {rationaleRevealed && safeRationale && (
                  <RationaleGuard rationale={q.rationale} questionIndex={idx} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
}

export function PrintableBackup({
  questions,
  examTitle,
  tier,
  onExit,
}: {
  questions: PooledQuestion[];
  examTitle?: string;
  tier?: string;
  onExit?: () => void;
}) {
  const { user } = useAuth();

  const validQuestions = useMemo(() =>
    questions.filter(q =>
      q && q.id && q.question && Array.isArray(q.options) && q.options.length >= 2
    ),
    [questions]
  );

  const handlePrint = () => {
    window.print();
  };

  if (!user || user.tier === "free") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="printable-locked">
        <Card className="max-w-md w-full shadow-md">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold">Subscriber Feature</h2>
            <p className="text-sm text-gray-600">
              Printable exam backups are available to subscribers. Please upgrade your plan to access this feature.
            </p>
            {onExit && <Button onClick={onExit} variant="outline" data-testid="button-printable-back">Back</Button>}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="printable-backup">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Printer className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">Printable Exam Backup</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm" className="gap-1" data-testid="button-print">
              <Printer className="w-3 h-3" /> Print
            </Button>
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit} data-testid="button-printable-exit">
                <ArrowLeft className="w-3 h-3 mr-1" /> Back
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 print:px-8 print:py-4">
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-2xl font-bold text-gray-900 print:text-xl" data-testid="text-printable-title">
            {examTitle || `${(tier || "").toUpperCase()} Exam Backup`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {validQuestions.length} Questions — Generated {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6 print:space-y-4">
          {validQuestions.map((q, idx) => {
            const correctIdx = q.correct;
            const correctLetter = correctIdx !== undefined && correctIdx !== null ? String.fromCharCode(65 + correctIdx) : "?";
            return (
              <div key={q.id} className="border-b border-gray-100 pb-4 print:pb-3 print:break-inside-avoid" data-testid={`printable-question-${idx}`}>
                <div className="flex gap-2 mb-2">
                  <span className="text-sm font-bold text-gray-500 min-w-[2rem]">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">{q.question}</p>
                    <div className="mt-2 space-y-1 ml-2">
                      {q.options.map((opt, oi) => {
                        const optText = getOptionText(opt);
                        const letter = String.fromCharCode(65 + oi);
                        return (
                          <p key={oi} className="text-sm text-gray-700">
                            <span className="font-medium mr-1">{letter}.</span> {optText}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 print:mt-8 border-t-2 border-gray-300 pt-6 print:break-before-page">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Answer Key</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 print:grid-cols-10">
            {validQuestions.map((q, idx) => {
              const correctLetter = q.correct !== undefined && q.correct !== null ? String.fromCharCode(65 + q.correct) : "?";
              return (
                <div key={q.id} className="text-center text-xs" data-testid={`answer-key-${idx}`}>
                  <span className="font-bold text-gray-500">{idx + 1}.</span>{" "}
                  <span className="font-semibold text-emerald-700">{correctLetter}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 print:mt-4 border-t-2 border-gray-300 pt-6 print:break-before-page">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Rationales</h2>
          <div className="space-y-3 print:space-y-2">
            {validQuestions.map((q, idx) => {
              const safe = sanitizeRationale(q.rationale);
              if (!safe) return null;
              const correctLetter = q.correct !== undefined && q.correct !== null ? String.fromCharCode(65 + q.correct) : "?";
              return (
                <div key={q.id} className="text-sm print:break-inside-avoid" data-testid={`rationale-print-${idx}`}>
                  <span className="font-bold text-gray-500">{idx + 1}. ({correctLetter})</span>{" "}
                  <span className="text-gray-700">{safe}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export function BackupPracticeSet({
  originalExamTier,
  originalExamCode,
  onStart,
  onExit,
  inline = false,
}: {
  originalExamTier?: string;
  originalExamCode?: string;
  onStart?: (questions: PooledQuestion[]) => void;
  onExit?: () => void;
  inline?: boolean;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const isSubscriber = user && user.tier !== "free";

  const fetchBackup = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/mock-exams/backup-practice-set", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          tier: originalExamTier || "nclex-rn",
          examCode: originalExamCode,
          questionCount: 25,
        }),
      });
      if (resp.ok) {
        const data: { questions?: PooledQuestion[] } = await resp.json();
        if (data.questions && data.questions.length > 0) {
          setReady(true);
          onStart?.(data.questions);
          return;
        }
      }

      const fallbackResp = await fetch("/api/mock-exams/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          tier: originalExamTier || "nclex-rn",
          questionCount: 25,
          mode: "practice",
        }),
      });
      if (fallbackResp.ok) {
        const fallbackData: { questions?: PooledQuestion[] } = await fallbackResp.json();
        if (fallbackData.questions && fallbackData.questions.length > 0) {
          setReady(true);
          onStart?.(fallbackData.questions);
          return;
        }
      }

      setError("Could not load backup practice questions. Please try again.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load backup practice set: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [originalExamTier, originalExamCode, onStart]);

  if (!isSubscriber) {
    if (inline) {
      return null;
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="backup-practice-locked">
        <Card className="max-w-md w-full shadow-md">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold">Subscriber Feature</h2>
            <p className="text-sm text-gray-600">
              Backup practice sets are available to subscribers. Please upgrade your plan to access this feature.
            </p>
            {onExit && <Button onClick={onExit} variant="outline" data-testid="button-backup-locked-back">Back</Button>}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (inline) {
    return (
      <div data-testid="backup-practice-inline">
        {error && (
          <p className="text-xs text-red-600 mb-1" data-testid="text-backup-error">{error}</p>
        )}
        {ready ? (
          <p className="text-xs text-emerald-600 font-medium" data-testid="text-backup-ready">Backup questions loaded. Starting safe mode...</p>
        ) : (
          <Button
            onClick={fetchBackup}
            disabled={loading}
            variant="outline"
            className="w-full gap-2"
            data-testid="button-backup-load"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Backup...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Load Backup Practice Set
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  if (ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="backup-practice-ready">
        <Card className="max-w-md w-full shadow-md">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-semibold" data-testid="text-backup-ready-title">Backup Practice Set Ready</h2>
            <p className="text-sm text-gray-600">
              Practice questions have been loaded as a backup. Starting safe mode...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="backup-practice-set">
      <Card className="max-w-md w-full shadow-md">
        <CardContent className="p-8 text-center space-y-4">
          <FileText className="w-12 h-12 text-blue-500 mx-auto" />
          <h2 className="text-xl font-semibold">Backup Practice Set</h2>
          <p className="text-sm text-gray-600">
            Your original exam could not be loaded. We can generate a backup practice set with different questions from the same topic area.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-testid="text-backup-error">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={fetchBackup} disabled={loading} data-testid="button-backup-load">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load Backup Questions"
              )}
            </Button>
            {onExit && (
              <Button variant="outline" onClick={onExit} data-testid="button-backup-exit">
                Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CATFixedFormBackup({
  questions,
  catConfig,
  onStart,
  onExit,
}: {
  questions: PooledQuestion[];
  catConfig?: { algorithm?: string; difficulty?: string; category?: string };
  onStart?: (questions: PooledQuestion[]) => void;
  onExit?: () => void;
}) {
  const validQuestions = useMemo(() =>
    questions.filter(q =>
      q && q.id && q.question && Array.isArray(q.options) && q.options.length >= 2 && q.correct !== undefined && q.correct !== null
    ),
    [questions]
  );

  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    onStart?.(validQuestions);
  };

  if (started) {
    return (
      <SafeExamPlayer
        questions={validQuestions}
        onExit={onExit}
        examTitle={`CAT Fixed-Form Backup${catConfig?.category ? ` — ${catConfig.category}` : ""}`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="cat-fixed-form-backup">
      <Card className="max-w-md w-full shadow-md">
        <CardContent className="p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Shield className="w-7 h-7 text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold" data-testid="text-cat-fixed-title">
            CAT Engine Unavailable — Fixed-Form Backup
          </h2>
          <p className="text-sm text-gray-600">
            The adaptive testing engine encountered an issue. A fixed-form practice set with
            {" "}<strong>{validQuestions.length}</strong> validated questions has been assembled as a backup.
          </p>
          {catConfig && (
            <div className="bg-gray-50 rounded-lg p-3 text-left text-xs space-y-1">
              {catConfig.algorithm && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Original Algorithm</span>
                  <span className="font-medium">{catConfig.algorithm}</span>
                </div>
              )}
              {catConfig.difficulty && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulty Target</span>
                  <span className="font-medium">{catConfig.difficulty}</span>
                </div>
              )}
              {catConfig.category && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{catConfig.category}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={handleStart} disabled={validQuestions.length === 0} data-testid="button-cat-fixed-start">
              Start Fixed-Form Exam ({validQuestions.length} questions)
            </Button>
            {onExit && (
              <Button variant="outline" onClick={onExit} data-testid="button-cat-fixed-exit">
                Back
              </Button>
            )}
          </div>
          {validQuestions.length === 0 && (
            <p className="text-xs text-red-500">No valid questions could be assembled for the backup.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function CATStaticScoredPractice({
  questions,
  onExit,
}: {
  questions: PooledQuestion[];
  onExit?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const validQuestions = useMemo(() =>
    questions.filter(q =>
      q && q.id && q.question && Array.isArray(q.options) && q.options.length >= 2 && q.correct !== undefined
    ),
    [questions]
  );

  const handleSelect = (qId: string, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = useMemo(() => {
    if (!submitted) return { correct: 0, total: 0, pct: 0 };
    let correct = 0;
    for (const q of validQuestions) {
      if (answers[q.id] === q.correct) correct++;
    }
    return { correct, total: validQuestions.length, pct: Math.round((correct / validQuestions.length) * 100) };
  }, [submitted, validQuestions, answers]);

  return (
    <div className="min-h-screen bg-white" data-testid="cat-static-scored">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-900" data-testid="text-cat-static-title">
              {submitted ? "Practice Results" : `Static Practice — ${validQuestions.length} Questions`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!submitted && (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length === 0}
                data-testid="button-cat-static-submit"
              >
                Submit ({Object.keys(answers).length}/{validQuestions.length})
              </Button>
            )}
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit} data-testid="button-cat-static-exit">
                <ArrowLeft className="w-3 h-3 mr-1" /> Exit
              </Button>
            )}
          </div>
        </div>
      </div>

      {submitted && (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center space-y-3 mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-500 mx-auto" />
            <p className="text-2xl font-bold" data-testid="text-cat-static-score">
              {score.correct}/{score.total} ({score.pct}%)
            </p>
            <p className="text-sm text-gray-500">Static practice set — not an adaptive score</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs"
              data-testid="button-cat-static-toggle-review"
            >
              {showAll ? "Hide Review" : "Review Answers"}
            </Button>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {(!submitted || showAll) && validQuestions.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <Card key={q.id} className="border shadow-sm" data-testid={`cat-static-question-${idx}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-gray-400 mt-0.5 min-w-[1.5rem]">{idx + 1}.</span>
                  <h3 className="text-sm font-semibold text-gray-900 leading-relaxed">{q.question}</h3>
                </div>
                <div className="space-y-1.5 ml-6">
                  {q.options.map((opt, oi) => {
                    const optText = typeof opt === "string" ? opt : String(opt ?? "");
                    const letter = String.fromCharCode(65 + oi);
                    const isSelected = selected === oi;
                    const isCorrect = oi === q.correct;
                    let className = "px-3 py-2 rounded text-sm cursor-pointer border ";
                    if (submitted) {
                      if (isCorrect) className += "bg-emerald-50 border-emerald-300 font-medium";
                      else if (isSelected && !isCorrect) className += "bg-red-50 border-red-300";
                      else className += "bg-gray-50 border-gray-200";
                    } else {
                      className += isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300";
                    }
                    return (
                      <button
                        key={oi}
                        className={`w-full text-left ${className}`}
                        onClick={() => handleSelect(q.id, oi)}
                        disabled={submitted}
                        data-testid={`cat-static-option-${idx}-${oi}`}
                      >
                        <span className="font-semibold mr-1.5">{letter}.</span>
                        {optText}
                        {submitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline ml-2" />}
                        {submitted && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 text-red-500 inline ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
}

export function SessionRecoveryPrompt({
  attemptId,
  savedProgress,
  onRestore,
  onRestartSafe,
  onDiscard,
}: {
  attemptId: string;
  savedProgress: {
    answeredCount: number;
    totalQuestions: number;
    timeSpent: number;
    currentQuestion?: number;
  };
  onRestore: () => void;
  onRestartSafe: () => void;
  onDiscard: () => void;
}) {
  const { answeredCount, totalQuestions, timeSpent } = savedProgress;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="session-recovery-prompt">
      <Card className="max-w-md w-full shadow-md">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-blue-500 mx-auto" />
            <h2 className="text-xl font-semibold" data-testid="text-recovery-title">Resume Your Exam?</h2>
            <p className="text-sm text-gray-600">
              You have an exam in progress.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium" data-testid="text-recovery-progress">{answeredCount} of {totalQuestions} answered</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time Spent</span>
              <span className="font-medium" data-testid="text-recovery-time">{formatTime(timeSpent)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onRestore} className="w-full gap-2" data-testid="button-recovery-resume">
              <RefreshCw className="w-4 h-4" /> Resume Exam
            </Button>
            <Button onClick={onRestartSafe} variant="outline" className="w-full gap-2" data-testid="button-recovery-safe">
              <Shield className="w-4 h-4" /> Restart in Safe Mode
            </Button>
            <Button onClick={onDiscard} variant="ghost" className="w-full gap-2 text-red-600 hover:text-red-700" data-testid="button-recovery-discard">
              <XCircle className="w-4 h-4" /> Start Fresh (Discard Progress)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExamListingFallback({
  title,
  message,
  onRetry,
  retrying,
  type = "generic",
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
  type?: "pool" | "history" | "definitions" | "generic";
}) {
  const defaults: Record<string, { title: string; message: string }> = {
    pool: {
      title: "Question Pool Unavailable",
      message: "We're having trouble loading the question pool right now. This is usually temporary — please try again in a moment.",
    },
    history: {
      title: "Exam History Unavailable",
      message: "Your exam history couldn't be loaded right now. Your past results are safe and will appear once the connection is restored.",
    },
    definitions: {
      title: "Exam Definitions Unavailable",
      message: "Exam configurations couldn't be loaded. Please try again shortly.",
    },
    generic: {
      title: "Something Went Wrong",
      message: "We ran into an issue loading this section. Please try again.",
    },
  };
  const d = defaults[type] || defaults.generic;

  return (
    <Card className="border-amber-200 bg-amber-50/50" data-testid="container-exam-listing-fallback">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800" data-testid="text-listing-fallback-title">
              {title || d.title}
            </h3>
            <p className="text-sm text-gray-600" data-testid="text-listing-fallback-message">
              {message || d.message}
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              disabled={retrying}
              variant="outline"
              className="gap-2"
              data-testid="button-listing-fallback-retry"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
              {retrying ? "Retrying..." : "Try Again"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
