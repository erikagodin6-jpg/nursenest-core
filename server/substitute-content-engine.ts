import { pool } from "./storage";
import type { ContentSubstitutionRule } from "@shared/schema";

export interface SubstitutionContext {
  userId?: string | null;
  profession?: string | null;
  tier?: string | null;
  examType?: string | null;
  domain?: string | null;
  category?: string | null;
  region?: string | null;
  language?: string | null;
  requestPath?: string | null;
}

export interface SubstitutionResult {
  substituteId: string;
  substituteType: string;
  substituteData: any;
  matchScore: number;
  matchingCriteria: Record<string, boolean>;
  wasLanguageFallback: boolean;
  ruleId: string | null;
  message: string;
}

interface ContentMetadata {
  id: string;
  contentType: string;
  category: string | null;
  tier: string | null;
  examType: string | null;
  domain: string | null;
  bodySystem: string | null;
  profession: string | null;
  region: string | null;
  language: string | null;
  title: string | null;
}

const TIER_HIERARCHY: Record<string, number> = {
  free: 0, rpn: 1, rn: 2, np: 3, admin: 4,
};

const PAID_TIERS = new Set(["rpn", "rn", "np", "newgrad", "new_grad_toolkit", "certification_prep", "full_access", "admin"]);

function canAccessCandidateTier(userTier: string, candidateTier: string): boolean {
  if (!candidateTier || candidateTier === "free") return true;
  if (!userTier || userTier === "free") return candidateTier === "free";
  if (userTier === "admin" || userTier === "full_access") return true;
  const userLevel = TIER_HIERARCHY[userTier] ?? 0;
  const candLevel = TIER_HIERARCHY[candidateTier] ?? 0;
  return userLevel >= candLevel;
}

async function getContentMetadata(contentId: string): Promise<ContentMetadata | null> {
  const tables = [
    {
      query: `SELECT id, 'exam' as content_type, category, tier, exam_type, body_system as domain, body_system, career_type as profession, NULL as region, NULL as language, NULL as title FROM exam_questions WHERE id = $1`,
    },
    {
      query: `SELECT id, 'flashcard' as content_type, topic as category, tier, NULL as exam_type, blueprint_category as domain, body_system, NULL as profession, NULL as region, NULL as language, question as title FROM flashcard_bank WHERE id = $1`,
    },
    {
      query: `SELECT id, type as content_type, category, tier, NULL as exam_type, body_system as domain, body_system, NULL as profession, region_scope as region, NULL as language, title FROM content_items WHERE id = $1`,
    },
    {
      query: `SELECT id, 'lesson' as content_type, category, tier, NULL as exam_type, NULL as domain, NULL as body_system, NULL as profession, NULL as region, NULL as language, title FROM lessons WHERE id = $1`,
    },
  ];

  for (const table of tables) {
    try {
      const result = await pool.query(table.query, [contentId]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return {
          id: row.id,
          contentType: row.content_type || "unknown",
          category: row.category || null,
          tier: row.tier || null,
          examType: row.exam_type || null,
          domain: row.domain || null,
          bodySystem: row.body_system || null,
          profession: row.profession || null,
          region: row.region || null,
          language: row.language || null,
          title: row.title || null,
        };
      }
    } catch {
    }
  }
  return null;
}

async function getSubstitutionRule(contentType: string): Promise<ContentSubstitutionRule | null> {
  try {
    const result = await pool.query(
      `SELECT * FROM content_substitution_rules WHERE content_type = $1 AND is_active = true LIMIT 1`,
      [contentType],
    );
    if (result.rows.length === 0) {
      const fallback = await pool.query(
        `SELECT * FROM content_substitution_rules WHERE content_type = 'default' AND is_active = true LIMIT 1`,
      );
      if (fallback.rows.length === 0) return null;
      const r = fallback.rows[0];
      return snakeToCamelRule(r);
    }
    return snakeToCamelRule(result.rows[0]);
  } catch {
    return null;
  }
}

