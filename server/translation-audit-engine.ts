import { pool } from "./storage";
import fs from "fs";
import path from "path";

import { SUPPORTED_LOCALES as _ALL_LOCALES } from "@shared/locales";
const SUPPORTED_LOCALES = _ALL_LOCALES.filter(l => l !== "en" && l !== "zh-tw" && l !== "id" && l !== "tr" && l !== "th");

const BRAND_ALLOWLIST = new Set([
  "nursenest", "nclex", "nclex-rn", "nclex-pn", "ncsbn", "rex-pn",
  "ancc", "aanp", "cno", "rpn", "lvn", "rn", "np", "lpn",
  "apa", "apa7", "apa 7", "sbar", "abg", "bmp", "cbc", "ekg", "ecg",
  "icu", "er", "iv", "prn", "tid", "bid", "qid", "po", "im", "sq", "subq",
  "hba1c", "a1c", "bun", "gfr", "inr", "pt", "ptt", "aptt",
  "dka", "hhs", "copd", "chf", "mi", "cva", "dvt", "pe", "uti", "ards",
  "news", "mews", "gcs", "mmhg", "meq", "mg", "ml", "mcg", "kg",
  "csv", "pdf", "url", "http", "https",
  "uworld", "archer", "kaplan",
  "cad", "usd",
]);

const PLACEHOLDER_PATTERNS = [
  /^todo$/i, /^translate me$/i, /^translation needed$/i,
  /^\[.*\]$/, /^__.*__$/, /^xxx+$/i, /^tbd$/i,
  /^placeholder$/i, /^needs translation$/i,
];

export type IssueType = "missing" | "fallback_english" | "mixed_language" | "placeholder" | "duplicate_source" | "unresolved_key";

export type FieldCategory = "metadata" | "headings" | "primary_body" | "supporting" | "ui_chrome" | "forms" | "structured_data";

const CATEGORY_WEIGHTS: Record<FieldCategory, number> = {
  metadata: 0.10,
  headings: 0.10,
  primary_body: 0.40,
  supporting: 0.20,
  ui_chrome: 0.10,
  forms: 0.05,
  structured_data: 0.05,
};

const UI_KEY_CATEGORIES: Record<string, FieldCategory> = {
  "nav.": "ui_chrome",
  "common.": "ui_chrome",
  "home.hero.": "headings",
  "home.cta.": "headings",
  "seo.": "metadata",
  "meta.": "metadata",
  "form.": "forms",
  "input.": "forms",
  "button.": "forms",
  "faq.": "structured_data",
  "schema.": "structured_data",
};

function categorizeUiKey(key: string): FieldCategory {
  for (const [prefix, category] of Object.entries(UI_KEY_CATEGORIES)) {
    if (key.startsWith(prefix)) return category;
  }
  if (key.includes("title") || key.includes("heading")) return "headings";
  if (key.includes("desc") || key.includes("content") || key.includes("body")) return "primary_body";
  return "supporting";
}

function isAllowlisted(value: string): boolean {
  const lower = value.toLowerCase().trim();
  if (BRAND_ALLOWLIST.has(lower)) return true;
  if (/^\d+(\.\d+)?$/.test(lower)) return true;
  if (/^[A-Z]{2,6}$/.test(value.trim())) return true;
  return false;
}

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some(p => p.test(value.trim()));
}

function detectMixedLanguage(source: string, translated: string): boolean {
  if (!source || !translated) return false;
  const sourceWords = source.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const translatedWords = translated.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  if (translatedWords.length < 5) return false;
  let englishWordCount = 0;
  for (const tw of translatedWords) {
    if (sourceWords.includes(tw) && !isAllowlisted(tw)) {
      englishWordCount++;
    }
  }
  const ratio = englishWordCount / translatedWords.length;
  return ratio > 0.3 && ratio < 0.9;
}

export interface AuditResult {
  contentId: string;
  contentType: string;
  url: string | null;
  locale: string;
  translationPct: number;
  status: string;
  issueCount: number;
  issueBreakdown: Record<string, number>;
  sitemapEligible: boolean;
  noindex: boolean;
  issues: {
    fieldName: string;
    sourceValue: string | null;
    localizedValue: string | null;
    issueType: IssueType;
    category: FieldCategory;
  }[];
}

