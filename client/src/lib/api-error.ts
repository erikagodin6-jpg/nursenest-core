/**
 * Stable backend error `code` values (additive JSON bodies).
 * Fallback to HTTP status + `error` string when `code` is absent.
 */

export const BackendErrorCodes = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  ENTITLEMENT_DENIED: "ENTITLEMENT_DENIED",
  PREMIUM_REQUIRED: "PREMIUM_REQUIRED",
  PAYWALL_PREMIUM_REQUIRED: "PAYWALL_PREMIUM_REQUIRED",
  CONTENT_MODULE_UNAVAILABLE: "CONTENT_MODULE_UNAVAILABLE",
  LESSON_NOT_FOUND: "LESSON_NOT_FOUND",
  INVALID_LESSON_SLUG: "INVALID_LESSON_SLUG",
  LESSON_TIER_LOCKED: "LESSON_TIER_LOCKED",
  DASHBOARD_SUMMARY_ERROR: "DASHBOARD_SUMMARY_ERROR",
  FLASHCARD_BANK_TIMEOUT: "FLASHCARD_BANK_TIMEOUT",
  FLASHCARD_BANK_ERROR: "FLASHCARD_BANK_ERROR",
  CONTENT_HEALTH_ERROR: "CONTENT_HEALTH_ERROR",
  AI_OPS_INTERNAL_ERROR: "AI_OPS_INTERNAL_ERROR",
  ADMIN_UNAUTHORIZED: "ADMIN_UNAUTHORIZED",
  ADMIN_SEED_FATAL: "ADMIN_SEED_FATAL",
  EXAM_TEMPLATE_NOT_FOUND: "EXAM_TEMPLATE_NOT_FOUND",
  QUESTION_POOL_EMPTY: "QUESTION_POOL_EMPTY",
  ATTEMPT_NOT_FOUND: "ATTEMPT_NOT_FOUND",
  EMPTY_QUESTION_SET: "EMPTY_QUESTION_SET",
  ASSEMBLY_CAPACITY_EXCEEDED: "ASSEMBLY_CAPACITY_EXCEEDED",
} as const;

export type BackendErrorCode = (typeof BackendErrorCodes)[keyof typeof BackendErrorCodes];

export type ApiErrorPayload = {
  error?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly payload: ApiErrorPayload;

  constructor(message: string, status: number, payload: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = typeof payload.code === "string" ? payload.code : undefined;
    this.payload = payload;
  }
}

/** Read body once; works for both success JSON and error JSON. */
export async function readApiJsonResponse<T = unknown>(res: Response): Promise<{
  ok: boolean;
  status: number;
  data: T | null;
  code?: string;
  message: string;
  rawText: string;
  errorBody: ApiErrorPayload;
}> {
  const rawText = await res.text();
  let raw: unknown = null;
  try {
    raw = rawText ? JSON.parse(rawText) : null;
  } catch {
    raw = null;
  }
  const obj = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  const code = typeof obj?.code === "string" ? obj.code : undefined;
  const message =
    (typeof obj?.error === "string" && obj.error) ||
    (typeof obj?.message === "string" && obj.message) ||
    rawText ||
    res.statusText ||
    "Request failed";

  const errorBody: ApiErrorPayload =
    obj && typeof obj === "object" && !Array.isArray(obj)
      ? (obj as ApiErrorPayload)
      : { error: message };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      data: null,
      code,
      message,
      rawText,
      errorBody,
    };
  }
  return {
    ok: true,
    status: res.status,
    data: raw as T,
    code,
    message,
    rawText,
    errorBody,
  };
}

export function getApiErrorCode(err: unknown): string | undefined {
  if (err instanceof ApiError) return err.code;
  if (err && typeof err === "object" && "code" in err && typeof (err as ApiErrorPayload).code === "string") {
    return (err as ApiErrorPayload).code;
  }
  return undefined;
}

export function isAuthRequiredCode(code: string | undefined, httpStatus?: number): boolean {
  if (code === BackendErrorCodes.AUTH_REQUIRED) return true;
  if (httpStatus === 401 && !code) return true;
  return false;
}

