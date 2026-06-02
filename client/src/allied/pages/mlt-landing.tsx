import { Link } from "wouter";
import {
  ArrowRight, Microscope, BookOpen, FileText, Brain, GraduationCap,
  CheckCircle2, ChevronRight, HelpCircle, Globe, Target, Award,
  Zap, FlaskConical, TestTubes, Droplets
} from "lucide-react";
import { useState } from "react";
import { AlliedSEO } from "@/allied/allied-seo";
import { MLT_DISCIPLINES, MLT_CANADA_BLUEPRINT_CATEGORIES, MLT_USA_CONTENT_AREAS } from "@shared/mlt-taxonomy";

import { useI18n } from "@/lib/i18n";
const COUNTRY_CARDS = [
  {
    country: "canada",
    label: "Canada",
    flag: "🇨🇦",
    examBoard: "CSMLS",
    examName: "CSMLS National Certification Examination",
    description: "Prepare for the Canadian Society for Medical Laboratory Science national certification with content aligned to CSMLS competency profiles and SI unit lab values.",
    features: [
      "CSMLS blueprint-weighted practice",
      "SI units (mmol/L) throughout",
      "Canadian regulatory content (Accreditation Canada)",
      "Histotechnology & quality management coverage",
    ],
    totalQuestions: 120,
    timeLimit: 180,
    passScore: "65%",
    href: "/allied-health/mlt/canada/exam-prep",
  },
  {
    country: "usa",
    label: "United States",
    flag: "🇺🇸",
    examBoard: "ASCP",
    examName: "ASCP Board of Certification MLS/MLT Examination",
    description: "Prepare for the American Society for Clinical Pathology Board of Certification exam with content mapped to the ASCP BOC content outline and conventional US lab units.",
    features: [
      "ASCP BOC content outline alignment",
      "Conventional units (mg/dL) throughout",
      "US regulatory content (CLIA, CAP, OSHA)",
      "MLT and MLS certification tracks",
    ],
    totalQuestions: 100,
    timeLimit: 150,
    passScore: "400/999",
    href: "/allied-health/mlt/usa/exam-prep",
  },
];

const MLT_FEATURES = [
  { slug: "exam-prep", label: "Exam Prep Hub", desc: "Country-specific exam preparation with blueprint alignment and targeted practice", icon: Target },
  { slug: "lessons", label: "Lessons", desc: "Comprehensive lessons across all 16 laboratory disciplines with glossary tooltips", icon: BookOpen },
  { slug: "flashcards", label: "Flashcards", desc: "Spaced repetition flashcards with image identification, mnemonics, and clinical scenarios", icon: Brain },
  { slug: "practice-exams", label: "Practice Exams", desc: "Blueprint-weighted timed exams simulating CSMLS and ASCP certification conditions", icon: FileText },
  { slug: "study-plan", label: "Study Plan", desc: "Personalized weekly study plans with checkpoints and discipline-specific resource links", icon: GraduationCap },
  { slug: "free-questions", label: "Free Questions", desc: "Try sample questions from every discipline with full rationales — no account required", icon: Zap },
];

