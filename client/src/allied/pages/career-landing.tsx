import { Link, useParams } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute, CAREER_CONFIGS } from "@shared/careers";
import {
  ArrowRight, BookOpen, FileText, Brain, Zap, GraduationCap, Wrench,
  BarChart3, Target, Clock, CheckCircle2, ChevronRight, Check, X,
  HelpCircle, DollarSign, Shield, Star, TrendingUp, Award, Globe, Stethoscope,
  Lightbulb, Heart, ChevronDown, ChevronUp, Wind, Ambulance, Pill, Microscope,
  Radio, Hand, Activity, Database, Users, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { AlliedSEO } from "@/allied/allied-seo";
import { useRegion } from "@/allied/use-region";
import { getCrossPlatformLinksForCareer } from "@/data/internal-links";
import { getHubMarketingData } from "@/allied/data/hub-marketing-data";
import { getQuestionCountDisplay } from "@/data/career-questions/question-counts";
import { buildJobPostingStructuredData, buildJobTrainingStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";

import { useI18n } from "@/lib/i18n";
const FEATURES = [
  { slug: "qbank", label: "Test Bank", desc: "Exam-authentic questions with 600+ word rationales explaining the why behind every answer", icon: BookOpen },
  { slug: "mock-exams", label: "Mock Exams", desc: "Blueprint-weighted timed practice exams with adaptive CAT-style simulation", icon: FileText },
  { slug: "flashcards", label: "Flashcards", desc: "Spaced repetition for key concepts across all exam domains", icon: Brain },
  { slug: "study-plan", label: "Study Planner", desc: "Personalized daily study schedule targeting your weak areas first", icon: GraduationCap },
  { slug: "sims", label: "Case Simulators", desc: "Unfolding clinical scenarios mirroring real exam formats", icon: Zap },
  { slug: "tools", label: "Smart Tools", desc: "Career-specific interactive tools for deep concept mastery", icon: Wrench },
];

const COMPARISON_DATA = [
  { feature: "Question Rationale Depth", allied: "600+ words per question", generic: "1–2 sentence rationale" },
  { feature: "Exam Simulation", allied: "Adaptive CAT-style engine", generic: "Static linear exams" },
  { feature: "Weak-Area Targeting", allied: "Identifies & drills weak domains automatically", generic: "Random question order" },
  { feature: "Question Roadmap", allied: "4,000+ questions planned", generic: "Limited static bank" },
  { feature: "Blueprint Alignment", allied: "Mapped to official exam blueprint", generic: "Generic topic coverage" },
  { feature: "Study Plan", allied: "Personalized adaptive schedule", generic: "Self-directed only" },
  { feature: "Case Simulations", allied: "Unfolding clinical scenarios", generic: "Not available" },
  { feature: "Performance Analytics", allied: "Domain-level breakdown & trends", generic: "Basic score only" },
];

const GENERIC_FAQ_DATA = [
  {
    q: "How are NurseNest Allied questions different from other question banks?",
    a: "Every question includes a 600+ word rationale that doesn't just tell you the right answer — it teaches you the clinical reasoning behind it. Our questions are mapped to the official exam blueprint and use adaptive CAT-style logic to match real exam conditions."
  },
  {
    q: "What is the adaptive CAT-style simulation?",
    a: "Computer Adaptive Testing (CAT) adjusts question difficulty based on your performance. Our mock exams simulate this experience so you're prepared for how the real exam works — not just the content, but the format and pacing."
  },
  {
    q: "How does weak-area targeting work?",
    a: "Our platform tracks your performance across every exam domain. It identifies where you're struggling and automatically prioritizes those topics in your study plan and practice sessions, so you spend time where it matters most."
  },
  {
    q: "How many questions are available?",
    a: "Our question bank varies by career path — from 400+ to 1,500+ exam-authentic questions depending on the specialty, with new questions added regularly and mapped to the latest exam blueprints."
  },
  {
    q: "Can I try it before I pay?",
    a: "Yes! Take our free 15-question diagnostic assessment to see your readiness score and domain breakdown. You also get 5 free practice questions to experience the quality of our rationales firsthand."
  },
  {
    q: "What's included in the Pro plan?",
    a: "Pro gives you unlimited access to the full question bank, unlimited mock exams, personalized study planner, case simulations, performance analytics, and all smart tools. Everything you need to pass your exam with confidence."
  },
];

export default function CareerLandingPage() {
  const { t } = useI18n();
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");
  const { region, setRegion, getRegionConfig, regionLabel } = useRegion();
  const regionConfig = career ? getRegionConfig(career.slug) : null;
  const careerRoute = career ? getCanonicalRoute(career.slug) : "";
  const hubData = career ? getHubMarketingData(career.slug) : undefined;

  if (!career) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerLanding.careerNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("allied.careerLanding.theCareerYoureLookingFor")}</p>
        <Link href="/careers" className="text-teal-600 font-medium hover:underline">{t("allied.careerLanding.browseAllCareers")}</Link>
      </div>
    );
  }

  const faqItems = hubData?.faq?.map(f => ({ q: f.question, a: f.answer })) || GENERIC_FAQ_DATA;

  return (
    <div data-testid={`career-landing-${career.slug}`}>
      <AlliedSEO
        title={`${career.name} Exam Prep - QBank, Mock Exams & Study Tools`}
        description={`Prepare for your ${career.name} certification exam with practice questions, adaptive mock exams, flashcards, smart study tools, and a personalized study plan. Covers all ${career.examNames[0]} exam domains.`}
        keywords={`${career.name} exam prep, ${career.examNames[0]} exam, ${career.name} practice questions, ${career.name} mock exam, ${career.name} study guide, ${career.name} flashcards, ${career.name} certification`}
        canonicalPath={careerRoute}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": `${career.name} Certification Prep`,
          "description": `Prepare for your ${career.name} certification exam with practice questions, adaptive mock exams, flashcards, smart study tools, and a personalized study plan.`,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "NurseNest Allied",
            "url": "https://www.nursenest.ca/allied-health",
            "parentOrganization": {
              "@type": "EducationalOrganization",
              "name": PARENT_EDUCATIONAL_ORG.name,
              "url": PARENT_EDUCATIONAL_ORG.url,
            },
          },
          "courseMode": "online",
          "inLanguage": "en",
          "url": `https://www.nursenest.ca/allied-health${careerRoute}`,
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a },
            })),
          },
          buildJobPostingStructuredData({
            title: `${career.name} - Healthcare Career`,
            description: `${career.name} career path: ${career.description}. Covers ${career.examNames.join(", ")} certification exams across ${career.domains.length} exam domains.`,
            salaryMin: 45000,
            salaryMax: 95000,
            salaryCurrency: "USD",
            educationRequirements: career.examNames[0],
            occupationalCategory: career.name,
            url: `https://www.nursenest.ca/allied-health${careerRoute}`,
          }),
          buildJobTrainingStructuredData({
            name: `${career.name} Certification Prep`,
            description: `Comprehensive ${career.name} exam preparation covering ${career.examNames.join(", ")} with practice questions, mock exams, flashcards, and study tools.`,
            url: `https://www.nursenest.ca/allied-health${careerRoute}`,
            occupationalCategory: career.name,
            educationRequirements: career.examNames?.[0] ?? career.name,
            timeToComplete: "P12W",
          }),
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/careers" className="hover:text-teal-600">{t("allied.careerLanding.careers")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-700 font-medium">{career.shortName}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: career.colorAccent, color: career.color }}>
                {regionConfig ? regionConfig.examBoard : career.examNames[0]} Prep
              </div>
              <div className="inline-flex items-center gap-1 bg-white/80 border border-gray-200 rounded-full px-1 py-0.5" data-testid="region-selector">
                <button
                  onClick={() => setRegion("US")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${region === "US" ? "bg-teal-100 text-teal-700" : "text-gray-500 hover:text-gray-700"}`}
                  data-testid="button-region-us"
                >
                  United States
                </button>
                <button
                  onClick={() => setRegion("CA")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${region === "CA" ? "bg-teal-100 text-teal-700" : "text-gray-500 hover:text-gray-700"}`}
                  data-testid="button-region-ca"
                >
                  Canada
                </button>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-career-title">
              {career.name} Exam Prep
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-career-description">
              {hubData?.careerOverview ? hubData.careerOverview.slice(0, 200) + "..." : career.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.careerLanding.600WordRationales")}</strong> {t("allied.careerLanding.explainingTheWhyBehindEvery")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.careerLanding.adaptiveCatstyle")}</strong> {t("allied.careerLanding.simulationMatchingRealExamLogic")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.careerLanding.weakareaTargeting")}</strong> {t("allied.careerLanding.soYouStudyWhatMatters")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.careerLanding.4000QuestionRoadmap")}</strong> {t("allied.careerLanding.withNewContentAddedWeekly")}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={`/allied-health/diagnostic?career=${career.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-start-diagnostic">
                Start Free Diagnostic <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/allied-health/qbank?career=${career.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-start-qbank">
                Practice Questions
              </Link>
              <Link href={`${careerRoute}/mock-exams`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-start-mock">
                Take a Mock Exam
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Bar */}
      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-platform-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-questions">
              <div className="text-2xl font-bold text-gray-900">{getQuestionCountDisplay(career.slug)}</div>
              <div className="text-sm text-gray-500">{t("allied.careerLanding.practiceQuestions")}</div>
            </div>
            <div data-testid="stat-lessons">
              <div className="text-2xl font-bold text-gray-900">{hubData?.platformStats.totalLessons || "100+"}</div>
              <div className="text-sm text-gray-500">{t("allied.careerLanding.lessons")}</div>
            </div>
            <div data-testid="stat-flashcards">
              <div className="text-2xl font-bold text-gray-900">{hubData?.platformStats.flashcardDecks || "40+"}</div>
              <div className="text-sm text-gray-500">{t("allied.careerLanding.flashcardDecks")}</div>
            </div>
            <div data-testid="stat-mock-exams">
              <div className="text-2xl font-bold text-gray-900">{hubData?.platformStats.mockExams || "Unlimited"}</div>
              <div className="text-sm text-gray-500">{t("allied.careerLanding.mockExams")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Overview */}
      {hubData && (
        <section className="py-16 bg-white" data-testid="section-career-overview">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About the {career.shortName} Profession</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">{hubData.careerOverview}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50/50 to-cyan-50/30 rounded-2xl border border-teal-100 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-teal-500" />
                Why Choose a Career in {career.shortName}?
              </h3>
              <p className="text-gray-600 leading-relaxed">{hubData.whyChoose}</p>
            </div>
          </div>
        </section>
      )}

      {/* Free Content Preview — Lead Gen */}
      <section className="py-16 bg-gradient-to-b from-teal-50/40 to-white" data-testid="section-free-preview">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.tryItFreeNoAccount")}</h2>
            <p className="text-gray-600">Experience the depth of NurseNest Allied {career.shortName} prep before you commit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center" data-testid="preview-diagnostic">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{t("allied.careerLanding.15questionDiagnostic")}</h3>
              <p className="text-sm text-gray-500">See your readiness score across all {career.shortName} domains</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center" data-testid="preview-questions">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{t("allied.careerLanding.5PracticeQuestions")}</h3>
              <p className="text-sm text-gray-500">{t("allied.careerLanding.experienceOur600WordClinical")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center" data-testid="preview-mock">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{t("allied.careerLanding.1FreeMockExam")}</h3>
              <p className="text-sm text-gray-500">{t("allied.careerLanding.takeAFulllengthTimedMock")}</p>
            </div>
          </div>
          <div className="text-center">
            <Link href={`/allied-health/diagnostic?career=${career.slug}`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-free-preview-cta">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-gray-400 mt-3">{t("allied.careerLanding.noCreditCardRequired")}</p>
          </div>
        </div>
      </section>

      {/* Study Features */}
      <section className="py-16" data-testid="section-study-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.careerLanding.studyFeatures")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Link key={f.slug} href={f.slug === "qbank" ? `/allied-health/qbank?career=${career.slug}` : `${careerRoute}/${f.slug}`} className="group" data-testid={`card-feature-${f.slug}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                  <f.icon className="w-7 h-7 text-teal-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{f.label}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing Pathway */}
      {hubData && (
        <section className="py-16 bg-gray-50" data-testid="section-licensing-pathway">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Become a {career.shortName}</h2>
              <p className="text-gray-600">Follow the licensing pathway to earn your {career.examNames[0]} certification</p>
            </div>
            <div className="space-y-4">
              {hubData.licensingPathway.map((step) => (
                <div key={step.step} className="flex gap-4 items-start" data-testid={`licensing-step-${step.step}`}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Career Information: Salary, Job Outlook, Benefits */}
      {hubData && (
        <section className="py-16 bg-white" data-testid="section-career-info">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{career.shortName} Career Information</h2>
              <p className="text-gray-600">{t("allied.careerLanding.salaryDataJobOutlookAnd")}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Salary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="card-salary">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-500" />
                  Salary Range
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.entryLevel")}</span>
                    <span className="font-semibold text-gray-900">{hubData.salary.entry}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.median")}</span>
                    <span className="font-bold text-teal-700 text-lg">{hubData.salary.median}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.experienced")}</span>
                    <span className="font-semibold text-gray-900">{hubData.salary.experienced}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">{hubData.salary.source}</p>
              </div>

              {/* Job Outlook */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="card-job-outlook">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-500" />
                  Job Outlook
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.growthRate")}</span>
                    <span className="font-bold text-teal-700 text-lg">{hubData.jobOutlook.growthRate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.period")}</span>
                    <span className="font-semibold text-gray-900">{hubData.jobOutlook.growthPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.openingsyear")}</span>
                    <span className="font-semibold text-gray-900">{hubData.jobOutlook.openingsPerYear}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">{t("allied.careerLanding.demandLevel")}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">{hubData.jobOutlook.demandLevel}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">{hubData.jobOutlook.source}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="career-benefits">
              {hubData.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl" data-testid={`benefit-${i}`}>
                  <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{benefit.title}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Day in the Life */}
      {hubData && (
        <section className="py-16 bg-gradient-to-b from-teal-50/30 to-white" data-testid="section-day-in-life">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{hubData.dayInTheLife.title}</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
              <p className="text-gray-600 leading-relaxed" data-testid="text-day-narrative">{hubData.dayInTheLife.narrative}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hubData.dayInTheLife.typicalTasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 bg-white rounded-lg border border-gray-100" data-testid={`task-${i}`}>
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Resources (cross-platform internal links) */}
      {(() => {
        const crossLinks = getCrossPlatformLinksForCareer(career.slug);
        if (crossLinks.length === 0) return null;
        const lessonLinks = crossLinks.filter(l => l.type === "career-to-lesson");
        const newGradLinks = crossLinks.filter(l => l.type === "career-to-newgrad");
        return (
          <section className="py-16 bg-white" data-testid="section-related-resources">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.relatedResources")}</h2>
                <p className="text-gray-600">{t("allied.careerLanding.deepenYourUnderstandingWithClinical")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessonLinks.length > 0 && (
                  <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6" data-testid="cross-links-lessons">
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{t("allied.careerLanding.clinicalLessons")}</h3>
                    </div>
                    <div className="space-y-2">
                      {lessonLinks.map((link, i) => (
                        <Link
                          key={i}
                          href={link.target}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all group"
                          data-testid={`link-cross-lesson-${i}`}
                        >
                          <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 block truncate">{link.anchor}</span>
                            <span className="text-xs text-gray-400">{link.reason}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {newGradLinks.length > 0 && (
                  <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6" data-testid="cross-links-newgrad">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-900">{t("allied.careerLanding.careerTransition")}</h3>
                    </div>
                    <div className="space-y-2">
                      {newGradLinks.map((link, i) => (
                        <Link
                          key={i}
                          href={link.target}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all group"
                          data-testid={`link-cross-newgrad-${i}`}
                        >
                          <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 block truncate">{link.anchor}</span>
                            <span className="text-xs text-gray-400">{link.reason}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {(() => {
        const guideMap: Record<string, { slug: string; title: string; desc: string }> = {
          "respiratory-therapy": { slug: "complete-guide-to-becoming-a-respiratory-therapist", title: "Complete Respiratory Therapist Career Guide", desc: "NBRC/CBRC exam prep, ventilator skills & career path" },
          "paramedic": { slug: "complete-guide-to-becoming-a-paramedic", title: "Complete Paramedic Career Guide", desc: "NREMT/COPR exam prep, field transition & career path" },
          "medical-laboratory": { slug: "complete-guide-to-becoming-a-medical-lab-technologist", title: "Complete MLT Career Guide", desc: "CSMLS/ASCP exam prep, lab skills & career path" },
        };
        const match = guideMap[career.slug];
        if (!match) return null;
        return (
          <section className="py-10 bg-white" data-testid="section-authority-guide-link">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link href={`/guides/${match.slug}`} className="flex items-center gap-4 p-5 rounded-2xl border border-teal-200 bg-teal-50/40 hover:shadow-md hover:border-teal-300 transition-all group" data-testid="link-authority-guide">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-0.5">{t("allied.careerLanding.authorityGuide")}</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{match.title}</h3>
                  <p className="text-sm text-gray-500">{match.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-400 group-hover:text-teal-600 shrink-0" />
              </Link>
            </div>
          </section>
        );
      })()}

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50" data-testid="section-comparison">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.nursenestAlliedVsGenericTest")}</h2>
            <p className="text-gray-600">{t("allied.careerLanding.seeWhyStudentsSwitchTo")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-5 py-3 text-sm font-semibold text-gray-500">{t("allied.careerLanding.feature")}</div>
              <div className="px-5 py-3 text-sm font-semibold text-teal-700 text-center">{t("allied.careerLanding.nursenestAllied")}</div>
              <div className="px-5 py-3 text-sm font-semibold text-gray-400 text-center">{t("allied.careerLanding.genericBanks")}</div>
            </div>
            {COMPARISON_DATA.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < COMPARISON_DATA.length - 1 ? 'border-b border-gray-100' : ''}`} data-testid={`comparison-row-${i}`}>
                <div className="px-5 py-4 text-sm font-medium text-gray-700">{row.feature}</div>
                <div className="px-5 py-4 text-sm text-teal-700 text-center flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>{row.allied}</span>
                </div>
                <div className="px-5 py-4 text-sm text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span>{row.generic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Blueprint Domains */}
      <section className="py-16 bg-gradient-to-b from-teal-50/30 to-white" data-testid="section-domains">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.careerLanding.examBlueprintDomains")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {career.domains.map((domain, i) => (
              <div key={domain} className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-3" data-testid={`domain-${i}`}>
                <Target className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{domain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Prep Tips */}
      {hubData && (
        <section className="py-16 bg-white" data-testid="section-exam-tips">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{career.shortName} Exam Preparation Tips</h2>
              <p className="text-gray-600">{t("allied.careerLanding.expertStrategiesToMaximizeYour")}</p>
            </div>
            <div className="space-y-4">
              {hubData.examPrepTips.map((tip, i) => (
                <div key={i} className="flex gap-4 items-start bg-gray-50 rounded-xl p-5" data-testid={`exam-tip-${i}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {regionConfig && (
        <section className="py-16 bg-white" data-testid="section-region-info">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{regionLabel} Exam Track</h2>
              <p className="text-gray-600">Your exam prep is configured for the {regionConfig.examBoard} ({regionConfig.examName})</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center px-4 py-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">{regionConfig.totalQuestions}</div>
                <div className="text-sm text-gray-600">{t("allied.careerLanding.examQuestions")}</div>
              </div>
              <div className="text-center px-4 py-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">{regionConfig.timeLimit} min</div>
                <div className="text-sm text-gray-600">{t("allied.careerLanding.timeLimit")}</div>
              </div>
              <div className="text-center px-4 py-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">{regionConfig.passThreshold}%</div>
                <div className="text-sm text-gray-600">{t("allied.careerLanding.passThreshold")}</div>
              </div>
              <div className="text-center px-4 py-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">{region === "US" ? "mg/dL" : "mmol/L"}</div>
                <div className="text-sm text-gray-600">{t("allied.careerLanding.labUnits")}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-500" />
                {regionLabel} Legal & Regulatory Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {regionConfig.legalModules.slice(0, 8).map(mod => (
                  <div key={mod.id} className="px-3 py-2 bg-white rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-800">{mod.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{mod.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                {regionConfig.examBoard} Blueprint Weights
              </h3>
              <div className="space-y-3">
                {Object.entries(regionConfig.blueprintWeights).map(([domain, weight]) => (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{domain}</span>
                      <span className="font-medium text-teal-700">{weight}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="h-2 rounded-full bg-teal-500" style={{ width: `${weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Smart Study Tools */}
      {career.aiTools.length > 0 && (
        <section className="py-16 bg-white" data-testid="section-smart-tools">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.careerLanding.smartStudyTools")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {career.aiTools.map(tool => (
                <Link key={tool.id} href={`${careerRoute}/tools`} className="group" data-testid={`card-tool-${tool.id}`}>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-5 hover:shadow-md transition-all">
                    <Wrench className="w-6 h-6 text-teal-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instructor Bios */}
      {hubData && hubData.instructors.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-instructors">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.builtByExperts")}</h2>
              <p className="text-gray-600">Our content is created and reviewed by credentialed {career.shortName} professionals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hubData.instructors.map((instructor, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6" data-testid={`instructor-${i}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: career.color }}>
                      {instructor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                      <p className="text-xs text-teal-600 font-medium mt-0.5">{instructor.credentials}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{instructor.specialty}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 leading-relaxed">{instructor.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {hubData && hubData.testimonials.length > 0 && (
        <section className="py-16 bg-white" data-testid="section-testimonials">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">What {career.shortName} Students Are Saying</h2>
              <p className="text-gray-600">Real feedback from learners preparing for their {career.examNames[0]} exam</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hubData.testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" data-testid={`hub-testimonial-${i}`}>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 italic text-sm">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid-Page CTA */}
      <section className="py-12 bg-gradient-to-r from-teal-600 to-teal-700" data-testid="section-mid-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t("allied.careerLanding.startPracticingNowCreateYour")}</h2>
          <p className="text-teal-100 mb-6">{t("allied.careerLanding.getInstantAccessToPractice")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/allied-health/diagnostic?career=${career.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg" data-testid="button-mid-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-400 transition-colors border border-teal-400" data-testid="button-mid-cta-register">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Mini-Section */}
      <section className="py-16 bg-gradient-to-b from-white to-teal-50/40" data-testid="section-pricing">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.simpleTransparentPricing")}</h2>
            <p className="text-gray-600">{t("allied.careerLanding.startFreeUpgradeWhenYoure")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="pricing-free">
              <div className="text-sm font-medium text-gray-500 mb-2">{t("allied.careerLanding.free")}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
              <div className="text-sm text-gray-500 mb-5">{t("allied.careerLanding.forever")}</div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.5PracticeQuestions2")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.1MockExam")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.freeDiagnosticAssessment")}</span>
                </li>
              </ul>
              <Link href={`/allied-health/diagnostic?career=${career.slug}`} className="block w-full text-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors" data-testid="button-pricing-free">
                Start Free Diagnostic
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="pricing-monthly">
              <div className="text-sm font-medium text-gray-500 mb-2">{t("allied.careerLanding.monthly")}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$29</div>
              <div className="text-sm text-gray-500 mb-5">{t("allied.careerLanding.perMonth")}</div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.unlimitedQuestionsRationales")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.unlimitedMockExams")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.allSmartToolsAnalytics")}</span>
                </li>
              </ul>
              <Link href="/allied-health/pricing" className="block w-full text-center px-4 py-2.5 bg-teal-100 text-teal-700 rounded-xl font-medium hover:bg-teal-200 transition-colors" data-testid="button-pricing-monthly">
                Get Monthly Access
              </Link>
            </div>

            <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 relative shadow-lg shadow-teal-100" data-testid="pricing-annual">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-teal-600 text-white text-xs font-bold rounded-full">
                BEST VALUE
              </div>
              <div className="text-sm font-medium text-teal-600 mb-2">{t("allied.careerLanding.annual")}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$239</div>
              <div className="text-sm text-gray-500 mb-1">{t("allied.careerLanding.perYear")}</div>
              <div className="text-xs font-semibold text-teal-600 mb-5">{t("allied.careerLanding.save31VsMonthly")}</div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.everythingInMonthly")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.priorityNewContentAccess")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{t("allied.careerLanding.extendedPerformanceHistory")}</span>
                </li>
              </ul>
              <Link href="/allied-health/pricing" className="block w-full text-center px-4 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-200" data-testid="button-pricing-annual">
                Get Annual Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">Everything you need to know about {career.shortName} exam prep</p>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse Other Careers */}
      {(() => {
        const ALLIED_CAREER_ICONS: Record<string, any> = {
          rrt: Wind, paramedic: Ambulance, "pharmacy-tech": Pill,
          mlt: Microscope, imaging: Radio, "occupational-therapy": Hand,
          "physical-therapy": Activity, "health-info-mgmt": Database,
          "social-worker": Users, psychotherapist: Brain, "addictions-counsellor": ShieldCheck,
        };
        const alliedKeys = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging", "occupationalTherapy", "physicalTherapy", "healthInfoMgmt", "socialWorker", "psychotherapist", "addictionsCounsellor"] as const;
        const otherCareers = alliedKeys
          .map(k => CAREER_CONFIGS[k])
          .filter(c => c.enabled && c.slug !== career.slug);

        if (otherCareers.length === 0) return null;

        return (
          <section className="py-16 bg-gray-50" data-testid="section-browse-careers">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.careerLanding.browseOtherAlliedHealthCareers")}</h2>
                <p className="text-gray-600">{t("allied.careerLanding.exploreExamPrepResourcesFor")}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherCareers.slice(0, 8).map(c => {
                  const Icon = ALLIED_CAREER_ICONS[c.slug] || BookOpen;
                  return (
                    <Link key={c.slug} href={getCanonicalRoute(c.slug)} className="group" data-testid={`link-browse-career-${c.slug}`}>
                      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all h-full text-center">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: c.colorAccent }}>
                          <Icon className="w-5 h-5" style={{ color: c.color }} />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">{c.shortName}</h3>
                        <p className="text-xs text-gray-500 mt-1">{c.examNames[0]}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="text-center mt-6">
                <Link href="/careers" className="inline-flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors" data-testid="link-view-all-careers">
                  View All Careers <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to pass your {career.examNames[0]} exam?
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            Take the free 15-question diagnostic to discover your strengths and weak areas — no credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/allied-health/diagnostic?career=${career.slug}`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg" data-testid="button-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-400 transition-colors border border-teal-400" data-testid="button-cta-pricing">
              View Full Pricing
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-teal-200 text-sm">
            <Link href={`/allied-health/qbank?career=${career.slug}`} className="hover:text-white transition-colors" data-testid="link-footer-qbank">{t("allied.careerLanding.testBank")}</Link>
            <Link href={`${careerRoute}/mock-exams`} className="hover:text-white transition-colors" data-testid="link-footer-mocks">{t("allied.careerLanding.mockExams2")}</Link>
            <Link href="/allied-health/pricing" className="hover:text-white transition-colors" data-testid="link-footer-pricing">{t("allied.careerLanding.pricing")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 text-teal-500" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}
