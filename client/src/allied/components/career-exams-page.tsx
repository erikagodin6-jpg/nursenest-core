import { Link } from "wouter";
import { useState } from "react";
import {
  Target, ChevronDown, Clock, ArrowRight, BookOpen,
  Brain, Zap, HelpCircle, FileText, BarChart3, GraduationCap
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import type { ProfessionHubData } from "@/allied/data/profession-hub-data";
import type { ExamEntry } from "@/allied/data/imaging-career-data";

import { useI18n } from "@/lib/i18n";
interface CareerExamsPageProps {
  hubData: ProfessionHubData;
  examEntries: ExamEntry[];
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Target; color: string }> = {
  diagnostic: { label: "Diagnostic Assessment", icon: BarChart3, color: "#4CAF50" },
  "topic-quiz": { label: "Topic Quiz", icon: BookOpen, color: "#2196F3" },
  "practice-set": { label: "Practice Exam", icon: FileText, color: "#FF9800" },
};

export default function CareerExamsPage({ hubData, examEntries }: CareerExamsPageProps) {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const basePath = `/allied-health/${hubData.professionSlug}`;

  const diagnostics = examEntries.filter(e => e.type === "diagnostic");
  const quizzes = examEntries.filter(e => e.type === "topic-quiz");
  const practiceSets = examEntries.filter(e => e.type === "practice-set");

  const seoTitle = `${hubData.shortName} Practice Exams & Quizzes — ${hubData.name} Exam Prep | NurseNest Allied`;
  const seoDescription = `Practice for your ${hubData.shortName} certification with diagnostic assessments, topic quizzes, and full-length mock exams. Blueprint-weighted questions with detailed rationales.`;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "NurseNest", "item": "https://www.nursenest.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": hubData.shortName, "item": `https://www.nursenest.ca${basePath}` },
      { "@type": "ListItem", "position": 4, "name": "Practice Exams", "item": `https://www.nursenest.ca${basePath}/exams` },
    ],
  };

  const examFaqs = [
    { q: `How many questions are on the practice exams?`, a: `Our practice exams match the format of your certification exam. Diagnostic assessments are 25 questions to quickly identify strengths and weaknesses. Topic quizzes range from 25-30 questions for focused review. Full-length practice exams mirror the actual exam length and timing.` },
    { q: `Are the practice questions similar to the real exam?`, a: `Yes. Our questions are blueprint-weighted to match the content distribution of your certification exam. They use the same question formats and clinical scenario styles you'll encounter on exam day.` },
    { q: `What happens after I complete a practice exam?`, a: `You'll receive a detailed score report showing your performance by domain, difficulty level, and question type. Each question includes a comprehensive rationale explaining the correct answer and why other options are incorrect.` },
    { q: `Should I start with the diagnostic assessment?`, a: `Absolutely. The diagnostic assessment identifies your strongest and weakest areas so you can create a targeted study plan. It takes about 30 minutes and gives you an immediate baseline score.` },
  ];

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${hubData.name} Practice Exams`,
    "description": seoDescription,
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest Allied" },
    "courseMode": "online",
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": examFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  return (
    <div data-testid={`exams-page-${hubData.professionSlug}`}>
      <AlliedSEO
        title={seoTitle}
        description={seoDescription}
        keywords={hubData.seo.keywords}
        canonicalPath={`${basePath}/exams`}
        structuredData={breadcrumbStructuredData}
        additionalStructuredData={[courseStructuredData, faqStructuredData]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-exams-title">
            {hubData.shortName} Practice Exams
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Assess your readiness with diagnostic tests, sharpen weak areas with topic quizzes, and simulate exam day with full-length practice exams.
          </p>
        </div>
      </section>

      {diagnostics.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100" data-testid="section-diagnostics">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" style={{ color: hubData.color }} /> Start Here — Diagnostic Assessment
            </h2>
            <p className="text-sm text-gray-500 mb-5">{t("allied.careerExamsPage.takeAQuickDiagnosticTo")}</p>
            <div className="grid grid-cols-1 gap-4">
              {diagnostics.map(entry => (
                <ExamCard key={entry.slug} entry={entry} color={hubData.color} colorAccent={hubData.colorAccent} />
              ))}
            </div>
          </div>
        </section>
      )}

      {quizzes.length > 0 && (
        <section className="py-10 bg-gray-50 border-b border-gray-100" data-testid="section-topic-quizzes">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: hubData.color }} /> Topic Quizzes
            </h2>
            <p className="text-sm text-gray-500 mb-5">{t("allied.careerExamsPage.focusedQuizzesToTestYour")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map(entry => (
                <ExamCard key={entry.slug} entry={entry} color={hubData.color} colorAccent={hubData.colorAccent} />
              ))}
            </div>
          </div>
        </section>
      )}

      {practiceSets.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100" data-testid="section-practice-exams">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: hubData.color }} /> Full-Length Practice Exams
            </h2>
            <p className="text-sm text-gray-500 mb-5">{t("allied.careerExamsPage.simulateExamDayWithBlueprintweighted")}</p>
            <div className="grid grid-cols-1 gap-4">
              {practiceSets.map(entry => (
                <ExamCard key={entry.slug} entry={entry} color={hubData.color} colorAccent={hubData.colorAccent} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-gray-50" data-testid="section-how-practice-works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("allied.careerExamsPage.howPracticeWorks")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Take a Diagnostic", desc: "25-question assessment to baseline your knowledge across all exam domains." },
              { step: "2", title: "Target Weak Areas", desc: "Use topic quizzes and flashcards to strengthen your weakest domains." },
              { step: "3", title: "Simulate Exam Day", desc: "Take a full-length timed practice exam to build stamina and confidence." },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3" style={{ backgroundColor: hubData.color }}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-exam-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("allied.careerExamsPage.practiceExamFaq")}</h2>
          <div className="space-y-3">
            {examFaqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden" data-testid={`exam-faq-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-100 transition-colors"
                >
                  <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: hubData.color }} />
                  <span className="font-medium text-gray-900 flex-1 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pl-13 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ExamCard({ entry, color, colorAccent }: { entry: ExamEntry; color: string; colorAccent: string }) {
  const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG["topic-quiz"];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all" data-testid={`card-exam-${entry.slug}`}>
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: colorAccent }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{entry.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{config.label}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">{entry.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {entry.questionCount} questions</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {entry.timeLimit}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap mt-1">
          {entry.questionCount} questions
        </span>
      </div>
    </div>
  );
}
