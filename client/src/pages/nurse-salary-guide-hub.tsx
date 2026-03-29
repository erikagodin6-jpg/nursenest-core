import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { SALARY_COUNTRIES } from "@/data/nurse-salary-data";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  DollarSign, ChevronRight, ArrowRight, TrendingUp,
  MapPin, HelpCircle, ChevronDown, Briefcase, BarChart3,
} from "lucide-react";
import { useState } from "react";

const HUB_FAQS = [
  { question: "How much do nurses make on average?", answer: "Nursing salaries vary significantly by country, specialty, and experience. In the US, the average RN salary is approximately $86,000 USD. In Canada, it is approximately $78,000 CAD. In the UK, newly qualified nurses start at approximately £28,000 GBP. In Australia, the average is approximately $82,000 AUD." },
  { question: "Which country pays nurses the most?", answer: "The United States generally offers the highest nominal nursing salaries, particularly in states like California where RN salaries can exceed $130,000 USD. However, when adjusted for cost of living and purchasing power, Australia and Canada are also highly competitive. The Middle East (particularly Gulf states) offers tax-free salaries with housing benefits." },
  { question: "What is the highest-paying nursing specialty?", answer: "Certified Registered Nurse Anesthetists (CRNAs) are the highest-paid nursing specialty in the US, averaging over $200,000 USD. Nurse Practitioners, Critical Care nurses, and Emergency nurses also earn above-average salaries across all countries." },
  { question: "Do nurses get overtime pay?", answer: "In most countries, nurses receive overtime pay for hours worked beyond their standard schedule. This varies by employer and collective agreement but typically ranges from 1.5x to 2x the regular rate. Shift differentials for evenings, nights, weekends, and holidays also increase earnings." },
];

export default function NurseSalaryGuideHub() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqStructuredData = buildFaqStructuredData(HUB_FAQS);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Nurse Salary Guide: Compare Nursing Salaries by Country",
    description: "Comprehensive nurse salary guide comparing nursing salaries, benefits, and career outlook across Canada, United States, United Kingdom, and Australia.",
    author: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.nursenest.ca/nurse-salary-guide" },
  };

  return (
    <div data-testid="nurse-salary-guide-hub">
      <Navigation />
      <SEO
        title={t("salaryGuide.hub.seoTitle")}
        description={t("salaryGuide.hub.seoDescription")}
        keywords="nurse salary, nursing salary guide, RN salary, nurse pay, nursing salary by country, nurse salary comparison, nursing career outlook, nurse compensation"
        canonicalPath="/nurse-salary-guide"
        ogType="article"
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nurse Salary Guide", url: "https://www.nursenest.ca/nurse-salary-guide" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-white/80">{t("pages.nurseSalaryGuideHub.home")}</LocaleLink>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{t("salaryGuide.hub.title")}</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-white/10 text-emerald-200">
            <DollarSign className="w-4 h-4" /> {t("salaryGuide.hub.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-title">
            {t("salaryGuide.hub.title")}
          </h1>
          <p className="text-lg text-white/80 max-w-3xl leading-relaxed" data-testid="text-description">
            {t("salaryGuide.hub.description")}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16" data-testid="section-comparison-table">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("salaryGuide.hub.compareTitle")}</h2>
          <p className="text-gray-600 mb-6">{t("salaryGuide.hub.compareDescription")}</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid="table-comparison">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryGuideHub.country")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryGuideHub.averageRnSalary")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryGuideHub.salaryRange")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b hidden sm:table-cell">{t("pages.nurseSalaryGuideHub.currency")}</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {SALARY_COUNTRIES.map((country, i) => (
                  <tr key={country.slug} className="hover:bg-gray-50 transition-colors" data-testid={`row-country-${country.slug}`}>
                    <td className="px-4 py-4 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{country.flagEmoji}</span>
                        <span className="font-medium text-gray-900">{country.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b">
                      <span className="font-bold text-emerald-700">{country.averageSalary}</span>
                    </td>
                    <td className="px-4 py-4 border-b text-sm text-gray-600">{country.salaryRange}</td>
                    <td className="px-4 py-4 border-b text-sm text-gray-500 hidden sm:table-cell">{country.currency}</td>
                    <td className="px-4 py-4 border-b text-right">
                      <LocaleLink
                        href={`/${country.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-[#BFA6F6] hover:text-[#a88de8] font-medium"
                        data-testid={`link-detail-${country.slug}`}
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </LocaleLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-country-cards">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("salaryGuide.hub.exploreTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {SALARY_COUNTRIES.map((country) => (
              <LocaleLink
                key={country.slug}
                href={`/${country.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all group"
                data-testid={`card-country-${country.slug}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flagEmoji}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                        {country.country}
                      </h3>
                      <p className="text-sm text-emerald-600 font-semibold">{country.averageSalary} avg.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition-colors mt-1" />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{country.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {country.salaryBySpecialty.length} specialties
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {country.workplaceSettings.length} settings
                  </span>
                </div>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" data-testid="section-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t("salaryGuide.hub.faqTitle")}</h2>
          </div>
          <div className="space-y-3">
            {HUB_FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`faq-answer-${i}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-emerald-50 to-green-50" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("salaryGuide.hub.ctaTitle")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">{t("salaryGuide.hub.ctaDescription")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <LocaleLink
              href="/applynest"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              data-testid="link-applynest"
            >
              ApplyNest Career Tools <ArrowRight className="w-4 h-4" />
            </LocaleLink>
            <LocaleLink
              href="/healthcare-careers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-careers"
            >
              Career Hub
            </LocaleLink>
            <LocaleLink
              href="/newgrad/salary"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-newgrad-salary"
            >
              New Grad Salary Tips
            </LocaleLink>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
