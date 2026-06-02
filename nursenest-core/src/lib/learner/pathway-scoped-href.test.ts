import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withPathwayScopeHref } from "@/lib/learner/pathway-scoped-href";

describe("withPathwayScopeHref", () => {
  it("adds pathwayId to learner study routes", () => {
    assert.equal(
      withPathwayScopeHref("/app/questions?preset=topic_drill&topic=Cardiac", "us-rn-nclex-rn"),
      "/app/questions?preset=topic_drill&topic=Cardiac&pathwayId=us-rn-nclex-rn",
    );
    assert.equal(
      withPathwayScopeHref("/app/lessons", "us-rn-nclex-rn"),
      "/app/lessons?pathwayId=us-rn-nclex-rn",
    );
  });

  it("keeps existing pathwayId and non-scopable hrefs unchanged", () => {
    assert.equal(
      withPathwayScopeHref("/app/questions?pathwayId=ca-rpn-rex-pn", "us-rn-nclex-rn"),
      "/app/questions?pathwayId=ca-rpn-rex-pn",
    );
    assert.equal(withPathwayScopeHref("/app/account/overview", "us-rn-nclex-rn"), "/app/account/overview");
    assert.equal(withPathwayScopeHref("https://example.com/questions", "us-rn-nclex-rn"), "https://example.com/questions");
  });
});
