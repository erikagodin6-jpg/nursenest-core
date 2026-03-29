import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { HEALTHCARE_CERTIFICATION_DATA, type HealthcareCertificationDetail } from "@/data/healthcare-certification-data";
import {
  Award, ArrowRight, ChevronRight, BookOpen, ShieldCheck,
  Clock, DollarSign, TrendingUp, Filter, Heart, Activity,
  Baby, Zap, Stethoscope, Ribbon, Brain, Scissors, GraduationCap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string }> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100" },
  teal: { bg: "bg-teal-50", iconColor: "text-teal-600", border: "border-teal-100" },
};

type FilterCategory = "all" | "life-support" | "specialty";

const FAQ_DATA = [
  { question: "What certifications should new nurses get first?", answer: "Start with BLS before your first day (usually completed in nursing school). Add ACLS within 90 days for acute care units, PALS within 6 months for pediatric or ED units, and NRP for labor & delivery. Pursue specialty certifications like CCRN or CEN after 1–2 years of clinical experience." },
  { question: "How do I choose which certification to pursue?", answer: "Choose based on your clinical specialty and career goals. Life support certifications (BLS, ACLS, PALS, NRP) are unit-specific requirements. Specialty certifications (CCRN, CEN, CMSRN, OCN) validate expertise and require clinical experience in that specialty area." },
  { question: "Do certifications increase salary?", answer: "Yes, most hospitals offer certification pay differentials ranging from $1,000 to $10,000 annually. CCRN, CEN, and specialty certifications typically command the highest premiums. Certifications also strengthen your position for leadership roles and clinical ladder advancement." },
  { question: "How often do certifications need to be renewed?", answer: "BLS, ACLS, PALS, and NRP renew every 2 years. TNCC and ENPC renew every 4 years. Specialty certifications like CCRN (3 years), CEN (4 years), and CMSRN (5 years) vary and can be renewed through continuing education or re-examination." },
  { question: "What is the difference between life support and specialty certifications?", answer: "Life support certifications (BLS, ACLS, PALS, NRP, TNCC, ENPC) are course-based, typically completed in 1–2 days with skills testing. Specialty certifications (CCRN, CEN, OCN, CMSRN) require passing a comprehensive knowledge exam and clinical experience hours." },
  { question: "Are US certifications recognized in Canada?", answer: "BLS, ACLS, PALS, and NRP are recognized across North America. US specialty certifications like CCRN and CEN are recognized by many Canadian employers. Canadian nurses may hold both US and Canadian specialty certifications." },
];

const allCerts = Object.values(HEALTHCARE_CERTIFICATION_DATA);

