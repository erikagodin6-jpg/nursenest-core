import { BlogFunnelStage, BlogImageStatus, BlogPostIntent, BlogPostStatus, BlogPostTemplate, BlogWorkflowStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { BLOG_TEMPLATE_TITLE_PATTERNS } from "@/lib/blog/blog-template-copy";
import { buildApa7References, type BlogSourceRecord, validateSources } from "@/lib/blog/apa7";
import { buildOutline, ctaFor, detectRiskFlags, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import { prisma } from "@/lib/db";

const schema = z.object({
  topic: z.string().min(3).max(200),
  keywords: z.string().max(400).optional(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  includeImage: z.boolean().optional(),
  includeAiImage: z.boolean().optional(),
  targetKeyword: z.string().max(200).optional(),
  keywordCluster: z.string().max(200).optional(),
  countryTarget: z.enum(["CA", "US"]).optional(),
  sourceRecords: z.array(
    z.object({
      authors: z.array(z.string()).optional(),
      year: z.string().optional(),
      title: z.string().optional(),
      source: z.string().optional(),
      publisher: z.string().optional(),
      url: z.string().url().optional(),
      doi: z.string().optional(),
      authority: z.enum(["regulator", "guideline_body", "peer_reviewed", "academic_hospital", "association", "general_web", "low_authority"]).optional(),
    }),
  ).optional(),
  slug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

/**
 * Single-post AI draft generation (one model call per request — batch uses /api/admin/blog/batch-chunk).
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "AI admin generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

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
      return NextResponse.json({ error: "Model returned too little content" }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Generation failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
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
  const workflowStatus =
    !seoDescription || !title ? BlogWorkflowStatus.NEEDS_METADATA :
    (sources.length === 0 && riskFlags.length > 0) ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW :
    riskFlags.length > 0 ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW :
    BlogWorkflowStatus.GENERATED;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: excerpt.length >= 10 ? excerpt : `${title.slice(0, 200)} — draft excerpt; edit before publish.`,
      body: bodyHtml,
      exam: d.exam,
      targetKeyword: d.targetKeyword ?? d.topic,
      keywordCluster: d.keywordCluster ?? null,
      countryTarget: d.countryTarget ?? null,
      intent: d.intent ?? BlogPostIntent.EXAM_PREP,
      funnelStage: d.funnelStage ?? BlogFunnelStage.CONSIDERATION,
      postTemplate: d.template,
      postStatus: BlogPostStatus.DRAFT,
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
      sourcesJson: sources.length ? sources : null,
      apaReferences,
      requiresReferences: Boolean(sources.length || riskFlags.length > 0),
      sourceReliabilityScore: sourceCheck.reliabilityScore,
      medicalRiskFlags: riskFlags,
      imageStatus: d.includeImage ? (d.includeAiImage ? BlogImageStatus.REQUESTED : BlogImageStatus.NONE) : BlogImageStatus.NONE,
      coverImagePrompt: d.includeAiImage ? `Educational nursing blog hero image about ${d.topic}. Focus keyword: ${d.targetKeyword ?? d.topic}.` : null,
      shortSummary: excerpt.slice(0, 220),
      socialCaption: `${title} — ${excerpt.slice(0, 120)}...`,
      promoBlurb: cta.text,
      updateNeeded: Boolean(thinWarning),
      rankingNote: thinWarning ?? null,
    },
    select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
  });

  return NextResponse.json({
    post,
    warnings: [...sourceCheck.warnings, ...(thinWarning ? [thinWarning] : [])],
  }, { status: 201 });
}
