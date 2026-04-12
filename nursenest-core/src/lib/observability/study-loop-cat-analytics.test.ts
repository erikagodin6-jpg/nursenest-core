import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildStudyLoopCatClickProps } from "@/lib/observability/study-loop-cat-analytics";

describe("study-loop-cat-analytics", () => {
  it("classifies pathway-scoped app starts", () => {
    const props = buildStudyLoopCatClickProps({
      href: "/app/practice-tests/start?pathwayId=us-rn-nclex-rn",
      sourceSurface: "study_quick_links",
    });

    assert.equal(props.cat_entry_type, "pathway_scoped_start");
    assert.equal(props.cat_entry_surface, "app");
    assert.equal(props.pathway_id, "us-rn-nclex-rn");
  });

  it("classifies weak-focus app CAT links", () => {
    const props = buildStudyLoopCatClickProps({
      href: "/app/practice-tests?cat=1&focus=weak&pathwayId=ca-rpn-rex-pn",
      sourceSurface: "practice_test_results_retest_weak",
    });

    assert.equal(props.cat_entry_type, "weak_focus");
    assert.equal(props.cat_entry_surface, "app");
    assert.equal(props.pathway_id, "ca-rpn-rex-pn");
  });

  it("classifies public pathway CAT entries", () => {
    const props = buildStudyLoopCatClickProps({
      href: "/ca/rpn/rex-pn/cat",
      sourceSurface: "lesson_study_loop_primary",
      pathwayId: "ca-rpn-rex-pn",
    });

    assert.equal(props.cat_entry_type, "other");
    assert.equal(props.cat_entry_surface, "public");
    assert.equal(props.pathway_id, "ca-rpn-rex-pn");
  });
});