const MLT_FAQ = [
  {
    q: "What is the difference between MLT and MLS certification?",
    a: "MLT (Medical Laboratory Technician) and MLS (Medical Laboratory Scientist) differ in education requirements and scope. MLT requires an associate's degree, while MLS requires a bachelor's degree. In Canada, the CSMLS certifies MLTs at a single level. In the US, the ASCP BOC offers separate MLT and MLS certification exams. NurseNest covers both tracks.",
  },
  {
    q: "How are your questions different from other MLT question banks?",
    a: "Every question includes a detailed rationale explaining the clinical reasoning — not just 'A is correct.' Our questions are mapped to official exam blueprints (CSMLS or ASCP BOC), cover all 16 laboratory disciplines, and include image-based questions for morphology and staining identification.",
  },
  {
    q: "Do you cover Canadian (CSMLS) and American (ASCP) exams?",
    a: "Yes. Select your country track and all content adapts — blueprint weights, lab units (SI vs conventional), regulatory modules, and exam-specific practice formats. You can switch between tracks at any time.",
  },
  {
    q: "What disciplines are covered?",
    a: "All 16 laboratory disciplines: Clinical Chemistry, Hematology, Hemostasis/Coagulation, Blood Banking, Microbiology, Urinalysis & Body Fluids, Immunology/Serology, Molecular Diagnostics, Histotechnology, Cytotechnology, Mycology, Parasitology, Virology, Phlebotomy, Lab Operations & QM, and Point-of-Care Testing.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Access free sample questions from every discipline, take a readiness diagnostic, and explore study resources — no account required. Upgrade to Pro for unlimited access to the full question bank, mock exams, and study tools.",
  },
  {
    q: "How should I prepare for the CSMLS exam vs the ASCP exam?",
    a: "The CSMLS exam (Canada) has 120 questions in 180 minutes with emphasis on histotechnology and transfusion science. The ASCP BOC exam (USA) has 100 questions in 150 minutes with heavier weighting on hematology and clinical chemistry. Our platform adjusts all practice to match your target exam.",
  },
];

