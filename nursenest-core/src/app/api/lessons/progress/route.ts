import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { notSubscribedResponse, requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { appPathwayLessonVisibleToSubscriber } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const bodySchema = z.object({
  lessonId: z.string().min(5),
  completed: z.boolean(),
});

export async function POST(req: Request) {
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
    if (!appPathwayLessonVisibleToSubscriber(gate.entitlement, pw, learnerPath)) {
      safeServerLog("api_lessons_progress", "denied_out_of_scope_pathway_lesson", {
        lessonIdPrefix: lessonId.slice(0, 8),
        tier: String(gate.entitlement.tier ?? ""),
        country: String(gate.entitlement.country ?? ""),
      });
      return notSubscribedResponse();
    }
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed },
      update: { completed },
    });
    return NextResponse.json({ ok: true });
  }

  const contentRow = await prisma.contentItem.findFirst({
    where: { AND: [{ id: lessonId, type: "lesson" }, lessonAccessWhere(gate.entitlement)] },
    select: { id: true },
  });
  if (contentRow) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed },
      update: { completed },
    });
    return NextResponse.json({ ok: true });
  }

  safeServerLog("api_lessons_progress", "denied_out_of_scope_content_lesson", {
    lessonIdPrefix: lessonId.slice(0, 8),
    tier: String(gate.entitlement.tier ?? ""),
    country: String(gate.entitlement.country ?? ""),
  });
  return notSubscribedResponse();
}
