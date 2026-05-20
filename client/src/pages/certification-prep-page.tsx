import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DifferentiatorCTA, TrustBadges } from "@/components/competitive-differentiation";
import { CERT_PREP_CONTENT } from "@/data/certification-prep-content";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, ChevronRight, Check, GraduationCap,
  ClipboardList, Layers, Award, Target, Users, Calendar,
  Brain, BarChart3, Play, RefreshCw, Zap, Shield, Lock,
  HelpCircle, ChevronDown
} from "lucide-react";

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string; gradientFrom: string; gradientTo: string; badgeBg: string; badgeText: string; btnBg: string; btnHover: string }> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", gradientFrom: "from-red-50", gradientTo: "to-red-100/30", badgeBg: "bg-red-100", badgeText: "text-red-700", btnBg: "bg-red-600", btnHover: "hover:bg-red-700" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", gradientFrom: "from-blue-50", gradientTo: "to-blue-100/30", badgeBg: "bg-blue-100", badgeText: "text-blue-700", btnBg: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", gradientFrom: "from-sky-50", gradientTo: "to-sky-100/30", badgeBg: "bg-sky-100", badgeText: "text-sky-700", btnBg: "bg-sky-600", btnHover: "hover:bg-sky-700" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", gradientFrom: "from-orange-50", gradientTo: "to-orange-100/30", badgeBg: "bg-orange-100", badgeText: "text-orange-700", btnBg: "bg-orange-600", btnHover: "hover:bg-orange-700" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100", gradientFrom: "from-pink-50", gradientTo: "to-pink-100/30", badgeBg: "bg-pink-100", badgeText: "text-pink-700", btnBg: "bg-pink-600", btnHover: "hover:bg-pink-700" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", gradientFrom: "from-violet-50", gradientTo: "to-violet-100/30", badgeBg: "bg-violet-100", badgeText: "text-violet-700", btnBg: "bg-violet-600", btnHover: "hover:bg-violet-700" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100", gradientFrom: "from-rose-50", gradientTo: "to-rose-100/30", badgeBg: "bg-rose-100", badgeText: "text-rose-700", btnBg: "bg-rose-600", btnHover: "hover:bg-rose-700" },
  amber: { bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-100", gradientFrom: "from-amber-50", gradientTo: "to-amber-100/30", badgeBg: "bg-amber-100", badgeText: "text-amber-700", btnBg: "bg-amber-600", btnHover: "hover:bg-amber-700" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100", gradientFrom: "from-purple-50", gradientTo: "to-purple-100/30", badgeBg: "bg-purple-100", badgeText: "text-purple-700", btnBg: "bg-purple-600", btnHover: "hover:bg-purple-700" },
  teal: { bg: "bg-teal-50", iconColor: "text-teal-600", border: "border-teal-100", gradientFrom: "from-teal-50", gradientTo: "to-teal-100/30", badgeBg: "bg-teal-100", badgeText: "text-teal-700", btnBg: "bg-teal-600", btnHover: "hover:bg-teal-700" },
  indigo: { bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-100", gradientFrom: "from-indigo-50", gradientTo: "to-indigo-100/30", badgeBg: "bg-indigo-100", badgeText: "text-indigo-700", btnBg: "bg-indigo-600", btnHover: "hover:bg-indigo-700" },
};

const FREE_SAMPLE_COUNT = 3;

function extractCertSlug(pathname: string): string {

  const match = pathname.match(/\/certifications\/([a-z-]+)-prep/);
  return match ? match[1] : "";
}

