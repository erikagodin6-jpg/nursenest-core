import { pool } from "./storage";
import { routeAIRequest, getKillSwitch } from "./ai-provider-router";
import { isKillSwitchActive, getDailySpend, getSpendCaps } from "./ai-job-queue";
import crypto from "crypto";

const CONTENT_TYPES = ["blog_post", "flashcards", "lessons", "exam_questions", "specialty_guides"] as const;
type ContentType = typeof CONTENT_TYPES[number];

const BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
  "Renal/Urinary", "Endocrine", "Musculoskeletal", "Integumentary",
  "Hematological", "Immunological", "Reproductive", "Mental Health",
  "Pediatrics", "Maternal/Newborn",
];

const SEO_BLOG_TOPICS = [
  "How to Pass the NCLEX-RN Exam on Your First Try",
  "Top Study Tips for Paramedic Students",
  "Best Flashcards for Nursing Pharmacology",
  "How to Pass the Respiratory Therapy Exam",
  "NCLEX-RN vs NCLEX-PN: What's the Difference?",
  "Essential Lab Values Every Nurse Must Know",
  "Understanding ECG Rhythms for Nursing Students",
  "Diabetes Management: A Nursing Study Guide",
  "Pediatric Nursing: Key Assessment Findings",
  "Mental Health Nursing: Therapeutic Communication Techniques",
  "Cardiac Medications Every Nurse Should Know",
  "Fluid and Electrolyte Imbalances: A Complete Guide",
  "Nursing Care Plans: Step-by-Step Guide",
  "How to Study for the NCLEX in 30 Days",
  "Understanding Arterial Blood Gases (ABGs)",
  "Pharmacology Study Tips for Nursing Students",
  "Emergency Nursing: Triage Assessment Guide",
  "Maternal Newborn Nursing: Labor and Delivery",
  "Respiratory Assessment: A Clinical Guide",
  "Infection Control Nursing: Best Practices",
  "Wound Care Management for Nurses",
  "Nursing Ethics and Legal Considerations",
  "Critical Thinking in Nursing: NCLEX Strategies",
  "Dosage Calculation Tips for Nursing Students",
  "Neurological Assessment: Glasgow Coma Scale Guide",
  "Understanding Shock Types in Nursing",
  "Surgical Nursing: Pre and Post-Op Care",
  "Nutrition in Nursing: Key Concepts",
  "Pain Management Strategies in Nursing",
  "Nursing Leadership and Management Tips",
];

interface ValidationResult {
  passed: boolean;
  checks: { name: string; passed: boolean; detail: string }[];
  score: number;
}

interface GapAnalysis {
  underrepresentedSystems: { system: string; count: number; targetCount: number }[];
  lowCoverageTopics: string[];
  suggestedKeywords: string[];
  totalContentByType: Record<string, number>;
}

export async function ensureTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_growth_schedules (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      content_type TEXT NOT NULL,
      cadence TEXT NOT NULL DEFAULT 'daily',
      enabled BOOLEAN DEFAULT false,
      items_per_run INTEGER DEFAULT 5,
      run_time_hour INTEGER DEFAULT 3,
      max_daily_runs INTEGER DEFAULT 1,
      priority_topics TEXT[] DEFAULT '{}',
      target_tier TEXT DEFAULT 'rn',
      last_run_at TIMESTAMP,
      next_run_at TIMESTAMP,
      total_runs INTEGER DEFAULT 0,
      total_items_generated INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_growth_runs (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      schedule_id VARCHAR REFERENCES content_growth_schedules(id),
      content_type TEXT NOT NULL,
      target_tier TEXT DEFAULT 'rn',
      status TEXT DEFAULT 'queued',
      target_count INTEGER DEFAULT 0,
      generated_count INTEGER DEFAULT 0,
      accepted_count INTEGER DEFAULT 0,
      rejected_count INTEGER DEFAULT 0,
      validation_results JSONB DEFAULT '[]',
      topics_prioritized JSONB DEFAULT '[]',
      gap_analysis JSONB DEFAULT '{}',
      error_message TEXT,
      triggered_by TEXT DEFAULT 'schedule',
      estimated_cost DOUBLE PRECISION DEFAULT 0,
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);
}

