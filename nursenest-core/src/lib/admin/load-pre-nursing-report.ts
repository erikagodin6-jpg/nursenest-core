import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { PRE_NURSING_PROGRESS_PREFIX, parsePreNursingModuleSlugFromLessonId } from "@/lib/pre-nursing/pre-nursing-constants";

export type PreNursingAnalyticsReport = {
  generatedAt: string;
  modulesTotal: number;
  usersWithAnyCompletion: number;
  totalCompletionRows: number;
  moduleCompletionLeaders: Array<{ slug: string; completed: number }>;
  pathwayHintDistribution: Array<{ hint: string; users: number }>;
  extensionPath: {
    eventSource: string;
    keyQuestions: string[];
  };
};

export async function loadPreNursingAnalyticsReport(): Promise<PreNursingAnalyticsReport | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const [usersWithAnyCompletion, totalCompletionRows, rows, users] = await Promise.all([
    prisma.progress.findMany({
      where: { completed: true, lessonId: { startsWith: PRE_NURSING_PROGRESS_PREFIX } },
      select: { userId: true },
    }),
    prisma.progress.count({
      where: { completed: true, lessonId: { startsWith: PRE_NURSING_PROGRESS_PREFIX } },
    }),
    prisma.progress.findMany({
      where: { completed: true, lessonId: { startsWith: PRE_NURSING_PROGRESS_PREFIX } },
      select: { lessonId: true },
    }),
    prisma.user.findMany({
      where: { preNursingFuturePathwayHint: { not: null } },
      select: { preNursingFuturePathwayHint: true },
    }),
  ]);

  const bySlug = new Map<string, number>();
  for (const row of rows) {
    const slug = parsePreNursingModuleSlugFromLessonId(row.lessonId);
    if (!slug) continue;
    bySlug.set(slug, (bySlug.get(slug) ?? 0) + 1);
  }

  const byHint = new Map<string, number>();
  for (const u of users) {
    const hint = (u.preNursingFuturePathwayHint ?? "unsure").toLowerCase();
    byHint.set(hint, (byHint.get(hint) ?? 0) + 1);
  }

  return {
    generatedAt: new Date().toISOString(),
    modulesTotal: PRE_NURSING_MODULE_REGISTRY.length,
    usersWithAnyCompletion: new Set(usersWithAnyCompletion.map((r) => r.userId)).size,
    totalCompletionRows,
    moduleCompletionLeaders: [...bySlug.entries()]
      .map(([slug, completed]) => ({ slug, completed }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10),
    pathwayHintDistribution: [...byHint.entries()]
      .map(([hint, userCount]) => ({ hint, users: userCount }))
      .sort((a, b) => b.users - a.users),
    extensionPath: {
      eventSource: "PostHog events prefixed pre_nursing_*",
      keyQuestions: [
        "Most-viewed modules (pre_nursing_module_viewed)",
        "Most-clicked CTA by surface (pre_nursing_*_clicked)",
        "Completion to pricing/pathway click correlation",
        "Signed-in vs signed-out conversion deltas",
      ],
    },
  };
}
