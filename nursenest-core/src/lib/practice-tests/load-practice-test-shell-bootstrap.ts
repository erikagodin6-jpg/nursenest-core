import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  pathwayUsesLoftNclexExamPresentation,
} from "@/lib/practice-tests/premium-exam-shell-pathways";
import {
  practiceTestConfigRecord,
  resolvePremiumNclexShellRoute,
} from "@/lib/practice-tests/resolve-premium-nclex-shell-route";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";

export type PracticeTestShellBootstrap = {
  initialPathwaySurface: PracticeTestPathwayClientShell | null;
  nclexShellMode: "cat" | "practice" | null;
  nclexShellPresentation: "standard" | "loft";
  pathwayLabelForShell: string | null;
};

export async function loadPracticeTestShellBootstrap(args: {
  userId: string;
  testId: string;
}): Promise<PracticeTestShellBootstrap> {
  const fallback: PracticeTestShellBootstrap = {
    initialPathwaySurface: null,
    nclexShellMode: null,
    nclexShellPresentation: "standard",
    pathwayLabelForShell: null,
  };

  try {
    const row = await prisma.practiceTest.findFirst({
      where: {
        id: args.testId,
        userId: args.userId,
      },
      select: {
        config: true,
      },
    });

    const parsed = practiceTestConfigRecord(row?.config);
    const pathwayId = parsed?.pathwayId ?? "";
    const nclexShellMode = parsed
      ? resolvePremiumNclexShellRoute({
          config: parsed.config,
          pathwayId,
        })
      : null;
    const nclexShellPresentation =
      nclexShellMode && pathwayUsesLoftNclexExamPresentation(pathwayId) ? "loft" : "standard";

    if (!pathwayId) {
      return {
        ...fallback,
        nclexShellMode,
        nclexShellPresentation,
      };
    }

    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) {
      return {
        ...fallback,
        nclexShellMode,
        nclexShellPresentation,
      };
    }

    return {
      initialPathwaySurface: {
        id: pathway.id,
        countrySlug: pathway.countrySlug,
        roleTrack: pathway.roleTrack,
        examCode: pathway.examCode,
        shortName: pathway.shortName,
        examFamily: pathway.examFamily,
      },
      nclexShellMode,
      nclexShellPresentation,
      pathwayLabelForShell: pathway.shortName ?? null,
    };
  } catch (error) {
    safeServerLog("learner_activity", "practice_test_shell_bootstrap_failed", {
      userIdPrefix: args.userId.slice(0, 8),
      testIdPrefix: args.testId.slice(0, 12),
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
    return fallback;
  }
}
