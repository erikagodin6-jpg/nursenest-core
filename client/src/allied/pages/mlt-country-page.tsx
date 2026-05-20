import { Link, useParams } from "wouter";
import {
  ArrowRight, BookOpen, FileText, Brain, GraduationCap, Zap, Target,
  CheckCircle2, ChevronRight, HelpCircle, Microscope, FlaskConical,
  BarChart3, Shield, Clock, Award, Star
} from "lucide-react";
import { useState } from "react";
import { AlliedSEO } from "@/allied/allied-seo";
import { CAREER_CONFIGS } from "@shared/careers";
import { REGION_EXAM_CONFIGS } from "@shared/region-config";
import { useI18n } from "@/lib/i18n";
import {
  MLT_DISCIPLINES, MLT_SUBDISCIPLINES,
  MLT_CANADA_BLUEPRINT_CATEGORIES, MLT_USA_CONTENT_AREAS,
  MLT_DIFFICULTY_LEVELS, MLT_COGNITIVE_LEVELS,
} from "@shared/mlt-taxonomy";

type MltCountry = "canada" | "usa";
type MltPageType = "exam-prep" | "lessons" | "flashcards" | "practice-exams" | "study-plan" | "free-questions" | "faq";

interface CountryConfig {
  country: MltCountry;
  label: string;
  flag: string;
  examBoard: string;
  examName: string;
  regionKey: "CA" | "US";
  otherCountry: MltCountry;
  otherLabel: string;
  seoKeywords: Record<MltPageType, string>;
}

const COUNTRY_CONFIGS: Record<MltCountry, CountryConfig> = {
  canada: {
    country: "canada",
    label: "Canada",
    flag: "🇨🇦",
    examBoard: "CSMLS",
    examName: "CSMLS National Certification Examination",
    regionKey: "CA",
    otherCountry: "usa",
    otherLabel: "USA",
    seoKeywords: {
      "exam-prep": "CSMLS MLT exam prep, MLT exam Canada, medical laboratory technologist Canada, CSMLS certification, MLT practice questions Canada",
      "lessons": "MLT lessons Canada, CSMLS study material, medical lab tech lessons, hematology lessons MLT, clinical chemistry lessons",
      "flashcards": "MLT flashcards Canada, CSMLS flashcards, medical lab tech flashcards, hematology flashcards, blood banking flashcards",
      "practice-exams": "CSMLS practice exam, MLT mock exam Canada, medical laboratory technologist practice test, CSMLS certification practice",
      "study-plan": "CSMLS study plan, MLT study schedule Canada, medical lab tech study guide, CSMLS exam preparation plan",
      "free-questions": "free CSMLS practice questions, free MLT questions Canada, medical lab tech free test, CSMLS sample questions",
      "faq": "CSMLS exam FAQ, MLT certification FAQ Canada, medical laboratory technologist questions, CSMLS exam format",
    },
  },
  usa: {
    country: "usa",
    label: "United States",
    flag: "🇺🇸",
    examBoard: "ASCP",
    examName: "ASCP Board of Certification MLS/MLT Examination",
    regionKey: "US",
    otherCountry: "canada",
    otherLabel: "Canada",
    seoKeywords: {
      "exam-prep": "ASCP MLS exam prep, ASCP MLT exam, medical laboratory scientist exam, ASCP BOC certification, MLS practice questions",
      "lessons": "MLS lessons ASCP, ASCP study material, medical lab scientist lessons, clinical chemistry lessons, microbiology lessons",
      "flashcards": "MLS flashcards ASCP, ASCP flashcards, medical lab scientist flashcards, hematology flashcards, immunology flashcards",
      "practice-exams": "ASCP practice exam, MLS mock exam, medical laboratory scientist practice test, ASCP BOC practice",
      "study-plan": "ASCP study plan, MLS study schedule, medical lab scientist study guide, ASCP exam preparation plan",
      "free-questions": "free ASCP practice questions, free MLS questions, medical lab scientist free test, ASCP sample questions",
      "faq": "ASCP exam FAQ, MLS certification FAQ, medical laboratory scientist questions, ASCP exam format",
    },
  },
};