function snakeToCamelRule(r: any): ContentSubstitutionRule {
  return {
    id: r.id,
    contentType: r.content_type,
    matchProfession: r.match_profession,
    matchTier: r.match_tier,
    matchExamType: r.match_exam_type,
    matchDomain: r.match_domain,
    matchRegion: r.match_region,
    matchLanguage: r.match_language,
    matchPlanEligibility: r.match_plan_eligibility,
    professionWeight: r.profession_weight,
    tierWeight: r.tier_weight,
    examTypeWeight: r.exam_type_weight,
    domainWeight: r.domain_weight,
    regionWeight: r.region_weight,
    languageWeight: r.language_weight,
    planWeight: r.plan_weight,
    allowCrossLanguage: r.allow_cross_language,
    defaultLanguage: r.default_language,
    maxSubstitutes: r.max_substitutes,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function computeMatchScore(
  original: ContentMetadata,
  candidate: any,
  rule: ContentSubstitutionRule,
  context: SubstitutionContext,
): { score: number; criteria: Record<string, boolean>; isLanguageFallback: boolean } {
  let score = 0;
  let maxScore = 0;
  const criteria: Record<string, boolean> = {};
  let isLanguageFallback = false;

  if (rule.matchProfession) {
    const origProfession = context.profession || original.profession;
    const candProfession = candidate.profession || candidate.career_type;
    const matched = !origProfession || !candProfession || origProfession === candProfession;
    criteria.profession = matched;
    if (matched) score += (rule.professionWeight || 10);
    maxScore += (rule.professionWeight || 10);
  }

  if (rule.matchTier) {
    const origTier = context.tier || original.tier;
    const candTier = candidate.tier;
    const matched = !origTier || !candTier || origTier === candTier;
    criteria.tier = matched;
    if (matched) score += (rule.tierWeight || 8);
    maxScore += (rule.tierWeight || 8);
  }

  if (rule.matchExamType) {
    const origExam = context.examType || original.examType;
    const candExam = candidate.exam_type || candidate.examType;
    const matched = !origExam || !candExam || origExam === candExam;
    criteria.examType = matched;
    if (matched) score += (rule.examTypeWeight || 7);
    maxScore += (rule.examTypeWeight || 7);
  }

  if (rule.matchDomain) {
    const origDomain = context.domain || context.category || original.domain || original.category;
    const candDomain = candidate.domain || candidate.category || candidate.body_system || candidate.blueprint_category || candidate.topic;
    const matched = !origDomain || !candDomain || origDomain === candDomain;
    criteria.domain = matched;
    if (matched) score += (rule.domainWeight || 9);
    maxScore += (rule.domainWeight || 9);
  }

  if (rule.matchRegion) {
    const origRegion = context.region || original.region;
    const candRegion = candidate.region || candidate.region_scope;
    const matched = !origRegion || !candRegion || origRegion === candRegion || candRegion === "BOTH";
    criteria.region = matched;
    if (matched) score += (rule.regionWeight || 3);
    maxScore += (rule.regionWeight || 3);
  }

  if (rule.matchLanguage) {
    const origLang = context.language || original.language || "en";
    const candLang = candidate.language || "en";
    const matched = origLang === candLang;
    criteria.language = matched;
    if (matched) {
      score += (rule.languageWeight || 6);
    } else if (rule.allowCrossLanguage && candLang === (rule.defaultLanguage || "en")) {
      score += Math.floor((rule.languageWeight || 6) * 0.5);
      isLanguageFallback = true;
    }
    maxScore += (rule.languageWeight || 6);
  }

  if (rule.matchPlanEligibility) {
    const userTier = context.tier || "free";
    const candTier = candidate.tier || "free";
    const tierCanAccess = canAccessCandidateTier(userTier, candTier);
    criteria.planEligibility = tierCanAccess;
    if (tierCanAccess) {
      score += (rule.planWeight || 5);
    }
    maxScore += (rule.planWeight || 5);
  }

  const normalizedScore = maxScore > 0 ? score / maxScore : 0;

  return { score: normalizedScore, criteria, isLanguageFallback };
}

async function findCandidatesByType(
  contentType: string,
  original: ContentMetadata,
  context: SubstitutionContext,
  limit: number,
): Promise<any[]> {
  try {
    switch (contentType) {
      case "exam": {
        const result = await pool.query(
          `SELECT id, category, tier, exam_type, body_system, body_system as domain, career_type as profession, NULL as region, NULL as language, 'exam' as content_type
           FROM exam_questions 
           WHERE id != $1 AND status = 'published'
           ORDER BY RANDOM() LIMIT $2`,
          [original.id, limit * 3],
        );
        return result.rows;
      }
      case "flashcard": {
        const result = await pool.query(
          `SELECT id, topic as category, tier, blueprint_category as domain, body_system, question as title, 'flashcard' as content_type, NULL as profession, NULL as region, NULL as language
           FROM flashcard_bank 
           WHERE id != $1 AND status = 'published' AND flashcard_enabled = true
           ORDER BY RANDOM() LIMIT $2`,
          [original.id, limit * 3],
        );
        return result.rows;
      }
      case "lesson": {
        const result = await pool.query(
          `SELECT id, category, tier, NULL as domain, NULL as body_system, title, 'lesson' as content_type, NULL as profession, NULL as region, NULL as language
           FROM lessons 
           WHERE id != $1 AND status = 'published'
           ORDER BY RANDOM() LIMIT $2`,
          [original.id, limit * 3],
        );
        return result.rows;
      }
      default: {
        const result = await pool.query(
          `SELECT id, category, tier, body_system as domain, body_system, title, type as content_type, NULL as profession, region_scope as region, NULL as language
           FROM content_items 
           WHERE id != $1 AND status = 'published' AND type = $2
           ORDER BY RANDOM() LIMIT $3`,
          [original.id, contentType, limit * 3],
        );
        return result.rows;
      }
    }
  } catch {
    return [];
  }
}

async function logSubstitutionEvent(
  result: SubstitutionResult,
  original: ContentMetadata,
  context: SubstitutionContext,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO substitution_events (id, user_id, original_content_id, original_content_type, substitute_content_id, substitute_content_type, match_score, matching_criteria, rule_id, profession, tier, exam_type, domain, region, language, was_language_fallback, request_path, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())`,
      [
        context.userId || null,
        original.id,
        original.contentType,
        result.substituteId,
        result.substituteType,
        result.matchScore,
        JSON.stringify(result.matchingCriteria),
        result.ruleId,
        context.profession || original.profession,
        context.tier || original.tier,
        context.examType || original.examType,
        context.domain || original.domain || original.category,
        context.region || original.region,
        context.language || original.language || "en",
        result.wasLanguageFallback,
        context.requestPath || null,
      ],
    );
  } catch (err: any) {
    console.error(`[SubstituteEngine] Failed to log substitution event: ${err?.message}`);
  }
}

export async function findSubstitute(
  contentId: string,
  contentType: string | null,
  context: SubstitutionContext,
): Promise<SubstitutionResult | null> {
  try {
    const original = await getContentMetadata(contentId);
    if (!original) {
      console.warn(`[SubstituteEngine] No metadata found for content ${contentId}`);
      return null;
    }

    const effectiveType = contentType || original.contentType;
    const rule = await getSubstitutionRule(effectiveType);

    if (!rule) {
      console.warn(`[SubstituteEngine] No substitution rule for type ${effectiveType}, using basic matching`);
      return await basicSubstitute(contentId, effectiveType, original, context);
    }

    const candidates = await findCandidatesByType(effectiveType, original, context, rule.maxSubstitutes || 3);
    if (candidates.length === 0) {
      console.warn(`[SubstituteEngine] No candidates found for ${effectiveType}`);
      return null;
    }

    const scored = candidates.map(candidate => {
      const { score, criteria, isLanguageFallback } = computeMatchScore(original, candidate, rule, context);
      return { candidate, score, criteria, isLanguageFallback };
    });

    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!best || best.score < 0.3) {
      console.warn(`[SubstituteEngine] Best match score ${best?.score} below threshold for ${contentId}`);
      return null;
    }

    const langFallbackNote = best.isLanguageFallback
      ? " (Note: This resource is in the default language as a same-language version was not available.)"
      : "";

    const result: SubstitutionResult = {
      substituteId: best.candidate.id,
      substituteType: best.candidate.content_type || effectiveType,
      substituteData: best.candidate,
      matchScore: best.score,
      matchingCriteria: best.criteria,
      wasLanguageFallback: best.isLanguageFallback,
      ruleId: rule.id,
      message: `This item is temporarily unavailable. Your access is protected. We've opened the closest available backup resource for you.${langFallbackNote}`,
    };

    logSubstitutionEvent(result, original, context).catch(() => {});

    console.log(`[SubstituteEngine] Substituted ${contentId} -> ${result.substituteId} (score: ${result.matchScore.toFixed(2)}, type: ${effectiveType})`);

    return result;
  } catch (err: any) {
    console.error(`[SubstituteEngine] Error finding substitute: ${err?.message}`);
    return null;
  }
}

