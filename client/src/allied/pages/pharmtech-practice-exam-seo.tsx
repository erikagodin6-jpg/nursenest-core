import { Link } from "wouter";
import { useState } from "react";
import {
  ArrowRight, BookOpen, FileText, Brain, Target,
  CheckCircle2, HelpCircle, ChevronDown, ChevronRight,
  Award, BarChart3, Clock, Shield, Pill, Sparkles,
  GraduationCap, Eye, EyeOff, Lightbulb
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    stem: "A pharmacy technician receives a prescription for amoxicillin 500 mg capsules, #30, with directions: \"Take 1 capsule PO TID x 10 days.\" What is the day supply for this prescription?",
    options: ["7 days", "10 days", "15 days", "30 days"],
    correctIndex: 1,
    explanation: "The directions indicate 1 capsule three times daily (TID) for 10 days. 1 × 3 = 3 capsules per day. 30 capsules ÷ 3 per day = 10-day supply. The sig explicitly states 10 days, confirming the calculation.",
    category: "Prescription Processing"
  },
  {
    id: 2,
    stem: "Which DEA schedule classification applies to hydrocodone combination products such as Vicodin (hydrocodone/acetaminophen)?",
    options: ["Schedule I", "Schedule II", "Schedule III", "Schedule IV"],
    correctIndex: 1,
    explanation: "Since October 2014, all hydrocodone combination products (including Vicodin, Norco, and Lortab) are classified as Schedule II controlled substances. Prior to this reclassification, they were Schedule III. Schedule II drugs require a new prescription for each fill with no refills permitted.",
    category: "Pharmacy Law"
  },
  {
    id: 3,
    stem: "A patient's prescription calls for 240 mL of a 2% w/v solution. How many grams of active ingredient are needed?",
    options: ["2.4 g", "4.8 g", "24 g", "48 g"],
    correctIndex: 1,
    explanation: "A 2% w/v solution contains 2 grams per 100 mL. For 240 mL: (2 g / 100 mL) × 240 mL = 4.8 grams. Weight/volume percent (w/v) always means grams of solute per 100 mL of solution.",
    category: "Dosage Calculations"
  },
  {
    id: 4,
    stem: "Which of the following medications requires a MedGuide to be dispensed with every fill?",
    options: ["Amoxicillin", "Lisinopril", "Warfarin", "Omeprazole"],
    correctIndex: 2,
    explanation: "Warfarin (Coumadin) requires a Medication Guide with each dispensing due to its narrow therapeutic index and serious bleeding risks. The FDA mandates MedGuides for medications that pose serious risks, require special monitoring, or have complex dosing instructions.",
    category: "Patient Safety"
  },
  {
    id: 5,
    stem: "According to USP <797>, what is the maximum beyond-use date (BUD) for a low-risk compounded sterile preparation (CSP) stored at controlled room temperature?",
    options: ["12 hours", "24 hours", "48 hours", "28 days"],
    correctIndex: 2,
    explanation: "Under USP <797> standards, low-risk level CSPs stored at controlled room temperature (20-25°C) have a maximum BUD of 48 hours. If refrigerated, the BUD extends to 14 days. These limits apply when compounding conditions meet all low-risk requirements.",
    category: "Compounding"
  },
  {
    id: 6,
    stem: "Which suffix is associated with the angiotensin II receptor blocker (ARB) drug class?",
    options: ["-pril", "-olol", "-sartan", "-statin"],
    correctIndex: 2,
    explanation: "The suffix -sartan identifies angiotensin II receptor blockers (ARBs) such as losartan, valsartan, and irbesartan. -pril indicates ACE inhibitors, -olol indicates beta-blockers, and -statin indicates HMG-CoA reductase inhibitors. Recognizing drug class suffixes is a high-yield PTCB exam strategy.",
    category: "Pharmacology"
  },
  {
    id: 7,
    stem: "A pharmacy technician notices that two medications on the shelf look very similar in packaging. According to ISMP guidelines, which strategy should be used to differentiate look-alike drug names?",
    options: ["Color-coded labels only", "Tall Man Lettering", "Alphabetical shelving", "Larger font size"],
    correctIndex: 1,
    explanation: "The Institute for Safe Medication Practices (ISMP) recommends Tall Man Lettering (e.g., hydrALAZINE vs. hydrOXYzine) to visually differentiate look-alike/sound-alike (LASA) drug names. This strategy capitalizes distinguishing letters to reduce medication errors during order entry and dispensing.",
    category: "Medication Safety"
  },
  {
    id: 8,
    stem: "How many refills are permitted for a prescription of alprazolam (Xanax), a Schedule IV controlled substance?",
    options: ["No refills", "Up to 3 refills within 6 months", "Up to 5 refills within 6 months", "Up to 11 refills within 1 year"],
    correctIndex: 2,
    explanation: "Schedule III, IV, and V controlled substances may be refilled up to 5 times within 6 months of the date written. Alprazolam (Xanax) is a Schedule IV benzodiazepine. Schedule II substances (e.g., oxycodone, methylphenidate) do not permit any refills and require a new prescription each time.",
    category: "Pharmacy Law"
  },
  {
    id: 9,
    stem: "A prescription reads: \"Metformin 500 mg, #180, Sig: 1 tab PO BID with meals.\" How many days will this prescription last?",
    options: ["30 days", "60 days", "90 days", "180 days"],
    correctIndex: 2,
    explanation: "BID means twice daily. 1 tablet × 2 times/day = 2 tablets per day. 180 tablets ÷ 2 per day = 90-day supply. This is a typical 90-day maintenance supply commonly used for chronic medications like metformin to reduce pharmacy visits and improve adherence.",
    category: "Prescription Processing"
  },
  {
    id: 10,
    stem: "Which federal law established the requirement for child-resistant packaging on most prescription medications?",
    options: ["Durham-Humphrey Amendment (1951)", "Kefauver-Harris Amendment (1962)", "Poison Prevention Packaging Act (1970)", "OBRA-90 (1990)"],
    correctIndex: 2,
    explanation: "The Poison Prevention Packaging Act (PPPA) of 1970 requires child-resistant containers for most prescription and certain OTC medications. Exceptions include sublingual nitroglycerin, oral contraceptives, and situations where a patient or prescriber requests non-child-resistant packaging.",
    category: "Pharmacy Law"
  }
];