const PAGE_CONFIGS: Record<MltPageType, {
  title: (cc: CountryConfig) => string;
  h1: (cc: CountryConfig) => string;
  metaDescription: (cc: CountryConfig) => string;
  icon: typeof Target;
}> = {
  "exam-prep": {
    title: (cc) => `${cc.examBoard} MLT Exam Prep — ${cc.label}`,
    h1: (cc) => `${cc.examBoard} MLT Exam Prep (${cc.label})`,
    metaDescription: (cc) => `Prepare for the ${cc.examName} with blueprint-aligned practice questions, mock exams, flashcards, and a personalized study plan. Covers all laboratory disciplines.`,
    icon: Target,
  },
  "lessons": {
    title: (cc) => `MLT Lessons — ${cc.examBoard} ${cc.label}`,
    h1: (cc) => `MLT Lessons (${cc.label})`,
    metaDescription: (cc) => `Comprehensive MLT lessons covering all 16 laboratory disciplines for the ${cc.examName}. Includes glossary tooltips, end-of-lesson quizzes, and ${cc.regionKey === "CA" ? "SI" : "conventional"} unit lab values.`,
    icon: BookOpen,
  },
  "flashcards": {
    title: (cc) => `MLT Flashcards — ${cc.examBoard} ${cc.label}`,
    h1: (cc) => `MLT Flashcards (${cc.label})`,
    metaDescription: (cc) => `Master medical laboratory concepts with spaced repetition flashcards for the ${cc.examName}. Image identification, mnemonics, clinical scenarios, and lab value cards.`,
    icon: Brain,
  },
  "practice-exams": {
    title: (cc) => `MLT Practice Exams — ${cc.examBoard} ${cc.label}`,
    h1: (cc) => `MLT Practice Exams (${cc.label})`,
    metaDescription: (cc) => `Take blueprint-weighted, timed practice exams simulating the ${cc.examName}. Adaptive difficulty, domain-level scoring, and detailed rationales for every question.`,
    icon: FileText,
  },
  "study-plan": {
    title: (cc) => `MLT Study Plan — ${cc.examBoard} ${cc.label}`,
    h1: (cc) => `MLT Study Plan (${cc.label})`,
    metaDescription: (cc) => `Create a personalized weekly study plan for the ${cc.examName}. Track progress across all disciplines with checkpoints, resource links, and adaptive scheduling.`,
    icon: GraduationCap,
  },
  "free-questions": {
    title: (cc) => `Free MLT Practice Questions — ${cc.examBoard} ${cc.label}`,
    h1: (cc) => `Free MLT Practice Questions (${cc.label})`,
    metaDescription: (cc) => `Try free ${cc.examBoard} MLT practice questions from every laboratory discipline. Full rationales included — no account required.`,
    icon: Zap,
  },
  "faq": {
    title: (cc) => `MLT Exam FAQ — ${cc.examBoard} ${cc.label}`,
    h1: (cc) => `${cc.examBoard} MLT Exam FAQ (${cc.label})`,
    metaDescription: (cc) => `Frequently asked questions about the ${cc.examName}. Exam format, scoring, registration, study timeline, and preparation tips.`,
    icon: HelpCircle,
  },
};

