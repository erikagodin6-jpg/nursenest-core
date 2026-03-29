import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { REGULATORY_BODIES } from "@/data/nursing-regulatory-data";
import { ArrowRight, Shield, ChevronRight, Search, BookOpen, Award, Globe } from "lucide-react";
import { useState } from "react";

export default function NursingRegulatoryHub() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filtered = REGULATORY_BODIES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  );

  const faqData = [
    { question: "What is a nursing regulatory body?", answer: "A nursing regulatory body is a government-authorized organization that sets standards for nursing education, grants licenses to practice, and enforces professional conduct. Examples include the College of Nurses of Ontario, NCSBN in the US, and the NMC in the UK." },
    { question: "Why do nurses need to be licensed?", answer: "Nursing licensure protects the public by ensuring practitioners have met minimum competency standards. It verifies education, exam performance, and ongoing professional development. Practicing without a license is illegal in all jurisdictions." },
    { question: "Can I transfer my nursing license to another country?", answer: "International nursing credential recognition varies by country. Most require a credential assessment, language proficiency testing, and possibly additional exams (NCLEX, NMC CBT/OSCE, ANMAC assessment). Processing times range from 3\u201312 months." },
    { question: "What continuing education is required for nurses?", answer: "Requirements vary by jurisdiction. Common requirements include 20\u201340 hours of continuing education per renewal period, practice hour minimums, and sometimes competency assessments or portfolio submissions." },
  ];

  const faqStructuredData = buildFaqStructuredData(faqData);

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Regulatory Bodies Directory",
    "description": "Complete directory of nursing regulatory bodies worldwide. Understand licensing requirements, registration processes, and credential recognition for nurses.",
    "url": "https://www.nursenest.ca/nursing-regulatory-bodies",
    "isPartOf": { "@type": "WebSite", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <div data-testid="page-nursing-regulatory-hub">
      <Navigation />
      <SEO
        title={t("nursingRegulatory.hub.seoTitle")}
        description={t("nursingRegulatory.hub.seoDescription")}
        keywords="nursing regulatory bodies, nursing licensing, nurse registration, nursing boards, nursing council, nursing regulation, NCLEX, NMC, AHPRA"
        canonicalPath="/nursing-regulatory-bodies"
        structuredData={collectionStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Regulatory Bodies", url: "https://www.nursenest.ca/nursing-regulatory-bodies" },
        ]}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/50 to-indigo-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-100/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-purple-600" data-testid="link-breadcrumb-home">{t("pages.nursingRegulatoryHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium">{t("nursingRegulatory.hub.title")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700" data-testid="badge-directory">
              <Shield className="w-4 h-4" />
              {t("nursingRegulatory.hub.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-h1">
              {t("nursingRegulatory.hub.heroTitle")}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-subtitle">
              {t("nursingRegulatory.hub.heroSubtitle")}
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
              placeholder={t("nursingRegulatory.hub.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              data-testid="input-search-body"
            />
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-bodies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center" data-testid="text-bodies-title">
            {t("nursingRegulatory.hub.bodiesTitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-10">
            {t("nursingRegulatory.hub.bodiesSubtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((body) => (
              <Link key={body.slug} href={`/nursing-regulatory-bodies/${body.slug}`} className="group" data-testid={`card-body-${body.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{body.flag}</span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{body.shortName}</h3>
                      <p className="text-xs text-gray-500">{body.country}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 flex-1">{body.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium">
                    View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8" data-testid="text-no-results">{t("pages.nursingRegulatoryHub.noRegulatoryBodiesMatchYour")}</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-understand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("nursingRegulatory.hub.understandTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-understand-1">
              <Shield className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nursingRegulatory.hub.understand1Title")}</h3>
              <p className="text-sm text-gray-500">{t("nursingRegulatory.hub.understand1Desc")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-understand-2">
              <Award className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nursingRegulatory.hub.understand2Title")}</h3>
              <p className="text-sm text-gray-500">{t("nursingRegulatory.hub.understand2Desc")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="card-understand-3">
              <Globe className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t("nursingRegulatory.hub.understand3Title")}</h3>
              <p className="text-sm text-gray-500">{t("nursingRegulatory.hub.understand3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("nursingRegulatory.hub.relatedTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/exam-prep" className="group" data-testid="link-exam-prep">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 text-sm">{t("pages.nursingRegulatoryHub.examPrepResources")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingRegulatoryHub.prepareForNclexRexpnAnd")}</p>
              </div>
            </Link>
            <Link href="/nursing-schools" className="group" data-testid="link-schools">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 text-sm">{t("pages.nursingRegulatoryHub.nursingSchoolsDirectory")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingRegulatoryHub.findAccreditedNursingProgramsAcross")}</p>
              </div>
            </Link>
            <Link href="/nurse-residency-programs" className="group" data-testid="link-residency">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-200 transition-all">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 text-sm">{t("pages.nursingRegulatoryHub.residencyPrograms")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingRegulatoryHub.newGradTransitiontopracticeProgramsBy")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{t("nursingRegulatory.hub.faqTitle")}</h2>
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
