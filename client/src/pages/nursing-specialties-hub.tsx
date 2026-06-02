import { Link } from "wouter";
import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { NURSING_SPECIALTIES } from "@/data/nursing-specialties-detail-data";
import { HEALTHCARE_GUIDES } from "@shared/healthcare-guide-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Heart, Brain, Baby, Stethoscope, Ribbon, SmilePlus,
  Clock, Users, Scissors, Check, HelpCircle, ChevronRight,
  BookOpen, FileText, Pill, ClipboardList, Activity, GraduationCap
} from "lucide-react";

const TRACK_FEATURES = [
  { icon: BookOpen, label: "Specialty-specific pathophysiology lessons" },
  { icon: FileText, label: "Focused question banks mapped to specialty exams" },
  { icon: Stethoscope, label: "Clinical scenarios unique to each specialty" },
  { icon: Pill, label: "Medication deep dives for specialty pharmacology" },
  { icon: ClipboardList, label: "Assessment guides tailored to patient populations" },
  { icon: Activity, label: "Priority-setting drills for specialty nursing contexts" },
];

const FAQ_DATA = [
  {
    question: "Can I access multiple specialties at the same time?",
    answer: "Yes. Your NurseNest subscription gives you unlimited access to every specialty track. Study one or all twelve — there are no per-specialty fees or content locks between tracks."
  },
  {
    question: "Are these specialty tracks aligned to certification exams?",
    answer: "Absolutely. Each track maps to the official certification exam blueprint for that specialty (e.g., CCRN for Critical Care, CEN for Emergency, RNC-OB for Maternal-Newborn). Content is updated when blueprints change."
  },
  {
    question: "How deep does the specialty content go?",
    answer: "Very deep. These are not summary-level overviews. Each track includes advanced pathophysiology, specialty pharmacology, clinical decision-making scenarios, and assessment-specific content designed for nurses already working in or transitioning to the specialty."
  },
  {
    question: "I'm a new grad — should I start with a specialty track?",
    answer: "We recommend completing the core NCLEX or REX-PN content first to build a strong generalist foundation. Once you've passed your licensing exam or started a specialty role, these tracks help you level up quickly."
  },
  {
    question: "Do specialty tracks include practice questions?",
    answer: "Yes. Every specialty track includes a dedicated question bank with questions written at the certification-exam level. You get full rationales, domain-level analytics, and adaptive difficulty just like the main question bank."
  },
  {
    question: "How often is specialty content updated?",
    answer: "Content is reviewed quarterly and updated whenever clinical guidelines or certification exam blueprints change. We follow updates from AACN, ENA, AWHONN, ONS, and other specialty organizations."
  },
  {
    question: "Can I use specialty tracks for continuing education?",
    answer: "While NurseNest does not currently offer CE credits, the content is designed to support ongoing professional development. Many nurses use our specialty tracks alongside formal CE programs to deepen their clinical knowledge."
  },
  {
    question: "Are there clinical simulations for each specialty?",
    answer: "Yes. Each specialty includes unfolding case simulations that mirror real clinical scenarios you'd encounter in that unit. These help you practice clinical judgment in a safe, guided environment."
  },
  {
    question: "What if my specialty isn't listed?",
    answer: "We're actively expanding. If you don't see your specialty, let us know through our feedback form. Wound care, nephrology, and cardiac catheterization are among the tracks currently in development."
  },
  {
    question: "Is this content available in other languages?",
    answer: "Yes. NurseNest supports 15 languages across the platform, including French, Spanish, Tagalog, Hindi, and more. Specialty content follows the same multilingual support as our core lessons."
  },
];

const SAMPLE_LESSON = {
  specialty: "Critical Care RN",
  title: "Hemodynamic Monitoring & Waveform Interpretation",
  topics: [
    "Arterial line waveform analysis and troubleshooting",
    "Central venous pressure (CVP) measurement and clinical significance",
    "Pulmonary artery catheter data interpretation",
    "Cardiac output and cardiac index calculations",
    "SVR and PVR — when to intervene",
    "Correlating hemodynamic data with clinical presentation",
  ],
};

