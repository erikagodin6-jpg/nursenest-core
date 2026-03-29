export const EXAM_FAILURE_CODES = {
  ENTITLEMENT_FAILURE: "entitlement_failure",
  MISSING_SESSION: "missing_session",
  CORRUPTED_SESSION: "corrupted_session",
  QUESTION_BATCH_MISSING: "question_batch_missing",
  DB_TIMEOUT: "db_timeout",
  OVERSIZED_PAYLOAD: "oversized_payload",
  MEMORY_REJECTION: "memory_rejection",
  MALFORMED_QUESTION: "malformed_question",
  FRONTEND_PARSE_FAILURE: "frontend_parse_failure",
  STALE_RESUME_POINTER: "stale_resume_pointer",
  SCHEMA_MISMATCH: "schema_mismatch",
  NETWORK_TIMEOUT: "network_timeout",
  ACCESS_DENIED: "access_denied",
  EXAM_NOT_FOUND: "exam_not_found",
  EXAM_UNPUBLISHED: "exam_unpublished",
  SESSION_CREATE_FAILED: "session_create_failed",
  ASSEMBLY_FAILED: "assembly_failed",
  INVALID_PAYLOAD: "invalid_payload",
  ZERO_VALID_ITEMS: "zero_valid_items",
  REGION_UNAVAILABLE: "region_unavailable",
  SUBSCRIPTION_REQUIRED: "subscription_required",
  NAVIGATION_FAILED: "navigation_failed",
  TIER_MISMATCH: "tier_mismatch",
  NOT_ENTITLED: "not_entitled",
  EXAM_UNAVAILABLE_FOR_REGION: "exam_unavailable_for_region",
  FEATURE_DISABLED: "feature_disabled",
  ASSEMBLY_CAPACITY: "assembly_capacity",
  UNKNOWN: "unknown",
} as const;

