import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";

const repoRoot = process.cwd();
const routePath = resolve(repoRoot, "src/app/api/admin/content-audit/high-end-completeness/route.ts");
const auditPath = resolve(repoRoot, "src/lib/content-audit/high-end-completeness-audit.ts");

test("high-end completeness admin API is forced to runtime execution", () => {
  const route = readFileSync(routePath, "utf8");

  assert.match(route, /export const dynamic = ["']force-dynamic["']/);
  assert.match(route, /export const revalidate = 0/);
  assert.match(route, /export const runtime = ["']nodejs["']/);
  assert.match(route, /requireAdmin/);
  assert.match(route, /buildHighEndCompletenessAudit/);
});

test("high-end completeness audit remains classified as runtime-only", () => {
  const audit = readFileSync(auditPath, "utf8");

  assert.match(audit, /from ["']node:fs["']/);
  assert.match(audit, /from ["']@\/lib\/db["']/);
  assert.match(audit, /prisma\./);
});
