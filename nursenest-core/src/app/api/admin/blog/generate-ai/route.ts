import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { blogSimpleAiDraftBodySchema } from "@/lib/admin/blog-simple-ai-draft-schema";
import { logSimpleAiDraftRun } from "@/lib/admin/blog-content-automation-log";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { generateBlogAiDraft } from "@/lib/blog/generate-blog-ai-draft";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";

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

  const parsed = blogSimpleAiDraftBodySchema.safeParse(await req.json());
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
    allowDuplicateCanonicalTopic: d.allowDuplicateCanonicalTopic,
  });

  await logSimpleAiDraftRun({ createdById: gate.admin.userId, body: d, result });

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
