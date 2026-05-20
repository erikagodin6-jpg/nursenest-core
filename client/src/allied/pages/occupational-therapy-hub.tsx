import { Link } from "wouter";
import { useState, useEffect } from "react";
import { BookOpen, Brain, FileText, GraduationCap, ChevronRight, Hand, CheckCircle2, ArrowRight, HelpCircle, Sparkles, Target, Clock, Calendar, BarChart3, Play, Zap } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const TOPIC_CARDS = [
  { title: "ADL & IADL Training", slug: "adl-training", desc: "Activities of daily living, self-care routines, adaptive strategies, and functional independence measures", icon: Target },
  { title: "Assistive Technology & Devices", slug: "assistive-devices", desc: "Adaptive equipment, wheelchair positioning, environmental modifications, and assistive technology assessment", icon: Sparkles },
  { title: "Cognitive Rehabilitation", slug: "cognitive-rehab", desc: "Memory strategies, attention training, executive function, and cognitive screening assessments", icon: Brain },
  { title: "Hand Therapy & Upper Extremity", slug: "hand-therapy", desc: "Splinting, tendon repairs, nerve injuries, fracture management, and grip strength evaluation", icon: Hand },
  { title: "Pediatric Development", slug: "pediatric-development", desc: "Developmental milestones, sensory processing, school-based OT, early intervention, and play assessment", icon: Play },
  { title: "Stroke & Neurological Rehab", slug: "stroke-rehab", desc: "Hemiplegia management, neurodevelopmental treatment, constraint-induced therapy, and functional recovery", icon: BarChart3 },
];

const FAQ_DATA = [
  { q: "What is the NBCOT OTR exam?", a: "The NBCOT OTR (National Board for Certification in Occupational Therapy) exam is the primary licensing exam for occupational therapists in the United States. It consists of 200 questions (170 scored + 30 pretest) including multiple-choice and clinical simulation items, with a 4-hour time limit." },
  { q: "What is the NOTCE exam?", a: "The NOTCE (National Occupational Therapy Certification Examination) is the Canadian OT licensing exam administered by CAOT. It tests clinical reasoning, professional practice, and intervention planning for occupational therapy practice in Canada." },
  { q: "What topics does NurseNest Allied cover for occupational therapy?", a: "Our platform covers all NBCOT OTR and NOTCE exam domains including evaluation & assessment, intervention planning, professional practice & ethics, psychosocial & mental health, pediatrics & development, ADL/IADL performance, cognitive rehabilitation, and assistive technology." },
  { q: "How is this different from other OT study resources?", a: "NurseNest Allied provides detailed clinical rationales for every question, case analysis simulations with OT-specific patient vignettes, SMART goal writing practice, spaced-repetition flashcards, and timed practice exams that mimic real testing conditions." },
  { q: "Can I study for free?", a: "Yes! Free users get access to lesson previews, a limited number of practice questions, and sample flashcard decks. Upgrade to Allied Pro for unlimited access to all OT content." },
];

