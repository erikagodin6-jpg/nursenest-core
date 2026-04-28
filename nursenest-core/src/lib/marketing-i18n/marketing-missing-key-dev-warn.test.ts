import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import {
  resetMarketingMissingKeyDevWarningsForTests,
  warnMissingMarketingMessageKeyDev,
} from "./marketing-missing-key-dev-warn";

describe("marketing-missing-key-dev-warn", () => {
  const originalEnv = process.env.NODE_ENV;
  const warnings: unknown[] = [];
  let origWarn: typeof console.warn;

  beforeEach(() => {
    resetMarketingMissingKeyDevWarningsForTests();
    warnings.length = 0;
    origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args);
    };
  });

  afterEach(() => {
    console.warn = origWarn;
    Object.assign(process.env, { NODE_ENV: originalEnv });
    resetMarketingMissingKeyDevWarningsForTests();
  });

  it("does not log in production", () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    warnMissingMarketingMessageKeyDev("pages.x.missing", "Humanized", { hasCatalog: true });
    assert.equal(warnings.length, 0);
  });

  it("logs in development when catalog exists", () => {
    Object.assign(process.env, { NODE_ENV: "development" });
    warnMissingMarketingMessageKeyDev("pages.x.missing", "Humanized", { hasCatalog: true });
    assert.equal(warnings.length, 1);
    const first = warnings[0] as unknown[];
    assert.equal(first[0], "[i18n] Missing marketing message key");
    assert.deepEqual(first[1], { key: "pages.x.missing", fallback: "Humanized" });
  });

  it("does not log when catalog is empty (degraded / no bundle)", () => {
    Object.assign(process.env, { NODE_ENV: "development" });
    warnMissingMarketingMessageKeyDev("pages.x.missing", "Humanized", { hasCatalog: false });
    assert.equal(warnings.length, 0);
  });

  it("dedupes repeated keys to a single dev warning", () => {
    Object.assign(process.env, { NODE_ENV: "development" });
    warnMissingMarketingMessageKeyDev("pages.x.same", "A", { hasCatalog: true });
    warnMissingMarketingMessageKeyDev("pages.x.same", "A", { hasCatalog: true });
    warnMissingMarketingMessageKeyDev("pages.x.same", "A", { hasCatalog: true });
    assert.equal(warnings.length, 1);
  });
});
