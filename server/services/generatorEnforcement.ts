import { validateGeneratedPayload, type LanguageValidationResult } from "../i18n/languageValidation";
import { buildLocalizedGeneratorPrompt, type LocalizedPromptOptions } from "./localizedPromptBuilder";
import { routeAIRequest, type AIRequestOptions, type AIRequestResult } from "../ai-provider-router";
import { pool } from "../storage";

const MAX_RETRIES = 2;

export interface EnforcementOptions {
  targetLanguage: string;
  baseSystemPrompt: string;
  baseUserPrompt: string;
  aiOptions: AIRequestOptions;
  fieldsToValidate?: string[];
  preserveMedicalTerms?: boolean;
  contentType?: string;
  queueItemId?: string;
}

export interface EnforcementResult {
  success: boolean;
  content: string;
  aiResult: AIRequestResult;
  validation: LanguageValidationResult;
  attempts: number;
  validationFailed: boolean;
}

export async function generateWithLanguageEnforcement(
  options: EnforcementOptions
): Promise<EnforcementResult> {
  const {
    targetLanguage,
    baseSystemPrompt,
    baseUserPrompt,
    aiOptions,
    fieldsToValidate,
    preserveMedicalTerms = true,
    contentType,
    queueItemId,
  } = options;

  if (targetLanguage === "en") {
    const aiResult = await routeAIRequest(baseSystemPrompt, baseUserPrompt, aiOptions);
    return {
      success: true,
      content: aiResult.content,
      aiResult,
      validation: {
        isValid: true,
        detectedLanguage: "en",
        requestedLanguage: "en",
        confidence: 1,
        issues: [],
      },
      attempts: 1,
      validationFailed: false,
    };
  }

  const { systemPrompt, userPrompt } = buildLocalizedGeneratorPrompt({
    targetLanguage,
    baseSystemPrompt,
    baseUserPrompt,
    preserveMedicalTerms,
    contentType,
  });

  let lastResult: AIRequestResult | null = null;
  let lastValidation: LanguageValidationResult | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    const retryPrompt =
      attempt > 1
        ? `${userPrompt}\n\n[RETRY ${attempt}/${MAX_RETRIES + 1}]: Previous attempt failed language validation. Issues: ${lastValidation?.issues.join("; ")}. Please ensure ALL content is in the requested language.`
        : userPrompt;

    let aiResult: AIRequestResult;
    try {
      aiResult = await routeAIRequest(systemPrompt, retryPrompt, aiOptions);
    } catch (err: any) {
      console.warn(
        `[LanguageEnforcement] AI request failed on attempt ${attempt}/${MAX_RETRIES + 1}: ${err.message}`
      );
      if (attempt >= MAX_RETRIES + 1) throw err;
      continue;
    }
    lastResult = aiResult;

    let payload: Record<string, any>;
    try {
      payload = JSON.parse(aiResult.content);
    } catch {
      payload = { content: aiResult.content };
    }

    const validation = validateGeneratedPayload(
      payload,
      targetLanguage,
      fieldsToValidate
    );
    lastValidation = validation;

    if (validation.isValid) {
      return {
        success: true,
        content: aiResult.content,
        aiResult,
        validation,
        attempts: attempt,
        validationFailed: false,
      };
    }

    console.warn(
      `[LanguageEnforcement] Attempt ${attempt}/${MAX_RETRIES + 1} failed validation for ${targetLanguage}: ${validation.issues.join("; ")}`
    );
  }

  if (queueItemId) {
    try {
      await pool.query(
        `UPDATE publishing_queue
         SET metadata = jsonb_set(
           COALESCE(metadata, '{}'::jsonb),
           '{validation_status}',
           '"validation_failed"'
         )
         WHERE id = $1`,
        [queueItemId]
      );
    } catch (err: any) {
      console.error(`[LanguageEnforcement] Failed to flag queue item ${queueItemId}:`, err.message);
    }
  }

  try {
    await pool.query(
      `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "language_enforcement",
        contentType || "unknown",
        `Language validation failed: ${targetLanguage}`,
        JSON.stringify({ raw: lastResult?.content }),
        "validation_failed",
        JSON.stringify({
          validation_status: "validation_failed",
          target_language: targetLanguage,
          validation_issues: lastValidation?.issues,
          detected_language: lastValidation?.detectedLanguage,
          attempts: MAX_RETRIES + 1,
          flagged_at: new Date().toISOString(),
        }),
      ]
    );
  } catch (err: any) {
    console.error("[LanguageEnforcement] Failed to save validation_failed record:", err.message);
  }

  return {
    success: false,
    content: lastResult?.content || "",
    aiResult: lastResult!,
    validation: lastValidation!,
    attempts: MAX_RETRIES + 1,
    validationFailed: true,
  };
}
