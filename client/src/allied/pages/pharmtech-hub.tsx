import { Link } from "wouter";
import { useState, useEffect } from "react";
import { BookOpen, Brain, FileText, GraduationCap, ChevronRight, Pill, CheckCircle2, ArrowRight, HelpCircle, Sparkles, Target, Clock, Calendar, BarChart3, Play, Zap, Globe } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { buildJobTrainingStructuredData } from "@/lib/structured-data";

import { useI18n } from "@/lib/i18n";
const RELATED_CAREERS = [
  { name: "Medical Laboratory Technologist", shortName: "MLT", href: "/allied-health/mlt", desc: "Lab diagnostics, hematology, clinical chemistry & microbiology certification", icon: "Microscope" },
  { name: "Respiratory Therapist", shortName: "RRT", href: "/allied-health/rrt", desc: "Ventilator management, ABG analysis & airway management certification", icon: "Wind" },
  { name: "Paramedic", shortName: "Paramedic", href: "/allied-health/paramedic", desc: "Emergency medical services, trauma assessment & NREMT/COPR certification", icon: "Ambulance" },
  { name: "Health Information Management", shortName: "HIM", href: "/allied-health/health-info-mgmt", desc: "Health records, coding, data analytics & CHIM/RHIA certification", icon: "Database" },
];

const TOPIC_CARDS = [
  { title: "Pharmacology & Drug Classifications", slug: "drug-classes", desc: "Top 200 drugs, brand/generic names, drug classes, mechanisms of action, and therapeutic uses", icon: Pill, href: "/allied-health/pharmacy-technician/drug-classes" },
  { title: "Dosage Calculations", slug: "dosage-calculations", desc: "Unit conversions, concentration calculations, drip rates, pediatric dosing, and compounding math", icon: Target, href: "/allied-health/pharmacy-technician/study-guide?topic=dosage-calculations" },
  { title: "Pharmacy Law & Regulations", slug: "pharmacy-law", desc: "DEA schedules, HIPAA, state and federal regulations, record keeping, and controlled substances", icon: FileText, href: "/allied-health/pharmacy-technician/study-guide?topic=pharmacy-law" },
  { title: "Sterile & Non-Sterile Compounding", slug: "compounding", desc: "USP 795/797/800, beyond-use dating, aseptic technique, hazardous drug handling", icon: Sparkles, href: "/allied-health/pharmacy-technician/study-guide?topic=compounding" },
  { title: "Prescription Processing", slug: "prescription-processing", desc: "Interpreting prescriptions, sig codes, DAW codes, insurance billing, prior authorizations", icon: BookOpen, href: "/allied-health/pharmacy-technician/study-guide?topic=prescription-processing" },
  { title: "Patient Safety & Quality Assurance", slug: "patient-safety", desc: "Medication errors, look-alike/sound-alike drugs, tall man lettering, adverse effects reporting", icon: CheckCircle2, href: "/allied-health/pharmacy-technician/study-guide?topic=patient-safety" },
];

const FAQ_DATA = [
  { q: "What is the PTCB exam?", a: "The Pharmacy Technician Certification Board (PTCB) exam is a nationally recognized certification for pharmacy technicians. It covers pharmacology, pharmacy law, sterile and non-sterile compounding, medication safety, and pharmacy operations." },
  { q: "How many questions are on the PTCB exam?", a: "The PTCB exam has 90 multiple-choice questions, 80 of which are scored. You have 2 hours to complete the exam. A passing score is 1400 out of 1600." },
  { q: "What topics does NurseNest Allied cover for pharmacy technicians?", a: "Our platform covers all PTCB and ExCPT exam domains including pharmacology, dosage calculations, pharmacy law, compounding, prescription processing, and patient safety with 200+ practice questions, flashcards, and full-length practice exams." },
  { q: "How is this different from other pharmacy tech study resources?", a: "NurseNest Allied provides detailed rationales for every question, spaced-repetition flashcards, timed practice exams that mimic real testing conditions, and a structured study guide covering every exam topic in depth." },
  { q: "Can I study for free?", a: "Yes! Free users get access to lesson previews, a limited number of practice questions, and sample flashcard decks. Upgrade to Allied Pro for unlimited access to all content." },
];

