import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { NURSING_SCHOOL_COUNTRIES } from "@/data/nursing-schools-data";
import { ArrowRight, GraduationCap, Globe, ChevronRight, Search, BookOpen, Award } from "lucide-react";
import { useState } from "react";

export default function NursingSchoolsHub() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filtered = NURSING_SCHOOL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const faqData = [
    { question: "How do I choose the right nursing school?", answer: "Consider program accreditation, NCLEX/licensing exam pass rates, clinical placement quality, tuition costs, location, and career outcomes. Research the regulatory body in your target country to ensure the program meets licensing requirements." },
    { question: "Can I study nursing abroad?", answer: "Yes, many countries welcome international nursing students. Key considerations include tuition costs (often higher for international students), language requirements, visa eligibility, and whether the degree will be recognized in your home country for licensure." },
    { question: "What types of nursing programs are available?", answer: "Common pathways include practical/vocational nursing diplomas (1.5\u20132 years), Associate Degree in Nursing (2 years), Bachelor of Science in Nursing (3\u20134 years), accelerated BSN for career changers (12\u201318 months), and graduate programs (MSN, DNP, PhD)." },
    { question: "How much does nursing school cost?", answer: "Costs vary dramatically by country: from nearly free (subsidized programs in India, Scotland) to $50,000+/year at private US universities. Most countries offer scholarships, bursaries, and financial aid for nursing students due to workforce demand." },
  ];

  const faqStructuredData = buildFaqStructuredData(faqData);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Schools Directory \u2013 Global Programs Guide",
    "description": "Comprehensive directory of nursing schools worldwide. Compare programs, tuition, admissions requirements, and licensing outcomes across 6 countries.",
    "url": "https://www.nursenest.ca/nursing-schools",
    "isPartOf": { "@type": "WebSite", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <div data-testid="page-nursing-schools-hub">
      <Navigation />
      <SEO
        title={t("nursingSchools.hub.seoTitle")}
        description={t("nursingSchools.hub.seoDescription")}
        keywords="nursing schools, nursing programs, nursing education, BSN programs, nursing degree, international nursing schools, nursing admissions"
        canonicalPath="/nursing-schools"
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Schools", url: "https://www.nursenest.ca/nursing-schools" },
        ]}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-emerald-600" data-testid="link-breadcrumb-home">{t("pages.nursingSchoolsHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-700 font-medium">{t("nursingSchools.hub.title")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700" data-testid="badge-directory">
              <GraduationCap className="w-4 h-4" />
              {t("nursingSchools.hub.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-h1">
              {t("nursingSchools.hub.heroTitle")}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-subtitle">
              {t("nursingSchools.hub.heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100" data-testid="section-search">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("nursingSchools.hub.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              data-testid="input-search-country"
            />
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-countries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center" data-testid="text-countries-title">
            {t("nursingSchools.hub.countriesTitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-10">
            {t("nursingSchools.hub.countriesSubtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((country) => (
              <Link key={country.slug} href={`/nursing-schools/${country.slug}`} className="group" data-testid={`card-country-${country.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-emerald-200 transition-all h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{country.flag}</span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{country.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 flex-1">{country.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{country.schools.length} schools listed</span>
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
                      View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8" data-testid="text-no-results">{t("pages.nursingSchoolsHub.noCountriesMatchYourSearch")}</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-why">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("nursingSchools.hub.whyTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-why-1">
              <Globe className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nursingSchools.hub.why1Title")}</h3>
              <p className="text-sm text-gray-500">{t("nursingSchools.hub.why1Desc")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-why-2">
              <BookOpen className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nursingSchools.hub.why2Title")}</h3>
              <p className="text-sm text-gray-500">{t("nursingSchools.hub.why2Desc")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-why-3">
              <Award className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nursingSchools.hub.why3Title")}</h3>
              <p className="text-sm text-gray-500">{t("nursingSchools.hub.why3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("nursingSchools.hub.relatedTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/exam-prep" className="group" data-testid="link-exam-prep">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nursingSchoolsHub.examPrepResources")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingSchoolsHub.prepareForNclexRexpnAnd")}</p>
              </div>
            </Link>
            <Link href="/nurse-residency-programs" className="group" data-testid="link-residency">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nursingSchoolsHub.nurseResidencyPrograms")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingSchoolsHub.findTransitiontopracticeProgramsForNew")}</p>
              </div>
            </Link>
            <Link href="/applynest" className="group" data-testid="link-applynest">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 text-sm">{t("pages.nursingSchoolsHub.applynestCareerTools")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingSchoolsHub.resumeTemplatesInterviewPrepAnd")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("nursingSchools.hub.faqTitle")}</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-faq-${i}`}>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
