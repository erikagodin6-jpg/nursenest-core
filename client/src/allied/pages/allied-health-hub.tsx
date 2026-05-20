import { Link } from "wouter";
import {
  Wind, Ambulance, Pill, Microscope, ScanLine, Hand, Activity,
  Users, Brain, ShieldCheck, ArrowRight, BookOpen, FileText,
  GraduationCap, TrendingUp, ChevronRight, Award, Database,
  Monitor, HeartPulse, Scissors
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { ALLIED_HEALTH_PROFESSIONS } from "@/allied/data/allied-health-professions";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, any> = {
  Wind, Ambulance, Pill, Microscope, ScanLine, Hand, Activity, Users, Brain, ShieldCheck, Database, Monitor, HeartPulse, Scissors,
};

function Breadcrumbs() {
  const { t } = useI18n();
  return (
    <nav aria-label={t("allied.alliedHealthHub.breadcrumb")} className="mb-6" data-testid="breadcrumb-nav">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500">
        <li><Link href="/" className="hover:text-teal-600 transition-colors">{t("allied.alliedHealthHub.home")}</Link></li>
        <li><ChevronRight className="w-3.5 h-3.5" /></li>
        <li className="text-gray-900 font-medium">{t("allied.alliedHealthHub.alliedHealthCareers")}</li>
      </ol>
    </nav>
  );
}

export default function AlliedHealthHub() {
  const faqItems = [
    { q: "What is allied health?", a: "Allied health encompasses a broad range of healthcare professions outside of nursing, medicine, and pharmacy. These professionals provide diagnostic, therapeutic, and supportive services including respiratory therapy, medical laboratory science, physical therapy, occupational therapy, medical imaging, and more." },
    { q: "How do I choose the right allied health career?", a: "Consider your interests (direct patient care vs. laboratory work), education requirements, salary expectations, and work environment preferences. Each profession has unique characteristics — paramedics work in emergency settings, while MLTs work in laboratories, and OTs work in rehabilitation." },
    { q: "What certifications do I need?", a: "Each allied health profession has its own certification requirements. Most require passing a national certification exam after completing an accredited education program. Visit each profession's page for specific certification details." },
    { q: "How can NurseNest help me prepare?", a: "NurseNest provides career-specific question banks, adaptive mock exams, flashcards, AI study tools, and personalized study plans for each allied health profession. Our content is aligned with official exam blueprints." },
  ];

  return (
    <div data-testid="allied-health-hub-page">
      <AlliedSEO
        title={t("allied.alliedHealthHub.alliedHealthCareersEducationCertification")}
        description={t("allied.alliedHealthHub.exploreAlliedHealthCareersIncluding")}
        keywords="allied health careers, healthcare careers, respiratory therapist, paramedic, pharmacy technician, MLT, medical imaging, occupational therapy, physical therapy, social work, exam prep"
        canonicalPath="/allied-health"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Allied Health Careers Hub",
          "description": "Comprehensive resource for allied health career exploration, education pathways, certification requirements, and exam preparation.",
          "url": "https://www.nursenest.ca/allied-health",
          "publisher": {
            "@type": "Organization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca"
          }
        }}
        additionalStructuredData={[{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }]}
      />

      <section className="bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-hub-title">
              Allied Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t("allied.alliedHealthHub.careerGuides")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-hub-subtitle">
              Explore 11 allied health career paths with comprehensive guides covering education requirements, certification exams, salary data, career outlook, and exam prep resources.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <GraduationCap className="w-4 h-4 text-teal-500" />
                <span>{t("allied.alliedHealthHub.educationPathways")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Award className="w-4 h-4 text-teal-500" />
                <span>{t("allied.alliedHealthHub.certificationGuides")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <BookOpen className="w-4 h-4 text-teal-500" />
                <span>{t("allied.alliedHealthHub.examPrepResources")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                <span>{t("allied.alliedHealthHub.careerOutlookData")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" data-testid="profession-cards-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(ALLIED_HEALTH_PROFESSIONS).map(profession => {
              const IconComponent = ICON_MAP[profession.icon] || BookOpen;
              return (
                <Link
                  key={profession.slug}
                  href={`/allied-health/${profession.slug}`}
                  className="block group"
                >
                  <div
                    className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all h-full flex flex-col"
                    data-testid={`card-profession-${profession.slug}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: profession.colorAccent }}>
                        <IconComponent className="w-6 h-6" style={{ color: profession.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-teal-700 transition-colors" data-testid={`text-profession-name-${profession.slug}`}>
                          {profession.shortName}
                        </h2>
                        <p className="text-xs text-gray-500">{profession.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{profession.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-gray-50 rounded-lg py-2 px-1">
                        <div className="text-sm font-bold text-gray-900">{profession.salaryRange}</div>
                        <div className="text-[10px] text-gray-500">{t("allied.alliedHealthHub.salaryRange")}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg py-2 px-1">
                        <div className="text-sm font-bold text-green-600">{profession.jobOutlook}</div>
                        <div className="text-[10px] text-gray-500">{t("allied.alliedHealthHub.jobOutlook")}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg py-2 px-1">
                        <div className="text-sm font-bold text-gray-900">{profession.examNames.length}</div>
                        <div className="text-[10px] text-gray-500">{t("allied.alliedHealthHub.exams")}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {profession.examNames.slice(0, 3).map(exam => (
                        <span key={exam} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{exam}</span>
                      ))}
                    </div>
                    <div className="flex items-center text-teal-600 text-sm font-medium group-hover:text-teal-700">
                      Explore Career Guide <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="study-resources-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.alliedHealthHub.examPrepStudyResources")}</h2>
            <p className="text-gray-600">{t("allied.alliedHealthHub.quickAccessToPopularStudy")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "RRT Question Bank", href: "/allied-health/qbank?career=rrt", icon: BookOpen },
              { label: "Paramedic Mock Exams", href: "/allied-health/paramedic/mock-exams", icon: FileText },
              { label: "Pharm Tech Flashcards", href: "/allied-health/pharmacy-technician/flashcards", icon: Brain },
              { label: "MLT Practice Questions", href: "/allied-health/mlt/canada/practice-questions", icon: BookOpen },
              { label: "OT Exam Prep", href: "/allied-health/occupational-therapy/practice-questions", icon: GraduationCap },
              { label: "PT Exam Prep", href: "/allied-health/physical-therapy/practice-questions", icon: GraduationCap },
              { label: "Medical Imaging Prep", href: "/allied-health/imaging", icon: Award },
              { label: "All Career Paths", href: "/careers", icon: TrendingUp },
            ].map(resource => (
              <Link key={resource.label} href={resource.href} className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/40 transition-all" data-testid={`link-resource-${resource.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <resource.icon className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">{resource.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="allied-health-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.alliedHealthHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden group" data-testid={`faq-item-${i}`}>
                <summary className="px-6 py-4 cursor-pointer text-base font-medium text-gray-900 hover:text-teal-700 transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" data-testid="allied-health-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl font-bold mb-3">{t("allied.alliedHealthHub.readyToStartYourCareer")}</h2>
            <p className="text-teal-100 mb-6">{t("allied.alliedHealthHub.takeAFreeDiagnosticAssessment")}</p>
            <Link href="/diagnostic" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl text-base font-semibold hover:bg-teal-50 transition-colors" data-testid="button-cta-diagnostic">
              Take Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
