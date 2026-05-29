import assert from "node:assert/strict";
import test from "node:test";
import { isSyntheticLearningIngestAuthorized, parseSyntheticLearningPayload } from "@/lib/observability/synthetic-learning-monitoring";

test("parseSyntheticLearningPayload accepts valid synthetic check rows", () => {
  const parsed = parseSyntheticLearningPayload({
    runId: "run-1",
    checks: [
      {
        checkName: "flashcards_launch",
        route: "/app/flashcards",
        status: "pass",
        durationMs: 842.4,
        httpStatus: 200,
        screenshotDataUrl: "data:image/jpeg;base64,abc",
        checkedAt: "2026-05-29T03:00:00.000Z",
        meta: { finalUrl: "/app/flashcards" },
      },
    ],
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.checks.length, 1);
  assert.equal(parsed.checks[0]?.runId, "run-1");
  assert.equal(parsed.checks[0]?.durationMs, 842);
  assert.equal(parsed.checks[0]?.screenshotDataUrl, "data:image/jpeg;base64,abc");
});

test("parseSyntheticLearningPayload rejects empty or invalid payloads", () => {
  assert.deepEqual(parseSyntheticLearningPayload(null), { ok: false, error: "invalid_body" });
  assert.deepEqual(parseSyntheticLearningPayload({ checks: [] }), { ok: false, error: "no_valid_checks" });
  assert.deepEqual(
    parseSyntheticLearningPayload({ checks: [{ checkName: "cat_launch", route: "/app/practice-tests", status: "unknown", durationMs: 1 }] }),
    { ok: false, error: "no_valid_checks" },
  );
});

test("parseSyntheticLearningPayload strips non-image screenshots", () => {
  const parsed = parseSyntheticLearningPayload({
    checks: [
      {
        checkName: "cat_launch",
        route: "/app/practice-tests",
        status: "fail",
        durationMs: 1200,
        screenshotDataUrl: "https://example.com/not-inline.png",
      },
    ],
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.checks[0]?.screenshotDataUrl, null);
});

test("isSyntheticLearningIngestAuthorized requires the configured bearer token", () => {
  const previousSecret = process.env.SYNTHETIC_MONITOR_SECRET;
  const previousCronSecret = process.env.CRON_SECRET;
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.SYNTHETIC_MONITOR_SECRET = "monitor-secret";
  delete process.env.CRON_SECRET;
  process.env.NODE_ENV = "production";

  try {
    assert.equal(
      isSyntheticLearningIngestAuthorized(new Request("https://example.com", { headers: { authorization: "Bearer monitor-secret" } })),
      true,
    );
    assert.equal(
      isSyntheticLearningIngestAuthorized(new Request("https://example.com", { headers: { authorization: "Bearer wrong" } })),
      false,
    );
  } finally {
    if (previousSecret === undefined) delete process.env.SYNTHETIC_MONITOR_SECRET;
    else process.env.SYNTHETIC_MONITOR_SECRET = previousSecret;
    if (previousCronSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousCronSecret;
    process.env.NODE_ENV = previousNodeEnv;
  }
});
