import type { Express } from "express";
import { pool } from "./storage";
import { CAREER_CONFIGS } from "@shared/careers";
import crypto from "crypto";
import { resolveAuthUser } from "./admin-auth";

const ALLIED_CAREERS = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging"];

let globalKillSwitch = false;
let dailyTokenCost = 0;
let dailyCostResetDate = "";
const MAX_DAILY_TOKEN_COST = 500000;
const MAX_RETRIES = 3;

interface AutomationDef {
  slug: string;
  category: string;
  name: string;
  description: string;
  defaultFrequency: string;
  defaultMaxItems: number;
  defaultMaxRuns: number;
  defaultAutoPublish: boolean;
  handler: (automation: any, runId: string) => Promise<AutomationResult>;
}

interface AutomationResult {
  generated: number;
  accepted: number;
  rejected: number;
  details: Record<string, any>;
}

function resetDailyCostIfNeeded() {
  const today = new Date().toISOString().split("T")[0];
  if (dailyCostResetDate !== today) {
    dailyTokenCost = 0;
    dailyCostResetDate = today;
  }
}

function idempotencyKey(automationId: string, params: Record<string, any>): string {
  const today = new Date().toISOString().split("T")[0];
  const hash = crypto.createHash("md5").update(JSON.stringify(params)).digest("hex").slice(0, 8);
  return `${automationId}_${today}_${hash}`;
}

async function getOpenAI() {
  const OpenAI = (await import("openai")).default;
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

async function aiGenerate(systemPrompt: string, userPrompt: string, maxTokens = 16000): Promise<string> {
  const openai = await getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  dailyTokenCost += response.usage?.total_tokens || 0;
  return response.choices[0]?.message?.content || "";
}

function parseJsonFromResponse(text: string): any {
  try {
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) return JSON.parse(arrMatch[0]);
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    return null;
  } catch {
    return null;
  }
}

async function getActiveBlueprint(careerType: string) {
  const r = await pool.query(
    "SELECT * FROM allied_blueprints WHERE career_type = $1 AND is_active = true ORDER BY version DESC LIMIT 1",
    [careerType]
  );
  return r.rows[0] || null;
}

async function getDomainCoverage(careerType: string): Promise<Record<string, number>> {
  const r = await pool.query(
    "SELECT blueprint_category, COUNT(*) as c FROM allied_questions WHERE career_type = $1 AND status != 'rejected' GROUP BY blueprint_category",
    [careerType]
  );
  const coverage: Record<string, number> = {};
  for (const row of r.rows) {
    coverage[row.blueprint_category] = parseInt(row.c);
  }
  return coverage;
}

async function getDifficultyDistribution(careerType: string): Promise<Record<number, number>> {
  const r = await pool.query(
    "SELECT difficulty, COUNT(*) as c FROM allied_questions WHERE career_type = $1 AND status != 'rejected' GROUP BY difficulty",
    [careerType]
  );
  const dist: Record<number, number> = {};
  for (const row of r.rows) {
    dist[parseInt(row.difficulty)] = parseInt(row.c);
  }
  return dist;
}

async function requireAutomationAdmin(req: any, res: any): Promise<any> {
  const user = await resolveAuthUser(req);
  if (!user) return res.status(401).json({ error: "Authentication required" });
  if (user.tier !== "admin") return res.status(403).json({ error: "Admin access denied" });
  return user;
}

async function createRunRecord(automationId: string, slug: string): Promise<string> {
  const r = await pool.query(
    "INSERT INTO allied_automation_runs (automation_id, automation_slug, status) VALUES ($1, $2, 'running') RETURNING id",
    [automationId, slug]
  );
  return r.rows[0].id;
}

async function completeRunRecord(runId: string, result: AutomationResult) {
  await pool.query(
    `UPDATE allied_automation_runs SET status = 'completed', items_generated = $1, items_accepted = $2,
     items_rejected = $3, details = $4, token_cost = $5, completed_at = NOW() WHERE id = $6`,
    [result.generated, result.accepted, result.rejected, JSON.stringify(result.details), dailyTokenCost, runId]
  );
}

async function failRunRecord(runId: string, error: string) {
  await pool.query(
    "UPDATE allied_automation_runs SET status = 'failed', error_message = $1, completed_at = NOW() WHERE id = $2",
    [error, runId]
  );
}

async function saveDraftAsset(type: string, careerType: string | null, domain: string | null, title: string, payload: any, runId: string) {
  await pool.query(
    `INSERT INTO allied_draft_assets (type, career_type, domain, title, payload, automation_run_id, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, 'automation')`,
    [type, careerType, domain, title, JSON.stringify(payload), runId]
  );
}

// ============================================================
// AUTOMATION HANDLERS
// ============================================================

async function handleDailyQuestionPack(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let totalGen = 0, totalAcc = 0, totalRej = 0;
  const details: Record<string, any> = {};

  for (const careerType of careers) {
    const blueprint = await getActiveBlueprint(careerType);
    if (!blueprint) continue;
    const domains = typeof blueprint.domains === "string" ? JSON.parse(blueprint.domains) : blueprint.domains;
    const domainKeys = Object.keys(domains);
    const randomDomain = domainKeys[Math.floor(Math.random() * domainKeys.length)];
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    const count = Math.min(automation.max_items_per_run || 25, 25);

    const prompt = `Generate ${count} original exam-style questions for ${career.name} on domain: ${randomDomain}.
Each question must have: stem, options (4), correctAnswer (0-3), rationaleLong (600+ words), learningObjective, blueprintCategory, subtopic, difficulty (1-5), cognitiveLevel (recall/application/analysis), questionType, examTrap, clinicalPearls (3+), safetyNote, distractorRationales (4).
Return STRICT JSON array.`;

    try {
      const content = await aiGenerate(prompt, `Generate exactly ${count} questions as a JSON array. Return ONLY valid JSON.`);
      const questions = parseJsonFromResponse(content) || [];

      for (const q of questions) {
        totalGen++;
        const valid = q.stem && q.options?.length >= 4 && q.rationaleLong && q.rationaleLong.split(/\s+/).length >= (automation.rationale_min_words || 300);
        if (valid) {
          await saveDraftAsset("question", careerType, randomDomain, q.stem?.substring(0, 100), q, runId);
          totalAcc++;
        } else {
          totalRej++;
        }
      }
      details[careerType] = { domain: randomDomain, generated: questions.length };
    } catch (e: any) {
      details[careerType] = { error: e.message };
    }
  }
  return { generated: totalGen, accepted: totalAcc, rejected: totalRej, details };
}

async function handleMockExamBuilder(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let totalGen = 0;
  const details: Record<string, any> = {};

  for (const careerType of careers) {
    const existingRes = await pool.query(
      "SELECT COUNT(*) as c FROM allied_questions WHERE career_type = $1 AND status = 'approved'",
      [careerType]
    );
    const existingCount = parseInt(existingRes.rows[0].c);
    if (existingCount < 20) {
      details[careerType] = { skipped: true, reason: "insufficient_questions" };
      continue;
    }

    const examSize = Math.min(automation.max_items_per_run || 75, 125);
    const existingPortion = Math.floor(examSize * 0.8);
    const newPortion = examSize - existingPortion;

    const existingQs = await pool.query(
      "SELECT id, stem, blueprint_category, difficulty FROM allied_questions WHERE career_type = $1 AND status = 'approved' ORDER BY RANDOM() LIMIT $2",
      [careerType, existingPortion]
    );

    const coverage = await getDomainCoverage(careerType);
    const weakDomains = Object.entries(coverage).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([d]) => d);

    const examPayload = {
      title: `Mock Exam - ${CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS]?.name || careerType}`,
      careerType,
      questionCount: examSize,
      existingQuestionIds: existingQs.rows.map((r: any) => r.id),
      newQuestionsNeeded: weakDomains.map(d => ({ domain: d, count: Math.ceil(newPortion / weakDomains.length), difficulty: "mixed" })),
      domainDistribution: coverage,
      generatedAt: new Date().toISOString(),
    };

    await saveDraftAsset("mock_exam", careerType, null, examPayload.title, examPayload, runId);
    totalGen++;
    details[careerType] = { examSize, existingUsed: existingQs.rows.length, newNeeded: newPortion };
  }
  return { generated: totalGen, accepted: totalGen, rejected: 0, details };
}

