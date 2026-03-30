import type { ExamStartEmptyDiagnostics } from "@/lib/questions/exam-start-empty-diagnostics";
import type { QuestionListEmptyDiagnostics } from "@/lib/questions/question-list-empty-diagnostics";

/** Subscriber gate or questions API errors (status + optional JSON `code`). */
export function messageForQuestionsApiFailure(status: number, code?: string): string {
  if (status === 401) {
    return "You need to sign in again to load the question bank.";
  }
  if (status === 403 && code === "paywall") {
    return "Complimentary previews are used up—subscribe for full bank access and rationales.";
  }
  if (status === 403 && code === "no_active_subscription") {
    return "No active subscription on this account—choose a plan to use the full question bank.";
  }
  if (status === 403) {
    return "This account can’t open the subscriber question list with the current plan or session.";
  }
  if (status === 503 && code === "access_verify_failed") {
    return "We couldn’t verify your access (subscription check failed). Refresh shortly—this is usually temporary, not a paywall block.";
  }
  if (status === 503) {
    return "The question bank is temporarily unavailable (database or service issue). Try again in a moment.";
  }
  return "Could not load questions. Check your connection and retry.";
}

export function messageForDiscoveryFailure(status: number, code?: string): string {
  if (status === 401) return "Sign in to load topic filters for your bank.";
  if (status === 403 && code === "no_active_subscription") {
    return "Topic menu needs an active subscription; you can still use previews elsewhere.";
  }
  if (status === 403) return "Topic discovery isn’t available for this account or plan.";
  if (status === 503 && code === "access_verify_failed") {
    return "Couldn’t verify access for topic filters—refresh shortly.";
  }
  if (status === 503) return "Topic list couldn’t load (temporary server or database issue).";
  return "Topic menu couldn’t load; try refreshing.";
}

export function questionBankEmptyCopy(
  d: QuestionListEmptyDiagnostics | undefined,
): { title: string; body: string } {
  if (d?.pathwayIdNotInRegistry && d.pathwayIdRequested) {
    return {
      title: "Unknown pathway filter",
      body: `“${d.pathwayIdRequested}” isn’t a recognized pathway ID, so the bank wasn’t scoped to it. Remove the pathway filter or pick a pathway from your hub.`,
    };
  }
  if (d?.pathwayRejectedForSubscription && d.pathwayIdRequested) {
    return {
      title: "Pathway not on your plan",
      body: `That pathway isn’t included in your subscription, so it wasn’t applied as a filter. Clear the pathway filter or upgrade—if the list is still empty, the cause below still applies.`,
    };
  }
  switch (d?.code) {
    case "bank_empty_global":
      return {
        title: "No published questions yet",
        body: "There are no published items in the question bank yet—this is a content gap, not your subscription. Contact support if you expected data here.",
      };
    case "entitlement_excludes_all_published":
      return {
        title: "No questions match your profile",
        body: "Published questions exist, but none match your account country and tier. Check your profile country and plan, or contact support.",
      };
    case "pathway_exam_keys_exclude_all":
      return {
        title: "Nothing for this pathway in your pool",
        body: "Your subscription has items, but none are tagged for this exam pathway. Try “All topics” without a pathway filter, or pick another pathway.",
      };
    case "topic_filter_no_match":
      return {
        title: "No questions for this topic label",
        body: "The topic filter matches the database label exactly. Choose another topic from the menu or “All topics”.",
      };
    case "indeterminate":
      return {
        title: "No questions in this view",
        body: "The list is empty for an uncommon reason. Try clearing filters, then refresh. If it persists, contact support with the time you tried.",
      };
    default:
      return {
        title: "No questions in this view",
        body: "Try another topic, clear filters, or refresh. If you recently subscribed, wait a moment and retry.",
      };
  }
}

export function examPoolEmptyCopy(d: ExamStartEmptyDiagnostics | undefined): { title: string; body: string } {
  switch (d?.code) {
    case "bank_empty_global":
      return {
        title: "No published questions for practice",
        body: "Timed practice needs items in the question bank. None are published yet—this is a data gap, not a paywall.",
      };
    case "entitlement_excludes_all_published":
      return {
        title: "No questions in your subscription scope",
        body: "Items exist in the bank but none match your profile country and tier. Update your profile or plan, or contact support.",
      };
    case "indeterminate":
      return {
        title: "Practice pool is empty",
        body: "The session started with no items for an uncommon reason. Try again from Practice exams or use the question bank. Contact support if this keeps happening.",
      };
    default:
      return {
        title: "No questions for this session",
        body: "We couldn’t put any items in this practice set. Use the question bank with filters cleared, or contact support if it persists.",
      };
  }
}

export function examStartFailureMessage(status: number, code?: string): string {
  if (status === 401) return "Sign in again to start a practice exam.";
  if (status === 403 && code === "exam_not_in_plan") {
    return "This exam isn’t included in your current plan or region.";
  }
  if (status === 403 && code === "no_active_subscription") {
    return "An active subscription is required to start practice exams.";
  }
  if (status === 403) return "You can’t start this practice session with the current account or plan.";
  if (status === 404) return "That exam is no longer available. Go back to Practice exams and pick another.";
  if (status === 503 && code === "service_unavailable") {
    return "We couldn’t start the session (temporary database or service issue). Try again shortly.";
  }
  if (status === 503) return "Starting the session failed—refresh and try again shortly.";
  return "Could not start the practice session.";
}