async function checkSafetyControls(): Promise<{ allowed: boolean; reason?: string }> {
  if (getKillSwitch()) {
    return { allowed: false, reason: "AI kill switch is active (provider router)" };
  }

  const killSwitch = await isKillSwitchActive();
  if (killSwitch) {
    return { allowed: false, reason: "AI kill switch is active (job queue)" };
  }

  const caps = await getSpendCaps();
  const dailySpend = await getDailySpend();
  if (dailySpend >= caps.dailyCap) {
    return { allowed: false, reason: `Daily spend cap reached ($${dailySpend.toFixed(2)} / $${caps.dailyCap})` };
  }

  return { allowed: true };
}

export async function analyzeContentGaps(): Promise<GapAnalysis> {
  const examCounts = await pool.query(`
    SELECT body_system, COUNT(*)::int as count
    FROM exam_questions
    WHERE status IN ('approved', 'published', 'needs_review')
    GROUP BY body_system
  `);

  const flashcardCounts = await pool.query(`
    SELECT COALESCE(category, 'Uncategorized') as category, COUNT(*)::int as count
    FROM flashcard_bank
    WHERE status IN ('approved', 'published', 'needs_review', 'draft')
    GROUP BY category
  `);

  const blogCounts = await pool.query(`
    SELECT body_system, COUNT(*)::int as count
    FROM content_items
    WHERE type = 'blog_post' OR type = 'lesson'
    GROUP BY body_system
  `);

  const lessonCounts = await pool.query(`
    SELECT category, COUNT(*)::int as count
    FROM lessons
    GROUP BY category
  `);

  const systemCounts = new Map<string, number>();
  for (const row of examCounts.rows) {
    const sys = row.body_system || "Unknown";
    systemCounts.set(sys, (systemCounts.get(sys) || 0) + row.count);
  }
  for (const row of blogCounts.rows) {
    const sys = row.body_system || "Unknown";
    systemCounts.set(sys, (systemCounts.get(sys) || 0) + row.count);
  }

  const avgCount = systemCounts.size > 0
    ? Array.from(systemCounts.values()).reduce((a, b) => a + b, 0) / BODY_SYSTEMS.length
    : 50;
  const targetCount = Math.max(Math.ceil(avgCount * 1.2), 50);

  const underrepresentedSystems = BODY_SYSTEMS
    .map(system => ({
      system,
      count: systemCounts.get(system) || 0,
      targetCount,
    }))
    .filter(s => s.count < targetCount)
    .sort((a, b) => a.count - b.count);

  const existingTitles = await pool.query(
    "SELECT LOWER(title) as title FROM content_items WHERE type IN ('blog_post', 'lesson') LIMIT 500"
  );
  const existingTitleSet = new Set(existingTitles.rows.map((r: any) => r.title));

  const suggestedKeywords = SEO_BLOG_TOPICS
    .filter(topic => !existingTitleSet.has(topic.toLowerCase()))
    .slice(0, 10);

  const lowCoverageTopics = underrepresentedSystems.slice(0, 5).map(s => s.system);

  const totalContentByType: Record<string, number> = {};

  const examTotal = await pool.query("SELECT COUNT(*)::int as c FROM exam_questions WHERE status IN ('approved', 'published')");
  totalContentByType.exam_questions = examTotal.rows[0]?.c || 0;

  const fcTotal = await pool.query("SELECT COUNT(*)::int as c FROM flashcard_bank WHERE status IN ('approved', 'published', 'draft')");
  totalContentByType.flashcards = fcTotal.rows[0]?.c || 0;

  const blogTotal = await pool.query("SELECT COUNT(*)::int as c FROM content_items WHERE type IN ('blog_post', 'lesson')");
  totalContentByType.blog_posts = blogTotal.rows[0]?.c || 0;

  const lessonTotal = await pool.query("SELECT COUNT(*)::int as c FROM lessons");
  totalContentByType.lessons = lessonTotal.rows[0]?.c || 0;

  return {
    underrepresentedSystems,
    lowCoverageTopics,
    suggestedKeywords,
    totalContentByType,
  };
}

