import assert from "node:assert/strict";
import test from "node:test";
import { safeAwait } from "@/lib/async/safe-await";

test("safeAwait returns resolved value before timeout", async () => {
  const value = await safeAwait(Promise.resolve("ok"), "safe_await.resolve", 50);
  assert.equal(value, "ok");
});

test("safeAwait returns null after timeout", async () => {
  const startedAt = Date.now();
  const value = await safeAwait(new Promise<string>(() => {}), "safe_await.timeout", 50);
  const elapsedMs = Date.now() - startedAt;

  assert.equal(value, null);
  assert.ok(elapsedMs >= 40);
  assert.ok(elapsedMs < 500);
});
