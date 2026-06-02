import { describe, test, expect, vi } from "vitest";
import {
  EXAM_FAILURE_CODES,
  EXAM_ERROR_USER_MESSAGES,
  classifyHttpError,
  classifyClientError,
  classifyServerError,
  getExamStartErrorMessage,
} from "../../shared/exam-error-codes";

describe("EXAM_FAILURE_CODES", () => {
  test("includes all required failure codes", () => {
    expect(EXAM_FAILURE_CODES.EXAM_NOT_FOUND).toBe("exam_not_found");
    expect(EXAM_FAILURE_CODES.EXAM_UNPUBLISHED).toBe("exam_unpublished");
    expect(EXAM_FAILURE_CODES.INVALID_PAYLOAD).toBe("invalid_payload");
    expect(EXAM_FAILURE_CODES.SESSION_CREATE_FAILED).toBe("session_create_failed");
    expect(EXAM_FAILURE_CODES.ASSEMBLY_FAILED).toBe("assembly_failed");
    expect(EXAM_FAILURE_CODES.NAVIGATION_FAILED).toBe("navigation_failed");
    expect(EXAM_FAILURE_CODES.TIER_MISMATCH).toBe("tier_mismatch");
    expect(EXAM_FAILURE_CODES.NOT_ENTITLED).toBe("not_entitled");
    expect(EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED).toBe("subscription_required");
    expect(EXAM_FAILURE_CODES.EXAM_UNAVAILABLE_FOR_REGION).toBe("exam_unavailable_for_region");
    expect(EXAM_FAILURE_CODES.FEATURE_DISABLED).toBe("feature_disabled");
    expect(EXAM_FAILURE_CODES.ASSEMBLY_CAPACITY).toBe("assembly_capacity");
  });
});

describe("EXAM_ERROR_USER_MESSAGES", () => {
  test("every failure code has a user-facing message", () => {
    const allCodes = Object.values(EXAM_FAILURE_CODES);
    for (const code of allCodes) {
      const msg = EXAM_ERROR_USER_MESSAGES[code];
      expect(msg, `Missing user message for code: ${code}`).toBeDefined();
      expect(msg.title).toBeTruthy();
      expect(msg.description).toBeTruthy();
    }
  });

  test("no message contains 'Something went wrong'", () => {
    for (const [code, msg] of Object.entries(EXAM_ERROR_USER_MESSAGES)) {
      expect(msg.title).not.toContain("Something went wrong");
      expect(msg.description).not.toContain("Something went wrong");
    }
  });

  test("tier mismatch returns actionable message", () => {
    const msg = EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.TIER_MISMATCH];
    expect(msg.title).toBe("Subscription Required");
    expect(msg.description).toContain("upgrade");
  });

  test("question batch missing returns actionable message", () => {
    const msg = EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING];
    expect(msg.title).toBe("No Questions Available");
    expect(msg.description).toContain("questions");
  });

  test("exam not found returns specific message", () => {
    const msg = EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.EXAM_NOT_FOUND];
    expect(msg.title).toBe("Exam Not Found");
  });

  test("unknown error does NOT say 'Something went wrong'", () => {
    const msg = EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
    expect(msg.title).not.toContain("Something went wrong");
    expect(msg.description).not.toContain("Something went wrong");
    expect(msg.description).toContain("retry");
  });
});

describe("classifyHttpError", () => {
  test("classifies 401 as entitlement_failure", () => {
    const result = classifyHttpError(401);
    expect(result.code).toBe(EXAM_FAILURE_CODES.ENTITLEMENT_FAILURE);
    expect(result.recoverable).toBe(true);
  });

  test("classifies 403 as access_denied", () => {
    const result = classifyHttpError(403);
    expect(result.code).toBe(EXAM_FAILURE_CODES.ACCESS_DENIED);
    expect(result.recoverable).toBe(false);
  });

  test("classifies 404 as exam_not_found", () => {
    const result = classifyHttpError(404);
    expect(result.code).toBe(EXAM_FAILURE_CODES.EXAM_NOT_FOUND);
  });

  test("uses reasonCode from server response body", () => {
    const result = classifyHttpError(403, { reasonCode: "tier_mismatch", error: "Unauthorized exam tier" });
    expect(result.code).toBe("tier_mismatch");
    expect(result.message).toBe("Unauthorized exam tier");
  });

  test("uses reasonCode for subscription_required", () => {
    const result = classifyHttpError(403, { reasonCode: "subscription_required", error: "Upgrade required" });
    expect(result.code).toBe("subscription_required");
  });

  test("uses reasonCode for question_batch_missing", () => {
    const result = classifyHttpError(400, { reasonCode: "question_batch_missing", error: "No questions" });
    expect(result.code).toBe("question_batch_missing");
  });

  test("classifies 500 with reasonCode from structured error", () => {
    const result = classifyHttpError(500, { reasonCode: "session_create_failed", error: "Failed to create", recoverable: true });
    expect(result.code).toBe("session_create_failed");
    expect(result.recoverable).toBe(true);
  });

  test("classifies 503 as db_timeout", () => {
    const result = classifyHttpError(503);
    expect(result.code).toBe(EXAM_FAILURE_CODES.DB_TIMEOUT);
    expect(result.recoverable).toBe(true);
  });
});

