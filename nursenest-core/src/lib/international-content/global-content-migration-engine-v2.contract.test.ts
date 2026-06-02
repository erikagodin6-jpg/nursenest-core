import assert from "node:assert/strict";
import test from "node:test";

import {
  buildGlobalContentMigrationV2Dashboard,
  evaluateGlobalContentMigrationV2Request,
  validateGlobalContentMigrationV2Dashboard,
} from "./global-content-migration-engine-v2";

test("Global Content Migration V2 requires inheritance when more than 80% is shared", () => {
  const decision = evaluateGlobalContentMigrationV2Request({
    contentId: "heart-failure-rn-us",
    topic: "Heart Failure",
    assetKind: "question",
    role: "RN",
    country: "United States",
    exam: "NCLEX-RN",
    language: "en",
    sharedContentPercent: 88,
    globalCoreExists: true,
    roleSupplementExists: true,
    countrySupplementExists: true,
    examSupplementExists: true,
    languageSupplementExists: true,
  });

  assert.equal(decision.status, "INHERITANCE_REQUIRED");
  assert.equal(decision.duplicationAllowed, false);
});

test("Global Content Migration V2 blocks new international pathways without required supplements", () => {
  const decision = evaluateGlobalContentMigrationV2Request({
    contentId: "uk-heart-failure",
    topic: "Heart Failure",
    assetKind: "lesson",
    role: "RN",
    country: "United Kingdom",
    exam: "NMC CBT",
    language: "en",
    sharedContentPercent: 92,
    globalCoreExists: true,
    roleSupplementExists: false,
    countrySupplementExists: false,
    examSupplementExists: false,
    languageSupplementExists: true,
  });

  assert.equal(decision.status, "MIGRATION_BLOCKED");
  assert.equal(decision.reason, "role_supplement_missing");
  assert.ok(decision.requiredLayers.includes("Role Supplement"));
});

test("Global Content Migration V2 protects PN and RN scope from NP content", () => {
  const decision = evaluateGlobalContentMigrationV2Request({
    contentId: "pn-advanced-prescribing",
    topic: "Heart Failure NP prescribing and advanced diagnostics",
    assetKind: "flashcard",
    role: "PN",
    country: "Canada",
    exam: "REx-PN",
    language: "en",
    sharedContentPercent: 50,
    globalCoreExists: true,
    roleSupplementExists: true,
    countrySupplementExists: true,
    examSupplementExists: true,
    languageSupplementExists: true,
  });

  assert.equal(decision.status, "MIGRATION_BLOCKED");
  assert.equal(decision.reason, "role_scope_violation");
});

test("Global Content Migration V2 dashboard audits recovered assets and validates governance", () => {
  const dashboard = buildGlobalContentMigrationV2Dashboard();

  assert.ok(dashboard.totalAudited > 0);
  assert.equal(dashboard.duplicationThresholdPercent, 80);
  assert.deepEqual(dashboard.canonicalArchitecture, [
    "Global Core",
    "Role Supplement",
    "Country Supplement",
    "Exam Supplement",
    "Language Supplement",
  ]);
  assert.equal(validateGlobalContentMigrationV2Dashboard(dashboard).length, 0);
});
