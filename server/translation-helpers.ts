import type { Request, Response, NextFunction } from "express";
import { pool } from "./storage";

declare global {
  namespace Express {
    interface Request {
      lang?: string;
    }
  }
}

const SUPPORTED_LANGUAGES = [
  "en", "fr", "es", "zh", "zh-tw", "ar", "hi", "pt", "tl", "ko", "ja",
  "de", "vi", "pa", "ur", "fa"
];

export function detectLanguage(req: Request): string {
  const urlLang = req.query.lang as string | undefined;
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang.toLowerCase())) {
    return urlLang.toLowerCase();
  }

  const pathParts = req.path.split("/");
  if (pathParts.length > 1 && SUPPORTED_LANGUAGES.includes(pathParts[1])) {
    return pathParts[1];
  }

  const acceptLang = req.headers["accept-language"];
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => {
        const [lang, q] = part.trim().split(";q=");
        return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of preferred) {
      if (lang === "zh-tw" || lang.startsWith("zh-hant") || lang.startsWith("zh-tw")) {
        return "zh-tw";
      }
      const primary = lang.split("-")[0];
      if (SUPPORTED_LANGUAGES.includes(primary)) {
        return primary;
      }
    }
  }

  return "en";
}

export function languageMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.lang = detectLanguage(req);
  next();
}

export async function getTranslatedField(
  contentType: string,
  contentId: string,
  fieldName: string,
  lang: string
): Promise<string | null> {
  if (lang === "en") return null;

  try {
    const newTableResult = await queryNewTranslationTable(contentType, contentId, fieldName, lang);
    if (newTableResult !== null) return newTableResult;
  } catch (e) {
    console.error("[TranslationHelpers] New table query error, falling back to EAV:", e);
  }

  console.warn(`[TranslationHelpers] DEPRECATED: EAV fallback for ${contentType}/${contentId}/${fieldName}/${lang}`);
  try {
    const result = await pool.query(
      `SELECT translated_text FROM content_translations
       WHERE content_type = $1 AND content_id = $2 AND field_name = $3 AND language_code = $4
       LIMIT 1`,
      [contentType, contentId, fieldName, lang]
    );
    return result.rows[0]?.translated_text || null;
  } catch (e) {
    console.error("getTranslatedField error:", e);
    return null;
  }
}

