import { CountryCode } from "@prisma/client";
import test from "node:test";
import assert from "node:assert/strict";
import { effectiveDefaultPublicGlobalRegion } from "./marketing-header-global-region";

test("no cookie: defaults to marketing CA → canada", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/pricing",
      globalRegionCookie: null,
      marketingExamRegion: "CA",
      sessionCountryCode: undefined,
    }),
    "canada",
  );
});

test("no cookie: defaults to marketing US → us", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/pricing",
      globalRegionCookie: null,
      marketingExamRegion: "US",
      sessionCountryCode: undefined,
    }),
    "us",
  );
});

test("no cookie: session US/CA wins over marketing toggle", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/pricing",
      globalRegionCookie: null,
      marketingExamRegion: "US",
      sessionCountryCode: CountryCode.CA,
    }),
    "canada",
  );
});

test("stale expansion cookie on neutral path does not default to philippines", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/pricing",
      globalRegionCookie: "philippines",
      marketingExamRegion: "US",
      sessionCountryCode: CountryCode.US,
    }),
    "us",
  );
});

test("US route wins over stale philippines cookie", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/us/rn/nclex-rn",
      globalRegionCookie: "philippines",
      marketingExamRegion: "CA",
      sessionCountryCode: undefined,
    }),
    "us",
  );
});

test("Canada route wins over stale philippines cookie", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/canada/rn/rex-rn",
      globalRegionCookie: "philippines",
      marketingExamRegion: "US",
      sessionCountryCode: undefined,
    }),
    "canada",
  );
});

test("expansion exams path resolves to that region", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/exams/philippines",
      globalRegionCookie: null,
      marketingExamRegion: "US",
      sessionCountryCode: undefined,
    }),
    "philippines",
  );
});

test("allied-health marketing path prefers Canada", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/allied-health",
      globalRegionCookie: null,
      marketingExamRegion: "US",
      sessionCountryCode: undefined,
    }),
    "canada",
  );
});

test("nn_global_region us is honored on neutral path", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/blog",
      globalRegionCookie: "us",
      marketingExamRegion: "CA",
      sessionCountryCode: undefined,
    }),
    "us",
  );
});

test("invalid or empty cookie is ignored — session US wins over marketing CA", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/faq",
      globalRegionCookie: null,
      marketingExamRegion: "CA",
      sessionCountryCode: CountryCode.US,
    }),
    "us",
  );
});

test("invalid or empty cookie is ignored — marketing CA when no session", () => {
  assert.equal(
    effectiveDefaultPublicGlobalRegion({
      strippedPathname: "/",
      globalRegionCookie: null,
      marketingExamRegion: "CA",
      sessionCountryCode: undefined,
    }),
    "canada",
  );
});
