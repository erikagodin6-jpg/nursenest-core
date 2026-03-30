/**
 * Read-only counts when a subscriber question list is empty — does not alter selection logic.
 */
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { DB_PUBLISHED, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";

export type QuestionListEmptyDiagnostics = {
  code:
    | "bank_empty_global"
    | "entitlement_excludes_all_published"
    | "pathway_exam_keys_exclude_all"
    | "topic_filter_no_match"
    | "indeterminate";
  /** Short explanation for client logs / support. */
  message: string;
  counts: {
    publishedGlobal: number;
    entitlementPublished: number;
    listScopePublished: number;
    /** Rows matching topic + list scope (same as strict list query before relax). */
    strictTopicPublished?: number;
  };
  pathwayIdApplied: string | null;
  pathwayIdRequested: string | null;
  /** `pathwayId` query present but not applied (wrong subscription). */
  pathwayRejectedForSubscription: boolean;
  /** `pathwayId` not found in {@link EXAM_PATHWAYS}. */
  pathwayIdNotInRegistry: boolean;
  topicRequested: string | null;
};

type GateEntitlement = AccessScope;

export async function diagnoseSubscriberQuestionListEmpty(input: {
  entitlement: GateEntitlement;
  pathwayIdParam: string | null;
  topicFilter: string | null;
}): Promise<QuestionListEmptyDiagnostics> {
  const topicRequested = input.topicFilter && input.topicFilter.length > 0 ? input.topicFilter : null;
  const pathwayIdRequested = input.pathwayIdParam && input.pathwayIdParam.length > 0 ? input.pathwayIdParam : null;

  const pathwayResolved = pathwayIdRequested ? getExamPathwayById(pathwayIdRequested) ?? null : null;
  const pathwayIdNotInRegistry = Boolean(pathwayIdRequested && !pathwayResolved);
  const pathwayRejectedForSubscription = Boolean(
    pathwayResolved && !subscriptionCoversPathwayBase(input.entitlement, pathwayResolved),
  );
  const pathwayApplied =
    pathwayResolved && !pathwayRejectedForSubscription ? pathwayResolved : null;

  const baseWhere = questionAccessWhereWithPathway(input.entitlement, pathwayApplied);
  const whereWithTopic =
    topicRequested ? { AND: [baseWhere, { topic: topicRequested }] } : baseWhere;

  const [publishedGlobal, entitlementPublished, listScopePublished, strictTopicPublished] = await Promise.all([
    prisma.examQuestion.count({ where: { status: DB_PUBLISHED } }),
    prisma.examQuestion.count({ where: questionAccessWhere(input.entitlement) }),
    prisma.examQuestion.count({ where: baseWhere }),
    topicRequested ? prisma.examQuestion.count({ where: whereWithTopic }) : Promise.resolve(-1),
  ]);

  const pathwayIdApplied = pathwayApplied?.id ?? null;

  let code: QuestionListEmptyDiagnostics["code"] = "indeterminate";
  let message = "No rows matched the current list query; see counts.";

  if (publishedGlobal === 0) {
    code = "bank_empty_global";
    message = "No published questions in the database.";
  } else if (entitlementPublished === 0) {
    code = "entitlement_excludes_all_published";
    message =
      "Published questions exist, but none match this subscriber tier/region (see entitlement vs region_scope/tier on rows).";
  } else if (pathwayIdApplied && listScopePublished === 0) {
    code = "pathway_exam_keys_exclude_all";
    message =
      "Subscriber pool has items, but none match this pathway contentExamKeys (check exam column vs registry keys).";
  } else if (topicRequested && strictTopicPublished === 0 && listScopePublished > 0) {
    code = "topic_filter_no_match";
    message = "List scope has items, but none use this exact topic label (topic filter is strict equality).";
  }

  return {
    code,
    message,
    counts: {
      publishedGlobal,
      entitlementPublished,
      listScopePublished,
      ...(topicRequested ? { strictTopicPublished } : {}),
    },
    pathwayIdApplied,
    pathwayIdRequested,
    pathwayRejectedForSubscription,
    pathwayIdNotInRegistry,
    topicRequested,
  };
}
