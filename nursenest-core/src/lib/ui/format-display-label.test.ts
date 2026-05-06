import assert from "node:assert/strict";
import test from "node:test";
import {
  formatDisplayLabel,
  formatHealthStatusLabel,
  formatPrismaEnumLabel,
  humanizeAdminOperationalMessage,
  looksLikeRawI18nKey,
} from "./format-display-label";

test("formatDisplayLabel formats screaming snake and snake_case", () => {
  assert.equal(formatDisplayLabel("BLOG_CONTROL_PANEL_PIPELINE"), "Blog Control Panel Pipeline");
  assert.equal(formatDisplayLabel("topic_intent_rejected"), "Topic Intent Rejected");
  assert.equal(formatDisplayLabel("NO_PUBLISHED_EXAM_QUESTIONS_IN_DB"), "No Published Exam Questions Found");
  assert.equal(formatDisplayLabel("patient_safety_quality"), "Patient Safety & Quality");
});

test("formatDisplayLabel handles colon-separated status text", () => {
  assert.equal(formatDisplayLabel("safe mode: off"), "Safe Mode: Off");
});

test("formatPrismaEnumLabel title-cases prisma enum strings", () => {
  assert.equal(formatPrismaEnumLabel("SUCCEEDED"), "Succeeded");
  assert.equal(formatPrismaEnumLabel("FAILED"), "Failed");
  assert.equal(formatPrismaEnumLabel("LVN_LPN"), "LPN/LVN");
});

test("formatHealthStatusLabel normalizes probe vocabulary", () => {
  assert.equal(formatHealthStatusLabel("ok"), "OK");
  assert.equal(formatHealthStatusLabel("fail"), "Failed");
  assert.equal(formatHealthStatusLabel("yes"), "Yes");
  assert.equal(formatHealthStatusLabel("degraded"), "Degraded");
});

test("humanizeAdminOperationalMessage maps known pipeline errors", () => {
  assert.match(humanizeAdminOperationalMessage("topic_intent_rejected: too broad"), /Topic needs clinical specificity/i);
  assert.equal(
    humanizeAdminOperationalMessage("Editorial plan JSON failed schema validation"),
    "Blog plan format could not be read",
  );
  assert.equal(
    humanizeAdminOperationalMessage("NO_PUBLISHED_EXAM_QUESTIONS_IN_DB"),
    "No Published Exam Questions Found",
  );
});

test("looksLikeRawI18nKey detects dotted keys", () => {
  assert.equal(looksLikeRawI18nKey("admin.dashboard.title"), true);
  assert.equal(looksLikeRawI18nKey("content.coverage.emptyState"), true);
  assert.equal(looksLikeRawI18nKey("NurseNest"), false);
});
