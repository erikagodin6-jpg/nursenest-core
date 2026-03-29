import { pool } from "./storage";
import { routeAIRequest } from "./ai-provider-router";
import crypto from "crypto";
import {
  NURSING_TIERS,
  NP_SPECIALTIES,
  ALLIED_HEALTH_PROFESSIONS,
  CERTIFICATION_PREP_EXAMS,
  BLOG_TEMPLATES,
  LESSON_SECTIONS,
  getTierLabel,
  getTierGroup,
  getAlliedHealthSlug,
  type ContentTypeId,
  type TierGroupId,
} from "./universal-content-registry";
import {
  enforceBatchSize,
  checkDailyCap,
  incrementDailyCount,
  checkDuplicateQuestion,
  checkDuplicateFlashcard,
  checkDuplicateLesson,
  checkDuplicateBlogArticle,
  qualityGateQuestion,
  qualityGateFlashcard,
  qualityGateLesson,
  qualityGateBlogArticle,
  createRunLog,
  updateRunLog,
  ensureGovernorTables,
} from "./generation-governor";

function getTierPromptContext(tierId: string): string {
  const nursing = NURSING_TIERS.find(t => t.id === tierId);
  if (nursing) return `Exam: ${nursing.label}\nScope of Practice: ${nursing.scope}`;

  const np = NP_SPECIALTIES.find(s => s.id === tierId);
  if (np) return `Exam: ${np.label}\nFocus: ${np.focus}`;

  const allied = ALLIED_HEALTH_PROFESSIONS.find(p => p.id === tierId);
  if (allied) return `Profession: ${allied.label}\nCertification Exam: ${allied.examCode}`;

  const cert = CERTIFICATION_PREP_EXAMS.find(e => e.id === tierId);
  if (cert) return `Certification: ${cert.label}\nFocus: ${cert.focus}`;

  return `Tier: ${tierId}`;
}

function getQuestionSystemPrompt(tierId: string, group: TierGroupId): string {
  const context = getTierPromptContext(tierId);
  const label = getTierLabel(tierId);

  const basePrompts: Record<TierGroupId, string> = {
    nursing: `You are a senior nursing exam item writer creating clinically accurate questions for ${label}.
${context}
Questions must test clinical judgment at the application/analysis level. Include detailed clinical scenarios with specific patient data.
Each question MUST include a mandatory detailed rationale.`,

    np_specialty: `You are an advanced practice nurse practitioner certification exam item writer for ${label}.
${context}
Questions must test advanced clinical reasoning at the synthesis/evaluation level with emphasis on differential diagnosis, prescribing decisions, and evidence-based management.
Include detailed clinical scenarios with specific patient data, lab results, and diagnostic findings.
Each question MUST include a mandatory detailed rationale.`,

    allied_health: `You are a certified exam item writer creating clinically accurate questions for ${label} certification exam preparation.
${context}
Questions must reflect the scope of practice, regulatory requirements, and clinical competencies specific to this profession.
Include realistic workplace scenarios with specific clinical data relevant to the profession.
Each question MUST include a mandatory detailed rationale.`,

    certification_prep: `You are a certification exam preparation specialist creating questions for ${label}.
${context}
Questions must align with the official certification exam blueprint and test at the appropriate cognitive level.
Include realistic clinical scenarios and algorithm-based decision-making where applicable.
Each question MUST include a mandatory detailed rationale.`,
  };

  return basePrompts[group] || basePrompts.nursing;
}

function getFormatDistribution(batchSize: number): string {
  const mcq = Math.max(1, Math.round(batchSize * 0.5));
  const sata = Math.max(1, Math.round(batchSize * 0.2));
  const ordered = Math.max(0, Math.round(batchSize * 0.1));
  const hotspot = Math.max(0, Math.round(batchSize * 0.05));
  const scenario = batchSize - mcq - sata - ordered - hotspot;

  return `Format distribution targets:
- MCQ (Multiple Choice): ~${mcq} questions
- SATA (Select All That Apply): ~${sata} questions
- Ordered/Prioritization: ~${ordered} questions
- Hotspot: ~${hotspot} questions
- Scenario/Case Study: ~${scenario} questions`;
}

