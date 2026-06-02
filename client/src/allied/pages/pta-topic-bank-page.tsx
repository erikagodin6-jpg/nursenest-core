import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { getCareerQuestionPool, prefetchCareerQuestionPool } from "@/data/career-questions/career-question-pool";
import type { CareerQuestion } from "@/data/career-questions/rrt-questions";
import { useAuth } from "@/lib/auth";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, CheckCircle2, XCircle, ArrowRight, Lock,
  Target, Clock, Brain, Activity, Heart, Baby, Users,
  Zap, Footprints, ShieldCheck, FileText, Scale, Shield,
  Wrench, Crosshair, Thermometer, BarChart3, GraduationCap,
  Pill, ListOrdered, ChevronRight, Sparkles
} from "lucide-react";

interface CategoryMeta {
  title: string;
  category: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
  examWeight: string;
  keyTopics: string[];
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "musculoskeletal-rehab": { title: "Musculoskeletal Rehabilitation", category: "Musculoskeletal Rehabilitation", icon: Activity, gradient: "from-blue-50 to-teal-50", description: "Master ACL rehabilitation protocols, rotator cuff repair progressions, total joint replacement care, fracture management, manual therapy techniques, and soft tissue mobilization for the NPTE-PTA exam.", examWeight: "~35% of NPTE-PTA", keyTopics: ["ACL Reconstruction Rehab", "Rotator Cuff Repair", "Total Hip/Knee Replacement", "Fracture Healing & Management", "Manual Therapy Techniques", "Soft Tissue Mobilization"] },
  "neuro-rehab": { title: "Neurological Rehabilitation", category: "Neurological Rehabilitation", icon: Brain, gradient: "from-purple-50 to-blue-50", description: "Study stroke recovery interventions, spinal cord injury management, TBI rehabilitation, Parkinson's disease exercises, MS fatigue management, PNF patterns, NDT techniques, and motor learning principles.", examWeight: "~22% of NPTE-PTA", keyTopics: ["Stroke Rehabilitation", "Spinal Cord Injury Levels", "TBI Management", "Parkinson's Disease", "Multiple Sclerosis", "PNF Patterns & NDT"] },
  "cardiopulmonary-pt": { title: "Cardiopulmonary Physical Therapy", category: "Cardiopulmonary Physical Therapy", icon: Heart, gradient: "from-red-50 to-pink-50", description: "Learn cardiac rehabilitation phases I-IV, pulmonary rehabilitation techniques, vital sign monitoring, exercise prescription for cardiac patients, oxygen therapy, and breathing exercises.", examWeight: "~15% of NPTE-PTA", keyTopics: ["Cardiac Rehab Phases", "Pulmonary Rehabilitation", "Vital Signs Monitoring", "Exercise Prescription", "Oxygen Therapy", "Breathing Exercises"] },
  "pediatric-rehab": { title: "Pediatric Rehabilitation", category: "Pediatric Rehabilitation", icon: Baby, gradient: "from-yellow-50 to-orange-50", description: "Cover developmental milestones, cerebral palsy classifications, Down syndrome management, spina bifida care, school-based PT services, and early intervention strategies for the NPTE-PTA.", examWeight: "~8% of NPTE-PTA", keyTopics: ["Developmental Milestones", "Cerebral Palsy", "Down Syndrome", "Spina Bifida", "School-Based PT", "Early Intervention"] },
  "geriatric-rehab": { title: "Geriatric Rehabilitation", category: "Geriatric Rehabilitation", icon: Users, gradient: "from-amber-50 to-yellow-50", description: "Study fall prevention programs, osteoporosis exercise guidelines, balance training progressions, sarcopenia interventions, dementia care approaches, and hip fracture recovery protocols.", examWeight: "~10% of NPTE-PTA", keyTopics: ["Fall Prevention", "Osteoporosis Management", "Balance Training", "Sarcopenia", "Dementia Care", "Hip Fracture Recovery"] },
  "therapeutic-modalities": { title: "Therapeutic Modalities", category: "Therapeutic Modalities", icon: Zap, gradient: "from-cyan-50 to-blue-50", description: "Master ultrasound parameters, TENS/NMES electrode placement, interferential current therapy, iontophoresis protocols, cryotherapy/thermotherapy indications, laser therapy, and mechanical traction.", examWeight: "~12% of NPTE-PTA", keyTopics: ["Therapeutic Ultrasound", "TENS & NMES", "Interferential Current", "Iontophoresis", "Cryotherapy & Thermotherapy", "Mechanical Traction"] },
  "gait-training": { title: "Gait Training & Assistive Devices", category: "Gait Training & Assistive Devices", icon: Footprints, gradient: "from-green-50 to-teal-50", description: "Learn normal and pathological gait patterns, walker/cane/crutch fitting and progression, wheelchair seating and positioning, stair training techniques, and prosthetic gait training.", examWeight: "~10% of NPTE-PTA", keyTopics: ["Normal Gait Cycle", "Pathological Gait Patterns", "Assistive Device Selection", "Wheelchair Seating", "Stair Training", "Weight-Bearing Progressions"] },
  "safety-body-mechanics": { title: "Patient Safety & Body Mechanics", category: "Patient Safety & Body Mechanics", icon: ShieldCheck, gradient: "from-emerald-50 to-green-50", description: "Study safe patient transfer techniques, fall prevention strategies, infection control protocols, proper body mechanics for clinicians, safe patient handling equipment, and emergency procedures.", examWeight: "~8% of NPTE-PTA", keyTopics: ["Transfer Techniques", "Fall Prevention", "Infection Control", "Body Mechanics", "Safe Patient Handling", "Emergency Procedures"] },
  "documentation-communication": { title: "Documentation & Communication", category: "Documentation & Communication", icon: FileText, gradient: "from-slate-50 to-gray-100", description: "Master SOAP note writing, functional outcome documentation, Medicare documentation requirements, interprofessional communication, patient education documentation, and discharge summary writing.", examWeight: "~5% of NPTE-PTA", keyTopics: ["SOAP Notes", "Functional Outcomes", "Medicare Documentation", "Interprofessional Communication", "Patient Education Docs", "Discharge Summaries"] },
  "ethics-professional": { title: "Ethics & Professional Practice", category: "Ethics & Professional Practice", icon: Scale, gradient: "from-indigo-50 to-purple-50", description: "Cover PTA scope of practice boundaries, APTA Code of Ethics, PT-PTA supervisory requirements, patient rights and autonomy, professional boundaries, informed consent, and HIPAA compliance.", examWeight: "~8% of NPTE-PTA", keyTopics: ["PTA Scope of Practice", "APTA Code of Ethics", "Supervision Requirements", "Patient Rights", "Professional Boundaries", "HIPAA Compliance"] },
  "wound-care": { title: "Integumentary & Wound Care", category: "Integumentary & Wound Care", icon: Shield, gradient: "from-orange-50 to-amber-50", description: "Study pressure injury staging, wound assessment techniques, debridement methods, wound dressing selection, burn classification and management, and diabetic foot care protocols.", examWeight: "~8% of NPTE-PTA", keyTopics: ["Pressure Injury Staging", "Wound Assessment", "Debridement Methods", "Dressing Selection", "Burn Management", "Diabetic Foot Care"] },
  "prosthetics-orthotics": { title: "Prosthetics & Orthotics", category: "Prosthetics & Orthotics", icon: Wrench, gradient: "from-zinc-50 to-slate-100", description: "Learn transtibial and transfemoral prosthetic components, AFO/KAFO indications, spinal orthoses, prosthetic gait deviations and corrections, residual limb care, and orthotic fitting.", examWeight: "~5% of NPTE-PTA", keyTopics: ["Transtibial Prosthetics", "Transfemoral Prosthetics", "AFO & KAFO", "Spinal Orthoses", "Gait Deviations", "Residual Limb Care"] },
  "biomechanics-kinesiology": { title: "Biomechanics & Kinesiology", category: "Biomechanics & Kinesiology", icon: Crosshair, gradient: "from-sky-50 to-blue-50", description: "Master lever systems, joint mechanics, muscle actions and attachments, force couples, arthrokinematics (roll-glide-spin), open vs closed kinetic chain exercises, and biomechanical analysis.", examWeight: "~10% of NPTE-PTA", keyTopics: ["Lever Systems", "Joint Mechanics", "Muscle Actions", "Force Couples", "Arthrokinematics", "Kinetic Chains"] },
  "pain-management": { title: "Pain Management", category: "Pain Management", icon: Thermometer, gradient: "from-rose-50 to-red-50", description: "Study gate control theory, pain neuroscience education, chronic pain management approaches, TENS parameter selection, graded motor imagery, graded exposure therapy, and pain assessment scales.", examWeight: "~5% of NPTE-PTA", keyTopics: ["Gate Control Theory", "Pain Neuroscience", "Chronic Pain Approaches", "TENS for Pain", "Graded Exposure", "Pain Assessment"] },
  "evidence-based-practice": { title: "Evidence-Based Practice", category: "Evidence-Based Practice", icon: BookOpen, gradient: "from-teal-50 to-emerald-50", description: "Cover research design types, levels of evidence hierarchy, PICO question formulation, systematic review interpretation, clinical practice guidelines, and standardized outcome measures.", examWeight: "~5% of NPTE-PTA", keyTopics: ["Research Design", "Levels of Evidence", "PICO Questions", "Systematic Reviews", "Clinical Guidelines", "Outcome Measures"] },
  "therapeutic-exercise": { title: "Therapeutic Exercise", category: "Therapeutic Exercise", icon: Activity, gradient: "from-lime-50 to-green-50", description: "Master ROM exercise types (PROM/AAROM/AROM), progressive resistance training, stretching techniques, aquatic therapy principles, plyometric training, and exercise progression protocols.", examWeight: "~15% of NPTE-PTA", keyTopics: ["ROM Exercises", "Resistance Training", "Stretching Techniques", "Aquatic Therapy", "Plyometrics", "Exercise Progression"] },
  "data-collection": { title: "Data Collection & Measurement", category: "Data Collection & Measurement", icon: BarChart3, gradient: "from-violet-50 to-indigo-50", description: "Learn goniometry techniques, manual muscle testing grades, Berg Balance Scale administration, FIM scoring, pain scales (VAS/NRS), vital sign measurement, and standardized assessment tools.", examWeight: "~10% of NPTE-PTA", keyTopics: ["Goniometry", "Manual Muscle Testing", "Berg Balance Scale", "FIM Scoring", "Pain Scales", "Vital Signs"] },
  "patient-education": { title: "Patient Education & Home Programs", category: "Patient Education & Home Programs", icon: GraduationCap, gradient: "from-fuchsia-50 to-pink-50", description: "Study health literacy assessment, teach-back method, home exercise program design, self-management strategies, motivational interviewing techniques, and culturally competent education.", examWeight: "~5% of NPTE-PTA", keyTopics: ["Health Literacy", "Teach-Back Method", "Home Exercise Programs", "Self-Management", "Motivational Interviewing", "Cultural Competence"] },
  "pharmacology-pta": { title: "Pharmacology for PTAs", category: "Pharmacology for PTAs", icon: Pill, gradient: "from-emerald-50 to-teal-50", description: "Cover NSAID mechanisms, opioid side effects, muscle relaxant considerations, anticoagulant precautions, beta-blocker effects on exercise, and medication interactions affecting physical therapy.", examWeight: "~5% of NPTE-PTA", keyTopics: ["NSAIDs", "Opioid Side Effects", "Muscle Relaxants", "Anticoagulants", "Beta-Blockers", "Drug Interactions"] },
  "clinical-prioritization": { title: "Clinical Prioritization & Workflow", category: "Clinical Prioritization & Workflow", icon: ListOrdered, gradient: "from-amber-50 to-orange-50", description: "Master treatment sequencing decisions, caseload management strategies, delegation within PTA scope, emergency response protocols, discharge planning criteria, and clinical decision-making.", examWeight: "~5% of NPTE-PTA", keyTopics: ["Treatment Sequencing", "Caseload Management", "Delegation", "Emergency Response", "Discharge Planning", "Clinical Decision-Making"] },
};

