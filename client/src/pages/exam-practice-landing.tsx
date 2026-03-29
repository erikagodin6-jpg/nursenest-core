import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { getPoolStats } from "@/lib/question-pool";
import { SILO_CONFIGS } from "@/lib/silo-config";
import { useI18n } from "@/lib/i18n";
import { readApiJsonResponse } from "@/lib/api-error";
import {
  ArrowRight, Target, BookOpen, Layers, Stethoscope, FileText,
  ChevronDown, ChevronUp, FlaskConical, Brain, Activity, Shield,
  ClipboardList, GraduationCap, Link2, Pill, Sparkles, BookMarked,
  BarChart3, Download,
} from "lucide-react";

type ExamType = "nclex-rn" | "nclex-pn" | "rex-pn" | "np";

const EXAM_DATA: Record<ExamType, {
  title: string;
  h1: string;
  description: string;
  metaDescription: string;
  keywords: string;
  intro: string;
  features: { icon: typeof Target; title: string; desc: string; href: string; cta: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "nclex-rn": {
    title: "NCLEX-RN Practice Questions | Free RN Exam Prep | NurseNest",
    h1: "NCLEX-RN Practice Questions",
    description: "Prepare for the NCLEX-RN with exam-aligned practice questions, clinical judgment cases, and detailed rationales.",
    metaDescription: "Practice NCLEX-RN questions with detailed rationales. System-based question banks, timed mock exams, and clinical judgment cases aligned to the 2024-2026 NCLEX-RN test plan.",
    keywords: "NCLEX-RN practice questions, NCLEX-RN question bank, RN exam prep, NCLEX-RN review, Next Generation NCLEX questions, clinical judgment NCLEX",
    intro: "The NCLEX-RN uses the Next Generation format with clinical judgment measurement items including case studies, drag-and-drop, and extended multiple response questions. NurseNest provides system-based question banks aligned to the current NCLEX-RN test plan, covering all eight client needs categories with detailed rationales for every answer option.",
    features: [
      { icon: Target, title: "NCLEX-RN Test Bank", desc: "Thousands of RN-level practice questions organized by body system and client needs category.", href: "/free-practice", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Timed Mock Exams", desc: "Simulate the CAT-adaptive NCLEX-RN exam with timed, randomized question sets.", href: "/mock-exams", cta: "Start Mock Exam" },
      { icon: FileText, title: "Printable Exam Packs", desc: "250-question PDF exam packs with answer keys. Print and practice offline.", href: "/shop", cta: "View Exam Packs" },
      { icon: BookOpen, title: "Flashcard Decks", desc: "High-yield pharmacology, lab values, and pathophysiology flashcards for rapid review.", href: "/flashcards", cta: "Study Flashcards" },
    ],
    faqs: [
      { q: "How many questions are on the NCLEX-RN?", a: "The NCLEX-RN uses computerized adaptive testing (CAT) and can range from 75 to 145 questions. The exam ends when the algorithm determines with 95% confidence whether you meet the passing standard." },
      { q: "What topics does the NCLEX-RN cover?", a: "The NCLEX-RN test plan covers eight client needs categories: Safe and Effective Care Environment (Management of Care, Safety and Infection Control), Health Promotion and Maintenance, Psychosocial Integrity, Physiological Integrity (Basic Care, Pharmacological Therapies, Reduction of Risk Potential, Physiological Adaptation)." },
      { q: "What is the Next Generation NCLEX (NGN)?", a: "The NGN includes clinical judgment measurement items such as extended multiple response, drag-and-drop, cloze (drop-down), matrix/grid, and enhanced hot spot questions. These items assess clinical judgment using the NCSBN Clinical Judgment Measurement Model." },
      { q: "How do NurseNest questions compare to the real NCLEX-RN?", a: "NurseNest questions are written at the application and analysis cognitive levels, mirroring the higher-order thinking required on the actual exam. Each question includes detailed rationales explaining why each option is correct or incorrect." },
      { q: "What is a good passing score on practice exams?", a: "Aim for 65-70% or higher on practice exams. The actual NCLEX-RN passing standard is set using logit scores, not a percentage. Consistent performance above 65% on practice tests correlates with exam readiness." },
      { q: "How long should I study for the NCLEX-RN?", a: "Most candidates study 4-8 weeks after graduation. Aim for 2-4 hours of focused study per day, including both content review and practice questions. Doing 75-100 practice questions daily is recommended." },
      { q: "Can I use NurseNest on my phone?", a: "Yes. NurseNest is fully responsive and works on desktop, tablet, and mobile devices. You can practice questions, review flashcards, and take mock exams on any device." },
    ],
  },
  "nclex-pn": {
    title: "NCLEX-PN Practice Questions | Free PN/LPN Exam Prep | NurseNest",
    h1: "NCLEX-PN Practice Questions",
    description: "Prepare for the NCLEX-PN with practice questions aligned to the PN test plan.",
    metaDescription: "Practice NCLEX-PN questions with detailed rationales. RPN-level question banks, timed mock exams, and flashcards aligned to the NCLEX-PN test plan for LPN/LVN students.",
    keywords: "NCLEX-PN practice questions, NCLEX-PN question bank, LPN exam prep, PN review, practical nursing exam",
    intro: "The NCLEX-PN tests practical/vocational nursing competencies at the PN scope of practice. NurseNest provides PN-level question banks covering all client needs categories within the PN scope, including medication administration, basic care and comfort, safety, and coordinated care under RN supervision.",
    features: [
      { icon: Target, title: "NCLEX-PN Test Bank", desc: "Practice questions at the PN scope covering fundamentals, med-surg, pharmacology, and maternal-child.", href: "/free-practice", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Timed Mock Exams", desc: "Take practice exams that simulate the CAT format used in the NCLEX-PN.", href: "/mock-exams", cta: "Start Mock Exam" },
      { icon: FileText, title: "Printable Study Packs", desc: "Downloadable PDF question packs with answer keys for offline study.", href: "/shop", cta: "View Study Packs" },
      { icon: BookOpen, title: "Flashcard Decks", desc: "Quick-review flashcards covering PN-level pharmacology and nursing fundamentals.", href: "/flashcards", cta: "Study Flashcards" },
    ],
    faqs: [
      { q: "How many questions are on the NCLEX-PN?", a: "The NCLEX-PN uses computerized adaptive testing and can range from 85 to 150 questions. Like the NCLEX-RN, it ends when the algorithm has enough data to make a pass/fail decision." },
      { q: "What is the difference between NCLEX-PN and NCLEX-RN?", a: "The NCLEX-PN tests at the practical/vocational nursing scope. PN questions focus on implementation and data collection, while RN questions emphasize assessment, analysis, and delegation. PNs work under RN supervision." },
      { q: "What topics are on the NCLEX-PN?", a: "The NCLEX-PN covers the same client needs categories as the RN exam but at the PN scope of practice: Safe Care, Health Promotion, Psychosocial Integrity, and Physiological Integrity." },
      { q: "How should I study for the NCLEX-PN?", a: "Focus on PN-scope questions (medication administration, basic care, safety, data collection). Study 2-3 hours daily for 4-6 weeks. Complete 50-75 practice questions per day with rationale review." },
      { q: "Is the NCLEX-PN harder than the RN?", a: "The NCLEX-PN is not easier or harder - it tests different competencies at the PN scope. Both use the same adaptive algorithm. Focus on PN-specific content and scope of practice." },
    ],
  },
  "rex-pn": {
    title: "REx-PN Practice Questions | Canadian RPN Exam Prep | NurseNest",
    h1: "REx-PN Practice Questions",
    description: "Prepare for Canada's REx-PN (Regulatory Exam - Practical Nurse) with Canadian-focused practice questions.",
    metaDescription: "Practice REx-PN questions with Canadian lab values, SI units, and scope-of-practice language. System-based question banks, timed mock exams, and study packs for Canadian RPN students.",
    keywords: "REx-PN practice questions, RPN exam prep, Canadian nursing exam, REx-PN question bank, practical nurse exam Canada, NCSBN REx-PN",
    intro: "The REx-PN (Regulatory Exam - Practical Nurse) is Canada's licensure exam for practical nurses, administered by the NCSBN. NurseNest is the first platform to deliver REx-PN prep with Canadian lab values (SI units: mmol/L, umol/L), Canadian medication names, and content aligned to Canadian provincial scope-of-practice regulations.",
    features: [
      { icon: Target, title: "REx-PN Test Bank", desc: "Canadian-focused practice questions with SI units, Canadian drug names, and provincial scope references.", href: "/free-practice", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Timed Mock Exams", desc: "Simulated REx-PN exams with adaptive question selection and time pressure.", href: "/mock-exams", cta: "Start Mock Exam" },
      { icon: FileText, title: "Printable Exam Packs", desc: "250-question PDF bundles aligned to the REx-PN competency framework.", href: "/shop", cta: "View Exam Packs" },
      { icon: BookOpen, title: "Flashcard Decks", desc: "Pharmacology and pathophysiology flashcards using Canadian standards and SI units.", href: "/flashcards", cta: "Study Flashcards" },
    ],
    faqs: [
      { q: "What is the REx-PN?", a: "The REx-PN (Regulatory Exam - Practical Nurse) is the Canadian licensure exam for practical nurses (RPNs in Ontario, LPNs in other provinces). It replaced the CPNRE in 2022 and is administered by the NCSBN." },
      { q: "How many questions are on the REx-PN?", a: "The REx-PN uses computerized adaptive testing (CAT) with 75-150 questions. The exam adapts to your ability level and ends when the algorithm can make a pass/fail determination with sufficient confidence." },
      { q: "Does NurseNest use Canadian or American lab values?", a: "NurseNest supports both Canadian and U.S. nursing learners. Canadian content uses SI units such as mmol/L, \u00B5mol/L, and degrees Celsius, along with Canadian medication and practice terminology. U.S. content uses conventional American units and U.S. exam terminology where applicable. The platform displays the correct format based on the learner's selected region, exam, or site experience." },
      { q: "How does the REx-PN differ from the NCLEX-PN?", a: "The REx-PN and NCLEX-PN use the same testing engine and framework (both by NCSBN). The key difference is that Canadian regulatory bodies may have additional provincial scope-of-practice considerations. Content is largely equivalent." },
      { q: "How long should I study for the REx-PN?", a: "Plan 4-8 weeks of dedicated study after completing your practical nursing program. Aim for 2-3 hours daily, including 50-75 practice questions with rationale review." },
      { q: "What passing score do I need on the REx-PN?", a: "The REx-PN uses a logit-based passing standard, not a percentage score. You either pass or fail based on the adaptive algorithm. Consistently scoring 65%+ on practice exams indicates readiness." },
    ],
  },
  "np": {
    title: "NP Exam Practice Questions | AANP & ANCC Certification Prep | NurseNest",
    h1: "Nurse Practitioner Exam Practice Questions",
    description: "Prepare for NP certification exams (AANP, ANCC, FNP-BC, AGPCNP-BC) with advanced practice-level questions.",
    metaDescription: "Practice NP certification exam questions for AANP, ANCC, FNP-BC, and AGPCNP-BC. Advanced assessment, pharmacology, and clinical management questions with detailed rationales.",
    keywords: "NP exam practice questions, AANP exam prep, ANCC certification review, FNP-BC practice questions, nurse practitioner exam, NP question bank",
    intro: "NurseNest provides NP-level practice questions covering advanced assessment, differential diagnosis, pharmacological management, and clinical decision-making. Questions are aligned to AANP and ANCC certification exam blueprints for FNP-BC, AGPCNP-BC, AGACNP-BC, PMHNP-BC, and other NP specialties.",
    features: [
      { icon: Target, title: "NP Test Bank", desc: "Advanced practice-level questions covering diagnosis, management, and prescribing at the NP scope.", href: "/free-practice", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Timed Mock Exams", desc: "Full-length NP certification practice exams with performance analytics.", href: "/mock-exams", cta: "Start Mock Exam" },
      { icon: FileText, title: "NP Exam Prep Hub", desc: "Compare AANP vs ANCC vs CNPLE exams and choose your certification pathway.", href: "/np-exam-prep", cta: "View Exam Hub" },
      { icon: Layers, title: "Clinical Lessons", desc: "179+ NP-scope pathophysiology lessons covering all major body systems.", href: "/lessons?tier=np", cta: "Browse Lessons" },
    ],
    faqs: [
      { q: "Which NP certification exams does NurseNest cover?", a: "NurseNest covers content for AANP and ANCC certification exams, including FNP-BC (Family), AGPCNP-BC (Adult-Gerontology Primary Care), AGACNP-BC (Adult-Gerontology Acute Care), PMHNP-BC (Psychiatric Mental Health), and PNP-BC (Pediatric)." },
      { q: "How many questions are on NP certification exams?", a: "The AANP exam has 150 questions (135 scored, 15 pretest). The ANCC exam has 175 questions (150 scored, 25 pretest). Both are 3 hours long." },
      { q: "What topics are tested on NP certification exams?", a: "NP exams test advanced health assessment, differential diagnosis, pharmacological management, non-pharmacological interventions, health promotion/disease prevention, professional role responsibilities, and research/evidence-based practice." },
      { q: "What is the passing score for NP certification exams?", a: "The AANP uses a scaled score of 500 (on a 200-800 scale) as the passing standard. The ANCC also uses a scaled score. Both convert raw scores using psychometric models, so there is no fixed percentage." },
      { q: "How should I study for NP board exams?", a: "Focus on clinical management (diagnosis + treatment) as this comprises the largest portion of both exams. Study pharmacology heavily (mechanism, side effects, interactions). Complete 50-100 NP-level practice questions daily for 6-8 weeks." },
      { q: "Is the AANP or ANCC exam harder?", a: "Neither is objectively harder. The AANP focuses more on clinical scenarios and diagnosis/management. The ANCC includes more research, theory, and professional role questions. Choose based on your program emphasis and employer requirements." },
    ],
  },
};

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`button-faq-${i}`}
          >
            <span className="font-medium text-sm text-gray-900 pr-4">{faq.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${i}`}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QuestionBankStats({ tier }: { tier: string }) {
  const [stats, setStats] = useState<{ total: number; systems: Record<string, number> }>({ total: 0, systems: {} });
  useEffect(() => { getPoolStats(tier).then(setStats); }, [tier]);
  const systemEntries = Object.entries(stats.systems).sort((a, b) => b[1] - a[1]);

  return (
    <div data-testid="section-test-bank-stats">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.testBank")}</h3>
          <p className="text-sm text-gray-500">{stats.total.toLocaleString()} practice questions available</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        {systemEntries.slice(0, 12).map(([system, count]) => (
          <div key={system} className="bg-gray-50 rounded-lg px-3 py-2 text-xs" data-testid={`stat-system-${system.toLowerCase().replace(/\s+/g, "-")}`}>
            <span className="font-medium text-gray-700">{system}</span>
            <span className="ml-1 text-gray-400">({count})</span>
          </div>
        ))}
      </div>
      <LocaleLink href="/free-practice">
        <Button size="sm" variant="outline" data-testid="button-view-test-bank">
          Browse All Questions <ArrowRight className="ml-1 w-3 h-3" />
        </Button>
      </LocaleLink>
    </div>
  );
}

function formatLessonTitle(id: string): string {
  return id.replace(/-rpn$|-rn$|-np$/, "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function LessonSection({ sections }: { sections: { title: string; lessons: string[] }[] }) {
  const validSections = sections.filter(section => section.lessons.length > 0);

  const { data: lessonMeta = [] } = useQuery<{ id: string; title: string }[]>({
    queryKey: ["/api/lessons/meta"],
    queryFn: async () => {
      const res = await fetch("/api/lessons/meta");
      const parsed = await readApiJsonResponse<{ id: string; title: string }[]>(res);
      if (!parsed.ok) return [];
      return Array.isArray(parsed.data) ? parsed.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const titleMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of lessonMeta) map[m.id] = m.title;
    return map;
  }, [lessonMeta]);

  if (validSections.length === 0) return null;

  return (
    <div data-testid="section-lessons">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.relatedClinicalLessons")}</h3>
          <p className="text-sm text-gray-500">{t("pages.examPracticeLanding.indepthPathophysiologyAndNursingInterventions")}</p>
        </div>
      </div>
      <div className="space-y-4">
        {validSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{section.title}</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {section.lessons.map(lessonId => {
                return (
                  <LocaleLink key={lessonId} href={`/lessons/${lessonId}`}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm group" data-testid={`link-lesson-${lessonId}`}>
                      <BookMarked className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                      <span className="text-gray-700 group-hover:text-gray-900 truncate">{titleMap[lessonId] || formatLessonTitle(lessonId)}</span>
                    </div>
                  </LocaleLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <LocaleLink href="/lessons">
          <Button size="sm" variant="outline" data-testid="button-view-all-lessons">
            View All Lessons <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}

function PharmSection({ systems }: { systems: string[] }) {
  return (
    <div data-testid="section-pharmacology">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <Pill className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.pharmacologyBySystem")}</h3>
          <p className="text-sm text-gray-500">{t("pages.examPracticeLanding.highyieldMedicationsOrganizedByBody")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {systems.map((system) => (
          <LocaleLink key={system} href="/medication-mastery">
            <div className="bg-green-50/50 hover:bg-green-50 rounded-lg px-3 py-2.5 text-xs font-medium text-green-800 text-center transition-colors" data-testid={`link-pharm-${system.toLowerCase().replace(/\s+/g, "-")}`}>
              {system}
            </div>
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}

function MockExamSection({ examName }: { examName: string }) {
  return (
    <div data-testid="section-mock-exams">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.timedMockExams")}</h3>
          <p className="text-sm text-gray-500">Full-length practice exams simulating the {examName}</p>
        </div>
      </div>
      <div className="bg-orange-50/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-1">{t("pages.examPracticeLanding.simulateRealExamConditions")}</p>
          <p>{t("pages.examPracticeLanding.timedRandomizedQuestionsWithInstant")}</p>
        </div>
        <LocaleLink href="/mock-exams">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white shrink-0" data-testid="button-start-mock-exam">
            Start Mock Exam <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}

function PrintableSection() {
  return (
    <div data-testid="section-printables">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <Download className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.printableExamPacks")}</h3>
          <p className="text-sm text-gray-500">{t("pages.examPracticeLanding.pdfQuestionPacksWithAnswer")}</p>
        </div>
      </div>
      <div className="bg-purple-50/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-1">{t("pages.examPracticeLanding.studyAnywhereAnytime")}</p>
          <p>{t("pages.examPracticeLanding.250questionPrintreadyPdfBundlesWith")}</p>
        </div>
        <LocaleLink href="/shop">
          <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 shrink-0" data-testid="button-view-printables">
            Browse Store <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}

function FlashcardsSection() {
  return (
    <div data-testid="section-flashcards">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Layers className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.flashcardDecks")}</h3>
          <p className="text-sm text-gray-500">{t("pages.examPracticeLanding.highyieldFactsForRapidReview")}</p>
        </div>
      </div>
      <div className="bg-indigo-50/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-1">{t("pages.examPracticeLanding.flashcardsForActiveRecall")}</p>
          <p>{t("pages.examPracticeLanding.pharmacologyLabValuesPathophysiologyAnd")}</p>
        </div>
        <LocaleLink href="/flashcards">
          <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 shrink-0" data-testid="button-view-flashcards">
            Study Flashcards <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}

function InternalLinksSection({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div data-testid="section-internal-links">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t("pages.examPracticeLanding.exploreMoreStudyResources")}</h3>
          <p className="text-sm text-gray-500">{t("pages.examPracticeLanding.allTheToolsYouNeed")}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {links.map((link, i) => (
          <LocaleLink key={i} href={link.href}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm group" data-testid={`link-internal-${i}`}>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-primary shrink-0" />
              <span className="text-gray-600 group-hover:text-gray-900">{link.label}</span>
            </div>
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}

export default function ExamPracticeLanding({ examType }: { examType: ExamType }) {
  const [, setLocation] = useLocation();
  const data = EXAM_DATA[examType];
  const siloKey = examType === "nclex-rn" ? "nclex-rn" : examType === "nclex-pn" ? "nclex-pn" : examType === "rex-pn" ? "rex-pn" : "np";
  const silo = SILO_CONFIGS[siloKey];
  const examName = examType === "nclex-rn" ? "NCLEX-RN" : examType === "nclex-pn" ? "NCLEX-PN" : examType === "rex-pn" ? "REx-PN" : "NP Certification";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": data.h1,
    "description": data.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "sameAs": "https://www.nursenest.ca",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT40H",
    },
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={data.title}
        description={data.metaDescription}
        keywords={data.keywords}
        canonicalPath={`/${examType === "nclex-rn" ? "nclex-rn" : examType === "nclex-pn" ? "nclex-pn" : examType === "rex-pn" ? "rex-pn" : "np-exam"}-practice-questions`}
        structuredData={faqSchema}
        additionalStructuredData={[courseSchema]}
      />
      <Navigation />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <BreadcrumbNav title={data.h1} />
        </div>
        <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-primary/10 text-primary mb-4 px-4 py-1.5" data-testid="badge-exam-type">
              <Target className="w-3 h-3 mr-1.5" /> Exam Prep Hub
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-exam-landing-h1">
              {data.h1}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6" data-testid="text-exam-landing-desc">
              {data.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-primary hover:brightness-110 text-white shadow-lg"
                onClick={() => setLocation("/free-practice")}
                data-testid="button-start-free"
              >
                Start Free Practice <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-2"
                onClick={() => setLocation("/mock-exams")}
                data-testid="button-mock-exams"
              >
                <Stethoscope className="mr-2 w-4 h-4" /> Take Mock Exam
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-2"
                onClick={() => setLocation("/shop")}
                data-testid="button-view-printables-hero"
              >
                <Download className="mr-2 w-4 h-4" /> View Printables
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none mb-12">
              <p className="text-gray-600 leading-relaxed" data-testid="text-intro">{data.intro}</p>
            </div>

            <h2 className="text-2xl font-bold mb-6" data-testid="text-features-heading">{t("pages.examPracticeLanding.whatYouGet")}</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {data.features.map((feat, i) => (
                <Card key={i} className="border border-gray-100 hover:shadow-md transition-shadow" data-testid={`card-feature-${i}`}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <feat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feat.desc}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(feat.href)}
                      data-testid={`button-feature-cta-${i}`}
                    >
                      {feat.cta} <ChevronDown className="ml-1 w-3 h-3 rotate-[-90deg]" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {silo && (
              <div className="space-y-12 mb-16">
                <h2 className="text-2xl font-bold" data-testid="text-content-hub-heading">{examName} Study Resources</h2>

                <QuestionBankStats tier={silo.questionBankTierFilter} />

                <MockExamSection examName={examName} />

                <PrintableSection />

                {silo.pharmSystems.length > 0 && (
                  <PharmSection systems={silo.pharmSystems} />
                )}

                {silo.lessonSections.length > 0 && (
                  <LessonSection sections={silo.lessonSections} />
                )}

                {silo.showFlashcards && <FlashcardsSection />}

                <InternalLinksSection links={silo.internalLinks} />
              </div>
            )}

            <h2 className="text-2xl font-bold mb-6" data-testid="text-faq-heading">{t("pages.examPracticeLanding.frequentlyAskedQuestions")}</h2>
            <FAQAccordion faqs={data.faqs} />

            <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-3" data-testid="text-bottom-cta-heading">{t("pages.examPracticeLanding.readyToStartPracticing")}</h2>
              <p className="text-gray-600 mb-6">{t("pages.examPracticeLanding.jumpIntoFreePracticeQuestions")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-full bg-primary hover:brightness-110 text-white"
                  onClick={() => setLocation("/free-practice")}
                  data-testid="button-bottom-free-practice"
                >
                  Start Free Practice <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-full"
                  onClick={() => setLocation("/pricing")}
                  data-testid="button-bottom-pricing"
                >
                  View Pricing
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

export function NclexRnPractice() { return <ExamPracticeLanding examType="nclex-rn" />; }
export function NclexPnPractice() { return <ExamPracticeLanding examType="nclex-pn" />; }
export function RexPnPractice() { return <ExamPracticeLanding examType="rex-pn" />; }
export function NpExamPractice() { return <ExamPracticeLanding examType="np" />; }