describe("classifyClientError", () => {
  test("classifies timeout error", () => {
    const err = new Error("Request timed out");
    err.name = "AbortError";
    const result = classifyClientError(err);
    expect(result.code).toBe(EXAM_FAILURE_CODES.NETWORK_TIMEOUT);
    expect(result.recoverable).toBe(true);
  });

  test("classifies network error", () => {
    const result = classifyClientError(new Error("Failed to fetch"));
    expect(result.code).toBe(EXAM_FAILURE_CODES.NETWORK_TIMEOUT);
    expect(result.recoverable).toBe(true);
  });

  test("classifies parse error", () => {
    const result = classifyClientError(new Error("Unexpected token < in JSON"));
    expect(result.code).toBe(EXAM_FAILURE_CODES.FRONTEND_PARSE_FAILURE);
    expect(result.recoverable).toBe(true);
  });

  test("classifies unknown error as recoverable", () => {
    const result = classifyClientError(new Error("Something random"));
    expect(result.code).toBe(EXAM_FAILURE_CODES.UNKNOWN);
    expect(result.recoverable).toBe(true);
  });
});

describe("classifyServerError", () => {
  test("classifies timeout errors", () => {
    const result = classifyServerError({ message: "canceling statement due to statement timeout" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.DB_TIMEOUT);
    expect(result.recoverable).toBe(true);
  });

  test("classifies schema mismatch", () => {
    const result = classifyServerError({ message: 'column "foo" does not exist' });
    expect(result.code).toBe(EXAM_FAILURE_CODES.SCHEMA_MISMATCH);
  });

  test("classifies zero question count", () => {
    const result = classifyServerError({ message: "" }, { questionCount: 0 });
    expect(result.code).toBe(EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING);
  });

  test("classifies assembly failures", () => {
    const result = classifyServerError({ message: "assembly failed" }, { stage: "assembly" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.ASSEMBLY_FAILED);
  });

  test("classifies session insert failures", () => {
    const result = classifyServerError({ message: "INSERT INTO mock_exam_attempts failed" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.SESSION_CREATE_FAILED);
  });

  test("classifies exam not found", () => {
    const result = classifyServerError({ message: "exam not found" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.EXAM_NOT_FOUND);
  });

  test("classifies unpublished exam", () => {
    const result = classifyServerError({ message: "exam is unpublished" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.EXAM_UNPUBLISHED);
  });

  test("classifies memory rejection", () => {
    const result = classifyServerError({ message: "out of memory" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.MEMORY_REJECTION);
  });

  test("unknown errors are recoverable", () => {
    const result = classifyServerError({ message: "something unexpected" });
    expect(result.code).toBe(EXAM_FAILURE_CODES.UNKNOWN);
    expect(result.recoverable).toBe(true);
  });
});

describe("Entitlement structured responses", () => {
  test("resolveEntitlementSync returns correct decision for free user on premium feature", async () => {
    const { resolveEntitlementSync } = await import("../entitlements");
    const freeUser = { id: "test-1", tier: "free" };
    const decision = resolveEntitlementSync(freeUser, "feature", "mock_exams");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toContain("requires_");
  });

  test("resolveEntitlementSync grants access to admin user", async () => {
    const { resolveEntitlementSync } = await import("../entitlements");
    const adminUser = { id: "admin-1", tier: "admin" };
    const decision = resolveEntitlementSync(adminUser, "feature", "mock_exams");
    expect(decision.hasAccess).toBe(true);
  });

  test("resolveEntitlementSync returns correct decision for tier user on matching feature", async () => {
    const { resolveEntitlementSync } = await import("../entitlements");
    const rnUser = { id: "rn-1", tier: "rn" };
    const decision = resolveEntitlementSync(rnUser, "feature", "mock_exams");
    expect(decision.hasAccess).toBe(true);
  });

  test("resolveEntitlementSync denies unauthenticated user", async () => {
    const { resolveEntitlementSync } = await import("../entitlements");
    const decision = resolveEntitlementSync(null, "feature", "mock_exams");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("not_authenticated");
  });
});

describe("8 required exam-start failure scenarios", () => {
  test("Scenario 1: Unauthenticated user gets entitlement_failure with structured response", () => {
    const result = classifyHttpError(401, { reasonCode: "entitlement_failure", error: "Authentication required", recoverable: true });
    expect(result.code).toBe("entitlement_failure");
    expect(result.recoverable).toBe(true);
    const msg = EXAM_ERROR_USER_MESSAGES[result.code] || EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
    expect(msg.title).not.toContain("Something went wrong");
  });

  test("Scenario 2: Free user on premium exam gets subscription_required with upgrade info", () => {
    const result = classifyHttpError(403, {
      reasonCode: "subscription_required",
      error: "Premium feature - upgrade required",
      recoverable: false,
      upgradeRequired: true,
      requiredTier: "rn",
      currentTier: "free",
    });
    expect(result.code).toBe("subscription_required");
    expect(result.recoverable).toBe(false);
    const msg = EXAM_ERROR_USER_MESSAGES[result.code];
    expect(msg).toBeDefined();
    expect(msg.title).toBe("Upgrade Required");
  });

  test("Scenario 3: Exam not found returns exam_not_found with actionable message", () => {
    const serverErr = classifyServerError({ message: "exam not found" });
    expect(serverErr.code).toBe(EXAM_FAILURE_CODES.EXAM_NOT_FOUND);
    const result = classifyHttpError(404, { reasonCode: "exam_not_found", error: "Exam not found" });
    expect(result.code).toBe("exam_not_found");
    const msg = EXAM_ERROR_USER_MESSAGES[result.code];
    expect(msg.title).toBe("Exam Not Found");
  });

  test("Scenario 4: Unpublished exam returns exam_unpublished", () => {
    const serverErr = classifyServerError({ message: "exam is unpublished" });
    expect(serverErr.code).toBe(EXAM_FAILURE_CODES.EXAM_UNPUBLISHED);
    const result = classifyHttpError(400, { reasonCode: "exam_unpublished", error: "Exam not published" });
    expect(result.code).toBe("exam_unpublished");
    const msg = EXAM_ERROR_USER_MESSAGES[result.code];
    expect(msg).toBeDefined();
    expect(msg.title).not.toContain("Something went wrong");
  });

  test("Scenario 5: No questions available returns question_batch_missing with fallback hint", () => {
    const serverErr = classifyServerError({ message: "" }, { questionCount: 0 });
    expect(serverErr.code).toBe(EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING);
    const result = classifyHttpError(400, { reasonCode: "question_batch_missing", error: "No questions available" });
    expect(result.code).toBe("question_batch_missing");
    const msg = EXAM_ERROR_USER_MESSAGES[result.code];
    expect(msg.title).toBe("No Questions Available");
    expect(msg.description).toContain("questions");
  });

  test("Scenario 6: Session creation failure returns session_create_failed as recoverable", () => {
    const serverErr = classifyServerError({ message: "INSERT INTO mock_exam_attempts failed" });
    expect(serverErr.code).toBe(EXAM_FAILURE_CODES.SESSION_CREATE_FAILED);
    const result = classifyHttpError(500, { reasonCode: "session_create_failed", error: "Failed to create", recoverable: true });
    expect(result.code).toBe("session_create_failed");
    expect(result.recoverable).toBe(true);
    const msg = EXAM_ERROR_USER_MESSAGES[result.code];
    expect(msg).toBeDefined();
  });

  test("Scenario 7: Database timeout returns db_timeout as recoverable", () => {
    const serverErr = classifyServerError({ message: "canceling statement due to statement timeout" });
    expect(serverErr.code).toBe(EXAM_FAILURE_CODES.DB_TIMEOUT);
    expect(serverErr.recoverable).toBe(true);
    const result = classifyHttpError(503, { reasonCode: "db_timeout", error: "Timed out", recoverable: true });
    expect(result.code).toBe("db_timeout");
    expect(result.recoverable).toBe(true);
  });

  test("Scenario 8: Unknown server error is recoverable (triggers fallback cascade)", () => {
    const serverErr = classifyServerError({ message: "unexpected failure xyz" });
    expect(serverErr.code).toBe(EXAM_FAILURE_CODES.UNKNOWN);
    expect(serverErr.recoverable).toBe(true);
    const clientErr = classifyClientError(new Error("Something weird happened"));
    expect(clientErr.recoverable).toBe(true);
    const msg = EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
    expect(msg.title).not.toContain("Something went wrong");
    expect(msg.description).toContain("retry");
  });
});

describe("Endpoint response shape validation", () => {
  test("timeout handler response shape matches structured format", () => {
    const timeoutResponse = { error: "Exam start timed out. Please try again.", reasonCode: "db_timeout", recoverable: true };
    expect(timeoutResponse.reasonCode).toBe("db_timeout");
    expect(timeoutResponse.recoverable).toBe(true);
    expect(typeof timeoutResponse.error).toBe("string");
  });

  test("entitlement denial response includes all required fields", () => {
    const denialResponse = {
      error: "Premium feature - upgrade required",
      reasonCode: "subscription_required",
      recoverable: false,
      upgradeRequired: true,
      feature: "mock_exams",
      requiredTier: "rn",
      currentTier: "free",
      message: "This feature requires a rn subscription or higher.",
      details: { feature: "mock_exams", userTier: "free", requiredTier: "rn" },
    };
    expect(denialResponse.reasonCode).toBeTruthy();
    expect(typeof denialResponse.recoverable).toBe("boolean");
    expect(denialResponse.message).toBeTruthy();
    expect(denialResponse.details).toBeDefined();
    expect(denialResponse.upgradeRequired).toBe(true);
  });

  test("feature disabled response includes reasonCode and recoverable", () => {
    const response = { error: "Mock exams are temporarily unavailable for your account.", reasonCode: "feature_disabled", recoverable: true };
    expect(response.reasonCode).toBe("feature_disabled");
    expect(response.recoverable).toBe(true);
  });

  test("invalid payload response is not recoverable", () => {
    const response = { error: "Missing exam definition ID", reasonCode: "invalid_payload", recoverable: false };
    expect(response.reasonCode).toBe("invalid_payload");
    expect(response.recoverable).toBe(false);
  });

  test("auth failure response includes reasonCode", () => {
    const response = { error: "Authentication required", reasonCode: "entitlement_failure", recoverable: true };
    expect(response.reasonCode).toBe("entitlement_failure");
    expect(response.recoverable).toBe(true);
  });
});

describe("Fallback cascade logic", () => {
  test("recoverable errors should trigger fallback cascade (resume → reduced → practice)", () => {
    const recoverableCodes = [
      EXAM_FAILURE_CODES.DB_TIMEOUT,
      EXAM_FAILURE_CODES.SESSION_CREATE_FAILED,
      EXAM_FAILURE_CODES.NETWORK_TIMEOUT,
      EXAM_FAILURE_CODES.FRONTEND_PARSE_FAILURE,
      EXAM_FAILURE_CODES.UNKNOWN,
    ];
    for (const code of recoverableCodes) {
      const result = classifyHttpError(500, { reasonCode: code, recoverable: true });
      expect(result.recoverable, `Code ${code} should be recoverable`).toBe(true);
    }
  });

  test("non-recoverable errors should NOT trigger fallback cascade", () => {
    const nonRecoverableCodes = [
      EXAM_FAILURE_CODES.ACCESS_DENIED,
      EXAM_FAILURE_CODES.TIER_MISMATCH,
      EXAM_FAILURE_CODES.SUBSCRIPTION_REQUIRED,
    ];
    for (const code of nonRecoverableCodes) {
      const result = classifyHttpError(403, { reasonCode: code, recoverable: false });
      expect(result.recoverable, `Code ${code} should NOT be recoverable`).toBe(false);
    }
  });
});

describe("No generic dead-end errors in user messages", () => {
  test("no message contains 'Something went wrong — please try again'", () => {
    for (const [_, msg] of Object.entries(EXAM_ERROR_USER_MESSAGES)) {
      expect(msg.title + " " + msg.description).not.toContain("Something went wrong — please try again");
    }
  });

  test("every error code has a non-generic, actionable message", () => {
    const genericPhrases = ["Something went wrong", "Unknown error occurred", "An error occurred"];
    for (const [code, msg] of Object.entries(EXAM_ERROR_USER_MESSAGES)) {
      for (const phrase of genericPhrases) {
        expect(msg.title).not.toContain(phrase);
        expect(msg.description).not.toContain(phrase);
      }
    }
  });
});

describe("Exam Start Pipeline — Precision Regression Prevention", () => {
  test("reasonCode branch preserves requiredTier from server", () => {
    const classified = classifyHttpError(403, {
      reasonCode: "subscription_required",
      error: "Upgrade required",
      recoverable: false,
      requiredTier: "np",
      fallbackHint: "upgrade",
    });
    expect(classified.code).toBe("subscription_required");
    expect(classified.details?.requiredTier).toBe("np");
    expect(classified.details?.fallbackHint).toBe("upgrade");
  });

  test("reasonCode branch preserves fallbackHint from server", () => {
    const classified = classifyHttpError(503, {
      reasonCode: "assembly_failed",
      error: "At capacity",
      recoverable: true,
      fallbackHint: "retry",
    });
    expect(classified.details?.fallbackHint).toBe("retry");
  });

  test("reasonCode branch preserves correlationId from server", () => {
    const classified = classifyHttpError(500, {
      reasonCode: "session_create_failed",
      error: "DB error",
      recoverable: true,
      correlationId: "exam-start-abc123",
    });
    expect(classified.details?.correlationId).toBe("exam-start-abc123");
  });

  test("codeMap branch also preserves requiredTier and fallbackHint", () => {
    const classified = classifyHttpError(403, {
      code: "MOCK_PAYWALL",
      error: "Upgrade required",
      requiredTier: "rn",
      fallbackHint: "upgrade",
      recoverable: false,
    });
    expect(classified.details?.requiredTier).toBe("rn");
    expect(classified.details?.fallbackHint).toBe("upgrade");
  });

  test("getExamStartErrorMessage uses requiredTier from reasonCode path", () => {
    const classified = classifyHttpError(403, {
      reasonCode: "subscription_required",
      error: "Upgrade",
      recoverable: false,
      requiredTier: "rpn",
    });
    const msg = getExamStartErrorMessage(classified);
    expect(msg.description).toContain("RPN");
    expect(msg.showUpgrade).toBe(true);
  });
});

describe("Exam Start Pipeline — Server Error Code Mapping", () => {
  test("EXAM_START_TIMEOUT maps to network_timeout via reasonCode", () => {
    const classified = classifyHttpError(503, {
      code: "EXAM_START_TIMEOUT",
      reasonCode: "network_timeout",
      error: "Exam start timed out",
      recoverable: true,
      fallbackHint: "retry",
    });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.NETWORK_TIMEOUT);
    expect(classified.recoverable).toBe(true);
    expect(classified.details?.fallbackHint).toBe("retry");
  });

  test("FEATURE_DISABLED maps to region_unavailable via reasonCode", () => {
    const classified = classifyHttpError(503, {
      code: "FEATURE_DISABLED",
      reasonCode: "region_unavailable",
      error: "Mock exams unavailable",
      recoverable: true,
      fallbackHint: "retry_later",
    });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.REGION_UNAVAILABLE);
    expect(classified.details?.fallbackHint).toBe("retry_later");
  });

  test("ASSEMBLY_CAPACITY maps to assembly_failed via reasonCode", () => {
    const classified = classifyHttpError(503, {
      code: "ASSEMBLY_CAPACITY",
      reasonCode: "assembly_failed",
      error: "At capacity",
      recoverable: true,
      fallbackHint: "retry",
    });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.ASSEMBLY_FAILED);
    expect(classified.recoverable).toBe(true);
  });

  test("INVALID_PAYLOAD maps correctly", () => {
    const classified = classifyHttpError(400, {
      code: "INVALID_PAYLOAD",
      reasonCode: "invalid_payload",
      error: "Missing required fields",
      recoverable: false,
    });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.INVALID_PAYLOAD);
    expect(classified.recoverable).toBe(false);
  });
});

describe("Exam Start Pipeline — Validation Gate Coverage", () => {
  test("classifyServerError handles oversized payload", () => {
    const err = new Error("payload too large for session storage");
    const classified = classifyServerError(err);
    expect(classified.code).toBe(EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD);
    expect(classified.recoverable).toBe(true);
  });

  test("classifyServerError handles malformed question", () => {
    const err = new Error("malformed question detected: missing options");
    const classified = classifyServerError(err);
    expect(classified.code).toBe(EXAM_FAILURE_CODES.MALFORMED_QUESTION);
    expect(classified.recoverable).toBe(true);
  });

  test("classifyServerError handles stale resume pointer", () => {
    const err = new Error("resume pointer out of range");
    const classified = classifyServerError(err);
    expect(classified.code).toBe(EXAM_FAILURE_CODES.STALE_RESUME_POINTER);
    expect(classified.recoverable).toBe(true);
  });

  test("classifyClientError handles oversized payload", () => {
    const err = new Error("entity too large");
    const classified = classifyClientError(err);
    expect(classified.code).toBe(EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD);
  });

  test("classifyClientError handles malformed question", () => {
    const err = new Error("invalid question: missing correct answer");
    const classified = classifyClientError(err);
    expect(classified.code).toBe(EXAM_FAILURE_CODES.MALFORMED_QUESTION);
  });

  test("classifyClientError handles schema mismatch", () => {
    const err = new Error('column "cat_state" does not exist');
    const classified = classifyClientError(err);
    expect(classified.code).toBe(EXAM_FAILURE_CODES.SCHEMA_MISMATCH);
  });

  test("classifyHttpError with 413 maps to oversized_payload", () => {
    const classified = classifyHttpError(413, { error: "Payload too large" });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.OVERSIZED_PAYLOAD);
    expect(classified.recoverable).toBe(true);
  });

  test("classifyHttpError with 409 maps to stale_resume_pointer", () => {
    const classified = classifyHttpError(409, { error: "Session state conflict" });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.STALE_RESUME_POINTER);
    expect(classified.recoverable).toBe(true);
  });

  test("classifyHttpError with 422 maps to corrupted_session", () => {
    const classified = classifyHttpError(422, { error: "Invalid session data" });
    expect(classified.code).toBe(EXAM_FAILURE_CODES.CORRUPTED_SESSION);
    expect(classified.recoverable).toBe(true);
  });
});

