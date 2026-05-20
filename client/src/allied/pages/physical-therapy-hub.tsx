import { Link } from "wouter";
import { useState, useEffect } from "react";
import { BookOpen, Brain, FileText, GraduationCap, ChevronRight, Activity, CheckCircle2, ArrowRight, HelpCircle, Sparkles, Target, Clock, Calendar, BarChart3, Play, Zap, Heart, Shield, Users, Wrench, Thermometer, Scale, Baby, ShieldCheck, Crosshair, Pill, ListOrdered, Footprints } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const PTA_TOPIC_CARDS = [
  { title: "Musculoskeletal Rehabilitation", slug: "musculoskeletal-rehab", desc: "ACL rehab, rotator cuff, joint replacements, fractures, manual therapy, and soft tissue injuries", icon: Activity, questionCount: "350+" },
  { title: "Neurological Rehabilitation", slug: "neuro-rehab", desc: "Stroke recovery, SCI, TBI, Parkinson's, MS, PNF patterns, NDT, and motor learning principles", icon: Brain, questionCount: "200+" },
  { title: "Cardiopulmonary Physical Therapy", slug: "cardiopulmonary-pt", desc: "Phase I-IV cardiac rehab, pulmonary rehab, vital signs, exercise prescription, and oxygen therapy", icon: Heart, questionCount: "75+" },
  { title: "Pediatric Rehabilitation", slug: "pediatric-rehab", desc: "Developmental milestones, CP, Down syndrome, spina bifida, school-based PT, and early intervention", icon: Baby, questionCount: "95+" },
  { title: "Geriatric Rehabilitation", slug: "geriatric-rehab", desc: "Fall prevention, osteoporosis, balance training, sarcopenia, dementia care, and hip fracture recovery", icon: Users, questionCount: "90+" },
  { title: "Therapeutic Modalities", slug: "therapeutic-modalities", desc: "Ultrasound, TENS, NMES, IFC, iontophoresis, cryotherapy, thermotherapy, laser, and traction", icon: Zap, questionCount: "60+" },
  { title: "Gait Training & Assistive Devices", slug: "gait-training", desc: "Gait cycle, pathological patterns, walker/cane/crutch selection, wheelchair seating, and stair training", icon: Footprints, questionCount: "100+" },
  { title: "Patient Safety & Body Mechanics", slug: "safety-body-mechanics", desc: "Transfer techniques, fall prevention, infection control, body mechanics, and safe patient handling", icon: ShieldCheck, questionCount: "100+" },
  { title: "Documentation & Communication", slug: "documentation-communication", desc: "SOAP notes, functional outcomes, Medicare documentation, and interprofessional communication", icon: FileText, questionCount: "50+" },
  { title: "Ethics & Professional Practice", slug: "ethics-professional", desc: "PTA scope of practice, APTA Code of Ethics, supervision, patient rights, and professional boundaries", icon: Scale, questionCount: "80+" },
  { title: "Integumentary & Wound Care", slug: "wound-care", desc: "Pressure injuries, wound assessment, debridement, dressings, burns, and diabetic foot management", icon: Shield, questionCount: "50+" },
  { title: "Prosthetics & Orthotics", slug: "prosthetics-orthotics", desc: "Transtibial & transfemoral prosthetics, AFO/KAFO, spinal orthoses, and prosthetic gait deviations", icon: Wrench, questionCount: "65+" },
  { title: "Biomechanics & Kinesiology", slug: "biomechanics-kinesiology", desc: "Lever systems, joint mechanics, muscle actions, force couples, arthrokinematics, and kinetic chains", icon: Crosshair, questionCount: "60+" },
  { title: "Pain Management", slug: "pain-management", desc: "Gate control theory, pain neuroscience, chronic pain approaches, TENS parameters, and graded exposure", icon: Thermometer, questionCount: "60+" },
  { title: "Evidence-Based Practice", slug: "evidence-based-practice", desc: "Research design, levels of evidence, PICO, systematic reviews, clinical guidelines, and outcome measures", icon: BookOpen, questionCount: "60+" },
  { title: "Therapeutic Exercise", slug: "therapeutic-exercise", desc: "ROM exercises, resistance training, stretching, aquatic therapy, plyometrics, and exercise progression", icon: Activity, questionCount: "185+" },
  { title: "Data Collection & Measurement", slug: "data-collection", desc: "Goniometry, MMT, Berg Balance Scale, FIM, pain scales, vital signs, and standardized assessments", icon: BarChart3, questionCount: "55+" },
  { title: "Patient Education & Home Programs", slug: "patient-education", desc: "Health literacy, teach-back, home exercise programs, self-management, and motivational interviewing", icon: GraduationCap, questionCount: "60+" },
  { title: "Pharmacology for PTAs", slug: "pharmacology-pta", desc: "NSAIDs, opioids, muscle relaxants, anticoagulants, beta-blockers, and medication effects on PT", icon: Pill, questionCount: "55+" },
  { title: "Clinical Prioritization & Workflow", slug: "clinical-prioritization", desc: "Treatment sequencing, caseload management, delegation, emergency response, and discharge planning", icon: ListOrdered, questionCount: "60+" },
];