export async function generateQuestions(params: {
  tier: string;
  topic: string;
  batchSize: number;
  region?: string;
}): Promise<{ success: boolean; items: any[]; runLogId: string; errors: string[] }> {
  await ensureGovernorTables();
  const batchSize = enforceBatchSize(params.batchSize);
  const group = getTierGroup(params.tier) || "nursing";
  const errors: string[] = [];

  const capCheck = await checkDailyCap(params.tier, "questions");
  if (!capCheck.allowed) {
    return { success: false, items: [], runLogId: "", errors: [capCheck.reason!] };
  }

  const runLogId = await createRunLog({
    topic: params.topic,
    tier: params.tier,
    contentType: "questions",
    batchSize,
  });

  const systemPrompt = getQuestionSystemPrompt(params.tier, group as TierGroupId);
  const formatDist = getFormatDistribution(batchSize);
  const regionNote = params.region === "CA"
    ? "Use Canadian context: SI units (mmol/L, umol/L, Celsius, kg), Canadian drug names."
    : params.region === "US"
    ? "Use US context: conventional units (mEq/L, mg/dL, Fahrenheit, lbs)."
    : "";

  const fullSystem = `${systemPrompt}

${regionNote}
${formatDist}

CRITICAL RULES:
1. Return ONLY valid JSON with an "items" array containing exactly ${batchSize} question objects.
2. Every question MUST have a rationale field with correctReasoning (minimum 50 chars). NO question publishes without a rationale.
3. Do NOT use any emoji characters. Plain text only.
4. Each question must have a unique clinical scenario.

Each question object schema:
{
  "type": "MCQ" or "SATA" or "ORDERED" or "HOTSPOT" or "SCENARIO",
  "difficulty": "moderate" or "hard" or "very_challenging",
  "topic": "specific clinical topic",
  "stem": "A detailed clinical scenario question (min 40 chars)",
  "choices": [{"label": "A", "text": "..."}, ...],
  "correct_answers": ["B"] for MCQ or ["A","C"] for SATA,
  "rationale": {
    "correctReasoning": "Why the correct answer is right (min 50 chars)",
    "incorrectBreakdown": {"A": "Why wrong..."},
    "keyPathophysiology": "Key concept",
    "clinicalImplication": "Clinical implication"
  },
  "exam_pearl": "Concise exam tip"
}

MCQ: exactly 4 choices (A-D), exactly 1 correct.
SATA: 5-8 choices, 2-5 correct.
ORDERED: 4-6 items to rank in priority order.
HOTSPOT: 4 choices with 1+ correct regions.
SCENARIO: case-based with 4 choices, 1 correct.`;

  const userPrompt = `Generate ${batchSize} exam questions about "${params.topic}" for ${getTierLabel(params.tier)}. Return JSON only.`;

  try {
    const result = await routeAIRequest(fullSystem, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: Math.min(batchSize * 800 + 500, 16384),
      temperature: 0.3,
      responseFormat: { type: "json_object" },
      taskType: "qbank",
      feature: "universal-generator",
    });

    let items: any[] = [];
    try {
      const parsed = JSON.parse(result.content || "{}");
      items = parsed.items || parsed.questions || [];
      if (!Array.isArray(items)) items = [];
    } catch {
      errors.push("Failed to parse AI response");
      await updateRunLog(runLogId, { status: "failed", errors });
      return { success: false, items: [], runLogId, errors };
    }

    await updateRunLog(runLogId, { generatedCount: items.length });

    const validated: any[] = [];
    let rejected = 0;
    let duplicatesSkipped = 0;

    for (const item of items) {
      const qg = qualityGateQuestion(item);
      if (!qg.passed) {
        errors.push(`Quality gate failed: ${qg.issues.join(", ")}`);
        rejected++;
        continue;
      }

      const isDupe = await checkDuplicateQuestion(item.stem || "");
      if (isDupe) {
        duplicatesSkipped++;
        continue;
      }

      validated.push(item);
    }

    await updateRunLog(runLogId, {
      validatedCount: validated.length,
      rejectedCount: rejected,
      duplicatesSkipped,
      insertedCount: validated.length,
      status: "completed",
      errors,
    });

    await incrementDailyCount(params.tier, "questions", validated.length);

    return { success: true, items: validated, runLogId, errors };
  } catch (err: any) {
    errors.push(err.message);
    await updateRunLog(runLogId, { status: "failed", errors });
    return { success: false, items: [], runLogId, errors };
  }
}

