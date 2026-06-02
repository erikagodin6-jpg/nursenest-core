import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { createDemoUser } from "@/lib/demo-users/create-demo-user";
import { prisma } from "@/lib/db";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";
import {
  parseAdminJsonMutationIntent,
  stripAdminMutationControlFields,
} from "@/lib/admin/admin-mutation-intent";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const postBodySchema = z.object({
  pathwayId: z.string().min(1),
  completedLessonCount: z.coerce.number().int().min(0).max(500).optional(),
  lessonCompletionPercent: z.coerce.number().min(0).max(100).optional(),
  readinessScoreTarget: z.coerce.number().min(0).max(100).optional(),
});

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const users = await prisma.user.findMany({
    where: { isDemoUser: true },
    orderBy: { createdAt: "desc" },
    take: API_LIST_PAGE_SIZE_HARD_MAX,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      country: true,
      learnerPath: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    safeServerLog("admin_demo_users", "post_invalid_json", {});
    return NextResponse.json(
      { ok: false, code: "admin_demo_users_invalid_json", error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const intent = parseAdminJsonMutationIntent(body);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields(body as Record<string, unknown>);
  const parsed = postBodySchema.safeParse(stripped);

  if (!parsed.success) {
    safeServerLog("admin_demo_users", "post_invalid_payload", { detail: "zod" });
    return NextResponse.json(
      {
        ok: false,
        code: "admin_demo_users_invalid_payload",
        error: "Invalid payload",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (intent.dryRun) {
    const pathway = getExamPathwayById(parsed.data.pathwayId);

    safeServerLog("admin_demo_users", "create_dry_run", {
      pathwayId: parsed.data.pathwayId.slice(0, 24),
    });

    return NextResponse.json({
      ok: true,
      dryRun: true,
      preview: {
        pathwayId: parsed.data.pathwayId,
        pathwayLabel: pathway?.displayName ?? null,
        lessonCompletionPercent: parsed.data.lessonCompletionPercent,
        readinessScoreTarget: parsed.data.readinessScoreTarget,
      },
    });
  }

  const result = await createDemoUser(parsed.data);

  if (!result.ok) {
    safeServerLog("admin_demo_users", "create_failed", { code: result.code });

    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status: 400 },
    );
  }

  safeServerLog("admin_demo_users", "create_ok", {
    userIdPrefix: result.userId.slice(0, 8),
  });

  // ✅ FIXED HERE
  return NextResponse.json({
    ...result,
    ok: true,
  });
}

const deleteBodySchema = z.object({
  userId: z.string().min(1),
});

export async function DELETE(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    safeServerLog("admin_demo_users", "delete_invalid_json", {});

    return NextResponse.json(
      {
        ok: false,
        code: "admin_demo_users_delete_invalid_json",
        error: "JSON body required with { confirm: true, userId } or { dryRun: true, userId }.",
      },
      { status: 400 },
    );
  }

  const intent = parseAdminJsonMutationIntent(body);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields(body as Record<string, unknown>);
  const parsed = deleteBodySchema.safeParse(stripped);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "admin_demo_users_delete_missing_user_id",
        error: "userId required in body",
      },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findFirst({
    where: { id: parsed.data.userId, isDemoUser: true },
    select: { id: true, email: true },
  });

  if (!existing) {
    safeServerLog("admin_demo_users", "delete_not_found", {
      userIdPrefix: parsed.data.userId.slice(0, 8),
    });

    return NextResponse.json(
      {
        ok: false,
        code: "admin_demo_users_not_found",
        error: "Demo user not found",
      },
      { status: 404 },
    );
  }

  if (intent.dryRun) {
    safeServerLog("admin_demo_users", "delete_dry_run", {
      userIdPrefix: existing.id.slice(0, 8),
    });

    return NextResponse.json({
      ok: true,
      dryRun: true,
      preview: {
        userId: existing.id,
        email: existing.email,
        wouldDelete: true,
      },
    });
  }

  await prisma.user.delete({ where: { id: existing.id } });

  safeServerLog("admin_demo_users", "delete_ok", {
    userIdPrefix: existing.id.slice(0, 8),
  });

  return NextResponse.json({ ok: true });
}