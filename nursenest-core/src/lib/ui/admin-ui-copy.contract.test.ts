import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatDisplayLabel,
  formatHealthStatusLabel,
  humanizeAdminOperationalMessage,
  looksLikeRawI18nKey,
} from "./format-display-label";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, "..", "..");

test("admin diagnostics copy helpers format enums and pipeline errors", () => {
  assert.equal(formatDisplayLabel("QUESTION_BANK"), "Question Bank");
  assert.equal(formatDisplayLabel("critical"), "Critical");
  assert.match(humanizeAdminOperationalMessage("topic_intent_rejected: too vague"), /Topic needs clinical specificity/i);
});

test("homepage marketing sources avoid rendering dotted keys as JSX text", () => {
  const homeClient = readFileSync(join(srcRoot, "components", "marketing", "home-restored-client.tsx"), "utf8");
  const dottedJsxText = />\s*(?:pages|footer|blog|admin|content|learner|app)\.[a-z0-9_.]+\s*</i;
  assert.doesNotMatch(homeClient, dottedJsxText, "home hero should not embed raw dotted i18n keys as JSX text");
});

test("admin dashboard shell avoids raw dotted keys in primary headings", () => {
  const adminPage = readFileSync(join(srcRoot, "app", "(admin)", "admin", "page.tsx"), "utf8");
  assert.doesNotMatch(adminPage, />\s*(?:admin|pages)\.[a-z0-9_.]+\s*</i);
});

test("admin diagnostics page formats infrastructure labels for humans", () => {
  const diagnosticsPage = readFileSync(join(srcRoot, "app", "(admin)", "admin", "diagnostics", "page.tsx"), "utf8");
  assert.match(diagnosticsPage, /formatHealthStatusLabel/);
  assert.match(diagnosticsPage, /configured \? "Yes"/);
});

test("formatHealthStatusLabel matches diagnostics probe vocabulary", () => {
  assert.equal(formatHealthStatusLabel("ok"), "OK");
});

test("looksLikeRawI18nKey guards known prefixes", () => {
  assert.equal(looksLikeRawI18nKey("pages.home.title"), true);
  assert.equal(looksLikeRawI18nKey("Blog console"), false);
});