export async function generateFlashcardsFromContent(params: {
  tier: string;
  topic: string;
  batchSize: number;
  sourceType?: "questions" | "lessons" | "fresh";
}): Promise<{ success: boolean; items: any[]; runLogId: string; errors: string[] }> {
  await ensureGovernorTables();
  const batchSize = enforceBatchSize(params.batchSize);
  const errors: string[] = [];

  const capCheck = await checkDailyCap(params.tier, "flashcards");
  if (!capCheck.allowed) {
    return { success: false, items: [], runLogId: "", errors: [capCheck.reason!] };
  }

  const runLogId = await createRunLog({
    topic: params.topic,
    tier: params.tier,
    contentType: "flashcards",
    batchSize,
  });

  const label = getTierLabel(params.tier);

  const systemPrompt = `You are a study material expert creating flashcards for ${label} exam preparation.

Each flashcard must have:
- front: A focused clinical question, key term, or concept (10+ characters)
- back: A concise, accurate answer with clinical details and exam relevance (15+ characters)
- topic: Specific topic within the subject area
- tier: "${params.tier}"

RULES:
1. Return JSON: {"flashcards": [...]}
2. Each flashcard must be unique - no duplicate concepts
3. Front and back must be different
4. No emoji characters
5. Generate exactly ${batchSize} flashcards`;

  const userPrompt = `Generate ${batchSize} high-quality study flashcards about "${params.topic}" for ${label}. Return JSON only.`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: Math.min(batchSize * 300 + 500, 8192),
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "content",
      feature: "universal-generator-flashcards",
    });

    let items: any[] = [];
    try {
      const parsed = JSON.parse(result.content || "{}");
      items = parsed.flashcards || parsed.cards || parsed.items || [];
    } catch {
      errors.push("Failed to parse AI response");
      await updateRunLog(runLogId, { status: "failed", errors });
      return { success: false, items: [], runLogId, errors };
    }

    await updateRunLog(runLogId, { generatedCount: items.length });

    const validated: any[] = [];
    let rejected = 0;
    let duplicatesSkipped = 0;

    for (const item of items) {
      const front = item.front || item.term || item.question || "";
      const back = item.back || item.definition || item.answer || "";

      const qg = qualityGateFlashcard(front, back);
      if (!qg.passed) {
        errors.push(`Flashcard quality gate: ${qg.issues.join(", ")}`);
        rejected++;
        continue;
      }

      const isDupe = await checkDuplicateFlashcard(front);
      if (isDupe) {
        duplicatesSkipped++;
        continue;
      }

      validated.push({
        front,
        back,
        topic: item.topic || item.topicTag || params.topic,
        tier: params.tier,
      });
    }

    await updateRunLog(runLogId, {
      validatedCount: validated.length,
      rejectedCount: rejected,
      duplicatesSkipped,
      insertedCount: validated.length,
      status: "completed",
      errors,
    });

    await incrementDailyCount(params.tier, "flashcards", validated.length);

    return { success: true, items: validated, runLogId, errors };
  } catch (err: any) {
    errors.push(err.message);
    await updateRunLog(runLogId, { status: "failed", errors });
    return { success: false, items: [], runLogId, errors };
  }
}

