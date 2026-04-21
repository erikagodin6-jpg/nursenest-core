import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { notSubscribedResponse, requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { appPathwayLessonVisibleToSubscriber } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { getPublishedPathwayLessonRecordById } from "@/lib/lessons/pathway-lesson-loader";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { captureLessonProgressAnalytics } from "@/lib/observability/lesson-progress-analytics";
import {
  captureStudyProgressFunnelAfterUpsert,
  loadStudyFunnelBeforeSnapshot,
} from "@/lib/observability/study-funnel-capture";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  lessonId: z.string().min(5),
  completed: z.boolean(),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/lessons/progress", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/lessons/progress", feature: SERVER_FEATURE.lesson, userId: gate.userId });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Progress unavailable" }, { status: 503 });
  }

  const { lessonId, completed } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });
  const learnerPath = user?.learnerPath ?? null;

  const pw = await prisma.pathwayLesson.findUnique({
    where: { id: lessonId },
  });
  if (pw && pw.status === ContentStatus.PUBLISHED) {
    const completeRecord = await getPublishedPathwayLessonRecordById(lessonId);
    if (!completeRecord) {
      safeServerLog("api_lessons_progress", "denied_non_complete_pathway_lesson", {
        lessonIdPrefix: lessonId.slice(0, 8),
      });
      return notSubscribedResponse();
    }
    if (!appPathwayLessonVisibleToSubscriber(gate.entitlement, pw, learnerPath)) {
      safeServerLog("api_lessons_progress", "denied_out_of_scope_pathway_lesson", {
        lessonIdPrefix: lessonId.slice(0, 8),
        tier: String(gate.entitlement.tier ?? ""),
        country: String(gate.entitlement.country ?? ""),
      });
      return notSubscribedResponse();
    }
    const funnelBefore = await loadStudyFunnelBeforeSnapshot(userId);
    const existingPathway = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { completed: true },
    });
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed },
      update: { completed },
    });
    captureLessonProgressAnalytics(userId, gate.entitlement, {
      lessonId,
      pathwayId: pw.pathwayId,
      lessonSlug: pw.slug,
      source: "pathway_lesson_row",
      hadExistingRow: !!existingPathway,
      priorCompleted: existingPathway?.completed ?? false,
      nextCompleted: completed,
    });
    captureStudyProgressFunnelAfterUpsert(userId, gate.entitlement, funnelBefore);
    await invalidateLearnerPrivateReadCache(userId);
    return NextResponse.json({ ok: true });
  }

  const contentRow = await prisma.contentItem.findFirst({
    where: { AND: [{ id: lessonId, type: "lesson" }, lessonAccessWhere(gate.entitlement)] },
    select: { id: true },
  });
  if (contentRow) {
    const funnelBefore = await loadStudyFunnelBeforeSnapshot(userId);
    const existingContent = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { completed: true },
    });
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed },
      update: { completed },
    });
    captureLessonProgressAnalytics(userId, gate.entitlement, {
      lessonId,
      source: "cms_lesson",
      hadExistingRow: !!existingContent,
      priorCompleted: existingContent?.completed ?? false,
      nextCompleted: completed,
    });
    captureStudyProgressFunnelAfterUpsert(userId, gate.entitlement, funnelBefore);
    await invalidateLearnerPrivateReadCache(userId);
    return NextResponse.json({ ok: true });
  }

  safeServerLog("api_lessons_progress", "denied_out_of_scope_content_lesson", {
    lessonIdPrefix: lessonId.slice(0, 8),
    tier: String(gate.entitlement.tier ?? ""),
    country: String(gate.entitlement.country ?? ""),
  });
  return notSubscribedResponse();
  });
}