function getCountryFAQ(cc: CountryConfig) {

  if (cc.country === "canada") {
    return [
      { q: "What is the CSMLS National Certification Examination?", a: "The CSMLS exam is administered by the Canadian Society for Medical Laboratory Science. It is required for MLT certification in most Canadian provinces. The exam has 120 multiple-choice questions to be completed in 180 minutes." },
      { q: "What score do I need to pass the CSMLS exam?", a: "The passing score is 65%. You must also meet domain minimums of 55% across all tested areas to ensure well-rounded competency." },
      { q: "What blueprint categories does the CSMLS exam cover?", a: "The exam covers Hematology & Coagulation (25%), Clinical Chemistry (20%), Microbiology (20%), Transfusion Science (15%), Histotechnology (10%), and Quality Management (10%)." },
      { q: "What lab value system does the CSMLS exam use?", a: "The CSMLS exam uses SI units (mmol/L for glucose and electrolytes, µmol/L for creatinine). NurseNest displays all lab values in SI units when you select the Canada track." },
      { q: "How long should I study for the CSMLS exam?", a: "Most students study for 8-12 weeks. Our study planner creates a personalized schedule based on your diagnostic results and exam date, prioritizing your weakest disciplines." },
      { q: "Can I switch to the ASCP (USA) track?", a: "Yes. You can switch between CSMLS and ASCP tracks at any time. Blueprint weights, lab units, and regulatory content will adjust automatically." },
    ];
  }
  return [
    { q: "What is the ASCP Board of Certification exam?", a: "The ASCP BOC exam certifies Medical Laboratory Technicians (MLT) and Medical Laboratory Scientists (MLS) in the United States. The MLT/MLS exam has 100 multiple-choice questions to be completed in 150 minutes." },
    { q: "What score do I need to pass the ASCP exam?", a: "The ASCP uses a scaled scoring system from 0-999. A score of 400 is required to pass. You must also meet minimum domain scores of 60% in each content area." },
    { q: "What is the difference between MLT and MLS certification?", a: "MLT (Medical Laboratory Technician) requires an associate's degree, while MLS (Medical Laboratory Scientist) requires a bachelor's degree. The MLS exam has broader scope and greater depth. NurseNest covers both certification levels." },
    { q: "What content areas does the ASCP exam cover?", a: "The ASCP BOC exam covers Hematology (25%), Clinical Chemistry (25%), Microbiology (20%), Immunohematology/Blood Banking (15%), Urinalysis & Body Fluids (10%), and Laboratory Operations (5%)." },
    { q: "What lab value system does the ASCP exam use?", a: "The ASCP exam uses conventional US units (mg/dL for glucose, mg/dL for creatinine). NurseNest displays all lab values in conventional units when you select the USA track." },
    { q: "How long should I study for the ASCP exam?", a: "Most students study for 6-10 weeks. Our study planner creates a personalized schedule targeting your weakest content areas first, with adaptive difficulty progression." },
  ];
}

