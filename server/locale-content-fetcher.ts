import { pool } from "./storage";
import { BoundedMap } from "./bounded-map";

const APPROVED_STATUSES = ["approved"];
const APPROVED_OR_REVIEWED_STATUSES = ["approved", "reviewed"];

interface LocaleConfig {
  strictMode: boolean;
  allowReviewed: boolean;
  allowEnglishFallback: boolean;
  enabled: boolean;
}

const CACHE_TTL_MS = 60_000;
const localeConfigCache = new BoundedMap<string, { config: LocaleConfig; expiresAt: number }>(50, CACHE_TTL_MS);

export async function getLocaleConfig(locale: string): Promise<LocaleConfig> {
  const cached = localeConfigCache.get(locale);
  if (cached && Date.now() < cached.expiresAt) return cached.config;

  const defaultConfig: LocaleConfig = {
    strictMode: true,
    allowReviewed: false,
    allowEnglishFallback: false,
    enabled: true,
  };

  if (locale === "en") {
    const enConfig = { ...defaultConfig, strictMode: false, allowEnglishFallback: true };
    localeConfigCache.set(locale, { config: enConfig, expiresAt: Date.now() + CACHE_TTL_MS });
    return enConfig;
  }

  try {
    const result = await pool.query(
      `SELECT strict_mode, allow_reviewed, allow_english_fallback, enabled FROM locale_settings WHERE locale = $1 LIMIT 1`,
      [locale]
    );
    if (result.rows.length > 0) {
      const row = result.rows[0];
      const config: LocaleConfig = {
        strictMode: row.strict_mode ?? true,
        allowReviewed: row.allow_reviewed ?? false,
        allowEnglishFallback: row.allow_english_fallback ?? false,
        enabled: row.enabled ?? true,
      };
      localeConfigCache.set(locale, { config, expiresAt: Date.now() + CACHE_TTL_MS });
      return config;
    }
  } catch (e) {
    console.error("[LocaleConfig] Error loading locale settings:", e);
  }

  localeConfigCache.set(locale, { config: defaultConfig, expiresAt: Date.now() + CACHE_TTL_MS });
  return defaultConfig;
}

export function clearLocaleConfigCache(): void {
  localeConfigCache.clear();
}

function getAllowedStatuses(config: LocaleConfig): string[] {
  return config.allowReviewed ? APPROVED_OR_REVIEWED_STATUSES : APPROVED_STATUSES;
}

export interface TranslatedExamQuestion {
  id: string;
  stem: string | null;
  options: any;
  rationale: string | null;
  scenario: string | null;
  clinicalPearl: string | null;
  examStrategy: string | null;
  memoryHook: string | null;
  correctAnswerExplanation: string | null;
  incorrectAnswerRationale: any;
  distractorRationales: any;
  clinicalReasoning: string | null;
  keyTakeaway: string | null;
  mnemonic: string | null;
  locale: string;
  translationStatus: string;
}