async function queryNewTranslationTable(
  contentType: string,
  contentId: string,
  fieldName: string,
  lang: string
): Promise<string | null> {
  const tableConfig = NEW_TRANSLATION_TABLE_MAP[contentType];
  if (!tableConfig) return null;

  const columnName = camelToSnake(fieldName);
  const validColumns = tableConfig.columns;
  if (!validColumns.includes(columnName)) return null;

  const { getLocaleConfig } = await import("./locale-content-fetcher");
  const config = await getLocaleConfig(lang);
  const allowedStatuses = config.allowReviewed
    ? ["approved", "reviewed"]
    : ["approved"];
  const statusPlaceholders = allowedStatuses.map((_, i) => `$${i + 3}`).join(",");

  const result = await pool.query(
    `SELECT ${columnName} FROM ${tableConfig.table}
     WHERE ${tableConfig.foreignKey} = $1 AND locale = $2
     AND translation_status IN (${statusPlaceholders})
     LIMIT 1`,
    [contentId, lang, ...allowedStatuses]
  );

  if (result.rows.length === 0) return null;
  const value = result.rows[0][columnName];
  if (value === null || value === undefined) return null;
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

const NEW_TRANSLATION_TABLE_MAP: Record<string, { table: string; foreignKey: string; columns: string[] }> = {
  exam_question: {
    table: "exam_question_translations",
    foreignKey: "exam_question_id",
    columns: ["stem", "options", "rationale", "scenario", "clinical_pearl", "exam_strategy", "memory_hook", "correct_answer_explanation", "incorrect_answer_rationale", "distractor_rationales", "clinical_reasoning", "key_takeaway", "mnemonic"],
  },
  content_item: {
    table: "content_item_translations",
    foreignKey: "content_item_id",
    columns: ["title", "summary", "content", "seo_title", "seo_description"],
  },
  flashcard: {
    table: "flashcard_translations",
    foreignKey: "flashcard_id",
    columns: ["front", "back", "options", "rationale_correct", "clinical_takeaway", "exam_pearl"],
  },
  seo_page: {
    table: "seo_page_translations",
    foreignKey: "seo_page_id",
    columns: ["title", "meta_title", "meta_description", "content_html", "toc_json", "faq_json"],
  },
};

export async function getTranslatedFields(
  contentType: string,
  contentId: string,
  lang: string
): Promise<Record<string, { text: string; status: string; sourceHash: string | null }>> {
  if (lang === "en") return {};

  const tableConfig = NEW_TRANSLATION_TABLE_MAP[contentType];
  if (tableConfig) {
    try {
      const { getLocaleConfig } = await import("./locale-content-fetcher");
      const config = await getLocaleConfig(lang);
      const allowedStatuses = config.allowReviewed
        ? ["approved", "reviewed"]
        : ["approved"];
      const statusPlaceholders = allowedStatuses.map((_, i) => `$${i + 3}`).join(",");

      const result = await pool.query(
        `SELECT * FROM ${tableConfig.table}
         WHERE ${tableConfig.foreignKey} = $1 AND locale = $2
         AND translation_status IN (${statusPlaceholders})
         LIMIT 1`,
        [contentId, lang, ...allowedStatuses]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0];
        const fields: Record<string, { text: string; status: string; sourceHash: string | null }> = {};
        for (const col of tableConfig.columns) {
          const val = row[col];
          if (val !== null && val !== undefined) {
            const text = typeof val === "object" ? JSON.stringify(val) : String(val);
            const camelKey = col.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase());
            fields[camelKey] = {
              text,
              status: row.translation_status || "draft",
              sourceHash: null,
            };
          }
        }
        if (Object.keys(fields).length > 0) return fields;
      }
    } catch (e) {
      console.error("[TranslationHelpers] New table getTranslatedFields error:", e);
    }
  }

  console.warn(`[TranslationHelpers] DEPRECATED: EAV fallback for getTranslatedFields ${contentType}/${contentId}/${lang}`);
  try {
    const result = await pool.query(
      `SELECT field_name, translated_text, translation_status, source_hash
       FROM content_translations
       WHERE content_type = $1 AND content_id = $2 AND language_code = $3`,
      [contentType, contentId, lang]
    );

    const fields: Record<string, { text: string; status: string; sourceHash: string | null }> = {};
    for (const row of result.rows) {
      fields[row.field_name] = {
        text: row.translated_text,
        status: row.translation_status || "auto",
        sourceHash: row.source_hash,
      };
    }
    return fields;
  } catch (e) {
    console.error("getTranslatedFields error:", e);
    return {};
  }
}

export async function getTranslationStatus(
  contentType: string,
  contentId: string,
  lang: string,
  sourceFields: Record<string, string | null | undefined>
): Promise<{ status: "complete" | "partial" | "missing" | "stale"; missing: string[]; stale: string[] }> {
  if (lang === "en") {
    return { status: "complete", missing: [], stale: [] };
  }

  try {
    const result = await pool.query(
      `SELECT field_name, source_hash, translation_status
       FROM content_translations
       WHERE content_type = $1 AND content_id = $2 AND language_code = $3`,
      [contentType, contentId, lang]
    );

    const translatedFields = new Map<string, { sourceHash: string | null; status: string }>();
    for (const row of result.rows) {
      translatedFields.set(row.field_name, {
        sourceHash: row.source_hash,
        status: row.translation_status || "auto",
      });
    }

    const translatableFields = Object.keys(sourceFields).filter((k) => sourceFields[k] != null);
    const missing: string[] = [];
    const stale: string[] = [];

    for (const field of translatableFields) {
      const translation = translatedFields.get(field);
      if (!translation) {
        missing.push(field);
      } else if (translation.sourceHash) {
        const currentHash = simpleHash(String(sourceFields[field] || ""));
        if (translation.sourceHash !== currentHash) {
          stale.push(field);
        }
      }
    }

    if (missing.length === translatableFields.length) {
      return { status: "missing", missing, stale };
    }
    if (stale.length > 0) {
      return { status: "stale", missing, stale };
    }
    if (missing.length > 0) {
      return { status: "partial", missing, stale };
    }
    return { status: "complete", missing, stale };
  } catch (e) {
    console.error("getTranslationStatus error:", e);
    return { status: "missing", missing: [], stale: [] };
  }
}

export function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString(36);
}

export async function getBulkTranslatedTitles(
  contentType: string,
  contentIds: string[],
  lang: string
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (lang === "en" || contentIds.length === 0) return result;

  try {
    const placeholders = contentIds.map((_, i) => `$${i + 3}`).join(",");
    const queryResult = await pool.query(
      `SELECT content_id, translated_text
       FROM content_translations
       WHERE content_type = $1 AND field_name = 'title' AND language_code = $2
       AND content_id IN (${placeholders})`,
      [contentType, lang, ...contentIds]
    );

    for (const row of queryResult.rows) {
      result.set(row.content_id, row.translated_text);
    }
  } catch (e) {
    console.error("getBulkTranslatedTitles error:", e);
  }

  return result;
}

