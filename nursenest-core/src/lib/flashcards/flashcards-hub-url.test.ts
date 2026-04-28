import { describe, expect, it } from "vitest";
import {
  buildAppFlashcardsCustomStudyHref,
  buildAppFlashcardsHubHref,
  parseHubMode,
  parseHubSystemsFromSearchParams,
} from "@/lib/flashcards/flashcards-hub-url";

describe("flashcards-hub-url", () => {
  it("builds hub href with pathway, systems, and mode", () => {
    expect(
      buildAppFlashcardsHubHref({
        pathwayId: "ca-rn-nclex-rn",
        systems: ["cardiovascular", "respiratory"],
        mode: "weak",
      }),
    ).toBe("/app/flashcards?pathwayId=ca-rn-nclex-rn&systems=cardiovascular%2Crespiratory&mode=weak");
  });

  it("normalizes hyphenated system ids", () => {
    const sp = new URLSearchParams("systems=renal-urinary%2Cendocrine");
    expect(parseHubSystemsFromSearchParams(sp)).toEqual(["renal_urinary", "endocrine"]);
  });

  it("parses single system param", () => {
    const sp = new URLSearchParams("system=Pharmacology");
    expect(parseHubSystemsFromSearchParams(sp)).toEqual(["pharmacology"]);
  });

  it("parses hub mode", () => {
    expect(parseHubMode(new URLSearchParams("mode=starred"))).toBe("starred");
    expect(parseHubMode(new URLSearchParams(""))).toBe("all");
  });

  it("builds custom study href with categories and weak flag", () => {
    const href = buildAppFlashcardsCustomStudyHref({
      pathwayId: "ca-rn-nclex-rn",
      systems: ["cardiovascular", "renal_urinary"],
      mode: "weak",
      cardLimit: 50,
      shuffle: true,
    });
    expect(href).toContain("pathwayId=ca-rn-nclex-rn");
    expect(href).toContain("categories=cardiovascular%2Crenal_urinary");
    expect(href).toContain("weakOnly=1");
    expect(href).toContain("includeCards=1");
    expect(href).toContain("shuffle=1");
  });

  it("includes starred state ids when mode is starred", () => {
    const href = buildAppFlashcardsCustomStudyHref({
      pathwayId: "ca-rn-nclex-rn",
      mode: "starred",
      starredStateIds: ["a", "b"],
    });
    expect(href).toContain("starredOnly=1");
    expect(href).toContain("stateIds=a%2Cb");
  });
});
