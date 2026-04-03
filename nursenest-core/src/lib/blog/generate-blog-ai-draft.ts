import {
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  Prisma,
} from "@prisma/client";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { BLOG_TEMPLATE_TITLE_PATTERNS } from "@/lib/blog/blog-template-copy";
import { buildApa7References, type BlogSourceRecord, validateSources } from "@/lib/blog/apa7";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { buildOutline, ctaFor, detectRiskFlags, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import { prisma } from "@/lib/db";

export type GenerateBlogAiDraftInput = {
  topic: string;
  keywords?: string;
  exam: string;
  country?: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent?: BlogPostIntent;
  funnelStage?: BlogFunnelStage;
  tone?: "professional" | "supportive" | "direct";
  includeImage?: boolean;
  includeAiImage?: boolean;
  targetKeyword?: string;
  keywordCluster?: string;
  countryTarget?: "CA" | "US";
  sourceRecords?: BlogSourceRecord[];
  slug?: string;
  /**
   * When set, post is created as SCHEDULED (future) or PUBLISHED (past/now) instead of DRAFT.
   * Used by batch topic scheduler; manual generator omits this.
   */
  publishAt?: Date;
};

export type GenerateBlogAiDraftResult =
  | {
      ok: true;
      skipped: true;
      reason: "duplicate_slug" | "duplicate_topic" | "duplicate_slug_race";
      slug?: string;
      existingSlug?: string;
      normalizedTopic?: string;
    }
  | {
      ok: true;
      skipped: false;
      post: { id: string; slug: string; title: string; postStatus: BlogPostStatus; updatedAt: Date };
      warnings: string[];
    }
  | { ok: false; error: string };

function resolvePostStatusForPublishAt(publishAt: Date | undefined, now: Date): { postStatus: BlogPostStatus; publishAt: Date | null } {
  if (!publishAt) {
    return { postStatus: BlogPostStatus.DRAFT, publishAt: null };
  }
  if (publishAt.getTime() > now.getTime()) {
    return { postStatus: BlogPostStatus.SCHEDULED, publishAt };
  }
  return { postStatus: BlogPostStatus.PUBLISHED, publishAt };
}

/**
 * Core AI blog draft creation (shared by `/api/admin/blog/generate-ai` and batch schedulers).
 * Enforces slug + canonical intent dedupe via {@link findExistingBlogByCanonicalIntent}.
 */
export async function generateBlogAiDraft(d: GenerateBlogAiDraftInput): Promise<GenerateBlogAiDraftResult> {
  const normalizedTopic = normalizeBlogTopicKey(d.targetKeyword ?? d.topic);
  const now = new Date();

  const titleFn = BLOG_TEMPLATE_TITLE_PATTERNS[d.template];
  const title = titleFn({ exam: d.exam, topic: d.topic });
  const slug =
    d.slug ??
    (await (async () => {
      const base = `${d.exam}-${d.topic}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 100);
      let candidate = base;
      let n = 0;
      while (await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } })) {
        n += 1;
        candidate = `${base}-${n}`.slice(0, 120);
      }
      return candidate;
    })());

  const dupBySlug = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (dupBySlug) {
    return { ok: true, skipped: true, reason: "duplicate_slug", slug };
  }
  const dupByTopic = normalizedTopic
    ? await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic })
    : null;
  if (dupByTopic) {
    return {
      ok: true,
      skipped: true,
      reason: "duplicate_topic",
      existingSlug: dupByTopic.slug,
      normalizedTopic,
    };
  }

  const system = `You write SEO-aware HTML for NurseNest nursing education blog posts. Output valid HTML only: use <h2>, <h3>, <p>, <ul>, <li>, <strong>. No markdown. No fabricated statistics or pass-rate claims. Be accurate and conservative. Audience: nursing students preparing for licensure exams.
Include a short "Key takeaways" section and a short FAQ section when natural.
Do not include medical treatment advice beyond educational exam prep framing.`;

  const user = `Write the article body (HTML only, no outer <html>).

Template: ${d.template}
Intent: ${d.intent ?? "EXAM_PREP"}
Funnel stage: ${d.funnelStage ?? "CONSIDERATION"}
Exam focus: ${d.exam}
${d.country && d.country !== "unspecified" ? `Country context: ${d.country}` : ""}
Topic: ${d.topic}
${d.keywords ? `Keywords / phrases: ${d.keywords}` : ""}
${d.targetKeyword ? `Primary target keyword: ${d.targetKeyword}` : ""}
${d.keywordCluster ? `Keyword cluster: ${d.keywordCluster}` : ""}
Tone: ${d.tone ?? "professional"}

Include:
- A short intro paragraph
- 3–5 H2 sections with practical, exam-relevant guidance
- One short bullet list where helpful
- A closing paragraph with a soft CTA to practice (no fake guarantees)

Title (for context only, do not repeat as H1 in body): ${title}`;

  let bodyHtml: string;
  try {
    const response = await openAiChatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.45,
      maxTokens: 3600,
    });
    bodyHtml = response.content.trim();
    if (bodyHtml.length < 200) {
      return { ok: false, error: "Model returned too little content" };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  const excerpt = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
  const seoDescription = excerpt.slice(0, 320);
  const sources = (d.sourceRecords ?? []) as BlogSourceRecord[];
  const apaReferences = buildApa7References(sources);
  const sourceCheck = validateSources(sources);
  const outline = buildOutline({
    title,
    targetKeyword: d.targetKeyword ?? d.topic,
    intent: d.intent ?? BlogPostIntent.EXAM_PREP,
    template: d.template,
  });
  const cta = ctaFor({ intent: d.intent, funnel: d.funnelStage, template: d.template });
  const riskFlags = detectRiskFlags({ template: d.template, keyword: d.targetKeyword ?? d.topic });
  const thinWarning = thinDraftWarning(bodyHtml);
  const workflowStatusBase =
    !seoDescription || !title ? BlogWorkflowStatus.NEEDS_METADATA :
    sources.length === 0 && riskFlags.length > 0 ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW :
    riskFlags.length > 0 ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW :
    BlogWorkflowStatus.GENERATED;

  const dupSlugLate = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (dupSlugLate) {
    return { ok: true, skipped: true, reason: "duplicate_slug", slug };
  }
  const dupTopicLate =
    normalizedTopic && (await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic }));
  if (dupTopicLate) {
    return {
      ok: true,
      skipped: true,
      reason: "duplicate_topic",
      existingSlug: dupTopicLate.slug,
      normalizedTopic,
    };
  }

  const { postStatus, publishAt } = resolvePostStatusForPublishAt(d.publishAt, now);
  const workflowStatus =
    postStatus === BlogPostStatus.PUBLISHED ? BlogWorkflowStatus.PUBLISHED :
    postStatus === BlogPostStatus.SCHEDULED ? BlogWorkflowStatus.SCHEDULED :
    workflowStatusBase;

  try {
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt: excerpt.length >= 10 ? excerpt : `${title.slice(0, 200)}. Draft excerpt; edit before publish.`,
        body: bodyHtml,
        exam: d.exam,
        targetKeyword: normalizedTopic || (d.targetKeyword ?? d.topic),
        keywordCluster: d.keywordCluster ?? null,
        countryTarget: d.countryTarget ?? null,
        intent: d.intent ?? BlogPostIntent.EXAM_PREP,
        funnelStage: d.funnelStage ?? BlogFunnelStage.CONSIDERATION,
        postTemplate: d.template,
        postStatus,
        publishAt,
        seoTitle: title.slice(0, 200),
        seoDescription,
        tags: d.keywords ? d.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12) : [],
        outlineJson: outline,
        keyQuestions: [
          `What matters most about ${d.topic} on ${d.exam}?`,
          `What mistakes should students avoid for ${d.topic}?`,
        ],
        keywordPlan: [d.targetKeyword ?? d.topic, ...(d.keywords ? d.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8) : [])],
        ctaType: cta.type,
        ctaText: cta.text,
        ctaHref: cta.href,
        workflowStatus,
        sourcesJson: sources.length ? (sources as Prisma.InputJsonValue) : Prisma.JsonNull,
        apaReferences,
        requiresReferences: Boolean(sources.length || riskFlags.length > 0),
        sourceReliabilityScore: sourceCheck.reliabilityScore,
        medicalRiskFlags: riskFlags,
        imageStatus: d.includeImage ? (d.includeAiImage ? BlogImageStatus.REQUESTED : BlogImageStatus.NONE) : BlogImageStatus.NONE,
        coverImagePrompt: d.includeAiImage ? `Educational nursing blog hero image about ${d.topic}. Focus keyword: ${d.targetKeyword ?? d.topic}.` : null,
        shortSummary: excerpt.slice(0, 220),
        socialCaption: `${title}. ${excerpt.slice(0, 120)}...`,
        promoBlurb: cta.text,
        updateNeeded: Boolean(thinWarning),
        rankingNote: thinWarning ?? null,
      },
      select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
    });

    return {
      ok: true,
      skipped: false,
      post,
      warnings: [...sourceCheck.warnings, ...(thinWarning ? [thinWarning] : [])],
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: true, skipped: true, reason: "duplicate_slug_race", slug };
    }
    throw e;
  }
}