const PT_FAQ_DATA = [
  { q: "What is the NPTE exam?", a: "The NPTE (National Physical Therapy Examination) is the primary licensing exam for physical therapists in the United States. Administered by the FSBPT, it consists of 250 questions (200 scored + 50 pretest) with a 5-hour time limit covering musculoskeletal, neuromuscular, cardiopulmonary, and integumentary systems." },
  { q: "What is the PCE exam?", a: "The PCE (Physiotherapy Competency Examination) is the Canadian licensing exam for physiotherapists, administered by the Canadian Alliance of Physiotherapy Regulators (CAPR). It has both a written component and a clinical component testing clinical reasoning and practical skills." },
  { q: "What topics does NurseNest Allied cover for physical therapy?", a: "Our platform covers all NPTE and PCE exam domains including musculoskeletal, neuromuscular, cardiopulmonary, integumentary systems, biomechanics & kinesiology, therapeutic exercise, patient education, discharge planning, and evidence-based practice." },
  { q: "How is this different from other PT study resources?", a: "NurseNest Allied provides detailed clinical rationales for every question, differential diagnosis training with realistic patient presentations, gait analysis simulations, spaced-repetition flashcards, and timed practice exams that mimic real testing conditions." },
  { q: "Can I study for free?", a: "Yes! Free users get access to lesson previews, a limited number of practice questions, and sample flashcard decks. Upgrade to Allied Pro for unlimited access to all PT content." },
];

const PTA_FAQ_DATA = [
  { q: "What is the NPTE-PTA exam?", a: "The NPTE-PTA (National Physical Therapy Examination for Physical Therapist Assistants) is administered by the FSBPT and is required for PTA licensure in all US states. It has 200 questions (150 scored + 50 pretest) with a 4-hour time limit covering musculoskeletal (35%), neuromuscular (22%), cardiopulmonary (15%), integumentary (8%), and non-systems topics (20%)." },
  { q: "What is the difference between the NPTE-PTA and NPTE-PT?", a: "The NPTE-PTA is for Physical Therapist Assistants (associate degree), while the NPTE-PT is for Physical Therapists (doctoral degree). The PTA exam focuses on intervention implementation, data collection, and clinical skills within the plan of care. The PT exam covers evaluation, diagnosis, prognosis, and independent clinical decision-making." },
  { q: "How many PTA practice questions do you have?", a: "NurseNest Allied has 2,000+ NPTE-PTA practice questions across 20 clinical domains, including musculoskeletal rehabilitation, neurological rehab, therapeutic modalities, gait training, pharmacology, and clinical prioritization. Each question includes a detailed clinical rationale." },
  { q: "Does this cover Canadian Physiotherapy Assistant content?", a: "Yes. Our content serves both US Physical Therapist Assistant students preparing for the NPTE-PTA and Canadian Physiotherapy Assistant students. We use dual terminology (PTA / Physiotherapy Assistant) and include content relevant to both regulatory systems." },
  { q: "How many mock exams are available?", a: "We offer 5 PTA mock exams: two full-length 150-question NPTE-PTA simulations, a domain-focused 50-question practice set, a 100-question clinical prioritization exam, and a 25-question quick quiz. All include timers, scoring, and topic-level performance breakdowns." },
  { q: "How long should I study for the NPTE-PTA?", a: "Most PTA students study 8-12 weeks before their exam. Start with a diagnostic to identify weak areas, then follow a structured plan targeting those domains. We recommend completing at least 3 full-length mock exams before test day." },
  { q: "Is there a free trial?", a: "Yes! You get 5 free practice questions with full rationales and access to a free 25-question mini mock exam. Upgrade to Allied Pro for unlimited access to all 2,000+ questions, 5 mock exams, flashcards, and study tools." },
];

