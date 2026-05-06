import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { enforceFlashcardCategoryMinimums, MIN_FLASHCARDS_PER_CATEGORY } from "@/lib/flashcards/generate-flashcards";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  minimumPerCategory: z.number().int().min(1).max(500).optional(),
  dryRun: z.boolean().optional(),
});

const adminGenerationEntitlement: AccessScope = {
  hasAccess: true,
  reason: "admin_override",
  tier: null,
  country: null,
  alliedCareer: null,
};

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = requestSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const summary = await enforceFlashcardCategoryMinimums({
    prisma,
    entitlement: adminGenerationEntitlement,
    minimumPerCategory: parsed.data.minimumPerCategory ?? MIN_FLASHCARDS_PER_CATEGORY,
    dryRun: parsed.data.dryRun === true,
  });

  return NextResponse.json({ ok: true, ...summary });
}