export async function generateLesson(params: {
  tier: string;
  topic: string;
  bodySystem?: string;
}): Promise<{ success: boolean; lesson: any; runLogId: string; errors: string[] }> {
  await ensureGovernorTables();
  const errors: string[] = [];

  const capCheck = await checkDailyCap(params.tier, "lessons");
  if (!capCheck.allowed) {
    return { success: false, lesson: null, runLogId: "", errors: [capCheck.reason!] };
  }

  const isDupe = await checkDuplicateLesson(params.topic);
  if (isDupe) {
    return { success: false, lesson: null, runLogId: "", errors: ["Duplicate lesson already exists"] };
  }

  const runLogId = await createRunLog({
    topic: params.topic,
    tier: params.tier,
    contentType: "lessons",
    batchSize: 1,
  });

  const label = getTierLabel(params.tier);
  const context = getTierPromptContext(params.tier);

  const sectionList = LESSON_SECTIONS.map(s => s.replace(/_/g, " ")).join(", ");

  const systemPrompt = `You are a clinical education expert creating structured study lessons for ${label}.
${context}

Generate a comprehensive study lesson with these mandatory sections: ${sectionList}

Each section must contain:
- A heading
- Detailed clinical content (paragraphs, bullet points, or tables as appropriate)
- At least one clinical pearl or exam tip

Return JSON:
{
  "title": "Lesson title",
  "topic": "${params.topic}",
  "bodySystem": "${params.bodySystem || "Multi-system"}",
  "tier": "${params.tier}",
  "sections": [
    {
      "key": "definition",
      "title": "Definition",
      "content": "Detailed content...",
      "bullets": ["Point 1", "Point 2"],
      "examTip": "Key exam tip"
    }
  ],
  "summary": "Brief lesson summary",
  "keyTerms": ["term1", "term2"],
  "wordCount": 0
}

RULES:
1. Include ALL 8 mandatory sections
2. Minimum 1500 words total
3. Clinically accurate and exam-relevant content
4. No emoji characters
5. JSON only`;

  const userPrompt = `Create a comprehensive study lesson about "${params.topic}" for ${label}. Body system: ${params.bodySystem || "Multi-system"}. Return JSON only.`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: 8192,
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "content",
      feature: "universal-generator-lesson",
    });

    let lesson: any;
    try {
      lesson = JSON.parse(result.content || "{}");
    } catch {
      errors.push("Failed to parse AI response");
      await updateRunLog(runLogId, { status: "failed", errors });
      return { success: false, lesson: null, runLogId, errors };
    }

    await updateRunLog(runLogId, { generatedCount: 1 });

    const qg = qualityGateLesson(lesson.title || params.topic, lesson);
    if (!qg.passed) {
      errors.push(...qg.issues);
      await updateRunLog(runLogId, { status: "failed", rejectedCount: 1, errors });
      return { success: false, lesson: null, runLogId, errors };
    }

    await updateRunLog(runLogId, {
      validatedCount: 1,
      insertedCount: 1,
      status: "completed",
      errors,
    });

    await incrementDailyCount(params.tier, "lessons", 1);

    return { success: true, lesson, runLogId, errors };
  } catch (err: any) {
    errors.push(err.message);
    await updateRunLog(runLogId, { status: "failed", errors });
    return { success: false, lesson: null, runLogId, errors };
  }
}

