import assert from "node:assert/strict";
import test from "node:test";

import { isBlogStaticLongtailRecordPublished } from "@/lib/blog/blog-static-longtail-load";

test("static long-tail records hide when draft is true", () => {
  assert.equal(
    isBlogStaticLongtailRecordPublished({ createdAt: "2026-05-01", draft: true }, new Date("2026-05-10T12:00:00Z")),
    false,
  );
});

test("static long-tail records hide before their scheduled publish date", () => {
  assert.equal(
    isBlogStaticLongtailRecordPublished({ createdAt: "2026-06-01" }, new Date("2026-05-31T11:59:00Z")),
    false,
  );
});

test("static long-tail records publish on or after their scheduled publish date", () => {
  assert.equal(
    isBlogStaticLongtailRecordPublished({ createdAt: "2026-06-01" }, new Date("2026-06-01T12:00:00Z")),
    true,
  );
  assert.equal(
    isBlogStaticLongtailRecordPublished({ createdAt: "2026-06-01" }, new Date("2026-06-02T00:00:00Z")),
    true,
  );
});

test("static long-tail records without valid date remain visible unless drafted", () => {
  assert.equal(isBlogStaticLongtailRecordPublished({ createdAt: "" }, new Date("2026-06-01T12:00:00Z")), true);
  assert.equal(isBlogStaticLongtailRecordPublished({ createdAt: "not-a-date" }, new Date("2026-06-01T12:00:00Z")), true);
});