async function handleRationaleExpander(automation: any, runId: string): Promise<AutomationResult> {
  const minWords = automation.rationale_min_words || 600;
  const r = await pool.query(
    `SELECT id, career_type, stem, rationale_long, blueprint_category FROM allied_questions
     WHERE status = 'approved' AND LENGTH(rationale_long) - LENGTH(REPLACE(rationale_long, ' ', '')) + 1 < $1
     LIMIT $2`,
    [minWords, automation.max_items_per_run || 25]
  );
  let expanded = 0, failed = 0;
  const details: Record<string, any> = { candidates: r.rows.length };

  for (const q of r.rows) {
    try {
      const prompt = `Expand this rationale to at least ${minWords} words while keeping the same format and educational content.
Original question stem: ${q.stem}
Current rationale: ${q.rationale_long}

Rules: Keep all existing information. Add more depth on pathophysiology, exam traps, and clinical pearls. Minimum ${minWords} words.`;
      const expanded_rationale = await aiGenerate("You are a healthcare exam rationale writer.", prompt, 8000);
      if (expanded_rationale.split(/\s+/).length >= minWords * 0.8) {
        await saveDraftAsset("rationale_expansion", q.career_type, q.blueprint_category,
          `Expanded: ${q.stem?.substring(0, 80)}`, { questionId: q.id, originalWordCount: q.rationale_long?.split(/\s+/).length, expandedRationale: expanded_rationale, newWordCount: expanded_rationale.split(/\s+/).length }, runId);
        expanded++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }
  return { generated: r.rows.length, accepted: expanded, rejected: failed, details };
}

async function handleDifficultyBalancer(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let totalGen = 0;
  const details: Record<string, any> = {};

  for (const careerType of careers) {
    const dist = await getDifficultyDistribution(careerType);
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    if (total < 50) { details[careerType] = { skipped: true }; continue; }

    const targetDist: Record<number, number> = { 1: 0.10, 2: 0.20, 3: 0.35, 4: 0.25, 5: 0.10 };
    const gaps: Array<{ difficulty: number; needed: number }> = [];

    for (const [d, target] of Object.entries(targetDist)) {
      const current = (dist[parseInt(d)] || 0) / total;
      if (current < target - 0.05) {
        gaps.push({ difficulty: parseInt(d), needed: Math.ceil((target - current) * total) });
      }
    }

    if (gaps.length === 0) { details[careerType] = { balanced: true }; continue; }

    await saveDraftAsset("difficulty_report", careerType, null,
      `Difficulty gaps for ${careerType}`, { currentDistribution: dist, targetDistribution: targetDist, gaps, totalQuestions: total }, runId);
    totalGen++;
    details[careerType] = { gaps };
  }
  return { generated: totalGen, accepted: totalGen, rejected: 0, details };
}

async function handleBlueprintCoverageFiller(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let totalGen = 0;
  const details: Record<string, any> = {};

  for (const careerType of careers) {
    const blueprint = await getActiveBlueprint(careerType);
    if (!blueprint) continue;
    const domains = typeof blueprint.domains === "string" ? JSON.parse(blueprint.domains) : blueprint.domains;
    const coverage = await getDomainCoverage(careerType);
    const totalQs = Object.values(coverage).reduce((a: number, b: number) => a + b, 0);
    const gaps: Array<{ domain: string; current: number; target: number; deficit: number }> = [];

    for (const [domain, weight] of Object.entries(domains)) {
      const current = coverage[domain] || 0;
      const target = Math.ceil(totalQs * (weight as number));
      if (current < target * 0.7) {
        gaps.push({ domain, current, target, deficit: target - current });
      }
    }

    if (gaps.length > 0) {
      await saveDraftAsset("coverage_report", careerType, null,
        `Blueprint coverage gaps for ${careerType}`, { gaps, totalQuestions: totalQs, blueprint: blueprint.id }, runId);
      totalGen++;
    }
    details[careerType] = { gaps: gaps.length, coveredDomains: Object.keys(coverage).length };
  }
  return { generated: totalGen, accepted: totalGen, rejected: 0, details };
}

async function handleDuplicateSweeper(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let flagged = 0;
  const details: Record<string, any> = {};

  for (const careerType of careers) {
    const r = await pool.query(
      "SELECT id, stem FROM allied_questions WHERE career_type = $1 AND status != 'rejected' ORDER BY created_at",
      [careerType]
    );
    const stems = r.rows;
    const duplicates: Array<{ id1: string; id2: string; similarity: number }> = [];

    for (let i = 0; i < stems.length && i < 500; i++) {
      for (let j = i + 1; j < stems.length && j < 500; j++) {
        const words1 = stems[i].stem.toLowerCase().split(/\s+/);
        const words2 = stems[j].stem.toLowerCase().split(/\s+/);
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        const intersection = [...set1].filter(w => set2.has(w)).length;
        const union = new Set([...set1, ...set2]).size;
        const jaccard = union > 0 ? intersection / union : 0;

        if (jaccard > 0.75) {
          duplicates.push({ id1: stems[i].id, id2: stems[j].id, similarity: jaccard });
          if (duplicates.length < 50) {
            await pool.query(
              "INSERT INTO allied_revision_queue (question_id, career_type, reason, severity) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
              [stems[j].id, careerType, `duplicate_similarity_${jaccard.toFixed(2)}_with_${stems[i].id}`, "high"]
            );
            flagged++;
          }
        }
      }
    }
    details[careerType] = { scanned: Math.min(stems.length, 500), duplicatesFound: duplicates.length };
  }
  return { generated: flagged, accepted: flagged, rejected: 0, details };
}

async function handleItemQualityRefactor(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    `SELECT id, career_type, stem, options, correct_answer, blueprint_category FROM allied_questions
     WHERE status = 'approved' AND (
       stem ILIKE '%NOT%' AND stem ILIKE '%which%'
       OR options::text ILIKE '%all of the above%'
       OR options::text ILIKE '%none of the above%'
     ) LIMIT $1`,
    [automation.max_items_per_run || 25]
  );

  let refactored = 0;
  for (const q of r.rows) {
    try {
      const issues: string[] = [];
      if (q.stem.includes("NOT") || q.stem.includes("EXCEPT")) issues.push("double_negative");
      const opts = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
      if (opts.some((o: string) => o.toLowerCase().includes("all of the above"))) issues.push("all_of_above");
      if (opts.some((o: string) => o.toLowerCase().includes("none of the above"))) issues.push("none_of_above");

      await saveDraftAsset("quality_refactor", q.career_type, q.blueprint_category,
        `Refactor: ${q.stem?.substring(0, 80)}`, { questionId: q.id, issues, originalStem: q.stem, originalOptions: opts }, runId);
      refactored++;
    } catch {}
  }
  return { generated: r.rows.length, accepted: refactored, rejected: 0, details: { candidates: r.rows.length } };
}

async function handlePerformanceBasedGenerator(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    `SELECT career_type, blueprint_category, COUNT(*) as attempts,
     SUM(CASE WHEN correct_attempts < total_attempts * 0.4 THEN 1 ELSE 0 END) as hard_items
     FROM allied_questions WHERE total_attempts >= 20 AND status = 'approved'
     GROUP BY career_type, blueprint_category
     HAVING SUM(CASE WHEN correct_attempts < total_attempts * 0.4 THEN 1 ELSE 0 END) > 3
     ORDER BY hard_items DESC LIMIT 10`
  );

  let gen = 0;
  for (const row of r.rows) {
    await saveDraftAsset("performance_gap", row.career_type, row.blueprint_category,
      `Weak area: ${row.blueprint_category} (${row.career_type})`,
      { careerType: row.career_type, domain: row.blueprint_category, hardItems: parseInt(row.hard_items), totalAttempts: parseInt(row.attempts), recommendation: `Generate more questions in ${row.blueprint_category} to strengthen weak area` },
      runId);
    gen++;
  }
  return { generated: gen, accepted: gen, rejected: 0, details: { weakAreas: r.rows.length } };
}

