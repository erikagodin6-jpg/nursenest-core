import { useState, useEffect, useMemo } from "react";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { buildCourseStructuredData, buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  getExamBlueprintTopic,
  EXAM_BLUEPRINT_PAGES,
  type ExamBlueprintPageData,
  type ExamBlueprintTopicCategory,
} from "@/data/exam-blueprint-seo";
import {
  BookOpen, Lock, Crown, ArrowRight, CheckCircle2, XCircle,
  Target, BarChart3, Clock, ShieldCheck, Brain,
  GraduationCap, Sparkles, TrendingUp, Lightbulb, ChevronDown, ChevronUp,
} from "lucide-react";

const FREE_SAMPLE_LIMIT = 3;

function DifficultyBadge({ level }: { level: string }) {
  const { t } = useI18n();
  const config: Record<string, { color: string; label: string }> = {
    easy: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Easy" },
    moderate: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Moderate" },
    hard: { color: "bg-red-100 text-red-700 border-red-200", label: "Hard" },
  };
  const c = config[level] || config.moderate;
  return <Badge className={`${c.color} border text-xs font-medium`} data-testid={`badge-difficulty-${level}`}>{c.label}</Badge>;
}

function DifficultyBar({ easy, moderate, hard }: { easy: number; moderate: number; hard: number }) {
  const total = easy + moderate + hard || 1;
  return (
    <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100" data-testid="bar-difficulty">
      <div className="bg-emerald-400 transition-all" style={{ width: `${(easy / total) * 100}%` }} />
      <div className="bg-amber-400 transition-all" style={{ width: `${(moderate / total) * 100}%` }} />
      <div className="bg-red-400 transition-all" style={{ width: `${(hard / total) * 100}%` }} />
    </div>
  );
}

