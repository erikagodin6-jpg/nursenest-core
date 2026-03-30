import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
import { getPathwayLessonForProgress } from "@/lib/lessons/pathway-lesson-loader";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";

const bodySchema = z.object({
  pathwayId: z.string().min(3),
  lessonSlug: z.string().min(2),
  completed: z.boolean(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/lessons/pathway-progress", feature: "lesson", userId });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { pathwayId, lessonSlug, completed } = parsed.data;
  const pathway = getExamPathwayById(pathwayId);
  const lesson = pathway ? await getPathwayLessonForProgress(pathway.id, lessonSlug) : undefined;
  if (!pathway || !lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Progress unavailable" }, { status: 503 });
  }

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch {
    return NextResponse.json({ error: "Unable to verify access" }, { status: 503 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });

  if (!canViewFullPathwayLesson(entitlement, pathway, user?.learnerPath)) {
    safeServerLog("pathway_lesson", "pathway_progress_denied", {
      pathwayId,
      lessonSlug,
      hasAccess: entitlement.hasAccess,
      reason: entitlement.reason,
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const syntheticLessonId = `pathway:${pathwayId}:${lessonSlug}`;

  try {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
      create: { userId, lessonId: syntheticLessonId, completed },
      update: { completed },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
  }
}