function computeWeightedScore(issues: { category: FieldCategory; issueType: IssueType }[], totalFieldsByCategory: Record<FieldCategory, number>): number {
  const categoryScores: Record<FieldCategory, number> = {
    metadata: 1, headings: 1, primary_body: 1, supporting: 1, ui_chrome: 1, forms: 1, structured_data: 1,
  };

  const issueCounts: Record<FieldCategory, number> = {
    metadata: 0, headings: 0, primary_body: 0, supporting: 0, ui_chrome: 0, forms: 0, structured_data: 0,
  };

  for (const issue of issues) {
    issueCounts[issue.category] = (issueCounts[issue.category] || 0) + 1;
  }

  for (const cat of Object.keys(categoryScores) as FieldCategory[]) {
    const total = totalFieldsByCategory[cat] || 0;
    const issueCount = issueCounts[cat] || 0;
    if (total > 0) {
      categoryScores[cat] = Math.max(0, 1 - (issueCount / total));
    }
  }

  let weightedTotal = 0;
  let weightSum = 0;
  for (const [cat, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const total = totalFieldsByCategory[cat as FieldCategory] || 0;
    if (total > 0) {
      weightedTotal += categoryScores[cat as FieldCategory] * weight;
      weightSum += weight;
    }
  }

  return weightSum > 0 ? Math.round((weightedTotal / weightSum) * 100) : 0;
}

function getStatus(pct: number, threshold: number): string {
  if (pct >= 100) return "fully_translated";
  if (pct >= threshold) return "ready_for_indexing";
  if (pct >= 50) return "partial";
  return "draft";
}

async function scanUiTranslationKeys(indexingThreshold: number): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  let enKeys: Record<string, string> = {};
  let nonEnTranslations: Record<string, Record<string, string>> = {};

  try {
    const enPath = path.resolve(process.cwd(), "tools/i18n/source/i18n-en.ts");
    if (fs.existsSync(enPath)) {
      const content = fs.readFileSync(enPath, "utf-8");
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const cleaned = match[0]
          .replace(/\/\/.*/g, "")
          .replace(/,(\s*[}\]])/g, "$1");
        try {
          enKeys = new Function(`return ${cleaned}`)();
        } catch {
          const keyValuePairs = content.matchAll(/"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"/g);
          for (const m of keyValuePairs) {
            enKeys[m[1]] = m[2];
          }
        }
      }
    }
  } catch (e) {
    console.error("[TranslationAudit] Failed to load en keys:", e);
  }

  const LANG_FILE_CODES = ["fr", "tl", "hi", "es", "zh", "ar", "ko", "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr"];
  const LANG_TO_LOCALE: Record<string, string> = { tl: "fil" };

  for (const langCode of LANG_FILE_CODES) {
    try {
      const langPath = path.resolve(process.cwd(), `tools/i18n/source/i18n-${langCode}.ts`);
      if (fs.existsSync(langPath)) {
        const content = fs.readFileSync(langPath, "utf-8");
        const sectionKeys: Record<string, string> = {};
        const sectionPairs = [...content.matchAll(/"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"/g)];
        for (const m of sectionPairs) {
          sectionKeys[m[1]] = m[2];
        }
        const locale = LANG_TO_LOCALE[langCode] || langCode;
        nonEnTranslations[locale] = sectionKeys;
      }
    } catch (e) {
      console.error(`[TranslationAudit] Failed to load ${langCode} translations:`, e);
    }
  }

  const enKeyList = Object.keys(enKeys);
  if (enKeyList.length === 0) return results;

  for (const locale of SUPPORTED_LOCALES) {
    const langKeys = nonEnTranslations[locale] || {};
    const issues: AuditResult["issues"] = [];
    const totalFieldsByCategory: Record<FieldCategory, number> = {
      metadata: 0, headings: 0, primary_body: 0, supporting: 0, ui_chrome: 0, forms: 0, structured_data: 0,
    };

    for (const key of enKeyList) {
      const category = categorizeUiKey(key);
      totalFieldsByCategory[category]++;

      const enValue = enKeys[key];
      const locValue = langKeys[key];

      if (!locValue || locValue.trim() === "") {
        issues.push({ fieldName: key, sourceValue: enValue, localizedValue: null, issueType: "missing", category });
      } else if (isPlaceholder(locValue)) {
        issues.push({ fieldName: key, sourceValue: enValue, localizedValue: locValue, issueType: "placeholder", category });
      } else if (locValue === enValue && !isAllowlisted(enValue)) {
        issues.push({ fieldName: key, sourceValue: enValue, localizedValue: locValue, issueType: "fallback_english", category });
      } else if (detectMixedLanguage(enValue, locValue)) {
        issues.push({ fieldName: key, sourceValue: enValue, localizedValue: locValue, issueType: "mixed_language", category });
      }
    }

    const translationPct = computeWeightedScore(issues, totalFieldsByCategory);
    const status = getStatus(translationPct, indexingThreshold);

    const issueBreakdown: Record<string, number> = {};
    for (const issue of issues) {
      issueBreakdown[issue.issueType] = (issueBreakdown[issue.issueType] || 0) + 1;
    }

    results.push({
      contentId: `ui_strings_${locale}`,
      contentType: "ui_strings",
      url: null,
      locale,
      translationPct,
      status,
      issueCount: issues.length,
      issueBreakdown,
      sitemapEligible: translationPct >= indexingThreshold,
      noindex: translationPct < indexingThreshold,
      issues,
    });
  }

  return results;
}

