import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { RESIDENCY_COUNTRIES } from "@/data/nurse-residency-data";
import { ArrowRight, Building2, ChevronRight, Search, Heart, Shield, TrendingUp, Briefcase } from "lucide-react";
import { useState } from "react";

export default function NurseResidencyHub() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filtered = RESIDENCY_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const faqData = [
    { question: "What is a nurse residency program?", answer: "A nurse residency is a structured transition-to-practice program for new graduate RNs, typically lasting 6\u201312 months. It provides mentorship, clinical education, and professional development to help new nurses build confidence and competence." },
    { question: "Are nurse residency programs paid?", answer: "Yes, nurse residency programs are paid positions. Residents earn a full nursing salary while receiving additional training, mentorship, and educational support." },
    { question: "Do I need a BSN for a nurse residency?", answer: "Requirements vary by program. Many top residencies require a BSN, but some accept ADN graduates with a commitment to complete BSN education. Check specific program requirements for details." },
    { question: "How do nurse residencies reduce turnover?", answer: "Research shows nurse residencies reduce first-year turnover from 35% to under 10%. Structured mentorship, gradual clinical integration, and peer support help new nurses develop confidence and job satisfaction." },
  ];

  const faqStructuredData = buildFaqStructuredData(faqData);

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nurse Residency Programs Directory",
    "description": "Comprehensive directory of nurse residency and new graduate programs. Find transition-to-practice programs by country, hospital system, and specialty.",
    "url": "https://www.nursenest.ca/nurse-residency-programs",
    "isPartOf": { "@type": "WebSite", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <div data-testid="page-nurse-residency-hub">
      <Navigation />
      <SEO
        title={t("nurseResidency.hub.seoTitle")}
        description={t("nurseResidency.hub.seoDescription")}
        keywords="nurse residency programs, new grad nursing programs, nursing transition to practice, hospital nurse residency, new graduate nurse support"
        canonicalPath="/nurse-residency-programs"
        structuredData={collectionStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nurse Residency Programs", url: "https://www.nursenest.ca/nurse-residency-programs" },
        ]}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-indigo-600" data-testid="link-breadcrumb-home">{t("pages.nurseResidencyHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-700 font-medium">{t("nurseResidency.hub.title")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700" data-testid="badge-directory">
              <Building2 className="w-4 h-4" />
              {t("nurseResidency.hub.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-h1">
              {t("nurseResidency.hub.heroTitle")}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-subtitle">
              {t("nurseResidency.hub.heroSubtitle")}
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
              placeholder={t("nurseResidency.hub.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              data-testid="input-search-country"
            />
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-countries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center" data-testid="text-countries-title">
            {t("nurseResidency.hub.countriesTitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-10">
            {t("nurseResidency.hub.countriesSubtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((country) => (
              <Link key={country.slug} href={`/nurse-residency-programs/${country.slug}`} className="group" data-testid={`card-country-${country.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition-all h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{country.flag}</span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{country.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 flex-1">{country.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{country.programs.length} programs listed</span>
                    <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">
                      View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-benefits">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("nurseResidency.hub.benefitsTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-benefit-1">
              <Heart className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nurseResidency.hub.benefit1Title")}</h3>
              <p className="text-sm text-gray-500">{t("nurseResidency.hub.benefit1Desc")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-benefit-2">
              <Shield className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nurseResidency.hub.benefit2Title")}</h3>
              <p className="text-sm text-gray-500">{t("nurseResidency.hub.benefit2Desc")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-benefit-3">
              <TrendingUp className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nurseResidency.hub.benefit3Title")}</h3>
              <p className="text-sm text-gray-500">{t("nurseResidency.hub.benefit3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-teal-50 via-emerald-50/50 to-cyan-50/30" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("nurseResidency.hub.relatedTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/newgrad" className="group" data-testid="link-newgrad">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nurseResidencyHub.newGradCareerHub")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nurseResidencyHub.careerGuidesInterviewPrepAnd")}</p>
              </div>
            </Link>
            <Link href="/applynest" className="group" data-testid="link-applynest">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 text-sm">{t("pages.nurseResidencyHub.applynestCareerTools")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nurseResidencyHub.resumeTemplatesInterviewPrepAnd")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("nurseResidency.hub.faqTitle")}</h2>
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
