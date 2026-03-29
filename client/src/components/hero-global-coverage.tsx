import { Link } from "wouter";
import { SUPPORTED_COUNTRIES, SUPPORTED_LANGUAGES } from "@shared/platform-manifest";
import { Globe, Languages } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const FLAG_EMOJI: Record<string, string> = {
  CA: "\u{1F1E8}\u{1F1E6}", US: "\u{1F1FA}\u{1F1F8}", GB: "\u{1F1EC}\u{1F1E7}",
  AU: "\u{1F1E6}\u{1F1FA}", NZ: "\u{1F1F3}\u{1F1FF}", IE: "\u{1F1EE}\u{1F1EA}",
  IN: "\u{1F1EE}\u{1F1F3}", PH: "\u{1F1F5}\u{1F1ED}", SA: "\u{1F1F8}\u{1F1E6}",
  AE: "\u{1F1E6}\u{1F1EA}",
};

export default function HeroGlobalCoverage() {
  const { t } = useI18n();
  return (
    <section
      className="bg-gradient-to-b from-white to-gray-50/80"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-global-coverage"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-global-coverage-heading"
          >
            Global Exam Coverage
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            NurseNest supports nursing and allied health exams across {SUPPORTED_COUNTRIES.length} countries in {SUPPORTED_LANGUAGES.length} languages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] p-6 lg:p-8" data-testid="panel-countries">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("components.heroGlobalCoverage.supportedCountries")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_COUNTRIES.map((country) => (
                <div
                  key={country.flag}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
                  data-testid={`country-${country.flag.toLowerCase()}`}
                >
                  <span className="text-lg" role="img" aria-label={`${country.name} flag`}>
                    {FLAG_EMOJI[country.flag] || ""}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{country.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] p-6 lg:p-8" data-testid="panel-languages">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Languages className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("components.heroGlobalCoverage.supportedLanguages")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-medium text-purple-700"
                  data-testid={`lang-${lang.toLowerCase()}`}
                >
                  {lang}
                </span>
              ))}
            </div>
            <Link
              href="/languages"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-5 hover:underline no-underline"
              data-testid="link-view-all-languages"
            >
              View all languages
              <span>{t("components.heroGlobalCoverage.rarr")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
