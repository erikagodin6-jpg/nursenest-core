import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAppFlashcardsCustomStudyHref,
  buildAppFlashcardsHubHref,
  parseHubMode,
  parseHubSystemsFromSearchParams,
} from "@/lib/flashcards/flashcards-hub-url";

describe("flashcards-hub-url", () => {
  it("builds hub href with pathway, systems, and mode", () => {
    assert.equal(
      buildAppFlashcardsHubHref({
        pathwayId: "ca-rn-nclex-rn",
        systems: ["cardiovascular", "respiratory"],
        mode: "weak",
      }),
      "/app/flashcards?pathwayId=ca-rn-nclex-rn&systems=cardiovascular%2Crespiratory&mode=weak",
    );
  });

  it("normalizes hyphenated system ids", () => {
    const sp = new URLSearchParams("systems=renal-urinary%2Cendocrine");
    assert.deepEqual(parseHubSystemsFromSearchParams(sp), ["renal_urinary", "endocrine"]);
  });

  it("parses single system param", () => {
    const sp = new URLSearchParams("system=Pharmacology");
    assert.deepEqual(parseHubSystemsFromSearchParams(sp), ["pharmacology"]);
  });

  it("parses hub mode", () => {
    assert.equal(parseHubMode(new URLSearchParams("mode=starred")), "starred");
    assert.equal(parseHubMode(new URLSearchParams("")), "all");
  });

  it("builds custom study href with categories and weak flag", () => {
    const href = buildAppFlashcardsCustomStudyHref({
      pathwayId: "ca-rn-nclex-rn",
      systems: ["cardiovascular", "renal_urinary"],
      mode: "weak",
      cardLimit: 50,
      shuffle: true,
    });
    assert.ok(href.includes("pathwayId=ca-rn-nclex-rn"));
    assert.ok(href.includes("categories=cardiovascular%2Crenal_urinary"));
    assert.ok(href.includes("weakOnly=1"));
    assert.ok(href.includes("includeCards=1"));
    assert.ok(href.includes("shuffle=1"));
  });

  it("includes starred state ids when mode is starred", () => {
    const href = buildAppFlashcardsCustomStudyHref({
      pathwayId: "ca-rn-nclex-rn",
      mode: "starred",
      starredStateIds: ["a", "b"],
    });
    assert.ok(href.includes("starredOnly=1"));
    assert.ok(href.includes("stateIds=a%2Cb"));
  });
});
