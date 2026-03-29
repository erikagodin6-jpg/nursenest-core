import { pool } from "./storage";
import { logTranslationEvent } from "./translation-event-logger";

const SUPPORTED_LANGUAGES = [
  "fr", "es", "zh", "ar", "hi", "pt", "tl", "ko", "ja",
  "de", "vi", "pa", "ur", "fa"
];

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", fr: "French", es: "Spanish", zh: "Chinese (Simplified)",
  ar: "Arabic", hi: "Hindi", pt: "Portuguese", tl: "Filipino/Tagalog",
  ko: "Korean", ja: "Japanese", de: "German", vi: "Vietnamese",
  pa: "Punjabi", ur: "Urdu", fa: "Farsi/Persian"
};

export interface TranslationScanReport {
  scanId: string;
  scannedAt: string;
  coverageByLanguage: Record<string, {
    language: string;
    languageName: string;
    totalItems: number;
    translatedItems: number;
    coveragePct: number;
  }>;
  coverageByContentType: Record<string, {
    contentType: string;
    totalItems: number;
    perLanguage: Record<string, { translated: number; coveragePct: number }>;
  }>;
  violations: Array<{
    contentType: string;
    contentId: string;
    language: string;
    issueType: string;
    details: string;
  }>;
  mixedLanguageDetections: Array<{
    contentType: string;
    contentId: string;
    detectedLanguages: string[];
  }>;
  summary: {
    totalContentItems: number;
    totalLanguages: number;
    averageCoverage: number;
    lowestCoverageLanguage: string;
    highestCoverageLanguage: string;
    totalViolations: number;
    totalMixedLanguage: number;
  };
}

export async function runTranslationScan(): Promise<TranslationScanReport> {
  const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const scannedAt = new Date().toISOString();

  const [examQCount, contentItemCount, translationCounts, allTranslations] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int as total FROM exam_questions WHERE status = 'published'`),
    pool.query(`SELECT COUNT(*)::int as total FROM content_items WHERE status = 'published'`),
    pool.query(
      `SELECT content_type, language_code, COUNT(DISTINCT content_id)::int as translated_count
       FROM content_translations
       GROUP BY content_type, language_code
       ORDER BY content_type, language_code`
    ),
    pool.query(
      `SELECT content_type, content_id, language_code, field_name, translated_text
       FROM content_translations
       ORDER BY content_type, content_id
       LIMIT 5000`
    ),
  ]);

  const totalExamQ = examQCount.rows[0]?.total || 0;
  const totalContent = contentItemCount.rows[0]?.total || 0;

  const contentTypeTotals: Record<string, number> = {
    exam_question: totalExamQ,
    content_item: totalContent,
  };

  const coverageByLanguage: Record<string, any> = {};
  const coverageByContentType: Record<string, any> = {};

  for (const lang of SUPPORTED_LANGUAGES) {
    let totalTranslated = 0;
    let totalItems = totalExamQ + totalContent;

    for (const row of translationCounts.rows) {
      if (row.language_code === lang) {
        totalTranslated += row.translated_count;
      }
    }

    coverageByLanguage[lang] = {
      language: lang,
      languageName: LANGUAGE_NAMES[lang] || lang,
      totalItems,
      translatedItems: totalTranslated,
      coveragePct: totalItems > 0 ? Math.round((totalTranslated / totalItems) * 100 * 10) / 10 : 0,
    };
  }

  const contentTypes = [...new Set(translationCounts.rows.map((r: any) => r.content_type))];
  for (const ct of contentTypes) {
    const total = contentTypeTotals[ct] || 0;
    const perLanguage: Record<string, any> = {};

    for (const lang of SUPPORTED_LANGUAGES) {
      const row = translationCounts.rows.find((r: any) => r.content_type === ct && r.language_code === lang);
      const translated = row?.translated_count || 0;
      perLanguage[lang] = {
        translated,
        coveragePct: total > 0 ? Math.round((translated / total) * 100 * 10) / 10 : 0,
      };
    }

    coverageByContentType[ct] = {
      contentType: ct,
      totalItems: total,
      perLanguage,
    };
  }

  const violations: TranslationScanReport["violations"] = [];
  const mixedLanguageDetections: TranslationScanReport["mixedLanguageDetections"] = [];

  const contentByIdLang = new Map<string, Set<string>>();
  for (const row of allTranslations.rows) {
    const key = `${row.content_type}:${row.content_id}`;
    if (!contentByIdLang.has(key)) contentByIdLang.set(key, new Set());
    contentByIdLang.get(key)!.add(row.language_code);

    if (row.translated_text && typeof row.translated_text === "string") {
      const text = row.translated_text.trim();
      if (text.length === 0) {
        violations.push({
          contentType: row.content_type,
          contentId: row.content_id,
          language: row.language_code,
          issueType: "empty_translation",
          details: `Field "${row.field_name}" has empty translation`,
        });
      }

      if (row.language_code !== "en" && text.length > 20) {
        const englishWordPattern = /\b(the|is|are|was|were|have|has|been|being|will|would|should|could|this|that|with|from|which|their|there|they|them|than|then|into|also|more|some|when|what|your|about|other|because|through|after|before|between|under|during|without|within)\b/gi;
        const matches = text.match(englishWordPattern);
        if (matches && matches.length > 5) {
          violations.push({
            contentType: row.content_type,
            contentId: row.content_id,
            language: row.language_code,
            issueType: "possible_english_fallback",
            details: `Field "${row.field_name}" may contain untranslated English text (${matches.length} common English words found)`,
          });
        }
      }
    }
  }

  const coverageValues = Object.values(coverageByLanguage).map((c: any) => c.coveragePct);
  const avgCoverage = coverageValues.length > 0 ? coverageValues.reduce((a: number, b: number) => a + b, 0) / coverageValues.length : 0;

  let lowestLang = "";
  let lowestPct = 100;
  let highestLang = "";
  let highestPct = 0;
  for (const [lang, data] of Object.entries(coverageByLanguage)) {
    const d = data as any;
    if (d.coveragePct < lowestPct) { lowestPct = d.coveragePct; lowestLang = lang; }
    if (d.coveragePct > highestPct) { highestPct = d.coveragePct; highestLang = lang; }
  }

  const report: TranslationScanReport = {
    scanId,
    scannedAt,
    coverageByLanguage,
    coverageByContentType,
    violations: violations.slice(0, 200),
    mixedLanguageDetections: mixedLanguageDetections.slice(0, 50),
    summary: {
      totalContentItems: totalExamQ + totalContent,
      totalLanguages: SUPPORTED_LANGUAGES.length,
      averageCoverage: Math.round(avgCoverage * 10) / 10,
      lowestCoverageLanguage: lowestLang,
      highestCoverageLanguage: highestLang,
      totalViolations: violations.length,
      totalMixedLanguage: mixedLanguageDetections.length,
    },
  };

  await logTranslationEvent({
    eventType: "scanner_run",
    severity: "info",
    generatorName: "translation-scanner",
    details: {
      scanId,
      totalItems: report.summary.totalContentItems,
      avgCoverage: report.summary.averageCoverage,
      violations: report.summary.totalViolations,
    },
  });

  return report;
}