export default function MltLandingPage() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": MLT_FAQ.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "MLT/MLS Exam Prep — CSMLS & ASCP Certification",
    "description": "Comprehensive Medical Laboratory Technologist exam preparation covering all 16 laboratory disciplines for CSMLS (Canada) and ASCP (USA) certification exams.",
    "provider": {
      "@type": "Organization",
      "name": "NurseNest Allied",
      "url": "https://www.nursenest.ca/allied-health",
    },
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 2, "name": "MLT Exam Prep", "item": "https://www.nursenest.ca/allied-health/mlt" },
    ],
  };

  return (
    <div data-testid="mlt-landing-page">
      <AlliedSEO
        title={t("allied.mltLanding.mltExamPrepCsmlsAscp")}
        description={t("allied.mltLanding.prepareForYourMedicalLaboratory")}
        keywords="MLT exam prep, CSMLS MLT practice questions, ASCP MLS exam prep, medical laboratory technologist, MLT certification, lab tech exam, hematology questions, clinical chemistry practice"
        canonicalPath="/allied-health/mlt"
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData, breadcrumbStructuredData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="mlt-breadcrumbs">
            <Link href="/" className="hover:text-purple-600">{t("allied.mltLanding.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/careers" className="hover:text-purple-600">{t("allied.mltLanding.careers")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium">MLT</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 mb-4">
              <Microscope className="w-4 h-4" />
              Medical Laboratory Technology
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-mlt-title">
              Pass Your MLT / MLS Certification Exam With Confidence
            </h1>
            <p className="text-lg text-gray-600 mb-4" data-testid="text-mlt-description">
              500+ practice questions across all 16 laboratory disciplines, blueprint-weighted mock exams, and adaptive study tools
              for CSMLS (Canada) and ASCP (USA) certification. Don't risk failing your lab certification exam — start targeted prep today.
            </p>
            <p className="text-sm text-gray-500 italic mb-6" data-testid="text-mlt-future-self">
              Walk into your CSMLS or ASCP exam knowing every discipline inside and out.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="/allied-health/mlt/canada/exam-prep" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="button-mlt-start-free">
                Start Practicing Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#section-country-select" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors border border-purple-200" data-testid="button-mlt-choose-track">
                Choose Your Exam Track
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-6" data-testid="mlt-trust-badges">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>{t("allied.mltLanding.noCreditCardRequired")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>{t("allied.mltLanding.blueprintalignedContent")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>{t("allied.mltLanding.cancelAnytime")}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.mltLanding.16LaboratoryDisciplines")}</strong> {t("allied.mltLanding.withDetailedSubdisciplineCoverage")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.mltLanding.csmlsAscp")}</strong> {t("allied.mltLanding.examTracksWithCountryspecificContent")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.mltLanding.imagebasedQuestions")}</strong> {t("allied.mltLanding.forMorphologyStainingIdentification")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700"><strong>{t("allied.mltLanding.adaptivePractice")}</strong> {t("allied.mltLanding.targetingYourWeakestDisciplines")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-country-select">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.mltLanding.chooseYourCountryTrack")}</h2>
            <p className="text-gray-600">{t("allied.mltLanding.selectYourCertificationExamAnd")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COUNTRY_CARDS.map(card => (
              <Link key={card.country} href={card.href} className="group" data-testid={`card-country-${card.country}`}>
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-purple-400 hover:shadow-lg transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{card.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{card.label}</h3>
                      <span className="text-sm font-medium text-purple-600">{card.examBoard}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                  <ul className="space-y-2 mb-5">
                    {card.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center bg-purple-50 rounded-lg px-2 py-2">
                      <div className="text-lg font-bold text-purple-700">{card.totalQuestions}</div>
                      <div className="text-xs text-gray-500">{t("allied.mltLanding.questions")}</div>
                    </div>
                    <div className="text-center bg-purple-50 rounded-lg px-2 py-2">
                      <div className="text-lg font-bold text-purple-700">{card.timeLimit} min</div>
                      <div className="text-xs text-gray-500">{t("allied.mltLanding.timeLimit")}</div>
                    </div>
                    <div className="text-center bg-purple-50 rounded-lg px-2 py-2">
                      <div className="text-lg font-bold text-purple-700">{card.passScore}</div>
                      <div className="text-xs text-gray-500">{t("allied.mltLanding.passScore")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Start {card.examBoard} Prep <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.mltLanding.studyFeatures")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MLT_FEATURES.map(f => (
              <div key={f.slug} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all" data-testid={`card-feature-${f.slug}`}>
                <f.icon className="w-7 h-7 text-purple-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{f.label}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.mltLanding.all16LaboratoryDisciplines")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MLT_DISCIPLINES.map((d, i) => (
              <div key={d} className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-3" data-testid={`discipline-${i}`}>
                <FlaskConical className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.mltLanding.examFormatComparison")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="format-canada">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🇨🇦</span>
                <h3 className="text-lg font-bold text-gray-900">{t("allied.mltLanding.csmlsCanada")}</h3>
              </div>
              <div className="space-y-3 text-sm">
                {MLT_CANADA_BLUEPRINT_CATEGORIES.map(cat => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="font-medium text-purple-700">{cat.weight}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-500" style={{ width: `${cat.weight * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="format-usa">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🇺🇸</span>
                <h3 className="text-lg font-bold text-gray-900">{t("allied.mltLanding.ascpBocUsa")}</h3>
              </div>
              <div className="space-y-3 text-sm">
                {MLT_USA_CONTENT_AREAS.map(cat => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="font-medium text-purple-700">{cat.weight}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-500" style={{ width: `${cat.weight * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.mltLanding.frequentlyAskedQuestions")}</h2>
          <div className="space-y-3">
            {MLT_FAQ.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  data-testid={`button-faq-${i}`}
                >
                  <HelpCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-gray-900 flex-1">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pl-13 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${i}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.mltLanding.readyToStartYourMlt")}</h2>
          <p className="text-gray-600 mb-8">{t("allied.mltLanding.chooseYourCountryTrackAnd")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/allied-health/mlt/canada/exam-prep" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="button-cta-canada">
              🇨🇦 Start CSMLS Prep <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/mlt/usa/exam-prep" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors border border-purple-200" data-testid="button-cta-usa">
              🇺🇸 Start ASCP Prep <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.mltLanding.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/allied-health/mlt" className="text-sm text-purple-600 hover:underline" data-testid="link-mlt-career">{t("allied.mltLanding.mltCareerOverview")}</Link>
            <Link href="/allied-health/mlt/canada/free-questions" className="text-sm text-purple-600 hover:underline" data-testid="link-mlt-free-ca">{t("allied.mltLanding.freeCsmlsPracticeQuestions")}</Link>
            <Link href="/allied-health/mlt/usa/free-questions" className="text-sm text-purple-600 hover:underline" data-testid="link-mlt-free-us">{t("allied.mltLanding.freeAscpPracticeQuestions")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