export default function PhysicalTherapyHubPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openPtaFaq, setOpenPtaFaq] = useState<number | null>(null);
  const [showAllTopics, setShowAllTopics] = useState(false);

  useEffect(() => {
    fetch("/api/physical-therapy/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const visibleTopics = showAllTopics ? PTA_TOPIC_CARDS : PTA_TOPIC_CARDS.slice(0, 9);

  return (
    <>
      <AlliedSEO
        title={t("allied.physicalTherapyHub.ptaExamPrepNpteptaPractice")}
        description={t("allied.physicalTherapyHub.prepareForTheNpteptaPhysical")}
        keywords="PTA exam prep, NPTE-PTA practice questions, physical therapist assistant exam, PTA mock exam, FSBPT PTA, physiotherapy assistant certification, PTA study guide, PTA flashcards, NPTE-PTA test bank, physical therapy assistant practice test"
        canonicalPath="/allied-health/physical-therapy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "PTA & Physical Therapy Exam Prep",
          description: "Comprehensive NPTE-PTA and NPTE-PT exam preparation with 2,000+ practice questions, 5 mock exams, flashcards, and study tools across 20 clinical domains.",
          provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
          numberOfCredits: "20",
          educationalCredentialAwarded: "NPTE-PTA Exam Readiness",
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [...PT_FAQ_DATA, ...PTA_FAQ_DATA].map(f => ({
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
              { "@type": "ListItem", position: 2, name: "Physical Therapy", item: "https://www.nursenest.ca/allied-health/physical-therapy" },
            ],
          },
        ]}
      />

      <div data-testid="pt-hub-page">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-teal-600" data-testid="link-breadcrumb-home">{t("allied.physicalTherapyHub.alliedHealth")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-teal-700 font-medium">{t("allied.physicalTherapyHub.physicalTherapy")}</span>
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-4">
                <Activity className="w-4 h-4" />
                NPTE · NPTE-PTA · PCE Prep
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hero-title">
                Physical Therapy &<br />
                <span className="text-teal-600">{t("allied.physicalTherapyHub.ptaExamPrepHub")}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed" data-testid="text-hero-subtitle">
                Master every domain of the NPTE, NPTE-PTA, and PCE exams with 2,000+ expert-written practice questions across 20 clinical domains, 5 full-length mock exams with timers and scoring, and comprehensive study tools.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["2,000+ Questions", "20 Domains", "5 Mock Exams", "Detailed Rationales"].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 text-teal-700 rounded-full text-xs font-medium border border-teal-200" data-testid={`badge-${tag.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                    <CheckCircle2 className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/allied-health/physiotherapy-assistant/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all" data-testid="button-start-learning">
                  <GraduationCap className="w-4 h-4" /> Start PTA Practice Free
                </Link>
                <Link href="/allied-health/physiotherapy-assistant/mock-exam" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-semibold border border-teal-200 hover:bg-teal-50 transition-all" data-testid="button-mock-exams">
                  <FileText className="w-4 h-4" /> Take Mock Exam
                </Link>
                <Link href="/allied-health/physical-therapy/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-semibold border border-teal-200 hover:bg-teal-50 transition-all" data-testid="button-practice-questions">
                  <BookOpen className="w-4 h-4" /> PT Practice Questions
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {[
                { label: "Practice Questions", value: "2,000+" },
                { label: "Clinical Domains", value: "20" },
                { label: "Mock Exams", value: "5" },
                { label: "Flashcard Decks", value: "10" },
              ].map(s => (
                <div key={s.label} className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-teal-100" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="text-2xl font-bold text-teal-700">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.physicalTherapyHub.ptaStudyTopics20Clinical")}</h2>
          <p className="text-gray-500 mb-8">{t("allied.physicalTherapyHub.exploreAllNpteptaExamDomains")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTopics.map(topic => (
              <Link key={topic.slug} href={`/allied-health/physiotherapy-assistant/topic/${topic.slug}`} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all" data-testid={`card-topic-${topic.slug}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <topic.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full" data-testid={`count-topic-${topic.slug}`}>{topic.questionCount}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
              </Link>
            ))}
          </div>
          {!showAllTopics && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAllTopics(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-100 transition-all" data-testid="button-show-all-topics">
                Show All 20 Domains <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.physicalTherapyHub.ptaStudyTools")}</h2>
            <p className="text-gray-500 mb-8 text-center">{t("allied.physicalTherapyHub.everythingYouNeedToPass")}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/allied-health/physiotherapy-assistant/flashcards" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-flashcards">
                <Brain className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.physicalTherapyHub.flashcardDecks")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.physicalTherapyHub.10DecksCoveringSpecialTests")}</p>
                <span className="text-teal-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Decks <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/physiotherapy-assistant/mock-exam" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-exams">
                <FileText className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.physicalTherapyHub.5MockExams")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.physicalTherapyHub.fulllengthNpteptaSimulationsWithTimers")}</p>
                <span className="text-teal-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Exams <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/physiotherapy-assistant/study-guide" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-study-guide">
                <GraduationCap className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.physicalTherapyHub.studyGuide")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.physicalTherapyHub.comprehensivePtaStudyGuideOrganized")}</p>
                <span className="text-teal-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/physiotherapy-assistant/lessons" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-lessons">
                <BookOpen className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.physicalTherapyHub.ptaLessons")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.physicalTherapyHub.expertwrittenLessonsCoveringMusculoskeletalN")}</p>
                <span className="text-teal-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Lessons <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.physicalTherapyHub.internalLinksRelatedResources")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.physicalTherapyHub.exploreRelatedAlliedHealthExam")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "OTA Exam Prep", href: "/allied-health/occupational-therapy-assistant", desc: "Occupational therapy assistant certification prep" },
              { label: "RRT Exam Prep", href: "/allied-health/rrt", desc: "Respiratory therapy TMC & CSE exam resources" },
              { label: "Paramedic Exam Prep", href: "/allied-health/paramedic", desc: "EMS and paramedic certification practice" },
              { label: "Surgical Tech Exam Prep", href: "/allied-health/surgical-technologist", desc: "CST & TS-C surgical technologist resources" },
              { label: "PTA Practice Questions", href: "/allied-health/physiotherapy-assistant/practice-questions", desc: "2,000+ NPTE-PTA questions with rationales" },
              { label: "PTA Mock Exams", href: "/allied-health/physiotherapy-assistant/mock-exam", desc: "5 full-length PTA mock exams with scoring" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors border border-gray-100" data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{link.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.physicalTherapyHub.ptaExamFaq")}</h2>
            <p className="text-gray-500 mb-8 text-center">{t("allied.physicalTherapyHub.commonQuestionsAboutNpteptaExam")}</p>
            <div className="space-y-3" data-testid="pta-faq-section">
              {PTA_FAQ_DATA.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenPtaFaq(openPtaFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                    data-testid={`pta-faq-toggle-${i}`}
                  >
                    <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                    <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-transform ${openPtaFaq === i ? "text-teal-600 rotate-180" : "text-gray-400"}`} />
                  </button>
                  {openPtaFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.physicalTherapyHub.physicalTherapyPtFaq")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.physicalTherapyHub.commonQuestionsAboutOurPhysical")}</p>
          <div className="space-y-3" data-testid="faq-section">
            {PT_FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "text-teal-600 rotate-180" : "text-gray-400"}`} />
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

        <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("allied.physicalTherapyHub.readyToPassTheNptepta")}</h2>
            <p className="text-teal-100 mb-8">{t("allied.physicalTherapyHub.joinPtaAndPhysicalTherapy")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/allied-health/physiotherapy-assistant/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-all" data-testid="button-cta-start">
                <GraduationCap className="w-4 h-4" /> Start Free
              </Link>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl text-sm font-semibold hover:bg-teal-800 border border-teal-500 transition-all" data-testid="button-cta-pricing">
                <Sparkles className="w-4 h-4" /> View Plans
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