export function validateBlogPost(title: string, content: string, metadata: any): ValidationResult {
  const checks: { name: string; passed: boolean; detail: string }[] = [];

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  checks.push({
    name: "minimum_word_count",
    passed: wordCount >= 1200,
    detail: `Word count: ${wordCount} (minimum: 1200)`,
  });

  const headingMatch = content.match(/^#{1,3}\s+.+$/gm) || [];
  checks.push({
    name: "heading_structure",
    passed: headingMatch.length >= 3,
    detail: `Found ${headingMatch.length} headings (minimum: 3)`,
  });

  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 200);
  checks.push({
    name: "paragraph_readability",
    passed: longParagraphs.length === 0,
    detail: longParagraphs.length > 0
      ? `${longParagraphs.length} paragraphs exceed 200 words`
      : "All paragraphs are readable length",
  });

  const hasTitle = !!title && title.trim().length > 5;
  const hasSummary = !!metadata?.summary && metadata.summary.length > 10;
  const hasSeoTitle = !!metadata?.seoTitle;
  const hasSeoDesc = !!metadata?.seoDescription;
  checks.push({
    name: "metadata_presence",
    passed: hasTitle && hasSummary && hasSeoTitle && hasSeoDesc,
    detail: `Title: ${hasTitle ? "yes" : "missing"}, Summary: ${hasSummary ? "yes" : "missing"}, SEO Title: ${hasSeoTitle ? "yes" : "missing"}, SEO Desc: ${hasSeoDesc ? "yes" : "missing"}`,
  });

  const internalLinkPattern = /\[.*?\]\(\/.*?\)/g;
  const internalLinks = content.match(internalLinkPattern) || [];
  checks.push({
    name: "internal_links",
    passed: internalLinks.length >= 2,
    detail: `Found ${internalLinks.length} internal links (minimum: 2)`,
  });

  const hasIntro = paragraphs.length > 0 && paragraphs[0].split(/\s+/).length >= 30;
  checks.push({
    name: "introduction_present",
    passed: hasIntro,
    detail: hasIntro ? "Introduction paragraph present" : "Missing substantial introduction",
  });

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const passed = checks.every(c => c.passed);

  return { passed, checks, score };
}

export function validateFlashcard(front: string, back: string): ValidationResult {
  const checks: { name: string; passed: boolean; detail: string }[] = [];

  checks.push({
    name: "front_length",
    passed: front.trim().length >= 10,
    detail: `Front text: ${front.trim().length} chars (minimum: 10)`,
  });

  checks.push({
    name: "back_length",
    passed: back.trim().length >= 15,
    detail: `Back text: ${back.trim().length} chars (minimum: 15)`,
  });

  checks.push({
    name: "not_identical",
    passed: front.trim().toLowerCase() !== back.trim().toLowerCase(),
    detail: front.trim().toLowerCase() === back.trim().toLowerCase() ? "Front and back are identical" : "Front and back are different",
  });

  const passedCount = checks.filter(c => c.passed).length;
  return { passed: checks.every(c => c.passed), checks, score: Math.round((passedCount / checks.length) * 100) };
}

export function validateExamQuestion(stem: string, options: any[], correctAnswer: string, rationale: string): ValidationResult {
  const checks: { name: string; passed: boolean; detail: string }[] = [];

  checks.push({
    name: "stem_length",
    passed: stem.trim().length >= 30,
    detail: `Stem: ${stem.trim().length} chars (minimum: 30)`,
  });

  const optionCount = Array.isArray(options) ? options.length : 0;
  checks.push({
    name: "option_count",
    passed: optionCount >= 4,
    detail: `Options: ${optionCount} (minimum: 4)`,
  });

  checks.push({
    name: "correct_answer",
    passed: !!correctAnswer && correctAnswer.trim().length > 0,
    detail: correctAnswer ? "Correct answer specified" : "Missing correct answer",
  });

  checks.push({
    name: "rationale_present",
    passed: !!rationale && rationale.split(/\s+/).length >= 20,
    detail: rationale ? `Rationale: ${rationale.split(/\s+/).length} words` : "Missing rationale",
  });

  const passedCount = checks.filter(c => c.passed).length;
  return { passed: checks.every(c => c.passed), checks, score: Math.round((passedCount / checks.length) * 100) };
}

