import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ClinicalSkillsHubClient } from "@/components/clinical-skills/clinical-skills-hub-client";
import {
  aggregateClinicalSkillProgressCounts,
  loadClinicalSkillProgressMap,
  findLatestClinicalSkillProgressTouch,
} from "@/lib/clinical-skills/clinical-skills-lesson-progress";
import { pickClinicalSkillsContinueTarget } from "@/lib/clinical-skills/clinical-skills-workstation-nav";
import { loadClinicalSkillsRouteContext } from "@/lib/clinical-skills/clinical-skills-route-context.server";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { auth } from "@/lib/auth";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";

export const metadata: Metadata = {
  title: "Clinical skills | NurseNest",
  description: "Premium bedside competency lab — simulation-style walkthroughs and interactive checkpoints.",
  robots: { index: false, follow: false },
};

const CLINICAL_SKILLS_PROGRESS_BUDGET_MS = 650;

function defaultClinicalSkillsProgressMap(): Record<string, PathwayLessonProgressStatus> {
  return Object.fromEntries(listClinicalSkills().map((skill) => [skill.slug, "not_started" as const]));
}

function withStartupBudget<T>(work: Promise<T>, fallback: T, label: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return Promise.race([
    work
      .catch((error) => {
        safeServerLog("clinical_skills", "startup_optional_work_failed", {
          label,
          error_message: error instanceof Error ? error.message.slice(0, 240) : String(error).slice(0, 240),
        });
        return fallback;
      })
      .finally(() => {
        if (timeout) clearTimeout(timeout);
      }),
    new Promise<T>((resolve) => {
      timeout = setTimeout(() => {
        safeServerLog("clinical_skills", "startup_optional_work_timeout", {
          label,
          budget_ms: CLINICAL_SKILLS_PROGRESS_BUDGET_MS,
        });
        resolve(fallback);
      }, CLINICAL_SKILLS_PROGRESS_BUDGET_MS);
    }),
  ]);
}

export default async function ClinicalSkillsHubRoute({
  searchParams,
}: {
  searchParams?: Promise<{ pathwayId?: string }>;
}) {
  const ctx = await loadClinicalSkillsRouteContext("(student).app.(learner).clinical-skills");
  const pathwayId = ctx.pathwayId ?? (await searchParams)?.pathwayId ?? null;
  const qp = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? ctx.userId;
  const entitlement = userId ? await resolveEntitlementForPage(userId) : "error";

  if (entitlement === "error") {
    return (
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--semantic-text-secondary)]">
        Clinical skills are temporarily unavailable while we verify your access. Please refresh or try again shortly.
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            Clinical skills
          </h1>
          <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Bedside competency walkthroughs are part of the premium NurseNest study experience.
          </p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const defaultProgressMap = defaultClinicalSkillsProgressMap();
  const progressMap = userId
    ? await withStartupBudget(loadClinicalSkillProgressMap(userId), defaultProgressMap, "progress_map")
    : defaultProgressMap;
  const progressSummary = aggregateClinicalSkillProgressCounts(progressMap);
  const lastTouch = userId
    ? await withStartupBudget(findLatestClinicalSkillProgressTouch(userId), null, "latest_touch")
    : null;
  const continueTarget = pickClinicalSkillsContinueTarget(progressMap, lastTouch, qp);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="clinical-skills-hub" pathname="/app/clinical-skills" />
      <ClinicalSkillsHubClient
        pathwayId={pathwayId}
        userId={userId}
        progressSummary={progressSummary}
        continueHref={continueTarget.href}
        continueTitle={continueTarget.title}
        progressMap={progressMap}
      />
    </div>
  );
}
