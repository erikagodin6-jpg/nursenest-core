import type { Request, Response, NextFunction } from "express";

const SUPPORTED_LANGUAGES = new Set([
  "en", "fr", "es", "tl", "hi", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
]);

const LANGUAGE_ALIASES: Record<string, string> = {
  "fr-ca": "fr",
  "fr-fr": "fr",
  "es-mx": "es",
  "es-es": "es",
  "pt-br": "pt",
  "zh-hans": "zh",
  "zh-hant": "zh-tw",
  "zh-cn": "zh",
  "zh-sg": "zh",
  "en-us": "en",
  "en-gb": "en",
  "en-ca": "en",
  "filipino": "tl",
  "tagalog": "tl",
  "farsi": "fa",
  "persian": "fa",
  "punjabi": "pa",
  "arabic": "ar",
  "korean": "ko",
  "japanese": "ja",
  "vietnamese": "vi",
  "german": "de",
  "thai": "th",
  "turkish": "tr",
  "indonesian": "id",
  "portuguese": "pt",
  "spanish": "es",
  "french": "fr",
  "english": "en",
  "hindi": "hi",
  "chinese": "zh",
  "urdu": "ur",
  "haitian": "ht",
  "haitian-creole": "ht",
};

function normalizeLanguage(raw: string): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  if (SUPPORTED_LANGUAGES.has(lower)) return lower;
  if (LANGUAGE_ALIASES[lower]) return LANGUAGE_ALIASES[lower];
  const base = lower.split("-")[0];
  if (SUPPORTED_LANGUAGES.has(base)) return base;
  return null;
}

export function requireLanguage(req: Request, res: Response, next: NextFunction): void {
  const rawLang =
    (req.body as any)?.target_language ||
    (req.body as any)?.targetLanguage ||
    (req.body as any)?.language ||
    (req.body as any)?.lang ||
    req.headers["x-target-language"] as string ||
    req.headers["accept-language"]?.split(",")[0]?.split(";")[0] ||
    req.query.lang as string ||
    req.query.language as string;

  if (!rawLang) {
    res.status(400).json({
      error: "target_language is required",
      supportedLanguages: Array.from(SUPPORTED_LANGUAGES),
    });
    return;
  }

  const normalized = normalizeLanguage(String(rawLang));

  if (!normalized) {
    res.status(400).json({
      error: `Unsupported language: ${rawLang}`,
      supportedLanguages: Array.from(SUPPORTED_LANGUAGES),
    });
    return;
  }

  (res as any).locals.targetLanguage = normalized;
  next();
}
