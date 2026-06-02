import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assessBlogSourceYearRecency,
  collectVerifiedSourceRecencyIssues,
  minimumPublicationYearForBlogReferences,
} from "./blog-citation-recency";

test("minimumPublicationYearForBlogReferences uses UTC rolling 7-year window", () => {
  const min = minimumPublicationYearForBlogReferences(new Date("2026-06-15T00:00:00.000Z"));
  assert.equal(min, 2019);
});

test("assessBlogSourceYearRecency allows n.d. and in press", () => {
  const min = 2019;
  assert.equal(assessBlogSourceYearRecency({ title: "X", year: "n.d." }, min).ok, true);
  assert.equal(assessBlogSourceYearRecency({ title: "X", year: "in press" }, min).ok, true);
});

test("assessBlogSourceYearRecency blocks 4-digit years before minYear unless foundational", () => {
  const min = 2019;
  const old = assessBlogSourceYearRecency({ title: "Old guideline", year: "2015", url: "https://example.org/g" }, min);
  assert.equal(old.ok, false);
  const okFoundational = assessBlogSourceYearRecency(
    { title: "Seminal", year: "2015", foundational: true, url: "https://example.org/g" },
    min,
  );
  assert.equal(okFoundational.ok, true);
  const edge = assessBlogSourceYearRecency({ title: "At boundary", year: "2019", url: "https://example.org/g" }, min);
  assert.equal(edge.ok, true);
});

test("collectVerifiedSourceRecencyIssues aggregates messages", () => {
  const min = 2019;
  const issues = collectVerifiedSourceRecencyIssues(
    [
      { title: "A", year: "2022", url: "https://a.org/x" },
      { title: "B", year: "2010", url: "https://b.org/x" },
    ],
    min,
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0]!, /2010/);
});
