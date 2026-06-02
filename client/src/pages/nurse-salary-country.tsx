import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { SALARY_COUNTRIES, getSalaryCountryBySlug } from "@/data/nurse-salary-data";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  DollarSign, ChevronRight, ArrowRight, TrendingUp,
  HelpCircle, ChevronDown, Briefcase, BarChart3,
  CheckCircle, Building2, GraduationCap,
} from "lucide-react";
import { useState } from "react";

function SalaryNotFound() {
  return (
    <div data-testid="salary-not-found">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.nurseSalaryCountry.countryNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.nurseSalaryCountry.theSalaryGuideForThis")}</p>
          <LocaleLink href="/nurse-salary-guide" className="text-emerald-600 hover:underline font-medium" data-testid="link-back-hub">
            Browse All Salary Guides
          </LocaleLink>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function NurseSalaryCountryPage() {
  const [location] = useLocation();
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const slug = location.replace(/^\//, "").replace(/\/$/, "");
  const country = getSalaryCountryBySlug(slug);
  if (!country) return <SalaryNotFound />;

  const faqStructuredData = buildFaqStructuredData(country.faqs);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Nurse Salary in ${country.country}: Complete Guide`,
    description: country.description,
    author: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.nursenest.ca/${country.slug}` },
  };

  const relatedCountries = country.relatedCountrySlugs
    .map(s => SALARY_COUNTRIES.find(c => c.slug === s))
    .filter(Boolean);

  return (
    <div data-testid={`salary-country-${country.slug}`}>
      <Navigation />
      <SEO
        title={`Nurse Salary in ${country.country}: Average Pay, Specialties & Outlook | NurseNest`}
        description={country.description}
        keywords={`nurse salary ${country.country}, nursing pay ${country.country}, RN salary ${country.country}, nursing salary by specialty, nurse compensation ${country.country}`}
        canonicalPath={`/${country.slug}`}
        ogType="article"
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nurse Salary Guide", url: "https://www.nursenest.ca/nurse-salary-guide" },
          { name: country.country, url: `https://www.nursenest.ca/${country.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-white/80">{t("pages.nurseSalaryCountry.home")}</LocaleLink>
            <ChevronRight className="w-3 h-3" />
            <LocaleLink href="/nurse-salary-guide" className="hover:text-white/80">{t("pages.nurseSalaryCountry.salaryGuide")}</LocaleLink>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{country.country}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{country.flagEmoji}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight" data-testid="text-title">
                Nurse Salary in {country.country}
              </h1>
              <p className="text-emerald-200 text-lg font-semibold mt-1">{country.averageSalary} average</p>
            </div>
          </div>
          <p className="text-lg text-white/80 max-w-3xl leading-relaxed" data-testid="text-description">
            {country.description}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section data-testid="section-overview">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nurseSalaryCountry.overview")}</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{country.overview}</p>
          </div>
        </section>

        <section data-testid="section-salary-by-specialty">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" /> Salary by Specialty
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid="table-specialty">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryCountry.specialty")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryCountry.average")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b hidden sm:table-cell">{t("pages.nurseSalaryCountry.range")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b hidden md:table-cell">{t("pages.nurseSalaryCountry.notes")}</th>
                </tr>
              </thead>
              <tbody>
                {country.salaryBySpecialty.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors" data-testid={`row-specialty-${i}`}>
                    <td className="px-4 py-3 border-b font-medium text-gray-900">{s.specialty}</td>
                    <td className="px-4 py-3 border-b font-bold text-emerald-700">{country.currencySymbol}{s.averageSalary.replace(/[\$£]/g, "")}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-600 hidden sm:table-cell">{s.salaryRange}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-500 hidden md:table-cell">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section data-testid="section-salary-by-experience">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" /> Salary by Experience
          </h2>
          <div className="space-y-3">
            {country.salaryByExperience.map((exp, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between" data-testid={`row-experience-${i}`}>
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.level}</h3>
                  <p className="text-xs text-gray-500">{exp.years}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-emerald-700">{exp.averageSalary}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="section-workplace-settings">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" /> Salary by Workplace Setting
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid="table-workplace">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryCountry.setting")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">{t("pages.nurseSalaryCountry.averageSalary")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b hidden sm:table-cell">{t("pages.nurseSalaryCountry.notes2")}</th>
                </tr>
              </thead>
              <tbody>
                {country.workplaceSettings.map((ws, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors" data-testid={`row-workplace-${i}`}>
                    <td className="px-4 py-3 border-b font-medium text-gray-900">{ws.setting}</td>
                    <td className="px-4 py-3 border-b font-bold text-emerald-700">{ws.averageSalary}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-500 hidden sm:table-cell">{ws.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section data-testid="section-career-outlook">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" /> Career Outlook
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{country.careerOutlook}</p>
          </div>
        </section>

        <section data-testid="section-key-factors">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nurseSalaryCountry.keySalaryFactors")}</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <ul className="space-y-3">
              {country.keyFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-3" data-testid={`factor-${i}`}>
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8" data-testid="section-cta">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("pages.nurseSalaryCountry.advanceYourNursingCareer")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg">
            Use NurseNest's career tools to maximize your earning potential. Build your resume, prepare for interviews, and find job opportunities.
          </p>
          <div className="flex flex-wrap gap-3">
            <LocaleLink
              href="/applynest"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              data-testid="link-applynest"
            >
              ApplyNest Career Tools <ArrowRight className="w-4 h-4" />
            </LocaleLink>
            <LocaleLink
              href="/applynest/resume-templates"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-resume"
            >
              Resume Templates
            </LocaleLink>
            <LocaleLink
              href="/applynest/interview-prep"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-interview"
            >
              Interview Prep
            </LocaleLink>
          </div>
        </section>

        <section data-testid="section-faq">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t("pages.nurseSalaryCountry.frequentlyAskedQuestions")}</h2>
          </div>
          <div className="space-y-3">
            {country.faqs.map((faq, i) => (
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
        </section>

        <section data-testid="section-related-countries">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nurseSalaryCountry.compareOtherCountries")}</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {relatedCountries.map((related) => (
              <LocaleLink
                key={related!.slug}
                href={`/${related!.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
                data-testid={`link-related-${related!.slug}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{related!.flagEmoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{related!.country}</p>
                      <p className="text-xs text-emerald-600">{related!.averageSalary}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                </div>
              </LocaleLink>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
