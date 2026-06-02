import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { ConfidenceRatingModal } from "@/components/study-momentum";
import { useI18n } from "@/lib/i18n";
import {
  Clock, CheckCircle2, XCircle, ArrowRight, BookOpen,
  Target, Trophy, RotateCcw, Zap, Timer,
} from "lucide-react";

type QuickQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  rationale: string;
  bodySystem: string;
  topic: string;
  difficulty: string;
};

export default function QuickStudy() {
  const { t } = useI18n();
  const { user, effectiveTier } = useAuth();
  const [, navigate] = useLocation();
  const [questions, setQuestions] = useState<QuickQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [confidenceRated, setConfidenceRated] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [sessionStarted, setSessionStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    const tier = effectiveTier === "admin" ? "rpn" : (effectiveTier || "rpn");
    fetch(`/api/quick-study/${user.id}?tier=${tier}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, effectiveTier]);

  useEffect(() => {
    if (!sessionStarted || completed) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCompleted(true);
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sessionStarted, completed]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, []);

  const handleStart = () => {
    setSessionStarted(true);
  };

  const current = questions[currentIndex];

  const handleAnswer = (optionIndex: number) => {
    if (showRationale || !current) return;
    setSelectedAnswer(optionIndex);
    setShowRationale(true);
    setAnswered((a) => a + 1);
    if (optionIndex === current.correct) {
      setScore((s) => s + 1);
    }
    setShowConfidence(true);
    setConfidenceRated(false);
  };

  const handleConfidenceClose = () => {
    setShowConfidence(false);
    setConfidenceRated(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
      setShowConfidence(false);
      setConfidenceRated(false);
    } else {
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setShowConfidence(false);
    setConfidenceRated(false);
    setScore(0);
    setAnswered(0);
    setCompleted(false);
    setTimeRemaining(600);
    setSessionStarted(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("pages.quickStudy.quickStudySession")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.quickStudy.signInToStartA")}</p>
          <Button onClick={() => navigate("/login")} data-testid="button-login-prompt">{t("pages.quickStudy.signIn")}</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const timeUsed = 600 - timeRemaining;
  const progressPct = questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={t("pages.quickStudy.quickStudySession10Minute")}
        description={t("pages.quickStudy.completeAFocused10minuteStudy")}
        keywords="quick study, nursing practice, 10 minute study, NCLEX prep"
        canonicalPath="/quick-study"
      />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {!sessionStarted ? (
          <div className="flex flex-col items-center justify-center py-16" data-testid="section-quick-study-start">
            <div className="bg-gradient-to-br from-[#BFA6F6]/10 to-[#AEE3E1]/10 rounded-3xl p-10 text-center max-w-md w-full">
              <div className="w-20 h-20 rounded-full bg-[#BFA6F6]/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-[#BFA6F6]" />
              </div>
              <h1 className="text-2xl font-bold text-[#2E3A59] mb-3" data-testid="text-quick-study-title">{t("pages.quickStudy.quickStudy")}</h1>
              <p className="text-gray-600 mb-2">{t("pages.quickStudy.10minuteFocusedPracticeSession")}</p>
              <p className="text-sm text-gray-500 mb-8">
                {questions.length > 0
                  ? `${questions.length} questions from your study areas`
                  : loading ? "Loading questions..." : "No questions available"
                }
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#BFA6F6]">10</div>
                  <div className="text-xs text-gray-500">{t("pages.quickStudy.minutes")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#AEE3E1]">{questions.length}</div>
                  <div className="text-xs text-gray-500">{t("pages.quickStudy.questions")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">
                    <Target className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-xs text-gray-500">{t("pages.quickStudy.focused")}</div>
                </div>
              </div>
              <Button
                onClick={handleStart}
                disabled={loading || questions.length === 0}
                className="w-full h-12 bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white rounded-xl text-base font-semibold"
                data-testid="button-start-quick-study"
              >
                <Timer className="w-5 h-5 mr-2" />
                Start Session
              </Button>
            </div>
          </div>
        ) : completed ? (
          <div className="py-12" data-testid="section-quick-study-results">
            <Card className="border border-gray-100 shadow-lg max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#BFA6F6]/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-[#BFA6F6]" />
                </div>
                <h2 className="text-xl font-bold text-[#2E3A59] mb-2" data-testid="text-session-complete">{t("pages.quickStudy.sessionComplete")}</h2>
                <p className="text-sm text-gray-500 mb-6">{t("pages.quickStudy.greatJobCompletingYourQuick")}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-emerald-600" data-testid="text-score">{score}/{answered}</div>
                    <div className="text-xs text-emerald-700">{t("pages.quickStudy.correct")}</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-blue-600" data-testid="text-accuracy">
                      {answered > 0 ? Math.round((score / answered) * 100) : 0}%
                    </div>
                    <div className="text-xs text-blue-700">{t("pages.quickStudy.accuracy")}</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-purple-600" data-testid="text-time-used">
                      {formatTime(timeUsed)}
                    </div>
                    <div className="text-xs text-purple-700">{t("pages.quickStudy.timeUsed")}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="flex-1 h-11 rounded-xl"
                    data-testid="button-restart-session"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> New Session
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 h-11 bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white rounded-xl"
                    data-testid="button-back-dashboard"
                  >
                    Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : current ? (
          <div data-testid="section-quick-study-active">
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-[#BFA6F6] text-[#BFA6F6]" data-testid="badge-question-number">
                  {currentIndex + 1} / {questions.length}
                </Badge>
                {current.bodySystem && (
                  <Badge variant="outline" className="border-gray-200 text-gray-600 text-xs" data-testid="badge-body-system">
                    {current.bodySystem}
                  </Badge>
                )}
              </div>
              <div className={`flex items-center gap-1.5 font-mono text-sm font-semibold ${timeRemaining <= 60 ? "text-red-500" : timeRemaining <= 180 ? "text-amber-500" : "text-gray-700"}`} data-testid="text-timer">
                <Clock className="w-4 h-4" />
                {formatTime(timeRemaining)}
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-[#BFA6F6] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <Card className="border border-gray-100 shadow-lg mb-6">
              <CardContent className="p-6">
                <p className="text-base leading-relaxed text-[#2E3A59] mb-6 font-medium" data-testid="text-question">
                  {current.question}
                </p>

                <div className="space-y-3 mb-6">
                  {current.options.map((option, i) => {
                    let borderColor = "border-gray-200 hover:border-[#BFA6F6]/50";
                    let bgColor = "bg-white hover:bg-[#BFA6F6]/5";
                    let icon = null;

                    if (showRationale) {
                      if (i === current.correct) {
                        borderColor = "border-emerald-400";
                        bgColor = "bg-emerald-50";
                        icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
                      } else if (i === selectedAnswer && i !== current.correct) {
                        borderColor = "border-red-400";
                        bgColor = "bg-red-50";
                        icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                      } else {
                        borderColor = "border-gray-100";
                        bgColor = "bg-gray-50";
                      }
                    } else if (selectedAnswer === i) {
                      borderColor = "border-[#BFA6F6]";
                      bgColor = "bg-[#BFA6F6]/5";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={showRationale}
                        className={`w-full text-left p-4 rounded-xl border-2 ${borderColor} ${bgColor} transition-all duration-200 flex items-start gap-3`}
                        data-testid={`button-option-${i}`}
                      >
                        <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 text-sm leading-relaxed">{option}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>

                {showRationale && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6" data-testid="section-rationale">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Rationale
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">{current.rationale}</p>
                  </div>
                )}

                {showConfidence && selectedAnswer !== null && (
                  <ConfidenceRatingModal
                    questionId={current.id}
                    wasCorrect={selectedAnswer === current.correct}
                    topic={current.topic}
                    bodySystem={current.bodySystem}
                    onClose={handleConfidenceClose}
                  />
                )}

                {showRationale && confidenceRated && (
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white rounded-xl"
                    data-testid="button-next-question"
                  >
                    {currentIndex < questions.length - 1 ? "Next Question" : "Finish Session"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("pages.quickStudy.noQuestionsAvailableForThis")}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
