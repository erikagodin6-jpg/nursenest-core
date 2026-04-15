import test from "node:test";
import assert from "node:assert/strict";
import { effectiveMarketingHeaderGlobalRegion } from "./marketing-header-global-region";

test("no cookie: defaults to marketing CA → canada", () => {
  assert.equal(
    effectiveMarketingHeaderGlobalRegion({
      globalRegionCookie: null,
      marketingExamRegion: "CA",
      sessionCountryUsCa: undefined,
    }),
    "canada",
  );
});

test("no cookie: defaults to marketing US → us", () => {
  assert.equal(
    effectiveMarketingHeaderGlobalRegion({
      globalRegionCookie: null,
      marketingExamRegion: "US",
      sessionCountryUsCa: undefined,
    }),
    "us",
  );
});

test("no cookie: session US/CA wins over marketing toggle", () => {
  assert.equal(
    effectiveMarketingHeaderGlobalRegion({
      globalRegionCookie: null,
      marketingExamRegion: "US",
      sessionCountryUsCa: "CA",
    }),
    "canada",
  );
});

test("cookie set to philippines is honored (explicit dropdown choice)", () => {
  assert.equal(
    effectiveMarketingHeaderGlobalRegion({
      globalRegionCookie: "philippines",
      marketingExamRegion: "US",
      sessionCountryUsCa: "US",
    }),
    "philippines",
  );
});
