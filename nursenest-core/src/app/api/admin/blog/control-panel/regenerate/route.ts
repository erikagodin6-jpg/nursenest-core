import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { blogControlPanelPlanSchema } from "@/lib/blog/blog-control-panel-schema";
import { regenerateControlPanelSection } from "@/lib/blog/blog-control-panel-generation";

const sectionSchema = z.enum([
  "title_options",
  "meta",
  "outline",
  "article_html",
  "faqs",
  "internal_links",
  "apa_sources",
  "image_placements",
]);

const bodySchema = z.object({
  section: sectionSchema,
  topic: z.string().min(3).max(200),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).default("unspecified"),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent),
  funnelStage: z.nativeEnum(BlogFunnelStage),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  keywords: z.string().max(500).optional(),
  currentTitle: z.string().max(220).optional(),
  currentBody: z.string().max(500_000).optional(),
  currentPlan: blogControlPanelPlanSchema.optional(),
});

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

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  if (d.section === "article_html" && !d.currentPlan) {
    return NextResponse.json({ error: "currentPlan required for article_html" }, { status: 400 });
  }

  try {
    const out = await regenerateControlPanelSection({
      section: d.section,
      topic: d.topic,
      exam: d.exam,
      country: d.country,
      template: d.template,
      intent: d.intent,
      funnelStage: d.funnelStage,
      tone: d.tone ?? "professional",
      keywords: d.keywords,
      currentPlan: d.currentPlan,
      currentBody: d.currentBody,
      currentTitle: d.currentTitle,
    });
    return NextResponse.json({ ok: true, result: out });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "regeneration_failed", message: msg }, { status: 502 });
  }
}