export async function getBulkTranslatedFields(
  contentType: string,
  contentIds: string[],
  lang: string
): Promise<Map<string, Record<string, string>>> {
  const result = new Map<string, Record<string, string>>();
  if (lang === "en" || contentIds.length === 0) return result;

  const tableConfig = NEW_TRANSLATION_TABLE_MAP[contentType];
  if (tableConfig) {
    try {
      const { getLocaleConfig } = await import("./locale-content-fetcher");
      const config = await getLocaleConfig(lang);
      const allowedStatuses = config.allowReviewed
        ? ["approved", "reviewed"]
        : ["approved"];

      const queryResult = await pool.query(
        `SELECT * FROM ${tableConfig.table}
         WHERE locale = $1 AND ${tableConfig.foreignKey} = ANY($2::text[])
         AND translation_status = ANY($3::text[])`,
        [lang, contentIds, allowedStatuses]
      );

      for (const row of queryResult.rows) {
        const id = row[tableConfig.foreignKey];
        const fields: Record<string, string> = {};
        for (const col of tableConfig.columns) {
          const val = row[col];
          if (val !== null && val !== undefined) {
            const camelKey = col.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase());
            fields[camelKey] = typeof val === "object" ? JSON.stringify(val) : String(val);
          }
        }
        if (Object.keys(fields).length > 0) {
          result.set(id, fields);
        }
      }

      if (result.size > 0) return result;
    } catch (e) {
      console.error("[TranslationHelpers] New table getBulkTranslatedFields error:", e);
    }
  }

  console.warn(`[TranslationHelpers] DEPRECATED: EAV fallback for getBulkTranslatedFields ${contentType}/${lang}`);
  try {
    const placeholders = contentIds.map((_, i) => `$${i + 3}`).join(",");
    const queryResult = await pool.query(
      `SELECT content_id, field_name, translated_text
       FROM content_translations
       WHERE content_type = $1 AND language_code = $2
       AND content_id IN (${placeholders})`,
      [contentType, lang, ...contentIds]
    );

    for (const row of queryResult.rows) {
      if (!result.has(row.content_id)) result.set(row.content_id, {});
      result.get(row.content_id)![row.field_name] = row.translated_text;
    }
  } catch (e) {
    console.error("getBulkTranslatedFields error:", e);
  }

  return result;
}