export async function getExamQuestionTranslation(
  questionId: string,
  locale: string
): Promise<TranslatedExamQuestion | null> {
  if (locale === "en") return null;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 3}`).join(",");

  try {
    const result = await pool.query(
      `SELECT * FROM exam_question_translations
       WHERE exam_question_id = $1 AND locale = $2
       AND translation_status IN (${statusPlaceholders})
       LIMIT 1`,
      [questionId, locale, ...statuses]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      stem: row.stem,
      options: row.options,
      rationale: row.rationale,
      scenario: row.scenario,
      clinicalPearl: row.clinical_pearl,
      examStrategy: row.exam_strategy,
      memoryHook: row.memory_hook,
      correctAnswerExplanation: row.correct_answer_explanation,
      incorrectAnswerRationale: row.incorrect_answer_rationale,
      distractorRationales: row.distractor_rationales,
      clinicalReasoning: row.clinical_reasoning,
      keyTakeaway: row.key_takeaway,
      mnemonic: row.mnemonic,
      locale: row.locale,
      translationStatus: row.translation_status,
    };
  } catch (e) {
    console.error("[LocaleFetcher] getExamQuestionTranslation error:", e);
    return null;
  }
}

export async function getBatchExamQuestionTranslations(
  questionIds: string[],
  locale: string
): Promise<Map<string, TranslatedExamQuestion>> {
  const result = new Map<string, TranslatedExamQuestion>();
  if (locale === "en" || questionIds.length === 0) return result;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);

  try {
    const idPlaceholders = questionIds.map((_, i) => `$${i + 3 + statuses.length - 1}`).join(",");
    const statusPlaceholders = statuses.map((_, i) => `$${i + 3}`).join(",");

    const params = [locale, questionIds.length, ...statuses, ...questionIds];
    const queryResult = await pool.query(
      `SELECT * FROM exam_question_translations
       WHERE locale = $1
       AND translation_status IN (${statusPlaceholders})
       AND exam_question_id = ANY($${3 + statuses.length}::text[])`,
      [locale, ...statuses, questionIds]
    );

    for (const row of queryResult.rows) {
      result.set(row.exam_question_id, {
        id: row.id,
        stem: row.stem,
        options: row.options,
        rationale: row.rationale,
        scenario: row.scenario,
        clinicalPearl: row.clinical_pearl,
        examStrategy: row.exam_strategy,
        memoryHook: row.memory_hook,
        correctAnswerExplanation: row.correct_answer_explanation,
        incorrectAnswerRationale: row.incorrect_answer_rationale,
        distractorRationales: row.distractor_rationales,
        clinicalReasoning: row.clinical_reasoning,
        keyTakeaway: row.key_takeaway,
        mnemonic: row.mnemonic,
        locale: row.locale,
        translationStatus: row.translation_status,
      });
    }
  } catch (e) {
    console.error("[LocaleFetcher] getBatchExamQuestionTranslations error:", e);
  }

  return result;
}

export async function getExamQuestionIdsWithTranslation(
  locale: string,
  additionalConditions?: string,
  additionalParams?: any[]
): Promise<Set<string>> {
  if (locale === "en") return new Set();

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 2}`).join(",");

  try {
    let query = `SELECT exam_question_id FROM exam_question_translations
                 WHERE locale = $1 AND translation_status IN (${statusPlaceholders})`;
    const params: any[] = [locale, ...statuses];

    if (additionalConditions) {
      query += ` ${additionalConditions}`;
      if (additionalParams) params.push(...additionalParams);
    }

    const result = await pool.query(query, params);
    return new Set(result.rows.map((r: any) => r.exam_question_id));
  } catch (e) {
    console.error("[LocaleFetcher] getExamQuestionIdsWithTranslation error:", e);
    return new Set();
  }
}

export interface TranslatedContentItem {
  id: string;
  title: string | null;
  summary: string | null;
  content: any;
  seoTitle: string | null;
  seoDescription: string | null;
  locale: string;
  translationStatus: string;
}

export async function getContentItemTranslation(
  contentItemId: string,
  locale: string
): Promise<TranslatedContentItem | null> {
  if (locale === "en") return null;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 3}`).join(",");

  try {
    const result = await pool.query(
      `SELECT * FROM content_item_translations
       WHERE content_item_id = $1 AND locale = $2
       AND translation_status IN (${statusPlaceholders})
       LIMIT 1`,
      [contentItemId, locale, ...statuses]
    );

    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      locale: row.locale,
      translationStatus: row.translation_status,
    };
  } catch (e) {
    console.error("[LocaleFetcher] getContentItemTranslation error:", e);
    return null;
  }
}

export async function getBatchContentItemTranslations(
  contentItemIds: string[],
  locale: string
): Promise<Map<string, TranslatedContentItem>> {
  const result = new Map<string, TranslatedContentItem>();
  if (locale === "en" || contentItemIds.length === 0) return result;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 2}`).join(",");

  try {
    const queryResult = await pool.query(
      `SELECT * FROM content_item_translations
       WHERE locale = $1
       AND translation_status IN (${statusPlaceholders})
       AND content_item_id = ANY($${2 + statuses.length}::text[])`,
      [locale, ...statuses, contentItemIds]
    );

    for (const row of queryResult.rows) {
      result.set(row.content_item_id, {
        id: row.id,
        title: row.title,
        summary: row.summary,
        content: row.content,
        seoTitle: row.seo_title,
        seoDescription: row.seo_description,
        locale: row.locale,
        translationStatus: row.translation_status,
      });
    }
  } catch (e) {
    console.error("[LocaleFetcher] getBatchContentItemTranslations error:", e);
  }

  return result;
}