export default function NursingSpecialtiesHub() {
  const { t } = useI18n();
  const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

  return (
    <div data-testid="page-nursing-specialties-hub">
      <Navigation />
      <SEO
        title={t("pages.nursingSpecialtiesHub.nursingSpecialtiesCriticalCareEr")}
        description={t("pages.nursingSpecialtiesHub.deepdiveSpecialtyNursingContentFor")}
        keywords="nursing specialties, critical care nursing, emergency nursing, pediatric nursing, oncology nursing, mental health nursing, CCRN prep, CEN prep, specialty certification, nursing specialty tracks"
        canonicalPath="/nursing-specialties"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Nursing Specialty Deep Dives",
          "description": "Deep-dive specialty nursing content for critical care, emergency, pediatric, maternal-newborn, oncology, mental health, and more. Exam-aligned specialty tracks.",
          "provider": {
            "@type": "Organization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca"
          },
          "numberOfCredits": 12,
          "educationalLevel": "Advanced",
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Specialties", url: "https://www.nursenest.ca/nursing-specialties" },
        ]}
        additionalStructuredData={[faqStructuredData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.nursingSpecialtiesHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("pages.nursingSpecialtiesHub.nursingSpecialties")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4" data-testid="badge-specialty-tracks">
              Specialty Tracks
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              Nursing Specialty Deep Dives
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              Go beyond generalist content. Master the advanced pathophysiology, pharmacology, and clinical judgment skills your specialty demands — aligned to certification exam blueprints.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-browse-specialties">
                Browse Specialty Tracks <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-view-pricing">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-specialty-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-specialty-grid-heading">{t("pages.nursingSpecialtiesHub.12NursingSpecialtiesOnePlatform")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nursingSpecialtiesHub.exploreIndepthGuidesForEach")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NURSING_SPECIALTIES.map((spec) => {
              const SpecIcon = spec.icon;
              return (
                <Link
                  key={spec.slug}
                  href={`/nursing-specialties/${spec.slug}`}
                  className="group"
                  data-testid={`card-specialty-${spec.slug}`}
                >
                  <div className={`bg-white rounded-xl border ${spec.borderColor} p-6 hover:shadow-md transition-all h-full`}>
                    <div className={`w-12 h-12 rounded-xl ${spec.bgColor} flex items-center justify-center mb-4`}>
                      <SpecIcon className={`w-6 h-6 ${spec.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-specialty-name-${spec.slug}`}>
                      {spec.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{spec.metaDescription.split('.')[0]}.</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {spec.certifications.slice(0, 2).map((cert) => (
                        <span key={cert.name} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{cert.name}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-track-features">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-track-features-heading">{t("pages.nursingSpecialtiesHub.whatEachTrackIncludes")}</h2>
            <p className="text-gray-600">{t("pages.nursingSpecialtiesHub.everySpecialtyTrackIsA")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRACK_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-5" data-testid={`card-track-feature-${i}`}>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{feature.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-sample-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-sample-heading">{t("pages.nursingSpecialtiesHub.sampleSpecialtyLessonPreview")}</h2>
            <p className="text-gray-600">{t("pages.nursingSpecialtiesHub.heresWhatALessonLooks")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 px-6 py-4 border-b border-red-100">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mb-2">
                {SAMPLE_LESSON.specialty}
              </div>
              <h3 className="text-lg font-bold text-gray-900" data-testid="text-sample-lesson-title">{SAMPLE_LESSON.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">{t("pages.nursingSpecialtiesHub.whatYoullMaster")}</p>
              <ul className="space-y-2.5">
                {SAMPLE_LESSON.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2.5" data-testid={`text-sample-topic-${i}`}>
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{topic}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href="/lessons" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-testid="link-explore-lessons">
                  Explore All Specialty Lessons <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-faq-heading">{t("pages.nursingSpecialtiesHub.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">{t("pages.nursingSpecialtiesHub.everythingYouNeedToKnow")}</p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-in-depth-guides">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-guides-heading">{t("pages.nursingSpecialtiesHub.indepthSpecialtyGuides")}</h2>
            <p className="text-gray-600">{t("pages.nursingSpecialtiesHub.comprehensiveClinicalGuidesCoveringPathophysio")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HEALTHCARE_GUIDES.filter(g => g.category === "nursing-specialty").map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group" data-testid={`card-guide-${guide.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all h-full">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${guide.color}15` }}>
                    <GraduationCap className="w-5 h-5" style={{ color: guide.color }} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{guide.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{guide.metaDescription.split('.')[0]}.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    Read Full Guide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.nursingSpecialtiesHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/nursing-certifications" className="bg-emerald-50 rounded-xl p-6 hover:bg-emerald-100 transition-colors group" data-testid="link-certifications">
              <h3 className="font-semibold text-emerald-900 mb-1 group-hover:text-emerald-700">{t("pages.nursingSpecialtiesHub.nursingCertifications")}</h3>
              <p className="text-sm text-emerald-700/70">{t("pages.nursingSpecialtiesHub.completeGuidesToCcrnCen")}</p>
            </Link>
            <Link href="/study-pathways" className="bg-violet-50 rounded-xl p-6 hover:bg-violet-100 transition-colors group" data-testid="link-pathways">
              <h3 className="font-semibold text-violet-900 mb-1 group-hover:text-violet-700">{t("pages.nursingSpecialtiesHub.studyPathways")}</h3>
              <p className="text-sm text-violet-700/70">{t("pages.nursingSpecialtiesHub.structuredStudyPlansToMaster")}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to Go Deep in Your Specialty?
          </h2>
          <p className="text-blue-100 mb-4 text-lg">
            All 12 specialty tracks are included with your NurseNest subscription. No per-track fees, no content limits.
          </p>
          <p className="text-blue-200 mb-8 text-sm">
            Starting at $19/month or included with any RN/NP subscription tier.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/lessons" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-browse">
              Browse Lessons
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}