export async function generateBlogPost(
  topic: string,
  gapAnalysis: GapAnalysis
): Promise<{ title: string; content: string; metadata: any; validation: ValidationResult } | null> {
  const safety = await checkSafetyControls();
  if (!safety.allowed) {
    console.error(`[ContentGrowth] Blog generation blocked: ${safety.reason}`);
    return null;
  }

  const relatedSystems = gapAnalysis.underrepresentedSystems.slice(0, 3).map(s => s.system).join(", ");

  const systemPrompt = `You are a healthcare education content writer specializing in nursing and allied health exam preparation. 
Write detailed, clinically accurate blog posts that help students prepare for their licensing exams.
Include proper heading structure with ## and ### markdown headings.
Write in a professional but approachable tone.
Always include actionable study tips, clinical insights, and exam strategies.
Add internal links using markdown format pointing to related platform content like:
- [Related Flashcards](/flashcards)
- [Practice Questions](/practice)
- [Study Lessons](/lessons)
- [Exam Prep Guide](/exam-prep)
Include at least 3 internal links throughout the article.`;

  const userPrompt = `Write a comprehensive blog post about: "${topic}"

Requirements:
- At least 1200 words
- Include proper heading structure (use ## for main sections, ### for subsections)
- Include at least 5 main sections with detailed content
- Cover clinical insights related to: ${relatedSystems || "core nursing topics"}
- Include exam preparation tips specific to NCLEX and other nursing/allied health exams
- Include study strategies and memory aids where appropriate
- Add 3+ internal links to related platform content (flashcards, practice questions, lessons)
- Include a brief introduction and conclusion
- Use evidence-based information

Return a JSON object with:
{
  "title": "the blog post title",
  "content": "the full markdown content of the blog post",
  "summary": "a 2-3 sentence summary",
  "seoTitle": "SEO-optimized title (50-60 chars)",
  "seoDescription": "SEO meta description (150-160 chars)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "primaryKeyword": "main target keyword",
  "bodySystem": "primary body system covered or 'General'",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      taskType: "blog",
      temperature: 0.7,
      maxTokens: 8000,
      responseFormat: { type: "json_object" },
    });

    let parsed;
    try {
      parsed = JSON.parse(result.content);
    } catch {
      console.error("[ContentGrowth] Failed to parse blog post response");
      return null;
    }

    const title = parsed.title || topic;
    const content = parsed.content || "";
    const metadata = {
      summary: parsed.summary || "",
      seoTitle: parsed.seoTitle || title.slice(0, 60),
      seoDescription: parsed.seoDescription || "",
      seoKeywords: parsed.seoKeywords || [],
      primaryKeyword: parsed.primaryKeyword || "",
      bodySystem: parsed.bodySystem || "General",
      tags: parsed.tags || [],
    };

    const validation = validateBlogPost(title, content, metadata);

    return { title, content, metadata, validation };
  } catch (error: any) {
    console.error("[ContentGrowth] Blog generation error:", error.message);
    return null;
  }
}

export async function generateFlashcardBatch(
  bodySystem: string,
  tier: string,
  count: number
): Promise<Array<{ front: string; back: string; topicTag: string; validation: ValidationResult }>> {
  const safety = await checkSafetyControls();
  if (!safety.allowed) {
    console.error(`[ContentGrowth] Flashcard generation blocked: ${safety.reason}`);
    return [];
  }

  const systemPrompt = `You are a nursing education expert creating study flashcards for ${tier.toUpperCase()} nursing students.`;

  const userPrompt = `Generate ${count} high-quality nursing study flashcards about the ${bodySystem} body system.

For each flashcard:
- front: A focused clinical question or key term (10+ characters)
- back: A concise, accurate answer with clinical details (15+ characters)
- topicTag: Specific topic within ${bodySystem}

Return JSON: { "flashcards": [ { "front": "...", "back": "...", "topicTag": "..." } ] }`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      taskType: "content",
      temperature: 0.8,
      maxTokens: 4000,
      responseFormat: { type: "json_object" },
    });

    const parsed = JSON.parse(result.content);
    const cards = parsed.flashcards || parsed.cards || parsed.items || [];

    return cards.map((c: any) => {
      const front = c.front || c.question || "";
      const back = c.back || c.answer || "";
      return {
        front,
        back,
        topicTag: c.topicTag || c.topic || bodySystem,
        validation: validateFlashcard(front, back),
      };
    });
  } catch (error: any) {
    console.error("[ContentGrowth] Flashcard generation error:", error.message);
    return [];
  }
}

export async function generateExamQuestionBatch(
  bodySystem: string,
  tier: string,
  count: number
): Promise<Array<{ stem: string; options: any[]; correctAnswer: string; rationale: string; difficulty: number; topic: string; validation: ValidationResult }>> {
  const safety = await checkSafetyControls();
  if (!safety.allowed) return [];

  const systemPrompt = `You are a clinical nursing content expert creating NCLEX-style exam questions for ${tier.toUpperCase()} students.`;

  const userPrompt = `Generate ${count} unique NCLEX-style multiple-choice questions about the ${bodySystem} body system.

Each question needs:
- stem: Clinical scenario question (30+ characters)
- options: Exactly 4 answer choices as strings
- correctAnswer: The letter A/B/C/D
- rationale: Detailed explanation (20+ words)
- difficulty: 1-5 scale
- topic: Specific topic within ${bodySystem}

Return JSON: { "questions": [ { "stem": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correctAnswer": "A", "rationale": "...", "difficulty": 3, "topic": "..." } ] }`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      taskType: "qbank",
      temperature: 0.8,
      maxTokens: 4000,
      responseFormat: { type: "json_object" },
    });

    const parsed = JSON.parse(result.content);
    const questions = parsed.questions || parsed.items || [];

    return questions.map((q: any) => {
      const stem = q.stem || q.question || "";
      const options = q.options || [];
      const correctAnswer = q.correctAnswer || q.correct_answer || "A";
      const rationale = q.rationale || "";
      return {
        stem,
        options,
        correctAnswer,
        rationale,
        difficulty: q.difficulty || 3,
        topic: q.topic || bodySystem,
        validation: validateExamQuestion(stem, options, correctAnswer, rationale),
      };
    });
  } catch (error: any) {
    console.error("[ContentGrowth] Exam question generation error:", error.message);
    return [];
  }
}