function ExamPrepContent({ cc }: { cc: CountryConfig }) {
  const regionConfig = REGION_EXAM_CONFIGS.mlt?.[cc.regionKey];
  const blueprintCategories = cc.country === "canada" ? MLT_CANADA_BLUEPRINT_CATEGORIES : MLT_USA_CONTENT_AREAS;

  return (
    <>
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-questions"><div className="text-2xl font-bold text-gray-900">{regionConfig?.totalQuestions || 100}+</div><div className="text-sm text-gray-500">{t("allied.mltCountryPage.examQuestions")}</div></div>
            <div data-testid="stat-time"><div className="text-2xl font-bold text-gray-900">{regionConfig?.timeLimit || 150} min</div><div className="text-sm text-gray-500">{t("allied.mltCountryPage.timeLimit")}</div></div>
            <div data-testid="stat-pass"><div className="text-2xl font-bold text-gray-900">{cc.country === "canada" ? "65%" : "400/999"}</div><div className="text-sm text-gray-500">{t("allied.mltCountryPage.passScore")}</div></div>
            <div data-testid="stat-disciplines"><div className="text-2xl font-bold text-gray-900">16</div><div className="text-sm text-gray-500">{t("allied.mltCountryPage.disciplines")}</div></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{cc.examBoard} Blueprint Weights</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-4">
              {blueprintCategories.map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                    <span className="font-semibold text-purple-700">{cat.weight}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-purple-500" style={{ width: `${cat.weight * 2}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Disciplines: {cat.disciplines.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {regionConfig && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-purple-500" />
              {cc.label} Legal & Regulatory Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {regionConfig.legalModules.map(mod => (
                <div key={mod.id} className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <div className="text-sm font-medium text-gray-800">{mod.name}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{mod.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.mltCountryPage.startPreparingNow")}</h2>
          <p className="text-gray-600 mb-8">Access study tools designed specifically for the {cc.examName}.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/allied-health/mlt/${cc.country}/free-questions`} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="button-free-questions">
              Try Free Questions <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/practice-exams`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors border border-purple-200" data-testid="button-practice-exams">
              Practice Exams
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/study-plan`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-study-plan">
              Study Plan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function LessonsContent({ cc }: { cc: CountryConfig }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-600 mb-6">Comprehensive lessons across all 16 laboratory disciplines, with {cc.regionKey === "CA" ? "SI" : "conventional"} unit lab values and {cc.examBoard}-aligned content.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MLT_DISCIPLINES.map((discipline, i) => {
            const subs = MLT_SUBDISCIPLINES[discipline] || [];
            return (
              <div key={discipline} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all" data-testid={`lesson-discipline-${i}`}>
                <FlaskConical className="w-6 h-6 text-purple-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{discipline}</h3>
                <ul className="space-y-1">
                  {subs.slice(0, 4).map(sub => (
                    <li key={sub} className="text-xs text-gray-500 flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-purple-300 rounded-full" />
                      {sub}
                    </li>
                  ))}
                  {subs.length > 4 && (
                    <li className="text-xs text-purple-500 font-medium">+{subs.length - 4} more topics</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600 mb-4">All lessons include {cc.regionKey === "CA" ? "SI" : "conventional"} unit lab values, glossary tooltips, and end-of-lesson quizzes aligned to {cc.examBoard} blueprints.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/allied-health/mlt/${cc.country}/flashcards`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-flashcards-from-lessons">
              Review with Flashcards <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/free-questions`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200" data-testid="link-free-from-lessons">
              Practice Questions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlashcardsContent({ cc }: { cc: CountryConfig }) {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-600 mb-6">Spaced repetition flashcards with image identification, mnemonics, clinical scenarios, and lab value cards for {cc.examBoard} exam preparation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {["Term & Definition", "Image Identification", "Clinical Scenario", "Lab Value", "Procedure Steps", "Comparison", "Mnemonic"].map((type, i) => (
            <div key={type} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all" data-testid={`flashcard-type-${i}`}>
              <Brain className="w-6 h-6 text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">{type}</h3>
            </div>
          ))}
        </div>
        <div className="bg-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("allied.mltCountryPage.buildYourFlashcardCollection")}</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
            Master all 16 laboratory disciplines with spaced repetition. Each deck aligns with {cc.examBoard} blueprint categories and uses {cc.regionKey === "CA" ? "SI" : "conventional"} units for lab values.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/allied-health/mlt/${cc.country}/lessons`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-lessons-from-flashcards">
              Browse Lessons <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/free-questions`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200" data-testid="link-free-from-flashcards">
              Try Free Questions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticeExamsContent({ cc }: { cc: CountryConfig }) {
  const regionConfig = REGION_EXAM_CONFIGS.mlt?.[cc.regionKey];
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-600 mb-6">Blueprint-weighted, timed practice exams simulating the {cc.examName} with adaptive difficulty and domain-level scoring.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{t("allied.mltCountryPage.timedExams")}</h3>
            <p className="text-sm text-gray-500">{regionConfig?.totalQuestions || 100} questions in {regionConfig?.timeLimit || 150} minutes — matching real exam conditions</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{t("allied.mltCountryPage.domainScoring")}</h3>
            <p className="text-sm text-gray-500">See your performance breakdown across every {cc.examBoard} blueprint category</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <Target className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{t("allied.mltCountryPage.adaptiveDifficulty")}</h3>
            <p className="text-sm text-gray-500">{t("allied.mltCountryPage.questionsAdjustToYourPerformance")}</p>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("allied.mltCountryPage.readyToTestYourKnowledge")}</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
            Full-length exams simulate real {cc.examBoard} exam conditions with blueprint-weighted question selection,
            timed sessions, and detailed performance analytics across all laboratory disciplines.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/allied-health/mlt/${cc.country}/free-questions`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-free-questions-fallback">
              Start with Free Questions <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/study-plan`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200" data-testid="link-study-plan-from-exams">
              View Study Plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudyPlanContent({ cc }: { cc: CountryConfig }) {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-600 mb-6">Create a personalized weekly study plan for the {cc.examName} with progress checkpoints, discipline-specific resource links, and adaptive scheduling.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <GraduationCap className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{t("allied.mltCountryPage.personalizedSchedule")}</h3>
            <p className="text-sm text-gray-600">{t("allied.mltCountryPage.basedOnYourDiagnosticResults")}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Award className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{t("allied.mltCountryPage.weeklyCheckpoints")}</h3>
            <p className="text-sm text-gray-600">{t("allied.mltCountryPage.milestoneChecksEnsureYoureOn")}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <h3 className="font-semibold text-gray-900 mb-4">How the {cc.examBoard} Study Planner Works</h3>
          <div className="space-y-3">
            {[
              { step: "1", title: "Take a Diagnostic Assessment", desc: `Complete a short diagnostic across all ${cc.examBoard} blueprint areas to identify strengths and weaknesses.` },
              { step: "2", title: "Set Your Exam Date", desc: "Enter your target exam date and available study hours per week to generate a realistic timeline." },
              { step: "3", title: "Follow Your Weekly Plan", desc: "Each week covers specific disciplines with lessons, flashcards, and practice questions weighted by your needs." },
              { step: "4", title: "Track Progress at Checkpoints", desc: "Weekly mini-assessments measure improvement and automatically adjust upcoming study sessions." },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">{item.step}</div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("allied.mltCountryPage.getYourPersonalizedPlan")}</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
            Create an account to generate a {cc.examBoard} study plan tailored to your diagnostic results, exam date, and available study time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/allied-health/mlt/${cc.country}/exam-prep`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-exam-prep-from-plan">
              Explore Exam Prep <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/free-questions`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200" data-testid="link-free-from-plan">
              Try Free Questions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FreeQuestionsContent({ cc }: { cc: CountryConfig }) {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-600 mb-6">Sample {cc.examBoard} practice questions from every laboratory discipline with full rationales — no account required.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {MLT_DISCIPLINES.slice(0, 6).map((discipline, i) => (
            <div key={discipline} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all" data-testid={`free-q-discipline-${i}`}>
              <FlaskConical className="w-5 h-5 text-purple-500 mb-2" />
              <h3 className="font-medium text-gray-900 text-sm mb-1">{discipline}</h3>
              <p className="text-xs text-gray-500">{t("allied.mltCountryPage.sampleQuestionsWithDetailedRationales")}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{t("allied.mltCountryPage.whatsIncludedInFreeQuestions")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Multiple-choice questions from all 16 disciplines", icon: "✓" },
              { label: `${cc.regionKey === "CA" ? "SI" : "Conventional"} unit lab values matching ${cc.examBoard} exam format`, icon: "✓" },
              { label: "Full rationale for correct and incorrect options", icon: "✓" },
              { label: "Cognitive level tagging (recall, application, analysis)", icon: "✓" },
              { label: `${cc.examBoard} blueprint category alignment`, icon: "✓" },
              { label: "No account required to start practicing", icon: "✓" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("allied.mltCountryPage.unlockFullTestBank")}</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
            Get access to thousands of {cc.examBoard}-aligned questions with adaptive difficulty, detailed analytics, and exam simulation mode.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-pricing-from-free">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/allied-health/mlt/${cc.country}/exam-prep`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200" data-testid="link-exam-prep-from-free">
              Explore Exam Prep
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQContent({ cc }: { cc: CountryConfig }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = getCountryFAQ(cc);
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                data-testid={`button-faq-${i}`}
              >
                <HelpCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="font-medium text-gray-900 flex-1">{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 pl-13 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${i}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderPageContent(pageType: MltPageType, cc: CountryConfig) {
  switch (pageType) {
    case "exam-prep": return <ExamPrepContent cc={cc} />;
    case "lessons": return <LessonsContent cc={cc} />;
    case "flashcards": return <FlashcardsContent cc={cc} />;
    case "practice-exams": return <PracticeExamsContent cc={cc} />;
    case "study-plan": return <StudyPlanContent cc={cc} />;
    case "free-questions": return <FreeQuestionsContent cc={cc} />;
    case "faq": return <FAQContent cc={cc} />;
    default: return null;
  }
}

export default function MltCountryPage({ country, pageType }: { country: MltCountry; pageType: MltPageType }) {
  const cc = COUNTRY_CONFIGS[country];
  if (!cc) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.mltCountryPage.pageNotFound")}</h1>
        <Link href="/allied-health/mlt" className="text-purple-600 font-medium hover:underline">{t("allied.mltCountryPage.backToMltHub")}</Link>
      </div>
    );
  }

  const pageConfig = PAGE_CONFIGS[pageType];
  const faqs = pageType === "faq" ? getCountryFAQ(cc) : [];

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 2, "name": "MLT Exam Prep", "item": "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", "position": 3, "name": `${cc.label}`, "item": `https://www.nursenest.ca/allied-health/mlt/${cc.country}/exam-prep` },
      { "@type": "ListItem", "position": 4, "name": pageConfig.title(cc), "item": `https://www.nursenest.ca/allied-health/mlt/${cc.country}/${pageType}` },
    ],
  };

  const additionalSD: Record<string, any>[] = [breadcrumbStructuredData];
  if (pageType === "faq" && faqs.length > 0) {
    additionalSD.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    });
  }

  const navLinks = [
    { slug: "exam-prep" as const, label: "Exam Prep" },
    { slug: "lessons" as const, label: "Lessons" },
    { slug: "flashcards" as const, label: "Flashcards" },
    { slug: "practice-exams" as const, label: "Practice Exams" },
    { slug: "study-plan" as const, label: "Study Plan" },
    { slug: "free-questions" as const, label: "Free Questions" },
    { slug: "faq" as const, label: "FAQ" },
  ];

  return (
    <div data-testid={`mlt-${country}-${pageType}`}>
      <AlliedSEO
        title={pageConfig.title(cc) + " | NurseNest Allied"}
        description={pageConfig.metaDescription(cc)}
        keywords={cc.seoKeywords[pageType]}
        canonicalPath={`/allied-health/mlt/${cc.country}/${pageType}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": pageConfig.title(cc),
          "description": pageConfig.metaDescription(cc),
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
        }}
        additionalStructuredData={additionalSD}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/" className="hover:text-purple-600">{t("allied.mltCountryPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/allied-health/mlt/${cc.country}/exam-prep`} className="hover:text-purple-600">{cc.label}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium">{navLinks.find(n => n.slug === pageType)?.label || pageType}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{cc.flag}</span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
              {cc.examBoard}
            </div>
            <Link href={`/allied-health/mlt/${cc.otherCountry}/${pageType}`} className="text-xs text-gray-500 hover:text-purple-600 ml-auto" data-testid="link-switch-country">
              Switch to {cc.otherLabel} →
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
            {pageConfig.h1(cc)}
          </h1>
        </div>
      </section>

      <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm overflow-x-auto" data-testid="mlt-subnav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 min-w-max">
            {navLinks.map(link => (
              <Link
                key={link.slug}
                href={`/allied-health/mlt/${cc.country}/${link.slug}`}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${pageType === link.slug ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:text-purple-700 hover:bg-purple-50/50"}`}
                data-testid={`nav-${link.slug}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {renderPageContent(pageType, cc)}

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.mltCountryPage.relatedMltResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/allied-health/mlt" className="text-sm text-purple-600 hover:underline" data-testid="link-mlt-hub">{t("allied.mltCountryPage.mltExamPrepHub")}</Link>
            <Link href={`/allied-health/mlt/${cc.otherCountry}/exam-prep`} className="text-sm text-purple-600 hover:underline" data-testid="link-other-country">{cc.otherLabel} ({cc.country === "canada" ? "ASCP" : "CSMLS"}) Exam Prep →</Link>
            <Link href="/allied-health/mlt" className="text-sm text-purple-600 hover:underline" data-testid="link-career-overview">{t("allied.mltCountryPage.mltCareerOverview")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
