import type { Request, Response, NextFunction } from "express";
import { logLanguageEvent } from "./language-enforcement-logger";

const SUPPORTED_LANGUAGES = [
  "en", "fr", "es", "zh", "zh-tw", "ar", "hi", "pt", "tl", "ko", "ja",
  "de", "vi", "pa", "ur", "fa", "th", "tr", "id", "ht",
];

export function enforceLanguageIsolation(req: Request, res: Response, next: NextFunction) {
  let lang = req.lang || "en";

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    logLanguageEvent({
      eventType: "validation_failure",
      expectedLanguage: lang,
      detail: `Unsupported language requested: ${lang}`,
      source: "middleware",
    });
    lang = "en";
    req.lang = "en";
  }

  const effectiveLang = lang;
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    if (body && typeof body === "object" && !Array.isArray(body)) {
      body._lang = effectiveLang;
    }
    return originalJson(body);
  };

  next();
}

export function validateResponseLanguage(
  data: any,
  expectedLang: string,
  contentType: string,
  contentId?: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!data) return { valid: true, issues };

  if (expectedLang !== "en") {
    const textFields = extractTextFields(data);
    for (const { field, value } of textFields) {
      if (containsOnlyEnglishWhenNotExpected(value, expectedLang)) {
        issues.push(`Field "${field}" appears to contain untranslated English content`);
      }
    }
  }

  if (issues.length > 0) {
    logLanguageEvent({
      eventType: "language_mismatch",
      contentType,
      contentId,
      expectedLanguage: expectedLang,
      detectedLanguage: "en",
      detail: issues.join("; "),
      source: "response_validator",
    });
  }

  return { valid: issues.length === 0, issues };
}

function extractTextFields(obj: any, prefix = ""): Array<{ field: string; value: string }> {
  const results: Array<{ field: string; value: string }> = [];
  if (!obj || typeof obj !== "object") return results;

  const textFieldNames = ["title", "description", "summary", "content", "name", "label", "text"];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.length > 10 && textFieldNames.includes(key)) {
      results.push({ field: prefix ? `${prefix}.${key}` : key, value });
    }
  }

  return results;
}

const CJK_RANGE = /[\u3000-\u9fff\uf900-\ufaff]/;
const ARABIC_RANGE = /[\u0600-\u06ff\u0750-\u077f]/;
const DEVANAGARI_RANGE = /[\u0900-\u097f]/;
const HANGUL_RANGE = /[\uac00-\ud7af\u1100-\u11ff]/;
const THAI_RANGE = /[\u0e00-\u0e7f]/;
const CYRILLIC_RANGE = /[\u0400-\u04ff]/;

function containsOnlyEnglishWhenNotExpected(text: string, expectedLang: string): boolean {
  if (!text || text.length < 20) return false;

  const scriptLangs: Record<string, RegExp> = {
    zh: CJK_RANGE,
    "zh-tw": CJK_RANGE,
    ja: CJK_RANGE,
    ar: ARABIC_RANGE,
    ur: ARABIC_RANGE,
    fa: ARABIC_RANGE,
    hi: DEVANAGARI_RANGE,
    pa: /[\u0a00-\u0a7f]/,
    ko: HANGUL_RANGE,
    th: THAI_RANGE,
  };

  const expectedScript = scriptLangs[expectedLang];
  if (!expectedScript) return false;

  return !expectedScript.test(text);
}
