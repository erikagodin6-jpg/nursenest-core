import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyPublicDataResponseEntry,
  findMissingCachingHeaderViolations,
  findReloadFullFetchViolations,
  parseCacheControlDirectives,
  type PublicDataResponseEntry,
} from "./public-marketing-data-request-tracker";

function makeEntry(overrides: Partial<PublicDataResponseEntry> = {}): PublicDataResponseEntry {
  return {
    loadIndex: 0,
    method: "GET",
    url: "https://www.nursenest.ca/api/public/home-stats",
    key: "/api/public/home-stats",
    status: 200,
    resourceType: "fetch",
    cacheControl: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    etag: '"home-stats-v1"',
    age: "0",
    lastModified: null,
    classification: "full_fetch",
    ...overrides,
  };
}

describe("parseCacheControlDirectives", () => {
  it("extracts cache directives from a response header", () => {
    const directives = parseCacheControlDirectives(
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    );

    assert.equal(directives.public, true);
    assert.equal(directives["max-age"], "0");
    assert.equal(directives["s-maxage"], "3600");
    assert.equal(directives["stale-while-revalidate"], "86400");
  });
});

describe("classifyPublicDataResponseEntry", () => {
  it("marks a 304 response as revalidated", () => {
    const entry = makeEntry({ status: 304, age: null, classification: "full_fetch" });
    assert.equal(classifyPublicDataResponseEntry(entry), "revalidated");
  });

  it("marks a 200 response with age as a cache hit", () => {
    const entry = makeEntry({ age: "187", classification: "full_fetch" });
    assert.equal(classifyPublicDataResponseEntry(entry), "cache_hit");
  });

  it("keeps a 200 response without cache-hit signals as a full fetch", () => {
    const entry = makeEntry({ age: null, etag: null, lastModified: null, classification: "full_fetch" });
    assert.equal(classifyPublicDataResponseEntry(entry), "full_fetch");
  });
});

describe("findMissingCachingHeaderViolations", () => {
  it("flags responses missing cache-control and validators", () => {
    const violations = findMissingCachingHeaderViolations([
      makeEntry({
        cacheControl: null,
        etag: null,
        lastModified: null,
      }),
    ]);

    assert.equal(violations.length, 1);
    assert.match(violations[0] ?? "", /missing cache-control/i);
    assert.match(violations[0] ?? "", /etag or last-modified/i);
  });
});

describe("findReloadFullFetchViolations", () => {
  it("ignores reload cache hits and only fails repeated full fetches", () => {
    const violations = findReloadFullFetchViolations([
      makeEntry({ loadIndex: 1, age: "22", classification: "cache_hit" }),
      makeEntry({ loadIndex: 2, age: "41", classification: "cache_hit" }),
      makeEntry({ loadIndex: 1, url: "https://www.nursenest.ca/api/public/blog", key: "/api/public/blog" }),
      makeEntry({ loadIndex: 2, url: "https://www.nursenest.ca/api/public/blog", key: "/api/public/blog" }),
    ]);

    assert.equal(violations.length, 1);
    assert.match(violations[0] ?? "", /full fetch/i);
    assert.match(violations[0] ?? "", /\/api\/public\/blog/);
  });
});
