"use client";

import Link from "next/link";
import { SUPPORTED_COUNTRIES, SUPPORTED_LANGUAGES } from "@shared/platform-manifest";
import { Globe, Languages } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

const FLAG_EMOJI: Record<string, string> = {
  CA: "\u{1F1E8}\u{1F1E6}",
  US: "\u{1F1FA}\u{1F1F8}",
  GB: "\u{1F1EC}\u{1F1E7}",
  AU: "\u{1F1E6}\u{1F1FA}",
  NZ: "\u{1F1F3}\u{1F1FF}",
  IE: "\u{1F1EE}\u{1F1EA}",
  IN: "\u{1F1EE}\u{1F1F3}",
  PH: "\u{1F1F5}\u{1F1ED}",
  SA: "\u{1F1F8}\u{1F1E6}",
  AE: "\u{1F1E6}\u{1F1EA}",
};

export default function HeroGlobalCoverage() {
  const { t } = useMarketingI18n();
  return (
    <section
      className="bg-gradient-to-b from-white to-gray-50/80"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-global-coverage"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-global-coverage-heading">
            Global Exam Coverage
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 lg:text-lg">
            NurseNest supports nursing and allied health exams across {SUPPORTED_COUNTRIES.length} countries in {SUPPORTED_LANGUAGES.length} languages.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)] lg:p-8" data-testid="panel-countries">
            <div className="mb-5 flex items-center gap-3">
              <div className="nn-accent-icon-wrap flex h-10 w-10 items-center justify-center rounded-xl">
                <Globe className="nn-accent-icon h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("components.heroGlobalCoverage.supportedCountries")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_COUNTRIES.map((country) => (
                <div
                  key={country.flag}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
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

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)] lg:p-8" data-testid="panel-languages">
            <div className="mb-5 flex items-center gap-3">
              <div className="nn-accent-icon-wrap flex h-10 w-10 items-center justify-center rounded-xl">
                <Languages className="nn-accent-icon h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("components.heroGlobalCoverage.supportedLanguages")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1.5 text-xs font-medium text-primary"
                  data-testid={`lang-${lang.toLowerCase()}`}
                >
                  {lang}
                </span>
              ))}
            </div>
            <Link
              href={mapLegacyMarketingHref("/languages")}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:underline"
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
