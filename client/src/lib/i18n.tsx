import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getLocaleFromPath, isValidLocale, buildLocalePath, deLocalizeSlug, localizeSlug, type SupportedLocale } from "./locale-utils";
import { loadLanguage, getLoadedTranslations, hasLoader } from "./i18n-translations";
import type { LanguageCode } from "./i18n-types";

export type { LanguageCode } from "./i18n-types";

export const TRANSLATION_UNAVAILABLE_MARKER = "@@TRANSLATION_UNAVAILABLE@@";

const EMERGENCY_FALLBACK: Record<string, string> = {
  "common.loading": "Loading",
  "common.error": "Error",
  "common.tryAgain": "Try again",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.submit": "Submit",
  "common.back": "Back",
  "common.next": "Next",
  "common.search": "Search",
  "common.home": "Home",
  "common.signIn": "Sign In",
  "common.signOut": "Sign Out",
  "common.signUp": "Sign Up",
  "common.yes": "Yes",
  "common.no": "No",
  "common.ok": "OK",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.settings": "Settings",
};

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: "en", name: "English", nativeName: "English", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "fr", name: "French", nativeName: "Fran\u00e7ais", flag: "\ud83c\uddeb\ud83c\uddf7" },
  { code: "tl", name: "Filipino", nativeName: "Tagalog", flag: "\ud83c\uddf5\ud83c\udded" },
  { code: "hi", name: "Hindi", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "es", name: "Spanish", nativeName: "Espa\u00f1ol", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "zh", name: "Chinese", nativeName: "\u4e2d\u6587", flag: "\ud83c\udde8\ud83c\uddf3" },
  { code: "zh-tw", name: "Traditional Chinese", nativeName: "\u7e41\u9ad4\u4e2d\u6587", flag: "\ud83c\uddf9\ud83c\uddfc" },
  { code: "ar", name: "Arabic", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\ud83c\uddf8\ud83c\udde6" },
  { code: "ko", name: "Korean", nativeName: "\ud55c\uad6d\uc5b4", flag: "\ud83c\uddf0\ud83c\uddf7" },
  { code: "pt", name: "Portuguese", nativeName: "Portugu\u00eas", flag: "\ud83c\udde7\ud83c\uddf7" },
  { code: "pa", name: "Punjabi", nativeName: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", flag: "\ud83c\udde8\ud83c\udde6" },
  { code: "vi", name: "Vietnamese", nativeName: "Ti\u1ebfng Vi\u1ec7t", flag: "\ud83c\uddfb\ud83c\uddf3" },
  { code: "ht", name: "Haitian Creole", nativeName: "Krey\u00f2l Ayisyen", flag: "\ud83c\udded\ud83c\uddf9" },
  { code: "ur", name: "Urdu", nativeName: "\u0627\u0631\u062f\u0648", flag: "\ud83c\uddf5\ud83c\uddf0" },
  { code: "ja", name: "Japanese", nativeName: "\u65e5\u672c\u8a9e", flag: "\ud83c\uddef\ud83c\uddf5" },
  { code: "fa", name: "Farsi", nativeName: "\u0641\u0627\u0631\u0633\u06cc", flag: "\ud83c\uddee\ud83c\uddf7" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "\ud83c\udde9\ud83c\uddea" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
];

const translations: Partial<Record<LanguageCode, Record<string, string>>> & { en: Record<string, string> } = {
  en: { ...EMERGENCY_FALLBACK },
};

const missingKeys: Map<string, Set<string>> = new Map();

const MISSING_KEY_REPORT_DEBOUNCE_MS = 5000;
const MISSING_KEY_BATCH_SIZE = 50;
let pendingMissingKeys: { language: string; key: string }[] = [];
let reportTimer: ReturnType<typeof setTimeout> | null = null;

function flushMissingKeys() {
  if (pendingMissingKeys.length === 0) return;
  const batch = pendingMissingKeys.splice(0, MISSING_KEY_BATCH_SIZE);
  try {
    fetch("/api/i18n/missing-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: batch }),
    }).catch(() => {});
  } catch {}
  if (pendingMissingKeys.length > 0) {
    reportTimer = setTimeout(flushMissingKeys, MISSING_KEY_REPORT_DEBOUNCE_MS);
  } else {
    reportTimer = null;
  }
}

function reportMissingKeyToServer(lang: string, key: string) {
  pendingMissingKeys.push({ language: lang, key });
  if (pendingMissingKeys.length >= MISSING_KEY_BATCH_SIZE) {
    if (reportTimer) clearTimeout(reportTimer);
    flushMissingKeys();
  } else if (!reportTimer) {
    reportTimer = setTimeout(flushMissingKeys, MISSING_KEY_REPORT_DEBOUNCE_MS);
  }
}

export function getMissingKeys(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  missingKeys.forEach((keys, lang) => {
    result[lang] = Array.from(keys);
  });
  return result;
}

export function getMissingKeyCount(): number {
  let total = 0;
  missingKeys.forEach((keys) => { total += keys.size; });
  return total;
}

function humanizeKey(key: string): string {
  const lastSegment = key.split(".").pop() || key;
  return lastSegment
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function isDottedKey(val: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z]/.test(val);
}

function trackMissingKey(lang: string, key: string) {
  if (!missingKeys.has(lang)) missingKeys.set(lang, new Set());
  const keySet = missingKeys.get(lang)!;
  if (!keySet.has(key)) {
    keySet.add(key);
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation: key="${key}", language="${lang}"`);
    }
    reportMissingKeyToServer(lang, key);
  }
}

let enFullyLoaded = false;
const enReady: Promise<void> = (async () => {
  try {
    let res = await fetch("/i18n/en.json");
    if (!res.ok) {
      res = await fetch("/api/assets/i18n/en.json");
    }
    if (res.ok) {
      const data: Record<string, string> = await res.json();
      Object.assign(translations.en, data);
      enFullyLoaded = true;
    }
  } catch {}
})();

type TranslationStatus = "translated" | "missing";

type I18nContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  tSafe: (key: string, vars?: Record<string, string>) => { text: string; status: TranslationStatus; isUnavailable: boolean };
  isTranslationLoaded: boolean;
  isFallback: (key: string) => boolean;
  translationStatus: (key: string) => TranslationStatus;
  reportMissingTranslation: (key: string, context?: string) => void;
};

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, _vars?: Record<string, string>) => humanizeKey(key),
  tSafe: (key: string) => ({ text: humanizeKey(key), status: "translated" as TranslationStatus, isUnavailable: false }),
  isTranslationLoaded: false,
  isFallback: () => false,
  translationStatus: () => "translated",
  reportMissingTranslation: () => {},
});

function localeToLanguage(locale: SupportedLocale): LanguageCode {
  if (locale === "fil") return "tl";
  return locale as LanguageCode;
}

function languageToLocale(lang: LanguageCode): SupportedLocale {
  if (lang === "tl") return "fil";
  return lang as SupportedLocale;
}

function getInitialLanguage(): LanguageCode {
  const { locale } = getLocaleFromPath(window.location.pathname);
  if (isValidLocale(locale)) {
    return localeToLanguage(locale);
  }
  const saved = localStorage.getItem("nursenest-language");
  if (saved && LANGUAGES.some(l => l.code === saved)) {
    return saved as LanguageCode;
  }
  const rawBrowserLang = navigator.language?.toLowerCase();
  if (rawBrowserLang && (rawBrowserLang === "zh-tw" || rawBrowserLang.startsWith("zh-hant") || rawBrowserLang.startsWith("zh-tw"))) {
    return "zh-tw" as LanguageCode;
  }
  const browserLang = rawBrowserLang?.split("-")[0];
  if (browserLang && LANGUAGES.some(l => l.code === browserLang)) {
    return browserLang as LanguageCode;
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);
  const [, forceUpdate] = useState(0);
  const [langLoaded, setLangLoaded] = useState<LanguageCode | null>(language === "en" ? "en" : null);

  useEffect(() => {
    if (!enFullyLoaded) {
      enReady.then(() => forceUpdate((n) => n + 1));
    }
  }, []);

  useEffect(() => {
    if (language !== "en" && hasLoader(language)) {
      loadLanguage(language).then((strings) => {
        translations[language] = strings;
        setLangLoaded(language);
      });
    } else if (language === "en") {
      setLangLoaded("en");
    }
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("nursenest-language", lang);
    document.documentElement.lang = lang;
    if (lang === "ar" || lang === "ur" || lang === "fa") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    const newLocale = languageToLocale(lang);
    const currentPath = window.location.pathname;
    const { locale: currentLocale, pathWithoutLocale } = getLocaleFromPath(currentPath);
    const englishPath = deLocalizeSlug(currentLocale, pathWithoutLocale);
    const newPath = buildLocalePath(newLocale, englishPath);
    if (currentPath !== newPath) {
      window.location.assign(newPath);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === "ar" || language === "ur" || language === "fa") {
      document.documentElement.dir = "rtl";
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nursenest-language", language);
  }, [language]);

  const isFallback = useCallback((key: string): boolean => {
    if (language === "en") return false;
    const langStrings = translations[language];
    return !langStrings || !langStrings[key];
  }, [language, langLoaded]);

  const translationStatus = useCallback((key: string): TranslationStatus => {
    if (language === "en") {
      return translations.en[key] ? "translated" : "missing";
    }
    const langStrings = translations[language];
    if (langStrings && langStrings[key]) return "translated";
    return "missing";
  }, [language, langLoaded]);

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    const langStrings = translations[language];

    if (language !== "en") {
      const hasTranslation = langStrings && langStrings[key];
      if (hasTranslation) {
        let val = langStrings[key];
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            val = val.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
          }
        }
        return val;
      }
      trackMissingKey(language, key);
      return `[missing:${key}]`;
    }

    let val = translations.en[key];
    if (!val || isDottedKey(val)) {
      trackMissingKey("en", key);
      val = humanizeKey(key);
    }

    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        val = val.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
      }
    }

    return val;
  }, [language, langLoaded]);

  const tSafe = useCallback((key: string, vars?: Record<string, string>): { text: string; status: TranslationStatus; isUnavailable: boolean } => {
    const langStrings = translations[language];

    if (language === "en") {
      const val = translations.en[key];
      if (!val || isDottedKey(val)) {
        return { text: humanizeKey(key), status: "missing", isUnavailable: false };
      }
      let result = val;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
        }
      }
      return { text: result, status: "translated", isUnavailable: false };
    }

    const hasTranslation = langStrings && langStrings[key];
    if (hasTranslation) {
      let val = langStrings[key];
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          val = val.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
        }
      }
      return { text: val, status: "translated", isUnavailable: false };
    }

    trackMissingKey(language, key);
    if (import.meta.env.PROD) {
      console.error(`[i18n] missing translation for ${language}: ${key}`);
    }
    return {
      text: `[missing:${key}]`,
      status: "missing",
      isUnavailable: true,
    };
  }, [language, langLoaded]);

  const reportMissingTranslation = useCallback((key: string, context?: string) => {
    reportMissingKeyToServer(language, `${key}${context ? `|ctx:${context}` : ""}`);
  }, [language]);

  const isTranslationLoaded = language === "en" || langLoaded === language;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tSafe, isTranslationLoaded, isFallback, translationStatus, reportMissingTranslation }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function isTranslationUnavailable(text: string): boolean {
  return text === TRANSLATION_UNAVAILABLE_MARKER || text.startsWith("[missing:");
}