export const EXAM_ERROR_USER_MESSAGES: Record<string, { title: string; description: string }> = {
  [EXAM_FAILURE_CODES.ENTITLEMENT_FAILURE]: { title: "Authentication Required", description: "Please log in to start an exam." },
  [EXAM_FAILURE_CODES.MISSING_SESSION]: { title: "Session Not Found", description: "This exam session could not be found. It may have expired." },
  [EXAM_FAILURE_CODES.CORRUPTED_SESSION]: { title: "Session Issue", description: "This exam session has a data issue. Please start a new exam." },
  [EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING]: { title: "No Questions Available", description: "No questions are available for this exam configuration. Try a different tier or body system." },
  [EXAM_FAILURE_CODES.DB_TIMEOUT]: { title: "Temporarily Unavailable", description: "The server is busy. Please wait a moment and try again." },
  [EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD]: { title: "Exam Too Large", description: "This exam configuration is too large. A lighter version will be loaded." },
  [EXAM_FAILURE_CODES.MEMORY_REJECTION]: { title: "Server Busy", description: "The server is under heavy load. Please try again in a moment." },
  [EXAM_FAILURE_CODES.MALFORMED_QUESTION]: { title: "Question Data Issue", description: "Some questions have data issues. A corrected version is being prepared." },
  [EXAM_FAILURE_CODES.FRONTEND_PARSE_FAILURE]: { title: "Loading Error", description: "The exam data could not be loaded. Please refresh and try again." },
  [EXAM_FAILURE_CODES.STALE_RESUME_POINTER]: { title: "Resume Position Changed", description: "Your exam position was out of sync. It has been corrected." },
  [EXAM_FAILURE_CODES.SCHEMA_MISMATCH]: { title: "System Update in Progress", description: "A system update is being applied. Please retry in a moment." },
  [EXAM_FAILURE_CODES.NETWORK_TIMEOUT]: { title: "Connection Issue", description: "The request timed out. Please check your connection and try again." },
  [EXAM_FAILURE_CODES.ACCESS_DENIED]: { title: "Access Denied", description: "You do not have permission to access this exam." },
  [EXAM_FAILURE_CODES.EXAM_NOT_FOUND]: { title: "Exam Not Found", description: "This exam could not be found. It may have been removed or is no longer available." },
  [EXAM_FAILURE_CODES.EXAM_UNPUBLISHED]: { title: "Exam Unavailable", description: "This exam is not currently published. Please choose a different exam." },
  [EXAM_FAILURE_CODES.INVALID_PAYLOAD]: { title: "Invalid Request", description: "The exam request was invalid. Please refresh the page and try again." },
  [EXAM_FAILURE_CODES.SESSION_CREATE_FAILED]: { title: "Unable to Start Exam", description: "The exam session could not be created. Please retry in a moment." },
  [EXAM_FAILURE_CODES.ASSEMBLY_FAILED]: { title: "Exam Preparation Failed", description: "The exam questions could not be assembled. Please try again." },
  [EXAM_FAILURE_CODES.NAVIGATION_FAILED]: { title: "Navigation Error", description: "Could not navigate to the exam. Please try again from the exam list." },
  [EXAM_FAILURE_CODES.TIER_MISMATCH]: { title: "Subscription Required", description: "This exam requires a higher subscription tier. Please upgrade your plan." },
  [EXAM_FAILURE_CODES.NOT_ENTITLED]: { title: "Subscription Required", description: "This feature requires a paid subscription. Please upgrade your plan." },
  [EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED]: { title: "Upgrade Required", description: "This exam feature requires a paid subscription. Please upgrade your plan to access the question bank." },
  [EXAM_FAILURE_CODES.EXAM_UNAVAILABLE_FOR_REGION]: { title: "Not Available in Your Region", description: "This exam is not available in your region. Please choose a different exam." },
  [EXAM_FAILURE_CODES.FEATURE_DISABLED]: { title: "Temporarily Disabled", description: "This feature is temporarily disabled for maintenance. Please try again later." },
  [EXAM_FAILURE_CODES.ASSEMBLY_CAPACITY]: { title: "Server Busy", description: "Too many exams are being prepared. Please wait a moment and try again." },
  [EXAM_FAILURE_CODES.ZERO_VALID_ITEMS]: {
    title: "No questions in this pool yet",
    description:
      "This exam template does not have questions available right now. Try another mock exam, open practice questions, or browse lessons — then check back later.",
  },
  [EXAM_FAILURE_CODES.REGION_UNAVAILABLE]: { title: "Not Available in Your Region", description: "This exam is not currently available in your region. Please choose a different exam." },
  [EXAM_FAILURE_CODES.UNKNOWN]: { title: "Unable to Start Exam", description: "An unexpected issue occurred. Please retry — if it persists, contact support." },
};

export type ExamFailureCode = typeof EXAM_FAILURE_CODES[keyof typeof EXAM_FAILURE_CODES];

export interface ClassifiedExamError {
  code: ExamFailureCode;
  message: string;
  recoverable: boolean;
  httpStatus?: number;
  details?: Record<string, any>;
  timestamp: string;
}

