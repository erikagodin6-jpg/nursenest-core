import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  parsePreNursingModuleSlugFromLessonId,
  preNursingModuleProgressId,
  PRE_NURSING_PROGRESS_PREFIX,
} from "@/lib/pre-nursing/pre-nursing-constants";
import { nextPreNursingModuleSlug, preNursingCompletionFraction } from "@/lib/pre-nursing/pre-nursing-adaptive";
import { HARD_CAP_FIND_MANY } from "@/lib/api/safe-query-take";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

const bodySchema = z.object({
  slug: z.string().min(2).max(80),
  completed: z.boolean(),
});

function isValidModuleSlug(slug: string): boolean {
  return PRE_NURSING_MODULE_REGISTRY.some((m) => m.slug === slug);
}

/** At most one progress row per module; cap matches registry size (bounded by {@link HARD_CAP_FIND_MANY}). */
const PRE_NURSING_PROGRESS_LIST_TAKE = Math.min(HARD_CAP_FIND_MANY, PRE_NURSING_MODULE_REGISTRY.length);

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/pre-nursing-progress", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId || !isDatabaseUrlConfigured()) {
    const { pct, total } = preNursingCompletionFraction(0);
    return NextResponse.json({
      authenticated: false,
      completedSlugs: [],
      nextSlug: nextPreNursingModuleSlug([]),
      progressPercent: pct,
      modulesTotal: total,
      completedCount: 0,
    });
  }

  setSentryServerContext({ route: "/api/learner/pre-nursing-progress", feature: SERVER_FEATURE.lesson, userId });

  try {
    const rows = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        lessonId: { startsWith: PRE_NURSING_PROGRESS_PREFIX },
      },
      select: { lessonId: true },
      take: PRE_NURSING_PROGRESS_LIST_TAKE,
    });
    const completedSlugs = rows
      .map((r) => parsePreNursingModuleSlugFromLessonId(r.lessonId))
      .filter((s): s is string => Boolean(s));
    const nextSlug = nextPreNursingModuleSlug(completedSlugs);
    const { pct, total } = preNursingCompletionFraction(completedSlugs.length);
    return NextResponse.json({
      authenticated: true,
      completedSlugs,
      nextSlug,
      progressPercent: pct,
      modulesTotal: total,
      completedCount: completedSlugs.length,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load progress." }, { status: 503 });
  }
  });
}

/**
 * Free Pre-Nursing: any logged-in learner can record module completion (no paid subscription required).
 */
export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/pre-nursing-progress", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to save progress across devices." }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/learner/pre-nursing-progress", feature: SERVER_FEATURE.lesson, userId });

  let parsedBody: z.infer<typeof bodySchema>;
  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    parsedBody = parsed.data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidModuleSlug(parsedBody.slug)) {
    return NextResponse.json({ error: "Unknown module" }, { status: 400 });
  }

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Progress unavailable" }, { status: 503 });
  }

  const lessonId = preNursingModuleProgressId(parsedBody.slug);

  try {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: parsedBody.completed },
      update: { completed: parsedBody.completed },
    });
    await invalidateLearnerPrivateReadCache(userId);
    const rows = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        lessonId: { startsWith: PRE_NURSING_PROGRESS_PREFIX },
      },
      select: { lessonId: true },
      take: PRE_NURSING_PROGRESS_LIST_TAKE,
    });
    const completedCount = rows.length;
    const totalModules = PRE_NURSING_MODULE_REGISTRY.length;
    if (parsedBody.completed) {
      await captureServerEvent(analyticsDistinctId(userId), PH.preNursingModuleCompleted, {
        source_surface: "progress_api",
        module_slug: parsedBody.slug,
        completed: true,
        signed_in: true,
        completion_count: completedCount,
        modules_total: totalModules,
      });
    }
    if (parsedBody.completed && completedCount >= totalModules) {
      await captureServerEvent(analyticsDistinctId(userId), PH.preNursingAllModulesCompleted, {
        source_surface: "progress_api",
        signed_in: true,
        completion_count: completedCount,
        modules_total: totalModules,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save progress." }, { status: 503 });
  }
  });
}
