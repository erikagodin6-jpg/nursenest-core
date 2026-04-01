import { BlogPostTemplate, BlogPostIntent, BlogFunnelStage } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { generateBlogAiDraft } from "@/lib/blog/generate-blog-ai-draft";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";

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
  const normalizedTopic = normalizeBlogTopicKey(d.targetKeyword ?? d.topic);

  const result = await generateBlogAiDraft({
    topic: d.topic,
    keywords: d.keywords,
    exam: d.exam,
    country: d.country,
    template: d.template,
    intent: d.intent,
    funnelStage: d.funnelStage,
    tone: d.tone,
    includeImage: d.includeImage,
    includeAiImage: d.includeAiImage,
    targetKeyword: d.targetKeyword,
    keywordCluster: d.keywordCluster,
    countryTarget: d.countryTarget,
    sourceRecords: d.sourceRecords,
    slug: d.slug,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  if (result.skipped) {
    if (result.reason === "duplicate_topic") {
      return NextResponse.json(
        { ok: true, skipped: true, reason: "duplicate_topic", existingSlug: result.existingSlug, normalizedTopic },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { ok: true, skipped: true, reason: result.reason, slug: result.slug },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      post: result.post,
      warnings: result.warnings,
    },
    { status: 201 },
  );
}