export interface TranslatedFlashcard {
  id: string;
  front: string | null;
  back: string | null;
  options: any;
  rationaleCorrect: string | null;
  clinicalTakeaway: string | null;
  examPearl: string | null;
  locale: string;
  translationStatus: string;
}

export async function getFlashcardTranslation(
  flashcardId: string,
  locale: string
): Promise<TranslatedFlashcard | null> {
  if (locale === "en") return null;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 3}`).join(",");

  try {
    const result = await pool.query(
      `SELECT * FROM flashcard_translations
       WHERE flashcard_id = $1 AND locale = $2
       AND translation_status IN (${statusPlaceholders})
       LIMIT 1`,
      [flashcardId, locale, ...statuses]
    );

    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      front: row.front,
      back: row.back,
      options: row.options,
      rationaleCorrect: row.rationale_correct,
      clinicalTakeaway: row.clinical_takeaway,
      examPearl: row.exam_pearl,
      locale: row.locale,
      translationStatus: row.translation_status,
    };
  } catch (e) {
    console.error("[LocaleFetcher] getFlashcardTranslation error:", e);
    return null;
  }
}

export async function getBatchFlashcardTranslations(
  flashcardIds: string[],
  locale: string
): Promise<Map<string, TranslatedFlashcard>> {
  const result = new Map<string, TranslatedFlashcard>();
  if (locale === "en" || flashcardIds.length === 0) return result;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 2}`).join(",");

  try {
    const queryResult = await pool.query(
      `SELECT * FROM flashcard_translations
       WHERE locale = $1
       AND translation_status IN (${statusPlaceholders})
       AND flashcard_id = ANY($${2 + statuses.length}::text[])`,
      [locale, ...statuses, flashcardIds]
    );

    for (const row of queryResult.rows) {
      result.set(row.flashcard_id, {
        id: row.id,
        front: row.front,
        back: row.back,
        options: row.options,
        rationaleCorrect: row.rationale_correct,
        clinicalTakeaway: row.clinical_takeaway,
        examPearl: row.exam_pearl,
        locale: row.locale,
        translationStatus: row.translation_status,
      });
    }
  } catch (e) {
    console.error("[LocaleFetcher] getBatchFlashcardTranslations error:", e);
  }

  return result;
}

export async function getFlashcardIdsWithTranslation(
  locale: string
): Promise<Set<string>> {
  if (locale === "en") return new Set();

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 2}`).join(",");

  try {
    const result = await pool.query(
      `SELECT flashcard_id FROM flashcard_translations
       WHERE locale = $1 AND translation_status IN (${statusPlaceholders})`,
      [locale, ...statuses]
    );
    return new Set(result.rows.map((r: any) => r.flashcard_id));
  } catch (e) {
    console.error("[LocaleFetcher] getFlashcardIdsWithTranslation error:", e);
    return new Set();
  }
}

export interface TranslatedSeoPage {
  id: string;
  title: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  contentHtml: string | null;
  tocJson: any;
  faqJson: any;
  locale: string;
  translationStatus: string;
}

export async function getSeoPageTranslation(
  seoPageId: string,
  locale: string
): Promise<TranslatedSeoPage | null> {
  if (locale === "en") return null;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 3}`).join(",");

  try {
    const result = await pool.query(
      `SELECT * FROM seo_page_translations
       WHERE seo_page_id = $1 AND locale = $2
       AND translation_status IN (${statusPlaceholders})
       LIMIT 1`,
      [seoPageId, locale, ...statuses]
    );

    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      contentHtml: row.content_html,
      tocJson: row.toc_json,
      faqJson: row.faq_json,
      locale: row.locale,
      translationStatus: row.translation_status,
    };
  } catch (e) {
    console.error("[LocaleFetcher] getSeoPageTranslation error:", e);
    return null;
  }
}