async function basicSubstitute(
  contentId: string,
  contentType: string,
  original: ContentMetadata,
  context: SubstitutionContext,
): Promise<SubstitutionResult | null> {
  try {
    const category = context.category || original.category || original.domain;
    const tier = context.tier || original.tier;

    let result: any = null;

    if (contentType === "exam") {
      const r = await pool.query(
        `SELECT id, category, tier, exam_type, body_system, 'exam' as content_type 
         FROM exam_questions 
         WHERE id != $1 AND status = 'published' 
         AND ($2::text IS NULL OR category = $2) 
         AND ($3::text IS NULL OR tier = $3)
         ORDER BY RANDOM() LIMIT 1`,
        [contentId, category, tier],
      );
      result = r.rows[0];
    } else if (contentType === "flashcard") {
      const r = await pool.query(
        `SELECT id, topic as category, tier, blueprint_category, 'flashcard' as content_type
         FROM flashcard_bank 
         WHERE id != $1 AND status = 'published' AND flashcard_enabled = true
         AND ($2::text IS NULL OR topic = $2)
         AND ($3::text IS NULL OR tier = $3)
         ORDER BY RANDOM() LIMIT 1`,
        [contentId, category, tier],
      );
      result = r.rows[0];
    } else {
      const r = await pool.query(
        `SELECT id, category, tier, type as content_type 
         FROM content_items 
         WHERE id != $1 AND status = 'published'
         AND ($2::text IS NULL OR category = $2)
         AND ($3::text IS NULL OR tier = $3)
         ORDER BY RANDOM() LIMIT 1`,
        [contentId, category, tier],
      );
      result = r.rows[0];
    }

    if (!result) return null;

    return {
      substituteId: result.id,
      substituteType: result.content_type || contentType,
      substituteData: result,
      matchScore: 0.5,
      matchingCriteria: { category: !!category, tier: !!tier },
      wasLanguageFallback: false,
      ruleId: null,
      message: "This item is temporarily unavailable. Your access is protected. We've opened the closest available backup resource for you.",
    };
  } catch {
    return null;
  }
}

