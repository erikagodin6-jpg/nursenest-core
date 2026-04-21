import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
import { getPathwayLessonForProgress } from "@/lib/lessons/pathway-lesson-loader";
import { requireSubscriberSession, notSubscribedResponse } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { captureLessonProgressAnalytics } from "@/lib/observability/lesson-progress-analytics";
import {
  captureStudyProgressFunnelAfterUpsert,
  loadStudyFunnelBeforeSnapshot,
} from "@/lib/observability/study-funnel-capture";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

const bodySchema = z
  .object({
    pathwayId: z.string().min(3),
    lessonSlug: z.string().min(2),
    completed: z.boolean().optional(),
    action: z.enum(["open", "engage", "complete", "uncomplete"]).optional(),
  })
  .refine((d) => d.action !== undefined || d.completed !== undefined, {
    message: "Provide action or completed",
  });

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/lessons/pathway-progress", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/lessons/pathway-progress", feature: SERVER_FEATURE.lesson, userId });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { pathwayId, lessonSlug, completed, action } = parsed.data;
  const pathway = getExamPathwayById(pathwayId);
  const lesson = pathway ? await getPathwayLessonForProgress(pathway.id, lessonSlug) : undefined;
  if (!pathway || !lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Progress unavailable" }, { status: 503 });
  }

  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });

  if (!canViewFullPathwayLesson(gate.entitlement, pathway, user?.learnerPath)) {
    safeServerLog("pathway_lesson", "pathway_progress_denied", {
      pathwayId,
      lessonSlug,
      hasAccess: gate.entitlement.hasAccess,
      reason: gate.entitlement.reason,
      userIdPrefix: userId.slice(0, 8),
      tier: String(gate.entitlement.tier ?? ""),
      country: String(gate.entitlement.country ?? ""),
    });
    return notSubscribedResponse();
  }

  const syntheticLessonId = `pathway:${pathwayId}:${lessonSlug}`;

  const wantsComplete = completed === true || action === "complete";
  const wantsUncomplete = action === "uncomplete";
  const wantsEngage = action === "engage";
  const wantsOpen = action === "open" || completed === false;

  try {
    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
      select: { completed: true, engagedAt: true },
    });

    const funnelBefore = await loadStudyFunnelBeforeSnapshot(userId);

    if (wantsUncomplete) {
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
        create: {
          userId,
          lessonId: syntheticLessonId,
          completed: false,
          engagedAt: new Date(),
        },
        update: { completed: false },
      });
      captureLessonProgressAnalytics(userId, gate.entitlement, {
        lessonId: syntheticLessonId,
        pathwayId,
        lessonSlug,
        source: "pathway_synthetic",
        hadExistingRow: !!existing,
        priorCompleted: existing?.completed ?? false,
        nextCompleted: false,
      });
      captureStudyProgressFunnelAfterUpsert(userId, gate.entitlement, funnelBefore);
      await invalidateLearnerPrivateReadCache(userId);
      return NextResponse.json({ ok: true });
    }

    if (existing?.completed && (wantsOpen || wantsEngage)) {
      return NextResponse.json({ ok: true });
    }

    if (wantsComplete) {
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
        create: { userId, lessonId: syntheticLessonId, completed: true, engagedAt: new Date() },
        update: {
          completed: true,
          engagedAt: existing?.engagedAt ?? new Date(),
        },
      });
      captureLessonProgressAnalytics(userId, gate.entitlement, {
        lessonId: syntheticLessonId,
        pathwayId,
        lessonSlug,
        source: "pathway_synthetic",
        hadExistingRow: !!existing,
        priorCompleted: existing?.completed ?? false,
        nextCompleted: true,
      });
      captureStudyProgressFunnelAfterUpsert(userId, gate.entitlement, funnelBefore);
      await invalidateLearnerPrivateReadCache(userId);
      return NextResponse.json({ ok: true });
    }

    if (wantsEngage) {
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
        create: { userId, lessonId: syntheticLessonId, completed: false, engagedAt: new Date() },
        update: {
          engagedAt: existing?.engagedAt ?? new Date(),
        },
      });
      captureLessonProgressAnalytics(userId, gate.entitlement, {
        lessonId: syntheticLessonId,
        pathwayId,
        lessonSlug,
        source: "pathway_synthetic",
        hadExistingRow: !!existing,
        priorCompleted: existing?.completed ?? false,
        nextCompleted: existing?.completed ?? false,
      });
      captureStudyProgressFunnelAfterUpsert(userId, gate.entitlement, funnelBefore);
      await invalidateLearnerPrivateReadCache(userId);
      return NextResponse.json({ ok: true });
    }

    if (wantsOpen) {
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
        create: { userId, lessonId: syntheticLessonId, completed: false },
        update: { completed: false },
      });
      captureLessonProgressAnalytics(userId, gate.entitlement, {
        lessonId: syntheticLessonId,
        pathwayId,
        lessonSlug,
        source: "pathway_synthetic",
        hadExistingRow: !!existing,
        priorCompleted: existing?.completed ?? false,
        nextCompleted: false,
      });
      captureStudyProgressFunnelAfterUpsert(userId, gate.entitlement, funnelBefore);
      await invalidateLearnerPrivateReadCache(userId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
  }
  });
}
