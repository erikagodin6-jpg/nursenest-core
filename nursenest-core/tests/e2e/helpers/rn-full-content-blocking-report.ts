import type { RnFullContentEnvironmentCheck } from "./rn-full-content-environment";
import type { RnPhase0PrimaryClassification } from "./rn-full-content-phase0-classification";

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
  artifactKind: "rn_full_content_blocking_report_v1";
  /** Highest-signal operator classification for Phase 0 / current blocking layer. */
  primaryClassification: RnPhase0PrimaryClassification | "SUITE_IN_PROGRESS" | "UNKNOWN" | "UNKNOWN_LOGIN_FAILURE";
  operatorHint: string;
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
  /** When Phase 0 failed, pass structured classification from {@link RnFullContentLoginError}. */
  phase0PrimaryClassification?: RnPhase0PrimaryClassification | null;
  phase0OperatorHint?: string | null;
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
  let primaryClassification: RnFullContentBlockingReport["primaryClassification"] = "UNKNOWN";
  let operatorHint = "";

  if (!originResponded || !loginResponded) {
    blockingLayer = "environment_connectivity";
    primaryClassification = "ENVIRONMENT_UNREACHABLE";
    detail =
      detail ||
      input.envCheck?.connectionError ||
      "Origin or /login did not respond successfully — check BASE_URL, dev server, firewall.";
  } else if (!input.credentialsResolved) {
    blockingLayer = "credentials";
    primaryClassification = "QA_CREDENTIALS_MISSING";
    detail = detail || "Paid QA credentials are not configured.";
  } else if (
    input.credentialsResolved &&
    !input.loginSucceeded &&
    input.phase0PrimaryClassification === "DB_AUTH_FAILURE" &&
    !input.authAttempted
  ) {
    /** DATABASE_URL rejected in Playwright preflight — login was not attempted. */
    blockingLayer = "login_auth";
    primaryClassification = "DB_AUTH_FAILURE";
    operatorHint = input.phase0OperatorHint ?? "";
    detail =
      detail ||
      operatorHint ||
      "DB_AUTH_FAILURE: Postgres rejected DATABASE_URL in Playwright process (see environment-and-database artifact).";
  } else if (input.authAttempted && !input.loginSucceeded) {
    blockingLayer = "login_auth";
    primaryClassification = input.phase0PrimaryClassification ?? "UNKNOWN_LOGIN_FAILURE";
    operatorHint = input.phase0OperatorHint ?? "";
    detail =
      detail ||
      operatorHint ||
      (primaryClassification === "DB_AUTH_FAILURE"
        ? "Postgres rejected DATABASE_URL (see environment+database artifact) — not the QA web login password."
        : "Login did not complete — see rn-full-content-login-and-auth.json.");
  } else if (input.loginSucceeded && !input.discoverySucceeded) {
    blockingLayer = "discovery";
    primaryClassification = "UNKNOWN";
    detail = detail || "RN lesson hub inventory failed.";
  } else if (input.discoverySucceeded && (input.lessonsFailed > 0 || input.lessonsVisited < 1 || input.substantiveLessons < 1)) {
    blockingLayer = "lessons";
    primaryClassification = "UNKNOWN";
    detail = detail || "One or more lesson visits failed or lacked substantive content.";
  } else if (input.flashcardsStatus !== "passed" && input.loginSucceeded && input.discoverySucceeded) {
    blockingLayer = "flashcards";
    primaryClassification = "UNKNOWN";
    detail = detail || "Flashcards phase did not complete.";
  } else if (input.questionBankStatus !== "passed" && input.loginSucceeded && input.discoverySucceeded) {
    blockingLayer = "question_bank";
    primaryClassification = "UNKNOWN";
    detail = detail || "Question bank phase did not complete.";
  } else if (input.catStatus !== "passed" && input.loginSucceeded && input.discoverySucceeded) {
    blockingLayer = "cat";
    primaryClassification = "UNKNOWN";
    detail = detail || "CAT phase did not complete.";
  }

  if (!operatorHint && input.phase0OperatorHint) {
    operatorHint = input.phase0OperatorHint;
  }

  return {
    artifactKind: "rn_full_content_blocking_report_v1",
    primaryClassification,
    operatorHint: operatorHint || (primaryClassification !== "UNKNOWN" ? detail.slice(0, 500) : ""),
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
