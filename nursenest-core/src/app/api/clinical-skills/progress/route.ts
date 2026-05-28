import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache.server";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getClinicalSkillBySlug } from "@/lib/clinical-skills/clinical-skills-catalog";
import { clinicalSkillProgressId } from "@/lib/clinical-skills/clinical-skills-lesson-progress";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

const bodySchema = z
  .object({
    skillSlug: z.string().min(2),
    completed: z.boolean().optional(),
    action: z.enum(["open", "engage", "complete", "uncomplete"]).optional(),
  })
  .refine((d) => d.action !== undefined || d.completed !== undefined, {
    message: "Provide action or completed",
  });

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/clinical-skills/progress", "content", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    setSentryServerContext({
      route: "/api/clinical-skills/progress",
      feature: SERVER_FEATURE.lesson,
      userId,
    });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { skillSlug, completed, action } = parsed.data;
    const skill = getClinicalSkillBySlug(skillSlug);
    if (!skill) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isDatabaseUrlConfigured()) {
      return NextResponse.json({ error: "Progress unavailable" }, { status: 503 });
    }

    const syntheticLessonId = clinicalSkillProgressId(skill.slug);
    const wantsComplete = completed === true || action === "complete";
    const wantsUncomplete = action === "uncomplete";
    const wantsEngage = action === "engage";
    const wantsOpen = action === "open" || completed === false;

    try {
      const existing = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
        select: { completed: true, engagedAt: true },
      });

      if (wantsUncomplete) {
        await prisma.progress.upsert({
          where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
          create: { userId, lessonId: syntheticLessonId, completed: false, engagedAt: new Date() },
          update: { completed: false },
        });
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
          update: { completed: true, engagedAt: existing?.engagedAt ?? new Date() },
        });
        await invalidateLearnerPrivateReadCache(userId);
        return NextResponse.json({ ok: true });
      }

      if (wantsEngage || wantsOpen) {
        await prisma.progress.upsert({
          where: { userId_lessonId: { userId, lessonId: syntheticLessonId } },
          create: {
            userId,
            lessonId: syntheticLessonId,
            completed: false,
            engagedAt: wantsEngage ? new Date() : undefined,
          },
          update: {
            engagedAt: wantsEngage ? (existing?.engagedAt ?? new Date()) : existing?.engagedAt,
          },
        });
        await invalidateLearnerPrivateReadCache(userId);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: "No action" }, { status: 400 });
    } catch {
      return NextResponse.json({ error: "Progress update failed" }, { status: 500 });
    }
  });
}
