import { useParams } from "wouter";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { HEALTHCARE_CERTIFICATION_DATA } from "@/data/healthcare-certification-data";
import {
  ArrowRight, ChevronRight, BookOpen, Award, CheckCircle2,
  Clock, Users, FileText, ShieldCheck, RefreshCw, Target,
  GraduationCap, Stethoscope
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useI18n } from "@/lib/i18n";
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; gradientFrom: string; btnBg: string; btnHover: string }> = {
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", gradientFrom: "from-red-50", btnBg: "bg-red-600", btnHover: "hover:bg-red-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", gradientFrom: "from-blue-50", btnBg: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100", gradientFrom: "from-sky-50", btnBg: "bg-sky-600", btnHover: "hover:bg-sky-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", gradientFrom: "from-orange-50", btnBg: "bg-orange-600", btnHover: "hover:bg-orange-700" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100", gradientFrom: "from-pink-50", btnBg: "bg-pink-600", btnHover: "hover:bg-pink-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", gradientFrom: "from-violet-50", btnBg: "bg-violet-600", btnHover: "hover:bg-violet-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", gradientFrom: "from-purple-50", btnBg: "bg-purple-600", btnHover: "hover:bg-purple-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100", gradientFrom: "from-teal-50", btnBg: "bg-teal-600", btnHover: "hover:bg-teal-700" },
};

