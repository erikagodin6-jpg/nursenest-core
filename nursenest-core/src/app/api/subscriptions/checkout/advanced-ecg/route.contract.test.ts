import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("Advanced ECG checkout route uses one-time payment mode without duration-based subscription metadata", () => {
  const route = readFileSync(
    path.join(process.cwd(), "src/app/api/subscriptions/checkout/advanced-ecg/route.ts"),
    "utf8",
  );

  assert.match(route, /mode:\s*"payment"/);
  assert.doesNotMatch(route, /subscription_data\s*:/);
  assert.doesNotMatch(route, /duration:\s*z\.enum/);
});
