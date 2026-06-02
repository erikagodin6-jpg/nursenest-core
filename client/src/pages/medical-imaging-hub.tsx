import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ImagingUpgradeCTA } from "@/components/imaging-paywall";
import {
  Radio, ArrowRight, BookOpen, FileText, Brain, Zap, CheckCircle2,
  TrendingUp, MapPin, GraduationCap, Clock, Star, ShoppingBag, Crown, CreditCard,
  Target, Share2, Mail
} from "lucide-react";
import { EndOfContentLeadCapture } from "@/components/lead-capture";

import { useI18n } from "@/lib/i18n";
const COUNTRY_CARDS = [
  {
    country: "Canada",
    slug: "canada",
    exam: "CAMRT Certification",
    description: "Prepare for the Canadian Association of Medical Radiation Technologists (CAMRT) certification exam with Canada-specific content, positioning guides, and practice exams.",
    flag: "\u{1F1E8}\u{1F1E6}",
    color: "from-red-500 to-red-600",
    accent: "red",
    features: ["CAMRT-aligned question bank", "Canadian radiation safety regulations", "Provincial practice standards", "Bilingual study materials"],
  },
  {
    country: "USA",
    slug: "usa",
    exam: "ARRT Certification",
    description: "Master the American Registry of Radiologic Technologists (ARRT) exam with comprehensive USA-specific content, positioning protocols, and practice tests.",
    flag: "\u{1F1FA}\u{1F1F8}",
    color: "from-blue-500 to-blue-600",
    accent: "blue",
    features: ["ARRT exam blueprint coverage", "US federal radiation regulations", "State licensing requirements", "ASRT-aligned content"],
  },
];

const STUDY_PATH_STEPS = [
  { step: 1, title: "Diagnostic Assessment", description: "Take a free diagnostic to identify your strengths and gaps across all exam domains.", icon: Brain },
  { step: 2, title: "Targeted Lessons", description: "Study curated lessons covering radiographic positioning, physics, patient care, and image evaluation.", icon: BookOpen },
  { step: 3, title: "Flashcard Drills", description: "Reinforce key concepts with spaced-repetition flashcards for anatomy, positioning, and physics.", icon: Zap },
  { step: 4, title: "Practice Exams", description: "Take timed, blueprint-weighted practice exams that mirror the real certification test.", icon: FileText },
  { step: 5, title: "Case Studies", description: "Analyze real-world radiographic case studies with image interpretation and clinical correlation.", icon: Star },
  { step: 6, title: "Readiness Check", description: "Get your estimated pass probability and a final review plan before exam day.", icon: CheckCircle2 },
];

