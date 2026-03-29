import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { getQuizEmbedForLesson } from "@/data/lesson-quiz-embeds";
import type { EmbedQuestion } from "@/data/lesson-quiz-embeds";
import { CheckCircle2, XCircle, Lock, ArrowRight, Sparkles } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface LessonQuizEmbedProps {
  lessonSlug: string;
}

function QuestionCard({
  q,
  index,
  isLoggedIn,
  selectedAnswer,
  onAnswer,
}: {
  q: EmbedQuestion;
  index: number;
  isLoggedIn: boolean;
  selectedAnswer: number | null;
  onAnswer: (qIndex: number, aIndex: number) => void;
}) {
  const isLocked = !isLoggedIn && index >= 2;
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === q.correct;
  const isRationaleGated = !isLoggedIn && index >= 2;

  if (isLocked) {
    return (
      <div className="relative" data-testid={`quiz-embed-q-${index}`}>
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 select-none" style={{ filter: "blur(4px)", pointerEvents: "none" }}>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {index + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <div key={oi} className="p-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-600">
                {opt}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="text-center p-4">
            <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">{t("components.lessonQuizEmbed.signInToUnlock")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200" data-testid={`quiz-embed-q-${index}`}>
      <p className="text-sm font-medium text-gray-800 mb-3">
        <span className="text-primary font-bold mr-1">{index + 1}.</span>
        {q.question}
      </p>
      <div className="space-y-2">
        {q.options.map((opt, oi) => {
          let optClass = "p-2.5 rounded-lg border text-sm cursor-pointer transition-all ";
          if (!isAnswered) {
            optClass += "bg-white border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-gray-700";
          } else if (oi === q.correct) {
            optClass += "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium";
          } else if (oi === selectedAnswer && oi !== q.correct) {
            optClass += "bg-red-50 border-red-300 text-red-700";
          } else {
            optClass += "bg-white border-gray-200 text-gray-500";
          }

          return (
            <button
              key={oi}
              onClick={() => !isAnswered && onAnswer(index, oi)}
              disabled={isAnswered}
              className={`${optClass} w-full text-left flex items-center gap-2`}
              data-testid={`quiz-embed-q${index}-opt${oi}`}
            >
              {isAnswered && oi === q.correct && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              {isAnswered && oi === selectedAnswer && oi !== q.correct && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        isRationaleGated ? (
          <div className="mt-3 relative" data-testid={`quiz-embed-rationale-${index}`}>
            <div className="p-3 rounded-lg text-sm bg-gray-50 border border-gray-200 text-gray-400 select-none" style={{ filter: "blur(4px)", pointerEvents: "none" }}>
              <span className="font-semibold">{isCorrect ? "Correct!" : "Incorrect."}</span>{" "}
              {q.rationale}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="text-center px-4">
                <Lock className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                <p className="text-sm text-gray-600 font-medium mb-2" data-testid={`text-rationale-gate-${index}`}>{t("components.lessonQuizEmbed.createAFreeAccountTo")}</p>
                <LocaleLink href="/start-free">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" data-testid={`btn-rationale-signup-${index}`}>
                    Start Free <ArrowRight className="w-3 h-3" />
                  </Button>
                </LocaleLink>
              </div>
            </div>
          </div>
        ) : (
          <div className={`mt-3 p-3 rounded-lg text-sm ${isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`} data-testid={`quiz-embed-rationale-${index}`}>
            <span className="font-semibold">{isCorrect ? "Correct!" : "Incorrect."}</span>{" "}
            {q.rationale}
          </div>
        )
      )}
    </div>
  );
}

function getProgressHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      headers["x-username"] = username;
      headers["x-password"] = password;
    }
  } catch {}
  return headers;
}

export function LessonQuizEmbed({ lessonSlug }: LessonQuizEmbedProps) {
  const { t } = useI18n();
  const questions = getQuizEmbedForLesson(lessonSlug);
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showCta, setShowCta] = useState(false);
  const [persisted, setPersisted] = useState(false);
  const [persistError, setPersistError] = useState(false);
  const [restoredFromServer, setRestoredFromServer] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user?.id || !questions || questions.length === 0 || restoredFromServer) return;
    fetch(`/api/progress/${user.id}`, { headers: getProgressHeaders() })
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => {
        const existing = data.find((p: any) => p.lessonId === lessonSlug && (p.completed === "true" || p.completed === true));
        if (existing) {
          setPersisted(true);
        }
      })
      .catch(() => {})
      .finally(() => setRestoredFromServer(true));
  }, [isLoggedIn, user?.id, lessonSlug, restoredFromServer]);

  const handleAnswer = useCallback((qIndex: number, aIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: aIndex }));
    if (!isLoggedIn && qIndex === 1) {
      setShowCta(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id || !questions || persisted) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) return;
    const correctCount = Object.values(answers).filter((a, i) => {
      const q = questions[i];
      return q && a === q.correct;
    }).length;
    setPersistError(false);
    fetch("/api/progress", {
      method: "POST",
      headers: getProgressHeaders(),
      body: JSON.stringify({
        userId: user.id,
        lessonId: lessonSlug,
        completed: "true",
        postTestScore: Math.round((correctCount / questions.length) * 100),
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to save progress");
        setPersisted(true);
      })
      .catch(() => setPersistError(true));
  }, [answers, questions, isLoggedIn, user?.id, lessonSlug, persisted]);

  if (!questions || questions.length === 0) return null;

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a, i) => {
    const q = questions[i];
    return q && a === q.correct;
  }).length;

  return (
    <div className="mt-10" data-testid="section-quiz-embed">
      <Card className="border-primary/20 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-blue-50 px-6 py-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900" data-testid="quiz-embed-title">{t("components.lessonQuizEmbed.testYourself5NclexlevelQuestions")}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{t("components.lessonQuizEmbed.applyWhatYouJustLearned")}</p>
            </div>
            {answeredCount > 0 && (
              <Badge variant="secondary" className="ml-auto" data-testid="quiz-embed-score">
                {correctCount}/{answeredCount} correct
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          {questions.map((q, i) => (
            <QuestionCard
              key={i}
              q={q}
              index={i}
              isLoggedIn={isLoggedIn}
              selectedAnswer={answers[i] ?? null}
              onAnswer={handleAnswer}
            />
          ))}

          {showCta && !isLoggedIn && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/15 text-center" data-testid="quiz-embed-cta">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Create a free account to unlock full rationales and 10 more questions.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                300 free flashcards included with every account.
              </p>
              <LocaleLink href="/start-free">
                <Button size="sm" className="gap-2" data-testid="btn-quiz-embed-signup">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
            </div>
          )}

          {isLoggedIn && answeredCount === questions.length && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between" data-testid="quiz-embed-complete">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  You scored {correctCount}/{questions.length}
                  {persisted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline ml-1.5" />}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {persisted ? "Progress saved" : persistError ? "Could not save progress — please try again later" : "Keep practicing to strengthen weak areas"}
                </p>
              </div>
              <LocaleLink href="/free-practice">
                <Button variant="outline" size="sm" className="gap-2" data-testid="btn-quiz-embed-more">
                  More Questions <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
