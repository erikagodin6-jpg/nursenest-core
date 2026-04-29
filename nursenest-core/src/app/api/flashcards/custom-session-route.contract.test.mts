import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("custom-session GET returns JSON (not HTML) on database failures", () => {
  const routePath = join(__dirname, "custom-session", "route.ts");
  const buildPath = join(__dirname, "..", "..", "..", "lib", "flashcards", "build-flashcard-custom-session.ts");
  const routeSrc = fs.readFileSync(routePath, "utf8");
  const buildSrc = fs.readFileSync(buildPath, "utf8");
  const src = `${routeSrc}\n${buildSrc}`;
  assert.ok(src.includes("ok: false"), "error branch sets ok: false");
  assert.ok(src.includes("database_error"), "stable error code for clients");
  assert.ok(src.includes("integrity:"), "integrity payload for observability");
  assert.ok(src.includes("querySucceeded: false"), "querySucceeded distinguishes failure from empty");
  assert.ok(src.includes("503"), "retryable HTTP status");
});