export async function generateBlogArticle(params: {
  tier: string;
  topic: string;
  template: string;
  targetKeyword?: string;
}): Promise<{ success: boolean; article: any; runLogId: string; errors: string[] }> {
  await ensureGovernorTables();
  const errors: string[] = [];
  const group = getTierGroup(params.tier);

  const capCheck = await checkDailyCap(params.tier, "blog_articles");
  if (!capCheck.allowed) {
    return { success: false, article: null, runLogId: "", errors: [capCheck.reason!] };
  }

  const isDupe = await checkDuplicateBlogArticle(params.topic);
  if (isDupe) {
    return { success: false, article: null, runLogId: "", errors: ["Duplicate article already exists"] };
  }

  const runLogId = await createRunLog({
    topic: params.topic,
    tier: params.tier,
    contentType: "blog_articles",
    batchSize: 1,
  });

  const label = getTierLabel(params.tier);
  const context = getTierPromptContext(params.tier);

  let templatePrompt = "";
  if (group === "allied_health") {
    const alliedSlug = getAlliedHealthSlug(params.tier);
    templatePrompt = `Write an SEO-optimized article for allied health professionals in the ${label} field.
${context}

Article type: ${params.template}
${params.template === "career_guide" ? "Cover career path, requirements, job outlook, day-to-day responsibilities, and advancement opportunities." : ""}
${params.template === "exam_prep" ? "Cover exam format, study strategies, key topics, practice question tips, and test-day advice." : ""}
${params.template === "salary_guide" ? "Cover salary ranges by region, factors affecting pay, benefits, negotiation tips, and career growth." : ""}
${params.template === "day_in_life" ? "Cover a typical shift/day, responsibilities, patient interactions, challenges, and rewards." : ""}

Include internal links to NurseNest study resources:
- [Practice Questions](/allied-health/${alliedSlug || "hub"}/practice)
- [Study Flashcards](/flashcards)
- [Career Resources](/allied-health/${alliedSlug || "hub"})`;
  } else if (group === "nursing" || group === "np_specialty" || params.tier === "newgrad") {
    templatePrompt = `Write an SEO-optimized article for new graduate healthcare professionals.
${context}

Article type: ${params.template}
${params.template === "career_guidance" ? "Cover career paths, specialty options, professional development, and long-term career planning." : ""}
${params.template === "interview_prep" ? "Cover common interview questions, behavioral answers, clinical scenario responses, and presentation tips." : ""}
${params.template === "resume_advice" ? "Cover resume formatting, clinical experience highlighting, cover letter tips, and portfolio building." : ""}
${params.template === "transition" ? "Cover the transition from student to professional: orientation survival, preceptor relationships, time management, and confidence building." : ""}

Include internal links to NurseNest resources:
- [Practice Questions](/test-bank)
- [Study Lessons](/lessons)
- [ApplyNest Job Board](/new-grad/applynest)
- [Career Resources](/new-grad)`;
  } else {
    templatePrompt = `Write an SEO-optimized article for ${label} preparation.
${context}

Article type: ${params.template}`;
  }

  const systemPrompt = `You are a senior healthcare education content writer and SEO specialist creating articles for NurseNest.

${templatePrompt}

ARTICLE REQUIREMENTS:
- Length: 1200-2000 words
- Include SEO-optimized title (60 chars max), meta description (155 chars max)
- Structured with clear H2 and H3 headings (use ## and ###)
- Include at least 3 internal links
- Include a conclusion with actionable next steps
- No emoji characters

Return JSON:
{
  "seoTitle": "SEO title (60 chars max)",
  "metaDescription": "Meta description (155 chars max)",
  "slug": "url-friendly-slug",
  "title": "Full article title",
  "content": "Full article in Markdown with ## and ### headings",
  "summary": "2-3 sentence summary",
  "seoKeywords": ["keyword1", "keyword2"],
  "wordCount": 0,
  "category": "${params.template}",
  "tier": "${params.tier}",
  "suggestedRelatedTopics": ["topic1", "topic2"]
}`;

  const userPrompt = `Write a comprehensive article about "${params.topic}" targeting the keyword "${params.targetKeyword || params.topic}" for ${label}. Return JSON only.`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: 8192,
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "blog",
      feature: "universal-generator-blog",
    });

    let article: any;
    try {
      article = JSON.parse(result.content || "{}");
    } catch {
      errors.push("Failed to parse AI response");
      await updateRunLog(runLogId, { status: "failed", errors });
      return { success: false, article: null, runLogId, errors };
    }

    await updateRunLog(runLogId, { generatedCount: 1 });

    const wordCount = (article.content || "").split(/\s+/).filter(Boolean).length;
    article.wordCount = wordCount;

    const qg = qualityGateBlogArticle(article.title || params.topic, article.content || "", wordCount);
    if (!qg.passed) {
      errors.push(...qg.issues);
      await updateRunLog(runLogId, { status: "failed", rejectedCount: 1, errors });
      return { success: false, article, runLogId, errors };
    }

    await updateRunLog(runLogId, {
      validatedCount: 1,
      insertedCount: 1,
      status: "completed",
      errors,
    });

    await incrementDailyCount(params.tier, "blog_articles", 1);

    return { success: true, article, runLogId, errors };
  } catch (err: any) {
    errors.push(err.message);
    await updateRunLog(runLogId, { status: "failed", errors });
    return { success: false, article: null, runLogId, errors };
  }
}
