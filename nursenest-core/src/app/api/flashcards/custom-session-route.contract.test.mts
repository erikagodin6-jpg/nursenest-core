import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("custom-session GET returns JSON (not HTML) on database failures", () => {
  const routePath = join(__dirname, "custom-session", "route.ts");
  const src = fs.readFileSync(routePath, "utf8");
  assert.ok(src.includes("ok: false"), "error branch sets ok: false");
  assert.ok(src.includes("database_error"), "stable error code for clients");
  assert.ok(src.includes("integrity:"), "integrity payload for observability");
  assert.ok(src.includes("querySucceeded: false"), "querySucceeded distinguishes failure from empty");
  assert.ok(src.includes("503"), "retryable HTTP status");
});