async function scanDatabaseContent(indexingThreshold: number): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  try {
    const contentItems = await pool.query(
      `SELECT id, title, slug, type, seo_title, seo_description, summary, content FROM content_items WHERE status = 'published' LIMIT 500`
    );

    for (const item of contentItems.rows) {
      for (const locale of SUPPORTED_LOCALES) {
        const issues: AuditResult["issues"] = [];
        const totalFieldsByCategory: Record<FieldCategory, number> = {
          metadata: 0, headings: 0, primary_body: 0, supporting: 0, ui_chrome: 0, forms: 0, structured_data: 0,
        };

        const transResult = await pool.query(
          `SELECT field_name, translated_text FROM content_translations WHERE content_id = $1 AND language_code = $2`,
          [item.id, locale]
        ).catch(() => ({ rows: [] }));

        const translatedFields = new Map<string, string>();
        for (const row of transResult.rows) {
          translatedFields.set(row.field_name, row.translated_text);
        }

        const fieldsToCheck: { name: string; value: string | null; category: FieldCategory }[] = [
          { name: "title", value: item.title, category: "headings" },
          { name: "seo_title", value: item.seo_title, category: "metadata" },
          { name: "seo_description", value: item.seo_description, category: "metadata" },
          { name: "summary", value: item.summary, category: "supporting" },
          { name: "content", value: item.content ? JSON.stringify(item.content).substring(0, 200) : null, category: "primary_body" },
        ];

        for (const field of fieldsToCheck) {
          if (!field.value) continue;
          totalFieldsByCategory[field.category]++;

          const translated = translatedFields.get(field.name);
          if (!translated || translated.trim() === "") {
            issues.push({ fieldName: field.name, sourceValue: field.value.substring(0, 100), localizedValue: null, issueType: "missing", category: field.category });
          } else if (isPlaceholder(translated)) {
            issues.push({ fieldName: field.name, sourceValue: field.value.substring(0, 100), localizedValue: translated, issueType: "placeholder", category: field.category });
          }
        }

        const translationPct = computeWeightedScore(issues, totalFieldsByCategory);
        const status = getStatus(translationPct, indexingThreshold);

        const issueBreakdown: Record<string, number> = {};
        for (const issue of issues) {
          issueBreakdown[issue.issueType] = (issueBreakdown[issue.issueType] || 0) + 1;
        }

        results.push({
          contentId: item.id,
          contentType: `content_${item.type || "lesson"}`,
          url: `/${locale}/${item.slug}`,
          locale,
          translationPct,
          status,
          issueCount: issues.length,
          issueBreakdown,
          sitemapEligible: translationPct >= indexingThreshold,
          noindex: translationPct < indexingThreshold,
          issues,
        });
      }
    }
  } catch (e) {
    console.error("[TranslationAudit] DB content scan error:", e);
  }

  try {
    const examQuestions = await pool.query(
      `SELECT id, stem, tier FROM exam_questions WHERE status = 'published' LIMIT 200`
    );

    for (const q of examQuestions.rows) {
      for (const locale of SUPPORTED_LOCALES) {
        const transResult = await pool.query(
          `SELECT field_name, translated_text FROM content_translations WHERE content_id = $1 AND language_code = $2`,
          [q.id, locale]
        ).catch(() => ({ rows: [] }));

        const translatedFields = new Map<string, string>();
        for (const row of transResult.rows) {
          translatedFields.set(row.field_name, row.translated_text);
        }

        const issues: AuditResult["issues"] = [];
        const totalFieldsByCategory: Record<FieldCategory, number> = {
          metadata: 0, headings: 0, primary_body: 1, supporting: 0, ui_chrome: 0, forms: 0, structured_data: 0,
        };

        if (!translatedFields.has("stem") || !translatedFields.get("stem")?.trim()) {
          issues.push({ fieldName: "stem", sourceValue: q.stem?.substring(0, 100), localizedValue: null, issueType: "missing", category: "primary_body" });
        }

        const translationPct = computeWeightedScore(issues, totalFieldsByCategory);
        const status = getStatus(translationPct, indexingThreshold);

        const issueBreakdown: Record<string, number> = {};
        for (const issue of issues) {
          issueBreakdown[issue.issueType] = (issueBreakdown[issue.issueType] || 0) + 1;
        }

        results.push({
          contentId: q.id,
          contentType: "exam_question",
          url: null,
          locale,
          translationPct,
          status,
          issueCount: issues.length,
          issueBreakdown,
          sitemapEligible: translationPct >= indexingThreshold,
          noindex: translationPct < indexingThreshold,
          issues,
        });
      }
    }
  } catch (e) {
    console.error("[TranslationAudit] Exam questions scan error:", e);
  }

  try {
    const jsonDir = path.resolve(process.cwd(), "client/src/data/translations");
    if (fs.existsSync(jsonDir)) {
      const files = fs.readdirSync(jsonDir).filter(f => f.endsWith(".json"));
      const lessonIds = new Set<string>();

      for (const file of files) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(jsonDir, file), "utf-8"));
          for (const lessonId of Object.keys(content)) {
            lessonIds.add(lessonId);
          }
        } catch {}
      }

      for (const lessonId of lessonIds) {
        for (const locale of SUPPORTED_LOCALES) {
          const langCode = locale === "fil" ? "tl" : locale;
          const filePath = path.join(jsonDir, `${langCode}.json`);
          let translated: Record<string, any> | null = null;

          try {
            if (fs.existsSync(filePath)) {
              const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
              translated = data[lessonId] || null;
            }
          } catch {}

          const issues: AuditResult["issues"] = [];
          const totalFieldsByCategory: Record<FieldCategory, number> = {
            metadata: 0, headings: 1, primary_body: 1, supporting: 1, ui_chrome: 0, forms: 0, structured_data: 1,
          };

          const fields = ["title", "overview", "quiz"];
          const categoryMap: Record<string, FieldCategory> = {
            title: "headings", overview: "primary_body", quiz: "structured_data",
          };

          for (const field of fields) {
            const cat = categoryMap[field] || "supporting";
            if (!translated || !translated[field]) {
              issues.push({ fieldName: field, sourceValue: null, localizedValue: null, issueType: "missing", category: cat });
            }
          }

          const translationPct = computeWeightedScore(issues, totalFieldsByCategory);
          const status = getStatus(translationPct, indexingThreshold);

          const issueBreakdown: Record<string, number> = {};
          for (const issue of issues) {
            issueBreakdown[issue.issueType] = (issueBreakdown[issue.issueType] || 0) + 1;
          }

          results.push({
            contentId: lessonId,
            contentType: "lesson_json",
            url: `/${locale}/lessons/${lessonId}`,
            locale,
            translationPct,
            status,
            issueCount: issues.length,
            issueBreakdown,
            sitemapEligible: translationPct >= indexingThreshold,
            noindex: translationPct < indexingThreshold,
            issues,
          });
        }
      }
    }
  } catch (e) {
    console.error("[TranslationAudit] JSON lesson scan error:", e);
  }

  return results;
}

