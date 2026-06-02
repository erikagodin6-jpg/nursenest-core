import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");
const accountDir = join(appRoot, "app", "(app)", "app", "(learner)", "account");

const pages = [
  "page.tsx",
  "billing/page.tsx",
  "settings/page.tsx",
  "report/page.tsx",
  "activity/page.tsx",
  "support/page.tsx",
];

test("Account Center route modules exist", () => {
  for (const rel of pages) {
    assert.ok(existsSync(join(accountDir, rel)), `missing ${rel}`);
  }
});

test("account index wires Account Center overview", () => {
  const src = readFileSync(join(accountDir, "page.tsx"), "utf8");
  assert.match(src, /LearnerAccountCenterOverview/);
});

test("legacy report-card route redirects to /app/account/report", () => {
  const src = readFileSync(join(accountDir, "report-card", "page.tsx"), "utf8");
  assert.match(src, /permanentRedirect\("\/app\/account\/report"\)/);
});

test("account center pages avoid raw Prisma enum leakage in markup strings", () => {
  const scan = ["activity/page.tsx", "support/page.tsx", "settings/page.tsx", "page.tsx"];
  for (const rel of scan) {
    const src = readFileSync(join(accountDir, rel), "utf8");
    assert.equal(src.includes("SubscriptionStatus."), false, `${rel} should not embed SubscriptionStatus literals`);
  }
});