export async function getBatchSeoPageTranslations(
  seoPageIds: string[],
  locale: string
): Promise<Map<string, TranslatedSeoPage>> {
  const result = new Map<string, TranslatedSeoPage>();
  if (locale === "en" || seoPageIds.length === 0) return result;

  const config = await getLocaleConfig(locale);
  const statuses = getAllowedStatuses(config);
  const statusPlaceholders = statuses.map((_, i) => `$${i + 2}`).join(",");

  try {
    const queryResult = await pool.query(
      `SELECT * FROM seo_page_translations
       WHERE locale = $1
       AND translation_status IN (${statusPlaceholders})
       AND seo_page_id = ANY($${2 + statuses.length}::text[])`,
      [locale, ...statuses, seoPageIds]
    );

    for (const row of queryResult.rows) {
      result.set(row.seo_page_id, {
        id: row.id,
        title: row.title,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        contentHtml: row.content_html,
        tocJson: row.toc_json,
        faqJson: row.faq_json,
        locale: row.locale,
        translationStatus: row.translation_status,
      });
    }
  } catch (e) {
    console.error("[LocaleFetcher] getBatchSeoPageTranslations error:", e);
  }

  return result;
}

export async function incrementSourceVersionAndMarkStale(
  tableName: "exam_questions" | "content_items" | "flashcard_bank" | "seo_pages",
  recordId: string,
  sourceLocale: string = "en"
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const versionResult = await client.query(
      `UPDATE ${tableName} SET source_version = COALESCE(source_version, 1) + 1, updated_at = NOW()
       WHERE id = $1 RETURNING source_version`,
      [recordId]
    );

    const newVersion = versionResult.rows[0]?.source_version ?? 1;

    const translationTable = getTranslationTableName(tableName);
    const foreignKey = getForeignKeyColumn(tableName);

    await client.query(
      `UPDATE ${translationTable}
       SET translation_status = 'stale', updated_at = NOW()
       WHERE ${foreignKey} = $1 AND locale != $2
       AND translation_status NOT IN ('stale', 'missing')`,
      [recordId, sourceLocale]
    );

    await client.query("COMMIT");
    return newVersion;
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("[LocaleFetcher] incrementSourceVersionAndMarkStale error:", e);
    throw e;
  } finally {
    client.release();
  }
}

export async function createSourceTranslation(
  tableName: "exam_questions" | "content_items" | "flashcard_bank" | "seo_pages",
  recordId: string,
  sourceLocale: string,
  fields: Record<string, any>
): Promise<void> {
  const translationTable = getTranslationTableName(tableName);
  const foreignKey = getForeignKeyColumn(tableName);

  const fieldColumns = Object.keys(fields);
  const fieldValues = Object.values(fields);
  const placeholders = fieldColumns.map((_, i) => `$${i + 4}`).join(", ");
  const columnList = fieldColumns.join(", ");

  try {
    await pool.query(
      `INSERT INTO ${translationTable} (id, ${foreignKey}, locale, ${columnList}, translation_status, source_version, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, ${placeholders}, 'approved', 1, NOW(), NOW())
       ON CONFLICT (${foreignKey}, locale) DO UPDATE SET
         ${fieldColumns.map((col, i) => `${col} = $${i + 4}`).join(", ")},
         translation_status = 'approved',
         updated_at = NOW()`,
      [recordId, sourceLocale, ...fieldValues]
    );
  } catch (e) {
    console.error("[LocaleFetcher] createSourceTranslation error:", e);
  }
}

function getTranslationTableName(baseTable: string): string {
  const map: Record<string, string> = {
    exam_questions: "exam_question_translations",
    content_items: "content_item_translations",
    flashcard_bank: "flashcard_translations",
    seo_pages: "seo_page_translations",
  };
  return map[baseTable] || baseTable + "_translations";
}

function getForeignKeyColumn(baseTable: string): string {
  const map: Record<string, string> = {
    exam_questions: "exam_question_id",
    content_items: "content_item_id",
    flashcard_bank: "flashcard_id",
    seo_pages: "seo_page_id",
  };
  return map[baseTable] || baseTable.replace(/s$/, "") + "_id";
}

export interface TranslationMissingError {
  error: "translation_missing";
  contentType: string;
  contentId: string;
  locale: string;
  message: string;
}

export function translationMissingError(
  contentType: string,
  contentId: string,
  locale: string
): TranslationMissingError {
  return {
    error: "translation_missing",
    contentType,
    contentId,
    locale,
    message: `No approved translation available for ${contentType} '${contentId}' in locale '${locale}'`,
  };
}

export async function shouldFallbackToEnglish(locale: string): Promise<boolean> {
  if (locale === "en") return true;
  const config = await getLocaleConfig(locale);
  return config.allowEnglishFallback;
}