export function classifyHttpError(status: number, body?: any): ClassifiedExamError {
  const now = new Date().toISOString();

  if (body?.reasonCode) {
    return {
      code: body.reasonCode as ExamFailureCode,
      message: body.error || body.message || "Server error",
      recoverable: body.recoverable ?? status < 500,
      httpStatus: status,
      details: { ...body.details, requiredTier: body.requiredTier, fallbackHint: body.fallbackHint, correlationId: body.correlationId },
      timestamp: now,
    };
  }

  if (body?.code) {
    const codeMap: Record<string, ExamFailureCode> = {
      "MOCK_PAYWALL": EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED,
      "TIER_MISMATCH": EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED,
      "SCHEMA_DRIFT": EXAM_FAILURE_CODES.SCHEMA_MISMATCH,
      "ASSEMBLY_CAPACITY": EXAM_FAILURE_CODES.ASSEMBLY_FAILED,
      "EXAM_START_TIMEOUT": EXAM_FAILURE_CODES.NETWORK_TIMEOUT,
      "FEATURE_DISABLED": EXAM_FAILURE_CODES.REGION_UNAVAILABLE,
      "EXAM_NOT_FOUND": EXAM_FAILURE_CODES.EXAM_NOT_FOUND,
      "EXAM_UNPUBLISHED": EXAM_FAILURE_CODES.EXAM_UNPUBLISHED,
      "SESSION_CREATE_FAILED": EXAM_FAILURE_CODES.SESSION_CREATE_FAILED,
      "ASSEMBLY_FAILED": EXAM_FAILURE_CODES.ASSEMBLY_FAILED,
      "INVALID_PAYLOAD": EXAM_FAILURE_CODES.INVALID_PAYLOAD,
      "ZERO_VALID_ITEMS": EXAM_FAILURE_CODES.ZERO_VALID_ITEMS,
      // Standardized backend codes (exam-delivery / entitlements)
      AUTH_REQUIRED: EXAM_FAILURE_CODES.ENTITLEMENT_FAILURE,
      ENTITLEMENT_DENIED: EXAM_FAILURE_CODES.NOT_ENTITLED,
      PREMIUM_REQUIRED: EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED,
      PAYWALL_PREMIUM_REQUIRED: EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED,
      EXAM_TEMPLATE_NOT_FOUND: EXAM_FAILURE_CODES.EXAM_NOT_FOUND,
      QUESTION_POOL_EMPTY: EXAM_FAILURE_CODES.ZERO_VALID_ITEMS,
      ATTEMPT_NOT_FOUND: EXAM_FAILURE_CODES.MISSING_SESSION,
      EMPTY_QUESTION_SET: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING,
      ASSEMBLY_CAPACITY_EXCEEDED: EXAM_FAILURE_CODES.ASSEMBLY_CAPACITY,
    };
    const mapped = codeMap[body.code];
    if (mapped) {
      return {
        code: mapped,
        message: body.error || body.message || "Server error",
        recoverable: body.recoverable ?? status < 500,
        httpStatus: status,
        details: { ...body.details, requiredTier: body.requiredTier, fallbackHint: body.fallbackHint },
        timestamp: now,
      };
    }
  }

  switch (status) {
    case 401:
      return { code: EXAM_FAILURE_CODES.ENTITLEMENT_FAILURE, message: "Authentication required", recoverable: true, httpStatus: status, timestamp: now };
    case 403:
      return { code: EXAM_FAILURE_CODES.ACCESS_DENIED, message: body?.error || "Access denied", recoverable: false, httpStatus: status, timestamp: now, details: { requiredTier: body?.requiredTier } };
    case 404:
      return { code: EXAM_FAILURE_CODES.EXAM_NOT_FOUND, message: body?.error || "Exam not found", recoverable: false, httpStatus: status, timestamp: now };
    case 409:
      return { code: EXAM_FAILURE_CODES.STALE_RESUME_POINTER, message: body?.error || "Session state conflict", recoverable: true, httpStatus: status, timestamp: now };
    case 413:
      return { code: EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD, message: body?.error || "Payload too large", recoverable: true, httpStatus: status, timestamp: now };
    case 422:
      return { code: EXAM_FAILURE_CODES.CORRUPTED_SESSION, message: body?.error || "Invalid session data", recoverable: true, httpStatus: status, timestamp: now };
    case 503:
      return { code: EXAM_FAILURE_CODES.DB_TIMEOUT, message: body?.error || "Service temporarily unavailable", recoverable: true, httpStatus: status, timestamp: now };
    default:
      if (status >= 500) {
        return { code: EXAM_FAILURE_CODES.UNKNOWN, message: body?.error || `Server error: ${status}`, recoverable: true, httpStatus: status, timestamp: now };
      }
      return { code: EXAM_FAILURE_CODES.UNKNOWN, message: body?.error || `Error: ${status}`, recoverable: false, httpStatus: status, timestamp: now };
  }
}

