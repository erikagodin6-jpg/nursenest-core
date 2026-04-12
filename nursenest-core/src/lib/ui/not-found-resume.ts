import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import { isSafeRelativeNavHref, sanitizeRelativeNavHrefOrFallback } from "@/lib/ui/safe-relative-href";

export type NotFoundResumeStudying = { title: string; href: string };

export async function loadResumeStudyingForNotFound(userId: string): Promise<NotFoundResumeStudying | null> {
  const uid = userId?.trim() ?? "";
  if (!uid || !isDatabaseUrlConfigured()) return null;

  const ent = await resolveEntitlementForPage(uid);
  if (ent === "error" || !ent.hasAccess) return null;

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { learnerPath: true },
  });

  const incomplete = await prisma.progress.findFirst({
    where: { userId: uid, completed: false },
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
    if (!ref?.href) return null;
    const href = sanitizeRelativeNavHrefOrFallback(ref.href.trim());
    if (!isSafeRelativeNavHref(href)) return null;
    const title = ref.title.trim() || "Resume studying";
    return { title, href };
  } catch {
    return null;
  }
}
