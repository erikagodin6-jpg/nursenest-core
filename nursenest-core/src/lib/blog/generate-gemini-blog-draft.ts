import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { z } from "zod";
import { generateGeminiJson, GeminiJsonError } from "@/lib/ai/gemini-json";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import {
  findExistingBlogByCanonicalIntent,
  normalizeBlogTopicKey,
} from "@/lib/blog/blog-intent-dedupe";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import {
  type ControlPanelGenerateInput,
  persistControlPanelDraft,
} from "@/lib/blog/blog-control-panel-generation";
import { prisma } from "@/lib/db";

const geminiDraftSchema = z.object({
  title: z.string().min(10).max(200),
  slug: z.string().min(3).max(120),
  metaDescription: z.string().min(80).max(320),
  excerpt: z.string().min(80).max(360),
  body: z.string().min(50),
});

type GeminiBlogDraftInput = {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  minWordCount: number;
  template: BlogPostTemplate;
};

type GeminiBlogDraftResult =
  | { ok: true; skipped: true; reason: "duplicate_topic" | "duplicate_slug"; existingSlug?: string; slug?: string }
  | { ok: true; skipped: false; post: { id: string; slug: string; title: string; postStatus: string }; wordCount: number }
  | { ok: false; error: string; code?: string };

function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
}

function inferOutline(bodyHtml: string, topic: string): BlogControlPanelPlan["outline"] {
  const sections = [...bodyHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
    .map((m) => (m[1] ?? "").replace(/<[^>]+>/g, "").trim())
    .filter((v) => v.length >= 3)
    .slice(0, 8);
  const fallback = [
    `Core concept: ${topic}`,
    "Clinical assessment and diagnostics",
    "Nursing priorities and exam pitfalls",
  ];
  const normalized = (sections.length >= 3 ? sections : fallback).map((h2) => ({ h2 }));
  return normalized;
}

function buildPlanFromDraft(draft: z.infer<typeof geminiDraftSchema>, topic: string): BlogControlPanelPlan {
  const title = draft.title.trim().slice(0, 200);
  const slug = sanitizeSlug(draft.slug) || sanitizeSlug(`${topic}-nursing-guide`) || "nursing-blog-draft";
  return {
    titleOptions: [title, `${title} for Nursing Exams`].slice(0, 2),
    h1: title,
    recommendedSlug: slug,
    metaTitle: title.slice(0, 70),
    metaDescription: draft.metaDescription.trim().slice(0, 320),
    outline: inferOutline(draft.body, topic),
    suggestedInternalLessons: [],
    faqs: [],
    breadcrumbs: [],
    imagePlacements: [],
    apaSourceStubs: [],
    keyTakeaways: [],
    featuredSnippetHint: undefined,
    suggestedExcerpt: draft.excerpt.trim().slice(0, 360),
    openGraphTitle: title.slice(0, 90),
    openGraphDescription: draft.metaDescription.trim().slice(0, 200),
    canonicalPath: undefined,
    seoFocusKeywords: [normalizeBlogTopicKey(topic), "nursing exam prep"].filter(Boolean),
    schemaOpportunities: undefined,
    internalAnchorOpportunities: [],
    recommendedInternalLinks: [],
    sourceCandidates: [],
    needsReviewFlags: [],
    editorialNotes: [],
  };
}

export async function generateGeminiBlogDraft(input: GeminiBlogDraftInput): Promise<GeminiBlogDraftResult> {
  const normalizedTopic = normalizeBlogTopicKey(input.topic);
  const existing = await findExistingBlogByCanonicalIntent({ exam: input.exam, normalizedTopic });
  if (existing) {
    return { ok: true, skipped: true, reason: "duplicate_topic", existingSlug: existing.slug };
  }

  const systemPrompt =
    "You are a senior nursing education writer for licensure exam prep. Output only valid JSON with fields: title, slug, metaDescription, excerpt, body. Body must be HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong>.";

  const userPrompt = `Create one nursing exam prep blog draft.
Topic: ${input.topic}
Exam: ${input.exam}
Country: ${input.country}
Minimum words in body text: ${input.minWordCount}

Quality requirements:
- Audience: nursing students preparing for exam-style questions.
- Must be clinically useful, specific, and non-generic.
- Strong heading structure.
- Include relevant sections where appropriate: introduction, pathophysiology, signs and symptoms, assessment, diagnostics/labs, interventions, nursing priorities, complications, patient education, clinical pearls, common exam pitfalls.
- Omit irrelevant sections instead of forcing content.
- No fabricated statistics or fake references.
- Keep conversion-aware but professional (no spammy claims).

Return JSON only.`;

  let draft: z.infer<typeof geminiDraftSchema>;
  try {
    draft = await generateGeminiJson({
      schema: geminiDraftSchema,
      systemPrompt,
      userPrompt,
      malformedRetries: 1,
      timeoutMs: 45000,
    });
  } catch (error) {
    if (error instanceof GeminiJsonError) {
      return { ok: false, error: error.message, code: error.code };
    }
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }

  const bodyWordCount = countWordsFromHtml(draft.body);
  if (bodyWordCount < input.minWordCount) {
    return {
      ok: false,
      error: `Draft below minimum word count (${bodyWordCount}/${input.minWordCount}).`,
      code: "word_count",
    };
  }

  const sanitizedSlug = sanitizeSlug(draft.slug);
  if (!sanitizedSlug) {
    return { ok: false, error: "Gemini returned an invalid slug.", code: "invalid_slug" };
  }
  const slugCollision = await prisma.blogPost.findUnique({ where: { slug: sanitizedSlug }, select: { id: true } });
  if (slugCollision) {
    return { ok: true, skipped: true, reason: "duplicate_slug", slug: sanitizedSlug };
  }

  const plan = buildPlanFromDraft({ ...draft, slug: sanitizedSlug }, input.topic);
  const persistInput: ControlPanelGenerateInput = {
    topic: input.topic,
    exam: input.exam,
    country: input.country,
    template: input.template,
    intent: BlogPostIntent.EXAM_PREP,
    funnelStage: BlogFunnelStage.CONSIDERATION,
    tone: "professional",
    includeImage: false,
    includeAiImage: false,
    targetKeyword: input.topic,
    sourceRecordsJson: undefined,
    fixedSlug: sanitizedSlug,
    allowInsufficientCitations: true,
  };

  const persisted = await persistControlPanelDraft(persistInput, plan, draft.body);
  if (!persisted.ok) {
    return { ok: false, error: persisted.error, code: persisted.code };
  }
  if (persisted.skipped) {
    return {
      ok: true,
      skipped: true,
      reason: persisted.reason === "duplicate_topic" ? "duplicate_topic" : "duplicate_slug",
      existingSlug: persisted.existingSlug,
      slug: persisted.slug,
    };
  }

  return {
    ok: true,
    skipped: false,
    post: {
      id: persisted.post.id,
      slug: persisted.post.slug,
      title: persisted.post.title,
      postStatus: persisted.post.postStatus,
    },
    wordCount: bodyWordCount,
  };
}
