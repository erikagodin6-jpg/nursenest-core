import { Link, useParams } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { RESIDENCY_COUNTRIES } from "@/data/nurse-residency-data";
import { ArrowRight, Building2, MapPin, Clock, ChevronRight, ExternalLink, Users, Target, Briefcase, GraduationCap } from "lucide-react";

export default function NurseResidencyCountry() {
  const { t } = useI18n();
  const params = useParams<{ country: string }>();
  const country = RESIDENCY_COUNTRIES.find(c => c.slug === params.country);

  if (!country) {
    return (
      <div data-testid="page-nurse-residency-not-found">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nurseResidencyCountry.countryNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.nurseResidencyCountry.theResidencyProgramsPageYoure")}</p>
          <Link href="/nurse-residency-programs" className="text-indigo-600 font-medium hover:text-indigo-700">
            Back to Nurse Residency Directory
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
    "url": `https://www.nursenest.ca/nurse-residency-programs/${country.slug}`,
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <div data-testid={`page-nurse-residency-${country.slug}`}>
      <Navigation />
      <SEO
        title={country.metaTitle}
        description={country.metaDescription}
        keywords={country.metaKeywords}
        canonicalPath={`/nurse-residency-programs/${country.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nurse Residency Programs", url: "https://www.nursenest.ca/nurse-residency-programs" },
          { name: country.name, url: `https://www.nursenest.ca/nurse-residency-programs/${country.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-indigo-600">{t("pages.nurseResidencyCountry.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nurse-residency-programs" className="hover:text-indigo-600">{t("pages.nurseResidencyCountry.residencyPrograms")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-700 font-medium">{country.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{country.flag}</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-h1">
                Nurse Residency Programs in {country.name}
              </h1>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-subtitle">{country.overview}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100" data-testid="section-why-residency">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.nurseResidencyCountry.whyChooseAResidencyProgram")}</h2>
          <p className="text-gray-600 leading-relaxed">{country.whyResidency}</p>
        </div>
      </section>

      <section className="py-16" data-testid="section-programs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8" data-testid="text-programs-title">
            Featured Programs
          </h2>
          <div className="space-y-6">
            {country.programs.map((program, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid={`card-program-${i}`}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Building2 className="w-6 h-6 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{program.hospitalSystem}</h3>
                        <p className="text-sm text-indigo-600 font-medium">{program.programName}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nurseResidencyCountry.location")}</span><span className="text-sm text-gray-700">{program.location}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nurseResidencyCountry.programLength")}</span><span className="text-sm text-gray-700">{program.programLength}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nurseResidencyCountry.applicationTimeline")}</span><span className="text-sm text-gray-700">{program.applicationTimeline}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <div><span className="text-xs text-gray-400 block">{t("pages.nurseResidencyCountry.specialties")}</span><span className="text-sm text-gray-700">{program.specialtyFocus.join(", ")}</span></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{t("pages.nurseResidencyCountry.requirements")}</h4>
                      <ul className="space-y-1">
                        {program.requirements.map((req, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-indigo-400 mt-1">\u2022</span>{req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="lg:w-48 shrink-0">
                    <a href={program.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm w-full justify-center" data-testid={`link-apply-${i}`}>
                      Learn More <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-teal-50 via-emerald-50/50 to-cyan-50/30" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.nurseResidencyCountry.resourcesForNewGradNurses")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/newgrad" className="group" data-testid="link-newgrad">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                <GraduationCap className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nurseResidencyCountry.newGradHub")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nurseResidencyCountry.careerGuidesSurvivalTipsAnd")}</p>
              </div>
            </Link>
            <Link href="/applynest" className="group" data-testid="link-applynest">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                <Briefcase className="w-6 h-6 text-teal-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 text-sm">{t("pages.nurseResidencyCountry.applynestJobs")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nurseResidencyCountry.resumeTemplatesInterviewPrepAnd")}</p>
              </div>
            </Link>
            <Link href="/nursing-schools" className="group" data-testid="link-schools">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all h-full">
                <Building2 className="w-6 h-6 text-emerald-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 text-sm">{t("pages.nurseResidencyCountry.nursingSchools")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nurseResidencyCountry.directoryOfAccreditedNursingPrograms")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("pages.nurseResidencyCountry.frequentlyAskedQuestions")}</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">{t("pages.nurseResidencyCountry.exploreProgramsInOtherCountries")}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {RESIDENCY_COUNTRIES.filter(c => c.slug !== country.slug).map(c => (
              <Link key={c.slug} href={`/nurse-residency-programs/${c.slug}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-200 hover:border-indigo-200 transition-all text-sm font-medium text-gray-700 hover:text-indigo-700" data-testid={`link-country-${c.slug}`}>
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
