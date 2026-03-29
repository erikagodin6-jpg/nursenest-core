import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { HEALTHCARE_CAREER_DATA } from "@/data/healthcare-career-data";
import {
  ArrowRight, ChevronRight, BookOpen, GraduationCap,
  DollarSign, TrendingUp, Clock, CheckCircle2, MapPin,
  Briefcase, Award, Stethoscope, FileText, Users, Heart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; gradientFrom: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", gradientFrom: "from-blue-50" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100", gradientFrom: "from-pink-50" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", gradientFrom: "from-indigo-50" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100", gradientFrom: "from-cyan-50" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", gradientFrom: "from-purple-50" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100", gradientFrom: "from-teal-50" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100", gradientFrom: "from-green-50" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", gradientFrom: "from-emerald-50" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", gradientFrom: "from-rose-50" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", gradientFrom: "from-red-50" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", gradientFrom: "from-orange-50" },
};

export default function HealthcareCareerDetail() {
  const { t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const career = slug ? HEALTHCARE_CAREER_DATA[slug] : null;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!career) {
    return (
      <div data-testid="page-career-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.healthcareCareerDetail.careerNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("pages.healthcareCareerDetail.theHealthcareCareerYoureLooking")}</p>
            <LocaleLink href="/healthcare-careers" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors" data-testid="link-back-to-careers">
              Back to Careers Hub <ArrowRight className="w-4 h-4" />
            </LocaleLink>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = COLOR_MAP[career.color] || COLOR_MAP.blue;
  const careerFaqs = Array.isArray(career.faqs) ? career.faqs : [];
  const faqStructuredData = careerFaqs.length > 0 ? buildFaqStructuredData(careerFaqs) : null;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${career.name} Career Guide`,
    "description": career.description,
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "about": {
      "@type": "Occupation",
      "name": career.fullTitle,
      "estimatedSalary": {
        "@type": "MonetaryAmountDistribution",
        "name": "Annual Salary",
        "currency": "USD",
        "median": parseInt(career.salaryMedian.replace(/[^0-9]/g, ""), 10) || 0,
      },
    },
  };

  return (
    <div data-testid={`page-career-${career.slug}`}>
      <Navigation />
      <SEO
        title={`${career.name} Career Guide: Education, Salary & Licensing | NurseNest`}
        description={`Complete ${career.name} career guide. Education pathways, licensing requirements, salary range (${career.salaryRange}), work environments, advancement opportunities, and exam prep resources.`}
        keywords={`${career.name.toLowerCase()} career, ${career.fullTitle.toLowerCase()} salary, how to become a ${career.fullTitle.toLowerCase()}, ${career.fullTitle.toLowerCase()} education, ${career.fullTitle.toLowerCase()} licensing`}
        canonicalPath={`/healthcare-careers/${career.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Careers", url: "https://www.nursenest.ca/healthcare-careers" },
          { name: career.name, url: `https://www.nursenest.ca/healthcare-careers/${career.slug}` },
        ]}
      />

      <main className="min-h-screen bg-white">
        <section className={`relative py-14 sm:py-18 overflow-hidden`} data-testid="section-hero">
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-white to-white`} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
              <LocaleLink href="/" className="hover:text-purple-600">{t("pages.healthcareCareerDetail.home")}</LocaleLink>
              <ChevronRight className="w-3.5 h-3.5" />
              <LocaleLink href="/healthcare-careers" className="hover:text-purple-600">{t("pages.healthcareCareerDetail.healthcareCareers")}</LocaleLink>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={`${colors.text} font-medium`}>{career.name}</span>
            </div>
            <Badge variant="outline" className={`mb-3 text-xs ${colors.border} ${colors.text}`} data-testid="badge-career-guide">
              Career Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-career-title">
              {career.name} Career Guide
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl" data-testid="text-career-subtitle">
              {career.heroSubtitle}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-salary">
                <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{t("pages.healthcareCareerDetail.salaryRange")}</p>
                <p className="text-sm font-bold text-gray-900">{career.salaryRange}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-education">
                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{t("pages.healthcareCareerDetail.education")}</p>
                <p className="text-sm font-bold text-gray-900">{career.educationLength}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-growth">
                <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{t("pages.healthcareCareerDetail.jobGrowth")}</p>
                <p className="text-sm font-bold text-gray-900">{career.growthRate} (10-year)</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-median">
                <Award className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{t("pages.healthcareCareerDetail.medianSalary")}</p>
                <p className="text-sm font-bold text-gray-900">{career.salaryMedian}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-overview">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">{t("pages.healthcareCareerDetail.roleOverview")}</h2>
            <div className="space-y-4">
              {(career.overview || []).map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed" data-testid={`text-overview-${i}`}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50" data-testid="section-education">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareerDetail.educationPathways")}</h2>
            <div className="space-y-4">
              {(career.educationPathways || []).map((path, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-6" data-testid={`card-edu-${i}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                    <GraduationCap className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{path.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{path.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-licensing">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareerDetail.licensingRequirements")}</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ul className="space-y-3">
                {(career.licensingRequirements || []).map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`text-license-${i}`}>
                    <CheckCircle2 className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50" data-testid="section-responsibilities">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">{t("pages.healthcareCareerDetail.typicalResponsibilities")}</h2>
                <ul className="space-y-2.5">
                  {(career.typicalResponsibilities || []).map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Stethoscope className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">{t("pages.healthcareCareerDetail.workEnvironments")}</h2>
                <ul className="space-y-2.5">
                  {(career.workEnvironments || []).map((env, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <MapPin className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                      {env}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-advancement">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareerDetail.advancementOpportunities")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(career.advancementOpportunities || []).map((opp, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${colors.bg} ${colors.border} border`} data-testid={`text-advancement-${i}`}>
                  <TrendingUp className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                  <span className="text-sm text-gray-800">{opp}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50" data-testid="section-resources">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareerDetail.studyResourcesCareerTools")}</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Exam Prep
                </h3>
                <ul className="space-y-2">
                  {(career.relatedExamPrep || []).map((link, i) => (
                    <li key={i}>
                      <LocaleLink href={link.href} className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium" data-testid={`link-exam-${i}`}>
                        <ArrowRight className="w-3 h-3" /> {link.title}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Certifications
                </h3>
                <ul className="space-y-2">
                  {(career.relatedCertifications || []).map((link, i) => (
                    <li key={i}>
                      <LocaleLink href={link.href} className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium" data-testid={`link-cert-${i}`}>
                        <ArrowRight className="w-3 h-3" /> {link.title}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Career & Job Tools
                </h3>
                <ul className="space-y-2">
                  {(career.relatedJobTools || []).map((link, i) => (
                    <li key={i}>
                      <LocaleLink href={link.href} className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium" data-testid={`link-job-${i}`}>
                        <ArrowRight className="w-3 h-3" /> {link.title}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {careerFaqs.length > 0 && (
          <section className="py-12 px-4" data-testid="section-faqs">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareerDetail.frequentlyAskedQuestions")}</h2>
              <div className="space-y-3">
                {careerFaqs.map((faq, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${i}`}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 px-4 bg-gray-50" data-testid="section-cta">
          <div className="max-w-5xl mx-auto">
            <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8 text-center`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start Your {career.name} Journey?</h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Explore NurseNest's exam preparation resources, clinical lessons, and career tools designed for aspiring {career.fullTitle.toLowerCase()}s.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <LocaleLink href="/exam-prep" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg" data-testid="button-cta-exam-prep">
                  Explore Exam Prep <ArrowRight className="w-4 h-4" />
                </LocaleLink>
                <LocaleLink href="/healthcare-careers" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-cta-back">
                  Browse All Careers
                </LocaleLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
