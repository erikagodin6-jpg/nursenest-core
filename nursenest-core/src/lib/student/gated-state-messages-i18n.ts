import type { ExamStartEmptyDiagnostics } from "@/lib/questions/exam-start-empty-diagnostics";
import type { QuestionListEmptyDiagnostics } from "@/lib/questions/question-list-empty-diagnostics";

export type EmptyCopyI18n = {
  titleKey: string;
  bodyKey: string;
  bodyParams?: Record<string, string | number | undefined>;
};

/** Maps `/api/questions` failures to `learner.qbank.api.*` keys. */
export function questionsApiFailureKey(status: number, code?: string): string {
  if (status === 401) return "learner.qbank.api.signInAgain";
  if (status === 403 && code === "paywall") return "learner.qbank.api.previewsExhausted";
  if (status === 403 && code === "no_active_subscription") return "learner.qbank.api.noActiveSubscription";
  if (status === 403) return "learner.qbank.api.subscriberListBlocked";
  if (status === 503 && code === "access_verify_failed") return "learner.qbank.api.accessVerifyFailed";
  if (status === 503) return "learner.qbank.api.tempUnavailable";
  return "learner.qbank.api.genericLoadFailure";
}

/** Maps `/api/questions/discovery` failures to `learner.qbank.discovery.*` keys. */
export function discoveryFailureKey(status: number, code?: string): string {
  if (status === 401) return "learner.qbank.discovery.signIn";
  if (status === 403 && code === "no_active_subscription") return "learner.qbank.discovery.subscriptionRequired";
  if (status === 403) return "learner.qbank.discovery.notAvailable";
  if (status === 503 && code === "access_verify_failed") return "learner.qbank.discovery.accessVerifyFailed";
  if (status === 503) return "learner.qbank.discovery.serverIssue";
  return "learner.qbank.discovery.generic";
}

export function questionBankEmptyKeys(d: QuestionListEmptyDiagnostics | undefined): EmptyCopyI18n {
  if (d?.pathwayIdNotInRegistry && d.pathwayIdRequested) {
    return {
      titleKey: "learner.qbank.empty.unknownPathway.title",
      bodyKey: "learner.qbank.empty.unknownPathway.body",
      bodyParams: { pathwayId: d.pathwayIdRequested },
    };
  }
  if (d?.pathwayRejectedForSubscription && d.pathwayIdRequested) {
    return {
      titleKey: "learner.qbank.empty.pathwayNotOnPlan.title",
      bodyKey: "learner.qbank.empty.pathwayNotOnPlan.body",
      bodyParams: { pathwayId: d.pathwayIdRequested },
    };
  }
  switch (d?.code) {
    case "bank_empty_global":
      return {
        titleKey: "learner.qbank.empty.bankEmptyGlobal.title",
        bodyKey: "learner.qbank.empty.bankEmptyGlobal.body",
      };
    case "entitlement_excludes_all_published":
      return {
        titleKey: "learner.qbank.empty.entitlementExcludesAll.title",
        bodyKey: "learner.qbank.empty.entitlementExcludesAll.body",
      };
    case "pathway_exam_keys_exclude_all":
      return {
        titleKey: "learner.qbank.empty.pathwayPoolEmpty.title",
        bodyKey: "learner.qbank.empty.pathwayPoolEmpty.body",
      };
    case "topic_filter_no_match":
      return {
        titleKey: "learner.qbank.empty.topicNoMatch.title",
        bodyKey: "learner.qbank.empty.topicNoMatch.body",
      };
    case "indeterminate":
      return {
        titleKey: "learner.qbank.empty.indeterminate.title",
        bodyKey: "learner.qbank.empty.indeterminate.body",
      };
    default:
      return {
        titleKey: "learner.qbank.empty.default.title",
        bodyKey: "learner.qbank.empty.default.body",
      };
  }
}

export function examPoolEmptyKeys(d: ExamStartEmptyDiagnostics | undefined): EmptyCopyI18n {
  switch (d?.code) {
    case "bank_empty_global":
      return {
        titleKey: "learner.examSession.empty.bankEmptyGlobal.title",
        bodyKey: "learner.examSession.empty.bankEmptyGlobal.body",
      };
    case "entitlement_excludes_all_published":
      return {
        titleKey: "learner.examSession.empty.entitlementExcludesAll.title",
        bodyKey: "learner.examSession.empty.entitlementExcludesAll.body",
      };
    case "indeterminate":
      return {
        titleKey: "learner.examSession.empty.indeterminate.title",
        bodyKey: "learner.examSession.empty.indeterminate.body",
      };
    default:
      return {
        titleKey: "learner.examSession.empty.default.title",
        bodyKey: "learner.examSession.empty.default.body",
      };
  }
}

/** Maps practice exam start failures to `learner.examSession.start.*` keys. */
export function examStartFailureKey(status: number, code?: string): string {
  if (status === 401) return "learner.examSession.start.signInAgain";
  if (status === 403 && code === "exam_not_in_plan") return "learner.examSession.start.examNotInPlan";
  if (status === 403 && code === "no_active_subscription") return "learner.examSession.start.subscriptionRequired";
  if (status === 403) return "learner.examSession.start.cannotStart";
  if (status === 404) return "learner.examSession.start.examUnavailable";
  if (status === 503 && code === "service_unavailable") return "learner.examSession.start.serviceUnavailable";
  if (status === 503) return "learner.examSession.start.startFailed503";
  return "learner.examSession.start.generic";
}
