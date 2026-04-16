import type { RnDatabaseHealthSnapshot, RnE2eAccountProbeSnapshot } from "./rn-full-content-database-preflight";
import type { RnPhase0PrimaryClassification } from "./rn-full-content-phase0-classification";

/**
 * Operator-facing primary bucket for Phase 0 — ordered for dashboards.
 * DB_AUTH_FAILURE must never be labeled as QA_PASSWORD_MISMATCH.
 */
export type RnLoginPrimaryClassification =
  | "LOGIN_PAGE_OR_NETWORK_FAILURE"
  | "DATABASE_URL_NOT_CONFIGURED"
  | "DB_AUTH_FAILURE"
  | "DB_UNAVAILABLE"
  | "DB_TIMEOUT"
  | "DB_OTHER"
  | "QA_USER_MISSING"
  | "QA_ACCOUNT_LOCKED"
  | "QA_MISSING_PASSWORD_HASH"
  | "QA_PASSWORD_MISMATCH"
  | "AUTH_CREDENTIALS_POST_TIMEOUT"
  | "AUTH_CALLBACK_NON_JSON"
  | "CREDENTIALS_SIGNIN_REJECTED_UNKNOWN"
  | "LEARNER_SHELL_TRANSITION_FAILURE";

export type RnLoginFailureArtifacts = {
  primaryClassification: RnLoginPrimaryClassification;
  /** Single-line summary for humans (no secrets). */
  operatorSummary: string;
  /** Secondary hints — first is most specific. */
  secondaryHints: string[];
  databaseHealthBefore: RnDatabaseHealthSnapshot | null;
  databaseHealthAfter: RnDatabaseHealthSnapshot | null;
  accountProbe: RnE2eAccountProbeSnapshot | null;
};

/** Maps layered login classifier output to stable suite / blocking-report labels. */
export function mapRnLoginPrimaryToPhase0(p: RnLoginPrimaryClassification): RnPhase0PrimaryClassification {
  switch (p) {
    case "DB_AUTH_FAILURE":
      return "DB_AUTH_FAILURE";
    case "DATABASE_URL_NOT_CONFIGURED":
      return "DATABASE_URL_NOT_SET";
    case "DB_UNAVAILABLE":
    case "DB_TIMEOUT":
    case "DB_OTHER":
      return "DB_UNAVAILABLE";
    case "QA_USER_MISSING":
      return "QA_USER_MISSING";
    case "QA_ACCOUNT_LOCKED":
      return "ACCOUNT_LOCKED";
    case "QA_MISSING_PASSWORD_HASH":
      return "USER_ACCOUNT_MISSING_PASSWORD";
    case "QA_PASSWORD_MISMATCH":
      return "QA_PASSWORD_REJECTED";
    case "AUTH_CREDENTIALS_POST_TIMEOUT":
      return "CREDENTIALS_CALLBACK_TIMEOUT_OR_MISSING";
    case "AUTH_CALLBACK_NON_JSON":
      return "AUTH_CALLBACK_REJECTED";
    case "LEARNER_SHELL_TRANSITION_FAILURE":
      return "LEARNER_SHELL_TRANSITION_FAILED";
    case "LOGIN_PAGE_OR_NETWORK_FAILURE":
      return "LOGIN_PAGE_OR_FORM_LOAD_FAILED";
    case "CREDENTIALS_SIGNIN_REJECTED_UNKNOWN":
      return "AUTH_CALLBACK_REJECTED";
    default:
      return "UNKNOWN_LOGIN_FAILURE";
  }
}

function mapDbClassificationToPrimary(c: string | null | undefined): RnLoginPrimaryClassification | null {
  if (!c || c === "OK") return null;
  if (c === "DATABASE_URL_NOT_CONFIGURED") return "DATABASE_URL_NOT_CONFIGURED";
  if (c === "DB_AUTH_FAILURE") return "DB_AUTH_FAILURE";
  if (c === "DB_TIMEOUT") return "DB_TIMEOUT";
  if (c === "DB_UNREACHABLE") return "DB_UNAVAILABLE";
  return "DB_OTHER";
}

/**
 * Classify Phase 0 login failure using DB health + optional account probe + error text.
 * Prefers database signals over Auth.js `CredentialsSignin` (which is ambiguous).
 */
