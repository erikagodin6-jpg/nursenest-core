import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { CountryCode } from "@prisma/client";
import {
  resolveDefaultPathwayIdForSignup,
  resolveSignupPathwayAssignment,
} from "@/lib/onboarding/resolve-default-pathway-for-onboarding";

const ROOT = process.cwd();
const SIGNUP_ROUTE_PATH = path.resolve(ROOT, "src/app/api/signup/route.ts");

describe("resolveDefaultPathwayIdForSignup", () => {
  it("maps Canada RPN signup to the canonical REx-PN pathway", () => {
    assert.equal(
      resolveDefaultPathwayIdForSignup({
        examFocus: "rex_pn",
        tier: "RPN",
        country: CountryCode.CA,
      }),
      "ca-rpn-rex-pn",
    );
  });

  it("maps US LVN/LPN signup to the canonical NCLEX-PN pathway", () => {
    assert.equal(
      resolveDefaultPathwayIdForSignup({
        examFocus: "nclex_pn",
        tier: "LVN_LPN",
        country: CountryCode.US,
      }),
      "us-lpn-nclex-pn",
    );
  });

  it("preserves explicit US NP specialty pathways from signup focus", () => {
    assert.equal(
      resolveDefaultPathwayIdForSignup({
        examFocus: "np_agpcnp",
        tier: "NP",
        country: CountryCode.US,
      }),
      "us-np-agpcnp",
    );
  });
});

describe("resolveSignupPathwayAssignment", () => {
  it("assigns canonical pathway ids and completes onboarding when signup collected the onboarding fields", () => {
    const assignment = resolveSignupPathwayAssignment({
      examFocus: "rex_pn",
      tier: "RPN",
      country: CountryCode.CA,
      studyGoal: "pass_first",
      dailyStudyMinutes: 30,
    });

    assert.equal(assignment.learnerPath, "ca-rpn-rex-pn");
    assert.equal(assignment.targetExamPathwayId, "ca-rpn-rex-pn");
    assert.ok(assignment.onboardingCompletedAt instanceof Date);
    assert.ok(assignment.examGoalSetAt instanceof Date);
  });

  it("never drops back to experience labels and keeps onboarding incomplete when signup fields are partial", () => {
    const assignment = resolveSignupPathwayAssignment({
      examFocus: "rex_pn",
      tier: "RPN",
      country: CountryCode.CA,
      studyGoal: null,
      dailyStudyMinutes: 30,
    });

    assert.equal(assignment.learnerPath, "ca-rpn-rex-pn");
    assert.equal(assignment.targetExamPathwayId, "ca-rpn-rex-pn");
    assert.notEqual(assignment.learnerPath, "experienced");
    assert.equal(assignment.onboardingCompletedAt, null);
    assert.equal(assignment.examGoalSetAt, null);
  });
});

describe("signup route contract", () => {
  const signupRoute = fs.readFileSync(SIGNUP_ROUTE_PATH, "utf8");

  it("writes resolved canonical pathway state instead of persisting the raw signup learnerPath field", () => {
    assert.match(signupRoute, /resolveSignupPathwayAssignment/);
    assert.match(signupRoute, /learnerPath:\s*signupAssignment\.learnerPath/);
    assert.match(signupRoute, /targetExamPathwayId:\s*signupAssignment\.targetExamPathwayId/);
    assert.doesNotMatch(signupRoute, /learnerPath:\s*learnerPath\s*\?\?\s*null/);
  });
});
