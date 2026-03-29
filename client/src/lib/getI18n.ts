import type { LessonContent } from "@/data/lessons/types";
import type { LanguageCode } from "./i18n";

export type I18nValue<T = string> = Partial<Record<LanguageCode, T>> & { en: T };

export function getI18n<T = string>(obj: I18nValue<T> | T | undefined | null, lang: LanguageCode, fallback: LanguageCode = "en"): T {
  if (obj === undefined || obj === null) return "" as unknown as T;
  if (typeof obj === "string" || typeof obj !== "object") return obj as T;
  const map = obj as Partial<Record<LanguageCode, T>>;
  return map[lang] ?? map[fallback] ?? map["en"] ?? ("" as unknown as T);
}

type LessonTranslationOverrides = {
  title?: string;
  overview?: string;
  pathophysiology?: string;
  lifespan?: string;
  riskFactors?: string[];
  diagnostics?: string[];
  management?: string[];
  nursingActions?: string[];
  assessmentFindings?: string[];
  clinicalPearls?: string[];
  medications?: { name: string; type: string; action: string; sideEffects: string; contra: string; pearl: string }[];
  signs?: { left: string[]; right: string[] };
  quiz?: { question: string; options: string[]; correct: number; rationale: string }[];
  preTest?: { question: string; options: string[]; correct: number; rationale: string }[];
  postTest?: { question: string; options: string[]; correct: number; rationale: string }[];
};

type TranslationStore = Record<string, Record<string, LessonTranslationOverrides>>;

let translationStore: TranslationStore = {};
let storeLoaded = false;

const AVAILABLE_TRANSLATION_LANGS = new Set([
  "fr", "es", "zh", "ar", "hi", "pt", "tl", "ko",
  "ja", "de", "vi", "pa", "ur", "fa", "ht", "id", "th", "zh-tw",
]);

const loadedLanguages = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

export async function loadTranslationLanguage(lang: string): Promise<void> {
  if (lang === "en" || loadedLanguages.has(lang)) return;
  if (loadingPromises.has(lang)) return loadingPromises.get(lang);

  if (!AVAILABLE_TRANSLATION_LANGS.has(lang)) return;

  const promise = fetch(`/api/assets/translations/${lang}.json`)
    .then((res) => {
      if (!res.ok) return fetch(`/translations/${lang}.json`);
      return res;
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load translations for ${lang}`);
      return res.json();
    })
    .then((data) => {
      translationStore[lang] = data;
      loadedLanguages.add(lang);
      storeLoaded = true;
    })
    .catch(() => {
      translationStore[lang] = {};
      loadedLanguages.add(lang);
    });
  loadingPromises.set(lang, promise);
  return promise;
}

export function getLessonTitle(lessonId: string, lang: LanguageCode, baseLesson?: LessonContent | null): string {
  if (lang !== "en") {
    const translated = translationStore[lang]?.[lessonId]?.title;
    if (translated) return translated;
  }
  return baseLesson?.title || "";
}

export function getLessonI18n(lessonId: string, lang: LanguageCode, baseLesson?: LessonContent | null): LessonContent | null {
  const base = baseLesson ?? null;
  if (!base) return null;
  if (lang === "en") return base;

  const overrides = translationStore[lang]?.[lessonId];
  if (!overrides) return base;

  const merged = { ...base };

  if (overrides.title) merged.title = overrides.title;
  if (overrides.overview && (merged as any).cellular) {
    (merged as any).cellular = { ...(merged as any).cellular, content: overrides.overview };
  }
  if (overrides.riskFactors) merged.riskFactors = overrides.riskFactors;
  if (overrides.diagnostics) merged.diagnostics = overrides.diagnostics;
  if (overrides.management) merged.management = overrides.management;
  if (overrides.nursingActions) merged.nursingActions = overrides.nursingActions;
  if (overrides.assessmentFindings) merged.assessmentFindings = overrides.assessmentFindings;
  if (overrides.clinicalPearls) (merged as any).pearls = overrides.clinicalPearls;
  if (overrides.medications) merged.medications = overrides.medications;
  if (overrides.signs) merged.signs = overrides.signs;
  if (overrides.quiz) merged.quiz = overrides.quiz;
  if (overrides.preTest) merged.preTest = overrides.preTest;
  if (overrides.postTest) merged.postTest = overrides.postTest;
  if (overrides.lifespan && (merged as any).lifespan) {
    (merged as any).lifespan = { ...(merged as any).lifespan, content: overrides.lifespan };
  }

  return merged;
}

export function getTranslationStore(): TranslationStore {
  return translationStore;
}

export function isTranslationLoaded(lang: string): boolean {
  return lang === "en" || loadedLanguages.has(lang);
}