export default function MedicalImagingHub() {
  const { t } = useI18n();
  return (
    <div data-testid="medical-imaging-hub-page">
      <SEO
        title={t("pages.medicalImagingHub.medicalImagingRadiographyExamPrep")}
        description={t("pages.medicalImagingHub.prepareForYourRadiographyCertification")}
        keywords="medical imaging exam prep, radiography certification, CAMRT exam, ARRT exam, radiologic technologist, X-ray technician exam, radiography practice questions, positioning guide"
        canonicalPath="/medical-imaging"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "NurseNest Medical Imaging Exam Prep",
          "description": "Comprehensive radiography certification exam preparation for CAMRT and ARRT exams",
          "url": "https://www.nursenest.ca/medical-imaging",
          "hasCourse": [
            {
              "@type": "Course",
              "name": "CAMRT Radiography Exam Prep",
              "description": "Canadian radiography certification exam preparation",
              "provider": { "@type": "Organization", "name": "NurseNest" },
              "educationalLevel": "Professional Certification"
            },
            {
              "@type": "Course",
              "name": "ARRT Radiography Exam Prep",
              "description": "American radiography certification exam preparation",
              "provider": { "@type": "Organization", "name": "NurseNest" },
              "educationalLevel": "Professional Certification"
            }
          ]
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
        ]} />
      </div>

      <section className="relative overflow-hidden py-16 sm:py-24" data-testid="imaging-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-100/80 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6" data-testid="badge-imaging">
              <Radio className="w-4 h-4" />
              Medical Imaging Exam Academy
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" data-testid="text-imaging-hero-title">
              Ace Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t("pages.medicalImagingHub.radiographyExam")}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="text-imaging-hero-subtitle">
              Comprehensive exam preparation for CAMRT (Canada) and ARRT (USA) radiography certification. Positioning guides, physics review, practice exams, and AI-powered study tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/medical-imaging/canada" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 text-white rounded-xl text-base font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200" data-testid="button-canada-prep">
                <span>{"\u{1F1E8}\u{1F1E6}"}</span> Canada (CAMRT) <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/medical-imaging/usa" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl text-base font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200" data-testid="button-usa-prep">
                <span>{"\u{1F1FA}\u{1F1F8}"}</span> USA (ARRT) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="imaging-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Practice Questions", value: "2,500+", icon: BookOpen },
              { label: "Country Pathways", value: "2", icon: MapPin },
              { label: "Positioning Guides", value: "150+", icon: GraduationCap },
              { label: "Est. Prep Time", value: "8-12 wks", icon: Clock },
            ].map(stat => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <stat.icon className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" data-testid="imaging-country-cards">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-choose-country">{t("pages.medicalImagingHub.chooseYourCountry")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("pages.medicalImagingHub.selectYourCertificationPathwayFor")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COUNTRY_CARDS.map(card => (
              <Link
                key={card.slug}
                href={`/medical-imaging/${card.slug}`}
                className="block group"
                data-testid={`card-country-${card.slug}`}
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all h-full">
                  <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{card.flag}</span>
                      <div>
                        <h3 className="text-xl font-bold">{card.country} Radiography Prep</h3>
                        <p className="text-white/80 text-sm">{card.exam}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                    <ul className="space-y-2 mb-4">
                      {card.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:text-indigo-700">
                      Start Preparing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-indigo-50/50 to-white" data-testid="imaging-study-path">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.medicalImagingHub.yourStudyPath")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("pages.medicalImagingHub.followOurProven6stepStudy")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDY_PATH_STEPS.map(step => (
              <div key={step.step} className="bg-white rounded-xl border border-gray-100 p-6 relative" data-testid={`step-${step.step}`}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-indigo-500 mb-3 mt-2" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" data-testid="imaging-pricing-cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImagingUpgradeCTA variant="banner" />
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href="/medical-imaging/store" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors" data-testid="link-hub-store">
              <ShoppingBag className="w-4 h-4" /> Browse Study Store
            </Link>
            <Link href="/medical-imaging/account" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors" data-testid="link-hub-account">
              <Crown className="w-4 h-4" /> My Account
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="imaging-growth-tools">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.medicalImagingHub.freeStudyTools")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("pages.medicalImagingHub.getStartedWithOurFree")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/radiography-readiness-quiz" className="block group" data-testid="link-readiness-quiz">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 hover:shadow-lg transition-all h-full">
                <Target className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pages.medicalImagingHub.readinessQuiz")}</h3>
                <p className="text-sm text-gray-600 mb-3">{t("pages.medicalImagingHub.takeAFree15questionQuiz")}</p>
                <span className="text-sm text-indigo-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Start Quiz <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
            <Link href="/medical-imaging/study-plan-generator" className="block group" data-testid="link-study-plan-gen">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 hover:shadow-lg transition-all h-full">
                <BookOpen className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pages.medicalImagingHub.studyPlanGenerator")}</h3>
                <p className="text-sm text-gray-600 mb-3">{t("pages.medicalImagingHub.getAPersonalizedWeekbyweekStudy")}</p>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Create Plan <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
            <Link href="/medical-imaging/canada/flashcards" className="block group" data-testid="link-flashcard-decks">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6 hover:shadow-lg transition-all h-full">
                <Zap className="w-8 h-8 text-amber-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pages.medicalImagingHub.quickReviewFlashcards")}</h3>
                <p className="text-sm text-gray-600 mb-3">{t("pages.medicalImagingHub.studyPositioningLandmarksPhysicsFormulas")}</p>
                <span className="text-sm text-amber-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Browse Flashcards <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-gray-50 to-white" data-testid="imaging-content-carousels">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.medicalImagingHub.exploreLearningResources")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("pages.medicalImagingHub.browseOurCuratedCollectionsOf")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Most Popular Topics", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", link: "/medical-imaging/canada/lessons" },
              { title: "Best for Beginners", icon: GraduationCap, color: "text-green-600", bg: "bg-green-50", link: "/medical-imaging/canada/lessons" },
              { title: "Image-Based Practice", icon: FileText, color: "text-purple-600", bg: "bg-purple-50", link: "/medical-imaging/canada/practice-exams" },
              { title: "Positioning Practice", icon: MapPin, color: "text-red-600", bg: "bg-red-50", link: "/medical-imaging/canada/positioning" },
              { title: "Quick Review Flashcards", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", link: "/medical-imaging/canada/flashcards" },
              { title: "Physics Review", icon: Brain, color: "text-indigo-600", bg: "bg-indigo-50", link: "/medical-imaging/canada/physics" },
            ].map((carousel) => (
              <Link key={carousel.title} href={carousel.link} className="group" data-testid={`carousel-${carousel.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-indigo-200 transition-all">
                  <div className={`p-2.5 rounded-lg ${carousel.bg}`}>
                    <carousel.icon className={`w-5 h-5 ${carousel.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{carousel.title}</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100" data-testid="imaging-community-share">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <Share2 className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">{t("pages.medicalImagingHub.shareWithClassmates")}</h2>
            <p className="text-white/80 mb-4 max-w-md mx-auto text-sm">{t("pages.medicalImagingHub.invite3ClassmatesToUnlock")}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  const text = "Check out this radiography exam prep resource — free practice questions, positioning guides, and study plans!";
                  const url = window.location.href;
                  if (navigator.share) navigator.share({ title: "Medical Imaging Exam Prep", text, url }).catch(() => {});
                  else navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
                }}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                data-testid="button-share-hub"
              >
                <Share2 className="w-4 h-4" /> Share This Page
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="imaging-nursenest-branding">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 sm:p-12 border border-indigo-100">
            <Radio className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-branding-title">
              Powered by NurseNest
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              The same trusted platform used by thousands of nursing students, now expanded to support medical imaging and radiography professionals across Canada and the USA.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Adaptive Learning
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Brain className="w-4 h-4 text-indigo-500" />
                AI-Powered Study Plans
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Star className="w-4 h-4 text-indigo-500" />
                Expert-Reviewed Content
              </div>
            </div>
          </div>
        </div>
      </section>

      <EndOfContentLeadCapture
        leadMagnetType="study_guide"
        professionContext="medical_imaging"
        source="medical_imaging_hub"
      />
    </div>
  );
}
