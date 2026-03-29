import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { getExamQuestions, type PooledQuestion } from "@/lib/question-pool";
import ExamConsoleLayout, { type AnswerStatus } from "@/components/exam-console";
import { AlertTriangle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const TOTAL_QUESTIONS = 50;
const TIME_PER_QUESTION = 75;
const TOTAL_TIME = TOTAL_QUESTIONS * TIME_PER_QUESTION;

const EXAM_KEY_TO_TIER: Record<string, string> = {
  "rex-pn": "rpn",
  "nclex-pn": "rpn",
  "nclex-rn": "rn",
  "np-canada": "np",
  "aanp-fnp": "np",
};

interface TrialSession {
  id: string;
  examKey: string;
  tier: string;
  status: string;
  totalQuestions: number;
  questions: PooledQuestion[] | null;
  answers: Record<string, { selected: number; timeSpent: number; correct: boolean }> | null;
  currentIndex: number;
  timerEnabled: boolean;
  expiresAt: string;
}

export default function TrialSessionPage() {
  const { t } = useI18n();
  const { id: sessionId } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<PooledQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/trial/${sessionId}`)
      .then((r) => r.json())
      .then(async (data: TrialSession) => {
        if (data.status === "expired") {
          setExpired(true);
          setLoading(false);
          return;
        }

        if (data.status === "completed") {
          navigate(`/trial/results/${sessionId}`);
          return;
        }

        setTimerEnabled(data.timerEnabled || false);

        if (data.status === "started" && (!data.questions || data.questions.length === 0)) {
          const tier = data.tier || EXAM_KEY_TO_TIER[data.examKey] || "rpn";
          let selected: PooledQuestion[];
          try {
            selected = await getExamQuestions(tier, TOTAL_QUESTIONS);
          } catch (fetchErr: any) {
            console.error("[TrialSession] Failed to load questions:", fetchErr);
            setError("Unable to load exam questions. Please try again later.");
            return;
          }

          const questionsPayload = selected.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            rationale: q.rationale,
            bodySystem: q.bodySystem,
            tier: q.tier,
          }));

          await fetch(`/api/trial/${sessionId}/save-questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions: questionsPayload }),
          });

          setQuestions(selected);
          setCurrentQ(0);
        } else if (data.status === "in_progress" && data.questions) {
          setQuestions(data.questions as PooledQuestion[]);

          if (data.answers) {
            const restoredAnswers: Record<number, number> = {};
            for (const [indexStr, ans] of Object.entries(data.answers)) {
              restoredAnswers[parseInt(indexStr)] = ans.selected;
            }
            setAnswers(restoredAnswers);
          }

          const resumeIndex = data.currentIndex || 0;
          setCurrentQ(resumeIndex);
          if (data.answers && data.answers[resumeIndex]) {
            setSelectedAnswer(data.answers[resumeIndex].selected);
          }
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Could not load trial session");
        setLoading(false);
      });
  }, [sessionId]);

  useEffect(() => {
    if (loading || expired) return;

    timerRef.current = setInterval(() => {
      if (timerEnabled) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setElapsedTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, expired, timerEnabled]);

  const handleAutoSubmit = useCallback(async () => {
    if (!sessionId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/trial/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        navigate(`/trial/results/${sessionId}`);
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit trial", variant: "destructive" });
      setSubmitting(false);
    }
  }, [sessionId, navigate, toast]);

  const submitAnswer = useCallback(async (questionIndex: number, answer: number) => {
    if (!sessionId) return;

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      await fetch(`/api/trial/${sessionId}/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIndex,
          selectedAnswer: answer,
          timeSpent,
        }),
      });
    } catch {}
  }, [sessionId, questionStartTime]);

  const handleNext = useCallback(async () => {
    if (selectedAnswer === null) {
      toast({ title: "Select an answer", description: "Please select an answer before continuing.", variant: "destructive" });
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentQ]: selectedAnswer }));
    await submitAnswer(currentQ, selectedAnswer);

    if (currentQ === questions.length - 1) {
      setShowConfirmSubmit(true);
      return;
    }

    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    setSelectedAnswer(answers[nextQ] !== undefined ? answers[nextQ] : null);
    setQuestionStartTime(Date.now());
  }, [currentQ, selectedAnswer, questions.length, answers, submitAnswer, toast]);

  const handlePrev = useCallback(() => {
    if (currentQ === 0) return;
    const prevQ = currentQ - 1;
    setCurrentQ(prevQ);
    setSelectedAnswer(answers[prevQ] !== undefined ? answers[prevQ] : null);
    setQuestionStartTime(Date.now());
  }, [currentQ, answers]);

  const handleSubmitTrial = useCallback(async () => {
    if (!sessionId) return;
    setSubmitting(true);

    if (selectedAnswer !== null) {
      setAnswers((prev) => ({ ...prev, [currentQ]: selectedAnswer }));
      await submitAnswer(currentQ, selectedAnswer);
    }

    try {
      const res = await fetch(`/api/trial/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        navigate(`/trial/results/${sessionId}`);
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Error", description: (err as any).error || "Failed to submit trial", variant: "destructive" });
        setSubmitting(false);
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit trial", variant: "destructive" });
      setSubmitting(false);
    }
  }, [sessionId, selectedAnswer, currentQ, submitAnswer, navigate, toast]);

  const toggleFlag = useCallback((index: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleNavigateToQuestion = useCallback((index: number) => {
    setCurrentQ(index);
    setSelectedAnswer(answers[index] !== undefined ? answers[index] : null);
    setQuestionStartTime(Date.now());
  }, [answers]);

  const handleComplete = useCallback(() => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({ ...prev, [currentQ]: selectedAnswer }));
    }
    setShowConfirmSubmit(true);
  }, [selectedAnswer, currentQ]);

  const questionStatuses: AnswerStatus[] = useMemo(() => {
    return Array.from({ length: questions.length }, (_, i) => ({
      answered: answers[i] !== undefined,
      flagged: flagged.has(i),
    }));
  }, [questions.length, answers, flagged]);

  const timerSeconds = timerEnabled ? timeRemaining : elapsedTime;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">{t("pages.trialSession.loadingTrialSession")}</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-2xl font-bold" data-testid="text-expired-title">{t("pages.trialSession.trialExpired")}</h2>
            <p className="text-gray-500">{t("pages.trialSession.thisTrialSessionHasExpired")}</p>
            <Button onClick={() => navigate("/trial")} className="rounded-full px-8" data-testid="button-new-trial">
              Start New Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">{t("pages.trialSession.error")}</h2>
            <p className="text-gray-500">{error}</p>
            <Button onClick={() => navigate("/trial")} className="rounded-full px-8" data-testid="button-back-trial">
              Back to Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-2xl font-bold">{t("pages.trialSession.noQuestionsAvailable")}</h2>
            <p className="text-gray-500">{t("pages.trialSession.couldNotLoadQuestionsFor")}</p>
            <Button onClick={() => navigate("/trial")} className="rounded-full px-8" data-testid="button-retry-trial">
              Back to Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <>
      <ExamConsoleLayout
        question={{ question: question.question, options: question.options }}
        options={question.options}
        selectedAnswer={selectedAnswer !== null ? selectedAnswer : undefined}
        onSelectAnswer={(index) => setSelectedAnswer(index)}
        onNext={handleNext}
        onPrevious={handlePrev}
        onFlag={() => toggleFlag(currentQ)}
        onComplete={handleComplete}
        questionNumber={currentQ + 1}
        totalQuestions={TOTAL_QUESTIONS}
        timerSeconds={timerSeconds}
        flagged={flagged.has(currentQ)}
        questionStatuses={questionStatuses}
        onNavigateToQuestion={handleNavigateToQuestion}
      />

      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowConfirmSubmit(false)}>
          <Card className="border-none shadow-2xl max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-8 space-y-4">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-xl font-bold text-center">{t("pages.trialSession.submitTrial")}</h3>
              <p className="text-sm text-gray-500 text-center">
                You have answered {Object.keys(answers).length + (selectedAnswer !== null && answers[currentQ] === undefined ? 1 : 0)} of {TOTAL_QUESTIONS} questions.
                {Object.keys(answers).length < TOTAL_QUESTIONS && (
                  <span className="block mt-1 text-amber-600 font-medium">
                    Unanswered questions will be marked incorrect.
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-400 text-center">{t("pages.trialSession.onceSubmittedYouCannotChange")}</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmSubmit(false)}
                  data-testid="button-cancel-submit"
                >
                  Continue
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleSubmitTrial}
                  disabled={submitting}
                  data-testid="button-confirm-submit"
                >
                  {submitting ? "Submitting..." : "Submit Trial"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
