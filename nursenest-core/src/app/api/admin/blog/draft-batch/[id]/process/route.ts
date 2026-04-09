import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";
import { processDraftGenerationBatchItems } from "@/lib/blog/blog-draft-generation-batch";

const bodySchema = z.object({
  limit: z.number().int().min(1).max(DRAFT_BATCH_MAX_ITEMS_PER_PROCESS).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Processes up to `limit` pending items (default 4). Idempotent; safe to retry. Chunk to avoid timeouts.
 */
export async function POST(req: Request, ctx: RouteContext) {
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

  const { id } = await ctx.params;
  let limit = 4;
  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (parsed.success && parsed.data.limit != null) limit = parsed.data.limit;
  } catch {
    /* empty body */
  }

  const out = await processDraftGenerationBatchItems(id, limit);
  if (out.errors.length > 0 && out.processed === 0) {
    const first = out.errors[0] ?? "process_failed";
    const status =
      first === "batch_not_found" ? 404
      : first === "batch_cancelled" ? 409
      : 503;
    return NextResponse.json({ ok: false, ...out }, { status });
  }

  return NextResponse.json({ ok: true, ...out });
}
