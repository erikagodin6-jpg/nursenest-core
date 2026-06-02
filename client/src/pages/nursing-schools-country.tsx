import { Link, useParams } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { NURSING_SCHOOL_COUNTRIES } from "@/data/nursing-schools-data";
import { ArrowRight, GraduationCap, MapPin, Clock, DollarSign, FileText, ChevronRight, ExternalLink, BookOpen, Award } from "lucide-react";
import { useState } from "react";

export default function NursingSchoolsCountry() {
  const { t } = useI18n();
  const params = useParams<{ country: string }>();
  const country = NURSING_SCHOOL_COUNTRIES.find(c => c.slug === params.country);

  if (!country) {
    return (
      <div data-testid="page-nursing-schools-not-found">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nursingSchoolsCountry.countryNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.nursingSchoolsCountry.theNursingSchoolsPageYoure")}</p>
          <Link href="/nursing-schools" className="text-emerald-600 font-medium hover:text-emerald-700">
            Back to Nursing Schools Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(country.faq);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": country.metaTitle,
    "description": country.metaDescription,
    "url": `https://www.nursenest.ca/nursing-schools/${country.slug}`,
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <div data-testid={`page-nursing-schools-${country.slug}`}>
      <Navigation />
      <SEO
        title={country.metaTitle}
        description={country.metaDescription}
        keywords={country.metaKeywords}
        canonicalPath={`/nursing-schools/${country.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Schools", url: "https://www.nursenest.ca/nursing-schools" },
          { name: `Nursing Schools in ${country.name}`, url: `https://www.nursenest.ca/nursing-schools/${country.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-emerald-600">{t("pages.nursingSchoolsCountry.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nursing-schools" className="hover:text-emerald-600">{t("pages.nursingSchoolsCountry.nursingSchools")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-700 font-medium">{country.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{country.flag}</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-h1">
                Nursing Schools in {country.name}
              </h1>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-subtitle">{country.overview}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100" data-testid="section-education-system">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.nursingSchoolsCountry.educationSystemOverview")}</h2>
          <p className="text-gray-600 leading-relaxed">{country.educationSystem}</p>
        </div>
      </section>

      <section className="py-16" data-testid="section-schools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8" data-testid="text-schools-title">
            Featured Nursing Schools
          </h2>
          <div className="space-y-6">
            {country.schools.map((school, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid={`card-school-${i}`}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{school.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{school.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nursingSchoolsCountry.location")}</span><span className="text-sm text-gray-700">{school.location}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nursingSchoolsCountry.duration")}</span><span className="text-sm text-gray-700">{school.duration}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nursingSchoolsCountry.tuition")}</span><span className="text-sm text-gray-700">{school.tuitionRange}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nursingSchoolsCountry.programs")}</span><span className="text-sm text-gray-700">{school.programTypes.join(", ")}</span></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{t("pages.nursingSchoolsCountry.admissionRequirements")}</h4>
                      <ul className="space-y-1">
                        {school.admissionRequirements.map((req, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-emerald-400 mt-1">•</span>{req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{t("pages.nursingSchoolsCountry.licensingOutcomes")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {school.licensingOutcomes.map((outcome, j) => (
                          <span key={j} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">{outcome}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-48 shrink-0">
                    <a
                      href={school.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm w-full justify-center"
                      data-testid={`link-apply-${i}`}
                    >
                      Visit Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.nursingSchoolsCountry.continueYourNursingJourney")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/exam-prep" className="group" data-testid="link-exam-prep">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nursingSchoolsCountry.examPrep")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingSchoolsCountry.prepareForLicensingExamsWith")}</p>
              </div>
            </Link>
            <Link href="/nursing-regulatory-bodies" className="group" data-testid="link-regulatory">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                <Award className="w-6 h-6 text-purple-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 text-sm">{t("pages.nursingSchoolsCountry.regulatoryBodies")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingSchoolsCountry.understandLicensingRequirementsAndRegistration")}</p>
              </div>
            </Link>
            <Link href="/applynest" className="group" data-testid="link-applynest">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                <FileText className="w-6 h-6 text-teal-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 text-sm">{t("pages.nursingSchoolsCountry.careerTools")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingSchoolsCountry.resumeTemplatesAndInterviewPrep")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("pages.nursingSchoolsCountry.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {country.faq.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-faq-${i}`}>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-other-countries">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">{t("pages.nursingSchoolsCountry.exploreNursingSchoolsInOther")}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {NURSING_SCHOOL_COUNTRIES.filter(c => c.slug !== country.slug).map(c => (
              <Link key={c.slug} href={`/nursing-schools/${c.slug}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-emerald-50 rounded-lg border border-gray-200 hover:border-emerald-200 transition-all text-sm font-medium text-gray-700 hover:text-emerald-700" data-testid={`link-country-${c.slug}`}>
                <span>{c.flag}</span> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