export default function OccupationalTherapyHubPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/occupational-therapy/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <>
      <AlliedSEO
        title={t("allied.occupationalTherapyHub.occupationalTherapyExamPrepNbcot")}
        description={t("allied.occupationalTherapyHub.prepareForTheNbcotOtr")}
        keywords="occupational therapy exam prep, NBCOT OTR exam, NOTCE exam, OT practice questions, occupational therapy certification, OT study guide, OT flashcards, occupational therapist licensing"
        canonicalPath="/allied-health/occupational-therapy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Occupational Therapy Certification Prep",
          description: "Comprehensive NBCOT OTR and NOTCE exam preparation with practice questions, flashcards, and study tools.",
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
              { "@type": "ListItem", position: 2, name: "Occupational Therapy", item: "https://www.nursenest.ca/allied-health/occupational-therapy" },
            ],
          },
        ]}
      />

      <div data-testid="ot-hub-page">
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-purple-600" data-testid="link-breadcrumb-home">{t("allied.occupationalTherapyHub.alliedHealth")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-purple-700 font-medium">{t("allied.occupationalTherapyHub.occupationalTherapy")}</span>
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                <Hand className="w-4 h-4" />
                NBCOT OTR · NOTCE Prep
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hero-title">
                Occupational Therapy<br />
                <span className="text-purple-600">{t("allied.occupationalTherapyHub.examPrepHub")}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
                Master every domain of the NBCOT OTR and NOTCE exams with expert-written lessons, practice questions with detailed rationales, spaced-repetition flashcards, and timed practice exams.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/allied-health/occupational-therapy/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all" data-testid="button-start-learning">
                  <GraduationCap className="w-4 h-4" /> Start Learning Free
                </Link>
                <Link href="/allied-health/occupational-therapy/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl text-sm font-semibold border border-purple-200 hover:bg-purple-50 transition-all" data-testid="button-practice-questions">
                  <BookOpen className="w-4 h-4" /> Practice Questions
                </Link>
              </div>
            </div>
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {[
                  { label: "Lessons", value: stats.lessonCount || 0 },
                  { label: "Flashcards", value: stats.flashcardCount || 0 },
                  { label: "Questions", value: stats.questionCount || 0 },
                  { label: "Practice Exams", value: stats.examCount || 0 },
                ].map(s => (
                  <div key={s.label} className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-purple-100" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="text-2xl font-bold text-purple-700">{s.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.occupationalTherapyHub.studyTopics")}</h2>
          <p className="text-gray-500 mb-8">{t("allied.occupationalTherapyHub.exploreAllTheDomainsCovered")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPIC_CARDS.map(topic => (
              <Link key={topic.slug} href="/allied-health/occupational-therapy/study-guide" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all" data-testid={`card-topic-${topic.slug}`}>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                  <topic.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/allied-health/occupational-therapy/flashcards" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-purple-200 transition-all" data-testid="card-flashcards">
                <Brain className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.occupationalTherapyHub.flashcardDecks")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.occupationalTherapyHub.masterKeyOtConceptsWith")}</p>
                <span className="text-purple-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Decks <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/occupational-therapy/mock-exam" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-purple-200 transition-all" data-testid="card-exams">
                <FileText className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.occupationalTherapyHub.practiceExams")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.occupationalTherapyHub.takeTimedPracticeExamsThat")}</p>
                <span className="text-purple-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Exams <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/occupational-therapy/study-guide" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-purple-200 transition-all" data-testid="card-study-guide">
                <GraduationCap className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.occupationalTherapyHub.studyGuide")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.occupationalTherapyHub.comprehensiveStudyGuideCoveringEvery")}</p>
                <span className="text-purple-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/allied-health/occupational-therapy/lessons" className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-purple-200 transition-all" data-testid="card-lessons">
                <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.occupationalTherapyHub.lessons")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("allied.occupationalTherapyHub.expertwrittenLessonsCoveringEvaluationInterv")}</p>
                <span className="text-purple-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Lessons <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.occupationalTherapyHub.frequentlyAskedQuestions")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.occupationalTherapyHub.commonQuestionsAboutOurOccupational")}</p>
          <div className="space-y-3" data-testid="faq-section">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "text-purple-600 rotate-180" : "text-gray-400"}`} />
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

        <section className="bg-gradient-to-r from-purple-600 to-violet-600 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("allied.occupationalTherapyHub.readyToStartStudying")}</h2>
            <p className="text-purple-100 mb-8">{t("allied.occupationalTherapyHub.joinOccupationalTherapyStudentsUsing")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/allied-health/occupational-therapy/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-all" data-testid="button-cta-start">
                <GraduationCap className="w-4 h-4" /> Start Free
              </Link>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 border border-purple-500 transition-all" data-testid="button-cta-pricing">
                <Sparkles className="w-4 h-4" /> View Plans
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