export function classifyClientError(error: Error): ClassifiedExamError {
  const now = new Date().toISOString();
  const msg = error.message || "";

  if (error.name === "AbortError" || msg.includes("timeout") || msg.includes("timed out")) {
    return { code: EXAM_FAILURE_CODES.NETWORK_TIMEOUT, message: "Request timed out", recoverable: true, timestamp: now };
  }
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("net::")) {
    return { code: EXAM_FAILURE_CODES.NETWORK_TIMEOUT, message: "Network error", recoverable: true, timestamp: now };
  }
  if (msg.includes("JSON") || msg.includes("parse") || msg.includes("Unexpected token")) {
    return { code: EXAM_FAILURE_CODES.FRONTEND_PARSE_FAILURE, message: "Failed to parse response", recoverable: true, timestamp: now };
  }
  if (msg.includes("out of memory") || msg.includes("allocation")) {
    return { code: EXAM_FAILURE_CODES.MEMORY_REJECTION, message: "Memory limit exceeded", recoverable: true, timestamp: now };
  }
  if (msg.includes("schema") || msg.includes("column") || msg.includes("does not exist")) {
    return { code: EXAM_FAILURE_CODES.SCHEMA_MISMATCH, message: "Data schema mismatch", recoverable: true, timestamp: now };
  }
  if (msg.includes("oversized") || msg.includes("payload too large") || msg.includes("entity too large") || msg.includes("413")) {
    return { code: EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD, message: "Response payload too large", recoverable: true, timestamp: now };
  }
  if (msg.includes("malformed") || msg.includes("invalid question") || msg.includes("missing options") || msg.includes("missing correct")) {
    return { code: EXAM_FAILURE_CODES.MALFORMED_QUESTION, message: "Malformed question data", recoverable: true, timestamp: now };
  }
  if (msg.includes("stale") || msg.includes("resume pointer") || msg.includes("currentQuestion") || msg.includes("out of range")) {
    return { code: EXAM_FAILURE_CODES.STALE_RESUME_POINTER, message: "Stale resume position", recoverable: true, timestamp: now };
  }

  return { code: EXAM_FAILURE_CODES.UNKNOWN, message: msg || "Unknown error", recoverable: true, timestamp: now };
}