export async function runFullTranslationAudit(indexingThreshold: number = 95): Promise<{
  totalAudits: number;
  scanDurationMs: number;
  summary: {
    byLocale: Record<string, { total: number; fullyTranslated: number; readyForIndexing: number; partial: number; draft: number; avgPct: number }>;
    byContentType: Record<string, { total: number; avgPct: number; issueCount: number }>;
    totalIssues: number;
  };
}> {
  const startTime = Date.now();

  const [uiResults, dbResults] = await Promise.all([
    scanUiTranslationKeys(indexingThreshold),
    scanDatabaseContent(indexingThreshold),
  ]);

  const allResults = [...uiResults, ...dbResults];

  await pool.query(`DELETE FROM translation_audit_issues WHERE audit_id IN (SELECT id FROM translation_audits)`).catch(() => {});
  await pool.query(`DELETE FROM translation_audits`).catch(() => {});

  for (const result of allResults) {
    const auditRes = await pool.query(
      `INSERT INTO translation_audits (id, content_id, content_type, url, locale, translation_pct, status, issue_count, issue_breakdown, sitemap_eligible, noindex, last_scanned_at, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), NOW())
       RETURNING id`,
      [result.contentId, result.contentType, result.url, result.locale, result.translationPct, result.status, result.issueCount, JSON.stringify(result.issueBreakdown), result.sitemapEligible, result.noindex]
    );

    const auditId = auditRes.rows[0]?.id;
    if (auditId && result.issues.length > 0) {
      const issueValues: any[] = [];
      const placeholders: string[] = [];
      let paramIdx = 1;

      for (const issue of result.issues.slice(0, 50)) {
        placeholders.push(`(gen_random_uuid(), $${paramIdx}, $${paramIdx+1}, $${paramIdx+2}, $${paramIdx+3}, $${paramIdx+4}, $${paramIdx+5}, 'open', NOW())`);
        issueValues.push(auditId, issue.fieldName, issue.sourceValue?.substring(0, 500) || null, issue.localizedValue?.substring(0, 500) || null, issue.issueType, issue.category);
        paramIdx += 6;
      }

      if (placeholders.length > 0) {
        await pool.query(
          `INSERT INTO translation_audit_issues (id, audit_id, field_name, source_value, localized_value, issue_type, category, status, created_at)
           VALUES ${placeholders.join(", ")}`,
          issueValues
        ).catch(e => console.error("[TranslationAudit] Insert issues error:", e));
      }
    }
  }

  const byLocale: Record<string, { total: number; fullyTranslated: number; readyForIndexing: number; partial: number; draft: number; avgPct: number }> = {};
  const byContentType: Record<string, { total: number; avgPct: number; issueCount: number }> = {};
  let totalIssues = 0;

  for (const r of allResults) {
    if (!byLocale[r.locale]) {
      byLocale[r.locale] = { total: 0, fullyTranslated: 0, readyForIndexing: 0, partial: 0, draft: 0, avgPct: 0 };
    }
    byLocale[r.locale].total++;
    byLocale[r.locale].avgPct += r.translationPct;
    if (r.status === "fully_translated") byLocale[r.locale].fullyTranslated++;
    else if (r.status === "ready_for_indexing") byLocale[r.locale].readyForIndexing++;
    else if (r.status === "partial") byLocale[r.locale].partial++;
    else byLocale[r.locale].draft++;

    if (!byContentType[r.contentType]) {
      byContentType[r.contentType] = { total: 0, avgPct: 0, issueCount: 0 };
    }
    byContentType[r.contentType].total++;
    byContentType[r.contentType].avgPct += r.translationPct;
    byContentType[r.contentType].issueCount += r.issueCount;
    totalIssues += r.issueCount;
  }

  for (const locale of Object.keys(byLocale)) {
    if (byLocale[locale].total > 0) {
      byLocale[locale].avgPct = Math.round(byLocale[locale].avgPct / byLocale[locale].total);
    }
  }
  for (const ct of Object.keys(byContentType)) {
    if (byContentType[ct].total > 0) {
      byContentType[ct].avgPct = Math.round(byContentType[ct].avgPct / byContentType[ct].total);
    }
  }

  return {
    totalAudits: allResults.length,
    scanDurationMs: Date.now() - startTime,
    summary: { byLocale, byContentType, totalIssues },
  };
}

