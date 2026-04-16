/**
 * Cross-test ledger for `pathway-prenursing-allied-access.spec.ts` (single worker).
 * Separates "environment handling works" from "full suite passed end-to-end".
 */
import type { PrenursingAlliedEnvironmentCheck } from "./prenursing-allied-environment";

export type RowKey =
  | "manifest-doc"
  | "pre-nursing"
  | "allied-us"
  | "allied-ca"
  | "marketing-hubs"
  | "summary";

export type RowOutcome = "passed" | "failed" | "skipped" | "not_run";

/** Required pathway coverage rows (manifest-doc is documentation-only and does not gate suiteExecutionStatus). */
export const REQUIRED_PATHWAY_ROW_KEYS: readonly RowKey[] = [
  "pre-nursing",
  "allied-us",
  "allied-ca",
  "marketing-hubs",
] as const;

export type PrenursingAlliedSuiteResultArtifact = {
  schemaVersion: 1;
  /** Preflight + attachments + failure classification behave as designed (operator-actionable). */
  environmentHandlingStatus: "STABLE" | "NOT_STABLE";
  /** Full learner pathway tests passed with login + assertions (not skipped, not failed). */
  suiteExecutionStatus: "STABLE" | "NOT_STABLE";
  /** STABLE only when environment preflight passed, login succeeded, and all required pathway rows passed. */
  finalVerdict: "STABLE" | "NOT_STABLE";
  failureReason: string | null;

  baseUrl: string | null;
  loginReachable: boolean | null;
  credentialsResolved: boolean | null;
  loginSucceeded: boolean | null;

  rowsExecuted: RowKey[];
  rowsPassed: RowKey[];
  rowsFailed: RowKey[];
  rowsSkipped: RowKey[];

  rowOutcomes: Record<string, RowOutcome>;
  lastEnvironmentCheck: PrenursingAlliedEnvironmentCheck | null;
  /** True once any non-summary test completed login successfully. */
  anyLoginSucceeded: boolean;
  /** Threw before environment JSON could be attached (implementation bug or hard crash). */
  preflightAttachmentHardFailures: number;
  /** Per required row — whether QA email/password resolved (mirrors `credentialsResolved` aggregate). */
  rowCredentialsResolved: Partial<Record<RowKey, boolean>>;

  notes: string[];
};

const rowStatus = new Map<RowKey, RowOutcome>();
/** Per required row: whether QA credentials resolved (false = missing pair for that row). */
const rowCredentialsResolved = new Map<RowKey, boolean>();
let lastEnvCheck: PrenursingAlliedEnvironmentCheck | null = null;
let anyLoginSucceeded = false;
let loginAttempted = false;
let preflightAttachmentHardFailures = 0;
let lastBaseUrl: string | null = null;
let lastLoginReachable: boolean | null = null;

export function resetSuiteLedgerForTestFile(): void {
  for (const k of [
    "manifest-doc",
    "pre-nursing",
    "allied-us",
    "allied-ca",
    "marketing-hubs",
    "summary",
  ] as RowKey[]) {
    rowStatus.set(k, "not_run");
  }
  rowCredentialsResolved.clear();
  lastEnvCheck = null;
  anyLoginSucceeded = false;
  loginAttempted = false;
  preflightAttachmentHardFailures = 0;
  lastBaseUrl = null;
  lastLoginReachable = null;
}

resetSuiteLedgerForTestFile();

export function recordLastEnvironmentCheck(check: PrenursingAlliedEnvironmentCheck): void {
  lastEnvCheck = check;
  lastBaseUrl = check.baseUrl;
  lastLoginReachable = check.loginReachable;
}

export function recordPreflightAttachmentHardFailure(): void {
  preflightAttachmentHardFailures += 1;
}

/** Call once per pathway row after `resolvePrenursingAlliedCredentials` (before `test.skip`). */
export function recordRowCredentialsResolved(rowKey: RowKey, resolved: boolean): void {
  rowCredentialsResolved.set(rowKey, resolved);
}

export function recordLoginAttempted(): void {
  loginAttempted = true;
}

export function recordLoginSucceeded(): void {
  anyLoginSucceeded = true;
}

export function recordRowOutcome(key: RowKey, outcome: RowOutcome): void {
  rowStatus.set(key, outcome);
}

function rowKeys(): RowKey[] {
  return [
    "manifest-doc",
    "pre-nursing",
    "allied-us",
    "allied-ca",
    "marketing-hubs",
    "summary",
  ];
}

function buildNotes(args: {
  envStable: boolean;
  suiteStable: boolean;
  requiredPassed: boolean;
  anyRequiredSkipped: boolean;
  anyRequiredFailed: boolean;
}): string[] {
  const n: string[] = [];
  if (!args.envStable) {
    n.push(
      "environmentHandlingStatus is NOT_STABLE: a preflight attachment or classification path failed (see preflightAttachmentHardFailures).",
    );
  }
  if (!args.suiteStable) {
    if (args.anyRequiredSkipped) {
      n.push(
        "suiteExecutionStatus is NOT_STABLE: a required row was skipped (usually missing QA_* credentials or test.skip).",
      );
    } else if (args.anyRequiredFailed) {
      n.push(
        "suiteExecutionStatus is NOT_STABLE: a required row failed (assertion, auth after reachable /login, or pathway surface).",
      );
    } else {
      n.push("suiteExecutionStatus is NOT_STABLE: required rows did not all pass.");
    }
  }
  if (args.envStable && args.suiteStable) {
    n.push("Both environment handling and full suite execution succeeded for required rows.");
  }
  if (!args.envStable || !args.suiteStable) {
    n.push(
      "finalVerdict NOT_STABLE does not mean environment preflight regressed — read environmentHandlingStatus vs suiteExecutionStatus separately.",
    );
  }
  return n;
}