export default function HealthcareCertificationDetail() {
  const { t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const cert = slug ? HEALTHCARE_CERTIFICATION_DATA[slug] : null;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!cert) {
    return (
      <div data-testid="page-cert-detail-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.healthcareCertificationDetail.certificationNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("pages.healthcareCertificationDetail.theCertificationYoureLookingFor")}</p>
            <LocaleLink href="/healthcare-certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors" data-testid="link-back-to-certs">
              Back to Certifications <ArrowRight className="w-4 h-4" />
            </LocaleLink>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
  const certFaqs = Array.isArray(cert.faqs) ? cert.faqs : [];
  const faqStructuredData = certFaqs.length > 0 ? buildFaqStructuredData(certFaqs) : null;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${cert.certName} Certification Guide — ${cert.fullName}`,
    "description": cert.description,
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "about": {
      "@type": "EducationalOccupationalCredential",
      "name": cert.fullName,
      "credentialCategory": cert.category === "life-support" ? "Life Support Certification" : "Specialty Nursing Certification",
    },
  };

  return (
    <div data-testid={`page-cert-${cert.slug}`}>
      <Navigation />
      <SEO
        title={`${cert.certName} Certification Guide: ${cert.fullName} | NurseNest`}
        description={`Complete ${cert.certName} (${cert.fullName}) certification guide. Eligibility requirements, exam structure, renewal cycle, clinical relevance, and study preparation from NurseNest.`}
        keywords={`${cert.certName} certification, ${cert.fullName}, ${cert.certName} exam, ${cert.certName} prep, ${cert.certName} renewal, ${cert.certName} study guide, ${cert.org}`}
        canonicalPath={`/healthcare-certifications/${cert.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Certifications", url: "https://www.nursenest.ca/healthcare-certifications" },
          { name: `${cert.certName} Certification`, url: `https://www.nursenest.ca/healthcare-certifications/${cert.slug}` },
        ]}
      />

      <main className="min-h-screen bg-white">
        <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-white to-white`} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
              <LocaleLink href="/" className="hover:text-emerald-600">{t("pages.healthcareCertificationDetail.home")}</LocaleLink>
              <ChevronRight className="w-3.5 h-3.5" />
              <LocaleLink href="/healthcare-certifications" className="hover:text-emerald-600">{t("pages.healthcareCertificationDetail.healthcareCertifications")}</LocaleLink>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={`${colors.text} font-medium`}>{cert.certName}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className={`text-xs ${colors.border} ${colors.text}`}>
                {cert.category === "life-support" ? "Life Support" : "Specialty"}
              </Badge>
              <span className="text-xs text-gray-500">{cert.org}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-cert-title">
              {cert.certName} — {cert.fullName}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl" data-testid="text-cert-description">
              {cert.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-validity">
                <Clock className={`w-5 h-5 ${colors.text} mx-auto mb-1`} />
                <p className="text-xs text-gray-500">{t("pages.healthcareCertificationDetail.validFor")}</p>
                <p className="text-sm font-bold text-gray-900">{cert.renewalCycle.validity}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-questions">
                <FileText className={`w-5 h-5 ${colors.text} mx-auto mb-1`} />
                <p className="text-xs text-gray-500">{t("pages.healthcareCertificationDetail.questions")}</p>
                <p className="text-sm font-bold text-gray-900">{cert.examStructure.questionCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-duration">
                <Target className={`w-5 h-5 ${colors.text} mx-auto mb-1`} />
                <p className="text-xs text-gray-500">{t("pages.healthcareCertificationDetail.examDuration")}</p>
                <p className="text-sm font-bold text-gray-900">{cert.examStructure.duration.split(";")[0]}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-who-its-for">
          <div className="max-w-5xl mx-auto">
            <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Users className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Who Is {cert.certName} For?</h2>
              </div>
              <ul className="space-y-2.5">
                {(cert.whoItsFor || []).map((role, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700" data-testid={`text-role-${i}`}>
                    <CheckCircle2 className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50" data-testid="section-eligibility">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.eligibilityRequirements")}</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ul className="space-y-3">
                {(cert.eligibilityRequirements || []).map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`text-eligibility-${i}`}>
                    <ShieldCheck className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-exam-structure">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.examStructure")}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("pages.healthcareCertificationDetail.format")}</h3>
                  <p className="text-sm text-gray-700">{cert.examStructure.format}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("pages.healthcareCertificationDetail.duration")}</h3>
                  <p className="text-sm text-gray-700">{cert.examStructure.duration}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("pages.healthcareCertificationDetail.questions2")}</h3>
                  <p className="text-sm text-gray-700">{cert.examStructure.questionCount}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("pages.healthcareCertificationDetail.passingScore")}</h3>
                  <p className="text-sm text-gray-700">{cert.examStructure.passingScore}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("pages.healthcareCertificationDetail.examContentAreas")}</h3>
                <ul className="space-y-2">
                  {(cert.examStructure?.sections || []).map((section, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700" data-testid={`text-section-${i}`}>
                      <CheckCircle2 className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50" data-testid="section-renewal">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.renewalCycle")}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="card-renewal-validity">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                  <Clock className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.healthcareCertificationDetail.validityPeriod")}</h3>
                <p className="text-sm text-gray-600">{cert.renewalCycle.validity}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="card-renewal-method">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                  <RefreshCw className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.healthcareCertificationDetail.renewalMethod")}</h3>
                <p className="text-sm text-gray-600">{cert.renewalCycle.renewalMethod}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="card-renewal-ce">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                  <BookOpen className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.healthcareCertificationDetail.ceRequirements")}</h3>
                <p className="text-sm text-gray-600">{cert.renewalCycle.ceRequirements}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-clinical-relevance">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.clinicalRelevance")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(cert.clinicalRelevance || []).map((item, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-lg ${colors.bg} ${colors.border} border`} data-testid={`text-relevance-${i}`}>
                  <Stethoscope className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                  <span className="text-sm text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50" data-testid="section-study-prep">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.studyPreparationGuide")}</h2>
            <div className="space-y-4">
              {(cert.studyPreparation || []).map((step, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-6" data-testid={`card-study-${i}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center font-bold ${colors.text}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-nursenest-links">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.nursenestStudyResources")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(cert.relatedNurseNestLinks || []).map((link, i) => (
                <LocaleLink key={i} href={link.href}>
                  <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid={`card-link-${i}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                          <BookOpen className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">{link.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-emerald-600" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </div>
        </section>

        {certFaqs.length > 0 && (
          <section className="py-12 px-4 bg-gray-50" data-testid="section-faqs">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationDetail.frequentlyAskedQuestions")}</h2>
              <div className="space-y-3">
                {certFaqs.map((faq, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white" data-testid={`faq-item-${i}`}>
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

        <section className="py-12 px-4" data-testid="section-cta">
          <div className="max-w-5xl mx-auto">
            <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8 text-center`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Prepare for Your {cert.certName} Certification</h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                NurseNest offers practice questions, clinical lessons, flashcards, and mock exams to help you earn your {cert.certName} certification with confidence.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <LocaleLink href="/free-practice" className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btnBg} text-white rounded-xl font-semibold ${colors.btnHover} transition-colors shadow-lg`} data-testid="button-cta-practice">
                  Start Practice Questions <ArrowRight className="w-4 h-4" />
                </LocaleLink>
                <LocaleLink href="/healthcare-certifications" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-cta-back">
                  Browse All Certifications
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
