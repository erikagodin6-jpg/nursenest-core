import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLearnerPrivateReadCacheKeyParts,
  learnerPrivateReadAccessScopeKey,
  learnerPrivateReadSurfaceTag,
  learnerPrivateReadUserTag,
  shouldBypassLearnerPrivateReadCache,
} from "./learner-private-read-cache-keying";

test("learner private read cache keys include stable serialized params", () => {
  const keyParts = buildLearnerPrivateReadCacheKeyParts("report-card", "user_123", [
    { reason: "active_subscription", tier: "RN", country: "CA", alliedCareer: null },
    { degraded: false, peerBenchmarkSkipped: true },
    ["b", "a"],
  ]);

  assert.equal(keyParts[0], "learner-private-read");
  assert.equal(keyParts[1], "report-card");
  assert.equal(keyParts[2], "user_123");
  assert.equal(
    keyParts[3],
    '{"alliedCareer":null,"country":"CA","reason":"active_subscription","tier":"RN"}',
  );
  assert.equal(
    keyParts[4],
    '{"degraded":false,"peerBenchmarkSkipped":true}',
  );
  assert.equal(keyParts[5], '["b","a"]');
});

test("learner private read access scope key stays narrow", () => {
  assert.equal(
    learnerPrivateReadAccessScopeKey({
      hasAccess: true,
      reason: "active_subscription",
      tier: "RN",
      country: "CA",
      alliedCareer: null,
    }),
    '{"alliedCareer":null,"country":"CA","hasAccess":true,"reason":"active_subscription","tier":"RN"}',
  );
});

test("learner private read tags are user and surface scoped", () => {
  assert.equal(learnerPrivateReadUserTag("user_123"), "learner-private:user_123");
  assert.equal(
    learnerPrivateReadSurfaceTag("user_123", "progress-page"),
    "learner-private:user_123:progress-page",
  );
});

test("learner private read cache bypasses in debug and test contexts", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDisable = process.env.NN_DISABLE_PRIVATE_READ_CACHE;
  const originalAdminDebug = process.env.ADMIN_ACCESS_DEBUG;
  const originalSessionDebug = process.env.DEBUG_SESSION_ROUTE_ENABLED;
  const originalSentryDebug = process.env.SENTRY_DEBUG_ROUTE;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.NN_DISABLE_PRIVATE_READ_CACHE;
    delete process.env.ADMIN_ACCESS_DEBUG;
    delete process.env.DEBUG_SESSION_ROUTE_ENABLED;
    delete process.env.SENTRY_DEBUG_ROUTE;
    assert.equal(shouldBypassLearnerPrivateReadCache(), false);

    process.env.NN_DISABLE_PRIVATE_READ_CACHE = "1";
    assert.equal(shouldBypassLearnerPrivateReadCache(), true);

    delete process.env.NN_DISABLE_PRIVATE_READ_CACHE;
    process.env.ADMIN_ACCESS_DEBUG = "true";
    assert.equal(shouldBypassLearnerPrivateReadCache(), true);

    delete process.env.ADMIN_ACCESS_DEBUG;
    process.env.DEBUG_SESSION_ROUTE_ENABLED = "1";
    assert.equal(shouldBypassLearnerPrivateReadCache(), true);

    delete process.env.DEBUG_SESSION_ROUTE_ENABLED;
    process.env.SENTRY_DEBUG_ROUTE = "1";
    assert.equal(shouldBypassLearnerPrivateReadCache(), true);

    delete process.env.SENTRY_DEBUG_ROUTE;
    process.env.NODE_ENV = "test";
    assert.equal(shouldBypassLearnerPrivateReadCache(), true);
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.NN_DISABLE_PRIVATE_READ_CACHE = originalDisable;
    process.env.ADMIN_ACCESS_DEBUG = originalAdminDebug;
    process.env.DEBUG_SESSION_ROUTE_ENABLED = originalSessionDebug;
    process.env.SENTRY_DEBUG_ROUTE = originalSentryDebug;
  }
});