export async function getAuditDashboardData(filters: {
  locale?: string;
  contentType?: string;
  status?: string;
  sitemapEligible?: boolean;
  noindex?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ audits: any[]; total: number; summary: any }> {
  let whereClause = "WHERE 1=1";
  const params: any[] = [];

  if (filters.locale) {
    params.push(filters.locale);
    whereClause += ` AND locale = $${params.length}`;
  }
  if (filters.contentType) {
    params.push(filters.contentType);
    whereClause += ` AND content_type = $${params.length}`;
  }
  if (filters.status) {
    params.push(filters.status);
    whereClause += ` AND status = $${params.length}`;
  }
  if (filters.sitemapEligible !== undefined) {
    params.push(filters.sitemapEligible);
    whereClause += ` AND sitemap_eligible = $${params.length}`;
  }
  if (filters.noindex !== undefined) {
    params.push(filters.noindex);
    whereClause += ` AND noindex = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    whereClause += ` AND (content_id ILIKE $${params.length} OR url ILIKE $${params.length} OR content_type ILIKE $${params.length})`;
  }

  const countResult = await pool.query(`SELECT COUNT(*)::int as total FROM translation_audits ${whereClause}`, params);
  const total = countResult.rows[0]?.total || 0;

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;
  params.push(limit, offset);

  const auditsResult = await pool.query(
    `SELECT * FROM translation_audits ${whereClause} ORDER BY translation_pct ASC, issue_count DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const summaryResult = await pool.query(`
    SELECT
      COUNT(*)::int as total_audits,
      COUNT(DISTINCT locale) as total_locales,
      COUNT(DISTINCT content_type) as total_content_types,
      SUM(issue_count)::int as total_issues,
      AVG(translation_pct)::int as avg_pct,
      COUNT(CASE WHEN status = 'fully_translated' THEN 1 END)::int as fully_translated,
      COUNT(CASE WHEN status = 'ready_for_indexing' THEN 1 END)::int as ready_for_indexing,
      COUNT(CASE WHEN status = 'partial' THEN 1 END)::int as partial,
      COUNT(CASE WHEN status = 'draft' THEN 1 END)::int as draft_count,
      COUNT(CASE WHEN sitemap_eligible = true THEN 1 END)::int as sitemap_eligible,
      COUNT(CASE WHEN noindex = true THEN 1 END)::int as noindex_count
    FROM translation_audits
  `);

  const localeSummary = await pool.query(`
    SELECT locale,
      COUNT(*)::int as total,
      AVG(translation_pct)::int as avg_pct,
      SUM(issue_count)::int as issue_count,
      COUNT(CASE WHEN status = 'fully_translated' THEN 1 END)::int as fully_translated,
      COUNT(CASE WHEN status = 'ready_for_indexing' THEN 1 END)::int as ready_for_indexing,
      COUNT(CASE WHEN status = 'partial' THEN 1 END)::int as partial,
      COUNT(CASE WHEN status = 'draft' THEN 1 END)::int as draft_count
    FROM translation_audits GROUP BY locale ORDER BY avg_pct ASC
  `);

  const contentTypeSummary = await pool.query(`
    SELECT content_type,
      COUNT(*)::int as total,
      AVG(translation_pct)::int as avg_pct,
      SUM(issue_count)::int as issue_count
    FROM translation_audits GROUP BY content_type ORDER BY avg_pct ASC
  `);

  function snakeToCamel(obj: any): any {
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    if (obj === null || typeof obj !== "object") return obj;
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      result[camelKey] = value;
    }
    return result;
  }

  return {
    audits: auditsResult.rows.map(snakeToCamel),
    total,
    summary: {
      ...snakeToCamel(summaryResult.rows[0] || {}),
      byLocale: localeSummary.rows.map(snakeToCamel),
      byContentType: contentTypeSummary.rows.map(snakeToCamel),
    },
  };
}

export async function getAuditDetail(auditId: string): Promise<any> {
  const audit = await pool.query(`SELECT * FROM translation_audits WHERE id = $1`, [auditId]);
  if (!audit.rows[0]) return null;

  const issues = await pool.query(
    `SELECT * FROM translation_audit_issues WHERE audit_id = $1 ORDER BY category, field_name`,
    [auditId]
  );

  function snakeToCamel(obj: any): any {
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    if (obj === null || typeof obj !== "object") return obj;
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      result[camelKey] = value;
    }
    return result;
  }

  return {
    ...snakeToCamel(audit.rows[0]),
    issues: issues.rows.map(snakeToCamel),
  };
}