function SampleQuestion({
  q,
  index,
  isLocked,
  selectedAnswer,
  revealed,
  onSelect,
  onReveal,
}: {
  q: { question: string; options: string[]; correct: number; rationale: string };
  index: number;
  isLocked: boolean;
  selectedAnswer: number | null;
  revealed: boolean;
  onSelect: (idx: number) => void;
  onReveal: () => void;
}) {
  if (isLocked) {
    return (
      <div className="relative p-5 rounded-2xl border border-gray-200 bg-gray-50/50" data-testid={`card-locked-question-${index}`}>
        <div className="absolute inset-0 backdrop-blur-sm bg-white/60 rounded-2xl z-10 flex flex-col items-center justify-center gap-3">
          <Lock className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">{t("pages.examBlueprintPage.premiumQuestion")}</p>
          <LocaleLink href="/pricing">
            <Button size="sm" className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white" data-testid={`button-unlock-question-${index}`}>
              <Crown className="h-3.5 w-3.5" /> Unlock Full Test Bank
            </Button>
          </LocaleLink>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 select-none">{q.question}</p>
        <div className="mt-3 space-y-2">
          {q.options.map((_, oi) => (
            <div key={oi} className="h-8 bg-gray-200/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white" data-testid={`card-sample-question-${index}`}>
      <p className="text-sm font-medium text-gray-900 mb-4 leading-relaxed" data-testid={`text-question-${index}`}>
        <span className="text-primary font-bold mr-2">Q{index + 1}.</span>
        {q.question}
      </p>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, oi) => {
          let optClass = "border-gray-200 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
          if (revealed) {
            if (oi === q.correct) optClass = "border-emerald-300 bg-emerald-50 text-emerald-800";
            else if (oi === selectedAnswer) optClass = "border-red-300 bg-red-50 text-red-700";
            else optClass = "border-gray-200 text-gray-500";
          } else if (oi === selectedAnswer) {
            optClass = "border-primary bg-primary/5 text-primary";
          }
          return (
            <button
              key={oi}
              className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${optClass}`}
              onClick={() => !revealed && onSelect(oi)}
              disabled={revealed}
              data-testid={`button-option-${index}-${oi}`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
              {opt}
              {revealed && oi === q.correct && <CheckCircle2 className="inline h-4 w-4 ml-2 text-emerald-600" />}
              {revealed && oi === selectedAnswer && oi !== q.correct && <XCircle className="inline h-4 w-4 ml-2 text-red-500" />}
            </button>
          );
        })}
      </div>
      {!revealed && selectedAnswer !== null && (
        <Button size="sm" onClick={onReveal} className="rounded-xl bg-primary hover:bg-primary/90 text-white" data-testid={`button-check-answer-${index}`}>
          Check Answer
        </Button>
      )}
      {revealed && (
        <div className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-100" data-testid={`text-rationale-${index}`}>
          <p className="text-sm text-blue-900 leading-relaxed">
            <Lightbulb className="inline h-4 w-4 mr-1 text-blue-600" />
            <strong>{t("pages.examBlueprintPage.rationale")}</strong> {q.rationale}
          </p>
        </div>
      )}
    </div>
  );
}

function TopicGrid({ page, liveStats }: { page: ExamBlueprintPageData; liveStats: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-4" data-testid="grid-topic-categories">
      {page.topicCategories.map((topic) => {
        const matchingCategories = liveStats?.categories?.filter(
          (c: any) => topic.dbCategories?.some((db: string) => c.category?.toLowerCase() === db.toLowerCase())
        ) || [];
        const questionCount = matchingCategories.length > 0
          ? matchingCategories.reduce((sum: number, c: any) => sum + c.count, 0)
          : topic.questionCount || 0;
        const diff = matchingCategories.length > 0
          ? {
              easy: matchingCategories.reduce((s: number, c: any) => s + c.easyCount, 0),
              moderate: matchingCategories.reduce((s: number, c: any) => s + c.moderateCount, 0),
              hard: matchingCategories.reduce((s: number, c: any) => s + c.hardCount, 0),
            }
          : topic.difficulty;

        return (
          <LocaleLink
            key={topic.slug}
            href={`/${page.urlPrefix}/${topic.slug}`}
          >
            <Card className="h-full border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group" data-testid={`card-topic-${topic.slug}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {topic.name}
                  </CardTitle>
                  <Badge className="bg-primary/10 text-primary border-0 shrink-0" data-testid={`badge-count-${topic.slug}`}>
                    {questionCount > 0 ? `${questionCount} Qs` : "Available"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{topic.description}</p>
                <DifficultyBar easy={diff.easy} moderate={diff.moderate} hard={diff.hard} />
                <div className="flex gap-2 mt-2">
                  <DifficultyBadge level="easy" />
                  <DifficultyBadge level="moderate" />
                  <DifficultyBadge level="hard" />
                </div>
              </CardContent>
            </Card>
          </LocaleLink>
        );
      })}
    </div>
  );
}

function ExamStrategySection({ tips }: { tips: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleTips = expanded ? tips : tips.slice(0, 3);
  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/30" data-testid="card-exam-strategy">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" /> Exam Strategy Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {visibleTips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700" data-testid={`text-strategy-tip-${i}`}>
              <Target className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        {tips.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            data-testid="button-toggle-tips"
          >
            {expanded ? <><ChevronUp className="h-4 w-4" /> {t("pages.examBlueprintPage.showLess")}</> : <><ChevronDown className="h-4 w-4" /> {t("pages.examBlueprintPage.showAllTips")}</>}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

function PerformanceTracker({ answered, correct }: { answered: number; correct: number }) {
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  return (
    <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/30" data-testid="card-performance-tracker">
      <CardContent className="pt-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">{t("pages.examBlueprintPage.yourProgress")}</span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">{answered} answered</span>
            <span className="text-emerald-600 font-medium">{accuracy}% accuracy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UnlockCTA({ examName }: { examName: string }) {
  return (
    <div className="py-8 px-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-blue-50 border border-primary/15 text-center space-y-4" data-testid="cta-unlock-test-bank">
      <h3 className="text-xl font-bold text-gray-900">Unlock the Full {examName} Test Bank</h3>
      <p className="text-sm text-gray-600 max-w-lg mx-auto">
        Get unlimited access to all practice questions, detailed rationales, performance tracking, and adaptive mock exams. Join thousands of students who passed their exam with confidence.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <LocaleLink href="/pricing">
          <Button className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white px-8 shadow-sm" data-testid="button-unlock-full-bank">
            <Crown className="w-4 h-4" /> Unlock Full Test Bank <ArrowRight className="w-4 h-4" />
          </Button>
        </LocaleLink>
        <LocaleLink href="/start-free">
          <Button variant="outline" className="rounded-xl gap-2 border-primary/20 text-primary" data-testid="button-start-free">
            <Sparkles className="w-4 h-4" /> Start Free
          </Button>
        </LocaleLink>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> {t("pages.examBlueprintPage.clinicallyReviewed")}</span>
        <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {t("pages.examBlueprintPage.nclexaligned")}</span>
        <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> {t("pages.examBlueprintPage.performanceTracking")}</span>
      </div>
    </div>
  );
}

export default function ExamBlueprintPage() {
  const [, paramsIndex] = useRoute("/:examPrefix/:topicSlug");
  const examPrefix = paramsIndex?.examPrefix || "";
  const topicSlug = paramsIndex?.topicSlug || "";

  const match = useMemo(() => getExamBlueprintTopic(examPrefix, topicSlug), [examPrefix, topicSlug]);
  const { user, effectiveTier } = useAuth();

  const [liveStats, setLiveStats] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [performance, setPerformance] = useState({ answered: 0, correct: 0 });

  useEffect(() => {
    if (!match) return;
    fetch(`/api/exam-blueprint/stats/${match.page.tier}`)
      .then(r => r.json())
      .then(setLiveStats)
      .catch(() => {});
  }, [match?.page.tier]);

  if (!match) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-warmwhite flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-not-found">{t("pages.examBlueprintPage.pageNotFound")}</h1>
            <p className="text-gray-500 mb-4">{t("pages.examBlueprintPage.thisExamBlueprintPageCould")}</p>
            <LocaleLink href="/">
              <Button className="rounded-xl" data-testid="button-go-home">{t("pages.examBlueprintPage.returnHome")}</Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { page, topic } = match;
  const isPaid = user && effectiveTier && effectiveTier !== "free";
  const sampleQuestions = topic.sampleQuestions;
  const matchingCategories = liveStats?.categories?.filter(
    (c: any) => topic.dbCategories?.some((db: string) => c.category?.toLowerCase() === db.toLowerCase())
  ) || [];
  const questionCount = matchingCategories.length > 0
    ? matchingCategories.reduce((sum: number, c: any) => sum + c.count, 0)
    : topic.questionCount || sampleQuestions.length;
  const totalQuestions = liveStats?.totalQuestions || page.totalQuestions || 0;
  const difficulty = matchingCategories.length > 0
    ? {
        easy: matchingCategories.reduce((s: number, c: any) => s + c.easyCount, 0),
        moderate: matchingCategories.reduce((s: number, c: any) => s + c.moderateCount, 0),
        hard: matchingCategories.reduce((s: number, c: any) => s + c.hardCount, 0),
      }
    : topic.difficulty;

  const pageTitle = `${page.examShortName} ${topic.name} Questions — Free Practice with Rationales`;
  const pageDescription = `Practice ${page.examName} ${topic.name.toLowerCase()} questions with detailed rationales. ${questionCount > 0 ? `${questionCount} questions available` : "Expert-written questions"} covering ${topic.description.toLowerCase().slice(0, 100)}`;
  const canonicalPath = `/${page.urlPrefix}/${topic.slug}`;

  const courseStructuredData = buildCourseStructuredData({
    name: `${page.examName} ${topic.name} Practice Questions`,
    description: pageDescription,
    url: `https://www.nursenest.ca${canonicalPath}`,
    provider: "NurseNest",
  });

  const faqStructuredData = buildFaqStructuredData(page.faq);

  const handleSelect = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleReveal = (qIndex: number) => {
    setRevealed(prev => ({ ...prev, [qIndex]: true }));
    const isCorrect = answers[qIndex] === sampleQuestions[qIndex].correct;
    setPerformance(prev => ({
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${page.examShortName}, ${topic.name}, practice questions, exam prep, nursing, rationales`}
        canonicalPath={canonicalPath}
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData]}
      />
      <MedicalReviewJsonLd />
      <Navigation />
      <main className="min-h-screen bg-warmwhite">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: page.examName, href: `/${page.urlPrefix}/${page.topicCategories[0]?.slug || ""}` },
              { label: topic.name },
            ]}
          />

          <header className="mb-8 animate-fade-in-up">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-0" data-testid="badge-exam-type">{page.examShortName}</Badge>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200" data-testid="badge-topic-name">{topic.name}</Badge>
              {questionCount > 0 && (
                <Badge className="bg-gray-100 text-gray-600 border-0" data-testid="badge-question-count">{questionCount} Questions</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
              {page.examShortName} {topic.name} Questions
            </h1>
            <p className="text-gray-600 leading-relaxed" data-testid="text-page-description">
              {topic.description}
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-sm bg-white" data-testid="card-stat-questions">
              <CardContent className="pt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("pages.examBlueprintPage.questions")}</p>
                  <p className="text-lg font-bold text-gray-900">{questionCount > 0 ? questionCount : "Available"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white" data-testid="card-stat-passing">
              <CardContent className="pt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("pages.examBlueprintPage.passing")}</p>
                  <p className="text-sm font-semibold text-gray-900">{page.passingInfo}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white" data-testid="card-stat-time">
              <CardContent className="pt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("pages.examBlueprintPage.timeLimit")}</p>
                  <p className="text-sm font-semibold text-gray-900">{page.timeLimit}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2" data-testid="text-difficulty-heading">
              <BarChart3 className="h-5 w-5 text-primary" /> Difficulty Breakdown
            </h2>
            <DifficultyBar easy={difficulty.easy} moderate={difficulty.moderate} hard={difficulty.hard} />
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Easy ({difficulty.easy}%)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Moderate ({difficulty.moderate}%)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Hard ({difficulty.hard}%)</span>
            </div>
          </div>

          {user && performance.answered > 0 && (
            <div className="mb-6">
              <PerformanceTracker answered={performance.answered} correct={performance.correct} />
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="text-sample-heading">
              <Sparkles className="h-5 w-5 text-primary" /> Sample Questions
            </h2>
            <div className="space-y-4">
              {sampleQuestions.map((q, i) => {
                const isLocked = !isPaid && i >= FREE_SAMPLE_LIMIT;
                return (
                  <SampleQuestion
                    key={i}
                    q={q}
                    index={i}
                    isLocked={isLocked}
                    selectedAnswer={answers[i] ?? null}
                    revealed={revealed[i] || false}
                    onSelect={(idx) => handleSelect(i, idx)}
                    onReveal={() => handleReveal(i)}
                  />
                );
              })}
            </div>
          </section>

          {!isPaid && <UnlockCTA examName={page.examName} />}

          <div className="my-8">
            <ExamStrategySection tips={page.strategyTips} />
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="text-more-topics-heading">
              <BookOpen className="h-5 w-5 text-primary" /> More {page.examShortName} Topics
            </h2>
            <TopicGrid page={page} liveStats={liveStats} />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-faq-heading">{t("pages.examBlueprintPage.frequentlyAskedQuestions")}</h2>
            <div className="space-y-4">
              {page.faq.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-gray-200 bg-white" data-testid={`faq-item-${i}`}>
                  <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 list-none flex items-center justify-between">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <MedicalReviewBadge className="mb-8" />

          {!isPaid && (
            <div className="mb-8">
              <UnlockCTA examName={page.examName} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export function ExamBlueprintIndex() {
  const [, paramsIndex] = useRoute("/:examPrefix/:topicSlug");
  const examPrefix = paramsIndex?.examPrefix || "";
  
  const page = EXAM_BLUEPRINT_PAGES.find(p => p.urlPrefix === examPrefix);
  if (!page) return <ExamBlueprintPage />;

  const firstTopic = page.topicCategories[0];
  if (firstTopic) {
    return <ExamBlueprintPage />;
  }
  return <ExamBlueprintPage />;
}