export async function generateLessonContent(
  topic: string,
  bodySystem: string,
  tier: string
): Promise<{ title: string; content: string; metadata: any; validation: ValidationResult } | null> {
  const safety = await checkSafetyControls();
  if (!safety.allowed) return null;

  const systemPrompt = `You are a clinical nursing educator creating comprehensive study lessons for ${tier.toUpperCase()} students.`;

  const userPrompt = `Create a detailed clinical nursing lesson about "${topic}" (${bodySystem} body system).

Include:
- Clear title
- Summary paragraph
- Pathophysiology explanation
- Signs and symptoms
- Diagnostic findings
- Treatment approaches
- Nursing interventions
- Complications to watch for
- Clinical pearls for exam preparation
- Internal links to related content ([Practice Questions](/practice), [Flashcards](/flashcards))

Write at least 800 words with proper ## and ### headings.

Return JSON:
{
  "title": "...",
  "content": "full markdown content",
  "summary": "brief summary",
  "seoTitle": "SEO title",
  "seoDescription": "SEO description",
  "tags": ["tag1", "tag2"],
  "bodySystem": "${bodySystem}"
}`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      taskType: "content",
      temperature: 0.7,
      maxTokens: 6000,
      responseFormat: { type: "json_object" },
    });

    const parsed = JSON.parse(result.content);
    const title = parsed.title || topic;
    const content = parsed.content || "";
    const metadata = {
      summary: parsed.summary || "",
      seoTitle: parsed.seoTitle || title,
      seoDescription: parsed.seoDescription || "",
      tags: parsed.tags || [],
      bodySystem: parsed.bodySystem || bodySystem,
    };

    const validation = validateBlogPost(title, content, {
      ...metadata,
      seoTitle: metadata.seoTitle,
      seoDescription: metadata.seoDescription,
    });

    return { title, content, metadata, validation };
  } catch (error: any) {
    console.error("[ContentGrowth] Lesson generation error:", error.message);
    return null;
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function executeContentGrowthRun(runId: string): Promise<void> {
  const runResult = await pool.query("SELECT * FROM content_growth_runs WHERE id = $1", [runId]);
  if (!runResult.rows[0]) throw new Error("Run not found");
  const run = runResult.rows[0];

  if (run.status !== "queued") return;

  await pool.query(
    "UPDATE content_growth_runs SET status = 'running', started_at = NOW() WHERE id = $1",
    [runId]
  );

  const contentType = run.content_type as ContentType;
  const targetCount = run.target_count || 5;
  let generatedCount = 0;
  let acceptedCount = 0;
  let rejectedCount = 0;
  const validationResults: any[] = [];

  try {
    const gapAnalysis = await analyzeContentGaps();

    await pool.query(
      "UPDATE content_growth_runs SET gap_analysis = $1, topics_prioritized = $2 WHERE id = $3",
      [JSON.stringify(gapAnalysis), JSON.stringify(gapAnalysis.lowCoverageTopics), runId]
    );

    if (contentType === "blog_post") {
      const availableTopics = gapAnalysis.suggestedKeywords.length > 0
        ? gapAnalysis.suggestedKeywords
        : SEO_BLOG_TOPICS;

      for (let i = 0; i < Math.min(targetCount, availableTopics.length); i++) {
        const topic = availableTopics[i];
        const result = await generateBlogPost(topic, gapAnalysis);
        if (!result) continue;

        generatedCount++;
        validationResults.push({
          topic,
          validation: result.validation,
        });

        if (result.validation.passed) {
          const slug = slugify(result.title);
          const existing = await pool.query(
            "SELECT id FROM content_items WHERE slug = $1 OR LOWER(title) = LOWER($2) LIMIT 1",
            [slug, result.title]
          );
          if (existing.rows.length > 0) {
            rejectedCount++;
            validationResults[validationResults.length - 1].rejection = "Duplicate title/slug";
            continue;
          }

          await pool.query(
            `INSERT INTO content_items (title, slug, type, body_system, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, author_name, updated_by_ai)
             VALUES ($1, $2, 'blog_post', $3, 'draft', $4, $5, $6, $7, $8, $9, $10, 'Content Growth Engine', true)`,
            [
              result.title,
              slug,
              result.metadata.bodySystem || "General",
              result.metadata.tags || [],
              result.metadata.summary,
              JSON.stringify([{ type: "markdown", content: result.content }]),
              result.metadata.seoTitle,
              result.metadata.seoDescription,
              result.metadata.seoKeywords || [],
              result.metadata.primaryKeyword || "",
            ]
          );
          acceptedCount++;
        } else {
          rejectedCount++;
          validationResults[validationResults.length - 1].rejection = "Failed validation";
        }
      }
    } else if (contentType === "flashcards") {
      const systems = gapAnalysis.underrepresentedSystems.slice(0, 3).map(s => s.system);
      if (systems.length === 0) systems.push(...BODY_SYSTEMS.slice(0, 3));

      const perSystem = Math.ceil(targetCount / systems.length);
      const tier = run.target_tier || "rn";

      for (const system of systems) {
        const cards = await generateFlashcardBatch(system, tier, perSystem);
        for (const card of cards) {
          generatedCount++;
          validationResults.push({
            topic: `${system}: ${card.front.slice(0, 50)}`,
            validation: card.validation,
          });

          if (card.validation.passed) {
            const contentHash = crypto.createHash("sha256").update(card.front.toLowerCase().trim()).digest("hex");
            try {
              const examTag = tier === "np" ? "NP-CAT" : tier === "rpn" || tier === "pn" ? "REx-PN" : "NCLEX-RN";
              const tags = [`tier:${tier}`, `exam:${examTag}`, `system:${system}`, `topic:${card.topicTag}`];
              await pool.query(
                `INSERT INTO flashcard_bank (tier, topic_tag, front, back, status, content_hash, career_type, body_system, category, flashcard_enabled, tags_json, source_type)
                 VALUES ($1, $2, $3, $4, 'published', $5, 'nursing', $6, $7, true, $8, 'content_growth')
                 ON CONFLICT (content_hash) DO NOTHING`,
                [tier, card.topicTag, card.front, card.back, contentHash, system, system, JSON.stringify(tags)]
              );
              acceptedCount++;
            } catch {
              rejectedCount++;
            }
          } else {
            rejectedCount++;
          }
        }
      }
    } else if (contentType === "exam_questions") {
      const systems = gapAnalysis.underrepresentedSystems.slice(0, 3).map(s => s.system);
      if (systems.length === 0) systems.push(...BODY_SYSTEMS.slice(0, 3));

      const perSystem = Math.ceil(targetCount / systems.length);
      const tier = run.target_tier || "rn";

      for (const system of systems) {
        const questions = await generateExamQuestionBatch(system, tier, perSystem);
        for (const q of questions) {
          generatedCount++;
          validationResults.push({
            topic: `${system}: ${q.stem.slice(0, 50)}`,
            validation: q.validation,
          });

          if (q.validation.passed) {
            const stemHash = crypto.createHash("sha256").update(q.stem.toLowerCase().trim()).digest("hex");
            try {
              await pool.query(
                `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, body_system, topic, stem_hash, region_scope)
                 VALUES ($1, $2, 'multiple_choice', 'needs_review', $3, $4, $5, $6, $7, $8, $9, $10, 'BOTH')
                 ON CONFLICT DO NOTHING`,
                [
                  tier,
                  `${tier.toUpperCase()}-CAT`,
                  q.stem,
                  JSON.stringify(q.options),
                  q.correctAnswer,
                  q.rationale,
                  q.difficulty,
                  system,
                  q.topic,
                  stemHash,
                ]
              );
              acceptedCount++;
            } catch {
              rejectedCount++;
            }
          } else {
            rejectedCount++;
          }
        }
      }
    } else if (contentType === "lessons") {
      const systems = gapAnalysis.underrepresentedSystems.slice(0, targetCount).map(s => s.system);
      if (systems.length === 0) systems.push(...BODY_SYSTEMS.slice(0, targetCount));
      const tier = run.target_tier || "rn";

      for (const system of systems) {
        const lessonResult = await generateLessonContent(
          `${system} Nursing: Essential Clinical Guide`,
          system,
          tier
        );
        if (!lessonResult) continue;

        generatedCount++;
        validationResults.push({
          topic: lessonResult.title,
          validation: lessonResult.validation,
        });

        if (lessonResult.validation.passed) {
          const slug = slugify(lessonResult.title);
          const existing = await pool.query(
            "SELECT id FROM content_items WHERE slug = $1 LIMIT 1",
            [slug]
          );
          if (existing.rows.length > 0) {
            rejectedCount++;
            continue;
          }

          await pool.query(
            `INSERT INTO content_items (title, slug, type, body_system, status, tags, summary, content, seo_title, seo_description, author_name, updated_by_ai)
             VALUES ($1, $2, 'lesson', $3, 'draft', $4, $5, $6, $7, $8, 'Content Growth Engine', true)`,
            [
              lessonResult.title,
              slug,
              lessonResult.metadata.bodySystem,
              lessonResult.metadata.tags || [],
              lessonResult.metadata.summary,
              JSON.stringify([{ type: "markdown", content: lessonResult.content }]),
              lessonResult.metadata.seoTitle,
              lessonResult.metadata.seoDescription,
            ]
          );
          acceptedCount++;
        } else {
          rejectedCount++;
        }
      }
    } else if (contentType === "specialty_guides") {
      const systems = gapAnalysis.lowCoverageTopics.slice(0, targetCount);
      if (systems.length === 0) systems.push(...BODY_SYSTEMS.slice(0, Math.min(targetCount, 3)));

      for (const system of systems) {
        const guideResult = await generateLessonContent(
          `${system} Specialty Guide: Comprehensive Exam Preparation`,
          system,
          "rn"
        );
        if (!guideResult) continue;

        generatedCount++;
        validationResults.push({
          topic: guideResult.title,
          validation: guideResult.validation,
        });

        if (guideResult.validation.passed) {
          const slug = slugify(guideResult.title);
          const existing = await pool.query("SELECT id FROM content_items WHERE slug = $1 LIMIT 1", [slug]);
          if (existing.rows.length > 0) {
            rejectedCount++;
            continue;
          }

          await pool.query(
            `INSERT INTO content_items (title, slug, type, body_system, status, tags, summary, content, seo_title, seo_description, author_name, updated_by_ai)
             VALUES ($1, $2, 'specialty_guide', $3, 'draft', $4, $5, $6, $7, $8, 'Content Growth Engine', true)`,
            [
              guideResult.title,
              slug,
              guideResult.metadata.bodySystem,
              guideResult.metadata.tags || [],
              guideResult.metadata.summary,
              JSON.stringify([{ type: "markdown", content: guideResult.content }]),
              guideResult.metadata.seoTitle,
              guideResult.metadata.seoDescription,
            ]
          );
          acceptedCount++;
        } else {
          rejectedCount++;
        }
      }
    }

    const finalStatus = generatedCount === 0 ? "failed" : rejectedCount > acceptedCount ? "partial" : "completed";

    await pool.query(
      `UPDATE content_growth_runs SET
        status = $1, generated_count = $2, accepted_count = $3, rejected_count = $4,
        validation_results = $5, completed_at = NOW()
      WHERE id = $6`,
      [finalStatus, generatedCount, acceptedCount, rejectedCount, JSON.stringify(validationResults), runId]
    );

    if (run.schedule_id) {
      await pool.query(
        `UPDATE content_growth_schedules SET
          total_runs = COALESCE(total_runs, 0) + 1,
          total_items_generated = COALESCE(total_items_generated, 0) + $1,
          last_run_at = NOW(),
          updated_at = NOW()
        WHERE id = $2`,
        [acceptedCount, run.schedule_id]
      );
    }

    console.log(`[ContentGrowth] Run ${runId} completed: ${generatedCount} generated, ${acceptedCount} accepted, ${rejectedCount} rejected`);
  } catch (error: any) {
    await pool.query(
      "UPDATE content_growth_runs SET status = 'failed', error_message = $1, completed_at = NOW() WHERE id = $2",
      [error.message, runId]
    );
    console.error(`[ContentGrowth] Run ${runId} failed:`, error.message);
  }
}

function calculateNextRunAt(cadence: string, runTimeHour: number): Date {
  const now = new Date();
  const next = new Date(now);
  next.setUTCMinutes(0, 0, 0);
  next.setUTCHours(runTimeHour);

  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 1);
  }

  if (cadence === "weekly") {
    const dayOfWeek = next.getUTCDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    if (daysUntilMonday > 0) {
      next.setUTCDate(next.getUTCDate() + daysUntilMonday);
    }
  }

  return next;
}

