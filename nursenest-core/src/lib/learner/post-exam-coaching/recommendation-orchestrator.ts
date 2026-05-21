import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { PostExamSessionKind } from "@/lib/learner/post-exam-performance-report";
import { buildCompetencyGraphSteps } from "@/lib/learner/post-exam-coaching/competency-graph-steps";
import { countExposureForKey, wasRecentlyExposed } from "@/lib/learner/post-exam-coaching/remediation-exposure";
import type { CoachingModel, CoachingRecommendation } from "@/lib/learner/post-exam-coaching/types";

function exposureKeyFor(topic: string, kind: string): string {
  return `${topic.trim().toLowerCase()}::${kind}`;
}

export function orchestrateCoachingRecommendations(args: {
  coachingModel: CoachingModel;
  sessionKind: PostExamSessionKind;
  pathwayId: string | null;
  weakTopicLabels: string[];
  coach?: CatResultsCoachSnapshot | null;
  remediationUserId?: string | null;
  maxItems?: number;
}): CoachingRecommendation[] {
  const {
    coachingModel,
    sessionKind,
    pathwayId,
    weakTopicLabels,
    coach,
    remediationUserId,
    maxItems = 5,
  } = args;

  const out: CoachingRecommendation[] = [];
  const seenHref = new Set<string>();
  let priority = 1;

  const primaryWeak = weakTopicLabels[0] ?? coach?.weakestDomains?.[0] ?? null;

  for (const topic of coach?.studyNext ?? []) {
    const link = topic.links.find((l) => l.kind === "drill") ?? topic.links[0];
    if (!link?.href || seenHref.has(link.href)) continue;
    const key = exposureKeyFor(topic.title, link.kind);
    if (remediationUserId && wasRecentlyExposed(remediationUserId, key, 24)) continue;
    const depth = remediationUserId ? countExposureForKey(remediationUserId, key) : 0;
    const steps = buildCompetencyGraphSteps({
      topic: topic.title,
      pathwayId,
      coachingModel,
      exposureDepth: depth,
    });
    const step = steps[0];
    out.push({
      priority: priority++,
      title: topic.title,
      reason: topic.reason,
      href: link.href,
      kind: link.kind === "lesson" ? "lesson" : link.kind === "flashcards" ? "flashcards" : "drill",
      graphStep: step,
      exposureKey: key,
    });
    seenHref.add(link.href);
    if (out.length >= maxItems) return out;
  }

  if (primaryWeak) {
    const depth = remediationUserId
      ? countExposureForKey(remediationUserId, exposureKeyFor(primaryWeak, "topic"))
      : 0;
    const steps = buildCompetencyGraphSteps({
      topic: primaryWeak,
      pathwayId,
      coachingModel,
      exposureDepth: depth,
    });

    for (const step of steps) {
      if (seenHref.has(step.href)) continue;
      const key = exposureKeyFor(primaryWeak, step.kind);
      if (remediationUserId && wasRecentlyExposed(remediationUserId, key, 36)) continue;
      out.push({
        priority: priority++,
        title: step.title,
        reason: step.reason,
        href: step.href,
        kind: step.kind,
        graphStep: step,
        exposureKey: key,
      });
      seenHref.add(step.href);
      if (out.length >= maxItems) break;
    }
  }

  if (out.length < maxItems && (sessionKind === "cat" || sessionKind === "readiness_assessment") && coachingModel === "cat_adaptive") {
    const href = pathwayId
      ? appPathwayCatSessionStartPath(pathwayId)
      : "/app/practice-tests";
    if (!seenHref.has(href)) {
      out.push({
        priority: priority++,
        title: "Adaptive reassessment",
        reason:
          "A follow-up adaptive session confirms whether today's gaps are stable or one-off under pressure.",
        href,
        kind: "readiness_reassessment",
        exposureKey: "cat::reassessment",
      });
    }
  }

  if (out.length < maxItems && sessionKind === "loft_simulation") {
    const href = "/app/cases/cnple";
    if (!seenHref.has(href)) {
      out.push({
        priority: priority++,
        title: "Another LOFT simulation",
        reason:
          "Repeat a fixed-length licensing simulation to confirm domain balance and pacing under exam conditions.",
        href,
        kind: "simulation",
        exposureKey: "loft::simulation",
      });
    }
  }

  return out.slice(0, maxItems);
}
