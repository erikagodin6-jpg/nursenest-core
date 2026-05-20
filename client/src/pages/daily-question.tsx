import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { QuestionComments } from "@/components/question-comments";
import { useAuth } from "@/lib/auth";
import {
  CheckCircle2, XCircle, Mail, CalendarDays, BookOpen,
  Sparkles, ArrowRight, Clock, Brain, ShieldCheck, Loader2,
  ChevronRight
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
interface DailyQuestion {
  date: string;
  tier: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  bodySystem: string | null;
  lessonId: string | null;
}

interface ArchiveEntry {
  date: string;
  tier: string;
  question: string;
  bodySystem: string | null;
}

export default function DailyQuestionPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [existingAnswer, setExistingAnswer] = useState<any>(null);

  useEffect(() => {
    async function loadDaily() {
      try {
        const res = await fetch("/api/qotd/today");
        if (res.ok) {
          const data = await res.json();
          setQuestion(data);
        }
      } catch {}
      try {
        const archiveRes = await fetch("/api/qotd/archive?limit=7");
        if (archiveRes.ok) {
          const data = await archiveRes.json();
          setArchive(data.filter((a: ArchiveEntry) => a.date !== new Date().toISOString().split("T")[0]));
        }
      } catch {}
      try {
        const ansRes = await fetch("/api/qotd/my-answer");
        if (ansRes.ok) {
          const data = await ansRes.json();
          if (data.answer) {
            setExistingAnswer(data.answer);
            setSelectedAnswer(data.answer.selectedIndex);
            setRevealed(true);
          }
        }
      } catch {}
      setLoading(false);
    }
    loadDaily();
  }, []);

  const handleAnswer = (idx: number) => {
    if (revealed || !question) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !question || revealed) return;
    const isCorrect = selectedAnswer === question.correctIndex;
    setRevealed(true);

    if (user) {
      try {
        await fetch("/api/qotd/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedIndex: selectedAnswer }),
        });
      } catch {}
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailStatus("error");
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          frequency: "daily",
          source: "daily_question_page",
          dailyQuestionOptIn: true,
          categories: ["exam_prep"],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed.");
      }
      setEmailStatus("success");
    } catch (err: any) {
      setEmailStatus("error");
      setEmailError(err.message || "Something went wrong. Please try again.");
    }
  };

  const isCorrect = selectedAnswer !== null && question ? selectedAnswer === question.correctIndex : false;
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <SEO
        title={t("pages.dailyQuestion.dailyPracticeQuestionFreeNursing")}
        description={t("pages.dailyQuestion.challengeYourselfWithANew")}
        canonicalPath="/daily-question"
      />
      <MedicalReviewJsonLd
        title={t("pages.dailyQuestion.dailyPracticeQuestion")}
        slug="daily-question"
        description={t("pages.dailyQuestion.dailyNclexstylePracticeQuestionWith")}
        pageUrl="https://www.nursenest.ca/daily-question"
      />
      <Navigation />
      <main className="min-h-screen bg-warmwhite">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-testid="badge-daily-question">
              <CalendarDays className="h-4 w-4" />
              <span>{dateStr}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-daily-question-title">
              Daily Practice Question
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto" data-testid="text-daily-question-subtitle">
              Sharpen your clinical reasoning with a new NCLEX-style question every day. Answer, learn, and build your streak.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !question ? (
            <Card className="border-0 shadow-lg" data-testid="card-no-question">
              <CardContent className="py-12 text-center">
                <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-700 mb-2">{t("pages.dailyQuestion.todaysQuestionIsBeingPrepared")}</h2>
                <p className="text-gray-500">{t("pages.dailyQuestion.checkBackShortlyForTodays")}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-0 shadow-lg bg-white mb-6" data-testid="card-daily-question">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    {question.bodySystem && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0" data-testid="badge-body-system">
                        {question.bodySystem}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs" data-testid="badge-tier">
                      {question.tier?.toUpperCase() || "GENERAL"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed text-gray-900 mt-3" data-testid="text-question-stem">
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {question.options.map((opt, idx) => {
                      let optClasses = "border border-gray-200 hover:border-primary/40 bg-white cursor-pointer";
                      if (selectedAnswer === idx && !revealed) {
                        optClasses = "border-2 border-primary bg-primary/5 cursor-pointer";
                      }
                      if (revealed) {
                        if (idx === question.correctIndex) {
                          optClasses = "border-2 border-emerald-500 bg-emerald-50";
                        } else if (idx === selectedAnswer) {
                          optClasses = "border-2 border-red-400 bg-red-50";
                        } else {
                          optClasses = "border border-gray-200 bg-gray-50 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={revealed}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-start gap-3 ${optClasses}`}
                          data-testid={`button-option-${idx}`}
                        >
                          <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm text-gray-800 leading-relaxed">{opt}</span>
                          {revealed && idx === question.correctIndex && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto shrink-0 mt-0.5" />
                          )}
                          {revealed && idx === selectedAnswer && idx !== question.correctIndex && (
                            <XCircle className="h-5 w-5 text-red-400 ml-auto shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!revealed && selectedAnswer !== null && (
                    <Button
                      onClick={handleSubmitAnswer}
                      className="w-full rounded-xl h-12 text-base bg-primary hover:bg-primary/90 text-white shadow-md"
                      data-testid="button-check-answer"
                    >
                      Check My Answer
                    </Button>
                  )}

                  {revealed && (
                    <div className="mt-6 space-y-4 animate-fade-in-up">
                      <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                        isCorrect
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-amber-50 border-amber-200"
                      }`} data-testid="text-result-banner">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-semibold text-emerald-800">{t("pages.dailyQuestion.correct")}</p>
                              <p className="text-sm text-emerald-700">{t("pages.dailyQuestion.greatClinicalReasoning")}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-6 w-6 text-amber-600 shrink-0" />
                            <div>
                              <p className="font-semibold text-amber-800">{t("pages.dailyQuestion.notQuite")}</p>
                              <p className="text-sm text-amber-700">
                                The correct answer is {String.fromCharCode(65 + question.correctIndex)}.
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <Card className="border border-blue-100 bg-blue-50/30" data-testid="card-rationale">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            Rationale
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="text-rationale">
                            {question.rationale}
                          </p>
                        </CardContent>
                      </Card>

                      {question.lessonId && (
                        <LocaleLink
                          href={`/lessons/${question.lessonId}`}
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
                          data-testid="link-related-lesson"
                        >
                          <BookOpen className="h-4 w-4" />
                          Study the related lesson
                          <ChevronRight className="h-4 w-4" />
                        </LocaleLink>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <QuestionComments questionId={`daily-${question.date}`} />

              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-white to-primary/5 mt-8" data-testid="card-email-capture">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-email-cta-title">
                    Get Tomorrow's Question in Your Inbox
                  </h3>
                  <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">
                    Join thousands of nursing students who practice daily. We'll send you a new practice question every morning so you never miss a day.
                  </p>

                  {emailStatus === "success" ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl max-w-sm mx-auto" data-testid="text-email-success">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-sm font-medium text-emerald-700">
                        You're all set! Check your inbox tomorrow morning.
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder={t("pages.dailyQuestion.enterYourEmailAddress")}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (emailStatus === "error") setEmailStatus("idle");
                            }}
                            className="pl-10 h-12 text-base"
                            data-testid="input-daily-email"
                            disabled={emailStatus === "loading"}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="h-12 px-6 text-base shrink-0"
                          disabled={emailStatus === "loading"}
                          data-testid="button-daily-email-submit"
                        >
                          {emailStatus === "loading" ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <>
                              Subscribe
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                      {emailStatus === "error" && (
                        <p className="text-xs text-red-500" data-testid="text-email-error">
                          {emailError}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400">
                        No spam, ever. Unsubscribe anytime. We respect your privacy.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

              {archive.length > 0 && (
                <Card className="border-0 shadow-md mt-8" data-testid="card-archive">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Recent Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {archive.map((entry) => (
                        <div
                          key={entry.date}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                          data-testid={`archive-entry-${entry.date}`}
                        >
                          <div className="text-xs text-gray-400 shrink-0 pt-0.5 w-20">
                            {new Date(entry.date + "T12:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{entry.question}</p>
                            {entry.bodySystem && (
                              <Badge variant="outline" className="text-[10px] mt-1">{entry.bodySystem}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <MedicalReviewBadge className="mt-8" />

              <div className="mt-8 grid sm:grid-cols-3 gap-4" data-testid="section-trust-elements">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t("pages.dailyQuestion.clinicallyReviewed")}</p>
                    <p className="text-xs text-gray-500">{t("pages.dailyQuestion.everyQuestionReviewedByLicensed")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Brain className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t("pages.dailyQuestion.evidencebased")}</p>
                    <p className="text-xs text-gray-500">{t("pages.dailyQuestion.alignedWithCurrentClinicalGuidelines")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t("pages.dailyQuestion.newEveryDay")}</p>
                    <p className="text-xs text-gray-500">{t("pages.dailyQuestion.freshQuestionsRotatedDailyFrom")}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
