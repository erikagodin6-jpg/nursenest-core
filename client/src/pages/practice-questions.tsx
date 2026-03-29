import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DifferentiatorCTA } from "@/components/competitive-differentiation";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { getExamQuestions, type PooledQuestion } from "@/lib/question-pool";
import {
  ArrowRight, CheckCircle2, XCircle, BookOpen, Target,
  ChevronRight, RotateCcw, Heart, Brain, Wind, Stethoscope,
  Activity, Pill, Baby, Droplets, Shield, Layers,
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";
import { InlineConfidenceRating } from "@/components/study-momentum";
import { AITutorWidget, TutorCTA } from "@/components/ai-tutor-widget";
import { useAuth } from "@/lib/auth";
import { getPracticalNurseExamName, type Region } from "@shared/constants";
import { useRegion } from "@/hooks/use-region";

import { useI18n } from "@/lib/i18n";
function getTierLabels(region: Region): Record<string, string> {

  const pnExam = getPracticalNurseExamName(region);
  return {
    rpn: `RPN / ${pnExam} / LPN`,
    rn: "RN / NCLEX-RN",
    np: "Nurse Practitioner",
    free: "Pre-Nursing Foundations",
  };
}

function getTierSeoLabels(region: Region): Record<string, string> {
  const pnExam = getPracticalNurseExamName(region);
  return {
    rpn: `${pnExam} RPN LPN`,
    rn: "NCLEX-RN RN",
    np: "Nurse Practitioner NP",
    free: "Pre-Nursing",
  };
}

const SYSTEM_ICONS: Record<string, typeof Heart> = {
  Cardiovascular: Heart,
  Respiratory: Wind,
  Neurological: Brain,
  Gastrointestinal: Activity,
  Endocrine: Droplets,
  Renal: Droplets,
  Pharmacology: Pill,
  Hematology: Activity,
  Maternal: Baby,
  Pediatric: Baby,
  Assessment: Stethoscope,
  "Mental Health": Brain,
  Musculoskeletal: Layers,
  Integumentary: Shield,
};

function getSystemIcon(system: string) {
  for (const [key, icon] of Object.entries(SYSTEM_ICONS)) {
    if (system.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return Target;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function deslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function PracticeQuestionsIndex() {
  const { user } = useAuth();
  const region = useRegion();
  const TIER_LABELS = getTierLabels(region);
  const pnExamName = getPracticalNurseExamName(region);
  const [, setLocation] = useLocation();
  const [combos, setCombos] = useState<{ tier: string; system: string; count: number }[]>([]);

  useEffect(() => {
    const fetchCombos = async () => {
      const tiers = ["rpn", "rn", "np"];
      const results: { tier: string; system: string; count: number }[] = [];
      for (const tier of tiers) {
        try {
          const { fetchQBankStats, getAuthHeaders } = await import("@/lib/qbank-api");
          const res = await fetch(`/api/qbank/body-systems?tier=${tier}`, { headers: getAuthHeaders() });
          if (res.ok) {
            const data = await res.json();
            for (const system of data.bodySystems || []) {
              results.push({ tier, system, count: 10 });
            }
          }
        } catch {}
      }
      setCombos(results);
    };
    fetchCombos();
  }, []);

  const groupedByTier: Record<string, { system: string; count: number }[]> = {};
  for (const c of combos) {
    if (!groupedByTier[c.tier]) groupedByTier[c.tier] = [];
    groupedByTier[c.tier].push({ system: c.system, count: c.count });
  }

  const tierOrder = ["rpn", "rn", "np", "free"];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Nursing Practice Questions",
    description: `Browse free practice questions by exam tier and body system. Interactive NCLEX, ${pnExamName}, and NP exam practice with instant rationales.`,
    url: "https://www.nursenest.ca/practice-questions",
    isPartOf: { "@type": "WebSite", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={`Free Nursing Practice Questions by System | NCLEX & ${pnExamName} | NurseNest`}
        description={`Browse hundreds of free nursing practice questions organized by exam tier and body system. Interactive NCLEX-RN, ${pnExamName}, and NP exam questions with detailed rationales.`}
        keywords={`free NCLEX practice questions, free ${pnExamName} questions, nursing practice questions by system, free nursing exam questions`}
        canonicalPath="/practice-questions"
        structuredData={structuredData}
      />
      <Navigation />
      <main className="flex-1 pb-16">
        <section className="bg-gradient-to-b from-primary/5 via-white to-white py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <BreadcrumbNav items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Free Practice Questions", url: "https://www.nursenest.ca/practice-questions" },
            ]} />
            <div className="text-center mb-10">
              <Badge className="bg-primary/10 text-primary mb-3 px-4 py-1.5" data-testid="badge-practice-questions">
                <Target className="w-3 h-3 mr-1.5" /> Free Practice Questions
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-practice-questions-title">
                Free Nursing Practice Questions
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto" data-testid="text-practice-questions-subtitle">
                Choose your exam tier and body system below. Each set includes 5 interactive questions with detailed rationales — no account required.
              </p>
            </div>

            {tierOrder.filter(t => groupedByTier[t]).map((tier) => (
              <div key={tier} className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" data-testid={`text-tier-heading-${tier}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                    tier === "rpn" ? "bg-blue-500" : tier === "rn" ? "bg-green-500" : tier === "np" ? "bg-purple-500" : "bg-gray-500"
                  }`}>
                    {tier.toUpperCase()}
                  </div>
                  {TIER_LABELS[tier] || tier.toUpperCase()}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupedByTier[tier].map(({ system, count }) => {
                    const Icon = getSystemIcon(system);
                    const slug = slugify(system);
                    return (
                      <Card
                        key={slug}
                        className="border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                        onClick={() => setLocation(`/practice-questions/${tier}/${slug}`)}
                        data-testid={`card-practice-${tier}-${slug}`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{system}</h3>
                            <p className="text-xs text-gray-500">{count} questions available</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2" data-testid="text-cta-heading">{t("pages.practiceQuestions.wantThousandsMoreQuestions")}</h2>
              <p className="text-gray-600 mb-4 text-sm max-w-lg mx-auto">
                Access our full question bank with advanced analytics, timed mock exams, and personalized study plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/start-free")} className="bg-primary hover:brightness-110 text-white rounded-xl h-11" data-testid="button-start-free-cta">
                  Start Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button onClick={() => setLocation("/mock-exams")} variant="outline" className="rounded-xl h-11" data-testid="button-mock-exams-cta">
                  Try Mock Exams
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function QuizSession({ tier, systemSlug }: { tier: string; systemSlug: string }) {
  const { user } = useAuth();
  const region = useRegion();
  const TIER_LABELS = getTierLabels(region);
  const [, setLocation] = useLocation();
  const systemName = deslugify(systemSlug);
  const [questions, setQuestions] = useState<PooledQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getExamQuestions(tier, 5, [deslugify(systemSlug)]).then((qs) => {
      setQuestions(qs.length > 0 ? qs : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [tier, systemSlug]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = questions[currentIndex];
  const tierLabel = TIER_LABELS[tier] || tier.toUpperCase();
  const TIER_SEO_LABELS = getTierSeoLabels(region);
  const seoTier = TIER_SEO_LABELS[tier] || tier.toUpperCase();

  const handleAnswer = (optionIndex: number) => {
    if (showRationale) return;
    setSelectedAnswer(optionIndex);
    setShowRationale(true);
    setAnswered((a) => a + 1);
    if (optionIndex === current.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setScore(0);
    setAnswered(0);
    setCompleted(false);
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.slice(0, 5).map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${q.options[q.correct]}. ${q.rationale}`,
      },
    })),
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">{t("pages.practiceQuestions.noQuestionsAvailable")}</h1>
              <p className="text-gray-600 mb-4 text-sm">{t("pages.practiceQuestions.weDontHaveEnoughQuestions")}</p>
              <Button onClick={() => setLocation("/practice-questions")} className="bg-primary text-white rounded-xl" data-testid="button-back-to-index">
                Browse All Categories
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = getSystemIcon(systemName);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <SEO
        title={`Free ${seoTier} ${systemName} Practice Questions | NurseNest`}
        description={`Practice 5 free ${seoTier} ${systemName} nursing exam questions with detailed rationales. Test your clinical knowledge — no signup required.`}
        keywords={`free ${seoTier} ${systemName} practice questions, ${systemName.toLowerCase()} nursing questions, free nursing exam practice`}
        canonicalPath={`/practice-questions/${tier}/${systemSlug}`}
        structuredData={faqStructuredData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Free Practice Questions", url: "https://www.nursenest.ca/practice-questions" },
          { name: tierLabel, url: `https://www.nursenest.ca/practice-questions/${tier}` },
          { name: systemName, url: `https://www.nursenest.ca/practice-questions/${tier}/${systemSlug}` },
        ]}
      />
      <Navigation />
      <main className="flex-1 pb-16">
        <section className="py-6 sm:py-10 px-4">
          <div className="max-w-[820px] mx-auto">
            <BreadcrumbNav items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Free Practice Questions", url: "https://www.nursenest.ca/practice-questions" },
              { name: tierLabel, url: `https://www.nursenest.ca/practice-questions` },
              { name: systemName, url: `https://www.nursenest.ca/practice-questions/${tier}/${systemSlug}` },
            ]} />

            {!completed ? (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700" data-testid="text-progress">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <Badge variant="outline" className="text-xs font-medium" data-testid="badge-tier-system">
                      <Icon className="w-3 h-3 mr-1" /> {systemName}
                    </Badge>
                  </div>
                  <span className="text-sm text-emerald-600 font-semibold" data-testid="text-score">
                    {score}/{answered} correct
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + (showRationale ? 1 : 0)) / questions.length) * 100}%` }}
                    data-testid="progress-bar"
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60" data-testid="card-question">
                  <div className="p-6 sm:p-8">
                    <p className="text-xl font-semibold text-slate-900 leading-relaxed" style={{ lineHeight: '1.65' }} data-testid="text-question">
                      {current.question}
                    </p>
                  </div>

                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
                    {current.options.map((option, i) => {
                      const letterLabel = String.fromCharCode(65 + i);
                      const isSelected = selectedAnswer === i;
                      const isCorrectOption = showRationale && i === current.correct;
                      const isWrongSelected = showRationale && isSelected && i !== current.correct;

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
                      } else if (showRationale) {
                        containerCls = "border-slate-100 opacity-50";
                      } else if (isSelected) {
                        containerCls = "border-primary bg-primary/5 shadow-sm";
                        letterCls = "border-primary bg-primary text-white";
                        textCls = "text-slate-900 font-medium";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={showRationale}
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`Option ${letterLabel}: ${option}`}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${containerCls}`}
                          data-testid={`button-option-${i}`}
                        >
                          <span className={`shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 ${letterCls}`}>
                            {letterLabel}
                          </span>
                          <span className={`flex-1 text-base leading-relaxed ${textCls}`}>
                            {option}
                          </span>
                          {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                          {isWrongSelected && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showRationale && (
                  <div className="mt-5 bg-white rounded-2xl shadow-sm border border-slate-200/60" data-testid="section-rationale">
                    <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-violet-600" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{t("pages.practiceQuestions.explanation")}</h3>
                      </div>
                      <p className="text-[15px] text-slate-700 leading-relaxed" style={{ lineHeight: '1.7' }}>
                        {current.rationale}
                      </p>
                    </div>

                    <div className="px-6 sm:px-8 py-4" data-testid="section-distractor-rationales">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                          <XCircle className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <h4 className="font-semibold text-slate-700 text-sm">{t("pages.practiceQuestions.whyOtherOptionsAreWrong")}</h4>
                      </div>
                      <div className="space-y-2">
                        {current.options.map((opt, idx) => {
                          if (idx === current.correct) return null;
                          const key = String.fromCharCode(65 + idx);
                          const rationale = current.distractorRationales?.[key] || current.distractorRationales?.[key.toLowerCase()] || current.distractorRationales?.[String(idx)];
                          const fallback = `This option is incorrect. The correct answer is ${String.fromCharCode(65 + current.correct)}. ${current.options[current.correct]} — ${current.rationale?.slice(0, 120) || "review the explanation for details"}.`;
                          return (
                            <div key={idx} className="pl-3 border-l-[3px] border-gray-300/80 py-0.5">
                              <p className="text-sm font-semibold text-gray-700">{key}. {opt}</p>
                              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{rationale || fallback}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {current.clinicalPearl && (
                      <div className="mx-6 sm:mx-8 mb-4 p-4 bg-amber-50/80 rounded-xl border border-amber-200/60">
                        <p className="text-sm font-semibold text-amber-800 mb-1">{t("pages.practiceQuestions.clinicalPearl")}</p>
                        <p className="text-sm text-amber-700 leading-relaxed">{current.clinicalPearl}</p>
                      </div>
                    )}

                    <div className="mx-6 sm:mx-8 mb-4" data-testid="tutor-cta-practice-question">
                      <TutorCTA
                        context={{
                          type: "practice_question",
                          id: current.id || `${tier}-${systemSlug}-${currentIndex}`,
                          data: {
                            question: current.question,
                            options: current.options,
                            correct: current.correct,
                            rationale: current.rationale,
                            bodySystem: systemName,
                            tier,
                          },
                          title: `${systemName} Question`,
                        }}
                        label={t("pages.practiceQuestions.needHelpAskTheAi")}
                      />
                    </div>

                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      {user && selectedAnswer !== null && (
                        <InlineConfidenceRating
                          questionId={`${tier}-${systemSlug}-${currentIndex}`}
                          wasCorrect={selectedAnswer === current.correct}
                          topic={systemSlug}
                          bodySystem={systemSlug}
                        />
                      )}

                      <Button
                        onClick={handleNext}
                        className="w-full h-12 bg-primary hover:brightness-110 text-white rounded-xl font-semibold text-base shadow-sm shadow-primary/20"
                        data-testid="button-next-question"
                      >
                        {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200/60" data-testid="card-results">
                <div className="p-8 sm:p-10 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" data-testid="text-final-score">
                    You scored {score} out of {questions.length}
                  </h2>
                  <p className="text-slate-600 mb-2">
                    {score >= 4
                      ? "Excellent work! You have strong clinical knowledge."
                      : score >= 3
                      ? "Good foundation! Keep practicing to strengthen weak areas."
                      : "Keep studying! Focused review will help you improve."}
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    These questions are a small sample. Access thousands more with detailed analytics.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-50 rounded-xl p-5 text-center">
                      <p className="text-3xl font-bold text-emerald-600" data-testid="text-accuracy">{Math.round((score / questions.length) * 100)}%</p>
                      <p className="text-sm text-emerald-700 mt-1">{t("pages.practiceQuestions.accuracy")}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5 text-center">
                      <p className="text-3xl font-bold text-primary">{questions.length}</p>
                      <p className="text-sm text-slate-600 mt-1">{t("pages.practiceQuestions.questionsCompleted")}</p>
                    </div>
                  </div>

                  <div className="space-y-3 max-w-sm mx-auto">
                    <Button
                      onClick={() => setLocation("/start-free")}
                      className="w-full h-12 bg-primary hover:brightness-110 text-white rounded-xl font-semibold"
                      data-testid="button-signup-cta"
                    >
                      Create Free Account for Full Access <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setLocation("/practice-questions")}
                      variant="outline"
                      className="w-full h-12 rounded-xl"
                      data-testid="button-browse-more"
                    >
                      Try Another System <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleRestart}
                      variant="ghost"
                      className="w-full h-12 rounded-xl text-slate-600"
                      data-testid="button-restart"
                    >
                      <RotateCcw className="mr-2 w-4 h-4" /> Try Again
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
              <h2 className="font-bold text-lg mb-3" data-testid="text-more-systems">More {tierLabel} Practice</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {getAvailableCombinations()
                  .filter((c) => c.tier === tier && slugify(c.system) !== systemSlug)
                  .slice(0, 6)
                  .map((c) => {
                    const SysIcon = getSystemIcon(c.system);
                    return (
                      <LocaleLink
                        key={slugify(c.system)}
                        href={`/practice-questions/${tier}/${slugify(c.system)}`}
                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/5 transition-colors text-sm"
                        data-testid={`link-related-${slugify(c.system)}`}
                      >
                        <SysIcon className="w-4 h-4 text-primary" />
                        <span className="font-medium">{c.system}</span>
                        <span className="text-slate-400 text-xs ml-auto">{c.count} Qs</span>
                      </LocaleLink>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <DifferentiatorCTA
        headline="Unlock More Practice Questions"
        subtitle="Access thousands of nursing practice questions with detailed rationales, adaptive difficulty, and performance analytics."
        primaryHref="/register"
        primaryLabel="Start Free"
        secondaryHref="/pricing"
        secondaryLabel="View Plans"
      />
      <AITutorWidget context={current ? {
        type: "practice_question",
        id: current.id || `${tier}-${systemSlug}-${currentIndex}`,
        data: {
          question: current.question,
          options: current.options,
          correct: current.correct,
          rationale: current.rationale,
          bodySystem: systemName,
          tier,
        },
        title: `${systemName} Question`,
      } : { type: "general" }} />
      <Footer />
    </div>
  );
}

export default function PracticeQuestionsPage() {
  const [matchDetail, params] = useRoute("/practice-questions/:tier/:system");

  if (matchDetail && params?.tier && params?.system) {
    return <QuizSession tier={params.tier} systemSlug={params.system} />;
  }

  return <PracticeQuestionsIndex />;
}
