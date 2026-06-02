import assert from "node:assert/strict";
import test from "node:test";
import { shouldBypassPublicHomeStatsDbAtStartup } from "@/lib/marketing/public-home-stats-startup";

test("bypasses public home stats DB reads during production startup window", () => {
  assert.equal(
    shouldBypassPublicHomeStatsDbAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "production",
      ci: "0",
    }),
    true,
  );
});

test("does not bypass public home stats DB reads after startup window", () => {
  assert.equal(
    shouldBypassPublicHomeStatsDbAtStartup({
      uptimeMs: 120_000,
      nodeEnv: "production",
      ci: "0",
    }),
    false,
  );
});

test("does not bypass public home stats DB reads outside production", () => {
  assert.equal(
    shouldBypassPublicHomeStatsDbAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "development",
      ci: "0",
    }),
    false,
  );
});
