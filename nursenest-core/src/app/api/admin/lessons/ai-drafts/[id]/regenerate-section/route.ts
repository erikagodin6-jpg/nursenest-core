import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { adminAiLessonRegenerateSectionSchema } from "@/lib/lessons/admin-ai-lesson-schema";
import type { AdminAiLessonDraftNormalized } from "@/lib/lessons/admin-ai-lesson-schema";
import { ADMIN_AI_LESSON_GENERATOR_TOOL, regenerateAdminAiLessonSection } from "@/lib/lessons/admin-ai-lesson-pipeline";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "Admin AI generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) return NextResponse.json({ error: keyCheck.message }, { status: 503 });

  const rl = checkAdminAiGenerateLimit(gate.admin.userId);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later.", code: "RATE_LIMIT" }, { status: 429 });
  }

  const parsed = adminAiLessonRegenerateSectionSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.generatedLessonDraft.findFirst({
    where: { id, tool: ADMIN_AI_LESSON_GENERATOR_TOOL },
  });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const normalized = draft.normalizedJson as unknown as AdminAiLessonDraftNormalized;
  if (!normalized?.lesson || normalized.version !== 1) {
    return NextResponse.json({ error: "Draft has no valid normalized lesson" }, { status: 400 });
  }

  try {
    const nextLesson = await regenerateAdminAiLessonSection(normalized, parsed.data);
    const nextNormalized: AdminAiLessonDraftNormalized = {
      ...normalized,
      lesson: nextLesson,
      lastSectionRegenAt: new Date().toISOString(),
    };

    const model = getOpenAiChatModel();
    const prevVal =
      typeof draft.validationJson === "object" && draft.validationJson !== null && !Array.isArray(draft.validationJson)
        ? (draft.validationJson as Record<string, unknown>)
        : {};
    await prisma.generatedLessonDraft.update({
      where: { id },
      data: {
        normalizedJson: nextNormalized as object,
        titlePreview: nextLesson.title.slice(0, 500),
        validationJson: {
          ...prevVal,
          lastRegen: new Date().toISOString(),
          model,
        },
      },
    });

    return NextResponse.json({ ok: true, lesson: nextLesson, normalized: nextNormalized });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Regeneration failed", message }, { status: 502 });
  }
}