export async function updateAuditOverride(auditId: string, updates: { sitemapEligible?: boolean; noindex?: boolean; adminOverride?: boolean; status?: string }): Promise<any> {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.sitemapEligible !== undefined) {
    params.push(updates.sitemapEligible);
    sets.push(`sitemap_eligible = $${params.length}`);
  }
  if (updates.noindex !== undefined) {
    params.push(updates.noindex);
    sets.push(`noindex = $${params.length}`);
  }
  if (updates.adminOverride !== undefined) {
    params.push(updates.adminOverride);
    sets.push(`admin_override = $${params.length}`);
  }
  if (updates.status !== undefined) {
    params.push(updates.status);
    sets.push(`status = $${params.length}`);
  }

  sets.push("updated_at = NOW()");
  params.push(auditId);

  const result = await pool.query(
    `UPDATE translation_audits SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0];
}

export async function bulkUpdateAudits(ids: string[], action: string): Promise<number> {
  if (ids.length === 0) return 0;

  let sql = "";
  switch (action) {
    case "mark_draft":
      sql = `UPDATE translation_audits SET status = 'draft', updated_at = NOW() WHERE id = ANY($1)`;
      break;
    case "mark_ready":
      sql = `UPDATE translation_audits SET status = 'ready_for_indexing', updated_at = NOW() WHERE id = ANY($1)`;
      break;
    case "remove_sitemap":
      sql = `UPDATE translation_audits SET sitemap_eligible = false, updated_at = NOW() WHERE id = ANY($1)`;
      break;
    case "apply_noindex":
      sql = `UPDATE translation_audits SET noindex = true, updated_at = NOW() WHERE id = ANY($1)`;
      break;
    default:
      return 0;
  }

  const result = await pool.query(sql, [ids]);
  return result.rowCount || 0;
}

export async function getStaleTranslations(filters: {
  locale?: string;
  contentType?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: any[]; total: number }> {
  const { simpleHash } = await import("./translation-helpers");

  let whereClause = "WHERE ct.source_hash IS NOT NULL";
  const params: any[] = [];

  if (filters.locale) {
    params.push(filters.locale);
    whereClause += ` AND ct.language_code = $${params.length}`;
  }
  if (filters.contentType) {
    params.push(filters.contentType);
    whereClause += ` AND ct.content_type = $${params.length}`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int as total FROM content_translations ct ${whereClause}`,
    params
  );

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;
  params.push(limit, offset);

  const result = await pool.query(
    `SELECT ct.id, ct.content_type, ct.content_id, ct.language_code, ct.field_name,
            ct.translated_text, ct.source_hash, ct.translation_status, ct.last_updated
     FROM content_translations ct
     ${whereClause}
     ORDER BY ct.last_updated ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const staleItems: any[] = [];

  const ALLOWED_CONTENT_FIELDS = new Set(["title", "seo_title", "seo_description", "summary", "content"]);
  const ALLOWED_EXAM_FIELDS = new Set(["stem"]);

  for (const row of result.rows) {
    let currentSource: string | null = null;

    if (row.content_type === "content_item" || row.content_type?.startsWith("content_")) {
      if (ALLOWED_CONTENT_FIELDS.has(row.field_name)) {
        const sourceResult = await pool.query(
          `SELECT title, seo_title, seo_description, summary, content FROM content_items WHERE id = $1`,
          [row.content_id]
        ).catch(() => ({ rows: [] }));
        if (sourceResult.rows[0]) {
          const rawValue = sourceResult.rows[0][row.field_name];
          currentSource = rawValue != null
            ? (typeof rawValue === "object" ? JSON.stringify(rawValue).substring(0, 500) : String(rawValue))
            : "";
        }
      }
    } else if (row.content_type === "exam_question") {
      if (ALLOWED_EXAM_FIELDS.has(row.field_name)) {
        const sourceResult = await pool.query(
          `SELECT stem FROM exam_questions WHERE id = $1`,
          [row.content_id]
        ).catch(() => ({ rows: [] }));
        if (sourceResult.rows[0]) {
          currentSource = String(sourceResult.rows[0][row.field_name] || "");
        }
      }
    }

    if (currentSource !== null && row.source_hash) {
      const currentHash = simpleHash(currentSource);
      if (currentHash !== row.source_hash) {
        staleItems.push({
          id: row.id,
          contentType: row.content_type,
          contentId: row.content_id,
          languageCode: row.language_code,
          fieldName: row.field_name,
          translatedText: row.translated_text,
          sourceHash: row.source_hash,
          currentSourceHash: currentHash,
          currentSource: currentSource.substring(0, 200),
          translationStatus: row.translation_status,
          lastUpdated: row.last_updated,
        });
      }
    }
  }

  return { items: staleItems, total: staleItems.length };
}

export async function getFlaggedContent(filters: {
  locale?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: any[]; total: number }> {
  let whereClause = "WHERE i.issue_type = 'mixed_language'";
  const params: any[] = [];

  if (filters.locale) {
    params.push(filters.locale);
    whereClause += ` AND a.locale = $${params.length}`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int as total
     FROM translation_audit_issues i
     JOIN translation_audits a ON a.id = i.audit_id
     ${whereClause}`,
    params
  );

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;
  params.push(limit, offset);

  const result = await pool.query(
    `SELECT i.id, i.field_name, i.source_value, i.localized_value, i.issue_type, i.category,
            a.content_id, a.content_type, a.locale, a.url, a.translation_pct
     FROM translation_audit_issues i
     JOIN translation_audits a ON a.id = i.audit_id
     ${whereClause}
     ORDER BY a.locale, a.content_type
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    items: result.rows.map(r => ({
      id: r.id,
      fieldName: r.field_name,
      sourceValue: r.source_value,
      localizedValue: r.localized_value,
      issueType: r.issue_type,
      category: r.category,
      contentId: r.content_id,
      contentType: r.content_type,
      locale: r.locale,
      url: r.url,
      translationPct: r.translation_pct,
    })),
    total: countResult.rows[0]?.total || 0,
  };
}

export async function quickEditTranslation(data: {
  contentType: string;
  contentId: string;
  fieldName: string;
  languageCode: string;
  translatedText: string;
}): Promise<any> {
  const { simpleHash } = await import("./translation-helpers");

  const SAFE_CONTENT_FIELDS = new Set(["title", "seo_title", "seo_description", "summary", "content"]);
  const SAFE_EXAM_FIELDS = new Set(["stem"]);

  let sourceText: string | null = null;
  if (data.contentType === "content_item" || data.contentType?.startsWith("content_")) {
    if (SAFE_CONTENT_FIELDS.has(data.fieldName)) {
      const sourceResult = await pool.query(
        `SELECT title, seo_title, seo_description, summary, content FROM content_items WHERE id = $1`,
        [data.contentId]
      ).catch(() => ({ rows: [] }));
      if (sourceResult.rows[0]) {
        const rawValue = sourceResult.rows[0][data.fieldName];
        sourceText = rawValue != null
          ? (typeof rawValue === "object" ? JSON.stringify(rawValue).substring(0, 500) : String(rawValue))
          : null;
      }
    }
  } else if (data.contentType === "exam_question") {
    if (SAFE_EXAM_FIELDS.has(data.fieldName)) {
      const sourceResult = await pool.query(
        `SELECT stem FROM exam_questions WHERE id = $1`,
        [data.contentId]
      ).catch(() => ({ rows: [] }));
      if (sourceResult.rows[0]) {
        sourceText = sourceResult.rows[0][data.fieldName] || null;
      }
    }
  }

  const sourceHash = sourceText ? simpleHash(sourceText) : null;

  const result = await pool.query(
    `INSERT INTO content_translations (id, content_type, content_id, language_code, field_name, translated_text, translation_status, source_hash, last_updated)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'manual', $6, NOW())
     ON CONFLICT ON CONSTRAINT content_translations_unique_idx
     DO UPDATE SET translated_text = $5, translation_status = 'manual', source_hash = $6, last_updated = NOW()
     RETURNING *`,
    [data.contentType, data.contentId, data.languageCode, data.fieldName, data.translatedText, sourceHash]
  );

  return result.rows[0];
}

export async function exportAuditData(format: "csv" | "json", filters: { locale?: string; contentType?: string; status?: string }): Promise<string> {
  let whereClause = "WHERE 1=1";
  const params: any[] = [];

  if (filters.locale) {
    params.push(filters.locale);
    whereClause += ` AND a.locale = $${params.length}`;
  }
  if (filters.contentType) {
    params.push(filters.contentType);
    whereClause += ` AND a.content_type = $${params.length}`;
  }
  if (filters.status) {
    params.push(filters.status);
    whereClause += ` AND a.status = $${params.length}`;
  }

  const result = await pool.query(
    `SELECT a.*, array_agg(json_build_object('fieldName', i.field_name, 'issueType', i.issue_type, 'sourceValue', i.source_value, 'localizedValue', i.localized_value)) as issues_detail
     FROM translation_audits a
     LEFT JOIN translation_audit_issues i ON i.audit_id = a.id
     ${whereClause}
     GROUP BY a.id
     ORDER BY a.locale, a.content_type`,
    params
  );

  if (format === "json") {
    return JSON.stringify(result.rows, null, 2);
  }

  const headers = ["content_id", "content_type", "url", "locale", "translation_pct", "status", "issue_count", "sitemap_eligible", "noindex", "last_scanned_at"];
  const rows = result.rows.map(r =>
    [r.content_id, r.content_type, r.url || "", r.locale, r.translation_pct, r.status, r.issue_count, r.sitemap_eligible, r.noindex, r.last_scanned_at]
      .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
