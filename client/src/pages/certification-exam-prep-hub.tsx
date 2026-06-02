import { Link } from "wouter";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { WhyNurseNestGrid, DifferentiatorCTA } from "@/components/competitive-differentiation";
import { SEO } from "@/components/seo";
import {
  ArrowRight, Award, BookOpen, ChevronRight, ChevronDown,
  GraduationCap, Target, Brain, BarChart3, Clock,
  Activity, Heart, Baby, Zap, Shield, Stethoscope,
  Scissors, Ribbon, Users, Play, ClipboardList, Layers,
  FileText, Timer, Shuffle, ListOrdered
} from "lucide-react";

import { BLS_BANK, ACLS_BANK, PALS_BANK, NRP_BANK, TNCC_BANK, ENPC_BANK } from "@/data/exam-questions/certification-banks";
import { CCRN_BANK, EMERGENCY_NURSING_BANK, ONCOLOGY_NURSING_BANK, PEDIATRIC_NURSING_BANK, PERIOPERATIVE_NURSING_BANK } from "@/data/exam-questions/cert-banks-expanded";

import { useI18n } from "@/lib/i18n";
const CERT_CONFIGS = [
  { id: "bls", name: "BLS", fullName: "Basic Life Support", org: "AHA", icon: Activity, color: "blue", bank: BLS_BANK, mockExams: 3, prepSlug: "bls-prep" },
  { id: "acls", name: "ACLS", fullName: "Advanced Cardiovascular Life Support", org: "AHA", icon: Heart, color: "red", bank: ACLS_BANK, mockExams: 3, prepSlug: "acls-prep" },
  { id: "pals", name: "PALS", fullName: "Pediatric Advanced Life Support", org: "AHA", icon: Baby, color: "sky", bank: PALS_BANK, mockExams: 3, prepSlug: "pals-prep" },
  { id: "nrp", name: "NRP", fullName: "Neonatal Resuscitation Program", org: "AAP", icon: Baby, color: "pink", bank: NRP_BANK, mockExams: 3, prepSlug: "nrp-prep" },
  { id: "tncc", name: "TNCC", fullName: "Trauma Nursing Core Course", org: "ENA", icon: Zap, color: "orange", bank: TNCC_BANK, mockExams: 3, prepSlug: "tncc-prep" },
  { id: "enpc", name: "ENPC", fullName: "Emergency Nursing Pediatric Course", org: "ENA", icon: Baby, color: "violet", bank: ENPC_BANK, mockExams: 3, prepSlug: "enpc-prep" },
  { id: "ccrn", name: "CCRN", fullName: "Critical-Care Registered Nurse", org: "AACN", icon: Activity, color: "rose", bank: CCRN_BANK, mockExams: 3, prepSlug: "ccrn-prep" },
  { id: "emergency-nursing", name: "CEN", fullName: "Certified Emergency Nurse", org: "BCEN", icon: Stethoscope, color: "amber", bank: EMERGENCY_NURSING_BANK, mockExams: 3, prepSlug: "emergency-nursing-prep" },
  { id: "oncology-nursing", name: "OCN", fullName: "Oncology Certified Nurse", org: "ONCC", icon: Ribbon, color: "purple", bank: ONCOLOGY_NURSING_BANK, mockExams: 3, prepSlug: "oncology-nursing-prep" },
  { id: "pediatric-nursing", name: "CPN", fullName: "Certified Pediatric Nurse", org: "PNCB", icon: Baby, color: "teal", bank: PEDIATRIC_NURSING_BANK, mockExams: 3, prepSlug: "pediatric-nursing-prep" },
  { id: "perioperative-nursing", name: "CNOR", fullName: "Certified Perioperative Nurse", org: "CCI", icon: Scissors, color: "indigo", bank: PERIOPERATIVE_NURSING_BANK, mockExams: 3, prepSlug: "perioperative-nursing-prep" },
];

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string; badge: string; badgeText: string }> = {
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", badge: "bg-blue-100", badgeText: "text-blue-700" },
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", badge: "bg-red-100", badgeText: "text-red-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", badge: "bg-sky-100", badgeText: "text-sky-700" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100", badge: "bg-pink-100", badgeText: "text-pink-700" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", badge: "bg-orange-100", badgeText: "text-orange-700" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", badge: "bg-violet-100", badgeText: "text-violet-700" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100", badge: "bg-rose-100", badgeText: "text-rose-700" },
  amber: { bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-100", badge: "bg-amber-100", badgeText: "text-amber-700" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100", badge: "bg-purple-100", badgeText: "text-purple-700" },
  teal: { bg: "bg-teal-50", iconColor: "text-teal-600", border: "border-teal-100", badge: "bg-teal-100", badgeText: "text-teal-700" },
  indigo: { bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-100", badge: "bg-indigo-100", badgeText: "text-indigo-700" },
};

const PRACTICE_MODES = [
  { id: "topic", name: "Topic Practice", desc: "Focus on specific certification domains and topic areas", icon: BookOpen, color: "blue" },
  { id: "algorithm", name: "Algorithm Scenarios", desc: "Practice clinical decision-making with algorithm-based questions", icon: ListOrdered, color: "emerald" },
  { id: "mixed", name: "Mixed Practice", desc: "Randomized questions across all topics for comprehensive review", icon: Shuffle, color: "purple" },
  { id: "mock", name: "Full Mock Exams", desc: "Timed, full-length exams simulating the real certification test", icon: Timer, color: "rose" },
];

const FAQ_DATA = [
  { q: "How many certification practice questions are available?", a: "Our certification exam prep hub includes thousands of practice questions across 11 nursing certifications. Each certification features multiple question types including MCQ, select-all-that-apply, ordered response, and clinical scenario questions." },
  { q: "What certifications does this prep hub cover?", a: "We cover BLS, ACLS, PALS, NRP, TNCC, ENPC, CCRN, CEN (Emergency Nursing), OCN (Oncology Nursing), CPN (Pediatric Nursing), and CNOR (Perioperative Nursing) — the most in-demand nursing certifications." },
  { q: "How do the mock exams work?", a: "Each certification has 3 full mock exams with 100-150 questions each. Exams feature timed mode, randomized question selection, performance breakdown by topic, and detailed answer rationales. You can review your results and identify weak areas after completion." },
  { q: "What are the four practice modes?", a: "Topic Practice lets you focus on specific domains. Algorithm Scenarios tests clinical decision-making. Mixed Practice randomizes across all topics. Full Mock Exams simulate the real test with timing and scoring." },
  { q: "Can I filter questions by certification?", a: "Yes, all practice modes support certification filtering. You can focus on a single certification or practice across multiple certifications to build cross-cutting clinical knowledge." },
  { q: "How should I prepare for my certification exam?", a: "Start with Topic Practice to build foundational knowledge in each domain. Progress to Algorithm Scenarios for clinical decision-making skills. Use Mixed Practice for comprehensive review. Finish with Full Mock Exams to simulate test-day conditions and identify remaining weak areas." },
];

export default function CertificationExamPrepHub() {
  const { t } = useI18n();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const totalQuestions = CERT_CONFIGS.reduce((sum, c) => sum + c.bank.length, 0);
  const totalMockExams = CERT_CONFIGS.reduce((sum, c) => sum + c.mockExams, 0);
  const totalCertifications = CERT_CONFIGS.length;

  return (
    <div data-testid="page-certification-exam-prep-hub">
      <Navigation />
      <SEO
        title={t("pages.certificationExamPrepHub.certificationExamPrepHubPractice")}
        description={t("pages.certificationExamPrepHub.comprehensiveNursingCertificationExamPreparati")}
        keywords="certification exam prep, nursing certification practice questions, ACLS mock exam, BLS practice test, CCRN study guide, CEN exam prep, nursing mock exams, certification question bank"
        canonicalPath="/certification-exam-prep"
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Certification Exam Prep", url: "https://www.nursenest.ca/certification-exam-prep" },
        ]}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-blue-600">{t("pages.certificationExamPrepHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-700 font-medium">{t("pages.certificationExamPrepHub.certificationExamPrep")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 mb-4" data-testid="badge-hub">
              <GraduationCap className="w-4 h-4" /> Certification Exam Prep Hub
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-hub-title">
              Advance Your Nursing Career with Certification Exam Prep
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-hub-subtitle">
              Prepare for certification exams with realistic scenario questions, organized topic banks, and full-length mock exams across 11 nursing certifications.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg" data-testid="button-explore-certs">
                Explore Certifications <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#practice-modes" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-practice-modes">
                <Play className="w-4 h-4" /> Start Practicing
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12" data-testid="hero-stats">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-6 text-center" data-testid="stat-total-questions">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalQuestions.toLocaleString()}+</p>
              <p className="text-sm text-gray-500">{t("pages.certificationExamPrepHub.certificationQuestions")}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-6 text-center" data-testid="stat-mock-exams">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalMockExams}</p>
              <p className="text-sm text-gray-500">{t("pages.certificationExamPrepHub.practiceExams")}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-6 text-center" data-testid="stat-certifications">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalCertifications}</p>
              <p className="text-sm text-gray-500">{t("pages.certificationExamPrepHub.certificationsCovered")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="certifications" className="py-16 bg-white" data-testid="section-certifications">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-certs-heading">
              11 Nursing Certifications
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive question banks, mock exams, and study tools for every major nursing certification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERT_CONFIGS.map((cert) => {
              const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
              const Icon = cert.icon;
              return (
                <Link key={cert.id} href={`/certifications/${cert.prepSlug}`} className="group" data-testid={`card-cert-${cert.id}`}>
                  <div className={`bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-lg transition-all h-full`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{cert.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge} ${colors.badgeText}`}>{cert.org}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{cert.fullName}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="w-3 h-3" /> {cert.bank.length} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {cert.mockExams} mock exams
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="practice-modes" className="py-16 bg-gray-50" data-testid="section-practice-modes">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-modes-heading">
              Four Practice Modes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the practice mode that matches your study strategy. Filter by certification for focused preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRACTICE_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(isSelected ? null : mode.id)}
                  className={`text-left bg-white rounded-2xl border p-6 hover:shadow-md transition-all ${
                    isSelected ? "border-indigo-300 ring-2 ring-indigo-100" : "border-gray-100"
                  }`}
                  data-testid={`card-mode-${mode.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${mode.color}-50 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${mode.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{mode.name}</h3>
                      <p className="text-sm text-gray-500">{mode.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-2 font-medium uppercase">{t("pages.certificationExamPrepHub.filterByCertification")}</p>
                      <div className="flex flex-wrap gap-2">
                        {CERT_CONFIGS.map((cert) => (
                          <Link
                            key={cert.id}
                            href={`/certifications/${cert.prepSlug}`}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                            data-testid={`filter-${mode.id}-${cert.id}`}
                          >
                            {cert.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-mock-exams">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-mock-heading">
              Full Mock Exam Simulations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each certification features 3 timed mock exams with 100-150 questions, randomized selection, performance breakdown, and algorithm review.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CERT_CONFIGS.map((cert) => {
              const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
              return (
                <Link key={cert.id} href={`/certifications/${cert.prepSlug}`} className="group" data-testid={`mock-card-${cert.id}`}>
                  <div className={`bg-white rounded-xl border ${colors.border} p-4 hover:shadow-md transition-all text-center h-full`}>
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-2`}>
                      <Play className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{cert.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{cert.mockExams} exams</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center" data-testid="feature-timed">
              <Timer className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">{t("pages.certificationExamPrepHub.timedMode")}</h4>
              <p className="text-xs text-gray-500">{t("pages.certificationExamPrepHub.realExamTimePressure")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center" data-testid="feature-randomized">
              <Shuffle className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">{t("pages.certificationExamPrepHub.randomized")}</h4>
              <p className="text-xs text-gray-500">{t("pages.certificationExamPrepHub.differentQuestionsEachTime")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center" data-testid="feature-breakdown">
              <BarChart3 className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">{t("pages.certificationExamPrepHub.performanceBreakdown")}</h4>
              <p className="text-xs text-gray-500">{t("pages.certificationExamPrepHub.topicbytopicAnalysis")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center" data-testid="feature-algorithm">
              <Brain className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">{t("pages.certificationExamPrepHub.algorithmReview")}</h4>
              <p className="text-xs text-gray-500">{t("pages.certificationExamPrepHub.stepbystepRationales")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-indigo-600 to-blue-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Prepare for Your Certification Exam Today
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Practice with realistic scenario questions, organized topic banks, and timed mock exams. Advance your nursing career with confidence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              Get Full Access <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/nursing-certifications" className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-400 transition-colors border border-indigo-400" data-testid="button-cta-cert-hub">
              Certification Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-faq-heading">{t("pages.certificationExamPrepHub.frequentlyAskedQuestions")}</h2>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  data-testid={`button-faq-${i}`}
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyNurseNestGrid
        headline="Why NurseNest for Certification Exam Prep"
        subtitle={t("pages.certification_exam_prep_hub.nursenestProvidesExamalignedQuestionBank")}
        context="certification"
      />
      <DifferentiatorCTA
        headline="Start Your Certification Prep Today"
        subtitle={t("pages.certification_exam_prep_hub.accessAdaptivePracticeExamsClinical")}
        primaryHref="/register"
        primaryLabel="Start Free"
        secondaryHref="/pricing"
        secondaryLabel="View Plans"
      />
      <Footer />
    </div>
  );
}