const EXAM_TOPICS = [
  { title: "Medications (40%)", desc: "Drug classifications, brand/generic names, mechanisms, indications, side effects, interactions, and the Top 200 drugs", icon: Pill },
  { title: "Patient Safety & QA (26.25%)", desc: "Medication error prevention, high-alert drugs, ISMP guidelines, Tall Man Lettering, and quality improvement", icon: Shield },
  { title: "Order Entry & Processing (21.25%)", desc: "Prescription interpretation, sig codes, DAW codes, insurance billing, prior authorizations, and day supply calculations", icon: FileText },
  { title: "Federal Requirements (12.5%)", desc: "DEA scheduling, controlled substances, HIPAA, OBRA-90, USP compounding standards, and drug safety laws", icon: GraduationCap },
];

const FAQ_DATA = [
  {
    q: "What is on the pharmacy technician exam?",
    a: "The PTCB Pharmacy Technician Certification Exam (PTCE) covers four knowledge areas: Medications (40%), Patient Safety and Quality Assurance (26.25%), Order Entry and Processing (21.25%), and Federal Requirements (12.5%). Topics include drug classifications, dosage calculations, pharmacy law, compounding, prescription processing, and medication safety. The ExCPT exam covers similar content with slightly different weighting."
  },
  {
    q: "How many questions are on pharmacy technician exams?",
    a: "The PTCB exam (PTCE) has 90 multiple-choice questions, of which 80 are scored and 10 are unscored pretest questions. You have 2 hours to complete the exam. A scaled passing score of 1400 out of 1600 is required. The ExCPT exam has 100 multiple-choice questions (90 scored, 10 pretest) with a 2-hour time limit."
  },
  {
    q: "What should pharmacy technicians study first?",
    a: "Start with Medications (the largest domain at 40%) — focus on the Top 200 drugs, brand/generic name pairs, and drug class suffixes (-pril, -sartan, -olol, -statin). Then move to Patient Safety (26.25%), which includes high-alert medications and error prevention. Finally, cover Order Entry and Federal Requirements. Use practice questions throughout to reinforce learning and identify weak areas early."
  },
  {
    q: "How many practice questions should I do before the PTCB exam?",
    a: "Most successful candidates complete 300-500 practice questions before their exam. Focus on quality over quantity — review every rationale carefully, even for questions you answer correctly. Our platform provides 1,500+ exam-authentic questions with detailed explanations to help you understand the reasoning behind each answer."
  },
  {
    q: "Are practice exam questions the same as the real PTCB exam?",
    a: "Practice questions are not identical to the actual exam, but high-quality practice questions are mapped to the same content areas and difficulty level as the PTCB blueprint. Our questions are written to mirror the format, complexity, and reasoning required on the real exam so you're fully prepared."
  },
  {
    q: "What is the best way to use practice exam questions?",
    a: "Take practice questions in timed sessions to simulate exam conditions. After each session, review every answer — especially wrong answers — and read the full rationale. Track your performance by domain to identify weak areas, then focus study time on those topics. Alternate between untimed study mode (for learning) and timed exam mode (for building speed and confidence)."
  }
];

