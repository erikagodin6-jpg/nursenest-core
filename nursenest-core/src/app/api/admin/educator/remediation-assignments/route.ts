import { Prisma, RemediationQueueSource } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  title?: string;
  topic?: string;
  pathwayId?: string | null;
  bodySystem?: string | null;
  dueDays?: number;
  priorityScore?: number;
  learnerIds?: string[];
  confirm?: boolean;
  dryRun?: boolean;
};

function cleanText(value: unknown, fallback: string, max = 200): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed.slice(0, max) : fallback;
}

function cleanOptionalText(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed.slice(0, max) : null;
}

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(min, Math.min(max, n));
}

async function findCandidateLearners(args: {
  topic: string;
  pathwayId: string | null;
  learnerIds: string[];
}) {
  if (args.learnerIds.length > 0) {
    const users = await prisma.user.findMany({
      where: {
        id: { in: args.learnerIds.slice(0, 250) },
        role: "LEARNER",
        ...(args.pathwayId ? { learnerPath: args.pathwayId } : {}),
      },
      select: { id: true },
      take: 250,
    });
    return users.map((u) => u.id);
  }

  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    WITH topic_candidates AS (
      SELECT DISTINCT uts."userId" AS id
      FROM "UserTopicStat" uts
      JOIN "User" u ON u.id = uts."userId"
      WHERE u.role = 'LEARNER'
        ${args.pathwayId ? Prisma.sql`AND u."learnerPath" = ${args.pathwayId}` : Prisma.empty}
        AND lower(uts.topic) = lower(${args.topic})
        AND uts."wrongCount" > 0
      UNION
      SELECT DISTINCT e."userId" AS id
      FROM "UserRemediationEvent" e
      JOIN "User" u ON u.id = e."userId"
      WHERE u.role = 'LEARNER'
        ${args.pathwayId ? Prisma.sql`AND u."learnerPath" = ${args.pathwayId}` : Prisma.empty}
        AND lower(COALESCE(e.topic, '')) = lower(${args.topic})
    ),
    fallback_candidates AS (
      SELECT u.id
      FROM "User" u
      LEFT JOIN student_study_profiles s ON s.user_id = u.id
      LEFT JOIN "UserRemediationQueue" rq ON rq."userId" = u.id AND rq.resolved = false
      WHERE u.role = 'LEARNER'
        ${args.pathwayId ? Prisma.sql`AND u."learnerPath" = ${args.pathwayId}` : Prisma.empty}
      GROUP BY u.id, s.readiness_score, s.total_correct, s.total_incorrect
      HAVING
        COALESCE(s.readiness_score, 0) < 70
        OR COALESCE(s.total_incorrect, 0) > COALESCE(s.total_correct, 0)
        OR COUNT(DISTINCT rq.id) >= 2
      ORDER BY COALESCE(s.readiness_score, 0) ASC
      LIMIT 100
    )
    SELECT id FROM topic_candidates
    UNION
    SELECT id FROM fallback_candidates
    LIMIT 250
  `;
  return rows.map((row) => row.id);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const raw = (await req.json().catch(() => null)) as Body | null;
  const intent = parseAdminJsonMutationIntent(raw);
  if (intent instanceof NextResponse) return intent;

  const body = stripAdminMutationControlFields((raw ?? {}) as Record<string, unknown>) as Body;
  const topic = cleanText(body.topic, "", 200);
  if (!topic) {
    return NextResponse.json({ ok: false, error: "Remediation topic is required." }, { status: 400 });
  }

  const pathwayId = cleanOptionalText(body.pathwayId, 64);
  const bodySystem = cleanOptionalText(body.bodySystem, 128);
  const learnerIds = Array.isArray(body.learnerIds)
    ? body.learnerIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    : [];
  const dueDays = clampNumber(body.dueDays, 1, 0, 30);
  const priorityScore = clampNumber(body.priorityScore, 75, 1, 100);
  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + dueDays * 86_400_000);
  const pathwayKey = (pathwayId ?? "").slice(0, 64);
  const topicKey = normalizeTopicKey(topic).slice(0, 200);
  const bodySystemKey = (bodySystem ?? "").trim().toLowerCase().slice(0, 128);

  const candidates = await findCandidateLearners({ topic, pathwayId, learnerIds });
  if (intent.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      topic,
      pathwayId,
      candidateCount: candidates.length,
    });
  }

  if (candidates.length === 0) {
    return NextResponse.json({ ok: false, error: "No eligible learner accounts matched this assignment." }, { status: 404 });
  }

  const title = cleanText(body.title, `${topic} remediation`, 200);
  await prisma.$transaction(
    candidates.map((userId) =>
      prisma.userRemediationQueue.upsert({
        where: {
          userId_pathwayKey_topicKey_bodySystemKey: {
            userId,
            pathwayKey,
            topicKey,
            bodySystemKey,
          },
        },
        create: {
          userId,
          pathwayId,
          topic,
          bodySystem,
          pathwayKey,
          topicKey,
          bodySystemKey,
          priorityScore,
          nextReviewAt,
          source: RemediationQueueSource.lesson,
          resolved: false,
          mistakeCount: 1,
        },
        update: {
          pathwayId,
          topic,
          bodySystem,
          priorityScore,
          nextReviewAt,
          source: RemediationQueueSource.lesson,
          resolved: false,
          resolvedAt: null,
          mistakeCount: { increment: 1 },
          updatedAt: now,
        },
      }),
    ),
  );

  safeServerLog("admin_educator_remediation_assignment", "assigned", {
    adminId: gate.admin.userId,
    title,
    topic,
    pathwayId: pathwayId ?? "all",
    assignedCount: candidates.length,
  });

  return NextResponse.json({
    ok: true,
    title,
    topic,
    pathwayId,
    assignedCount: candidates.length,
    nextReviewAt: nextReviewAt.toISOString(),
  });
}
