import assert from "node:assert/strict";
import test from "node:test";
import { hubActionCtaLabel, HUB_ACTION_CTA } from "./hub-action-cta";

test("hub action CTA vocabulary stays short and consistent", () => {
  assert.equal(hubActionCtaLabel("start"), "Start");
  assert.equal(hubActionCtaLabel("resume"), "Resume");
  assert.equal(hubActionCtaLabel("review"), "Review");
  assert.equal(hubActionCtaLabel("continue"), "Continue");
  assert.equal(hubActionCtaLabel("practice"), "Practice");
  assert.deepEqual(Object.values(HUB_ACTION_CTA).every((label) => label.split(/\s+/).length <= 1), true);
});
