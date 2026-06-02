import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CatResultsCoachSection } from "@/components/student/cat-results-coach-section";

describe("CatResultsCoachSection", () => {
  it("renders a resilient fallback for historical CAT results with no persisted coach", () => {
    const html = renderToStaticMarkup(
      <CatResultsCoachSection coach={null} catExamFeedbackMode="test" pathwayId={null} />,
    );

    assert.match(html, /Detailed CAT coaching was not stored for this session/i);
    assert.match(html, /CAT summary unavailable/i);
    assert.match(html, /Your results are still saved/i);
  });
});