function PremiumLockOverlay({ certName }: { certName: string }) {
  return (
    <div className="relative" data-testid="paywall-overlay">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10 flex flex-col items-center justify-end pb-8">
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-6 max-w-sm text-center" data-testid="paywall-card">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock Full {certName} Question Bank</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get unlimited access to all {certName} practice questions, mock exams, and performance analytics with a NurseNest subscription.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md" data-testid="button-paywall-upgrade">
            Upgrade to Premium <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="filter blur-sm pointer-events-none select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CertificationPrepPage() {
  const [location] = useLocation();
  const certSlug = extractCertSlug(location);
  const content = CERT_PREP_CONTENT[certSlug];
  const { user, hasAccess } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const hasPremium = hasAccess("certification_prep");

  if (!content) {
    return (
      <div data-testid="page-cert-prep-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.certificationPrepPage.certificationPrepNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("pages.certificationPrepPage.theCertificationPrepPageYou")}</p>
            <Link href="/nursing-certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-back-to-certs">
              Back to Certifications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = COLOR_MAP[content.color] || COLOR_MAP.blue;
  const faqStructuredData = content.faqs?.length ? buildFaqStructuredData(content.faqs) : null;

  return (
    <div data-testid={`page-cert-prep-${certSlug}`}>
      <Navigation />
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        keywords={content.seo.keywords}
        canonicalPath={`/certifications/${certSlug}-prep`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": `${content.certName} Certification Prep`,
          "description": content.seo.description,
          "provider": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "url": `https://www.nursenest.ca/certifications/${certSlug}-prep`,
          "educationalLevel": "Professional",
          "about": { "@type": "Thing", "name": content.fullName },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
          { name: `${content.certName} Prep`, url: `https://www.nursenest.ca/certifications/${certSlug}-prep` },
        ]}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-white/50 ${colors.gradientTo}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-blue-600">{t("pages.certificationPrepPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nursing-certifications" className="hover:text-blue-600">{t("pages.certificationPrepPage.certifications")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={`${colors.badgeText} font-medium`}>{content.certName} Prep</span>
          </div>
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.badgeBg} ${colors.badgeText} mb-4`} data-testid="badge-cert-prep">
              <GraduationCap className="w-4 h-4" /> Certification Prep
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {content.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-practice" className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btnBg} text-white rounded-xl font-semibold ${colors.btnHover} transition-colors shadow-lg`} data-testid="button-start-practice">
                Start Practice Questions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/certifications/${certSlug}-renewal-prep`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-renewal-prep">
                <RefreshCw className="w-4 h-4" /> Renewal Prep
              </Link>
            </div>
            <div className="mt-4">
              <Link href="/exam-readiness" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-readiness-cta">
                <Target className="w-4 h-4" /> Check your exam readiness
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
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-audience-heading">{content.audience.title}</h2>
            </div>
            <p className="text-gray-600 text-lg mb-4" data-testid="text-audience-desc">{content.audience.description}</p>
            <div className="flex flex-wrap gap-2">
              {content.audience.roles.map((role, i) => (
                <span key={i} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.iconColor}`} data-testid={`badge-role-${i}`}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-overview-heading">{content.overview.title}</h2>
          <div className="space-y-4">
            {content.overview.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-600 leading-relaxed" data-testid={`text-overview-p-${i}`}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-core-concepts">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-concepts-heading">{content.coreConcepts.title}</h2>
            <p className="text-gray-600">Key domains tested on the {content.certName} exam.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.coreConcepts.items.map((item, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colors.border} p-5`} data-testid={`card-concept-${i}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Check className={`w-4 h-4 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-study-roadmap">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-roadmap-heading">{t("pages.certificationPrepPage.studyRoadmap")}</h2>
            <p className="text-gray-600">A structured plan to prepare for your {content.certName} certification.</p>
          </div>
          <div className="space-y-4">
            {content.studyRoadmap.phases.map((phase, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-phase-${i}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                    <Calendar className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase">{phase.week}</span>
                    <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                  </div>
                </div>
                <ul className="space-y-2 ml-13">
                  {phase.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className={`w-4 h-4 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-lessons">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-lessons-heading">{t("pages.certificationPrepPage.recommendedNursenestLessons")}</h2>
            <p className="text-gray-600">Targeted lessons to build your {content.certName} knowledge.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.recommendedLessons.slice(0, hasPremium ? undefined : FREE_SAMPLE_COUNT).map((lesson, i) => (
              <Link key={i} href={`/lessons/${lesson.slug}`} className="group" data-testid={`card-lesson-${i}`}>
                <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                    <BookOpen className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{lesson.title}</h3>
                  <p className="text-xs text-gray-500">{lesson.description}</p>
                </div>
              </Link>
            ))}
          </div>
          {!hasPremium && content.recommendedLessons.length > FREE_SAMPLE_COUNT && (
            <div className="mt-6">
              <PremiumLockOverlay certName={content.certName} />
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-flashcards">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-flashcards-heading">{content.certName} Flashcard Decks</h2>
            <p className="text-gray-600">{t("pages.certificationPrepPage.spacedrepetitionFlashcardsToReinforceKey")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.flashcardDecks.map((deck, i) => (
              <Link key={i} href="/flashcards" className="group" data-testid={`card-deck-${i}`}>
                <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                    <Layers className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{deck.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{deck.description}</p>
                  <span className="text-xs font-medium text-gray-400">{deck.cardCount} cards</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-practice-questions">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-practice-heading">{t("pages.certificationPrepPage.practiceQuestions")}</h2>
            <p className="text-gray-600">Test your knowledge with {content.certName}-aligned questions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/free-practice" className="group" data-testid="card-qbank">
              <div className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                  <ClipboardList className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{t("pages.certificationPrepPage.freeSampleQuestions")}</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">{t("pages.certificationPrepPage.free")}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Try sample {content.certName} practice questions — no account required.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Start Practicing <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {hasPremium ? (
              <div className={`bg-white rounded-xl border ${colors.border} p-6`} data-testid="card-exam-sim">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                  <Play className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{content.practiceExam.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{content.practiceExam.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{content.practiceExam.questionCount} questions</span>
                  <span>{content.practiceExam.timeMinutes} minutes</span>
                </div>
              </div>
            ) : (
              <div className={`bg-white rounded-xl border-2 border-blue-200 p-6 relative overflow-hidden`} data-testid="card-exam-sim-locked">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                </div>
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                  <Play className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{content.practiceExam.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{content.practiceExam.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span>{content.practiceExam.questionCount} questions</span>
                  <span>{content.practiceExam.timeMinutes} minutes</span>
                </div>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-colors" data-testid="button-unlock-exam">
                  Unlock Mock Exam <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {!hasPremium && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3" data-testid="banner-upgrade-qbank">
              <Zap className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                Free sample questions available above.{" "}
                <Link href="/pricing" className="underline font-semibold hover:text-amber-900">
                  Upgrade to Premium
                </Link>{" "}
                for full {content.certName} question bank access with {content.practiceExam.questionCount}+ questions and mock exams.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-analytics-preview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-analytics-heading">{t("pages.certificationPrepPage.performanceAnalytics")}</h2>
            <p className="text-gray-600">{t("pages.certificationPrepPage.trackYourProgressAndIdentify")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`bg-white rounded-xl border ${colors.border} p-5 text-center`} data-testid="card-analytics-accuracy">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-3`}>
                <Target className={`w-5 h-5 ${colors.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.certificationPrepPage.accuracyTracking")}</h3>
              <p className="text-xs text-gray-500">Monitor your score trends across {content.certName} domains.</p>
            </div>
            <div className={`bg-white rounded-xl border ${colors.border} p-5 text-center`} data-testid="card-analytics-weak">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-3`}>
                <Brain className={`w-5 h-5 ${colors.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.certificationPrepPage.weakAreaDetection")}</h3>
              <p className="text-xs text-gray-500">{t("pages.certificationPrepPage.identifyTopicsThatNeedMore")}</p>
            </div>
            <div className={`bg-white rounded-xl border ${colors.border} p-5 text-center`} data-testid="card-analytics-readiness">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-3`}>
                <BarChart3 className={`w-5 h-5 ${colors.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.certificationPrepPage.examReadinessScore")}</h3>
              <p className="text-xs text-gray-500">{t("pages.certificationPrepPage.getAnEstimatedReadinessScore")}</p>
            </div>
          </div>
        </div>
      </section>

      {content.faqs?.length > 0 && (
        <section className="py-16 bg-white" data-testid="section-faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <HelpCircle className={`w-6 h-6 ${colors.iconColor}`} />
                <h2 className="text-2xl font-bold text-gray-900" data-testid="text-faq-heading">{t("pages.certificationPrepPage.frequentlyAskedQuestions")}</h2>
              </div>
              <p className="text-gray-600">Common questions about {content.certName} certification and exam prep.</p>
            </div>
            <div className="space-y-3">
              {content.faqs.map((faq, i) => (
                <div key={i} className={`bg-white rounded-xl border ${colors.border} overflow-hidden`} data-testid={`faq-item-${i}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                    data-testid={`button-faq-toggle-${i}`}
                  >
                    <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to Pass {content.certName}?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get full access to {content.certName} practice questions, flashcards, and study tools with a NurseNest subscription.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/certifications/${certSlug}-renewal-prep`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-renewal">
              <RefreshCw className="w-4 h-4" /> Renewal Prep
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-cross-heading">{t("pages.certificationPrepPage.relatedCertificationPrep")}</h2>
            <Link href="/nursing-certifications" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors" data-testid="link-back-to-hub">
              ← Back to Certification Hub
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {["bls", "acls", "pals", "nrp", "tncc", "enpc", "ccrn", "emergency-nursing", "oncology-nursing", "pediatric-nursing", "perioperative-nursing"].filter(s => s !== certSlug).slice(0, 10).map(slug => {
              const rel = CERT_PREP_CONTENT[slug];
              if (!rel) return null;
              return (
                <Link key={slug} href={`/certifications/${slug}-prep`} className="group" data-testid={`link-related-${slug}`}>
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors text-center h-full">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">{rel.certName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t("pages.certificationPrepPage.prepGuide")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <TrustBadges variant="compact" />
      <DifferentiatorCTA
        headline="Start Your Certification Prep Today"
        subtitle="Access adaptive practice exams, clinical lessons, and performance analytics to prepare with confidence."
        primaryHref="/register"
        primaryLabel="Start Free"
        secondaryHref="/pricing"
        secondaryLabel="View Plans"
      />
      <Footer />
    </div>
  );
}