export async function getSubstitutionRules(): Promise<ContentSubstitutionRule[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM content_substitution_rules ORDER BY content_type`,
    );
    return result.rows.map(snakeToCamelRule);
  } catch {
    return [];
  }
}

export async function getSubstitutionEvents(filters?: {
  userId?: string;
  contentType?: string;
  limit?: number;
}): Promise<any[]> {
  try {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.userId) {
      conditions.push(`user_id = $${idx++}`);
      params.push(filters.userId);
    }
    if (filters?.contentType) {
      conditions.push(`original_content_type = $${idx++}`);
      params.push(filters.contentType);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters?.limit || 50;
    params.push(limit);

    const result = await pool.query(
      `SELECT * FROM substitution_events ${where} ORDER BY created_at DESC LIMIT $${idx}`,
      params,
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function seedSubstitutionRules(): Promise<void> {
  const defaultRules = [
    { contentType: "default", professionWeight: 10, tierWeight: 8, examTypeWeight: 7, domainWeight: 9, regionWeight: 3, languageWeight: 6, planWeight: 5, matchExamType: true, matchRegion: false },
    { contentType: "exam", professionWeight: 10, tierWeight: 9, examTypeWeight: 10, domainWeight: 8, regionWeight: 4, languageWeight: 5, planWeight: 6, matchExamType: true, matchRegion: true },
    { contentType: "flashcard", professionWeight: 8, tierWeight: 7, examTypeWeight: 5, domainWeight: 10, regionWeight: 2, languageWeight: 6, planWeight: 5, matchExamType: true, matchRegion: false },
    { contentType: "lesson", professionWeight: 9, tierWeight: 8, examTypeWeight: 6, domainWeight: 10, regionWeight: 3, languageWeight: 7, planWeight: 5, matchExamType: true, matchRegion: false },
    { contentType: "cat_configuration", professionWeight: 10, tierWeight: 10, examTypeWeight: 10, domainWeight: 7, regionWeight: 5, languageWeight: 4, planWeight: 8, matchExamType: true, matchRegion: true },
  ];

  for (const rule of defaultRules) {
    try {
      const existing = await pool.query(
        `SELECT id FROM content_substitution_rules WHERE content_type = $1 AND is_active = true`,
        [rule.contentType],
      );
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE content_substitution_rules SET
            profession_weight = $2, tier_weight = $3, exam_type_weight = $4, domain_weight = $5,
            region_weight = $6, language_weight = $7, plan_weight = $8,
            match_exam_type = $9, match_region = $10, updated_at = NOW()
           WHERE id = $1`,
          [
            existing.rows[0].id,
            rule.professionWeight, rule.tierWeight, rule.examTypeWeight, rule.domainWeight,
            rule.regionWeight, rule.languageWeight, rule.planWeight,
            rule.matchExamType, rule.matchRegion,
          ],
        );
      } else {
        await pool.query(
          `INSERT INTO content_substitution_rules (id, content_type, match_profession, match_tier, match_exam_type, match_domain, match_region, match_language, match_plan_eligibility, profession_weight, tier_weight, exam_type_weight, domain_weight, region_weight, language_weight, plan_weight, allow_cross_language, default_language, max_substitutes, is_active, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, true, true, $2, true, $3, true, true, $4, $5, $6, $7, $8, $9, $10, true, 'en', 3, true, NOW(), NOW())`,
          [
            rule.contentType, rule.matchExamType, rule.matchRegion,
            rule.professionWeight, rule.tierWeight, rule.examTypeWeight, rule.domainWeight,
            rule.regionWeight, rule.languageWeight, rule.planWeight,
          ],
        );
      }
    } catch (err: any) {
      console.error(`[SubstituteEngine] Failed to seed rule for ${rule.contentType}: ${err?.message}`);
    }
  }

  console.log(`[SubstituteEngine] Seeded ${defaultRules.length} substitution rules`);
}
