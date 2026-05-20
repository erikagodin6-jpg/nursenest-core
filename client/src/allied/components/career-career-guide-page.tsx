import { Link } from "wouter";
import { useState } from "react";
import {
  GraduationCap, ChevronDown, ArrowRight, BookOpen,
  Brain, Target, Award, DollarSign, TrendingUp, Briefcase,
  CheckCircle2, HelpCircle, MapPin, Wrench, FileText
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import type { ProfessionHubData } from "@/allied/data/profession-hub-data";
import type { CareerGuideData } from "@/allied/data/imaging-career-data";

import { useI18n } from "@/lib/i18n";
interface CareerGuidePageProps {
  hubData: ProfessionHubData;
  careerGuide: CareerGuideData;
}

export default function CareerCareerGuidePage({ hubData, careerGuide }: CareerGuidePageProps) {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const basePath = `/allied-health/${hubData.professionSlug}`;

  const seoTitle = `${hubData.shortName} Career Guide — How to Become a ${hubData.name} | NurseNest Allied`;
  const seoDescription = `Complete career guide for ${hubData.name}s. Learn about education, certification, salary, work settings, and exam prep roadmap for aspiring ${hubData.shortName}s.`;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "NurseNest", "item": "https://www.nursenest.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": hubData.shortName, "item": `https://www.nursenest.ca${basePath}` },
      { "@type": "ListItem", "position": 4, "name": "Career Guide", "item": `https://www.nursenest.ca${basePath}/career-guide` },
    ],
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${hubData.name} Career Guide`,
    "description": seoDescription,
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest Allied" },
    "courseMode": "online",
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": hubData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  return (
    <div data-testid={`career-guide-${hubData.professionSlug}`}>
      <AlliedSEO
        title={seoTitle}
        description={seoDescription}
        keywords={hubData.seo.keywords}
        canonicalPath={`${basePath}/career-guide`}
        structuredData={breadcrumbStructuredData}
        additionalStructuredData={[courseStructuredData, faqStructuredData]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-guide-title">
            How to Become a {hubData.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Everything you need to know about education, certification, salary, and career outlook for {hubData.name}s.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100" data-testid="section-salary-outlook">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
              <DollarSign className="w-6 h-6 flex-shrink-0" style={{ color: hubData.color }} />
              <div>
                <div className="text-xs text-gray-500 font-medium">{t("allied.careerCareerGuidePage.salaryRange")}</div>
                <div className="text-sm font-bold text-gray-900">{hubData.salaryRange}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
              <TrendingUp className="w-6 h-6 flex-shrink-0" style={{ color: hubData.color }} />
              <div>
                <div className="text-xs text-gray-500 font-medium">{t("allied.careerCareerGuidePage.jobOutlook")}</div>
                <div className="text-sm font-bold text-gray-900">{hubData.jobOutlook}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-education-path">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" style={{ color: hubData.color }} /> Education Path
          </h2>
          <div className="space-y-4">
            {careerGuide.educationPath.map((step, i) => (
              <div key={i} className="flex gap-4" data-testid={`education-step-${i}`}>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: hubData.color }}>
                    {i + 1}
                  </div>
                  {i < careerGuide.educationPath.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: hubData.colorAccent }} />}
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{step.step}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                  <span className="text-xs text-gray-400 mt-1 inline-block">{step.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-certifications">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6" style={{ color: hubData.color }} /> Certification Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerGuide.certificationOptions.map((cert, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`cert-option-${i}`}>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{cert.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{cert.organization}</p>
                <p className="text-xs text-gray-500">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-work-settings">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6" style={{ color: hubData.color }} /> Work Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careerGuide.workSettings.map((ws, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-5 py-4" data-testid={`work-setting-${i}`}>
                <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: hubData.color }} />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{ws.setting}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{ws.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-skills">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Wrench className="w-6 h-6" style={{ color: hubData.color }} /> Skills Needed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careerGuide.skillsNeeded.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 border border-gray-100" data-testid={`skill-${i}`}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: hubData.color }} />
                <span className="text-sm text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-exam-roadmap">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" style={{ color: hubData.color }} /> Exam Prep Roadmap
          </h2>
          <div className="space-y-4">
            {careerGuide.examPrepRoadmap.map((phase, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100" data-testid={`roadmap-phase-${i}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: hubData.color }}>{phase.weeks}</span>
                  <h3 className="font-semibold text-gray-900 text-sm">{phase.phase}</h3>
                </div>
                <p className="text-sm text-gray-500">{phase.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-guide-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("allied.careerCareerGuidePage.frequentlyAskedQuestions")}</h2>
          <div className="space-y-3">
            {hubData.faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid={`guide-faq-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: hubData.color }} />
                  <span className="font-medium text-gray-900 flex-1 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pl-13 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-guide-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Start Your {hubData.shortName} Exam Prep</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`${basePath}/study`} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4 hover:shadow-md transition-all border border-gray-100" data-testid="link-guide-study">
              <BookOpen className="w-5 h-5" style={{ color: hubData.color }} />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{t("allied.careerCareerGuidePage.studyTopics")}</div>
                <div className="text-xs text-gray-500">{t("allied.careerCareerGuidePage.browseAllExamDomains")}</div>
              </div>
            </Link>
            <Link href={`${basePath}/flashcards`} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4 hover:shadow-md transition-all border border-gray-100" data-testid="link-guide-flashcards">
              <Brain className="w-5 h-5" style={{ color: hubData.color }} />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{t("allied.careerCareerGuidePage.flashcards")}</div>
                <div className="text-xs text-gray-500">{t("allied.careerCareerGuidePage.spacedRepetitionDecks")}</div>
              </div>
            </Link>
            <Link href={`${basePath}/exams`} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4 hover:shadow-md transition-all border border-gray-100" data-testid="link-guide-exams">
              <Target className="w-5 h-5" style={{ color: hubData.color }} />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{t("allied.careerCareerGuidePage.practiceExams")}</div>
                <div className="text-xs text-gray-500">{t("allied.careerCareerGuidePage.diagnosticMockExams")}</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: `linear-gradient(to bottom, ${hubData.colorAccent}40, white)` }} data-testid="section-guide-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin Your {hubData.shortName} Journey?</h2>
          <p className="text-gray-600 mb-6">{t("allied.careerCareerGuidePage.startWithAFreeDiagnostic")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={basePath} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 shadow-lg" style={{ backgroundColor: hubData.color }} data-testid="button-guide-cta">
              Explore {hubData.shortName} Exam Prep <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
