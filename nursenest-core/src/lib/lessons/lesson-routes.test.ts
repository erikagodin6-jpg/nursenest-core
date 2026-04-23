import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildLessonPath,
  marketingLessonSlugFromRouteParam,
  marketingPathwayLessonDetailPath,
} from "@/lib/lessons/lesson-routes";

describe("buildLessonPath", () => {
  it("builds /{country}/{role}/{exam}/lessons/{slug} with URL-safe slug encoding", () => {
    assert.equal(
      buildLessonPath({
        locale: "us",
        roleTrack: "rn",
        examCode: "nclex-rn",
        lessonSlug: "fluid-balance",
      }),
      "/us/rn/nclex-rn/lessons/fluid-balance",
    );
    assert.equal(
      buildLessonPath({
        locale: "us",
        roleTrack: "rn",
        examCode: "nclex-rn",
        lessonSlug: "a/b",
      }),
      "/us/rn/nclex-rn/lessons/a%2Fb",
    );
  });

  it("maps LPN/RPN role tracks to pn in the URL (marketing hub segment)", () => {
    assert.equal(
      buildLessonPath({
        locale: "us",
        roleTrack: "lpn",
        examCode: "nclex-pn",
        lessonSlug: "vitals",
      }),
      "/us/pn/nclex-pn/lessons/vitals",
    );
    assert.equal(
      buildLessonPath({
        locale: "canada",
        roleTrack: "rpn",
        examCode: "nclex-rpn",
        lessonSlug: "vitals",
      }),
      "/canada/pn/nclex-rpn/lessons/vitals",
    );
  });

  it("returns null for empty slug", () => {
    assert.equal(buildLessonPath({ locale: "us", roleTrack: "rn", examCode: "nclex-rn", lessonSlug: "   " }), null);
    assert.equal(buildLessonPath({ locale: "us", roleTrack: "rn", examCode: "nclex-rn", lessonSlug: null }), null);
  });

  it("matches marketingPathwayLessonDetailPath for a pathway shape", () => {
    const pathway = { countrySlug: "us", roleTrack: "rn", examCode: "nclex-rn" };
    assert.equal(
      marketingPathwayLessonDetailPath(pathway, "sepsis"),
      buildLessonPath({
        locale: pathway.countrySlug,
        roleTrack: pathway.roleTrack,
        examCode: pathway.examCode,
        lessonSlug: "sepsis",
      }),
    );
  });

  it("buildLessonPath accepts a pathway object (single canonical builder entry point)", () => {
    const pathway = { countrySlug: "canada", roleTrack: "rn", examCode: "nclex-rn" };
    assert.equal(buildLessonPath({ pathway, lessonSlug: "fluid-balance" }), "/canada/rn/nclex-rn/lessons/fluid-balance");
  });
});

describe("marketingLessonSlugFromRouteParam", () => {
  it("decodes a once-encoded slug segment", () => {
    assert.equal(marketingLessonSlugFromRouteParam("fluid%20overload"), "fluid overload");
  });
});
