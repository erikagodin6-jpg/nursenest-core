import { pool, storage } from "./storage";
import { findRelatedContent } from "./content-relationship-service";
import { generateBlogPost } from "./blog-automation";
import type { Express } from "express";

export interface TopicGap {
  topic: string;
  bodySystem: string;
  tier: string;
  exam: string;
  questionCount: number;
  avgDifficulty: number;
  hasBlogCoverage: boolean;
  sampleQuestionIds: string[];
}

export interface GapAnalysisResult {
  totalTopicsAnalyzed: number;
  coveredTopics: number;
  uncoveredTopics: number;
  gaps: TopicGap[];
}

export interface PipelineRunStatus {
  id: string;
  status: "running" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  totalTopics: number;
  processedTopics: number;
  generatedPosts: number;
  failedPosts: number;
  details: Array<{ topic: string; status: string; slug?: string; error?: string }>;
}

const activePipelineRuns = new Map<string, PipelineRunStatus>();

export async function runGapAnalysis(
  minQuestionCount: number = 10,
  tiers?: string[]
): Promise<GapAnalysisResult> {
  const tierFilter = tiers && tiers.length > 0 ? tiers : ["rpn", "rn"];

  const topicQuery = await pool.query(
    `SELECT
       COALESCE(topic, 'General') as topic,
       COALESCE(body_system, 'Unclassified') as body_system,
       tier,
       exam,
       COUNT(*)::int as question_count,
       ROUND(AVG(difficulty)::numeric, 1)::float as avg_difficulty,
       (SELECT ARRAY_AGG(sub.id) FROM (
         SELECT id FROM exam_questions eq2
         WHERE eq2.topic = COALESCE(exam_questions.topic, 'General')
           AND eq2.body_system = COALESCE(exam_questions.body_system, 'Unclassified')
           AND eq2.tier = exam_questions.tier
           AND eq2.exam = exam_questions.exam
           AND eq2.status = 'published'
         LIMIT 5
       ) sub) as sample_ids
     FROM exam_questions
     WHERE status = 'published'
       AND tier = ANY($1)
       AND topic IS NOT NULL
       AND topic != ''
     GROUP BY COALESCE(topic, 'General'), COALESCE(body_system, 'Unclassified'), tier, exam
     HAVING COUNT(*) >= $2
     ORDER BY COUNT(*) DESC`,
    [tierFilter, minQuestionCount]
  );

  const existingBlogsResult = await pool.query(
    `SELECT LOWER(title) as title_lower,
            LOWER(COALESCE(primary_keyword, '')) as pk_lower,
            LOWER(COALESCE(body_system, '')) as bs_lower,
            COALESCE(tags, '{}') as tags
     FROM content_items
     WHERE type IN ('blog', 'blog-post', 'article')
       AND status = 'published'`
  );

  const blogIndex = new Set<string>();
  for (const blog of existingBlogsResult.rows) {
    const titleWords = (blog.title_lower || "").split(/\s+/).filter((w: string) => w.length > 3);
    for (const w of titleWords) blogIndex.add(w);
    if (blog.pk_lower) blogIndex.add(blog.pk_lower);
    if (blog.bs_lower) blogIndex.add(blog.bs_lower);
    const tags = Array.isArray(blog.tags) ? blog.tags : [];
    for (const t of tags) blogIndex.add((t || "").toLowerCase());
  }

  function hasExistingCoverage(topic: string, bodySystem: string): boolean {
    const normalized = topic.toLowerCase();
    const bsNormalized = bodySystem.toLowerCase();

    for (const blog of existingBlogsResult.rows) {
      const title = blog.title_lower || "";
      const pk = blog.pk_lower || "";
      const bs = blog.bs_lower || "";

      if (title.includes(normalized) || pk.includes(normalized)) return true;
      if (normalized.includes(title) && title.length > 10) return true;

      const topicWords = normalized.split(/\s+/).filter((w: string) => w.length > 3);
      const matchCount = topicWords.filter((w: string) => title.includes(w)).length;
      if (topicWords.length > 0 && matchCount / topicWords.length >= 0.6) return true;

      if (bsNormalized && bs === bsNormalized && pk && normalized.includes(pk)) return true;
    }
    return false;
  }

  const gaps: TopicGap[] = [];
  let coveredTopics = 0;

  for (const row of topicQuery.rows) {
    const hasCoverage = hasExistingCoverage(row.topic, row.body_system);
    if (hasCoverage) {
      coveredTopics++;
    }

    gaps.push({
      topic: row.topic,
      bodySystem: row.body_system,
      tier: row.tier,
      exam: row.exam,
      questionCount: row.question_count,
      avgDifficulty: row.avg_difficulty,
      hasBlogCoverage: hasCoverage,
      sampleQuestionIds: (row.sample_ids || []).slice(0, 5),
    });
  }

  const uncoveredGaps = gaps.filter(g => !g.hasBlogCoverage);

  return {
    totalTopicsAnalyzed: gaps.length,
    coveredTopics,
    uncoveredTopics: uncoveredGaps.length,
    gaps: uncoveredGaps.sort((a, b) => b.questionCount - a.questionCount),
  };
}