function QuestionPreview({ question, index }: { question: typeof SAMPLE_QUESTIONS[0]; index: number }) {
  const { t } = useI18n();
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleReveal = () => {
    setShowAnswer(!showAnswer);
    if (!showAnswer) setSelectedOption(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-testid={`question-preview-${index}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            <Target className="w-3 h-3" />
            {question.category}
          </span>
          <span className="text-xs text-gray-400">Question {index + 1}</span>
        </div>
        <p className="text-gray-900 font-medium leading-relaxed mb-4" data-testid={`question-stem-${index}`}>{question.stem}</p>
        <div className="space-y-2 mb-4" role="radiogroup" aria-label={`Answer options for question ${index + 1}`}>
          {question.options.map((opt, i) => {
            let optClass = "w-full text-left border rounded-xl px-4 py-3 text-sm transition-all ";
            if (showAnswer) {
              if (i === question.correctIndex) {
                optClass += "bg-green-50 border-green-300 text-green-800";
              } else if (i === selectedOption && i !== question.correctIndex) {
                optClass += "bg-red-50 border-red-300 text-red-700";
              } else {
                optClass += "bg-gray-50 border-gray-200 text-gray-400";
              }
            } else if (selectedOption === i) {
              optClass += "bg-teal-50 border-teal-300 text-teal-800";
            } else {
              optClass += "border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer";
            }
            return (
              <button
                key={i}
                type="button"
                className={optClass}
                onClick={() => !showAnswer && setSelectedOption(i)}
                disabled={showAnswer}
                aria-pressed={selectedOption === i}
                data-testid={`question-${index}-option-${i}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleReveal}
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          data-testid={`question-${index}-reveal`}
        >
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnswer ? "Hide Answer" : "Reveal Answer"}
        </button>
      </div>
      {showAnswer && (
        <div className="bg-green-50 border-t border-green-100 p-6" data-testid={`question-${index}-explanation`}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">
                Correct Answer: {String.fromCharCode(65 + question.correctIndex)}. {question.options[question.correctIndex]}
              </p>
              <p className="text-sm text-green-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PharmtechPracticeExamSeo() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechPracticeExamSeo.pharmacyTechnicianPracticeExamQuestions")}
        description={t("allied.pharmtechPracticeExamSeo.practicePharmacyTechnicianCertificationExam")}
        keywords="pharmacy technician practice questions, pharmacy tech exam questions, pharmacy technician certification practice exam, PTCB practice test, ExCPT practice questions, pharmacy tech sample questions, pharmacy technician exam prep"
        canonicalPath="/allied-health/pharmacy-technician/practice-exam-questions"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_DATA.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Pharmacy Technician Practice Exam Questions — Free PTCB & ExCPT Sample Questions",
            description: "Practice pharmacy technician certification exam questions with detailed answer explanations covering all PTCB and ExCPT domains.",
            author: { "@type": "Organization", name: "NurseNest Allied" },
            publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
            datePublished: "2026-03-12",
            dateModified: "2026-03-12",
            mainEntityOfPage: "https://www.nursenest.ca/allied-health/pharmacy-technician/practice-exam-questions"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Practice Exam Questions", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/practice-exam-questions" }
            ]
          }
        ]}
      />

      <div data-testid="pharmtech-practice-exam-seo-page">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 sm:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBWMkgyVjRoMzR6TTIgMzBoMzR2Mkgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label={t("allied.pharmtechPracticeExamSeo.breadcrumb")} data-testid="breadcrumb-nav">
              <Link href="/" className="hover:text-teal-600">{t("allied.pharmtechPracticeExamSeo.allied")}</Link>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechPracticeExamSeo.pharmacyTechnician")}</Link>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-green-700 font-medium">{t("allied.pharmtechPracticeExamSeo.practiceExamQuestions")}</span>
            </nav>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <Pill className="w-4 h-4" />
                PTCB · ExCPT Exam Prep
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hero-title">
                Pharmacy Technician<br />
                <span className="text-green-600">{t("allied.pharmtechPracticeExamSeo.practiceExamQuestions2")}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
                Sharpen your PTCB and ExCPT exam readiness with free sample questions covering pharmacology, dosage calculations, pharmacy law, compounding, and patient safety — each with detailed answer explanations so you learn the reasoning behind every correct answer.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all" data-testid="button-start-quiz">
                  <BookOpen className="w-4 h-4" /> Start 10-Question Quiz
                </Link>
                <Link href="/allied-health/pharmacy-technician/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-full-exam">
                  <FileText className="w-4 h-4" /> Start Full Practice Exam
                </Link>
                <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-study-flashcards">
                  <Brain className="w-4 h-4" /> Study Flashcards
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-intro">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t("allied.pharmtechPracticeExamSeo.whyPracticeExamQuestionsMatter")}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Passing the PTCB or ExCPT certification exam opens the door to a rewarding career as a pharmacy technician. But memorizing drug names and pharmacy law alone isn't enough — you need to practice applying your knowledge under exam conditions. Research consistently shows that active recall through practice questions is one of the most effective study strategies for long-term retention and exam success.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our practice exam questions are mapped to the official PTCB and ExCPT exam blueprints, covering every tested domain at the appropriate difficulty level. Each question includes a detailed explanation that teaches you the clinical reasoning and exam-taking logic — not just which answer is correct, but <em>{t("allied.pharmtechPracticeExamSeo.why")}</em> it's correct and why the other options are wrong.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 py-16" data-testid="section-exam-topics">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("allied.pharmtechPracticeExamSeo.whatPharmacyTechnicianExamsTest")}</h2>
            <p className="text-gray-500 mb-8">{t("allied.pharmtechPracticeExamSeo.thePtcbExamCoversFour")}</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {EXAM_TOPICS.map((topic, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid={`exam-topic-${i}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                      <topic.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-study-strategy">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t("allied.pharmtechPracticeExamSeo.studyStrategyHowToUse")}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("allied.pharmtechPracticeExamSeo.startWithADiagnosticAssessment")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t("allied.pharmtechPracticeExamSeo.takeABaselineQuizAcross")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("allied.pharmtechPracticeExamSeo.focusOnWeakAreasFirst")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t("allied.pharmtechPracticeExamSeo.spendMoreTimeOnDomains")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("allied.pharmtechPracticeExamSeo.readEveryRationaleEvenCorrect")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t("allied.pharmtechPracticeExamSeo.understandingWhyTheWrongAnswers")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("allied.pharmtechPracticeExamSeo.simulateExamConditions")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t("allied.pharmtechPracticeExamSeo.takeTimedPracticeExamsTo")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-700 text-sm font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("allied.pharmtechPracticeExamSeo.reinforceWithFlashcardsAndSpaced")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t("allied.pharmtechPracticeExamSeo.combinePracticeQuestionsWithFlashcard")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-gray-50 to-green-50/30 py-16" data-testid="section-sample-questions">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("allied.pharmtechPracticeExamSeo.samplePracticeQuestions")}</h2>
              <p className="text-gray-500">{t("allied.pharmtechPracticeExamSeo.tryTheseRealExamstyleQuestions")}</p>
            </div>
            <div className="space-y-6">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <QuestionPreview key={q.id} question={q} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">{t("allied.pharmtechPracticeExamSeo.readyForMoreAccessOur")}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all" data-testid="button-more-questions">
                  <BookOpen className="w-4 h-4" /> Start 10-Question Quiz
                </Link>
                <Link href="/allied-health/pharmacy-technician/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-full-exam-bottom">
                  <FileText className="w-4 h-4" /> Start Full Practice Exam
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-features">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("allied.pharmtechPracticeExamSeo.whyStudentsChooseNursenestAllied")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "1,500+ Questions", desc: "Exam-authentic questions mapped to the PTCB and ExCPT blueprints" },
              { icon: Lightbulb, title: "Detailed Rationales", desc: "600+ word explanations teaching the clinical reasoning behind each answer" },
              { icon: BarChart3, title: "Performance Analytics", desc: "Track your scores by domain and identify weak areas automatically" },
              { icon: Clock, title: "Adaptive Engine", desc: "CAT-style difficulty adjustment simulating real exam conditions" },
            ].map((feat, i) => (
              <div key={i} className="text-center p-6" data-testid={`feature-${i}`}>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feat.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feat.title}</h3>
                <p className="text-sm text-gray-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-16" data-testid="section-faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <HelpCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("allied.pharmtechPracticeExamSeo.frequentlyAskedQuestions")}</h2>
            </div>
            <div className="space-y-3" data-testid="faq-section">
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-panel-${i}`}
                    data-testid={`faq-toggle-${i}`}
                  >
                    <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "text-green-600 rotate-180" : "text-gray-400"}`} aria-hidden="true" />
                  </button>
                  {openFaq === i && (
                    <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-toggle-${i}`} className="px-6 pb-4" data-testid={`faq-answer-${i}`}>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" data-testid="section-internal-links">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("allied.pharmtechPracticeExamSeo.exploreMorePharmacyTechResources")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/allied-health/pharmacy-technician/exams" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all" data-testid="link-exams">
                <FileText className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("allied.pharmtechPracticeExamSeo.practiceExams")}</p>
                  <p className="text-xs text-gray-500">{t("allied.pharmtechPracticeExamSeo.fulllengthTimedPtcbSimulations")}</p>
                </div>
              </Link>
              <Link href="/allied-health/pharmacy-technician/flashcards" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all" data-testid="link-flashcards">
                <Brain className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("allied.pharmtechPracticeExamSeo.flashcards")}</p>
                  <p className="text-xs text-gray-500">{t("allied.pharmtechPracticeExamSeo.spacedRepetitionForDrugNames")}</p>
                </div>
              </Link>
              <Link href="/allied-health/pharmacy-technician/study-guide" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all" data-testid="link-study-guide">
                <GraduationCap className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("allied.pharmtechPracticeExamSeo.studyGuide")}</p>
                  <p className="text-xs text-gray-500">{t("allied.pharmtechPracticeExamSeo.comprehensivePtcbDomainCoverage")}</p>
                </div>
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all" data-testid="link-practice-questions">
                <BookOpen className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("allied.pharmtechPracticeExamSeo.testBank")}</p>
                  <p className="text-xs text-gray-500">{t("allied.pharmtechPracticeExamSeo.1500QuestionsWithRationales")}</p>
                </div>
              </Link>
              <Link href="/allied-health/pharmacy-technician/lessons" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all" data-testid="link-lessons">
                <Award className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("allied.pharmtechPracticeExamSeo.lessons")}</p>
                  <p className="text-xs text-gray-500">{t("allied.pharmtechPracticeExamSeo.expertwrittenPharmacyTechContent")}</p>
                </div>
              </Link>
              <Link href="/diagnostic?career=pharmacy-tech" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all" data-testid="link-diagnostic">
                <Target className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("allied.pharmtechPracticeExamSeo.freeDiagnostic")}</p>
                  <p className="text-xs text-gray-500">{t("allied.pharmtechPracticeExamSeo.15questionReadinessAssessment")}</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16" data-testid="section-cta-bottom">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("allied.pharmtechPracticeExamSeo.readyToPassYourPharmacy")}</h2>
            <p className="text-green-100 mb-8">{t("allied.pharmtechPracticeExamSeo.joinThousandsOfPharmacyTechnician")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all" data-testid="button-cta-start">
                <BookOpen className="w-4 h-4" /> Start Practicing Free
              </Link>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 border border-green-500 transition-all" data-testid="button-cta-pricing">
                <Sparkles className="w-4 h-4" /> View Plans
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
