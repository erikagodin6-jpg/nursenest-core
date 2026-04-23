import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
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
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const { id } = await ctx.params;
  let raw: unknown = {};
  try {
    raw = await req.json();
  } catch {
    raw = {};
  }
  const intent = parseAdminJsonMutationIntent(raw);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields((raw ?? {}) as Record<string, unknown>);
  const parsed = bodySchema.safeParse(stripped);
  let limit = 4;
  if (parsed.success && parsed.data.limit != null) limit = parsed.data.limit;

  if (intent.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      preview: `Would process up to ${limit} pending item(s) for batch ${id.slice(0, 8)}…`,
    });
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