export default function HealthcareCertificationsHub() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<FilterCategory>("all");
  const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

  const filteredCerts = filter === "all"
    ? allCerts
    : allCerts.filter(c => c.category === filter);

  const lifeSupportCerts = allCerts.filter(c => c.category === "life-support");
  const specialtyCerts = allCerts.filter(c => c.category === "specialty");

  return (
    <div className="min-h-screen bg-background" data-testid="healthcare-certifications-hub-page">
      <Navigation />
      <SEO
        title={t("pages.healthcareCertificationsHub.healthcareCertificationsDatabaseBlsAcls")}
        description={t("pages.healthcareCertificationsHub.completeDatabaseOfHealthcareCertifications")}
        keywords="healthcare certifications, nursing certifications, BLS, ACLS, PALS, NRP, TNCC, ENPC, CCRN, CEN, OCN, CMSRN, certification exam prep, certification renewal"
        canonicalPath="/healthcare-certifications"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Healthcare Certifications Database",
          "description": "Complete database of healthcare certifications including life support and specialty nursing certifications with eligibility, exam structure, renewal information, and study resources.",
          "provider": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Certifications", url: "https://www.nursenest.ca/healthcare-certifications" },
        ]}
        additionalStructuredData={[faqStructuredData]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
          <LocaleLink href="/" className="hover:text-emerald-600">{t("pages.healthcareCertificationsHub.home")}</LocaleLink>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-700 font-medium">{t("pages.healthcareCertificationsHub.healthcareCertifications")}</span>
        </div>

        <section className="mb-12" data-testid="section-hero">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl border border-emerald-100 p-8 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-xs border-emerald-200 text-emerald-700" data-testid="badge-cert-hub">
                  Certification Database
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-cert-h1">
                  Healthcare Certifications Database
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-4xl" data-testid="text-cert-intro">
              Comprehensive guide to healthcare certifications — from essential life support courses to advanced specialty credentials. Each certification includes eligibility requirements, exam structure, renewal information, and NurseNest study resources.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-total-certs">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{allCerts.length}</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.certifications")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-life-support">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{lifeSupportCerts.length}</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.lifeSupport")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-specialty">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{specialtyCerts.length}</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.specialty")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-prep-guides">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{allCerts.length}</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.prepGuides")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8" data-testid="section-filter">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-full"
              data-testid="button-filter-all"
            >
              All Certifications ({allCerts.length})
            </Button>
            <Button
              variant={filter === "life-support" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("life-support")}
              className="rounded-full"
              data-testid="button-filter-life-support"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Life Support ({lifeSupportCerts.length})
            </Button>
            <Button
              variant={filter === "specialty" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("specialty")}
              className="rounded-full"
              data-testid="button-filter-specialty"
            >
              <Award className="w-3.5 h-3.5 mr-1" />
              Specialty ({specialtyCerts.length})
            </Button>
          </div>
        </section>

        <section className="mb-12" data-testid="section-cert-list">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCerts.map((cert) => {
              const certColors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
              return (
                <LocaleLink key={cert.slug} href={`/healthcare-certifications/${cert.slug}`}>
                  <Card className={`h-full hover:shadow-md transition-all cursor-pointer group ${certColors.border}`} data-testid={`card-cert-${cert.slug}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${certColors.bg} flex items-center justify-center`}>
                          <Award className={`w-5 h-5 ${certColors.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors" data-testid={`text-cert-name-${cert.slug}`}>
                            {cert.certName}
                          </h3>
                          <p className="text-xs text-gray-500">{cert.org}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{cert.fullName}</p>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cert.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Valid {cert.renewalCycle.validity}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cert.category === "life-support" ? "Life Support" : "Specialty"}
                        </Badge>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 mt-3 group-hover:gap-2 transition-all">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </LocaleLink>
              );
            })}
          </div>
        </section>

        <section className="mb-12" data-testid="section-comparison">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCertificationsHub.certificationComparison")}</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm" data-testid="table-comparison">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.healthcareCertificationsHub.certification")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.healthcareCertificationsHub.organization")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.healthcareCertificationsHub.type")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.healthcareCertificationsHub.validity")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.healthcareCertificationsHub.details")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allCerts.map((cert) => (
                  <tr key={cert.slug} className="hover:bg-gray-50" data-testid={`row-cert-${cert.slug}`}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{cert.certName}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{cert.org}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {cert.category === "life-support" ? "Life Support" : "Specialty"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{cert.renewalCycle.validity}</td>
                    <td className="px-4 py-3">
                      <LocaleLink href={`/healthcare-certifications/${cert.slug}`} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs" data-testid={`table-link-${cert.slug}`}>
                        View Guide
                      </LocaleLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12" data-testid="section-study-tools">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t("pages.healthcareCertificationsHub.studyToolsResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LocaleLink href="/free-practice">
              <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid="card-tool-practice">
                <CardContent className="p-5 text-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors mb-1">{t("pages.healthcareCertificationsHub.practiceQuestions")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCertificationsHub.certificationalignedQuestionBanks")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/flashcards">
              <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid="card-tool-flashcards">
                <CardContent className="p-5 text-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors mb-1">{t("pages.healthcareCertificationsHub.flashcards")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCertificationsHub.spacedrepetitionStudyDecks")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/lessons">
              <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid="card-tool-lessons">
                <CardContent className="p-5 text-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors mb-1">{t("pages.healthcareCertificationsHub.clinicalLessons")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCertificationsHub.indepthCertificationContent")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/mock-exams">
              <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid="card-tool-mocks">
                <CardContent className="p-5 text-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors mb-1">{t("pages.healthcareCertificationsHub.mockExams")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCertificationsHub.timedExamSimulations")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section className="mb-12" data-testid="section-cross-links">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t("pages.healthcareCertificationsHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LocaleLink href="/healthcare-careers">
              <Card className="h-full hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group" data-testid="card-cross-careers">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">{t("pages.healthcareCertificationsHub.healthcareCareersHub")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.exploreCareerPathsSalaryGuides")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/nursing-certifications">
              <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid="card-cross-nursing-certs">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">{t("pages.healthcareCertificationsHub.nursingCertifications")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.emergencyAndSpecialtyNursingCertification")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/exam-prep">
              <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group" data-testid="card-cross-exam-prep">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{t("pages.healthcareCertificationsHub.examPrepHub")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCertificationsHub.practiceQuestionsMockExamsAnd")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section className="mb-12" data-testid="section-faq">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t("pages.healthcareCertificationsHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden group" data-testid={`faq-item-${i}`}>
                <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none flex items-center justify-between" data-testid={`button-faq-${i}`}>
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
