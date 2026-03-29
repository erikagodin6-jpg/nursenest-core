import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useState } from "react";
import {
  ArrowRight, BookOpen, FileText, Brain, Zap, GraduationCap,
  BarChart3, Target, CheckCircle2, Check, X, ChevronDown,
  HelpCircle, Stethoscope, Layers, Activity, Sparkles, Clock,
} from "lucide-react";
import { EndOfContentLeadCapture } from "@/components/lead-capture";

import { useI18n } from "@/lib/i18n";
const STATS = [
  { value: "6,000+", label: "Lessons" },
  { value: "2,400+", label: "Questions" },
  { value: "15", label: "Simulators" },
  { value: "15", label: "Languages" },
];

const EXAM_BADGES = [
  { label: "NCLEX-RN", color: "bg-blue-100 text-blue-700" },
  { label: "REX-PN", color: "bg-indigo-100 text-indigo-700" },
  { label: "NP Certification", color: "bg-purple-100 text-purple-700" },
];

const PAIN_POINTS = [
  { title: "Content Overload", desc: "Thousands of pages with no clear path through what actually matters for your exam.", icon: BookOpen },
  { title: "Test Anxiety", desc: "Feeling unprepared because you've never experienced realistic exam conditions before test day.", icon: Activity },
  { title: "Poor Study Strategy", desc: "Spending hours studying the wrong topics because you don't know your weak areas.", icon: Target },
  { title: "Passive Learning", desc: "Reading notes without active recall or clinical application — the lowest-yield study method.", icon: Brain },
  { title: "Outdated Resources", desc: "Using study materials that don't reflect current exam blueprints or evidence-based practice.", icon: Clock },
  { title: "No Feedback Loop", desc: "Answering questions without understanding why you got them wrong or how to improve.", icon: BarChart3 },
];

const FEATURES = [
  { title: "Adaptive Lessons", desc: "6,000+ pathophysiology lessons covering every body system with clinical depth and exam-aligned content.", icon: BookOpen, link: "/lessons" },
  { title: "Test Bank", desc: "2,400+ NCLEX-style questions with detailed rationales explaining the clinical reasoning behind every answer.", icon: FileText, link: "/free-practice" },
  { title: "Mock Exams", desc: "Blueprint-weighted timed exams with adaptive CAT-style simulation matching real exam conditions.", icon: Layers, link: "/mock-exams" },
  { title: "Clinical Simulators", desc: "15 interactive simulators including OSCE practice, clinical skills lab, and unfolding case studies.", icon: Stethoscope, link: "/simulators/osce" },
  { title: "Custom Study Plan", desc: "Personalized study schedules that identify your weak areas and prioritize high-yield topics first.", icon: Sparkles, link: "/dashboard" },
  { title: "Flashcards", desc: "Spaced repetition flashcard decks across all exam domains with active recall methodology.", icon: Brain, link: "/flashcards" },
];

const NCLEX_RN_DOMAINS = [
  "Management of Care",
  "Safety & Infection Control",
  "Health Promotion & Maintenance",
  "Psychosocial Integrity",
  "Basic Care & Comfort",
  "Pharmacological Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation",
];

const REX_PN_DOMAINS = [
  "Professional Practice",
  "Ethical Practice",
  "Legal Practice",
  "Foundations of Practice",
  "Collaborative Practice",
];

const NP_DOMAINS = [
  "Health Promotion & Disease Prevention",
  "Assessment & Diagnosis",
  "Clinical Management & Pharmacology",
  "Professional Role & Policy",
  "Research & Evidence-Based Practice",
];

const STUDY_MISTAKES = [
  { title: "Studying without a plan", desc: "Random topic hopping wastes time. A structured study schedule based on exam blueprints and your weak areas is 3x more effective than passive review." },
  { title: "Reading instead of practicing", desc: "Active recall through practice questions builds stronger neural pathways than re-reading notes. You need to practice retrieving information, not just recognizing it." },
  { title: "Ignoring the exam blueprint", desc: "Each exam weights topics differently. If you don't know the blueprint, you'll over-study low-yield topics and under-prepare for high-frequency content." },
  { title: "Never simulating exam conditions", desc: "Test anxiety comes from unfamiliarity. Taking timed, full-length practice exams under realistic conditions builds confidence and pacing skills." },
  { title: "Skipping rationales after wrong answers", desc: "The rationale is where learning happens. Understanding WHY an answer is correct teaches you the clinical reasoning pattern you'll need on exam day." },
];