const ALL_SLUGS = Object.keys(CATEGORY_META);

export default function PtaTopicBankPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const meta = CATEGORY_META[slug];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);

  const { user } = useAuth();
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";

  const [pool, setPool] = useState<CareerQuestion[]>([]);
  const [poolLoading, setPoolLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPoolLoading(true);
      try {
        await prefetchCareerQuestionPool("physiotherapyAssistant", { limit: 2000 });
        if (cancelled) return;
        setPool(getCareerQuestionPool("physiotherapyAssistant"));
      } finally {
        if (!cancelled) setPoolLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryQuestions = useMemo((): CareerQuestion[] => {
    if (!meta) return [];
    return pool.filter((q) => q.category === meta.category);
  }, [pool, meta]);

  const sampleQuestions = useMemo(() => {
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [categoryQuestions]);

  const relatedCategories = useMemo(() => {
    const currentIdx = ALL_SLUGS.indexOf(slug);
    const related: string[] = [];
    for (let i = 1; i <= 3 && related.length < 3; i++) {
      const nextIdx = (currentIdx + i) % ALL_SLUGS.length;
      related.push(ALL_SLUGS[nextIdx]);
    }
    return related;
  }, [slug]);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.ptaTopicBankPage.topicNotFound")}</h1>
          <p className="text-gray-600 mb-4">{t("allied.ptaTopicBankPage.theRequestedPtaTopicCould")}</p>
          <Link href="/allied-health/physiotherapy-assistant" className="text-teal-600 hover:text-teal-700 font-medium">
            Back to PTA Hub
          </Link>
        </div>
      </div>
    );
  }

  if (poolLoading && pool.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading practice questions...</p>
      </div>
    );
  }

  const Icon = meta.icon;
  const currentQ = sampleQuestions[currentQIdx];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowRationale(true);
  };

  const nextQuestion = () => {
    if (currentQIdx < sampleQuestions.length - 1) {
      setCurrentQIdx(currentQIdx + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
    }
  };

  const freePreviewCount = isPro ? sampleQuestions.length : Math.min(3, sampleQuestions.length);
  const isPastFreePreview = !isPro && currentQIdx >= freePreviewCount;

  return (
    <>
      <AlliedSEO
        title={`${meta.title} — PTA Practice Questions | NPTE-PTA Exam Prep`}
        description={meta.description}
        canonicalPath={`/physiotherapy-assistant/topic/${slug}`}
      />

      <div className={`bg-gradient-to-br ${meta.gradient} border-b border-gray-100`}>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/allied-health" className="hover:text-teal-600">{t("allied.ptaTopicBankPage.alliedHealth")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/allied-health/physiotherapy-assistant" className="hover:text-teal-600">PTA</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">{meta.title}</span>
          </nav>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Icon className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-topic-title">
                {meta.title} — PTA Practice Questions
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl">{meta.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 flex items-center gap-2" data-testid="text-question-count">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span className="font-semibold text-gray-900">{categoryQuestions.length}</span>
              <span className="text-gray-500 text-sm">{t("allied.ptaTopicBankPage.questions")}</span>
            </div>
            <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 flex items-center gap-2" data-testid="text-exam-weight">
              <Target className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-gray-600">{meta.examWeight}</span>
            </div>
            <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 flex items-center gap-2" data-testid="text-difficulty-range">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-gray-600">{t("allied.ptaTopicBankPage.difficulty13")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-key-topics">{t("allied.ptaTopicBankPage.keyTopicsCovered")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {meta.keyTopics.map((topic, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow" data-testid={`card-key-topic-${i}`}>
                <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{topic}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="heading-sample-questions">
            Sample {meta.title} Questions
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Try {freePreviewCount} free questions. Unlock all {categoryQuestions.length} with Allied Pro.
          </p>

          {currentQ && !isPastFreePreview ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4" data-testid="card-sample-question">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Question {currentQIdx + 1} of {freePreviewCount}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${currentQ.difficulty === 1 ? "bg-green-100 text-green-700" : currentQ.difficulty === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                  {currentQ.difficulty === 1 ? "Easy" : currentQ.difficulty === 2 ? "Medium" : "Hard"}
                </span>
              </div>

              <p className="text-gray-900 font-medium mb-5 leading-relaxed" data-testid="text-question-stem">
                {currentQ.stem}
              </p>

              <div className="space-y-3 mb-5">
                {currentQ.options.map((opt: string, idx: number) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const showResult = showRationale;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        showResult && isCorrect
                          ? "border-green-300 bg-green-50"
                          : showResult && isSelected && !isCorrect
                          ? "border-red-300 bg-red-50"
                          : isSelected
                          ? "border-teal-300 bg-teal-50"
                          : "border-gray-100 hover:border-teal-200 hover:bg-teal-50/30"
                      }`}
                      data-testid={`button-option-${idx}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm text-gray-800">{opt}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showRationale && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4" data-testid="text-rationale">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">{t("allied.ptaTopicBankPage.rationale")}</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">{currentQ.rationale}</p>
                </div>
              )}

              {showRationale && currentQIdx < freePreviewCount - 1 && (
                <button onClick={nextQuestion} className="flex items-center gap-2 text-teal-600 font-medium text-sm hover:text-teal-700" data-testid="button-next-question">
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 p-8 text-center" data-testid="card-unlock-cta">
              <Lock className="w-10 h-10 text-teal-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Unlock All {categoryQuestions.length} {meta.title} Questions
              </h3>
              <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto">
                Get full access to detailed rationales, mock exams, flashcards, and adaptive study tools.
              </p>
              <Link
                href="/allied-health/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all"
                data-testid="button-upgrade-pro"
              >
                Upgrade to Allied Pro <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-related-topics">
            Related PTA Topics
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedCategories.map((relSlug) => {
              const rel = CATEGORY_META[relSlug];
              if (!rel) return null;
              const RelIcon = rel.icon;
              const relCount = pool.filter((q) => q.category === rel.category).length;
              return (
                <Link
                  key={relSlug}
                  href={`/allied-health/physiotherapy-assistant/topic/${relSlug}`}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-teal-200 transition-all group"
                  data-testid={`card-related-${relSlug}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <RelIcon className="w-5 h-5 text-teal-500" />
                    <span className="font-semibold text-gray-900 text-sm group-hover:text-teal-700">{rel.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{rel.description.slice(0, 100)}...</p>
                  <span className="text-xs font-medium text-teal-600">{relCount} questions →</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-study-tools">
            PTA Study Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/allied-health/physiotherapy-assistant/mock-exam" className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-link-mock-exams">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-teal-500" />
                <span className="font-semibold text-gray-900">{t("allied.ptaTopicBankPage.ptaMockExams")}</span>
              </div>
              <p className="text-sm text-gray-500">{t("allied.ptaTopicBankPage.5TimedMockExamsWith")}</p>
            </Link>
            <Link href="/allied-health/physiotherapy-assistant/flashcards" className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-link-flashcards">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-teal-500" />
                <span className="font-semibold text-gray-900">{t("allied.ptaTopicBankPage.ptaFlashcards")}</span>
              </div>
              <p className="text-sm text-gray-500">{t("allied.ptaTopicBankPage.spacedrepetitionFlashcardsForKeyPta")}</p>
            </Link>
            <Link href="/allied-health/physiotherapy-assistant/practice-questions" className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-link-practice">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-teal-500" />
                <span className="font-semibold text-gray-900">{t("allied.ptaTopicBankPage.allPracticeQuestions")}</span>
              </div>
              <p className="text-sm text-gray-500">Browse all {pool.length.toLocaleString()}+ PTA questions by category</p>
            </Link>
            <Link href="/allied-health/physiotherapy-assistant/study-guide" className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all" data-testid="card-link-study-guide">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-teal-500" />
                <span className="font-semibold text-gray-900">{t("allied.ptaTopicBankPage.ptaStudyGuide")}</span>
              </div>
              <p className="text-sm text-gray-500">{t("allied.ptaTopicBankPage.structuredStudyPlanForNptepta")}</p>
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white" data-testid="section-bottom-cta">
          <h2 className="text-2xl font-bold mb-2">Ready to Master {meta.title}?</h2>
          <p className="text-teal-100 mb-6 max-w-lg mx-auto">
            Access all {categoryQuestions.length} questions with detailed rationales, plus mock exams, flashcards, and adaptive study tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/allied-health/physiotherapy-assistant/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-all" data-testid="button-cta-start-practicing">
              Start Practicing Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-400 border border-teal-400 transition-all" data-testid="button-cta-upgrade">
              Upgrade to Allied Pro
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