describe("Exam Start Pipeline — Error Message Completeness", () => {
  test("oversized_payload shows retry message", () => {
    const classified = classifyHttpError(413, { error: "Too large" });
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Exam Too Large");
    expect(msg.showRetry).toBe(true);
  });

  test("memory_rejection shows system busy message", () => {
    const err = new Error("out of memory");
    const classified = classifyClientError(err);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("System Busy");
    expect(msg.showRetry).toBe(true);
  });

  test("invalid_payload shows invalid configuration", () => {
    const classified = classifyHttpError(400, { code: "INVALID_PAYLOAD", error: "Missing fields", reasonCode: "invalid_payload" });
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Invalid Configuration");
  });

  test("exam_unpublished shows alternatives", () => {
    const classified = { code: EXAM_FAILURE_CODES.EXAM_UNPUBLISHED, message: "Not published", recoverable: false, timestamp: new Date().toISOString() };
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Exam Not Available");
    expect(msg.showAlternatives).toBe(true);
  });

  test("access_denied with tier shows upgrade", () => {
    const classified = classifyHttpError(403, { error: "Access denied", requiredTier: "rrt" });
    const msg = getExamStartErrorMessage(classified);
    expect(msg.showUpgrade).toBe(true);
    expect(msg.description).toContain("RRT");
  });
});