export async function getAvailableLanguages(
  contentType: string,
  contentId: string
): Promise<string[]> {
  const tableConfig = NEW_TRANSLATION_TABLE_MAP[contentType];
  if (tableConfig) {
    try {
      const result = await pool.query(
        `SELECT DISTINCT locale FROM ${tableConfig.table}
         WHERE ${tableConfig.foreignKey} = $1`,
        [contentId]
      );
      const newLocales = result.rows.map((r: any) => r.locale);
      if (newLocales.length > 0) return ["en", ...newLocales];
    } catch (e) {
      console.error("[TranslationHelpers] New table getAvailableLanguages error:", e);
    }
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT language_code FROM content_translations
       WHERE content_type = $1 AND content_id = $2`,
      [contentType, contentId]
    );
    return ["en", ...result.rows.map((r: any) => r.language_code)];
  } catch (e) {
    console.error("getAvailableLanguages error:", e);
    return ["en"];
  }
}

const REQUIRED_FIELDS_BY_CONTENT_TYPE: Record<string, string[]> = {
  content_item: ["title"],
  exam_question: ["stem"],
  flashcard: ["question"],
  blog: ["title"],
};

export async function getBulkTranslationStatuses(
  contentType: string,
  contentIds: string[],
  lang: string
): Promise<Map<string, "translated" | "missing" | "stale">> {
  const result = new Map<string, "translated" | "missing" | "stale">();
  if (lang === "en" || contentIds.length === 0) {
    for (const id of contentIds) result.set(id, "translated");
    return result;
  }

  const requiredFields = REQUIRED_FIELDS_BY_CONTENT_TYPE[contentType] || ["title"];

  try {
    const placeholders = contentIds.map((_, i) => `$${i + 3}`).join(",");
    const queryResult = await pool.query(
      `SELECT content_id, field_name, translation_status
       FROM content_translations
       WHERE content_type = $1 AND language_code = $2
       AND content_id IN (${placeholders})`,
      [contentType, lang, ...contentIds]
    );

    const translationsByContent = new Map<string, Map<string, string>>();
    for (const row of queryResult.rows) {
      if (!translationsByContent.has(row.content_id)) {
        translationsByContent.set(row.content_id, new Map());
      }
      translationsByContent.get(row.content_id)!.set(row.field_name, row.translation_status || "auto");
    }

    for (const id of contentIds) {
      const fields = translationsByContent.get(id);
      if (!fields) {
        result.set(id, "missing");
        continue;
      }

      const hasAllRequired = requiredFields.every(f => fields.has(f));
      if (!hasAllRequired) {
        result.set(id, "missing");
        continue;
      }

      let hasStale = false;
      for (const [, status] of fields) {
        if (status === "outdated" || status === "stale") {
          hasStale = true;
          break;
        }
      }

      result.set(id, hasStale ? "stale" : "translated");
    }
  } catch (e) {
    console.error("getBulkTranslationStatuses error:", e);
    for (const id of contentIds) result.set(id, "missing");
  }

  return result;
}

export async function markTranslationsOutdated(
  contentType: string,
  contentId: string,
  updatedFields: Record<string, string | null | undefined>
): Promise<number> {
  let markedCount = 0;

  const tableConfig = NEW_TRANSLATION_TABLE_MAP[contentType];
  if (tableConfig) {
    try {
      const updateResult = await pool.query(
        `UPDATE ${tableConfig.table}
         SET translation_status = 'stale', updated_at = NOW()
         WHERE ${tableConfig.foreignKey} = $1
         AND translation_status NOT IN ('stale', 'missing')`,
        [contentId]
      );
      markedCount += updateResult.rowCount || 0;
    } catch (e) {
      console.error("[TranslationHelpers] New table markTranslationsOutdated error:", e);
    }
  }

  try {
    const fieldNames = Object.keys(updatedFields).filter(k => updatedFields[k] != null);
    if (fieldNames.length === 0) return markedCount;

    const fieldPlaceholders = fieldNames.map((_, i) => `$${i + 3}`).join(",");
    const updateResult = await pool.query(
      `UPDATE content_translations
       SET translation_status = 'outdated', last_updated = NOW()
       WHERE content_type = $1 AND content_id = $2
       AND field_name IN (${fieldPlaceholders})
       AND translation_status != 'outdated'`,
      [contentType, contentId, ...fieldNames]
    );
    markedCount += updateResult.rowCount || 0;
  } catch (e) {
    console.error("markTranslationsOutdated error:", e);
  }
  return markedCount;
}

export async function checkTranslationCompleteness(
  contentType: string,
  contentId: string,
  requiredFields: string[]
): Promise<{ complete: boolean; languages: Record<string, { status: string; missingFields: string[]; staleFields: string[] }> }> {
  const ACTIVE_LANGUAGES = SUPPORTED_LANGUAGES.filter(l => l !== "en");

  const languages: Record<string, { status: string; missingFields: string[]; staleFields: string[] }> = {};
  let allComplete = true;

  try {
    const result = await pool.query(
      `SELECT language_code, field_name, translation_status
       FROM content_translations
       WHERE content_type = $1 AND content_id = $2`,
      [contentType, contentId]
    );

    const byLang = new Map<string, Map<string, string>>();
    for (const row of result.rows) {
      if (!byLang.has(row.language_code)) byLang.set(row.language_code, new Map());
      byLang.get(row.language_code)!.set(row.field_name, row.translation_status);
    }

    for (const lang of ACTIVE_LANGUAGES) {
      const fields = byLang.get(lang);
      const missingFields: string[] = [];
      const staleFields: string[] = [];

      for (const field of requiredFields) {
        if (!fields || !fields.has(field)) {
          missingFields.push(field);
        } else {
          const status = fields.get(field)!;
          if (status === "outdated" || status === "stale") {
            staleFields.push(field);
          }
        }
      }

      let status = "complete";
      if (missingFields.length === requiredFields.length) {
        status = "missing";
        allComplete = false;
      } else if (missingFields.length > 0) {
        status = "partial";
        allComplete = false;
      } else if (staleFields.length > 0) {
        status = "stale";
        allComplete = false;
      }

      languages[lang] = { status, missingFields, staleFields };
    }
  } catch (e) {
    console.error("checkTranslationCompleteness error:", e);
    allComplete = false;
  }

  return { complete: allComplete, languages };
}