async function fetchQuestionContext(
  topic: string,
  bodySystem: string,
  tier: string,
  sampleIds: string[]
): Promise<{
  sampleStems: string[];
  commonTags: string[];
  difficultyRange: string;
  subtopics: string[];
}> {
  const result = await pool.query(
    `SELECT stem, tags, difficulty, subtopic
     FROM exam_questions
     WHERE id = ANY($1)
     LIMIT 5`,
    [sampleIds]
  );

  const sampleStems = result.rows
    .map((r: any) => (r.stem || "").substring(0, 200))
    .filter(Boolean);

  const tagCounts = new Map<string, number>();
  for (const row of result.rows) {
    const tags = Array.isArray(row.tags) ? row.tags : [];
    for (const t of tags) {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    }
  }
  const commonTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const difficulties = result.rows.map((r: any) => r.difficulty).filter(Boolean);
  const minD = Math.min(...difficulties, 1);
  const maxD = Math.max(...difficulties, 5);
  const difficultyRange = `${minD}-${maxD}`;

  const subtopics = [...new Set(
    result.rows.map((r: any) => r.subtopic).filter(Boolean)
  )] as string[];

  return { sampleStems, commonTags, difficultyRange, subtopics };
}

async function generateQuestionDrivenBlogPost(
  gap: TopicGap,
  citationStyle: "apa7" | "mla" = "apa7",
  language: string = "en"
): Promise<{
  title: string;
  slug: string;
  summary: string;
  content: any[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  primaryKeyword: string;
  citations: string;
  bodySystem: string;
  tier: string;
}> {
  const context = await fetchQuestionContext(
    gap.topic,
    gap.bodySystem,
    gap.tier,
    gap.sampleQuestionIds
  );

  const tierLabel = gap.tier === "rpn" ? "RPN/LVN" : gap.tier === "rn" ? "RN" : "NP";
  const topicPrompt = buildQuestionDrivenPrompt(gap, context, tierLabel);

  const post = await generateBlogPost(topicPrompt, citationStyle, language);

  const relatedContent = await findRelatedContent({
    slug: post.slug,
    contentType: "blog",
    title: post.title,
    bodySystem: gap.bodySystem,
    category: gap.bodySystem,
    tags: [...post.tags, gap.topic, gap.bodySystem],
    tier: gap.tier,
  }, 12);

  const enrichedContent = injectInternalLinks(post.content, relatedContent, gap);

  const enrichedTags = Array.from(new Set([
    ...post.tags,
    gap.tier,
    gap.exam,
    gap.bodySystem,
    gap.topic,
  ].filter(Boolean).map(t => t.toLowerCase().replace(/[^a-z0-9-\s]/g, "").trim())));

  return {
    ...post,
    content: enrichedContent,
    tags: enrichedTags,
    bodySystem: gap.bodySystem,
    tier: gap.tier,
    seoKeywords: Array.from(new Set([
      ...post.seoKeywords,
      gap.topic.toLowerCase(),
      gap.bodySystem.toLowerCase(),
      `${tierLabel} ${gap.topic}`.toLowerCase(),
    ])),
  };
}

function buildQuestionDrivenPrompt(
  gap: TopicGap,
  context: { sampleStems: string[]; commonTags: string[]; difficultyRange: string; subtopics: string[] },
  tierLabel: string
): string {
  let prompt = `${gap.topic} for ${tierLabel} exam preparation: ${gap.bodySystem} focus`;

  if (context.subtopics.length > 0) {
    prompt += `. Covers subtopics: ${context.subtopics.slice(0, 5).join(", ")}`;
  }

  if (context.sampleStems.length > 0) {
    prompt += `. Addresses clinical scenarios such as: ${context.sampleStems[0]}`;
  }

  prompt += `. Difficulty range ${context.difficultyRange}/5. Aligned with ${gap.exam} exam blueprint.`;

  return prompt;
}

function injectInternalLinks(
  content: any[],
  relatedContent: Array<{ type: string; title: string; href: string; description: string; slug: string }>,
  gap: TopicGap
): any[] {
  const enriched = [...content];

  const lessons = relatedContent.filter(r => r.type === "lesson").slice(0, 3);
  const flashcards = relatedContent.filter(r => r.type === "flashcard").slice(0, 2);
  const examQuestions = relatedContent.filter(r => r.type === "exam-question").slice(0, 3);
  const blogs = relatedContent.filter(r => r.type === "blog").slice(0, 2);

  if (lessons.length > 0 || flashcards.length > 0 || examQuestions.length > 0 || blogs.length > 0) {
    enriched.push({ type: "heading", text: "Related Study Resources" });

    if (lessons.length > 0) {
      enriched.push({
        type: "paragraph",
        text: `Deepen your understanding of ${gap.topic} with these detailed lessons:`,
      });
      enriched.push({
        type: "resource-links",
        category: "lessons",
        items: lessons.map(l => ({
          title: l.title,
          href: l.href,
          description: l.description,
        })),
      });
    }

    if (examQuestions.length > 0) {
      enriched.push({
        type: "paragraph",
        text: `Test your knowledge on ${gap.topic} with practice questions:`,
      });
      enriched.push({
        type: "resource-links",
        category: "practice-questions",
        items: examQuestions.map(q => ({
          title: q.title,
          href: q.href,
          description: q.description,
        })),
      });
    }

    if (flashcards.length > 0) {
      enriched.push({
        type: "paragraph",
        text: `Reinforce key concepts with flashcard decks:`,
      });
      enriched.push({
        type: "resource-links",
        category: "flashcards",
        items: flashcards.map(f => ({
          title: f.title,
          href: f.href,
          description: f.description,
        })),
      });
    }

    if (blogs.length > 0) {
      enriched.push({
        type: "paragraph",
        text: `Continue reading related articles:`,
      });
      enriched.push({
        type: "resource-links",
        category: "related-articles",
        items: blogs.map(b => ({
          title: b.title,
          href: b.href,
          description: b.description,
        })),
      });
    }
  }

  return enriched;
}

async function executePipelineRun(
  runId: string,
  gaps: TopicGap[],
  citationStyle: "apa7" | "mla" = "apa7"
): Promise<void> {
  const run = activePipelineRuns.get(runId);
  if (!run) return;

  for (const gap of gaps) {
    if (run.status === "failed") break;

    try {
      const post = await generateQuestionDrivenBlogPost(gap, citationStyle);

      const isDup = await storage.checkDuplicateSlug(post.slug);
      const finalSlug = isDup ? `${post.slug}-${Date.now()}` : post.slug;

      await storage.createContentItem({
        title: post.title,
        slug: finalSlug,
        type: "blog",
        category: post.bodySystem || "nursing-education",
        bodySystem: post.bodySystem,
        tier: "free",
        status: "published",
        tags: post.tags,
        summary: post.summary,
        content: post.content,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoKeywords: post.seoKeywords,
        primaryKeyword: post.primaryKeyword,
        publishedAt: new Date(),
        autoPublish: true,
        authorName: "Erika Godin, RN",
      });

      try {
        await pool.query(
          `INSERT INTO seo_clusters (id, name, slug, description, content_type, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'blog', NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [
            `${gap.topic} - ${gap.bodySystem}`,
            finalSlug,
            `SEO cluster for ${gap.topic} in ${gap.bodySystem}`,
          ]
        );
      } catch {
      }

      run.generatedPosts++;
      run.details.push({ topic: gap.topic, status: "generated", slug: finalSlug });
      console.log(`[QuestionBlogPipeline] Generated blog for "${gap.topic}" (${gap.bodySystem}) -> ${finalSlug}`);
    } catch (err: any) {
      run.failedPosts++;
      run.details.push({ topic: gap.topic, status: "failed", error: err.message });
      console.error(`[QuestionBlogPipeline] Failed to generate blog for "${gap.topic}":`, err.message);
    }

    run.processedTopics++;
  }

  run.status = "completed";
  run.completedAt = new Date();
}

const ALLOWED_TIERS = ["rpn", "rn", "np"];
const ALLOWED_CITATION_STYLES = ["apa7", "mla"];

function validateTiers(raw: any): string[] | undefined {
  if (!raw) return undefined;
  const arr = typeof raw === "string" ? raw.split(",").map(t => t.trim()) : Array.isArray(raw) ? raw : [];
  const valid = arr.filter((t: string) => ALLOWED_TIERS.includes(t));
  return valid.length > 0 ? valid : undefined;
}

export function registerQuestionBlogPipelineRoutes(app: Express) {
  app.get("/api/admin/question-blog-pipeline/gap-analysis", async (req, res) => {
    try {
      const { requireAdmin } = await import("./admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const rawMin = parseInt(String(req.query.minQuestions || "10"));
      const minQuestions = isNaN(rawMin) || rawMin < 1 ? 10 : Math.min(rawMin, 1000);
      const tiers = validateTiers(req.query.tiers);

      const result = await runGapAnalysis(minQuestions, tiers);
      res.json(result);
    } catch (err: any) {
      console.error("[QuestionBlogPipeline] Gap analysis error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/question-blog-pipeline/generate", async (req, res) => {
    try {
      const { requireAdmin } = await import("./admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const rawTopN = parseInt(String(req.body.topN ?? "10"));
      const rawMinQ = parseInt(String(req.body.minQuestions ?? "10"));
      const topN = isNaN(rawTopN) || rawTopN < 1 ? 10 : rawTopN;
      const minQuestions = isNaN(rawMinQ) || rawMinQ < 1 ? 10 : Math.min(rawMinQ, 1000);
      const tiers = validateTiers(req.body.tiers);
      const rawStyle = String(req.body.citationStyle || "apa7");
      const citationStyle = ALLOWED_CITATION_STYLES.includes(rawStyle) ? rawStyle as "apa7" | "mla" : "apa7";

      const limitedTopN = Math.min(Math.max(1, topN), 50);

      const gapResult = await runGapAnalysis(minQuestions, tiers);
      const topGaps = gapResult.gaps.slice(0, limitedTopN);

      if (topGaps.length === 0) {
        return res.json({
          message: "No uncovered topics found matching the criteria",
          gapAnalysis: gapResult,
        });
      }

      const runId = `qblog-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const runStatus: PipelineRunStatus = {
        id: runId,
        status: "running",
        startedAt: new Date(),
        totalTopics: topGaps.length,
        processedTopics: 0,
        generatedPosts: 0,
        failedPosts: 0,
        details: [],
      };

      activePipelineRuns.set(runId, runStatus);

      executePipelineRun(runId, topGaps, citationStyle).catch(err => {
        const run = activePipelineRuns.get(runId);
        if (run) {
          run.status = "failed";
          run.details.push({ topic: "pipeline", status: "error", error: err.message });
        }
      });

      res.json({
        runId,
        message: `Pipeline started for ${topGaps.length} topics`,
        topics: topGaps.map(g => ({
          topic: g.topic,
          bodySystem: g.bodySystem,
          tier: g.tier,
          questionCount: g.questionCount,
        })),
      });
    } catch (err: any) {
      console.error("[QuestionBlogPipeline] Generate error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/question-blog-pipeline/status/:runId", async (req, res) => {
    try {
      const { requireAdmin } = await import("./admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const run = activePipelineRuns.get(req.params.runId);
      if (!run) {
        return res.status(404).json({ error: "Pipeline run not found" });
      }

      res.json(run);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/question-blog-pipeline/runs", async (req, res) => {
    try {
      const { requireAdmin } = await import("./admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const runs = Array.from(activePipelineRuns.values())
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
        .slice(0, 20);

      res.json({ runs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
