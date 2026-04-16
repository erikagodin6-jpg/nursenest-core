import { ExamFamily } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwaysCompatibleWithSubscription, pathwayFromLearnerPath } from "@/lib/exam-pathways/pathway-entitlements";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import { resolveNextIncompleteMarketingPathwayLesson } from "@/lib/learner/resolve-pathway-next-lesson";
import { loadPathwayHubProgressBatch, type PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

/**
 * Most recently touched pathway lesson for this user — derived from `Progress.updatedAt`
 * (open / engage / complete all bump the row).
 */
export async function getLastTouchedPathwayLesson(
  userId: string,
  pathwayId: string,
): Promise<{ title: string; slug: string; completed: boolean } | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  const prefix = `pathway:${pathwayId}:`;
  const row = await prisma.progress.findFirst({
    where: { userId, lessonId: { startsWith: prefix } },
    orderBy: { updatedAt: "desc" },
    select: { lessonId: true, completed: true },
  });
  if (!row) return null;
  const slug = row.lessonId.slice(prefix.length);
  if (!slug) return null;
  const lesson = await prisma.pathwayLesson.findFirst({
    where: { pathwayId, slug, status: "PUBLISHED" },
    select: {
      title: true,
      slug: true,
      structuralPublicComplete: true,
    },
  });
  if (!lesson?.structuralPublicComplete) {
    return null;
  }
  const title = lesson.title?.trim() || slug;
  return { title, slug, completed: row.completed };
}

export type PathwayHubResumePayload = {
  lastTouched: { title: string; href: string; slug: string; completed: boolean } | null;
  nextRecommended: { title: string; href: string; slug: string } | null;
  lessonsCompleted: number;
  /** Rows with `completed = false` for this pathway’s synthetic lesson ids. */
  lessonsInProgress: number;
};

/**
 * Resume strip + hub progress map in one subscriber pass (batched Progress queries).
 */
export async function loadPathwayHubSubscriberData(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  pathway: ExamPathwayDefinition,
  lessonsBasePath: string,
  hubSlugs: string[],
): Promise<{
  resume: PathwayHubResumePayload;
  progressMap: Record<string, PathwayLessonProgressStatus>;
}> {
  const emptyResume: PathwayHubResumePayload = {
    lastTouched: null,
    nextRecommended: null,
    lessonsCompleted: 0,
    lessonsInProgress: 0,
  };
  const emptyMap = Object.fromEntries(hubSlugs.map((s) => [s, "not_started" as PathwayLessonProgressStatus]));

  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) {
    return { resume: emptyResume, progressMap: emptyMap };
  }
  if (!canViewFullPathwayLesson(entitlement, pathway, learnerPath)) {
    return { resume: emptyResume, progressMap: emptyMap };
  }

  const [batch, nextRecommended] = await Promise.all([
    loadPathwayHubProgressBatch(userId, pathway.id, hubSlugs),
    resolveNextIncompleteMarketingPathwayLesson(userId, entitlement, learnerPath, pathway.id, lessonsBasePath),
  ]);

  let lastTouched: PathwayHubResumePayload["lastTouched"] = null;
  if (batch.lastForResume) {
    const titleRow = await prisma.pathwayLesson.findFirst({
      where: { pathwayId: pathway.id, slug: batch.lastForResume.slug, status: "PUBLISHED" },
      select: {
        title: true,
        structuralPublicComplete: true,
      },
    });
    const title =
      titleRow?.structuralPublicComplete === true ? (titleRow.title?.trim() ?? batch.lastForResume.slug) : null;
    if (!title) {
      return { resume: emptyResume, progressMap: batch.progressMap };
    }
    const href = pathwayLessonMarketingDetailHref(lessonsBasePath, batch.lastForResume.slug);
    if (href) {
      lastTouched = {
        title,
        href,
        slug: batch.lastForResume.slug,
        completed: batch.lastForResume.completed,
      };
    }
  }

  const resume: PathwayHubResumePayload = {
    lastTouched,
    nextRecommended,
    lessonsCompleted: batch.lessonsCompleted,
    lessonsInProgress: batch.lessonsInProgress,
  };

  return { resume, progressMap: batch.progressMap };
}

export async function loadPathwayHubResumePayload(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  pathway: ExamPathwayDefinition,
  lessonsBasePath: string,
): Promise<PathwayHubResumePayload> {
  const { resume } = await loadPathwayHubSubscriberData(userId, entitlement, learnerPath, pathway, lessonsBasePath, []);
  return resume;
}

export function pathwayHubResumeHasContent(p: PathwayHubResumePayload): boolean {
  return (
    p.lastTouched != null ||
    p.nextRecommended != null ||
    p.lessonsCompleted > 0 ||
    p.lessonsInProgress > 0
  );
}

export type LessonContinuationRow = {
  kind: "rn" | "pn" | "np";
  /** e.g. Continue RN lessons */
  title: string;
  href: string;
  pathwayShortName: string;
};

function pickPreferredPathway(
  compatible: ExamPathwayDefinition[],
  learnerPath: string | null | undefined,
  predicate: (p: ExamPathwayDefinition) => boolean,
): ExamPathwayDefinition | null {
  const lp = pathwayFromLearnerPath(learnerPath);
  if (lp && compatible.some((c) => c.id === lp.id) && predicate(lp)) return lp;
  return compatible.find(predicate) ?? null;
}

/**
 * One row per applicable track (RN, PN/LPN, NP) with a deep link to the last touched lesson in that pathway,
 * or the lessons hub if none.
 */
export async function loadLessonContinuationRows(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
): Promise<LessonContinuationRow[]> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return [];

  const compatible = listPathwaysCompatibleWithSubscription(entitlement);
  if (compatible.length === 0) return [];

  const rn = pickPreferredPathway(
    compatible,
    learnerPath,
    (p) => p.examFamily === ExamFamily.NCLEX_RN && p.roleTrack === "rn",
  );
  const pn = pickPreferredPathway(
    compatible,
    learnerPath,
    (p) =>
      (p.examFamily === ExamFamily.NCLEX_PN && p.roleTrack === "lpn") ||
      (p.examFamily === ExamFamily.REX_PN && p.roleTrack === "rpn"),
  );
  const np = pickPreferredPathway(
    compatible,
    learnerPath,
    (p) => p.examFamily === ExamFamily.NP && p.status === "active" && p.acquisitionMode === "subscribe",
  );

  const candidates: { kind: LessonContinuationRow["kind"]; p: ExamPathwayDefinition; title: string }[] = [];
  if (rn) candidates.push({ kind: "rn", p: rn, title: "Continue RN lessons" });
  if (pn) candidates.push({ kind: "pn", p: pn, title: "Continue RPN/LPN lessons" });
  if (np) candidates.push({ kind: "np", p: np, title: "Continue NP lessons" });

  if (candidates.length === 0) return [];

  const rows = await Promise.all(
    candidates.map(async ({ kind, p, title }) => {
      const last = await getLastTouchedPathwayLesson(userId, p.id);
      const href = last
        ? buildExamPathwayPath(p, `lessons/${last.slug}`)
        : buildExamPathwayPath(p, "lessons");
      return { kind, title, href, pathwayShortName: p.shortName };
    }),
  );

  return rows;
}
