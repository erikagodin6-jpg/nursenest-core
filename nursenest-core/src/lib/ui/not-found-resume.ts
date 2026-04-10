import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";

/**
 * Safe in-progress lesson link for 404 recovery (subscribers only, internal URLs).
 */
export async function loadResumeStudyingForNotFound(): Promise<{ title: string; href: string } | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const ent = await resolveEntitlementForPage(userId);
  if (ent === "error" || !ent.hasAccess) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });

  const incomplete = await prisma.progress.findFirst({
    where: { userId, completed: false },
    orderBy: { updatedAt: "desc" },
    select: { lessonId: true },
  });
  if (!incomplete?.lessonId) return null;

  try {
    const ref = await resolveLessonRefFromProgressId({
      lessonId: incomplete.lessonId,
      entitlement: ent,
      learnerPath: user?.learnerPath ?? null,
    });
    if (!ref?.href?.startsWith("/")) return null;
    return { title: ref.title.trim() || "Resume studying", href: ref.href };
  } catch {
    return null;
  }
}
