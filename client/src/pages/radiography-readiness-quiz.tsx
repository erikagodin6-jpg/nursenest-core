import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ChevronRight, ArrowLeft, Mail, Target, BookOpen, Award, Share2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface QuizQuestion {
  question: string;
  options: string[];
  category: string;
}

interface QuizResult {
  score: number;
  correct: number;
  total: number;
  breakdown: Record<string, { correct: number; total: number }>;
  recommendations: { category: string; score: number; level: string; suggestion: string }[];
}

export default function RadiographyReadinessQuiz() {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const [stage, setStage] = useState<"intro" | "quiz" | "email" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { data: questions = [] } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/imaging/quiz-questions"],
    queryFn: async () => {
      const res = await fetch("/api/imaging/quiz-questions");
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { answers: (number | null)[]; email?: string; name?: string }) => {
      const res = await apiRequest("POST", "/api/imaging/quiz-submit", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setStage("results");
    },
  });

  const emailCaptureMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/imaging/leads", {
        email,
        name,
        source: "readiness_quiz",
        trigger: "quiz_result",
        quizScore: result?.score,
      });
    },
  });

  const handleAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStage("email");
      submitMutation.mutate({ answers: newAnswers });
    }
  };

  const handleEmailSubmit = () => {
    if (email) {
      emailCaptureMutation.mutate();
      submitMutation.mutate({ answers, email, name });
    }
    setStage("results");
  };

  const handleShare = () => {
    const text = `I scored ${result?.score}% on the Radiography Readiness Quiz! Test your knowledge:`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Radiography Readiness Quiz", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
    }
  };

  const levelColors: Record<string, string> = {
    "needs-improvement": "text-red-600 bg-red-50 border-red-200",
    developing: "text-amber-600 bg-amber-50 border-amber-200",
    proficient: "text-green-600 bg-green-50 border-green-200",
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
              <Target className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-quiz-title">{t("pages.radiographyReadinessQuiz.radiographyReadinessQuiz")}</h1>
            <p className="text-gray-600 max-w-md mx-auto">{t("pages.radiographyReadinessQuiz.findOutHowPreparedYou")}</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">{t("pages.radiographyReadinessQuiz.whatThisQuizCovers")}</h3>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, label: "Basic Radiography Knowledge", desc: "Fundamental concepts, radiation safety, and image production" },
                  { icon: Target, label: "Positioning Familiarity", desc: "Patient positioning, central ray alignment, and anatomy identification" },
                  { icon: Award, label: "Artifact Recognition", desc: "Identifying and troubleshooting common image artifacts" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <item.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                <span>{questions.length || 15} questions</span>
                <span>{t("pages.radiographyReadinessQuiz.5Minutes")}</span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button size="lg" onClick={() => { setStage("quiz"); setCurrentQ(0); setAnswers([]); }} disabled={questions.length === 0} data-testid="button-start-quiz">
              Start Quiz <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "quiz" && questions.length > 0) {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setSelectedOption(answers[currentQ - 1] ?? null); } else setStage("intro"); }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" data-testid="button-quiz-back">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-sm text-gray-500" data-testid="text-question-counter">{currentQ + 1} of {questions.length}</span>
          </div>

          <Progress value={progress} className="mb-6 h-2" />

          <Card>
            <CardHeader>
              <div className="text-xs font-medium text-indigo-600 mb-1">{q.category}</div>
              <CardTitle className="text-lg" data-testid="text-question">{q.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedOption === idx
                        ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    data-testid={`option-${idx}`}
                  >
                    <span className="text-sm">{opt}</span>
                  </button>
                ))}
              </div>
              <Button
                className="w-full mt-6"
                disabled={selectedOption === null}
                onClick={handleNext}
                data-testid="button-next-question"
              >
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === "email") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2" data-testid="text-email-capture-title">{t("pages.radiographyReadinessQuiz.getYourDetailedResults")}</h2>
              <p className="text-gray-600 text-sm mb-6">{t("pages.radiographyReadinessQuiz.enterYourEmailToReceive")}</p>
              <div className="space-y-3">
                <Input placeholder={t("pages.radiographyReadinessQuiz.yourName")} value={name} onChange={(e) => setName(e.target.value)} data-testid="input-quiz-name" />
                <Input type="email" placeholder={t("pages.radiographyReadinessQuiz.youremailcom")} value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-quiz-email" />
                <Button className="w-full" onClick={handleEmailSubmit} disabled={emailCaptureMutation.isPending} data-testid="button-submit-email">
                  {emailCaptureMutation.isPending ? "Processing..." : "Get My Results"}
                </Button>
                <button onClick={() => setStage("results")} className="text-sm text-gray-500 hover:text-gray-700" data-testid="button-skip-email">
                  Skip for now
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === "results" && result) {
    const scoreColor = result.score >= 80 ? "text-green-600" : result.score >= 60 ? "text-amber-600" : "text-red-600";
    const scoreBg = result.score >= 80 ? "bg-green-50" : result.score >= 60 ? "bg-amber-50" : "bg-red-50";

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className={`text-center ${scoreBg} rounded-2xl p-8 mb-8`}>
            <h2 className="text-lg font-medium text-gray-600 mb-2">{t("pages.radiographyReadinessQuiz.yourReadinessScore")}</h2>
            <div className={`text-6xl font-bold ${scoreColor} mb-2`} data-testid="text-quiz-score">{result.score}%</div>
            <p className="text-gray-600">{result.correct} of {result.total} correct</p>
            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share-results">
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">{t("pages.radiographyReadinessQuiz.scoreBreakdown")}</h3>
          <div className="space-y-3 mb-8">
            {result.recommendations.map((rec, i) => (
              <Card key={i} className={`border ${levelColors[rec.level] || ""}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  {rec.level === "proficient" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  ) : rec.level === "developing" ? (
                    <Target className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{rec.category}</span>
                      <span className="text-sm font-bold">{rec.score}%</span>
                    </div>
                    <p className="text-xs">{rec.suggestion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8 border-indigo-200 bg-indigo-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3">{t("pages.radiographyReadinessQuiz.recommendedNextSteps")}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => navigate("/medical-imaging/study-plan-generator")} className="flex items-center gap-2 p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow text-left" data-testid="link-study-plan">
                  <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{t("pages.radiographyReadinessQuiz.generateStudyPlan")}</div>
                    <div className="text-xs text-gray-500">{t("pages.radiographyReadinessQuiz.getAPersonalizedSchedule")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button onClick={() => navigate("/medical-imaging/canada/flashcards")} className="flex items-center gap-2 p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow text-left" data-testid="link-flashcards">
                  <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{t("pages.radiographyReadinessQuiz.reviewFlashcards")}</div>
                    <div className="text-xs text-gray-500">{t("pages.radiographyReadinessQuiz.quickReviewOfKeyConcepts")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button onClick={() => navigate("/medical-imaging/canada/practice-exams")} className="flex items-center gap-2 p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow text-left" data-testid="link-practice-exams">
                  <Target className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{t("pages.radiographyReadinessQuiz.practiceExams")}</div>
                    <div className="text-xs text-gray-500">{t("pages.radiographyReadinessQuiz.simulateTheRealExam")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button onClick={() => navigate("/medical-imaging/canada/positioning")} className="flex items-center gap-2 p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow text-left" data-testid="link-positioning">
                  <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{t("pages.radiographyReadinessQuiz.positioningGuide")}</div>
                    <div className="text-xs text-gray-500">{t("pages.radiographyReadinessQuiz.masterPatientPositioning")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-x-3">
            <Button variant="outline" onClick={() => { setStage("intro"); setResult(null); setAnswers([]); setCurrentQ(0); }} data-testid="button-retake-quiz">
              Retake Quiz
            </Button>
            <Button onClick={() => navigate("/medical-imaging")} data-testid="button-explore-hub">
              Explore Medical Imaging Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">{t("pages.radiographyReadinessQuiz.loadingQuiz")}</p>
      </div>
    </div>
  );
}