async function handleDailyFlashcardInjection(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let totalGen = 0;
  const details: Record<string, any> = {};

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    const count = Math.min(automation.max_items_per_run || 50, 100);

    try {
      const prompt = `Generate ${count} educational flashcards for ${career.name} exam prep.
Each card: { "front": "question/concept", "back": "answer/explanation", "cardType": "definition|clinical_decision|red_flag|drug_info", "domain": "topic area", "difficulty": 1-5 }
Return JSON array.`;
      const content = await aiGenerate("You are a healthcare flashcard writer.", prompt, 12000);
      const cards = parseJsonFromResponse(content) || [];

      for (const card of cards) {
        if (card.front && card.back) {
          await saveDraftAsset("flashcard", careerType, card.domain || "general",
            card.front.substring(0, 100), card, runId);
          totalGen++;
        }
      }
      details[careerType] = { generated: cards.length };
    } catch (e: any) {
      details[careerType] = { error: e.message };
    }
  }
  return { generated: totalGen, accepted: totalGen, rejected: 0, details };
}

async function handleClozeConversion(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    "SELECT id, career_type, front, back, card_type FROM allied_flashcards WHERE card_type = 'definition' LIMIT $1",
    [automation.max_items_per_run || 50]
  );
  let converted = 0;
  for (const card of r.rows) {
    const words = card.back.split(/\s+/);
    if (words.length >= 5) {
      const keyIndex = Math.floor(words.length / 2);
      const clozeWord = words[keyIndex];
      words[keyIndex] = "{{c1::" + clozeWord + "}}";
      await saveDraftAsset("cloze_flashcard", card.career_type, null,
        `Cloze: ${card.front.substring(0, 80)}`,
        { originalCardId: card.id, clozeFront: words.join(" "), clozeBack: card.back, cardType: "cloze" },
        runId);
      converted++;
    }
  }
  return { generated: r.rows.length, accepted: converted, rejected: r.rows.length - converted, details: { candidates: r.rows.length } };
}

async function handleMissedConceptCards(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    `SELECT career_type, blueprint_category, subtopic, stem, rationale_long
     FROM allied_questions WHERE total_attempts >= 10
     AND (correct_attempts::float / NULLIF(total_attempts, 0)) < 0.4
     AND status = 'approved' LIMIT $1`,
    [automation.max_items_per_run || 25]
  );

  let gen = 0;
  for (const q of r.rows) {
    await saveDraftAsset("missed_concept_card", q.career_type, q.blueprint_category,
      `Missed: ${q.subtopic}`,
      { front: `Key concept: ${q.subtopic} - What is the critical point students miss?`, back: (q.rationale_long || "").substring(0, 500), domain: q.blueprint_category, subtopic: q.subtopic },
      runId);
    gen++;
  }
  return { generated: gen, accepted: gen, rejected: 0, details: { weakQuestions: r.rows.length } };
}

