import { ContentStatus, PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

/**
 * Secondary “resume” signals for the learner dashboard conversion loop.
 * Lesson resume stays on {@link PremiumDashboardSnapshot.continueLesson} (Progress-backed).
 */
export type StudyResumeExtras = {
  /** Latest touched flashcard deck session (subscriber study surface). */
  flashcard: { title: string; href: string } | null;
  /** Paused adaptive/linear practice test, if any. */
  practice: { title: string; href: string } | null;
};

export async function loadStudyResumeExtras(userId: string): Promise<StudyResumeExtras> {
  const empty: StudyResumeExtras = { flashcard: null, practice: null };
  if (!userId.trim() || !isDatabaseUrlConfigured()) return empty;

  try {
    const [fcSession, ptOpen] = await Promise.all([
      prisma.flashcardStudySession.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: { deck: { select: { slug: true, title: true, status: true } } },
      }),
      prisma.practiceTest.findFirst({
        where: { userId, status: PracticeTestStatus.IN_PROGRESS },
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true },
      }),
    ]);

    let flashcard: StudyResumeExtras["flashcard"] = null;
    if (fcSession?.deck?.slug && fcSession.deck.status === ContentStatus.PUBLISHED) {
      const slug = fcSession.deck.slug.trim();
      if (slug) {
        flashcard = {
          title: fcSession.deck.title?.trim() || "Flashcards",
          href: `/app/flashcards/${encodeURIComponent(slug)}`,
        };
      }
    }

    let practice: StudyResumeExtras["practice"] = null;
    if (ptOpen) {
      practice = {
        title: ptOpen.title?.trim() || "Practice test in progress",
        href: `/app/practice-tests/${encodeURIComponent(ptOpen.id)}`,
      };
    }

    return { flashcard, practice };
  } catch {
    return empty;
  }
}
