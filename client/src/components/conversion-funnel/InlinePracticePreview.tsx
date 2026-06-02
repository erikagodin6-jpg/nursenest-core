import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import {
  CheckCircle2,
  XCircle,
  ClipboardList,
  Lock,
  ArrowRight,
  Crown,
} from "lucide-react";

const FREE_LIMIT = 5;

interface InlinePracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  rationale: string;
  bodySystem: string;
}

interface InlinePracticePreviewProps {
  topic?: string;
  bodySystem?: string;
  profession?: string;
  maxQuestions?: number;
}

export function InlinePracticePreview({
  topic,
  bodySystem,
  profession,
  maxQuestions = FREE_LIMIT,
}: InlinePracticePreviewProps) {
  const { user, effectiveTier } = useAuth();
  const [questions, setQuestions] = useState<InlinePracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [gated, setGated] = useState(false);

  const hasPaid =
    user && effectiveTier && effectiveTier !== "free";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ count: String(maxQuestions) });
        if (bodySystem) params.set("bodySystems", bodySystem);
        if (topic) params.set("topic", topic);
        const tier = effectiveTier && effectiveTier !== "free" ? effectiveTier : "rpn";
        params.set("tier", tier);
        const res = await fetch(`/api/qbank/exam-set?${params}`);
        if (res.ok) {
          const data = await res.json();
          const mapped: InlinePracticeQuestion[] = (
            data.questions || []
          )
            .slice(0, maxQuestions)
            .map((q: any) => ({
              id: q.id,
              question: q.stem || q.question,
              options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
              correct: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : (typeof q.correctAnswer === "number" ? q.correctAnswer : 0),
              rationale: q.rationale || "",
              bodySystem: q.bodySystem || q.body_system || bodySystem || "General",
            }));
          setQuestions(mapped);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [topic, bodySystem, effectiveTier, maxQuestions]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse" data-testid="inline-practice-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[currentIdx];
  if (!question) return null;

  if (gated) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50" data-testid="inline-practice-gate">
        <CardContent className="p-6 text-center space-y-4">
          <Lock className="w-10 h-10 text-primary mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">
            You've completed the free preview!
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            You answered {stats.total} practice questions. {user ? "Upgrade to access thousands more across every body system." : "Create a free account to save your progress and continue practicing."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {!user ? (
              <LocaleLink href="/start-free">
                <Button className="rounded-xl gap-2" data-testid="button-practice-signup">
                  Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
            ) : (
              <LocaleLink href="/pricing">
                <Button className="rounded-xl gap-2" data-testid="button-practice-upgrade">
                  <Crown className="w-4 h-4" /> Unlock Full Test Bank
                </Button>
              </LocaleLink>
            )}
            <LocaleLink href="/free-practice">
              <Button variant="outline" className="rounded-xl gap-2" data-testid="button-practice-qbank">
                Go to Practice Questions <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
    setStats((prev) => ({
      correct: prev.correct + (selected === question.correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIdx >= questions.length - 1) {
      if (!hasPaid) {
        setGated(true);
        return;
      }
    }
    setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-4" data-testid="inline-practice-preview">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-gray-900">
            Try Practice Questions
          </h3>
        </div>
        <Badge variant="outline" className="text-xs" data-testid="badge-practice-progress">
          {currentIdx + 1} / {questions.length}
        </Badge>
      </div>

      <Card className="border-gray-200 shadow-sm" data-testid="card-practice-question">
        <CardContent className="p-5">
          <Badge variant="secondary" className="text-xs mb-3">
            {question.bodySystem}
          </Badge>
          <p className="text-base font-medium text-gray-900 mb-4 leading-relaxed" data-testid="text-practice-question">
            {question.question}
          </p>
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isCorrect = revealed && idx === question.correct;
              const isWrong = revealed && idx === selected && idx !== question.correct;
              const isSelected = idx === selected;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={revealed}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : isWrong
                        ? "border-red-400 bg-red-50 text-red-800"
                        : isSelected
                          ? "border-primary bg-primary/5 text-gray-900"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  data-testid={`button-practice-option-${idx}`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                  {isCorrect && <CheckCircle2 className="w-4 h-4 inline ml-2 text-emerald-600" />}
                  {isWrong && <XCircle className="w-4 h-4 inline ml-2 text-red-500" />}
                </button>
              );
            })}
          </div>

          {revealed && question.rationale && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100" data-testid="text-practice-rationale">
              <p className="text-sm text-gray-700 leading-relaxed">{question.rationale}</p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {!revealed ? (
              <Button
                onClick={handleCheck}
                disabled={selected === null}
                className="rounded-xl"
                data-testid="button-practice-check"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="rounded-xl gap-1"
                data-testid="button-practice-next"
              >
                {currentIdx >= questions.length - 1 && !hasPaid
                  ? "See Results"
                  : "Next Question"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {stats.total > 0 && (
              <span className="text-sm text-gray-500 self-center ml-auto" data-testid="text-practice-stats">
                {stats.correct}/{stats.total} correct
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