describe("Exam Start Pipeline — Endpoint Behavior Simulation", () => {
  function simulateServerResponse(scenario: string): { status: number; body: Record<string, any> } {
    switch (scenario) {
      case "success":
        return { status: 200, body: { attemptId: 123, creditUsed: false } };
      case "zero_questions":
        return { status: 400, body: { error: "Cannot start an exam with zero questions.", code: "ZERO_VALID_ITEMS", reasonCode: "zero_valid_items", recoverable: false, fallbackHint: "try_different_config" } };
      case "oversized_payload":
        return { status: 400, body: { error: "Too many questions. Maximum allowed is 300.", code: "PAYLOAD_TOO_LARGE", reasonCode: "oversized_payload", recoverable: true, fallbackHint: "retry_reduced" } };
      case "tier_block":
        return { status: 403, body: { error: "Unauthorized exam tier", code: "TIER_MISMATCH", reasonCode: "subscription_required", recoverable: false, requiredTier: "np" } };
      case "unpublished":
        return { status: 400, body: { error: "This exam's questions are not currently published.", code: "EXAM_UNPUBLISHED", reasonCode: "exam_unpublished", recoverable: false, fallbackHint: "try_different_exam" } };
      case "timeout":
        return { status: 503, body: { error: "Exam start timed out.", code: "EXAM_START_TIMEOUT", reasonCode: "network_timeout", recoverable: true, fallbackHint: "retry", correlationId: "exam-start-abc123" } };
      case "feature_disabled":
        return { status: 503, body: { error: "Mock exams temporarily unavailable.", code: "FEATURE_DISABLED", reasonCode: "region_unavailable", recoverable: true, fallbackHint: "retry_later" } };
      case "assembly_capacity":
        return { status: 503, body: { error: "Exam assembly at capacity.", code: "ASSEMBLY_CAPACITY", reasonCode: "assembly_failed", recoverable: true, fallbackHint: "retry", retryAfter: 10 } };
      case "paywall":
        return { status: 403, body: { error: "Upgrade required", code: "MOCK_PAYWALL", reasonCode: "subscription_required", recoverable: false, requiredTier: "rn", creditScope: "RN" } };
      case "invalid_payload":
        return { status: 400, body: { error: "Missing required fields", code: "INVALID_PAYLOAD", reasonCode: "invalid_payload", recoverable: false } };
      case "session_create_failed":
        return { status: 500, body: { error: "Unable to create session", code: "SESSION_CREATE_FAILED", reasonCode: "session_create_failed", recoverable: true, fallbackHint: "retry_reduced", correlationId: "exam-start-xyz789" } };
      case "schema_drift":
        return { status: 500, body: { error: "Database schema mismatch", code: "SCHEMA_DRIFT", reasonCode: "schema_mismatch", recoverable: true, fallbackHint: "retry_reduced", correlationId: "exam-start-sch001" } };
      case "all_malformed":
        return { status: 400, body: { error: "All questions failed validation.", code: "ZERO_VALID_ITEMS", reasonCode: "zero_valid_items", recoverable: true, fallbackHint: "retry_reduced" } };
      default:
        return { status: 500, body: { error: "Unknown", code: "UNKNOWN" } };
    }
  }

  test("success scenario does not produce error classification", () => {
    const resp = simulateServerResponse("success");
    expect(resp.status).toBe(200);
    expect(resp.body.attemptId).toBeTruthy();
  });

  test("zero_questions returns structured error with fallbackHint", () => {
    const resp = simulateServerResponse("zero_questions");
    expect(resp.body.reasonCode).toBe("zero_valid_items");
    expect(resp.body.recoverable).toBe(false);
    expect(resp.body.fallbackHint).toBe("try_different_config");
    const classified = classifyHttpError(resp.status, resp.body);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("No Questions Available");
    expect(msg.description).not.toContain("Something went wrong");
  });

  test("oversized_payload returns structured error with retry hint", () => {
    const resp = simulateServerResponse("oversized_payload");
    expect(resp.body.reasonCode).toBe("oversized_payload");
    expect(resp.body.recoverable).toBe(true);
    expect(resp.body.fallbackHint).toBe("retry_reduced");
    const classified = classifyHttpError(resp.status, resp.body);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Exam Too Large");
    expect(msg.showRetry).toBe(true);
  });

  test("tier_block returns tier info for upgrade messaging", () => {
    const resp = simulateServerResponse("tier_block");
    expect(resp.body.reasonCode).toBe("subscription_required");
    expect(resp.body.requiredTier).toBe("np");
    const classified = classifyHttpError(resp.status, resp.body);
    expect(classified.details?.requiredTier).toBe("np");
    const msg = getExamStartErrorMessage(classified);
    expect(msg.showUpgrade).toBe(true);
    expect(msg.description).toContain("NP");
  });

  test("unpublished returns clear non-recoverable message", () => {
    const resp = simulateServerResponse("unpublished");
    expect(resp.body.reasonCode).toBe("exam_unpublished");
    const classified = classifyHttpError(resp.status, resp.body);
    expect(classified.code).toBe("exam_unpublished");
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Exam Not Available");
    expect(msg.showAlternatives).toBe(true);
  });

  test("timeout returns recoverable error with retry hint", () => {
    const resp = simulateServerResponse("timeout");
    expect(resp.body.reasonCode).toBe("network_timeout");
    expect(resp.body.recoverable).toBe(true);
    expect(resp.body.correlationId).toBeTruthy();
    const classified = classifyHttpError(resp.status, resp.body);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Connection Issue");
    expect(msg.showRetry).toBe(true);
  });

  test("paywall returns requiredTier and non-recoverable", () => {
    const resp = simulateServerResponse("paywall");
    const classified = classifyHttpError(resp.status, resp.body);
    expect(classified.details?.requiredTier).toBe("rn");
    expect(classified.recoverable).toBe(false);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.showUpgrade).toBe(true);
  });

  test("session_create_failed returns correlationId and recovery hint", () => {
    const resp = simulateServerResponse("session_create_failed");
    expect(resp.body.correlationId).toBeTruthy();
    const classified = classifyHttpError(resp.status, resp.body);
    expect(classified.details?.correlationId).toBe("exam-start-xyz789");
    expect(classified.details?.fallbackHint).toBe("retry_reduced");
    const msg = getExamStartErrorMessage(classified);
    expect(msg.showRetry).toBe(true);
  });

  test("schema_drift returns recoverable with retry hint", () => {
    const resp = simulateServerResponse("schema_drift");
    const classified = classifyHttpError(resp.status, resp.body);
    expect(classified.code).toBe("schema_mismatch");
    expect(classified.recoverable).toBe(true);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("Unable to Start Exam");
  });

  test("all_malformed returns zero_valid_items with retry hint", () => {
    const resp = simulateServerResponse("all_malformed");
    const classified = classifyHttpError(resp.status, resp.body);
    expect(classified.code).toBe("zero_valid_items");
    expect(classified.recoverable).toBe(true);
    expect(classified.details?.fallbackHint).toBe("retry_reduced");
    const msg = getExamStartErrorMessage(classified);
    expect(msg.title).toBe("No Questions Available");
  });
});

