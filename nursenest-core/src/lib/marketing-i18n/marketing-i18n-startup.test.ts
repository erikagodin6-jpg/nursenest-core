import assert from "node:assert/strict";
import test from "node:test";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";

test("bypasses marketing i18n loads during production startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "production",
      ci: "0",
    }),
    true,
  );
});

test("does not bypass marketing i18n loads after startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 30_000,
      nodeEnv: "production",
      ci: "0",
    }),
    false,
  );
});

test("does not bypass marketing i18n loads outside production", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "development",
      ci: "0",
    }),
    false,
  );
});
