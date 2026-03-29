import { SEO } from "@/components/seo";
import { LANGUAGES } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/lib/locale-utils";
import { Globe } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const LOCALE_TO_LANG_CODE: Record<string, string> = {
  en: "en", fr: "fr", es: "es", fil: "tl", hi: "hi",
  zh: "zh", "zh-tw": "zh-tw", ar: "ar", ko: "ko", pt: "pt", pa: "pa",
  vi: "vi", ht: "ht", ur: "ur", ja: "ja", fa: "fa",
  de: "de", th: "th", tr: "tr", id: "id",
};

function getLanguageInfo(locale: string) {

  const langCode = LOCALE_TO_LANG_CODE[locale] || locale;
  return LANGUAGES.find(l => l.code === langCode);
}

export default function LanguagesPage() {
  return (
    <>
      <SEO
        title={t("pages.languages.studyNursingInYourLanguage")}
        description={t("pages.languages.nursenestSupports20LanguagesFor")}
        keywords="multilingual nursing exam prep, NCLEX in other languages, nursing study languages, NurseNest languages"
        canonicalPath="/languages"
      />
      <div className="min-h-screen bg-[var(--theme-bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--theme-heading-text)] mb-3" data-testid="text-languages-title">
              Study Nursing in Your Language
            </h1>
            <p className="text-lg text-[var(--theme-muted-text)] max-w-2xl mx-auto" data-testid="text-languages-subtitle">
              NurseNest supports {SUPPORTED_LOCALES.length} languages so you can prepare for your nursing exams
              in the language you're most comfortable with. All clinical content, practice questions,
              and study tools are available across every supported language.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12" data-testid="grid-languages">
            {SUPPORTED_LOCALES.map((locale) => {
              const info = getLanguageInfo(locale);
              if (!info) return null;
              return (
                <a
                  key={locale}
                  href={`/${locale}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--theme-separator)] bg-[var(--theme-card-bg)] hover:border-primary/40 hover:shadow-md transition-all group"
                  data-testid={`link-language-${locale}`}
                >
                  <span className="text-2xl" aria-hidden="true">{info.flag}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[var(--theme-heading-text)] group-hover:text-primary transition-colors truncate">
                      {info.nativeName}
                    </div>
                    <div className="text-xs text-[var(--theme-muted-text)] truncate">
                      {info.name}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-separator)] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)] mb-4" data-testid="text-languages-about-heading">
              Multilingual Nursing Education
            </h2>
            <div className="space-y-3 text-sm text-[var(--theme-muted-text)] leading-relaxed">
              <p>
                NurseNest is built for the diverse global nursing community. Whether you're preparing
                for the NCLEX-RN, NCLEX-PN, REx-PN, or NP certification exams, you can study in the
                language that helps you learn best.
              </p>
              <p>
                Our platform automatically adapts navigation, study tools, clinical lessons,
                flashcards, and practice questions to your selected language. Switch languages at any
                time using the language selector in the navigation bar — your study progress is
                preserved across all languages.
              </p>
              <p>
                Supported languages include English, French, Spanish, Filipino, Hindi, Chinese
                (Simplified & Traditional), Arabic, Korean, Portuguese, Punjabi, Vietnamese, Haitian
                Creole, Urdu, Japanese, Farsi, German, Thai, Turkish, and Indonesian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
