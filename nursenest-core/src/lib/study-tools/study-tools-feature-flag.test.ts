import test from "node:test";
import assert from "node:assert/strict";
import { isStudyToolsPubliclyEnabled } from "./study-tools-feature-flag";

test("isStudyToolsPubliclyEnabled: only true when env is exactly the string true", (t) => {
  t.afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS;
  });

  delete process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS;
  assert.equal(isStudyToolsPubliclyEnabled(), false);

  process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS = "false";
  assert.equal(isStudyToolsPubliclyEnabled(), false);

  process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS = "1";
  assert.equal(isStudyToolsPubliclyEnabled(), false);

  process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS = "true";
  assert.equal(isStudyToolsPubliclyEnabled(), true);
});
