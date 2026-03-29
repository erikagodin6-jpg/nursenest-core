import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA, useNewGradAccess } from "./premium-cta";
import { INTERVIEW_QUESTION_BANK } from "@/data/newgrad/premium-toolkit";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  ChevronRight, ChevronDown, ArrowRight, MessageSquare, Lock,
  CheckCircle2, Star, Lightbulb, Target, Users, Shield,
  Stethoscope, Activity, Baby, Heart, AlertTriangle,
  Shuffle, Timer, BarChart3
} from "lucide-react";

const INTERVIEW_CATEGORIES = [
  { id: "all", label: "All Questions", icon: MessageSquare },
  { id: "Behavioral (STAR)", label: "Behavioral (STAR)", icon: Star },
  { id: "Clinical Scenario", label: "Clinical Scenario", icon: Activity },
  { id: "Conflict Resolution", label: "Conflict Resolution", icon: Users },
  { id: "Time Management", label: "Time Management", icon: Target },
  { id: "Teamwork", label: "Teamwork & Delegation", icon: Users },
  { id: "Patient Safety", label: "Patient Safety", icon: Shield },
  { id: "Patient Advocacy", label: "Patient Advocacy", icon: Heart },
  { id: "Cultural Sensitivity", label: "Cultural Sensitivity", icon: Users },
  { id: "Stress Management", label: "Stress Management", icon: AlertTriangle },
  { id: "Error Management", label: "Error Management", icon: AlertTriangle },
  { id: "Prioritization", label: "Prioritization", icon: Target },
  { id: "Specialty - ICU", label: "ICU Specialty", icon: Activity },
  { id: "Specialty - ER", label: "ER Specialty", icon: Stethoscope },
  { id: "Specialty - Med-Surg", label: "Med-Surg Specialty", icon: Stethoscope },
  { id: "Specialty - Pediatrics", label: "Pediatrics Specialty", icon: Baby },
  { id: "Specialty - L&D", label: "L&D Specialty", icon: Heart },
  { id: "Difficult Interviewer", label: "Difficult Interviewer", icon: AlertTriangle },
  { id: "Confidence Drill", label: "Confidence Drills", icon: Shield },
];

const FREE_CATEGORIES = new Set([
  "Patient Advocacy", "Teamwork", "Behavioral (STAR)", "Conflict Resolution",
  "Time Management", "Patient Safety", "Confidence Drill",
]);

