import { describe, expect, test } from "vitest";
import {
  pathwaySectionsFromPlainBody,
  plainBodyFromPathwaySectionsJson,
} from "@/lib/lessons/pathway-lesson-plain-body-sections";

describe("pathwaySectionsFromPlainBody", () => {
  test("creates intro section from plain body", () => {
    const sections = pathwaySectionsFromPlainBody("Hello\n\nWorld", "T");
    expect(sections.length).toBeGreaterThanOrEqual(1);
    expect(sections[0]!.kind).toBe("intro");
    expect(sections[0]!.body).toContain("Hello");
  });
});

describe("plainBodyFromPathwaySectionsJson", () => {
  test("joins section bodies", () => {
    const text = plainBodyFromPathwaySectionsJson([
      { id: "1", heading: "A", kind: "intro", body: "one" },
      { id: "2", heading: "B", kind: "core", body: "two" },
    ]);
    expect(text).toBe("one\n\ntwo");
  });
});