const COMPARISON_DATA = [
  { feature: "Lesson Library", nursenest: "6,000+ clinical lessons", selfstudy: "Scattered notes", competitors: "500–1,000 lessons" },
  { feature: "Question Rationales", nursenest: "Detailed clinical reasoning", selfstudy: "No rationales", competitors: "Brief explanations" },
  { feature: "Exam Simulation", nursenest: "Adaptive CAT-style engine", selfstudy: "No simulation", competitors: "Static linear tests" },
  { feature: "Weak-Area Targeting", nursenest: "Adaptive analytics", selfstudy: "Self-assessment only", competitors: "Basic score reports" },
  { feature: "Clinical Simulators", nursenest: "15 interactive sims", selfstudy: "Not available", competitors: "Limited or none" },
  { feature: "Study Plan", nursenest: "Personalized schedule", selfstudy: "Self-directed", competitors: "Generic templates" },
  { feature: "Multilingual Support", nursenest: "15 languages", selfstudy: "English only", competitors: "English only" },
  { feature: "Blueprint Alignment", nursenest: "NCLEX-RN, REX-PN, NP", selfstudy: "Unknown coverage", competitors: "Single exam focus" },
];

const SAMPLE_QUESTIONS = [
  {
    type: "Select All That Apply (SATA)",
    question: "A nurse is caring for a client diagnosed with heart failure. Which of the following assessment findings should the nurse expect? (Select all that apply.)",
    options: [
      "A) Jugular vein distension",
      "B) Decreased blood pressure",
      "C) Peripheral edema",
      "D) Crackles in lung bases",
      "E) Weight loss",
    ],
    correct: [0, 2, 3],
    rationale: "Heart failure causes fluid volume overload. JVD occurs from right-sided failure backing up into venous circulation. Peripheral edema results from increased hydrostatic pressure. Crackles indicate pulmonary congestion from left-sided failure. BP is often elevated (not decreased) due to compensatory mechanisms, and weight gain (not loss) occurs from fluid retention.",
  },
  {
    type: "Priority / Clinical Judgment",
    question: "A nurse receives report on four clients. Which client should the nurse assess first?",
    options: [
      "A) A client 1 day post-op with a temperature of 37.8°C (100°F)",
      "B) A client with COPD and an oxygen saturation of 89%",
      "C) A client with diabetes reporting a blood glucose of 180 mg/dL",
      "D) A client with pneumonia and new-onset confusion",
    ],
    correct: [3],
    rationale: "New-onset confusion in a client with pneumonia suggests worsening infection, possible sepsis, or hypoxemia — all life-threatening. This is an acute change in mental status requiring immediate assessment. The post-op temp is expected within 24 hours. SpO2 of 89% may be baseline for COPD. BG of 180 is elevated but not critical.",
  },
];