export async function checkAndRunSchedules(): Promise<void> {
  try {
    const now = new Date();
    const schedules = await pool.query(
      "SELECT * FROM content_growth_schedules WHERE enabled = true AND next_run_at IS NOT NULL AND next_run_at <= $1",
      [now]
    );

    for (const schedule of schedules.rows) {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayRuns = await pool.query(
        "SELECT COUNT(*)::int as c FROM content_growth_runs WHERE schedule_id = $1 AND created_at::date = $2::date",
        [schedule.id, todayStr]
      );
      const runCount = parseInt(todayRuns.rows[0]?.c || "0");
      const maxDailyRuns = schedule.max_daily_runs || 1;

      if (runCount >= maxDailyRuns) {
        await pool.query(
          "UPDATE content_growth_schedules SET next_run_at = $1, updated_at = NOW() WHERE id = $2",
          [calculateNextRunAt(schedule.cadence, schedule.run_time_hour ?? 3), schedule.id]
        );
        continue;
      }

      const runResult = await pool.query(
        `INSERT INTO content_growth_runs (schedule_id, content_type, target_tier, status, target_count, triggered_by)
         VALUES ($1, $2, $3, 'queued', $4, 'schedule') RETURNING id`,
        [schedule.id, schedule.content_type, schedule.target_tier || 'rn', schedule.items_per_run || 5]
      );

      await pool.query(
        "UPDATE content_growth_schedules SET next_run_at = $1, updated_at = NOW() WHERE id = $2",
        [calculateNextRunAt(schedule.cadence, schedule.run_time_hour ?? 3), schedule.id]
      );

      executeContentGrowthRun(runResult.rows[0].id).catch(err => {
        console.error(`[ContentGrowth] Schedule run failed:`, err.message);
      });
    }
  } catch (err: any) {
    console.error("[ContentGrowth] Schedule check error:", err.message);
  }
}

let schedulerInterval: NodeJS.Timeout | null = null;

export function startContentGrowthScheduler(): void {
  if (schedulerInterval) return;
  console.log("[ContentGrowth] Scheduler started, polling every 5 minutes");
  schedulerInterval = setInterval(() => checkAndRunSchedules(), 5 * 60 * 1000);
  setTimeout(() => checkAndRunSchedules(), 60_000);
}

export function stopContentGrowthScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("[ContentGrowth] Scheduler stopped");
  }
}
