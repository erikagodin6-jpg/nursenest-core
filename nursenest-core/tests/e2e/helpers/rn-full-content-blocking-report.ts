import type { RnFullContentEnvironmentCheck } from "./rn-full-content-environment";

export type BlockingLayer =
  | "environment_connectivity"
  | "credentials"
  | "login_auth"
  | "discovery"
  | "lessons"
  | "flashcards"
  | "question_bank"
  | "cat"
  | "unknown";

export type RnFullContentBlockingReport = {
  resolvedBaseUrl: string;
  loginUrl: string;
  playwrightWebServerSkipped: boolean;
  /** True when GET / returned a successful HTTP status during probe. */
  originResponded: boolean;
  /** True when GET /login returned a successful HTTP status during probe. */
  loginResponded: boolean;
  credentialsResolved: boolean;
  /** True once Phase 0 login was entered (credentials + env passed). */
  authAttempted: boolean;
  loginSucceeded: boolean;
  discoverySucceeded: boolean;
  inventoryCount: number;
  lessonsVisited: number;
  substantiveLessons: number;
  lessonsFailed: number;
  flashcardsStatus: string;
  questionBankStatus: string;
  catStatus: string;
  blockingLayer: BlockingLayer;
  detail: string;
};

export function buildRnFullContentBlockingReport(input: {
  baseUrl: string;
  loginUrl: string;
  skipWebServer: boolean;
  envCheck: RnFullContentEnvironmentCheck | undefined;
  credentialsResolved: boolean;
  authAttempted: boolean;
  loginSucceeded: boolean;
  discoverySucceeded: boolean;
  inventoryCount: number;
  lessonsVisited: number;
  substantiveLessons: number;
  lessonsFailed: number;
  flashcardsStatus: string;
  questionBankStatus: string;
  catStatus: string;
  lastError?: string;
}): RnFullContentBlockingReport {
  const originResponded = input.envCheck?.originReachable ?? false;
  const loginResponded = input.envCheck?.loginReachable ?? false;

  let blockingLayer: BlockingLayer = "unknown";
  let detail = input.lastError ?? "";

  if (!originResponded || !loginResponded) {
    blockingLayer = "environment_connectivity";
    detail =
      detail ||
      input.envCheck?.connectionError ||
      "Origin or /login did not respond successfully — check BASE_URL, dev server, firewall.";
  } else if (!input.credentialsResolved) {
    blockingLayer = "credentials";
    detail = detail || "Paid QA credentials are not configured.";
  } else if (input.authAttempted && !input.loginSucceeded) {
    blockingLayer = "login_auth";
    detail = detail || "Login did not reach learner shell — see rn-full-content-login-failure.json.";
  } else if (input.loginSucceeded && !input.discoverySucceeded) {
    blockingLayer = "discovery";
    detail = detail || "RN lesson hub inventory failed.";
  } else if (input.discoverySucceeded && (input.lessonsFailed > 0 || input.lessonsVisited < 1 || input.substantiveLessons < 1)) {
    blockingLayer = "lessons";
    detail = detail || "One or more lesson visits failed or lacked substantive content.";
  } else if (input.flashcardsStatus !== "passed" && input.loginSucceeded && input.discoverySucceeded) {
    blockingLayer = "flashcards";
    detail = detail || "Flashcards phase did not complete.";
  } else if (input.questionBankStatus !== "passed" && input.loginSucceeded && input.discoverySucceeded) {
    blockingLayer = "question_bank";
    detail = detail || "Question bank phase did not complete.";
  } else if (input.catStatus !== "passed" && input.loginSucceeded && input.discoverySucceeded) {
    blockingLayer = "cat";
    detail = detail || "CAT phase did not complete.";
  }

  return {
    resolvedBaseUrl: input.baseUrl,
    loginUrl: input.loginUrl,
    playwrightWebServerSkipped: input.skipWebServer,
    originResponded,
    loginResponded,
    credentialsResolved: input.credentialsResolved,
    authAttempted: input.authAttempted,
    loginSucceeded: input.loginSucceeded,
    discoverySucceeded: input.discoverySucceeded,
    inventoryCount: input.inventoryCount,
    lessonsVisited: input.lessonsVisited,
    substantiveLessons: input.substantiveLessons,
    lessonsFailed: input.lessonsFailed,
    flashcardsStatus: input.flashcardsStatus,
    questionBankStatus: input.questionBankStatus,
    catStatus: input.catStatus,
    blockingLayer,
    detail,
  };
}