const FAQ_DATA = [
  { question: "How many questions do I need to pass the NCLEX-RN?", answer: "The NCLEX-RN uses Computer Adaptive Testing (CAT), which adjusts to your ability level. You'll answer between 85–150 questions. The exam ends when the algorithm determines with 95% confidence whether you're above or below the passing standard. Our mock exams simulate this adaptive format so you're prepared for the real experience." },
  { question: "Is this for Canadian or American nursing exams?", answer: "NurseNest covers both. We support NCLEX-RN (used in the US and Canada for RN licensure), REX-PN (Canada's practical nursing exam), and NP certification exams. Content is mapped to each exam's specific blueprint, and we include jurisdiction-specific practice considerations." },
  { question: "What's the difference between RPN and RN content?", answer: "RPN (Registered Practical Nurse) content covers REX-PN exam domains including professional practice, ethical practice, legal practice, foundations of practice, and collaborative practice. RN content covers NCLEX-RN Client Needs categories with more advanced pathophysiology, pharmacology, and clinical decision-making. Each track is specifically aligned to its exam blueprint." },
  { question: "How is NurseNest different from YouTube or free resources?", answer: "Free resources lack structure, exam alignment, and active learning methodology. NurseNest provides blueprint-mapped content, adaptive practice exams, smart weak-area targeting, detailed rationales for every question, and performance analytics. Our content is written by nurse educators and clinically verified — not scraped from random sources." },
  { question: "Can I use NurseNest on my phone?", answer: "Yes, NurseNest is fully responsive and works on any device — phone, tablet, or desktop. Study during commutes, between clinical shifts, or at home. Your progress syncs across all devices automatically." },
  { question: "How often is new content added?", answer: "We add new lessons, questions, and practice materials regularly. Our content team continuously updates materials to reflect the latest exam blueprints, clinical guidelines, and evidence-based practice standards. When exam formats change, we update our content to match." },
  { question: "What if I'm an internationally educated nurse (IEN)?", answer: "NurseNest supports 15 languages and is designed to help internationally educated nurses prepare for Canadian and American licensure exams. Our adaptive system identifies knowledge gaps specific to your background and creates a targeted study plan." },
  { question: "Do you offer a free trial?", answer: "Yes! You can access free diagnostic assessments, sample lessons, study decks, and a limited number of practice questions at no cost. This lets you experience the platform quality before committing to a subscription. No credit card required to start." },
  { question: "How long should I study before taking my exam?", answer: "Study timelines vary based on your background and readiness level. Most candidates study 6-12 weeks with dedicated daily practice. Our study planner creates a personalized schedule based on your diagnostic results, targeting weak areas first for maximum efficiency." },
  { question: "What's included in each subscription tier?", answer: "Free tier includes diagnostic assessments, sample lessons, and limited practice questions. Paid tiers unlock the full question bank with detailed rationales, unlimited mock exams, all 15 clinical simulators, personalized study planner, performance analytics, and multilingual support. Visit our pricing page for detailed tier comparisons." },
  { question: "Can I switch between RPN, RN, and NP content?", answer: "Yes, you can access content across all exam tracks based on your subscription tier. Many students preparing for RN exams also review foundational RPN content for reinforcement, or explore NP-level content for deeper clinical understanding." },
  { question: "Is NurseNest accredited or endorsed?", answer: "NurseNest is an independent educational resource created by experienced nurse educators and clinical professionals. While we are not affiliated with any licensing body, our content is meticulously aligned to official exam blueprints (NCSBN for NCLEX-RN, CNREX for REX-PN) and follows evidence-based clinical practice guidelines." },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

function ExamBlueprintCard({ title, domains, color }: { title: string; domains: string[]; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow" data-testid={`card-blueprint-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className={`text-lg font-bold mb-4 ${color}`}>{title}</h3>
      <ul className="space-y-2">
        {domains.map((domain, i) => (
          <li key={i} className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{domain}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NursingHub() {
  const faqStructuredData = buildFaqStructuredData(
    FAQ_DATA.map(f => ({ question: f.question, answer: f.answer }))
  );

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Nursing Exam Prep - NCLEX-RN, REX-PN & NP",
    "description": "Pass your nursing certification with 6000+ lessons, adaptive mock exams, clinical simulators, and smart study tools. Covers NCLEX-RN, REX-PN, and NP exams.",
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "educationalLevel": "Professional",
    "inLanguage": "en",
    "url": "https://www.nursenest.ca/nursing",
  };

  return (
    <div data-testid="page-nursing-hub">
      <Navigation />
      <SEO
        title={t("pages.nursingHub.nursingExamPrepNclexrnRexpn")}
        description={t("pages.nursingHub.passYourNursingCertificationWith")}
        keywords="nursing exam prep, NCLEX-RN, REX-PN, NP exam, nursing practice questions, mock nursing exam, nursing study guide, NCLEX prep, nursing flashcards, nursing certification"
        canonicalPath="/nursing"
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Exam Prep", url: "https://www.nursenest.ca/nursing" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4" data-testid="badge-exam-prep">
              Retention-Focused Learning System
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">
              Study Smarter. Retain More. Pass Your Nursing Exam.
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-subtitle">
              Our retention-focused nursing exam prep system uses active recall, spaced repetition, and clinical decision training to help you master NCLEX-RN, REx-PN, and NP certification content — and remember it on exam day.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {EXAM_BADGES.map(badge => (
                <span key={badge.label} className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`} data-testid={`badge-${badge.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-start-diagnostic">
                Start Free Diagnostic <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-browse-lessons">
                Browse Lessons
              </Link>
            </div>
            <div className="mt-4">
              <Link href="/exam-readiness" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors" data-testid="link-readiness-cta">
                <Target className="w-4 h-4" /> Check your exam readiness — see your probability of passing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HeroFeatureStrip />
      <HeroTrustIndicator />

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(stat => (
              <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase()}`}>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-core-problem">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-problem-h2">{t("pages.nursingHub.why15OfCandidatesFail")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nursingHub.theProblemIsntIntelligenceIts")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAIN_POINTS.map((point, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow" data-testid={`card-pain-${i}`}>
                <point.icon className="w-7 h-7 text-blue-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{point.title}</h3>
                <p className="text-sm text-gray-500">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-features-h2">{t("pages.nursingHub.yourCompleteStudySystem")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nursingHub.everythingYouNeedToPrepare")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Link key={f.title} href={f.link} className="group" data-testid={`card-feature-${f.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                  <f.icon className="w-7 h-7 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white" data-testid="section-blueprint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-blueprint-h2">{t("pages.nursingHub.knowYourExamBlueprint")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nursingHub.ourContentIsMappedDirectly")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExamBlueprintCard title={t("pages.nursingHub.nclexrn")} domains={NCLEX_RN_DOMAINS} color="text-blue-700" />
            <ExamBlueprintCard title={t("pages.nursingHub.rexpn")} domains={REX_PN_DOMAINS} color="text-indigo-700" />
            <ExamBlueprintCard title={t("pages.nursingHub.npCertification")} domains={NP_DOMAINS} color="text-purple-700" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-sample-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-sample-h2">{t("pages.nursingHub.tryItNow")}</h2>
            <p className="text-gray-600">{t("pages.nursingHub.experienceTheDepthAndQuality")}</p>
          </div>
          <div className="space-y-6">
            {SAMPLE_QUESTIONS.map((q, qi) => (
              <SampleQuestion key={qi} question={q} index={qi} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/free-practice" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-unlock-questions">
              Unlock 2,400+ More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-mistakes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-mistakes-h2">{t("pages.nursingHub.top5StudyMistakes")}</h2>
            <p className="text-gray-600">{t("pages.nursingHub.avoidTheseCommonPitfallsThat")}</p>
          </div>
          <div className="space-y-4">
            {STUDY_MISTAKES.map((mistake, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4" data-testid={`card-mistake-${i}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{mistake.title}</h3>
                  <p className="text-sm text-gray-500">{mistake.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-comparison">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-comparison-h2">{t("pages.nursingHub.nursenestVsSelfstudyVsCompetitors")}</h2>
            <p className="text-gray-600">{t("pages.nursingHub.seeWhyStudentsSwitchTo")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 min-w-[600px]">
              <div className="px-5 py-3 text-sm font-semibold text-gray-500">{t("pages.nursingHub.feature")}</div>
              <div className="px-5 py-3 text-sm font-semibold text-blue-700 text-center">NurseNest</div>
              <div className="px-5 py-3 text-sm font-semibold text-gray-400 text-center">{t("pages.nursingHub.selfstudy")}</div>
              <div className="px-5 py-3 text-sm font-semibold text-gray-400 text-center">{t("pages.nursingHub.competitors")}</div>
            </div>
            {COMPARISON_DATA.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 min-w-[600px] ${i < COMPARISON_DATA.length - 1 ? 'border-b border-gray-100' : ''}`} data-testid={`comparison-row-${i}`}>
                <div className="px-5 py-4 text-sm font-medium text-gray-700">{row.feature}</div>
                <div className="px-5 py-4 text-sm text-blue-700 text-center flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{row.nursenest}</span>
                </div>
                <div className="px-5 py-4 text-sm text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span>{row.selfstudy}</span>
                </div>
                <div className="px-5 py-4 text-sm text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span>{row.competitors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-faq-h2">{t("pages.nursingHub.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">{t("pages.nursingHub.everythingYouNeedToKnow")}</p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-h2">
            Ready to Pass Your Nursing Exam?
          </h2>
          <p className="text-blue-100 mb-4 text-lg">
            Join thousands of nursing students using NurseNest to prepare smarter, not harder.
          </p>
          <p className="text-blue-200 mb-8 text-sm">
            Starting at $19/month or included with your RN subscription. Free tier available — no credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/mock-exams" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-diagnostic">
              Start Free Diagnostic
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100" data-testid="section-explore-resources">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("pages.nursingHub.exploreNursingResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/rpn/questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-rpn-questions">
              <Target className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingHub.rpnQuestionsByTopic")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingHub.browseRpnPracticeQuestions")}</p>
              </div>
            </Link>
            <Link href="/rn/questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all" data-testid="link-rn-questions">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingHub.rnQuestionsByTopic")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingHub.browseRnPracticeQuestions")}</p>
              </div>
            </Link>
            <Link href="/np/questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all" data-testid="link-np-questions">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingHub.npQuestionsByTopic")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingHub.browseNpPracticeQuestions")}</p>
              </div>
            </Link>
            <Link href="/how-to-become-a-nurse/rpn" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-career-rpn">
              <GraduationCap className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingHub.howToBecomeAnRpn")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingHub.careerGuideAndExamInfo")}</p>
              </div>
            </Link>
            <Link href="/how-to-become-a-nurse/rn" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all" data-testid="link-career-rn">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingHub.howToBecomeAnRn")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingHub.careerGuideAndExamInfo2")}</p>
              </div>
            </Link>
            <Link href="/how-to-become-a-nurse/np" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all" data-testid="link-career-np">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingHub.howToBecomeAnNp")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingHub.careerGuideAndExamInfo3")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 border-t border-gray-100" data-testid="section-new-grad-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-indigo-100 text-indigo-700">
            <GraduationCap className="w-4 h-4" /> Graduating Soon?
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-new-grad-cta-title">{t("pages.nursingHub.readyForYourFirstNursing")}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Passed your exam? Our New Grad Career Hub has everything you need — interview prep with 100+ questions, resume templates, salary negotiation tools, and first-year survival guides.
          </p>
          <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200" data-testid="link-new-grad-hub">
            Explore New Grad Career Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <EndOfContentLeadCapture
        leadMagnetType="practice_questions"
        professionContext="nursing"
        source="nursing_hub"
      />

      <Footer />
    </div>
  );
}

function SampleQuestion({ question, index }: { question: typeof SAMPLE_QUESTIONS[0]; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6" data-testid={`card-sample-question-${index}`}>
      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mb-3">
        {question.type}
      </div>
      <p className="font-medium text-gray-900 mb-4">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt, oi) => (
          <div key={oi} className={`px-4 py-2.5 rounded-lg text-sm ${showAnswer && question.correct.includes(oi) ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-white border border-gray-100 text-gray-700'}`}>
            {opt}
            {showAnswer && question.correct.includes(oi) && <Check className="w-4 h-4 text-green-500 inline ml-2" />}
          </div>
        ))}
      </div>
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          data-testid={`button-show-answer-${index}`}
        >
          Show Answer & Rationale →
        </button>
      ) : (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" data-testid={`text-rationale-${index}`}>
          <p className="text-xs font-semibold text-blue-700 mb-1">{t("pages.nursingHub.rationale")}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.rationale}</p>
        </div>
      )}
    </div>
  );
}