const totalQuestionCount = INTERVIEW_QUESTION_BANK.length;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function InterviewPage() {
  const { hasAccess } = useNewGradAccess();
  const { t } = useI18n();
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [reviewedQuestions, setReviewedQuestions] = useState<Set<string>>(new Set());
  const [randomMode, setRandomMode] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0);

  const markReviewed = useCallback((questionId: string) => {
    setReviewedQuestions((prev) => new Set(prev).add(questionId));
  }, []);

  const generateRandomSet = useCallback(() => {
    setRandomMode(true);
    setRandomSeed((s) => s + 1);
    setExpandedQ(null);
  }, []);

  const { data: dbQuestions = [] } = useQuery({
    queryKey: ["/api/newgrad/interview-questions"],
    queryFn: async () => {
      const res = await fetch("/api/newgrad/interview-questions");
      return res.ok ? res.json() : [];
    },
  });

  const allQuestions = dbQuestions.length > 0
    ? dbQuestions
    : INTERVIEW_QUESTION_BANK.map((q) => ({
        ...q,
        answer: q.sampleAnswer,
        isPremium: !FREE_CATEGORIES.has(q.category),
      }));

  const filteredByCategory = activeCategory === "all"
    ? allQuestions
    : allQuestions.filter((q: any) => q.category === activeCategory);

  const applyRandom = useMemo(() => {
    if (!randomMode) return (arr: any[]) => arr;
    return (arr: any[]) => shuffleArray(arr).slice(0, Math.min(10, arr.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomMode, randomSeed]);

  const freeQuestions = applyRandom(filteredByCategory.filter((q: any) => !q.isPremium && !q.is_premium));
  const premiumQuestions = applyRandom(filteredByCategory.filter((q: any) => q.isPremium || q.is_premium));

  const INTERVIEW_FAQ = [
    { question: "What are the most common nursing interview questions for new grads?", answer: "The most common nursing interview questions for new graduates include behavioral questions using the STAR format (Situation, Task, Action, Result), clinical scenario questions about patient prioritization and safety, conflict resolution scenarios, and questions about time management and teamwork. Expect questions about handling medication errors, difficult patients, and working with interdisciplinary teams." },
    { question: "How should I prepare for a nursing behavioral interview?", answer: "Prepare for behavioral nursing interviews by practicing the STAR method: describe the Situation, explain the Task, detail your Action, and share the Result. Use examples from clinical rotations, simulation labs, and group projects. Focus on patient safety decisions, conflict resolution, teamwork examples, and times you received constructive feedback." },
    { question: "What are good nursing job scenario questions to practice?", answer: "Practice scenario questions about patient deterioration response, medication error handling, prioritization with multiple patients, communicating with difficult family members, advocating for patients, delegating to CNAs, and managing emergency situations. Specialty-specific scenarios for ICU, ER, Med-Surg, Pediatrics, and L&D are also common." },
    { question: "How many interview questions should I prepare for my first nursing job?", answer: "Prepare at least 15-20 interview questions across different categories: 5 behavioral STAR questions, 5 clinical scenarios, 3 conflict/teamwork situations, and 3-5 specialty-specific questions. Our question bank has 100+ questions with detailed sample answers to help you feel confident and prepared." },
  ];
  const faqStructuredData = buildFaqStructuredData(INTERVIEW_FAQ);

  const uniqueCategories = [...new Set(INTERVIEW_QUESTION_BANK.map((q) => q.category))];
  const categoriesWithCounts = INTERVIEW_CATEGORIES.filter(
    (cat) => cat.id === "all" || uniqueCategories.includes(cat.id)
  ).map((cat) => ({
    ...cat,
    count: cat.id === "all"
      ? allQuestions.length
      : allQuestions.filter((q: any) => q.category === cat.id).length,
  }));

  return (
    <div data-testid="newgrad-interview-page">
      <Navigation />
      <SEO
        title={t("newGrad.interview.seoTitle")}
        description={t("newGrad.interview.seoDescription")}
        keywords="nursing interview questions, new grad nurse interview prep, nurse behavioral interview questions, first nursing job interview practice, nursing job scenario questions, STAR format nursing, ICU interview, ER interview, pediatric interview"
        canonicalPath="/newgrad/interview"
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: t("newGrad.common.interviewPrep"), url: "https://www.nursenest.ca/newgrad/interview" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium">{t("newGrad.common.interviewPrep")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-purple-100 text-purple-700">
            <MessageSquare className="w-4 h-4" /> {t("newGrad.interview.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            {t("newGrad.interview.title")}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t("newGrad.interview.subtitle")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-purple-100 p-3 text-center" data-testid="stat-total-questions">
              <div className="text-xl font-bold text-purple-700">{totalQuestionCount}+</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.interviewPage.interviewQuestions")}</div>
            </div>
            <div className="bg-white rounded-xl border border-purple-100 p-3 text-center" data-testid="stat-categories">
              <div className="text-xl font-bold text-purple-700">{uniqueCategories.length}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.interviewPage.questionCategories")}</div>
            </div>
            <div className="bg-white rounded-xl border border-purple-100 p-3 text-center" data-testid="stat-specialties">
              <div className="text-xl font-bold text-purple-700">5</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.interviewPage.specialtyBanks")}</div>
            </div>
            <div className="bg-white rounded-xl border border-purple-100 p-3 text-center" data-testid="stat-star-answers">
              <div className="text-xl font-bold text-purple-700">{totalQuestionCount}+</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.interviewPage.starAnswers")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-gray-100" data-testid="section-categories">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {categoriesWithCounts.filter((c) => c.count > 0).map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setRandomMode(false); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-purple-600 text-white"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  }`}
                  data-testid={`badge-category-${cat.id}`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateRandomSet}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
              data-testid="button-random-set"
            >
              <Shuffle className="w-3.5 h-3.5" /> Random Set of 10
            </button>
            {randomMode && (
              <button
                onClick={() => setRandomMode(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
                data-testid="button-show-all"
              >
                Show All
              </button>
            )}
            <Link
              href="/newgrad/mock-interview"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors ml-auto"
              data-testid="button-timed-mock"
            >
              <Timer className="w-3.5 h-3.5" /> Timed Mock Interview
            </Link>
            {reviewedQuestions.size > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-green-50 text-green-600 font-medium" data-testid="badge-progress">
                <BarChart3 className="w-3 h-3" /> {reviewedQuestions.size} reviewed
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-free-questions">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === "all" ? t("newGrad.interview.freeSampleTitle") : `${INTERVIEW_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory} — Free Questions`}
            </h2>
          </div>
          {freeQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>{t("pages.newgrad.interviewPage.allQuestionsInThisCategory")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {freeQuestions.map((q: any, i: number) => (
                <div key={q.id || i} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`question-free-${i}`}>
                  <button
                    onClick={() => { setExpandedQ(expandedQ === i ? null : i); markReviewed(q.id || `free-${i}`); }}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-testid={`button-question-${i}`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium mr-2">{q.category}</span>
                      {q.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mr-2 ${
                          q.difficulty === "beginner" ? "bg-green-50 text-green-600" :
                          q.difficulty === "intermediate" ? "bg-yellow-50 text-yellow-600" :
                          "bg-red-50 text-red-600"
                        }`}>
                          {q.difficulty}
                        </span>
                      )}
                      <span className="font-medium text-gray-900">{q.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 ml-2 transition-transform ${expandedQ === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedQ === i && (
                    <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" /> {t("newGrad.common.sampleAnswer")}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{q.answer || q.sample_answer || q.sampleAnswer}</p>
                      </div>
                      {(q.tips) && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h4 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1">
                            <Lightbulb className="w-4 h-4" /> {t("newGrad.common.expertTip")}
                          </h4>
                          {Array.isArray(q.tips) ? (
                            <ul className="space-y-1">
                              {q.tips.map((tip: string, j: number) => (
                                <li key={j} className="text-sm text-blue-700 flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-blue-700">{q.tips}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {premiumQuestions.length > 0 && hasAccess && (
        <section className="py-16 bg-gray-50" data-testid="section-premium-questions">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("newGrad.interview.fullBankTitle")}</h2>
            <div className="space-y-3">
              {premiumQuestions.map((q: any, i: number) => (
                <div key={q.id || i} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`question-premium-${i}`}>
                  <button
                    onClick={() => setExpandedQ(expandedQ === (i + 10000) ? null : i + 10000)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium mr-2">{q.category}</span>
                      <span className="font-medium text-gray-900">{q.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 ml-2 transition-transform ${expandedQ === (i + 10000) ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedQ === (i + 10000) && (
                    <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{q.answer || q.sample_answer || q.sampleAnswer}</p>
                      {q.tips && Array.isArray(q.tips) && (
                        <div className="bg-blue-50 rounded-lg p-3 mt-3">
                          <h4 className="text-sm font-semibold text-blue-800 mb-1">{t("newGrad.common.expertTip")}</h4>
                          <ul className="space-y-1">
                            {q.tips.map((tip: string, j: number) => (
                              <li key={j} className="text-sm text-blue-700 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!hasAccess && (
        <section className="py-16 bg-gray-50" data-testid="section-premium-preview">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t("newGrad.interview.premiumPreviewTitle")}</h2>
            </div>
            <div className="space-y-3 mb-6">
              {[
                "Walk me through your most challenging patient care experience",
                "How do you prioritize when you have multiple patients with competing needs?",
                "Describe a time you received constructive criticism. How did you respond?",
                "How would you handle a medication error?",
                "Tell me about a time you worked with a difficult team member",
                "Why should we hire you over the other 50 new grads who applied?",
                "How would you approach caring for a patient on multiple vasoactive drips?",
                "What would you do if you disagreed with a unit policy or protocol?",
              ].map((q, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-75" data-testid={`preview-question-${i}`}>
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{q}</span>
                </div>
              ))}
            </div>
            <PremiumUpgradeCTA requiredEntitlement="toolkit" context={`Unlock ${totalQuestionCount}+ interview questions across ${uniqueCategories.length} categories including specialty-specific banks (ICU, ER, Med-Surg, Peds, L&D), difficult interviewer prep, and confidence drills. Each with detailed STAR-format answers and nurse manager insights.`} />
          </div>
        </section>
      )}

      <section className="py-16 bg-white" data-testid="section-interview-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.newgrad.interviewPage.frequentlyAskedQuestions")}</h2>
          </div>
          <div className="space-y-4">
            {INTERVIEW_FAQ.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6" data-testid={`card-interview-faq-${i}`}>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-purple-50 to-indigo-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("newGrad.common.moreCareerResources")}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {t("newGrad.interview.applynestNote")} <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-indigo-700 font-semibold hover:underline" data-testid="link-applynest-interview">{t("newGrad.interview.applynestLink")}</a>.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/scenarios" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200" data-testid="link-scenarios">
              Workplace Scenarios
            </Link>
            <Link href="/newgrad/resume" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200" data-testid="link-resume">
              {t("newGrad.common.resumeTools")}
            </Link>
            <Link href="/newgrad/salary" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200" data-testid="link-salary">
              {t("newGrad.common.salaryNegotiation")}
            </Link>
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200" data-testid="link-certifications">
              {t("newGrad.common.certifications")}
            </Link>
            <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200" data-testid="link-clinical-refs">
              {t("newGrad.common.clinicalReferences")}
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors" data-testid="link-hub">
              {t("newGrad.common.careerHub")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