export function classifyServerError(error: any, context?: { attemptId?: string; questionCount?: number; stage?: string }): ClassifiedExamError {
  const now = new Date().toISOString();
  const msg = typeof error === "string" ? error : (error?.message || "");

  if (msg.includes("timeout") || msg.includes("canceling statement") || error?.code === "57014") {
    return { code: EXAM_FAILURE_CODES.DB_TIMEOUT, message: "Database query timed out", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("column") && msg.includes("does not exist")) {
    return { code: EXAM_FAILURE_CODES.SCHEMA_MISMATCH, message: "Database schema mismatch", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("out of memory") || msg.includes("allocation")) {
    return { code: EXAM_FAILURE_CODES.MEMORY_REJECTION, message: "Server memory limit exceeded", recoverable: true, timestamp: now, details: context };
  }
  if (context?.questionCount === 0) {
    return { code: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING, message: "No questions available for exam", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("oversized") || msg.includes("payload too large") || msg.includes("entity too large")) {
    return { code: EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD, message: "Response payload too large", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("malformed") || msg.includes("invalid question") || msg.includes("missing options") || msg.includes("missing correct")) {
    return { code: EXAM_FAILURE_CODES.MALFORMED_QUESTION, message: "Malformed question data detected", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("stale") || msg.includes("resume pointer") || msg.includes("out of range")) {
    return { code: EXAM_FAILURE_CODES.STALE_RESUME_POINTER, message: "Stale resume pointer", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("not found") || msg.includes("no rows") || error?.code === "EXAM_NOT_FOUND") {
    return { code: EXAM_FAILURE_CODES.EXAM_NOT_FOUND, message: "Exam not found", recoverable: false, timestamp: now, details: context };
  }
  if (msg.includes("unpublished") || msg.includes("inactive") || error?.code === "EXAM_UNPUBLISHED") {
    return { code: EXAM_FAILURE_CODES.EXAM_UNPUBLISHED, message: "Exam is not published", recoverable: false, timestamp: now, details: context };
  }
  if (msg.includes("INSERT") || msg.includes("insert") || msg.includes("violates") || (context?.stage === "session_insert")) {
    return { code: EXAM_FAILURE_CODES.SESSION_CREATE_FAILED, message: "Failed to create exam session", recoverable: true, timestamp: now, details: context };
  }
  if (msg.includes("assembly") || msg.includes("assemble") || (context?.stage === "assembly")) {
    return { code: EXAM_FAILURE_CODES.ASSEMBLY_FAILED, message: "Exam assembly failed", recoverable: true, timestamp: now, details: context };
  }

  return { code: EXAM_FAILURE_CODES.UNKNOWN, message: msg || "Internal server error", recoverable: true, timestamp: now, details: context };
}

export const CAT_FALLBACK_CODES = {
  CAT_POOL_EMPTY: "cat_pool_empty",
  CAT_POOL_INSUFFICIENT: "cat_pool_insufficient",
  CAT_DB_ERROR: "cat_db_error",
  CAT_TIMEOUT: "cat_timeout",
  CAT_VALIDATION_FAILED: "cat_validation_failed",
  CAT_ENGINE_ERROR: "cat_engine_error",
} as const;

export type CatFallbackCode = typeof CAT_FALLBACK_CODES[keyof typeof CAT_FALLBACK_CODES];

export type ExamStartMode =
  | "cat"
  | "fallback_standard_exam"
  | "fallback_practice_block"
  | "fallback_emergency_bank"
  | "unavailable";

export type QuestionSource =
  | "primary_db"
  | "validated_snapshot"
  | "emergency_fallback_bank";

export interface NormalizedExamStartResponse {
  ok: boolean;
  mode: ExamStartMode;
  attemptId?: string;
  sessionId?: string;
  question?: any;
  questions?: any[];
  progress?: {
    questionNumber: number;
    totalQuestions: number;
    questionsAnswered: number;
  };
  meta?: {
    tier: string;
    source: QuestionSource;
    fallbackReason?: string;
    fallbackMessage?: string;
    catState?: {
      currentAbility: number;
      standardError: number;
      questionCount: number;
    };
    degradedMode?: boolean;
    incidentId?: string;
  };
  errorCode?: string;
  message?: string;
  retryable?: boolean;
}

export interface QuestionPoolDiagnostics {
  rawCandidates: number;
  afterTierFilter: number;
  afterEntitlementFilter: number;
  afterRegionFilter: number;
  afterLanguageFilter: number;
  afterActivePublishedFilter: number;
  afterCatValidation: number;
  finalUsableCount: number;
  rejectionReasons: Record<string, number>;
  filterTimestamp: string;
  tier: string;
  examType: string;
}

export const RECOVERY_STAGES = {
  CLEAR_CACHE: "clear_cache",
  CALL_RECOVERY: "call_recovery",
  FRESH_REHYDRATION: "fresh_rehydration",
  SAFE_EXIT: "safe_exit",
} as const;

export type RecoveryStage = typeof RECOVERY_STAGES[keyof typeof RECOVERY_STAGES];

export interface RecoveryProgress {
  stage: RecoveryStage;
  stageIndex: number;
  totalStages: number;
  message: string;
}

export function getRecoveryStageInfo(stage: RecoveryStage): RecoveryProgress {
  const stages: { stage: RecoveryStage; message: string }[] = [
    { stage: RECOVERY_STAGES.CLEAR_CACHE, message: "Clearing stale data..." },
    { stage: RECOVERY_STAGES.CALL_RECOVERY, message: "Recovering session from server..." },
    { stage: RECOVERY_STAGES.FRESH_REHYDRATION, message: "Rebuilding exam session..." },
    { stage: RECOVERY_STAGES.SAFE_EXIT, message: "Preparing safe options..." },
  ];

  const idx = stages.findIndex(s => s.stage === stage);
  return {
    stage,
    stageIndex: idx >= 0 ? idx : 0,
    totalStages: stages.length,
    message: stages[idx]?.message || "Recovering...",
  };
}

export interface ExamStartErrorMessage {
  title: string;
  description: string;
  action?: string;
  showUpgrade?: boolean;
  showRetry?: boolean;
  showAlternatives?: boolean;
  requiredTier?: string;
}

export function getExamStartErrorMessage(classified: ClassifiedExamError): ExamStartErrorMessage {
  const requiredTier = classified.details?.requiredTier;

  switch (classified.code) {
    case EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED:
      return {
        title: "Subscription Required",
        description: requiredTier
          ? `This exam requires a${requiredTier === "rn" ? "n RN" : ` ${requiredTier.toUpperCase()}`} subscription. Please upgrade your plan to access this exam.`
          : "This exam requires a paid subscription. Please upgrade your plan to access the question bank.",
        showUpgrade: true,
        requiredTier,
      };
    case EXAM_FAILURE_CODES.ENTITLEMENT_FAILURE:
      return {
        title: "Authentication Required",
        description: "Please log in to start an exam.",
        action: "login",
      };
    case EXAM_FAILURE_CODES.ACCESS_DENIED:
      return {
        title: "Access Restricted",
        description: requiredTier
          ? `This exam requires a${requiredTier === "rn" ? "n RN" : ` ${requiredTier.toUpperCase()}`} subscription.`
          : "You don't have access to this exam tier. Please check your subscription.",
        showUpgrade: true,
        requiredTier,
      };
    case EXAM_FAILURE_CODES.EXAM_NOT_FOUND:
      return {
        title: "Exam Not Found",
        description: "This exam could not be found. It may have been removed or is no longer available.",
        showAlternatives: true,
      };
    case EXAM_FAILURE_CODES.EXAM_UNPUBLISHED:
      return {
        title: "Exam Not Available",
        description: "This exam is not currently published. Please try a different exam or check back later.",
        showAlternatives: true,
      };
    case EXAM_FAILURE_CODES.ZERO_VALID_ITEMS:
    case EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING:
      return {
        title: "No Questions Available",
        description: "No questions are available for this exam configuration. Please try a different tier or body system.",
        showAlternatives: true,
        showRetry: true,
      };
    case EXAM_FAILURE_CODES.ASSEMBLY_FAILED:
      return {
        title: "Exam Assembly Issue",
        description: "We're having trouble assembling your exam. Loading a lighter version...",
        showRetry: true,
      };
    case EXAM_FAILURE_CODES.SESSION_CREATE_FAILED:
    case EXAM_FAILURE_CODES.SCHEMA_MISMATCH:
      return {
        title: "Unable to Start Exam",
        description: "Unable to create exam session — please retry in a moment. If it persists, contact support.",
        showRetry: true,
      };
    case EXAM_FAILURE_CODES.NETWORK_TIMEOUT:
    case EXAM_FAILURE_CODES.DB_TIMEOUT:
      return {
        title: "Connection Issue",
        description: "The request timed out. Please check your connection and try again.",
        showRetry: true,
      };
    case EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD:
      return {
        title: "Exam Too Large",
        description: "The exam payload is too large. Loading a lighter version with fewer questions...",
        showRetry: true,
      };
    case EXAM_FAILURE_CODES.INVALID_PAYLOAD:
      return {
        title: "Invalid Configuration",
        description: "The exam configuration is invalid. Please try a different exam setup.",
        showRetry: true,
        showAlternatives: true,
      };
    case EXAM_FAILURE_CODES.REGION_UNAVAILABLE:
      return {
        title: "Temporarily Unavailable",
        description: "Mock exams are temporarily unavailable for your account. Please try again later.",
        showRetry: true,
      };
    case EXAM_FAILURE_CODES.MEMORY_REJECTION:
      return {
        title: "System Busy",
        description: "The system is under heavy load. Loading a lighter version...",
        showRetry: true,
      };
    default:
      return {
        title: "Unable to Start Exam",
        description: classified.message || "An unexpected error occurred. Attempting recovery...",
        showRetry: true,
      };
  }
}
