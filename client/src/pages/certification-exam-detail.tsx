import { Link, useParams } from "wouter";
import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import {
  CERTIFICATION_EXAM_CONFIGS,
  getCertQuestions,
} from "@/data/certification-exam-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Award, ShieldCheck, BookOpen, ChevronRight,
  Target, TrendingUp, Clock, Lock, Crown, Check, Play,
  ClipboardList, BarChart3, Users, HelpCircle, Zap, Brain
} from "lucide-react";

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string; gradientFrom: string; gradientTo: string; badgeBg: string; badgeText: string; btnBg: string; btnHover: string }> = {
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", gradientFrom: "from-blue-50", gradientTo: "to-blue-100/30", badgeBg: "bg-blue-100", badgeText: "text-blue-700", btnBg: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", gradientFrom: "from-red-50", gradientTo: "to-red-100/30", badgeBg: "bg-red-100", badgeText: "text-red-700", btnBg: "bg-red-600", btnHover: "hover:bg-red-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", gradientFrom: "from-sky-50", gradientTo: "to-sky-100/30", badgeBg: "bg-sky-100", badgeText: "text-sky-700", btnBg: "bg-sky-600", btnHover: "hover:bg-sky-700" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100", gradientFrom: "from-pink-50", gradientTo: "to-pink-100/30", badgeBg: "bg-pink-100", badgeText: "text-pink-700", btnBg: "bg-pink-600", btnHover: "hover:bg-pink-700" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", gradientFrom: "from-orange-50", gradientTo: "to-orange-100/30", badgeBg: "bg-orange-100", badgeText: "text-orange-700", btnBg: "bg-orange-600", btnHover: "hover:bg-orange-700" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", gradientFrom: "from-violet-50", gradientTo: "to-violet-100/30", badgeBg: "bg-violet-100", badgeText: "text-violet-700", btnBg: "bg-violet-600", btnHover: "hover:bg-violet-700" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100", gradientFrom: "from-rose-50", gradientTo: "to-rose-100/30", badgeBg: "bg-rose-100", badgeText: "text-rose-700", btnBg: "bg-rose-600", btnHover: "hover:bg-rose-700" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100", gradientFrom: "from-purple-50", gradientTo: "to-purple-100/30", badgeBg: "bg-purple-100", badgeText: "text-purple-700", btnBg: "bg-purple-600", btnHover: "hover:bg-purple-700" },
  indigo: { bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-100", gradientFrom: "from-indigo-50", gradientTo: "to-indigo-100/30", badgeBg: "bg-indigo-100", badgeText: "text-indigo-700", btnBg: "bg-indigo-600", btnHover: "hover:bg-indigo-700" },
};

export default function CertificationExamDetail() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const certSlug = params?.slug || "";
  const config = CERTIFICATION_EXAM_CONFIGS[certSlug];
  const { user, effectiveTier } = useAuth();
  const isPremium = user && effectiveTier && effectiveTier !== "free";
  const [sampleExpanded, setSampleExpanded] = useState(false);

  if (!config) {
    return (
      <div data-testid="page-cert-exam-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.certificationExamDetail.certificationNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("pages.certificationExamDetail.theCertificationExamPrepPage")}</p>
            <Link href="/certification-exam-prep" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors" data-testid="link-back-to-hub">
              Back to Exam Prep Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = COLOR_MAP[config.color] || COLOR_MAP.blue;
  const faqStructuredData = buildFaqStructuredData(config.faq);
  const freeQuestions = getCertQuestions(certSlug, { freeOnly: true, limit: 5 });

  return (
    <div data-testid={`page-cert-exam-${certSlug}`}>
      <Navigation />
      <SEO
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        canonicalPath={`/certification-exam-prep/${certSlug}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Certification Exam Prep", url: "https://www.nursenest.ca/certification-exam-prep" },
          { name: `${config.name} Exam Prep`, url: `https://www.nursenest.ca/certification-exam-prep/${certSlug}` },
        ]}
        additionalStructuredData={[faqStructuredData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-white/50 ${colors.gradientTo}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-emerald-600">{t("pages.certificationExamDetail.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/certification-exam-prep" className="hover:text-emerald-600">{t("pages.certificationExamDetail.examPrep")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={`${colors.badgeText} font-medium`}>{config.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.badgeBg} ${colors.badgeText} mb-4`} data-testid="badge-cert">
              <Award className="w-4 h-4" /> {config.name} Exam Prep
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {config.name} Certification Practice Questions & Mock Exams
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-page-subtitle">
              {config.totalQuestions.toLocaleString()}+ practice questions, {config.mockExams.length} full mock exams, and {config.topicBanks.length} topic banks for {config.fullName} ({config.org}) certification.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className={`bg-white/80 backdrop-blur rounded-xl border ${colors.border} p-4 text-center`} data-testid="hero-stat-questions">
                <div className="text-2xl font-bold text-gray-900">{config.totalQuestions.toLocaleString()}+</div>
                <div className="text-xs text-gray-500">{t("pages.certificationExamDetail.questions")}</div>
              </div>
              <div className={`bg-white/80 backdrop-blur rounded-xl border ${colors.border} p-4 text-center`} data-testid="hero-stat-mocks">
                <div className="text-2xl font-bold text-gray-900">{config.mockExams.length}</div>
                <div className="text-xs text-gray-500">{t("pages.certificationExamDetail.mockExams")}</div>
              </div>
              <div className={`bg-white/80 backdrop-blur rounded-xl border ${colors.border} p-4 text-center`} data-testid="hero-stat-topics">
                <div className="text-2xl font-bold text-gray-900">{config.topicBanks.length}</div>
                <div className="text-xs text-gray-500">{t("pages.certificationExamDetail.topicBanks")}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`/certification-exam-prep/${certSlug}/practice`} className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btnBg} text-white rounded-xl font-semibold ${colors.btnHover} transition-colors shadow-lg`} data-testid="button-start-practice">
                Start Practicing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/certifications/${certSlug}-prep`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-study-guide">
                <BookOpen className="w-4 h-4" /> Study Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-audience">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <Users className={`w-5 h-5 ${colors.iconColor}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-audience-heading">{t("pages.certificationExamDetail.whoThisCertificationIsFor")}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.audience.map((role, i) => (
                <span key={i} className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.iconColor}`} data-testid={`badge-audience-${i}`}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-exam-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <ClipboardList className={`w-5 h-5 ${colors.iconColor}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-overview-heading">{t("pages.certificationExamDetail.examStructureOverview")}</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6" data-testid="text-overview-content">{config.examOverview}</p>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-topic-banks">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-topics-heading">{config.name} Topic Banks</h2>
            <p className="text-gray-600">{t("pages.certificationExamDetail.practiceQuestionsOrganizedByTopic")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {config.topicBanks.map((bank, i) => (
              <div key={bank.slug} className={`bg-white rounded-xl border ${colors.border} p-5`} data-testid={`card-topic-${bank.slug}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <BookOpen className={`w-4 h-4 ${colors.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                      <span className="text-xs text-gray-400">{bank.questionCount} questions</span>
                    </div>
                    <p className="text-sm text-gray-500">{bank.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-mock-exams">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-mocks-heading">{config.name} Mock Exams</h2>
            <p className="text-gray-600">{t("pages.certificationExamDetail.fulllengthTimedExamsSimulatingReal")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.mockExams.map((exam, i) => (
              <div key={exam.id} className={`bg-white rounded-xl border ${colors.border} p-6 text-center`} data-testid={`card-mock-${exam.id}`}>
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                  <Play className={`w-7 h-7 ${colors.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{exam.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{exam.description}</p>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mb-4">
                  <span>{exam.questionCount} questions</span>
                  <span>{exam.timeMinutes} min</span>
                </div>
                {isPremium ? (
                  <Link href={`/certification-exam-prep/${certSlug}/practice?mode=mock&exam=${exam.id}`} className={`inline-flex items-center gap-2 px-4 py-2 ${colors.btnBg} text-white rounded-lg font-medium ${colors.btnHover} transition-colors text-sm`} data-testid={`button-mock-${exam.id}`}>
                    Start Exam <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm" data-testid={`button-mock-locked-${exam.id}`}>
                    <Lock className="w-3.5 h-3.5" /> Upgrade to Access
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-sample-questions">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 mb-3">
              <ShieldCheck className="w-4 h-4" /> Free Sample
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-sample-heading">Free {config.name} Sample Questions</h2>
            <p className="text-gray-600">Try these questions to evaluate our {config.name} question bank quality.</p>
          </div>
          <div className="space-y-4">
            {freeQuestions.slice(0, sampleExpanded ? 5 : 3).map((q, i) => (
              <SampleQuestionCard key={q.id} question={q} index={i} colors={colors} />
            ))}
          </div>
          {freeQuestions.length > 3 && !sampleExpanded && (
            <div className="text-center mt-6">
              <button onClick={() => setSampleExpanded(true)} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700" data-testid="button-show-more-samples">
                Show More Samples <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {!isPremium && (
            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 text-center" data-testid="cta-unlock-full">
              <Lock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Unlock {config.totalQuestions.toLocaleString()}+ {config.name} Questions</h3>
              <p className="text-sm text-gray-600 mb-4">{t("pages.certificationExamDetail.getFullAccessToAll")}</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors" data-testid="button-unlock-cta">
                <Crown className="w-4 h-4" /> Upgrade Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-prep-strategy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <Target className={`w-5 h-5 ${colors.iconColor}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-strategy-heading">{t("pages.certificationExamDetail.howToPrepareEffectively")}</h2>
          </div>
          <div className="space-y-3">
            {config.prepStrategy.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4" data-testid={`card-strategy-${i}`}>
                <div className={`w-6 h-6 rounded-full ${colors.bg} ${colors.iconColor} flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold`}>{i + 1}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-faq-heading">{config.name} Certification FAQ</h2>
          <div className="space-y-4">
            {config.faq.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5 group" data-testid={`faq-item-${i}`}>
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to Pass {config.name}?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Get full access to {config.totalQuestions.toLocaleString()}+ questions, {config.mockExams.length} mock exams, and performance tracking.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/certification-exam-prep/${certSlug}/practice`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-400 transition-colors border border-emerald-400" data-testid="button-cta-practice">
              Try Free Questions
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-cross-heading">{t("pages.certificationExamDetail.otherCertificationExamBanks")}</h2>
            <Link href="/certification-exam-prep" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors" data-testid="link-back-to-hub">
              ← Back to Exam Prep Hub
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.values(CERTIFICATION_EXAM_CONFIGS).filter(c => c.slug !== certSlug).slice(0, 5).map(cert => (
              <Link key={cert.slug} href={`/certification-exam-prep/${cert.slug}`} className="group" data-testid={`link-related-${cert.slug}`}>
                <div className="bg-gray-50 rounded-xl p-4 hover:bg-emerald-50 transition-colors text-center h-full">
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors text-sm">{cert.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cert.totalQuestions.toLocaleString()}+ questions</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <MedicalReviewBadge />
        <MedicalReviewJsonLd
          title={`${config.name} Exam Preparation`}
          slug={`certification-exam-prep/${certSlug}`}
          description={config.seo.description}
        />
      </div>

      <Footer />
    </div>
  );
}

function SampleQuestionCard({ question, index, colors }: { question: any; index: number; colors: any }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-6`} data-testid={`sample-question-${index}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>{question.topic}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{question.questionType.toUpperCase()}</span>
      </div>
      <p className="text-sm text-gray-800 mb-4 leading-relaxed font-medium">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => { if (!revealed) setSelected(i); }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all border ${
              revealed && i === question.correct ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium" :
              revealed && i === selected && i !== question.correct ? "bg-red-50 border-red-200 text-red-700" :
              i === selected ? `${colors.bg} ${colors.border} ${colors.iconColor}` :
              "border-gray-100 hover:bg-gray-50 text-gray-700"
            }`}
            data-testid={`sample-option-${index}-${i}`}
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
      {!revealed && selected !== null && (
        <button onClick={() => setRevealed(true)} className={`w-full py-2.5 rounded-lg text-sm font-medium ${colors.btnBg} text-white ${colors.btnHover} transition-colors`} data-testid={`button-check-${index}`}>
          Check Answer
        </button>
      )}
      {revealed && (
        <div className={`mt-4 p-4 rounded-lg ${selected === question.correct ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`} data-testid={`rationale-${index}`}>
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>{selected === question.correct ? "Correct!" : "Incorrect."}</strong> {question.rationale}
          </p>
        </div>
      )}
    </div>
  );
}
