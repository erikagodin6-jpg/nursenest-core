import { Link } from "wouter";
import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Route, ChevronRight, HelpCircle, BookOpen,
  Target, Clock, CheckCircle2, Activity, Stethoscope, Heart,
  Baby, Brain, Scissors, Ribbon, GraduationCap
} from "lucide-react";

const PATHWAY_CARDS = [
  { slug: "icu-nurse", name: "ICU Nurse", desc: "Hemodynamics, ventilators, vasoactive drips, and CCRN preparation", icon: Activity, color: "red", weeks: "12 weeks" },
  { slug: "er-nurse", name: "ER Nurse", desc: "Triage, trauma, cardiac emergencies, and CEN preparation", icon: Stethoscope, color: "orange", weeks: "10 weeks" },
  { slug: "med-surg-nurse", name: "Med-Surg Nurse", desc: "All body systems, postoperative care, and CMSRN preparation", icon: Heart, color: "blue", weeks: "12 weeks" },
  { slug: "cardiac-nurse", name: "Cardiac Nurse", desc: "ECG interpretation, heart failure, cardiac procedures", icon: Heart, color: "rose", weeks: "10 weeks" },
  { slug: "oncology-nurse", name: "Oncology Nurse", desc: "Cancer biology, chemotherapy, symptom management, and OCN prep", icon: Ribbon, color: "purple", weeks: "10 weeks" },
  { slug: "pediatric-nurse", name: "Pediatric Nurse", desc: "Child development, pediatric conditions, and CPN preparation", icon: Baby, color: "sky", weeks: "10 weeks" },
  { slug: "psych-nurse", name: "Psychiatric Nurse", desc: "Therapeutic communication, psychopharmacology, and PMH-BC prep", icon: Brain, color: "teal", weeks: "10 weeks" },
  { slug: "or-nurse", name: "OR Nurse", desc: "Sterile technique, surgical safety, and CNOR preparation", icon: Scissors, color: "indigo", weeks: "10 weeks" },
  { slug: "nicu-nurse", name: "NICU Nurse", desc: "Neonatal assessment, respiratory support, developmental care", icon: Baby, color: "pink", weeks: "10 weeks" },
  { slug: "canadian-np-exam", name: "Canadian NP Exam", desc: "Clinical assessment, pharmacology, and CNPLE preparation", icon: GraduationCap, color: "emerald", weeks: "12 weeks" },
];

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string }> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100" },
  indigo: { bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-100" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100" },
  teal: { bg: "bg-teal-50", iconColor: "text-teal-600", border: "border-teal-100" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100" },
  emerald: { bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-100" },
};

const FAQ_DATA = [
  { question: "What is a study pathway?", answer: "A study pathway is a structured, phased learning plan that takes you from foundational knowledge to advanced competency in a nursing specialty. Each pathway is organized into 3 phases spanning 10-12 weeks, with specific topics, practice activities, and certification exam preparation built in." },
  { question: "Can I study multiple pathways at once?", answer: "While you can access all pathways with your NurseNest subscription, we recommend focusing on one pathway at a time for maximum retention. Complete one pathway before starting another, or study a second pathway if it builds on skills from the first." },
  { question: "Are pathways aligned to certification exams?", answer: "Yes. Each pathway is designed to prepare you for the corresponding specialty certification exam (CCRN, CEN, CMSRN, OCN, CNOR, CPN, PMH-BC, CNPLE). Phase 3 of each pathway includes dedicated exam preparation with practice tests." },
  { question: "How much time should I dedicate per week?", answer: "Most pathways are designed for 5-8 hours per week of focused study over 10-12 weeks. You can adjust the pace based on your schedule and experience level. Nurses with prior specialty experience may complete pathways faster." },
  { question: "Do I need clinical experience before starting?", answer: "Pathways start with foundational knowledge, so you can begin as a new nurse or someone transitioning to a new specialty. However, clinical experience in the specialty will deepen your understanding and accelerate your progress through the material." },
];

const HOW_IT_WORKS = [
  { step: "1", icon: Target, title: "Choose Your Path", desc: "Select the study pathway matching your specialty or certification goal" },
  { step: "2", icon: BookOpen, title: "Follow the Phases", desc: "Work through 3 structured phases from foundations to advanced topics" },
  { step: "3", icon: CheckCircle2, title: "Practice & Test", desc: "Reinforce learning with practice questions, flashcards, and mock exams" },
  { step: "4", icon: GraduationCap, title: "Get Certified", desc: "Take your certification exam with confidence and advance your career" },
];

export default function StudyPathwaysHub() {
  const { t } = useI18n();
  const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

  return (
    <div data-testid="page-study-pathways-hub">
      <Navigation />
      <SEO
        title={t("pages.studyPathwaysHub.nursingStudyPathwaysStructuredLearning")}
        description={t("pages.studyPathwaysHub.structuredStudyPathwaysForNursing")}
        keywords="nursing study pathway, ICU study plan, ER nurse study guide, CCRN study plan, CEN study plan, nursing certification prep, structured nursing study, nursing learning plan"
        canonicalPath="/study-pathways"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Nursing Study Pathways",
          "description": "Structured study pathways for nursing specialties and certification exam preparation.",
          "provider": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Study Pathways", url: "https://www.nursenest.ca/study-pathways" },
        ]}
        additionalStructuredData={[faqStructuredData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-violet-600">{t("pages.studyPathwaysHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-violet-700 font-medium">{t("pages.studyPathwaysHub.studyPathways")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-700 mb-4" data-testid="badge-pathways">
              <Route className="w-4 h-4" /> Study Pathways
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              Structured Study Pathways
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              Follow a clear, phased learning plan from foundational concepts to certification-exam readiness. Each pathway is built by specialty nurses and aligned to official exam blueprints.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/nursing-certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200" data-testid="button-certifications">
                View Certifications <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nursing-specialties" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-50 transition-colors border border-violet-200" data-testid="button-specialties">
                Explore Specialties
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-how-heading">{t("pages.studyPathwaysHub.howStudyPathwaysWork")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 text-center relative" data-testid={`card-how-${i}`}>
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-sm mx-auto mb-3">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-pathway-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-grid-heading">{t("pages.studyPathwaysHub.10StudyPathways")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.studyPathwaysHub.eachPathwayGuidesYouThrough")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATHWAY_CARDS.map((path) => {
              const colors = COLOR_MAP[path.color] || COLOR_MAP.blue;
              return (
                <Link key={path.slug} href={`/study-pathways/${path.slug}`} className="group" data-testid={`card-pathway-${path.slug}`}>
                  <div className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-all h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <path.icon className={`w-6 h-6 ${colors.iconColor}`} />
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> {path.weeks}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-violet-700 transition-colors" data-testid={`text-pathway-name-${path.slug}`}>
                      {path.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{path.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
                      Start Pathway <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="text-cross-heading">{t("pages.studyPathwaysHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/nursing-certifications" className="bg-emerald-50 rounded-xl p-6 hover:bg-emerald-100 transition-colors group" data-testid="link-certifications">
              <h3 className="font-semibold text-emerald-900 mb-1 group-hover:text-emerald-700">{t("pages.studyPathwaysHub.nursingCertifications")}</h3>
              <p className="text-sm text-emerald-700/70">{t("pages.studyPathwaysHub.completeGuidesToCcrnCen")}</p>
            </Link>
            <Link href="/nursing-specialties" className="bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors group" data-testid="link-specialties">
              <h3 className="font-semibold text-blue-900 mb-1 group-hover:text-blue-700">{t("pages.studyPathwaysHub.nursingSpecialties")}</h3>
              <p className="text-sm text-blue-700/70">{t("pages.studyPathwaysHub.careerGuidesForCriticalCare")}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-faq-heading">{t("pages.studyPathwaysHub.pathwayFaqs")}</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-violet-600 to-purple-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Start Your Study Pathway Today
          </h2>
          <p className="text-violet-100 mb-8 text-lg">
            All 10 study pathways are included with your NurseNest subscription. Follow a structured plan to mastery.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/lessons" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-violet-700 rounded-xl font-bold hover:bg-violet-50 transition-colors shadow-lg" data-testid="button-cta-lessons">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-400 transition-colors border border-violet-400" data-testid="button-cta-pricing">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-violet-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}