export function buildRnLoginFailureArtifacts(input: {
  errorMessage: string;
  databaseHealthBefore: RnDatabaseHealthSnapshot | null;
  databaseHealthAfter: RnDatabaseHealthSnapshot | null;
  accountProbe: RnE2eAccountProbeSnapshot | null;
}): RnLoginFailureArtifacts {
  const secondaryHints: string[] = [];
  const { errorMessage } = input;
  const dbBefore = input.databaseHealthBefore;
  const dbAfter = input.databaseHealthAfter;
  const probe = input.accountProbe;

  const beforePrimary = mapDbClassificationToPrimary(dbBefore?.classification ?? null);
  const afterPrimary = mapDbClassificationToPrimary(dbAfter?.classification ?? null);

  if (beforePrimary === "DB_AUTH_FAILURE" || afterPrimary === "DB_AUTH_FAILURE") {
    return {
      primaryClassification: "DB_AUTH_FAILURE",
      operatorSummary:
        "Postgres rejected DATABASE_URL credentials (DB_AUTH_FAILURE). Fix DATABASE_URL / DB user password for the app — this is not a wrong QA_PAID_PASSWORD.",
      secondaryHints: [
        "Confirm `npm run dev` uses the same DATABASE_URL you expect (see .env.playwright.local / shell).",
        "If `GET /api/health/ready` returns classification=DB_AUTH_FAILURE, auth cannot query User — login will always fail.",
      ],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (beforePrimary === "DATABASE_URL_NOT_CONFIGURED" || afterPrimary === "DATABASE_URL_NOT_CONFIGURED") {
    return {
      primaryClassification: "DATABASE_URL_NOT_CONFIGURED",
      operatorSummary: "DATABASE_URL is not configured — the app cannot reach Postgres for login.",
      secondaryHints: ["Set DATABASE_URL for the dev server started by Playwright."],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (beforePrimary === "DB_TIMEOUT" || afterPrimary === "DB_TIMEOUT") {
    return {
      primaryClassification: "DB_TIMEOUT",
      operatorSummary: "Database readiness probe timed out — check DB load, network, or HEALTH_READY_DB_TIMEOUT_MS.",
      secondaryHints: [],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (beforePrimary === "DB_UNAVAILABLE" || afterPrimary === "DB_UNAVAILABLE") {
    return {
      primaryClassification: "DB_UNAVAILABLE",
      operatorSummary: "Database host/port unreachable (connection refused / DNS) — not an application password issue.",
      secondaryHints: [],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (beforePrimary === "DB_OTHER" || afterPrimary === "DB_OTHER") {
    return {
      primaryClassification: "DB_OTHER",
      operatorSummary: "Database probe failed with an unexpected error class — see /api/health/ready httpStatus and logs.",
      secondaryHints: [],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (/No POST response from \/api\/auth\/callback\/credentials/i.test(errorMessage)) {
    return {
      primaryClassification: "AUTH_CREDENTIALS_POST_TIMEOUT",
      operatorSummary:
        "No HTTP response from Auth.js credentials callback within 45s — check dev server, middleware, or Auth route health (not necessarily wrong QA password).",
      secondaryHints: ["Inspect network tab for /api/auth/callback/credentials."],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (/non-JSON/i.test(errorMessage) && /Credentials POST/i.test(errorMessage)) {
    return {
      primaryClassification: "AUTH_CALLBACK_NON_JSON",
      operatorSummary: "Credentials callback returned non-JSON — Auth route or proxy may be misconfigured.",
      secondaryHints: [],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (/Not on learner shell/i.test(errorMessage) || (/waitForFunction/i.test(errorMessage) && /\/app\//i.test(errorMessage))) {
    return {
      primaryClassification: "LEARNER_SHELL_TRANSITION_FAILURE",
      operatorSummary:
        "Auth callback may have succeeded but the browser did not reach a learner shell route in time — separate from DB URL vs QA password.",
      secondaryHints: [],
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  if (probe?.probeEnabledOnServer) {
    if (probe.databaseClassification && probe.databaseClassification !== "OK") {
      const p = mapDbClassificationToPrimary(probe.databaseClassification);
      if (p === "DB_AUTH_FAILURE") {
        return {
          primaryClassification: "DB_AUTH_FAILURE",
          operatorSummary:
            "Account probe could not query Postgres (DB_AUTH_FAILURE). Fix DATABASE_URL — not QA_PAID_PASSWORD.",
          secondaryHints: [],
          databaseHealthBefore: dbBefore,
          databaseHealthAfter: dbAfter,
          accountProbe: probe,
        };
      }
    }
    if (probe.userPresent === false) {
      return {
        primaryClassification: "QA_USER_MISSING",
        operatorSummary: "No User row matches QA email — seed or import the paid QA account in this DATABASE_URL.",
        secondaryHints: ["Verify QA_PAID_EMAIL matches an existing user row."],
        databaseHealthBefore: dbBefore,
        databaseHealthAfter: dbAfter,
        accountProbe: probe,
      };
    }
    if (probe.userPresent === true && probe.accountLockedOut === true) {
      return {
        primaryClassification: "QA_ACCOUNT_LOCKED",
        operatorSummary: "Login lockout is active for this identifier — wait for lock expiry or clear lockout (dev).",
        secondaryHints: [],
        databaseHealthBefore: dbBefore,
        databaseHealthAfter: dbAfter,
        accountProbe: probe,
      };
    }
    if (probe.userPresent === true && probe.hasPasswordHash === false) {
      return {
        primaryClassification: "QA_MISSING_PASSWORD_HASH",
        operatorSummary: "User exists but has no password hash — credentials login cannot succeed.",
        secondaryHints: [],
        databaseHealthBefore: dbBefore,
        databaseHealthAfter: dbAfter,
        accountProbe: probe,
      };
    }
    if (probe.activePaidSubscription === false && probe.userPresent === true) {
      secondaryHints.push(
        "Probe: no ACTIVE/GRACE subscription row — if login succeeds later, expect paywall/entitlement failures (not a Phase 0 DB auth issue).",
      );
    }
    if (probe.userPresent === true && probe.hasPasswordHash === true && /Credentials sign-in rejected/i.test(errorMessage)) {
      return {
        primaryClassification: "QA_PASSWORD_MISMATCH",
        operatorSummary:
          "Database is reachable and QA user exists with a password hash — CredentialsSignin most likely means wrong QA_PAID_PASSWORD (or rare bcrypt/system errors).",
        secondaryHints: ["Rotate QA_PAID_PASSWORD to match the User row if unsure."],
        databaseHealthBefore: dbBefore,
        databaseHealthAfter: dbAfter,
        accountProbe: probe,
      };
    }
  } else if (!probe?.probeEnabledOnServer) {
    secondaryHints.push(
      "E2E account probe disabled (set NN_E2E_ACCOUNT_PROBE=1 on the dev server — playwright.rn-full-content enables this). Without it, DB vs QA password cannot be split automatically.",
    );
  }

  if (/Credentials sign-in rejected/i.test(errorMessage)) {
    if (dbBefore?.classification === "OK" && dbAfter?.classification === "OK") {
      return {
        primaryClassification: "CREDENTIALS_SIGNIN_REJECTED_UNKNOWN",
        operatorSummary:
          "Auth.js returned CredentialsSignin while DB readiness was OK — enable NN_E2E_ACCOUNT_PROBE to distinguish missing user vs password mismatch.",
        secondaryHints,
        databaseHealthBefore: dbBefore,
        databaseHealthAfter: dbAfter,
        accountProbe: probe,
      };
    }
  }

  if (!dbBefore?.reachable || /\/login/i.test(errorMessage) && /Unable to sign in/i.test(errorMessage)) {
    return {
      primaryClassification: "LOGIN_PAGE_OR_NETWORK_FAILURE",
      operatorSummary: "Login page or client-side auth error — see screenshot and console in artifacts.",
      secondaryHints,
      databaseHealthBefore: dbBefore,
      databaseHealthAfter: dbAfter,
      accountProbe: probe,
    };
  }

  return {
    primaryClassification: "CREDENTIALS_SIGNIN_REJECTED_UNKNOWN",
    operatorSummary: errorMessage.slice(0, 300),
    secondaryHints,
    databaseHealthBefore: dbBefore,
    databaseHealthAfter: dbAfter,
    accountProbe: probe,
  };
}