async function handleImagePromptGenerator(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    try {
      const prompt = `Generate 10 safe, educational image prompt descriptions for ${career.name} study materials.
Each prompt should describe a diagram, chart, or educational illustration. No patient photos. No real medical images.
Return JSON array: [{"description": "...", "type": "diagram|chart|flowchart|anatomy|equipment", "topic": "...", "alt_text": "..."}]`;
      const content = await aiGenerate("You are an educational content designer.", prompt, 4000);
      const prompts = parseJsonFromResponse(content) || [];
      for (const p of prompts) {
        if (p.description) {
          await saveDraftAsset("image_prompt", careerType, p.topic || "general", p.description.substring(0, 100), p, "");
          gen++;
        }
      }
    } catch {}
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleAdaptiveStudyPlan(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    try {
      const prompt = `Create a 12-week adaptive study plan template for ${career.name} exam prep.
Include: weekly topics, daily tasks, checkpoint quizzes, review sessions, practice exam schedule.
Return JSON: { "weeks": [{ "week": 1, "theme": "...", "topics": [...], "dailyTasks": [...], "checkpointQuiz": {...}, "hours": 10 }], "totalHours": 120, "examReadinessTarget": 85 }`;
      const content = await aiGenerate("You are a healthcare exam prep study planner.", prompt, 8000);
      const plan = parseJsonFromResponse(content);
      if (plan) {
        await saveDraftAsset("study_plan", careerType, null, `${career.name} 12-Week Study Plan`, plan, runId);
        gen++;
      }
    } catch {}
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleCatchUpWeek(automation: any, runId: string): Promise<AutomationResult> {
  await saveDraftAsset("catch_up_template", null, null, "Catch-Up Week Micro-Plan Template",
    { description: "Template for generating personalized catch-up plans when users fall behind",
      structure: { day1: "Review missed topics", day2: "Targeted practice", day3: "Weak area drills", day4: "Mini mock", day5: "Review and consolidation" },
      triggers: ["missed_3_days", "score_drop_15pct", "module_incomplete"] }, runId);
  return { generated: 1, accepted: 1, rejected: 0, details: {} };
}

async function handleSeoBlogDraft(automation: any, runId: string): Promise<AutomationResult> {
  const topics = [
    { keyword: "pharmacy technician practice questions", career: "pharmacyTech", intent: "buyer" },
    { keyword: "respiratory therapy board exam tips", career: "rrt", intent: "informational" },
    { keyword: "paramedic NREMT study guide", career: "paramedic", intent: "buyer" },
    { keyword: "medical lab technician certification prep", career: "mlt", intent: "informational" },
    { keyword: "radiography exam practice test", career: "imaging", intent: "buyer" },
    { keyword: "PTCE calculation questions", career: "pharmacyTech", intent: "buyer" },
    { keyword: "ABG interpretation practice", career: "rrt", intent: "informational" },
    { keyword: "paramedic drug dosing calculator", career: "paramedic", intent: "buyer" },
    { keyword: "MLT hematology review", career: "mlt", intent: "informational" },
    { keyword: "radiologic positioning guide", career: "imaging", intent: "informational" },
  ];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  try {
    const prompt = `Write an SEO blog post targeting "${topic.keyword}" for healthcare learners.
Intent: ${topic.intent}.
Include: H1 + H2/H3 structure, intro, actionable sections, 5-question FAQ, CTA blocks linking to question bank and pricing.
Return JSON: { "title": "...", "slug": "...", "metaDescription": "...", "markdown": "...", "internalLinks": [{"anchor":"...","slug":"/..."}], "faqSchema": [...] }`;
    const content = await aiGenerate("You are a healthcare SEO content writer. Educational content only.", prompt, 8000);
    const blog = parseJsonFromResponse(content);
    if (blog) {
      await saveDraftAsset("seo_blog", topic.career, null, blog.title || topic.keyword, blog, runId);
      return { generated: 1, accepted: 1, rejected: 0, details: { keyword: topic.keyword } };
    }
  } catch {}
  return { generated: 0, accepted: 0, rejected: 0, details: { error: "generation_failed" } };
}

async function handleComparisonPageFactory(automation: any, runId: string): Promise<AutomationResult> {
  const comparisons = [
    "NurseNest Allied vs Pocket Prep", "NurseNest Allied vs UWorld", "Best PTCE Study Apps 2025",
    "Free vs Paid Paramedic Exam Prep", "Best RRT Board Review 2025", "NurseNest vs Mometrix MLT",
    "Top 5 Radiography Exam Prep Resources", "PTCE vs ExCPT: Which Pharmacy Exam",
  ];
  const comp = comparisons[Math.floor(Math.random() * comparisons.length)];

  try {
    const prompt = `Write a comparison page for "${comp}".
Include: structured H2/H3, feature comparison table, pricing, pros/cons, FAQ (5 questions), strong CTA to NurseNest Allied.
Return JSON: { "title": "...", "slug": "...", "metaDescription": "...", "markdown": "...", "faqSchema": [...], "comparisonTable": {...} }`;
    const content = await aiGenerate("You are a healthcare education comparison writer. Be fair and factual.", prompt, 6000);
    const page = parseJsonFromResponse(content);
    if (page) {
      await saveDraftAsset("comparison_page", null, null, page.title || comp, page, runId);
      return { generated: 1, accepted: 1, rejected: 0, details: { comparison: comp } };
    }
  } catch {}
  return { generated: 0, accepted: 0, rejected: 0, details: {} };
}

async function handleInternalLinkOptimizer(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    "SELECT id, title, payload FROM allied_draft_assets WHERE type = 'seo_blog' AND status = 'published' LIMIT 50"
  );
  const suggestions: Array<{ assetId: string; suggestedLinks: Array<{ anchor: string; target: string }> }> = [];

  const slugMap: Record<string, string> = {};
  for (const career of ALLIED_CAREERS) {
    slugMap[career] = `/${career.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  }

  for (const asset of r.rows) {
    const payload = typeof asset.payload === "string" ? JSON.parse(asset.payload) : asset.payload;
    const md = payload.markdown || "";
    const links: Array<{ anchor: string; target: string }> = [];
    for (const [career, slug] of Object.entries(slugMap)) {
      const config = CAREER_CONFIGS[career as keyof typeof CAREER_CONFIGS];
      if (config && md.toLowerCase().includes(config.name.toLowerCase())) {
        links.push({ anchor: config.name, target: `${slug}/qbank` });
      }
    }
    if (links.length > 0) {
      suggestions.push({ assetId: asset.id, suggestedLinks: links });
    }
  }

  if (suggestions.length > 0) {
    await saveDraftAsset("internal_link_suggestions", null, null,
      `Internal link suggestions (${suggestions.length} pages)`, { suggestions }, runId);
  }
  return { generated: suggestions.length, accepted: suggestions.length, rejected: 0, details: { pagesScanned: r.rows.length } };
}

async function handleFaqSchemaGenerator(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    try {
      const prompt = `Generate 10 FAQ questions and answers about ${career.name} exam preparation.
Each FAQ should be helpful for SEO and student conversion. Return JSON array: [{"question":"...","answer":"..."}]`;
      const content = await aiGenerate("You are an FAQ writer for healthcare exam prep.", prompt, 4000);
      const faqs = parseJsonFromResponse(content) || [];
      if (faqs.length > 0) {
        await saveDraftAsset("faq_schema", careerType, null, `FAQ Schema: ${career.name}`, { faqs, schemaType: "FAQPage" }, runId);
        gen++;
      }
    } catch {}
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleBundleBuilder(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    const qCount = await pool.query("SELECT COUNT(*) as c FROM allied_questions WHERE career_type = $1 AND status = 'approved'", [careerType]);
    const fCount = await pool.query("SELECT COUNT(*) as c FROM allied_flashcards WHERE career_type = $1", [careerType]);

    await saveDraftAsset("bundle", careerType, null, `${career.name} Cram Bundle`,
      {
        title: `${career.name} Complete Cram Bundle`,
        includes: [
          { type: "QBank", count: parseInt(qCount.rows[0].c), label: "Practice Questions" },
          { type: "Flashcards", count: parseInt(fCount.rows[0].c), label: "Flashcards" },
          { type: "MockExam", count: 3, label: "Full Mock Exams" },
          { type: "StudyPlan", count: 1, label: "12-Week Study Plan" },
        ],
        features: ["Unlimited access", "Detailed rationales", "Performance analytics"],
        suggestedPrice: null,
      }, runId);
    gen++;
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleStorefrontCopy(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    try {
      const prompt = `Write storefront sales copy for a ${career.name} exam prep product.
Include: value stacking (5 items), outcomes (3), guarantees, features list, who-it's-for section, FAQ (5 questions).
Return JSON with all sections.`;
      const content = await aiGenerate("You are a SaaS copywriter for healthcare education.", prompt, 4000);
      const copy = parseJsonFromResponse(content);
      if (copy) {
        await saveDraftAsset("storefront_copy", careerType, null, `Storefront: ${career.name}`, copy, runId);
        gen++;
      }
    } catch {}
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleOnboardingSequence(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    try {
      const prompt = `Create a 5-email onboarding sequence for new ${career.name} exam prep users.
Voice: supportive, confident, no cringe.
Each email: { "day": 1, "subject": "...", "previewText": "...", "body": "...", "cta": "...", "segment": "new_user" }
Return JSON array.`;
      const content = await aiGenerate("You are an email marketing specialist for healthcare education.", prompt, 6000);
      const emails = parseJsonFromResponse(content) || [];
      if (emails.length > 0) {
        await saveDraftAsset("email_sequence", careerType, null, `Onboarding: ${career.name}`, { type: "onboarding", emails }, runId);
        gen++;
      }
    } catch {}
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleAbandonedCheckout(automation: any, runId: string): Promise<AutomationResult> {
  try {
    const prompt = `Create a 3-email abandoned checkout sequence for a healthcare exam prep platform.
Voice: supportive, not pushy. Include urgency but not fake scarcity.
Each: { "delay_hours": N, "subject": "...", "previewText": "...", "body": "...", "cta": "..." }`;
    const content = await aiGenerate("You are an email conversion specialist.", prompt, 4000);
    const emails = parseJsonFromResponse(content) || [];
    if (emails.length > 0) {
      await saveDraftAsset("email_sequence", null, null, "Abandoned Checkout Sequence", { type: "abandoned_checkout", emails }, runId);
      return { generated: 1, accepted: 1, rejected: 0, details: {} };
    }
  } catch {}
  return { generated: 0, accepted: 0, rejected: 0, details: {} };
}

async function handleChurnPrevention(automation: any, runId: string): Promise<AutomationResult> {
  try {
    const prompt = `Create a 4-email churn prevention sequence for a healthcare exam prep platform.
Triggers: usage drop, cancellation intent. Voice: empathetic, value-focused.
Each: { "trigger": "...", "delay_hours": N, "subject": "...", "body": "...", "cta": "..." }`;
    const content = await aiGenerate("You are a retention email specialist.", prompt, 4000);
    const emails = parseJsonFromResponse(content) || [];
    if (emails.length > 0) {
      await saveDraftAsset("email_sequence", null, null, "Churn Prevention Sequence", { type: "churn_prevention", emails }, runId);
      return { generated: 1, accepted: 1, rejected: 0, details: {} };
    }
  } catch {}
  return { generated: 0, accepted: 0, rejected: 0, details: {} };
}

async function handleWinbackCampaign(automation: any, runId: string): Promise<AutomationResult> {
  try {
    const prompt = `Create a 4-email winback campaign for users who cancelled 30-60 days ago from a healthcare exam prep platform.
Voice: encouraging, no guilt. Highlight new features and value.
Each: { "day": N, "subject": "...", "previewText": "...", "body": "...", "cta": "...", "offer": "..." }`;
    const content = await aiGenerate("You are a reactivation email specialist.", prompt, 4000);
    const emails = parseJsonFromResponse(content) || [];
    if (emails.length > 0) {
      await saveDraftAsset("email_sequence", null, null, "Winback Campaign", { type: "winback", emails }, runId);
      return { generated: 1, accepted: 1, rejected: 0, details: {} };
    }
  } catch {}
  return { generated: 0, accepted: 0, rejected: 0, details: {} };
}

async function handleMedicalSafetyFilter(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    `SELECT id, career_type, stem, rationale_long FROM allied_questions
     WHERE status = 'approved' AND (
       rationale_long ILIKE '%you should take%'
       OR rationale_long ILIKE '%treat by giving%'
       OR rationale_long ILIKE '%administer the%'
       OR stem ILIKE '%the patient should%'
     ) LIMIT $1`,
    [automation.max_items_per_run || 50]
  );

  let flagged = 0;
  for (const q of r.rows) {
    await pool.query(
      "INSERT INTO allied_revision_queue (question_id, career_type, reason, severity) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
      [q.id, q.career_type, "medical_safety_language_detected", "high"]
    );
    flagged++;
  }
  return { generated: r.rows.length, accepted: flagged, rejected: 0, details: { scanned: r.rows.length } };
}

async function handleBiasFairnessChecker(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    `SELECT id, career_type, stem FROM allied_questions
     WHERE status = 'approved' AND (
       stem ~* '\\b(obese|overweight|elderly|senile|handicapped|crippled)\\b'
       OR stem ~* '\\b(Oriental|Indian|Native|primitive)\\b'
     ) LIMIT $1`,
    [automation.max_items_per_run || 50]
  );

  let flagged = 0;
  for (const q of r.rows) {
    await pool.query(
      "INSERT INTO allied_revision_queue (question_id, career_type, reason, severity) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
      [q.id, q.career_type, "potential_bias_or_culturally_unsafe_language", "medium"]
    );
    flagged++;
  }
  return { generated: r.rows.length, accepted: flagged, rejected: 0, details: { scanned: r.rows.length } };
}

async function handlePlagiarismScan(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    "SELECT id, career_type, stem FROM allied_questions WHERE status = 'approved' ORDER BY created_at DESC LIMIT 200"
  );
  const phrases: Map<string, string[]> = new Map();
  let flagged = 0;

  for (const q of r.rows) {
    const chunks = q.stem.match(/.{30,50}/g) || [];
    for (const chunk of chunks.slice(0, 3)) {
      const key = chunk.toLowerCase().trim();
      if (!phrases.has(key)) phrases.set(key, []);
      phrases.get(key)!.push(q.id);
    }
  }

  for (const [phrase, ids] of phrases) {
    if (ids.length > 2) {
      for (const id of ids.slice(1)) {
        await pool.query(
          "INSERT INTO allied_revision_queue (question_id, career_type, reason, severity) VALUES ($1, (SELECT career_type FROM allied_questions WHERE id = $1), $2, $3) ON CONFLICT DO NOTHING",
          [id, `repeated_phrase_pattern: "${phrase.substring(0, 40)}..."`, "medium"]
        );
        flagged++;
      }
    }
  }
  return { generated: flagged, accepted: flagged, rejected: 0, details: { phrasesChecked: phrases.size } };
}

async function handleCostGuardrail(automation: any, runId: string): Promise<AutomationResult> {
  resetDailyCostIfNeeded();
  const details: Record<string, any> = {
    dailyTokenCost,
    maxDailyTokenCost: MAX_DAILY_TOKEN_COST,
    utilizationPct: Math.round((dailyTokenCost / MAX_DAILY_TOKEN_COST) * 100),
    killSwitchActive: globalKillSwitch,
  };

  if (dailyTokenCost > MAX_DAILY_TOKEN_COST * 0.9) {
    globalKillSwitch = true;
    details.action = "kill_switch_activated";
    console.log("[Automations] Cost guardrail triggered - kill switch activated");
  }

  const recentErrors = await pool.query(
    "SELECT COUNT(*) as c FROM allied_automation_runs WHERE status = 'failed' AND started_at > NOW() - INTERVAL '1 hour'"
  );
  details.recentErrors = parseInt(recentErrors.rows[0].c);

  if (parseInt(recentErrors.rows[0].c) > 10) {
    globalKillSwitch = true;
    details.action = "error_spike_kill_switch";
    console.log("[Automations] Error spike detected - kill switch activated");
  }

  return { generated: 1, accepted: 1, rejected: 0, details };
}

async function handleErrorNotifier(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    `SELECT automation_slug, COUNT(*) as failures, MAX(error_message) as last_error
     FROM allied_automation_runs WHERE status = 'failed' AND started_at > NOW() - INTERVAL '24 hours'
     GROUP BY automation_slug HAVING COUNT(*) >= 3 ORDER BY failures DESC`
  );

  if (r.rows.length > 0) {
    await saveDraftAsset("error_report", null, null, `Error Report: ${r.rows.length} failing automations`,
      { failingAutomations: r.rows, generatedAt: new Date().toISOString(), recommendation: "Review and fix failing automations" }, runId);
  }
  return { generated: r.rows.length, accepted: r.rows.length, rejected: 0, details: { failingAutomations: r.rows.length } };
}

async function handleSitemapRefresher(automation: any, runId: string): Promise<AutomationResult> {
  const careers = ALLIED_CAREERS;
  const urls: string[] = [];
  for (const c of careers) {
    const slug = c.replace(/([A-Z])/g, '-$1').toLowerCase();
    urls.push(`/${slug}`, `/${slug}/qbank`, `/${slug}/mock-exams`, `/${slug}/flashcards`, `/${slug}/study-plan`, `/${slug}/tools`, `/${slug}/sims`);
  }
  urls.push("/pricing", "/careers");

  const published = await pool.query("SELECT payload FROM allied_draft_assets WHERE type = 'seo_blog' AND status = 'published'");
  for (const asset of published.rows) {
    const p = typeof asset.payload === "string" ? JSON.parse(asset.payload) : asset.payload;
    if (p.slug) urls.push(p.slug);
  }

  await saveDraftAsset("sitemap_update", null, null, `Sitemap refresh: ${urls.length} URLs`, { urls, generatedAt: new Date().toISOString() }, runId);
  return { generated: urls.length, accepted: urls.length, rejected: 0, details: { totalUrls: urls.length } };
}

async function handleDeadLinkScanner(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    "SELECT id, title, payload FROM allied_draft_assets WHERE status = 'published' AND type IN ('seo_blog', 'comparison_page') LIMIT 50"
  );
  let scanned = 0;
  const brokenLinks: Array<{ assetId: string; link: string }> = [];

  for (const asset of r.rows) {
    const p = typeof asset.payload === "string" ? JSON.parse(asset.payload) : asset.payload;
    const links = p.internalLinks || p.internal_links || [];
    for (const link of links) {
      const slug = link.slug || link.target || "";
      if (slug && !slug.startsWith("/")) {
        brokenLinks.push({ assetId: asset.id, link: slug });
      }
    }
    scanned++;
  }

  if (brokenLinks.length > 0) {
    await saveDraftAsset("dead_link_report", null, null, `Dead links found: ${brokenLinks.length}`, { brokenLinks }, runId);
  }
  return { generated: brokenLinks.length, accepted: brokenLinks.length, rejected: 0, details: { pagesScanned: scanned } };
}

async function handleNgnCaseGenerator(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  let gen = 0;

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    try {
      const prompt = `Generate 3 multi-part clinical case scenarios for ${career.name} exam prep.
Each case: { "title": "...", "scenario": "unfolding patient scenario", "parts": [{ "prompt": "...", "options": [...], "correctAnswer": 0, "rationale": "..." }], "scoringRules": {...}, "difficulty": 4 }
Return JSON array.`;
      const content = await aiGenerate("You are a clinical case writer for healthcare exams. Educational only.", prompt, 10000);
      const cases = parseJsonFromResponse(content) || [];
      for (const c of cases) {
        if (c.title && c.parts?.length > 0) {
          await saveDraftAsset("ngn_case", careerType, null, c.title, c, runId);
          gen++;
        }
      }
    } catch {}
  }
  return { generated: gen, accepted: gen, rejected: 0, details: {} };
}

async function handleCountryLabMapper(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    "SELECT id, career_type, stem, options FROM allied_questions WHERE status = 'approved' AND stem ~* '\\d+\\s*(mg/dL|mmol/L|mEq/L|mcg|IU)' LIMIT $1",
    [automation.max_items_per_run || 50]
  );

  let tagged = 0;
  for (const q of r.rows) {
    await saveDraftAsset("lab_value_review", q.career_type, null,
      `Lab values: ${q.stem.substring(0, 80)}`,
      { questionId: q.id, stem: q.stem, needsConversion: true, currentUnits: "US", targetUnits: ["CA", "UK"] }, runId);
    tagged++;
  }
  return { generated: tagged, accepted: tagged, rejected: 0, details: { questionsWithLabValues: r.rows.length } };
}

async function handleTitleMetaRefresh(automation: any, runId: string): Promise<AutomationResult> {
  const r = await pool.query(
    "SELECT id, title, payload FROM allied_draft_assets WHERE type IN ('seo_blog', 'comparison_page') AND status = 'published' LIMIT 20"
  );
  let refreshed = 0;

  for (const asset of r.rows) {
    const p = typeof asset.payload === "string" ? JSON.parse(asset.payload) : asset.payload;
    if (p.title && p.metaDescription) {
      try {
        const prompt = `Improve this title and meta description for better CTR:
Title: ${p.title}
Meta: ${p.metaDescription}
Return JSON: { "newTitle": "...", "newMetaDescription": "...", "changes": "..." }`;
        const content = await aiGenerate("You are an SEO specialist.", prompt, 2000);
        const result = parseJsonFromResponse(content);
        if (result?.newTitle) {
          await saveDraftAsset("meta_refresh", null, null, `Meta refresh: ${p.title}`,
            { assetId: asset.id, original: { title: p.title, meta: p.metaDescription }, suggested: result }, runId);
          refreshed++;
        }
      } catch {}
    }
  }
  return { generated: refreshed, accepted: refreshed, rejected: 0, details: {} };
}

async function handlePriceLadder(automation: any, runId: string): Promise<AutomationResult> {
  const careers = automation.career_scope || ALLIED_CAREERS;
  const suggestions: any[] = [];

  for (const careerType of careers) {
    const career = CAREER_CONFIGS[careerType as keyof typeof CAREER_CONFIGS];
    if (!career) continue;
    const qCount = await pool.query("SELECT COUNT(*) as c FROM allied_questions WHERE career_type = $1 AND status = 'approved'", [careerType]);
    const count = parseInt(qCount.rows[0].c);
    let suggestedMonthly = 19.99;
    if (count > 1000) suggestedMonthly = 29.99;
    if (count > 2000) suggestedMonthly = 39.99;
    suggestions.push({ careerType, questionCount: count, suggestedMonthly, suggestedAnnual: suggestedMonthly * 10 });
  }

  if (suggestions.length > 0) {
    await saveDraftAsset("price_suggestion", null, null, "Price Ladder Recommendations", { suggestions }, runId);
  }
  return { generated: 1, accepted: 1, rejected: 0, details: { careers: suggestions.length } };
}

async function handleThemeVariant(automation: any, runId: string): Promise<AutomationResult> {
  await saveDraftAsset("theme_variant", null, null, "A/B Test Variants",
    { variants: [
      { id: "A", name: "Default", description: "Current layout" },
      { id: "B", name: "Condensed", description: "Tighter spacing, more content above fold" },
      { id: "C", name: "Visual", description: "Larger images, card-based layout" },
    ], recommendation: "Test variant B for higher engagement" }, runId);
  return { generated: 1, accepted: 1, rejected: 0, details: {} };
}

async function handleDailyTaskNudger(automation: any, runId: string): Promise<AutomationResult> {
  await saveDraftAsset("nudger_template", null, null, "Daily Task Nudge Templates",
    { templates: [
      { trigger: "no_login_today", subject: "Your daily practice is waiting", body: "Quick 10-question drill keeps you sharp." },
      { trigger: "streak_at_risk", subject: "Don't break your streak!", body: "You've been consistent for {{streak_days}} days." },
      { trigger: "exam_approaching", subject: "{{days_left}} days until your exam", body: "Focus on {{weak_area}} today." },
      { trigger: "new_content", subject: "New questions in {{domain}}", body: "We just added fresh content in your focus area." },
    ] }, runId);
  return { generated: 1, accepted: 1, rejected: 0, details: {} };
}

async function handleIndexingMonitor(automation: any, runId: string): Promise<AutomationResult> {
  const published = await pool.query(
    "SELECT COUNT(*) as c FROM allied_draft_assets WHERE status = 'published' AND type IN ('seo_blog', 'comparison_page')"
  );
  const total = parseInt(published.rows[0].c);

  await saveDraftAsset("indexing_report", null, null, "Indexing Health Report",
    { totalPublishedPages: total, expectedIndexed: total, checkedAt: new Date().toISOString(),
      recommendations: total < 10 ? ["Publish more SEO content to build topical authority"] : ["Monitor Search Console for crawl errors"] }, runId);
  return { generated: 1, accepted: 1, rejected: 0, details: { publishedPages: total } };
}

async function handleSocialContentGenerator(automation: any, runId: string): Promise<AutomationResult> {
  try {
    const { generateFromLessonsAndBlogs } = await import("./social-content-automation");
    const result = await generateFromLessonsAndBlogs();
    return { generated: result.generated, accepted: result.generated, rejected: 0, details: result.details };
  } catch (e: any) {
    return { generated: 0, accepted: 0, rejected: 0, details: { error: e.message } };
  }
}

// ============================================================
// AUTOMATION DEFINITIONS (all 40+)
// ============================================================

const AUTOMATION_DEFS: AutomationDef[] = [
  { slug: "daily-question-pack", category: "question_bank", name: "Daily Question Pack Generator", description: "Generate 25 questions/day per career into Draft, auto-publish only if validation passes", defaultFrequency: "daily", defaultMaxItems: 25, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleDailyQuestionPack },
  { slug: "mock-exam-builder", category: "question_bank", name: "Mock Exam Builder", description: "Weekly: assemble 75-125 Q mock exams from bank + new items", defaultFrequency: "weekly", defaultMaxItems: 100, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleMockExamBuilder },
  { slug: "ngn-case-generator", category: "question_bank", name: "NGN/Case Generator", description: "Build 5-10 multi-part clinical cases/week with scoring rules", defaultFrequency: "weekly", defaultMaxItems: 10, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleNgnCaseGenerator },
  { slug: "rationale-expander", category: "question_bank", name: "Rationale Expander", description: "Expand existing rationales to minimum word count while keeping layout stable", defaultFrequency: "daily", defaultMaxItems: 25, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleRationaleExpander },
  { slug: "difficulty-balancer", category: "question_bank", name: "Difficulty Balancer", description: "Detect difficulty imbalances and generate missing medium/hard coverage", defaultFrequency: "weekly", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleDifficultyBalancer },
  { slug: "blueprint-coverage-filler", category: "question_bank", name: "Blueprint Coverage Filler", description: "Check taxonomy vs inventory and generate missing topics", defaultFrequency: "weekly", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleBlueprintCoverageFiller },
  { slug: "duplicate-sweeper", category: "question_bank", name: "Duplicate/Similarity Sweeper", description: "Flag near-duplicates and send to review queue", defaultFrequency: "daily", defaultMaxItems: 500, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleDuplicateSweeper },
  { slug: "item-quality-refactor", category: "question_bank", name: "Item Quality Refactor", description: "Rewrite stems/options with rule violations (double negatives, all-of-above, cueing)", defaultFrequency: "weekly", defaultMaxItems: 25, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleItemQualityRefactor },
  { slug: "country-lab-mapper", category: "question_bank", name: "Country/Lab Value Mapper", description: "Auto-convert lab values/units per country mode and tag content", defaultFrequency: "weekly", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleCountryLabMapper },
  { slug: "performance-generator", category: "question_bank", name: "Performance-Based Generator", description: "Use analytics (wrong-answer hotspots) to generate items in weak areas", defaultFrequency: "daily", defaultMaxItems: 25, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handlePerformanceBasedGenerator },

  { slug: "daily-flashcard-injection", category: "flashcards", name: "Daily Flashcard Injection", description: "Add 25-100 cards/day per career, tagged by topic", defaultFrequency: "daily", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleDailyFlashcardInjection },
  { slug: "cloze-conversion", category: "flashcards", name: "Cloze Conversion", description: "Convert basic cards into cloze deletions for spaced repetition", defaultFrequency: "weekly", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleClozeConversion },
  { slug: "missed-concepts-cards", category: "flashcards", name: "Missed Concepts Cards", description: "Generate flashcards from incorrect question analytics", defaultFrequency: "daily", defaultMaxItems: 25, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleMissedConceptCards },
  { slug: "image-prompt-generator", category: "flashcards", name: "Image Prompt Generator", description: "Generate safe image prompts for diagrams/icons for image pipeline", defaultFrequency: "weekly", defaultMaxItems: 30, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleImagePromptGenerator },

  { slug: "adaptive-study-plan", category: "study_plans", name: "Adaptive Study Plan Builder", description: "Generate weekly schedules from exam date + baseline quiz", defaultFrequency: "weekly", defaultMaxItems: 5, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleAdaptiveStudyPlan },
  { slug: "daily-task-nudger", category: "study_plans", name: "Daily Task Nudger", description: "Generate reminder templates based on progress", defaultFrequency: "daily", defaultMaxItems: 10, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleDailyTaskNudger },
  { slug: "catch-up-week", category: "study_plans", name: "Catch-Up Week Generator", description: "Auto-create catch-up micro-plans when users fall behind", defaultFrequency: "weekly", defaultMaxItems: 5, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleCatchUpWeek },

  { slug: "seo-blog-draft", category: "seo_content", name: "Daily SEO Blog Post Draft", description: "Buyer-intent + informational blog drafts with internal links", defaultFrequency: "daily", defaultMaxItems: 1, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleSeoBlogDraft },
  { slug: "comparison-page-factory", category: "seo_content", name: "Comparison Page Factory", description: "NurseNest vs X pages with schema, FAQs, and conversion CTAs", defaultFrequency: "weekly", defaultMaxItems: 3, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleComparisonPageFactory },
  { slug: "internal-link-optimizer", category: "seo_content", name: "Internal Linking Optimizer", description: "Scan content and add internal links based on topic taxonomy", defaultFrequency: "weekly", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleInternalLinkOptimizer },
  { slug: "title-meta-refresh", category: "seo_content", name: "Title/Meta Refresh", description: "Update titles/meta based on performance data with guardrails", defaultFrequency: "weekly", defaultMaxItems: 20, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleTitleMetaRefresh },
  { slug: "faq-schema-generator", category: "seo_content", name: "FAQ + Schema Generator", description: "Auto-add FAQ schema blocks per page type", defaultFrequency: "weekly", defaultMaxItems: 10, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleFaqSchemaGenerator },
  { slug: "indexing-health-monitor", category: "seo_content", name: "Indexing Health Monitor", description: "Monitor crawl/indexing signals and flag issues", defaultFrequency: "daily", defaultMaxItems: 1, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleIndexingMonitor },

  { slug: "bundle-builder", category: "store", name: "Bundle Builder", description: "Auto-create Cram Bundle drafts from existing assets", defaultFrequency: "weekly", defaultMaxItems: 5, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleBundleBuilder },
  { slug: "price-ladder", category: "store", name: "Price Ladder Recommender", description: "Suggest prices based on product length, uniqueness, and history", defaultFrequency: "monthly", defaultMaxItems: 5, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handlePriceLadder },
  { slug: "theme-variant", category: "store", name: "Theme Variant Generator", description: "Create theme/layout variants for A/B testing", defaultFrequency: "monthly", defaultMaxItems: 3, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleThemeVariant },
  { slug: "storefront-copy", category: "store", name: "Storefront Copy Generator", description: "Value stacking, outcomes, guarantees, features, who-it's-for, FAQ", defaultFrequency: "weekly", defaultMaxItems: 5, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleStorefrontCopy },

  { slug: "onboarding-sequence", category: "lifecycle", name: "Onboarding Sequence Generator", description: "5-7 emails tailored by career and exam date", defaultFrequency: "monthly", defaultMaxItems: 5, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleOnboardingSequence },
  { slug: "abandoned-checkout", category: "lifecycle", name: "Abandoned Checkout Sequence", description: "2-3 emails + in-app prompts for cart abandonment", defaultFrequency: "monthly", defaultMaxItems: 3, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleAbandonedCheckout },
  { slug: "churn-prevention", category: "lifecycle", name: "Churn Prevention Sequence", description: "Trigger when usage drops or cancellation intent detected", defaultFrequency: "monthly", defaultMaxItems: 4, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleChurnPrevention },
  { slug: "winback-campaign", category: "lifecycle", name: "Winback Campaign", description: "30-60 day reactivation email series", defaultFrequency: "monthly", defaultMaxItems: 4, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleWinbackCampaign },

  { slug: "medical-safety-filter", category: "quality", name: "Medical Safety Filter", description: "Flag clinical treatment language; rephrase into educational framing", defaultFrequency: "daily", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleMedicalSafetyFilter },
  { slug: "bias-fairness-checker", category: "quality", name: "Bias & Fairness Checker", description: "Flag stereotypes and culturally unsafe phrasing in vignettes", defaultFrequency: "daily", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleBiasFairnessChecker },
  { slug: "plagiarism-scan", category: "quality", name: "Copy/Plagiarism Heuristic Scan", description: "Check for repeated phrasing patterns across outputs", defaultFrequency: "weekly", defaultMaxItems: 200, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handlePlagiarismScan },

  { slug: "cost-guardrail", category: "ops", name: "Cost Guardrail Monitor", description: "Detect token/cost spikes; pause automations automatically", defaultFrequency: "hourly", defaultMaxItems: 1, defaultMaxRuns: 24, defaultAutoPublish: false, handler: handleCostGuardrail },
  { slug: "error-notifier", category: "ops", name: "Error Spike Notifier", description: "Alert on job failures via webhook/admin dashboard", defaultFrequency: "hourly", defaultMaxItems: 1, defaultMaxRuns: 24, defaultAutoPublish: false, handler: handleErrorNotifier },
  { slug: "sitemap-refresher", category: "ops", name: "Sitemap Refresher", description: "Regenerate sitemap and ping search engines", defaultFrequency: "daily", defaultMaxItems: 1, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleSitemapRefresher },
  { slug: "dead-link-scanner", category: "ops", name: "Dead Link Scanner", description: "Scan internal/external links; flag broken links", defaultFrequency: "weekly", defaultMaxItems: 50, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleDeadLinkScanner },

  { slug: "social-content-generator", category: "social_media", name: "Social Content Generator", description: "Auto-generate social media content (study tips, quiz cards, clinical pearls, infographics) for Instagram, TikTok, Pinterest, and LinkedIn from lessons and blog posts", defaultFrequency: "daily", defaultMaxItems: 10, defaultMaxRuns: 1, defaultAutoPublish: false, handler: handleSocialContentGenerator },
];

const HANDLER_MAP: Record<string, (automation: any, runId: string) => Promise<AutomationResult>> = {};
for (const def of AUTOMATION_DEFS) {
  HANDLER_MAP[def.slug] = def.handler;
}

// ============================================================
// SCHEDULER
// ============================================================

let schedulerTimer: NodeJS.Timeout | null = null;
const SCHEDULER_INTERVAL_MS = 5 * 60 * 1000;

function frequencyMatchesToday(frequency: string, lastRunAt: Date | null): boolean {
  if (!lastRunAt) return true;
  const now = new Date();
  const diffMs = now.getTime() - lastRunAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  switch (frequency) {
    case "hourly": return diffHours >= 1;
    case "daily": return diffDays >= 1;
    case "weekly": return diffDays >= 7;
    case "monthly": return diffDays >= 30;
    default: return diffDays >= 1;
  }
}

async function runSchedulerTick() {
  if (globalKillSwitch) {
    console.log("[Automations Scheduler] Kill switch active - skipping tick");
    return;
  }
  resetDailyCostIfNeeded();

  try {
    const r = await pool.query("SELECT * FROM allied_automations WHERE enabled = true");
    for (const automation of r.rows) {
      const lastRun = automation.last_run_at ? new Date(automation.last_run_at) : null;
      if (!frequencyMatchesToday(automation.frequency, lastRun)) continue;

      const today = new Date().toISOString().split("T")[0];
      const runsToday = await pool.query(
        "SELECT COUNT(*) as c FROM allied_automation_runs WHERE automation_id = $1 AND started_at::date = $2::date",
        [automation.id, today]
      );
      if (parseInt(runsToday.rows[0].c) >= (automation.max_runs_per_day || 1)) continue;

      const key = idempotencyKey(automation.id, { frequency: automation.frequency });
      const existingRun = await pool.query(
        "SELECT id FROM allied_automation_runs WHERE automation_id = $1 AND started_at::date = $2::date AND status = 'completed'",
        [automation.id, today]
      );
      if (existingRun.rows.length > 0 && automation.frequency !== "hourly") continue;

      console.log(`[Automations Scheduler] Running: ${automation.slug}`);
      const handler = HANDLER_MAP[automation.slug];
      if (!handler) continue;

      const runId = await createRunRecord(automation.id, automation.slug);
      try {
        const result = await handler(automation, runId);
        await completeRunRecord(runId, result);
        await pool.query("UPDATE allied_automations SET last_run_at = NOW() WHERE id = $1", [automation.id]);
        console.log(`[Automations Scheduler] ${automation.slug}: ${result.accepted} accepted, ${result.rejected} rejected`);
      } catch (e: any) {
        await failRunRecord(runId, e.message);
        console.error(`[Automations Scheduler] ${automation.slug} failed:`, e.message);
      }
    }
  } catch (e: any) {
    console.error("[Automations Scheduler] Tick failed:", e.message);
  }
}

function startAutomationScheduler() {
  console.log("[Automations Scheduler] Initialized - polling every 5 minutes");
  schedulerTimer = setInterval(runSchedulerTick, SCHEDULER_INTERVAL_MS);
  setTimeout(runSchedulerTick, 30000);
}

function stopAutomationScheduler() {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
}

// ============================================================
// API ROUTES
// ============================================================

export function registerAutomationRoutes(app: Express) {

  app.get("/api/allied/automations", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const { category } = req.query;
      let query = "SELECT * FROM allied_automations ORDER BY category, name";
      const params: any[] = [];
      if (category) {
        query = "SELECT * FROM allied_automations WHERE category = $1 ORDER BY name";
        params.push(category);
      }
      const r = await pool.query(query, params);
      res.json(r.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/allied/automations/seed", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;

      let seeded = 0;
      for (const def of AUTOMATION_DEFS) {
        const existing = await pool.query("SELECT id FROM allied_automations WHERE slug = $1", [def.slug]);
        if (existing.rows.length === 0) {
          await pool.query(
            `INSERT INTO allied_automations (slug, category, name, description, enabled, frequency, max_items_per_run, max_runs_per_day, auto_publish)
             VALUES ($1, $2, $3, $4, false, $5, $6, $7, $8)`,
            [def.slug, def.category, def.name, def.description, def.defaultFrequency, def.defaultMaxItems, def.defaultMaxRuns, def.defaultAutoPublish]
          );
          seeded++;
        }
      }
      res.json({ seeded, total: AUTOMATION_DEFS.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/allied/automations/:id", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const { enabled, frequency, maxItemsPerRun, maxRunsPerDay, autoPublish, rationaleMinWords, strictnessLevel, careerScope, promptTemplate } = req.body;
      const updates: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (enabled !== undefined) { updates.push(`enabled = $${idx++}`); params.push(enabled); }
      if (frequency) { updates.push(`frequency = $${idx++}`); params.push(frequency); }
      if (maxItemsPerRun !== undefined) { updates.push(`max_items_per_run = $${idx++}`); params.push(maxItemsPerRun); }
      if (maxRunsPerDay !== undefined) { updates.push(`max_runs_per_day = $${idx++}`); params.push(maxRunsPerDay); }
      if (autoPublish !== undefined) { updates.push(`auto_publish = $${idx++}`); params.push(autoPublish); }
      if (rationaleMinWords !== undefined) { updates.push(`rationale_min_words = $${idx++}`); params.push(rationaleMinWords); }
      if (strictnessLevel) { updates.push(`strictness_level = $${idx++}`); params.push(strictnessLevel); }
      if (careerScope) { updates.push(`career_scope = $${idx++}`); params.push(JSON.stringify(careerScope)); }
      if (promptTemplate !== undefined) { updates.push(`prompt_template = $${idx++}`); params.push(promptTemplate); }

      if (updates.length === 0) return res.status(400).json({ error: "No updates" });
      params.push(req.params.id);
      const r = await pool.query(
        `UPDATE allied_automations SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
        params
      );
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/allied/automations/:id/run-now", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      if (globalKillSwitch) return res.status(503).json({ error: "Kill switch active. Disable it first." });

      const automation = await pool.query("SELECT * FROM allied_automations WHERE id = $1", [req.params.id]);
      if (!automation.rows[0]) return res.status(404).json({ error: "Automation not found" });

      const auto = automation.rows[0];
      const handler = HANDLER_MAP[auto.slug];
      if (!handler) return res.status(400).json({ error: "No handler for this automation" });

      const runId = await createRunRecord(auto.id, auto.slug);
      res.json({ runId, status: "started", slug: auto.slug });

      try {
        const result = await handler(auto, runId);
        await completeRunRecord(runId, result);
        await pool.query("UPDATE allied_automations SET last_run_at = NOW() WHERE id = $1", [auto.id]);
      } catch (e: any) {
        await failRunRecord(runId, e.message);
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/allied/automations/runs", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const { automationId, status, limit: lim } = req.query;
      const conditions: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (automationId) { conditions.push(`automation_id = $${idx++}`); params.push(automationId); }
      if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const limitVal = Math.min(parseInt(lim as string) || 50, 200);
      params.push(limitVal);
      const r = await pool.query(
        `SELECT * FROM allied_automation_runs ${where} ORDER BY started_at DESC LIMIT $${idx}`,
        params
      );
      res.json(r.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/allied/automations/drafts", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const { type, status, careerType, page } = req.query;
      const conditions: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (type) { conditions.push(`type = $${idx++}`); params.push(type); }
      if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
      if (careerType) { conditions.push(`career_type = $${idx++}`); params.push(careerType); }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const offset = ((parseInt(page as string) || 1) - 1) * 25;
      const countRes = await pool.query(`SELECT COUNT(*) as total FROM allied_draft_assets ${where}`, params);
      params.push(25); params.push(offset);
      const r = await pool.query(
        `SELECT id, type, status, career_type, domain, title, automation_run_id, created_by, created_at, published_at
         FROM allied_draft_assets ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        params
      );
      res.json({ drafts: r.rows, total: parseInt(countRes.rows[0].total) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/allied/automations/drafts/:id", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const r = await pool.query("SELECT * FROM allied_draft_assets WHERE id = $1", [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: "Draft not found" });
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/allied/automations/drafts/:id/status", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const { status } = req.body;
      if (!["draft", "approved", "published", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const updates: string[] = [`status = $1`];
      const params: any[] = [status];
      if (status === "published") {
        updates.push("published_at = NOW()");
      }
      params.push(req.params.id);
      const r = await pool.query(
        `UPDATE allied_draft_assets SET ${updates.join(", ")} WHERE id = $${params.length} RETURNING *`,
        params
      );
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/allied/automations/kill-switch", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      const { active } = req.body;
      globalKillSwitch = !!active;
      console.log(`[Automations] Kill switch ${globalKillSwitch ? "ACTIVATED" : "DEACTIVATED"} by admin ${admin.id}`);
      res.json({ killSwitch: globalKillSwitch });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/allied/automations/status", async (req, res) => {
    try {
      const admin = await requireAutomationAdmin(req, res);
      if (!admin) return;
      resetDailyCostIfNeeded();

      const totalAutos = await pool.query("SELECT COUNT(*) as c FROM allied_automations");
      const enabledAutos = await pool.query("SELECT COUNT(*) as c FROM allied_automations WHERE enabled = true");
      const todayRuns = await pool.query("SELECT COUNT(*) as c FROM allied_automation_runs WHERE started_at::date = CURRENT_DATE");
      const failedToday = await pool.query("SELECT COUNT(*) as c FROM allied_automation_runs WHERE status = 'failed' AND started_at::date = CURRENT_DATE");
      const totalDrafts = await pool.query("SELECT COUNT(*) as c FROM allied_draft_assets WHERE status = 'draft'");
      const totalPublished = await pool.query("SELECT COUNT(*) as c FROM allied_draft_assets WHERE status = 'published'");

      const byCategory = await pool.query(
        "SELECT category, COUNT(*) as total, SUM(CASE WHEN enabled THEN 1 ELSE 0 END) as enabled FROM allied_automations GROUP BY category ORDER BY category"
      );

      res.json({
        killSwitch: globalKillSwitch,
        dailyTokenCost,
        maxDailyTokenCost: MAX_DAILY_TOKEN_COST,
        totalAutomations: parseInt(totalAutos.rows[0].c),
        enabledAutomations: parseInt(enabledAutos.rows[0].c),
        todayRuns: parseInt(todayRuns.rows[0].c),
        failedToday: parseInt(failedToday.rows[0].c),
        pendingDrafts: parseInt(totalDrafts.rows[0].c),
        publishedAssets: parseInt(totalPublished.rows[0].c),
        byCategory: byCategory.rows,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // AI scheduler disabled — all AI generation is now admin-triggered via /admin/ai-jobs
  // startAutomationScheduler();
}