export function isEntitlementErrorCode(code: string | undefined): boolean {
  if (!code) return false;
  return (
    code === BackendErrorCodes.ENTITLEMENT_DENIED ||
    code === BackendErrorCodes.PREMIUM_REQUIRED ||
    code === BackendErrorCodes.PAYWALL_PREMIUM_REQUIRED
  );
}

export function isPaywallOrEntitlementCode(code: string | undefined): boolean {
  return isEntitlementErrorCode(code) || code === BackendErrorCodes.LESSON_TIER_LOCKED;
}

export function isTemporaryUnavailableCode(code: string | undefined): boolean {
  if (!code) return false;
  return (
    code === BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE ||
    code === BackendErrorCodes.FLASHCARD_BANK_TIMEOUT ||
    code === BackendErrorCodes.ASSEMBLY_CAPACITY_EXCEEDED
  );
}

export function isLessonNotFoundCode(code: string | undefined, httpStatus: number): boolean {
  if (code === BackendErrorCodes.LESSON_NOT_FOUND || code === BackendErrorCodes.INVALID_LESSON_SLUG) return true;
  if (!code && httpStatus === 404) return true;
  return false;
}

export function isFlashcardBankFailureCode(code: string | undefined): boolean {
  return (
    code === BackendErrorCodes.FLASHCARD_BANK_ERROR || code === BackendErrorCodes.FLASHCARD_BANK_TIMEOUT
  );
}

/** User-facing copy for learner flows (English; pages using i18n can map from code). */
export function getLearnerMessageForCode(code: string | undefined, fallback: string): string {
  switch (code) {
    case BackendErrorCodes.AUTH_REQUIRED:
      return "Please sign in to continue.";
    case BackendErrorCodes.ENTITLEMENT_DENIED:
    case BackendErrorCodes.PREMIUM_REQUIRED:
    case BackendErrorCodes.PAYWALL_PREMIUM_REQUIRED:
      return "This content requires an upgraded plan.";
    case BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE:
      return "Lesson content is temporarily unavailable. Please try again shortly.";
    case BackendErrorCodes.LESSON_NOT_FOUND:
    case BackendErrorCodes.INVALID_LESSON_SLUG:
      return "We could not find that lesson.";
    case BackendErrorCodes.DASHBOARD_SUMMARY_ERROR:
      return "Some dashboard data could not be loaded. You can still use other parts of the app.";
    case BackendErrorCodes.FLASHCARD_BANK_TIMEOUT:
      return "The flashcard bank timed out. Please try again.";
    case BackendErrorCodes.FLASHCARD_BANK_ERROR:
      return "We could not load flashcards right now. Please try again later.";
    case BackendErrorCodes.EXAM_TEMPLATE_NOT_FOUND:
      return "That exam is not available.";
    case BackendErrorCodes.QUESTION_POOL_EMPTY:
      return "No questions are available for this exam yet. Try another mock exam, use the question bank, or browse lessons.";
    case BackendErrorCodes.ATTEMPT_NOT_FOUND:
      return "Your exam session was not found. You may need to start a new exam.";
    case BackendErrorCodes.EMPTY_QUESTION_SET:
      return "Exam data was incomplete. Please start the exam again or go back.";
    case BackendErrorCodes.ASSEMBLY_CAPACITY_EXCEEDED:
      return "Our exam system is busy. Please wait a moment and try again.";
    default:
      return fallback;
  }
}

export function getAdminOpsMessageForCode(code: string | undefined, fallback: string): string {
  switch (code) {
    case BackendErrorCodes.ADMIN_UNAUTHORIZED:
      return "Admin sign-in required.";
    case BackendErrorCodes.ADMIN_SEED_FATAL:
      return "Seed run failed. Check server logs and try again.";
    case BackendErrorCodes.CONTENT_HEALTH_ERROR:
      return "Content health report failed to generate.";
    case BackendErrorCodes.AI_OPS_INTERNAL_ERROR:
      return "AI operations request failed.";
    default:
      return fallback;
  }
}