export function buildPrenursingAlliedSuiteResultArtifact(): PrenursingAlliedSuiteResultArtifact {
  const outcomes: Record<string, RowOutcome> = {};
  for (const k of rowKeys()) {
    outcomes[k] = rowStatus.get(k) ?? "not_run";
  }

  const executed = rowKeys().filter((k) => outcomes[k] !== "not_run");
  const passed = rowKeys().filter((k) => outcomes[k] === "passed");
  const failed = rowKeys().filter((k) => outcomes[k] === "failed");
  const skipped = rowKeys().filter((k) => outcomes[k] === "skipped");

  const requiredPassed = REQUIRED_PATHWAY_ROW_KEYS.every((k) => outcomes[k] === "passed");
  const anyRequiredSkipped = REQUIRED_PATHWAY_ROW_KEYS.some((k) => outcomes[k] === "skipped");
  const anyRequiredFailed = REQUIRED_PATHWAY_ROW_KEYS.some((k) => outcomes[k] === "failed");

  const requiredCredVals = REQUIRED_PATHWAY_ROW_KEYS.map((k) => rowCredentialsResolved.get(k));
  const credentialsResolvedComputed: boolean | null = requiredCredVals.every((v) => v === true)
    ? true
    : requiredCredVals.some((v) => v === false)
      ? false
      : null;

  const rowCredentialsResolvedOut: Partial<Record<RowKey, boolean>> = {};
  for (const k of REQUIRED_PATHWAY_ROW_KEYS) {
    const v = rowCredentialsResolved.get(k);
    if (v !== undefined) rowCredentialsResolvedOut[k] = v;
  }

  const envStable = preflightAttachmentHardFailures === 0;

  /** Full learner flow against reachable /login + valid QA pairs for every required row. */
  const suiteExecStable =
    requiredPassed &&
    !anyRequiredSkipped &&
    !anyRequiredFailed &&
    anyLoginSucceeded &&
    credentialsResolvedComputed === true;

  let failureReason: string | null = null;
  if (!envStable) {
    failureReason =
      "Environment ledger recorded preflight attachment/ classification hard failures (see preflightAttachmentHardFailures).";
  } else if (!suiteExecStable) {
    if (credentialsResolvedComputed === false) {
      failureReason =
        "QA credentials were missing for one or more required rows (see rowCredentialsResolved map / per-test skip reasons). suiteExecutionStatus NOT_STABLE.";
    } else if (!anyLoginSucceeded) {
      failureReason =
        "Login did not succeed for the suite (see login step attachments and [prenursing-allied:phase] errors). suiteExecutionStatus NOT_STABLE.";
    } else if (anyRequiredSkipped) {
      failureReason =
        "Required suite rows were skipped — configure QA credentials or satisfy test.skip conditions. suiteExecutionStatus NOT_STABLE.";
    } else if (anyRequiredFailed) {
      failureReason =
        "One or more required pathway rows failed after a reachable /login (see rowsFailed and per-test attachments). suiteExecutionStatus NOT_STABLE.";
    } else {
      failureReason = "Required pathway rows did not all pass. suiteExecutionStatus NOT_STABLE.";
    }
  }

  const environmentHandlingStatus: "STABLE" | "NOT_STABLE" = envStable ? "STABLE" : "NOT_STABLE";
  const suiteExecutionStatus: "STABLE" | "NOT_STABLE" = suiteExecStable ? "STABLE" : "NOT_STABLE";

  /** STABLE only when both dimensions pass (per product request: never overstate full-suite green). */
  const finalVerdict: "STABLE" | "NOT_STABLE" =
    environmentHandlingStatus === "STABLE" && suiteExecutionStatus === "STABLE" ? "STABLE" : "NOT_STABLE";

  let failureReasonFinal = failureReason;
  if (finalVerdict === "NOT_STABLE" && !failureReasonFinal) {
    failureReasonFinal =
      "finalVerdict NOT_STABLE: see environmentHandlingStatus, suiteExecutionStatus, rowsFailed, rowsSkipped, and notes.";
  }

  return {
    schemaVersion: 1,
    environmentHandlingStatus,
    suiteExecutionStatus,
    finalVerdict,
    failureReason: finalVerdict === "STABLE" ? null : failureReasonFinal,

    baseUrl: lastBaseUrl,
    loginReachable: lastLoginReachable,
    credentialsResolved: credentialsResolvedComputed,
    loginSucceeded: suiteExecStable ? true : loginAttempted ? anyLoginSucceeded : null,

    rowsExecuted: executed as RowKey[],
    rowsPassed: passed as RowKey[],
    rowsFailed: failed as RowKey[],
    rowsSkipped: skipped as RowKey[],

    rowOutcomes: outcomes,
    lastEnvironmentCheck: lastEnvCheck,
    anyLoginSucceeded,
    preflightAttachmentHardFailures,
    rowCredentialsResolved: rowCredentialsResolvedOut,

    notes: buildNotes({
      envStable,
      suiteStable: suiteExecStable,
      requiredPassed,
      anyRequiredSkipped,
      anyRequiredFailed,
    }),
  };
}