const CERT_OPTIONS = [
  { value: "", label: "All Content", desc: "US + Canada" },
  { value: "PTCB", label: "US (PTCB/ExCPT)", desc: "United States" },
  { value: "PEBC", label: "Canada (PEBC)", desc: "Canada" },
];

export default function PharmtechHubPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cert, setCert] = useState("");

  useEffect(() => {
    fetch("/api/pharmtech/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechHub.pharmacyTechnicianExamPrepPtcb")}
        description={t("allied.pharmtechHub.prepareForThePtcbAnd")}
        keywords="pharmacy technician exam prep, PTCB exam, ExCPT exam, pharmacy tech practice questions, pharmacy technician certification, pharmacy tech study guide, pharmacy tech flashcards"
        canonicalPath="/allied-health/pharmacy-technician"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Pharmacy Technician Certification Prep",
          description: "Comprehensive PTCB and ExCPT exam preparation with practice questions, flashcards, and study tools.",
          provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
            ],
          },
          buildJobTrainingStructuredData({
            name: "Pharmacy Technician Certification Prep",
            description: "Comprehensive PTCB and ExCPT exam preparation with practice questions, flashcards, study guides, and mock exams.",
            url: "https://www.nursenest.ca/allied-health/pharmacy-technician",
            occupationalCategory: "Pharmacy Technician",
            educationRequirements: "PTCB CPhT",
            timeToComplete: "P8W",
          }),
        ]}
      />

      <div data-testid="pharmtech-hub-page">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-teal-600">{t("allied.pharmtechHub.allied")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">{t("allied.pharmtechHub.pharmacyTechnician")}</span>
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <Pill className="w-4 h-4" />
                PTCB · ExCPT · PEBC Prep
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hero-title">
                Pharmacy Technician<br />
                <span className="text-green-600">{t("allied.pharmtechHub.examPrepHub")}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-hero-subtitle">
                Master every domain of the PTCB and ExCPT exams with expert-written lessons, practice questions with detailed rationales, spaced-repetition flashcards, and timed practice exams.
              </p>
              <div className="flex items-center gap-1.5 mb-6" data-testid="cert-filter-hub">
                <Globe className="w-4 h-4 text-gray-400 mr-1" />
                {CERT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setCert(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cert === opt.value ? "bg-green-600 text-white shadow-sm" : "bg-white/80 text-gray-600 hover:bg-white"}`}
                    data-testid={`button-hub-cert-${opt.value || "all"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/allied-health/pharmacy-technician/lessons${cert ? `?cert=${cert}` : ""}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all" data-testid="button-start-learning">
                  <GraduationCap className="w-4 h-4" /> Start Learning Free
                </Link>
                <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-practice-questions">
                  <BookOpen className="w-4 h-4" /> Practice Questions
                </Link>
                <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-practice-exam-questions">
                  <FileText className="w-4 h-4" /> Practice Exam Questions
                </Link>
              </div>
            </div>
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-12">
                {[
                  { label: "Lessons", value: stats.lessonCount || 0 },
                  { label: "Flashcard Decks", value: stats.deckCount || 0 },
                  { label: "Flashcards", value: stats.flashcardCount || 0 },
                  { label: "Questions", value: stats.questionCount || 0 },
                  { label: "Practice Exams", value: stats.examCount || 0 },
                ].map(s => (
                  <div key={s.label} className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-green-100" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="text-2xl font-bold text-green-700">{s.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.pharmtechHub.studyTopics")}</h2>
          <p className="text-gray-500 mb-8">{t("allied.pharmtechHub.exploreAllTheDomainsCovered")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPIC_CARDS.map(topic => (
              <Link key={topic.slug} href={topic.href} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all" data-testid={`card-topic-${topic.slug}`}>
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <topic.icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="study-plan-widget">
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl border border-green-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" /> Study Plan
                </h2>
                <p className="text-sm text-gray-500 mt-1">{t("allied.pharmtechHub.createAPersonalizedStudySchedule")}</p>
              </div>
              <Link
                href="/allied-health/pharmacy-technician/study-plan"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-sm transition-all"
                data-testid="button-create-study-plan"
              >
                <GraduationCap className="w-4 h-4" /> Create Study Plan
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Link href="/allied-health/pharmacy-technician/study-plan" className="flex items-center gap-3 px-4 py-3 bg-white/80 rounded-xl hover:bg-white transition-colors" data-testid="link-preset-crash">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{t("allied.pharmtechHub.2weekCrashPlan")}</div>
                  <div className="text-xs text-gray-500">{t("allied.pharmtechHub.intensiveReview")}</div>
                </div>
              </Link>
              <Link href="/allied-health/pharmacy-technician/study-plan" className="flex items-center gap-3 px-4 py-3 bg-white/80 rounded-xl hover:bg-white transition-colors" data-testid="link-preset-balanced">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{t("allied.pharmtechHub.4weekBalanced")}</div>
                  <div className="text-xs text-gray-500">{t("allied.pharmtechHub.steadyCoverage")}</div>
                </div>
              </Link>
              <Link href="/allied-health/pharmacy-technician/study-plan" className="flex items-center gap-3 px-4 py-3 bg-white/80 rounded-xl hover:bg-white transition-colors" data-testid="link-preset-comprehensive">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{t("allied.pharmtechHub.8weekComprehensive")}</div>
                  <div className="text-xs text-gray-500">{t("allied.pharmtechHub.deepCoverage")}</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-green-200 transition-all" data-testid="card-flashcards">
                <Brain className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechHub.flashcardDecks")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.pharmtechHub.masterKeyPharmacyConceptsWith")}</p>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Decks <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/pharmacy-technician/exams" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-green-200 transition-all" data-testid="card-exams">
                <FileText className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechHub.practiceExams")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.pharmtechHub.takeTimedPracticeExamsThat")}</p>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Exams <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/pharmacy-technician/study-guide" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-green-200 transition-all" data-testid="card-study-guide">
                <GraduationCap className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechHub.studyGuide")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.pharmtechHub.comprehensiveStudyGuideCoveringEvery")}</p>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/pharmacy-technician/adaptive-practice" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-green-200 transition-all" data-testid="card-adaptive-practice">
                <Zap className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechHub.adaptivePractice")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.pharmtechHub.aipoweredPracticeThatAdaptsTo")}</p>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Practicing <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.pharmtechHub.frequentlyAskedQuestions")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.pharmtechHub.commonQuestionsAboutOurPharmacy")}</p>
          <div className="space-y-3" data-testid="faq-section">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "text-green-600 rotate-180" : "text-gray-400"}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="related-careers-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.pharmtechHub.relatedAlliedHealthCareers")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.pharmtechHub.exploreOtherHealthcareCareerPaths")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RELATED_CAREERS.map(career => (
              <Link key={career.shortName} href={career.href} className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-green-200 transition-all" data-testid={`link-related-${career.shortName.toLowerCase()}`}>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{career.shortName}</h3>
                <p className="text-xs text-gray-500 mb-2">{career.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{career.desc}</p>
                <span className="text-green-600 text-xs font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("allied.pharmtechHub.readyToStartStudying")}</h2>
            <p className="text-green-100 mb-8">{t("allied.pharmtechHub.joinThousandsOfPharmacyTechnician")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/allied-health/pharmacy-technician/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all" data-testid="button-cta-start">
                <GraduationCap className="w-4 h-4" /> Start Free
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
