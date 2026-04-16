import { expect, type Page } from "@playwright/test";
import { getAlliedProfessionByProfessionKey } from "../../../src/lib/allied/allied-professions-registry";
import type { LearnerSessionSnapshot } from "./learner-session";
import type { ResolvedPrenursingAlliedCredentials } from "./pathway-prenursing-allied-credentials";
import type { PrenursingAlliedMatrixRow } from "./pathway-prenursing-allied-matrix";

export type ExamPlanJson = {
  alliedProfessionKey?: string | null;
  tier?: string | null;
};

function originFrom(page: Page, baseURL: string | undefined): string {
  if (baseURL) {
    try {
      return new URL(baseURL).origin;
    } catch {
      /* fall through */
    }
  }
  try {
    return new URL(page.url()).origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

export async function fetchExamPlanJson(page: Page, baseURL: string | undefined): Promise<ExamPlanJson> {
  const origin = originFrom(page, baseURL);
  const res = await page.request.get(`${origin}/api/learner/exam-plan`);
  const text = await res.text();
  expect(res.ok(), `GET /api/learner/exam-plan failed (${res.status()}): ${text.slice(0, 500)}`).toBeTruthy();
  return JSON.parse(text) as ExamPlanJson;
}

/**
 * Allied pathway rows: tier ALLIED, non-null profession key, exam-plan agrees with session, registry knows the key.
 * Proven need: weak-topic filters and nav/exam-plan read `User.alliedProfessionKey`; core lesson/question APIs do not.
 */
export function assertAlliedLearnerProfessionInvariant(args: {
  row: Extract<PrenursingAlliedMatrixRow, { coverage: "learnerAlliedPathway" }>;
  session: LearnerSessionSnapshot | null;
  examPlan: ExamPlanJson;
  creds: ResolvedPrenursingAlliedCredentials;
}): void {
  const { row, session, examPlan, creds } = args;

  const tier = session?.tier ?? null;
  expect(
    tier,
    `Allied row "${row.key}" requires an authenticated session tier (got ${tier ?? "null"}). ` +
      `Credential resolution: ${creds.sourceLabel} (matchedPrefix=${creds.matchedPrefix ?? "none"}).`,
  ).toBeTruthy();

  expect(tier, `Allied row "${row.key}" requires tier ALLIED (got ${tier}). ${formatCredentialHint(creds)}`).toBe(
    "ALLIED",
  );

  const prof = session?.alliedProfessionKey ?? null;
  expect(
    prof,
    `Allied learner coverage requires User.alliedProfessionKey to be set (session had ${prof ?? "null"}). ` +
      `Set it via Exam Plan / profile sync, or seed the QA user. ${formatCredentialHint(creds)} ` +
      `Code: exam-plan API and weak-topic filters use this key; see pathway-prenursing-allied-coverage-manifest.ts.`,
  ).toBeTruthy();

  const ep = examPlan.alliedProfessionKey ?? null;
  expect(
    ep,
    `GET /api/learner/exam-plan returned null alliedProfessionKey; session had "${prof}". ${formatCredentialHint(creds)}`,
  ).toBeTruthy();

  expect(examPlan.alliedProfessionKey, "exam-plan alliedProfessionKey must match session").toBe(prof);

  const reg = getAlliedProfessionByProfessionKey(prof!);
  expect(
    reg,
    `alliedProfessionKey "${prof}" is not in ALLIED_PROFESSIONS (allied-professions-registry.ts).`,
  ).toBeTruthy();

  expect(
    session?.country,
    `Allied ${row.pathwayId} requires session country ${row.requiredSessionCountry}. ${formatCredentialHint(creds)}`,
  ).toBe(row.requiredSessionCountry);
}

export function formatCredentialHint(creds: ResolvedPrenursingAlliedCredentials): string {
  const fb = creds.usedGenericFallback
    ? " Generic fallback was used — prefer an explicit QA_* prefix that matches this row."
    : "";
  return `Credential source: ${creds.sourceLabel} (matchedPrefix=${creds.matchedPrefix ?? "none"}).${fb}`;
}

export function formatTierMismatchFailure(
  creds: ResolvedPrenursingAlliedCredentials,
  expected: string,
  actual: string | null,
): string {
  return (
    `Expected tier ${expected} but got ${actual ?? "null"}. ${formatCredentialHint(creds)} ` +
    (creds.usedGenericFallback
      ? "Rejecting generic QA_PAID: it often maps to RN/NP; use QA_PRENURSING_* or QA_PAID_PRE_NURSING_* for this row."
      : "")
  );
}