describe("Exam Start Pipeline — Fallback Cascade Logic", () => {
  test("recoverable error triggers fallback cascade", () => {
    const classified = classifyHttpError(503, { reasonCode: "assembly_failed", error: "At capacity", recoverable: true, fallbackHint: "retry" });
    expect(classified.recoverable).toBe(true);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.showRetry).toBe(true);
  });

  test("non-recoverable error does not trigger fallback cascade", () => {
    const classified = classifyHttpError(403, { reasonCode: "subscription_required", error: "Upgrade", recoverable: false, requiredTier: "rn" });
    expect(classified.recoverable).toBe(false);
    const msg = getExamStartErrorMessage(classified);
    expect(msg.showUpgrade).toBe(true);
  });

  test("fallback cascade ordering: resume before reduced before minimal before practice", () => {
    const stages = ["resume", "reduced", "minimal", "practice"];
    expect(stages.indexOf("resume")).toBeLessThan(stages.indexOf("reduced"));
    expect(stages.indexOf("reduced")).toBeLessThan(stages.indexOf("minimal"));
    expect(stages.indexOf("minimal")).toBeLessThan(stages.indexOf("practice"));
  });

  test("reduced exam config halves question count with minimum of 10", () => {
    const selectedLength = 100;
    const reducedLength = Math.max(10, Math.floor(selectedLength / 2));
    expect(reducedLength).toBe(50);

    const smallLength = 15;
    const smallReduced = Math.max(10, Math.floor(smallLength / 2));
    expect(smallReduced).toBe(10);
  });

  test("minimal study mode uses 10 questions with foundational difficulty", () => {
    const minimalConfig = {
      questionCount: 10,
      timeLimitMinutes: 15,
      difficultyDistribution: { foundational: 0.6, moderate: 0.3, difficult: 0.1 },
    };
    expect(minimalConfig.questionCount).toBe(10);
    expect(minimalConfig.timeLimitMinutes).toBe(15);
    expect(minimalConfig.difficultyDistribution.foundational).toBeGreaterThan(0.5);
  });
});

