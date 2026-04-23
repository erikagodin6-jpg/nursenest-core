import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent } from "@/lib/admin/admin-mutation-intent";
import {
  applyQuestionBankBulkImport,
  QUESTION_BANK_BULK_IMPORT_MAX_ITEMS,
  runQuestionBankBulkImportReport,
} from "@/lib/admin/question-bank-bulk-import";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  items: z.unknown(),
  dryRun: z.boolean().optional().default(true),
  /** Required when dryRun is false — must match env `NN_ADMIN_QUESTION_BULK_IMPORT_SECRET`. */
  applySecret: z.string().optional(),
});

/**
 * Validate JSON question banks, dedupe by stem hash (in-file + vs `exam_questions.stem_hash`).
 * Apply (insert drafts) is super-admin only and requires env secret — off by default in production.
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return NextResponse.json(
      { error: "Database unavailable or safe mode", code: "bulk_import_unavailable" },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON", code: "bulk_import_invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", code: "bulk_import_invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { items, dryRun, applySecret } = parsed.data;

  if (!dryRun) {
    const intent = parseAdminJsonMutationIntent(json);
    if (intent instanceof NextResponse) return intent;
  }

  if (dryRun) {
    const report = await runQuestionBankBulkImportReport(items);
    return NextResponse.json({
      dryRun: true,
      maxItems: QUESTION_BANK_BULK_IMPORT_MAX_ITEMS,
      ...report,
    });
  }

  if (gate.admin.tier !== "super") {
    return NextResponse.json(
      { error: "Apply requires super admin", code: "bulk_import_super_only" },
      { status: 403 },
    );
  }

  const secret = process.env.NN_ADMIN_QUESTION_BULK_IMPORT_SECRET?.trim();
  if (!secret || applySecret !== secret) {
    return NextResponse.json(
      {
        error: "Bulk apply disabled or invalid secret",
        code: "bulk_import_secret",
        hint: "Set NN_ADMIN_QUESTION_BULK_IMPORT_SECRET and pass applySecret in the request body.",
      },
      { status: 403 },
    );
  }

  const result = await applyQuestionBankBulkImport(items, { userId: gate.admin.userId });
  return NextResponse.json({
    dryRun: false,
    maxItems: QUESTION_BANK_BULK_IMPORT_MAX_ITEMS,
    created: result.created,
    skipped: result.skipped,
    rowReports: result.rowReports,
    summary: {
      note: "New rows are created as DRAFT. Review and publish via the question editor or AI review queue.",
    },
  });
}