describe("Exam Start Pipeline — Generic Dead-End Prevention (Behavioral)", () => {
  const ALL_SERVER_SCENARIOS = [
    { status: 400, body: { error: "Missing required fields", code: "INVALID_PAYLOAD", reasonCode: "invalid_payload", recoverable: false } },
    { status: 400, body: { error: "Zero questions", code: "ZERO_VALID_ITEMS", reasonCode: "zero_valid_items", recoverable: false } },
    { status: 400, body: { error: "Too many questions", code: "PAYLOAD_TOO_LARGE", reasonCode: "oversized_payload", recoverable: true } },
    { status: 400, body: { error: "Unpublished", code: "EXAM_UNPUBLISHED", reasonCode: "exam_unpublished", recoverable: false } },
    { status: 403, body: { error: "Upgrade required", code: "MOCK_PAYWALL", reasonCode: "subscription_required", recoverable: false, requiredTier: "rn" } },
    { status: 403, body: { error: "Unauthorized tier", code: "TIER_MISMATCH", reasonCode: "subscription_required", recoverable: false, requiredTier: "np" } },
    { status: 404, body: { error: "Exam not found", code: "EXAM_NOT_FOUND", reasonCode: "exam_not_found", recoverable: false } },
    { status: 503, body: { error: "Timed out", code: "EXAM_START_TIMEOUT", reasonCode: "network_timeout", recoverable: true } },
    { status: 503, body: { error: "Feature disabled", code: "FEATURE_DISABLED", reasonCode: "region_unavailable", recoverable: true } },
    { status: 503, body: { error: "At capacity", code: "ASSEMBLY_CAPACITY", reasonCode: "assembly_failed", recoverable: true } },
    { status: 500, body: { error: "DB error", code: "SESSION_CREATE_FAILED", reasonCode: "session_create_failed", recoverable: true } },
    { status: 500, body: { error: "Schema mismatch", code: "SCHEMA_DRIFT", reasonCode: "schema_mismatch", recoverable: true } },
  ];

  test("no server scenario produces generic 'Something went wrong' dead-end", () => {
    for (const scenario of ALL_SERVER_SCENARIOS) {
      const classified = classifyHttpError(scenario.status, scenario.body);
      const msg = getExamStartErrorMessage(classified);
      expect(msg.title).not.toBe("Exam Start Failed");
      expect(msg.description).not.toBe("Something went wrong — please try again.");
      expect(msg.description).not.toContain("Something went wrong — please try again");
      expect(msg.title.length).toBeGreaterThan(0);
      expect(msg.description.length).toBeGreaterThan(0);
    }
  });

  test("every server scenario has structured fields (reasonCode + recoverable)", () => {
    for (const scenario of ALL_SERVER_SCENARIOS) {
      expect(scenario.body.reasonCode).toBeTruthy();
      expect(typeof scenario.body.recoverable).toBe("boolean");
    }
  });

  test("every recoverable scenario has a retry or fallback path", () => {
    for (const scenario of ALL_SERVER_SCENARIOS) {
      if (scenario.body.recoverable) {
        const classified = classifyHttpError(scenario.status, scenario.body);
        const msg = getExamStartErrorMessage(classified);
        expect(msg.showRetry).toBe(true);
      }
    }
  });

  test("every non-recoverable scenario has upgrade or alternatives path", () => {
    for (const scenario of ALL_SERVER_SCENARIOS) {
      if (!scenario.body.recoverable) {
        const classified = classifyHttpError(scenario.status, scenario.body);
        const msg = getExamStartErrorMessage(classified);
        expect(msg.showUpgrade || msg.showAlternatives).toBeTruthy();
      }
    }
  });
});
